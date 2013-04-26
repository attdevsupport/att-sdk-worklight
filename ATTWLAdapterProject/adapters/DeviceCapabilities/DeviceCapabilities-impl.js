/**
 * The Get Device Capabilities method requests Device Capabilities details from
 * the network for a particular mobile terminal.
 * 
 * @param options
 *            It is a json that contains the access token and accept.
 * @returns json/xml list of items
 */
function getDeviceCapabilities(options)
{
	var accept="";
	if(options.accept != undefined && options.accept !=""){
		accept=options.accept;
	}else{
		accept="application/json";
	}

	if(options.accessToken.indexOf("Bearer ") == -1)
	{
		options.accessToken = 'Bearer ' + options.accessToken;
	}	
	
	var input = {
		method : "get",
		path : "rest/2/Devices/Info",
		headers : {
			"Authorization" : options.accessToken,
			"Accept" : accept
		},
	};
	
	logInfo('********* DEVICE CAPABILITIES ADAPTER LOGS *********');
	logInfo('Input: '+com.worklight.server.integration.api.JSObjectConverter.toFormattedString(input));
	
	var result = WL.Server.invokeHttp(input);
	
	logInfo('Response : '+com.worklight.server.integration.api.JSObjectConverter.toFormattedString(result));
	
	return(result);
}

function logInfo(value)
{
	WL.Logger.debug(value);
}