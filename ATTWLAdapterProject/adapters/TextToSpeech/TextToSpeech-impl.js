/*
 * options:
 * contentType (optional): text/plain (default), application/ssml+xml
 * accessToken (required)
 * accept (optional): audio/amr, audio/amr-wb (default), audio/x-wav
 * contentLength (required) : body length
 * contentLanguage (optional) : en-US (default), es-US
 * xArg (optional)
 */
function textToSpeech(options)
{
	if(options.accessToken.indexOf("Bearer ") == -1)
	{
		options.accessToken = 'Bearer ' + options.accessToken;
	}
	
	options.host = "https://api.att.com/speech/v3/textToSpeech";
	
	logInfo('********* textToSpeech ADAPTER LOGS ***********');
	
	var speechHelper = new com.att.SpeechHelper();
	
	var response = speechHelper.textToSpeech(options); 

	logInfo('Response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(response));
	
	logInfo("Text: " + options.body);
	return {
		result: response
	};	
}

function logInfo(value) {
	WL.Logger.debug(value);
}