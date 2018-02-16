package com.nullsky.fba;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import com.fba.ActivityLog;
import com.fba.GetHtml;

public class MainActivity extends AppCompatActivity {
    public static MainActivity instance;

    public static String c_user = "";
    public WebView webview;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        instance = this;
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        webview = (WebView)findViewById(R.id.webview);

        webview.getSettings().setJavaScriptEnabled(true);
        webview.setWebViewClient(new WebViewClient(){
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                Toast.makeText(getApplicationContext(),url, Toast.LENGTH_LONG).show();
                super.onPageStarted(view, url, favicon);
            }
            @Override
            public void onPageFinished(WebView view, String url){
                String cookiesString = CookieManager.getInstance().getCookie(url);
                if(cookiesString!= null){
                    String[] temp=cookiesString.split(";");
                    for (String ar1 : temp ){
                        if(ar1.contains("c_user")){
                            String[] temp1=ar1.split("=");
                            c_user = temp1[1];
                            Toast.makeText(getApplicationContext(), c_user, Toast.LENGTH_LONG).show();
                            new ActivityLog(getApplicationContext()).checkActivityLogChanges();
                        }
                    }
                }
                CookieSyncManager.getInstance().sync();
            }

            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                //todo error??
            }
        });
        webview.loadUrl("https://mbasic.facebook.com/");
    }
}
