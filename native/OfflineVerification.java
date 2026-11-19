package org.jmclean.backup;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.webkit.*;
import android.widget.*;

/** The source's verification/redirect page stays inside the app until it yields a download. */
public final class OfflineVerification extends Activity {
    private WebView web;
    private String id,attempt,reason="已取消验证，可重新下载";
    private boolean submitted;
    @Override public void onCreate(Bundle state){
        super.onCreate(state);
        id=getIntent().getStringExtra("id");attempt=getIntent().getStringExtra("attempt");
        String url=getIntent().getStringExtra("url");
        if(id==null||attempt==null||url==null||!OfflineLibrary.web(url)){finish();return;}
        LinearLayout root=new LinearLayout(this);root.setOrientation(LinearLayout.VERTICAL);
        LinearLayout bar=new LinearLayout(this);bar.setBackgroundColor(0xff323232);
        Button back=new Button(this);back.setText("返回");back.setOnClickListener(v->finish());bar.addView(back);
        TextView title=new TextView(this);title.setText("下载验证");title.setTextColor(Color.WHITE);title.setTextSize(18);bar.setGravity(android.view.Gravity.CENTER_VERTICAL);bar.addView(title);root.addView(bar);
        ProgressBar progress=new ProgressBar(this,null,android.R.attr.progressBarStyleHorizontal);root.addView(progress);
        web=new WebView(this);root.addView(web,new LinearLayout.LayoutParams(-1,0,1));setContentView(root);
        WebSettings s=web.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setAllowFileAccess(false);s.setAllowContentAccess(false);s.setJavaScriptCanOpenWindowsAutomatically(false);
        web.setWebChromeClient(new WebChromeClient(){public void onProgressChanged(WebView view,int value){progress.setProgress(value);progress.setVisibility(value==100?android.view.View.GONE:android.view.View.VISIBLE);}});
        web.setWebViewClient(new WebViewClient(){
            @Override public boolean shouldOverrideUrlLoading(WebView view,String uri){return !OfflineLibrary.web(uri);}
            @Override public void onReceivedError(WebView view,WebResourceRequest req,WebResourceError error){if(req.isForMainFrame()&&!submitted){reason="验证页面暂时无法加载，可重新下载";finish();}}
        });
        web.setDownloadListener((link,agent,description,type,length)->{
            if(submitted)return;
            try{OfflineLibrary.get(this).enqueue(id,attempt,link,agent,web.getUrl());submitted=true;}
            catch(Exception ex){reason="无法开始下载，请检查下载目录和网络";}
            finish();
        });
        if(state==null||web.restoreState(state)==null)web.loadUrl(url);
    }
    @Override protected void onSaveInstanceState(Bundle out){super.onSaveInstanceState(out);if(web!=null)web.saveState(out);}
    @Override protected void onDestroy(){
        if(isFinishing()&&!submitted && id!=null && attempt!=null)OfflineLibrary.get(this).endGate(id,attempt,reason);
        if(web!=null){web.stopLoading();((android.view.ViewGroup)web.getParent()).removeView(web);web.destroy();}
        super.onDestroy();
    }
}
