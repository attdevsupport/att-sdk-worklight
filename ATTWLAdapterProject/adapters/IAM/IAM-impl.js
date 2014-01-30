var baseEndPoint = '/myMessages/v2/'; 

var ifMissingSetDefault = function(key, defaultValue, anObject)
{
   if(!(key in anObject))
   {
      anObject[key] = defaultValue;
   }   
};

/**
 * The sendMessage method sends an MMS or SMS message from an app on behalf of a mobile number with optional attachments
 * @param options
 */
function sendMessage(options)
{
	if(options.accessToken.indexOf("Bearer ") == -1)
	{
		options.accessToken = 'Bearer ' + options.accessToken;
	}
   
   var input = {
         method :"post",
         path : baseEndPoint+"messages",
         headers: {
            "Authorization": options.accessToken, 
            "Content-Type": "application/json",
            "Accept": "application/json"},
         body:  {"contentType":"application/json"}
   };
   
   if(options.messageRequest.isGroup == undefined) options.messageRequest.isGroup = false;
   
   input.body.content = com.worklight.common.js.util.JSObjectConverter.toFormattedString({ "messageRequest" : options.messageRequest });
   
   logInfo('>>>>IAM.sendMessage request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>IAM.sendMessage response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
   return result;	
}

function getMessageList(options)
{
   if(options.accessToken.indexOf("Bearer ") == -1)
   {
      options.accessToken = 'Bearer ' + options.accessToken;
   }
   
   var input = {
         method :"get",
         path : baseEndPoint+"messages",
         headers: {
            "Authorization": options.accessToken, 
            "Content-Type": "application/json",
            "Accept": "application/json"
         }
   };
   
   // All the options except the accessToken are query string parameters, so just
   // put them all in there then subtract access token
   if(options !== undefined)
   {
      input.parameters = options;
      delete input.parameters["accessToken"];
   } else {
      input.paramters = {};
   }

   ifMissingSetDefault("limit", "500", input.parameters);
   ifMissingSetDefault("offset", "0", input.parameters);   
   
   logInfo('>>>>IAM.getMessageList request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>IAM.getMessageList response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
   return result; 
}

function getMessage(options)
{
   if(options.accessToken.indexOf("Bearer ") == -1)
   {
      options.accessToken = 'Bearer ' + options.accessToken;
   }
   
   var input = {
         method : "get",
         path : baseEndPoint+"messages",
         headers: {
            "Authorization": options.accessToken, 
            "Content-Type": "application/json",
            "Accept": "application/json"
         }
   };
   
   if(options !== undefined && options.messageId !== undefined)
   {
      input.path = input.path + "/" + options.messageId;  
   }  
   
   logInfo('>>>>IAM.getMessage request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>IAM.getMessage response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
   return result; 
}

function getMessageContent(options)
{
    if(options.accessToken.indexOf("Bearer ") == -1)
    {
       options.accessToken = 'Bearer ' + options.accessToken;
    }
   
    options.host = "https://api.att.com";
    if (options.urlPath !== undefined) {
      options.host = options.host + options.urlPath;
    }
	
	logInfo('********* getMessageContent ADAPTER LOGS ***********');
	logInfo('options : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(options));
	
	var speechHelper = new com.att.SpeechHelper();
	
	var response = speechHelper.iamGetMessageContent(options); 

	logInfo('Response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(response));

	return {
		result: response
	};   
}

function getMessagesDelta(options)
{
   if(options !== undefined && options.accessToken !== undefined && options.accessToken.indexOf("Bearer ") == -1)
   {
      options.accessToken = 'Bearer ' + options.accessToken;
   }
   
   var input = {
         method :"get",
         path : baseEndPoint+"delta",
         headers: {
            "Authorization": options.accessToken, 
            "Content-Type": "application/json",
            "Accept": "application/json"
         }
   };
   
   if(options !== undefined && options.state !== undefined)
   {
      input.parameters = {};
      input.parameters.state = options.state;
   }  
   
   logInfo('>>>>IAM.getMessagesDelta request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>IAM.getMessagesDelta response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
   return result; 
}

function updateMessages(options)
{
   if(options !== undefined && options.accessToken !== undefined && options.accessToken.indexOf("Bearer ") == -1)
   {
      options.accessToken = 'Bearer ' + options.accessToken;
   }
   
   var input = {
         method :"put",
         path : baseEndPoint+"messages",
         headers: {
            "Authorization": options.accessToken, 
            "Content-Type": "application/json",
            "Accept": "application/json"
         },
         body:{"contentType": "application/json"}
   };
   
   if(options !== undefined && options.messages !== undefined)
   {
      input.body.content = com.worklight.common.js.util.JSObjectConverter.toFormattedString({ "messages" : options.messages });;      
   }  
   
   logInfo('>>>>IAM.updateMessages request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>IAM.updateMessages response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
   return result; 
}

function updateMessage(options)
{
   if(options !== undefined && options.accessToken !== undefined && options.accessToken.indexOf("Bearer ") == -1)
   {
      options.accessToken = 'Bearer ' + options.accessToken;
   }
   
   var input = {
         method :"put",
         path : baseEndPoint+"messages",
         headers: {
            "Authorization": options.accessToken, 
            "Content-Type": "application/json",
            "Accept": "application/json"
         },
         body:{"contentType": "application/json"}
   };

   if(options !== undefined && options.messageId !== undefined)
   {
      input.path = input.path + "/" + options.messageId;     
   }    
   
   if(options !== undefined && options.message !== undefined)
   {
      input.body.content = com.worklight.common.js.util.JSObjectConverter.toFormattedString({ "message" : options.message });  
   }  
   
   logInfo('>>>>IAM.updateMessage request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>IAM.updateMessage response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
   return result; 
}

function deleteMessage(options)
{
   if(options !== undefined && options.accessToken !== undefined && options.accessToken.indexOf("Bearer ") == -1)
   {
      options.accessToken = 'Bearer ' + options.accessToken;
   }
   
   var input = {
         method :"delete",
         path : baseEndPoint+"messages",
         headers: {
            "Authorization": options.accessToken, 
            "Content-Type": "application/json",
            "Accept": "application/json"
         }
   };

   if(options !== undefined && options.messageId !== undefined)
   {
      input.path = input.path + "/" + options.messageId;     
   }     
   
   logInfo('>>>>IAM.deleteMessage request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>IAM.deleteMessage response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
   return result; 
}

function deleteMessages(options)
{
   if(options !== undefined && options.accessToken !== undefined && options.accessToken.indexOf("Bearer ") == -1)
   {
      options.accessToken = 'Bearer ' + options.accessToken;
   }
   
   var input = {
         method :"delete",
         path : baseEndPoint+"messages",
         headers: {
            "Authorization": options.accessToken, 
            "Content-Type": "application/json",
            "Accept": "application/json"
         },
   };

   if(options !== undefined && options.messageIds !== undefined)
   {
      input.parameters = {};
      input.parameters.messageIds = options.messageIds;     
   }     
   
   logInfo('>>>>IAM.deleteMessages request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>IAM.deleteMessages response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
   return result; 
}

function createMessageIndex(options)
{
   if(options !== undefined && options.accessToken !== undefined && options.accessToken.indexOf("Bearer ") == -1)
   {
      options.accessToken = 'Bearer ' + options.accessToken;
   }
   
   var input = {
         method :"post",
         path : baseEndPoint+"messages/index",
         headers: {
            "Authorization": options.accessToken, 
            "Content-Type": "application/json",
            "Accept": "application/json"
         }
   };   
   
   logInfo('>>>>IAM.createMessageIndex request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>IAM.createMessageIndex response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
   return result; 
}

function getMessageIndexInfo(options)
{
   if(options !== undefined && options.accessToken !== undefined && options.accessToken.indexOf("Bearer ") == -1)
   {
      options.accessToken = 'Bearer ' + options.accessToken;
   }
   
   var input = {
         method :"get",
         path : baseEndPoint+"messages/index/info",
         headers: {
            "Authorization": options.accessToken, 
            "Content-Type": "application/json",
            "Accept": "application/json"
         }
   };

   if(options !== undefined && options.messageId !== undefined)
   {
      input.path = input.path + "/" + messageId;     
   }     
   
   logInfo('>>>>IAM.getMessageIndexInfo request: \n' + com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>IAM.getMessageIndexInfo response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
   return result; 
}

function getNotificationConnectionDetails(options)
{
   if(options !== undefined && options.accessToken !== undefined && options.accessToken.indexOf("Bearer ") == -1)
   {
      options.accessToken = 'Bearer ' + options.accessToken;
   }
   
   var input = {
         method :"get",
         path : baseEndPoint+"notificationConnectionDetails",
         headers: {
            "Authorization": options.accessToken, 
            "Content-Type": "application/json",
            "Accept": "application/json"
         }
   };

   if(options !== undefined && options.queues !== undefined)
   {
      input.parameters = {};
      input.parameters.queues = options.queues;     
   }     
   
  logInfo('>>>>IAM.getNotificationConnectionDetails request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>IAM.getNotificationConnectionDetails response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
   return result; 
}

function logInfo(value) {
	WL.Logger.info(value);
	//WL.Logger.error(value);
}
