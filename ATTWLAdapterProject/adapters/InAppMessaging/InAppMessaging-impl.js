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
   input.headers = addClientSdk(input.headers);
   
   logInfo('>>>>InAppMessaging.sendMessage request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>InAppMessaging.sendMessage response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
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
   
   input.headers = addClientSdk(input.headers);
   
   logInfo('>>>>InAppMessaging.getMessageList request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>InAppMessaging.getMessageList response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
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
   
   input.headers = addClientSdk(input.headers);
   
   logInfo('>>>>InAppMessaging.getMessage request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>InAppMessaging.getMessage response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
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

	var agent = WL.Server.getClientRequest().getHeader("User-Agent").toLowerCase();
	var platform;
	if(agent.indexOf("android") > -1) 
	{
		platform = "android";
	} else if (agent.indexOf("apple") > -1)
	{
		platform = 'ios';
	} else {
		platform = 'unknown';
	}
	options.platform = platform;    
    
	logInfo('********* getMessageContent ADAPTER LOGS ***********');
	logInfo('options : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(options));
	
	var utils = new com.att.ATTUtils();
	
	var response = utils.iamGetMessageContent(options); 

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
   
   input.headers = addClientSdk(input.headers);
   
   logInfo('>>>>InAppMessaging.getMessagesDelta request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>InAppMessaging.getMessagesDelta response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
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
   
   input.headers = addClientSdk(input.headers);
   
   logInfo('>>>>InAppMessaging.updateMessages request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>InAppMessaging.updateMessages response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
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
   
   input.headers = addClientSdk(input.headers);
   
   logInfo('>>>>InAppMessaging.updateMessage request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>InAppMessaging.updateMessage response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
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
   
   input.headers = addClientSdk(input.headers);
   
   logInfo('>>>>InAppMessaging.deleteMessage request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>InAppMessaging.deleteMessage response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
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
   
   input.headers = addClientSdk(input.headers);
   
   logInfo('>>>>InAppMessaging.deleteMessages request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>InAppMessaging.deleteMessages response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
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
   
   input.headers = addClientSdk(input.headers);
   
   logInfo('>>>>InAppMessaging.createMessageIndex request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>InAppMessaging.createMessageIndex response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
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
   
   input.headers = addClientSdk(input.headers);
   
   logInfo('>>>>InAppMessaging.getMessageIndexInfo request: \n' + com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>InAppMessaging.getMessageIndexInfo response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
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
   
   input.headers = addClientSdk(input.headers);
   
  logInfo('>>>>InAppMessaging.getNotificationConnectionDetails request: \n'+com.worklight.common.js.util.JSObjectConverter.toFormattedString(input));
   
   var result=WL.Server.invokeHttp(input);
   
   logInfo('>>>>InAppMessaging.getNotificationConnectionDetails response : '+com.worklight.common.js.util.JSObjectConverter.toFormattedString(result));
   return result; 
}

function logInfo(value) {
	WL.Logger.info(value);
}

/* Add client sdk header */
var addClientSdk = function (headers) {
    headers["X-Arg"] =  "ClientSdk=att.worklight.4.2";
    return headers;
};