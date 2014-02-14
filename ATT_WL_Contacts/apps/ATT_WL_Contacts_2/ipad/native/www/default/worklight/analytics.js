

/**
 * ================================================================= 
 * Source file taken from :: Tealeaf.min.js
 * ================================================================= 
 */

/*
 * Licensed Materials - Property of IBM
 * 5725-I43 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *
 * @version 3.0.0.823
 * @flags w3c,DEBUG
 */

var TLT=function(){function f(c,j,l){var a=null,b=TLT.getService("queue"),q=TLT.getModule("replay"),d=null;if(j&&"string"===typeof j){if(!l||"string"!==typeof l)l="";a={type:2,screenview:{type:c,name:j,url:window.location.pathname,referrer:l}};"LOAD"===c&&q&&(d={type:"screenview_load"},q.onevent(d));("LOAD"===c||"UNLOAD"===c)&&b.post("",a,"DEFAULT")}}var e={},h={},p=!1,m=null,b=function(c){if(0>g.utils.indexOf(d,c)){var j=c.ownerDocument,l=g.getService("browser"),b=g.getCoreConfig().framesBlacklist,
q,s;a=a||[];j=j||null;if("undefined"!==typeof b&&0<b.length){for(s=0;s<b.length;s+=1)(q=l.query(b[s],j))&&a.push(q);d=d.concat(l.queryAll("iframe",j))}}return-1<g.utils.indexOf(a,c)},a,d=[];b.clearCache=function(){a=null};var n={config:"getConfig updateConfig getCoreConfig updateCoreConfig getModuleConfig updateModuleConfig getServiceConfig updateServiceConfig".split(" "),queue:["post","setAutoFlush","flushAll"],browserBase:["processDOMEvent"]},t,r={};t={normalizeModuleEvents:function(c,j){var l=
!1,a=!1;g.getService("browser");r[c]={loadFired:!1,pageHideFired:!1};g.utils.forEach(j,function(c){switch(c.name){case "load":l=!0;j.push(g.utils.mixin(g.utils.mixin({},c),{name:"pageshow"}));break;case "unload":a=!0,j.push(g.utils.mixin(g.utils.mixin({},c),{name:"pagehide"})),j.push(g.utils.mixin(g.utils.mixin({},c),{name:"beforeunload"}))}});!l&&!a?delete r[c]:(r[c].silentLoad=!l,r[c].silentUnload=!a,l||j.push({name:"load",target:window.window}),a||j.push({name:"unload",target:window.window}))},
canPublish:function(c,j){var l;if(!1===r.hasOwnProperty(c))return!0;l=r[c];switch(j.type){case "load":return l.pageHideFired=!1,l.loadFired=!0,!l.silentLoad;case "pageshow":return l.pageHideFired=!1,j.type="load",!l.loadFired&&!l.silentLoad;case "pagehide":return j.type="unload",l.loadFired=!1,l.pageHideFired=!0,!l.silentUnload;case "unload":case "beforeunload":return j.type="unload",l.loadFired=!1,!l.pageHideFired&&!l.silentUnload}return!0},isUnload:function(c){return"object"===typeof c?"unload"===
c.type||"beforeunload"===c.type||"pagehide"===c.type:!1}};var k={},F=function(){},A=null,y=!0,s=null,C=!1,B=!1,v=-1<navigator.userAgent.indexOf("iPhone")||-1<navigator.userAgent.indexOf("iPod")||-1<navigator.userAgent.indexOf("iPad"),u=function(c,j,l){l=l||g._getLocalTop().document;E=E||new g.utils.WeakMap;var a=l,q=g.getService("browserBase"),d=g.getService("browser"),s=g.utils.getDocument(a),n=g.utils.isIFrameDescendant(a),a=a||s;t.normalizeModuleEvents(c,j);g.utils.forEach(j,function(j){var l=
j.target||s,b="";!0!==j.recurseFrames&&n||("string"===typeof l?g.utils.forEach(d.queryAll(l,a),function(l){var a=E.get(l);a||(a=q.ElementData.prototype.examineID(l),E.set(l,a));b=j.name+"|"+a.id+a.type;-1===g.utils.indexOf(k[b],c)&&(k[b]=k[b]||[],k[b].push(c),k[b].target=l,d.subscribe(j.name,l,g._publishEvent))}):(b=g._buildToken4bubbleTarget(j.name,l,"undefined"===typeof j.target),k.hasOwnProperty(b)?-1===g.utils.indexOf(k[b],c)&&k[b].push(c):(k[b]=[c],d.subscribe(j.name,l,g._publishEvent))),""!==
b&&"string"!==typeof l&&(k[b].target=l))});if("performance"!==c){var u=null;l=l.getElementsByTagName("iframe");var e,y;e=0;for(y=l.length;e<y;e+=1)u=l[e],b(u)||(u.contentWindow&&u.contentWindow.document&&"complete"===u.contentWindow.document.readyState&&g._hasSameOrigin(u.contentWindow)?g._registerModuleEvents(c,j,u.contentWindow.document):function(c,j,l){var a={moduleName:c,moduleEvents:j,hIFrame:l,_registerModuleEventsDelayed:function(){!b(l)&&g._hasSameOrigin(l.contentWindow)&&g._registerModuleEvents(c,
j,l.contentWindow.document)}};g.utils.addEventListener(l,"load",function(){a._registerModuleEventsDelayed()})}(c,j,u))}},E;u.clearCache=function(){E&&(E.clear(),E=null)};var w=function(c,j){this.message=c;this.code=j};w.prototype=Error();w.prototype.name="UICError";w.prototype.constructor=w;var g={init:function(c,j){var l;A=j;if(!y)throw"init must only be called once!";y=!1;l=function(a){a=a||window.event||{};if(document.addEventListener||"load"===a.type||"complete"===document.readyState)document.removeEventListener?
(document.removeEventListener("DOMContentLoaded",l,!1),window.removeEventListener("load",l,!1)):(document.detachEvent("onreadystatechange",l),window.detachEvent("onload",l)),F(c,j)};"complete"===document.readyState?setTimeout(l):document.addEventListener?(document.addEventListener("DOMContentLoaded",l,!1),window.addEventListener("load",l,!1)):(document.attachEvent("onreadystatechange",l),window.attachEvent("onload",l))},isInitialized:function(){return p},getState:function(){return m},destroy:function(c){var j=
"",l="",a=null,q=null,d=l=null;this.stopAll();if(!c)for(j in d=this.getService("browser"),k)k.hasOwnProperty(j)&&null!==d&&(l=j.split("|")[0],a=k[j].target,d.unsubscribe(l,a,this._publishEvent));for(q in h)h.hasOwnProperty(q)&&((l=h[q].instance)&&"function"===typeof l.destroy&&l.destroy(),h[q].instance=null);b.clearCache();k={};p=!1;y=!0;m="destroyed";if("function"===typeof A)try{A("destroyed")}catch(g){}},_updateModules:function(c){var j=this.getCoreConfig(),a=this.getService("browser"),b=null,q=
null;if(j&&a&&j.modules)try{for(q in j.modules)j.modules.hasOwnProperty(q)&&(b=j.modules[q],e.hasOwnProperty(q)?(!1===b.enabled?this.stop(q):this.start(q),b.events&&null!==a&&this._registerModuleEvents(q,b.events,c)):a.loadScript&&a.loadScript(j.moduleBase+q+".js"));this._registerModuleEvents.clearCache()}catch(d){return g.destroy(),!1}else return!1;return!0},rebind:function(c){g._updateModules(c)},getSessionData:function(){var c=null,j=null,a,b,j=g.getCoreConfig();if(!j||!j.sessionDataEnabled)return null;
j=j.sessionData||{};(a=j.sessionQueryName)?b=g.utils.getQueryStringValue(a,j.sessionQueryDelim):(a=j.sessionCookieName||"TLTSID",b=g.utils.getCookieValue(a));a&&b&&(c=c||{},c.tltSCN=a,c.tltSCV=b,c.tltSCVNeedsHashing=!!j.sessionValueNeedsHashing);return c},logCustomEvent:function(c,j){var a=null,b=this.getService("queue");if(!c||"string"!==typeof c)c="CUSTOM";j=j||{};a={type:5,customEvent:{name:c,data:j}};b.post("",a,"DEFAULT")},logExceptionEvent:function(c,j,a){var b=null,q=this.getService("queue");
c&&"string"===typeof c&&(b={type:6,exception:{description:c,url:j||"",line:a||""}},q.post("",b,"DEFAULT"))},logScreenviewLoad:function(c,j,a){f("LOAD",c,j,a)},logScreenviewUnload:function(c){f("UNLOAD",c)},_hasSameOrigin:function(c){try{return c.document.location.host===document.location.host&&c.document.location.protocol===document.location.protocol}catch(j){}return!1},_registerModuleEvents:u,_buildToken4currentTarget:function(c){var j=c.nativeEvent.currentTarget,j=this.getService("browserBase").ElementData.prototype.examineID(j);
return c.type+"|"+j.id+j.type},_buildToken4bubbleTarget:function(c,j,a){var q=g._getLocalTop(),d=g.utils.getDocument(j),s=this.getService("browserBase"),u=null;if(j===window||j===window.window)c+="|null-2|window";else if(a&&g._hasSameOrigin(q)&&"undefined"!==typeof d&&q.document!==d){var n=null;g._hasSameOrigin(q)&&g.utils.forEach(q.document.getElementsByTagName("iframe"),function(c){!b(c)&&(g._hasSameOrigin(c.contentWindow)&&c.contentWindow.document===d)&&(n=c)});if(u=n)j=s.ElementData.prototype.examineID(u),
c+="|"+j.xPath+"-2"}else c+="|null-2|document";return c},_reinitConfig:function(){g._updateModules()},_handleTouchStart:function(c){var j,a;if(v)return!1;if(null===s)return s=c,!0;for(j=0;j<s.nativeEvent.touches.length;j+=1)for(a=0;a<c.nativeEvent.touches.length;a+=1)if(s.nativeEvent.touches[j]===c.nativeEvent.touches[a])return!0;g._prepNonIosTouchEnd();s=c;return!0},_handleTouchMove:function(c){v||(s=c)},_handleTouchScroll:function(c){if(v)return!1;null!==s&&"scroll"===c.type&&(s.target.position.x=
c.target.position.x,s.target.position.y=c.target.position.y,C=!0);return!0},_prepNonIosTouchEnd:function(){var c=!1;null!==s&&(s.type="touchend",s.nativeEvent.type="touchend",g._publishEvent(s),C&&(s.type="scroll",s.nativeEvent.type="scroll",B=!0,g._publishEvent(s)),c=!0);s=null;B=C=!1;return c},_publishEvent:function(c){var a=null,b=null,a=c.type+"|"+c.target.id+c.target.idType,q=null,d,u,n=null,e=!1;g.getService("browser");if(!("load"===c.type||"pageshow"===c.type)||c.nativeEvent.customLoad)if(!v||
!("touchstart"===c.type||"touchmove"===c.type)){if(null!==s&&"touchstart"!==c.type&&"touchmove"!==c.type&&"scroll"!==c.type&&"touchend"!==c.type)g._prepNonIosTouchEnd();else{if("touchstart"===c.type){g._handleTouchStart(c);return}if("touchmove"===c.type){g._handleTouchMove(c);return}if(null!==s&&"scroll"===c.type&&!B){g._handleTouchScroll(c);return}C&&(a="scroll|null-2|window")}t.isUnload(c)&&(m="unloading");if("propertychange"===c.type)if("checked"===c.nativeEvent.propertyName&&("checkbox"===c.target.element.type||
"radio"===c.target.element.type&&c.target.element.checked))c.type=c.target.type="change";else return;!k.hasOwnProperty(a)&&(c.nativeEvent&&c.nativeEvent.currentTarget)&&(a=g._buildToken4currentTarget(c));k.hasOwnProperty(a)||(c.hasOwnProperty("nativeEvent")&&(d=c.nativeEvent.currentTarget||c.nativeEvent.target),a=g._buildToken4bubbleTarget(c.type,d,!0));if(k.hasOwnProperty(a)){q=k[a];d=0;for(u=q.length;d<u;d+=1)if(a=q[d],b=g.getModule(a),n=g.utils.mixin({},c),b&&(g.isStarted(a)&&"function"===typeof b.onevent)&&
(e=t.canPublish(a,n)))b.onevent(n)}n&&("unload"===n.type&&e)&&TLT.destroy()}},_getLocalTop:function(){return window.window},addModule:function(c,a){if(e.hasOwnProperty(c))throw Error("Attempting to add duplicate module '"+c+"' on TLT.");e[c]={creator:a,instance:null,context:null,messages:[]};this.isInitialized()&&this.start(c)},getModule:function(c){return e[c]&&e[c].instance?e[c].instance:null},removeModule:function(c){this.stop(c);delete e[c]},isStarted:function(c){return e.hasOwnProperty(c)&&null!==
e[c].instance},start:function(c){var a=e[c],b=null;if(!e.hasOwnProperty(c))throw Error("Attempting to start nonexistent module '"+c+"' on TLT.");a&&null===a.instance&&(a.context=new TLT.ModuleContext(c,this),b=a.instance=a.creator(a.context),"function"===typeof b.init&&b.init())},startAll:function(){var c=null;for(c in e)e.hasOwnProperty(c)&&this.start(c)},stop:function(c){c=e[c];var a=null;c&&null!==c.instance&&(a=c.instance,"function"===typeof a.destroy&&a.destroy(),c.instance=c.context=null)},
stopAll:function(){var c=null;for(c in e)e.hasOwnProperty(c)&&this.stop(c)},addService:function(c,a){if(h.hasOwnProperty(c))throw Error("Attempting to add duplicate service '"+c+"' on TLT.");h[c]={creator:a,instance:null}},getService:function(c){if(h.hasOwnProperty(c)){if(!h[c].instance){try{h[c].instance=h[c].creator(this),"function"===typeof h[c].instance.init&&h[c].instance.init()}catch(a){if(a.code&&("JQUERYNOTSUPPORTED"===a.code||"NOQUERYSELECTOR"===a.code))return null;throw a;}"function"!==
typeof h[c].instance.getServiceName&&(h[c].instance.getServiceName=function(){return c})}return h[c].instance}return null},removeService:function(c){delete h[c]},broadcast:function(c){var a=null,b=null;if(c&&"object"===typeof c){if(!c.hasOwnProperty("type"))throw Error("Message is missing property 'type'.");for(a in e)if(e.hasOwnProperty(a)&&(b=e[a],-1<g.utils.indexOf(b.messages,c.type)&&"function"===typeof b.instance.onmessage))b.instance.onmessage(c)}},listen:function(c,a){var b=null;this.isStarted(c)&&
(b=e[c],-1===g.utils.indexOf(b.messages,a)&&b.messages.push(a))},fail:function(c,a,b){c="UIC FAILED. "+c;try{g.isInitialized()&&g.destroy(!!b)}finally{throw g.utils.clog(c),new g.UICError(c,a);}},UICError:w},F=function(c){var a;if(p)g.utils.clog("TLT.init() called more than once. Ignoring.");else if(a=g.getService("config"),a.updateConfig(c),g._updateModules()){if(a.subscribe&&a.subscribe("configupdated",g._reinitConfig),p=!0,m="loaded",c={type:"load",target:window.window,srcElement:window.window,
currentTarget:window.window,bubbles:!0,cancelBubble:!1,cancelable:!0,timeStamp:+new Date,customLoad:!0},a=g.getService("browserBase"),c=new a.WebEvent(c),g._publishEvent(c),"function"===typeof A)try{A("initialized")}catch(b){}}else"destroyed"!==m&&g.destroy()},u=null,q;for(u in n)if(n.hasOwnProperty(u)){w=0;for(q=n[u].length;w<q;w+=1)(function(c,a){g[a]=function(){var b=this.getService(c);if(b)return b[a].apply(b,arguments)}})(u,n[u][w])}return g}();
(function(){var f;if("object"===typeof window.console&&"function"===typeof window.console.log&&"function"===typeof window.console.log.apply){var e=window.console;f=function(){e.log.apply(e,arguments)}}else f=function(){};var h;h=window.addEventListener?function(b,a,d){b.addEventListener(a,d,!1)}:function(b,a,d){b.attachEvent("on"+a,d)};var p=function(b,a){var d,n;b=b||[];d=0;for(n=b.length;d<n;d+=1)if(b[d][0]===a)return d;return-1},m={indexOf:function(b,a){var d,n;if(b){d=0;for(n=b.length;d<n;d+=
1)if(b[d]===a)return d}return-1},forEach:function(b,a,d){var n,e;if(b&&b.length&&a&&a.call){n=0;for(e=b.length;n<e;n+=1)a.call(d,b[n],n,b)}},some:function(b,a){var d,n,e=!1;d=0;for(n=b.length;d<n&&!(e=a(b[d],d,b));d+=1);return e},convertToArray:function(b){for(var a=0,d=b.length,n=[];a<d;)n.push(b[a]),a+=1;return n},isUndefOrNull:function(b){return"undefined"===typeof b||null===b},mixin:function(b){var a,d,n,e;n=1;for(e=arguments.length;n<e;n+=1)for(a in d=arguments[n],d)Object.prototype.hasOwnProperty.call(d,
a)&&(b[a]=d[a]);return b},extend:function(b,a,d){var e="";for(e in d)Object.prototype.hasOwnProperty.call(d,e)&&(b&&"[object Object]"===Object.prototype.toString.call(d[e])?("undefined"===typeof a[e]&&(a[e]={}),m.extend(b,a[e],d[e])):a[e]=d[e]);return a},clone:function(b){var a,d;if(null===b||"object"!==typeof b)return b;if(b instanceof Object){a="[object Array]"===Object.prototype.toString.call(b)?[]:{};for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=m.clone(b[d]));return a}},access:function(b,
a){var d=a||window,e,f,r;if(!("string"!==typeof b||"object"!==typeof d&&null!==d)){e=b.split(".");f=0;for(r=e.length;f<r;f+=1)if(!(0===f&&"window"===e[f])){if(!Object.prototype.hasOwnProperty.call(d,e[f]))return;d=d[e[f]];if(f<r-1&&!(d instanceof Object))return}return d}},isNumeric:function(b){return!isNaN(b+1-1)},isUpperCase:function(b){return b===b.toUpperCase()&&b!==b.toLowerCase()},isLowerCase:function(b){return b===b.toLowerCase()&&b!==b.toUpperCase()},getDocument:function(b){return 9!==b.nodeType?
!m.isUndefOrNull(b.ownerDocument)?b.ownerDocument:b.document:b},getWindow:function(b){return b.self!==b?(b=m.getDocument(b),!m.isUndefOrNull(b.defaultView)?b.defaultView:b.parentWindow):b},isIFrameDescendant:function(b){return m.getWindow(b)!=TLT._getLocalTop()},getOrientationMode:function(b){if("number"!==typeof b)return"INVALID";switch(b){case 0:case 180:case 360:b="PORTRAIT";break;case 90:case -90:case 270:b="LANDSCAPE";break;default:b="UNKNOWN"}return b},clog:f,trim:function(b){return!b||!b.toString?
b:b.toString().replace(/^\s+|\s+$/g,"")},ltrim:function(b){return!b||!b.toString?b:b.toString().replace(/^\s+/,"")},rtrim:function(b){return!b||!b.toString?b:b.toString().replace(/\s+$/,"")},getCookieValue:function(b,a){var d,e,f,r,k=null,h;try{a=a||document.cookie;if(!b||!b.toString)return null;b+="=";h=b.length;r=a.split(";");d=0;for(e=r.length;d<e;d+=1)if(f=r[d],f=m.ltrim(f),0===f.indexOf(b)){k=f.substring(h,f.length);break}}catch(p){}return k},getQueryStringValue:function(b,a,d){var e,f,r,k=null,
h;try{d=d||window.location.search;r=d.length;if(!b||!b.toString||!r)return null;a=a||"&";d=a+d.substring(1);b=a+b+"=";e=d.indexOf(b);-1!==e&&(h=e+b.length,f=d.indexOf(a,h),-1===f&&(f=r),k=decodeURIComponent(d.substring(h,f)))}catch(m){}return k},addEventListener:h,WeakMap:function(){var b=[];this.set=function(a,d){var e=p(b,a);b[-1<e?e:b.length]=[a,d]};this.get=function(a){return(a=b[p(b,a)])?a[1]:void 0};this.clear=function(){b=[]};this.has=function(a){return 0<=p(b,a)};this.remove=function(a){a=
p(b,a);0<=a&&b.splice(a,1)};this["delete"]=this.remove}};if("undefined"===typeof TLT||!TLT)window.TLT={};TLT.utils=m})();
(function(){TLT.EventTarget=function(){this._handlers={}};TLT.EventTarget.prototype={constructor:TLT.EventTarget,publish:function(f,e){var h=0,p=0,m=this._handlers[f],b={type:f,data:e};if("undefined"!==typeof m)for(p=m.length;h<p;h+=1)m[h](b)},subscribe:function(f,e){this._handlers.hasOwnProperty(f)||(this._handlers[f]=[]);if("function"!==typeof e)throw Error("Event handler for '"+f+"' isn't a function.");this._handlers[f].push(e)},unsubscribe:function(f,e){var h=0,p=0,m=this._handlers[f];if(m)for(p=
m.length;h<p;h+=1)if(m[h]===e){m.splice(h,1);break}}}})();
TLT.ModuleContext=function(){var f=["broadcast","getConfig:getModuleConfig","listen","post"];return function(e,h){for(var p={},m=0,b=f.length,a=null,d=a=null,m=0;m<b;m+=1)a=f[m].split(":"),1<a.length?(d=a[0],a=a[1]):(d=a[0],a=a[0]),p[d]=function(a){return function(){var b=h.utils.convertToArray(arguments);b.unshift(e);if(!h.hasOwnProperty(a))throw Error("Attempting to access method '"+a+"' on TLT, but it doesn't exist. There's a misconfigured passthru method.");return h[a].apply(h,b)}}(a);p.utils=
h.utils;return p}}();
TLT.addService("config",function(f){function e(a,d){f.utils.extend(!0,a,d);b.publish("configupdated",b.getConfig())}var h={core:{},modules:{},services:{}},p=null,m=null;"function"===typeof Object.create?p=Object.create:(m=function(){},p=function(a){if("object"!==typeof a&&"function"!==typeof a)throw new TypeError("Object prototype need to be an object!");m.prototype=a;return new m});var b=f.utils.extend(!1,p(new TLT.EventTarget),{getConfig:function(){return h},updateConfig:function(a){e(h,a)},getCoreConfig:function(){return h.core},
updateCoreConfig:function(a){e(h.core,a)},getServiceConfig:function(a){return h.services[a]||null},updateServiceConfig:function(a,b){"undefined"===typeof h.services[a]&&(h.services[a]={});e(h.services[a],b)},getModuleConfig:function(a){return h.modules[a]||null},updateModuleConfig:function(a,b){"undefined"===typeof h.modules[a]&&(h.modules[a]={});e(h.modules[a],b)},destroy:function(){h={core:{},modules:{},services:{}}}});return b});
TLT.addService("queue",function(f){function e(){}function h(b,d){var f=a.flush(b),g=null!==f?f.length:0,q=a.get(b),c={"Content-Type":"application/json","X-Tealeaf":"device (UIC) Lib/3.0.0.823","X-TealeafType":"GUI","X-TeaLeaf-Page-Url":window.location.pathname},j=q.serializer||"json",f=s.wrapMessages(f);g&&F.sendRequest({oncomplete:e,url:q.url,async:!d,headers:c,data:A.serialize(f,j)})}function p(a){for(var b=null,d=0,d=0;d<k.length;d+=1)b=k[d],h(b.qid,a);return!0}function m(a,b){window.setTimeout(function g(){h(a);
window.setTimeout(g,b)},b)}function b(){}var a,d=function(a){return"undefined"!==typeof r[a]},n=function(a){return d(a)?r[a]:null},t=function(a){a=n(a);null!==a&&(a.data=[])},r={};a={SEND_HEADER_ONCE:-1,SEND_HEADER_ALWAYS:-2,exists:d,add:function(a,b){d(a)||(r[a]={data:[],queueId:a,url:b.url,threshold:b.threshold,serializer:b.serializer});return r[a]},remove:function(a){d(a)&&delete r[a]},get:n,clear:t,flush:function(a){var b=null;d(a)&&(b=n(a).data,t(a));return b},push:function(a,b){var e=null,e=
null,f=window.tlBridge,q=window.iOSJSONShuttle;if("undefined"!==typeof f&&"function"===typeof f.addMessage)e=JSON.stringify(b),f.addMessage(e);else if("undefined"!==typeof q&&"function"===typeof q)e=JSON.stringify(b),q(e);else if(d(a))return e=n(a),"undefined"!==typeof console&&console.log("Added to queueId: ",a," data: ",b),e.data.push(b);return 0}};var k=null,F=f.getService("browser"),A=f.getService("serializer"),y=f.getService("config"),s=f.getService("message"),C=null,B=!0,v=!1;return{init:function(){if(v)f.utils.clog("Attempt to initialize service which has been already initialized(queueService)");
else{k=y.getServiceConfig("queue")||{};var d=null,e;for(e in k)k.hasOwnProperty(e)&&(d=k[e],"DEFAULT"===d.qid&&(C=d),a.add(d.qid,{url:d.endpoint,threshold:d.maxEvents,serializer:d.serializer,timerInterval:d.timerInterval||0}),"undefined"!==typeof d.timerInterval&&0<d.timerInterval&&m(d.qid,d.timerInterval));y.subscribe("configupdated",b);v=!0}},destroy:function(){B&&p(!0);y.unsubscribe("configupdated",b);C=k=null;v=!1},_getQueue:function(b){return a.get(b).data},getAutoFlushing:function(){return B},
setAutoFlush:function(a){B=1===a?!0:!1},flush:function(b){if(!a.exists(b))throw Error("Queue: "+b+" does not exist!");h(b)},flushAll:function(a){return p(!!a)},post:function(b,d,e){if(!e)a:{e=null;for(var g="",q=0,c=0,q=0;q<k.length;q+=1)if((e=k[q])&&e.modules)for(c=0;c<e.modules.length;c+=1)if(g=e.modules[c],g===b){e=e.qid;break a}e=C.qid}if(!a.exists(e))throw Error("Queue: "+e+" does not exist!");b=e;a.push(b,s.createMessage(d))>=a.get(b).threshold&&(B&&"unloading"!==f.getState())&&h(b)}}});
TLT.addService("browserBase",function(f){function e(){y=f.getService("config");s=f.getService("serializer");C=f.getService("config").getServiceConfig("browser")||{};B=C.hasOwnProperty("blacklist")?C.blacklist:[];v=C.hasOwnProperty("customid")?C.customid:[];u=C.hasOwnProperty("jQueryObject")?f.utils.access(C.jQueryObject):void 0}function h(a){var c,b,d;if(!a||!a.id||"string"!==typeof a.id)return!1;c=0;for(b=B.length;c<b;c+=1)if("string"===typeof B[c]){if(a.id===B[c])return!1}else if("object"===typeof B[c]&&
(d=RegExp(B[c].regex,B[c].flags),d.test(a.id)))return!1;return!0}function p(a){if(!a)return null;a.type&&0===a.type.indexOf("touch")&&("undefined"!==typeof a.originalEvent&&"undefined"!==typeof u&&(a=a.originalEvent),"touchstart"===a.type?a=a.touches[a.touches.length-1]:"touchend"===a.type&&(a=a.changedTouches[0]));return a}function m(a){var c=a||window.event,b=document.documentElement,d=document.body;"undefined"!==typeof c.originalEvent&&("undefined"!==typeof u&&!c.isSimulated)&&(c=c.originalEvent);
if("undefined"===typeof a||"undefined"===typeof c.target){c.target=c.srcElement||window.window;c.timeStamp=Number(new Date);if(null===c.pageX||"undefined"===typeof c.pageX)c.pageX=c.clientX+(b&&b.scrollLeft||d&&d.scrollLeft||0)-(b&&b.clientLeft||d&&d.clientLeft||0),c.pageY=c.clientY+(b&&b.scrollTop||d&&d.scrollTop||0)-(b&&b.clientTop||d&&d.clientTop||0);c.preventDefault=function(){this.returnValue=!1};c.stopPropagation=function(){this.cancelBubble=!0}}return c}function b(a){var c=null;if(!a)return null;
a.srcElement?c=a.srcElement:(c=a.target,c||(c=a.explicitOriginalTarget),c||(c=a.originalTarget));!c&&0===a.type.indexOf("touch")&&(c=p(a).target);for(;c&&F[c.tagName];)c=c.parentNode;!c&&null===a.srcElement&&(c=window.window);return c}function a(a){var c=0,b=0,d=document.documentElement,e=document.body;a=p(a);null!==a&&(a.pageX&&a.pageY&&0<a.pageX&&0<a.pageY?(c=a.pageX,b=a.pageY):a.clientX&&a.clientY&&(c=a.clientX+(d&&d.scrollLeft||e&&e.scrollLeft||0)-(d&&d.clientLeft||e&&e.clientLeft||0),b=a.clientY+
(d&&d.scrollTop||e&&e.scrollTop||0)-(d&&d.clientTop||e&&e.clientTop||0)));return{x:c,y:b}}function d(a,c){this.x=a||0;this.y=c||0}function n(a,c){this.width=a||0;this.height=c||0}function t(a,c){var e,l,f;c=b(a);e=this.examineID(c);l=this.examineType(c,a);f=this.examinePosition(a,c);this.element=c;this.id=e.id;this.idType=e.type;this.type=l.type;this.subType=l.subType;this.state=this.examineState(c);this.position=new d(f.x,f.y);this.size=new n(f.width,f.height);this.xPath=e.xPath;this.name=e.name}
function r(a){var c;if("undefined"===typeof a||null===a||!a.getBoundingClientRect)return{x:0,y:0,width:0,height:0};try{c=a.getBoundingClientRect()}catch(b){return f.utils.clog("getBoundingClientRect failed.",b),{x:0,y:0,width:0,height:0}}return{x:c.left,y:c.top,width:c.right-c.left,height:c.bottom-c.top}}function k(b){var c;b=m(b);c=a(b);this.custom=!1;this.nativeEvent=!0===this.custom?null:b;this.position=new d(c.x,c.y);this.target=new t(b,b.target);this.timestamp=(new Date).getTime();this.type=
b.type}var F={OPTGROUP:!0,OPTION:!0,NOBR:!0},A={},y=f.getService("config"),s,C,B,v,u,E,w=!1,g={NOBR:!0,P:!0};E=function(a){var c;a:{var b;b=!1;for(var d=null,e=b=null,k=[],y=!0;y;)if(y=!1,!f.utils.isUndefOrNull(a)){if(!f.utils.isUndefOrNull(a.tagName))for(c in g)g.hasOwnProperty(c)&&a.tagName.toString()===c&&(a=a.parentNode);for(b=h(a);a!==document&&!b;b=h(a)){e=a.parentNode;e||(b=f.utils.getWindow(a),e=b!==f._getLocalTop()?b.frameElement:document);d=e.childNodes;if(!d){c=k;break a}for(b=c=0;c<d.length;c+=
1)if(1===d[c].nodeType&&d[c].tagName===a.tagName){if(d[c]===a){k[k.length]=[a.tagName.toUpperCase(),b];break}b+=1}a=e}b&&(k[k.length]=[a.id],f.utils.isIFrameDescendant(a)&&(y=!0,a=f.utils.getWindow(a).frameElement))}c=k}a=[];k=c.length;if(1>k)return"null";for(;k;)k-=1,1<c[k].length?a.push('["'+c[k][0]+'",'+c[k][1]+"]"):a.push("["+s.serialize(c[k][0],"json")+"]");return"["+a.join(",")+"]"};A.xpath=function(a,c){var b=s.parse(a),d,e=null,f,g,k,y,h;d=c="undefined"!==typeof c?c:document;if(!b)return null;
f=0;for(y=b.length;f<y&&d;f+=1)if(e=b[f],1===e.length)d=c.getElementById(e[0]);else{g=0;k=-1;for(h=d.childNodes.length;g<h;g+=1)if(1===d.childNodes[g].nodeType&&d.childNodes[g].tagName.toUpperCase()===e[0]&&(k+=1,k===e[1])){d=d.childNodes[g];break}if(-1===k)return null}return d===c||!d?null:d};t.HTML_ID=-1;t.XPATH_ID=-2;t.ATTRIBUTE_ID=-3;t.prototype.examineID=function(a){var c,b,d,e,g=v.length,k;try{d=E(a)}catch(s){}e=a.name;try{if(!f.utils.isIFrameDescendant(a))if(h(a))c=a.id,b=t.HTML_ID;else if(v.length&&
a.attributes)for(;g;)g-=1,k=a.attributes[v[g]],"undefined"!==typeof k&&(c=v[g]+"="+(k.value||k),b=t.ATTRIBUTE_ID)}catch(y){}c||(c=d,b=t.XPATH_ID);return{id:c,type:b,xPath:d,name:e}};t.prototype.examineType=function(a,c){var b="",b="change"===c.type?"TEXTAREA"===a.tagName||"INPUT"===a.tagName&&"text"===a.type?"textChange":"valueChange":c.type;return{type:c.type,subType:b}};t.prototype.examineState=function(a){var c="undefined"!==typeof a.tagName?a.tagName.toLowerCase():"",b={a:["innerText","href"],
input:{range:["maxValue:max","value"],checkbox:["value","checked"],radio:["value","checked"],image:["src"]},select:["value"],button:["value","innerText"],textarea:["value"]}[c]||null,d=null,e=null,d=null,f="";if(null!==b)for(f in"[object Object]"===Object.prototype.toString.call(b)&&(b=b[a.type]||["value"]),e={},b)b.hasOwnProperty(f)&&(-1!==b[f].indexOf(":")?(d=b[f].split(":"),e[d[0]]=a[d[1]]):e[b[f]]="innerText"===b[f]?a.innerText||a.textContent:a[b[f]]);"select"===c&&(a.options&&!isNaN(a.selectedIndex))&&
(e.index=a.selectedIndex,d=a.options[a.selectedIndex],e.value=d.getAttribute("value")||d.getAttribute("label")||d.text||d.innerText,e.text=d.text||d.innerText);return e};t.prototype.examinePosition=function(b,c){var d=a(b),e=r(c);e.x=0!==d.x&&0!==d.y?Math.round(Math.abs(d.x-e.x)):e.width/2;e.y=0!==d.x&&0!==d.y?Math.round(Math.abs(d.y-e.y)):e.height/2;return e};return{normalizeEvent:m,normalizeTarget:b,getEventDetails:p,getEventPosition:a,getBoundingClientRectNormalized:r,checkId:h,init:function(){w?
f.utils.clog("Attempt to initialize service which has been already initialized(browserBaseService)"):(e(),y.subscribe("configupdated",e),w=!0)},destroy:function(){y.unsubscribe("configupdated",e);w=!1},extractResponseHeaders:function(a){a=a.split("\n");for(var c={},b=0,d=a.length,e=null,b=0;b<d;b+=2)e=a[b].split(": "),c[e[0]]=e[1];return c},WebEvent:k,ElementData:t,processDOMEvent:function(a){f._publishEvent(new k(a))},queryDom:A}});
TLT.addService("browser",function(f){function e(a){var b="",d=[];for(b in a)a.hasOwnProperty(b)&&d.push([b,a[b]]);return d}function h(a){var b=n(),d=[["X-Requested-With","XMLHttpRequest"]],h=0,r="boolean"!==typeof a.async?!0:a.async,m="",t=null,w=p.getCoreConfig().additionalHeaders;"function"===typeof w?w=w()||{}:"object"!==typeof w&&(w={});a.headers&&(d=d.concat(e(a.headers)));a.contentType&&d.push(["Content-Type",a.contentType]);for(m in w)w.hasOwnProperty(m)&&d.push([m,w[m]]);b.open(a.type.toUpperCase(),
a.url,r);f.utils.forEach(d,function(a){a[0]&&a[1]&&b.setRequestHeader(a[0],a[1])});b.onreadystatechange=t=function(){4===b.readyState&&(b.onreadystatechange=t=function(){},a.timeout&&window.clearTimeout(h),a.oncomplete({headers:k.extractResponseHeaders(b.getAllResponseHeaders()),responseText:b.responseText||null,statusCode:b.status,success:200===b.status}),b=null)};b.send(a.data||null);t();a.timeout&&(h=window.setTimeout(function(){b&&(b.onreadystatechange=function(){},4!==b.readyState&&b.abort(),
b=null)},a.timeout))}var p=f.getService("config"),m=f.getService("browserBase"),b={list2Array:function(a){var b=a.length,d=[],e;if("undefined"===typeof a.length)return[a];for(e=0;e<b;e+=1)d[e]=a[e];return d},find:function(a,b,d){return this.list2Array(this[d||"css"](a,b))},css:function(a,b){var d=this,e=null,e=document.getElementsByTagName("body")[0],k=(p.getServiceConfig("browser")||{}).sizzleURL||null;if("undefined"===typeof document.querySelectorAll){if(d.css=function(a,b){b=b||document;return d.Sizzle(a,
b)},"undefined"===typeof d.Sizzle)if(k)e={type:"GET",url:k,async:!1,oncomplete:function(a){eval(a.responseText)}},h(e);else try{e===window.jQuery(document).find("html > body").get()[0]&&(d.Sizzle=function(a,b){return window.jQuery(b).find(a).get()})}catch(r){try{e===window.Sizzle("html > body",document)[0]&&(d.Sizzle=window.Sizzle)}catch(n){f.fail("Sizzle was not found","NOQUERYSELECTOR")}}}else d.css=function(a,b){b=b||document;return b.querySelectorAll(a)};return d.css(a,b)}},a,d=new f.utils.WeakMap;
a={add:function(a){var b;if(!(b=d.get(a)))b=[function(b){a(new k.WebEvent(b))},0];b[1]+=1;d.set(a,b);return b[0]},find:function(a){return(a=d.get(a))?a[0]:null},remove:function(a){var b=d.get(a);b&&(b[1]-=1,0>=b[1]&&d.remove(a))}};var n=null,t=null,r=null,k=m,F=!0===(p.getServiceConfig("browser")||{}).useCapture,A=!1;return{getXHRObject:n,makeAjaxCall:h,convertHeaders:e,queryDom:b,init:function(){if(A)f.utils.clog("Attempt to initialize service which has been already initialized(browserService.w3c)");
else{b.xpath=k.queryDom.xpath;n="undefined"!==typeof window.XMLHttpRequest?function(){return new XMLHttpRequest}:function(){return new ActiveXObject("Microsoft.XMLHTTP")};if("function"===typeof document.addEventListener)t=function(a,b,d){a.addEventListener(b,d,F)},r=function(a,b,d){a.removeEventListener(b,d,F)};else if("undefined"!==typeof document.attachEvent)t=function(a,b,d){a.attachEvent("on"+b,d)},r=function(a,b,d){a.detachEvent("on"+b,d)};else throw Error("Unsupported browser");A=!0}},destroy:function(){A=
!1},getServiceName:function(){return"W3C"},query:function(a,d,e){return b.find(a,d,e)[0]||null},queryAll:function(a,d,e){return b.find(a,d,e)},loadScript:function(a){var b=document.getElementsByTagName("script")[0],d=document.createElement("script");d.src=a;b.parentNode.insertBefore(d,b)},sendRequest:function(a){a.type=a.type||"POST";h(a)},subscribe:function(b,d,e){e=a.add(e);t(d,b,e)},unsubscribe:function(b,d,e){var f=a.find(e);f&&(r(d,b,f),a.remove(e))}}});
TLT.addService("message",function(f){function e(b){var c="";this.type=b.type;this.offset=(new Date).getTime()-t.getTime();if(2===b.type||null===a)a=new Date;this.screenviewOffset=(new Date).getTime()-a.getTime();this.count=n+=1;this.fromWeb=!0;for(c in b)b.hasOwnProperty(c)&&(this[c]=b[c])}function h(a,b){var c=v.PVC_MASK_BASIC;a.maskType===v.PVC_MASK_EMPTY.maskType?c=v.PVC_MASK_EMPTY:a.maskType===v.PVC_MASK_BASIC.maskType?c=v.PVC_MASK_BASIC:a.maskType===v.PVC_MASK_TYPE.maskType?c=v.PVC_MASK_TYPE:
a.maskType===v.PVC_MASK_CUSTOM.maskType&&(c=a.maskFunction);"undefined"!==typeof b.target.prevState&&b.target.prevState.hasOwnProperty("value")&&(b.target.prevState.value=c(b.target.prevState.value));"undefined"!==typeof b.target.currState&&b.target.currState.hasOwnProperty("value")&&(b.target.currState.value=c(b.target.currState.value))}function p(a,b){var c,d,e,f,g,j;c=0;for(j=a.length;c<j;c+=1)if(d=a[c],"string"===typeof d){e=F.queryAll(d);d=0;for(f=e?e.length:0;d<f;d+=1)if(e[d]&&(g=k.ElementData.prototype.examineID(e[d]),
g.type===b.idType&&g.id===b.id))return!0}else if(d.id&&d.idType&&b.idType.toString()===d.idType.toString())switch(typeof d.id){case "string":if(d.id===b.id)return!0;break;case "object":if(d=RegExp(d.id.regex,d.id.flags),d.test(b.id))return!0}return!1}function m(a){var b,c,d;if(!a||!a.hasOwnProperty("target"))return a;b=0;for(c=B.length;b<c;b+=1)if(d=B[b],p(d.targets,a.target)){h(d,a);break}return a}function b(){A=f.getService("config");y=A.getServiceConfig("message")||{};B=y.hasOwnProperty("privacy")?
y.privacy:[]}var a=null,d=0,n=0,t=new Date,r=new Date,k=f.getService("browserBase"),F=f.getService("browser"),A=f.getService("config"),y=A.getServiceConfig("message")||{},s=window.location.href,C="ID"+r.getHours()+"H"+r.getMinutes()+"M"+r.getSeconds()+"S"+r.getMilliseconds()+"R"+Math.random(),B=y.hasOwnProperty("privacy")?y.privacy:[],v={},u=-1<navigator.userAgent.indexOf("iPhone")||-1<navigator.userAgent.indexOf("iPod")||-1<navigator.userAgent.indexOf("iPad"),E=window.devicePixelRatio||1,w=window.screen?
window.screen.width:0,g=window.screen?window.screen.height:0,q=window.orientation||0,c=u?w:320>=w?w:w/E,j=u?g:320>=w?g:g/E,l=null===window.screen?0:window.screen.height-window.screen.availHeight,K=window.innerWidth||document.documentElement.clientWidth,G=window.innerHeight||document.documentElement.clientHeight,z=!1;v.PVC_MASK_EMPTY=function(){return""};v.PVC_MASK_BASIC=function(){return"XXXXX"};v.PVC_MASK_TYPE=function(a){a=(a||"").split("");for(var b=0,c=0,d="",b=0,c=a.length;b<c;b+=1)d=f.utils.isNumeric(a[b])?
d+"9":f.utils.isUpperCase(a[b])?d+"X":f.utils.isLowerCase(a[b])?d+"x":d+"@";return d};v.PVC_MASK_EMPTY.maskType=1;v.PVC_MASK_BASIC.maskType=2;v.PVC_MASK_TYPE.maskType=3;v.PVC_MASK_CUSTOM={maskType:4};return{privacyMasks:v,applyMask:h,matchesTarget:p,privacyFilter:m,init:function(){z?f.utils.clog("Attempt to initialize service which has been already initialized(messageService)"):(A.subscribe&&A.subscribe("configupdated",b),z=!0)},destroy:function(){A.unsubscribe("configupdated",b);z=!1},createMessage:function(a){if("undefined"===
typeof a.type)throw new TypeError("Invalid queueEvent given!");return m(new e(a))},wrapMessages:function(a){a={messageVersion:"2.1.0.0",serialNumber:d+=1,sessions:[{id:C,startTime:r.getTime(),timezoneOffset:r.getTimezoneOffset(),messages:a,clientEnvironment:{webEnvironment:{libVersion:"3.0.0.823",page:s,windowId:"TODO",screen:{devicePixelRatio:E,deviceOriginalWidth:u?w*E:w,deviceOriginalHeight:u?g*E:g,deviceWidth:c,deviceHeight:j,deviceToolbarHeight:l,width:K,height:G,orientation:q}}}}]};var b=a.sessions[0].clientEnvironment.webEnvironment.screen;
b.orientationMode=f.utils.getOrientationMode(b.orientation);return a}}});
TLT.addService("serializer",function(f){function e(a){var b,d,f=0;if("object"!==typeof a||null===a)switch(typeof a){case "function":case "undefined":return"null";case "string":return'"'+a.replace(/\"/g,'\\"')+'"';default:return String(a)}else if("[object Array]"===Object.prototype.toString.call(a)){b="[";d=0;for(f=a.length;d<f;d+=1)Object.prototype.hasOwnProperty.call(a,d)&&(b+=e(a[d])+",")}else for(d in b="{",a)Object.prototype.hasOwnProperty.call(a,d)&&(b=b.concat('"',d,'":',e(a[d]),","),f+=1);
0<f&&(b=b.substring(0,b.length-1));return b+=String.fromCharCode(b.charCodeAt(0)+2)}function h(a,b,d){var e,h,n;a=a||[];e=0;for(h=a.length;e<h;e+=1)if(n=a[e],"string"===typeof n&&(n=f.utils.access(n)),"function"===typeof n){b[d]=n;break}}function p(e){for(var k in e)e.hasOwnProperty(k)&&(h(e[k].stringifiers,a,k),h(e[k].parsers,d,k));if(!e.json||!e.json.hasOwnProperty("defaultToBuiltin")||!0===e.json.defaultToBuiltin)a.json=a.json||n.json.serialize,d.json=d.json||n.json.parse;("function"!==typeof a.json||
"function"!==typeof d.json)&&f.fail("JSON parser and/or serializer not provided in the UIC config. Can't continue.");b.subscribe&&b.subscribe("configupdated",m);t=!0}function m(){b=f.getService("config");p(b.getServiceConfig("serializer")||{})}var b=f.getService("config"),a={},d={},n={json:function(){return"undefined"!==typeof window.JSON?{serialize:window.JSON.stringify,parse:window.JSON.parse}:{serialize:e,parse:function(a){return eval("("+a+")")}}}()},t=!1;return{init:function(){t?f.utils.clog("Attempt to initialize service which has been already initialized(serializerService)"):
p(b.getServiceConfig("serializer")||{})},destroy:function(){a={};d={};b.unsubscribe("configupdated",m);t=!1},parse:function(a,b){b=b||"json";"function"!==typeof d[b]&&f.utils.clog("Unsupported type of data in parse method of serializer service: "+b);return d[b](a)},serialize:function(b,d){d=d||"json";"function"!==typeof a[d]&&f.utils.clog("Unsupported type of data in serializer method of serializer service: "+d);return a[d](b)}}});
if(TLT&&"function"===typeof TLT.addModule)TLT.addModule("performance",function(f){function e(a,b){return"string"!==typeof a||!b||"object"!==typeof b?!1:!0===b[a]}function h(a,b){var f=0,h={},m="",k=0;if(!a||"object"!==typeof a||!a.navigationStart)return{};f=a.navigationStart;for(m in a)if((Object.prototype.hasOwnProperty.call(a,m)||"number"===typeof a[m])&&!e(m,b))k=a[m],h[m]="number"===typeof k&&k?k-f:k;return h}function p(a){var b=0;a&&(a.loadEventStart&&a.responseEnd)&&(b=a.loadEventStart-a.responseEnd);
return b}function m(a){var d=f.getConfig()||{},e="UNKNOWN",m={type:7,performance:{}};if(a&&a.performance&&!b.perfEventSent){a=a.performance;e=a.timing;a=a.navigation;e&&(m.performance.timing=h(e,d.filter),m.performance.timing.renderTime=p(e));if(a){switch(a.type){case 0:e="NAVIGATE";break;case 1:e="RELOAD";break;case 2:e="BACKFORWARD";break;default:e="UNKNOWN"}m.performance.navigation={type:e,redirectCount:a.redirectCount}}f.post(m);b.perfEventSent=!0}}var b={loadReceived:!1,unloadReceived:!1,perfEventSent:!1};
return{isFiltered:e,parseTiming:h,getRenderTime:p,postPerformanceEvent:m,init:function(){},destroy:function(){},onevent:function(a){if("object"===typeof a&&a.type)switch(a.type){case "load":b.loadReceived=!0;break;case "unload":b.unloadReceived=!0,b.perfEventSent||m(window)}},onmessage:function(){}}});else throw"Performance module included but TLT is not defined!!!";
TLT.addModule("replay",function(f){function e(a,b){var c,d;if(!a||"object"!==typeof a)return null;d=b.split(".");for(c=0;c<d.length;c+=1){if("undefined"===typeof a||null===a[d[c]])return null;a=a[d[c]]}return a}function h(a){var b=[];for(a=a.parentNode;a;)b.push(a),a=a.parentNode;return b}function p(a){return f.utils.some(a,function(a){return"A"===a.tagName||"BUTTON"===a.tagName?a:null})}function m(a){a=a.type;a="string"===typeof a?a.toLowerCase():"unknown";"blur"===a&&(a="focusout");return a}function b(a){var b;
b=e(a,"webEvent.target.element.tagName");var c="input"===b.toLowerCase()?e(a,"webEvent.target.element.type"):"",d=l[b.toLowerCase()+":"+c]||b,f=h(e(a,"webEvent.target.element")),g=null,g=e(a,"webEvent.target.position.relXY"),j=e(a,"webEvent.target.subtype");b={type:4,target:{id:a.id||"",idType:e(a,"webEvent.target.idType"),name:e(a,"webEvent.target.name"),tlType:d,type:b,subType:c,position:{width:e(a,"webEvent.target.element.offsetWidth"),height:e(a,"webEvent.target.element.offsetHeight")},currState:a.currState||
null},event:{tlEvent:m(e(a,"webEvent")),type:e(a,"webEvent.target.type")}};g&&(b.target.position.relXY=g);"number"===typeof a.dwell&&0<a.dwell&&(b.target.dwell=a.dwell);"number"===typeof a.visitedCount&&(b.target.visitedCount=a.visitedCount);"undefined"!==typeof a.prevState&&(b.prevState=a.prevState);"undefined"!==typeof j&&(b.event.subType=j);b.target.name=e(a,"webEvent.target.name");g=p(f);b.target.isParentLink=!!g;if(g&&(g.href&&(b.target.currState=b.target.currState||{},b.target.currState.href=
b.target.currState.href||g.href),g.value&&(b.target.currState=b.target.currState||{},b.target.currState.value=b.target.currState.value||g.value),g.innerText||g.textContent))b.target.currState=b.target.currState||{},b.target.currState.innerText=b.target.currState.innerText||g.innerText||g.textContent;return b}function a(a){f.post(a)}function d(a){for(var b=0,c,d=a.length,e,g,j,h={mouseout:!0,mouseover:!0},k=[],b=0;b<d;b+=1)if(e=a[b])if(h[e.event.type])k.push(e);else{for(c=b+1;c<d&&a[c]&&h[a[c].event.type];c+=
1);if(c<d&&(g=a[c])&&e.target.id===g.target.id&&e.event.type!==g.event.type)"click"===e.event.type&&(j=e,e=g,g=j),"click"===g.event.type?(e.target.position=g.target.position,b+=1):"blur"===g.event.type&&(e.target.dwell=g.target.dwell,e.target.visitedCount=g.target.visitedCount,e.focusInOffset=g.focusInOffset,e.target.position=g.target.position,b+=1),a[c]=null,a[b]=e;k.push(a[b])}for(;e=k.shift();)f.post(e);a.splice(0,a.length)}function n(a,b){L=b;L.inFocus=!0;"undefined"===typeof z[a]&&(z[a]={});
z[a].focus=L.dwellStart=Number(new Date);z[a].focusInOffset=H?L.dwellStart-Number(H):-1;z[a].prevState=e(b,"target.state");z[a].visitedCount=z[a].visitedCount+1||1}function t(a,c){x.push(b({webEvent:a,id:c,currState:e(a,"target.state")}))}function r(a){var b=!1,c=null;if("object"!==typeof a||!a.type)return b;switch(a.type){case "INPUT":c="|"+(a.subType||"")+"|";b=-1==="|button|image|submit|reset|checkbox|radio|".indexOf(c.toLowerCase())?!1:!0;break;case "TEXTAREA":b=!1;break;default:b=!0}return b}
function k(a,b){var c;if(!("undefined"===typeof a||null===a||"undefined"===typeof b||null===b)){L.inFocus=!1;"undefined"!==typeof z[a]&&z[a].hasOwnProperty("focus")?z[a].dwell=Number(new Date)-z[a].focus:(z[a]={},z[a].dwell=0);0===x.length&&(b.type=b.target.type="blur",t(b,a));if(c=x[x.length-1])c.target.dwell=z[a].dwell,c.focusInOffset=z[a].focusInOffset,c.target.visitedCount=z[a].visitedCount,"click"===c.event.type&&!r(c.target)&&(c.event.type="blur",c.event.tlEvent="focusout");d(x)}}function F(a,
b){"undefined"!==typeof z[a]&&!z[a].hasOwnProperty("focus")&&n(a,b);t(b,a);if("undefined"!==typeof z[a]&&"undefined"!==typeof z[a].prevState&&("textBox"===x[x.length-1].target.tlType||"selectList"===x[x.length-1].target.tlType))x[x.length-1].target.prevState=z[a].prevState}function A(a,b){var c,d=!0,f=0;if("SELECT"===b.target.element.tagName&&P&&P.target.id===a)P=null;else{L.inFocus||n(a,b);(f=x.length)&&"change"!==e(x[f-1],"event.type")&&F(a,b);var f=b.target.position.y,g=b.target.size.height;c=
Math.abs(b.target.position.x/b.target.size.width).toFixed(1);f=Math.abs(f/g).toFixed(1);c=(1<c||0>c?0.5:c)+","+(1<f||0>f?0.5:f);f=x.length;0===b.position.x&&0===b.position.y&&f&&"radioButton"===e(x[f-1],"target.tlType")?d=!1:b.target.position.relXY=c;f&&e(x[f-1],"target.id")===a?d&&(x[f-1].target.position.relXY=c):t(b,a);P=b}}function y(){return window.orientation||0}function s(){var b=y(),c={type:4,event:{type:"orientationchange"},target:{prevState:{orientation:K,orientationMode:f.utils.getOrientationMode(K)},
currState:{orientation:b,orientationMode:f.utils.getOrientationMode(b)}}};a(c);K=b}function C(a){var b=!1;return!a?b:b=G.scale===a.scale&&500>Math.abs((new Date).getTime()-G.timestamp)}function B(a){G.scale=a.scale;G.rotation=a.rotation;G.timestamp=(new Date).getTime()}function v(a){var b="INVALID";if("undefined"===typeof a||null===a)return b;a=Number(a);return b=isNaN(a)?"INVALID":1>a?"CLOSE":1<a?"OPEN":"NONE"}function u(a){var b={type:1,clientState:{pageWidth:document.width||(null===document.documentElement?
0:document.documentElement.offsetWidth),pageHeight:Math.max("undefined"===typeof document.height?0:document.height,"undefined"===typeof document.documentElement?0:document.documentElement.offsetHeight,"undefined"===typeof document.documentElement?0:document.documentElement.scrollHeight),viewPortWidth:window.innerWidth||document.documentElement.clientWidth,viewPortHeight:window.innerHeight||document.documentElement.clientHeight,viewPortX:window.pageXOffset||(null===document.body?0:document.body.scrollLeft),
viewPortY:window.pageYOffset||(null===document.body?0:document.body.scrollTop),deviceOrientation:window.orientation||0,event:e(a,"type")}},c=1,c=1,c=90===Math.abs(b.clientState.deviceOrientation)?Q?U-M:320>=N?U-M:U/X-M:Q?N+M:320>=N?N-M:N/X-M,c=0===b.clientState.viewPortWidth?1:c/b.clientState.viewPortWidth;b.clientState.deviceScale=c-0.02;b.clientState.deviceScale=b.clientState.deviceScale.toFixed(3);b.clientState.viewTime=null===I?0:(new Date).getTime()-I.getTime();"scroll"===a.type&&0>=J&&(W=S.clientState.viewPortX,
Y=S.clientState.viewPortY);"scroll"===a.type&&(b.clientState.viewPortXStart=W,b.clientState.viewPortYStart=Y);D=f.utils.clone(b);return b}function E(){return null!==D&&"load"!==D.clientState.event?("scroll"===D.clientState.event&&(delete D.clientState.viewPortXStart,delete D.clientState.viewPortYStart),D.clientState.event="attention",D.clientState.viewTime=null===H?0:(new Date).getTime()-H.getTime(),a(D),H=new Date,!0):!1}function w(a){return"scroll"===a.clientState.event&&a.clientState.viewPortXStart===
a.clientState.viewPortX&&a.clientState.viewPortYStart===a.clientState.viewPortY?!1:!0}function g(b){var c=null===V?0:(new Date).getTime()-V.getTime();if(null!==D&&(b.type!==D.clientState.event||1E3<=c))return w(D)&&(a(D),"touchend"!==D.clientState.event&&(S=f.utils.clone(D))),I=D=null,J=0,!0;null!==D&&(1===J&&1E3<=c&&("resize"===D.clientState.event||"scroll"===D.clientState.event||"orientationchange"===D.clientState.event||"screenview_load"===b.type))&&E();return!1}function q(a,b){var c=["type","target.id"],
d=null,f,g,j=!0;f=d=d=0;if(!a||!b||"object"!==typeof a||"object"!==typeof b)j=!1;f=0;for(g=c.length;j&&f<g;f+=1)if(d=c[f],e(a,d)!==e(b,d)){j=!1;break}if(j&&(d=e(a,"timestamp"),f=e(b,"timestamp"),!isNaN(d)||!isNaN(f)))if(d=Math.abs(e(a,"timestamp")-e(b,"timestamp")),isNaN(d)||10<d)j=!1;return j}function c(){var a=window.location.hash;a!==O&&(O&&TLT.logScreenviewUnload(O),a&&TLT.logScreenviewLoad(a),O=a)}function j(b){b={type:4,event:{type:b.type},target:{id:e(b,"target.id"),idType:e(b,"target.idType")}};
a(b)}var l={"input:radio":"radioButton","input:checkbox":"checkBox","input:text":"textBox","input:password":"textBox","input:file":"fileInput","input:button":"button","input:submit":"submitButton","input:reset":"resetButton","input:image":"image","input:color":"color","input:date":"date","input:datetime":"datetime","input:datetime-local":"datetime-local","input:number":"number","input:email":"email","input:tel":"tel","input:search":"search","input:url":"url","input:time":"time","input:week":"week",
"textarea:":"textBox","select:":"selectList","button:":"button","a:":"link"},K=window.orientation||0,G={scale:0,timestamp:0},z={},O=window.location.hash,R=null,x=[],J=0,D=null,S=null;(new Date).getTime();var T=null,I=null,H=null,W=0,Y=0,V=null,L={inFocus:!1},P=null,Q=-1<navigator.userAgent.indexOf("iPhone")||-1<navigator.userAgent.indexOf("iPod")||-1<navigator.userAgent.indexOf("iPad"),X=window.devicePixelRatio||1,N=null===window.screen?0:window.screen.width,U=null===window.screen?0:window.screen.height,
M=null===window.screen?0:window.screen.height-window.screen.availHeight;"function"!==typeof window.onerror&&(window.onerror=function(a,b,c){var d=null;"string"===typeof a&&(d={type:6,exception:{description:a,url:b,line:c||-1}},f.post(d))});return{tlTypes:l,currOrientation:K,pastEvents:z,lastEventId:R,tmpQueue:x,postEventQueue:d,eventCounter:J,curClientState:D,getViewEventStart:function(){return I},setViewEventStart:function(a){I=a},viewTimeStart:H,getValue:e,parentElements:h,getParentLink:p,createQueueEvent:b,
postUIEvent:a,handleFocus:n,handleBlur:k,handleChange:F,handleClick:A,getNormalizedOrientation:y,handleOrientationChange:s,handleClientState:u,checkViewClientState:E,checkClientState:g,getPinchType:v,saveTouchState:B,isDuplicateTouch:C,getTlEvent:m,isDuplicateEvent:q,trackHashchange:c,isTargetClickable:r,defaultEventHandler:j,init:function(){},destroy:function(){k(R)},onevent:function(b){var f=null,h=null;if("object"===typeof b&&b.type)if(q(b,T))T=b;else{T=b;"undefined"!==typeof console&&console.log("Replay event: ",
b);f=e(b,"target.id");"[object Object]"!==Object.prototype.toString.call(z[f])&&(z[f]={});g(b);x[x.length-1]&&(x[x.length-1].target.id!==f&&"scroll"!==b.type&&"resize"!==b.type&&"mouseout"!==b.type&&"mouseover"!==b.type&&"textBox"!==x[x.length-1].target.tlType&&"selectList"!==x[x.length-1].target.tlType)&&k(x[x.length-1].target.id,x[x.length-1]);V=new Date;switch(b.type){case "hashchange":c();break;case "focus":h=n(f,b);break;case "blur":h=k(f,b);break;case "click":h=A(f,b);break;case "change":h=
F(f,b);break;case "orientationchange":h=s(b);break;case "touchend":var h={},l=e(b,"nativeEvent.rotation")||0,m=e(b,"nativeEvent.scale")||1,p=null,r={type:4,event:{type:"touchend"},target:{id:e(b,"target.id"),idType:e(b,"target.idType")}};Q&&(!m||1===m)||!Q&&1>=b.nativeEvent.touches.length||(p={rotation:l?l.toFixed(2):0,scale:m?m.toFixed(2):1},p.pinch=v(p.scale),C(p)||(G&&G.timestamp&&(h.rotation=G.rotation,h.scale=G.scale,h.pinch=v(h.scale)),e(h,"scale")&&(r.target.prevState=h),r.target.currState=
p,a(r),B(p)));h=u(b);break;case "load":TLT.logScreenviewLoad("root");h=u(b);H=new Date;break;case "screenview_load":H=new Date;break;case "resize":case "scroll":null===I&&0>=J&&(I=new Date);h=u(b);w(h)?h=null:J+=1;break;case "unload":null!==x&&d(x);h=u(b);E();a(h);TLT.logScreenviewUnload("root");break;default:j(b)}R=f;return h}},onmessage:function(){}}});

/**
 * ================================================================= 
 * Source file taken from :: analytics.js
 * ================================================================= 
 */

/**
 * @license
 * Licensed Materials - Property of IBM
 * 5725-I43 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/*global TLT, WLJQ, WL_, cordova, __tealeafCallback, _enable */

var WL = WL || {};
WL._AnalyticsImpl = (function (jQuery, lodash, TLT, global) {

	'use strict';

	var

	//Dependencies
	$ = jQuery,
	_ = lodash,

	//Constants
	PKG_NAME = 'wl.analytics',
	ANALYTICS_PATH = 'analytics',
	ANDROID_ENV = WL.Environment.ANDROID,
	IPHONE_ENV = WL.Environment.IPHONE,
	IPAD_ENV = WL.Environment.IPAD,
	CDV_PLUGIN_NAME = 'AnalyticsConfigurator',
	CDV_PLUGIN_CONFIGURE_TEALEAF = 'configureTealeaf',
	CDV_PLUGIN_SEND = 'send',
	CDV_PLUGIN_ENABLE = 'enable',
	CDV_PLUGIN_DISABLE = 'disable',
	CDV_PLUGIN_RESET_CONFIG = 'resetConfig',
	APP_VERSION_KEY = 'x-wl-app-version',
	TLT_INIT = 'initialized',
	TLT_DESTROYED = 'destroyed',
	QUEUE_THRESHOLD = 10,
	TLT_JS_QUEUE_MAX_THRESHOLD = 1000,

	logger = WL.Logger.create({pkg: PKG_NAME}),

	state = {

		//enabled: boolean is appended when state() is called

		//Value assigned when enabled is called
		url : null,

		//Amount of log events in the queue
		currentQueueSize : 0,

		//Flag to determine if flushQueue has been attached to the WL.Events.WORKLIGHT_IS_CONNECTED event
		wlconnectEventAttached: false,

		//JavaScript Date when the queue was sucesfully flushed
		lastUpdate: null
	},

	__setQueueThreshold = function (value) {
		if (!_.isNumber(value) || value < 0) {

			logger.error('Invalid queue threshold, value:', value);

		} else {

			QUEUE_THRESHOLD = value;
			logger.debug('Queue threshold set, value:', QUEUE_THRESHOLD);
		}

		return QUEUE_THRESHOLD;
	},

	__getWorklightHeaders = function (src) {
		var headers = WL.Client.getGlobalHeaders() || {},
			headersCopy;

		src = src || '';

		headers[APP_VERSION_KEY] = WL.Client.getAppProperty(WL.AppProp.APP_VERSION);

		//A new object returned, instead of a reference
		headersCopy = _.cloneDeep(headers);

		logger.debug(src, 'got headers:', headersCopy);

		return headersCopy;
	},

	__generateWorklightAnalyticsPath = function () {
		return WL.Client.getAppProperty(WL.AppProp.WORKLIGHT_ROOT_URL) + ANALYTICS_PATH;
	},

	__generateDefaultTLConfig = function (options) {

		return {
			core : {
				additionalHeaders : function () {
					return __getWorklightHeaders('generateDefaultTLConfig');
				},
				moduleBase: 'intermediate/modules/',
				modules: {
					performance: {
						events: [
							{ name: 'load', target: global },
							{ name: 'unload', target: global }
						]
					},
					replay: {
						events: []
					}
				},

				// Set the sessionDataEnabled flag to true only if it's OK to expose
				// Tealeaf session data to 3rd party scripts.
				sessionDataEnabled: false,
				sessionData: {

					// Set this flag if the session value needs to be hashed to derive the Tealeaf session ID
					sessionValueNeedsHashing: true,

					// Specify sessionQueryName only if the session id is derived from a query parameter.
					sessionQueryName: 'sessionID',
					sessionQueryDelim: ';',

					// sessionQueryName, if specified, takes precedence over sessionCookieName.
					sessionCookieName: 'jsessionid'
				},
				// list of ignored frames pointed by css selector (top level only)
				framesBlacklist: [
					'#iframe1'
				]
			},

			/******** SERVICES ********/

			services : {
				queue: [{
					qid: 'DEFAULT',
					endpoint: options.url,
					maxEvents: options.queueSize,
					serializer: 'json'
				}],

				message: {
					privacy: [
						{
							targets: [
								// CSS Selector: All password input fields
								'input[type=password]'
							],
							'maskType': 3
						}
					]
				},
				serializer: {
					json: {
						defaultToBuiltin: true,
						parsers: [ 'JSON.parse' ],
						stringifiers: [ 'JSON.stringify' ]
					}
				},
				browser: {
					jQueryObject: 'window.jQuery'
				}
			},

			/******** MODULES ********/

			modules : {
				performance: {
					filter: {
						navigationStart: true,
						unloadEventStart: true,
						unloadEventEnd: true,
						redirectStart: true,
						redirectEnd: true,
						fetchStart: true,
						domainLookupStart: true,
						domainLookupEnd: true,
						connectStart: true,
						connectEnd: true,
						secureConnectionStart: true,
						requestStart: true,
						responseStart: true,
						responseEnd: true,
						domLoading: true,
						domInteractive: true,
						domContentLoadedEventStart: true,
						domContentLoadedEventEnd: true,
						domComplete: true,
						loadEventStart: true,
						loadEventEnd: true
					}
				}
			}
		};
	},

	__createClientContext = function() {

		logger.debug('Started __createClientContext');

		var date = new Date();
		
		var deviceContext = null;
		if(typeof WL.Device.getContext !== 'undefined'){
			deviceContext = WL.Device.getContext();
		};

		var clientContext = {

			// Only used to simplify the x2020 pipe logic
			// Get timezone offset returns the difference in minutes between UTC
			// and local time
			timestamp : date.getTime() + date.getTimezoneOffset() * 60 * 1000,

			environment : WL.Client.getAppProperty(WL.AppProp.ENVIRONMENT),

			appName : WL.Client.getAppProperty(WL.AppProp.APP_DISPLAY_NAME),

			appVersion : WL.Client.getAppProperty(WL.AppProp.APP_VERSION),

			deviceContext : deviceContext
		};

		logger.debug('Finished __createClientContext', clientContext);

		return clientContext;
	},

	__checkNativeEnvironment = function () {
		var env = WL.Client.getEnvironment();
		
		return (env === ANDROID_ENV ||
			env === IPHONE_ENV ||
			env === IPAD_ENV);
	},

	__callNative = function (options) {

		var deferred = $.Deferred(),
			errObj,

			success = function () {
				deferred.resolve();
			},

			failure = function (err) {
				errObj = {src: options.method, msg: err};
				deferred.reject(errObj);
			};

		cordova.exec(success, failure, options.plugin, options.method, options.params);

		return deferred.promise();
	},

	__routeToNativeOrJavaScript = function (options) {

		var deferred = $.Deferred();

		options = options || {};

		if (options.callNative) {

			//options should have the following keys:
			//plugin - cordova plugin name
			//method - cordova plugin method name
			//params - array with parameters sent to native plugin method
			__callNative(options)

			.then(function () {
				logger.debug('[Native] Finished', options.method, 'succesfully');
				deferred.resolve();
			})

			.fail(function (errObj) {
				logger.error('[Native] Finished', options.method, 'with errObj:', errObj);
				deferred.reject(errObj);
			});

		} else {

			setTimeout(function() {
				deferred.resolve();
			}, 0);
		}

		return deferred.promise();
	},

	__flushQueue = function (options) {

		options = _.extend({skipValidation: false}, options || {});

		var deferred = $.Deferred(),
			errObj,
			headers,
			WorklightAnalyticsURL;

		// the _isConnected flag is currently set to false, don't bother attempting AJAX GET connectivity confirmation
		if (!WL.Client.isConnected()) {
			setTimeout(function () {
				deferred.resolve();
			}, 0);
			return deferred.promise();
		}
		
		//Native has been set to interval POST rather than manual POST
		//Don't try to flush the queue because of lack of connectivity to the server
		if (QUEUE_THRESHOLD === 0 || (!options.skipValidation && state.currentQueueSize < QUEUE_THRESHOLD) ) {

			setTimeout(function () {
				deferred.resolve();
			}, 0);

			return deferred.promise();
		}

		// 0. Get the right headers to get passed Worklight's authentication
		// NOTE: No need to attach cookies, those are attached automatically
		headers = __getWorklightHeaders('flushQueue');

		// 2. The URL to the Worklight server is set, even if TLT's URL is different
		WorklightAnalyticsURL = __generateWorklightAnalyticsPath();

		// 3. Do an ajax GET (default) call to [worklightServerRootURL]/analytics
		$.ajax({
			url: WorklightAnalyticsURL,
			headers: headers
		})

		// 4. 200 Response means it's safe to flush the queue, by default if TLT
		// is unable to reach the Worklight Server the contents of the queue are lost
		// hence this flushQueue call that checks if we can access the Worklight Server
		.done(function () {

			// 5. Call the Native send function that transmits the contents of the queue to the server
			// or TLT's flushQueue method on JavaScript-only environments
			__routeToNativeOrJavaScript({
				callNative : __checkNativeEnvironment(),
				plugin : CDV_PLUGIN_NAME,
				method : CDV_PLUGIN_SEND,
				params : [headers]
			})

			.then(function () {

				if (!__checkNativeEnvironment()) {
					TLT.flushAll();
				}
				
				state.currentQueueSize = 0; //Reset
				state.lastUpdate = new Date();
				
				deferred.resolve();
			})

			.fail(function (errObj) {
				deferred.reject(errObj);
			});

		})

		// 5. When the Worklight Server is unreachable ($.ajax failed)
		// send an error object with the response from the network request
		// NOTE: This may occur frequently
		.fail(function (res) {

			errObj = {src: 'flushQueue', msg: res};
			deferred.resolve(errObj);
		});

		return deferred.promise();
	},

	__attachWLConnectEvent = function (state) {

		//0. Check if the WL.Events.WORKLIGHT_IS_CONNECTED event is already attached
		if (!state.wlconnectEventAttached) {

			//1. Attach to the WLConnect event to flush the queue when WL connects successfully
			
			$(document).on(WL.Events.WORKLIGHT_IS_CONNECTED, function () {
				__flushQueue({skipValidation: true})
			});

			//2. Update state object to represent the current state
			state.wlconnectEventAttached = true;
		}
	},

	__enableTealeaf = function (state) {

		var deferred = $.Deferred(),
			config = __generateDefaultTLConfig({url: state.url, queueSize: QUEUE_THRESHOLD}),
			TLTconfig;

		//If TLT is not enabled, enable the JavaScript and Native versions
		if (! TLT.isInitialized()) {

			__routeToNativeOrJavaScript({
				callNative : __checkNativeEnvironment(),
				plugin : CDV_PLUGIN_NAME,
				method : CDV_PLUGIN_ENABLE,
				params : []
			})

			.then(function () {
				TLT.init(config, function (str) {
					__tealeafCallback(str, deferred);
				});
			})

			.fail(function (errObj) {
				deferred.reject(errObj);
			});

		} else {

			//If TLT is enabled iterate over TLT's configuration object,
			//find the DEFAULT queue and update the URL
			TLTconfig = TLT.getConfig();

			try {
				_.each(TLTconfig.services.queue, function (queue) {

					if (queue.qid === 'DEFAULT') {
						queue.endpoint = state.url;
						logger.debug('URL updated to:', state.url);
					}
				});

				TLT.updateConfig(TLTconfig);

			} catch (e) {
				logger.error('Probably could not update the URL, e:', e);
			}

			setTimeout(function () {
				deferred.resolve();
			}, 0);
		}

		return deferred.promise();
	},

	__tealeafCallback = function (str, deferred) {

		//Passed via TLT.init and called when TLT.init() and TLT.destroy() finish
		//str is 'initialized' when TLT.init() finished
		//str is 'destroyed' when TLT.destroy() finished

		var errObj;

		if (str === TLT_INIT || str === TLT_DESTROYED) {

			logger.debug('__tealeafCallback returned, str:', str);
			deferred.resolve();

		} else {
			errObj = {src: 'TLT.init', msg: str};
			logger.error('Failed, str:', str, 'errObj:', errObj);
			deferred.reject(errObj);
		}
	},

	/**
		Logs a message with contextual data.
	*/
	_log = function (msg, name) {

		logger.debug('Started _log, name:', name, 'msg:', msg);

		var errObj,
			ctx,
			eventMessage;

		//0. If running on JS env without connectivity to the WL server, check if
		//   the queue can accept more events
		if (!__checkNativeEnvironment() &&
			state.currentQueueSize >= TLT_JS_QUEUE_MAX_THRESHOLD) {

			logger.warn('Max queue size reached, currentQueueSize:', state.currentQueueSize);

			//EXIT!
			return null;
		}

		//1. If TLT is not enabled, finish sucessfully without logging the event
		if (! TLT.isInitialized() ) {

			//Returns false because the queue was not flushed
			logger.debug('Finished _log, state.enable:', TLT.isInitialized());

			//EXIT!
			return null;
		}

		//2. Fail validation if name is Object, Array or Function OR msg is not an Object
		//Note: _.isObject([]) and _.isObject({}) return true
		if (!_.isObject(msg) || _.isObject(name) || _.isFunction(name)) {

			errObj = {src: 'log', msg: 'Invalid parameters sent'};
			logger.error('Finished _log with errObj', errObj);

			//EXIT!
			return errObj;
		}

		//3. Turn name into an empty string or the string representation of the value sent
		if (! _.isString(name)) {
			try {
				name = name.toString();
			} catch (e) {
				//Note: null and undefined go to this code path and get turned into empty strings
				name = '';
			}
		}

		//4. Get the application context (version, name, geolocation, etc.)
		ctx = __createClientContext();

		//5. Prepare the event message in a format TLT expects
		eventMessage = {
			eventMessage : msg,
			clientContext: ctx
		};

		//6. Log the TLT custom event
		TLT.logCustomEvent(name, eventMessage);
		state.currentQueueSize++;

		//7. Flush the queue if the QUEUE_THRESHOLD was reached, update currentQueueSize and exit

		logger.log('Finished _log');
		return __flushQueue();
	},

	/**
		Turns off the capture of analytics data.
	*/
	_disable = function () {

		logger.debug('Started _disable');

		var deferred = $.Deferred();

		//1. Stop TLT (JavaScript) if it's enabled
		if (TLT.isInitialized()) {

			TLT.destroy();
		}

		//2. Stop TLT (Native) via Cordova disable or finish succesfully
		__routeToNativeOrJavaScript({
			callNative : __checkNativeEnvironment(),
			plugin: CDV_PLUGIN_NAME,
			method: CDV_PLUGIN_DISABLE,
			params: []
		})

		.then(function () {
			logger.debug('Finished _disable');
			deferred.resolve();
		})

		.fail(function (errObj) {
			logger.debug('Finished _disable with errObj:', errObj);
			deferred.reject(errObj);
		});

		return deferred.promise();
	},

	/**
		Disables analytics capture, resets the Tealeaf configuration settings to their default value
		and re-enables the capture of analytics data.
	*/
	_restart = function (options) {

		logger.debug('Started _restart, options:', options);

		var deferred = $.Deferred();

		//0. Call disable, this will finish sucesfully even if it was already disabled
		_disable()

		.then(function () {
			return __routeToNativeOrJavaScript({
				callNative : __checkNativeEnvironment(),
				plugin : CDV_PLUGIN_NAME,
				method : CDV_PLUGIN_RESET_CONFIG,
				params : []
			});
		})

		.then(function () {

			//1. Reset TLT configuration back to the default one and Start TLT again
			_enable(options)

			.then(function () {

				logger.debug('Finished _restart');
				deferred.resolve();
			})

			.fail(function (errObj) {

				logger.error('Finished _restart with a failure on _enable, errObj:', errObj);
				deferred.reject(errObj);
			});

		})

		.fail(function (errObj) {

			logger.error('Finished _restart with a failure on _disable, errObj:', errObj);
			deferred.reject(errObj);
		});

		return deferred.promise();
	},

	/**
		Turns on the capture of analytics data.
	*/
	_enable = function (options) {

		logger.debug('Started _enable');
		
		var deferred = $.Deferred(),
			passedURL,
			errObj;
		
		if (WL.Client.__state().enableFIPS) {
			_disable()
			.always(function () {
				errObj = {src: 'enable', msg: 'FIPS Enabled'};
				logger.warn("WL.Analytics API is not available when initOptions.enableFIPS is set to true.  Analytics feature is disabled.");
				deferred.reject(errObj);
			})
	
			return deferred.promise();
		}

		//0. Support no options passed, turn it into an empty obj to pass validation
		if (_.isUndefined(options)) {
			options = {};
		}

		//1. Validation - check for {url: 'http://server/'}
		if (!_.isObject(options) && !_.isString(options.url)) {

			errObj = {src: 'enable', msg: 'Invalid parameters'};

			setTimeout(function () {
				deferred.reject(errObj);
			}, 0);

			logger.error('Failed validation, options:', options ,'errObj:', errObj);

			//EXIT!
			return deferred.promise();
		}

		//2. Add the new Tealeaf URL that was passed to the state object
		if (_.isString(options.url) && options.url.length > 0) {

			state.url = options.url;
			passedURL = options.url;

		} else {

			//URL was NOT passed, set default URL
			state.url = __generateWorklightAnalyticsPath();
		}

		//3. Attach to the WL.Events.WORKLIGHT_IS_CONNECTED event, the queue should be flushed when WL connects successfully
		__attachWLConnectEvent(state);

		//4. setPostURL via Cordova Plugin, if passedURL is not a string native is not called
		__routeToNativeOrJavaScript({
			callNative : _.isString(passedURL) && __checkNativeEnvironment(),
			plugin : CDV_PLUGIN_NAME,
			method : CDV_PLUGIN_CONFIGURE_TEALEAF,
			params : [{PostMessageUrl: state.url}]
		})

		//5. enable via Cordova Plugin
		.then(function () {
			return __enableTealeaf(state);
		})

		//6. Flush the queue, this sends data the server if we can access the server
		.then(function () {
			TLT.setAutoFlush(false);
			return __flushQueue({skipValidation: true});
		})

		//7. EXIT!
		.then(function () {
			logger.debug('Finished _enable');
			deferred.resolve();
		})

		.fail(function (errObj) {
			logger.error('Enabled failed, errObj', errObj);
			deferred.reject(errObj);
		});

		return deferred.promise();
	},

	/**
		Returns the current state of WL.Analytics
	*/
	_state = function () {

		//0. Regenerate the 'enabled' status, WL.Analytics does not keep track of it
		state.enabled = TLT.isInitialized();

		//1. Return a copy instead of reference to the state object so users can't modify it
		return _.cloneDeep(state);
	};

	//public API
	return {
		enable : _enable,
		disable: _disable,
		restart : _restart,
		log: _log,
		state: _state,
		// Methods for unit testing ONLY:
		__setQueueThreshold : __setQueueThreshold,
		__getWorklightHeaders : __getWorklightHeaders,
		__generateWorklightAnalyticsPath : __generateWorklightAnalyticsPath,
		__generateDefaultTLConfig : __generateDefaultTLConfig,
		__createClientContext : __createClientContext,
		__checkNativeEnvironment : __checkNativeEnvironment,
		__callNative : __callNative,
		__routeToNativeOrJavaScript : __routeToNativeOrJavaScript,
		__flushQueue : __flushQueue,
		__attachWLConnectEvent : __attachWLConnectEvent,
		__enableTealeaf : __enableTealeaf,
		__tealeafCallback : __tealeafCallback,
		__logger : logger
	};

}(WLJQ, WL_, TLT, window)); //WL.Analytics
