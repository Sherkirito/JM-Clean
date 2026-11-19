"""Register the private backup picker in the hash-verified Android manifest."""
import struct
import subprocess
import tempfile
import zipfile
from pathlib import Path

def declare_picker(manifest):
    data=bytearray(manifest)
    tag,header,size,count,styles,flags,strings,style_start=struct.unpack_from('<HH6I',data,8)
    if (tag,styles,flags,style_start)!=(1,0,0,0):
        raise ValueError('Unexpected manifest string pool')
    offsets=list(struct.unpack_from(f'<{count}I',data,8+header))
    contents=bytearray(data[8+strings:8+size])
    names=[]
    for offset in offsets:
        length,=struct.unpack_from('<H',contents,offset)
        names.append(contents[offset+2:offset+2+length*2].decode('utf-16le'))
    def index(name):
        if name not in names:
            raw=name.encode('utf-16le')
            offsets.append(len(contents))
            contents.extend(struct.pack('<H',len(raw)//2)+raw+bytes(2))
            names.append(name)
        return names.index(name)
    none=0xffffffff
    android=index('http://schemas.android.com/apk/res/android')
    def attr(name,typ,value):
        return struct.pack('<IIIHBBI',android,index(name),value if typ==3 else none,8,0,typ,value)
    def element(tag,attrs=(),children=b''):
        idx=index(tag)
        start=struct.pack('<HHIIIII6H',0x102,16,36+20*len(attrs),0,none,none,idx,20,20,len(attrs),0,0,0)
        end=struct.pack('<HHIIIII',0x103,16,24,0,none,none,idx)
        return start+b''.join(attrs)+children+end
    activity=element('activity',[attr('name',3,index('org.jmclean.backup.BackupActivity')),attr('exported',0x12,0),attr('configChanges',0x11,0x4a0)])
    provider=element('provider',[attr('name',3,index('org.jmclean.backup.BackupProvider')),attr('exported',0x12,0),attr('authorities',3,index('com.jiaohua_cleaner.jmbackup'))])
    gate=element('activity',[attr('name',3,index('org.jmclean.backup.OfflineVerification')),attr('exported',0x12,0),attr('configChanges',0x11,0x4a0)])
    updater=element('activity',[attr('name',3,index('org.jmclean.backup.UpdateActivity')),attr('exported',0x12,0)])
    apk_provider=element('provider',[attr('name',3,index('org.jmclean.backup.UpdateFileProvider')),attr('exported',0x12,0),
                                     attr('authorities',3,index('com.jiaohua_cleaner.jmupdate')),attr('grantUriPermissions',0x12,0xffffffff)])
    rest=bytearray(data[8+size:])
    map_tag,map_header,map_size=struct.unpack_from('<HHI',rest)
    if map_tag!=0x180:
        raise ValueError('Missing manifest attribute resource map')
    resource_ids=list(struct.unpack_from(f'<{(map_size-map_header)//4}I',rest,map_header))
    if resource_ids[index('authorities')]!=0x01010018:
        raise ValueError('Missing manifest provider authority ID')
    # The verified shell stores component names as typed string attributes.
    # Remove entire elements, including children such as FileProvider paths.
    excluded={
        ('provider','com.nodece.apkinstallern.RNApkInstallerNFileProvider'),
        ('meta-data','com.google.android.gms.ads.APPLICATION_ID'),
        ('provider','com.google.android.gms.ads.MobileAdsInitProvider'),
        ('activity','com.google.android.gms.ads.AdActivity'),
        ('service','com.google.android.gms.ads.AdService'),
        ('provider','com.google.firebase.provider.FirebaseInitProvider'),
        ('service','com.google.firebase.components.ComponentDiscoveryService'),
        ('receiver','com.google.android.gms.measurement.AppMeasurementReceiver'),
        ('service','com.google.android.gms.measurement.AppMeasurementService'),
        ('service','com.google.android.gms.measurement.AppMeasurementJobService'),
    }
    found=set()
    output=bytearray()
    pos=skip=0
    inserted=False
    while pos<len(rest):
        tag,_,length=struct.unpack_from('<HHI',rest,pos)
        if length<8 or pos+length>len(rest):
            raise ValueError('Invalid manifest chunk')
        if tag==0x102:
            if skip:
                skip+=1
            else:
                element_name=names[struct.unpack_from('<I',rest,pos+20)[0]]
                start,stride,count=struct.unpack_from('<3H',rest,pos+24)
                for i in range(count):
                    at=pos+16+start+stride*i
                    ns,key=struct.unpack_from('<II',rest,at)
                    if ns==android and names[key]=='name' and rest[at+15]==3:
                        pair=(element_name,names[struct.unpack_from('<I',rest,at+16)[0]])
                        if pair in excluded:
                            found.add(pair)
                            skip=1
                        break
        if not skip:
            if tag==0x103 and struct.unpack_from('<I',rest,pos+20)[0]==index('application'):
                output.extend(activity+provider+gate+updater+apk_provider)
                inserted=True
            output.extend(rest[pos:pos+length])
        elif tag==0x103:
            skip-=1
        pos+=length
    if not inserted or skip or excluded!=found:
        raise ValueError(f'Unexpected shell manifest, missing removals: {excluded-found}')
    rest=output
    contents.extend(bytes(-len(contents)%4))
    start=header+4*len(offsets)
    pool=struct.pack('<HH6I',1,header,start+len(contents),len(offsets),0,0,start,0)
    result=data[:8]+pool+struct.pack(f'<{len(offsets)}I',*offsets)+contents+rest
    struct.pack_into('<I',result,4,len(result))
    return result

def compile_picker(java,tools,platform):
    with tempfile.TemporaryDirectory() as name:
        out=Path(name)
        javac=Path(java).with_name('javac.exe') if Path(java).is_file() else 'javac'
        sources=sorted((Path(__file__).parent/'native').glob('*.java'))
        subprocess.run([javac,'-encoding','UTF-8','-source','8','-target','8','-cp',platform,'-d',out,*sources],check=True)
        jar=out/'app.jar'
        with zipfile.ZipFile(jar,'w') as files:
            for file in out.rglob('*.class'):
                files.write(file,file.relative_to(out))
        subprocess.run([java,'-cp',tools/'lib'/'d8.jar','com.android.tools.r8.D8','--min-api','21','--lib',platform,'--output',out,jar],check=True)
        return (out/'classes.dex').read_bytes()
