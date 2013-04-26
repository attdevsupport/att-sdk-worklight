/*
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function (){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  arguments.callee = arguments.callee.caller;  
  if(this.console) console.log( Array.prototype.slice.call(arguments) );
};
// make it safe to use console.log always
(function (b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});

// place any jQuery/helper plugins in here, instead of separate, slower script files.

// handleError missing in jQuery and used in the upload plugin
(function (jQuery){
	jQuery.handleError = function (s, xml, status, e){
		// If a local callback was specified, fire it
		if (s.error){
			s.error(xml, status, e);
		}
		// Fire the global callback
		if (s.global){
			jQuery.event.trigger("ajaxError", [xml, s, e]);
		}
	};
})(jQuery);