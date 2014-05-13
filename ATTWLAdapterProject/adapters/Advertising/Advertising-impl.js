var baseEndPoint='rest/1/';

/* Add client sdk header */
var addClientSdk = function(headers)
{
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
	var clientSdk = "ClientSdk=Worklight-"+platform+"-3.7.0";
	if(headers["X-Arg"]==undefined) {
		headers["X-Arg"] = clientSdk;
	} else {
		var iArg;
		var iClientSdk = -1;
		xArgValues = split(headers["X-Arg"], ",");
		for(iArg = 0; iArg < xArgValues.length; iArg++)
		{
		   if(xArgValues[iArg].indexOf("ClientSdk") == 0) {
			   xArgValues[iArg] = clientSdk;
			   iClientSdk = iArg;
		   }	
		}
		if(iClientSdk == -1) {
			xArgValues.push(clientSdk);
		}
		headers["X-Arg"]=xArgValues.join();
	}
	return headers;
};

/**
 * The Get Ads method obtains an advertisement to display in an application
 * @param options
 * Options:
 * accessToken
 * contentType
 * Udid
 * queryParameters:
 *    Category (Required)
 *    Gender
 *    ZipCode
 *    AreaCode
 *    City
 *    Country
 *    Longitude
 *    Latitude
 *    MaxHeight
 *    MaxWidth
 *    MinHeight
 *    MinWidth
 *    Type
 *    Timeout
 *    AgeGroup
 *    Over18
 *    Keywords
 *    IsSizeRequired
 *    Premium
 */
function getAds(options)
{
	var clientRequest = WL.Server.getClientRequest();
	var userAgent = clientRequest.getHeader("User-Agent");
	
	if(options.accessToken != undefined && options.accessToken.indexOf("Bearer ") == -1)
	{
		options.accessToken = 'Bearer ' + options.accessToken;
	}
	
	var input = {
		method :'get',
		path : baseEndPoint+'ads',
		parameters : options.queryParameters,
		headers: {
			'Authorization': options.accessToken,
			"Udid": WL.Server.configuration["appKey"],
			"User-Agent" : userAgent
		}
	};
	
	if(options.accept!==undefined)
	{
		input.headers.Accept=options.accept;
	}
	logInfo('********* Get Advertising ***********');
	logInfo('Input : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
	
	input.headers=addClientSdk(input.headers);
	
	var result=WL.Server.invokeHttp(input);
	
	logInfo('Ads Response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
	return result;
}

function logInfo(value) {
	WL.Logger.debug(value);
}
