package com.nullsky.fba;

/**
 * Created by Nullsky on 3/16/2018.
 */

import android.app.Service;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.IBinder;
import android.widget.Toast;

import com.fba.ActivityLog;
import com.fba.CallbackResponce;
import com.fba.GetHtml;
import com.jsoup.Jsoup;
import com.jsoup.nodes.Document;
import com.jsoup.select.Elements;

import java.util.ArrayList;

public class MyService extends Service {
    public ArrayList<String> log_filters;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
    @Override
    public void onCreate() {
    }

    @Override
    public void onStart(Intent intent, int startId) {
        SharedPreferences getSingleValue = this.getSharedPreferences("storage", MODE_PRIVATE);
        String c_user = getSingleValue.getString("c_user", "");
        if(c_user.equals("")){
            Intent i = new Intent(this, MainActivity.class);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(i);
            return;
        }

        getFilters(new CallbackResponce(){
            @Override
            public void Callback(Object... obj) {
                log_filters = (ArrayList<String>)obj[0];
                new ActivityLog(getApplicationContext()).checkActivityLogChanges(log_filters);
            }
        });
        //Toast.makeText(this, "New data was collected about you.", Toast.LENGTH_LONG).show();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
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