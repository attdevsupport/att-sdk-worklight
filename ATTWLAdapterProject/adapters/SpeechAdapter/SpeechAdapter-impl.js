var speechURL ='https://api.att.com/rest/2/SpeechToText';

/**
 * The speechToText method sends an Request to ATT Server Speech API to translate the audio file to text.
 * @param options
 */
function speechToText(options) {
	options.host = speechURL;
	var speechHelper = new com.att.SpeechHelper();
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
