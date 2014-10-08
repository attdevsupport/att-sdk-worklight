
/**
 * This method will obtain an authorization code by redirecting the subscriber's browser (via a redirect URL) to the AT&T Gateway OAuth Server.
 */
function getAuthCode(options)
{
	var custom_param = [];
	if(options!==undefined)
	{
		if(options.bypassOnnetworkAuth != undefined && options.bypassOnnetworkAuth)
		{
			custom_param.push("bypass_onnetwork_auth");
		}
		if(options.suppressLandingPage != undefined && options.suppressLandingPage) {
			custom_param.push("suppress_landing_page");
		}
	}
	
	var url = {
		"url" : "https://api.att.com/oauth/v4/authorize"
		+ '?client_id=' + WL.Server.configuration["appKey"] 
		+  "&scope=" + WL.Server.configuration["authCodeScope"]
	 };
	if(custom_param.length > 0) url.url += "&custom_param=" + custom_param.join();
	
	WL.Logger.debug('getAuthCode : url => '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(url));
	return url;
}

function getAccessToken(options)
{
	logInfo('********* OAuthAdapter.getAccessToken *********');
	
	var input = {
			method :'post',
			path : 'oauth/v4/token',
			headers: {'Content-Type' : 'application/x-www-form-urlencoded' , 'Accept':'application/json'},
	};
	
	if(options.code != undefined && options.code!=''){
		logInfo('********* code *********');
		input['body'] = {'contentType': 'application/x-www-form-urlencoded','content':'client_id=' + WL.Server.configuration["appKey"] + '&client_secret=' + WL.Server.configuration["secretKey"] + '&grant_type=authorization_code&code=' + options.code };
	}
	else if(options.refreshToken !=undefined && options.refreshToken !=''){
		logInfo('********* refreshtoken *********');
		input['body'] = {'contentType': 'application/x-www-form-urlencoded','content':'client_id=' + WL.Server.configuration["appKey"] + '&client_secret=' + WL.Server.configuration["secretKey"] + '&grant_type=refresh_token&refresh_token=' + options.refreshToken };
	}
	else{
		logInfo('********* accesstoken *********');
		input['body'] = {'contentType': 'application/x-www-form-urlencoded','content':'client_id=' + WL.Server.configuration["appKey"] + '&client_secret=' + WL.Server.configuration["secretKey"] + '&grant_type=client_credentials&scope=' + WL.Server.configuration["scope"]};
	}

	input.headers = addClientSdk(input.headers);
	
	logInfo('Input: '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
	
	var result = WL.Server.invokeHttp(input);

	logInfo('Response: '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
	
	var accessTokenResponse = {
	   "accessToken":result.access_token,
	   "expiresIn": result.expires_in,
	   "refreshToken": result.refresh_token
	};
	
	var expiresInOverride = WL.Server.configuration["attOauthExpiresIn"];
	if(expiresInOverride != undefined && expiresInOverride != 0) {
		accessTokenResponse.expiresIn = expiresInOverride;
	}
	
	return accessTokenResponse;
}

function logInfo(value)
{
	WL.Logger.info(value);
}

/* Add client sdk header */
var addClientSdk = function (headers) {
    headers["X-Arg"] =  "ClientSdk=att.worklight.4.0";
    return headers;
};
