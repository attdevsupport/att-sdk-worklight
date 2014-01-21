
/* JavaScript content from js/main.js in folder common */
function wlCommonInit()
{
	// Common initialization code goes here
}

var selectedId;

var credentials = new Object();

credentials.isLoggedIn = function() {
   return(this.state == "loggedIn");
};

credentials.logOut = function() {
   this.initialize();
   this.store();
};

credentials.softLogout = function() {
   this.clearAccess();
   this.store();
};

credentials.setLoggedIn = function() {
   this.state="loggedIn";
};

credentials.expired = function() {
   return(this.expiration*1000 <= Date.now());
};

credentials.setExpiration = function(inExpiration)
{
   maxSeconds = 43200; // one month
   if(inExpiration > maxSeconds) {
      inExpiration = maxSeconds;
   }
   this.expiration = inExpiration + Date.now()/1000;
};

credentials.store = function() {
   window.localStorage.setItem('credentials', JSON.stringify(this));   
};

credentials.retrieve = function() {
   try {
      objectString = window.localStorage.getItem('credentials');
      console.log("read creds from storage: " + objectString);
      if(!objectString) {
         console.log("no stored credentials");
         credentials.initialize();
      } else {
         credsObject = JSON.parse(objectString);
         this.state = credsObject.state;
         this.accessToken = credsObject.accessToken;
         this.expiration = credsObject.expiration;
         this.refreshToken = credsObject.refreshToken;
         this.mobileNumber = credsObject.mobileNumber;
         console.log("Parsed creds: " + JSON.stringify(this));
      }
   } catch(getExecption) {
      console.log("EXCEPTION parsing credentials");
      credentials.initialize();
   }
};

credentials.clearAccess = function() {
   this.state = "loggedOut";
   this.accessToken = "";
   this.expiration = 0;
   this.refreshToken = "";
};

credentials.initialize = function() {
   this.clearAccess();
   this.mobileNumber = "";
};

credentials.getAccessToken = function() {
   console.log("Expiration: " + this.expiration + "now: " + Date.now());
   if(this.expiration*1000 > Date.now()) {
      return this.accessToken;
   } else {
      // TODO use refresh token - for now just log back in
      this.softLogout();
      $.mobile.changePage("#page-login");
   }
};

$("#buttonLogout").on('tap', function() 
{
   credentials.logOut();
   // TODO clear message storage
   $.mobile.changePage("#page-login");
});

credentials.relogin = function()
{
   this.state = "loggedOut"; 
};

function startLogin()
{
   // if mobile # field is filled in, load iframe and begin oath
   if(validMobileNumber())
   {
      credentials.mobileNumber = '+1' + $('#mobileNumber').val();
      getAuthorizationCode(authorizationCodeSuccess, authorizationCodeFailed);      
   } else {
      alert("Please enter a 10 digit mobile number");
   }
};

$("#loginButton").on('tap', startLogin);

function authorizationCodeSuccess(response)
{
   console.log("authorizationCodeSuccess: " + JSON.stringify(response, null, 3));
   if(response.status < 300)
   {
      // load iframe with this url
      $('#iframeAuthorization').attr('src', response.invocationResult.url + "&redirect_uri=https://ldev.code-api-att.com/ATTDPSDEMO/landingpage.html");
      console.log("authorizationCodeSuccess: load authZ page with: " + $('#iframeAuthorization').attr('src'));
      $.mobile.changePage("#page-authorization"); 
   } else {
      authorizationCodeFailed(response);
   }
};

function authorizationCodeFailed(error)
{
   alert("Failed to get authorization code. " + JSON.stringify(error));
};

function getAuthorizationResult()
{
   var currentUrl = this.contentDocument.location.href;
   var index = currentUrl.indexOf("code=");
   console.log("index: " + index + " in url: " + currentUrl);
   if (index != -1)
   {
      credentials.authorizationCode = currentUrl.substr(index + 5);
      WL.Logger.debug("authZ code is "+ credentials.authorizationCode);
      
      authorizeAccessToken(credentials.authorizationCode, accessTokenSuccess, accessTokenFail);
   } else {
      index = currentUrl.indexOf("error=");
      if(index != -1)
      {
         accessTokenFail({'error' : currentUrl.substring(index+6)});
      }
   }  
};

$("#iframeAuthorization").on('load', getAuthorizationResult);

function accessTokenSuccess(result) 
{
   $("#iframeAuthorization").hide();
   if(result.status >= 300) accessTokenFail(result);
   
   credentials.accessToken = result.invocationResult.accessToken;
   credentials.setExpiration(result.invocationResult.expiresIn);
   credentials.refreshToken = result.invocationResult.refreshToken;
   credentials.setLoggedIn();
   credentials.store();
   console.log("credentials stored: " + JSON.stringify(credentials, null, 3));
   $.mobile.changePage("#page-messageList");
}

function accessTokenFail(error)
{
   $("#iframeAuthorization").hide();
   alert("Failed to acquire access. " + JSON.stringify(result.invocationResult));
   $.mobile.changePage("#page-login");
}

function validMobileNumber()
{
   tempNumber = $('#mobileNumber').val();
   tempNumber = tempNumber.replace(/\D/g,'');
   if(tempNumber.length != 10)
   {
      return false;
   } else if(tempNumber.substring(0,0)=='1') {
      return false;
   } else {
      return true;
   }
}

var determineStartPage = function()
{
   // Check if access token is stored and is valid. If so, load the uber conversation page
   credentials.retrieve();
   if(credentials.isLoggedIn() && !credentials.expired()) {
      $.mobile.changePage("#page-messageList");      
   } else {
      $.mobile.changePage("#page-login");
   }
};

function loadConnectPage()
{
   $.mobile.changePage("#page-connect");
}

var iamAppConnect = function()
{
   WL.Client.connect({
      onSuccess: determineStartPage,
      onFailure: loadConnectPage
  });
};

$("#buttonConnect").on('tap', iamAppConnect);

$("#page-connect").on("pageshow", function() {
   alert("Unable to connect to Worklight server. Please verifiy connectivity, that server is started, and try again.");
});

$("#page-messageList").on("pagebeforeshow", function() {
	loadMessages();
});

$("#page-conversationList").on("pagebeforeshow", function() {	
	$('#conversationList').empty();
});

$("#page-conversationList").on("pageshow", function() {
	generateConversationList(selectedId);

});

function loadMessages() {

	var messageStorage = getMessageIndex(); 

	if (messageStorage == null) {
		var storageObject = {};
		storageObject.conversationGroups = {};
		storageObject.messageIndex = {};
		saveMessageIndex(storageObject);

		invokeIamGetMessageIndexInfo(credentials.getAccessToken(), getMessageIndexInfoCallback);
		//IAMGetMessageList(accessToken,getMessageListCallback);
	}

	else {
		console.log("Storage exist. Calling MessageDelta");
		var state = messageStorage.messageIndex.state;
		invokeIamGetMessageDelta(state,credentials.getAccessToken(),getMessageDeltaCallback);
	}
	
}

function createMessageIndexCallback (data) {
	
	invokeIamGetMessageList(credentials.getAccessToken(),null,getMessageListCallback);
	}

function getMessageListCallback(data) {
	populateMessageStorage(data);
	generateMessageList();
}

function getMessageDeltaCallback(data) {
	var messageStorage = getMessageIndex();
	if (messageStorage.messageIndex.state != data.invocationResult.deltaResponse.state)
		{
		addsIdArr=[];
		for(var i=0;i<=1;i++)
			{
				if(data.invocationResult.deltaResponse.delta[i].adds.length>0){
					for(var j=0;j<data.invocationResult.deltaResponse.delta[i].adds.length;j++)
						{
						addsIdArr.push(data.invocationResult.deltaResponse.delta[i].adds[j].messageId);
						}
					 addsObject = {};
					addsObject.messageIds=addsIdArr.toString();
					invokeIamGetMessageList(credentials.getAccessToken(),addsObject,getMessageListCallback);
					
				}
				/* if(data.invocationResult.deltaResponse.delta[i].updates.length>0){
					for(var k=0;k<data.invocationResult.deltaResponse.delta[i].updates.length;k++)
						{
						mesageStorage.messageIndex.messages[data.invocationResult.deltaResponse.delta[i].updates[k].messageId].isRead= data.invocationResult.deltaResponse.delta[i].updates[k].isRead;
						
						//get and save to storage
						}
				}
				if(data.invocationResult.deltaResponse.delta[i].deletes.length>0){
		
				} */
			}	
		}
	var messageStorage2=getMessageIndex();
	
	messageStorage2.messageIndex.state= data.invocationResult.deltaResponse.state;
	saveMessageIndex(messageStorage2);
	generateMessageList();
}

var getMessageIndexInfoCallback = function(data)
{
	if (data.status<300 && data.invocationResult.isSuccessful &&
	    data.invocationResult.messageIndexInfo.status == "INITIALIZED")
	{
		invokeIamGetMessageList(credentials.getAccessToken(),null,getMessageListCallback);
	} else {
		invokeIamCreateMessageIndex(credentials.getAccessToken(),createMessageIndexCallback);
	} 
};

function sendMessage () {
	
}
function deleteMessageCallback (data)
{
	$("#" + deleteId).hide();
	}

function deleteMessagesCallback(data)
{
	$("#" + deleteId).hide();
	
	}
function deleteFromStorage()
{
	
	
	}
function updateInStorage(){
	
	
}

function saveMessageIndex(object) {
	localStorage.setItem(credentials.mobileNumber, JSON.stringify(object));
}

function getMessageIndex() {
	var object = localStorage.getItem(credentials.mobileNumber);
	return object && JSON.parse(object);
}

function populateMessageStorage(data) {
	var messages = {};
	var messageStorage = getMessageIndex();
	for (var i = data.invocationResult.messageList.messages.length-1; i >= 0; --i) {

		newKey = data.invocationResult.messageList.messages[i];
		messages[newKey.messageId] = newKey;

		delete messages[newKey.messageId].messageId;
	}

	if (messageStorage.messageIndex.messages == undefined){
		messageStorage.messageIndex.messages={};
		messageStorage.messageIndex = data.invocationResult.messageList;

		messageStorage.messageIndex.messages = messages;

	}
	else {
		$.each(messages,function(key) {
			messageStorage.messageIndex.messages[key] = messages[key];

		});
	
	}

	saveMessageIndex(messageStorage);
	populateConversationStorage(messages);
}

function populateConversationStorage(messages) {
	var messageStorage = getMessageIndex();

	$.each(messages,function(key) {

		if (messages[key].recipients.length > 1) {
			var participantsArr = [];
			if (messages[key].isIncoming == false) { 
				for (var i = 0; i < messages[key].recipients.length - 1; i++) {
					participantsArr.push(messages[key].recipients[i].value);
				}
			} else {
				participantsArr.push(messages[key].from.value);
				for (var i = 0; i < messages[key].recipients.length - 1; i++) {
					if (messages[key].recipients[i].value != credentials.mobileNumber) {
						participantsArr.push(messages[key].recipients[i].value);
					}
				}
			}
			participantsArr.sort();
			participants = participantsArr.toString();

		} 
		//If not a group message
		else {
			if (messages[key].isIncoming == false) {

				participants = messages[key].recipients[0].value;
			} else {

				participants = messages[key].from.value;
			}
		}

		if (messageStorage.conversationGroups[participants] == undefined) {
			messageStorage.conversationGroups[participants] = {};
			messageStorage.conversationGroups[participants].messageIDs = [];
		}

		messageStorage.conversationGroups[participants].messageIDs.push(key);
		messageStorage.conversationGroups[participants].lastMsg = key;
		messageStorage.conversationGroups[participants].lastTS = messages[key].timeStamp;
		messageStorage.conversationGroups[participants].hasUnread = messages[key].isUnread;
	});

	saveMessageIndex(messageStorage);

	console.log("Messages Stored Successfully");
}
function generateMessageList() {
	
	$('#messageList').empty();
	
	var msgStatus, msgText, timestamp, label,messageStorage;
messageStorage = getMessageIndex();

var sortedKey = Object.keys(messageStorage.conversationGroups).sort(function(a, b) {
    if (messageStorage.conversationGroups[a].lastTS == messageStorage.conversationGroups[b].lastTS) {
        return 0;
    }
    return messageStorage.conversationGroups[a].lastTS < messageStorage.conversationGroups[b].lastTS ? 1 : -1;
});

for(var i=0;i<sortedKey.length;i++) {
	if (messageStorage.conversationGroups[sortedKey[i]].hasUnread == true) {
		msgStatus = "newMsg";
	}

	else {
		msgStatus = "oldMsg";
	}

	label = sortedKey[i];
	msgID = messageStorage.conversationGroups[sortedKey[i]].lastMsg;
	if (messageStorage.messageIndex.messages[msgID].type == "TEXT") {
		msgText = messageStorage.messageIndex.messages[msgID].text;
	} else {
		if(messageStorage.messageIndex.messages[msgID].typeMetaData.subject == "")
		{
			msgText = "[No Subject]";
		}
		else {
			msgText = messageStorage.messageIndex.messages[msgID].typeMetaData.subject; 
		}

	}
	timestamp = messageStorage.conversationGroups[sortedKey[i]].lastTS;

	$("#messageList").append(
			"<li class='" + msgStatus + "' id ='" + label
			+ "'> <h3 class= 'ui-li-heading'>" + label
			+ "</h3> <span class= 'ui-li-desc'>" + msgText
			+ "</span> <span class= 'ui-li-aside ui-li-desc'>"
			+ timestamp + "</span></li>");
}

$('#messageList li').on('click', function() {
	selectedId = $(this).attr('id');
	$.mobile.changePage("#page-conversationList",{transition:"slide",changeHash: true });
});


$('#messageList').listview('refresh');

}

function generateConversationList(participants)
{
	var from, msgID, timestamp, msgText, messageClass, float_direction, messageStorage;
	messageStorage = getMessageIndex();
	mmsText="";
	// console.log("participants: " + participants + " number of messages: " + messageStorage.conversationGroups[participants].messageIDs.length);
	
	for (var i = 0; i < messageStorage.conversationGroups[participants].messageIDs.length; i++) {
		msgID = messageStorage.conversationGroups[participants].messageIDs[i];
		from = messageStorage.messageIndex.messages[msgID].from.value;
		timestamp = messageStorage.messageIndex.messages[msgID].timeStamp;
		
		// WL.Logger.debug("i: " + i + " msdID: " + msgID + " \nfrom: " + from + "time: " + timestamp + " type: " + messageStorage.messageIndex.messages[msgID].type);
		if (messageStorage.messageIndex.messages[msgID].type == "TEXT")
		{
			msgText = messageStorage.messageIndex.messages[msgID].text;
		}
		else {
			// for MMS
			for (var iContent=0;iContent<messageStorage.messageIndex.messages[msgID].mmsContent.length;iContent++){
				mmsText = mmsText + "Attachment: " + messageStorage.messageIndex.messages[msgID].mmsContent[iContent].contentName +
				   "<br><button> Download </button><br><br>";
				}	
			msgText = mmsText;
			// WL.Logger.debug("mmsText: " + mmsText);
		}	

		if (from == credentials.mobileNumber) {
			messageClass = "bubbledRight";
			float_direction = "pull-right";
		} else {
			messageClass = "bubbledLeft";
			float_direction = "pull-left";
		}

		$("#conversationList").append(
				"<li> <span class = '" + float_direction
				+ "   messageInfo  ' >" + from
				+ " </span> <div class = '" + messageClass + "'> "
				+ msgText + " </div> <span class = '" + float_direction
				+ "   messageInfo  ' >" + timestamp + " </span> </li>");
	}
}
//send message TestCode
function sendMessage()
{
	var AddString, addArr;
	var textffield = document.getElementById("recipientInput");

	var message = $("#messageInput").val();

	if (textffield.value.length > 0) {
		var msisdn1 = $("#recipientInput").val();
		addArr = (msisdn1.split(","));
		AddString = [];
		for ( var i = 0; i < addArr.length; i = i + 1) {
			AddString.push('tel:' + addArr[i]);
		}
	   
	   invokeIamSendMessage(AddString,message,null, null,credentials.getAccessToken(), sendMessageCallback);
	} else {
	   alert("Please enter a recipient");
	}
};

function sendMessageCallback(data,msgId)
{ 
	
	console.log(msgId);
	$.mobile.changePage("#page-messageList");
	}
//image test code

var imageobject = [];
function getPhotoDisplayPicture(source)
{
	navigator.camera.getPicture(onSuccessShowImage, onPhotoDisplayFail,
	{
        quality : 10,
        allowEdit : true,
        destinationType : Camera.DestinationType.DATA_URL,
        sourceType : source
	});
}

function onSuccessShowImage(imageObject)
{
    imageurl = "data:image/jpeg;base64," + imageObject;
    loadimages(imageurl, imageObject);
}

function onPhotoDisplayFail(message)
{
   console.log('getPhotoDisplay failed: ' + message);
}

function loadimages(imageURI,imageObject)
{
    imageobject.push(imageObject);
    document.getElementById("images").innerHTML += "<img src ='" + imageURI + "' height = '65' width = '65' style = 'margin-left:10px;border:1px solid black'/>";
}

var exists = function(thing) {
	if(thing!==undefined && thing!=null) return true;
	else return false;
};


/* JavaScript content from js/main.js in folder iphone */
// This method is invoked after loading the main HTML and successful initialization of the Worklight runtime.
function wlEnvInit(){
    wlCommonInit();
    // Environment initialization code goes here
}