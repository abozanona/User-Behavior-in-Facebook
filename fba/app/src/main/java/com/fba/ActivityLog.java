package com.fba;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.jsoup.Jsoup;
import com.jsoup.nodes.Document;
import com.jsoup.select.Elements;
import com.nullsky.fba.MainActivity;

import org.json.JSONArray;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static android.content.Context.MODE_PRIVATE;



public class ActivityLog {
    private SharedPreferences.Editor setSingleValue;
    private SharedPreferences getSingleValue;

    @SuppressLint("CommitPrefEdits")
    public ActivityLog(Context context) {
        setSingleValue = context.getSharedPreferences("storage", MODE_PRIVATE).edit();
        getSingleValue = context.getSharedPreferences("storage", MODE_PRIVATE);
    }

    private int dayMillis = 24 * 60 * 60 * 1000;

    public void checkActivityLogChanges() {
        Date today = new Date();
        long activityLogTimeNumber = getSingleValue.getLong("activityLogTime", 0);
        Date time = new Date(activityLogTimeNumber);
        //todo debugging only if (activityLogTimeNumber == 0) {
        if (activityLogTimeNumber != 0) {
            setSingleValue.putLong("activityLogTime", today.getTime());
            setSingleValue.apply();
            time = new Date(new Date().getTime() - dayMillis * 3);
        }
        int daysDifference = (int) ((today.getTime() - time.getTime()) / (dayMillis));
        if (daysDifference > 1) {
            Date lastCheck = new Date();
            lastCheck = new Date(lastCheck.getTime() - daysDifference * dayMillis);
            for (long d = lastCheck.getTime(); d <= new Date().getTime(); d += dayMillis) {
                //todo ???????????????
                getActivityLogData(d);
            }
            setSingleValue.putLong("activityLogTime", today.getTime());
            setSingleValue.apply();
        }
    }

    private void getFilters(final CallbackResponce fn) {
        String userId = MainActivity.c_user;
        new GetHtml("https://mbasic.facebook.com/allactivity/options?id=" + userId) {
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

    private void getActivityLogData(final long date0) {
        final String userId = MainActivity.c_user;

        getFilters(new CallbackResponce() {
            @Override
            public void Callback(Object... obj) {
                ArrayList<String> log_filters = (ArrayList<String>)obj[0];
                for (int i = 0; i < log_filters.size(); i++) {
                    String log_filter = log_filters.get(i);
                    Date date = new Date(date0);
                    Date date2 = new Date(date0);
                    date2 = new Date(date2.getTime() -  dayMillis);
                    String url = "https://mbasic.facebook.com/" + userId + "/allactivity?timeend="
                            + (int)(date.getTime() / 1000) + "&timestart="
                            + (int)(date2.getTime() / 1000) + "&log_filter="
                            + log_filter;

                    new GetHtml(url){
                        @Override
                        public void getHtmlListener(String html) {
                            final ArrayList<String> links = new ArrayList<>();
                            Document dom0 = Jsoup.parse(html);
                            Elements dom = dom0.select("a");
                            for(int i=0;i<dom.size();i++){
                                if(!dom.get(i).hasAttr("href"))
                                    continue;
                                String _link = dom.get(i).attr("href");
                                if(_link != null){
                                    _link = replaceWithHash(_link);
                                    if(_link.length()!=0){
                                        links.add(_link);
                                    }
                                }
                            }
                            if (links.size()!=0){
                                String url = "https://fba.ppu.edu/submitStudyResults.php";
                                RequestQueue queue = Volley.newRequestQueue(MainActivity.instance);
                                StringRequest postRequest = new StringRequest(Request.Method.POST, url,
                                        new Response.Listener<String>()
                                        {
                                            @Override
                                            public void onResponse(String response) {
                                                // response
                                                Log.d("Response", response);
                                            }
                                        },
                                        new Response.ErrorListener()
                                        {
                                            @Override
                                            public void onErrorResponse(VolleyError error) {
                                            }
                                        }
                                ) {
                                    @Override
                                    protected Map<String, String> getParams()
                                    {

                                        String uuid = getSingleValue.getString("clientId", "");
                                        if(uuid.equals("")) {
                                            uuid = "mobile" + UUID.randomUUID().toString();
                                            setSingleValue.putString("clientId", uuid);
                                        }
                                        JSONArray arr = new JSONArray();
                                        for(int i=0;i<links.size();i++)
                                            arr.put(links.get(i));
                                        TelephonyManager tMgr = (TelephonyManager)MainActivity.instance.getSystemService(Context.TELEPHONY_SERVICE);
                                        @SuppressLint("MissingPermission")
                                        String mPhoneNumber = tMgr.getLine1Number();
                                        Map<String, String>  params = new HashMap<String, String>();
                                        params.put("clientId", mPhoneNumber);
                                        params.put("data", links.toString());

                                        return params;
                                    }
                                };
                                queue.add(postRequest);
                            }
                        }
                    };
                }
            }
        });
    }

    private String replaceWithHash(String str){
        //todo hashing thing here
        boolean isDigitFound = false;
        StringBuilder result = new StringBuilder();
        StringBuilder number = new StringBuilder();
        for(int i=0;i<str.length();i++){
            if(str.charAt(i)>='0' && str.charAt(i)<='9'){
                isDigitFound = true;
                number.append(str.charAt(i));
            }
            else{
                if(!number.toString().equals("")){
                    result.append("XXXXXXXX");
                    number = new StringBuilder();
                }
                result.append(str.charAt(i));
            }
        }
        if(number.length()!=0){
            result.append("XXXXXXXX");
        }
        return (isDigitFound)?result.toString():"";
    }

}
