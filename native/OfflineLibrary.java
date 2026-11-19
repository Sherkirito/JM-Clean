package org.jmclean.backup;

import android.app.DownloadManager;
import android.content.*;
import android.database.Cursor;
import android.net.Uri;
import android.os.*;
import android.provider.DocumentsContract;
import android.webkit.CookieManager;
import org.json.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.*;

/** Private, same-UID bridge. Public Downloads contains only the original ZIPs. */
final class OfflineLibrary {
    static final String FOLDER="JM洁净版";
    private final Context ctx;
    private final SharedPreferences catalog;
    private final DownloadManager downloads;
    private final File sessions,covers;
    private final Map<String,Session> readers=new ConcurrentHashMap<>();
    private final ExecutorService workers=Executors.newFixedThreadPool(3);
    private static OfflineLibrary instance;
    static synchronized OfflineLibrary get(Context c){if(instance==null)instance=new OfflineLibrary(c.getApplicationContext());return instance;}
    private OfflineLibrary(Context c){
        ctx=c;catalog=c.getSharedPreferences("jm-local-downloads",0);downloads=(DownloadManager)c.getSystemService(Context.DOWNLOAD_SERVICE);
        sessions=new File(c.getCacheDir(),"jm-zip-readers");covers=new File(c.getFilesDir(),"jm-zip-covers");
        File[] old=sessions.listFiles();if(old!=null)for(File dir:old)if(dir.getName().matches("[0-9a-f-]{36}"))clearDir(dir);
        File[] partial=covers.listFiles();if(partial!=null)for(File f:partial)if(f.getName().matches("(cover-|thumb-).*\\.tmp"))f.delete();
    }
    private static void clearDir(File dir){File[] files=dir.listFiles();if(files!=null)for(File f:files)if(f.isFile())f.delete();dir.delete();}
    static boolean web(String s){Uri u=Uri.parse(s);return ("https".equals(u.getScheme())||"http".equals(u.getScheme()))&&u.getHost()!=null&&u.getUserInfo()==null;}
    private static String id(String s)throws IOException{if(!s.matches("[0-9]{1,22}"))throw new IOException("无效的章节编号");return s;}
    private JSONObject row(String key)throws Exception{return new JSONObject(catalog.getString(id(key),"{}"));}
    private void save(JSONObject r)throws Exception{if(!catalog.edit().putString(id(r.getString("id")),r.toString()).commit())throw new IOException("下载记录写入失败");}
    private static String clean(String s,int max){s=s.trim();return s.substring(0,Math.min(max,s.length()));}
    private static String safeName(String s){return clean(s.replaceAll("[\\\\/:*?\"<>|\\p{Cntrl}]","_"),42);}
    private File payload(String token)throws IOException{
        if(!token.matches("[a-z0-9]{8,48}"))throw new IOException("无效请求");
        return new File(new File(ctx.getCacheDir(),"jm-download-requests"),token+".json");
    }
    private JSONObject readPayload(String token)throws Exception{
        File f=payload(token);try{
            if(f.length()<=0||f.length()>65536)throw new IOException("无效请求");
            byte[] b=new byte[(int)f.length()];try(DataInputStream in=new DataInputStream(new FileInputStream(f))){in.readFully(b);}
            return new JSONObject(new String(b,StandardCharsets.UTF_8));
        }finally{f.delete();}
    }
    ParcelFileDescriptor call(List<String> p)throws FileNotFoundException {
        try{
            ParcelFileDescriptor[] pipe=ParcelFileDescriptor.createPipe();
            workers.execute(()->{
                try(OutputStream out=new ParcelFileDescriptor.AutoCloseOutputStream(pipe[1])){
                    JSONObject result=new JSONObject();
                    try{result.put("value",command(p));}catch(Exception ex){result.put("error",ex instanceof IOException && ex.getMessage()!=null && ex.getMessage().matches(".*[\\u3400-\\u9fff].*")?ex.getMessage():"操作失败，请检查 ZIP 是否仍在下载目录");}
                    out.write(result.toString().getBytes(StandardCharsets.UTF_8));
                }catch(Exception ignored){}
            });return pipe[0];
        }catch(IOException ex){throw new FileNotFoundException();}
    }
    private Object command(List<String> p)throws Exception{
        switch(p.get(1)){
            case "list":return list();
            case "connected":{
                android.net.ConnectivityManager network=(android.net.ConnectivityManager)ctx.getSystemService(Context.CONNECTIVITY_SERVICE);
                android.net.NetworkInfo info=network.getActiveNetworkInfo();
                return info!=null && info.isConnected();
            }
            case "album":return new JSONObject(ctx.getSharedPreferences("jm-local-albums",0).getString(id(p.get(2)),"{}"));
            case "remember":{remember(readPayload(p.get(2)));return true;}
            case "begin":return begin(readPayload(p.get(2)));
            case "open":return open(readPayload(p.get(2)));
            case "folder":folder();return true;
            case "close":{Session s=readers.remove(p.get(2));if(s!=null)s.close();return true;}
            case "page":case "drop":{
                Session s=readers.get(p.get(2));if(s==null)throw new IOException("阅读会话已结束");
                return s.page(Long.parseLong(p.get(3)),Integer.parseInt(p.get(4)),Long.parseLong(p.get(5)),"drop".equals(p.get(1)));
            }
            default:throw new IOException("未知操作");
        }
    }
    private void remember(JSONObject album)throws Exception{
        ctx.getSharedPreferences("jm-local-albums",0).edit().putString(id(album.getString("id")),album.toString()).apply();
    }
    synchronized Object begin(JSONObject data)throws Exception{
        String key=id(data.getString("id")),book=id(data.getString("book")),url=data.getString("url");
        if(!web(url))throw new IOException("下载链接无效");
        JSONObject album=data.optJSONObject("album");
        if(album!=null && book.equals(album.optString("id"))){
            remember(album);
        }
        JSONObject previous=row(key);
        if(previous.has("id")){
            checked.remove(previous.optLong("task",-1));
            refresh(Collections.singletonList(previous));
            if(Arrays.asList("queued","running","paused","ready","locked").contains(previous.optString("state")))return previous;
        }
        String token=UUID.randomUUID().toString();
        JSONObject r=new JSONObject().put("id",key).put("book",book).put("title",clean(data.optString("title",book),250))
            .put("name",clean(data.optString("name",key),200)).put("tags",clean(data.optString("tags"),2000))
            .put("author",clean(data.optString("author"),500)).put("episode",data.optInt("episode",1)).put("stamp",System.currentTimeMillis())
            .put("state","verify").put("attempt",token);
        save(r);
        Intent gate=new Intent(ctx,OfflineVerification.class).putExtra("id",key).putExtra("attempt",token).putExtra("url",url).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        ctx.startActivity(gate);return r;
    }
    synchronized void enqueue(String key,String attempt,String url,String agent,String ref)throws Exception{
        JSONObject r=row(key);if(!attempt.equals(r.optString("attempt"))||!"verify".equals(r.optString("state")))return;
        if(!web(url))throw new IOException("网页没有提供可下载的 ZIP 链接");
        String file=safeName(r.getString("title"))+"-第"+r.optInt("episode",1)+"话-"+key+"-"+attempt.substring(0,8)+".zip";
        DownloadManager.Request req=new DownloadManager.Request(Uri.parse(url)).setTitle(r.getString("title"))
            .setDescription(r.optString("name")).setMimeType("application/zip").setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            .setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS,FOLDER+"/"+file);
        if(agent!=null)req.addRequestHeader("User-Agent",agent);
        if(ref!=null && web(ref))req.addRequestHeader("Referer",ref);
        String cookies=CookieManager.getInstance().getCookie(url);
        if(cookies!=null && !cookies.isEmpty())req.addRequestHeader("Cookie",cookies);
        r.put("file",file);save(r);
        long task=downloads.enqueue(req);
        try{r.put("task",task).put("state","queued");save(r);}catch(Exception ex){downloads.remove(task);throw ex;}
    }
    synchronized void endGate(String key,String attempt,String reason){
        try{JSONObject r=row(key);if(attempt.equals(r.optString("attempt"))&&"verify".equals(r.optString("state"))){r.put("state","failed").put("error",reason);save(r);}}catch(Exception ignored){}
    }
    private final Map<Long,Long> checked=new HashMap<>();
    private void refresh(List<JSONObject> rows)throws Exception{
        Map<Long,JSONObject> tasks=new HashMap<>();
        for(JSONObject r:rows)if(r.has("task"))tasks.put(r.getLong("task"),r);
        List<Long> ids=new ArrayList<>(tasks.keySet());
        for(int start=0;start<ids.size();start+=250){
            long[] group=new long[Math.min(250,ids.size()-start)];
            for(int i=0;i<group.length;i++)group[i]=ids.get(start+i);
            try(Cursor c=downloads.query(new DownloadManager.Query().setFilterById(group))){
                if(c==null)continue;
                int key=c.getColumnIndexOrThrow(DownloadManager.COLUMN_ID);
                while(c.moveToNext()){
                    JSONObject r=tasks.remove(c.getLong(key));if(r!=null)refreshRow(r,c);
                }
                for(long id:group){JSONObject r=tasks.remove(id);if(r!=null)refreshRow(r,null);}
            }
        }
    }
    private void refreshRow(JSONObject r,Cursor cur)throws Exception{
        long task=r.optLong("task",-1);if(task<0)return;
        String before=r.optString("state"),state;long done=0,total=-1;
            if(cur==null)state="missing";
            else{
                done=cur.getLong(cur.getColumnIndexOrThrow(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR));total=cur.getLong(cur.getColumnIndexOrThrow(DownloadManager.COLUMN_TOTAL_SIZE_BYTES));
                switch(cur.getInt(cur.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS))){
                    case DownloadManager.STATUS_SUCCESSFUL:
                        long now=SystemClock.elapsedRealtime();Long last=checked.get(task);
                        if(last!=null && now-last<15000 && ("ready".equals(before)||"locked".equals(before)||"invalid".equals(before))){state=before;break;}
                        try(ParcelFileDescriptor fd=downloads.openDownloadedFile(task)){
                            if(fd==null)throw new FileNotFoundException();
                            state=before;
                            if(!Arrays.asList("ready","locked","invalid").contains(before)){
                                try(OfflineZip zip=new OfflineZip(ParcelFileDescriptor.dup(fd.getFileDescriptor()),"")){
                                    r.put("pages",zip.pages.size());state=zip.encrypted?"locked":"ready";
                                    if(!zip.encrypted)try{zip.cover(covers,r.getString("id"));}catch(Exception ignored){}
                                }catch(Exception ex){state="invalid";r.put("error","图包损坏或格式不支持，原文件仍保存在下载目录");}
                            }
                            checked.put(task,now);
                        }catch(FileNotFoundException|SecurityException ex){state="missing";}break;
                    case DownloadManager.STATUS_RUNNING:state="running";break;
                    case DownloadManager.STATUS_PENDING:state="queued";break;
                    case DownloadManager.STATUS_PAUSED:state="paused";break;
                    default:state="failed";r.put("error","下载失败，请检查网络和剩余空间后重试");
                }
            }
        if("missing".equals(state))checked.remove(task);
        r.put("state",state);
        if(!before.equals(state))save(r);
        r.put("done",done).put("total",total);
        File cover=new File(covers,r.getString("id")+".jpg");if(cover.isFile())r.put("cover",Uri.fromFile(cover).toString());
    }
    synchronized JSONArray list()throws Exception{
        List<JSONObject> items=new ArrayList<>();
        for(String key:catalog.getAll().keySet())items.add(row(key));
        refresh(items);return new JSONArray(items);
    }
    private Object open(JSONObject args)throws Exception{
        String key=id(args.getString("id"));JSONObject r;
        synchronized(this){r=row(key);}
        long task=r.optLong("task",-1);if(task<0)throw new IOException("请先下载这一话");
        ParcelFileDescriptor fd;
        try{fd=downloads.openDownloadedFile(task);if(fd==null)throw new FileNotFoundException();}
        catch(FileNotFoundException|SecurityException ex){
            synchronized(this){JSONObject current=row(key);if(current.optLong("task",-1)==task){current.put("state","missing");save(current);checked.remove(task);}}
            throw new IOException("ZIP 已移动或删除，请重新下载");
        }
        OfflineZip zip=new OfflineZip(fd,args.optString("password"));
        String token=UUID.randomUUID().toString();File dir=new File(sessions,token);
        try{
            if(!dir.mkdirs())throw new IOException("临时阅读空间不可用");
            if(zip.encrypted){
                if(args.optString("password").isEmpty())throw new IOException("此 ZIP 需要密码");
                File check=new File(dir,"check.tmp");try{zip.copy(0,check);}catch(Exception ex){throw new IOException("ZIP 密码错误或图包损坏");}finally{check.delete();}
            }
            File html=new File(dir,"index.html");
            try(Writer w=new OutputStreamWriter(new FileOutputStream(html),StandardCharsets.UTF_8)){
                w.write("<!doctype html><html><head><meta name=viewport content='width=device-width, initial-scale=1'><meta http-equiv='Content-Security-Policy' content=\"default-src 'none'; img-src file:; style-src 'unsafe-inline'\"><style>body{margin:0;background:"+ (args.optBoolean("dark")?"#191919":"#fff")+"}section{text-align:center}img{max-width:100%;height:auto;vertical-align:middle}.jm2-track section{display:flex;align-items:center;justify-content:center}</style></head><body><main id=photo-container>");
                for(int i=0;i<zip.pages.size();i++)w.write("<section class=scramble-page id=page_"+i+"><img id=album_photo_"+i+" data-original='p"+i+".jpg'></section>");
                w.write("</main></body></html>");
            }
            readers.put(token,new Session(zip,dir));
            return new JSONObject().put("token",token).put("uri",Uri.fromFile(html).toString()).put("pages",zip.pages.size());
        }catch(Exception ex){zip.close();clearDir(dir);throw ex;}
    }
    private static final class Session{
        final OfflineZip zip;final File dir;final long[] versions;boolean closed;long generation;
        Session(OfflineZip z,File d){zip=z;dir=d;versions=new long[z.pages.size()];}
        synchronized boolean page(long view,int n,long version,boolean drop)throws Exception{
            if(closed || view<generation || view<1 || n<0 || n>=versions.length || version<1)return false;
            if(view>generation){
                if(generation!=0)for(int i=0;i<versions.length;i++)if(versions[i]>0)new File(dir,"p"+i+".jpg").delete();
                Arrays.fill(versions,0);generation=view;
            }
            long seq=version*2+(drop?1:0);if(seq<versions[n])return false;versions[n]=seq;
            File file=new File(dir,"p"+n+".jpg");
            if(drop){file.delete();return true;}
            if(file.exists())return true;
            File tmp=new File(dir,"page.tmp");
            try{zip.copy(n,tmp);if(!tmp.renameTo(file))throw new IOException("临时空间不足");return true;}finally{tmp.delete();}
        }
        synchronized void close()throws IOException{closed=true;try{zip.close();}finally{clearDir(dir);}}
    }
    private void folder()throws IOException{
        Uri uri=DocumentsContract.buildDocumentUri("com.android.externalstorage.documents","primary:Download/"+FOLDER);
        Intent view=new Intent(Intent.ACTION_VIEW).setDataAndType(uri,DocumentsContract.Document.MIME_TYPE_DIR);
        // Do not delegate private URI permissions; each file manager uses its own storage access.
        if(view.resolveActivity(ctx.getPackageManager())==null){
            view=new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
            if(Build.VERSION.SDK_INT>=26)view.putExtra(DocumentsContract.EXTRA_INITIAL_URI,uri);
        }
        try{ctx.startActivity(Intent.createChooser(view,"选择文件管理器").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));}
        catch(ActivityNotFoundException e){throw new IOException("没有可打开下载目录的文件管理器");}
    }
}
