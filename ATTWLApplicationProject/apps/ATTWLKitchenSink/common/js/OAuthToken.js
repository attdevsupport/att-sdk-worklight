var params = {}, invocationData = {}, options = {};
/**
 * This method will invoke the OAuth token adapter
 * 
 * @param successCallback
 */
function invokeOAuthToken(successCallback) {
	   var params = {};
	   
	   if(bypassOnnetworkAuth != undefined && bypassOnnetworkAuth==true)
	   {
		   params.bypassOnnetworkAuth = true;
	   }

	   if(suppressLandingPage != undefined && suppressLandingPage==true)
	   {
		   params.suppressLandingPage = true;
	   }
	
	invocationData = {
		adapter : 'OAuthAdapter',
		procedure : 'getAuthCode',
		parameters : [params]
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