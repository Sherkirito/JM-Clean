"""Build a delta between two *signed* ARM64 release APKs."""
import argparse
import gzip
import hashlib
import re
import struct
import zipfile
from pathlib import Path


def members(apk, data):
    with zipfile.ZipFile(apk) as archive:
        for entry in sorted(archive.infolist(), key=lambda item: item.header_offset):
            name_len, extra_len = struct.unpack_from('<HH', data, entry.header_offset + 26)
            yield entry.filename, entry.header_offset + 30 + name_len + extra_len, entry.compress_size


def make_delta(base, target):
    version = re.fullmatch(r'JM-Clean-(\d+\.\d+(?:\.\d+)?)-arm64\.apk', target.name)
    if not version:
        raise ValueError('Use the official JM-Clean-<version>-arm64.apk filename')
    old, new = base.read_bytes(), target.read_bytes()
    source_hash, target_hash = hashlib.sha256(old), hashlib.sha256(new)
    index = {name: (start, size) for name, start, size in members(base, old)}
    output = target.with_name(f'JM-Clean-from-{source_hash.hexdigest()[:16]}-to-{version[1]}-arm64.jmd.gz')
    with output.open('wb') as raw, gzip.GzipFile(fileobj=raw, mode='wb', filename='', mtime=0) as patch:
        patch.write(b'JMD1' + source_hash.digest() + target_hash.digest() + struct.pack('>I', len(new)))
        cursor = 0
        for name, start, size in members(target, new):
            record = index.get(name)
            if size < 128 or not record or record[1] != size:
                continue
            offset = record[0]
            if memoryview(old)[offset:offset + size] != memoryview(new)[start:start + size]:
                continue
            if start > cursor:
                patch.write(struct.pack('>BI', 2, start - cursor))
                patch.write(new[cursor:start])
            patch.write(struct.pack('>BII', 1, offset, size))
            cursor = start + size
        if cursor < len(new):
            patch.write(struct.pack('>BI', 2, len(new) - cursor))
            patch.write(new[cursor:])
        patch.write(b'\x00')
    return output


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('base', type=Path)
    parser.add_argument('target', type=Path)
    args = parser.parse_args()
    print(make_delta(args.base, args.target))
