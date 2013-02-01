package com.att;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mozilla.javascript.Scriptable;

import com.ibm.json.java.JSONObject;
import com.sun.org.apache.xml.internal.security.utils.Base64;
import com.worklight.server.integration.api.JSObjectConverter;
import sun.net.www.protocol.https.HttpsURLConnectionImpl;



public class SpeechHelper
{
	public JSONObject speechToText(Object input)
	{
		JSONObject args = (JSONObject) JSObjectConverter.scriptableToJSON((Scriptable) input);
		JSONObject theReturn = null;
		URL url = null;
		try
		{
			theReturn = new JSONObject();
			String host = (String) args.get(ATTConstant.ARG_URL);
			url = new URL(host);
			HttpsURLConnectionImpl conn = (HttpsURLConnectionImpl) url.openConnection();
			conn.setDoOutput(true);
			conn.setDoInput(true);
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Authorization", (String) args.get(ATTConstant.ARG_TOKEN));
			if (args.containsKey(ATTConstant.ARG_HEADER_CONTENT_TYPE)) {
				conn.setRequestProperty("Content-Type",
						(String)args.get(ATTConstant.ARG_HEADER_CONTENT_TYPE));
			}

			if (args.containsKey(ATTConstant.ARG_HEADER_XSPEECH_CONTENT)) {
				conn.setRequestProperty("X-SpeechContext",
						(String)args.get(ATTConstant.ARG_HEADER_XSPEECH_CONTENT));
			}
			if (args.containsKey(ATTConstant.ARG_HEADER_TRANSFER_ENCODING)) {
				conn.setRequestProperty("Transfer-Encoding",
						(String)args.get(ATTConstant.ARG_HEADER_TRANSFER_ENCODING));
			}
			if (args.containsKey(ATTConstant.ARG_HEADER_ACCEPT)) {
				conn.setRequestProperty("Accept", (String)args.get(ATTConstant.ARG_HEADER_ACCEPT));
			}
						
			String base64AudioString = (String)args.get(ATTConstant.ARG_FILEOBJECT);
			byte[] decoded = Base64.decode(base64AudioString);
			String decodedBinaryString = new String(decoded); 
			OutputStreamWriter wr = new OutputStreamWriter(
					conn.getOutputStream());
			wr.write(decodedBinaryString);
			wr.flush();
			wr.close();
			System.out.println("********* Speech JAVA ADAPTER LOGS ***********");
			System.out.println("Headers***********");
			@SuppressWarnings("unchecked")
			Map<String,List<String>> header = conn.getHeaderFields();
			for (String key: header.keySet ())
			   System.out.println (key+": "+conn.getHeaderField (key));
			
			JSONObject response = new JSONObject();
			if (conn.getResponseCode() < 400) {
				response = JSONObject.parse(conn.getInputStream());
			} else {
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
	
	public JSONObject refundTheTransaction(Object input)
	{
		JSONObject args = (JSONObject) JSObjectConverter.scriptableToJSON((Scriptable) input);
		JSONObject theReturn = null;
		URL url = null;
		try
		{
			theReturn = new JSONObject();
			String host = (String) args.get(ATTConstant.ARG_URL);
			url = new URL(host);
			HttpsURLConnectionImpl conn = (HttpsURLConnectionImpl) url.openConnection();
			conn.setDoOutput(true);
			conn.setDoInput(true);
			conn.setRequestMethod("PUT");
			conn.setRequestProperty("Authorization", (String) args.get(ATTConstant.ARG_TOKEN));
			if (args.containsKey(ATTConstant.ARG_HEADER_CONTENT_TYPE)) {
				conn.setRequestProperty("Content-Type",
						(String)args.get(ATTConstant.ARG_HEADER_CONTENT_TYPE));
			}
			if (args.containsKey(ATTConstant.ARG_HEADER_ACCEPT)) {
				conn.setRequestProperty("Accept", (String)args.get(ATTConstant.ARG_HEADER_ACCEPT));
			}
						
			JSONObject bodyJson=(JSONObject)args.get("body");
			String body=bodyJson.toString();
			System.out.println("body is :"+body);
			OutputStreamWriter wr = new OutputStreamWriter(
					conn.getOutputStream());
			wr.write(body);
			wr.flush();
			wr.close();
			@SuppressWarnings("unchecked")
			Map<String,List<String>> header = conn.getHeaderFields();
			for (String key: header.keySet ())
			   System.out.println (key+": "+conn.getHeaderField (key));
			
			JSONObject response = new JSONObject();
			if (conn.getResponseCode() < 400) {
				response = JSONObject.parse(conn.getInputStream());
			} else {
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
