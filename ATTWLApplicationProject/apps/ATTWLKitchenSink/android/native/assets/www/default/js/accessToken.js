
/* JavaScript content from js/accessToken.js in folder common */
var params = {}, invocationData = {}, options = {};
var accessTokenCallback = function(data) {
	var accessToken = data.invocationResult.accessToken;
	WL.Logger.debug("value of accessToken is " + accessToken);
	window.localStorage.accessToken = accessToken;
	if(data.invocationContext.callBack!==undefined)
	{
		data.invocationContext.callBack();
	}
};
/**
 * Function to authenticate the application and generate an access token which
 * would be used by other APIs
 */
function generateAccessToken(successCallback) {
	logDeviceInfo();

	options = {
		onFailure : function(error) {
		},
		invocationContext : {}
	};
	if(successCallback!==undefined)
	{
		// Token for Device Capability
		if (window.localStorage.oAuthToken != null
				&& window.localStorage.oAuthToken != undefined && window.localStorage.oAuthToken != 'null') {
			options['onSuccess'] = successCallback;
			params['code'] = window.localStorage.oAuthToken;
			window.localStorage.oAuthToken = null;
		} 
		else
		{
			options.invocationContext.callBack=successCallback;
			options['onSuccess'] = accessTokenCallback;
		}
		
	}
	else {
		window.localStorage.clear();
		options['onSuccess'] = accessTokenCallback;
	}
	


	invocationData = {
		adapter : 'OAuthAdapter',
		procedure : 'getAccessToken',
		parameters : [ params ]
	};

	WL.Client.invokeProcedure(invocationData, options);

};

/**
 * Log basic device information
 */
function logDeviceInfo() {
	WL.Logger.debug("WL.Client.getEnvironment() = "
			+ WL.Client.getEnvironment());
	WL.Logger.debug("window.device = " + JSON.stringify(window.device));
	if (window.device) {
		WL.Logger.debug("device.platform = " + device.platform);
		WL.Logger.debug("device.version = " + device.version);
	}
}