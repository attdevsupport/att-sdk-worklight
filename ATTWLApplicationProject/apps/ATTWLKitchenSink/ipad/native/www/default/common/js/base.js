
/* JavaScript content from common/js/base.js in Common Resources */
/*
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

/* Copyright (C) Worklight Ltd. 2006-2012.  All rights reserved. */


function __WL() {
};
var WL = WL ? WL : {};

window.WLJSX = {
	/*
	 * Constant values, required for prototype.js functionality 
	 */
	emptyFunction: function (){},
	
	/*
	 * Search for an element with a specified ID and returns it as a DOM element. 
	 * Returns null if element is not found 
	 * 
	 * @Param selector - a string with the requires DOM element's Id
	 */
	$ : function(id) {
		var elements = WLJQ("#" + id);
		if (elements.length == 0) {
			return null;
		} else {
			return elements[0];
		}
	},

	/*
	 * Searches for the elements with a specified selector and returns them as an array of DOM elements 
	 * 
	 * @Param selector - a string representing a CSS selector
	 */
	$$ : function(selector) {
		return WLJQ(selector);
	},

	/*
	 * Same as $$ but searches inside of a given element only. Returns array of DOM elements 
	 * 
	 * @Param el - the DOM element to search inside of 
	 * @Param selector - a string representing a CSS selector
	 */
	find : function(el, selector) {
		return WLJQ(el).find(selector);
	},

	/*
	 * Creates a new DOM element and returns it 
	 * 
	 * @Param type - a string representing the element type (tag name, e.g. "<div/>") 
	 * @Param attrs - an object of attributes to be added to newly created element
	 */
	newElement : function(type, attrs) {
		return WLJQ(type, attrs)[0];
	},

	/*
	 * Appends the content before the end of a DOM element 
	 * 
	 * @Param el - the DOM element (or CSS selector string) to append content to 
	 * @Param content - new content to be appended
	 */
	append : function(el, content) {
		WLJQ(el).append(content);
	},

	/*
	 * Prepends the content at the beginning of a DOM element 
	 * 
	 * @Param el - the DOM element (or CSS selector string) to prepend content to 
	 * @Param content - new content to be prepended
	 */
	prepend : function(el, content) {
		WLJQ(el).prepend(content);
	},

	/*
	 * Sets or Gets DOM element's content 
	 * 
	 * @Param el - the DOM element to update content in 
	 * @Param content - new content, can be string or other DOM elements
	 */
	html : function(el, content) {
		if (content) {
			WLJQ(el).html(content);
		} else {
			return WLJQ(el).html();
		}
	},

	/*
	 * Empties the content of a given DOM element 
	 * 
	 * @Param el - the DOM element (or CSS selector string) to empty
	 */
	empty : function(el) {
		WLJQ(el).empty();
	},

	/*
	 * Shows a DOM element (makes visible) 
	 * 
	 * @Param el - the DOM element (or CSS selector string) to make visible
	 */
	show : function(el) {
		WLJQ(el).show();
	},

	/*
	 * Hides a DOM element (makes invisible) 
	 * 
	 * @Param el - the DOM element (or CSS selector string) to hide
	 */
	hide : function(el) {
		WLJQ(el).hide();
	},

	/*
	 * Adds a specified CSS class to DOM elements 
	 * 
	 * @Param el - the DOM element (or CSS selector string) to add the CSS class to 
	 * @Param className - string with the class' name
	 */
	addClass : function(el, className) {
		WLJQ(el).addClass(className);
	},

	/*
	 * Removes a specified CSS class from DOM elements 
	 * 
	 * @Param el - the DOM element (or CSS selector string) to remove the CSS class from 
	 * @Param className - string with the class' name
	 */
	removeClass : function(el, className) {
		WLJQ(el).removeClass(className);
	},

	/*
	 * Sets or Gets the width of a DOM element (first one in case several elements fit CSS selector) 
	 * 
	 * @Param el - the DOM element to get/set width 
	 * @Param width - new width to set
	 */
	width : function(el, width) {
		if (width) {
			WLJQ(el).width(width);
		} else {
			return WLJQ(el).width();
		}
	},

	/*
	 * Sets or Gets the height of a DOM element (first one in case several elements fit CSS selector) 
	 * 
	 * @Param el - the DOM element to get/set height 
	 * @Param height - new height to set
	 */
	height : function(el, height) {
		if (height) {
			WLJQ(el).height(height);
		} else {
			return WLJQ(el).height();
		}
	},

	/*
	 * Removes an element from the DOM. 
	 * 
	 * @Param el - the DOM element (or CSS selector string) to remove
	 */
	remove : function(el) {
		WLJQ(el).remove();
	},

	/*
	 * Sets specific CSS style on the DOM elements 
	 * 
	 * @Param el - the DOM element (or CSS selector string) to set CSS style on 
	 * @Param style - an object of CSS styles to be set
	 */
	css : function(el, style) {
		WLJQ(el).css(style);
	},

	/*
	 * Sets or Gets the attribute of a DOM element 
	 * 
	 * @Param el - the DOM element to get/set attribute 
	 * @Param attrName - the name of an attribute 
	 * @Param attrValue - the new value of the attribute
	 */
	attr : function(el, attrName, attrValue) {
		if (attrValue) {
			WLJQ(el).attr(attrName, attrValue);
		} else {
			return WLJQ(el).attr(attrName);
		}
	},

	/*
	 * Adds the event listener to DOM elements for a specified event 
	 * 
	 * @Param el - the DOM element (or CSS selector string) to add event listener to 
	 * @Param event - string with the event's name, e.g. "click", "change" etc. 
	 * @Param callback - a JavaScript function to be invoked once event is triggered
	 */
	bind : function(el, event, callback) {
		WLJQ(el).bind(event, callback);
	},

	/*
	 * Removes the event listener from DOM elements 
	 * 
	 * @Param el - the DOM element (or CSS selector string) to remove event listener form 
	 * @Param event - string with the event's name, e.g. "click", "change" etc.
	 */
	unbind : function(el, event) {
		if (event) {
			WLJQ(el).unbind(event);
		} else {
			WLJQ(el).unbind();
		}
	},

	/*
	 * Triggers a specific event on DOM elements 
	 * 
	 * @Param el - the DOM element (or CSS selector string) to trigger the event on 
	 * @Param event - string with the event's name, e.g. "click", "change" etc.
	 */
	trigger : function(el, event) {
		WLJQ(el).trigger(event);
	},

	/*
	 * Retrieves the element that triggered the event (event's target) 
	 * 
	 * @Param event - event to get the target from
	 */
	eventTarget : function(event) {
		return event.target;
	},
	
	/*
	 * Detects browser types. Implementation taken from Prototype.js
	 */
	detectBrowser: function (){
		var userAgent = navigator.userAgent;
		var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
		return {
			isIE 			: !!window.attachEvent && !isOpera,
			isOpera 		: isOpera,
			isWebKit 		: userAgent.indexOf('AppleWebKit/') > -1,
			isGecko 		: userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('KHTML') === -1,
			isMobileSafari 	: /Apple.*Mobile/.test(userAgent)
		};
	},
	
	/*
	 * Returns viewport root element depending on a browser. Implementation taken from Prototype.js
	 */
	getViewportRootElement: function (){
		var browser = WLJSX.detectBrowser();
		
		if (browser.isWebKit && !document.evaluate)
			return document;
		
		if (browser.isOpera && window.parseFloat(window.opera.version()) < 9.5)
			return document.body;

		return document.documentElement;
	},
	
	/*
	 * Returns the width of a viewport
	 */
	getViewportWidth: function (){
		return (this.getViewportRootElement())["clientWidth"];		
	},

	/*
	 * Returns the height of a viewport
	 */
	getViewportHeight: function (){
		return (this.getViewportRootElement())["clientHeight"];
	}
	

};

/*
 * The following namespaces are taken from prototypejs framework and adopted to work with Worklight
 */

/*
 * Class object defines a Class.create API for object oriented JS approach
 */
window.WLJSX.Class = (function() {
	var IS_DONTENUM_BUGGY = (function(){
		for (var p in { toString: 1 }) {
			if (p === 'toString') return false;
		}
		return true;
	})();

	function subclass() {};
	function create() {
		var parent = null;
		var properties = WLJSX.Object.toArray(arguments);
		
		if (WLJSX.Object.isFunction(properties[0]))
			parent = properties.shift();

		function klass() {
			this.initialize.apply(this, arguments);
		}

		WLJSX.Object.extend(klass, WLJSX.Class.Methods);
		klass.superclass = parent;
		klass.subclasses = [];

		if (parent) {
			subclass.prototype = parent.prototype;
			klass.prototype = new subclass;
			parent.subclasses.push(klass);
		}

		for (var i = 0, length = properties.length; i < length; i++)
			klass.addMethods(properties[i]);

		if (!klass.prototype.initialize)
			klass.prototype.initialize = WLJSX.emptyFunction;

		klass.prototype.constructor = klass;
		return klass;
	}

	function addMethods(source) {
		var ancestor = this.superclass && this.superclass.prototype,
			properties = WLJSX.Object.keys(source);

		if (IS_DONTENUM_BUGGY) {
			if (source.toString != Object.prototype.toString)
				properties.push("toString");
			if (source.valueOf != Object.prototype.valueOf)
				properties.push("valueOf");
		}

		for (var i = 0, length = properties.length; i < length; i++) {
			var property = properties[i], 
				value = source[property];
			
			if (ancestor && WLJSX.Object.isFunction(value) && value.argumentNames()[0] == "__super") {
				var method = value;
				value = (function(m) {
					return function() { return ancestor[m].apply(this, arguments); };
				})(property).wrap(method);

				value.valueOf = method.valueOf.bind(method);
				value.toString = method.toString.bind(method);
			}
			this.prototype[property] = value;
		}
		return this;
	}

	return {
		create: create,
		Methods: {
			addMethods: addMethods
		}
	};
})();

/*
 * WLJSX.Object APIs are responsible for Object related functionality
 * 
 * WLJSX.Object.objectSize(obj) - returns the number of properties in the supplied object
 * WLJSX.Object.toArray(iterable) - coverts object to array
 * WLJSX.Object.toJSON(obj) - converts object to it's JSON representation
 * WLJSX.Object.extend(destination, source) - extends destination object with properties from the source object   
 * WLJSX.Object.toQueryString(obj) - converts object to a query string
 * WLJSX.Object.keys(obj) - returns object keys as array
 * WLJSX.Object.clone(obj) - returns a new copy of a supplied object
 * WLJSX.Object.isArray(obj) - checks whether object is an array
 * WLJSX.Object.isFunction(obj) - checks whether object is a function 
 * WLJSX.Object.isString(obj) - checks whether object is a string
 * WLJSX.Object.isNumber(obj) - checks whether object is a number
 * WLJSX.Object.isDate(obj) - checks whether object is a date
 * WLJSX.Object.isUndefined(obj) - checks whether object is undefined 
 */
window.WLJSX.Object = {
		_toString: Object.prototype.toString,
		NULL_TYPE: 'Null',
	UNDEFINED_TYPE: 'Undefined',
	BOOLEAN_TYPE: 'Boolean',
	NUMBER_TYPE: 'Number',
	STRING_TYPE: 'String',
	OBJECT_TYPE: 'Object',
	FUNCTION_CLASS: '[object Function]',
	BOOLEAN_CLASS: '[object Boolean]',
    NUMBER_CLASS: '[object Number]',
    STRING_CLASS: '[object String]',
    ARRAY_CLASS: '[object Array]',
    DATE_CLASS: '[object Date]',
    
    NATIVE_JSON_STRINGIFY_SUPPORT: (window.JSON &&
    	typeof JSON.stringify === 'function' &&
    	JSON.stringify(0) === '0' &&
    	typeof JSON.stringify(function(x) { return x; }) === 'undefined'),
	
    objectSize: function(obj){
		var count = 0;
		for (var key in obj)
			count++;
		return count;
	},

	toArray: function (iterable){
		if (!iterable) return [];
		if ('toArray' in Object(iterable)) return iterable.toArray();
		var length = iterable.length || 0;
		var result = new Array(length);
		while (length--) result[length] = iterable[length];
		return result;
	},
	
	Type: function (o) {
		switch(o) {
			case null: return WLJSX.Object.NULL_TYPE;
			case (void 0): return WLJSX.Object.UNDEFINED_TYPE;
		}
		var type = typeof o;
		switch(type) {
			case 'boolean': return WLJSX.Object.BOOLEAN_TYPE;
			case 'number':  return WLJSX.Object.NUMBER_TYPE;
			case 'string':  return WLJSX.Object.STRING_TYPE;
		}
		return WLJSX.Object.OBJECT_TYPE;
	},
	
	extend: function (destination, source) {
		for (var property in source)
			destination[property] = source[property];
		return destination;
	},
	
	toJSON: function(object) {
		if (WLJSX.Object.NATIVE_JSON_STRINGIFY_SUPPORT) 
			return JSON.stringify(object);
		else 
			return WLJSX.Object.Str('', { '': object }, []);
	},
	
	Str: function(key, holder, stack) {
		var value = holder[key];
		var type = typeof value;
			if (WLJSX.Object.Type(value) === WLJSX.Object.OBJECT_TYPE && typeof value.toJSON === 'function') {
			value = value.toJSON(key);
		}
			var _class = WLJSX.Object._toString.call(value);
			switch (_class) {
			case WLJSX.Object.NUMBER_CLASS:
			case WLJSX.Object.BOOLEAN_CLASS:
			case WLJSX.Object.STRING_CLASS:
				value = value.valueOf();
		}
			switch (value) {
			case null: return 'null';
			case true: return 'true';
			case false: return 'false';
		}
			type = typeof value;
		switch (type) {
			case 'string':
				return value;
			case 'number':
				return isFinite(value) ? String(value) : 'null';
			case 'object':
				for (var i = 0, length = stack.length; i < length; i++) {
					if (stack[i] === value) { throw new TypeError(); }
				}
				stack.push(value);
					var partial = [];
				if (_class === WLJSX.Object.ARRAY_CLASS) {
					for (var i = 0, length = value.length; i < length; i++) {
						var str = WLJSX.Object.Str(i, value, stack);
						partial.push(typeof str === 'undefined' ? 'null' : str);
					}
					partial = '[' + partial.join(',') + ']';
				} else {
					var keys = WLJSX.Object.keys(value);
					for (var i = 0, length = keys.length; i < length; i++) {
						var key = keys[i];
						var str = WLJSX.Object.Str(key, value, stack);
						if (typeof str !== "undefined") {
							partial.push(WLJSX.String.inspect(key, true)+ ':' + str);
						}
					}
					partial = '{' + partial.join(',') + '}';
				}
				stack.pop();
				return partial;
		}
	},
	
	toQueryString: function(object) {
		var results = [];

		for (var key in object){
			key = encodeURIComponent(key);
			var value = object[key];
			var queryPair = (WLJSX.Object.isUndefined(value)) ? key : key + '=' + encodeURIComponent(WLJSX.String.interpret(value));
				results.push(queryPair);
			}		
		return results.join('&');
	},

	keys: function(object) {
		if (WLJSX.Object.Type(object) !== WLJSX.Object.OBJECT_TYPE) { throw new TypeError(); }
		var results = [];
		for (var property in object) {
			if (object.hasOwnProperty(property)) {
				results.push(property);
			}
		}
		return results;
	},

	clone: function(object) {
		return WLJSX.Object.extend({ }, object);
	},

	isArray: function(object) {
		if ((typeof Array.isArray == 'function') && Array.isArray([]) && !Array.isArray({})) {
			return Array.isArray(object);
		} else {
			return WLJSX.Object._toString.call(object) === WLJSX.Object.ARRAY_CLASS;
			}
		},

	isFunction: function (object) {
		return WLJSX.Object._toString.call(object) === WLJSX.Object.FUNCTION_CLASS;
	},

	isString: function (object) {
		return WLJSX.Object._toString.call(object) === WLJSX.Object.STRING_CLASS;
	},

	isNumber: function(object) {
		return WLJSX.Object._toString.call(object) === WLJSX.Object.NUMBER_CLASS;
	},

	isDate: function(object) {
		return WLJSX.Object._toString.call(object) === WLJSX.Object.DATE_CLASS;
	},

	isUndefined: function(object) {
		return typeof object === "undefined";
	}
};

/*
 * WLJSX.String APIs are responsible for String related functionality
 * 
 * WLJSX.String.stripScripts(str) - stripts <script> tags from string
 * WLJSX.String.escapeHTML(str) - replaces &, < and > characters with their escaped HTML values
 * WLJSX.String.inspect(str) - Returns a debug-oriented version of the string (i.e. wrapped in single or double quotes, with backslashes and quotes escaped)
 * WLJSX.String.interpret(str) - Forces value into a string. Returns an empty string for null  
 * WLJSX.String.strip(str) - Strips all leading and trailing whitespace from a string
 * WLJSX.String.isJSON(str) - validates whether string is a valid JSON representation
 * WLJSX.String.isBlank(str) - Check if the string is "blank" � either empty (length of 0) or containing only whitespace.
 * WLJSX.String.unfilterJSON(str) - Strips comment delimiters around Ajax JSON or JavaScript responses. This security method is called internally
 * WLJSX.String.evalJSON(str) - Evaluates the JSON in the string and returns the resulting object
*/
window.WLJSX.String = {
	specialChar : {
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'\\': '\\\\'
	},
	stripScripts: function (str){
		return str.replace(new RegExp('<script[^>]*>([\\S\\s]*?)<\/script>', 'img'), '');
	},
		
	escapeHTML: function(str){
		return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	},

	interpret: function(str){
		return str == null ? '' : String(str);
	},

	strip: function (str){
		return str.replace(/^\s+/, '').replace(/\s+$/, '');
	},
	
	toQueryParams: function(str){
		var match = WLJSX.String.strip(str).match(/([^?#]*)(#.*)?$/);
		if (!match) return { };

		var paramsArray = match[1].split('&');
		var paramsObj = {};
		for (var i=0; i<paramsArray.length; i++){
			var pair = paramsArray[i].split('=');
			if (pair[0]) {
				var key = decodeURIComponent(pair.shift());
				var value = pair.length > 1 ? pair.join('=') : pair[0];
				if (value != undefined) value = decodeURIComponent(value);
				paramsObj[key] = value;
			}
		}
		return paramsObj;
	},

	isJSON: function(str){
		if (WLJSX.String.isBlank(str)) return false;
		str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
		str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
		str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
		return (/^[\],:{}\s]*$/).test(str);
	},

	isBlank: function(str){
			return /^\s*$/.test(str);
		},

	inspect: function (str, useDoubleQuotes){
		var escapedString = str.replace(/[\x00-\x1f\\]/g, function(character) {
			if (character in WLJSX.String.specialChar) {
				return WLJSX.String.specialChar[character];
			}
			return '\\u00' + character.charCodeAt().toPaddedString(2, 16);
		});
		if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
		return "'" + escapedString.replace(/'/g, '\\\'') + "'";
	},
	
	unfilterJSON: function(str){
		return str.replace(/^\/\*-secure-([\s\S]*)\*\/\s*$/, '$1');
	},
	
	evalJSON: function(str, sanitize){
		var json = WLJSX.String.unfilterJSON(str);
		if (window.JSON && typeof JSON.parse === 'function' && JSON.parse('{"test": true}').test){
			// Native json parse support
			return JSON.parse(json);
		} else {
			// No native json parse support
			cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
			if (cx.test(json)) {
				json = json.replace(cx, function (a) {
					return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				});
			}
			try {
				if (!sanitize || WLJSX.String.isJSON(json)) return eval('(' + json + ')');
			} catch (e) { }
			throw new SyntaxError('Badly formed JSON string: ' + WLJSX.String.inspect(str));
		}
	}
};

/*
 * WLJSX.PeriodicalExecuter APIs are responsible for PeriodicalExecuter related functionality
 * 
 * WLJSX.Object.execute() - Executes a callback supplied at initialization
 * WLJSX.Object.stop() - Stops the timer interval execution
 * new WLJSX.PeriodicalExecuter(callback, frequency) - returns new WLJSX.PeriodicalExecuter() object 
 * which will call callback at specified frequencies (in seconds)
 */
window.WLJSX.PeriodicalExecuter = function(callback, frequency){
	var callback = callback;
	var frequency = frequency;
	var currentlyExecuting = false;

	function onTimerEvent() {
		if (!currentlyExecuting) {
			try {
				currentlyExecuting = true;
				callback();
				currentlyExecuting = false;
			} catch(e) {
				currentlyExecuting = false;
				throw e;
			}
		}
	}

	var timer = setInterval(onTimerEvent.bind(this), frequency * 1000);
	
	return {
		execute: function() {
			callback(this);
		},

		stop: function() {
			if (!timer) return;
			clearInterval(timer);
			timer = null;
		}
	}
};


/*
 * Extends JavaScript Function object
 * 
 * Public API:
 * functionName.argumentNames - http://api.prototypejs.org/language/Function/prototype/argumentNames/
 * finctionName.bind - http://api.prototypejs.org/language/Function/prototype/bind/
 * functionName.bindAsEventListener - http://api.prototypejs.org/language/Function/prototype/bindAsEventListener/ 
 * functionName.curry - http://api.prototypejs.org/language/Function/prototype/curry/
 * functionName.delay - http://api.prototypejs.org/language/Function/prototype/delay/
 * functionName.defer - http://api.prototypejs.org/language/Function/prototype/defer/
 * functionName.wrap - http://api.prototypejs.org/language/Function/prototype/wrap/
 */
WLJSX.Object.extend(Function.prototype, (function() {
	var slice = Array.prototype.slice;

	function update(array, args) {
		var arrayLength = array.length, length = args.length;
		while (length--) array[arrayLength + length] = args[length];
		return array;
	}

	function merge(array, args) {
		array = slice.call(array, 0);
		return update(array, args);
	}

	function argumentNames() {
		var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
			.replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
			.replace(/\s+/g, '').split(',');
		return names.length == 1 && !names[0] ? [] : names;
	}

	function bind(context) {
		if (arguments.length < 2 && WLJSX.Object.isUndefined(arguments[0])) return this;
		var __method = this, args = slice.call(arguments, 1);
		return function() {
			var a = merge(args, arguments);
			return __method.apply(context, a);
		};
	}

	function bindAsEventListener(context) {
		var __method = this, args = slice.call(arguments, 1);
		return function(event) {
			var a = update([event || window.event], args);
			return __method.apply(context, a);
		};
	}

	function curry() {
		if (!arguments.length) return this;
		var __method = this, args = slice.call(arguments, 0);
		return function() {
			var a = merge(args, arguments);
			return __method.apply(this, a);
		};
	}

	function delay(timeout) {
		var __method = this, args = slice.call(arguments, 1);
		timeout = timeout * 1000;
		return window.setTimeout(function() {
			return __method.apply(__method, args);
		}, timeout);
	}

	function defer() {
		var args = update([0.01], arguments);
		return this.delay.apply(this, args);
	}

	function wrap(wrapper) {
		var __method = this;
		return function() {
			var a = update([__method.bind(this)], arguments);
			return wrapper.apply(this, a);
		};
	}

	return {
		argumentNames:       argumentNames,
		bind:                bind,
		bindAsEventListener: bindAsEventListener,
		curry:               curry,
		delay:               delay,
		defer:               defer,
		wrap:                wrap
	};
})());

/*
 * Wrapper for Ajax functionality
 */

window.WLJSX.Ajax = {
	getTransport: function() {
		var tr = null; 
		try {
			tr = new XMLHttpRequest();
			if (tr == null) tr = new ActiveXObject('Msxml2.XMLHTTP');
			if (tr == null) tr = new ActiveXObject('Microsoft.XMLHTTP');
		} catch (e){}
		
		return tr;
	}
};

window.WLJSX.Ajax.Base = WLJSX.Class.create({
	initialize: function(options) {
		this.options = {
			method:       'post',
			asynchronous: true,
			contentType:  'application/x-www-form-urlencoded',
			encoding:     'UTF-8',
			parameters:   '',
			evalJSON:     true,
			evalJS:       true
		};
		WLJSX.Object.extend(this.options, options || { });

		this.options.method = this.options.method.toLowerCase();
	}
});

window.WLJSX.Ajax.Request = WLJSX.Class.create(window.WLJSX.Ajax.Base, {
	_complete: false,

	initialize: function(__super, url, options) {
		__super(options);
		this.transport = window.WLJSX.Ajax.getTransport();
		this.request(url);
	},

	request: function(url) {
		this.url = url;
		this.method = this.options.method;
		var params = WLJSX.Object.isString(this.options.parameters) ?
				this.options.parameters : WLJSX.Object.toQueryString(this.options.parameters);

		if (this.method !== 'get' && this.method !== 'post') {
			params += (params ? '&' : '') + "_method=" + this.method;
			this.method = 'post';
		}

		if (params && this.method === 'get') {
			
			this.url += ((this.url.indexOf('?') > -1) ? '&' : '?') + params;
		}

		this.parameters = WLJSX.String.toQueryParams(params);

		try {
			var response = new window.WLJSX.Ajax.Response(this);
			if (this.options.onCreate) this.options.onCreate(response);

			if (WLJSX.detectBrowser().isIE && WL.StaticAppProps.ENVIRONMENT == WL.Env.VISTA_SIDEBAR) {
				//TODO: check if we can use this for all environments
				// in ie if username/password fields is empty then we don't get correct status 
				this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous, "u", "p");
			} else {
				this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);
			}

			if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);

			this.transport.onreadystatechange = this.onStateChange.bind(this);
			this.setRequestHeaders();

			this.body = this.method == 'post' ? (this.options.postBody || params) : null;
			this.transport.send(this.body);

		      /* Force Firefox to handle ready state 4 for synchronous requests */
			if (!this.options.asynchronous && this.transport.overrideMimeType)
				this.onStateChange();

		}
		catch (e) {
			this.dispatchException(e);
		}
	},

	onStateChange: function() {
		var readyState = this.transport.readyState;
		if (readyState > 1 && !((readyState == 4) && this._complete))
			this.respondToReadyState(this.transport.readyState);
	},

	setRequestHeaders: function() {
		var headers = {
			'X-Requested-With': 'XMLHttpRequest',
			'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
		};

		if (this.method == 'post') {
			headers['Content-type'] = this.options.contentType + (this.options.encoding ? '; charset=' + this.options.encoding : '');

		      /* Force "Connection: close" for older Mozilla browsers to work
		       * around a bug where XMLHttpRequest sends an incorrect
		       * Content-length header. See Mozilla Bugzilla #246651.
		       */
			if (this.transport.overrideMimeType && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
		            headers['Connection'] = 'close';
		}

		if (typeof this.options.requestHeaders == 'object') {
			var extras = this.options.requestHeaders;

			if (WLJSX.Object.isFunction(extras.push))
				for (var i = 0, length = extras.length; i < length; i += 2)
					headers[extras[i]] = extras[i+1];
			else
				for (key in extras){
					var value = extras[key];
					headers[key] = (value == null || typeof(value) == 'undefined') ? "" : value;
				}
		}

		for (var name in headers)
			this.transport.setRequestHeader(name, headers[name]);
	},

	success: function() {
		var status = this.getStatus();
		if (status == 0 && this.isSameOrigin() == false) {
			return false;
		}
		return !status || (status >= 200 && status < 300) || status == 304;
	},

	getStatus: function() {
		try {
			if (this.transport.status === 1223) return 204;
			return this.transport.status || 0;
		} catch (e) { return 0; }
	},

	respondToReadyState: function(readyState) {
		var state = window.WLJSX.Ajax.Request.Events[readyState], 
			response = new window.WLJSX.Ajax.Response(this);

		if (state == 'Complete') {
			try {
				this._complete = true;
				(this.options['on' + response.status]
				|| this.options['on' + (this.success() ? 'Success' : 'Failure')]
				|| WLJSX.emptyFunction)(response, response.headerJSON);
			} catch (e) {
				this.dispatchException(e);
			}

			var contentType = response.getHeader('Content-type');
			if (this.options.evalJS == 'force'
				|| (	this.options.evalJS && 
						this.isSameOrigin() && 
						contentType && 
						contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
				this.evalResponse();
		}

		try {
			(this.options['on' + state] || WLJSX.emptyFunction)(response, response.headerJSON);
		} catch (e) {
			this.dispatchException(e);
		}

		if (state == 'Complete') {
			this.transport.onreadystatechange = WLJSX.emptyFunction;
		}
	},

	isSameOrigin: function() {
		var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
		var url = location.protocol + '//' + document.domain;
		if (location.port) url += ':' + location.port;
		return (!m || (m[0] == url));
	},

	getHeader: function(name) {
		try {
			return this.transport.getResponseHeader(name) || null;
		} catch (e) { return null; }
	},

	evalResponse: function() {
		try {
			return eval(WLJSX.String.unfilterJSON(this.transport.responseText || ''));
		} catch (e) {
			this.dispatchException(e);
		}
	},

	dispatchException: function(exception) {
		(this.options.onException || WLJSX.emptyFunction)(this, exception);
	}
});

window.WLJSX.Ajax.Request.Events = ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

window.WLJSX.Ajax.Response = WLJSX.Class.create({
	initialize: function(request){
		this.request = request;
		var transport  = this.transport  = request.transport,
			readyState = this.readyState = transport.readyState;

		if ((readyState > 2 && !WLJSX.detectBrowser().isIE) || readyState == 4) {
			this.status       = this.getStatus();
			this.statusText   = this.getStatusText();
			this.responseText = WLJSX.String.interpret(transport.responseText);
			this.headerJSON   = this._getHeaderJSON();
		}

		if (readyState == 4) {
			var xml = transport.responseXML;
			this.responseXML  = WLJSX.Object.isUndefined(xml) ? null : xml;
			this.responseJSON = this._getResponseJSON();
		}
	},

	status:      0,

	statusText: '',

	getStatus: window.WLJSX.Ajax.Request.prototype.getStatus,

	getStatusText: function() {
		try {
			return this.transport.statusText || '';
		} catch (e) { return '' }
	},

	getHeader: window.WLJSX.Ajax.Request.prototype.getHeader,

	getAllHeaders: function() {
		try {
			return this.getAllResponseHeaders();
		} catch (e) { return null }
	},

	getResponseHeader: function(name) {
		return this.transport.getResponseHeader(name);
	},

	getAllResponseHeaders: function() {
		return this.transport.getAllResponseHeaders();
	},

	_getHeaderJSON: function() {
		var json = this.getHeader('X-JSON');
		if (!json) return null;
		json = decodeURIComponent(escape(json));
		try {
			return Sting.wl.evalJSON(json, this.request.options.sanitizeJSON || !this.request.isSameOrigin());
		} catch (e) {
			this.request.dispatchException(e);
		}
	},

	_getResponseJSON: function() {
		//Assume JSON is returned regardless, and only throw an exception
		//if we expected JSON and JSON was not returned
        var options = this.request.options;
        try {
            return WLJSX.String.evalJSON(this.responseText, (options.sanitizeJSON || !this.request.isSameOrigin()));
        } catch (e) {
            if (    !options.evalJSON 
                    || (options.evalJSON != 'force' && (this.getHeader('Content-type') || '').indexOf('application/json') < 0) 
                    || WLJSX.String.isBlank(this.responseText))
                return null;
            else
                this.request.dispatchException(e);
        }
    }
});

