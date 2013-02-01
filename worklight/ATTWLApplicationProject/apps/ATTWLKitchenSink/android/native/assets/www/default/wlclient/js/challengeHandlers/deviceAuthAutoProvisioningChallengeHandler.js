
/* JavaScript content from wlclient/js/challengeHandlers/deviceAuthAutoProvisioningChallengeHandler.js in Common Resources */
/*
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
var wl_authAutoDeviceProvisioningChallengeHandler = WL.Client
        .createProvisioningChallengeHandler("wl_deviceAutoProvisioningRealm");

wl_authAutoDeviceProvisioningChallengeHandler.createJsonCsr = function(provisionEntity, realm, customPayload){
	var csrPayload = {};
	if (!WLJSX.Object.isUndefined(customPayload)){
		csrPayload = customPayload;
	}
	
	csrPayload.deviceId = device.uuid;
	
	if(provisionEntity == 'application') {
		csrPayload.applicationId = WL.StaticAppProps.APP_DISPLAY_NAME;
	} else if (provisionEntity.indexOf("group:") == 0){
		csrPayload.groupId = provisionEntity.substr(6);
	}
	
	wl_authAutoDeviceProvisioningChallengeHandler.onCsrDataReady(csrPayload, provisionEntity);
};