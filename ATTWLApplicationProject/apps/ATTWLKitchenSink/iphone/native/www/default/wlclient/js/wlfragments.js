
/* JavaScript content from wlclient/js/wlfragments.js in Common Resources */
/*
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

/*
Script: Ensure.js

Ensure library
    A tiny javascript library that provides a handy function "ensure" which allows you to load 
    Javascript, HTML, CSS on-demand and then execute your code. Ensure ensures that relevent 
    Javascript and HTML snippets are already in the browser DOM before executing your code 
    that uses them.
    
    To download last version of this script use this link: <http://www.codeplex.com/ensure>

Version:
    1.0 - Initial release

Compatibility:
    FireFox - Version 2 and 3
    Internet Explorer - Version 6 and 7
    Opera - 9 (probably 8 too)
    Safari - Version 2 and 3 
    Konqueror - Version 3 or greater

Dependencies:
    <jQuery.js> 
    <MicrosoftAJAX.js>
    <Prototype-1.6.0.js>

Credits:
    - Global Javascript execution - <http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html>
    
Author:
    Omar AL Zabir - http://msmvps.com/blogs/omar

License:
    >Copyright (C) 2008 Omar AL Zabir - http://msmvps.com/blogs/omar
    >   
    >Permission is hereby granted, free of charge,
    >to any person obtaining a copy of this software and associated
    >documentation files (the "Software"),
    >to deal in the Software without restriction,
    >including without limitation the rights to use, copy, modify, merge,
    >publish, distribute, sublicense, and/or sell copies of the Software,
    >and to permit persons to whom the Software is furnished to do so,
    >subject to the following conditions:
    >
    >The above copyright notice and this permission notice shall be included
    >in all copies or substantial portions of the Software.
    >
    >THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
    >INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    >FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    >IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    >DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
    >ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
    >OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function() {
    window.ensureEVAL_JS_SRC = "eval_src";
    window.ensure = function(data, callback, scope) {
	// There's a test criteria which when false, the associated components must be loaded. But if true,
	// no need to load the components
	if (typeof data.test != "undefined") {
	    var test = function() {
		return data.test;
	    };

	    if (typeof data.test == "string") {
		test = function() {
		    // If there's no such Javascript variable and there's no such DOM element with ID then
		    // the test fails. If any exists, then test succeeds
		    return !(eval("typeof " + data.test) == "undefined" && document.getElementById(data.test) == null);
		};
	    } else if (typeof data.test == "function") {
		test = data.test;
	    }

	    // Now we have test prepared, time to execute the test and see if it returns null, undefined or
	    // false
	    // in any
	    // scenario. If it does, then load the specified javascript/html/css
	    if (test() === false || typeof test() == "undefined" || test() == null) {
		new ensureExecutor(data, callback, scope);
	    } else {
		// Test succeeded! Just fire the callback
		callback();
	    }
	} else {
	    // No test specified. So, load necessary javascript/html/css and execute the callback
	    new ensureExecutor(data, callback, scope);
	}
    };

    // ensureExecutor is the main class that does the job of ensure.
    window.ensureExecutor = function(data, callback, scope) {
	this.data = WLJSX.Object.clone(data);
	this.callback = (typeof scope == "undefined" || null == scope ? callback : this.delegate(callback, scope));
	this.loadStack = [];

	if (data.js && data.js.constructor != Array) {
	    this.data.js = [data.js];
	}
	if (data.html && data.html.constructor != Array) {
	    this.data.html = [data.html];
	}
	if (data.css && data.css.constructor != Array) {
	    this.data.css = [data.css];
	}

	if (typeof data.js == "undefined") {
	    this.data.js = [];
	}
	if (typeof data.html == "undefined") {
	    this.data.html = [];
	}
	if (typeof data.css == "undefined") {
	    this.data.css = [];
	}

    // Added logging for Deprecated WL.Page and WL.Fragment APIs 
	//WL.Logger.debug("The WL.Page and WL.Fragment APIs are deprecated. Developers are advised to use the fragments implementation of JS frameworks such as: jQuery Mobile, Sencha, Dojo Mobile.");

	this.init();
	this.load();
    };

    window.ensureExecutor.prototype = {
	init : function() {
	    this.getJS = HttpLibrary.loadJavascript_Prototype;
	    this.httpGet = HttpLibrary.httpGet_Prototype;
	},

	getJS : function(data) {
	    // abstract function to get Javascript and execute it
	},

	httpGet : function(url, callback) {
	    // abstract function to make HTTP GET call
	},

	load : function() {
	    this.loadJavascripts(this.delegate(function() {
		this.loadCSS(this.delegate(function() {
		    this.loadHtml(this.delegate(function() {
			this.callback();
		    }));
		}));
	    }));
	},

	loadJavascripts : function(complete) {
	    var scriptsToLoad = this.data.js.length;
	    if (0 === scriptsToLoad) {
		return complete();
	    }

	    this.forEach(this.data.js, function(href) {
		if (HttpLibrary.isUrlLoaded(href) || this.isTagLoaded('script', 'src', href)) {
		    scriptsToLoad = (scriptsToLoad > 0) ? scriptsToLoad - 1 : scriptsToLoad;
		} else {
		    WL.Logger.debug("Loading js file " + href);
		    this.getJS({
			url : href,
			success : this.delegate(function(content) {
			    scriptsToLoad = (scriptsToLoad > 0) ? scriptsToLoad - 1 : scriptsToLoad;
			    HttpLibrary.registerUrl(href);
			}),
			error : this.delegate(function(msg) {
			    scriptsToLoad = (scriptsToLoad > 0) ? scriptsToLoad - 1 : scriptsToLoad;
			    if (typeof this.data.error == "function") {
				this.data.error(href, msg);
			    }
			})
		    });
		}
	    });

	    // wait until all the external scripts are downloaded
	    this.until({
		test : function() {
		    return scriptsToLoad === 0;
		},
		delay : 50,
		callback : this.delegate(function() {
		    complete();
		})
	    });
	},

	loadCSS : function(complete) {
	    if (0 === this.data.css.length) {
		return complete();
	    }

	    var head = HttpLibrary.getHead();
	    this.forEach(this.data.css, function(href) {
		if (HttpLibrary.isUrlLoaded(href) || this.isTagLoaded('link', 'href', href)) {
		    // Do nothing
		} else {
		    WL.Logger.debug("Loading css file " + href);
		    var self = this;
		    try {
			(function(href, head) {
			    var link = document.createElement('link');
			    link.setAttribute("href", href);
			    link.setAttribute("rel", "Stylesheet");
			    link.setAttribute("type", "text/css");
			    head.appendChild(link);

			    HttpLibrary.registerUrl(href);
			}).apply(window, [href, head]);
		    } catch (e) {
			if (typeof self.data.error == "function") {
			    self.data.error(href, e.message);
			}
		    }
		}
	    });

	    complete();
	},

	loadHtml : function(complete) {
	    var htmlToDownload = this.data.html.length;
	    if (0 === htmlToDownload) {
		return complete();
	    }

	    this.forEach(this.data.html, function(href) {
		if (HttpLibrary.isUrlLoaded(href)) {
		    htmlToDownload--;
		} else {
		    WL.Logger.debug("Loading html file " + href);
		    this.httpGet({
			url : href,
			success : this.delegate(function(content) {
			    HttpLibrary.registerUrl(href);

			    var parent = (this.data.parent || document.body.appendChild(document.createElement("div")));
			    if (typeof parent == "string") {
				parent = document.getElementById(parent);
			    }
			    var safeInnerHtmlOptions = {
				onSuccess : function() {
				    htmlToDownload--;
				}.bind(this),
				onFailure : function() {
				    htmlToDownload--;
				    if (typeof this.data.error == "function") {
					this.data.error(href, "WL.Utils.safeInnerHTML failed for '" + parent.id + "' and content '" + content + "'");
				    }
				}.bind(this)
			    };

			    var safeInnerHTML = function(target, contentToSet, options) {
				// iPhone sometimes just fails to set innerHTML - no idea why. you
				// end up with an empty div.
				// it's more reliable with a setTimeout but still not reliable
				// enough.
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
					WL.Logger.debug("safeInnerHtml error. Could not perform " + target.id + ".innerHtml = " + contentToSet).bind(this);
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
					WL.Logger.debug(target.id + ".innerHTML failed. number of attempts remaining: " + count + " ( + " + timeout + "ms timeout)");
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

			    safeInnerHTML(parent, content, safeInnerHtmlOptions);
			}),
			error : this.delegate(function(msg) {
			    htmlToDownload--;
			    if (typeof this.data.error == "function") {
				this.data.error(href, msg);
			    }
			})
		    });
		}
	    });

	    // wait until all the external scripts are downloaded
	    this.until({
		test : function() {
		    return htmlToDownload === 0;
		},
		delay : 50,
		callback : this.delegate(function() {
		    complete();
		})
	    });
	},

	forEach : function(arr, callback) {
	    var self = this;
	    for ( var i = 0; i < arr.length; i++) {
		callback.apply(self, [arr[i]]);
	    }
	},

	delegate : function(func, obj) {
	    var context = obj || this;
	    return function() {
		func.apply(context, arguments);
	    };
	},

	until : function(o /* o = { test: function(){...}, delay:100, callback: function(){...} } */) {
	    if (o.test() === true) {
		o.callback();
	    } else {
		window.setTimeout(this.delegate(function() {
		    this.until(o);
		}), o.delay || 50);
	    }
	},

	isTagLoaded : function(tagName, attName, value) {
	    // Create a temporary tag to see what value browser eventually
	    // gives to the attribute after doing necessary encoding
	    var tag = document.createElement(tagName);
	    tag[attName] = value;
	    var tagFound = false;
	    var tags = document.getElementsByTagName(tagName);
	    this.forEach(tags, function(t) {
		if (tag[attName] === t[attName]) {
		    tagFound = true;
		    return false;
		}
	    });
	    return tagFound;
	}
    };

    var userAgent = navigator.userAgent.toLowerCase();

    // HttpLibrary is a cross browser, cross framework library to perform common operations
    // like HTTP GET, injecting script into DOM, keeping track of loaded url etc. It provides
    // implementations for various frameworks including jQuery, MSAJAX or Prototype
    var HttpLibrary = {
	browser : {
	    version : (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
	    blackberry : /blackberry/.test(userAgent),
	    safari : /webkit/.test(userAgent) && !/adobeair/.test(userAgent),
	    opera : /opera/.test(userAgent),
	    msie : /msie/.test(userAgent) && !/opera/.test(userAgent),
	    mozilla : /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
	},
	loadedUrls : {},

	isUrlLoaded : function(url) {
	    return HttpLibrary.loadedUrls[url] === true;
	},

	unregisterUrl : function(url) {
	    HttpLibrary.loadedUrls[url] = false;
	},

	registerUrl : function(url) {
	    HttpLibrary.loadedUrls[url] = true;
	},

	createScriptTag : function(url, success, error) {
	    var scriptTag = document.createElement("script");
	    scriptTag.setAttribute("src", url);
	    scriptTag.onload = scriptTag.onreadystatechange = function() {
		if ((!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
		    success();
		}
	    };
	    scriptTag.onerror = function() {
		error(data.url + " failed to load");
	    };
	    var head = HttpLibrary.getHead();
	    head.appendChild(scriptTag);
	},

	getHead : function() {
	    return document.getElementsByTagName("head")[0] || document.documentElement;
	},

	globalEval : function(data, url) {
	    var script = document.createElement("script");
	    script.setAttribute(ensureEVAL_JS_SRC, url);
	    if (HttpLibrary.browser.msie) {
		script.text = data;
	    } else {
		script.appendChild(document.createTextNode(data));
	    }
	    var head = HttpLibrary.getHead();
	    head.appendChild(script);
	},
	// Itai: I removed the JQuery support.
	loadJavascript_Prototype : function(data) {
	    if (HttpLibrary.browser.safari || HttpLibrary.browser.blackberry) {
		var params = {
		    url : data.url,
		    success : function(content) {
			HttpLibrary.globalEval(content, data.url);
			data.success(content);
		    },
		    error : data.error
		};
		HttpLibrary.httpGet_Prototype(params);
	    } else {
		HttpLibrary.createScriptTag(data.url, data.success, data.error);
	    }
	},

	httpGet_Prototype : function(data) {
	    new WLJSX.Ajax.Request(data.url, {
		method : 'get',
		evalJS : false, // Make sure prototype does not automatically eval scripts
		onSuccess : function(transport, json) {
		    data.success(transport.responseText || "");
		},
		onFailure : data.error
	    });
	}
    };
    window.HttpLibrary = HttpLibrary;
})();

WL.FragmentContext = WLJSX.Class.create({
    scriptSrcs : [],
    cssHrefs : [],
    fragmentPath : null,
    onUnload : null
});

__WLFragment = function() {
    var FRAGMENT_CLASS = "fhtml";

    // Match script tag and its src attr regex (IE only):
    var scriptRegex = /<script (.|\n)*?>(.|\n)*?<\/script>/gi;
    var srcRegex = /src.*?=.*?("|')(.*?)("|')/i;

    // Match link tag and its href attr regex (IE only):
    var linkRegex = /<link (.|\n)*? (\/>|>(.|\n)*?<\/link>)/gi;
    var hrefRegex = /href.*?=.*?("|')(.*?)("|')/i;

    function unloadFragment(element) {
	var subfragments = WLJSX.find(element, "." + FRAGMENT_CLASS);
	subfragments.each(function() {
		var subf = $(this);
	    unregisterFragmentContext(subf);
	});
	unregisterFragmentContext(element);

    }

    function unregisterFragmentContext(element) {
		if (!element.fcontext) {
			return;
		}

		for (var i=0; i<element.fcontext.scriptSrcs.length; i++){
			var scriptSrc = element.fcontext.scriptSrcs[i];
			var scriptArr = document.getElementsByTagName("script");
			for ( var i = 0; i < scriptArr.length; i++) {
				if (scriptArr[i].getAttribute("src") == scriptSrc || scriptArr[i].getAttribute(ensureEVAL_JS_SRC) == scriptSrc) {
					WL.Logger.debug("Removing script file " + scriptSrc);
					scriptArr[i].parentNode.removeChild(scriptArr[i]);
					HttpLibrary.unregisterUrl(scriptSrc);
				}
			}
		}
/*
	element.fcontext.scriptSrcs.each(function(scriptSrc) {
	    var scriptArr = document.getElementsByTagName("script");
	    for ( var i = 0; i < scriptArr.length; i++) {
			if (scriptArr[i].getAttribute("src") == scriptSrc || scriptArr[i].getAttribute(ensureEVAL_JS_SRC) == scriptSrc) {
				WL.Logger.debug("Removing script file " + scriptSrc);
				scriptArr[i].parentNode.removeChild(scriptArr[i]);
				HttpLibrary.unregisterUrl(scriptSrc);
			}
	    }
	});
*/

		for (var i=0; i<element.fcontext.cssHrefs.length; i++){
			var linkHref = element.fcontext.cssHrefs[i];
			var cssArr = document.getElementsByTagName("link");
			for ( var i = 0; i < cssArr.length; i++) {
				if (cssArr[i].getAttribute("href") == linkHref) {
					WL.Logger.debug("Removing css file " + linkHref);
					cssArr[i].parentNode.removeChild(cssArr[i]);
					HttpLibrary.unregisterUrl(linkHref);
				}
			}
		}

/*
	element.fcontext.cssHrefs.each(function(linkHref) {
	    var cssArr = document.getElementsByTagName("link");
	    for ( var i = 0; i < cssArr.length; i++) {
		if (cssArr[i].getAttribute("href") == linkHref) {
		    WL.Logger.debug("Removing css file " + linkHref);
		    cssArr[i].parentNode.removeChild(cssArr[i]);
		    HttpLibrary.unregisterUrl(linkHref);
		}
	    }
	});
*/
	if (typeof element.fcontext.onUnload == 'function') {
	    try {
		WL.Logger.debug("onUnload fragment " + element.fcontext.fragmentPath);
		element.fcontext.onUnload();
	    } catch (e) {
		WL.Logger.error("onUnload failed. JavaScript objects from " + element.fcontext.fragmentPath + " were not deleted.");
	    }
	} else if (element.fcontext.scriptSrcs.length > 0) {
	    WL.Logger.error("onUnload function is not defined. JavaScript objects from " + element.fcontext.fragmentPath + " were not deleted.");
	}
	HttpLibrary.unregisterUrl(element.fcontext.fragmentPath);
    }

    function parseJavaScriptSrcsFromElement(parent) {
	var srcs = [];
	var scriptTags = WLJSX.find(parent, "script");
	scriptTags.each(function() {
		var scriptTag = $(this);
	    WLJSX.remove(scriptTag);
	    srcs[srcs.length] = WLJSX.attr(scriptTag, "src");
	});
	return srcs;
    }

    /**
     * Parses script srcs from the html using regex. Used on IE only.
     * @param html
     * @return an array of src paths
     */
    function parseJavaScriptSrcsByRegex(html) {
	var srcs = [];
	while (script = scriptRegex.exec(html)) {
	    result = srcRegex.exec(script);
	    if (result && result[2]) {
		srcs[srcs.length] = result[2];
	    }
	}
	return srcs;
    }

    /**
     * Parses css links from the html using regex. Used on IE only.
     * @param html
     * @return an array of css paths
     */
    function parseCssHrefsByRegex(html) {
	var hrefs = [];
	while (script = linkRegex.exec(html)) {
	    result = hrefRegex.exec(script);
	    if (result && result[2]) {
		hrefs[hrefs.length] = result[2];
	    }
	}
	return hrefs;
    }

    function parseCssHrefsFromElement(parent) {
	var hrefs = [];
	var linkTags = WLJSX.find(parent, "link");
	linkTags.each(function() {
		var linkTag = $(this);
	    hrefs[hrefs.length] = WLJSX.attr(linkTag,"href");
	    WLJSX.remove(linkTag);
	});
	return hrefs;
    }

    /**
     * When using innerHTML on IE - all script and css tags are lost. The workaround is parse the html before
     * it is added to the dom. Parsing is done using regex which is an unsafe technique.
     * @param fragmentPath
     * @param parent
     * @param options
     * @return undefined
     */
    function loadFragment(fragmentPath, parent, options) {

	if (WL.StaticAppProps.ENVIRONMENT === WL.Env.VISTA_SIDEBAR) {
	    WL.Logger.error("Fragments are not supported on Sidebar gadgets");
	    return;
	}

	if (typeof options == "undefined") {
	    options = {};
	}

	function onFragmentLoaded(response) {
	    var fcontext = new WL.FragmentContext();
	    fcontext.fragmentPath = fragmentPath;
	    if (options && options.onUnload) {
	    	fcontext.onUnload = options.onUnload;
	    }
	    parent.fcontext = fcontext;
	    WLJSX.addClass(parent, FRAGMENT_CLASS);

	    if (HttpLibrary.browser.msie) {
		fcontext.scriptSrcs = parseJavaScriptSrcsByRegex(response.responseText);
		fcontext.cssHrefs = parseCssHrefsByRegex(response.responseText);
		// This line cleans the reponse HTML, because Ensure searches it for script
		// tags in order to prevent loading the same script multiple times
		var cleanHTML = cleanHTMLFromJsAndCss(response.responseText, fcontext.scriptSrcs, fcontext.cssHrefs);
		parent.innerHTML = cleanHTML;
	    } else {
		fcontext.scriptSrcs = parseJavaScriptSrcsFromElement(parent);
		fcontext.cssHrefs = parseCssHrefsFromElement(parent);
		WL.Utils.replaceElementsText(parent.id);
		WLJSX.show(parent);
	    }

	    ensure({
		js : fcontext.scriptSrcs,
		css : fcontext.cssHrefs
	    }, function() {
		if (options && options.onComplete) {
		    options.onComplete();
		}
	    });
	}

	function onFragmentFailure(href, message) {
	    WL.Logger.error("WL.Fragment.load() failed loading file " + href + ". " + message.responseText);
	    WLJSX.show(parent);
	}

	if (HttpLibrary.browser.msie) {
	    // Getting the page by creating an AJAX call in IE
	    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	    xmlhttp.onreadystatechange = function() {
	    // in msie sometimes on ajax to local pages status is 0
	    if (xmlhttp.readyState == 4 && (xmlhttp.status == 200 || xmlhttp.status == 0)) {
		    onFragmentLoaded(xmlhttp);
		}
	    };
	    xmlhttp.open("GET", fragmentPath, true);
	    xmlhttp.send();
	} else {
	    // All browsers except IE use Ensure to load the page
	    WLJSX.hide(parent);
	    ensure({
		html : fragmentPath,
		parent : parent,
		error : onFragmentFailure
	    }, onFragmentLoaded);
	}
    }

    function cleanHTMLFromJsAndCss(cleanHTML, scriptSrcs, cssHrefs) {
	for ( var i = 0; i < scriptSrcs.length; i++) {
	    cleanHTML = cleanHTML.replace(scriptSrcs[i], "");
	}
	for ( var i = 0; i < cssHrefs.length; i++) {
	    cleanHTML = cleanHTML.replace(cssHrefs[i], "");
	}
	return cleanHTML;
    }
    /**
     * @deprecated Use the fragment implementation of JS frameworks such as: jQuery Mobile, Sencha, Dojo Mobile.
     * 
     */
    this.load = function(fragmentPath, parent, options) {

	WL.Validators.validateArguments(['string', 'object', WL.Validators.validateOptions.curry({
	    onComplete : 'function',
	    onUnload : 'function'
	})], arguments, "WL.Fragment.load");
	unloadFragment(parent);

	WL.Logger.debug("Loading fragment " + fragmentPath);
	loadFragment(fragmentPath, parent, options);
    };
};
__WL.prototype.Fragment = new __WLFragment;
WL.Fragment = new __WLFragment;

__WLPage = function() {

    var pagePortId = "pagePort";
    var currentPage = null;
    var pageHistory = [];

    this.onUnload = null;

    /**
     * @deprecated Use the fragment implementation of JS frameworks such as: jQuery Mobile, Sencha, Dojo Mobile.
     * 
     */
    this.load = function(pagePath, options) {
	WL.Validators.validateArguments(['string', WL.Validators.validateOptions.curry({
	    onComplete : 'function',
	    onUnload : 'function'
	})], arguments, "WL.Page.load");
	if (typeof options == "undefined") {
	    options = {};
	}
	var pagePort = WLJSX.$(pagePortId);
	if (!pagePort) {
	    var msg = "Failed loading page. HTML is missing an element id 'pagePort'.";
	    WL.Logger.error(msg);
	    throw new Error(msg);
	}
	currentPage = {
	    pagePath : pagePath,
	    options : options
	};
	pageHistory.push(currentPage);
	// Set the default Page onUnload if a specific one isnt set.
	if (!options.onUnload && this.onUnload) {
	    options.onUnload = this.onUnload;
	}

	WL.Fragment.load(pagePath, pagePort, options);
    };
    /**
     * @deprecated Use the fragment implementation of JS frameworks such as: jQuery Mobile, Sencha, Dojo Mobile.
     * 
     */
    this.back = function(options) {
	WL.Validators.validateOptions({
	    pagesBack : 'number'
	}, options, "WL.Page.back");
	var backPath = null;
	if (typeof options == "undefined") {
	    options = {};
	}
	if (typeof options.pagesBack == "undefined") {
	    options.pagesBack = 1;
	}
	if (options.pagesBack < 1) {
	    WL.Logger.error("pagesBack option must be greater than 0.");
	    delete options.pagesBack;
	} else {
	    if (pageHistory.length > options.pagesBack) {
		for ( var i = 0; i < options.pagesBack; i++) {
		    pageHistory.pop();
		    var historyObject = pageHistory[pageHistory.length - 1];
		    backPath = historyObject.pagePath;
		}
	    } else {
		WL.Logger.error("Can't go back " + options.pagesBack + " pages. No page found.");
	    }
	}
	if (backPath) {
	    // no need to send it to load
	    delete options.pagesBack;
	    WL.Fragment.load(backPath, WLJSX.$(pagePortId), historyObject.options);
	} else if (options && options.onFailure) {
	    options.onFailure("End of navigation history");
	}

	return false;
    };
    /**
     * @deprecated Use the fragment implementation of JS frameworks such as: jQuery Mobile, Sencha, Dojo Mobile.
     * 
     */
    this.hasBack = function() {
	return (pageHistory.length > 1);
    };
};
__WL.prototype.Page = new __WLPage;
WL.Page = new __WLPage;
