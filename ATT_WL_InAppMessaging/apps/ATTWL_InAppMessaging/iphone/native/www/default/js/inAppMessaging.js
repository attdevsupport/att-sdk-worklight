
/* JavaScript content from js/inAppMessaging.js in folder common */
var params = {}, invocationData = {}, options = {};

/**
 * Function to send an SMS or MMS message via In App Messaging
 * 
 * @param addresses
 *           Array of phone numbers, codes or email addresses to send the
 *           message to
 * @param message
 *           Text to be sent the message (optional)
 * @param subject
 *           Subject of the message (optional)
 * @param attachments
 *           Array of attachments. Each attachment is an object {
 *           name:"file.name", contentType : "image/jpeg", file: "BASE64 ENCODED
 *           FILE DATA"},
 * @param isGroup
 *           Boolean set to true when message is MMS group.  Default is false
 *           
 * @param accessToken
 *           String with the access token
 *           
 * @param sendCallback
 *           Callback function receives a Worklight response
 */
function invokeIamSendMessage(addresses, text, subject, attachments, isGroup,
      accessToken, sendCallback) {
   params = {
      'contentType' : 'application/json',
      'accept' : 'application/json',
      'accessToken' : accessToken,
      'messageRequest' : {}
   };

   params.messageRequest.addresses = addresses;
   if (exists(text)) {
      params.messageRequest.text = text;
   }
   if (exists(subject)) {
      params.messageRequest.subject = subject;
   }
   if (exists(attachments)) {
      params.messageRequest.messageContent = [];
      for (attachmentKey in attachments) {
         attachments[attachmentKey]['content-transfer-encoding'] = "BASE64";
         params.messageRequest.messageContent.push(attachments[attachmentKey]);
      }
   }
   if (exists(isGroup)) {
      params.messageRequest.isGroup = isGroup;
   }

   invocationData = {
      adapter : 'InAppMessaging',
      procedure : 'sendMessage',
      parameters : [ params ]
   };
   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - " + JSON.stringify(data));
         var iamMsgId = '';

         if (data.invocationResult.messageId !== undefined) {
            iamMsgId = data.invocationResult.messageId;
         }

         sendCallback(data, iamMsgId);
      },
      onFailure : function(error) {
         // busyInd.hide();
         WL.Logger.debug("Failure : Response is - " + error);
         console.log(error);
         sendCallback(error);
      },
      invocationContext : {}
   };

   WL.Client.invokeProcedure(invocationData, options);
}

function invokeIamGetMessageList(accessToken, queryParams, getCallback) {
   var params = {};
   if (queryParams != null && queryParams !== undefined) {
      params = queryParams;
   }
   params.accessToken = accessToken;

   invocationData = {
      adapter : 'InAppMessaging',
      procedure : 'getMessageList',
      parameters : [ params ]
   };

   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - " + JSON.stringify(data));
         getCallback(data);
      },
      onFailure : function(error) {
         WL.Logger.debug("Failure : Response is - " + error);
         console.log(error);
         getCallback(error);
      },
      invocationContext : {}
   };

   WL.Client.invokeProcedure(invocationData, options);
}

function invokeIamCreateMessageIndex(accessToken, invokeCallback) {
   params = {
      // 'accessToken': window.localStorage.oAuthToken
      'accessToken' : accessToken
   };

   invocationData = {
      adapter : 'InAppMessaging',
      procedure : 'createMessageIndex',
      parameters : [ params ]
   };

   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - " + JSON.stringify(data));
         invokeCallback(data);
      },
      onFailure : function(error) {
         WL.Logger.debug("Failure : Response is - " + error);
         console.log(error);
         invokeCallback(error);
      },
      invocationContext : {}
   };

   WL.Client.invokeProcedure(invocationData, options);
}

function invokeIamGetMessageIndexInfo(accessToken, invokeCallback) {
   params = {
      // 'accessToken': window.localStorage.oAuthToken
      'accessToken' : accessToken
   };

   invocationData = {
      adapter : 'InAppMessaging',
      procedure : 'getMessageIndexInfo',
      parameters : [ params ]
   };

   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - " + JSON.stringify(data));
         invokeCallback(data);
      },
      onFailure : function(error) {
         WL.Logger.debug("Failure : Response is - " + error);
         console.log(error);
         invokeCallback(error);
      },
      invocationContext : {}
   };

   WL.Client.invokeProcedure(invocationData, options);
}

function invokeIamGetNotificationConnectionDetails(accessToken, invokeCallback) {
   params = {
      // 'accessToken': window.localStorage.oAuthToken
      'accessToken' : accessToken
   };

   invocationData = {
      adapter : 'InAppMessaging',
      procedure : 'getNotificationConnectionDetails',
      parameters : [ params ]
   };

   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - " + JSON.stringify(data));
         invokeCallback(data);
      },
      onFailure : function(error) {
         WL.Logger.debug("Failure : Response is - " + error);
         console.log(error);
         invokeCallback(error);
      },
      invocationContext : {}
   };

   WL.Client.invokeProcedure(invocationData, options);
}

function invokeIamGetMessage(messageId, accessToken, invokeCallback) {
   params = {
      // 'accessToken': window.localStorage.oAuthToken
      'accessToken' : accessToken
   };

   invocationData = {
      adapter : 'InAppMessaging',
      procedure : 'getMessage',
      parameters : [ params ]
   };

   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - " + JSON.stringify(data));
         invokeCallback(data);
      },
      onFailure : function(error) {
         WL.Logger.debug("Failure : Response is - " + error);
         console.log(error);
         invokeCallback(error);
      },
      invocationContext : {}
   };

   WL.Client.invokeProcedure(invocationData, options);
}

function invokeIamUpdateMessage(messageId, message, accessToken, invokeCallback) {
   params = {
      'accessToken' : accessToken,
      'messageId' : messageId,
      'message' : message
   };

   invocationData = {
      adapter : 'InAppMessaging',
      procedure : 'updateMessage',
      parameters : [ params ]
   };

   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - " + JSON.stringify(data));
         invokeCallback(data);
      },
      onFailure : function(error) {
         WL.Logger.debug("Failure : Response is - " + error);
         console.log(error);
         invokeCallback(error);
      },
      invocationContext : {}
   };

   WL.Client.invokeProcedure(invocationData, options);
}

function invokeIamUpdateMessages(messages, accessToken, invokeCallback) {
   params = {
      'accessToken' : accessToken,
      'messages' : messages
   };

   invocationData = {
      adapter : 'InAppMessaging',
      procedure : 'updateMessages',
      parameters : [ params ]
   };

   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - " + JSON.stringify(data));
         invokeCallback(data);
      },
      onFailure : function(error) {
         WL.Logger.debug("Failure : Response is - " + error);
         console.log(error);
         invokeCallback(error);
      },
      invocationContext : {}
   };

   WL.Client.invokeProcedure(invocationData, options);
}

function invokeIamDeleteMessage(messageId, accessToken, invokeCallback) {
   params = {
      // 'accessToken': window.localStorage.oAuthToken
      'accessToken' : accessToken,
      'messageId' : messageId
   };

   invocationData = {
      adapter : 'InAppMessaging',
      procedure : 'deleteMessage',
      parameters : [ params ]
   };

   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - " + JSON.stringify(data));
         invokeCallback(data);
      },
      onFailure : function(error) {
         WL.Logger.debug("Failure: Response is - " + error);
         console.log(error);
         invokeCallback(error);
      },
      invocationContext : {}
   };

   WL.Client.invokeProcedure(invocationData, options);
}

function invokeIamDeleteMessages(messageIds, accessToken, invokeCallback) {
   params = {
      // 'accessToken': window.localStorage.oAuthToken
      'accessToken' : accessToken,
      'messageIds' : messageIds
   };

   invocationData = {
      adapter : 'InAppMessaging',
      procedure : 'deleteMessages',
      parameters : [ params ]
   };

   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - " + JSON.stringify(data));
         invokeCallback(data);
      },
      onFailure : function(error) {
         WL.Logger.debug("Failure : Response is - " + error);
         console.log(error);
         invokeCallback(error);
      },
      invocationContext : {}
   };

   WL.Client.invokeProcedure(invocationData, options);
}

function invokeIamGetMessageContent(urlPath, accessToken, invokeCallback) {
   params = {
      'accessToken' : accessToken,
      'urlPath' : urlPath
   };

   invocationData = {
      adapter : 'InAppMessaging',
      procedure : 'getMessageContent',
      parameters : [ params ]
   };

   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - " + JSON.stringify(data));
         invokeCallback(data);
      },
      onFailure : function(error) {
         WL.Logger.debug("Failure : Response is - " + error);
         console.log(error);
         invokeCallback(error);
      },
      invocationContext : {
         'urlPath' : urlPath
      }
   };

   WL.Client.invokeProcedure(invocationData, options);
}

function invokeIamGetMessageDelta(state, accessToken, invokeCallback) {
   params = {
      'accessToken' : accessToken,
      'state' : state
   };

   invocationData = {
      adapter : 'InAppMessaging',
      procedure : 'getMessagesDelta',
      parameters : [ params ]
   };

   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - " + JSON.stringify(data));
         invokeCallback(data);
      },
      onFailure : function(error) {
         WL.Logger.debug("Failure : Response is - " + JSON.stringify(error));
         invokeCallback(error);
      },
      invocationContext : {}
   };

   WL.Client.invokeProcedure(invocationData, options);
}
