
/* JavaScript content from wlclient/js/worklight.js in Common Resources */
/*
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/* Copyright (C) Worklight Ltd. 2006-2012.  All rights reserved. */

/**
 * @requires prototype.js
 * @requires busy.js
 * @requires dialog.js
 */

WL.AppProperty = {
    AIR_ICON_16x16_PATH : "AIR_ICON_16x16_PATH",
    AIR_ICON_128x128_PATH : "AIR_ICON_128x128_PATH",
    DOWNLOAD_APP_LINK : "DOWNLOAD_APP_LINK",
    ENVIRONMENT : "ENVIRONMENT",
    APP_DISPLAY_NAME : "APP_DISPLAY_NAME",
    APP_LOGIN_TYPE : "APP_LOGIN_TYPE",
    APP_VERSION : "APP_VERSION",
    HEIGHT : "HEIGHT",
    IID : "IID",
    LATEST_VERSION : "LATEST_VERSION",
    LOGIN_DISPLAY_TYPE : "LOGIN_DISPLAY_TYPE",
    LOGIN_REALM : "LOGIN_REALM",
    MAIN_FILE_PATH : "MAIN_FILE_PATH",
    SHOW_IN_TASKBAR : "SHOW_IN_TASKBAR",
    THUMBNAIL_IMAGE_URL : "THUMBNAIL_IMAGE_URL",
    VISTA_DOCK_IMAGE_PATH : "VISTA_DOCK_IMAGE_PATH",
    VISTA_DOCK_IMAGE_HEIGHT : "VISTA_DOCK_IMAGE_HEIGHT",
    VISTA_DOCK_IMAGE_WIDTH : "VISTA_DOCK_IMAGE_WIDTH",
    WELCOME_PAGE_URL : "WELCOME_PAGE_URL",
    WIDTH : "WIDTH",
    WORKLIGHT_ROOT_URL : "WORKLIGHT_ROOT_URL",
    APP_SERVICES_URL : "APP_SERVICES_URL",
    WLCLIENT_TIMEOUT_IN_MILLIS : "WLCLIENT_TIMEOUT_IN_MILLIS"
};

// Short alias:
WL.AppProp = WL.AppProperty;

// A copy of the Java GadgetEnvironment version.
var __WLEnvironment = {
    PREVIEW : "preview",
    IGOOGLE : "igoogle",
    VISTA_SIDEBAR : "vista",
    OSX_DASHBOARD : "dashboard",
    IPHONE : "iphone",
    IPAD : "ipad",
    DESKTOPBROWSER : "desktopbrowser",
    FACEBOOK : "facebook",
    ADOBE_AIR : "air",
    ANDROID : "android",
    BLACKBERRY : "blackberry",
    BLACKBERRY10 : "blackberry10",
    WINDOWS_PHONE: "windowsphone",
    WINDOWS_PHONE_8: "windowsphone8",
    WINDOWS8: 'windows8',
    MOBILE_WEB: "mobilewebapp"
};
__WL.prototype.Environment = __WLEnvironment;
WL.Environment = __WLEnvironment;
// Short alias:
WL.Env = WL.Environment;

// Constants for language manipulations
var WL_CLASS_NAME_TRANSLATE = 'translate';
var WL_I18N_MESSAGES = null;

// A copy of the Java AppLoginType version.
WL.AppLoginType = {
    LOGIN_ON_STARTUP : "onStartup",
    LOGIN_ON_DEMAND : "onDemand",
    NO_LOGIN : "never"
};

WL.UserInfo = {
    IS_USER_AUTHENTICATED : "isUserAuthenticated",
    USER_NAME : "userName",
    LOGIN_NAME : "loginName"
};

WL.Orientation = {
    AUTO : -1,
    LANDSCAPE : 0,
    PORTRAIT : 1
};

WL.FixedViewType = {
    TOP : "top",
    BOTTOM : "bottom"
};

// In case of shell app load inner app, set it to true to prevent direct update.
WL._isInnerAppChanged = false;

/*
 * NOTICE: All server errors MUST be defined with same values in the ErrorCode
 * java enumeration.
 */
var __WLErrorCode = {
    UNEXPECTED_ERROR : "UNEXPECTED_ERROR",
    API_INVOCATION_FAILURE : "API_INVOCATION_FAILURE",
    USER_INSTANCE_ACCESS_VIOLATION : "USER_INSTANCE_ACCESS_VIOLATION",
    AUTHENTICATION_REQUIRED : "AUTHENTICATION_REQUIRED",
    DOMAIN_ACCESS_FORBIDDEN : "DOMAIN_ACCESS_FORBIDDEN",

    // Client Side Errors
    UNRESPONSIVE_HOST : "UNRESPONSIVE_HOST",
    LOGIN_FAILURE : "LOGIN_FAILURE",
    REQUEST_TIMEOUT : "REQUEST_TIMEOUT",
    PROCEDURE_ERROR : "PROCEDURE_ERROR",
    UNSUPPORTED_VERSION : "UNSUPPORTED_VERSION",
    UNSUPPORTED_BROWSER : "UNSUPPORTED_BROWSER",
    DISABLED_COOKIES : "DISABLED_COOKIES",
    CONNECTION_IN_PROGRESS : "CONNECTION_IN_PROGRESS"
};
__WL.prototype.ErrorCode = __WLErrorCode;
WL.ErrorCode = __WLErrorCode;

WL.FBRealmPopupOptions = {
    width : 1000,
    height : 600
};

// save the base url since the WL.StaticAppProps.WORKLIGHT_ROOT_URL &&
// WL.StaticAppProps.APP_SERVICES_URL
WL.StaticAppProps.POSTFIX_WORKLIGHT_ROOT_URL = WL.StaticAppProps.WORKLIGHT_ROOT_URL;
WL.StaticAppProps.POSTFIX_APP_SERVICES_URL = WL.StaticAppProps.APP_SERVICES_URL;

/*
 * Worklight Utils
 */
__WLUtils = function() {

    // ........................Private methods........................

    function getStyle(element, cssprop) {
        if (element.currentStyle) { // IE
            return element.currentStyle[cssprop];
        } else if (document.defaultView && document.defaultView.getComputedStyle) { // Firefox
            return document.defaultView.getComputedStyle(element, "")[cssprop];
        } else { // try and get inline style
            return element.style[cssprop];
        }
    }

    function getUrlParam(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results == null) {
            return "";
        } else {
            return results[1];
        }
    }

    function getWidth(element) {
        var maxWidth = getStyle(element, 'width');
        var isPercentage = (maxWidth + '').indexOf('%') > -1;
        maxWidth = parseInt(maxWidth, 10);
        if (maxWidth === null || isNaN(maxWidth) || maxWidth === 0 || isPercentage) {
            maxWidth = getStyle(element, 'maxWidth');
            isPercentage = (maxWidth + '').indexOf('%') > -1;
            maxWidth = parseInt(maxWidth, 10);
            if (maxWidth === null || isNaN(maxWidth) || maxWidth === 0 || isPercentage) {
                maxWidth = WLJSX.width(element);
                maxWidth = parseInt(maxWidth, 10);
                if (maxWidth === null || isNaN(maxWidth)) {
                    maxWidth = 0;
                }
            }
        }
        return maxWidth;
    }

    // @Deprecated
    function doEllipsis(elm, options) {
        var currentOptions = {
            maxWidth : 0,
            addTitle : false
        };

        WLJSX.Object.extend(currentOptions, options || {});
        var origText = elm.innerHTML;
        var display = elm.style.display;
        elm.style.display = 'inline';
        var whiteSpace = elm.style.whiteSpace;
        elm.style.whiteSpace = 'nowrap';
        var maxWidth = currentOptions.maxWidth > 0 ? currentOptions.maxWidth : getWidth(elm);
        var width = elm.style.width;
        elm.style.width = 'auto';
        // Can't get the width of the element, no ellipsis is performed.
        if (maxWidth === 0 || WLJSX.width(elm) <= maxWidth) {
            elm.style.display = display;
            elm.style.width = width;
            elm.style.whiteSpace = whiteSpace;
            return;
        }
        // Reset content of element
        var text = origText;

        // Start width - assume min 3px per char
        var maxNumberOfChars = Math.ceil(maxWidth / 3);
        text = text.substring(0, maxNumberOfChars);

        // First reduce text size to fit the element
        while (WLJSX.width(elm) >= maxWidth && text.length > 3) {
            text = text.substr(0, text.length - 2);
            WLJSX.html(elm, text);
        }

        do {
            text = text.substr(0, text.length - 1);
            WLJSX.html(elm, text + "...");
        } while (WLJSX.width(elm) > maxWidth && text.length > 3);

        if (text !== origText && currentOptions.addTitle) {
            elm.title = origText;
        }
        elm.style.display = display;
        elm.style.width = width;
        elm.style.whiteSpace = whiteSpace;
    }

    this.wlReachableCallback = function(connection) {
    };

    // .................... Public methods ...........................

    this.__networkCheckTimeout = function() {
        if (!window.connectivityCheckDone) {
            WL.Logger.debug("Connectivity check has timed out");
            window.connectivityCheckDone = true;
            WL.Utils.dispatchWLEvent(__WL.InternalEvents.REACHABILITY_TEST_FAILURE);
        }
    };

    // checks that the WL server is available, and fires an appropriate event.
    this.wlCheckReachability = function() {
        this.wlCheckServerReachability();
    };

    this.wlCheckServerReachability = function() {
        var isCheckDone = false;
        // iOS's isReachable does not check a server's availability. Rather, it
        // merely checks is a socket can be opened.
        if (typeof navigator.network != "undefined" && navigator.connection.type == 'NONE') {
            WL.Utils.dispatchWLEvent(__WL.InternalEvents.REACHABILITY_TEST_FAILURE);
            isCheckDone = true;
        }

        var reachabilityUrl = WL.Client.getAppProperty(WL.AppProp.APP_SERVICES_URL) + "reach";
        var xhr = new XMLHttpRequest();
        xhr.open("GET", reachabilityUrl, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                clearTimeout(xhrTimeout);
                WL.Utils.dispatchWLEvent(__WL.InternalEvents.REACHABILITY_TEST_SUCCESS);
            }
        };

        xhr.send("");
        var xhrTimeout = setTimeout(function() {
            if (!isCheckDone) {
                xhr.abort();
                WL.Utils.dispatchWLEvent(__WL.InternalEvents.REACHABILITY_TEST_FAILURE);
            }
        }, 6000);
    };

    /**
     * Retrieves from the server the suitable skinLoader.js content, based on
     * the appId and appVersion parameters, computes the skin name, and pass it
     * to the provided callback. The method works only with development server
     * (not production).
     */
    this.__getSkinFromRemoteSkinLoader = function(appId, appVersion, callback) {
        // displaying an error message if appId or appVersion are missing
        if (!appId) {
            WL.SimpleDialog.show(WL.ClientMessages.error, WL.ClientMessages.downloadAppWebResourcesPleaseSpecifyAppID,
                    [ {
                        text : WL.ClientMessages.close
                    } ]);
            return;
        } else if (!appVersion) {
            WL.SimpleDialog.show(WL.ClientMessages.error,
                    WL.ClientMessages.downloadAppWebResourcesPleaseSpecifyAppVersion, [ {
                        text : WL.ClientMessages.close
                    } ]);
            return;
        }

        // send request to the server for getting the app's skinLoader.js
        // content
        var url = WL.StaticAppProps.WORKLIGHT_BASE_URL + "/dev/appdata?appId=" + appId + "&appVer=" + appVersion
                + "&appEnv=" + WL.Client.getEnvironment();
        new WLJSX.Ajax.Request(url, {
            onSuccess : function(response) {
                // evaluating skinLoader.js content (which defines the
                // method
                // getSkinName), and then passing the callback the
                // getSkinName()
                // return value
                WL._isInnerAppChanged = true;
                eval(response.responseJSON.skinLoaderContent);
                var newSkinName = getSkinName();
                if (response.responseJSON.availableSkins.indexOf(newSkinName) != -1) {
                    callback(newSkinName);
                } else {
                    WL.SimpleDialog.show(WL.ClientMessages.error, WL.Utils.formatString(
                            WL.ClientMessages.downloadAppWebResourcesSkinIsNotValid, newSkinName), [ {
                        text : WL.ClientMessages.close
                    } ]);
                }
            },
            onFailure : function(response) {
                if (response.status == 0) {
                    WL.SimpleDialog.show(WL.ClientMessages.error,
                            WL.ClientMessages.downloadAppWebResourcesConnectionToServerUnavailable, [ {
                                text : WL.ClientMessages.close
                            } ]);
                } else {
                    switch (response.responseJSON.error) {
                    case "singleSkin":
                        WL._isInnerAppChanged = true;
                        // this is not a real failure, it happens
                        // whenever the
                        // target app has only a single skin (and
                        // therefore it
                        // has no skinLoader.js file).
                        callback("default");
                        break;
                    case "appNotExist":
                        WL.SimpleDialog.show(WL.ClientMessages.error, WL.Utils.formatString(
                                WL.ClientMessages.downloadAppWebResourcesAppIdNotExist, appId), [ {
                            text : WL.ClientMessages.close
                        } ]);
                        break;
                    case "versionNotExist":
                        WL.SimpleDialog.show(WL.ClientMessages.error, WL.Utils.formatString(
                                WL.ClientMessages.downloadAppWebResourcesAppVersionNotExist, appId, appVersion,
                                WL.Client.getEnvironment()), [ {
                            text : WL.ClientMessages.close
                        } ]);
                        break;
                    default:
                        WL.SimpleDialog.show(WL.ClientMessages.error, response.responseJSON.errorText, [ {
                            text : WL.ClientMessages.close
                        } ]);
                    }
                }
            }
        });
    };

    /**
     * @param {Object}
     *            value
     * @return value if defined or null otherwise.
     */
    this.safeGetValue = function(value) {
        if (!WLJSX.Object.isUndefined(value)) {
            return value;
        } else {
            return null;
        }
    };

    /**
     * @deprecated - use WL.App.getErrorMessage(
     */
    this.getErrorMessage = function(e) {
        if (e === null) {
            return null;
        } else if (WLJSX.Object.isString(e)) {
            return e;
        } else if (e.description) {
            return e.description;
        } else if (e.message) {
            return e.message;
        } else if (WLJSX.Object.isArray(e)) {
            return e.join(",");
        } else {
            return e.toString();
        }
    };

    /**
     * Adds a parameter to the given URL.
     * 
     * @param {string}
     *            url
     * @param {string}
     *            parameter name
     * @param {string}
     *            parameter value
     * @return the url with the added parameter.
     */
    this.addParameterToURL = function(url, name, value) {
        if (url.indexOf("?") === -1) {
            url += "?";
        } else {
            url += "&";
        }
        url += (name + '=' + encodeURIComponent(value));
        return url;
    };

    // @Deprecated
    this.ellipsisByClassName = function(className, options) {
        var elements = WLJSX.$$('.' + className);
        for ( var i = 0; i < elements.length; i++) {
            doEllipsis(elements[i], options);
        }
    };

    // @Deprecated
    this.ellipsisByElement = function(e, options) {
        doEllipsis(e, options);
    };

    this.formatString = function() {
        var resStr = arguments[0];
        for ( var i = 1; i < arguments.length; i++) {
            var re = new RegExp("\\{" + (i - 1) + "\\}", "g");
            resStr = resStr.replace(re, arguments[i]);
        }
        return resStr;
    };

    this.clearText = function(className, attribute) {
        var elementsToClear = WLJSX.$$('.' + className);
        var element;
        for ( var i = 0; i < elementsToClear.length; i++) {
            element = elementsToClear[i];
            if (!attribute || attribute === 'innerHTML') {
                if (element.tagName.toLowerCase() === 'input') {
                    element.value = '';
                } else {
                    WLJSX.empty(element);
                }
            } else if (attribute === 'title') {
                element.title = '';
            } else if (attribute === 'alt') {
                element.alt = '';
            }
        }
    };

    this.replaceElementsText = function(parentId, dictionary, attribute) {
        if (!dictionary) {
            dictionary = WL_I18N_MESSAGES;
        }

        var cssSelector;
        if (parentId) {
            cssSelector = "#" + parentId + " ." + WL_CLASS_NAME_TRANSLATE;
        } else {
            cssSelector = "." + WL_CLASS_NAME_TRANSLATE;
        }

        var elementsToFill = WLJSX.$$(cssSelector);
        var element;
        for ( var i = 0; i < elementsToFill.length; i++) {
            element = elementsToFill[i];
            if (!attribute || attribute === 'innerHTML') {
                // Use value instead of innerHTML in input elements
                if (element.tagName.toLowerCase() === 'input') {
                    element.value = dictionary[element.id];
                } else {
                    WLJSX.html(element, dictionary[element.id]);
                }
            } else if (attribute === 'title') {
                element.title = dictionary[element.id];
            } else if (attribute === 'alt') {
                element.alt = dictionary[element.id];
            }
        }
    };

    /*
     * Adds the URL prefix to the URL if not already added and
     * WL.StaticAppProps.WORKLIGHT_ROOT_URL is set This is used when working
     * with desktop gadget and we need a static URL
     */
    this.createAPIRequestURL = function(path) {
        var resultURL;

        // if "path" is an absolute URL we just use it
        if (/^[a-z]+:\/\//i.test(path)) {
            resultURL = path;
        } else if (path.indexOf("/") === 0) {
            // In case using absolute url like "/random" it must be under
            // app/services
            var appServicesUrl = WL.Client.getAppProperty(WL.AppProp.APP_SERVICES_URL);
            resultURL = appServicesUrl.substr(0, appServicesUrl.length - 1) + path;
        } else {
            // Relative URL
            // We take http://<IP>:<PORT>/<app-name>/<env-name>/" - and append
            // "path" to it
            resultURL = WL.Client.getAppProperty(WL.AppProp.WORKLIGHT_ROOT_URL) + path;
        }
        return resultURL;
    };

    /*
     * Extends the target object with the source object only with fields and
     * methods that do not already exist on the target.
     */
    this.extend = function(target, source) {
        target = WLJSX.Object.extend(WLJSX.Object.clone(source), target);
        return target;
    };

    /*
     * extracts the host part of a url. For example, for the input
     * url="https://212.10.0.15:8888/application/service/?arg=blue", the result
     * would be "212.10.0.15".
     */
    this.getHostname = function(url) {
        var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/:]+)', 'im');
        return url.match(re)[1].toString();
    };

    this.dispatchWLEvent = function(eventName) {
        // ie (WP7/VISTA) support custom event
        if (typeof document.createEvent == "undefined") {
            WLJSX.trigger(document, eventName);
        } else {
            var e = document.createEvent('Events');
            e.initEvent(eventName, false, false);
            document.dispatchEvent(e);
        }
    };

    this.getCurrentSkinName = function() {
        var skinName = null;
        // readUserPref is syncronized on Android but async on iOS, this is why
        // the implementation differ

        if (WL.Client.getEnvironment() === WL.Env.ANDROID || WL.EnvProfile.isEnabled(WL.EPField.ISIOS)) {
        	skinName = WL.StaticAppProps.SKIN_NAME;
        } else if (WL.Client.getEnvironment() === WL.Env.WINDOWS_PHONE || WL.Client.getEnvironment() === WL.Env.WINDOWS_PHONE_8) {
            skinName = getUrlParam("skinName");
            if (skinName.length == 0) {
                skinName = "default";
            }
        }
        // environements that don't support skins should return 'default'
        else {
            skinName = 'default';
        }
        return skinName;
    };

    /**
     * function: getFreeSpaceOnDevice return: free space on device in Bytes
     * Should be called only for environments that support direct update
     * (currently Android + iOS)
     */
    this.getFreeSpaceOnDevice = function() {
        var freeSpace;
        
        if (WL.EnvProfile.isEnabled(WL.EPField.ISIOS) || WL.Client.getEnvironment() === WL.Env.ANDROID) {
            freeSpace = WL.StaticAppProps.FREE_SPACE;
        }
        // environements that don't support skins should return 'default'
        else {
            var msg = "WL.Utils.getFreeSpaceOnDevice(..) should be supported only on environments that support direct update";
            var ex = new Error(msg);
            WL.Logger.error(msg, ex);
            throw ex;
        }
        return Number(freeSpace).toFixed(2);
    };

    // hide application with a black div
    this.addBlackDiv = function() {
        var blackDiv = WLJSX.newElement('<div/>', {
            'id' : 'blockingDiv',
            'style' : 'background-color:black; z-index: 9999; position: fix; top:0; left:0; right:0; bottom:0;'
        });
        document.body.appendChild(blackDiv);
    };

    this.removeBlackDiv = function() {
        while (WLJSX.$('blockingDiv')) {
            document.body.removeChild(WLJSX.$('blockingDiv'));
        }
    };

    this.getSkinLoaderChecksum = function() {
        var skinLoaderChecksum;
        if (WL.EnvProfile.isEnabled(WL.EPField.ISIOS) || WL.Client.getEnvironment() === WL.Env.ANDROID) {
            skinLoaderChecksum = WL.StaticAppProps.SKIN_LOADER_CHECKSUM;
        }
        // environments that don't support skins should return null
        else {
            var msg = "WL.Utils.getSkinLoaderChecksum(..) should be supported only on environments that support direct update";
            var ex = new Error(msg);
            WL.Logger.error(msg, ex);
            throw ex;
        }

        if ((typeof skinLoaderChecksum === 'undefined') || (skinLoaderChecksum == null)
                || (skinLoaderChecksum.length == 0)) {
            skinLoaderChecksum = WL_SKINLOADER_CHECKSUM.checksum;
            WL.Utils.setSkinLoaderChecksum(skinLoaderChecksum);
        }
        return skinLoaderChecksum;
    };

    this.setSkinLoaderChecksum = function(skinLoaderChecksum) {
        if ((WL.Client.getEnvironment() === WL.Env.ANDROID) || (WL.EnvProfile.isEnabled(WL.EPField.ISIOS))) {
            WL.App.writeUserPref('wlSkinLoaderChecksum', skinLoaderChecksum);
        }
        // environments that don't support skins should return null
        else {
            var msg = "WL.Utils.setSkinLoaderChecksum(..) should be supported only on environments that support direct update";
            var ex = new Error(msg);
            WL.Logger.error(msg, ex);
            throw ex;
        }
    };

    this.safeInnerHTML = function(target, contentToSet, options) {
        // iPhone sometimes just fails to set innerHTML - no idea why. you
        // end up with an empty div.
        // it's more reliable with a setTimeout but still not reliable enough.
        // this function sets the text and then checks it. if it's not
        // there, it tries once more. horrible, but necessary.
        // note: this really became an issue within the app and was even
        // worse in 1st gen and 3g. 3GS was mostly fixed with one timeout,
        // whereas even 3 didn't seem to always fix pre-3GS
        // some blog posts indicated that they noticed the problem only
        // when the messed with location.href
        // (http://blog.johnmckerrell.com/2007/03/07/problems-with-safari-and-innerhtml/)
        // so i've removed this stuff in the app and location.href is no
        // longer changed. seems to be worse with database than it was
        // with XHR but assume we'll leave it in place to be safe
        var _options = {
            onSuccess : function() {
            },
            onFailure : function() {
                WL.Logger.debug("safeInnerHtml error. Could not perform " + target.id + ".innerHtml = " + contentToSet)
                        .bind(this);
            },
            count : 10
        };
        if (!WLJSX.Object.isUndefined(options)) {
            _options = WLJSX.Object.extend(_options, options);
        }

        if (!WL.EnvProfile.isEnabled(WL.EPField.ISIOS)) {
            target.innerHTML = contentToSet;
            _options.onSuccess();
            return;
        }

        target.innerHTML = contentToSet;
        var timeout = 50;
        var count = _options.count;

        if ((contentToSet != '' && target.innerHTML == '') || (contentToSet == '' && target.innerHTML != '')) {
            if (_options.count <= 0) {
                _options.onFailure();
            } else {
                WL.Logger.debug(target.id + ".innerHTML failed. number of attempts remaining: " + count + " ( + "
                        + timeout + "ms timout)");
                --count;
                _options.count = count;
                setTimeout(function() {
                    safeInnerHTML(target, contentToSet, _options);
                }, timeout);
            }
        } else {
            _options.onSuccess();
        }
    };

    /**
     * Helper function, there is a difference between IOS and Android In Android
     * Cordova returns the data as is, while in IOS it envelops it in another
     * Object. Check if IOS and if so return the inner data
     * 
     * @param response -
     *            Cordova response Object
     * @param innerFieldName -
     *            the name of the inner object to retrieved in IOS
     */
    this.getCordovaPluginResponseObject = function(response, innerFieldName) {
        if (WL.EnvProfile.isEnabled(WL.EPField.ISIOS)) {
            if (response) {
                return response[innerFieldName];
            }
        }
        return response;
    };
}; // End WL.Utils

__WL.prototype.Utils = new __WLUtils;
WL.Utils = new __WLUtils;

/**
 * Opens a native dialog using phonegap notification api
 */
__WLSimpleDialog = function() {
    this.__buttons = null;
    this.__dialog = null;

    this.__callback = function(result) {

        if (WL.Client.getEnvironment() === WL.Env.WINDOWS_PHONE || WL.Client.getEnvironment() === WL.Env.WINDOWS_PHONE_8) {
            // Nothing to do on WP, since there is no bug there
        } else if (WL.EnvProfile.isEnabled(WL.EPField.USES_CORDOVA)) {
            // Phonegap bug - native code returns button number instead of
            // button index
        	if (WL.StaticAppProps.ENVIRONMENT != WL.Environment.BLACKBERRY10){
        		result--;
        	}
            
        } else if (WL.StaticAppProps.ENVIRONMENT == WL.Environment.BLACKBERRY) {
        } else {
            WL.SimpleDialog.__dialog.hide();
            WL.SimpleDialog.__dialog = null;
        }
        
        // in case of invalid result value just clean up the array of buttons (otherwise next show will fail)
        if (result < 0 || result >= WL.SimpleDialog.__buttons.length) {
        	WL.SimpleDialog.__buttons = null;
        	WL.SimpleDialog.__dialog = null;
        	return;
        }

        var handler = WL.SimpleDialog.__buttons[result].handler;

        WL.SimpleDialog.__buttons = null;

        if (handler) {
            handler();
        }
    };

    var __validateButtonsObject = function(buttons, callerName) {
        if (!WL.Validators.isValidationEnabled) {
            return;
        }
        if ((!buttons) || (buttons.constructor !== Array) || (buttons.length == 0)) {
            WL.Validators.logAndThrow("Invalid argument value '" + buttons
                    + "', expected an array with button descriptors.", callerName);
        }
        for ( var i = 0; i < buttons.length; i++) {
            if (!buttons[i].text || typeof buttons[i].text !== 'string') {
                WL.Validators.logAndThrow("Invalid argument value '" + buttons
                        + "', button descriptor must contain text as string.", callerName);
            }
            if (buttons[i].handler && typeof buttons[i].handler !== 'function') {
                WL.Validators.logAndThrow("Invalid argument value '" + buttons
                        + "', button descriptor handler must be a function.", callerName);
            }
        }
    };

    /**
     * 
     * 
     * @param title
     *            The title of the dialog window
     * @param text
     *            The text in the dialog window
     * @param buttons
     *            An array of button descriptors and event handler functions.
     *            Example: [{text: "OK", handler: function() { ... }}, {text:
     *            "Cancel", handler: function() { ... }}]
     * @param option
     *            Optional. When native dialog is not available for the current
     *            environment. An object of the following form: { title: string,
     *            text: string }
     */
    this.show = function(title, text, buttons, options) {
        var wlDialogContainer = WLJSX.$('WLdialogContainer');
        if (!title && !text && wlDialogContainer) {
            WLJSX.css(wlDialogContainer, {
                display : 'block'
            });
            return;
        }
        if (WL.SimpleDialog.__buttons != null && WL.Client.getEnvironment() !== WL.Environment.WINDOWS8) {
            WL.Logger.error("WL.SimpleDialog.show() cannot be invoked while dialog is open");
            return;
        }

        WL.Validators.validateArguments([ 'string', 'string', __validateButtonsObject,
                WL.Validators.validateObjectOrNull ], arguments, 'WL.SimpleDialog.show');

        WL.SimpleDialog.__buttons = buttons;
        if (WL.EnvProfile.isEnabled(WL.EPField.USES_CORDOVA)) {
            var buttonsArray = [];
            for ( var i = 0; i < buttons.length; i++) {
            	// Phonegap uses comma as the button seperator,
                // so we can't use that. Replace commas with a similar character
                // (ascii code 130)
            	buttonsArray[i] = buttons[i].text.replace(",", "‚");
            }
            
            //For Android there is special case were dialog must be modal (no back)
            var isAndroidDirectUpdateCase = WL.StaticAppProps.ENVIRONMENT == WL.Env.ANDROID && title == WL.ClientMessages.directUpdateNotificationTitle;
            
            if (WL.StaticAppProps.ENVIRONMENT == WL.Env.WINDOWS_PHONE || WL.StaticAppProps.ENVIRONMENT == WL.Env.WINDOWS_PHONE_8 || isAndroidDirectUpdateCase) {
            	var dialogPluginFunctionName = isAndroidDirectUpdateCase ? "confirm" : "showDialog";
            	cordova.exec(function (result) { WL.SimpleDialog.__callback(result); }, 
            			function (err) { WL.Logger.error("WL.SimpleDialog.show() error in invoking callback."); }, 
            			"WLCustomDialog", dialogPluginFunctionName, [text, title, buttonsArray.join(",")]);
            } else {
                navigator.notification.confirm(text, WL.SimpleDialog.__callback, title, buttonsArray.join(","));
            }
        } else if (WL.StaticAppProps.ENVIRONMENT == WL.Environment.BLACKBERRY) {
            var buttonTitlesArray = new Array();
            for ( var i = 0; i < buttons.length; i++) {
                buttonTitlesArray.push(buttons[i].text);
            }
            var result = blackberry.ui.dialog.customAsk(title + "\n\n" + text, buttonTitlesArray, 0, true);
            this.__callback(result);
        } else if (WL.StaticAppProps.ENVIRONMENT == WL.Environment.WINDOWS8) {
            var messageDialog = new Windows.UI.Popups.MessageDialog(text, title);
            for (var i = 0; i< buttons.length; i += 1) {
                messageDialog.commands.append(new Windows.UI.Popups.UICommand(buttons[i].text, buttons[i].handler));
            }
            messageDialog.showAsync();
        } else {
            var dialogOptions = options || {};

            this.__dialog = new WL.Dialog("content", dialogOptions);

            var message = '<p>' + text + '</p>';
            for ( var i = 0; i < buttons.length; i++) {
                message += '<button type="button" class="dialogButton" tabIndex="' + i + '">' + buttons[i].text
                        + '</button>';
            }

            this.__dialog.setTitle(title);
            this.__dialog.setText(message);
            this.__dialog.show();
            var dialogButtons = WLJSX.$$('.dialogButton');
            for ( var i = 0; i < dialogButtons.length; i++) {
                WLJSX.bind(dialogButtons[i], 'click', function(event) {
                    WL.SimpleDialog.__callback(WLJSX.eventTarget(event).tabIndex);
                    return false;
                });
            }
        }
    };
};
__WL.prototype.SimpleDialog = new __WLSimpleDialog;
WL.SimpleDialog = new __WLSimpleDialog;

__WLApp = function() {

    /**
     * Opens the specified URL according to the specified target and options
     * (specs). The behavior of this method depends on the app environment, as
     * follows:
     * 
     * @param url
     *            Mandatory. The URL of the web page to be opened.
     * @param target
     *            Optional. The value to be used as the target (or name)
     *            parameter of JavaScript <code>window.open</code> method. If
     *            no value is specified, <code>_self</code> will be used.
     * 
     * @param options
     *            Optional. Parameters hash
     * @return the opened URL
     */
    this.openURL = function(url, target, options) {
        WL.Validators.validateArguments([ 'string', WL.Validators.validateStringOrNull,
                WL.Validators.validateStringOrNull ], arguments, 'WL.App.openURL');

        var wnd = null;
        if (WLJSX.Object.isUndefined(options) || options === null) {
            options = "status=1,toolbar=1,location=1,menubar=1,directories=1,resizable=1,scrollbars=1";
        }
        if (WLJSX.Object.isUndefined(target) || target === null) {
            target = '_self';
        }
        var absoluteURL = WL.Utils.createAPIRequestURL(url);
        switch (WL.StaticAppProps.ENVIRONMENT) {
        case WL.Env.OSX_DASHBOARD:
            wnd = widget.openURL(absoluteURL);
            break;
        case WL.Env.VISTA_SIDEBAR:
            wnd = window.open(absoluteURL, target, options);
            break;
        case WL.Env.IPAD:
        case WL.Env.IPHONE:
        	window.open(absoluteURL, '_system'); 
            break;
        case WL.Env.ADOBE_AIR:
            var urlReq = new window.runtime.flash.net.URLRequest(absoluteURL);
            wnd = window.runtime.flash.net.navigateToURL(urlReq);
            break; 
        case WL.Env.BLACKBERRY:
            var args = new blackberry.invoke.BrowserArguments(absoluteURL);
            blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, args);
            break;
        case WL.Env.BLACKBERRY10:
            blackberry.invoke.invoke({
                target: "sys.browser",
                uri: absoluteURL
            }, function(){}, function(){
            	WL.Logger.error("Failed to open URL " + absoluteURL);
            });
            break;
        default:
            if (target === "_self") {
                document.location.href = absoluteURL;
            } else {
                wnd = window.open(absoluteURL, target, options);
            }
            break;
        }
        WL.Logger.debug("openURL url: " + absoluteURL);

        return wnd;
    };

    /**
     * Returns the locale code according to user's device settings.
     * 
     * @return the user device locale code.
     */
	this.getDeviceLocale = function(callback) {
		locale = WL.Client.getDeviceLocale();
		//if locale is not confiured, take it regulary from navigator, if there is Cordova it would already be set using cordova
		if (typeof locale === 'undefined' || locale == null) {
			return (navigator.language) ? navigator.language : navigator.userLanguage;
		}
		return locale;
    };

    /**
     * Returns the language code according to user's device settings.
     * 
     * @return the user device lanuage code.
     */
    this.getDeviceLanguage = function() {
        return this.getDeviceLocale().substring(0, 2);
    };

    /**
     * Upgrade the inner application. This feature is currently applicable only
     * for Android and iOS platforms
     */
    this.__update = function() {
        return;
    };

    this.getErrorMessage = function(e) {
        var message;
        if (e === null) {
            message = null;
        } else if (WLJSX.Object.isString(e)) {
            message = e;
        } else if (WLJSX.Object.isArray(e)) {
            message = e.join(",");
        } else if (e.description || e.message) {
            // the exception message
            message = e.description ? e.description : e.message;

            // add file name and line number
            if (e.fileName) {
                message += " [" + e.fileName + ": line " + e.lineNumber + "]";
            } else if (e.sourceURL) {
                message += " [" + e.sourceURL + ": line " + e.line + "]";
            }
        } else {
            message = e.toString();
        }
        return message;
    };

    // Back Button support (Work on Android && Windows Phone)
    this.overrideBackButton = function(callback) {
    };

    this.resetBackButton = function() {
    };

    this.copyToClipboard = function(text) {
    };

    // ////////////////////////////////////////
    // Read/Write User Pref on Local Storage
    // ////////////////////////////////////////

    this.readUserPref = function(key, successCallback, failCallback) {
        var msg = "WL.App.readUserPref(..) is supported only on Android and iOS environments";
        var ex = new Error(msg);
        WL.Logger.error(msg, ex);
        throw ex;
    };

    this.writeUserPref = function(key, value) {
        var msg = "WL.App.writeUserPref(..) is supported only on Android and iOS environments";
        var ex = new Error(msg);
        WL.Logger.error(msg, ex);
        throw ex;
    };
};

__WL.prototype.App = new __WLApp;
WL.App = new __WLApp;

__WLLogger = function() {
    var priority = {
        DEBUG : 'DEBUG',
        ERROR : 'ERROR',
        WARN  : 'WARN',
        INFO  : 'INFO'
    };

	var enableLogger = true;
	
    this.__init = function(enabled) {
		if (typeof(enabled) !== 'undefined'){
			enableLogger = enabled;
		}
    };

    this.debug = function(msg, ex) {
        log(msg, priority.DEBUG, ex);
    };

    this.error = function(msg, ex) {
        log(msg, priority.ERROR, ex);
    };

    function log(msg, priority, ex) {
        if (!enableLogger || typeof msg === 'undefined' || msg === null) {
            return;
        }

        try {
            // Translating objects to strings
            if (typeof msg != 'string') {
                msg = WLJSX.Object.toJSON(msg);
            }
        } catch (e) {
            // there was an exception, cannot log, returning
            return;
        }

        msg = WLJSX.String.stripScripts(msg);
        msg = WLJSX.String.escapeHTML(msg);

        if (typeof ex !== "undefined") {
            msg += " " + WL.App.getErrorMessage(ex);
        }

        switch (WL.Client.getEnvironment()) {
        case WL.Env.ADOBE_AIR:
            // Output to Introspector should only be available in debug mode.
            if (air.Introspector) {
                air.Introspector.Console.log(msg);
            }
            break;
        case WL.Env.OSX_DASHBOARD:
            if (typeof window != 'undefind' && typeof window.console != 'undefind' && window.console.log != 'undefind') {
                switch (priority) {
                case "ERROR":
                    window.console.error(msg);
                    break;
                case "DEBUG":
                    window.console.debug(msg);
                    break;
                default:
                    window.console.log(msg);
                }
            }
            break;
        case WL.Env.IPHONE:
        case WL.Env.IPAD:
            if (typeof (window.debug) != 'undefined') {
                switch (priority) {
                case "ERROR":
                    window.debug.error(msg);
                    break;
                case "DEBUG":
                    window.debug.log(msg);
                    break;
                default:
                    window.debug.log(msg);
                }
            }
            break;
        case WL.Env.ANDROID:
        case WL.Env.BLACKBERRY:
        //BLACKBERRY10 uses console.log, so no special need here
        case WL.Env.WINDOWS_PHONE:
        case WL.Env.WINDOWS_PHONE_8:
            break;
        default:
            try {
                console.log(msg);
            } catch (e) {
            }
            break;
        }
    }
    /* End Debug Panel */
};
__WL.prototype.Logger = new __WLLogger;
WL.Logger = new __WLLogger;

WL.Response = WLJSX.Class.create({
    invocationContext : null,
    status : -1,
    initialize : function(transport, invocationContext) {
        if (transport !== null && typeof transport.status != "undefined") {
            this.status = (transport.status || 200);
        }
        this.invocationContext = invocationContext;
    }
});

WL.FailResponse = WLJSX.Class.create({
    invocationContext : null,
    status : -1,
    errorCode : null,
    errorMsg : null,
    initialize : function(transport, invocationContext) {
        if (transport !== null && typeof transport.status != "undefined") {
            this.status = (transport.status || 200);
        }
        this.invocationContext = invocationContext;

        this.errorCode = transport.responseJSON.errorCode;
        this.errorMsg = transport.responseJSON.errorMsg;
    }
});

/*
 * A wrapper for the prototype Ajax.Request. The wrapper is responsible for: 1.
 * Add double-cookie headers to the request. 2. Parse cookies from the response.
 * 3. Invoke the authenticator on demand.
 */
window.WLJSX.Ajax.WLRequest = WLJSX.Class.create({
            instanceId : null,
            wlAnswers : {},
            postAnswerRealm : '',
            MAX_AUTH_HEADER_SIZE : 900,
            MAX_TOTAL_HEADER_SIZE : 3000,

            initialize : function(url, options) {
                this.options = WLJSX.Object.clone(WLJSX.Ajax.WLRequest.options);

                WLJSX.Object.extend(this.options, options || {});
                this.url = WL.Utils.createAPIRequestURL(url);
                this.callerOptions = options;
                this.isTimeout = false;
                this.timeoutTimer = null;

                // this.stopPolling = false;
                this.options.onSuccess = this.onWlSuccess.bind(this);
                this.options.onFailure = this.onWlFailure.bind(this);

                // Handle Exceptions
                this.options.onException = this.onException.bind(this);

                // 0 is the response status when the host is unresponsive
                // (server is
                // down)
                this.options.on0 = this.onUnresponsiveHost.bind(this);

                // Appending the cookie headers to possibly existing ones.
                // If you pass additional headers make sure to use objects of
                // name-value
                // pairs (and not arrays).
                // this.options.requestHeaders =
                // Object.extend(CookieManager.createCookieHeaders(),
                // this.options.requestHeaders || {});
                this.options.requestHeaders = WL.CookieManager.createCookieHeaders();

                // For GET requests - preventing Vista from returning cached GET
                // ajax
                // responses.
                // For POST requests - preventing Air from sending a GET request
                // if the
                // request has no body (even if
                // it's declared as a POST request).
                if (WLJSX.Object.isUndefined(this.options.parameters) || this.options.parameters === null
                        || this.options.parameters === "") {
                    this.options.parameters = {};
                }

                // Add a parameter to notify that this is an Ajax request - for
                // Air.
                this.options.parameters.isAjaxRequest = "true";
                this.wlAnswers = {};
                this.sendRequest();
            },

            /*
             * We need to know ahead of time, for challenge processing if extra work needs to be done if we try and send
             * a message which headers are too big.
             */
            createRequestHeaders : function(){
            	var requestHeaders = {};
            	requestHeaders = WL.CookieManager.createCookieHeaders();
                requestHeaders["x-wl-app-version"] = WL.StaticAppProps.APP_VERSION;  
                
             // add Authorization header from wlAnswres
                if (typeof this.wlAnswers != "undefined") {
                    var authJson = {};
                    var shouldSendAuthHeader = false;
                    for ( var realm in this.wlAnswers) {
                        if (Object.prototype.hasOwnProperty.call(this.wlAnswers, realm)) {
                            answer = "";
                            try {
                                answer = JSON.parse(this.wlAnswers[realm]);
                            } catch (e) {
                                answer = this.wlAnswers[realm];
                            }
                            // Validate we are working with standrad JSON
                            if (typeof answer == "string" && typeof JSON == "undefined") {
                                authJson[realm] = answer.indexOf("\"") == 0 ? answer : "\"" + answer + "\"";
                            } else {
                                authJson[realm] = answer;
                            }
                            shouldSendAuthHeader = true;
                        }
                    }
                    if (shouldSendAuthHeader == true) {
                        requestHeaders.Authorization = WLJSX.Object.toJSON(authJson);
                    }
                }

                // add headers from WL.Client.globalHeaders
                if ((typeof WL.Client.__globalHeaders != "undefined") && (WL.Client.__globalHeaders != null)) {
                    for ( var headerName in WL.Client.__globalHeaders) {
                        if (Object.prototype.hasOwnProperty.call(WL.Client.__globalHeaders, headerName)) {
                            requestHeaders[headerName] = WL.Client.__globalHeaders[headerName];
                        }
                    }
                }
                
                return requestHeaders;
            },
            
            // automaticResend is to be used when comming from submitAnswer or removeExpectedAnswer, we need to know if we should handle the
            // request differently (add it to the challangeHandler wiating list).
            sendRequest : function(requestHeaders) {
            	var shouldPostAnswers = false;
            	
                WL.Logger.debug("Request [" + this.url + "]");
                // Update the random before every request to prevent caching.
                this.options.parameters.x = Math.random();
                
                //add headers
                if (typeof(requestHeaders) === 'undefined'){
                	this.options.requestHeaders = this.createRequestHeaders();
                } else {
                	this.options.requestHeaders = requestHeaders;
                }
                
                var postAnswersOptions = {};
            	
            	//check if we need to send the auth header in the body, becuase it is too large or the total header size is too large
                var allHeadersSize = WLJSX.Object.toJSON(this.options.requestHeaders).length;
                var authHeaderSize = typeof(this.options.requestHeaders.Authorization) === 'undefined' ? -1 : 
                	WLJSX.Object.toJSON(this.options.requestHeaders.Authorization).length;
                
                if ((allHeadersSize > this.MAX_TOTAL_HEADER_SIZE || authHeaderSize > this.MAX_AUTH_HEADER_SIZE) && authHeaderSize >-1 ){
                	
                	postAnswersOptions = WL.Utils.extend(postAnswersOptions, this.options);
                    postAnswersOptions.requestHeaders = this.options.requestHeaders;
                	postAnswersOptions.onSuccess = this.onPostAnswersSuccess.bind(this);
                	postAnswersOptions.onFailure = this.onPostAnswersFailure.bind(this);
                	
                	postAnswersOptions.postBody = this.options.requestHeaders.Authorization;
                	postAnswersOptions.requestHeaders.Authorization = 'wl-authorization-in-body';
                	this.wlAnswers = {};
                	shouldPostAnswers = true;
                }
                
                if (typeof(this.options.requestHeaders.Authorization) !== 'undefined') {
                    //init the wlAnswer map...
                	this.wlAnswers = {};
                }
                
                if (this.options.timeout > 0) {
                    this.timeoutTimer = window.setTimeout(this.handleTimeout.bind(this), this.options.timeout);
                }

                if (shouldPostAnswers){
                	authenticateNewUrl = WL.Utils.createAPIRequestURL('authenticate');
                	new WLJSX.Ajax.Request(authenticateNewUrl, postAnswersOptions);
                } else {
                	new WLJSX.Ajax.Request(this.url, this.options);
                }
            },
            
            onSuccessParent : function(transport, par) {
            	if (this.isTimeout) {
					return;
				}
				this.cancelTimeout();
				var containsChallenges = WL.Client.checkResponseForChallenges(this, transport, par);
				
				if (!containsChallenges) {
					 // Handle notification subscription for push (if needed)
	                if (transport.responseJSON && transport.responseJSON.notificationSubscriptionState && WL.Client.Push.__isDeviceSupportPush()) {
	                    handleSubscriptions(transport.responseJSON.notificationSubscriptionState);
	                }
	                
	                // Handle notification subscription for sms push (if needed)
	        		if (transport.responseJSON && transport.responseJSON.smsNotificationSubscriptionState && WL.Client.Push.isPushSMSSupported()) {
	        			handleSMSSubscriptions(transport.responseJSON.smsNotificationSubscriptionState);
	                }
				}
				
				return containsChallenges;
            },
            
            /*
             * Custom success handelr for PostAnswer Request, it will not send the onSuccess to the application code,
             * because this is not a resend but a special request, and the user should not be informed about it.
             */
			onPostAnswersSuccess : function(transport) {
				this.onSuccessParent(transport, this.postAnswerRealm);
				this.postAnswerRealm = '';
			},
        
            /**
			 * when a onWlSuccess arrives but it came from an response to a
			 * postAnsweresRequest then we should not continue the onSucess any
			 * further
			 * 
			 * @param transport
			 * @param responseToPostAnswers
			 */
            onWlSuccess : function(transport) {
            	var containsChallenges = this.onSuccessParent(transport);
                
                if (!containsChallenges) {
                    this.onSuccess(transport);
                }
            },

            onSuccess : function(transport) {
                WLJSX.Ajax.WLRequest.setConnected(true);
                if (transport.getAllHeaders() !== null) {
                    // Handle Cookies:
                    var headers = transport.getAllHeaders().split("\n");
                    WL.CookieManager.handleResponseHeaders(headers);
                }

                WL.Logger.debug("response [" + this.url + "] success: " + transport.responseText);

                // In vista - the responseJSON is not auto generated.
                if (WL.StaticAppProps.ENVIRONMENT == WL.Env.VISTA_SIDEBAR) {
                    if (this.options.evalJSON && transport.responseText !== null && transport.responseText !== ''
                            && (WLJSX.Object.isUndefined(transport.responseJSON) || transport.responseJSON === null)) {
                        try {
                            transport.responseJSON = WLJSX.String.evalJSON(transport.responseText, true);
                        } catch (e) {
                            transport.responseJSON = {
                                errorCode : WL.ErrorCode.UNEXPECTED_ERROR,
                                errorMsg : WL.ClientMessages.unexpectedError
                            };
                            WL.Logger.error("[" + this.url + "] parsing failure. response: "
                                    + transport.responseJSON.errorMsg);
                            if (typeof (this.callerOptions.onFailure) == "function") {
                                this.callerOptions.onFailure(transport);
                            }
                            return;
                        }
                    }
                }

                //Check for pendings push notification in case user was not loggedin
                if (WL.EnvProfile.isEnabled(WL.EPField.SUPPORT_PUSH) && WL.Client.Push.__hasPendings()) {
                    WL.Client.Push.__dispatchPendings();
                }
                
                if (typeof (this.callerOptions.onSuccess) == "function") {
                    this.callerOptions.onSuccess(transport);
                }
            },

            /*
             * Custom failure handelr for PostAnswer Request, it will remove the original request from waiting list, and not send the onFailure to the application code,
             * because this is not a resend but a special request, and the user should not be informed about it.
             *  
             * When a message arrives from a postAnswerRequert ("authenticate") and it is a 401,403, we need to remove it from the waitinglist so there wont be any resend on it,
             * because if has accepts in it, it will trigger the resend.
             */
            onPostAnswersFailure : function(transport){
            	if (this.isTimeout) {
                    return;
                }
                this.cancelTimeout();
                WL.Client.removeFromWaitingListOnPostAnsweresWlReponse(transport, this, this.postAnswerRealm);
                WL.Client.checkResponseForChallenges(this, transport, this.postAnswerRealm);
                this.postAnswerRealm = '';
            },

            onWlFailure : function(transport) {
				if (this.isTimeout) {
                    return;
                }
                this.cancelTimeout();
                if (!WL.EnvProfile.isEnabled(WL.EPField.SUPPORT_COOKIES)) {
                    if (transport && transport.getAllHeaders && transport.getAllHeaders() !== null) {
                        var headers = transport.getAllHeaders().split("\n");
                        WL.CookieManager.handleResponseHeaders(headers);
                    }
                }
                var containsChallenges = WL.Client.checkResponseForChallenges(this, transport);
                if (!containsChallenges)  {
                    this.onFailure(transport);
                }
            },

            onFailure : function(transport) {
                // sometimes onFailure is called with a dummy transport object
                // for example when an authentication timeout occurs.
                if (transport && transport.getAllHeaders && transport.getAllHeaders() !== null) {
                    var headers = transport.getAllHeaders().split("\n");
                    WL.CookieManager.handleResponseHeaders(headers);
                }

                if (transport.responseJSON === null) {
                    try {
                        transport.responseJSON = WLJSX.String.evalJSON(transport.responseText, true);
                    } catch (e) {
                        transport.responseJSON = {
                            errorCode : WL.ErrorCode.UNEXPECTED_ERROR,
                            errorMsg : WL.ClientMessages.unexpectedError
                        };
                    }
                }

                if (transport.responseJSON.errorCode != WL.ErrorCode.REQUEST_TIMEOUT
                        && transport.responseJSON.errorCode != WL.ErrorCode.UNRESPONSIVE_HOST) {
                    WLJSX.Ajax.WLRequest.setConnected(true);
                }

                var callbackHandler = this.getCallbackForErrorCode(transport.responseJSON.errorCode);

                if (callbackHandler) {
                    callbackHandler(this, transport);
                }

                if (transport.responseJSON.errorCode === WL.ErrorCode.USER_INSTANCE_ACCESS_VIOLATION) {
                    WLJSX.Ajax.WLRequest.options.onAuthentication(this, transport);
                    return;
                }
                WL.Logger.error("[" + this.url + "] failure. state: " + transport.status + ", response: "
                        + transport.responseJSON.errorMsg);
                if (typeof (this.callerOptions.onFailure) == "function") {
                    this.callerOptions.onFailure(transport);
                }
            },

            getCallbackForErrorCode : function(errorCode) {
                return this.options['on' + errorCode];
            },

            onException : function(request, ex) {
                if (this.isTimeout) {
                    return;
                }
                this.cancelTimeout();
                WL.Logger.error("[" + this.url + "] exception.", ex);
                // Workaround for prototype's known behavior of swallowing
                // exceptions.
                (function() {
                    throw ex;
                }).defer();
            },

            onUnresponsiveHost : function() {
                if (this.isTimeout) {
                    return;
                }
                this.cancelTimeout();

                WLJSX.Ajax.WLRequest.setConnected(false);

                if (WL.Client.getEnvironment() === WL.Env.ANDROID) {
                    WL.Logger
                            .error("["
                                    + this.url
                                    + "] Host is not responsive. Try to manually access the URL through the android emulator browser to verify connectivity.");
                } else {
                    WL.Logger.error("[" + this.url + "] Host is not responsive.");
                }
                var transport = {};
                transport.responseJSON = {
                    errorCode : WL.ErrorCode.UNRESPONSIVE_HOST,
                    errorMsg : WL.ClientMessages.unresponsiveHost
                };

                if (typeof (this.callerOptions.onFailure) == "function") {
                    this.callerOptions.onFailure(transport);
                }
            },

            handleTimeout : function() {
                WL.Logger.error("Request timeout for [" + this.url + "]");
                this.cancelTimeout(); // cancel all other timers (if there are
                // any)
                this.isTimeout = true;

                WLJSX.Ajax.WLRequest.setConnected(false);

                var transport = {};
                transport.responseJSON = {
                    errorCode : WL.ErrorCode.REQUEST_TIMEOUT,
                    errorMsg : WL.Utils
                            .formatString(
                                    'Request timed out for {0}. Make sure the host address is available to the app (especially relevant for Android and iPhone apps).',
                                    this.url)
                };
                if (typeof (this.callerOptions.onFailure) == "function") {
                    this.callerOptions.onFailure(transport);
                }
            },

            cancelTimeout : function() {
                if (this.timeoutTimer !== null) {
                    window.clearTimeout(this.timeoutTimer);
                    this.timeoutTimer = null;
                    this.isTimeout = false;
                }
            },

            // Default behavior for setConnected. This function should be
            // overwritten
            // and respond to the connected state
            setConnected : function(isConnected) {
                WL.Logger.debug("Application is now " + (isConnected ? " online." : "offline."));
            },

            checkIfCanResend : function() {
                if (typeof this.wlAnswers === "undefined") {
                    return true;
                }

                for ( var realm in this.wlAnswers) {
                    if (Object.prototype.hasOwnProperty.call(this.wlAnswers, realm)) {
                        if (this.wlAnswers[realm] == null) {
                            return false;
                        }
                    }
                }

                return true;
            },

            // initialize the wlAnswer table with realm = null values
            setExpectedAnswers : function(realms) {
                for ( var realm in realms) {
                    if (Object.prototype.hasOwnProperty.call(realms, realm)) {
                        this.wlAnswers[realm] = null;
                    }
                }
            },

            submitAnswer : function(realm, answer) {
                this.wlAnswers[realm] = answer;
                if (this.checkIfCanResend()) {
                	this.handleResendOrSendPostAnswers(realm);
                }
            },
            
            removeExpectedAnswer : function(realm) {
                delete this.wlAnswers[realm];
                if (this.checkIfCanResend()) {
                	this.handleResendOrSendPostAnswers(realm);                   
                }
            },
            
            /*
             * If the total header size is larger than MAX_TOTAL_HEADER_SIZE or the auth header is larger than MAX_AUTH_HEADER_SIZE
             * we need to put the original request into the waiting list, because we will send a special "authenticate" request that will have the 
             * Autherization header in the body.
             * 
             */
            handleResendOrSendPostAnswers : function(realm){
            	var headers = this.createRequestHeaders();
            	
            	var moveToWaitingList = false;
            	var allHeadersSize = WLJSX.Object.toJSON(headers).length;
				var authHeaderSize = typeof(headers.Authorization) === 'undefined' ? -1 : 
					WLJSX.Object.toJSON(headers.Authorization).length;
				 
				if ((allHeadersSize > this.MAX_TOTAL_HEADER_SIZE || authHeaderSize > this.MAX_AUTH_HEADER_SIZE) && authHeaderSize >-1 ){
					moveToWaitingList = true;
				}
            	
            	if (moveToWaitingList){
            		//iterate over all the challageHandlers
            		this.postAnswerRealm = realm;
            		handler = WL.Client.__chMap[realm];
            		if (typeof(handler) !== 'undefined'){
            			handler.moveToWaitingList(this);
            		}
            	}
            	this.sendRequest(headers);
            }
        });

// WLRequest default options:
WLJSX.Ajax.WLRequest.options = {
    method : 'post',
    asynchronous : true,
    encoding : 'UTF-8',
    parameters : '',
    evalJSON : true,
    timeout : -1,
    onAuthentication : null,
    isAuthResponse : null
};

function handleSubscriptions(notificationSubscriptionState) {
    WL.Client.Push.__clearSubscribedEventSources();
    if (!notificationSubscriptionState.eventSources || notificationSubscriptionState.eventSources.length <= 0) {
        WL.Logger.debug("Send new server notification token id.");
        WL.Client.Push.__updateToken(null);
    } else {
        var eventSources = notificationSubscriptionState.eventSources;
        WL.Client.Push.__updateSubscribedEventSources(eventSources);
        WL.Client.Push.__updateToken(notificationSubscriptionState.token);
    }
}

function handleSMSSubscriptions(notificationSubscriptionState) {
    WL.Client.Push.__clearSubscribedSMSEventSources();
    var eventSources = notificationSubscriptionState.eventSources;
    WL.Client.Push.__updateSubscribedSMSEventSources(eventSources);
}
/**
 * Cookie manager singleton
 */
WL.CookieManager = function() {
    var COOKIE_JSESSION_ID = "JSESSIONID";
    var COOKIE_WLSESSION_ID = "WLSESSIONID";

    // WARN: This constant is also accessed in the iOS native code
    // (WLCookieExtractor.m)
    var PERSISTED_COOKIES_NAME = "cookies";

    var cookies = null;
    var cookiePersister = null;
    var gadgetName = null;
    var gadgetEnvironment = null;
    var gadgetIID = null;

    var CookiePersister = WLJSX.Class.create({
        init : function() {
        },
        storeCookies : function() {
        },
        readCookies : function() {
        }, // throws exception on failure.
        clearCookies : function() {
        }
    });

    // Air
    // Adobe Air has a local SQLite DB which is used to persist the cookies.
    // All cookies are saved as a JSON object in the cookies table, under the
    // name "cookies".
    //
    var AirCookiePersister = WLJSX.Class.create(CookiePersister, {
        conn : null,

        init : function() {
            this.conn = new air.SQLConnection();
            // The database file is in the application storage
            // directory
            var folder = air.File.applicationStorageDirectory;
            var dbFile = folder.resolvePath("worklight.db");

            try {
                this.conn.open(dbFile);
            } catch (e) {
                WL.Logger.error("Error opening cookies DB: " + e.message + ", Details: " + e.details);
                return;
            }

            var createStmt = new air.SQLStatement();
            createStmt.sqlConnection = this.conn;
            createStmt.text = "CREATE TABLE IF NOT EXISTS cookies (name VARCHAR(255) PRIMARY KEY, value VARCHAR(255))";

            try {
                createStmt.execute();
            } catch (e) {
                WL.Logger.error("Error creating cookies DB tables: " + e.message + ", Details: " + e.details);
            }
        },

        storeCookies : function() {
            try {
                var JSONCookies = WLJSX.Object.toJSON(cookies);
                WL.Logger.debug("Storing cookies: " + JSONCookies);

                // first cookie - need to use an "insert" sql
                // command
                if (this.getCookieValue(PERSISTED_COOKIES_NAME) === null) {
                    var insertStmt = new air.SQLStatement();
                    insertStmt.sqlConnection = this.conn;
                    insertStmt.text = "INSERT INTO cookies (name, value) VALUES(\"" + PERSISTED_COOKIES_NAME + "\", \""
                            + JSONCookies + "\")";
                    insertStmt.execute();
                } else {
                    // cookies were persisted already - need to
                    // use an "update"
                    // sql command
                    var updateStmt = new air.SQLStatement();
                    updateStmt.sqlConnection = this.conn;
                    updateStmt.text = "UPDATE cookies SET name=\"" + PERSISTED_COOKIES_NAME + "\", value=\""
                            + JSONCookies + "\" WHERE name=\"" + PERSISTED_COOKIES_NAME + "\"";
                    updateStmt.execute();
                }
            } catch (e) {
                WL.Logger.error("Error storing cookies: " + e.message + ", Details: " + e.details);
            }
        },

        readCookies : function() {
            var JSONCookies = this.getCookieValue(PERSISTED_COOKIES_NAME);
            if (JSONCookies) {
                WL.Logger.debug("Read cookies: " + JSONCookies);
                var cookiesObj = WLJSX.String.evalJSON(JSONCookies);
                for ( var key in cookiesObj) {
                    cookies[key] = cookiesObj[key];
                }
            }
        },

        clearCookies : function() {
            try {
                var deleteStmt = new air.SQLStatement();
                deleteStmt.sqlConnection = this.conn;
                deleteStmt.text = "DELETE FROM cookies";
                deleteStmt.execute();
            } catch (e) {
                WL.Logger.error("Error clearing cookies: " + e.message);
            }
        },

        getCookieValue : function(cookieName) {
            try {
                var cookieValue = null;
                var selectStmt = new air.SQLStatement();
                selectStmt.sqlConnection = this.conn;
                selectStmt.text = "SELECT * FROM cookies WHERE name=\"" + cookieName + "\"";
                selectStmt.execute();

                var result = selectStmt.getResult();
                if (result.data !== null) {
                    var numResults = result.data.length;
                    for ( var i = 0; i < numResults; i++) {
                        cookieValue = result.data[i].value;
                    }
                }
                return cookieValue;
            } catch (e) {
                WL.Logger.error("Error getting cookie: " + cookieName + ", error: " + e.message);
            }
        }
    });

    //
    // Vista
    // The Windows registry is used to persist the cookies.
    // All cookies are saved as a JSON object, under the registry entry
    // "cookies".
    //
    var VistaCookiePersister = WLJSX.Class.create(CookiePersister, {
        cookiesRegPath : null,
        registryEditor : null,
        init : function() {
            try {
                this.cookiesRegPath = 'HKCU\\Software\\Worklight\\Gadgets\\' + gadgetName + '\\' + gadgetIID + '\\';
                this.registryEditor = new ActiveXObject("WScript.Shell");
                this.registryEditor.RegWrite(this.cookiesRegPath, '');
                try {
                    this.registryEditor.RegRead(this.cookiesRegPath + PERSISTED_COOKIES_NAME);
                } catch (e) {
                    // creater the entry only if not exist
                    this.registryEditor.RegWrite(this.cookiesRegPath + PERSISTED_COOKIES_NAME, "{}", "REG_SZ");
                }
            } catch (e) {
                WL.Logger.error("Error creating registry entry for application: " + e.message);
            }
        },

        storeCookies : function() {
            try {
                var JSONCookies = WLJSX.Object.toJSON(cookies);
                WL.Logger.debug("Storing cookies: " + JSONCookies);
                this.registryEditor.RegWrite(this.cookiesRegPath + PERSISTED_COOKIES_NAME, JSONCookies, "REG_SZ");
            } catch (e) {
                WL.Logger.error("Error storing cookies: " + e.message);
            }
        },

        readCookies : function() {
            var JSONCookies = this.registryEditor.RegRead(this.cookiesRegPath + PERSISTED_COOKIES_NAME);
            WL.Logger.debug("Read cookies: " + JSONCookies);
            if (JSONCookies != null) {
                var cookiesObj = WLJSX.String.evalJSON(JSONCookies);
                for ( var key in cookiesObj) {
                    cookies[key] = cookiesObj[key];
                }
            }
        },

        clearCookies : function() {
            try {
                this.registryEditor.RegDelete(this.cookiesRegPath + PERSISTED_COOKIES_NAME);
            } catch (e) {
                WL.Logger.error("Error clearing cookies: " + e.message);
            }
        }
    });

    //
    // Mac OS X
    // The Dashboard preferences mechanism is used to persist the cookies.
    // All cookies are saved as a JSON object, under the preference name
    // "cookies".
    //
    var MacCookiePersister = WLJSX.Class.create(CookiePersister, {
        storeCookies : function() {
            // Save the cookies to the preferences
            if (window.widget) {
                var JSONCookies = WLJSX.Object.toJSON(cookies);
                WL.Logger.debug("Storing cookies: " + JSONCookies);
                widget.setPreferenceForKey(JSONCookies, PERSISTED_COOKIES_NAME);
            }
        },

        readCookies : function() {
            if (window.widget) {
                var JSONCookies = widget.preferenceForKey(PERSISTED_COOKIES_NAME);
                WL.Logger.debug("Read cookies: " + JSONCookies);
                if (JSONCookies != null) {
                    var cookiesObj = WLJSX.String.evalJSON(JSONCookies);
                    for ( var key in cookiesObj) {
                        cookies[key] = cookiesObj[key];
                    }
                }
            }
        },

        clearCookies : function() {
            if (window.widget) {
                widget.setPreferenceForKey(null, PERSISTED_COOKIES_NAME);
            }
        }
    });

    //
    // Blackberry Persister
    //
    var BlackberryCookiePersister = WLJSX.Class.create(CookiePersister, {
        storeCookies : function() {
            try {
                var JSONCookies = WLJSX.Object.toJSON(cookies);
                WL.Logger.debug("Storing cookies: (" + JSONCookies + ")");
                __WL.blackBerryPersister.store(PERSISTED_COOKIES_NAME, JSONCookies);
            } catch (e) {
                WL.Logger.error("Error storing cookie: " + e.message);
            }
        },

        readCookies : function() {
            try {
                var JSONCookies = __WL.blackBerryPersister.read(PERSISTED_COOKIES_NAME);
                WL.Logger.debug("Read cookies: " + JSONCookies);
                if (JSONCookies != null) {
                    var cookiesObj = WLJSX.String.evalJSON(JSONCookies);
                    for ( var key in cookiesObj) {
                        cookies[key] = cookiesObj[key];
                    }
                }
            } catch (e) {
                WL.Logger.error("Error reading cookies: " + e.message);
            }
        },

        clearCookies : function() {
            try {
                var JSONCookies = WLJSX.Object.toJSON(cookies);
                __WL.blackBerryPersister.remove(PERSISTED_COOKIES_NAME);
                WL.Logger.debug("Delete cookies: " + JSONCookies);
            } catch (e) {
                WL.Logger.error("Error deleting cookies: " + e.message);
            }
        }
    });

    //
    // Windows Phone Persister
    //
    var WPCookiePersister = WLJSX.Class.create(CookiePersister, {
        storeCookies : function() {
            try {
                var JSONCookies = WLJSX.Object.toJSON(cookies);
                window.localStorage.setItem(PERSISTED_COOKIES_NAME, JSONCookies);
                WL.Logger.debug("Storing cookies: (" + JSONCookies + ")");
                this.readCookies();
            } catch (e) {
                WL.Logger.error("Error storing cookie: " + e.message);
            }
        },

        readCookies : function() {
            try {
            	JSONCookies = window.localStorage.getItem(PERSISTED_COOKIES_NAME);
				
				if (JSONCookies != null) {
					var cookiesObj = WLJSX.String.evalJSON(JSONCookies);
					for (var key in cookiesObj){
						cookies[key] = cookiesObj[key];
					}
				}
            } catch (e) {
                WL.Logger.error("Error reading cookies: " + e.message);
            }
        },

        clearCookies : function() {
            try {
            	window.localStorage.removeItem(PERSISTED_COOKIES_NAME);
                WL.Logger.debug("Delete cookies: " + JSONCookies);
            } catch (e) {
                WL.Logger.error("Error deleting cookies: " + e.message);
            }
        }
    });

    var LocalStorageCookiePersister = WLJSX.Class.create(CookiePersister, {
        storeCookies : function() {
            try {
                var JSONCookies = WLJSX.Object.toJSON(cookies);
                WL.Logger.debug("Storing cookies: (" + JSONCookies + ")");
                __WL.LocalStorage.setValue(PERSISTED_COOKIES_NAME, JSONCookies);
            } catch (e) {
                WL.Logger.error("Error storing cookie: " + e.message);
            }
        },

        readCookies : function() {
            try {
                var JSONCookies = __WL.LocalStorage.getValue(PERSISTED_COOKIES_NAME);
                if (JSONCookies == '') {
                    return;
                }
                WL.Logger.debug("Read cookies: " + JSONCookies);
                if (JSONCookies != null) {
                    var cookiesObj = WLJSX.String.evalJSON(JSONCookies);
                    for ( var key in cookiesObj) {
                        cookies[key] = cookiesObj[key];
                    }
                }
            } catch (e) {
                WL.Logger.error("Error reading cookies: " + e.message);
            }
        },

        clearCookies : function() {
            try {
                var JSONCookies = WLJSX.Object.toJSON(cookies);
                __WL.LocalStorage.clear(KEY_COOKIES);
                WL.Logger.debug("Delete cookies: " + JSONCookies);
            } catch (e) {
                WL.Logger.error("Error deleting cookies: " + e.message);
            }
        }
    });

    // 
    // Android
    //
    var AndroidCookiePersister = LocalStorageCookiePersister;

    //
    // iPhone
    //	
    var IPhoneCookiePersister = LocalStorageCookiePersister;

    // Private methods of the cookie manager:

    // Create the cookie persister according to the environment
    var createCookiePersister = function() {
        switch (gadgetEnvironment) {
        case WL.Env.VISTA_SIDEBAR:
            cookiePersister = new VistaCookiePersister();
            break;
        case WL.Env.OSX_DASHBOARD:
            cookiePersister = new MacCookiePersister();
            break;
        case WL.Env.ADOBE_AIR:
            cookiePersister = new AirCookiePersister();
            break;
        case WL.Env.IPHONE:
            cookiePersister = new IPhoneCookiePersister();
            break;
        case WL.Env.IPAD:
            cookiePersister = new IPhoneCookiePersister();
            break;
        case WL.Env.BLACKBERRY:
            // check if localStorage (HTML5 feature) supported
            cookiePersister = (typeof localStorage != "undefined") ? new LocalStorageCookiePersister
                    : new BlackberryCookiePersister();
            break;
        case WL.Env.ANDROID:
            cookiePersister = new AndroidCookiePersister();
            break;
        case WL.Env.WINDOWS_PHONE:
        case WL.Env.WINDOWS_PHONE_8:
            cookiePersister = new WPCookiePersister();
            break;
        default:
            cookiePersister = null;
            break;
        }
    };

    var parseCookiesFromHeader = function(header) {
        var resultCookies = [];
        var headerValue = header.substr(header.indexOf(":") + 1);

        var cookieParts = headerValue.split(",");
        for ( var i = 0; i < cookieParts.length; i++) {
            var cookiePart = cookieParts[i];
            // WL.Logger.debug("CookiePart: " + cookiePart);
            var cookieSubparts = cookiePart.split("=");
            if (cookieSubparts.length < 2) {
                WL.Logger.error("invalid cookie header: " + header);
            } else {
                var cookie = {
                    name : WLJSX.String.strip(cookieSubparts[0]),
                    value : WLJSX.String.strip(cookieSubparts[1].split(';')[0])
                };
                resultCookies.push(cookie);
            }
        }
        return resultCookies;
    };

    var getCookie = function(cookieName) {
        var cookieValue = "";
        if (isCookieManagementRequired()) {
            cookieValue = cookies[cookieName];
        } else {
            if (document.cookie.length > 0) {
                var cookieStart = document.cookie.indexOf(cookieName + "=");
                if (cookieStart !== -1) {
                    cookieStart = cookieStart + cookieName.length + 1;
                    var cookieEnd = document.cookie.indexOf(";", cookieStart);
                    if (cookieEnd === -1) {
                        cookieEnd = document.cookie.length;
                    }
                    cookieValue = decodeURI(document.cookie.substring(cookieStart, cookieEnd));
                }
            }
        }
        if (typeof cookieValue === 'undefined') {
            cookieValue = null;
        }
        // WL.Logger.debug("getCookieValue: " + cookieName + "=" + cookieValue);
        return {
            name : cookieName,
            value : cookieValue
        };
    };

    var isCookieManagementRequired = function() {
        return !WL.EnvProfile.isEnabled(WL.EPField.SUPPORT_COOKIES);
    };

    // Public API methods
    return {
        init : function(gadgetDisplayName, gadgetEnv, gadgetInstanceID) {
            gadgetName = gadgetDisplayName;
            gadgetEnvironment = gadgetEnv;
            gadgetIID = gadgetInstanceID;

            cookies = {};
            createCookiePersister();

            if (cookiePersister !== null) {
                cookiePersister.init();
                try {
                    cookiePersister.readCookies();
                } catch (e) {
                    WL.Logger.error("error read cookies: " + e.message);
                    cookiePersister.clearCookies();
                }
                WL.Logger.debug("CookieMgr read cookies: " + WLJSX.Object.toJSON(cookies));
            }
        },

        // Called by WP7 native code after call readCookies
        updateCookies : function(JSONCookies) {
            try {
                var cookiesObj = WLJSX.String.evalJSON(JSONCookies);
                for ( var key in cookiesObj) {
                    cookies[key] = cookiesObj[key];
                }
            } catch (e) {
                WL.Logger.error("Problems to update cookies " + e + " " + JSONCookies);
            }
        },

        clearCookies : function() {
            cookies = {};
            if (cookiePersister !== null) {
                cookiePersister.clearCookies();
            }
        },

        createCookieHeaders : function() {
            var headers = {};
            if (isCookieManagementRequired()) {
                var cookieHeaderValue = '';
                for ( var key in cookies) {
                    cookieHeaderValue += key + "=" + cookies[key] + ";";
                }

                if (cookieHeaderValue != '') {
                    headers.Cookie = cookieHeaderValue;
                }
            }

            if (!WL.EnvProfile.isEnabled(WL.EPField.SUPPORT_DEVICE_AUTH) && typeof device != "undefined"
                    && device != null && typeof device.uuid != "undefined") {
                var deviceId = {};
                deviceId.id = device.uuid;
                deviceId.os = device.version;
                deviceId.model = device.model;
                deviceId.environment = WL.Client.getEnvironment();
                headers.deviceId = WLJSX.Object.toJSON(deviceId);
            }
            return headers;
        },

        handleResponseHeaders : function(headers) {
            if (!isCookieManagementRequired()) {
                return;
            }
            var sessionCookies = {};
            for ( var i = 0; i < headers.length; i++) {
                var header = headers[i];
                if (header.toLowerCase().indexOf("set-cookie") > -1) {
                    var parsedCookies = parseCookiesFromHeader(header);
                    for ( var j = 0; j < parsedCookies.length; j++) {
                        var cookie = parsedCookies[j];
                        // Persist only the non session cookies
                        if (cookie.name != COOKIE_JSESSION_ID && cookie.name != COOKIE_WLSESSION_ID) {
                            cookies[cookie.name] = cookie.value;
                        } else {
                            sessionCookies[cookie.name] = cookie.value;
                        }

                        if (cookiePersister !== null) {
                            if (cookies != null && WLJSX.Object.objectSize(cookies) > 0) {
                                // in case there is two requests immediate after
                                // login we need
                                // to ensure session cookies is not persist
                                delete cookies[COOKIE_WLSESSION_ID];
                                delete cookies[COOKIE_JSESSION_ID];
                                cookiePersister.storeCookies();
                            }
                        }
                    }
                }
            }

            // Add the session cookies into the memory cookies
           if (isCookieManagementRequired()) {
              for (var key in sessionCookies){
                 cookies[key] = sessionCookies[key];
              }
            }
             
        },

        getJSessionID : function() {
            var jsessionidCookie = getCookie(COOKIE_JSESSION_ID);
            return (jsessionidCookie === null) ? null : jsessionidCookie.value;
        },

        areCookiesEnabled : function() {
            var enabled = true;
            if (WL.EnvProfile.isEnabled(WL.EPField.WEB)) {
                var date = new Date();
                date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
                document.cookie = "testcookie=oreo; expires=" + date.toGMTString() + "; path=/";
                var cookie = getCookie('testcookie');
                enabled = (cookie.value === 'oreo');
            }
            return enabled;
        }
    };
}();
/* End CookieManager */
/**
 * Environment Profiles
 * 
 */
WL.EPField = {

    // NOTICE - value must be equal to the field name!!!
    SUPPORT_COOKIES : "SUPPORT_COOKIES",
    DESKTOP : "DESKTOP",
    WEB : "WEB",
    MOBILE : "MOBILE",
    USES_AUTHENTICATOR : "USES_AUTHENTICATOR",
    SAVES_USERNAME : "SAVES_USERNAME",
    HAS_NATIVE_LOGGER : "HAS_NATIVE_LOGGER",
    USES_NATIVE_TOOLBAR : "USES_NATIVE_TOOLBAR",
    USES_CORDOVA : "USES_CORDOVA",
    SUPPORT_DIRECT_UPDATE_FROM_SERVER : "SUPPORT_DIRECT_UPDATE_FROM_SERVER",
    SUPPORT_DIAGNOSTIC : "SUPPORT_DIAGNOSTIC",
    ISIOS : "ISIOS",
    SUPPORT_PUSH : "SUPPORT_PUSH",
    SUPPORT_PUSH_SMS : "SUPPORT_PUSH_SMS",
    WEB_BROWSER_ONLY : "WEB_BROWSER_ONLY",
    SUPPORT_CHALLENGE : "SUPPORT_CHALLENGE",
    SUPPORT_SHELL : "SUPPORT_SHELL",
    SUPPORT_DEVICE_AUTH : "SUPPORT_DEVICE_AUTH",
    SERVER_ADDRESS_CONFIGURABLE : "SERVER_ADDRESS_CONFIGURABLE",
    SUPPORT_WL_USER_PREF : "SUPPORT_WL_USER_PREF"
};

WL.EnvProfileField = WL.EPField;
WL.BaseProfileData = {
    SUPPORT_COOKIES : true,
    SUPPORT_DIRECT_UPDATE_FROM_SERVER : false,
    SUPPORT_DIAGNOSTIC : false,
    SUPPORT_PUSH : false,
    SUPPORT_PUSH_SMS : false,
    SUPPORT_DEVICE_AUTH : false,
    SERVER_ADDRESS_CONFIGURABLE : false,
    SUPPORT_WL_USER_PREF : false
};
WL.WebProfileData = {
    WEB : true
};
WL.WebProfileData = WL.Utils.extend(WL.WebProfileData, WL.BaseProfileData);

WL.DesktopProfileData = {
    DESKTOP : true,
    USES_AUTHENTICATOR : true,
    SAVES_USERNAME : false
};

WL.MobileProfileData = {
    USES_AUTHENTICATOR : true,
    SAVES_USERNAME : false
};

WL.MobileProfileData = WL.Utils.extend(WL.MobileProfileData, WL.BaseProfileData);

// Notice that the default profile is web so all web environments
// Do not need to explicitly define one unless they want to
// define a field differently.
WL.DefaultProfileData = WLJSX.Object.clone(WL.WebProfileData);

WL.vistaProfileData = WLJSX.Object.clone(WL.DesktopProfileData);

WL.dashboardProfileData = WLJSX.Object.clone(WL.DesktopProfileData);

WL.airProfileData = WLJSX.Object.clone(WL.DesktopProfileData);
WL.airProfileData[WL.EPField.HAS_NATIVE_LOGGER] = true;

WL.previewProfileData = WLJSX.Object.clone(WL.WebProfileData);
WL.previewProfileData[WL.EPField.WEB_BROWSER_ONLY] = true;

WL.facebookProfileData = WLJSX.Object.clone(WL.WebProfileData);
WL.facebookProfileData[WL.EPField.WEB_BROWSER_ONLY] = true;

WL.igoogleProfileData = WLJSX.Object.clone(WL.WebProfileData);
WL.igoogleProfileData[WL.EPField.WEB_BROWSER_ONLY] = true;

WL.embeddedProfileData = WLJSX.Object.clone(WL.WebProfileData);
WL.embeddedProfileData[WL.EPField.WEB_BROWSER_ONLY] = true;

WL.mobilewebappProfileData = WLJSX.Object.clone(WL.WebProfileData);
WL.mobilewebappProfileData[WL.EPField.WEB_BROWSER_ONLY] = true;

WL.iosDeviceProfileData = WLJSX.Object.clone(WL.MobileProfileData);
WL.iosDeviceProfileData[WL.EPField.MOBILE] = true;
WL.iosDeviceProfileData[WL.EPField.DESKTOP] = false;
WL.iosDeviceProfileData[WL.EPField.HAS_NATIVE_LOGGER] = true;
WL.iosDeviceProfileData[WL.EPField.SUPPORT_DIRECT_UPDATE_FROM_SERVER] = true;
WL.iosDeviceProfileData[WL.EPField.SAVES_USERNAME] = true;
WL.iosDeviceProfileData[WL.EPField.SAVES_USERNAME] = true;
WL.iosDeviceProfileData[WL.EPField.ISIOS] = true;
WL.iosDeviceProfileData[WL.EPField.USES_CORDOVA] = true;
WL.iosDeviceProfileData[WL.EPField.SUPPORT_DIAGNOSTIC] = true;
WL.iosDeviceProfileData[WL.EPField.SUPPORT_PUSH] = true;
WL.iosDeviceProfileData[WL.EPField.SUPPORT_PUSH_SMS] = true;
WL.iosDeviceProfileData[WL.EPField.SUPPORT_CHALLENGE] = true;
WL.iosDeviceProfileData[WL.EPField.SUPPORT_SHELL] = true;
WL.iosDeviceProfileData[WL.EPField.SUPPORT_DEVICE_AUTH] = true;
WL.iosDeviceProfileData[WL.EPField.SERVER_ADDRESS_CONFIGURABLE] = true;
WL.iosDeviceProfileData[WL.EPField.SUPPORT_WL_USER_PREF] = true;

WL.iphoneProfileData = WLJSX.Object.clone(WL.iosDeviceProfileData);
WL.ipadProfileData = WLJSX.Object.clone(WL.iosDeviceProfileData);

WL.androidProfileData = WLJSX.Object.clone(WL.MobileProfileData);
WL.androidProfileData[WL.EPField.MOBILE] = true;
WL.androidProfileData[WL.EPField.DESKTOP] = false;
WL.androidProfileData[WL.EPField.USES_NATIVE_TOOLBAR] = true;
WL.androidProfileData[WL.EPField.HAS_NATIVE_LOGGER] = true;
WL.androidProfileData[WL.EPField.SUPPORT_DIRECT_UPDATE_FROM_SERVER] = true;
WL.androidProfileData[WL.EPField.SAVES_USERNAME] = true;
WL.androidProfileData[WL.EPField.USES_CORDOVA] = true;
WL.androidProfileData[WL.EPField.SUPPORT_DIAGNOSTIC] = true;
WL.androidProfileData[WL.EPField.SUPPORT_PUSH] = true;
WL.androidProfileData[WL.EPField.SUPPORT_PUSH_SMS] = true;
WL.androidProfileData[WL.EPField.SUPPORT_CHALLENGE] = true;
WL.androidProfileData[WL.EPField.SUPPORT_SHELL] = true;
WL.androidProfileData[WL.EPField.SUPPORT_DEVICE_AUTH] = true;
WL.androidProfileData[WL.EPField.SERVER_ADDRESS_CONFIGURABLE] = true;
WL.androidProfileData[WL.EPField.SUPPORT_WL_USER_PREF] = true;

WL.blackberryProfileData = WLJSX.Object.clone(WL.MobileProfileData);
WL.blackberryProfileData[WL.EPField.MOBILE] = true;
WL.blackberryProfileData[WL.EPField.HAS_NATIVE_LOGGER] = false;
WL.blackberryProfileData[WL.EPField.SUPPORT_PUSH_SMS] = true;

WL.blackberry10ProfileData = WLJSX.Object.clone(WL.MobileProfileData);
WL.blackberry10ProfileData[WL.EPField.MOBILE] = true;
WL.blackberry10ProfileData[WL.EPField.HAS_NATIVE_LOGGER] = true;
WL.blackberry10ProfileData[WL.EPField.SUPPORT_PUSH_SMS] = true;
WL.blackberry10ProfileData[WL.EPField.USES_CORDOVA] = true;

WL.windowsphoneProfileData = WLJSX.Object.clone(WL.MobileProfileData);
WL.windowsphoneProfileData[WL.EPField.MOBILE] = true;
WL.windowsphoneProfileData[WL.EPField.HAS_NATIVE_LOGGER] = true;
WL.windowsphoneProfileData[WL.EPField.USES_CORDOVA] = true;
WL.windowsphoneProfileData[WL.EPField.SUPPORT_PUSH_SMS] = true;

WL.windowsphone8ProfileData = WLJSX.Object.clone(WL.MobileProfileData);
WL.windowsphone8ProfileData[WL.EPField.MOBILE] = true;
WL.windowsphone8ProfileData[WL.EPField.HAS_NATIVE_LOGGER] = true;
WL.windowsphone8ProfileData[WL.EPField.USES_CORDOVA] = true;
WL.windowsphone8ProfileData[WL.EPField.SUPPORT_PUSH_SMS] = true;
WL.windowsphone8ProfileData[WL.EPField.SUPPORT_PUSH] = true;

/**
 * EnvironmentProfile
 */
WL.EnvProfile = function() {
    var profile = null;

    return {
        initialize : function(env) {
            if (typeof WL[env + "ProfileData"] !== 'undefined') {
                profile = WL[env + "ProfileData"];
            } else {
                profile = WL.DefaultProfileData;
            }
        },

        getValue : function(field) {
            return profile[field];
        },

        isEnabled : function(field) {
            return !!(field in profile && profile[field]);
        }
    };
}();

// Overwriting the prototype.js isSameOrigin method -
// Updated the original method by wrapping the return statement with try/catch
// because it does not work properly in desktop applications such as Vista
// (document.domain is undefined).
WLJSX.Ajax.Request.prototype.isSameOrigin = function() {
    var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
    try {
        var url = location.protocol + '//' + document.domain;
        if (location.port) {
            url += ':' + location.port;
        }
        return (!m || (m[0] == url));
    } catch (e) {
        return true;
    }
};

__WL.MultiEventListener = WLJSX.Class.create({
    isEventComplete : false,
    onEventsComplete : null,
    events : null,

    initialize : function() {
        this.events = new Object();
    },

    __onEvent : function(e) {
        this.events[e.type] = true;
        for (x in this.events) {
            if (!this.events[x]) {
                return;
            }
        }
        this.onEventsComplete();
    },

    registerEvent : function(e) {
        document.addEventListener(e, this.__onEvent.bind(this), false);
        this.events[e] = false;
    }
});

__WL.InternalEvents = {
    REACHABILITY_TEST_FAILURE : "WL:REACHABILITY_TEST_FAILURE",
    REACHABILITY_TEST_SUCCESS : "WL:REACHABILITY_TEST_SUCCESS"
};

var __WLEvents = {
    WORKLIGHT_IS_CONNECTED : "WL:WORKLIGHT_IS_CONNECTED",
    WORKLIGHT_IS_DISCONNECTED : "WL:WORKLIGHT_IS_DISCONNECTED"
};

__WL.prototype.Events = __WLEvents;
WL.Events = __WLEvents;

__WLLocalStorage = function() {
    var isSupportLocalStorage = (typeof localStorage != "undefined");
    var HTML5_NOT_SUPPORT_MSG = ". HTML5 localStorage not supported on current browser.";

    if (typeof document.addEventListener != 'undefined') {
	    document.addEventListener('deviceready', deviceReadyCallback, false);
    } else {
    	document.attachEvent('ondeviceready', deviceReadyCallback);
    }
    
    function preventClearSpecialValues () {
    	// prevent from clear Worklight special values
        if (typeof Storage != "undefined" && isSupportLocalStorage) {
            Storage.prototype.clear = function() {
                for (item in localStorage) {
                    if (item != "cookies" && item != "userName") {
                        localStorage.removeItem(item);
                    }
                }
            };
        }
    };
    
    function deviceReadyCallback() {
    	isSupportLocalStorage = (typeof localStorage != "undefined");
        preventClearSpecialValues();
    };
    

    this.getValue = function(key) {
        var value = null;
        if (isSupportLocalStorage) {
            value = localStorage.getItem(key);
        } else {
            WL.Logger.debug("Can't retrive value for key " + key + HTML5_NOT_SUPPORT_MSG);
        }
        return value;
    },

    this.setValue = function(key, value) {
        if (isSupportLocalStorage) {
            localStorage.setItem(key, value);
        } else {
            WL.Logger.debug("Can't set value " + value + " for key" + key + HTML5_NOT_SUPPORT_MSG);
        }
    },

    this.clear = function(key) {
        if (isSupportLocalStorage) {
            localStorage.removeItem(key);
        } else {
            WL.Logger.debug("Can't clear key " + key + HTML5_NOT_SUPPORT_MSG);
        }
    },

    this.clearAll = function() {
        if (isSupportLocalStorage) {
            localStorage.clear();
        } else {
            WL.Logger.debug("Can't clear storage" + HTML5_NOT_SUPPORT_MSG);
        }
    };
};

__WL.LocalStorage = new __WLLocalStorage;

__WLToast = function() {
    // Support toast message (for Android devices)
    this.show = function(message) {
    };
};
__WL.prototype.Toast = new __WLToast;
WL.Toast = new __WLToast;

__WLDevice = function() {
    /**
     * Supported environments: Android, iOS
     * 
     * @param callback -
     *            the callback function
     * @return network info from device in JSON format The returned object
     *         consist from the following properties: isNetworkConnected,
     *         isAirplaneMode, isRoaming, networkConnectionType, wifiName,
     *         telephonyNetworkType, carrierName, ipAddress,
     */
    this.getNetworkInfo = function(callback) {
        callback({});
    };
};
__WL.prototype.Device = new __WLDevice;
WL.Device = new __WLDevice;
