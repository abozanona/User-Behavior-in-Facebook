package com.fba;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;
import android.text.format.DateFormat;
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
import java.util.Random;
import java.util.UUID;

import static android.content.Context.MODE_PRIVATE;


public class ActivityLog {
    private SharedPreferences.Editor setSingleValue;
    private SharedPreferences getSingleValue;

    @SuppressLint("CommitPrefEdits")
    public ActivityLog(Context context) {
        setSingleValue = context.getSharedPreferences("storage", MODE_PRIVATE).edit();
        getSingleValue = context.getSharedPreferences("storage", MODE_PRIVATE);
    }

    public void checkActivityLogChanges(ArrayList<String> log_filters) {
        int dayMillis = 24 * 60 * 60 * 1000;
        Date today3 = new Date(new Date().getTime() - dayMillis * 3);

        long lastReadDate = getSingleValue.getLong("lastReadDate", today3.getTime());
        if(Math.abs(lastReadDate - today3.getTime())<= dayMillis){
            int collectStartIndex = getSingleValue.getInt("collectStartIndex", -1);
            collectStartIndex++;
            if(collectStartIndex < log_filters.size()){
                setSingleValue.putInt("collectStartIndex", collectStartIndex);
                setSingleValue.apply();
                getActivityLogData(today3.getTime(), log_filters.get(collectStartIndex));
            }
        }
        else{
            setSingleValue.putLong("lastReadDate", today3.getTime());
            setSingleValue.putInt("collectStartIndex", -1);
            setSingleValue.apply();
        }
        //getActivityLogData(today3.getTime(), log_filters);
    }

    private void getActivityLogData(final long date, String log_filter) {
        final String userId = getSingleValue.getString("c_user", "");

        String url = "https://mbasic.facebook.com/" + userId + "/allactivity?log_filter="
                + log_filter;

        Log.d("ActivityLog", url);

        new GetHtml(url) {
            @Override
            public void getHtmlListener(String html) {
                final ArrayList<String> links = new ArrayList<>();
                Document dom0 = Jsoup.parse(html);
                int day =Integer.parseInt((String) DateFormat.format("dd",   date));
                int month =Integer.parseInt((String) DateFormat.format("MM",   date));
                int year =Integer.parseInt(((String) DateFormat.format("yyyy",   date)).substring(2));
                Elements tlUnit = dom0.select("#tlUnit_" + month + "_" + day + "_" + year);
                if(tlUnit == null){
                    return;
                }

                Elements dom = tlUnit.select("a");
                for (int i = 0; i < dom.size(); i++) {
                    if (!dom.get(i).hasAttr("href"))
                        continue;
                    String _link = dom.get(i).attr("href");
                    if (_link != null) {
                        _link = replaceWithHash(_link);
                        if (_link.length() != 0) {
                            links.add(_link);
                        }
                    }
                }
                if (links.size() != 0) {
                    String url = "https://fba.ppu.edu/submitStudyResults.php";
                    RequestQueue queue = Volley.newRequestQueue(MainActivity.instance);
                    StringRequest postRequest = new StringRequest(Request.Method.POST, url,
                            new Response.Listener<String>() {
                                @Override
                                public void onResponse(String response) {
                                    // response
                                    Log.d("Response", response);
                                }
                            },
                            new Response.ErrorListener() {
                                @Override
                                public void onErrorResponse(VolleyError error) {
                                }
                            }
                    ) {
                        @Override
                        protected Map<String, String> getParams() {

                            String uuid = getSingleValue.getString("clientId", "");
                            if (uuid.equals("")) {
                                uuid = "mobile" + UUID.randomUUID().toString();
                                setSingleValue.putString("clientId", uuid);
                            }
                            JSONArray arr = new JSONArray();
                            for (int i = 0; i < links.size(); i++)
                                arr.put(links.get(i));
                            String clientId = getSingleValue.getString("clientid", "");
                            if (clientId.equals("")) {
                                clientId = randomString();
                                setSingleValue.putString("clientid", clientId);
                                setSingleValue.apply();
                            }
                            Map<String, String> params = new HashMap<>();
                            params.put("clientId", clientId);
                            params.put("data", links.toString());

                            return params;
                        }
                    };
                    queue.add(postRequest);
                }
            }
        };
    }

    private String randomString() {
        Random generator = new Random();
        StringBuilder randomStringBuilder = new StringBuilder();
        int randomLength = generator.nextInt(30);
        char tempChar;
        for (int i = 0; i < randomLength; i++) {
            tempChar = (char) (generator.nextInt(96) + 32);
            randomStringBuilder.append(tempChar);
        }
        return randomStringBuilder.toString();
    }

    private String replaceWithHash(String str) {
        //todo hashing thing here
        boolean isDigitFound = false;
        StringBuilder result = new StringBuilder();
        StringBuilder number = new StringBuilder();
        for (int i = 0; i < str.length(); i++) {
            if (str.charAt(i) >= '0' && str.charAt(i) <= '9') {
                isDigitFound = true;
                number.append(str.charAt(i));
            } else {
                if (!number.toString().equals("")) {
                    result.append("XXXXXXXX");
                    number = new StringBuilder();
                }
                result.append(str.charAt(i));
            }
        }
        if (number.length() != 0) {
            result.append("XXXXXXXX");
        }
        return (isDigitFound) ? result.toString() : "";
    }

}
