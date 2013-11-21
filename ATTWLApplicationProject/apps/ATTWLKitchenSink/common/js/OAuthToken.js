var params = {}, invocationData = {}, options = {};
/**
 * This method will invoke the OAuth token adapter
 * 
 * @param successCallback
 */
function invokeOAuthToken(successCallback) {
	invocationData = {
		adapter : 'OAuthAdapter',
		procedure : 'getAuthCode',
		parameters : []
	};
	options = {
		onSuccess : function(result) 
		{	
			checkOAuthFailure(result);
			successCallback();
		},
		onFailure : function(error) {
			if (busyInd.isVisible()) {
				busyInd.hide();
			}
			checkOAuthFailure(error);
			window.localStorage.response = JSON.stringify(error);
			$('#pagePort').load("popup.html", '', function() {});
		},
		invocationContext : {}
	};

	WL.Client.invokeProcedure(invocationData, options);
};

var checkOAuthFailure = function(result) {
	if(result.invocationResult !== undefined && result.invocationResult.statusCode !== undefined)
	{
	   if(result.invocationResult.statusCode == 401 || result.invocationResult.statusCode == 400) {
		   clearAccessToken();
	   }
	}
};