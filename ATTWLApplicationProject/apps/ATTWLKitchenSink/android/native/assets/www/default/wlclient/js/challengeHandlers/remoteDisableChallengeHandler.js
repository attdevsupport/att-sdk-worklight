
/* JavaScript content from wlclient/js/challengeHandlers/remoteDisableChallengeHandler.js in Common Resources */
/*
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

var wl_remoteDisableChallengeHandler = WL.Client.createWLChallengeHandler("wl_remoteDisableRealm");

wl_remoteDisableChallengeHandler.handleChallenge = function(obj) {

	// get new message params
	var message = obj.message;
    var messageId = obj.messageId; 
    var messageType = obj.messageType;
   
    // get value of previously stored message id
	var storedMessageId = __WL.LocalStorage.getValue(WL.Client.getMessageID());
	
	if (isDisplayMessageDialogue(storedMessageId, messageId, messageType))
	{
		  WL.SimpleDialog.show(WL.ClientMessages.notificationTitle, message, [ {
		        text : WL.ClientMessages.close,
		        handler : function() {
		        	wl_remoteDisableChallengeHandler.submitChallengeAnswer(messageId);
		        }
		    } ]);
		
		// keep the message id in the local storage
		__WL.LocalStorage.setValue(WL.Client.getMessageID(), messageId);
	}
	else
	{
		// don't show dialogue
		wl_remoteDisableChallengeHandler.submitChallengeAnswer(messageId);
	}
};


/**
 * determine whether or not to display message dialogue 
 * @param storedMessageId
 * @param messageId
 * @param messageType
 * @returns {Boolean}
 */
function isDisplayMessageDialogue(storedMessageId,messageId, messageType)
{
	// restrictions apply only to notify messages 
	if (messageType != "NOTIFY")
	{
		return true;
	}

	// display only new messages - the first time they are received 
	if (typeof storedMessageId == "undefined" || storedMessageId != messageId)
	{
		return true;
	}
	else
	{
		return false;
	}	
}

function getEnv() {
    return WL.StaticAppProps.ENVIRONMENT;
}

wl_remoteDisableChallengeHandler.__generateDialogueButtons = function()
{
	 var buttons = [ {
         text : WL.ClientMessages.exitApplication,
         handler : function() {
             // Note you must add the null options to openURL
             // otherwise the event is assumed the 3rd argument.
             WL.App.close();
         }
     } ];
	 
	 return buttons;
}


wl_remoteDisableChallengeHandler.handleFailure = function(err) {
    var message = err.message;
    var downloadLink = err.downloadLink;

    /*
     * Processor default handler for failure (display message and close App).
     */
    function defaultRemoteDisableDenialHandler(that) {
    	
    	
        var buttons = that.__generateDialogueButtons();

        if (downloadLink) {
            buttons.push({
                text : WL.ClientMessages.getNewVersion,
                handler : function() {
                    // Note you must add the null options to openURL
                    // otherwise the event is assumed the 3rd argument.
                    WL.App.openURL(downloadLink, "_new", null);
                    WL.App.close();
                }
            });
        }
        // Patch - downloadNewVersion element is added in the msg string.
        WL.SimpleDialog.show(WL.ClientMessages.applicationDenied, message, buttons);
        WL.Client.__hideBusy();
    }

    WL.Client.__handleOnRemoteDisableDenial(defaultRemoteDisableDenialHandler,this);
};
