package com.ATTWLKitchenSink;

import android.os.Bundle;

import com.worklight.androidgap.WLDroidGap;

public class ATTWLKitchenSink extends WLDroidGap {
	@Override
	public void onWLInitCompleted(Bundle savedInstanceState) {
	   // Additional initialization code from onCreate() was moved here
	   //DeviceAuthManager.getInstance().setProvisioningDelegate(<Use default ProvisioningDelegateImpl class or replace with your IProvisioningDelegate implementation>);
	   super.setIntegerProperty("splashscreen", R.drawable.splash);
	   super.loadUrl(getWebMainFilePath());
	   
	}


    @Override
    public void onCreate(Bundle savedInstanceState) { 
        super.onCreate(savedInstanceState);
        // Additional initialization code was moved to onWLInitCompleted()
    }
		
}



