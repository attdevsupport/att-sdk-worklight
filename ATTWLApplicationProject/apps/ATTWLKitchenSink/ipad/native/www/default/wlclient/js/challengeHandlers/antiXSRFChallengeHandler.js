
/* JavaScript content from wlclient/js/challengeHandlers/antiXSRFChallengeHandler.js in Common Resources */
/*
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

// Creating a new challengeProcessor
var wl_antiXSRFChallengeHandler = WL.Client.createWLChallengeHandler("wl_antiXSRFRealm");
wl_antiXSRFChallengeHandler.handleChallenge = function(obj) {
    WL.Client.addGlobalHeader("WL-Instance-Id", obj["WL-Instance-Id"]);
    this.submitChallengeAnswer();
};