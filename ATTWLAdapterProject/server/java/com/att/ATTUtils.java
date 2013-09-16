package com.att;

import java.util.HashMap;
import java.util.Map.Entry;



public class ATTUtils
{
	public static void printHashMap(HashMap<String, String> map)
	{
		for (Entry<String, String> entryPair:map.entrySet())
        {
             System.out.println(entryPair.getKey() + ": " + entryPair.getValue());
        }
	}
}