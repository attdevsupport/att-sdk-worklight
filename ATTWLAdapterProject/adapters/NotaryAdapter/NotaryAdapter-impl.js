var baseEndPoint = 'Security/Notary/Rest/1/SignedPayload';

/**
 * method logInfo A common method used to print the debug statements. Its
 * internal method
 * 
 * @param value
 *            statement value that you want to show in debug.
 */
function logInfo(value) {
	WL.Logger.info(value);
}
/**
 * method getSignedPayload getSignedPayload method of Notary API
 * 
 * @param options
 *            A JSON Object that has all the required Parameters.
 * @returns response of getSignedPayload method
 */
function getSignedPayload(options) {
	var input = {
		method : 'post',
		path : baseEndPoint,
		headers : {
			'Client_id' : WL.Server.configuration["appKey"],
			'Client_secret' : WL.Server.configuration["secretKey"],
			'Content-Type' : options.contentType
		},
		body : {
			'contentType' : options.contentType,
			'content' : com.worklight.common.js.util.JSObjectConverter.toFormattedString(options.data)
		}
	};

	if (options.accept !== undefined) {
		input.headers.Accept = options.accept;
	}
	
	logInfo('*********  NOTARY PAYLOAD LOGS *********');
	logInfo('Input : '
			+ com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
	// http call to AT&T service
	var result = WL.Server.invokeHttp(input);

	logInfo('Response : '
			+ com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
	return result;
}
