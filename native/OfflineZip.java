package org.jmclean.backup;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.ParcelFileDescriptor;
import java.io.*;
import java.lang.reflect.Method;
import java.util.*;

/** A random-access index into one original ZIP. Entry names never become paths on disk. */
final class OfflineZip implements Closeable {
    static final int LIMIT = 10000;
    static final long IMAGE_LIMIT = 64L * 1024 * 1024;
    static final class Page {
        final Object header; final String name; final long size;
        Page(Object h,String n,long s){header=h;name=n;size=s;}
    }
    final ParcelFileDescriptor descriptor;
    final List<Page> pages = new ArrayList<>();
    final boolean encrypted;
    private Object archive;
    private final Method input;

    OfflineZip(ParcelFileDescriptor fd, String password) throws Exception {
        descriptor=fd;
        try {
            // Use the ZIP library already bundled in the Android shell, including its encrypted-entry reader.
            Class<?> type=Class.forName("net.lingala.zip4j.ZipFile"), header=Class.forName("net.lingala.zip4j.model.FileHeader");
            archive=type.getConstructor(File.class).newInstance(new File("/proc/self/fd/"+fd.getFd()));
            if(!password.isEmpty())type.getMethod("setPassword",char[].class).invoke(archive,(Object)password.toCharArray());
            input=type.getMethod("getInputStream",header);
            Method name=header.getMethod("getFileName"),size=header.getMethod("getUncompressedSize"),locked=header.getMethod("isEncrypted");
            List<?> entries=(List<?>)type.getMethod("getFileHeaders").invoke(archive);
            if(entries.size()>LIMIT*2)throw new IOException("图包条目过多");
            boolean needsPassword=false;
            for(Object h:entries){
                String path=((String)name.invoke(h)).replace('\\','/');
                if(path.startsWith(".") || path.contains("/.") || path.startsWith("__MACOSX/") || !path.toLowerCase(Locale.ROOT).matches(".*\\.(jpe?g|png|webp|gif|avif|bmp)$"))continue;
                long bytes=((Number)size.invoke(h)).longValue();
                if(bytes<=0 || bytes>IMAGE_LIMIT)throw new IOException("图包内的图片大小异常");
                pages.add(new Page(h,path,bytes));needsPassword|=(Boolean)locked.invoke(h);
            }
            if(pages.isEmpty() || pages.size()>LIMIT)throw new IOException("ZIP 中没有可读取的图片或页数过多");
            Collections.sort(pages,(a,b)->natural(a.name,b.name));
            encrypted=needsPassword;
        }catch(Exception ex){close();throw ex;}
    }

    static int natural(String a,String b){
        int i=0,j=0;
        while(i<a.length() && j<b.length()){
            char x=a.charAt(i),y=b.charAt(j);
            if(x>='0'&&x<='9'&&y>='0'&&y<='9'){
                int end=i+1,other=j+1;
                while(end<a.length()&&a.charAt(end)>='0'&&a.charAt(end)<='9')end++;
                while(other<b.length()&&b.charAt(other)>='0'&&b.charAt(other)<='9')other++;
                int p=i,q=j;while(p+1<end&&a.charAt(p)=='0')p++;while(q+1<other&&b.charAt(q)=='0')q++;
                if(end-p!=other-q)return Integer.compare(end-p,other-q);
                while(p<end){int d=a.charAt(p++)-b.charAt(q++);if(d!=0)return d;}
                i=end;j=other;
            }else{int d=Character.toLowerCase(x)-Character.toLowerCase(y);if(d!=0)return d;i++;j++;}
        }
        int d=Integer.compare(a.length()-i,b.length()-j);return d!=0?d:a.compareTo(b);
    }

    void copy(int index,File file) throws Exception {
        if(index<0 || index>=pages.size())throw new IOException("页码超出范围");
        Page p=pages.get(index);long count=0;
        try(InputStream in=(InputStream)input.invoke(archive,p.header);OutputStream out=new BufferedOutputStream(new FileOutputStream(file))){
            byte[] buf=new byte[32768];int n;
            while((n=in.read(buf))!=-1){count+=n;if(count>p.size || count>IMAGE_LIMIT)throw new IOException("图片大小异常");out.write(buf,0,n);}
        }
        if(count!=p.size)throw new IOException("图片不完整");
        BitmapFactory.Options opt=new BitmapFactory.Options();opt.inJustDecodeBounds=true;
        BitmapFactory.decodeFile(file.getPath(),opt);
        if(opt.outWidth<=0 || opt.outHeight<=0 || (long)opt.outWidth*opt.outHeight>100000000L)throw new IOException("图片损坏或尺寸过大");
    }

    void cover(File dir,String id) throws Exception {
        if(!dir.isDirectory()&&!dir.mkdirs())return;
        File raw=File.createTempFile("cover-",null,dir),tmp=File.createTempFile("thumb-",null,dir);
        Bitmap bitmap=null;
        try{
            copy(0,raw);
            BitmapFactory.Options o=new BitmapFactory.Options();o.inJustDecodeBounds=true;BitmapFactory.decodeFile(raw.getPath(),o);
            o.inJustDecodeBounds=false;o.inSampleSize=1;
            while(Math.max(o.outWidth,o.outHeight)/o.inSampleSize>400)o.inSampleSize*=2;
            bitmap=BitmapFactory.decodeFile(raw.getPath(),o);
            if(bitmap!=null){try(OutputStream out=new FileOutputStream(tmp)){if(!bitmap.compress(Bitmap.CompressFormat.JPEG,78,out))return;}tmp.renameTo(new File(dir,id+".jpg"));}
        }finally{if(bitmap!=null)bitmap.recycle();raw.delete();tmp.delete();}
    }
    @Override public void close() throws IOException {
        try{if(archive instanceof Closeable)((Closeable)archive).close();}finally{descriptor.close();}
    }
}
