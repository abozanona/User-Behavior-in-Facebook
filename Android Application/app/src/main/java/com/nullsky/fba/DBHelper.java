package com.nullsky.fba;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import java.util.ArrayList;

/**
 * Created by Nullsky on 3/22/2018.
 */

public class DBHelper extends SQLiteOpenHelper {
    //https://github.com/abozanona/hsoubIO/blob/master/app/src/main/java/com/rond/hsoub/Classes/DBHelper.java
    private static final String DATABASE_NAME = "hsoub.db";

    private static final String TABLE_DATA = "fba_data";
    public static final int version = 3;


    public DBHelper(Context context) {
        super(context, DATABASE_NAME, null, version);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL(
                "CREATE TABLE " + TABLE_DATA +
                        " ( id INTEGER PRIMARY KEY AUTOINCREMENT, jsonData TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
        );
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_DATA);
        onCreate(db);
    }

    public boolean setJsonData(String jsonData) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues contentValues = new ContentValues();
        contentValues.put("jsonData", jsonData);
        db.insertWithOnConflict(TABLE_DATA, null, contentValues, SQLiteDatabase.CONFLICT_REPLACE);
        return true;
    }

    public ArrayList<jsonData> getJsonData() {
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor res = db.rawQuery("SELECT * FROM " + TABLE_DATA + " WHERE 1", null);

        ArrayList<jsonData> arr = new ArrayList<>();
        if (res.moveToFirst()) {
            do{
                arr.add(new jsonData(res.getInt(1), res.getString(2)));
            }while (res.moveToNext());

        }
        res.close();
        return arr;
    }


    /*
    //basically for Communities & CommunitiesList
    public boolean setDictionary(String key, byte[] value) {

        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues contentValues = new ContentValues();
        contentValues.put("t_key", key);
        contentValues.put("value", value);
        db.insertWithOnConflict(TABLE_DICTIONARY, null, contentValues, SQLiteDatabase.CONFLICT_REPLACE);
        return true;
    }

    public byte[] getDictionary(String key) {
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor res = db.rawQuery("SELECT * FROM " + TABLE_DICTIONARY + " WHERE t_key='" + key + "'", null);

        byte[] obj = null;
        if (res.moveToFirst()) {
            obj = res.getBlob(1);
        }
        res.close();
        return obj;
    }
    */
}