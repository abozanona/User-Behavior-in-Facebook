package com.fba;

import android.annotation.SuppressLint;
import android.content.Context;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import com.nullsky.fba.MainActivity;

public abstract class GetHtml {
    private Context context;

    public abstract void getHtmlListener(String html);
    public GetHtml(final String url){
        MainActivity.instance.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                context = MainActivity.instance.getApplicationContext();
                final WebView wv = new WebView(context);
                wv.getSettings().setJavaScriptEnabled(true);

                wv.addJavascriptInterface(new MyJavaScriptInterface(), "HTMLOUT");
                wv.setWebViewClient(new WebViewClient() {
                    @Override
                    public void onPageFinished(WebView view, String url) {
                        wv.loadUrl("javascript:window.HTMLOUT.processHTML('<html>'+document.getElementsByTagName('html')[0].innerHTML+'</html>');");
                        CookieSyncManager.getInstance().sync();
                    }
                });

                wv.loadUrl(url);
            }
        });
    }
    class MyJavaScriptInterface {

        @SuppressWarnings("unused")
        @JavascriptInterface
        public void processHTML(String html)
        {
            getHtmlListener(html);
        }

    }
}
