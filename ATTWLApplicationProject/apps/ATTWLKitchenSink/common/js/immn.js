var params={},invocationData={},options={};

/**
 * Function to send an MMS message via IMMN
 * @param addresses Array of phone numbers, codes or email addresses to send the message to
 * @param message Text to be sent the message (optional)
 * @param subject Subject of the message (optional)
 * @param attachements Array of attachments.  Each attachment is an object { name:"file.name", contentType : "image/jpeg", file: "BASE64 ENCODED FILE DATA"}, 
 * @param cbData Success Callback Function after SMS is sent successfully
 * @param busyInd Busy indicator
 */
function invokeImmnSendMessage(addresses, text, subject, attachments, 
      sendCallback)
{
	params = {
		'contentType' : 'application/json',
		'accept' : 'application/json',
		// 'accessToken': window.localStorage.oAuthToken
		'accessToken': 'ABCD1234C0BBffffABCD1234C0BBffff',
		'messageRequest': {}
	};

	params.messageRequest.addresses = addresses;
	if(exists(text)) params.messageRequest.text = text;	
	if(exists(subject)) params.messageRequest.subject = subject;
	//if(exists(attachments)) params.attachments = attachments;
	
	invocationData= {
			adapter : 'IMMN' ,
			procedure : 'sendMessage' ,
			parameters : [params]			
	};
	options = {
		onSuccess : function(data) {
			busyInd.hide();
			WL.Logger.debug("Success : Response is - "+JSON.stringify(data));
			var immnMsgId='';
			
			if(data.invocationResult.messageId !== undefined)
			{
				immnMsgId = data.invocationResult.messageId;
			}
			
			sendCallback(data, immnMsgId);
		},
		onFailure : function(error) {
						busyInd.hide();
						WL.Logger.debug("Failure : Response is - "+error);
						console.log(error);
						sendCallback(error);
		} ,
		invocationContext : {}
	};
	
	WL.Client.invokeProcedure(invocationData, options);
}

function invokeImmnGetMessageList(getCallback)
{
   params = {
         // 'accessToken': window.localStorage.oAuthToken
      'accessToken': 'ABCD1234C0BBffffABCD1234C0BBffff'
   };

   invocationData= {
         adapter : 'IMMN' ,
         procedure : 'getMessageList' ,
         parameters : [params]         
   };
   
   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - "+JSON.stringify(data));
         getCallback(data);
      },
      onFailure : function(error) {
                  WL.Logger.debug("Failure : Response is - "+error);
                  console.log(error);
                  getCallback(error);
      } ,
      invocationContext : {}
   };
      
   WL.Client.invokeProcedure(invocationData, options);   
}

function invokeImmnCreateMessageIndex(invokeCallback)
{
   params = {
         // 'accessToken': window.localStorage.oAuthToken
      'accessToken': 'ABCD1234C0BBffffABCD1234C0BBffff'
   };

   invocationData= {
         adapter : 'IMMN' ,
         procedure : 'createMessageIndex' ,
         parameters : [params]         
   };
   
   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - "+JSON.stringify(data));
         invokeCallback(data);
      },
      onFailure : function(error) {
                  WL.Logger.debug("Failure : Response is - "+error);
                  console.log(error);
                  invokeCallback(error);
      } ,
      invocationContext : {}
   };
      
   WL.Client.invokeProcedure(invocationData, options);   
}

function invokeImmnGetMessageIndexInfo(invokeCallback)
{
   params = {
         // 'accessToken': window.localStorage.oAuthToken
      'accessToken': 'ABCD1234C0BBffffABCD1234C0BBffff'
   };

   invocationData= {
         adapter : 'IMMN' ,
         procedure : 'getMessageIndexInfo' ,
         parameters : [params]         
   };
   
   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - "+JSON.stringify(data));
         invokeCallback(data);
      },
      onFailure : function(error) {
                  WL.Logger.debug("Failure : Response is - "+error);
                  console.log(error);
                  invokeCallback(error);
      } ,
      invocationContext : {}
   };
      
   WL.Client.invokeProcedure(invocationData, options);   
}

function invokeImmnGetNotificationConnectionDetails(invokeCallback)
{
   params = {
         // 'accessToken': window.localStorage.oAuthToken
      'accessToken': 'ABCD1234C0BBffffABCD1234C0BBffff'
   };

   invocationData= {
         adapter : 'IMMN' ,
         procedure : 'getNotificationConnectionDetails' ,
         parameters : [params]         
   };
   
   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - "+JSON.stringify(data));
         invokeCallback(data);
      },
      onFailure : function(error) {
                  WL.Logger.debug("Failure : Response is - "+error);
                  console.log(error);
                  invokeCallback(error);
      } ,
      invocationContext : {}
   };
      
   WL.Client.invokeProcedure(invocationData, options);   
}

function invokeImmnDeleteMessage(messageId, invokeCallback)
{
   params = {
         // 'accessToken': window.localStorage.oAuthToken
      'accessToken': 'ABCD1234C0BBffffABCD1234C0BBffff',
      'messageId' : messageId
   };

   invocationData= {
         adapter : 'IMMN' ,
         procedure : 'deleteMessage',
         parameters : [params]         
   };
   
   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - "+JSON.stringify(data));
         invokeCallback(data);
      },
      onFailure : function(error) {
                  WL.Logger.debug("Failure : Response is - "+error);
                  console.log(error);
                  invokeCallback(error);
      } ,
      invocationContext : {}
   };
      
   WL.Client.invokeProcedure(invocationData, options);   
}

function invokeImmnDeleteMessages(messageIds, invokeCallback)
{
   params = {
         // 'accessToken': window.localStorage.oAuthToken
      'accessToken': 'ABCD1234C0BBffffABCD1234C0BBffff',
      'messageIds' : messageIds
   };

   invocationData= {
         adapter : 'IMMN' ,
         procedure : 'deleteMessages',
         parameters : [params]         
   };
   
   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - "+JSON.stringify(data));
         invokeCallback(data);
      },
      onFailure : function(error) {
                  WL.Logger.debug("Failure : Response is - "+error);
                  console.log(error);
                  invokeCallback(error);
      } ,
      invocationContext : {}
   };
      
   WL.Client.invokeProcedure(invocationData, options);   
}

function invokeImmnGetMessagePart(messageId, partId, invokeCallback)
{
   params = {
         // 'accessToken': window.localStorage.oAuthToken
      'accessToken': 'ABCD1234C0BBffffABCD1234C0BBffff',
      'messageId' : messageId,
      'partId' : partId
   };

   invocationData= {
         adapter : 'IMMN' ,
         procedure : 'getMessagePart',
         parameters : [params]         
   };
   
   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - "+JSON.stringify(data));
         invokeCallback(data);
      },
      onFailure : function(error) {
                  WL.Logger.debug("Failure : Response is - "+error);
                  console.log(error);
                  invokeCallback(error);
      } ,
      invocationContext : {}
   };
      
   WL.Client.invokeProcedure(invocationData, options);   
}

function invokeImmnGetMessageDelta(state, invokeCallback)
{
   params = {
         // 'accessToken': window.localStorage.oAuthToken
      'accessToken': 'ABCD1234C0BBffffABCD1234C0BBffff',
      'state' : state
   };

   invocationData= {
         adapter : 'IMMN' ,
         procedure : 'getMessagesDelta',
         parameters : [params]         
   };
   
   options = {
      onSuccess : function(data) {
         WL.Logger.debug("Success : Response is - "+JSON.stringify(data));
         invokeCallback(data);
      },
      onFailure : function(error) {
                  WL.Logger.debug("Failure : Response is - "+error);
                  console.log(error);
                  invokeCallback(error);
      } ,
      invocationContext : {}
   };
      
   WL.Client.invokeProcedure(invocationData, options);   
}

