package org.jmclean.backup;

import android.app.*;
import android.content.*;
import android.content.pm.*;
import android.net.Uri;
import android.os.*;
import org.json.*;
import java.io.*;
import java.net.*;
import java.util.*;
import java.util.concurrent.*;

final class Updates implements Application.ActivityLifecycleCallbacks {
    static final String PROJECT = "https://github.com/Sherkirito/JM-Clean";
    private static final String LATEST = "https://api.github.com/repos/Sherkirito/JM-Clean/releases/latest";
    private static Updates instance;
    static synchronized Updates get(Context ctx) {
        if (instance == null) instance = new Updates((Application)ctx.getApplicationContext());
        return instance;
    }

    final Application app;
    final String installed;
    final File directory;
    private final Handler main = new Handler(Looper.getMainLooper());
    private final ExecutorService worker = Executors.newSingleThreadExecutor();
    private final Set<Runnable> listeners = new HashSet<>();
    private Activity foreground;
    private boolean started, offer;
    private int generation;
    private Future<?> transfer;
    String phase = "idle", message = "";
    Release release;
    Asset selected;
    File ready;
    long received;

    private Updates(Application app) {
        this.app = app;
        try { installed = app.getPackageManager().getPackageInfo(app.getPackageName(), 0).versionName; }
        catch (PackageManager.NameNotFoundException e) { throw new IllegalStateException(e); }
        directory = new File(app.getCacheDir(), "jm-release-updates");
        app.registerActivityLifecycleCallbacks(this);
    }

    static final class Asset {
        final String name, hash;
        final long size;
        Asset(JSONObject item) throws IOException {
            name = item.optString("name"); size = item.optLong("size");
            String digest = item.optString("digest");
            if (!digest.matches("sha256:[a-f0-9]{64}") || size <= 0 || size > ApkDelta.LIMIT)
                throw new IOException("发布文件缺少有效的大小或校验值");
            hash = digest.substring(7);
        }
        String displaySize() {
            return size<1048576 ? String.format(Locale.ROOT,"%.1f KB",size/1024.0)
                    : String.format(Locale.ROOT,"%.2f MB",size/1048576.0);
        }
    }

    static final class Release {
        final String version, page, notes;
        final Asset apk, delta;
        Release(JSONObject json, String installed, File base) throws Exception {
            String tag = json.getString("tag_name");
            if (!tag.matches("v[0-9]{1,6}\\.[0-9]{1,6}(\\.[0-9]{1,6})?") || json.optBoolean("draft") || json.optBoolean("prerelease"))
                throw new IOException("无效的正式版本信息");
            version = tag.substring(1);
            page = PROJECT + "/releases/tag/" + tag;
            String body = json.optString("body").replace("\r", "");
            String marker = "## 更新内容\n";
            int start = body.indexOf(marker);
            if (start >= 0) body = body.substring(start + marker.length()).split("(?m)^## |^<details>", 2)[0];
            else body = "";
            notes = body.replace("**", "").replaceAll("(?m)^- ", "• ").trim();
            Asset full = null, diff = null;
            if (newer(version, installed)) {
                JSONArray assets = json.getJSONArray("assets");
                String suffix = "-to-" + version + "-arm64.jmd.gz", patchName = null;
                for (int i=0; i<assets.length(); i++) {
                    JSONObject item = assets.getJSONObject(i);
                    String name = item.optString("name");
                    if (name.equals("JM-Clean-" + version + "-arm64.apk")) full = new Asset(item);
                    if (name.startsWith("JM-Clean-from-") && name.endsWith(suffix)) {
                        if (patchName == null) patchName = "JM-Clean-from-" + ApkDelta.hash(base).substring(0,16) + suffix;
                        if (name.equals(patchName)) diff = new Asset(item);
                    }
                }
                if (full == null) throw new IOException("该版本尚未提供 ARM64 安装包");
            }
            apk = full; delta = diff != null && diff.size < full.size ? diff : null;
        }
    }

    private static boolean newer(String latest, String current) {
        String[] a = latest.split("\\."), b = current.split("[-+]",2)[0].split("\\.");
        for (int i=0; i<Math.max(a.length,b.length); i++) {
            int x = i<a.length ? Integer.parseInt(a[i]) : 0, y = i<b.length ? Integer.parseInt(b[i]) : 0;
            if (x != y) return x > y;
        }
        return current.contains("-");
    }

    private static HttpURLConnection connect(String address) throws IOException {
        URL url = new URL(address);
        for (int i=0; i<6; i++) {
            if (!"https".equals(url.getProtocol())) throw new IOException("更新下载需要 HTTPS");
            HttpURLConnection c = (HttpURLConnection)url.openConnection();
            c.setConnectTimeout(10000); c.setReadTimeout(20000); c.setInstanceFollowRedirects(false);
            c.setRequestProperty("User-Agent","JM-Clean-Android"); c.setRequestProperty("Accept-Encoding","identity");
            try {
                int status = c.getResponseCode();
                if (status == 200) return c;
                if (status < 300 || status >= 400 || c.getHeaderField("Location") == null)
                    throw new IOException("GitHub 请求失败（HTTP " + status + "）");
                url = new URL(url, c.getHeaderField("Location"));
            } catch (IOException e) { c.disconnect(); throw e; }
            c.disconnect();
        }
        throw new IOException("GitHub 下载重定向次数过多");
    }

    private Release latest() throws Exception {
        File[] stale=directory.listFiles();
        if(stale!=null)for(File f:stale){
            if(System.currentTimeMillis()-f.lastModified()>7L*24*60*60*1000 &&
                    (f.getName().matches("[0-9a-f]{64}\\.apk") || f.getName().matches("(incoming|rebuilt)-[0-9]+\\.part")))f.delete();
        }
        HttpURLConnection c = connect(LATEST);
        try (InputStream in = c.getInputStream(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] b = new byte[8192]; int n;
            while ((n=in.read(b)) != -1) {
                if (out.size()+n > 1024*1024) throw new IOException("版本信息过大");
                out.write(b,0,n);
            }
            return new Release(new JSONObject(out.toString("UTF-8")), installed, new File(app.getApplicationInfo().sourceDir));
        } finally { c.disconnect(); }
    }

    void observe(Runnable listener) { listeners.add(listener); listener.run(); }
    void remove(Runnable listener) { listeners.remove(listener); }
    private void changed() { for (Runnable r : new ArrayList<>(listeners)) r.run(); }
    void check(boolean startup) {
        if ("checking".equals(phase) || "downloading".equals(phase)) return;
        offer = startup; phase = "checking"; message = ""; ready = null; selected = null; release = null; changed();
        worker.execute(()->{
            try {
                Release found = latest();
                main.post(()->{release=found; phase=found.apk==null?"current":"available"; changed(); maybeOffer();});
            } catch (Exception e) {
                main.post(()->{offer=false; phase="error"; message="无法检查更新。"+reason(e); changed();});
            }
        });
    }
    private static String reason(Exception e) {
        String s = e.getMessage();
        return s != null && s.matches("(?s).*?[\\u4e00-\\u9fff].*") ? s : "请检查网络连接后重试。";
    }
    void manual() { offer=false; if ("idle".equals(phase) || "current".equals(phase) || "error".equals(phase) && release==null) check(false); }
    private void maybeOffer() {
        Activity a = foreground;
        if (!offer || release==null || release.apk==null || a==null || a.isFinishing() || a.isDestroyed() ||
                !"com.jiaohua_browser.MainActivity".equals(a.getClass().getName())) return;
        offer=false;
        Release found=release; Asset file=found.delta!=null?found.delta:found.apk;
        new AlertDialog.Builder(a).setTitle("有新版本可用 · "+found.version)
            .setMessage((found.notes.isEmpty()?"":found.notes+"\n\n")+(found.delta!=null?"增量下载 ":"完整下载 ")+file.displaySize())
            .setNegativeButton("稍后",null).setNeutralButton("GitHub Release",(d,w)->browser(a,found.page))
            .setPositiveButton("应用内更新",(d,w)->{a.startActivity(new Intent(a,UpdateActivity.class)); download(found.delta==null);}).show();
    }
    static void browser(Activity a, String url) {
        Intent view=new Intent(Intent.ACTION_VIEW, Uri.parse(url)).addCategory(Intent.CATEGORY_BROWSABLE);
        // Resolve a general web browser even when a GitHub client claims github.com.
        view.setSelector(new Intent(Intent.ACTION_VIEW,Uri.parse("https://example.invalid/")).addCategory(Intent.CATEGORY_BROWSABLE));
        try { a.startActivity(view); }
        catch (ActivityNotFoundException e) { android.widget.Toast.makeText(a,"未找到浏览器",0).show(); }
    }

    void download(boolean full) {
        if (release==null || release.apk==null || "downloading".equals(phase)) return;
        Release found=release;
        Asset asset=full || found.delta==null?found.apk:found.delta;
        int job=++generation;
        selected=asset; ready=null; phase="downloading"; received=0; message="正在下载"; changed();
        transfer=worker.submit(()->{
            File part=null, built=null;
            try {
                if (!directory.isDirectory() && !directory.mkdirs()) throw new IOException("无法创建更新目录");
                File result=new File(directory,found.apk.hash+".apk");
                if (!result.isFile() || !ApkDelta.hash(result).equals(found.apk.hash)) {
                    part=File.createTempFile("incoming-", ".part", directory);
                    HttpURLConnection c=connect(PROJECT+"/releases/download/v"+found.version+"/"+asset.name);
                    try (InputStream in=c.getInputStream(); OutputStream out=new FileOutputStream(part)) {
                        byte[] b=new byte[65536]; int n; long done=0, last=0;
                        while ((n=in.read(b))!=-1) {
                            if (Thread.currentThread().isInterrupted()) throw new InterruptedIOException();
                            done+=n; if (done>asset.size) throw new IOException("下载大小与发布信息不一致");
                            out.write(b,0,n);
                            long time=SystemClock.elapsedRealtime();
                            if (time-last>180 || done==asset.size) {last=time; final long bytes=done; main.post(()->{if(generation==job){received=bytes;changed();}});}
                        }
                        if (done!=asset.size) throw new IOException("下载中断，请重试");
                    } finally { c.disconnect(); }
                    if (!ApkDelta.hash(part).equals(asset.hash)) throw new IOException("下载文件校验失败");
                    main.post(()->{if(generation==job){message=asset==found.apk?"正在校验安装包":"正在还原并校验安装包";changed();}});
                    if (asset==found.apk) { built=part; part=null; }
                    else {
                        built=File.createTempFile("rebuilt-", ".part", directory);
                        ApkDelta.apply(new File(app.getApplicationInfo().sourceDir),part,built,found.apk.size,found.apk.hash);
                    }
                    verify(built,found.version);
                    if (Thread.currentThread().isInterrupted()) throw new InterruptedIOException();
                    if (!built.renameTo(result)) throw new IOException("无法保存安装包");
                } else verify(result,found.version);
                main.post(()->{if(generation==job){ready=result;phase="ready";changed();}});
            } catch(Exception e) {main.post(()->{if(generation==job){phase="error";message=reason(e);changed();}});}
            finally {if(part!=null)part.delete();if(built!=null)built.delete();}
        });
    }

    void cancel() {
        if (!"downloading".equals(phase)) return;
        generation++; transfer.cancel(true); phase="available"; message=""; changed();
    }

    @SuppressWarnings("deprecation")
    private void verify(File file, String version) throws Exception {
        PackageManager pm=app.getPackageManager();
        PackageInfo next=pm.getPackageArchiveInfo(file.getPath(),PackageManager.GET_SIGNATURES);
        PackageInfo current=pm.getPackageInfo(app.getPackageName(),PackageManager.GET_SIGNATURES);
        if(next==null || !app.getPackageName().equals(next.packageName) || !version.equals(next.versionName) ||
                next.versionCode<=current.versionCode || current.signatures==null || current.signatures.length==0 ||
                !Arrays.equals(next.signatures,current.signatures)) throw new IOException("安装包的版本、包名或签名不匹配");
    }

    @Override public void onActivityResumed(Activity a) {
        foreground=a;
        if (!started && "com.jiaohua_browser.MainActivity".equals(a.getClass().getName())) {started=true;check(true);}
        else maybeOffer();
    }
    @Override public void onActivityPaused(Activity a) {if(foreground==a)foreground=null;}
    @Override public void onActivityCreated(Activity a,Bundle b) {}
    @Override public void onActivityStarted(Activity a) {}
    @Override public void onActivityStopped(Activity a) {}
    @Override public void onActivitySaveInstanceState(Activity a,Bundle b) {}
    @Override public void onActivityDestroyed(Activity a) {}
}
