package org.jmclean.backup;

import android.app.Activity;
import android.content.*;
import android.net.Uri;
import android.os.*;
import android.provider.Settings;
import android.view.View;
import android.widget.*;

public final class UpdateActivity extends Activity {
    private Updates updates;
    private TextView status, notes;
    private ProgressBar progress;
    private Button primary, full, browser;
    private final Runnable render=this::render;

    @Override public void onCreate(Bundle saved) {
        super.onCreate(saved); setTitle("软件更新");
        updates=Updates.get(this);
        ScrollView scroll=new ScrollView(this);
        LinearLayout body=new LinearLayout(this); body.setOrientation(LinearLayout.VERTICAL);
        int pad=Math.round(20*getResources().getDisplayMetrics().density); body.setPadding(pad,pad,pad,pad);
        scroll.addView(body); setContentView(scroll);
        if(getActionBar()==null){
            TextView title=new TextView(this); title.setTextSize(24); title.setText("软件更新"); body.addView(title);
        }
        TextView current=new TextView(this); current.setText("当前版本  "+updates.installed); body.addView(current);
        status=new TextView(this); status.setPadding(0,pad,0,pad/2); status.setTextSize(18); body.addView(status);
        notes=new TextView(this); notes.setPadding(0,0,0,pad); body.addView(notes);
        progress=new ProgressBar(this,null,android.R.attr.progressBarStyleHorizontal); body.addView(progress);
        primary=button(body,"",v->primaryAction());
        full=button(body,"",v->updates.download(true));
        browser=button(body,"前往 GitHub Release",v->Updates.browser(this,updates.release==null?Updates.PROJECT+"/releases/latest":updates.release.page));
        button(body,"返回",v->finish());
        updates.manual();
    }
    private Button button(LinearLayout row,String text,View.OnClickListener action) {
        Button b=new Button(this); b.setText(text); b.setAllCaps(false); row.addView(b); b.setOnClickListener(action); return b;
    }
    @Override protected void onStart(){super.onStart();updates.observe(render);}
    @Override protected void onStop(){updates.remove(render);super.onStop();}
    private void render() {
        Updates.Release r=updates.release;
        boolean available=r!=null && r.apk!=null, downloading="downloading".equals(updates.phase);
        notes.setText(available?r.notes:""); notes.setVisibility(available && !r.notes.isEmpty()?View.VISIBLE:View.GONE);
        progress.setVisibility(downloading?View.VISIBLE:View.GONE);
        full.setVisibility(available && r.delta!=null && ("available".equals(updates.phase)||"error".equals(updates.phase))?View.VISIBLE:View.GONE);
        if(available)full.setText("下载完整包 · "+r.apk.displaySize());
        primary.setEnabled(true);
        String label, text;
        switch(updates.phase) {
            case "checking": text="正在检查 GitHub 正式版…";label="正在检查";primary.setEnabled(false);break;
            case "current": text="已是最新正式版"; label="重新检查"; break;
            case "available": text="有新版本可用 · "+r.version;label=downloadLabel(r);break;
            case "downloading":
                int percent=(int)(updates.received*100/updates.selected.size);
                text=updates.message+" · "+percent+"%";progress.setProgress(percent);label="取消下载";break;
            case "ready": text="安装包已校验 · "+r.version;label="安装更新";break;
            case "error": text=updates.message;label=available?"重试 · "+downloadLabel(r):"重新检查";break;
            default: text="";label="检查更新";
        }
        status.setText(text);primary.setText(label);
    }
    private String downloadLabel(Updates.Release r) {
        return r.delta!=null?"增量更新 · "+r.delta.displaySize():"下载完整包 · "+r.apk.displaySize();
    }
    private void primaryAction() {
        switch(updates.phase) {
            case "ready": install(); return;
            case "downloading": updates.cancel();return;
            case "checking": return;
            default:
                if(updates.release!=null && updates.release.apk!=null)updates.download(updates.release.delta==null);
                else updates.check(false);
        }
    }
    private void install() {
        if(updates.ready==null || !updates.ready.isFile()){updates.check(false);return;}
        try {
            if(Build.VERSION.SDK_INT>=26 && !getPackageManager().canRequestPackageInstalls()){
                startActivityForResult(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,Uri.parse("package:"+getPackageName())),42);return;
            }
            Uri uri=new Uri.Builder().scheme("content").authority(getPackageName()+".jmupdate").appendPath(updates.ready.getName()).build();
            Intent intent=new Intent(Intent.ACTION_VIEW).setDataAndType(uri,UpdateFileProvider.TYPE);
            intent.setClipData(ClipData.newRawUri("JM 洁净版更新",uri));intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            startActivity(intent);
        } catch (RuntimeException e) {Toast.makeText(this,"无法打开系统安装界面，可从 GitHub Release 下载",Toast.LENGTH_LONG).show();}
    }
    @Override protected void onActivityResult(int code,int result,Intent data) {
        super.onActivityResult(code,result,data);
        if(code==42 && Build.VERSION.SDK_INT>=26 && getPackageManager().canRequestPackageInstalls())install();
    }
}
