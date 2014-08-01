
/* JavaScript content from js/OAuthToken.js in folder common */
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
			window.localStorage.response = JSON.stringify(error);
			$('#pagePort').load("popup.html", '', function() {
			});
		},
		invocationContext : {}
	};

	WL.Client.invokeProcedure(invocationData, options);

};