package com.ATTWLKitchenSink;

import java.io.File;
import java.io.IOException;
import java.io.FileOutputStream;
import java.net.URI;

import android.media.MediaRecorder;
import android.util.Base64;

//import org.apache.cordova.api.CallbackContext;
//import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Recorder extends CordovaPlugin 
{
    private static MediaRecorder recorder;

	public boolean execute(String action,JSONArray args, CallbackContext callbackContext)
	{
		if(action.equalsIgnoreCase("start"))
		{
			return this.start(args);
			
		}else if(action.equalsIgnoreCase("stop"))
		{
			return this.stop();
			
		}else if(action.equalsIgnoreCase("writeBase64ToBinary"))
		{
			if(this.writeBase64ToBinary(args))
			{
				callbackContext.success();
			} else {
				callbackContext.error("callback failed");
			}
			return true;
		}
		return false;
	}

/**
 * Method used to start the Audio Recording.
 * @param args
 * @return boolean value
 */

public boolean start(JSONArray args)
{
	System.out.println("Recorder.start called");
	String filePath=null;
	int audioChannels = 0,samplingRate=0,encodingBitRate=0;
	JSONObject json = null;
	try {
		json = args.getJSONObject(0);
	} catch (JSONException e1) {
		
		e1.printStackTrace();
	}
	if(json.has("filePath"))
	{
		try {
			filePath = json.getString("filePath");
		} catch (JSONException e) {
			
			e.printStackTrace();
		}	
	}
	if(json.has("audioChannels"))
	{
		try {
			audioChannels = json.getInt("audioChannels");
		} catch (JSONException e) {
			
			e.printStackTrace();
		}	
	}
	if(json.has("samplingRate"))
	{
		try {
			samplingRate = json.getInt("samplingRate");
		} catch (JSONException e) {
			
			e.printStackTrace();
		}	
	}
	if(json.has("encodingBitRate"))
	{
		try {
			encodingBitRate = json.getInt("encodingBitRate");
		} catch (JSONException e) {
			
			e.printStackTrace();
		}	
	}
	boolean recordingStarted = false;
	try {
		recorder = new MediaRecorder();
		recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
		recorder.setOutputFormat(MediaRecorder.OutputFormat.AMR_NB);
		recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
		recorder.setOutputFile(filePath);
		recorder.setAudioChannels(audioChannels);
		recorder.setAudioSamplingRate(samplingRate);
		recorder.setAudioEncodingBitRate(encodingBitRate);
		try {
			System.out.println("Preparing recorder.....");
			recorder.prepare();
		} catch (IllegalStateException e) {
			System.out
					.println("While preparing recorder...Error Occured !!");
			e.printStackTrace();
			throw e;
		} catch (IOException e) {
			System.out
					.println("While preparing recorder...Error Occured !!");
			e.printStackTrace();
			throw e;
		}

		System.out.println("Starting recorder.....");
		recorder.start(); // Recording is now started

		recordingStarted = true;
	} catch (Exception e) {
		System.out.println("Recorder: Setting up MediaRecorder exceptioned.");
		e.printStackTrace();
	}

	System.out.println("Recorder.start returning " + recordingStarted);
	return recordingStarted;
}
/**
 * Method used to stop the Audio Recording.
 * @return boolean value
 */
public boolean stop() {
	
	boolean recorderStopped = false;
	try {
		if (recorder == null) {
			throw new Exception("Recorder never started !!");
		}

		recorder.stop();
		System.out.println("Recorder Stopped !!");

		recorder.release(); // Now the object cannot be reused
		System.out.println("Recorder Released !!");

		recorder = null;

		recorderStopped = true;
	} catch (Exception e) {
		e.printStackTrace();
	}
	return recorderStopped;
}

	/**
	 * Method used to write base64 data into a file as binary.
	 * @param args Arguments to the method
	 * @param args.base64String The base64 encoded String
	 * @param args.filePath Binary data is written to this file
	 * @return boolean value
	 */
	public boolean writeBase64ToBinary(JSONArray args)
	{
		String filePath=null;
		String base64String = null;
		
		if(args.length() != 2) return false;
		
		try {
			base64String = args.getString(0);
		} catch (JSONException e) {
			e.printStackTrace();
			return false;
		}	
		
		try
		{
			filePath = args.getString(1);
		} 
		catch (JSONException e)
		{
			e.printStackTrace();
			return false;
		}	

		try
		{
			byte[] binaryData;
			
			System.out.println("Decoding base64");
			
	        binaryData = Base64.decode(base64String, Base64.DEFAULT);
	        
	        URI fileUri = new URI(filePath);
	        
	        File outFile = new File(fileUri.getPath());
	        
			System.out.println("Write file: " + fileUri.getPath());
			
	        FileOutputStream outStream = new FileOutputStream(outFile);
	        if(outStream != null)
	        {
	        	outStream.write(binaryData, 0, binaryData.length);
	        	outStream.close();
	        } 
		} 
		catch (Exception e)
		{
			e.printStackTrace();
			return false;
		}
	
		return true;
	}
}
