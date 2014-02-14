/*
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/
/*
 *	This piece of code was added as a part of upgrading your application 
 *	to a new authentication API introduced in Worklight 5.0.0.3
 *		
 *	Authenticator object that was used previosly is deprecated.
 *	New challenge handler APIs are serving as a wrapper for original Authenticator object.
 *	To learn more about challenge handler APIs please refer to Worklight documentation.
 *
 */

// ----------------- Challenge handler start -----------------
var challengeHandler1 = WL.Client.createChallengeHandler("realm1");

challengeHandler1.isInitialized = false;
challengeHandler1.isCustomResponse = function(response) {
    if (typeof Authenticator == "undefined") {
        return false;
    }

    if (!this.isInitialized) {
        this.isInitialized = true;
        Authenticator.init();
    }

    var isLoginFormResponse = Authenticator.isLoginFormResponse(response);
    if (isLoginFormResponse) {
        Authenticator.onBeforeLogin(response, null, challengeHandler1.onSubmitButtonClicked);
        Authenticator.onShowLogin();
    } else {
        Authenticator.onHideLogin();
    }
    return isLoginFormResponse;
};

challengeHandler1.onSubmitButtonClicked = function(reqURL, authParams) {
    var options = {
        headers : {},
        parameters : (authParams && authParams.parameters) ? authParams.parameters : {}
    };

    challengeHandler1.submitLoginForm(reqURL, options, challengeHandler1.submitLoginFormCallback);
};

challengeHandler1.submitLoginFormCallback = function(response) {
    var isLoginFormResponse = challengeHandler1.isCustomResponse(response);
    if (!isLoginFormResponse) {
        challengeHandler1.submitSuccess();
    }
};
// ----------------- Challenge handler end -----------------


/* Authenticator skeleton; Uncomment and implement if your application requires authentication. */
/*
var Authenticator = function () {

    // Private members should be placed here

    return {
        // Public members should be placed here
        init : function () {
              // Authenticator initialization code should be placed here
        },

        isLoginFormResponse : function (response) {
              // Returns true/false
              
              return false;
        },
        
        onBeforeLogin : function (response, username, onSubmit, onCancel) {
              
        },

       onShowLogin: function() {
              
       },
        
       onHideLogin: function(){
              
       }               
    }; 
}();
*/