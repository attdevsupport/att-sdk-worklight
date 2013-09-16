
/* JavaScript content from js/deviceCapabilities.js in folder common */
var params = {}, invocationData = {}, options = {};
/**
 * This method will invoke the Device Capabilities adapter
 * 
 * @param successCallback
 * @param failureCallback
 */
function invokeDeviceCapabilities(successCallback, failureCallback) {
	params = {
		'accept' : 'application/json',
		'accessToken' : window.localStorage.oAuthToken
	};
	invocationData = {
		adapter : 'DeviceCapabilities',
		procedure : 'getDeviceCapabilities',
		parameters : [ params ]
	};
	options = {
		onSuccess : successCallback,
		onFailure : failureCallback,
		invocationContext : {}
	};

	WL.Client.invokeProcedure(invocationData, options);
}

