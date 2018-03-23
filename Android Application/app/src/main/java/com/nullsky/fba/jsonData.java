package com.nullsky.fba;

/**
 * Created by Nullsky on 3/22/2018.
 */

public class jsonData {
    public int id;
    public String data;

    public jsonData(int id, String data) {
        this.id = id;
        this.data = data;
    }

    @Override
    public String toString() {
        return data;
    }
}
