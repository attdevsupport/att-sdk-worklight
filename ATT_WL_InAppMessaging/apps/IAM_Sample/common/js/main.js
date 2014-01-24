function wlCommonInit()
{
	// Common initialization code goes here
}

var selectedId, unreadMsgs;

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

   maxSeconds = 2592000; // 30 days
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
   if(!this.expired()) {
      return this.accessToken;
   } else {
      // TODO use refresh token - for now just log back in
      this.softLogout();
      $.mobile.changePage("#page-login");
   }

};

$("#buttonLogout").on('tap', function() 
		{
	messageStorage.clear();
	credentials.logOut();
	
	
	$.mobile.changePage("#page-login");
		});

credentials.relogin = function()
{
	this.state = "loggedOut"; 
};

var messageStorage ={};
messageStorage.retrieve = function () {
	var storageString = localStorage.getItem(credentials.mobileNumber);
	var storageObj = JSON.parse(storageString);
	if(storageObj==null)
		{
		this.messageIndex= null;
		this.conversationGroups = null;
		}
	else{
		this.messageIndex= storageObj.messageIndex;
		this.conversationGroups = storageObj.conversationGroups;
	}
	
};

messageStorage.save = function () {
	localStorage.setItem(credentials.mobileNumber, JSON.stringify(this));
};


messageStorage.clear = function () {
	localStorage.removeItem(credentials.mobileNumber);
};

messageStorage.init = function () {
	this.messageIndex={};
	this.conversationGroups ={};
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

$("#page-messageList").on("pageshow", function() {
	loadMessages();
});

$("#page-conversationList").on("pagebeforeshow", function() {	
	$('#conversationList').empty();
});

$("#page-conversationList").on("pageshow", function() {
	generateConversationList(selectedId);

});

function loadMessages() {

	messageStorage.retrieve(); //TODO move to after login 
	if (messageStorage.messageIndex==null||messageStorage.messageIndex.state==undefined) {
		messageStorage.init();
		console.log("initialized storage");
		invokeIamGetMessageIndexInfo(credentials.getAccessToken(), getMessageIndexInfoCallback);
	}

	else {
		console.log("Storage exist.Fetching Deltas");
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
// TODO make seperate functions for each(i.e delete,update,add)
	if (messageStorage.messageIndex.state != data.invocationResult.deltaResponse.state) {
		addsIdArr = [];
		for (var i = 0; i <= 1; i++) {
			if (data.invocationResult.deltaResponse.delta[i].adds.length > 0) {
				for (var j = 0; j < data.invocationResult.deltaResponse.delta[i].adds.length; j++) {
					addsIdArr.push(data.invocationResult.deltaResponse.delta[i].adds[j].messageId);
				}
				addsObject = {};
				addsObject.messageIds = addsIdArr.toString();
				invokeIamGetMessageList(credentials.getAccessToken(),
						addsObject, getMessageListCallback);

			}
			if (data.invocationResult.deltaResponse.delta[i].updates.length > 0) {
				for (var k = 0; k < data.invocationResult.deltaResponse.delta[i].updates.length; k++) {
					mesageStorage.messageIndex.messages[data.invocationResult.deltaResponse.delta[i].updates[k].messageId].isUnread = data.invocationResult.deltaResponse.delta[i].updates[k].isUnread;

				}
			}
			if (data.invocationResult.deltaResponse.delta[i].deletes.length > 0) {
				for (j = 0; j < data.invocationResult.deltaResponse.delta[i].deletes.length; j++) {
					var participant = getParticipants(mesageStorage.messageIndex.messages[data.invocationResult.deltaResponse.delta[i].deletes[j].messageId]);
					delete mesageStorage.messageIndex.messages[data.invocationResult.deltaResponse.delta[i].deletes[j].messageId];

					while (messageStorage.conversationGroups[participant].messageIDs.indexOf(data.invocationResult.deltaResponse.delta[i].deletes[j].messageId) !== -1) {
						messageStorage.conversationGroups[participant].messageIDs.splice(messageStorage.conversationGroups[participant].messageIds.indexOf(data.invocationResult.deltaResponse.delta[i].deletes[j].messageId),1);
						if (messageStorage.conversationGroups[participant].messageIDs.length == 0) {
							delete messageStorage.conversationGroups[participant];
						}
					}
				}
			}
		}
	}

	messageStorage.messageIndex.state = data.invocationResult.deltaResponse.state;
	messageStorage.save();
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

function deleteMessageCallback (data)
{
	$("#" + deleteId).hide();
}

function deleteMessagesCallback(data)
{
	$("#" + deleteId).hide();


}


function updateUnread(unreadArr){
	var unReadObj={};

	if(unreadArr.length == 1)
	{
		messageId=unreadArr[0];
		unReadObj.message = {"isUnread":false};
		invokeIamUpdateMessage(messageId, unReadObj,credentials.getAccessToken() ,messageUpdateCallback);
	}
	else{
		unReadObj.messages = [];
		for (var k=0;k<unreadArr.length;k++)
		{
			unReadObj.messages[k] = {"messageId": unreadArr[i], "isUnread":false};
		}
		invokeIamUpdateMessages(unReadObj,credentials.getAccessToken() ,messageUpdateCallback);
	}


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
	
	populateConversationStorage(messages);
}

function getParticipants(messageData)
{
	if (messageData.recipients.length > 1) {
		var participantsArr = [];
		if (messageData.isIncoming == false) { 
			for (var i = 0; i < messageData.recipients.length - 1; i++) {
				participantsArr.push(messageData.recipients[i].value);
			}
		} else {
			participantsArr.push(messageData.from.value);
			for (var i = 0; i < messageData.recipients.length - 1; i++) {
				if (messageData.recipients[i].value != credentials.mobileNumber) {
					participantsArr.push(messageData.recipients[i].value);
				}
			}
		}
		participantsArr.sort();
		return participantsArr.toString();

	} 
	//If not a group message
	else {
		if (messageData.isIncoming == false) {

			return messageData.recipients[0].value;
		} else {

			return messageData.from.value;
		}
	}

}

function populateConversationStorage(messages) {

	$.each(messages,function(key) {

		var participants = getParticipants(messages[key]);

		if (messageStorage.conversationGroups[participants] == undefined) {
			messageStorage.conversationGroups[participants] = {};
			messageStorage.conversationGroups[participants].messageIDs = [];
		}

		messageStorage.conversationGroups[participants].messageIDs.push(key);
		messageStorage.conversationGroups[participants].lastMsg = key;
		messageStorage.conversationGroups[participants].lastTS = messages[key].timeStamp;

		messageStorage.conversationGroups[participants].hasUnread = messages[key].isUnread;
	});

	messageStorage.save();

	console.log("Messages Stored Successfully");
}
function generateMessageList() {

	$('#messageList').empty();

	var msgStatus, msgText, timestamp, label;


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

	$('#messageList li').on('tap', function() {
		selectedId = $(this).attr('id');
		$.mobile.changePage("#page-conversationList",{transition:"slide",changeHash: true });
	});
	$('#messageList li').on('taphold', function() {
		deleteId = $(this).attr('id');
		 $('#messageListPopup').popup().popup('open');
		 $('#popupDivider').text(deleteId);
		
	});

	$('#messageList').listview('refresh');

}

function generateConversationList(participants)
{
	var from, msgID, timestamp, msgText, messageClass, float_direction;
	
	unreadMsgs=[];
	// console.log("participants: " + participants + " number of messages: " + messageStorage.conversationGroups[participants].messageIDs.length);

	for (var i = 0; i < messageStorage.conversationGroups[participants].messageIDs.length; i++) {
		msgID = messageStorage.conversationGroups[participants].messageIDs[i];
		from = messageStorage.messageIndex.messages[msgID].from.value;
		parseTimeStamp = new Date(messageStorage.messageIndex.messages[msgID].timeStamp);
		timestamp = parseTimeStamp.toLocaleTimeString().replace(/:\d+$/, '');

		// WL.Logger.debug("i: " + i + " msdID: " + msgID + " \nfrom: " + from + "time: " + timestamp + " type: " + messageStorage.messageIndex.messages[msgID].type);
		if(messageStorage.messageIndex.messages[msgID].isRead == false)
		{
			unreadMsgs.push(msgId);
		}

		if (messageStorage.messageIndex.messages[msgID].type == "TEXT")
		{
			msgText = messageStorage.messageIndex.messages[msgID].text;
		}
		else {
			// for MMS
			var mmsText="";
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

//send message
function sendMessage()
{
   var AddString, addArr;
	var textffield = document.getElementById("recipientInput");
	var message = $("#messageInput").val();
   var subject = $("#subjectInput").val();
   
	if (textffield.value.length > 0)
	{
		var msisdn1 = $("#recipientInput").val();
		addArr = (msisdn1.split(","));
		AddString = [];
		for ( var i = 0; i < addArr.length; i = i + 1) {
			AddString.push('tel:' + addArr[i]);
		}

		invokeIamSendMessage(AddString, message, subject, attachments, credentials.getAccessToken(), sendMessageCallback);

	} else {
	   alert("Please enter a recipient");
	}
};


$('#buttonSendMessage').on('tap', sendMessage);

function sendMessageCallback(data,msgId)
{ 

	console.log(msgId);
	$.mobile.changePage("#page-messageList");
}

var attachments;
var currentImage;

$("#buttonAddAttachment").on('tap', function() {
   getPhoto(navigator.camera.PictureSourceType.PHOTOLIBRARY);
}); 


$("#page-sendMessage").on("pageshow", function() {
   attachments = {};
   currentImage = "";
   document.getElementById("images").innerHTML = "";
});

var getPhoto = function(source)
{
	navigator.camera.getPicture(onSuccessGetPhoto, onFailGetPhoto,
	{
        destinationType : Camera.DestinationType.FILE_URI,
        sourceType : source,
        mediaType: Camera.MediaType.PICTURE
	});
};

var onSuccessGetPhoto = function(imageUri)
{
   currentImage = imageUri;
   window.resolveLocalFileSystemURI(imageUri, gotFileEntry, failedResolveFile);
};

var origImg;

var gotFileEntry = function(entry)
{
   entry.file(function (file)
   {
       var reader = new FileReader();
       reader.onloadend = function(evt)
       {
          if (evt.target.result) {
             //console.log("load event result: " + evt.target.result);
             
             // resize the image 
             if($('#sliderResize').val() < 100)
             {
                origImg = new Image;

                origImg.onload = resizeImage;
                origImg.quality = $('#sliderResize').val()/100; // resize by this factor
                origImg.fileName = file.name;
                origImg.src = evt.target.result;
             } else {
                setAttachment(currentImage, file.name, evt.target.result);
             }
          } else {
             alert("File read error: " + FileError.toMessage(evt.target.error.code));
          }                
       };
       reader.onerror = function(evt)
       {
         alert("Failed to read file. "  + FileError.toMessage(evt.target.error.code)); 
       };
       reader.readAsDataURL(file);
   },
   failedEntryFile);
};

var resizeImage = function()
{
   /// create an off-screen canvas
   var canvas = document.createElement('canvas');

   resizedWidth = parseInt(this.width*this.quality);
   resizedHeight = parseInt(this.height*this.quality);
   canvas.width = resizedWidth;
   canvas.height = resizedHeight;
   
   var ctx = canvas.getContext("2d");
   
   /// draw source image into the off-screen canvas:
   ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, 
         resizedWidth, resizedHeight);

   var newDataUri = canvas.toDataURL();
   
   setAttachment(currentImage, this.fileName, newDataUri);
};

var setAttachment = function(imageUri, fileName, base64)
{
   if(base64.length >= 1048576)
   {
      alert("Encoded file is " + parseFloat(base64.length/1024/1024).toFixed(2) + 
            " MB. It must be less than 1MB. Please resize photo.");
      return;
   }
   
   // base64 is prefixed with content type in this format: 
   // "data:image/jpeg;base64,...actual base64 data here..."
   // Extract the content type based on above format
   startOfType = base64.indexOf(':')+1;
   endOfType = base64.indexOf(',');
   subTypeStart = base64.indexOf('/')+1;
   subTypeEnd = base64.indexOf(';');
   
   if(startOfType == -1 || endOfType == -1)
   {
      alert("Attachment formatting failed.");
      return;
   }
   
   attachments[imageUri] = {};
   attachments[imageUri]['content-type'] = base64.substring(startOfType, endOfType);
   attachments[imageUri].body = base64.substring(endOfType + 1);

   extPos = fileName.lastIndexOf('.');
   extension = fileName.substring(extPos+1);
   extension = extension.toLowerCase();
   subType = base64.substring(subTypeStart, subTypeEnd);
   subType = subType.toLowerCase();
   if(subType == 'jpeg') subType == 'jpg';
   if(extension != subType)
   {
      fileName = fileName.substring(0, extPos+1) + subType;   
   };
   attachments[imageUri].fileName = fileName;
   
   document.getElementById("images").innerHTML += "<img src ='" + imageUri + 
      "' height = '65' width = '65' style = 'margin-left:10px;border:1px solid black'/>";   
};

var failedEntryFile = function(fileError)
{
   failedFile("failedEntryFile", fileError);
};

var failedResolveFile = function(fileError)
{
   failedFile("failedResolveFile", fileError);
};

var failedFile = function(from, fileError) {
   alert(from + " failed with code " + fileError.code + " " + fileCodeToMessage(fileError.code));
};

var fileCodeToMessage = function(code)
{
   if(code == FileError.NOT_FOUND_ERR)
   {
      codeMsg = "FileError.NOT_FOUND_ERR";
   } else if(code == FileError.SECURITY_ERR) {
      codeMsg = "FileError.SECURITY_ERR";
   } else if(code == FileError.ABORT_ERR) {
      codeMsg = "FileError.ABORT_ERR";
   } else if(code == FileError.NOT_READABLE_ERR) {
      codeMsg = "FileError.NOT_READABLE_ERR";
   } else if(code == FileError.ENCODING_ERR) {
      codeMsg = "FileError.ENCODING_ERR";
   } else if(code == FileError.NO_MODIFICATION_ALLOWED_ERR) {
      codeMsg = "FileError.NO_MODIFICATION_ALLOWED_ERR";
   } else if(code == FileError.INVALID_STATE_ERR) {
      codeMsg = "FileError.INVALID_STATE_ERR";
   } else if(code == FileError.SYNTAX_ERR) {
      codeMsg = "FileError.SYNTAX_ERR";
   } else if(code == FileError.INVALID_MODIFICATION_ERR) {
      codeMsg = "FileError.INVALID_MODIFICATION_ERR";
   } else if(code == FileError.QUOTA_EXCEEDED_ERR) {
      codeMsg = "FileError.QUOTA_EXCEEDED_ERR";
   } else if(code == FileError.TYPE_MISMATCH_ERR) {
      codeMsg = "FileError.TYPE_MISMATCH_ERR";
   } else if(code == FileError.PATH_EXISTS_ERR) {
      codeMsg = "FileError.PATH_EXISTS_ERR";
   } else {
      codeMsg = "FileError.UNKNOWN";
   }
   return codeMsg;
};

FileError.toMessage = fileCodeToMessage; 

function onFailGetPhoto(message)
{
   console.log('No file chosen. ' + message);
}

var exists = function(thing) {
	if(thing!==undefined && thing!=null) return true;
	else return false;
};

var fileSystem;
document.addEventListener("deviceready", function()
{
   window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function onSuccess(fs)
   {
      fileSystem = fs;
   }, function onError(error)
   {
      alert("Cannot get file system.  Will not be able to send attachments. Error: " + error.code);
   });   
}, false);
