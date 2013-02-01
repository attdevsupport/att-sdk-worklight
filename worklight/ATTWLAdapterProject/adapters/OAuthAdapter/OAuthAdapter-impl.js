
/**
 * This method will obtain OAuthToken by redirecting the subscriber's browser (via a redirect URL) to the AT&T Gateway OAuth Server.
 */
function getAuthCode() {
	
	var url = {
			  "url" : "https://api.att.com/oauth/authorize"
			    + '?client_id=' + WL.Server.configuration["apiKey"] + "&scope=DC"
			    //+ WL.Server.configuration["oauthScope"]
			 };
	WL.Logger.debug('oAuthcode : url => '+com.worklight.server.integration.api.JSObjectConverter.toFormattedString(url));
	return url;
}



function getAccessToken(options) {
	
	var input = {
			method :'post',
			path : 'oauth/access_token',
			headers: {'Content-Type' : 'application/x-www-form-urlencoded' , 'Accept':'application/json'},
	};
	
	if(options.code !=undefined && options.code!=''){
		logInfo('********* code *********');
		input['body'] = {'contentType': 'application/x-www-form-urlencoded','content':'client_id=' + WL.Server.configuration["apiKey"] + '&client_secret=' + WL.Server.configuration["secretKey"] + '&grant_type=authorization_code&code=' + options.code };
	}
	else if(options.refreshToken !=undefined && options.refreshToken !=''){
		logInfo('********* refreshtoken *********');
		input['body'] = {'contentType': 'application/x-www-form-urlencoded','content':'client_id=' + WL.Server.configuration["apiKey"] + '&client_secret=' + WL.Server.configuration["secretKey"] + '&grant_type=refresh_token&refresh_token=' + options.refreshToken };
	}
	else{
		logInfo('********* accesstoken *********');
		input['body'] = {'contentType': 'application/x-www-form-urlencoded','content':'client_id=' + WL.Server.configuration["apiKey"] + '&client_secret=' + WL.Server.configuration["secretKey"] + '&grant_type=client_credentials&scope=' + WL.Server.configuration["scope"]};
	}
	
	var result = WL.Server.invokeHttp(input);
	logInfo('********* OAUTH ADAPTER LOGS *********');
	logInfo('Input: '+com.worklight.server.integration.api.JSObjectConverter.toFormattedString(input));
	logInfo('Response: '+com.worklight.server.integration.api.JSObjectConverter.toFormattedString(result));
	var accessToken = {"accessToken":result.access_token};
	
	return accessToken;
}

function logInfo(value)
{
	WL.Logger.debug(value);
}