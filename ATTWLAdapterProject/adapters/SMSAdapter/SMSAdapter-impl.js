var baseEndPoint='sms/v3/messaging/';

/**
 * The Send SMS method sends an SMS message to one or more AT&T Mobile Network devices.
 * @param options
 */
function sendSMS(options)
{
	if(options.accessToken.indexOf("Bearer ") == -1)
	{
		options.accessToken = 'Bearer ' + options.accessToken;
	}
	
	var input = {
			method :"post",
			path : baseEndPoint+"outbox",
			headers: {"Authorization": options.accessToken, "Content-Type":options.contentType},
			body:{"contentType":options.contentType}
	};
	
	if(options.accept!==undefined)
	{
		input.headers.Accept=options.accept;
	}
	
	if(options.contentType!==undefined && options.contentType==="application/json")
	{
		input.body.content = com.worklight.common.js.util.JSObjectConverter.toFormattedString(options.body); 
	}
	else
	{
		input.body.content = options.body;
	}

	input.headers = addClientSdk(input.headers);
	
	logInfo('********* SEND SMS LOGS ***********');
	logInfo('Input : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
	
	var result=WL.Server.invokeHttp(input);
	
	logInfo('Response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
	return result;
}

/**
 * The Get SMS Delivery Status method requests the status of a previous SMS delivery request that was accepted by the AT&T Network for delivery to a mobile device.
 * @param options
 */
function getSMSDeliveryStatus(options)
{
	if(options.accessToken.indexOf("Bearer ") == -1)
	{
		options.accessToken = 'Bearer ' + options.accessToken;
	}
	
	var input = {
			method :'get',
			path : baseEndPoint+'outbox/'+options.smsId,
			headers: {'Authorization': options.accessToken,"Content-Type":options.contentType },
		};
	if(options.accept!==undefined)
	{
		input.headers.Accept=options.accept;
	}
	
	input.headers = addClientSdk(input.headers);
	   
	logInfo('********* GET SMS DELIVERY LOGS ***********');
	logInfo('Input : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
	
	var result=WL.Server.invokeHttp(input);
	
	logInfo('Response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
	return result;
}

/**
 * The Get SMS method receives SMS messages via the polling mechanism.
 * @param options
 */
function getSMS(options)
{
	if(options.accessToken.indexOf("Bearer ") == -1)
	{
		options.accessToken = 'Bearer ' + options.accessToken;
	}
	
	var input = {
			method :'get',
			// path : baseEndPoint+'inbox',
			path : baseEndPoint+'inbox/' + options.registrationId,
			headers: {'Authorization': options.accessToken ,"Content-Type":options.contentType },

			// parameters:{'RegistrationID': options.registrationId},
		};
	if(options.accept!==undefined)
	{
		input.headers.Accept=options.accept;
	}
	
	input.headers = addClientSdk(input.headers);   
	
	var result=WL.Server.invokeHttp(input);
	logInfo('********* GET SMS LOGS ***********');
	logInfo('Input : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
	logInfo('Response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
	return result;
}


function logInfo(value) {
	WL.Logger.info(value);
}

/* Add client sdk header */
var addClientSdk = function (headers) {
    headers["X-Arg"] =  "ClientSdk=att.worklight.4.0";
    return headers;
};

