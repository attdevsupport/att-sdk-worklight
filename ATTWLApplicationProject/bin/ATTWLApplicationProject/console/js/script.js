/*
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

// main JavaScript

var keepAliveInterval = 10 * 60 * 1000; // 10 minutes
var isMBS = true;

var services = function () {
	// Private
	function showFeedback(message, options, type) {
		var msg = '<ul class="feedbackPanel">';
		msg += '<li id="closeFeedback">X</li>';
		msg += '<li class="feedbackPanel' + type + '">';
		msg += '<span class="feedbackPanel' + type + '">' + message + '</span>';
		msg += '</li>';
		msg += '</ul>';
		$('ul.feedbackPanel').remove();
		$.tmpl(msg, options).appendTo('.header#statusMessage');
		$('#closeFeedback').click(function () {
			$('.header#statusMessage').hide();
		});
		$('.header#statusMessage').show();
	}

	return {
		// Public
		translate: function () {
			$('.translate').each(function () {
				try {
					$(this).html(Messages[this.id]);
				} catch (e) {}
			});
		},

		getUsername: function () {
			$.getJSON('api/users/userName', function (data) {
				$.each(data, function (key, val) {
					$('#userName').append(val);
				});
			}).error(function () {
				errorConnectingToServer();
			});
		},

		logout: function () {
			$.post("api/users/logout", function () {
				window.location.reload();
			});
		},

		getVersionToAbout : function () {
			$.getJSON('api/ui/serverVersion', function (data) {
				$.each(data, function (key, val) {
					if (key === 'serverVersion') {
						$('#serverVersion').append(val);
					} else if (key === 'MBS') {
						isMBS = val;
					}
				});
			}).error(function () {
				errorConnectingToServer();
			});
		},

		loadTab : function (url, div, li, func) {
			PUSHNOTIFICATIONS.KILLTIMER();
			PUSHNOTIFICATIONS.C2DMAUTHSTARTED = false;
			$('#tab').load(url + ' ' + div, function (response, status, xhr) {
				if (status === 'success') {
					services.translate();
					$("#tabNavigation li").removeClass('selected');
					$(li).addClass('selected');
					if (func) {
						try {
							eval(func);
						} catch (e) {
							alert(e);
						}
					}
					window.location.hash = div;
				} else {
					services.showFeedbackError(Messages.loadTabFail);
				}
			});
		},

		showFeedbackInfo: function (message, options) {
			showFeedback(message, options, 'Info');
		},

		showFeedbackError: function (message, options) {
			showFeedback(message, options, 'Error');
		},

		hideFeedback: function () {
			$('#statusMessage').hide();
		},

		setFloatingNotifications : function () {
			$(window).scroll(function () {
				var statusMessage = $('#statusMessage');
				if ($(window).scrollTop() > $('#statusMessage-container').offset().top) {
					statusMessage.addClass('floating');
				} else {
					statusMessage.removeClass('floating');
				}
			});
		}
	};
}();

function addEventListeners() {
	$('#logoutLink').bind('click', function () {
		services.logout();
	});

	$('#aboutLink').bind('click', function () {
		$('#about').show();
	});

	$('#closeAbout').bind('click', function () {
		$('#about').hide();
	});

	$('#licenseLink').bind('click', function () {
		$('#license').show();
	});

	$('#closeLicense').bind('click', function () {
		$('#license').hide();
	});

	$('#catalogLink').bind('click', function () {
		services.loadTab('catalog.html', '#catalog', '#catalogLi', 'catalog()');
	});

	$('#pushNotificationsLink').bind('click', function () {
		services.loadTab('pushNotifications.html', '#pushNotifications', '#pushNotificationsLi', 'pushNotifications()');
	});

	$('#activeUsersLink').bind('click', function () {
		services.loadTab('activeUsers.html', '#activeUsers', '#activeUsersLi', 'activeUsersTab.init()');
	});

	$('#confirmationDialogNoButton').bind('click', function () {
		if (busyElm) {
			busyElm.busy('hide');
		}
		$('#confirmationContainer').hide();
		$('#confirmationDialogYesButton').unbind('click');
	});

	$('#getURLdialogCloseButton').bind('click', function () {
		$('#getURLcontainer').hide();
	});
}

function errorConnectingToServer() {
	services.showFeedbackError(Messages.errorConnectingToServer);
}

function addKeepAlive() {
	setInterval(function () {
		$.getJSON('api/ui/serverVersion').error(function () {
			errorConnectingToServer();
		});
	}, keepAliveInterval);
}

$(document).ready(function () {
	switch (window.location.hash) {
	case '#catalog':
		services.loadTab('catalog.html', '#catalog', '#catalogLi', 'catalog()');
		break;
	case '#pushNotifications':
		services.loadTab('pushNotifications.html', '#pushNotifications', '#pushNotificationsLi', 'pushNotifications()');
		break;
	case '#activeUsers':
		services.loadTab('activeUsers.html', '#activeUsers', '#activeUsersLi', 'activeUsersTab.init()');
		break;
	default:
		services.loadTab('catalog.html', '#catalog', '#catalogLi', 'catalog()');
	}
	$.ajaxSetup({cache: false});
	addKeepAlive();
	addEventListeners();
	services.getUsername();
	services.getVersionToAbout();
	services.setFloatingNotifications();
});