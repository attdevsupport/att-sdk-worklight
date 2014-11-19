var busyIndicator;

function wlCommonInit() {
   // Common initialization code goes here
   busyIndicator = new WL.BusyIndicator('', {
      text : 'Processing...'
   });
   busyIndicator.show();
}

var selectedId, unreadMsgs, interval;

var numErrors = 0;
setInterval(function errorTimer() { 
	numErrors = 0;
}, 5 * 60 * 1000);  // Dampen errors to a maximum displayed every 5 mins

var backbuttonConfirm = function(buttonId) {
   if(buttonId==1) {
      messageStorage.clear();
      credentials.logOut();
      $.mobile.changePage("#page-login");
   }
   if(buttonId != 3) {
      window.setInterval(navigator.app.exitApp, 500);
   }
};

document.addEventListener("backbutton", function(e) {
   if ($.mobile.activePage.is('#page-messageList') && device.platform != "iOS") {
      e.preventDefault();
      showConfirmAlert("Logout when exiting?", backbuttonConfirm, null, "Logout,Exit Only,Stay");
   } else {
      navigator.app.backHistory();
   }
}, false);

var credentials = new Object();

credentials.isLoggedIn = function() {
   return (credentials.state == "loggedIn");
};

credentials.logOut = function() {
   credentials.initialize();
   credentials.store();
};

credentials.softLogout = function() {
   credentials.clearAccess();
   credentials.store();
};

credentials.relogin = function() {
   credentials.state = "loggedOut";
};

credentials.setLoggedIn = function() {
   credentials.state = "loggedIn";
};

credentials.expired = function() {
   var nowDate = new Date();
   var isExpired = (credentials.expiration * 1000 <= nowDate.getTime());
   if(isExpired) console.log("Access token expired");
   return isExpired;
};

credentials.setExpiration = function(inExpiration) {
   var maxSeconds = 2592000; // 30 days

   if (inExpiration > maxSeconds) {
      inExpiration = maxSeconds;
   }
   var nowDate = new Date();
   var nowSec = Math.round(nowDate.getTime()/1000);
   //alert("nowSec: " + nowSec);
   
   credentials.expiration =  Number(nowSec) + Number(inExpiration);
   //alert("credentials.exp: " + credentials.expiration);
};

var previousRefresh = "none";
credentials.refreshAccessToken = function()
{
	console.log("Refreshing access token with " + credentials.refreshToken);
	
	//if(previousRefresh == credentials.refreshToken) alert("Duplicate refresh");
	
	if(exists(credentials) && exists(credentials.refreshToken) &&
	   previousRefresh != credentials.refreshToken)
	{
	   previousRefresh = credentials.refreshToken;
	   refreshAccessToken(credentials.refreshToken, accessTokenSuccess, accessTokenFail);
	}
};

credentials.clearTimeout = function() {
   if(exists(credentials.timerId)) {
	   clearTimeout(credentials.timerId);
	   credentials.timerId = null;
   };	
};

credentials.setupAccessTokenTimer = function()
{
	credentials.clearTimeout();
   
   if(exists(credentials.expiration) &&
      credentials.expiration != 0)
   {
	  var nowDate = new Date();
	  var nowTime = nowDate.getTime();
      credentials.timerId = setTimeout(credentials.refreshAccessToken, (credentials.expiration - 5)*1000 - nowTime);   
   }
};

credentials.store = function() {
   window.localStorage.removeItem('credentials');
   window.localStorage.setItem('credentials', JSON.stringify(this));
   
   console.log("credentials stored: " + JSON.stringify(credentials, null, 3));
};

credentials.retrieve = function() {
   try {
      var objectString = window.localStorage.getItem('credentials');
      if (!exists(objectString)) {
         credentials.initialize();
      } else {
         var credsObject = JSON.parse(objectString);
         credentials.state = credsObject.state;
         credentials.accessToken = credsObject.accessToken;
         credentials.expiration = credsObject.expiration;
         credentials.refreshToken = credsObject.refreshToken;
         credentials.mobileNumber = credsObject.mobileNumber;
      }
   } catch (getExecption) {
      showAlertView("EXCEPTION parsing credentials");
      credentials.initialize();
   }
};

credentials.clearAccess = function() {
   credentials.clearTimeout();
   revokeRefreshToken(credentials.refreshToken); // Revokes all access token as well.
   credentials.state = "loggedOut";
   credentials.accessToken = "";
   credentials.expiration = 0;
   credentials.refreshToken = "";
   credentials.authorizationCode = "";
};

credentials.initialize = function() {
   credentials.clearAccess();
   credentials.mobileNumber = "";
};

credentials.getAccessToken = function() {
   //console.log("Expiration: " + credentials.expiration + "now: " + Date.now());
   if (!credentials.expired()) {
      return credentials.accessToken;
   } else {
	  credentials.refreshAccessToken();
      //credentials.softLogout();
      //$.mobile.changePage("#page-login");
      return null;
   }
};

$("#page-login").on("pageshow", function() {
   busyIndicator.hide();
   $('#mobileNumber').val("");
});

var logoutApp = function() {
   messageStorage.clear();
   credentials.logOut();
   $.mobile.changePage("#page-login");   
};

var logoutConfirm = function(buttonId) {
   if(buttonId == 1) {
      logoutApp();
      window.setInterval(navigator.app.exitApp, 500);
   }     
};

$("#buttonLogout").on('tap', function() {
   if(device.platform != "iOS") {
      showConfirmAlert("Logout and exit the app?", logoutConfirm, null, "Ok,Cancel");
   } else {
      logoutApp();
   }
});

$("#buttonRevoke").on('tap', function() {
	if(exists(credentials.timerId)) {
	   clearTimeout(credentials.timerId);
	   credentials.timerId = null;
	}
	busyIndicator.show();
	revokeAccessToken(credentials.accessToken);
	credentials.refreshAccessToken();
	busyIndicator.hide();
});

$("#buttonSettings").on('tap', function() {
	$.mobile.changePage("#page-settings");
});

$("#page-settings").on("pageshow", function() {
   setAuthLabels();
});

var getMobileNumber = function() {
   var phoneNumber = $('#mobileNumber').val();
   phoneNumber = phoneNumber.replace(/\D/g, '');
   return phoneNumber;
};

var messageStorage = {};
messageStorage.retrieve = function() {
   var storageString = localStorage.getItem(credentials.mobileNumber);
   var storageObj = JSON.parse(storageString);
   if (storageObj == null) {
      this.messageIndex = null;
      this.conversationGroups = null;
   } else {
      this.messageIndex = storageObj.messageIndex;
      this.conversationGroups = storageObj.conversationGroups;
   }
};

messageStorage.save = function() {
   localStorage.setItem(credentials.mobileNumber, JSON.stringify(this));
};

messageStorage.clear = function() {
   localStorage.removeItem(credentials.mobileNumber);
};

messageStorage.init = function() {
   this.messageIndex = {};
   this.conversationGroups = {};
};

function startLogin() {
   // if mobile # field is filled in, load page and begin oath
   if (validMobileNumber()) {
      credentials.mobileNumber = '+1' + getMobileNumber();
      getAuthorizationCode(authorizationCodeSuccess, authorizationCodeFailed, true, false);
   } else {
      showAlertView("Please enter a 10 digit mobile number");
   }
};

$("#loginButton").on('tap', startLogin);

function authorizationCodeSuccess(response) {
   // console.log("authorizationCodeSuccess: " + JSON.stringify(response, null,
   // 3));
   if (response.status < 300) {
      // load iframe with this url
      // TODO put the redirect URL is some config file easier to find
      $('#iframeAuthorization')
            .attr(
                  'src',
                  response.invocationResult.url
                        + "&redirect_uri=https://ldev.code-api-att.com/ATTDPSDEMO/landingpage.html");
      // console.log("authorizationCodeSuccess: load authZ page with: " +
      // $('#iframeAuthorization').attr('src'));
      $.mobile.changePage("#page-authorization");
   } else {
      authorizationCodeFailed(response);
   }
};

function authorizationCodeFailed(error) {
   showAlertView("Failed to get authorization code. " + JSON.stringify(error));
};

function getAuthorizationResult() {
   var currentUrl = this.contentDocument.location.href;
   var index = currentUrl.indexOf("code=");
   //console.log("index: " + index + " in url: " + currentUrl);
   if (index != -1) {
      $("#iframeAuthorization").hide();
      credentials.authorizationCode = currentUrl.substr(index + 5);
      busyIndicator.show();
      authorizeAccessToken(credentials.authorizationCode, accessTokenSuccess,
            accessTokenFail);
   } else {
      index = currentUrl.indexOf("error=");
      if (index != -1) {
         $("#iframeAuthorization").hide();
         accessTokenFail({
            'error' : currentUrl.substring(index + 6)
         });
      }
   }
};

$("#iframeAuthorization").on('load', getAuthorizationResult);

function accessTokenSuccess(result) {
   if ((exists(result.status) && result.status >= 300) || 
	   (exists(result.invocationResult.statusCode)) >= 300)
   {
      accessTokenFail(result);
   }
   
   credentials.accessToken = result.invocationResult.accessToken;
   credentials.setExpiration(result.invocationResult.expiresIn);
   credentials.refreshToken = result.invocationResult.refreshToken;
   setAuthLabels();
   if(!credentials.isLoggedIn()) {
      credentials.setLoggedIn();
      messageStorage.retrieve();
      $.mobile.changePage("#page-messageList");
   } else {
	   console.log("Access token refreshed successfully");
   }
   credentials.store();
   credentials.setupAccessTokenTimer();
}

function accessTokenFail(error) {
   $("#iframeAuthorization").hide();
   showAlertView("Failed to acquire access. "
         + JSON.stringify(error));
   busyIndicator.hide();
   credentials.softLogout();
   $.mobile.changePage("#page-login");
}

function validMobileNumber() {
   tempNumber = getMobileNumber();
   if (tempNumber.length != 10) {
      return false;
   } else if (tempNumber.substring(0, 0) == '1') {
      return false;
   } else {
      return true;
   }
}

var determineStartPage = function() {
   // Check if access token is stored and is valid. If so, load the uber
   // conversation page
   credentials.retrieve();
   if (credentials.isLoggedIn()) {
	   if(!credentials.expired()) {
		  credentials.setupAccessTokenTimer(); 
	      messageStorage.retrieve();
	      $.mobile.changePage("#page-messageList");
	   } else {
		   credentials.relogin();
		   credentials.refreshAccessToken();
	   }
   } else {
      $.mobile.changePage("#page-login");
   }
};

function loadConnectPage() {
   if (busyIndicator !== undefined) {
      busyIndicator.hide();
   }

   $.mobile.changePage("#page-connect");
}

var iamAppConnect = function() {
   if (busyIndicator !== undefined)
      busyIndicator.show();
   WL.Client.reloadApp();
};

function showAlertView(message, alertCallback, title, buttonName) {
   "use strict";
   if (!exists(title)) {
      title = "AT&T In App Messaging";
   }
   if(numErrors < 3) {
	  numErrors++;
      navigator.notification.alert(message, alertCallback, title, buttonName);
   } else {
	   console.log(message);
   }
}

function showConfirmAlert(message, alertCallback, title, buttonNames) {
   "use strict";
   if(!exists(title)) {
      title="In App Messaging";
   }
   
   if(numErrors < 3) {
	   numErrors++;
       navigator.notification.confirm(message, alertCallback, title, buttonNames);
   } else {
      console.log(message);
   }
}

$("#buttonConnect").on('tap', iamAppConnect);

$("#page-connect")
      .on(
            "pageshow",
            function() {
               if (busyIndicator !== undefined)
                  busyIndicator.hide();
               showAlertView("Unable to connect to Worklight server. Please verifiy connectivity, that server is started, and try again.");
            });

$("#page-messageList").on("pageshow", function() {
   $('#messageListHeader').text(credentials.mobileNumber);
   loadMessages();
   interval = setInterval(function () {
	      loadMessages();
	    }, 20000);
});

$("#page-messageList").on("pagehide", function() {
	clearInterval(interval);
});

$("#page-conversationList").on("pagebeforeshow", function() {
   $('#conversationList').empty();
   $('#conversationHeader').text(selectedId);
});

$("#page-conversationList").on("pageshow", function() {
   generateConversationList(selectedId);
   updateUnread(unreadMsgs);
});

$("#page-sendMessage").on("pagehide", function() {
	   clearComposePage();
	});

function messageListTap () {
   selectedId = $(this).attr('id');
   $.mobile.changePage("#page-conversationList", {
      transition : "slide"
    });
}

$("#newMessage-btn").on('tap', function() {
   event.preventDefault();
   $("#recipientInput").val(selectedId);
   $.mobile.changePage("#page-sendMessage");
});

function loadMessages() {
   if(credentials.expired()) return;
   
   if (messageStorage.messageIndex == null
         || messageStorage.messageIndex.state == undefined) {
      messageStorage.init();
      console.log("Initialized storage");
      invokeIamGetMessageIndexInfo(credentials.getAccessToken(),
            getMessageIndexInfoCallback);
   } else {
      console.log("Fetching Deltas");
      var state = messageStorage.messageIndex.state;
      invokeIamGetMessageDelta(state, credentials.getAccessToken(),
            getMessageDeltaCallback);
   }
}

function createMessageIndexCallback(data) {
   if (requestFailed(data))
      return;
   invokeIamGetMessageList(credentials.getAccessToken(), null,
         getMessageListCallback);
}

function getMessageListCallback(data) {
   if (requestFailed(data))
      return;
   populateMessageStorage(data);
   generateMessageList();
}

function getMessageDeltaCallback(data) {
   if (requestFailed(data))
      return;

   // TODO make separate functions for each(i.e delete,update,add)
   if (messageStorage.messageIndex.state != data.invocationResult.deltaResponse.state) {
      addsIdArr = [];
      for (var i = 0; i <= 1; i++) {
         if (data.invocationResult.deltaResponse.delta[i].adds.length > 0) {
            for (var j = data.invocationResult.deltaResponse.delta[i].adds.length - 1; j >= 0; j--) {
               addsIdArr
                     .push(data.invocationResult.deltaResponse.delta[i].adds[j].messageId);
            }
            addsObject = {};
            addsObject.messageIds = addsIdArr.toString();
            invokeIamGetMessageList(credentials.getAccessToken(), addsObject,
                  getMessageListCallback);
         }

         if (data.invocationResult.deltaResponse.delta[i].updates.length > 0) {
            for (var k = 0; k < data.invocationResult.deltaResponse.delta[i].updates.length; k++) {
               messageStorage.messageIndex.messages[data.invocationResult.deltaResponse.delta[i].updates[k].messageId].isUnread = data.invocationResult.deltaResponse.delta[i].updates[k].isUnread;

            }
         }

         if (data.invocationResult.deltaResponse.delta[i].deletes.length > 0) {
            for (var l = 0; l < data.invocationResult.deltaResponse.delta[i].deletes.length; l++) {

               var participant = getParticipants(messageStorage.messageIndex.messages[data.invocationResult.deltaResponse.delta[i].deletes[l].messageId]);
               delete messageStorage.messageIndex.messages[data.invocationResult.deltaResponse.delta[i].deletes[l].messageId];

               while (messageStorage.conversationGroups[participant].messageIDs
                     .indexOf(data.invocationResult.deltaResponse.delta[i].deletes[l].messageId) !== -1) {
                  messageStorage.conversationGroups[participant].messageIDs
                        .splice(
                              messageStorage.conversationGroups[participant].messageIDs
                                    .indexOf(data.invocationResult.deltaResponse.delta[i].deletes[l].messageId),
                              1);

               }
               if (messageStorage.conversationGroups[participant].messageIDs.length == 0) {
                  delete messageStorage.conversationGroups[participant];
               }
            }
         }
      }
   }

   messageStorage.messageIndex.state = data.invocationResult.deltaResponse.state;
   messageStorage.save();
   generateMessageList();
}

var requestFailed = function(result) {
    busyIndicator.hide();
	if (!exists(result)) {
      showAlertView("Unable to process request - no result received.");
      return true;
   } else if (exists(result.invocationResult.isSuccessful)) {
      if (result.invocationResult.isSuccessful == false
            || (result.invocationResult.isSuccessful == true && result.invocationResult.statusCode >= 300))
      {
    	 if(result.invocationResult.statusCode == 401) {
    		 credentials.refreshAccessToken();
    	 } else {
            showAlertView("Request failed: " + JSON.stringify(result));
    	 }
    	 return true;
      } else {
         return false;
      }
   } else {
      return false;
   }
};

var getMessageIndexInfoCallback = function(data) {
   if (!requestFailed(data)) {
      if (data.invocationResult.messageIndexInfo.status == "INITIALIZED") {
         invokeIamGetMessageList(credentials.getAccessToken(), null,
               getMessageListCallback);
      } else {
         invokeIamCreateMessageIndex(credentials.getAccessToken(),
               createMessageIndexCallback);
      }
   }
};

function deleteMessageCallback(data) {
   $("#" + deleteId).hide();
}

function deleteMessagesCallback(data) {
   $("#" + deleteId).hide();
}

function updateUnread(unreadArr) {
   var unReadObj = {};
   var unreadId;
   if (unreadArr.length == 1) {
      unreadId = unreadArr[0];
      unReadObj = {
         "isUnread" : false
      };
      invokeIamUpdateMessage(unreadId, unReadObj, credentials.getAccessToken(),
            messageUpdateCallback);
   } else if (unreadArr.length > 1) {
      unReadObj = [];
      for (var k = 0; k < unreadArr.length; k++) {
         unReadObj[k] = {
            "messageId" : unreadArr[k],
            "isUnread" : false
         };
      }
      invokeIamUpdateMessages(unReadObj, credentials.getAccessToken(),
            messageUpdateCallback);
   }
}

function messageUpdateCallback(data) {
   if (!requestFailed(data)) {
      messageStorage.conversationGroups[selectedId].hasUnread = false;
   }
}

function populateMessageStorage(data) {
   if (requestFailed(data))
      return;

   var messages = {};
   for (var i = data.invocationResult.messageList.messages.length - 1; i >= 0; --i) {

      newKey = data.invocationResult.messageList.messages[i];
      messages[newKey.messageId] = newKey;

      delete messages[newKey.messageId].messageId;
   }

   if (messageStorage.messageIndex.messages == undefined) {
      messageStorage.messageIndex.messages = {};
      messageStorage.messageIndex = data.invocationResult.messageList;
      messageStorage.messageIndex.messages = messages;

   } else {
      $.each(messages, function(key) {
         messageStorage.messageIndex.messages[key] = messages[key];
      });

   }

   populateConversationStorage(messages);
}

function getParticipants(messageData) {
   if (messageData.recipients.length > 1) {
      var participantsArr = [];
      if (messageData.isIncoming == false) {
         for (var i = 0; i < messageData.recipients.length; i++) {
            participantsArr.push(messageData.recipients[i].value);
         }
      } else {
         participantsArr.push(messageData.from.value);
         for (var i = 0; i < messageData.recipients.length; i++) {
            if (messageData.recipients[i].value != credentials.mobileNumber) {
               participantsArr.push(messageData.recipients[i].value);
            }
         }
      }
      participantsArr.sort();
      return participantsArr.toString();

   }
   // If not a group message
   else {
      if (messageData.isIncoming == false) {

         return messageData.recipients[0].value;
      } else {

         return messageData.from.value;
      }
   }
}

var populateConversationStorage = function(messages) {
   $
         .each(
               messages,
               function(key) {
                  var participants = getParticipants(messages[key]);

                  if (messageStorage.conversationGroups[participants] == undefined) {
                     messageStorage.conversationGroups[participants] = {};
                     messageStorage.conversationGroups[participants].messageIDs = [];
                     messageStorage.conversationGroups[participants].hasUnread = false;
                  }
                  if (messages[key].type == "MMS") {
                     for (var i = 0; i < messages[key].mmsContent.length; i++) {
                        if (messages[key].mmsContent[i].type == "TEXT") {

                           invokeIamGetMessageContent(
                                 messages[key].mmsContent[i].contentUrl,
                                 credentials.getAccessToken(),
                                 getMmsTextCallback);
                        } else {
                           messageStorage.messageIndex.messages[key].text = "";
                        }
                     }
                  }
                  messageStorage.conversationGroups[participants].messageIDs
                        .push(key);
                  messageStorage.conversationGroups[participants].lastMsg = key;
                  messageStorage.conversationGroups[participants].lastTS = messages[key].timeStamp;
                  if (messages[key].isUnread == true) {
                     messageStorage.conversationGroups[participants].hasUnread = true;
                  }
               });

   messageStorage.save();

   console.log("Messages Stored Successfully");
};

var getMmsTextCallback = function(data) {
   if (requestFailed(data))
      return;

   var str = data.invocationContext.urlPath,
   arr = str.split('/'),
   msgId = arr[arr.indexOf('messages') + 1]; 
   messageStorage.messageIndex.messages[msgId].text = data.invocationResult.result.message.content;
};
function generateMessageList() {
   $('#messageList').empty();

   var msgStatus, msgText, timestamp, label;

   var sortedKey = Object
         .keys(messageStorage.conversationGroups)
         .sort(
               function(a, b) {
                  busyIndicator.hide();
                  if (messageStorage.conversationGroups[a].lastTS == messageStorage.conversationGroups[b].lastTS) {
                     return 0;
                  }
                  return messageStorage.conversationGroups[a].lastTS < messageStorage.conversationGroups[b].lastTS ? 1
                        : -1;
               });

   for (var i = 0; i < sortedKey.length; i++) {
      if (messageStorage.conversationGroups[sortedKey[i]].hasUnread == true) {
         msgStatus = "newMsg";
      } else {
         msgStatus = "oldMsg";
      }

      label = sortedKey[i];
      msgID = messageStorage.conversationGroups[sortedKey[i]].lastMsg;
      if (messageStorage.messageIndex.messages[msgID].type == "TEXT") {
         msgText = messageStorage.messageIndex.messages[msgID].text;
      } else {
         if (messageStorage.messageIndex.messages[msgID].typeMetaData.subject == "") {
            msgText = "[No Subject]";

         } else {
            msgText = "Subject: "
                  + messageStorage.messageIndex.messages[msgID].typeMetaData.subject;

         }
      }
      timestamp = getDate(messageStorage.conversationGroups[sortedKey[i]].lastTS);

      $("#messageList").append(
            "<li class='" + msgStatus + "' id ='" + label
                  + "'> <h3 class= 'ui-li-heading'>" + label
                  + "</h3> <span class= 'ui-li-desc'>" + msgText
                  + "</span> <span class= 'ui-li-aside ui-li-desc'>"
                  + timestamp + "</span></li>");
   }

   $('#messageList li').on('tap', messageListTap);

   $('#messageList li').on(
         'taphold',
         function() {
            $('#messageList li').off('tap');
            deleteId = $(this).attr('id');
            showConfirmAlert("This thread will be deleted",
                  deleteThreadCallback, "Delete", null);
         });

   busyIndicator.hide();
   $('#messageList').listview('refresh');
}

function generateConversationList(participants) {
   var from, msgID, timestamp, msgText, messageClass, float_direction, fromInfo;

   unreadMsgs = [];
   // console.log("participants: " + participants + " number of messages: " +
   // messageStorage.conversationGroups[participants].messageIDs.length);

   for (var i = messageStorage.conversationGroups[participants].messageIDs.length-1; i >= 0; i--) {
      msgID = messageStorage.conversationGroups[participants].messageIDs[i];
      from = messageStorage.messageIndex.messages[msgID].from.value;
      parseTimeStamp = new Date(
            messageStorage.messageIndex.messages[msgID].timeStamp);
      timestamp = parseTimeStamp.toLocaleTimeString().replace(/:\d+$/, '');

      // WL.Logger.debug("i: " + i + " msdID: " + msgID + " \nfrom: " + from +
      // "time: " + timestamp + " type: " +
      // messageStorage.messageIndex.messages[msgID].type);
      if (messageStorage.messageIndex.messages[msgID].isUnread == true) {
         unreadMsgs.push(msgID);
      }

      if (messageStorage.messageIndex.messages[msgID].type == "TEXT") {
         msgText = messageStorage.messageIndex.messages[msgID].text;
      } else {
         msgText = "";
         if(exists(messageStorage.messageIndex.messages[msgID].text)) {
            msgText = messageStorage.messageIndex.messages[msgID].text + "<br>";
         }
         // for MMS
         for (var iContent = 0; iContent < messageStorage.messageIndex.messages[msgID].mmsContent.length; iContent++) {
            if (messageStorage.messageIndex.messages[msgID].mmsContent[iContent].contentName
                  .indexOf("smil.xml") == -1 && messageStorage.messageIndex.messages[msgID].mmsContent[iContent].type != "TEXT") // SMIL not for user consumption
            {
               // TODO: Download the attachment and get the content
               msgText = msgText
                     + "Attachment: "
                     + messageStorage.messageIndex.messages[msgID].mmsContent[iContent].contentName
                     + "<br><button data-contentUrl='"
                     + messageStorage.messageIndex.messages[msgID].mmsContent[iContent].contentUrl
                     + "'> Download </button><br><br>";
            }
         }
         // WL.Logger.debug("msgText: " + msgText);
      }

      subject = "";
      if(exists(messageStorage.messageIndex.messages[msgID].typeMetaData.subject))
      {
         subject = messageStorage.messageIndex.messages[msgID].typeMetaData.subject;
         if(subject != "") {
            subject = subject + "<br><br>";
            msgText = "Sub:" + subject + msgText;
         }
      }
      
      if (from == credentials.mobileNumber) {
         messageClass = "bubbledRight";
         float_direction = "pull-right";
         fromInfo = "";
      } else {
         messageClass = "bubbledLeft";
         float_direction = "pull-left";
         fromInfo = "<span class = '" + float_direction + "   messageInfo  ' >"
               + from + " </span>";
      }

      $("#conversationList").append(
            "<li id='" + msgID + "'>" + fromInfo + " <div class = '"
                  + messageClass + "'> " + msgText + " </div> <span class = '"
                  + float_direction + " messageInfo messageMargin' >" + timestamp
                  + " </span> </li>");

   }

   $('#conversationList button').on('tap',downloadAttachment);

   $('#conversationList li').on(
         'taphold',
         function() {
            deleteId = $(this).attr('id');
            showConfirmAlert("This message will be deleted", deleteMsgCallback,
                  "Delete", null);

         });
}

function getDate(timestamp) {
	   var msgTS = new Date(timestamp);
	   var msgDate = msgTS.getMonth() + "/" + msgTS.getDate() + "/" + msgTS.getFullYear();
	    return msgDate;
	}

function deleteMsgCallback(buttonIndex) {
   if (buttonIndex == 1) {
      console.log("Message being deleted:" + deleteId);
      invokeIamDeleteMessage(deleteId, credentials.getAccessToken(),
            deleteMessageCallback);
   }
}

// send message
function sendMessage() {
   var AddString, addArr;
   var textffield = document.getElementById("recipientInput");
   var message = $("#messageInput").val();
   var subject = $("#subjectInput").val();

   if (textffield.value.length > 0) {
      var msisdn1 = $("#recipientInput").val();
      addArr = (msisdn1.split(","));
      AddString = [];
      for (var i = 0; i < addArr.length; i = i + 1) {
         if (addArr[i].indexOf("@") > 0) {
            AddString.push(addArr[i]);
         } else if (addArr[i].length >= 10) {
            AddString.push('tel:' + addArr[i]);
         } else if (addArr[i].length <= 8)
            AddString.push('short:' + addArr[i]);
      }

      busyIndicator.show();
      invokeIamSendMessage(AddString, message, subject, attachments, $('#checkboxGroupMessage').is(':checked'),
            credentials.getAccessToken(), sendMessageCallback);
   } else {
      showAlertView("Please enter a recipient");
   }
};

$('#buttonSendMessage').on('tap', sendMessage);

function sendMessageCallback(data) {
   busyIndicator.hide();
   
   if (requestFailed(data))
      return;

   //console.log(msgId);
   showAlertView("Message sent");
   clearComposePage();
   $.mobile.changePage("#page-messageList");
}

var attachments = {};
var currentImage = "";

$("#buttonAddAttachment").on('tap', function() {
   getPhoto(navigator.camera.PictureSourceType.PHOTOLIBRARY);
});

var clearComposePage = function() {
   attachments = {};
   currentImage = "";
   $('#recipientInput').val("");
   $('#checkboxGroupMessage').val("");
   $('#subjectInput').val("");
   $('#messageInput').val("");
   $('#images').html(""); 
};

var getPhoto = function(source) {
   busyIndicator.show();
   navigator.camera.getPicture(onSuccessGetPhoto, onFailGetPhoto, {
      destinationType : Camera.DestinationType.FILE_URI,
      sourceType : source,
      mediaType : Camera.MediaType.PICTURE
   });
};

var onSuccessGetPhoto = function(imageUri) {
   console.log("onSuccessGetPhoto: " + imageUri);
   currentImage = imageUri;
   window.resolveLocalFileSystemURI(imageUri, gotFileEntry, failedResolveFile);
};

var origImg;

var gotFileEntry = function(entry) {
   try {
      console.log("gotFileEntry entry: " + JSON.stringify(entry,null,3));
      entry.file(function(file) {
         var reader = new FileReader();
         reader.onloadend = function(evt) {
            //console.log("FileReder loadend event result: " + JSON.stringify(evt,null,3));
            if (evt.target.result) {
               // resize the image
               if ($('#sliderResize').val() < 100) {
                  origImg = new Image;
   
                  origImg.onload = resizeImage;
                  origImg.quality = $('#sliderResize').val() / 100; // resize by
                                                                     // this factor
                  origImg.fileName = file.name;
                  origImg.src = evt.target.result;
               } else {
                  setAttachment(currentImage, file.name, evt.target.result);
                  busyIndicator.hide();
               }
            } else {
               busyIndicator.hide();
               showAlertView("File read error: "
                     + FileError.toMessage(evt.target.error.code));
            }
         };
         
         reader.onerror = function(evt) {
            busyIndicator.hide();
            showAlertView("File read error: " + JSON.stringify(evt,null,3));
         };
         
         reader.onabort = function(evt) {
            busyIndicator.hide();
            showAlertView("FileReader abort: " + JSON.stringify(evt));
         };
         
         reader.readAsDataURL(file);
      }, failedEntryFile);
   } catch (readException) {
      console.log("gotFileEntry exception: " + JSON.stringify(readException,null,3));
      busyIndicator.hide();
   }
};

var resizeImage = function() {
   // / create an off-screen canvas
   var canvas = document.createElement('canvas');

   resizedWidth = parseInt(this.width * this.quality);
   resizedHeight = parseInt(this.height * this.quality);
   canvas.width = resizedWidth;
   canvas.height = resizedHeight;

   var ctx = canvas.getContext("2d");

   // / draw source image into the off-screen canvas:
   ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, resizedWidth,
         resizedHeight);

   var newDataUri = canvas.toDataURL();

   setAttachment(currentImage, this.fileName, newDataUri);
   busyIndicator.hide();
};

var setAttachment = function(imageUri, fileName, base64) {
   var maxAttach = 1048576;
   if (base64.length >= maxAttach) {
      busyIndicator.hide();
      showAlertView("Encoded file is "
            + parseFloat(base64.length / 1024 / 1024).toFixed(2)
            + " MB. It must be less than 1MB. Please resize photo.");
      return;
   }

   // base64 is prefixed with content type in this format:
   // "data:image/jpeg;base64,...actual base64 data here..."
   // Extract the content type based on above format
   startOfType = base64.indexOf(':') + 1;
   endOfType = base64.indexOf(',');
   subTypeStart = base64.indexOf('/') + 1;
   subTypeEnd = base64.indexOf(';');

   if (startOfType == -1 || endOfType == -1) {
      showAlertView("Attachment formatting failed.");
      return;
   }

   attachments[imageUri] = {};
   attachments[imageUri]['content-type'] = base64.substring(startOfType,
         endOfType);
   attachments[imageUri].body = base64.substring(endOfType + 1);

   extPos = fileName.lastIndexOf('.');
   extension = fileName.substring(extPos + 1);
   extension = extension.toLowerCase();
   subType = base64.substring(subTypeStart, subTypeEnd);
   subType = subType.toLowerCase();
   if (subType == 'jpeg')
      subType == 'jpg';
   if (extension != subType) {
      fileName = fileName.substring(0, extPos + 1) + subType;
   }
   attachments[imageUri].fileName = fileName;

   document.getElementById("images").innerHTML += "<img src ='"
         + imageUri
         + "' height = '65' width = '65' style = 'margin-left:10px;border:1px solid black'/>";
};

var failedEntryFile = function(fileError) {
   failedFile("failedEntryFile", fileError);
};

var failedResolveFile = function(fileError) {
   failedFile("failedResolveFile", fileError);
};

var failedFile = function(from, fileError) {
   busyIndicator.hide();
   showAlertView(from + " failed with code " + fileError.code + " "
         + fileCodeToMessage(fileError.code));
};

var fileCodeToMessage = function(code) {
   if (code == FileError.NOT_FOUND_ERR) {
      codeMsg = "FileError.NOT_FOUND_ERR";
   } else if (code == FileError.SECURITY_ERR) {
      codeMsg = "FileError.SECURITY_ERR";
   } else if (code == FileError.ABORT_ERR) {
      codeMsg = "FileError.ABORT_ERR";
   } else if (code == FileError.NOT_READABLE_ERR) {
      codeMsg = "FileError.NOT_READABLE_ERR";
   } else if (code == FileError.ENCODING_ERR) {
      codeMsg = "FileError.ENCODING_ERR";
   } else if (code == FileError.NO_MODIFICATION_ALLOWED_ERR) {
      codeMsg = "FileError.NO_MODIFICATION_ALLOWED_ERR";
   } else if (code == FileError.INVALID_STATE_ERR) {
      codeMsg = "FileError.INVALID_STATE_ERR";
   } else if (code == FileError.SYNTAX_ERR) {
      codeMsg = "FileError.SYNTAX_ERR";
   } else if (code == FileError.INVALID_MODIFICATION_ERR) {
      codeMsg = "FileError.INVALID_MODIFICATION_ERR";
   } else if (code == FileError.QUOTA_EXCEEDED_ERR) {
      codeMsg = "FileError.QUOTA_EXCEEDED_ERR";
   } else if (code == FileError.TYPE_MISMATCH_ERR) {
      codeMsg = "FileError.TYPE_MISMATCH_ERR";
   } else if (code == FileError.PATH_EXISTS_ERR) {
      codeMsg = "FileError.PATH_EXISTS_ERR";
   } else {
      codeMsg = "FileError.UNKNOWN";
   }
   return codeMsg;
};

FileError.toMessage = fileCodeToMessage;

function onFailGetPhoto(message) {
   busyIndicator.hide();
   showAlertView('No file chosen. ' + message);
}

function onResume() {
   if ($.mobile.activePage.is('#page-messageList')) {
      loadMessages();
   }
}
var exists = function(thing) {
   if (thing !== undefined && thing != null)
      return true;
   else
      return false;
};

var fileSystem;
document.addEventListener(
            "deviceready",
            function() {
               document.addEventListener("resume", onResume, false);

               window
                     .requestFileSystem(
                           LocalFileSystem.PERSISTENT,
                           0,
                           function onSuccess(fs) {
                              fileSystem = fs;
                              fileSystem.root.getDirectory(
                                    "Download",
                                    {
                                       create : true,
                                       exclusive : false
                                    },
                                    function onSuccess(dirEntry) {
                                       downloadDir = dirEntry;
                                    },
                                    function onError(error) {
                                       showAlertView("Cannot access Download Folder. Will not be able to Download Attachments. Error: "
                                             + error.code);
                                    });                              
                           },
                           function onError(error) {
                              showAlertView("Cannot get file system.  Will not be able to send attachments. Error: "
                                    + error.code);
                           });
            }, false);

$('#deleteThread').on(
      'tap',
      function() {
         showConfirmAlert("This thread will be deleted", deleteThreadCallback,
               "Delete", null);
      });

function deleteThreadCallback(buttonIndex) {
   if (buttonIndex == 1) {
      var deleteMsgId;

      for (var i = 0; i < messageStorage.conversationGroups[deleteId].messageIDs.length; i++) {
         deleteMsgId = messageStorage.conversationGroups[deleteId].messageIDs[i];
         invokeIamDeleteMessage(deleteMsgId, credentials.getAccessToken(),
               deleteMessagesCallback);
      }
   }

   if(buttonIndex == 1 || buttonIndex == 2) {
      $('#messageList li').on('tap', messageListTap);
   }
}

function downloadAttachment() {
   var mmsContentUrl = $(this).attr('data-contentUrl');
   invokeIamGetMessageContent(mmsContentUrl,credentials.getAccessToken(),getMessageContentCallback);
}

function getMessageContentCallback(data) {
   if (requestFailed(data))
      return;
   var message = data.invocationResult.result.message;
   
   if(message == undefined) return;
   
   var base64data = data.invocationResult.result.message.base64;
   contentData = data.invocationResult.result.message.contentType;
   var attachmentName = contentData.substring(contentData.lastIndexOf("=")+1, contentData.lastIndexOf(";")); 
   dataFile(base64data);
   downloadDir.getFile(attachmentName, {create: true, exclusive: false}, gotAttachmentFileEntry, fileCodeToMessage);
}

function gotAttachmentFileEntry(fileEntry) {
   fileEntry.createWriter(gotFileWriter, fileCodeToMessage);
}

function gotFileWriter(writer) {   
   writer.onwritestart = function(evt) {
      console.log("File write started");        
   };
   writer.onwriteend = function(evt) {
      busyIndicator.hide();
      console.log("File write successful");
      showAlertView("Download Complete");        
   };
   writer.write(file);
}

var file;

function dataFile(bs64data) {

   var binary = window.atob(bs64data);
   var bArray = []; 
   for (var i = 0; i < binary.length; i++) {
      bArray.push(binary.charCodeAt(i));  // convert to binary.. 
      } 
   fileArr = new Uint8Array(bArray);
   file=fileArr.buffer;
}

function setAuthLabels()
{
   $("label[for='accessToken']").text("AccessToken: " + credentials.accessToken.substring(1, 6) + "****");
   $("label[for='refreshToken']").text("RefreshToken: " + credentials.refreshToken.substring(1, 6) + "****");
   $("label[for='expiresAt']").text("Expires At: " + credentials.expiration);	
}
