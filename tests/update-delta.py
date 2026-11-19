"""Round-trip the published patch format with the Android reader on a desktop JDK."""
import argparse
import hashlib
import shutil
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tools'))
from make_update import make_delta


def main():
    args = argparse.ArgumentParser()
    args.add_argument('--java', default=shutil.which('java'))
    args.add_argument('--base', type=Path)
    args.add_argument('--target', type=Path)
    opt = args.parse_args()
    if not opt.java or bool(opt.base) != bool(opt.target):
        args.error('Provide a JDK and either both or neither of --base / --target')
    java = Path(opt.java).resolve()
    javac = java.with_name('javac' + java.suffix)
    with tempfile.TemporaryDirectory() as temp:
        work = Path(temp)
        base, target = work / 'base.apk', work / 'JM-Clean-1.1.0-arm64.apk'
        if opt.base:
            shutil.copyfile(opt.base, base)
            shutil.copyfile(opt.target, target)
        else:
            for file, text in [(base, b'old'), (target, b'new')]:
                with zipfile.ZipFile(file, 'w') as z:
                    z.writestr('shared', bytes(range(256))*128)
                    z.writestr('changed', text)
        patch = make_delta(base, target)
        output = work / 'rebuilt.apk'
        harness = work / 'Apply.java'
        harness.write_text('''package org.jmclean.backup;
import java.io.File;
public class Apply {
    public static void main(String[] a) throws Exception {
        ApkDelta.apply(new File(a[0]), new File(a[1]), new File(a[2]), Long.parseLong(a[3]), a[4]);
    }
}''', encoding='utf-8')
        subprocess.run([javac, '-encoding', 'UTF-8', '-d', work, ROOT/'native/ApkDelta.java', harness], check=True)
        cmd = [java, '-cp', work, 'org.jmclean.backup.Apply', base, patch, output,
               str(target.stat().st_size), hashlib.sha256(target.read_bytes()).hexdigest()]
        subprocess.run(cmd, check=True)
        assert output.read_bytes() == target.read_bytes()
        assert patch.stat().st_size < target.stat().st_size
        original = base.read_bytes()
        base.write_bytes(original + b'x')
        assert subprocess.run(cmd, capture_output=True).returncode != 0
        base.write_bytes(original)
        patch.write_bytes(patch.read_bytes()[:-16])
        assert subprocess.run(cmd, capture_output=True).returncode != 0
        print('Delta round-trip, wrong base and interrupted transfer passed.')


if __name__ == '__main__':
    main()
