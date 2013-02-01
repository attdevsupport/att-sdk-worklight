
/* JavaScript content from common/js/wlcommon.js in Common Resources */
/*
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

/* Copyright (C) Worklight Ltd. 2006-2012.  All rights reserved. */

/**
 * wlcommon contains code which is used by widgets and welcome pages.
 * 
 * @author Itai Erner
 * @requires busy.js
 * @requires window.js
 */

/*
 * Validators are responsible for validating method arguments in development mode.
 */
WL.Validators = {
    // Validation should be disabled by default - so Welcome pages do not validate in production.
    // If we want validation for the welcome page we must add a solution to turn it off in production.
    isValidationEnabled : false,
    verbose : true,

    // True when 'o' is set, the native JavaScript event is defined, and 'o' has an event phase
    isEvent : function(obj) {
	return obj && obj.type;
    },

    logAndThrow : function(msg, callerName) {
	// Logger is not be available in public resources (welcome page).
	if (WL.Logger) {
	    if (callerName) {
		msg = "Invalid invocation of method " + callerName + "; " + msg;
	    }
	    if (this.verbose) {
		WL.Logger.error(msg);
	    }
	}
	throw new Error(msg);
    },

    enableValidation : function() {
	this.isValidationEnabled = true;
    },

    disableValidation : function() {
	this.isValidationEnabled = false;
    },

    validateArguments : function(validators, args, callerName) {
	if (validators.length < args.length) {
	    // More arguments than validators ... accept only if last argument is an Event.
	    if ((validators.length !== (args.length - 1)) || !this.isEvent(args[args.length - 1])) {
		this.logAndThrow("Method was passed " + args.length + " arguments, expected only " + validators.length + " " + WLJSX.Object.toJSON(validators) + ".", callerName);
	    }
	}
	this.validateArray(validators, args, callerName);
    },

    validateMinimumArguments : function(args, mandatoryArgsLength, callerName) {
	if (args.length < mandatoryArgsLength) {
	    this.logAndThrow("Method passed: " + args.length + " arguments. Minimum arguments expected are: " + mandatoryArgsLength + " arguments.", callerName);
	}
    },

    /*
     * Validates each argument in the array with the matching validator. @Param array - a JavaScript array.
     * @Param validators - an array of validators - a validator can be a function or a simple JavaScript type
     * (string).
     */
    validateArray : function(validators, array, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	for ( var i = 0; i < validators.length; ++i) {
	    this.validateArgument(validators[i], array[i], callerName);
	}
    },

    /*
     * Validates a single argument. @Param arg - an argument of any type. @Param validator - a function or a
     * simple JavaScript type (string).
     */
    validateArgument : function(validator, arg, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	switch (typeof validator) {
	    // Case validation function.
	    case 'function':
		validator.call(this, arg);
		break;
	    // Case direct type.
	    case 'string':
		if (typeof arg !== validator) {
		    this.logAndThrow("Invalid value '" + WLJSX.Object.toJSON(arg) + "' (" + (typeof arg) + "), expected type '" + validator + "'.", callerName);
		}
		break;
	    default:
		// This error can be caused only if worklight code is bugged.
		this.logAndThrow("Invalid or undefined validator for argument '" + WLJSX.Object.toJSON(arg) + "'", callerName);
	}
    },

    /*
     * Validates that each option attribute in the given options has a valid name and type. @Param options -
     * the options to validate. @Param validOptions - the valid options hash with their validators:
     * validOptions = { onSuccess : 'function', timeout : function(value){...} }
     * 
     */
    validateOptions : function(validOptions, options, callerName) {
	this.validateObjectProperties(validOptions, options, true, callerName);

    },

    /*
     * Validates that option attribute in the given options have a valid name and type - only if they are
     * explicitly defined in validOptions. If an option attribute does not exist in validOptions, it is simply
     * ignored @Param options - the options to validate. @Param validOptions - the valid options hash with
     * their validators: validOptions = { onSuccess : 'function', timeout : function(value){...} }
     * 
     */
    validateOptionsLoose : function(validOptions, options, callerName) {
	this.validateObjectProperties(validOptions, options, false, callerName);
    },

    /*
     * Validates that each option attribute in the given options has a valid name and type. @Param options -
     * the options to validate. @Param validOptions - the valid options hash with their validators:
     * validOptions = { onSuccess : 'function', timeout : function(value){...} } @Param strict - a boolean
     * indicating whether options' properties that don't exist in validOptions are allowed
     * 
     */
    validateObjectProperties : function(validOptions, options, strict, callerName) {
	if (!this.isValidationEnabled || typeof options === 'undefined') {
	    return;
	}
	for ( var att in options) {
	    // Check that the attribute exists in the validOptions.
	    if (!validOptions[att]) {
		if (strict) {
		    this.logAndThrow("Invalid options attribute '" + att + "', valid attributes: " + WLJSX.Object.toJSON(validOptions), callerName);
		} else {
		    continue;
		}
	    }
	    try {
		// Check that the attribute type is valid.
		this.validateArgument(validOptions[att], options[att], callerName);
	    } catch (e) {
		this.logAndThrow("Invalid options attribute '" + att + "'. " + (e.message || e.description), callerName);
	    }
	}
    },

    /*
     * Validates that each option attribute in the given options is from the one of the validators type.
     * @Param options - the options to validate. @Param validatos - the valid types (in string format):
     * validators = ['string','null','undefined',someFunction,'boolean'...]
     * 
     */
    validateAllOptionTypes : function(validators, options, callerName) {
	if (!this.isValidationEnabled || typeof options === 'undefined') {
	    return;
	}
	var isValidAtt = false;
	for ( var att in options) {
	    isValidAtt = false;
	    for ( var i = 0; i < validators.length; ++i) {
		try {
		    // Check that the attribute type is valid.
		    this.verbose = false;
		    this.validateArgument(validators[i], options[att], callerName);
		    isValidAtt = true;
		    break;
		} catch (e) {
		    // do nothing
		}
	    }
	    this.verbose = true;
	    if (!isValidAtt) {
		this.logAndThrow("Invalid options attribute '" + att + "' (" + typeof (options[att]) + "). Please use just the following types: " + validators.join(","), callerName);
	    }
	}
    },

    validateStringOrNull : function(arg, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	if ((typeof arg !== 'undefined') && (arg !== null) && (typeof arg !== 'string')) {
	    this.logAndThrow("Invalid argument value '" + arg + "', expected null or 'string'.", callerName);
	}
    },
    
    validateBooleanOrNull : function(arg, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	if ((typeof arg !== 'undefined') && (arg !== null) && (typeof arg !== 'boolean')) {
	    this.logAndThrow("Invalid argument value '" + arg + "', expected null or 'boolean'.", callerName);
	}
    },
    
    validateObjectOrNull : function(arg, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	if ((typeof arg !== 'undefined') && (arg !== null) && (typeof arg !== 'object')) {
	    this.logAndThrow("Invalid argument value '" + arg + "', expected null or 'object'.", callerName);
	}
    },

    validateFunctionOrNull : function(arg, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	if ((typeof arg !== 'undefined') && (arg !== null) && (typeof arg !== 'function')) {
	    this.logAndThrow("Invalid argument value '" + arg + "', expected null or 'function'.", callerName);
	}
    },

    validateNotEmptyString : function(arg, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	if ((typeof arg !== 'string') || arg.length == 0) {
	    this.logAndThrow("Invalid argument value '" + arg + "', expected not empty string.", callerName);
	}
    }
};

WL.BusyIndicator = WLJSX.Class.create({
	// The div id under which widget content should reside.
	__DIV_ID_CONTENT : 'content',

	/**
	* @param containerId (string) - the parent element id for the loading signal. If null - the content div
	*                will be used, unless this is iPhone, in which case the viewport will be used.
	* @param options (hash) - same options that busy.js support but flatted Example: {color:'#fff',
	*                size:'16', etc...}
	* 
	* overlay properties: only for backward compatibility.
	* The only property that exists is text == STR e.g. "loading" Default: 'Loading...' taken from WL.ClientMessages.loading
	* 
	* Native iPhone busy indicator properties:
	* bounceAnimation == Boolean. Show a bounce animation when displaying the busy indicator. Default false.
	* textColor == String (Color name or Color notation, e.g. "00FF00" or "green"). Text color. Default white.
	* strokeOpacity == Float.
	* fullScreen == Boolean. Show the overlay over the entire screen. Default true.
	* boxLength == Float. Height and Width of the overlay, when fullScreen is false. 
	* duration == Integer (milliseconds). Note: if duration is given isVisible() method will become unreliable.
	* minDuration == Integer (milliseconds).
	*/

	initialize : function(containerId, options) {
		this.__busyOverlay = false;
		this.__containerElement = null;
		this.__vistaInnerElement = null;
		this.__options = {
			color : null,
			size : 48,
			weight : 4,
			iradius : 12,
			text : WL.ClientMessages.loading
		};
		
		WL.Validators.validateOptions({
			container : 'object',
			overlaycolor : 'string',
			opacity : 'number',
			text : 'string',
			textLocation : 'string',
			style : 'string',
			color : 'string',
			size : 'number',
			type : 'string',
			iradius : 'number',
			weight : 'number',
			count : 'number',
			speed : 'number',
			minopac : 'number',
			bounceAnimation : 'boolean',
			textColor : 'string',
			strokeOpacity : 'number',
			fullScreen : 'boolean',
			boxLength : 'number',
			duration : 'number',
			minDuration : 'number'
		}, options, 'new WL.BusyIndicator');

		if (!WLJSX.Object.isUndefined(options)) {
			this.__options = WLJSX.Object.extend(this.__options, options);
		}

		if (WLJSX.Object.isUndefined(containerId) || containerId === null) {
			// If containerId is null in iPhone - use the viewport as the busy indicator container
			if (WL.Client.getAppProperty(WL.AppProp.ENVIRONMENT) === WL.Env.IPHONE) {
				this.__containerElement = 'viewport';
			} else {
				// If containerId is null in all other envs - use the content div as the busy indicator container
				this.__containerElement = WLJSX.$(this.__DIV_ID_CONTENT);
			}
		} else {
			this.__containerElement = WLJSX.$(containerId);
		}
	},

	/**
	* Shows the busy indicator
	*/
	show : function() {
		if (this.isVisible()) {
			return;
		}

		if (WLJSX.Object.isUndefined(this.__busyOverlay) || this.__busyOverlay === false) {
			var overlay = {
				color : this.__options.overlaycolor,
				opacity : this.__options.opacity,
				text : this.__options.text,
				style : this.__options.style,
				textLocation : this.__options.textLocation
			};
			
			var busy = {
				color : this.__options.color,
				size : this.__options.size,
				type : this.__options.type,
				iradius : this.__options.radius,
				weight : this.__options.weight,
				count : this.__options.count,
				speed : this.__options.speed,
				minopac : this.__options.minopac
			};
			
			try {
				this.__busyOverlay = getBusyOverlay(this.__containerElement, overlay, busy);
			} catch (e) {
				WL.Logger.error("Failed to show BusyIndicator:", e);
			}
		}
	},

	/**
	 * Hides the busy indicator
	 */
	hide : function() {
		if (!WLJSX.Object.isUndefined(this.__busyOverlay) && this.__busyOverlay !== false) {
			var wlBusyContainer = WLJSX.$('WLbusyContainer');
			WLJSX.remove(wlBusyContainer);
			this.__busyOverlay = false;
		}
	},
	
	isVisible : function() {
		return (this.__busyOverlay);
	}
});

/**
 * A Wrapper for the dialog required libraries:
 * 
 * @author Benny Weingarten, Raanan Avidor
 * @require window.js
 */
WL.Dialog = WLJSX.Class.create();
WL.Dialog.prototype = {

    __dialog : null,
    __options : {
	title : "",
	text : ""
    },

    /**
     * The constructor creates the dialog but does not display it. Call the show() method to display the
     * dialog.
     * 
     * @param options Optional. An object of the following form: { title: string, text: string }
     */
    initialize : function(containerId, options) {
	WL.Validators.validateOptions({
	    title : 'string',
	    text : 'string'
	}, options, 'new WL.Dialog');

	WLJSX.Object.extend(this.__options, options || {});

	var container = WLJSX.$(containerId);

	// calculate the dialog's width, if not specified
	if (this.__options.width < 0) {
	    this.__options.width = WLJSX.width(container) - this.__SPACE_MARGIN;
	}

	__dialog = new WL.DialogWindow({
	    title : this.__options.title,
	    text : this.__options.text
	});
	this.setText(this.__options.text);
    },

    /**
     * Sets the title of the dialog.
     * @param titleText the title of the dialog.
     */
    setTitle : function(titleText) {
	__dialog.setTitle(titleText);
    },

    /**
     * Sets text within the dialog.
     * @param text text within the dialog.
     */
    setText : function(text) {
	__dialog.setHTMLContent(text);
    },

    /**
     * Shows the dialog.
     */
    show : function() {
	__dialog.showCenter();
    },

    /**
     * Hides the dialog.
     */
    hide : function() {
	__dialog.hide();
    },

    /**
     * Destroys the dialog.
     */
    destroy : function() {
	__dialog.destroy();
    }
};

/**
 * Browser Detect
 * <p>
 * 
 * you can query three properties of the BrowserDetect object:<br>
 * Browser name: BrowserDetect.browser<br>
 * Browser version: BrowserDetect.version<br>
 * OS name: BrowserDetect.OS<br>
 * <p>
 * Copied from: http://www.quirksmode.org/js/detect.html
 */
WL.BrowserDetect = {
    init : function() {
	// Browser Data
	this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
	this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";

	// OS Version
	this.OS = this.searchString(this.dataOS) || "an unknown OS";

	this.isWindows7 = this.OS === "Windows" && this.versionSearchString === "6.1";
	this.isVista = this.OS === "Windows" && this.versionSearchString === "6.0";
	this.isXP = this.OS === "Windows" && this.versionSearchString === "5.1";
	this.isExplorer = this.browser === "Explorer";
	this.isFirefox = this.browser === "Firefox";
    },
    searchString : function(data) {
	for ( var i = 0; i < data.length; i++) {
	    var dataString = data[i].string;
	    var dataProp = data[i].prop;
	    this.versionSearchString = data[i].versionSearch || data[i].identity;
	    if (dataString) {
		if (dataString.indexOf(data[i].subString) !== -1) {
		    return data[i].identity;
		}
	    } else if (dataProp) {
		return data[i].identity;
	    }
	}
    },
    searchVersion : function(dataString) {
	var index = dataString.indexOf(this.versionSearchString);
	if (index === -1) {
	    return;
	}
	return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser : [{
	string : navigator.userAgent,
	subString : "Chrome",
	identity : "Chrome"
    }, {
	string : navigator.userAgent,
	subString : "OmniWeb",
	versionSearch : "OmniWeb/",
	identity : "OmniWeb"
    }, {
	string : navigator.vendor,
	subString : "Apple",
	identity : "Safari",
	versionSearch : "Version"
    }, {
	prop : window.opera,
	identity : "Opera"
    }, {
	string : navigator.vendor,
	subString : "iCab",
	identity : "iCab"
    }, {
	string : navigator.vendor,
	subString : "KDE",
	identity : "Konqueror"
    }, {
	string : navigator.userAgent,
	subString : "Firefox",
	identity : "Firefox"
    }, {
	string : navigator.vendor,
	subString : "Camino",
	identity : "Camino"
    }, { // for newer Netscapes (6+)
	string : navigator.userAgent,
	subString : "Netscape",
	identity : "Netscape"
    }, {
	string : navigator.userAgent,
	subString : "MSIE",
	identity : "Explorer",
	versionSearch : "MSIE"
    }, {
	string : navigator.userAgent,
	subString : "Gecko",
	identity : "Mozilla",
	versionSearch : "rv"
    }, { // for older Netscapes (4-)
	string : navigator.userAgent,
	subString : "Mozilla",
	identity : "Netscape",
	versionSearch : "Mozilla"
    }],
    dataOS : [{
	string : navigator.userAgent,
	subString : "Windows NT 6.1",
	versionSearch : "6.1",
	identity : "Windows"
    }, {
	string : navigator.userAgent,
	subString : "Windows NT 6.0",
	versionSearch : "6.0",
	identity : "Windows"
    }, {
	string : navigator.userAgent,
	subString : "Windows NT 5.1",
	versionSearch : "5.1",
	identity : "Windows"
    }, {
	string : navigator.platform,
	subString : "Win",
	identity : "Windows"
    }, {
	string : navigator.platform,
	subString : "Mac",
	identity : "Mac"
    }, {
	string : navigator.userAgent,
	subString : "iPhone",
	identity : "iPhone/iPod"
    }, {
	string : navigator.platform,
	subString : "Linux",
	identity : "Linux"
    }]

};
WL.BrowserDetect.init();
/* JavaScript content from common/js/wlcommon.js in android Common Resources */
/*
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

/* Copyright (C) Worklight Ltd. 2006-2012.  All rights reserved. */

/**
 * busy.js operates a native busy indicator on Android devices.
 */
WL.BusyIndicator = WLJSX.Class.create({
    __options : {
	text : WL.ClientMessages.loading
    },

    initialize : function(containerId, options) {	
	if (containerId && typeof containerId !== 'string') {
	    WL.Logger.error("BusyIndicator constructor expects first argument to be typeof \'string\' instead of " + typeof containerId);
	}
	if (!WLJSX.Object.isUndefined(options)) {
	    this.__options = WLJSX.Object.extend(this.__options, options);
	}
    },

    show : function() {
	cordova.exec(null, null, "NativeBusyIndicator", "show", [this.__options.text]);
    },

    hide : function() {
	cordova.exec(null, null, "NativeBusyIndicator", "hide", []);
    },

    isVisible : function() {
	return cordova.exec(null, null, "NativeBusyIndicator", "isVisible", []);
    }

});