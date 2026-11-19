package org.jmclean.backup;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

/** Transfers a single private staging file through Android's document picker. */
public final class BackupActivity extends Activity {
    private static final int PICK = 1;
    private static final long LIMIT = 16L * 1024 * 1024;
    private File directory;
    private boolean exporting;

    @Override protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        Uri uri = getIntent().getData();
        if (uri == null || !(getPackageName()+".jmbackup").equals(uri.getAuthority()) || uri.getPathSegments().size() != 2) { finish(); return; }
        String token = uri.getLastPathSegment();
        if (token == null || !token.matches("[a-z0-9]{8,48}")) { finish(); return; }
        directory = new File(new File(getCacheDir(), "jm-clean-backups"), token);
        if (!directory.isDirectory()) { finish(); return; }
        String mode = uri.getPathSegments().get(0);
        if (!"export".equals(mode) && !"import".equals(mode)) { finish(); return; }
        exporting = "export".equals(mode);
        if (saved != null) return;
        Intent pick = new Intent(exporting ? Intent.ACTION_CREATE_DOCUMENT : Intent.ACTION_OPEN_DOCUMENT);
        pick.addCategory(Intent.CATEGORY_OPENABLE);
        pick.setType(exporting ? "application/gzip" : "*/*");
        if (exporting) {
            String date = new SimpleDateFormat("yyyyMMdd-HHmmss", Locale.ROOT).format(new Date());
            pick.putExtra(Intent.EXTRA_TITLE, "JM洁净版-" + date + ".json.gz");
        }
        try { startActivityForResult(pick, PICK); }
        catch (RuntimeException ex) { finishWith("无法打开系统文件选择器"); }
    }

    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request != PICK) return;
        if (result != RESULT_OK || data == null || data.getData() == null) { finishWith("cancel"); return; }
        final Uri uri = data.getData();
        new Thread(() -> {
            String status = "ok";
            try {
                if (!"content".equals(uri.getScheme())) throw new IOException();
                File payload = new File(directory, "payload");
                if (exporting) {
                    try (InputStream in = new FileInputStream(payload);
                         OutputStream target = getContentResolver().openOutputStream(uri, "wt")) {
                        if (target == null) throw new IOException();
                        try (OutputStream out = new GZIPOutputStream(target)) { transfer(in, out); }
                    }
                } else {
                    try (InputStream source = getContentResolver().openInputStream(uri)) {
                        if (source == null) throw new IOException();
                        try (InputStream in = new GZIPInputStream(source); OutputStream out = new FileOutputStream(payload)) {
                            transfer(in, out);
                        }
                    }
                }
            } catch (IOException | RuntimeException ex) {
                status = exporting ? "文件写入失败，请重新选择保存位置" : "无法读取备份，请检查文件是否完整或超过大小限制";
            }
            final String message = status;
            runOnUiThread(() -> finishWith(message));
        }, "JM backup file").start();
    }

    private static void transfer(InputStream in, OutputStream out) throws IOException {
        byte[] buffer = new byte[16384];
        long total = 0; int n;
        while ((n = in.read(buffer)) != -1) {
            total += n;
            if (total > LIMIT) throw new IOException("size");
            out.write(buffer, 0, n);
        }
    }

    private void finishWith(String message) {
        File part = new File(directory, "result.tmp");
        try (OutputStream out = new FileOutputStream(part)) { out.write(message.getBytes(StandardCharsets.UTF_8)); }
        catch (IOException ex) { finish(); return; }
        part.renameTo(new File(directory, "result"));
        finish();
    }
}
