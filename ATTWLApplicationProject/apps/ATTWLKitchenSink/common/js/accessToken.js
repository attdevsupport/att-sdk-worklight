var oAuthLog = "";

var params = {}, invocationData = {}, options = {};
var timerID;

var accessTokenCallback = function(data)
{
	var accessToken = data.invocationResult.accessToken;

	oAuthLog = oAuthLog + "\n" + Date.now() + " New tokens: \n" + JSON.stringify(data, null, 3);
   $('#oAuthLogs').val(oAuthLog);
	window.localStorage.accessToken = accessToken;
	
	// Storing time as Unix time stamp
	window.localStorage.accessTokenExpiresAt = (Date.now()/1000 + data.invocationResult.expiresIn) * 1000;
	window.localStorage.refreshToken = data.invocationResult.refreshToken;

	setupAccessTokenTimer();
	
	if(data.invocationContext.callBack!==undefined)
	{
		data.invocationContext.callBack();
	}
};

var setupAccessTokenTimer = function()
{
   var expiresAt = window.localStorage.getItem("accessTokenExpiresAt");
   
   if(expiresAt !== undefined)
   {
      var delay = Math.min(expiresAt - 60000 - Date.now(), 2000000000);  // setTimeout flaky with large values (above 2^31-1)
      timerID = setTimeout(generateAccessToken, delay);   
   }
};

var clearAccessToken = function()
{
   window.localStorage.removeItem("accessToken");
   window.localStorage.removeItem("accessTokenExpiresAt");
   window.localStorage.removeItem("refreshToken");
};

var clearConsentAccessToken = function()
{
   window.localStorage.removeItem("consentAccessToken");
   window.localStorage.removeItem("consentAaccessTokenExpiresAt");
   window.localStorage.removeItem("consentRefreshToken");
};

/**
 * Function to authenticate the application and generate an access token which
 * would be used by other APIs
 */
function generateAccessToken(successCallback)
{
	logDeviceInfo();

   if(timerID !== undefined)
   {
      clearTimeout(timerID);
   }
   
	options = {
		onFailure : function(error) {
		},
		invocationContext : {}
	};

   delete params['code'];
   delete params['refreshToken'];
	
	if(successCallback!==undefined)
	{
		// End-user authorized access token for Device Capability & IMMN
		if (window.localStorage.oAuthToken != null
				&& window.localStorage.oAuthToken != undefined && window.localStorage.oAuthToken != 'null') {
			options['onSuccess'] = successCallback;
			params['code'] = window.localStorage.oAuthToken;
			window.localStorage.oAuthToken = null;
		} else {
			options.invocationContext.callBack=successCallback;
			options['onSuccess'] = accessTokenCallback;
		}
	}
	else {
	   // Check accessToken from local storage
	   var expiresAt = window.localStorage.getItem("accessTokenExpiresAt");
	   if(expiresAt !== undefined)
      {
	      if(expiresAt - 60000 > Date.now()) 
	      {
	         // log existing token info & return
	         oAuthLog += "\nCached access token (" + window.localStorage.getItem("accessToken") + "\t Expires at: " + Date(expiresAt);
	         setupAccessTokenTimer();
	         $('#oAuthLogs').val(oAuthLog);
	         return;
	      } else {

	         // Insert refreshToken into params if you have it
	         var refreshToken = window.localStorage.getItem("refreshToken");
	         if(refreshToken !== undefined || refreshToken != '') {
               params['refreshToken'] = refreshToken;
               oAuthLog += "\nRefreshing access token";
	         } else {
	            oAuthLog += "\nGetting new access token";
	         }
	      }
      } else {
         oAuthLog += "\nNo previous access token.";
      }

	   clearAccessToken();
		
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