package org.jmclean.backup;

import android.content.*;
import android.database.*;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;
import java.io.*;

/** Only the explicitly granted, verified APK can be opened by the installer. */
public final class UpdateFileProvider extends ContentProvider {
    static final String TYPE="application/vnd.android.package-archive";
    @Override public boolean onCreate(){return true;}
    private File file(Uri uri) {
        if(uri.getPathSegments().size()!=1 || !uri.getLastPathSegment().matches("[0-9a-f]{64}\\.apk"))
            throw new IllegalArgumentException("Invalid update URI");
        return new File(new File(getContext().getCacheDir(),"jm-release-updates"),uri.getLastPathSegment());
    }
    @Override public ParcelFileDescriptor openFile(Uri uri,String mode) throws FileNotFoundException {
        if(!"r".equals(mode))throw new FileNotFoundException();
        return ParcelFileDescriptor.open(file(uri),ParcelFileDescriptor.MODE_READ_ONLY);
    }
    @Override public Cursor query(Uri uri,String[] projection,String s,String[] args,String sort) {
        File apk=file(uri);
        String[] cols=projection==null?new String[]{OpenableColumns.DISPLAY_NAME,OpenableColumns.SIZE}:projection;
        MatrixCursor cursor=new MatrixCursor(cols);Object[] values=new Object[cols.length];
        for(int i=0;i<cols.length;i++){
            if(OpenableColumns.DISPLAY_NAME.equals(cols[i]))values[i]="JM-Clean-update.apk";
            if(OpenableColumns.SIZE.equals(cols[i]))values[i]=apk.length();
        }
        if(apk.isFile())cursor.addRow(values);return cursor;
    }
    @Override public String getType(Uri uri){file(uri);return TYPE;}
    @Override public Uri insert(Uri uri,ContentValues values){throw new UnsupportedOperationException();}
    @Override public int update(Uri uri,ContentValues values,String s,String[] args){throw new UnsupportedOperationException();}
    @Override public int delete(Uri uri,String s,String[] args){throw new UnsupportedOperationException();}
}
