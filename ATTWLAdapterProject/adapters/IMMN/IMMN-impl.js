var baseEndPoint = 'https://api.att.com/rest/1'; 

/**
 * The sendMessage method sends an MMS or SMS message from an app on behalf of a mobile number
 * @param options
 */
function sendMessage(options)
{
	if(options.accessToken.indexOf("Bearer ") == -1)
	{
		options.accessToken = 'Bearer ' + options.accessToken;
	}
	
	options.host = baseEndPoint;
	var immnHelper = new com.att.WorklightImmnHelper();	
	
	var response = immnHelper.sendMessage(options);
	
	logInfo('>>>> IMMN ADAPTER LOGS');
	logInfo('Response : '+com.worklight.server.integration.api.JSObjectConverter.toFormattedString(response));
	
	return {
		result: response
	};
}

function getMessageHeaders(options)
{
	if(options.accessToken.indexOf("Bearer ") == -1)
	{
		options.accessToken = 'Bearer ' + options.accessToken;
	}
	
	var input = {
			method :'get',
			path : baseEndPoint+'MyMessages',
			parameters : {
				'HeaderCount' : options.headerCount,
				'IndexCursor' : options.indexCursor
			},
			headers: {
				'Authorization': options.accessToken
			}
		};
		
		if(options.accept!==undefined)
		{
			input.headers.Accept=options.accept;
		}
		logInfo('>>>> IMMN.getMessageHeaders ');
		logInfo('Input : '+com.worklight.server.integration.api.JSObjectConverter.toFormattedString(input));
		
		var result=WL.Server.invokeHttp(input);
		
		logInfo('IMMN Get Headers Response : '+com.worklight.server.integration.api.JSObjectConverter.toFormattedString(result));
		return result;	
}

function getMessageContents(options)
{
	if(options.accessToken.indexOf("Bearer ") == -1)
	{
		options.accessToken = 'Bearer ' + options.accessToken;
	}
	
	options.host = baseEndPoint;
	var immnHelper = new com.att.WorklightImmnHelper();	
	
	var response = immnHelper.getMessageContents(options);
	
	logInfo('>>>> IMMN.getMessageContents');
	logInfo('Response : '+com.worklight.server.integration.api.JSObjectConverter.toFormattedString(response));
	
	return {
		result: response
	};
}

function logInfo(value) {
	WL.Logger.debug(value);
}
