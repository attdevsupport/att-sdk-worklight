package com.att;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.HashMap;
import java.util.Map.Entry;

import javax.net.ssl.HttpsURLConnection;

import org.mozilla.javascript.Scriptable;

import com.ibm.json.java.JSONObject;
import com.sun.org.apache.xml.internal.security.utils.Base64;
import com.worklight.common.js.util.JSObjectConverter;

public class ATTUtils
{
	public static void printHashMap(HashMap<String, String> map)
	{
		for (Entry<String, String> entryPair:map.entrySet())
        {
             System.out.println(entryPair.getKey() + ": " + entryPair.getValue());
        }
	}
	
	public JSONObject iamGetMessageContent(Object input)
	{
		JSONObject args = (JSONObject) JSObjectConverter.scriptableToJSON((Scriptable) input);
		JSONObject theReturn = null;
		URL url = null;
		try
		{
			theReturn = new JSONObject();
			String host = (String) args.get(ATTConstant.ARG_URL);
			url = new URL(host);
			
			HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
			
			conn.setDoOutput(true);
			conn.setDoInput(true);
			
			conn.setRequestMethod("GET");
			conn.setRequestProperty("Authorization", (String) args.get(ATTConstant.ARG_TOKEN));
			conn.setRequestProperty("Accept", "*/*");
			
			System.out.println("********* InAppMessaging GetMessageContent ***********");		
			
			int responseCode = conn.getResponseCode();
			String responseCodeString = Integer.toString(responseCode);
			JSONObject response = new JSONObject();
			response.put("code", responseCodeString);
			
			if (responseCode < 400) {
				String contentType = conn.getHeaderField("Content-Type");
				contentType = contentType.toLowerCase();
				if(contentType.contains("image/") || contentType.contains("audio/") || contentType.contains("video/")) {
					// Handle binary response
					// Get all the headers to pass through
					// Read the response and convert to base64
					BufferedInputStream inputStream = new BufferedInputStream(conn.getInputStream());
					
					int iContentLength = conn.getHeaderFieldInt("Content-Length", 0);
					int totalRead = 0;
					int currentRead = 0;
	                byte[] binaryBody = new byte[iContentLength];
	                do {
	                   currentRead = inputStream.read(binaryBody, totalRead, iContentLength-totalRead);
	                   totalRead += currentRead;
	                } while (totalRead < iContentLength);
	                
	                String encodedBody = Base64.encode(binaryBody, 0);
					response.put("base64", encodedBody.toString());
					response.put("contentType", conn.getHeaderField("Content-Type") + ";base64");
					response.put("contentLength", encodedBody.length());
				} else {
					StringBuffer contentString = new StringBuffer();
					BufferedReader is = new BufferedReader(new InputStreamReader(
							conn.getInputStream()));
					String str;
					while (null != ((str = is.readLine()))) {
						contentString.append(str);
					}
					is.close();
					response.put("content", contentString.toString());					
				}
			} else { // handle error response
				StringBuffer errorString = new StringBuffer();
				BufferedReader is = new BufferedReader(new InputStreamReader(
						conn.getErrorStream()));
				String str;
				while (null != ((str = is.readLine()))) {
					errorString.append(str);
				}
				is.close();
				response.put("error",errorString.toString());				
			}
			theReturn.put("message", response);
		}
		catch (Exception e) {
			e.printStackTrace();
			String message = null;
			String code = null;
			if (e.equals(ATTConstant.ERR_INV_STATUS_MSG)) {
				code = ATTConstant.ERR_INV_STATUS_CODE;
				message = ATTConstant.ERR_INV_STATUS_MSG;
			} else {
				code = ATTConstant.ERR_PROCESS_REQ_CODE;
				message = e.getLocalizedMessage();//ATTConstant.ERR_PROCESS_REQ_MSG;
			}
			theReturn.put(code, message);
			return theReturn;
		} finally {
			args.clear();
			args = null;
		}
		return theReturn;
	}	
}