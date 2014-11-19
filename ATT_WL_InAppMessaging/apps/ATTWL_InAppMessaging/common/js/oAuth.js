/**
 * This method will invoke the OAuth token adapter
 * 
 * @param successCallback
 * @param failCallback
 */
function getAuthorizationCode(successCallback, failCallback, bypassOnnetworkAuth, suppressLandingPage)
{   
   var params = {};
   
   if(bypassOnnetworkAuth != undefined && bypassOnnetworkAuth==true)
   {
	   params.bypassOnnetworkAuth = true;
   }

   if(suppressLandingPage != undefined && suppressLandingPage==true)
   {
	   params.suppressLandingPage = true;
   }
   
   var invocationData = {
      adapter : 'OAuthAdapter',
      procedure : 'getAuthCode',
      parameters : [params]
   };
   
   var options = {
      onSuccess : successCallback,
      onFailure : failCallback,
      invocationContext : {}
   };

   WL.Client.invokeProcedure(invocationData, options);
};

function authorizeAccessToken(authorizationCode, successCallback, failCallback)
{
   getAccessToken(authorizationCode, null, successCallback, failCallback);
}

function refreshAccessToken(refreshToken, successCallback, failCallback)
{
   getAccessToken(null, refreshToken, successCallback, failCallback);
}

function getAccessToken(authorizationCode, refreshToken, successCallback, failCallback)
{
   var options = {
      onFailure : failCallback,
      onSuccess: function(result) {
    	  if(exists(result) && exists(result.statusCode) &&
    	     result.statusCode >= 400 && result.statusCode <= 403)
    	  {
    		  result.isSuccessful = false;
    		  failCallback(result);
    	  }
    	  
    	  successCallback(result);
      },
      invocationContext : {}
   };

   var params = {};
   
   if(authorizationCode !== undefined && authorizationCode != null) {
      params.code = authorizationCode;
   } else if (refreshToken !== undefined && refreshToken != null) {
      params.refreshToken = refreshToken;
   } else {
	   failCallback({'result': "No authorization code or refresh token provided"});
   }
   
   invocationData = {
      adapter : 'OAuthAdapter',
      procedure : 'getAccessToken',
      parameters : [ params ]
   };

   WL.Client.invokeProcedure(invocationData, options);
};

/**
 * Revoke access token
 */
function revokeAccessToken(token)
{
	if(token != undefined && token != "") {
	   revokeToken(token, 'access_token');
	}
};

/**
 * Revoke refresh token
 */
function revokeRefreshToken(token)
{
	if(token != undefined && token != "") {	
	   revokeToken(token, 'refresh_token');
	}
};

/**
 * Revoke token
 */
function revokeToken(tokenToRevoke, tokenType)
{
	options = {
		onFailure : function(error) {
			busyIndicator.hide();
			console.log("revoke token failed: " + JSON.stringify(error));
		},
		onSuccess : function(result) {
			busyIndicator.hide();
			console.log("revoke token result: " + JSON.stringify(result));
		},
		invocationContext : {}
	};

	params = {};
	params.token = tokenToRevoke;
	params.tokenType = tokenType;
	
	invocationData = {
		adapter : 'OAuthAdapter',
		procedure : 'revokeToken',
		parameters : [ params ]
	};
	
	busyIndicator.show();
	WL.Client.invokeProcedure(invocationData, options);	
}
