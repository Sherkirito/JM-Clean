package org.jmclean.backup;

import java.io.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.zip.GZIPInputStream;

final class ApkDelta {
    private ApkDelta() {}
    static final int LIMIT = 128 * 1024 * 1024;

    static MessageDigest sha256() {
        try { return MessageDigest.getInstance("SHA-256"); }
        catch (NoSuchAlgorithmException e) { throw new AssertionError(e); }
    }

    static String hex(byte[] bytes) {
        String digits = "0123456789abcdef";
        StringBuilder out = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) out.append(digits.charAt((b & 255) >>> 4)).append(digits.charAt(b & 15));
        return out.toString();
    }

    static String hash(File file) throws IOException {
        MessageDigest digest = sha256();
        byte[] buffer = new byte[65536];
        try (InputStream in = new FileInputStream(file)) {
            int n;
            while ((n = in.read(buffer)) != -1) digest.update(buffer, 0, n);
        }
        return hex(digest.digest());
    }

    // JMD1 copies unchanged compressed ZIP members verbatim. All remaining
    // bytes, including the new signing block, come from the release patch.
    static void apply(File base, File patch, File output, long size, String targetHash) throws IOException {
        byte[] buffer = new byte[65536], source = new byte[32], target = new byte[32], magic = new byte[4];
        try (DataInputStream in = new DataInputStream(new BufferedInputStream(new GZIPInputStream(new FileInputStream(patch))));
             RandomAccessFile old = new RandomAccessFile(base, "r");
             OutputStream out = new BufferedOutputStream(new FileOutputStream(output))) {
            in.readFully(magic); in.readFully(source); in.readFully(target);
            if (!Arrays.equals(magic, new byte[]{'J','M','D','1'}) || in.readInt() != size || size <= 0 || size > LIMIT ||
                    !hex(source).equals(hash(base)) || !hex(target).equals(targetHash))
                throw new IOException("增量包与当前安装版本不匹配");
            long written = 0;
            for (int op; (op = in.readUnsignedByte()) != 0;) {
                if (op != 1 && op != 2) throw new IOException("增量包格式错误");
                int offset = op == 1 ? in.readInt() : 0, length = in.readInt();
                if (length <= 0 || written + length > size || offset < 0 || op == 1 && (long)offset + length > old.length())
                    throw new IOException("增量包数据不完整");
                if (op == 1) old.seek(offset);
                written += length;
                while (length > 0) {
                    if (Thread.currentThread().isInterrupted()) throw new InterruptedIOException();
                    int n = Math.min(buffer.length, length);
                    if (op == 1) old.readFully(buffer, 0, n); else in.readFully(buffer, 0, n);
                    out.write(buffer, 0, n); length -= n;
                }
            }
            if (written != size || in.read() != -1) throw new IOException("增量包长度错误");
        }
        if (!hash(output).equals(targetHash)) throw new IOException("还原后的安装包校验失败");
    }
}
