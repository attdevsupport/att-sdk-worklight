
/* JavaScript content from wlclient/js/wlgap.ios.js in iphone Common Resources */
/*
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/* Copyright (C) Worklight Ltd. 2006-2012.  All rights reserved. */

var APP_SERVICES_POSTFIX = "/apps/services/";

/**
 * Push Notification API for the iOS environment.
 */
__WLPush = function() {
    var serverToken = null;
    var isTokeUpdatedOnServer = false;
    var subscribedEventSources = {};
    var subscribedSMSEventSources = {};
    var pendindPushEventsArray = new Array();
    var registeredEventSources = {};
    var defaultSubscribeOptions = {
        alert : true,
        badge : true,
        sound : true,
        requestHeaders : {},
        onFailure : function() {
            WL.Logger.error("WL.Client.Push.subscribe: error subscribing for notifications");
        },
        onSuccess : function() {
        }
    };
    var defaultUnsubscribeOptions = {
        requestHeaders : {},
        onFailure : function() {
            WL.Logger.error("WL.Client.Push.unsubscribe: error unsubscribing from notifications");
        },
        onSuccess : function() {
        }
    };
    
    var defaultSubscribeSMSOptions = {
        requestHeaders : {},
        onFailure : function() {
            WL.Logger.error("WL.Client.Push.subscribeSMS: error subscribing for notifications");
        },
        onSuccess : function() {
        }
    };
    var defaultUnsubscribeSMSOptions = {
        requestHeaders : {},
        onFailure : function() {
            WL.Logger.error("WL.Client.Push.unsubscribeSMS: error unsubscribing from notifications");
        },
        onSuccess : function() {
        }
    };

    /**
     * Register event source for push notification. Must be called on
     * application initialization before any subscribe call.
     * 
     * @param alias
     *            {string} - alias of the event source.
     * @param adapter
     *            {string}
     * @param eventSource
     *            {string}
     * @param callback
     *            {function} - this callback will be invoked upon receiving push
     *            notification. This function signature is function (props,
     *            payload).
     */
    this.registerEventSourceCallback = function(alias, adapter, eventSource, callback) {
        WL.Validators.validateArguments([ 'string', 'string', 'string', WL.Validators.validateFunctionOrNull ], arguments,
                'WL.Client.Push.subscribe');
        if (typeof registeredEventSources[alias] != "undefined") {
            WL.Logger.error("Cannot register to event source callback with an existing alias: '" + alias
                    + "'. The alias is already in use for event source '" + eventSource + "'.");
            return;
        }
        registeredEventSources[alias] = {
            "adapter" : adapter,
            "eventSource" : eventSource,
            "callback" : callback
        };
    };
    
    this.__updateToken = function(sToken) {
        serverToken = sToken;
        cordova.exec("Push.subscribe", "WL.Client.Push.__updateTokenCallback", "WL.Client.Push.__updateTokenCallbackError",
                defaultSubscribeOptions);
    };

    this.subscribe = function(alias, options) {
        WL.Validators.validateArguments([ 'string', WL.Validators.validateObjectOrNull ], arguments, 'WL.Client.Push.subscribe');
        WL.Validators.validateOptionsLoose({
            onSuccess : 'function',
            onFailure : 'function'
        }, options, "WL.Client.Push.subscribe");
        if (!isAbleToSubscribe(alias)) {
            return;
        }
        if (!options) {
            options = {};
        }
        var registeredEventSource = registeredEventSources[alias];
        var requestOptions = {
            onSuccess : function() {
                subscribedEventSources[alias] = true;
                if (options.onSuccess) {
                    options.onSuccess();
                }
                if (WL.Client.Push.__hasPendings()) {
                    WL.Client.Push.__dispatchPendings();
                }
            },
            onFailure : function () {
            	options.onFailure();
            }
        };

        requestOptions.requestHeaders = {};
        requestOptions.parameters = {};
        requestOptions.parameters.adapter = registeredEventSource.adapter;
        requestOptions.parameters.eventSource = registeredEventSource.eventSource;
        requestOptions.parameters.alias = alias;
        requestOptions.parameters.subscribe = WLJSX.Object.toJSON(options);
        new WLJSX.Ajax.WLRequest("notifications", requestOptions);
        cordova.exec("Push.dispatch", 'WL.Client.Push.__onmessage');
    };

    this.unsubscribe = function(alias, options) {
        WL.Validators.validateArguments([ 'string', WL.Validators.validateObjectOrNull ], arguments, 'WL.Client.Push.unsubscribe');
        WL.Validators.validateOptionsLoose({
            onSuccess : 'function',
            onFailure : 'function'
        }, options, "WL.Client.Push.unsubscribe");
        if (!isAbleToSubscribe(alias)) {
            return;
        }
        var extendedOptions = WLJSX.Object.extend(WLJSX.Object.clone(defaultUnsubscribeOptions), options);

        var registeredEventSource = registeredEventSources[alias];
        var requestOptions = {
            onSuccess : function() {
                subscribedEventSources[alias] = false;
                if (extendedOptions.onSuccess) {
                    extendedOptions.onSuccess();
                }
            },
            onFailure : function () {
            	extendedOptions.onFailure();
            }
        };
        requestOptions.requestHeaders = {};
        requestOptions.parameters = {};
        requestOptions.parameters.alias = alias;
        requestOptions.parameters.adapter = registeredEventSource.adapter;
        requestOptions.parameters.eventSource = registeredEventSource.eventSource;
        requestOptions.parameters.unsubscribe = "";
        new WLJSX.Ajax.WLRequest("notifications", requestOptions);
    };
    
    this.subscribeSMS = function(alias, adapter, eventSource, phoneNumber, options) {
        
        WL.Validators.validateArguments([ 'string', 'string', 'string', 'string', WL.Validators.validateObjectOrNull ], arguments, 'WL.Client.Push.subscribeSMS');
        WL.Validators.validateOptionsLoose({
            onSuccess : 'function',
            onFailure : 'function'
        }, options, "WL.Client.Push.subscribeSMS");

        if (!options) {
            options = {};
        }
        
        var extendedOptions = WLJSX.Object.extend(WLJSX.Object.clone(defaultSubscribeSMSOptions), options);
        
        var subscribedSMSEventSource = {
                "adapter" : adapter,
                "eventSource" : eventSource
            };
        
        var requestOptions = {
            onSuccess : function() {
            	subscribedSMSEventSources[alias] = subscribedSMSEventSource;
                if (extendedOptions.onSuccess) {
                    extendedOptions.onSuccess();
                }
            },
            onFailure : extendedOptions.onFailure
        };

        requestOptions.requestHeaders = {};
        requestOptions.parameters = {};
        requestOptions.parameters.adapter = subscribedSMSEventSource.adapter;
        requestOptions.parameters.eventSource = subscribedSMSEventSource.eventSource;
        requestOptions.parameters.alias = alias;
        requestOptions.parameters.transport = "SMS";
    	requestOptions.parameters.phoneNumber = phoneNumber;
        requestOptions.parameters.subscribe = WLJSX.Object.toJSON(options);
        new WLJSX.Ajax.WLRequest("notifications", requestOptions);
    };

    this.unsubscribeSMS = function(alias, options) {

    	 if (!subscribedSMSEventSources[alias] || !subscribedSMSEventSources[alias].adapter) {
             WL.Logger.error("No subscribed push SMS event source for alias '" + alias + "'.");
             if (options.onSuccess) {
                 options.onSuccess();
             }
             return;
         }

        WL.Validators.validateArguments([ 'string', WL.Validators.validateObjectOrNull ], arguments, 'WL.Client.Push.unsubscribeSMS');
        WL.Validators.validateOptionsLoose({
            onSuccess : 'function',
            onFailure : 'function'
        }, options, "WL.Client.Push.unsubscribeSMS");
        
        var extendedOptions = WLJSX.Object.extend(WLJSX.Object.clone(defaultUnsubscribeSMSOptions), options);

        var subscribedSMSEventSource = subscribedSMSEventSources[alias];
        var requestOptions = {
            onSuccess : function() {
                subscribedSMSEventSources[alias] = {};
                if (extendedOptions.onSuccess) {
                    extendedOptions.onSuccess();
                }
            },
            onFailure : extendedOptions.onFailure
        };
        requestOptions.requestHeaders = {};
        requestOptions.parameters = {};
        requestOptions.parameters.alias = alias;
        requestOptions.parameters.adapter = subscribedSMSEventSource.adapter;
        requestOptions.parameters.eventSource = subscribedSMSEventSource.eventSource;
        requestOptions.parameters.unsubscribe = "";
        requestOptions.parameters.transport = "SMS";
        new WLJSX.Ajax.WLRequest("notifications", requestOptions);
    };
    
    this.__isDeviceSupportPush = function() {
    	return true;
    };
    
    /**
     * @return true if the environment supports SMS push.
     */
    this.isPushSMSSupported = function() {
        return WL.EnvProfile.isEnabled(WL.EPField.SUPPORT_PUSH_SMS);
    };
    
    /**
     * Check subscribe status of an SMS related event source.
     * 
     * @param alias
     *            {string} - alias of the event source.
     */
    this.isSMSSubscribed = function(alias) {
    	return (typeof subscribedSMSEventSources[alias] != "undefined" && typeof subscribedSMSEventSources[alias].eventSource != "undefined");
    };
    
    this.__onmessage = function(props, payload) {
        WL.Logger.debug("WL.Client.Push received notification for alias " + payload.alias);
        try {
            if (subscribedEventSources[payload.alias] && registeredEventSources[payload.alias]
                    && registeredEventSources[payload.alias].callback) {
                registeredEventSources[payload.alias].callback(props, payload);
            } else {
                // in case no lgoin user with this alias
                pendindPushEventsArray.push ({"alias" : payload.alias, "props": props, "payload": payload});
            }
        } catch (e) {
            WL.Logger.error("Failed invoking notification callback function: " + e.message);
        }
    };
    
    this.__hasPendings = function (){
        return pendindPushEventsArray && pendindPushEventsArray.length > 0;
    };
    
    this.__dispatchPendings = function () {
        //Dispatch the pendings push notifications
        for (eventsCounter in pendindPushEventsArray) {
            pendindPushEvent = pendindPushEventsArray[eventsCounter];
            if(subscribedEventSources[pendindPushEvent.alias]) {
                registeredEventSources[pendindPushEvent.alias].callback(pendindPushEvent.props, pendindPushEvent.payload);
                delete pendindPushEventsArray[eventsCounter];
            }
        }
    };
    
    this.__updateSubscribedEventSources = function(eventSources) {
        WL.Logger.debug("Updating notification subscriptions.");
        for (event in eventSources) {
            subscribedEventSources[eventSources[event].alias] = true;
        }
    };
    
     /**
     * Update the subscribed SMS event sources
     */
    this.__updateSubscribedSMSEventSources = function(eventSources) {
        WL.Logger.debug("Updating SMS notification subscriptions.");
        for (event in eventSources) {
            subscribedSMSEventSources[eventSources[event].alias] = {
                    "adapter" : eventSources[event].adapter,
                    "eventSource" : eventSources[event].eventSource
                };
        }
    };
    /**
     * Clear the subscribed event sources
     */
    this.__clearSubscribedEventSources = function(eventSources) {
        WL.Logger.debug("Clearing notification subscriptions.");
        subscribedEventSources = {};
    };
    
        
    /**
     * Clear the subscribed SMS event sources
     */
    this.__clearSubscribedSMSEventSources = function(eventSources) {
        WL.Logger.debug("Clearing SMS notification subscriptions.");
        subscribedSMSEventSources = {};
    };

    /**
     * Check subscribe status of an event source.
     * 
     * @param alias
     *            {string} - alias of the event source.
     */
    this.isSubscribed = function(alias) {
        return typeof subscribedEventSources[alias] != "undefined" && subscribedEventSources[alias];
    };

    /**
     * Called when ready to subcribe for events
     */
    this.onReadyToSubscribe = function() {
    };

    /**
     * @return true if the environment supports push.
     */
    this.isPushSupported = function() {
        return WL.EnvProfile.isEnabled(WL.EPField.SUPPORT_PUSH);
    };

    function isAbleToSubscribe(alias) {
        if (!isTokeUpdatedOnServer) {
            WL.Logger.error("Can't subscribe, notification token is not updated on the server");
            return false;
        }
        if (!registeredEventSources[alias]) {
            WL.Logger.error("No registered push event source for alias '" + alias + "'.");
            return false;
        }
        return true;
    }
    ;

    this.__updateTokenCallback = function(deviceToken) {
        if (serverToken != deviceToken) {
            WL.Logger.debug("Push notification device token has changed, updating server notification token id.");
            var requestOptions = {
                onSuccess : function() {
                    isTokeUpdatedOnServer = true;
                    WL.Utils.dispatchWLEvent("readytosubscribe");
                    WL.Client.Push.onReadyToSubscribe();
                    if (WL.Client.Push.__hasPendings()) {
                        WL.Client.Push.__dispatchPendings();
                    }
                },
                onFailure : function() {
                    isTokeUpdatedOnServer = false;
                    WL.Logger.error("Failed to update token on server");
                    return;
                }
            };
            requestOptions.requestHeaders = {};
            requestOptions.parameters = {};
            requestOptions.parameters.updateToken = deviceToken;
            new WLJSX.Ajax.WLRequest("notifications", requestOptions);
        } else {
            isTokeUpdatedOnServer = true;
            WL.Utils.dispatchWLEvent("readytosubscribe");
            WL.Client.Push.onReadyToSubscribe();
            if (WL.Client.Push.__hasPendings()) {
                WL.Client.Push.__dispatchPendings();
            }
            cordova.exec("Push.dispatch", 'WL.Client.Push.__onmessage');
        }
    };

    this.__updateTokenCallbackError = function() {
        WL.Logger.error("Error while trying to retrieve device token from the mobile operating system.");
    };
};

__WLBadge = function() {
    this.setNumber = function(number) {
        WL.Validators.validateArguments([ 'number' ], arguments, 'WL.Badge.setNumber');

        cordova.exec("Badge.setNumber", number);
    };
};

__WL.prototype.Badge = new __WLBadge();
WL.Badge = new __WLBadge();

__WLClient.prototype.Push = new __WLPush();
WL.Client.Push = new __WLPush();

/**
 * Native pages API for the iOS environment.
 */
__WLNativePage = function() {

    var __nativePageCallback = null;

    /**
     * Causes the entire application screen visible to the user, to be switched
     * by a native display.
     * 
     * @param className
     *            {string} - the name of the native class. (for example,
     *            "BarCodeController").
     * @param callback
     *            {function} - a function object that will be called when the
     *            native page switches back to the WebView. This function will
     *            be passed a single object (JSON) parameter when invoked.
     * @param data
     *            {object} - a JSON object that will be sent to the native
     *            class. The data must be single dimensioned (all values must be
     *            of type 'string')
     */
    this.show = function(className, callback, data) {
        if (arguments.length <= 2) {
            WL.Validators.validateArguments([ 'string', 'function' ], arguments, 'WL.NativePage.show');
        } else {
            WL.Validators.validateArguments([ 'string', 'function', 'object' ], arguments, 'WL.NativePage.show');
            WL.Validators.validateAllOptionTypes([ 'string', 'number', WL.Validators.validateStringOrNull, 'boolean' ], data,
                    'WL.NativePage.show');
        }

        // prevent calling the show twice until it the call back done
        if (__nativePageCallback === null) {
            __nativePageCallback = callback;
            cordova.exec("NativePage.show", className, data);
        } else {
            throw new Error("A native page is already loaded. Cannot call another native page.");
        }

    };

    /**
     * Internal use, should never be called directly - called from the Native
     * Objective-C code.
     * 
     * @param data
     *            JSON object with data sent form the Native Page
     * @return
     */
    this.onNativePageClose = function(data) {
        var callback = __nativePageCallback;

        // allow the callback function to invoke WL.NativePage.show()
        __nativePageCallback = null;

        callback(data);
    };

};

__WL.prototype.NativePage = new __WLNativePage;
WL.NativePage = new __WLNativePage;

/**
 * Native TabBarItem API for the iOS Environment. This object should not be
 * created manually; rather, it is used by WL.TabBar.addItem
 */
WL.TabBarItem = WLJSX.Class.create({
    __id : null,

    initialize : function(id) {
        this.__id = id;
    },

    /**
     * Manually set this tab bar item as enabled or disabled. The
     * enabled/disabled state of this item remains unaffected through calls to
     * setEnabled.
     * 
     * @brief manually set this item as enabled or disabled
     * @param {boolean}
     *            enabled a boolean value determines the enabled state of the
     *            named tab item
     * @see setEnabled
     */
    setEnabled : function(isEnabled) {
        WL.Validators.validateArguments([ 'boolean' ], arguments, 'WL.TabBarItem.setEnabled');
        cordova.exec("UIControls.enableTabBarItem", this.__id, isEnabled);
    },

    /**
     * Update this item to change its badge value.
     * 
     * @param {string}
     *            badge value to display in the optional circular badge on the
     *            item; if null or unspecified, the badge will be hidden
     */
    updateBadge : function(badge) {
        WL.Validators.validateArguments([ WL.Validators.validateStringOrNull ], arguments, 'WL.TabBarItem.updateBadge');

        if (!badge) {
            options = {};
        } else {
            options = {
                badge : badge
            };
        }

        cordova.exec("UIControls.updateTabBarItem", this.__id, options);
    }

});
/**
 * Native TabBar API for the iOS Environment.
 */
__WLTabBar = function() {
    var isInit = false;
    var items = new Array();
    var tabBarTag = 0;
    var tabBarCallbacks = {};

    function isInitialized() {
        return isInit;
    }

    /**
     * Initializes the TabBar. Must be called before using any other TabBar
     * function.
     */
    this.init = function(options) {
        if (!WL.EnvProfile.isEnabled(WL.EPField.ISIOS)) {
            WL.Logger.debug("iOS TabBar has no impact when not run on an iOS device.");
            return;
        }

        WL.Validators.validateOptions({}, options, "WL.TabBar.init");
        cordova.exec("UIControls.createTabBar");
        isInit = true;
    };

    /**
     * Creates a new tab bar item and adds it to the tab bar. If the supplied
     * image name is one of the labels listed below, then this method will
     * construct a tab button using the standard system buttons. Note that if
     * you use one of the system images, that the \c title you supply will be
     * ignored.
     * 
     * <b>Tab Buttons</b> - tabButton:More - tabButton:Favorites -
     * tabButton:Featured - tabButton:TopRated - tabButton:Recents -
     * tabButton:Contacts - tabButton:History - tabButton:Bookmarks -
     * tabButton:Search - tabButton:Downloads - tabButton:MostRecent -
     * tabButton:MostViewed
     * 
     * @param {String}
     *            id internal name to refer to this tab by
     * @param {function}
     *            callback function object representing a function with no
     *            arguments that would be invoked when the tab item is touched
     * @param {String}
     *            [title] title text to show on the tab, or null if no text
     *            should be shown
     * @param {Object}
     *            [options] Options for customizing the individual tab item - \c
     *            image filename or internal identifier to show, or null if now
     *            image should be shown - \c badge value to display in the
     *            optional circular badge on the item; if null or unspecified,
     *            the badge will be hidden
     * 
     * @return a WL.TabBar object
     */
    this.addItem = function(id, callback, title, options) {
        if (!isInitialized()) {
            return;
        }

        WL.Validators.validateArguments([ 'string', 'function', 'string', 'object' ], arguments, 'WL.TabBar.createItem');
        WL.Validators.validateOptions({
            image : 'string',
            // not relevant for iOS, but here for compatability
            selectedStateImage : 'string',
            badge : 'string'
        }, options, "WL.TabBar.createItem");

        // do not allow two items with the same id
        itemsLength = items.length;
        for ( var i = 0; i < itemsLength; i++) {
            WL.Logger.debug("items[i] " + items[i] + " == id " + id + " " + (items[i] == id));
            if (items[i] == id) {
                throw new Error("A Tab Bar item with id '" + id + "' Already exists.");
            }
        }

        items.push(id);

        var tag = tabBarTag;
        tabBarTag++;
        tabBarCallbacks[tag] = callback;

        cordova.exec("UIControls.createTabBarItem", id, title, options.image, tag, options);

        // The native code needs the full list of items to show
        var parameters = [ "UIControls.showTabBarItems" ];
        for ( var i = 0; i < items.length; i++) {
            parameters.push(items[i]);
        }
        cordova.exec.apply(this, parameters);

        var item = new WL.TabBarItem(id);
        return item;
    };

    /**
     * Removes all the previously added items from the TabBar. The effect is
     * immediate.
     */
    this.removeAllItems = function() {
        if (!isInitialized()) {
            return;
        }

        items.length = 0;
        cordova.exec("UIControls.showTabBarItems");
    };

    /**
     * iOS only - Sets the visibility state of the tab bar. The tab bar has to
     * be created first.
     * 
     * @param isVisible{boolean} -
     *            if true, sets the tab bar visible. if false, hides the tab
     *            bar.
     * @param {Object}
     *            [options] Options indicating how the tab bar should be shown: -
     *            height integer indicating the height of the tab bar (default
     *            height: 49) - position specifies whether the tab bar will be
     *            placed at the top or bottom of the screen (default position:
     *            bottom)
     */

    this.setVisible = function(isVisible, options) {
        if (!isInitialized()) {
            return;
        }
        WL.Validators.validateArguments([ 'boolean', WL.Validators.validateObjectOrNull ], arguments, 'WL.TabBar.setVisible');

        if (!options) {
            options = {};
        }

        if (isVisible) {
            cordova.exec("UIControls.showTabBar", options);
        } else {
            cordova.exec("UIControls.hideTabBar");
        }
    };

    /**
     * Manually select an individual tab bar item, or nil for deselecting a
     * currently selected tab bar item.
     * 
     * @param {String}
     *            id the name of the tab to select, or null if all tabs should
     *            be deselected
     * @see createItem
     * @see bindItems
     */
    this.setSelectedItem = function(id) {
        if (!isInitialized()) {
            return;
        }

        WL.Validators.validateArguments([ WL.Validators.validateStringOrNull ], arguments, 'WL.TabBar.setSelectedItem');

        cordova.exec("UIControls.selectTabBarItem", id);
    };

    /**
     * Manually enable or disable the whole tab bar. The individual
     * enable/disable state of each tab bar item remains unaffected
     * 
     * @brief manually set the tab bar as enabled or disabled
     * @param {boolean}
     *            isEnabled - boolean value determines the enabled state of the
     *            named tab item
     * @see setEnabledItem
     */
    this.setEnabled = function(isEnabled) {
        if (!isInitialized()) {
            return;
        }

        WL.Validators.validateArguments([ 'boolean' ], arguments, 'WL.TabBar.setEnabled');

        cordova.exec("UIControls.enableTabBar", isEnabled);
    };

    /**
     * Function called when a tab bar item has been selected.
     * 
     * @param {Number}
     *            tag the tag number for the item that has been selected
     */
    this.__tabBarItemSelected = function(tag) {
        if (typeof (tabBarCallbacks[tag]) == 'function') {
            tabBarCallbacks[tag]();
        }
    };

};

__WL.prototype.TabBar = new __WLTabBar;
WL.TabBar = new __WLTabBar;

function formatString(text) {
    var args = Array.prototype.slice.call(arguments, 1);
    return text.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : '{' + number + '}';
    });
};

// *********************
// ** WL.Logger **
// *********************
function __WLLogger() {
	var enableLogger = true;

    this.__init = function(enabled) {
		if (typeof(enabled) !== 'undefined'){
			enableLogger = enabled;
		}
    };

    this.debug = function(msg) {
        if (enableLogger && typeof (window.console) != 'undefined') {
            window.console.log(msg);
        }
    };

    this.error = function(msg) {
        if (enableLogger && typeof (window.console) != 'undefined') {
            window.console.error(msg);
        }
    };
};

WL.Logger = new __WLLogger;

// *************************
// ** WL.TerminatorDialog **
// *************************
__WLTerminatorDialog = WLJSX.Class.create({
    show : function(title, msg, buttonLabel) {
        cordova.exec("WLNotification.alertAndTerminate", msg, title, buttonLabel);
    }
});

__WL.TerminatorDialog = new __WLTerminatorDialog;

WL.App.close = function() {
    cordova.exec("WLApp.quitApplication");
};

/**
 * Update the web resources from the WrokLight server. This feature is currently
 * applicable only for Android and iOS platforms
 * 
 * @param shouldUpdateSilently -
 *            if true, we should hide the progress dialog when downloading the
 *            web resources default: false
 */
WL.App.__update = function(shouldUpdateSilently) {
    shouldUpdateSilently = ((typeof shouldUpdateSilently !== 'undefined') && shouldUpdateSilently);
    cordova.exec(null, null, "WebResourcesDownloader", "update", [ shouldUpdateSilently, WL.Client.__globalHeaders["WL-Instance-Id"] ]);
};

WL.App._showDirectUpdateErrorMessage = function(message) {
    var args = Array.prototype.slice.call(arguments);
    var formattedMessage = window.formatString.apply(null, args);
    WL.SimpleDialog.show(WL.ClientMessages.directUpdateErrorTitle, formattedMessage, [ {
        text : WL.ClientMessages.reload,
        handler : WL.App.__update
    }, {
        text : WL.ClientMessages.exit,
        handler : WL.App.close
    } ]);
};

WL.Device.getNetworkInfo = function(callback) {
    WL.Validators.validateArguments([ 'function' ], arguments, 'WL.Device.getNetworkInfo');
    return cordova.exec(callback, callback, "NetworkDetector", "getNetworkInfo", []);
};

WL.App.copyToClipboard = function(text) {
    WL.Validators.validateArguments([ 'string' ], arguments, 'WL.App.copyToClipboard');
    cordova.exec("WLApp.copyToClipboard", text);
};

WL.App.readUserPref = function(key, successCallback, failCallback) {
    return cordova.exec(successCallback, failCallback, "WLApp", "readUserPref", [ key ]);
};

WL.App.writeUserPref = function(key, value) {
    cordova.exec("WLApp.writeUserPref", {
        'key' : key,
        'value' : value
    });
};

WL.App.downloadInnerAppResoures = function(skinName) {
    cordova.exec(null, null, "WebResourcesDownloader", "downloadInnerAppResoures", [ skinName, WL.Client.getEnvironment(), WL.Client.__globalHeaders["WL-Instance-Id"] ]);
};

// ////////////
// Background//
// ////////////
// Handles background/foreground events to prevent iOS from taking screenshots
// of the UI

WL.App.BackgroundHandler = {};

// API methods
// API method allows developer to set the callback to invoke on background event
// Additionally, automatically assigns the appropriate callback to invoke on
// foreground event
WL.App.BackgroundHandler.setOnAppEnteringBackground = function(callback) {

    // Available only in iOS
    if (WL.Client.getEnvironment() != WL.Environment.IPHONE && WL.Client.getEnvironment() != WL.Environment.IPAD) {
        WL.Logger
                .error("WL.App.BackgroundHandler.setOnAppEnteringBackground is available only in iOS environments. Please use this function only in the iOS optimization javascript file.");
        return;
    }

    // Accepts only functions
    if (typeof callback != 'function') {
        WL.Logger
                .error("WL.App.BackgroundHandler.setOnAppEnteringBackground accepts only functions. Please pass an API function or a custom callback function.");
        return;
    }

    // Set Bacground callback
    WL.App.BackgroundHandler.onAppEnteringBackground = callback;
    // Set relative Foreground callback
    if (callback === WL.App.BackgroundHandler.defaultIOSBehavior) {
        WL.App.BackgroundHandler.setOnAppEnteringForeground(WL.App.BackgroundHandler.defaultIOSBehaviorToForeground);
    } else if (callback === WL.App.BackgroundHandler.hideView) {
        WL.App.BackgroundHandler.setOnAppEnteringForeground(WL.App.BackgroundHandler.hideViewToForeground);
    } else if (callback === WL.App.BackgroundHandler.hideElements) {
        WL.App.BackgroundHandler.setOnAppEnteringForeground(WL.App.BackgroundHandler.hideElementsToForeground);
    }
    // Callback invocations are implemented in the native appdelegate .m file
};

// API method lets developer set the callback to invoke when the app is moving
// to foreground
WL.App.BackgroundHandler.setOnAppEnteringForeground = function(callback) {

    // Available only in iOS
    if (WL.Client.getEnvironment() != WL.Environment.IPHONE && WL.Client.getEnvironment() != WL.Environment.IPAD) {
        WL.Logger
                .error("WL.App.BackgroundHandler.setOnAppEnteringForeground is available only in iOS environments. Please use this function only within the iphone and ipad environments.");
        return;
    }

    // Accepts only functions
    if (typeof callback != 'function') {
        WL.Logger
                .error("WL.App.BackgroundHandler.setOnAppEnteringForeground accepts only functions. Please pass an API function or a custom callback function.");
        return;
    }

    WL.App.BackgroundHandler.onAppEnteringForeground = callback;
};

// Event Callbacks
// Background Callback - invoked by the native appdelegate code when entering
// background
WL.App.BackgroundHandler.onAppEnteringBackground = function() {
};

// Foreground Callback - invoked by the native appdelegate code when entering
// foreground
WL.App.BackgroundHandler.onAppEnteringForeground = function() {
};

// API Options
// iOS default - do nothing
WL.App.BackgroundHandler.defaultIOSBehavior = function() {
};

// iOS default - do nothing
WL.App.BackgroundHandler.defaultIOSBehaviorToForeground = function() {
};

// Hide view - implemented in Native code
WL.App.BackgroundHandler.hideView = function() {
    return "hideView";
};

// Show view - implemented in Native code
WL.App.BackgroundHandler.hideViewToForeground = function() {
    return "hideViewToForeground";
};

// Hide members of class "WLHideOnEnteringBackground"
WL.App.BackgroundHandler.hideElements = function() {
    var elements = WLJSX.$$('.WLHideOnEnteringBackground');
    for ( var i = 0; i < elements.length; i++) {
        WL.App.BackgroundHandler.hideElement(elements[i]);
    }
};

WL.App.BackgroundHandler.hideElement = function(element) {
    WLJSX.addClass(element, 'WLHideOnEnteringBackgroundHidden');
};

// Show members of class "WLHideOnEnteringBackground"
WL.App.BackgroundHandler.hideElementsToForeground = function() {
    var elements = WLJSX.$$('.WLHideOnEnteringBackground');
    for ( var i = 0; i < elements.length; i++) {
        WL.App.BackgroundHandler.showElement(elements[i]);
    }
};

WL.App.BackgroundHandler.showElement = function(element) {
    WLJSX.removeClass(element, 'WLHideOnEnteringBackgroundHidden');
};

WL.Utils.checkForInnerAppUpdate = function() {
    cordova.exec("WebResourcesDownloader.checkForInnerAppUpdate");
};

function setWLUrl(serverURL) {
    WL.StaticAppProps.APP_SERVICES_URL = serverURL + WL.StaticAppProps.POSTFIX_APP_SERVICES_URL;
    WL.StaticAppProps.WORKLIGHT_ROOT_URL = serverURL + WL.StaticAppProps.POSTFIX_WORKLIGHT_ROOT_URL;
    WL.StaticAppProps.WORKLIGHT_BASE_URL = serverURL;
};

WL.App.__setWLServerAddress = function(callback) {
    cordova.exec(function(settings) {
        var isUsedCustomURL = eval(settings.useCustomURL);
        if (settings.serverURL && isUsedCustomURL
                && WL.StaticAppProps.APP_SERVICES_URL != settings.serverURL + WL.StaticAppProps.POSTFIX_APP_SERVICES_URL) {
            setWLUrl(settings.serverURL);
        } else {
            setWLUrl(settings.WLDefaultServerURL);
        }
        if (callback && typeof callback == "function") {
            callback();
        }
    }, function() {
    }, "WLApp", "getAppSetting", []);
};

WL.Client.__onSettingsChanged = function(settings) {
    var isServerURLChanged = WL.StaticAppProps.APP_SERVICES_URL != settings.serverURL + WL.StaticAppProps.POSTFIX_APP_SERVICES_URL;
    var isCurrentURLChangedFromDefault = WL.StaticAppProps.APP_SERVICES_URL != settings.WLDefaultServerURL
            + WL.StaticAppProps.POSTFIX_APP_SERVICES_URL;
    var isUsedCustomURL = eval(settings.useCustomURL);
    // Reload app just if current URL is diffrenet from custom or diffrenet from
    // default
    if (isServerURLChanged && isUsedCustomURL || isCurrentURLChangedFromDefault || !isUsedCustomURL) {
        WL.Client.reloadApp();
    }
};

/**
 * Hash string on native and return it as callback
 * 
 * @param data
 * @param callback
 */
WL.App.__hashData = function(data, someArgs, callback) {
    cordova.exec(callback, function() {
        WL.Logger.error("Problem to get hash from WL.App.__hashData for value" + data.hashResult);
    }, "SecurityPlugin", "hashData", [ data, someArgs ]);

};

/**
 * Call the provisioning process to start
 * 
 * @param data
 * @param successCallback
 * @param failureCallback
 */
WL.App.__deviceAuth = function(data, successCallback, failureCallback) {
    cordova.exec(function(data) {
        successCallback(data);
    }, function() {
        failureCallback(data);
    }, "WLApp", "deviceAuth", [ data ]);
};

WL.App.getInitParameters = function(parameters, successCallback, failCallback) {
    return cordova.exec(successCallback, failCallback, "WLApp", "getInitParameters", [ parameters ]);
};