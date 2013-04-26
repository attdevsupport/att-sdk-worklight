
/* JavaScript content from wlclient/js/wlgap.android.js in android Common Resources */
/*
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/* Copyright (C) Worklight Ltd. 2006-2012.  All rights reserved. */
/**
 * Native pages API for the android environment.
 */

// Overriding cordova's stringify because its errornous.
cordova.stringify = WLJSX.Object.toJSON;
window.isReloading = false;

document.addEventListener('resume', function() {
    dispatchForgroundEvent();
});

function dispatchForgroundEvent() {
    if (!window.isReloading) {
        var e = document.createEvent('Events');
        e.initEvent('foreground', false, false);
        document.dispatchEvent(e);
    }
};

// Overrides the default openURL method.
WL.App.openURL = function(url, target, options) {
    cordova.exec(null, null, "Utils", "openURL", [ url ]);
};

WL.Client.reloadApp = function() {
    window.isReloading = true;
    cordova.exec(null, null, 'Utils', 'reloadApp', []);
};

WL.App.getScreenHeight = function(){
	return WL.Client.__getScreenHeight();
};

WL.App.getScreenWidth = function(){
	return WL.Client.__getScreenWidth();
};

WL.App.getScreenSize = function(callback) {
    cordova.exec(callback, callback, "Utils", "getScreenSize", []);
};

//Takes: key, options OR key, successCallback, failCallback
WL.App.readUserPref = function(key, options) {

    if (typeof options === "object" &&
        typeof options.onSuccess === "function" &&
        typeof options.onFailure === "function") {

        cordova.exec(options.onSuccess,
           options.onFailure, "Utils", "readPref", [ key ]);
        
        return;
    }

    var successCallback = (typeof options === 'function') ? options : function () {},
    	failCallback = arguments[2] || function() {};
    cordova.exec(successCallback, failCallback, "Utils", "readPref", [ key ]);
};

WL.App.writeUserPref = function(key, value) {
    cordova.exec(null, null, "Utils", "writePref", [ key, value ]);
};

WL.App.getInitParameters = function(parameters, successCallback, failCallback) {
    return cordova.exec(successCallback, failCallback, "Utils", "getInitParameters", [ parameters ]);
};


/**
 * Update the web resources from the Worklight server. This feature is currently
 * applicable only for Android and iOS platforms
 * 
 * @param shouldUpdateSilently -
 *            if true, we should hide the progress dialog when downloading the
 *            web resources default: false
 */
WL.App.__update = function(shouldUpdateSilently) {
    shouldUpdateSilently = ((typeof shouldUpdateSilently !== 'undefined') && shouldUpdateSilently);
    cordova.exec(null, null, "WebResourcesDownloader", "updateApp", [WL.Client.__globalHeaders["WL-Instance-Id"], shouldUpdateSilently ]);
};

WL.App._showDirectUpdateErrorMessage = function(message) {
    WL.SimpleDialog.show(WL.ClientMessages.directUpdateErrorTitle, message, [ {
        text : WL.ClientMessages.reload,
        handler : WL.App.__update
    }, {
        text : WL.ClientMessages.exit,
        handler : WL.App.close
    } ]);
};

function setWLUrl(serverURL) {
    WL.StaticAppProps.APP_SERVICES_URL = serverURL + WL.StaticAppProps.POSTFIX_APP_SERVICES_URL;
    WL.StaticAppProps.WORKLIGHT_ROOT_URL = serverURL + WL.StaticAppProps.POSTFIX_WORKLIGHT_ROOT_URL;
    WL.StaticAppProps.WORKLIGHT_BASE_URL = serverURL;
};

WL.App.__setWLServerAddress = function(callback) {
	cordova.exec(defaultServerQueryCallBack, defaultServerQueryCallBack, "Utils", "readPref", [ "WLDefaultServerURL" ]);

	function defaultServerQueryCallBack(result) {
    	var defaultServerURL = result;
    	cordova.exec(function(result){
    		var serverURL = result;
    		if (serverURL && WL.StaticAppProps.APP_SERVICES_URL != serverURL + WL.StaticAppProps.POSTFIX_APP_SERVICES_URL) {
    	        setWLUrl(serverURL);
    	    } else {
    	        setWLUrl(defaultServerURL);
    	    }
    	    callback();
    	}, null, "Utils", "readPref", [ "WLServerURL" ]);
	
	};
};

__WLNativePage = function() {

    var __nativePageCallback = null;

    /**
     * Causes the entire application screen visible to the user, to be switched
     * by a native display.
     * 
     * @param className
     *            {string} - the name of the native class.
     * @param callback
     *            {function} - a function object that will be called when the
     *            native page switches back to the WebView. This function will
     *            be passed a single object (JSON) parameter when invoked.
     * @param data
     *            (optional) {object} - a JSON object that will be sent to the
     *            native class. The data must be single dimensioned
     */
    this.show = function(className, callback, data) {
        if (arguments.length <= 2) {
            WL.Validators.validateMinimumArguments(arguments, 2, "WL.NativePage.show");
            WL.Validators.validateArguments([ 'string', 'function' ], arguments, 'WL.NativePage.show');
        } else {
            WL.Validators.validateArguments([ 'string', 'function', 'object' ], arguments, 'WL.NativePage.show');
            WL.Validators.validateAllOptionTypes([ 'string', 'number', WL.Validators.validateStringOrNull, 'boolean' ], data,
                    'WL.NativePage.show');
        }

        // prevent calling the show twice until it the call back done
        if (__nativePageCallback === null) {
            __nativePageCallback = callback;
            cordova.exec(null, null, "NativePage", "show", [ this._getCookiesForNative(), className, data ]);
        } else {
            throw new Error("A native page is already loaded. Cannot call another native page.");
        }
    };

    /**
     * Internal use, should never be called directly - called from the native
     * android activity java code.
     * 
     * @param data
     *            JSON object with data sent form the main native android
     *            activity
     * @return
     */
    this.onNativePageClose = function(data) {
        var callback = __nativePageCallback;

        // allow calling show function again
        __nativePageCallback = null;
        callback(data);
    };

    /**
     * Internal use. create a text representation of the session cookies, for
     * use of native Android code when sending requests for the worklight server
     */
    this._getCookiesForNative = function() {
        var cookies = JSON.stringify(WL.CookieManager.createCookieHeaders().Cookie);
        return (typeof cookies != "undefined") ? cookies.substring(1, cookies.length - 2) : "";
    };
};

__WL.prototype.NativePage = new __WLNativePage;
WL.NativePage = new __WLNativePage;

__WLTabBarItem = function() {
    this.__id = null;

    /**
     * Manually set this tab bar item as enabled or disabled. The
     * enabled/disabled state of this item remains unaffected through calls to
     * WLTabBar.setEnabled.
     * 
     * @brief manually set this item as enabled or disabled
     * @param {boolean}
     *            enabled a boolean value determines the enabled state of the
     *            named tab item
     */
    this.setEnabled = function(enable) {
        WL.Validators.validateArguments([ 'boolean' ], arguments, 'WL.TabBarItem.setEnabled');
        var tabElement = WLJSX.$(this.__id);
        var isItemHasEnableAtt = (WLJSX.attr(tabElement, 'enable') === 'enabled');
        WLJSX.attr(tabElement, 'enable', enable ? 'enabled' : 'disabled');
        if (enable === isItemHasEnableAtt || !WL.TabBar.isTabBarEnabled()) {
            return;
        }
        if (enable) {
            WLJSX.removeClass(tabElement, 'tabDisabled');
            WL.TabBar.__addEvents(this.__id);
        } else {
            WLJSX.addClass(tabElement, 'tabDisabled');
            WL.TabBar.__removeEvents(this.__id);
        }
    };
};
/**
 * Native TabBar API for the Android Environment.
 */
__WLTabBar = function() {
    var isInit = false;
    var items = {};
    var itemLength = 0;
    var tabBar = null;
    var activeTab = null;
    var callbackMap = new Object();
    var parentDivId = null;
    var isEnabled = false;

    /**
     * Return true if the TabBar is initialized
     */
    function isInitialized() {
        return isInit;
    }
    ;

    this.isTabBarEnabled = function() {
        return isEnabled;
    };

    /**
     * Initializes the TabBar. Must be called before using any other TabBar
     * function. If you use setParentDivId, call setParentDivId before init.
     */
    this.init = function() {
        if (isInitialized()) {
            this.removeAllItems();
            this.setEnabled(true);
            return;
        }
        tabBar = WLJSX.newElement('<ul/>', {
            'class' : 'tabBar',
            'id' : 'wlTabBar'
        });
        var parentElement = (parentDivId != null) ? WLJSX.$(parentDivId) : WLJSX.$("content");
        WLJSX.css(parentElement, {
            'padding' : 0,
            'margin' : 0
        });
        WLJSX.prepend(parentElement, tabBar);
        // resize event cause error in FF preview
        if (WL.Client.getEnvironment() != WL.Environment.PREVIEW) {
            window.addEventListener("resize", function() {
                adjustTabsWidth();
            }.bind(this));
        }
        isInit = true;
        isEnabled = true;
    };

    /**
     * In case you need the tab bar will be added to other div out of content,
     * Call this function before init() with the parentDivId
     * 
     * @param divId -
     *            the parentDivID
     */
    this.setParentDivId = function(divId) {
        WL.Validators.validateArguments([ 'string' ], arguments, 'WL.TabBar.setParentDivId');
        parentDivId = divId;
    };

    /**
     * Creates a new tab bar item and adds it to the tab bar.
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
     *            [options] Options for customizing the individual tab item
     *            imgSrc - imgSrc for normal tab imgSrcSelected - imgSrc for
     *            selected tab
     * 
     * @return a WL.TabBar object
     */
    this.addItem = function(id, callback, title, options) {
        if (!isInitialized()) {
            return;
        }

        WL.Validators.validateArguments([ 'string', 'function', 'string', 'object' ], arguments, 'WL.TabBar.addItem');
        WL.Validators.validateOptions({
            image : 'string',
            imageSelected : 'string'
        }, options, "WL.TabBar.addItem");

        // do not allow two items with the same id
        if (typeof items[id] !== 'undefined') {
            throw new Error("A Tab Bar item with id '" + id + "' Already exists.");
        }

        // prepare the tab element
        var newTab = WLJSX.newElement('<li/>', {
            'id' : id,
            'class' : 'tabItem'
        });
        var imgSrc = (options.image != undefined) ? options.image : null;
        var imgSrcSelected = (options.imageSelected != undefined) ? options.imageSelected : null;
        var tabSpan = WLJSX.newElement('<span/>', {
            'style' : 'background-image : url(' + imgSrc + ')',
            'class' : 'tabSpan'
        });
        WLJSX.html(tabSpan, title);
        WLJSX.append(newTab, tabSpan);
        WLJSX.attr(newTab, "imgSrc", imgSrc);
        WLJSX.attr(newTab, "imgSrcSelected", imgSrcSelected);

        // add the tab into the tabBar
        WLJSX.append(tabBar, newTab);

        callbackMap[id] = callback;

        items[id] = WLJSX.$(id);
        itemLength++;
        if (itemLength == 1) {
            WL.TabBar.setSelectedItem(id);
        }

        // adjust the tabs width
        adjustTabsWidth();
        var item = new __WLTabBarItem;
        item.__id = id;

        item.setEnabled(true);
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
        for (tabItemId in items) {
            WLJSX.remove(items[tabItemId]);
        }
        items = {};
        itemLength = 0;
    };

    /**
     * Android only - Sets the visibility state of the tab bar. The tab bar has
     * to be created first.
     * 
     * @param isVisible{boolean} -
     *            if true, sets the tab bar visible. if false, hides the tab
     *            bar.
     */
    this.setVisible = function(isVisible) {
        if (!isInitialized()) {
            return;
        }
        WL.Validators.validateArguments([ 'boolean' ], arguments, 'WL.TabBar.setVisible');
        if (tabBar !== null) {
            if (isVisible) {
                WLJSX.show(tabBar);
            } else {
                WLJSX.hide(tabBar);
            }
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
        if (id === null && activeTab !== null) {
            // Deselect selected tab
            WLJSX.removeClass(activeTab, 'tabItemActive');
            // Set back its deselected-image 
            WLJSX.css(WLJSX.find(activeTab, "*")[0], {
                'background-image' : 'url(' + WLJSX.attr(activeTab, 'imgSrc') + ')'
            });
        } else {
            WL.Validators.validateArguments([ 'string' ], arguments, 'WL.TabBarItem.setSelectedItem');
            var item = items[id];
            if (typeof item != 'undefined') {
                WLJSX.addClass(item, 'tabItemActive');

                WLJSX.css(WLJSX.find(item, "*")[0], {
                    'background-image' : 'url(' + WLJSX.attr(item, "imgSrcSelected") + ')'
                });

                if (activeTab !== null && activeTab.id != items[id].id) {
                    WLJSX.removeClass(activeTab, 'tabItemActive');
                    WLJSX.css(WLJSX.find(activeTab, "*")[0], {
                        'background-image' : 'url(' + WLJSX.attr(activeTab, 'imgSrc') + ')'
                    });
                }

                activeTab = items[id];
            } else {
                WL.Logger.error("There is no tab bar item with id '" + id + "'.");
            }
        }
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
    this.setEnabled = function(enable) {
        WL.Validators.validateArguments([ 'boolean' ], arguments, 'WL.TabBar.setEnabled');

        if (isEnabled == enable) {
            return;
        }
        if (!isInitialized()) {
            return;
        }

        for (tabItemId in items) {
            var tabElement = items[tabItemId];
            var isItemHasEnableAtt = (WLJSX.attr(items[tabItemId], 'enable') === 'enabled');
            if (!isItemHasEnableAtt) {
                continue;
            }
            if (enable) {
                WLJSX.removeClass(tabElement, 'tabDisabled');
                this.__addEvents(items[tabItemId].id);
                if (activeTab.id == items[tabItemId].id) {
                    WLJSX.addClass(tabElement, 'tabItemActive');
                }
            } else {
                this.__removeEvents(items[tabItemId].id);
                WLJSX.addClass(tabElement, 'tabDisabled');
                if (activeTab.id == items[tabItemId].id) {
                    WLJSX.removeClass(tabElement, 'tabItemActive');
                }
            }
        }
        isEnabled = enable;
    };

    this.__removeEvents = function(id) {
        WLJSX.unbind(items[id], 'click');
        WLJSX.unbind(items[id], 'touchstart');
        WLJSX.unbind(items[id], 'touchend');
    };

    this.__addEvents = function(id) {
        addClickEvent(id, callbackMap[id]);
        addTouchEvent(id);
    };

    var adjustTabsWidth = function() {
        if (!isInitialized() || itemLength == 0) {
            return;
        }

        // var availableWidth = tabBar.offsetWidth;
        var availableWidth = WLJSX.width('#content');
        var itemWidth = Math.ceil(availableWidth / itemLength);
        var i = 0;
        for (tabItem in items) {
            i++;
            if (i == itemLength) {
                // On last item use leftover space
                itemWidth = availableWidth - (itemWidth * (itemLength - 1));
            }
            WLJSX.css(items[tabItem], {
                'width' : '' + itemWidth + 'px'
            });
        }
        // Workaround: Bug 3389 - [Android] If content div is shown after auth
        // div, a space is added to the
        // tabs causing a shift down and right
        var wlTabBarElement = WLJSX.$('wlTabBar');
        WLJSX.css(wlTabBarElement, {
            'left' : '1px',
            'top' : '1px'
        });
        setTimeout(function() {
            var wlTabBarElement = WLJSX.$('wlTabBar');
            WLJSX.css(wlTabBarElement, {
                'left' : '0px',
                'top' : '0px'
            });
        }, 1);
    };

    var addClickEvent = function(id, callback) {
        var element = WLJSX.$(id);
        WLJSX.bind(element, 'click', function() {
            WL.TabBar.setSelectedItem(id);
            callback();
        });
    };

    var addTouchEvent = function(id) {
        var element = WLJSX.$(id);
        WLJSX.bind(element, 'touchstart', function() {
            if (WLJSX.attr(items[id], 'enable') !== "enabled") {
                return;
            }
            WLJSX.addClass(items[id], 'tabTouch');
            if (activeTab.id == id) {
                WLJSX.addClass(tabBar, 'tabBarTouch');
            }
        });

        WLJSX.bind(element, 'touchend', function() {
            WLJSX.removeClass(items[id], 'tabTouch');
            if (activeTab.id == id) {
                WLJSX.removeClass(tabBar, 'tabBarTouch');
            }
        });
    };
};

__WL.prototype.TabBar = new __WLTabBar;
WL.TabBar = new __WLTabBar;

/**
 * Native OptionsMenu API for the Android Environment.
 */
__WLOptionsMenu = function() {
    var callbacks = null;
    var SETTING_OPTIONS_MENU_ITEM = "wlSettings";
    var isSettingsEnable = true;

    function isInitialized() {
        // handle preview
        if (typeof NativeOptionsMenu === "undefined" || !NativeOptionsMenu.isInit()) {
            WL.Logger.error("WL.OptionsMenu.init() must be called first.");
            return false;
        }
        return true;
    }

    this.__onItemClicked = function(id) {
        (callbacks[id])();
    };

    /**
     * Initializes the Android toolbar, enabling it, and making it visible. Must
     * be called before using it.
     * 
     * @param id -
     *            number, currently not used.
     */
    this.init = function() {
        callbacks = [];
        isSettingsEnable = WL.Client.isSettingsEnabled();
        NativeOptionsMenu.init();
        this.__addWLSettingItem();
    };

    /**
     * Adds an item to the Android Options Menu. Can be called only after
     * initializing the menu. Items are ordered on the menu according to the
     * order in which they were added. If you add a item with an existing ID,
     * the new item replaces the existing one.
     * 
     * @param id
     *            Mandatory string. Identifies the item.
     * 
     * @param callback
     *            Mandatory JavaScript function. The callback function that
     *            should be invoked when the user touches the item.
     * 
     * @param title
     *            Mandatory string. The title of the item.
     * 
     * @param options -
     *            Hash options object. Available options: image - The path to
     *            the item's icon, starting from the application root directory.
     *            Per Android's guidelines, the icon should be a 48-by-48 pixel
     *            black and white PNG file. enabled - Boolean. Defines whether
     *            the item is enabled or disabled.
     * @return Item
     */
    this.addItem = function(id, callback, title, options) {
        if (!isInitialized()) {
            return;
        }
        WL.Validators.validateArguments([ 'string', 'function', 'string', 'object' ], arguments, 'WL.OptionsMenu.addItem');
        WL.Validators.validateOptions({
            enabled : 'boolean',
            image : 'string'
        }, options, 'WL.OptionsMenu.addItem options');
        var defaultOptions = {
            enabled : true,
            image : null
        };

        // remove the suffix since it is take from drawble
        if (options.image) {
            options.image = options.image.substr(0, options.image.lastIndexOf('.')) || options.image
        }

        callbacks[id] = callback;
        WLJSX.Object.extend(defaultOptions, options);

        if (isSettingsEnable) {
            this.removeItem(SETTING_OPTIONS_MENU_ITEM);
        }
        var itemToReturn = NativeOptionsMenu.addItem(id, "WL.OptionsMenu.__onItemClicked('" + id + "')", title, defaultOptions.image,
                defaultOptions.enabled);
        this.__addWLSettingItem();
        return itemToReturn;
    };

    this.__addWLSettingItem = function() {
        if (!isSettingsEnable) {
            return;
        }
        if (!isInitialized()) {
            return;
        }
        callbacks[SETTING_OPTIONS_MENU_ITEM] = WL.App.__showWLPreferences;
        return NativeOptionsMenu.addItem(SETTING_OPTIONS_MENU_ITEM, "WL.OptionsMenu.__onItemClicked('wlSettings')", "Worklight Settings",
                "settings", true);
    };

    /**
     * Returns the item with the specified ID. Once you get an item, you can use
     * it's set methods to change the item's properties.
     * 
     * @param id
     *            Mandatory string. The ID of the required item.
     * @return A NativeItem object. If the specified ID is not found, the method
     *         returns null.
     */
    this.getItem = function(id) {
        if (!isInitialized()) {
            return;
        }
        WL.Validators.validateArguments([ 'string' ], arguments, 'WL.OptionsMenu.getItem');
        return NativeOptionsMenu.getItem(id);
    };

    /**
     * Removes the item with the indicated ID from the menu. Can be called only
     * after initializing the menu. If no item is found with the specified ID,
     * nothing happens.
     * <p>
     * If no item is found with the specified ID, nothing happens.
     * 
     * @param id
     *            Mandatory string. The ID of the item to be removed.
     */
    this.removeItem = function(id) {
        if (!isInitialized()) {
            return;
        }
        WL.Validators.validateArguments([ 'string' ], arguments, 'WL.OptionsMenu.removeItem');
        NativeOptionsMenu.removeItem(id);
        delete callbacks[id];
    };

    /**
     * Removes all items from the menu. Can be called only after initializing
     * the menu.
     */
    this.removeItems = function() {
        if (!isInitialized()) {
            return;
        }
        NativeOptionsMenu.removeItems();
        callbacks = [];
        this.__addWLSettingItem();
    };

    /**
     * Enables/Disables the menu.
     * 
     * @param isEnabled
     *            boolean signifying the request
     */
    this.setEnabled = function(enabled) {
        if (!isInitialized()) {
            return;
        }
        WL.Validators.validateArguments([ 'boolean' ], arguments, 'WL.OptionsMenu.setEnabled');
        NativeOptionsMenu.setEnabled(enabled);
    };

    /**
     * Get menu enabled state
     * 
     * @callback is a callback that receives a boolean with enabled state
     * @returns enabled state
     */
    this.isEnabled = function(callback) {
    	if (typeof(callback) === 'undefined' || callback == null) {
    		WL.Logger.warn("Synchronous call to method WL.OptionsMenu.isEnabled is deprecated. You have to provide a callback with a parameter receiving the state.");
    	}
    	
        if (!isInitialized()) {
        	if (typeof(callback) !== 'undefined' && callback != null) {
        		callback(false);
        	}
            return false;
        }
        var result = NativeOptionsMenu.isEnabled();
        if (typeof(callback) !== 'undefined' && callback != null) {
        	callback(result);
        }
        return result;
    };

    /**
     * Set the menu visibility.
     * 
     * @param isVisible
     *            boolean signifying the request
     */
    this.setVisible = function(visible) {
        if (!NativeOptionsMenu) {
            return;
        }
        WL.Validators.validateArguments([ 'boolean' ], arguments, 'WL.OptionsMenu.setVisible');
        NativeOptionsMenu.setVisible(visible);
    };

    /**
     * Get the menu visibility state
     * 
     * @callback is a callback that receives a boolean with visible state
     * @returns visible state 
     */
    this.isVisible = function(callback) {
    	if (typeof(callback) === 'undefined' || callback == null) {
    		WL.Logger.warn("Synchronous call to method WL.OptionsMenu.isVisible is deprecated. You have to provide a callback with a parameter receiving the state.");
    	}
    	
        if (!NativeOptionsMenu) {
        	if (typeof(callback) !== 'undefined' && callback != null) {
        		
        		callback(false);
        	}
            return false;
        }
        var result = NativeOptionsMenu.isVisible();
        if (typeof(callback) !== 'undefined' && callback != null) {
        	callback(result);
        }
        return result;
    };
};

__WL.prototype.OptionsMenu = new __WLOptionsMenu;
WL.OptionsMenu = new __WLOptionsMenu;

function __WLLogger() {
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
    
    this.info = function(msg, ex) {
        log(msg, priority.INFO, ex);
    };

    this.warn = function(msg, ex) {
        log(msg, priority.WARN, ex);
    }

    function log(msg, priority, ex) {
		if (!enableLogger){
			return;
		}
			
        if (typeof ex !== "undefined") {
            msg += " " + WL.App.getErrorMessage(ex);
        }
        if (WL.StaticAppProps.ENVIRONMENT != WL.Env.PREVIEW) {
            cordova.exec(null, null, "Logger", priority, [ msg ]);
        }
    }
};

WL.Logger = new __WLLogger;

WL.App.close = function() {
    navigator.app.exitApp();
};

/**
 * WL.TerminatorDialog
 */
__WLTerminatorDialog = WLJSX.Class.create({
    show : function(title, msg, buttonLabel) {
        WL.SimpleDialog.show(title, msg, [ {
            text : buttonLabel,
            handler : function() {
                WL.App.close();
            }
        } ]);
    }
});

__WL.TerminatorDialog = new __WLTerminatorDialog;

/**
 * Push Notification API for the android environment.
 */
__WLPush = function() {
    var isTokeUpdatedOnServer = false;
    var subscribedEventSources = {};
    var subscribedSMSEventSources = {};
    var registeredEventSources = {};
    var pendindPushEventsArray = new Array();
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
        WL.Validators.validateMinimumArguments(arguments, 3, "WL.Client.Push.registerEventSourceCallback");
        WL.Validators.validateArguments([ 'string', 'string', 'string', WL.Validators.validateFunctionOrNull ], arguments,
                'WL.Client.Push.registerEventSourceCallback');
        if (typeof registeredEventSources[alias] != "undefined") {
            WL.Logger.error("Cannot register to event source callback with existing alias: " + alias);
            return;
        }
        if (!isAbleToSubscribe(alias, true)) {
            return;
        }
        registeredEventSources[alias] = {
            "adapter" : adapter,
            "eventSource" : eventSource,
            "callback" : callback
        };

    };

    this.__isDeviceSupportPush = function() {
        return typeof device.version != undefined && parseFloat(device.version.substr(0, 3)) >= 2.2;
    };

    this.__updateToken = function(serverToken) {
        cordova.exec(function(deviceToken) {
            updateTokenCallback(serverToken, deviceToken);
        }, function() {
            WL.Logger.error("Error while trying to retrieve device token from the mobile operating system.");
            WL.SimpleDialog.show(WL.ClientMessages.error, WL.ClientMessages.notificationUpdateFailure, [ {
                text : WL.ClientMessages.ok
            } ]);
            // TODO: ilan remove authHandler code here in updateToken
            // WL.AuthHandler.onSuccess();
        }, 'Push', 'subscribe', []);
    };

    this.subscribe = function(alias, options) {
        if (!isAbleToSubscribe(alias, false)) {
            return;
        }

        WL.Validators.validateArguments([ 'string', WL.Validators.validateObjectOrNull ], arguments, 'WL.Client.Push.subscribe');
        WL.Validators.validateOptionsLoose({
            alert : 'boolean',
            sound : 'boolean',
            badge : 'boolean',
            onSuccess : 'function',
            onFailure : 'function'
        }, options, "WL.Client.Push.subscribe");

        if (!options) {
            options = {};
        }
        var extendedOptions = WLJSX.Object.extend(WLJSX.Object.clone(defaultSubscribeOptions), options);
        var registeredEventSource = registeredEventSources[alias];
        var requestOptions = {
            onSuccess : function() {
            	subscribedEventSources[alias] = true;
                if (extendedOptions.onSuccess) {
                    extendedOptions.onSuccess();
                }
                if (WL.Client.Push.__hasPendings()) {
                    WL.Client.Push.__dispatchPendings();
                }
            },
            onFailure : function () {
            	extendedOptions.onFailure();
            }
        };
        
        requestOptions.requestHeaders = {};
        requestOptions.parameters = {};
        requestOptions.parameters.adapter = registeredEventSource.adapter;
        requestOptions.parameters.eventSource = registeredEventSource.eventSource;
        requestOptions.parameters.alias = alias;
        requestOptions.parameters.subscribe = WLJSX.Object.toJSON(options);
        new WLJSX.Ajax.WLRequest("notifications", requestOptions);
        cordova.exec(null, null, 'Push', 'dispatch', [ 'WL.Client.Push.__onmessage' ]);
    };

    this.unsubscribe = function(alias, options) {
        if (!isAbleToSubscribe(alias, false)) {
            return;
        }

        WL.Validators.validateArguments([ 'string', WL.Validators.validateObjectOrNull ], arguments, 'WL.Client.Push.unsubscribe');
        WL.Validators.validateOptionsLoose({
            onSuccess : 'function',
            onFailure : 'function'
        }, options, "WL.Client.Push.unsubscribe");

        options = WLJSX.Object.extend(WLJSX.Object.clone(defaultUnsubscribeOptions), options);

        var registeredEventSource = registeredEventSources[alias];
        var requestOptions = {
            onSuccess : function() {
            	subscribedEventSources[alias] = false;
                if (options.onSuccess) {
                    options.onSuccess();
                }
            },
            onFailure : function () {
            	options.onFailure();
            }
        };
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
            /*alert : 'boolean',
            sound : 'boolean',
            badge : 'boolean',*/
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
        //cordova.exec(null, null, 'Push', 'dispatch', [ 'WL.Client.Push.__onmessage' ]);
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

        options = WLJSX.Object.extend(WLJSX.Object.clone(defaultUnsubscribeSMSOptions), options);

        var subscribedSMSEventSource = subscribedSMSEventSources[alias];
        var requestOptions = {
            onSuccess : function() {
                subscribedSMSEventSources[alias] = {};
                if (options.onSuccess) {
                    options.onSuccess();
                }
            },
            onFailure : options.onFailure
        };
        requestOptions.parameters = {};
        requestOptions.parameters.alias = alias;
        requestOptions.parameters.adapter = subscribedSMSEventSource.adapter;
        requestOptions.parameters.eventSource = subscribedSMSEventSource.eventSource;
        requestOptions.parameters.unsubscribe = "";
        requestOptions.parameters.transport = "SMS";
        new WLJSX.Ajax.WLRequest("notifications", requestOptions);
    };
    
    /**
     * @return true if the environment supports push.
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

    this.__onmessage = function(props, payload) {
        WL.Logger.debug("WL.Client.Push received notification for alias " + payload.alias);
        try {
            if (subscribedEventSources[payload.alias] && registeredEventSources[payload.alias] && registeredEventSources[payload.alias].callback) {
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

    /**
     * @return true if the environment supports push.
     */
    this.isPushSupported = function() {
        return WL.EnvProfile.isEnabled(WL.EPField.SUPPORT_PUSH);
    };

    function isAbleToSubscribe(alias, isRegistering) {
        if (!WL.Client.Push.__isDeviceSupportPush()) {
            WL.Logger.error("The current Android version " + device.version + " does not support push notifications.");
            return false;
        }

        if (!isTokeUpdatedOnServer) {
            WL.Logger.error("Can't subscribe, notification token is not updated on the server");
            return false;
        }

        // isRegistering means If check from register function, then
        // registeredEventSources not exist yet.
        if (!isRegistering && !registeredEventSources[alias]) {
            WL.Logger.error("No registered push event source for alias '" + alias + "'.");
            return false;
        }
        return true;
    }
    ;

    function updateTokenCallback(serverToken, deviceToken) {
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
            requestOptions.requestHeaders = {}
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
        }
    }
    ;
};

// Disable the prompt on android preview because cordova use promt for debugging
if (WL.StaticAppProps.ENVIRONMENT == WL.Env.PREVIEW) {
    prompt = function() {
    };
}

// Back Button support functions
WL.App.overrideBackButton = function(callback) {
    WL.Validators.validateArguments([ 'function' ], arguments, "WL.App.overrideBackButton");
    WL.App.resetBackButton();
    window.wlOverrideBackButton = callback;
    document.addEventListener("backbutton", window.wlOverrideBackButton, false);
};

WL.App.resetBackButton = function() {
    if (window.wlOverrideBackButton) {
        document.removeEventListener("backbutton", window.wlOverrideBackButton, false);
        delete window.wlOverrideBackButton;
    }
};

// Support toast message
WL.Toast.show = function(text) {
    WL.Validators.validateArguments([ 'string' ], arguments, "WL.Toast.show");
    cordova.exec(null, null, "Utils", "toast", [ text ]);
};

WL.App.copyToClipboard = function(text, callback) {
    cordova.exec(callback, callback, "Utils", "copyToClipboard", [ text ]);
};

WL.Device.getNetworkInfo = function(callback) {
    WL.Validators.validateArguments([ 'function' ], arguments, 'WL.Device.getNetworkInfo');
    cordova.exec(callback, callback, "NetworkDetector", "getNetworkInfo", []);
};

WL.App.__showWLPreferences = function() {
    WL.NativePage.show("com.worklight.common.WLPreferences", function(data) {
        if (data.isWebResourcesChanged) {
        	WL.App.readUserPref("newAppIdPref", function(newAppId){
        		WL.App.readUserPref("newAppVersionPref", function(newAppVersion){
        			 WL.Utils.__getSkinFromRemoteSkinLoader(newAppId, newAppVersion, function(skinName) {
        	                WL.App.writeUserPref('wlSkinName', skinName);
        	                cordova.exec(null, null, "WebResourcesDownloader", "switchApp", [WL.Client.__globalHeaders["WL-Instance-Id"], newAppId, newAppVersion ]);
        	                WL.App.writeUserPref('appIdPref', newAppId);
        	                WL.App.writeUserPref('appVersionPref', newAppVersion);
        	            });
        		});
        	});
        } else if (data.isServerURLChanged) {
            WL.Client.reloadApp();
            WL.App.writeUserPref("exitOnSkinLoader", "true");
        }
    });
};

__WLClient.prototype.Push = new __WLPush();
WL.Client.Push = new __WLPush();

/**
 * Hash string on native and return it as callback
 * 
 * @param data
 * @param callback
 */
WL.App.__hashData = function(data, someArgs, callback) {
    cordova.exec(function(data) {
        callback(data);
    }, function() {
        WL.Logger.error("Problem to get hash from WL.App.__hashData for value" + data);
    }, "SecurityPlugin", "hashData", [ data, someArgs ]);
};

WL.DeviceAuth.__getDeviceUUID = function(successCallback, failureCallback) {
	cordova.exec(successCallback, failureCallback, "DeviceAuth", "getDeviceUUID", []);
};