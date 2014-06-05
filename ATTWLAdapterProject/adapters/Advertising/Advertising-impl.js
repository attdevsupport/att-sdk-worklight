var baseEndPoint='rest/1/';

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
			"User-Agent" : userAgent,
			"X-Arg" : "ClientSdk=att.worklight.3.7"
		}
	};
	
	if(options.accept!==undefined)
	{
		input.headers.Accept=options.accept;
	}
	logInfo('********* Get Advertising ***********');
	logInfo('Input : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
	
	var result=WL.Server.invokeHttp(input);
	
	logInfo('Ads Response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
	return result;
}

function logInfo(value) {
	WL.Logger.debug(value);
}