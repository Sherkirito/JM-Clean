"""Rebuild the retained Metro graph inside the signed r7 Android shell."""
import argparse
from copy import copy
import hashlib
import json
from pathlib import Path
import re
import struct
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parent
DEFAULT_BASE = ROOT / 'inputs' / 'android-shell-r7.zip'
BASE_HASH = 'eb75e33b2b92f9be58279c5fca1a7a585ca715d9c13006db9ddd676bb7281fc8'
SHELL_HASH = 'af7732b58b25ea4d4e14b11ecaac180e64657cbd9af0ce8f2007ef28d6715841'
META = re.compile(r'\},\s*(\d+),\s*(\[[\d,\s]*\])\s*\);')
REMOVED = {536, 674, 675, 676, 717, 2041, 2042, 2043, 2044, 2045, 2139, 2140, 2142, 2144, 2145, 2152, 2155}

def localize_controls(modules):
    # Patch the native presentation boundaries in the hash-verified RN shell. Keeping
    # the original components preserves refs, input selection and responder behavior.
    edits = {
        212: [('var n=this.props;return C(n)', 'var n=LANG.textProps(this.props);return C(n)')],
        347: [('function x(s){var v,x,T=', 'function x(s){s=LANG.inputProps(s);var v,x,T=')],
        164: [('v={title:n||\'\',message:o||\'\'', "v={title:LANG.lang(n)||'',message:(c&&c.jmVerbatimMessage?o:LANG.lang(o))||''"),
              ('v.buttonNeutral=h.text', 'v.buttonNeutral=LANG.lang(h.text)'),
              ('v.buttonNegative=y.text', 'v.buttonNegative=LANG.lang(y.text)'),
              ('v.buttonPositive=b.text||"OK"', 'v.buttonPositive=LANG.lang(b.text)||"确定"')],
        397: [('t.default.show(s,n)', 't.default.show(LANG.lang(s),n)'),
              ('t.default.showWithGravity(s,n,f)', 't.default.showWithGravity(LANG.lang(s),n,f)'),
              ('t.default.showWithGravityAndOffset(s,n,f,o,u)', 't.default.showWithGravityAndOffset(LANG.lang(s),n,f,o,u)')],
    }
    # Share the existing character dictionary with the embedded chapter page.
    code, deps = modules[654]
    marker = ';return t=t.replace('
    if code.count(marker) != 1 or 'var _=n.t_2_s' not in code:
        raise ValueError('Unexpected character dictionary')
    end = META.search(code).start()
    modules[654] = (code[:end] + ';m.exports.characters=function(){return n.t_2_s}' + code[end:], deps)
    for index, replacements in edits.items():
        code, deps = modules[index]
        for old, new in replacements:
            if code.count(old) != 1:
                raise ValueError(f'Unexpected native control in module {index}')
            code = code.replace(old, new.replace('LANG', f'r(d[{len(deps)}])'))
        deps = [*deps, 651]
        code = code[:META.search(code).start()] + f'}},{index},{json.dumps(deps)});'
        modules[index] = (code, deps)



def configure_detail_scroll(modules):
    # This shell's native animation module disconnects removed scroll nodes before
    # the UI batch creates their replacements. Let the detail screen use JS events
    # for its two parallax offsets. Android still handles scrolling in both views.
    changes = {
        1892: [('useNativeDriver:!0,listener:function(n){t.isCloseToBottom',
                'useNativeDriver:this.props.nativeScroll!==false,listener:function(n){t.isCloseToBottom'),
               ('b.ScrollableTabView,{contentContainerStyles:c', 'b.ScrollableTabView,{nativeScroll:this.props.nativeScroll,contentContainerStyles:c')],
        1896: [('useNativeDriver:!0,listener:this.onScroll','useNativeDriver:this.props.nativeScroll!==false,listener:this.onScroll')]
    }
    for index, substitutions in changes.items():
        code, deps = modules[index]
        for expected, replacement in substitutions:
            if code.count(expected) != 1:
                raise ValueError(f'Unexpected scroll binding in module {index}')
            code = code.replace(expected, replacement)
        modules[index] = code, deps


def make_bundle(original):
    prelude, *parts = original.split('__d(')
    modules = {}
    trailer = ''
    for index, part in enumerate(parts):
        meta = META.search(part)
        if int(meta[1]) != index:
            raise ValueError(f'Unexpected module {index}')
        modules[index] = ('__d(' + part[:meta.end()], json.loads(meta[2]))
        if index == len(parts)-1:
            trailer = part[meta.end():].split('//# sourceMappingURL')[0]
    src = ROOT / 'src'
    for file in sorted(src.glob('*.js')):
        if file.name in {'reader-protection.js', 'reader-layout.js'}:
            continue
        code = file.read_text(encoding='utf-8-sig').strip()
        if file.name == 'reader.js':
            code = code.replace('__READER_LAYOUT__', json.dumps((src / 'reader-layout.js').read_text('utf-8')))
            guard = ';(' + (src / 'reader-protection.js').read_text('utf-8') + ')();true;'
            code = code.replace('__READER_PROTECTION__', json.dumps(guard))
        meta = META.search(code)
        if not meta or meta.end() != len(code):
            raise ValueError(f'Invalid module file {file}')
        modules[int(meta[1])] = (code, json.loads(meta[2]))
    vendor = ROOT / 'vendor' / 're2js'
    engine = (vendor / 're2js.cjs').read_text('utf-8')
    license_text = (vendor / 'LICENSE').read_text('utf-8')
    modules[2172] = ('__d(function(global,require,_i,_a,module,exports){\n/*' + license_text +
                     '*/\nconst globalThis=global;\n' + engine + '\n},2172,[]);', [])
    localize_controls(modules)
    configure_detail_scroll(modules)
    code, deps = modules[447]
    marker = 'getStateForAction:function(t,s,y){var c=y.routeParamList;'
    if code.count(marker) != 1:
        raise ValueError('Unexpected StackRouter in Android shell')
    code = code.replace(marker, marker + f's=r(d[{len(deps)}]).forStack(t,s);')
    deps = [*deps, 2179]
    modules[447] = (code[:META.search(code).start()] + f'}},447,{json.dumps(deps)});', deps)
    code, deps = modules[826]
    marker = "'isVisible':_0x5290b1,'onSwipeComplete':"
    if code.count(marker) != 1:
        raise ValueError('Unexpected modal picker in Android shell')
    modules[826] = (code.replace(marker, "'onBackButtonPress':_0x5abb75," + marker), deps)
    code, deps = modules[2107]
    marker = "'visible':_0x5b1081,'transparent':"
    if code.count(marker) != 1:
        raise ValueError('Unexpected detail dialog in Android shell')
    modules[2107] = (code.replace(marker, "'onRequestClose':_0x29cb5d," + marker), deps)
    # Keep the shell's folder editing and card UI. Replace only the footer and
    # pagination callbacks, whose original implementations own a second cursor.
    code, deps = modules[2018]
    for start, end, body in [
        ('var _0x280c53=_0x5e9488,_0x556a34=', '},_0x229510[_0x5e9488(0x1ea)',
         'return r(d[23]).footer(_0x229510,V,E.colors,g.darkMode);'),
        ('var _0x538b42=_0x5e9488,_0x5aabfb,', '},_0x229510[_0x5e9488(0x23b)]={',
         'return r(d[23]).loadMore(_0x229510,T.API_FAVORITE_LIST);'),
    ]:
        if code.count(start)!=1 or code.count(end)!=1 or len(deps)!=23:
            raise ValueError('Unexpected favorites panel in Android shell')
        left=code.index(start)
        code=code[:left]+body+code[code.index(end,left):]
    deps=[*deps,2178]
    modules[2018]=(code[:META.search(code).start()]+f'}},2018,{json.dumps(deps)});',deps)
    alive = set()
    pending = [int(i) for i in re.findall(r'__r\((\d+)\)',trailer)]
    if not pending:
        raise ValueError('Missing entry point')
    while pending:
        index = pending.pop()
        if index not in alive:
            alive.add(index)
            pending.extend(modules[index][1])
    if alive & REMOVED:
        raise ValueError(f'Removed screen is reachable: {alive & REMOVED}')
    print(f'{len(alive)} retained, {len(modules)-len(alive)} unreachable Metro modules excluded')
    return prelude + '\n'.join(modules[i][0] for i in sorted(alive)) + trailer

def replace_pool_string(blob, pool, old, new):
    """Repoint the existing string index, preserving XML and resource references."""
    data = bytearray(blob)
    kind, header, size, count, _, flags, strings, styles = struct.unpack_from('<HH6I', data, pool)
    if kind != 1 or flags & 1:
        raise ValueError('Expected an unsorted Android string pool')
    def encode(value):
        wide = value.encode('utf-16le')
        if flags & 0x100:
            utf8 = value.encode('utf-8')
            return bytes([len(wide)//2, len(utf8)]) + utf8 + bytes(1)
        return struct.pack('<H', len(wide)//2) + wide + bytes(2)
    before, after = encode(old), encode(new)
    matches = []
    for i in range(count):
        slot = pool + header + 4*i
        offset, = struct.unpack_from('<I', data, slot)
        start = pool + strings + offset
        if data[start:start+len(before)] == before:
            matches.append(slot)
    if len(matches) != 1:
        raise ValueError(f'Expected exactly one {old} string')
    end = styles or size
    after += bytes(-len(after) % 4)
    struct.pack_into('<I', data, matches[0], end - strings)
    struct.pack_into('<I', data, pool+4, size+len(after))
    if styles:
        struct.pack_into('<I', data, pool+24, styles+len(after))
    struct.pack_into('<I', data, 4, len(data)+len(after))
    data[pool+end:pool+end] = after
    return data

def update_version(manifest):
    # Binary XML resource map maps an attribute name index to its Android ID.
    data = bytearray(manifest)
    pos = 8
    names = ()
    while pos < len(data):
        kind, header, length = struct.unpack_from('<HHI', data, pos)
        if length < header or not length:
            raise ValueError('Bad manifest')
        if kind == 0x180:
            names = struct.unpack_from(f'<{(length-header)//4}I', data, pos+header)
        if kind == 0x102:
            start, stride, count = struct.unpack_from('<HHH', data, pos+24)
            for i in range(count):
                at = pos+16+start+i*stride
                name = struct.unpack_from('<I', data, at+4)[0]
                if name < len(names) and names[name] == 0x0101021b:
                    if not data[at+15] in (0x10,0x11):
                        raise ValueError('Expected integer versionCode')
                    struct.pack_into('<I', data, at+16, 38)
                    return replace_pool_string(data, 8, '1.8.2', '1.1.0')
        pos += length
    raise ValueError('versionCode missing')

def build(base, output, java, tools, platform):
    from native_build import compile_picker,declare_picker
    if hashlib.sha256(base.read_bytes()).hexdigest() not in (SHELL_HASH, BASE_HASH):
        raise ValueError('Expected the verified Android shell inputs or the original JM2Clean r7 APK')
    with zipfile.ZipFile(base) as src:
        bundle = make_bundle(src.read('assets/index.android.bundle').decode())
        with tempfile.TemporaryDirectory() as temp:
            script = Path(temp) / 'index.js'
            script.write_text(bundle,encoding='utf-8')
            subprocess.run(['node','--check',str(script)],check=True)
        with zipfile.ZipFile(output,'w') as dst:
            for info in src.infolist():
                name = info.filename
                if re.fullmatch(r'META-INF/[^/]+\.(SF|RSA|MF|DSA|EC)',name,re.I):
                    continue
                if name.startswith('lib/') and not name.startswith('lib/arm64-v8a/'):
                    continue
                content = src.read(info)
                if name == 'build-inputs/AndroidManifest.axml':
                    info = copy(info)
                    info.filename = name = 'AndroidManifest.xml'
                if name == 'assets/index.android.bundle':
                    content = bundle.encode()
                elif name == 'AndroidManifest.xml':
                    content = declare_picker(update_version(content))
                elif name == 'resources.arsc':
                    content = replace_pool_string(content, 12, 'JM2Clean', 'JM洁净版')
                dst.writestr(info,content)
            dst.writestr('classes3.dex',compile_picker(java,tools,platform),compress_type=zipfile.ZIP_DEFLATED)
if __name__ == '__main__':
    args=argparse.ArgumentParser()
    args.add_argument('output',type=Path)
    args.add_argument('--base',type=Path,default=DEFAULT_BASE)
    args.add_argument('--java',default='java')
    args.add_argument('--tools',type=Path,required=True)
    args.add_argument('--platform',type=Path,required=True)
    values=args.parse_args()
    build(values.base,values.output,values.java,values.tools,values.platform)
