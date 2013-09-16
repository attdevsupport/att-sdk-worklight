var speechURL ='https://api.att.com/speech/v3/speechToText';

/**
 * The speechToText method sends an Request to ATT Server Speech API to translate the audio file to text.
 * @param options
 */
function speechToText(options)
{
	logInfo('********* enter speechToText ***********');
	logInfo('speechToText options: '+com.worklight.server.integration.api.JSObjectConverter.toFormattedString(options));
	
	if(options.accessToken.indexOf("Bearer ") == -1)
	{
		options.accessToken = 'Bearer ' + options.accessToken;
	}
	
	options.host = speechURL;
	var speechHelper = new com.att.SpeechHelper();

	var agent = WL.Server.getClientRequest().getHeader("User-Agent").toLowerCase();
	var platform;
	if(agent.indexOf("android") > -1) 
	{
		platform = "android";
	} else if (agent.indexOf("apple") > -1)
	{
		platform = 'ios';
	} else {
		platform = 'unknown';
	}
	options.platform = platform;	
	
	var response = speechHelper.speechToText(options);
	
	logInfo('********* Speech ADAPTER LOGS ***********');
	logInfo('Response : '+com.worklight.server.integration.api.JSObjectConverter.toFormattedString(response));
	
	return {
		result: response
	};
}

function logInfo(value) {
	WL.Logger.debug(value);
}
