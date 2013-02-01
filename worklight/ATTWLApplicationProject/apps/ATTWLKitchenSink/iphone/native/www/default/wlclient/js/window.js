
/* JavaScript content from wlclient/js/window.js in Common Resources */
/*
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

/* JavaScript content from wlclient/js/window.js in Common Resources */
WL.DialogWindow = WLJSX.Class.create();
WL.DialogWindow.prototype = {
    initialize : function() {
	this.options = WLJSX.Object.extend({
	    className : 'modalWindow',
	    title : '&nbsp;',
	    body : '&nbsp;',
	    buttons : [{}],
	    width : 200,
	    height : 300
	}, arguments[0] || {});

	var win, overlay, dialog, content, viewportWidth, viewportHeight, dialogWidth, dialogHeight, wlDialogTitle, wlDialogBody;
	// remove old dialogs if exists
	var oldDialog = WLJSX.$('WLdialogContainer');
	if (oldDialog) {
	    WLJSX.remove(oldDialog);
	}

	// create new dialog with children elements
	win = WLJSX.newElement('<div/>', {
	    'id' : 'WLdialogContainer'
	});

	overlay = WLJSX.newElement('<div/>', {
	    'id' : 'WLdialogOverlay'
	});

	dialog = WLJSX.newElement('<div/>', {
	    'id' : 'WLdialog'
	});

	wlDialogTitle = WLJSX.newElement('<h1/>', {
	    'id' : 'WLdialogTitle'
	});

	wlDialogBody = WLJSX.newElement('<p/>', {
	    'id' : 'WLdialogBody'
	});

	WLJSX.html(wlDialogTitle, this.options.title);
	WLJSX.html(wlDialogBody, this.options.body);

	WLJSX.prepend(dialog, wlDialogTitle);
	WLJSX.append(dialog, wlDialogBody);

	WLJSX.prepend(win, overlay);
	WLJSX.append(win, dialog);

	// append dialog to content
	content = WLJSX.$('content');
	WLJSX.prepend(content, win);

	// position the dialog in the middle of the screen
	viewportWidth = WLJSX.getViewportWidth();
	viewportHeight = WLJSX.getViewportHeight();
	dialogWidth = WLJSX.width(dialog);
	dialogHeight = WLJSX.height(dialog);

	WLJSX.css(dialog, {
	    left : viewportWidth / 2 - dialogWidth / 2 + 'px',
	    top : viewportHeight / 2 - dialogHeight / 2 + 'px'
	});
    },

    setTitle : function(title) {
	if (!title || title === '') {
	    title = '&nbsp;';
	}
	var dialogTitle = WLJSX.$('WLdialogTitle');
	WLJSX.html(dialogTitle, title);
    },

    setHTMLContent : function(html) {
	var dialogBody = WLJSX.$('WLdialogBody');
	WLJSX.html(dialogBody, html);
    },

    setContent : function(html) {
	var dialogBody = WLJSX.$('WLdialogBody');
	WLJSX.html(dialogBody, html);
    },

    showCenter : function() {
	this.show();
    },

    show : function() {
	// hack for Safari
	if (typeof this.overlayOpacity === 'undefined') {
	    var that = this;
	    setTimeout(function() {
		that.show();
	    }, 10);
	    return;
	}
	var wlDialogContainer = WLJSX.$('WLdialogContainer');
	WLJSX.show(wlDialogContainer);
    },

    hide : function() {
	var wlDialogContainer = WLJSX.$('WLdialogContainer');
	WLJSX.hide(wlDialogContainer);
    },

    destroy : function() {
	var wlDialogContainer = WLJSX.$('WLdialogContainer');
	WLJSX.remove(wlDialogContainer);
    }
};