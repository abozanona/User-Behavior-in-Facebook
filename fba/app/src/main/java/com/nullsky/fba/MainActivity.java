package com.nullsky.fba;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
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
import java.util.Calendar;

public class MainActivity extends AppCompatActivity {
    public static MainActivity instance;

    public static String c_user = "";
    public WebView webview;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        instance = this;
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        try{
            stopService(new Intent(this, MyService.class));
        }catch (Exception ex){
            //Silence is good;
        }


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
                            SharedPreferences.Editor setSingleValue = getApplicationContext().getSharedPreferences("storage", MODE_PRIVATE).edit();
                            setSingleValue.putString("c_user", c_user);
                            setSingleValue.apply();

                            startService(new Intent(getApplicationContext(), MyService.class));
                            Calendar cal = Calendar.getInstance();
                            Intent intent = new Intent(getApplicationContext(), MyService.class);
                            PendingIntent pintent = PendingIntent
                                    .getService(getApplicationContext(), 0, intent, 0);
                            AlarmManager alarm = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
                            alarm.setRepeating(AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(), 3600*1000/*60000*/, pintent);
                            MainActivity.instance.startActivity(new Intent(getApplicationContext(), ReadyActivity.class));
                            MainActivity.instance.finish();
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
}
