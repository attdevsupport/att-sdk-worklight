package com.att;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.util.List;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;

import org.mozilla.javascript.Scriptable;

import com.ibm.json.java.JSONObject;
import com.sun.org.apache.xml.internal.security.utils.Base64;
import com.worklight.server.integration.api.JSObjectConverter;

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
			HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
			
			conn.setDoOutput(true);
			conn.setDoInput(true);
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Authorization", (String) args.get(ATTConstant.ARG_TOKEN));
			if (args.containsKey(ATTConstant.ARG_HEADER_CONTENT_TYPE)) {
				conn.setRequestProperty("Content-Type",
						(String)args.get(ATTConstant.ARG_HEADER_CONTENT_TYPE));
			}
			
			if (args.containsKey(ATTConstant.ARG_HEADER_CONTENT_LANGUAGE)) {
				conn.setRequestProperty("Content-Language", (String)args.get(ATTConstant.ARG_HEADER_CONTENT_LANGUAGE));
			} else {
				conn.setRequestProperty("Content-Language", ATTConstant.VAL_EN_US);
			}			

			if (args.containsKey(ATTConstant.ARG_HEADER_XSPEECH_CONTEXT)) {
				conn.setRequestProperty("X-SpeechContext",
						(String)args.get(ATTConstant.ARG_HEADER_XSPEECH_CONTEXT));
			}
			
			if (args.containsKey(ATTConstant.ARG_HEADER_XSPEECH_SUBCONTEXT)) {
				conn.setRequestProperty("X-SpeechSubContext",
						(String)args.get(ATTConstant.ARG_HEADER_XSPEECH_SUBCONTEXT));
			}
			
			if (args.containsKey(ATTConstant.ARG_HEADER_ACCEPT)) {
				conn.setRequestProperty("Accept", (String)args.get(ATTConstant.ARG_HEADER_ACCEPT));
			}
					
			String clientSdk = "ClientSdk=Worklight-" + (String)args.get("platform") + "-2.3.0.0";
			if (args.containsKey(ATTConstant.ARG_HEADER_XARG)) {
				conn.setRequestProperty("X-Arg", (String)args.get(ATTConstant.ARG_HEADER_XARG)+ "," + clientSdk);
			} else {
				conn.setRequestProperty("X-Arg", clientSdk);
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
			//@SuppressWarnings("unchecked")
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
	
	public JSONObject textToSpeech(Object input)
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
			
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Authorization", (String) args.get(ATTConstant.ARG_TOKEN));
			
			if (args.containsKey(ATTConstant.ARG_HEADER_CONTENT_TYPE))
			{
				conn.setRequestProperty("Content-Type",
					(String)args.get(ATTConstant.ARG_HEADER_CONTENT_TYPE));
			} else {
				conn.setRequestProperty("Content-Type", "text/plain");				
			}
			
			if (args.containsKey(ATTConstant.ARG_HEADER_ACCEPT)) {
				conn.setRequestProperty(ATTConstant.ARG_HEADER_ACCEPT, (String)args.get(ATTConstant.ARG_HEADER_ACCEPT));
			} else {
				conn.setRequestProperty(ATTConstant.ARG_HEADER_ACCEPT, ATTConstant.VAL_CONTENT_TYPE_AMRWB);
			}
						
			if (args.containsKey(ATTConstant.ARG_HEADER_CONTENT_LANGUAGE)) {
				conn.setRequestProperty("Content-Language", (String)args.get(ATTConstant.ARG_HEADER_CONTENT_LANGUAGE));
			} else {
				conn.setRequestProperty("Content-Language", ATTConstant.VAL_EN_US);
			}
			
			String body = (String)args.get(ATTConstant.ARG_BODY);
			conn.setRequestProperty("Content-Length", Integer.toString(body.length()));
			
			if (args.containsKey(ATTConstant.ARG_HEADER_XARG)) {
				conn.setRequestProperty("X-Arg", (String)args.get(ATTConstant.ARG_HEADER_XARG));
			} 

			System.out.println("********* Speech JAVA ADAPTER LOGS ***********");		
			
			OutputStreamWriter outStream = new OutputStreamWriter(
					conn.getOutputStream());
			outStream.write(body);
			outStream.flush();
			outStream.close();
			
			/*@SuppressWarnings("unchecked")
			Map<String,List<String>> header = conn.getHeaderFields();
			for (String key: header.keySet ())
			   System.out.println (key+": "+conn.getHeaderField (key));	
		    */
			
			int responseCode = conn.getResponseCode();
			String responseCodeString = Integer.toString(responseCode);
			JSONObject response = new JSONObject();
			response.put("code", responseCodeString);
			
			if (responseCode < 400) { // Handle binary response
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
                
                String encodedBody = Base64.encode(binaryBody); Base64.encode(binaryBody, iContentLength);
				response.put("content", encodedBody.toString());
				response.put("contentType", conn.getHeaderField("Content-Type") + ";base64");
				response.put("contentLength", conn.getHeaderField("Content-Length"));
			} else { // handle html response
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
