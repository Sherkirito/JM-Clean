package org.jmclean.backup;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.List;

/** Private entry point for the bundled file bridge. Both components run under the app's UID. */
public final class BackupProvider extends ContentProvider {
    @Override public boolean onCreate() {
        // Providers initialize before React creates its JS context. The bundled JSC
        // crashed in a HeapHelper while marking the heap on the tested ARM64 phone.
        try {
            android.system.Os.setenv("JSC_numberOfGCMarkers", "1", true);
        } catch (android.system.ErrnoException ex) {
            android.util.Log.w("JMClean", "Could not configure the JS heap marker", ex);
        }
        return true;
    }

    @Override public ParcelFileDescriptor openFile(Uri uri, String mode) throws FileNotFoundException {
        List<String> parts = uri.getPathSegments();
        if("r".equals(mode) && parts.size()>=2 && "offline".equals(parts.get(0)))return OfflineLibrary.get(getContext()).call(parts);
        if (!"r".equals(mode) || parts.size() != 2 || !("export".equals(parts.get(0)) || "import".equals(parts.get(0))) ||
                !parts.get(1).matches("[a-z0-9]{8,48}")) throw new FileNotFoundException();
        File dir = new File(new File(getContext().getCacheDir(), "jm-clean-backups"), parts.get(1));
        if (!dir.isDirectory()) throw new FileNotFoundException();
        Intent start = new Intent(getContext(), BackupActivity.class).setData(uri);
        start.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(start);
        return ParcelFileDescriptor.open(new File(dir, "started"), ParcelFileDescriptor.MODE_READ_WRITE | ParcelFileDescriptor.MODE_CREATE);
    }

    @Override public String getType(Uri uri) { return "application/octet-stream"; }
    @Override public Cursor query(Uri uri, String[] projection, String selection, String[] args, String sort) { return null; }
    @Override public Uri insert(Uri uri, ContentValues values) { throw new UnsupportedOperationException(); }
    @Override public int delete(Uri uri, String selection, String[] args) { throw new UnsupportedOperationException(); }
    @Override public int update(Uri uri, ContentValues values, String selection, String[] args) { throw new UnsupportedOperationException(); }
}
