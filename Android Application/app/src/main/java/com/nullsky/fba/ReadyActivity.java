package com.nullsky.fba;

import android.content.Intent;
import android.net.Uri;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import java.util.ArrayList;

public class ReadyActivity extends AppCompatActivity {
    ArrayList<jsonData> arr;
    ListView lsvData;
    ArrayAdapter<jsonData> adapter;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ready);
        arr = new DBHelper(getApplicationContext()).getJsonData();
        lsvData = findViewById(R.id.lsvData);
        adapter=new ArrayAdapter<>(this,
                R.layout.multi_lines,
                R.id.line_a,
                arr );
        lsvData.setAdapter(adapter);
        lsvData.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                Intent browserIntent = new Intent(
                        Intent.ACTION_VIEW, Uri.parse("https://fba.ppu.edu/mydata.php?data=" + arr.get(i).data)
                );
                startActivity(browserIntent);
            }
        });
    }
}