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
		onSuccess : successCallback,
		onFailure : function(error) {
			if (busyInd.isVisible()) {
				busyInd.hide();
			}
			if(error.innvocationResult !== undefined && error.invocationResult.statusCode !== undefined)
			{
			   if(error.invocationResult.statusCode == 401 || error.invocationResult.statusCode == 400) {
				   clearAccessToken();
			   }
			}
			window.localStorage.response = JSON.stringify(error);
			$('#pagePort').load("popup.html", '', function() {
			});
		},
		invocationContext : {}
	};

	WL.Client.invokeProcedure(invocationData, options);

};