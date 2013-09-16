
/* JavaScript content from wlclient/js/challengeHandlers/authenticityChallengeHandler.js in Common Resources */
/*
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

// Creating a new challengeProcessor
var wl_authenticityChallengeHandler = WL.Client.createWLChallengeHandler("wl_authenticityRealm");
wl_authenticityChallengeHandler.handleChallenge = function(obj) {
    challenge = obj["WL-Challenge-Data"];
    if (challenge != null && WL.EnvProfile.isEnabled(WL.EPField.SUPPORT_CHALLENGE)) {
        var array = challenge.split('+');
        var someArgs = array[1].split('-');
        challenge = array[0];
        WL.App.__hashData(challenge, someArgs, authenticityChallengeResponse);
    }

    function authenticityChallengeResponse(data) {
        // Android return the string itself while iOS return object with string
        resultData = WL.Utils.getCordovaPluginResponseObject(data, "hashResult");
        wl_authenticityChallengeHandler.submitChallengeAnswer(resultData);
    }
};

wl_authenticityChallengeHandler.handleFailure = function(err) {
    WL.SimpleDialog.show(WL.ClientMessages.wlclientInitFailure, WL.ClientMessages.authFailure, [ {
        text : WL.ClientMessages.close,
        handler : function() {
        }
    } ]);
};
