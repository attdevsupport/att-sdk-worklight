package com.att;

import java.io.BufferedInputStream;
import java.net.URI;
import java.net.URL;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.entity.StringEntity;
import org.apache.http.protocol.HTTP;
import org.mozilla.javascript.Scriptable;

import com.ibm.json.java.JSONObject;
import com.sun.org.apache.xml.internal.security.utils.Base64;
import com.worklight.adapters.http.ssl.DelegatingTrustManager;
import com.worklight.common.js.util.JSObjectConverter;
import com.worklight.common.util.HttpUtil;

import java.security.KeyStore;
import java.util.logging.Logger;

public class SpeechHelper
{
	public JSONObject speechToText(Object input)
	{
		JSONObject args = (JSONObject) JSObjectConverter.scriptableToJSON((Scriptable) input);
		JSONObject theReturn = null;
		URL url = null;
		
		try
		{
			System.out.println("********* Speech JAVA ADAPTER LOGS ***********");
			
			theReturn = new JSONObject();
			//most of the code here is Apache HTTP Client v4.1 except the class HttpUtil
			HttpClient httpClient =  HttpUtil.createHttpClient(1);
			TrustManager tm = new DelegatingTrustManager((KeyStore) null);
			SSLContext sslContext = SSLContext.getInstance("TLS");
			sslContext.init(null, new TrustManager[] { tm }, null);
			SSLSocketFactory sslSocketFactory = new SSLSocketFactory(sslContext);

			// register SSL socket factory for HTTPS
			Scheme https = new Scheme("https", 443, sslSocketFactory);
		
			httpClient.getConnectionManager().getSchemeRegistry().register(https);

			url = new URL((String) args.get(ATTConstant.ARG_URL));
			URI uri = url.toURI();

	        HttpPost request = new HttpPost(uri);

	        request.addHeader("Authorization", (String) args.get(ATTConstant.ARG_TOKEN));
			if (args.containsKey(ATTConstant.ARG_HEADER_CONTENT_TYPE)) {
				request.addHeader("Content-Type",
						(String)args.get(ATTConstant.ARG_HEADER_CONTENT_TYPE));
			}
			
			if (args.containsKey(ATTConstant.ARG_HEADER_CONTENT_LANGUAGE)) {
				request.addHeader("Content-Language", (String)args.get(ATTConstant.ARG_HEADER_CONTENT_LANGUAGE));
			} else {
				request.addHeader("Content-Language", ATTConstant.VAL_EN_US);
			}			

			if (args.containsKey(ATTConstant.ARG_HEADER_XSPEECH_CONTEXT)) {
				request.addHeader("X-SpeechContext",
						(String)args.get(ATTConstant.ARG_HEADER_XSPEECH_CONTEXT));
			}
			
			if (args.containsKey(ATTConstant.ARG_HEADER_XSPEECH_SUBCONTEXT)) {
				request.addHeader("X-SpeechSubContext",
						(String)args.get(ATTConstant.ARG_HEADER_XSPEECH_SUBCONTEXT));
			}
			
			if (args.containsKey(ATTConstant.ARG_HEADER_ACCEPT)) {
				request.addHeader("Accept", (String)args.get(ATTConstant.ARG_HEADER_ACCEPT));
			}
					
			String clientSdk = "ClientSdk=att_worklight-" + (String)args.get("platform") + "-" + 
			   ATTConstant.ARG_HEADER_XARG_VERSION;
			if (args.containsKey(ATTConstant.ARG_HEADER_XARG)) {
				request.addHeader("X-Arg", (String)args.get(ATTConstant.ARG_HEADER_XARG)+ "," + clientSdk);
			} else {
				request.addHeader("X-Arg", clientSdk);
			}
			
			String base64AudioString = (String)args.get(ATTConstant.ARG_FILEOBJECT);
			Logger logger = Logger.getLogger("Speech Adapter");
            logger.info("Base64 audio string starts with: " + base64AudioString.substring(0, 
            	Math.min(15, Math.max(0, base64AudioString.length()-1))) + "...");
            
			byte[] decoded = Base64.decode(base64AudioString);
			
			ByteArrayEntity entity=new ByteArrayEntity(decoded);
			request.setEntity(entity);		
			
			HttpResponse httpResponse = httpClient.execute(request);
			
			theReturn.put("message", JSONObject.parse(httpResponse.getEntity().getContent()));
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
				message = url.toString() + " " + e.getLocalizedMessage();//ATTConstant.ERR_PROCESS_REQ_MSG;
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
//		Logger logger = Logger.getLogger("Speech Adapter");
		
		try
		{
			theReturn = new JSONObject();
			
			HttpClient httpClient =  HttpUtil.createHttpClient(1);
			TrustManager tm = new DelegatingTrustManager((KeyStore) null);
			SSLContext sslContext = SSLContext.getInstance("TLS");
			sslContext.init(null, new TrustManager[] { tm }, null);
			SSLSocketFactory sslSocketFactory = new SSLSocketFactory(sslContext);

			// register SSL socket factory for HTTPS
			Scheme https = new Scheme("https", 443, sslSocketFactory);
		
			httpClient.getConnectionManager().getSchemeRegistry().register(https);
			
			url = new URL((String) args.get(ATTConstant.ARG_URL));
			URI uri = url.toURI();
	        
			HttpPost request = new HttpPost(uri);			
			
			request.addHeader("Authorization", (String) args.get(ATTConstant.ARG_TOKEN));
			
			if (args.containsKey(ATTConstant.ARG_HEADER_CONTENT_TYPE))
			{
				request.addHeader("Content-Type",
					(String)args.get(ATTConstant.ARG_HEADER_CONTENT_TYPE));
			} else {
				request.addHeader("Content-Type", "text/plain");				
			}
			
			if (args.containsKey(ATTConstant.ARG_HEADER_ACCEPT)) {
				request.addHeader(ATTConstant.ARG_HEADER_ACCEPT, (String)args.get(ATTConstant.ARG_HEADER_ACCEPT));
			} else {
				request.addHeader(ATTConstant.ARG_HEADER_ACCEPT, ATTConstant.VAL_CONTENT_TYPE_AMRWB);
			}
						
			if (args.containsKey(ATTConstant.ARG_HEADER_CONTENT_LANGUAGE)) {
				request.addHeader("Content-Language", (String)args.get(ATTConstant.ARG_HEADER_CONTENT_LANGUAGE));
			} else {
				request.addHeader("Content-Language", ATTConstant.VAL_EN_US);
			}
			
			String body = (String)args.get(ATTConstant.ARG_BODY);
			
			if (args.containsKey(ATTConstant.ARG_HEADER_XARG)) {
				request.addHeader("X-Arg", (String)args.get(ATTConstant.ARG_HEADER_XARG));
			}
			
			String clientSdk = "ClientSdk=att.worklight." + ATTConstant.ARG_HEADER_XARG_VERSION;
			if (args.containsKey(ATTConstant.ARG_HEADER_XARG)) {
				request.addHeader("X-Arg", (String)args.get(ATTConstant.ARG_HEADER_XARG)+ "," + clientSdk);
			} else {
				request.addHeader("X-Arg", clientSdk);
			}			
			
			StringEntity entity = new StringEntity(body, HTTP.UTF_8);
			request.setEntity(entity);
			
			HttpResponse httpResponse = httpClient.execute(request);
			
			int responseCode = httpResponse.getStatusLine().getStatusCode();
			String responseCodeString = Integer.toString(responseCode);
			JSONObject response = new JSONObject();
			response.put("code", responseCodeString);
			
			if (responseCode < 400 && httpResponse.containsHeader("Content-Length")) { // Handle binary response
				// Get all the headers to pass through
				// Read the response and convert to base64
				BufferedInputStream inputStream = new BufferedInputStream(httpResponse.getEntity().getContent());
				
				int iContentLength = Integer.parseInt(httpResponse.getHeaders("Content-Length")[0].getValue());
				int totalRead = 0;
				int currentRead = 0;
                byte[] binaryBody = new byte[iContentLength];
                do {
                   currentRead = inputStream.read(binaryBody, totalRead, iContentLength-totalRead);
                   totalRead += currentRead;
                } while (totalRead < iContentLength);
                
                String encodedBody = Base64.encode(binaryBody); Base64.encode(binaryBody, iContentLength);
				response.put("content", encodedBody.toString());
				response.put("contentType", httpResponse.getHeaders("Content-Type")[0] + ";base64");
				response.put("contentLength", encodedBody.length());
			} else { // handle html response
				response.put("error", JSONObject.parse(httpResponse.getEntity().getContent()));				
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
				message = e.toString(); //ATTConstant.ERR_PROCESS_REQ_MSG;
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
