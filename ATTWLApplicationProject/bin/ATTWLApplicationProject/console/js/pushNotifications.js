/*
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

// Push Notification tab

var EventSourcesNumberOfMessages = {},
	PushServicesNumberOfMessages = {},
	PUSHNOTIFICATIONS = PUSHNOTIFICATIONS || {};

PUSHNOTIFICATIONS.ANIMATION = true;
PUSHNOTIFICATIONS.TIMER = null;
PUSHNOTIFICATIONS.REFRESHINTERVAL = 2 * 60 * 1000;
PUSHNOTIFICATIONS.C2DMTOKEN = null;
PUSHNOTIFICATIONS.C2DMAUTHSTARTED = false;


PUSHNOTIFICATIONS.KILLTIMER = function () {
	window.clearInterval(PUSHNOTIFICATIONS.TIMER);
};

$(document).ready(function () {
    $('#changeAnimationStatus').live('click', changeAnimationStatus);
    $('#unsubscribeDevices').live('click', unsubscribeDevicesClicked);
    $('#doUnsubscribeButton').live('click', doUnsubscribeClicked);
    $('#cancelUnsubscribeButton').live('click', cancelUnsubscribeClicked);
    $('#closeUnsubscriptionButton').live('click', cancelUnsubscribeClicked);
    $('#numbersToUnsubscribe').live('keyup', numbersToUnsubscribeUpdated);
    
    //setTimeout(unsubscribeDevicesClicked, 200);

    setTimeout('checkAnimationStatus()', 1000);
});


// cookies are used to see if the user has choosen to hide animation in the notification tab
function setCookie(cookieName, value, exdays) {
	var exdate = new Date(),
		c_value;
	exdate.setDate(exdate.getDate() + (exdays || 0));
	c_value = window.escape(value) + '; expires=' + exdate.toUTCString();
	document.cookie = cookieName + '=' + c_value;
}

function getCookie(cookieName) {
	var i, x, y, ARRcookies = document.cookie.split(';');
	for (i = 0; i < ARRcookies.length; i += 1) {
		x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='));
		y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1);
		x = x.replace(/^\s+|\s+$/g, '');
		if (x === cookieName && y === 'true') {
			return true
		}
	}
	return false;
}

// change the text of the navigation according to the user prefrences, animations are on by default.
function checkAnimationStatus() {
	if (getCookie('animationStatus')) {
		$('#animationsStatus').html(Messages.enabled.toLowerCase());
		$('#changeAnimationStatus').html(Messages.disable);
	} else {
		$('#animationsStatus').html(Messages.disabled.toLowerCase());
		$('#changeAnimationStatus').html(Messages.enable);
	}
}

// change the cookie according to the user choise, and set the gloabl variable that will be used later to determin if to show animation or not
function changeAnimationStatus() {
	var setCookieValue;
	if (getCookie('animationStatus')) {
		setCookieValue = 'false';
		PUSHNOTIFICATIONS.ANIMATION = false;
	} else {
		setCookieValue = 'true';
		PUSHNOTIFICATIONS.ANIMATION = true;
	}
	setCookie('animationStatus', setCookieValue, 365);
	checkAnimationStatus();
}

//---------------------- Event sources management ------------------------------
function simulateMessageLength() {
	var length = $('#simulateMessageNotificationText').val().length,
		Separator = '/',
		outOf = '250';
	$('#simulateMessageLength').val(length + Separator + outOf);
}

function simulateMessageSend() {
	var simulateMessageFrom = $('#simulateMessageFrom').val(),
		simulateMessageUserID = $('#simulateMessageUserID').val(),
		simulateMessageDevice = $('#simulateMessageDevice').val(),
		simulateMessageNotificationText = $('#simulateMessageNotificationText').val();
	window.alert('simulateMessageFrom: ' + simulateMessageFrom + '\n' + 'simulateMessageUserID: ' + simulateMessageUserID + '\n' + 'simulateMessageDevice: ' + simulateMessageDevice + '\n' + 'simulateMessageNotificationText: ' + simulateMessageNotificationText);
	$('#simulateMessage').hide();
}

function simulateMessage(elm) {
	$('#simulateMessageFrom').val(elm.target.id);
	$('#simulateMessage').show();
	simulateMessageLength();
	$('#simulateMessageNotificationText').unbind('click');
	$('#simulateMessageNotificationText').bind('keyup', function () {
		simulateMessageLength();
	});
	$('#simulateMessageClose').unbind('click');
	$('#simulateMessageClose').bind('click', function () {
		$('#simulateMessage').hide();
	});
	$('#simulateMessageSend').unbind('click');
	$('#simulateMessageSend').bind('click', function () {
		simulateMessageSend();
	});
}

function animate(id) {
	if (getCookie('animationStatus')) {
		$('#' + id).fadeToggle().fadeToggle().fadeToggle().fadeToggle();
	}
}

function updateColumnHeight() {
	var i,
		columns = $('.column'),
		maxHeight = 0;

	$(columns).css('min-height', '500px');
	$('.main').css('min-height', '500px');

	for (i = 0; i < columns.length; i += 1) {
		maxHeight = Math.max(maxHeight, $(columns[i]).height());
	}

	$('.column').css('min-height', maxHeight);
	$('.main').css('min-height', maxHeight);
}

function populateEventSourcesList(data) {
	$('.eventSource').remove();
	var eventSourceTemplate = '' +
		'{{each eventSources}}' +
		'<div class="eventSource active">' +
		'	<div class="eventSourceTitle">' +
		'		<h3>${$item.eventSourceName($value.qname)}</h3>' +
		'		<h4>${$item.adapterName($value.qname)}</h4>' +
		'		<!-- h5 class="active">Active</h5 -->' +
		'	</div>' +
		'	<div class="eventSourceBody">' +
		'		<p>${$value.numberOfSubscribedUsers} ' + Messages.subscribedUsers + '</p>' +
		'		<!-- p>xxx,xxx ' + Messages.subscribedDevices + '</p -->' +
		'		<div class="incomingMessages" id="${$item.incomingMessages($value.qname)}">' +
		'			<p>${$item.newMessages($value.qname, $value.numberOfMessagesSent)} ' + Messages.newMessages + '</p>' +
		'			<p>${$value.numberOfMessagesSent} ' + Messages.totalMessages + '</p>' +
		'		</div>' +
		'	</div>' +
		'	<div class="eventSourceFooter">' +
		'		<a class="simulateMessage" id="${$value.qname}">' + Messages.simulateMessage + '</a>' +
		'		<a class="enableDisable">Disable</a>' +
		'	</div>' +
		'</div>' +
		'{{/each}}';

	$.template('eventSourceTemplate', eventSourceTemplate);
	$.tmpl('eventSourceTemplate', data, {
		eventSourceName : function (qname) {
			return qname.split('.')[1];
		},

		adapterName : function (qname) {
			return qname.split('.')[0];
		},

		// return the id that will be used with the arrow for animation		
		incomingMessages : function (qname) {
			// this is the ID
			return qname.split('.')[1] + qname.split('.')[0];
		},

		newMessages : function (qname, newNumberOfMessagesSent) {
			// this is the ID
			var incomingMessagesId = qname.split('.')[1] + qname.split('.')[0],
				newMessages = 0,
				oldNumberOfMessagesSent;
				
			newNumberOfMessagesSent = newNumberOfMessagesSent || 0;

			// EventSourcesNumberOfMessages is a global object that store the id number of messages and should it be animated
			if (!EventSourcesNumberOfMessages[incomingMessagesId]) {
				EventSourcesNumberOfMessages[incomingMessagesId] = {};
				EventSourcesNumberOfMessages[incomingMessagesId].numberOfMessages = 0;
			}

			oldNumberOfMessagesSent = EventSourcesNumberOfMessages[incomingMessagesId].numberOfMessages;

			// check if sent messages is bigger then previous number of message, if true then change the number of new messages from 0 to new value
			if (oldNumberOfMessagesSent < newNumberOfMessagesSent) {
				newMessages = newNumberOfMessagesSent - oldNumberOfMessagesSent;
				EventSourcesNumberOfMessages[incomingMessagesId].animate = true;
			} else {
				EventSourcesNumberOfMessages[incomingMessagesId].animate = false;
			}

			// set the munber of sent messages to new value
			EventSourcesNumberOfMessages[incomingMessagesId].numberOfMessages = newNumberOfMessagesSent;

			return newMessages;
		}
	}).appendTo('#eventSources');

	$('.simulateMessage').bind('click', simulateMessage);

	$('#eventSources .incomingMessages').each(function () {
		if (EventSourcesNumberOfMessages[this.id].animate === true) {
			animate(this.id);
		}
	});
	updateColumnHeight();
}

function getEventSources() {
	$.ajax({
		url: 'api/push/eventSources/all',
		type: 'GET',
		success: function (data) {
			data = {eventSources: data};
			populateEventSourcesList(data);
		}
	});
}

//---------------------- Applications management ------------------------------
function populateApplicationsList(data) {
	$('.notificationsToApp').remove();
	var appTemplate = '' +
		'{{each applications}}' +
		'<!-- ${$item.setId($value.id)} -->' +
		'<div class="notificationsToApp active">' +
		'	<div class="pushServiceTitle">' +
		'		<h3 class="notificationsToAppTitle"><img src="api/applications/thumbnail/${$value.displayName}" alt="${$value.displayName}" />${$value.displayName}</h3>' +
		'	</div>' +
		'	<div class="notificationsToAppBody">' +
		'		<p>${$value.userCount} ' + Messages.subscribedUsers + '</p>' +
		'		<p>${$value.deviceCount} ' + Messages.subscribedDevices + '</p>' +
		'	</div>' +
		'	{{each applicationEnvironments}}' +
		'	<div class="service">' +
		'		<h4 class="${$value.mediatorType}">${$value.mediatorType}</h4>' +
		'		<h5 class="${$item.disabledEnabledClass($value.enabled)}">${$item.disabledEnabledText($value.enabled)}</h5>' +
		'		<!-- h6>' + Messages.version + ' ${$value.version}</h6 -->' +
		'		<div class="pushServiceBody">' +
		'			<div class="incomingMessages" id="${$item.incomingMessagesId($value.mediatorType)}">' +
		'				<p>${$item.newMessages($value.mediatorType, $value.numberOfMessagesSent)} ' + Messages.newMessages + '</p>' +
		'				<p>${$value.numberOfMessagesSent} ' + Messages.totalMessages + '</p>' +
		'			</div>' +
		'			<p>${$value.userCount} ' + Messages.subscribedUsers + '</p>' +
		'			<p>${$value.deviceCount} ' + Messages.subscribedDevices + '</p>' +
		'			<p class="errorMessage">Error message can go here, if necessary. It can occupy multiple lines.</p>' +
		'			<!-- button>Call for Action</button -->' +
		'		</div>' +
		'	</div>' +
		'	{{/each}}' +
		'	<div class="notificationsToAppFooter">' +
		'		<a class="enableDisable">Enable</a>' +
		'	</div>' +
		'</div>' +
		'{{/each}}';

	$.template('appTemplate', appTemplate);
	$.tmpl('appTemplate', data, {
		incomingMessagesId : function (mediatorType) {
			//return applicationId.replace(/\./g, '');
			return mediatorType + '_' + this.id;
		},
		setId : function (id) {
			this.id = id;
		},
		disabledEnabledClass : function (enabled) {
			if (enabled) {
				return 'active';
			}
			return 'disabled';
		},
		disabledEnabledText : function (enabled) {
			if (enabled) {
				return Messages.enabled;
			}
			return Messages.disabled;
		},
		newMessages : function (mediatorType, newNumberOfMessagesSent) {
			// this is the ID
			//var incomingMessagesId = applicationId.replace(/\./g, ''),
			var incomingMessagesId = mediatorType + '_' + this.id,
			newMessages = 0,
			oldNumberOfMessagesSent;
			
			newNumberOfMessagesSent = newNumberOfMessagesSent || 0;

			// PushServicesNumberOfMessages is a global object that store the id, number of messages and should it be animated
			if (!PushServicesNumberOfMessages[incomingMessagesId]) {
				PushServicesNumberOfMessages[incomingMessagesId] = {};
			}

			oldNumberOfMessagesSent = PushServicesNumberOfMessages[incomingMessagesId].numberOfMessages || 0;

			// check if sent messages is bigger then previous number of message, if true then change the number of new messages from 0 to new value
			if (oldNumberOfMessagesSent < newNumberOfMessagesSent) {
				newMessages = newNumberOfMessagesSent - oldNumberOfMessagesSent;
				PushServicesNumberOfMessages[incomingMessagesId].animate = true;
			} else {
				PushServicesNumberOfMessages[incomingMessagesId].animate = false;
			}

			// set the munber of sent messages to new value
			PushServicesNumberOfMessages[incomingMessagesId].numberOfMessages = newNumberOfMessagesSent;

			return newMessages;
		}
	}).appendTo('#notificationsToApps');

	$('#notificationsToApps .incomingMessages').each(function () {
		if (PushServicesNumberOfMessages[this.id].animate === true) {
			animate(this.id);
		}
	});

	updateColumnHeight();
}

function getApplicationsWithPushNotifications() {
	$.ajax({
		url: 'api/push/applications/all',
		type: 'GET',
		success: function (data) {
			data = {
				applications : $.grep(data, function (element) {
					return !(element.name === 'reports');
				})
			};
			populateApplicationsList(data);
		}
	});
}

function pushNotifications() {
	getEventSources();
	//getPushServices();
	getApplicationsWithPushNotifications();

	PUSHNOTIFICATIONS.TIMER = window.setInterval(function () {
		getEventSources();
		//getPushServices();
		getApplicationsWithPushNotifications();
	}, PUSHNOTIFICATIONS.REFRESHINTERVAL);
	checkAnimationStatus();
	
	services.hideFeedback();
}

// ---------------------- Push services management ------------------------------
// deprecated
function populatePushServicesList(data) {
	$('.pushService').remove();

	var serviceTemplate =
		'{{each mediators}}' +
		'<div class="pushService active">' +
		'	<div class="pushServiceTitle">' +
		'	{{if $value.type === "Apple"}}' +
		'		<h3 class="apple">' + Messages.apple + '</h3>' +
		'	{{else}}' +
		'		<h3 class="google">' + Messages.google + '</h3>' +
		'	{{/if}}' +
		'	{{if $value.authenticationStatus === "Success" || $value.authenticationStatus === null}}' +
		'		<h5 class="active">' + Messages.active + '</h5>' +
		'	{{else}}' +
		'		<h5 class="error">' + Messages.error + '</h5>' +
		'	{{/if}}' +
		'	</div> ' +
		'	<div class="pushServiceBody">' +
		'	{{if $value.authenticationStatus === "BadAuthentication"}}' +
		'		<p class="redText">' + Messages.invalidC2DMLoginCredentials + '</p>' +
		'	{{else $value.authenticationStatus === "CaptchaRequired"}}' +
		'		<p class="redText">' + Messages.waitingForAuthentication + '</p>' +
		'		<div id="c2dmCaptcha">' +
		'			<img id="c2dmCaptchaImage" src="images/captcha-placeholder.png" />' +
		'			<input id="c2dmCaptchaText" class="greyText" type="text" placeholder="' + Messages.enterCaptcha + '" />' +
		'		</div>' +
		'		<button id="c2dmAuthButton">' + Messages.authenticate + '</button>' +
		'		<button id="c2dmCaptchaSubmitButton">' + Messages.submit + '</button>' +
		'	{{else}}' +
		'		<p></p>' +
		'	{{/if}}' +
		'	</div>' +
		'	<div class="pushServiceFooter">' +
		'		<a class="enableDisable" style="display:none">' + Messages.disable + '</a>' +
		'		<a class="getErrorReport" style="display:none">Get error report</a>' +
		'	</div>' +
		'</div>' +
		'{{/each}}';

	$.template('serviceTemplate', serviceTemplate);
	$.tmpl('serviceTemplate', data).appendTo('#pushServices');
	updateColumnHeight();
}

function getPushServices() {
	if (PUSHNOTIFICATIONS.C2DMAUTHSTARTED) {
		return;
	}
	$.ajax({
		url: 'api/push/mediators/all',
		type: 'GET',
		success: function (data) {
			data = {mediators : data};
			populatePushServicesList(data);
		}
	});
}

// ---------------------- C2DM captcha management ------------------------------
function processC2dmAuthStep1(data) {
	PUSHNOTIFICATIONS.C2DMTOKEN = data.CaptchaToken;
	PUSHNOTIFICATIONS.C2DMAUTHSTARTED = true;
	var url = 'https://www.google.com/accounts/' + data.CaptchaUrl;
	$('#c2dmCaptchaSubmitButton').show();
	$('#c2dmCaptcha').show();
	$('#c2dmCaptchaImage').attr('src', url);
	$('#c2dmAuthButton').text(Messages.refreshC2dmCaptcha);
	$('#c2dmCaptchaText').val('');
}

function c2dmAuthButtonClicked() {
	$('#c2dmCaptchaImage').attr('src', 'images/captcha-placeholder.png');
	$.ajax({
		url : 'api/push/mediators/get/c2dm/clientLogin	',
		type : 'POST',
		success : function (data) {
			processC2dmAuthStep1(data);
		}
	});
}

function c2dmCaptchaSubmitButtonClicked() {
	var userInput = $('#c2dmCaptchaText').val();
	$.ajax({
		url : 'api/push/mediators/get/c2dm/captchaClientLogin',
		type : 'POST',
		data : {
			'token' : PUSHNOTIFICATIONS.C2DMTOKEN,
			'captcha' : userInput
		},
		success : function (data) {
			if (data.Error === 'CaptchaRequired') {
				processC2dmAuthStep1(data);
			} else {
				getPushServices();
			}
		}
	});
}

// -------------------------- unsubscribe devices management
function unsubscribeDevicesClicked(){
    $("#unsubscribeModal").show();
    $("#unsubscribeScreen1").show();
}

function doUnsubscribeClicked(){
    if ( $("#doUnsubscribeButton").hasClass("disabled"))
        return false;

    var numbers = $("#numbersToUnsubscribe").val();
    $.ajax({
		url : 'api/push/unsubscribeSMS',
		type : 'POST',
		data : {
			'numbers' : numbers
		},
		success : doUnsubscribeAjaxCallback,
		error : cancelUnsubscribeClicked
	});
}

function doUnsubscribeAjaxCallback(data){
    $("#unsubscribeScreen1").hide();
    $("#unsubscribeScreen2").show();
    var text = "";

    if (data && data.success && data.success.length > 0 ){
    	text += Messages.smsNumbersSuccesfullyUnsubscribed;
    	$.each(data.success, function (index, value){
    		text += $.trim(value) + "\n";
    	});
    	text += "\n";
    }
    
    if (data && data.failure && data.failure.length> 0 ){
    	text += Messages.smsNumbersFailedToUnsubscribe;
    	$.each(data.failure, function (index, value){
    		text += $.trim(value) + "\n";
    	});
    }
    $("#unsubscriptionResult").val(text);
}

function cancelUnsubscribeClicked(){
    $("#unsubscribeScreen1").hide();
    $("#unsubscribeScreen2").hide();
    $("#unsubscribeModal").hide();
    $("#numbersToUnsubscribe").val("");
    $("#unsubscriptionResult").val("");
    $("#invalidCharacterInPhoneNumbers").html("");
    $("#doUnsubscribeButton").addClass("disabled");
}

function numbersToUnsubscribeUpdated(){
    var numbersToUnsubscribe = validateNumbersToUnsubscribe();

    if (numbersToUnsubscribe){
        $("#doUnsubscribeButton").removeClass("disabled");
        $("#invalidCharacterInPhoneNumbers").html("");
    } else {
        $("#doUnsubscribeButton").addClass("disabled");

        if (numbersToUnsubscribe == null)
            $("#invalidCharacterInPhoneNumbers").html(Messages.invalidCharacterInPhoneNumbers);
        else
            $("#invalidCharacterInPhoneNumbers").html("");
    }



}

 function validateNumbersToUnsubscribe(){
    var numbers = $("#numbersToUnsubscribe").val();
    var isOK = true;
    for (var i=0; i<numbers.length; i++){
        var c = numbers[i];
        if (c === " " || c === "," || c === "+" || c === '\n' || !isNaN(parseInt(c)))
            continue;
        else {
            isOK = false;
            break;
        }
    }

     return (isOK) ? numbers : null;
}