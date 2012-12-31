/**
 * The Get Device Capabilities method requests Device Capabilities details from
 * the network for a particular mobile terminal.
 * 
 * @param options
 *            It is a json that contains the OAuthToken token and accept.
 * @returns json/xml list of items
 */
function getDeviceCapabilities(options) {
	var accept="";
	if(options.accept != undefined && options.accept !=""){
		accept=options.accept;
	}else{
		accept="application/json";
	}
	var input = {
		method : "get",
		path : "rest/2/Devices/Info",
		headers : {
			"Authorization" : options.oAuthToken,
			"Accept" : accept
		},
	};
	
	logInfo('********* DEVICE CAPABILITIES ADAPTER LOGS *********');
	logInfo('Input: '+com.worklight.server.integration.api.JSObjectConverter.toFormattedString(input));
	
	return WL.Server.invokeHttp(input);

}

function logInfo(value)
{
	WL.Logger.debug(value);
}