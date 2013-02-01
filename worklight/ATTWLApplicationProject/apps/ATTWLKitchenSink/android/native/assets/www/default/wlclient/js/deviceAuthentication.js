
/* JavaScript content from wlclient/js/deviceAuthentication.js in Common Resources */
/*
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
 * Object which handle the device authentication
 */
__WLDeviceAuth = function() {
    this.__requestToResend = null, this.__deviceChallengeToken = null,

    this.init = function(initCallback) {
    	WL.DeviceAuth.__initDeviceAuthManager(function(result){initCallback(result);});
    },


    /**
     * Check if the device has a certificate
     * 
     * @param successCallback
     * @param failureCallback
     */
    this.__isCertificateExists = function(provisioningEntitiy, successCallback, failureCallback) {
        cordova.exec(successCallback, failureCallback, "DeviceAuth", "isCertificateExists", [ provisioningEntitiy ]);
    },

    /**
     * Sign the deviceAuth payload
     * 
     * @param payloadJSON -
     *            application JSON data
     * @param provisioningEntitiy
     * @param isProvisioningEnabled
     * @param successCallback
     * @param failureCallback
     */
    this.signDeviceAuth = function(successCallback, failureCallback, payloadJSON, provisioningEntitiy, isProvisioningEnabled) {
        cordova.exec(successCallback, failureCallback, "DeviceAuth", "signDeviceAuth", [payloadJSON, provisioningEntitiy, isProvisioningEnabled]);
    },
    
    this.saveCertificate = function(successCallback, failureCallback, provisioningEntitiy, certificate, realm) {
        cordova.exec(successCallback, failureCallback, "DeviceAuth", "saveCertificate", [ provisioningEntitiy, certificate, realm]);
    },
    
    this.__getOsModel = function(callback) {
        cordova.exec(callback, callback, "DeviceAuth", "getOsModel", []);
    },

    this.signCsr = function(csrData, provisioningEntitiy, successCallback, failureCallback) {
        cordova.exec(successCallback, failureCallback, "DeviceAuth", "signCsr", [ csrData, provisioningEntitiy ]);
    },

    this.__initDeviceAuthManager = function(initCallback) {
        cordova.exec(initCallback, initCallback, "DeviceAuth", "init", []);
    },

    /**
     * Default implementation for WL.Client.init's options
     * onGetCustomDeviceProperties. Our default implementation actually does
     * nothing. If overriding this method, the user must call
     * resumeDeviceAuthProcess with the payload
     * 
     * @param resumeDeviceAuthProcess
     *            function to call when done with getting extra data
     */
    this.__defaultOnGetCustomDeviceProperties = function(resumeDeviceAuthProcess) {
        resumeDeviceAuthProcess({});
    },

    /**
     * Default implementation for WL.Client.init's options
     * onGetCustomDeviceProvisioningProperties. Our default implementation
     * actually does nothing. If overriding this method, the user must call
     * resumeDeviceProvisioningProcess with the payload
     * 
     * @param resumeDeviceProvisioningProcess
     *            function to call when ready
     */
    this.__defaultOnGetCustomDeviceProvisioningProperties = function(resumeDeviceProvisioningProcess) {
        resumeDeviceProvisioningProcess({});
    };
};
__WL.prototype.DeviceAuth = new __WLDeviceAuth;
WL.DeviceAuth = new __WLDeviceAuth;
