package com.nullsky.fba;

import android.graphics.Bitmap;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.fba.ActivityLog;
import com.fba.CallbackResponce;
import com.fba.GetHtml;
import com.jsoup.Jsoup;
import com.jsoup.nodes.Document;
import com.jsoup.select.Elements;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {
    public static MainActivity instance;
    public ArrayList<String> log_filters;

    public static String c_user = "";
    public WebView webview;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        instance = this;
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        webview = findViewById(R.id.webview);

        webview.getSettings().setJavaScriptEnabled(true);
        webview.setWebViewClient(new WebViewClient(){
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
            }
            @Override
            public void onPageFinished(WebView view, String url){
                String cookiesString = CookieManager.getInstance().getCookie(url);
                if(cookiesString!= null && c_user.equals("")){
                    String[] temp=cookiesString.split(";");
                    for (String ar1 : temp ){
                        if(ar1.contains("c_user")){
                            String[] temp1=ar1.split("=");
                            c_user = temp1[1];
                            getFilters(new CallbackResponce(){
                                @Override
                                public void Callback(Object... obj) {
                                    log_filters = (ArrayList<String>)obj[0];
                                    new ActivityLog(getApplicationContext()).checkActivityLogChanges();
                                }
                            });
                            break;
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
    private void getFilters(final CallbackResponce fn) {
        String userId = MainActivity.c_user;
        String url = "https://mbasic.facebook.com/allactivity/options?id=" + userId;
        new GetHtml(url) {
            @Override
            public void getHtmlListener(String html) {
                Document dom0 = Jsoup.parse(html);
                Elements dom = dom0.select("li a");
                ArrayList<String> log_filters = new ArrayList<>();
                for (int i = 1; i < dom.size(); i++) {
                    String url = dom.get(i).attr("href");
                    log_filters.add(url.substring(url.lastIndexOf("=") + 1));
                }
                fn.Callback(log_filters);
            }
        };
    }

}
