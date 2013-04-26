/*
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

var catalogApplications,
	catalogAdapters,
	envParent,
	mobileAppURL,
	bitlyUsername,
	bitlyApiKey,
	busyElm,
	applicationsCount,
	adaptersCount,
	envMap = {
		blackberry : 'blackberry',
		blackberry10 : 'blackberry10',
		android : 'android',
		ipad : 'ios.ipad',
		iphone : 'ios.iphone',
		windowsphone : 'windowsphone',
		windowsphone8 : 'windowsphone8',
		mobilewebapp : 'mobilewebapp'
	},
	currentUploadMessagesForMultipleLanguagesAppID = 0,
	currentUploadMessagesForMultipleLanguagesData = [];

function jsonToString(obj) {
	var t = typeof (obj);
	if (t != "object" || obj === null) {
        if (t == "string") obj = '"' + obj + '"';
		return String(obj);
	} else {
		var n,
		v,
		json = [],
		arr = (obj && obj.constructor == Array);
        for (n in obj) {
			v = obj[n];
			t = typeof(v);
			if (t == "string") {
				v = '"' + v + '"';
			} else if (t == "object" && v !== null) {
				v = JSON.stringify(v);
			}
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
	};

function fixLength(d) {
	d = d.length < 2 ? '0' + d : d;
	return d;
}

function getLastUpdateTime(lastUpdateTime) {
	var d, year, month, day, hour, minutes, formatedDate;
	d = new Date(lastUpdateTime);
	year = d.getFullYear();
	month = String(d.getMonth() + 1);
	month = fixLength(month);
	day = String(d.getDate());
	day = fixLength(day);
	hour = String(d.getHours());
	hour = fixLength(hour);
	minutes = String(d.getMinutes());
	minutes = fixLength(minutes);
	formatedDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes;
	return formatedDate;
}

function getThumbnailUrl(applicationName) {
	$('#' + applicationName + 'Icon').attr('src', 'api/applications/thumbnail/' + applicationName);
}

function deleteAppOrAdapter(type, id) {
	//busyElm = jQuery('#confirmationDialogYesButton').busy({img : 'images/busy.gif'});
	busyElm = jQuery('#confirmationDialogYesButton').busy({img : 'data:image/gif;base64,R0lGODlhEAALAPQAAP///wAAANra2tDQ0Orq6gYGBgAAAC4uLoKCgmBgYLq6uiIiIkpKSoqKimRkZL6+viYmJgQEBE5OTubm5tjY2PT09Dg4ONzc3PLy8ra2tqCgoMrKyu7u7gAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7AAAAAAAAAAAA'});

	$.ajax({
		url: 'api/' + type + '/delete/' + id,
		type: 'POST',
		success: function () {
			busyElm.busy('hide');
			$('#confirmationContainer').hide();
			$('#confirmationDialogYesButton').unbind('click');
			if (type === 'applications') {
				services.showFeedbackInfo(Messages.deleteApplicationSuccessful, {appName: id});
				getApplications();
			} else if (type === 'adapters') {
				services.showFeedbackInfo(Messages.deleteAdapterSuccessful, {adapterName: id});
				getAdapters();
			}
		},
		error: function () {
			busyElm.busy('hide');
			$('#confirmationContainer').hide();
			if (type === 'applications') {
				services.showFeedbackError(Messages.deleteApplicationFail, {appName: id});
			} else if (type === 'adapters') {
				services.showFeedbackError(Messages.deleteAdapterFail, {adapterName: id});
			}
		}
	});
}

function showAppOrAdapterDeleteConfirmation(name, type, id) {
	$('#confirmationDialogTitle').text(Messages.deletee + ' ' + name + Messages.question);
	if (type === 'applications') {
		$('#confirmationDialogP1').text(Messages.areYouSureDeleteApplication);
	} else if (type === 'adapters') {
		$('#confirmationDialogP1').text(Messages.areYouSureDeleteAdapter);
	}
	$('#confirmationDialogYesButton').bind('click', function () {
		deleteAppOrAdapter(type, id);
	});
	$('#confirmationContainer').show();
}

function showEnvDeleteConfirmation(id, name, version, env) {
	$('#confirmationDialogTitle').html($.tmpl(Messages.areYouSureDeleteEnvTitle, {appName: name, version: version, env: env}));
	$('#confirmationDialogP1').text(Messages.areYouSureDeleteEnvMessage);
	$('#confirmationDialogYesButton').unbind('click');
	$('#confirmationDialogYesButton').bind('click', function () {
		deleteEnv(id, name, version, env);
	});
	$('#confirmationContainer').show();
}

function deleteEnv(id, name, version, env) {
	env = formatEnvName(env);
	$.post('api/applications/deleteGadgetApplication/' + id).success(function (data) {
		services.showFeedbackInfo(Messages.deleteEnvSuccesful, {appName: name, version: version, env: env});
	}).error(function (data) {
		services.showFeedbackError(Messages.deleteEnvFailed, {appName: name, version: version, env: env});
	}).complete(function () {
		getApplications();
		$('#confirmationContainer').hide();
		$('#confirmationDialogYesButton').unbind('click');
	});
}

function showGetUrlDialog(id) {
	$.get('api/applications/getPublishUrl/' + id).success(function (url) {
		var title, message, canvas, context, src;
		// hide shortUrlContainer since it needs to be visible only in mobile web URL dialog
		$('#shortUrlContainer').hide();
		// clean the short URL values since they might be old
		$('#shortUrl').attr('href', '#').html('');
		// remove wide class, will be added in mobile web
		$('#getURLdialog').removeClass('wide');
		// clean the QR since it might already contain an old canvas
		$('#qrcode').html('');
		$('#fullURL').hide();
		// hide qr container, will be shown in mobile web
		$('#qrContainer').hide();
		if (catalogApplications[id].environment === 'facebook') {
			title = Messages.getURLforFacebookTitle;
			message = Messages.getURLforFacebookMessage;
		} else if (catalogApplications[id].environment === 'mobilewebapp') {
			title = Messages.getURLofMobileWebAppTitle;
			message = Messages.getURLofMobileWebAppMessage;
			mobileAppURL = url;
			$('#getURLdialog').addClass('wide');
			$('#fullURL').show();
			$('#qrContainer').show();
			getShortUrl('getShortenedURL', url);
			$('#getShortenedURL').click(function () {
				this.focus();
				this.select();
			});
			$('#shortUrlContainer').show();
			// if browser support canvas
			if (document.createElement('canvas').getContext) {
				// create a QR in canvas
				$('#qrcode').qrcode({
					text : url,
					width : 128,
					height : 128,
					typeNumber : 10
				});
				// take the context of the cansvas and create from it a base64 image source
				canvas = jQuery('#qrcode canvas')[0];
				context = canvas.getContext("2d");
				src = canvas.toDataURL("image/png");
				// take the base64 image srouce and insert it into an image
				$('#qrImg').attr({'src' : src, 'alt' : Messages.qrAlt + url, 'title' : Messages.qrAlt + url});
			// if browser does not support canvas
			} else {
				$('#qrInstructions1').hide();
				$('#qrInstructions2').hide();
				$('#qrImg').hide();
			}
		} else if (catalogApplications[id].environment === 'desktopbrowser') {
			title = Messages.getURLofEmbedTitle;
			message = Messages.getURLofEmbedMessage;
		}
		$('#getURLdialogTitle').text(title);
		$('#getURLdialogP1').text(message);
		$('#getURLdialogP2').val(url);
		$('#getURLdialogP2').click(function () {
			this.focus();
			this.select();
		});
		$('#getURLcontainer').show();
	}).error(function () {
		services.showFeedbackError(Messages.errorConnectingToServer);
	});
}

function getBitlyCredentials() {
	$.ajax({
		url: 'api/ui/bitly',
		type: 'GET',
		success: function (data) {
			bitlyUsername = data.username;
			bitlyApiKey = data.apikey;
		}
	});
}

// use Bit.ly
function getShortUrl(elm, longUrl) {
	// TODO : the variables should be outside application, maybe saved in the
	// database and editable by the user in a setting somewhere.
	var login = bitlyUsername, apikey = bitlyApiKey, shortenURLprefix = "http://api.bit.ly/shorten?version=3.0.1";
	if (!login || !apikey) {
		$('#' + elm).val(Messages.bitlyIsNotConfigured).addClass('warning');
		return;
	}
	$('#' + elm).removeClass('warning');
	$.getJSON(shortenURLprefix + "&login=" + login + "&apiKey=" + apikey + "&longUrl=" + longUrl + "&callback=?", function (data) {
		if (data.results) {
			$.each(data.results, function (i, item) {
				$('#' + elm).val(item.shortUrl);
			});
		} else {
			$('#' + elm).addClass('warning');
			$('#' + elm).val(data.errorMessage);
		}
	}).error(function () {
		$('#' + elm).val(Messages.errorConnectingToBitly);
	});
}

/*
 * function getShortUrl(elm, longUrl) { // use goo.gl // TODO : the variables
 * should be outside application, maybe saved in the database and editable by
 * the user in a setting somewhere. var apikey =
 * 'AIzaSyCxAkQBlJ9hzdrAOGoUJ-Esgn311p-fOEw', shortenURLprefix =
 * "https://www.googleapis.com/urlshortener/v1/url"; $.ajax({ type : "POST",
 * contentType : "application/json", url :
 * "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyCxAkQBlJ9hzdrAOGoUJ-Esgn311p-fOEw",
 * data : {"longUrl" : "http://www.google.com"}, success : success(), dataType:
 * "jsonp" }); }
 * 
 * function success() { console.log("data"); }
 */

function getInstall(id) {
	window.location = 'api/applications/getBinaryApp/' + id;
}

function getDescriptor(id) {
	window.location = 'api/applications/getPublicResource/' + id;
}

function envListSort(a, b) {
	var positionMap = {
		iphone: 1,
		ipad: 2,
		android: 3,
		blackberry: 4,
		blackberry10: 5,
		windowsphone: 6,
		windowsphone8: 7,
		windows8: 8,
		air: 9,
		vista: 10,
		dashboard: 11,
		mobilewebapp: 12,
		desktopbrowser: 13,
		facebook: 14,
		igoogle: 15,
		preview: 16
	};

	if (positionMap[a.environment] > positionMap[b.environment]) {
		return 1;
	}

	if (positionMap[a.environment] < positionMap[b.environment]) {
		return -1;
	}

	// Sort by version number
	if (a.version > b.version) {
		return -1;
	}

	if (a.version < b.version) {
		return 1;
	}
	return 0;
}

function showMessageInput(id, isVisible, action) {
	var applicationRules = $('#' + id + '-applicationRules'),
		envControlButtons = $('#' + id + '-envControlButtons'),
		messageLabel =  $('#' + id + '-messageLabel'),
		messageInput = $('#' + id + '-message'),
		uploadMessagesForMultipleLanguagesLink = $('#' + id + '-uploadMessagesForMultipleLanguagesLink'),
		label = $('#' + id + '-label'),
		downloadLinkInput = $('#' + id + '-downloadLink');

	if (isVisible) {
		applicationRules.addClass('selected');
		envControlButtons.removeClass('inline');
		messageLabel.show();
		messageInput.show();
		uploadMessagesForMultipleLanguagesLink.show();
		if (action === 'notify') {
			label.hide();
			downloadLinkInput.hide();
		} else {
			label.show();
			downloadLinkInput.show();
		}
	} else {
		applicationRules.removeClass('selected');
		envControlButtons.addClass('inline');
		messageLabel.hide();
		messageInput.hide();
		uploadMessagesForMultipleLanguagesLink.hide();
		label.hide();
		downloadLinkInput.hide();
	}
}

function setEnvStatusTitle(id, status, cls) {
	$('#' + id).text(status);
	if (id.indexOf('authenticityStatus') > 0) {
		$('#' + id).attr('class', 'authenticity ' + cls);
	} else {
		$('#' + id).attr('class', cls);
	}
}

function showControlButtons(id, isVisible) {
	var controlButtons = $('#' + id + '-control-buttons'),
		exportDeleteButtons = $('#' + id + '-export-delete-buttons');

	if (isVisible) {
		controlButtons.show();
		exportDeleteButtons.hide();
		controlButtons.parent().addClass('env-control-buttons-large');
	} else {
		controlButtons.hide();
		exportDeleteButtons.show();
		controlButtons.parent().removeClass('env-control-buttons-large');
	}
}

function showAuthenticityControlButtons(id, isVisible) {
	var authenticityControlButtons = $('#' + id + '-authenticity-control-buttons');
	if (isVisible) {
		authenticityControlButtons.show();
	} else {
		authenticityControlButtons.hide();
	}
}

function showEnvStatus(id, action) {
	switch (action) {
	case 'delete':
		showMessageInput(id, false);
		setEnvStatusTitle(id + '-status', Messages.active, 'active');
		showControlButtons(id, true);
		break;
	case 'notify':
		showMessageInput(id, true, action);
		setEnvStatusTitle(id + '-status', Messages.notify, action);
		showControlButtons(id, true);
		break;
	case 'disabled':
		showMessageInput(id, true, action);
		setEnvStatusTitle(id + '-status', Messages.disabled, 'disabled');
		showControlButtons(id, true);
		break;
	case 'authenticityDisabled':
		setEnvStatusTitle(id + '-authenticityStatus', Messages.disabled, action);
		showAuthenticityControlButtons(id, true);
		break;
	case 'authenticityEnabledServicing':
		setEnvStatusTitle(id + '-authenticityStatus', Messages.enabledServicing, action);
		showAuthenticityControlButtons(id, true);
		break;
	case 'authenticityEnabledBlocking':
		setEnvStatusTitle(id + '-authenticityStatus', Messages.enabledBlocking, action);
		showAuthenticityControlButtons(id, true);
		break;
	default:
		services.loadTab('catalog.html', '#catalog', '#catalogLi', 'catalog()');
	}
}

function setMessageText(id, message) {
	$('#' + id + '-message').val(message);
}

function revertEnvStatus(id) {
	var accessRule = catalogApplications[id].versionAccessRule,
		isShowMessageInput,
		isShowControlButtons,
		message,
		cls,
		status,
		applicationRules = $('#' + id + '-applicationRules');

	if (accessRule) {
		if (accessRule.action === 'BLOCK') {
			isShowMessageInput = true;
			isShowControlButtons = false;
			cls = 'disabled';
			status = Messages.disabled;
		} else if (accessRule.action === 'NOTIFY') {
			isShowMessageInput = true;
			isShowControlButtons = false;
			cls = 'notify';
			status = Messages.notify;
		}
		message = accessRule.message;
	} else {
		// Active
		isShowMessageInput = false;
		isShowControlButtons = false;
		message = '';
		cls = 'active';
		status = Messages.active;
	}

	showMessageInput(id, isShowMessageInput, cls);
	showControlButtons(id, isShowControlButtons);
	setMessageText(id, message);
	setEnvStatusTitle(id, status, cls);
	applicationRules.removeClass('selected');
}

function changeEnvStatus(id, action, message, downloadLink, multiLanguageMessagesJSON) {
	$.post('api/applications/setAccessRule/' + id, {action: action, message: message, downloadLink: downloadLink, multiLanguageMessagesJSON: multiLanguageMessagesJSON})
		.success(function (data) {
			var msg;
			action = action.toUpperCase();
			if (action === 'BLOCK' || action === 'NOTIFY') {
				catalogApplications[id].versionAccessRule = catalogApplications[id].versionAccessRule || {};
				catalogApplications[id].versionAccessRule.message = message;
				catalogApplications[id].versionAccessRule.action = action;
				catalogApplications[id].versionAccessRule.downloadLink = downloadLink;
				if (action === 'BLOCK') {
					msg = Messages.notificationRuleBlock;
				} else { // action === 'NOTIFY'
					msg = Messages.notificationRuleNotify;
				}
			} else if (action === 'DELETE') {
				catalogApplications[id].versionAccessRule = null;
				msg = Messages.notificationRuleDeleted;
			}
			revertEnvStatus(id);
			services.showFeedbackInfo(msg, {
				appName : envParent[id].name,
				version : catalogApplications[id].version,
				env : formatEnvName(catalogApplications[id].environment)
			});
		})
		.error(function (data) {
			revertEnvStatus(id);
			errorConnectingToServer();
		});
}

function displayTranslate(msg) {
	$('#translationText').html(msg);
}

function displayUploadMessagesForMultipleLanguagesLink(id) {
	currentUploadMessagesForMultipleLanguagesAppID = id;
	$.get('templates.html', function(templates) { 
		// Fetch the <script /> block from the loaded external template file which contains our greetings template.
		var template = $(templates).filter('#uploadMessagesForMultipleLanguagesTemplate').html();
		$('#uploadMessagesForMultipleLanguagesContainer').remove();
		var templateData = catalogApplications[id].versionAccessRule || {};
		
		if (catalogApplications[currentUploadMessagesForMultipleLanguagesAppID].versionAccessRule)
			currentUploadMessagesForMultipleLanguagesData = catalogApplications[currentUploadMessagesForMultipleLanguagesAppID].versionAccessRule.multiLanguageMessages;
		else
			currentUploadMessagesForMultipleLanguagesData = [];
		
		$('body').append(Mustache.render(template, templateData));
		services.translate();
		
		var defaultMessage = $("#" + id + "-message").val();
		$("#defaultMessageText").text(defaultMessage);
		
		$('#uploadMessagesForMultipleLanguagesContainer').show();

		$('#clearMessagesForMultipleLanguages').unbind('click');
		$('#clearMessagesForMultipleLanguages').bind('click', function () {
			var html;
			currentUploadMessagesForMultipleLanguagesData = [];
			// clear the  definition list
			html = '<dt id="defaultMessageTextTitle">' + Messages.supportedLanguagesTitle + '</dt>';
			$('#supportedLanguagesList').html(html);
			$('#translationText').html('&nbsp;');
			return false;
		});

		$('#saveUploadMessagesForMultipleLanguages').unbind('click');
		$('#saveUploadMessagesForMultipleLanguages').bind('click', function () {
			if (!catalogApplications[currentUploadMessagesForMultipleLanguagesAppID].versionAccessRule) {
				catalogApplications[currentUploadMessagesForMultipleLanguagesAppID].versionAccessRule = {};
				//alert(Messages.pleaseCreateDefaultMessage);
			}
			catalogApplications[currentUploadMessagesForMultipleLanguagesAppID].versionAccessRule.multiLanguageMessages = currentUploadMessagesForMultipleLanguagesData;
			var currentDefaultMessage = $("#defaultMessageText").text();
			$('#' + currentUploadMessagesForMultipleLanguagesAppID + '-message').val(currentDefaultMessage)
			saveEnv(currentUploadMessagesForMultipleLanguagesAppID);
			currentUploadMessagesForMultipleLanguagesData = [];
			currentUploadMessagesForMultipleLanguagesAppID = -1;
			$('#uploadMessagesForMultipleLanguagesContainer').hide();
			
			return false;
		});

		$('#cancelUploadMessagesForMultipleLanguages').unbind('click');
		$('#cancelUploadMessagesForMultipleLanguages').bind('click', function () {
			currentUploadMessagesForMultipleLanguagesData = [];
			currentUploadMessagesForMultipleLanguagesAppID = -1;
			$('#uploadMessagesForMultipleLanguagesContainer').hide();
		});
		
		$('#uploadMessagesForMultipleLanguagesButton').unbind('submit');
		$('#uploadMessagesForMultipleLanguagesButton').bind('click', function () {
			$("#multiLanguageMessagesFile").val("");
			$("#multiLanguageMessagesFile").click();
			return false;
		});
		
		$("#multiLanguageMessagesFile").unbind("change");
		$("#multiLanguageMessagesFile").bind("change", uploadCSVFileForParsing);
	});
	
}

function uploadCSVFileForParsing(){
	var filename = $(this).val();
	//console.log("Uploading :: " + filename)
    if (filename == "") 
    	return;

	var filename = formatFilename($('#multiLanguageMessagesFile').val()),
		arr = filename.split('.'),
		sufix = arr[arr.length - 1];
		
	if (sufix !== 'csv') {
		alert(Messages.pleaseSelectACSVFile);
		return;
	}

	$.ajaxFileUpload({
		url : 'api/applications/parseCSV',
		secureuri : false,
		fileElementId : 'multiLanguageMessagesFile',
		dataType : 'json',
		success : function (data, status) {
			$("#multiLanguageMessagesFile").unbind("change");
			$("#multiLanguageMessagesFile").bind("change", uploadCSVFileForParsing);

			var i, dd, html = '';
			// if error in parsing the CSV file then alert eith the error message
			if (data.severity === 'ERROR') {
				alert(data.message);
				return;
			}
			
			if (data.defaultMessage)
				$("#defaultMessageText").text(data.defaultMessage);
			
			data = data.localeMessages;
			currentUploadMessagesForMultipleLanguagesData = data;
			// create the new definition list
			html = '<dt id="defaultMessageTextTitle">' + Messages.supportedLanguagesTitle + '</dt>';
			for (var i = 0; i < data.length; i++) {
				dd = data[i];
				html += "<dd><a href=\"#\" onclick=\"displayTranslate('" + dd.message + "')\" title=\"'" + dd.message + "'\"><span class=\"locale\">" + dd.locale + "</span><span class=\"language\">" + dd.language + "</span></a></dd>";
			}
			// append the new definition list
			$('#supportedLanguagesList').html(html);
		},
		error : function (data, status, e) {
			alert(e);
		}
	});
}

function saveEnv(id) {
	var status = $.trim($('#' + id + '-status').text()),
		message = $('#' + id + '-message').val(),
		downloadLink = $('#' + id + '-downloadLink').val() || '',
		multiLanguageMessagesJSON = [];
	if (catalogApplications[id] && catalogApplications[id].versionAccessRule && catalogApplications[id].versionAccessRule.multiLanguageMessages) { 
		multiLanguageMessagesJSON = catalogApplications[id].versionAccessRule.multiLanguageMessages;
	}
	
	if (downloadLink.indexOf('://') < 0 && downloadLink.length > 0) {
		downloadLink = 'http://' + downloadLink;
	}
	$('#' + id + '-downloadLink').val(downloadLink);

	if (message.length < 1 && status !== Messages.active) {
		services.showFeedbackInfo(Messages.emptyNotification);
		return false;
	}

	if (status === Messages.active) {
		changeEnvStatus(id, 'delete', '', '', '[]');
	} else if (status === Messages.notify) {
		changeEnvStatus(id, 'notify', message, downloadLink, jsonToString(multiLanguageMessagesJSON));
	} else if (status === Messages.disabled) {
		changeEnvStatus(id, 'block', message, downloadLink, jsonToString(multiLanguageMessagesJSON));
	} else {
		$('#' + id + '-control-buttons').hide();
	}
}

function changeAuthenticity(id, action) {
	$.post('api/applications/setAuthenticityRule/' + id, {action : action})
		.success(function (data) {
			services.showFeedbackInfo(Messages.notificationAuthenticity, {
				appName : envParent[id].name,
				version : catalogApplications[id].version,
				env : formatEnvName(catalogApplications[id].environment)
			});
		})
		.error(function (data) {
			errorConnectingToServer();
		})
		.complete(function (data) {
			$('#' + id + '-authenticity-control-buttons').hide();
		});
}

function saveAuthenticity(id) {
	var elm = $('#' + id + '-authenticityStatus');
	if (elm.hasClass('authenticityDisabled')) {
		changeAuthenticity(id, 'disabled');
	} else if (elm.hasClass('authenticityEnabledServicing')) {
		changeAuthenticity(id, 'ignored');
	} else if (elm.hasClass('authenticityEnabledBlocking')) {
		changeAuthenticity(id, 'enabled');
	}
}

function changeDisableDeployCheckbox(id, action) {
	$.post('api/applications/setVersionLock/' + id, {lock : action})
		.success(function (data) {
			var msg;
			action = action.toUpperCase();
			if (action === 'TRUE') { // locking
				msg = Messages.notificationDisableDeployCheckboxLocking;
			} else { // unlocking
				msg = Messages.notificationDisableDeployCheckboxUnlocking;
			}
			services.showFeedbackInfo(msg, {
				appName: envParent[id].name,
				version: catalogApplications[id].version,
				env: formatEnvName(catalogApplications[id].environment)
			});
		})
		.error(function (data) {
			errorConnectingToServer();
		});
}

function lockThisVersion(id) {
	if ($('#' + id + '-disableDeployCheckbox:checked').length > 0) {
		changeDisableDeployCheckbox(id, 'true');
	} else {
		changeDisableDeployCheckbox(id, 'false');
	}
}

function getApplications() {
	// Application header
	var application =	'';
	application +=	'{{if name !== "reports"}}';
	application +=		'<div class="application section">';
	application +=			'<div class="nav">';
	application +=				'<h1>${displayName}</h1>';
	application +=				'<a id="${name}Delete" class="delete" title="Delete ${displayName}">' + Messages.deletee + '</a>';
	application +=			'</div>';
	application +=			'<img id="${name}Icon" src="images/widget-icon.png" class="widgetIcon" height="90" width="90" alt="${displayName}"/>${$item.getThumbnailUrl()}';
	application +=			'<div class="applicationControlCenter">';
	application +=				'<div class="applicationHeader">';
	application +=					'<div class="description">${description}</div>';
	application +=					'<span class="messageLastUpdate"> ' + Messages.lastUpdatedAt + ' ${$item.getLastUpdateTime()}</span>';
	application +=					'<br />';
	application +=				'</div>';

	// Start Environments
	application +=				'{{each applicationEnvironments}}';
	application +=					'{{if $value.environment !== "preview"}}';
	application +=						'<div class="environment';
	application +=						'{{if $value.environment === "iphone" || $value.environment === "ipad" || $value.environment === "android" || $item.isNative($value.environment)}}';
	application +=							' hasAuthenticitySection';
	application +=						'{{/if}}';
	application +=						'">';
	application +=							'{{if !$item.isNative($value.environment)}}';
	application +=							'<a id="${$value.id}-${name}-${$value.version}-${$value.environment}-delete-env" class="delete" title="Delete ${$item.formatEnvName($value.environment)} ${$value.version}">&nbsp;</a>';
	application +=							'{{/if}}';
	application +=								'{{if $item.isMobile($value.environment) || $item.isNative($value.environment)}}'; // mobile or native have version and autenticity section
	application +=									'<a href="';
	application +=									'{{if $item.isNative($value.environment)}}'; // native application and non development environment should have no link to preview
	application +=										'';
	application +=									'{{else $value.environment === "android" && isMBS}}';
	application +=										'../_MobileBrowserSimulator/index.html?webpage=';
	application +=										'../apps/services/preview/${name}/${$value.environment}/${$value.version}/';
	application +=										'&platform=' + envMap.android;
	application +=									'{{else $value.environment === "ipad" && isMBS}}';
	application +=										'../_MobileBrowserSimulator/index.html?webpage=';
	application +=										'../apps/services/preview/${name}/${$value.environment}/${$value.version}/';
	application +=										'&platform=' + envMap.ipad;
	application +=									'{{else $value.environment === "iphone" && isMBS}}';
	application +=										'../_MobileBrowserSimulator/index.html?webpage=';
	application +=										'../apps/services/preview/${name}/${$value.environment}/${$value.version}/';
	application +=										'&platform=' + envMap.iphone;
	application +=									'{{else $value.environment === "blackberry" && isMBS}}';
	application +=										'../_MobileBrowserSimulator/index.html?webpage=';
	application +=										'../apps/services/preview/${name}/${$value.environment}/${$value.version}/';
	application +=										'&platform=' + envMap.blackberry;
	application +=									'{{else $value.environment === "blackberry10" && isMBS}}';
	application +=										'../_MobileBrowserSimulator/index.html?webpage=';
	application +=										'../apps/services/preview/${name}/${$value.environment}/${$value.version}/';
	application +=										'&platform=' + envMap.blackberry10;
	application +=									'{{else $value.environment === "windowsphone" && isMBS}}';
	application +=										'../_MobileBrowserSimulator/index.html?webpage=';
	application +=										'../apps/services/preview/${name}/${$value.environment}/${$value.version}/';
	application +=										'&platform=' + envMap.windowsphone;
	application +=									'{{else $value.environment === "windowsphone8" && isMBS}}';
	application +=										'../_MobileBrowserSimulator/index.html?webpage=';
	application +=										'../apps/services/preview/${name}/${$value.environment}/${$value.version}/';
	application +=										'&platform=' + envMap.windowsphone8;
	application +=									'{{else $value.environment === "windows8"}}';
	application +=										'../_MobileBrowserSimulator/index.html?webpage=';
	application +=										'../apps/services/preview/${name}/${$value.environment}/${$value.version}/';
	application +=										'&platform=' + envMap.windows8;
	application +=									'{{else}}';
	application +=										'../apps/services/preview/${name}/${$value.environment}/${$value.version}/';
	application +=									'{{/if}}';
	application +=									'" target="_blank" class="previewAs {{if $item.isNative($value.environment)}} nativeHasNoPreview{{/if}}">';
	application +=										'<span class="env-name ${$value.environment}">${$item.formatEnvName($value.environment)} </span>';
	application +=									'</a>';
	application +=									'<div id="${$value.id}-applicationRules" class="applicationRules">';
	application +=										'<span class="version">' + Messages.version + ' ${$value.version}</span>';
	application +=										'<ul class="dropdown preview">';
	application +=											'<li>';
	application +=												'<h2 id="${$value.id}-status" class="';
	application +=													'{{if $value.versionAccessRule}}';
	application +=														'{{if $value.versionAccessRule.action === "BLOCK"}}';
	application +=															'disabled">' + Messages.disabled;
	application +=														'{{else $value.versionAccessRule.action === "NOTIFY"}}';
	application +=															'notify">' + Messages.notify;
	application +=														'{{else $value.versionAccessRule.action === "NA"}}';
	application +=															'notActive">' + Messages.active;
	application +=														'{{/if}}';
	application +=													'{{else}}';
	application +=														'active">' + Messages.active;
	application +=													'{{/if}}';
	application +=												'</h2>';
	application +=												'<ul>';
	application +=													'<li><a id="${$value.id}-delete" href="#" class="">' + Messages.active + '</a></li>';
	application +=													'{{if $value.supportsRemoteDisable}}';
	application +=														'<li><a id="${$value.id}-notify" href="#" class="notify">' + Messages.notify + '</a></li>';
	application +=														'<li><a id="${$value.id}-disabled" href="#" class="block">' + Messages.disabled + '</a></li>';
	application +=													'{{/if}}';
	application +=												'</ul>';
	application +=											'</li>';
	application +=										'</ul>';
	application +=										'<div id="${$value.id}-envControlButtons" class="env-control-buttons">';
	application +=										'{{if $value.versionAccessRule && $value.versionAccessRule.action !== "NA"}}';
	application +=											'<label id="${$value.id}-messageLabel" for="${$value.id}-message" class="message-input">' + Messages.notificationText + '</label>';
	application +=											'<textarea rows="2" cols="20" id="${$value.id}-message" wrap="hard" class="message-input">${$value.versionAccessRule.message}</textarea>';
	application +=											'<a id="${$value.id}-uploadMessagesForMultipleLanguagesLink" href="#" class="uploadMessagesForMultipleLanguagesLink">' + Messages.uploadMessagesForMultipleLanguagesLink + '</a><br />';
	application +=											'{{if $value.versionAccessRule.action === "BLOCK"}}';
	application +=												'<label id="${$value.id}-label" for="${$value.id}-downloadLink" class="message-input">'
	application +=												'{{if $value.environment === "javamenative"}}';
	application +=													Messages.URLtoAppStoreOrMarketForJavaME;
	application +=												'{{else}}';
	application +=													Messages.URLtoAppStoreOrMarket;
	application +=												'{{/if}}';
	application +=												'</label>';
	application +=												'<input type="text" id="${$value.id}-downloadLink" value="${$value.versionAccessRule.downloadLink}" class="message-input" />';
	application +=											'{{else $value.versionAccessRule.action === "NOTIFY"}}';
	application +=												'<label id="${$value.id}-label" for="${$value.id}-downloadLink" class="message-input" style="display: none;">';
	application +=												'{{if $value.environment === "javamenative"}}';
	application +=													Messages.URLtoAppStoreOrMarketForJavaME;
	application +=												'{{else}}';
	application +=													Messages.URLtoAppStoreOrMarket;
	application +=												'{{/if}}';
	application +=												'</label>';	
	application +=												'<input type="text" id="${$value.id}-downloadLink" value="${$value.versionAccessRule.downloadLink}" class="message-input" style="display: none;" />';
	application +=											'{{/if}}';
	application +=										'{{else}}';
	application +=											'<label id="${$value.id}-messageLabel" for="${$value.id}-message" class="message-input" style="display: none;">' + Messages.notificationText + '</label>';
	application +=											'<textarea rows="2" cols="20" id="${$value.id}-message" wrap="hard" class="message-input" style="display: none;"></textarea>';
	application +=											'<a id="${$value.id}-uploadMessagesForMultipleLanguagesLink" href="#" class="uploadMessagesForMultipleLanguagesLink" style="display: none;">' + Messages.uploadMessagesForMultipleLanguagesLink + '</a><br />';
	application +=											'<label id="${$value.id}-label" for="${$value.id}-downloadLink" class="message-input" style="display: none;">' ;
	application +=												'{{if $value.environment === "javamenative"}}';
	application +=													Messages.URLtoAppStoreOrMarketForJavaME;
	application +=												'{{else}}';
	application +=													Messages.URLtoAppStoreOrMarket;
	application +=												'{{/if}}';
	application +=												'</label>';	
	application +=											'<input type="text" id="${$value.id}-downloadLink" value="" class="message-input" style="display: none;" />';
	application +=										'{{/if}}';
	application +=											'<div id="${$value.id}-control-buttons" style="display: none;">';
	application +=												'<a id="${$value.id}-save" href="#" class="save">' + Messages.save + '</a>';
	application +=												'<a id="${$value.id}-cancel" href="#" class="cancel">' + Messages.cancel + '</a>';
	application +=											'</div>';
	application +=										'</div>';
	application +=									'</div>';
	// End Environments

	// Start disable deploy
	application +=									'{{if $value.environment === "iphone" || $value.environment === "ipad" || $value.environment === "android"}}';
	application +=									'<div id="${$value.id}-disableDeploy" class="disableDeploy">';
	application +=										'<input type="checkbox" id="${$value.id}-disableDeployCheckbox"';
	application +=										'{{if $value.versionLocked}}';
	application +=											' checked="checked"';
	application +=										'{{/if}}';
	application +=											' />';
	application +=										'<label for="${$value.id}-disableDeployCheckbox">' + Messages.lockThisVersion + '</label>';
	application +=										'<img src="images/help.png" alt="" title="' + Messages.disableRedeploying + '" class="help" />';
	application +=									'</div>';
	application +=									'{{/if}}';
	// End disable deploy

	// Start authenticity
	application +=									'{{if $value.environment === "iphone" || $value.environment === "ipad" || $value.environment === "android" || $item.isNative($value.environment)}}'; // mobile or native
	application +=									'<div id="${$value.id}-authenticity" class="authenticitySection">';
	application +=										'<label for="${$value.id}-authenticityUser">' + Messages.securityTest + '</label>';
	application +=										'<div id="${$value.id}-securityTest">';
	application +=											'<span class="securityTest" title="${$value.securityTest}">${$value.securityTest}</span>';
	application +=										'</div>';
	application +=										'<br />';
	// JavaME does not have App Authentication and Device Authentication so we are showing it to everyone else but JavaME
	application +=										'{{if $value.environment !== "javamenative"}}';	
	application +=										'<label for="${$value.id}-authenticitySelect">' + Messages.authenticitySelectLabel + '</label>';
	application +=										'<ul class="dropdown preview">';
	application +=											'<li>';
	application +=												'<h2 id="${$value.id}-authenticityStatus" class="authenticity ';
	application +=												'{{if $value.authenticityCheck}}';
	application +=													'{{if $value.authenticityCheck === "none"}}';
	application +=														'authenticityDisabled notActive">' + Messages.disabled;
	application +=													'{{else $value.authenticityCheck === "disabled"}}';
	application +=														'authenticityDisabled">' + Messages.disabled;
	application +=													'{{else $value.authenticityCheck === "ignored"}}';
	application +=														'authenticityEnabledServicing">' + Messages.enabledServicing;
	application +=													'{{else}}';
	application +=														'authenticityEnabledBlocking">' + Messages.enabledBlocking;
	application +=													'{{/if}}';
	application +=												'{{else}}';
	application +=													'">';
	application +=												'{{/if}}';
	application +=												'</h2>';
	application +=												'<ul>';
	application +=													'<li><a id="${$value.id}-authenticityDisabled" href="#" class="authenticity authenticityDisabled">' + Messages.disabled + '</a></li>';
	application +=													'{{if $value.supportsRemoteDisable}}';
	application +=														'<li><a id="${$value.id}-authenticityEnabledServicing" href="#" class="authenticity authenticityEnabledServicing">' + Messages.enabledServicing + '</a></li>';
	application +=														'<li><a id="${$value.id}-authenticityEnabledBlocking" href="#" class="authenticity authenticityEnabledBlocking">' + Messages.enabledBlocking + '</a></li>';
	application +=													'{{/if}}';
	application +=												'</ul>';
	application +=											'</li>';
	application +=										'</ul>';
	application +=										'<div id="${$value.id}-authenticity-control-buttons" class="authenticity-control-buttons" style="display: none;">';
	application +=											'<a id="${$value.id}-authenticitySave" href="#" class="save">' + Messages.save + '</a>';
	application +=																																																																							'<a id="${$value.id}-authenticityCancel" href="#" class="cancel">' + Messages.cancel + '</a>';
	application +=										'</div>';
	application +=										'<br />';
	application +=										'<label for="${$value.id}-authenticationDevice">' + Messages.authenticationDeviceLabel + '</label>';
	application +=										'<div id="${$value.id}-authenticationDevice">';
	application +=											'{{if $value.deviceProvisioningRealm}}';
	application +=											'<span class="realmName" title="${$value.deviceProvisioningRealm}">${$value.deviceProvisioningRealm}</span>';
	application +=											'{{/if}}';
	application +=										'</div>';
	application +=										'<br />';
	// todo: end of if JavaME does not have App Authentication and Device Authentication so we are showing it to everyone else but JavaME
	application +=										'{{/if}}';	
	application +=										'<label for="${$value.id}-authenticityUser">' + Messages.authenticityUserLabel + '</label>';
	application +=										'<div id="${$value.id}-authenticityUser">';
	application +=											'<span class="authenticationUserRealm" title="${$value.userAuthenticationRealm}">${$value.userAuthenticationRealm}</span>';
	application +=										'</div>';
	application +=									'</div>';
	application +=									'{{/if}}';
	// End authenticity

	application +=								'{{else $item.isPublish($value.environment)}}';// mobile web & desktop browser

	application +=									'{{if isMBS && $value.environment === "mobilewebapp"}}';
	application +=										'<a href="../_MobileBrowserSimulator/index.html?webpage=';
	application +=										'../apps/services/preview/${name}/${$value.environment}/${$value.version}/';
	application +=										'&platform=' + envMap.mobilewebapp + '" target="_blank" class="previewAs">';
	application +=									'{{else}}';
	application +=										'<a href="../apps/services/preview/${name}/${$value.environment}/${$value.version}/" target="_blank" class="previewAs">';
	application +=									'{{/if}}';
	
	application +=										'<span class="env-name ${$value.environment}">${$item.formatEnvName($value.environment)}</span>';
	application +=									'</a>';
	application +=									'<span class="version">' + Messages.version + ' ${$value.version}</span>';
	application +=									'<a href="#" id="${$value.id}-publish" class="publish">';
	application +=									'{{if $value.environment === "desktopbrowser"}}';
	application +=										Messages.embedInWebPage;
	application +=									'{{else}}';
	application +=										Messages.getAppURL;
	application +=									'{{/if}}';
	application +=									'</a>';
	application +=								'{{else $item.isInstall($value.environment)}}'; // install?
	application +=									'<a href="../apps/services/preview/${name}/${$value.environment}/${$value.version}/" target="_blank" class="previewAs">';
	application +=										'<span class="env-name ${$value.environment}">${$item.formatEnvName($value.environment)}</span>';
	application +=									'</a>';
	application +=									'<span class="version">' + Messages.version + ' ${$value.version}</span>';
	application +=									'<a href="#" id="${$value.id}-getInstall" class="install" target="_blank">' + Messages.install + '</a>';
	application +=								'{{else $item.isDescriptor($value.environment)}}'; //igoogle
	application +=									'<a href="../apps/services/preview/${name}/${$value.environment}/${$value.version}/" target="_blank" class="previewAs">';
	application +=										'<span class="env-name ${$value.environment}">${$item.formatEnvName($value.environment)}</span>';
	application +=									'</a>';
	application +=									'<span class="version">' + Messages.version + ' ${$value.version}</span>';
	application +=									'<a href="#" id="${$value.id}-getDescriptor" class="getDescriptor" target="_blank">' + Messages.getDescriptor + '</a>';
	application += 								'{{else $item.isWindows8($value.environment)}}'; //win8
	application +=									'<a href="../apps/services/preview/${name}/${$value.environment}/${$value.version}/" target="_blank" class="previewAs">';
	application +=										'<span class="env-name ${$value.environment}">${$item.formatEnvName($value.environment)}</span>';
	application +=									'</a>';
	application +=									'<span class="version">' + Messages.version + ' ${$value.version}</span>';
	application +=								'{{/if}}';
	application +=							'</div>';
	application +=					'{{/if}}';
	application +=				'{{/each}}';
	application +=				'{{if commonPreviewEnabled}}';
	application +=				'<div class="environment">';
	application +=					'<a class="previewAs common" target="_blank" href="../apps/services/preview/${name}/common/0/">' + Messages.previewAsCmmonResources + '</a>';
	application +=				'</div>';
	application +=				'{{/if}}';
	application +=			'</div>';
	application +=		'</div>';
	application +=	'{{/if}}';

	$.template("applicationTemplate", application);

	$.ajax({
		url: 'api/applications/all',
		success: function (data) {
			applicationsCount = data.length;
			catalogApplications = {};
			envParent = {};
			if ((data.length > 0) && !(data.length === 1 && data[0].name === 'reports')) {
				$.each(data, function (index, app) {
					app.applicationEnvironments.sort(envListSort);
					$.each(app.applicationEnvironments, function (index, env) {
						catalogApplications[env.id] = env;
						envParent[env.id] = app;
					});
				});

				$.tmpl("applicationTemplate", data, {
					getLastUpdateTime : function () {
						return getLastUpdateTime(this.data.lastUpdateTime);
					},
					getThumbnailUrl : function () {
						getThumbnailUrl(this.data.name);
						return '';
					},
					setViewDescriptorObserver : function () {
						setViewDescriptorObserver(this.data.name);
						return '';
					},
					removeDuplicates : function (data) {
						var result = [],
							isExist = {},
							index;

						for (index = 0; index < data.length; index += 1) {
							if (!isExist[data[index].environment]) {
								isExist[data[index].environment] = 1;
								result.push(data[index]);
							}
						}

						return result;
					},
					formatEnvName: function (name) {
						return formatEnvName(name);
					},
					isShowMobileEnv : function (environments) {
						var i;
						for (i = 0; i < environments.length; i += 1) {
							if (this.isMobile(environments[i].environment)) {
								return true;
							}
						}

						return false;
					},
					isShowWebEnv : function (environments) {
						var i;
						for (i = 0; i < environments.length; i += 1) {
							if (this.isPublish(environments[i].environment) || this.isDescriptor(environments[i].environment)) {
								return true;
							}
						}

						return false;
					},
					isShowDesktopEnv : function (environments) {
						var map = {air: 1, windows7: 1, vista: 1, dashboard: 1}, i;
						for (i = 0; i < environments.length; i += 1) {
							if (map[environments[i].environment.toLocaleLowerCase()] === 1) {
								return true;
							}
						}
						return false;
					},
					isMobile : function (env) {
						var map = {iphone: 1, ipad: 1, android: 1, blackberry: 1, blackberry10: 1, windowsphone: 1, windowsphone8: 1};
						return map[env.toLocaleLowerCase()] === 1;
					},
					isNative : function (env) {
						var map = {androidnative: 1, iosnative: 1, javamenative: 1};
						return map[env.toLocaleLowerCase()] === 1;
					},
					hasMBS : function (env) {
						var map = {iphone: 1, ipad: 1, android: 1, blackberry: 1, windowsphone: 1};
						return map[env.toLocaleLowerCase()] === 1;
					},					
					isPublish : function (env) {
						var map = {facebook: 1, desktopbrowser: 1, mobilewebapp: 1};
						return map[env.toLocaleLowerCase()] === 1;
					},
					isInstall : function (env) {
						var map = {air: 1, windows7: 1, vista: 1, dashboard: 1};

						return map[env.toLocaleLowerCase()] === 1;
					},
					isDescriptor : function (env) {
						var map = {igoogle: 1};
						return map[env.toLocaleLowerCase()] === 1;
					},
					isWindows8: function (env){
						return env.toLocaleLowerCase() === 'windows8';
					},
					jsonToString: function (obj){
						return jsonToString(obj);
					}
				}).appendTo($('#applications').empty());
				$('#noApplications').remove();
			} else {
				$('#applications').empty();
				if ($('#noApplications').length === 0 && adaptersCount == 0) {
					$('#catalog').append('<div id="noApplications">' + Messages.noDeployedApplicationsOrAdapters + '</div>');
				}
			}
		}
	}).error(function () {
		errorConnectingToServer();
	}).complete(function () {
		$('#catalog .section ul.dropdown a').bind('click', function () {
			$('#catalog .section ul li .hover').removeClass('hover');

			if (this.href.charAt(this.href.length - 1) === '#') {
				return false;
			}
		});
		$('#catalog .section ul.dropdown h2').bind('click', function () {
			if ($(this).hasClass('notActive')) {
				return;
			}
			var className = $(this).siblings()[0].className;
			$('.applicationHeader .preview ul').removeClass('hover');
			$('.environment .active, .environment .notify, .environment .disabled').siblings().removeClass('hover');

			if (className !== 'hover') {
				$(this).siblings().addClass('hover');
			}
			return false;
		});

		$('#catalog .section .environment').bind('mouseover', function () {
			$(this).find('a.delete').addClass('deleteHover');
		});
		$('#catalog .section .environment').bind('mouseout', function () {
			$(this).find('a.delete').removeClass('deleteHover');
		});

		$('.application .nav .delete').each(function () {
			$(this).bind('click', function () {
				showAppOrAdapterDeleteConfirmation($(this).attr('title').split('Delete ')[1], 'applications', $(this).attr('id').split('Delete')[0]);
			});
		});
		$('#catalog .section .environment a.delete').bind('click', function () {
			var arr = this.id.split('-');
			showEnvDeleteConfirmation(arr[0], arr[1], arr[2], arr[3]);
			return false;
		});
		$('#catalog .application .environment a').bind('click', function (event) {
			var env = event.target.id.split('-');
			if (env[1] === 'publish' || event.target.target === '_blank') {
				return true;
			}
			showEnvStatus(env[0], env[1]);
		});
		$('.message-input').each(function () {
			var id = this.id.split('-')[0];
			$(this).bind('keydown', {id: id}, function (event) {
				var id = event.data.id,
					controlButtons = $('#' + id + '-control-buttons'),
					exportDeleteButtons = $('#' + id + '-export-delete-buttons'),
					applicationRules =  $('#' + id + '-applicationRules');

				controlButtons.show();
				controlButtons.parent().addClass('env-control-buttons-large');
				exportDeleteButtons.hide();
				applicationRules.addClass('selected');
			});
			$('#' + id + '-uploadMessagesForMultipleLanguagesLink').unbind('click');
			$('#' + id + '-uploadMessagesForMultipleLanguagesLink').bind('click', {id: id}, function (event) {
				var id = event.data.id;
				displayUploadMessagesForMultipleLanguagesLink(id);
				return false;
			});
			$('#' + id + '-save').unbind('click');
			$('#' + id + '-save').bind('click', {id: id}, function (event) {
				var id = event.data.id;
				saveEnv(id);
				return false;
			});
			$('#' + id + '-authenticitySave').unbind('click');
			$('#' + id + '-authenticitySave').bind('click', {id: id}, function (event) {
				var id = event.data.id;
				saveAuthenticity(id);
				return false;
			});
			$('#' + id + '-cancel').bind('click', {id: id}, function (event) {
				revertEnvStatus(id);
				return false;
			});
		});
		$('.publish').bind('click', function (event) {
			var id = this.id.split('-')[0];
			showGetUrlDialog(id);
			return false;
		});

		$('.install').bind('click', function (event) {
			var id = this.id.split('-')[0];
			getInstall(id);
			return false;
		});

		$('.getDescriptor').bind('click', function (event) {
			var id = this.id.split('-')[0];
			getDescriptor(id);
			return false;
		});

		$(':checkbox').bind('click', function (event) {
			var id = this.id.split('-')[0];
			lockThisVersion(id);
		});
	});
}

function formatEnvName(name) {
	var map = {
		iphone : Messages.envNameiPhone,
		android : Messages.envNameAndroid,
		blackberry : Messages.envNameBlackBerry,
		blackberry10 : Messages.envNameBlackBerry10,
		windowsphone : Messages.envNameWindowsPhone,
		windowsphone8 : Messages.envNameWindowsPhone8,
		ipad : Messages.envNameiPad,
		mobilewebapp : Messages.envNameMobileWeb,
		vista : Messages.envNameVista,
		air : Messages.envNameAdobeAir,
		dashboard : Messages.envNameDashboard,
		preview : Messages.envNameCommonResources,
		facebook : Messages.envNameFacebook,
		igoogle : Messages.envNameiGoogle,
		desktopbrowser : Messages.envNameDesktopBrowser,
		windows8 : Messages.envNameWindows8,
		androidnative : Messages.androidnative,
		iosnative : Messages.iosnative,
		javamenative : Messages.javamenative
	};
	return map[name];
}

function showDetails(id) {
	$('#' + id + 'ShowDetails').fadeOut();
	$('#' + id + 'Details').slideDown();
	$('#' + id + 'HideDetails').fadeIn();
}

function hideDetails(id) {
	$('#' + id + 'Details').slideUp();
	$('#' + id + 'HideDetails').fadeOut();
	$('#' + id + 'ShowDetails').fadeIn();
}

function showProcedures(proceduresArray) {
	var i, procedures = '';
	proceduresArray = proceduresArray || this.data.procedures || [];
	for (i = 0; i < proceduresArray.length; i += 1) {
		procedures += proceduresArray[i] + ', ';
	}
	procedures = procedures.substring(0, procedures.length - 2); // remove
																	// the last
																	// ', '
	return procedures + '&nbsp;';
}

function getAdapters() {
	var adapter = '{{if name !== "reports"}}';
	adapter +=	'<div class="adapter section">';
	adapter +=		'<div class="nav">';
	adapter +=			'<h1>${name}</h1>';
	adapter +=			'<a id="${name}Delete" class="delete" title="Delete ${name}">' + Messages.deletee + '</a>';
	adapter +=		'</div>';
	adapter +=		'<img src="images/adapter-icon.png" class="widgetIcon" height="90" width="91" alt="${name}" />';
	adapter +=		'<dl>';
	adapter +=			'<dt>' + Messages.lastUpdatedAt + '</dt>';
	adapter +=			'<dd>${$item.getLastUpdateTime()}</dd>';
	adapter +=			'<dt class="descriptionTitle">' + Messages.description + '</dt>';
	adapter +=			'<dd class="description">${description}</dd>';
	adapter +=		'</dl>';
	adapter +=		'<div class="showDetails">';
	adapter +=			'<a id="${name}ShowDetails" class="showDetails">' + Messages.showDetails + '</a>';
	adapter +=			'<dl id="${name}Details" class="details">';
	adapter +=				'<dt class="connectivity">' + Messages.connectivity + '</dt>';
	adapter +=				'<dd class="connectivityDetails">';
	adapter +=					'<dl>';
	adapter +=						'<dt>' + Messages.type + '</dt>';
	adapter +=						'<dd>${connectivityDetails["Type:"]}</dd>';
	adapter +=						'{{if connectivityDetails["Type:"] === "HTTP"}}';
	adapter +=						'<dt>' + Messages.protocol + '</dt>';
	adapter +=						'<dd>${connectivityDetails["Protocol:"]}</dd>';
	adapter +=						'<dt>' + Messages.domain + '</dt>';
	adapter +=						'<dd>${connectivityDetails["Domain:"]}</dd>';
	adapter +=						'<dt>' + Messages.port + '</dt>';
	adapter +=						'<dd>${connectivityDetails["Port:"]}</dd>';
	adapter +=						'<dt>' + Messages.useProxy + '</dt>';
	adapter +=						'<dd>${connectivityDetails["Use Proxy:"]}</dd>';
	adapter +=						'{{/if}}';
	adapter +=						'{{if connectivityDetails["Type:"] === "SQL"}}';
	adapter +=						'<dt>' + Messages.JNDIname + '</dt>';
	adapter +=						'<dd>${connectivityDetails["JNDI name:"]}</dd>';
	adapter +=						'{{/if}}';
	adapter +=					'</dl>';
	adapter +=				'</dd>';
	adapter +=				'<dt class="procedures">' + Messages.procedures + '</dt>';
	adapter +=				'<dd class="proceduresDetails">${showProcedures()}</dd>';
	adapter +=			'</dl>';
	adapter +=			'<a id="${name}HideDetails" class="hideDetails">' + Messages.hideDetails + '</a>';
	adapter +=		'</div>';
	adapter +=	'</div>';
	adapter +=	'{{/if}}';

	$.template("adapterTemplate", adapter);

	$.ajax({
		url: 'api/adapters/all',
		success: function (data) {
			adaptersCount = data.length;
			catalogAdapters = {};
			if ((data.length > 0) && !(data.length === 1 && data[0].name === 'reports')) {
				$.each(data, function (index, adapter) {
					catalogAdapters[adapter.name] = adapter;
				});
				$.tmpl("adapterTemplate", data, {
					getLastUpdateTime : function () {
						return getLastUpdateTime(this.data.lastUpdateTime);
					},
					showProcedures : function () {
						return showProcedures(this.data.procedures);
					}
				}).appendTo($('#adapters').empty());
				$('#noApplications').remove();
			} else {
				$('#adapters').empty();
				if ($('#noApplications').length === 0 && applicationsCount == 0) {
					$('#catalog').append('<div id="noApplications">' + Messages.noDeployedApplicationsOrAdapters + '</div>');
				}
			}
		}
	})
		.error(function () {
			errorConnectingToServer();
		})
		.complete(function () {
			$('.adapter .delete').each(function () {
				$(this).bind('click', function () {
					showAppOrAdapterDeleteConfirmation($(this).attr('title').split('Delete ')[1], 'adapters', $(this).attr('id').split('Delete')[0]);
				});
			});

			$('a.showDetails').each(function () {
				$(this).bind('click', function () {
					showDetails($(this).attr('id').split('ShowDetails')[0]);
				});
			});

			$('.hideDetails').each(function () {
				$(this).bind('click', function () {
					hideDetails($(this).attr('id').split('HideDetails')[0]);
				});
			});
		});
}

function formatFilename(filename) {
	var lastChar;

	if (filename.indexOf('/') >= 0) {
		lastChar = '/';
	} else if (filename.indexOf('\\') >= 0) {
		lastChar = '\\';
	} else {
		return filename;
	}

	return filename.substr(filename.lastIndexOf(lastChar) + 1);
}

function submitFile() {
	var filename = formatFilename($('#upload').val()),
		arr = filename.split('.'),
		sufix = arr[arr.length - 1],
		url;
	if (sufix === 'adapter') {
		url = 'adapters';
	} else if (sufix === 'wlapp') {
		url = 'applications';
	} else {
		services.showFeedbackInfo(Messages.errorInvalidFileType, {filename: filename});
		return;
	}

	$.ajaxFileUpload({
		url : 'api/' + url + '/upload',
		secureuri : false,
		fileElementId : 'upload',
		dataType : 'json',
		success : function (data, status) {
			if (data.severity === 'INFO' || data.severity === 'SUCCESS') {
				if (url === 'applications') {
					var appName = '',
						displayName = $.grep(data.children, function (element) {
							return element.code === 'displayName';
						});

					if (displayName.length > 0) {
						appName = displayName[0].message;
					}
					services.showFeedbackInfo(Messages.deployAppSuccessful, {appName: appName, filename: filename});
					getApplications();
				} else if (url === 'adapters') {
					services.showFeedbackInfo(Messages.deployAdapterSuccessful, {filename: filename});
					getAdapters();
				}
			} else if (data.severity === 'ERROR') {
				if (url === 'applications') {
					services.showFeedbackError(Messages.deployAppFailed, {filename : filename, className : '', message : data.message});
				} else if (url === 'adapters') {
					services.showFeedbackError(Messages.deployAdapterFailed, {filename : filename, className : '', message : data.message});
				}
			}
		},
		error : function (data, status, e) {
			alert(e);
		}
	});
}

function setCatalogObservers() {
	$('#submitFileForm').bind('submit', function () {
		submitFile();
		return false;
	});

	$('body').bind('click', function (event) {
		if (event.target !== $('#catalog .section ul li .hover').siblings()[0]) {
			$('#catalog .section ul li .hover').removeClass('hover');
		}
	});
}

function catalog() {
	getApplications();
	getAdapters();
	getBitlyCredentials();
	setCatalogObservers();
}