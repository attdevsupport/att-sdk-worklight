 var wlInitOptions = {
	// # The callback function to invoke in case application fails to connect to Worklight Server
	//onConnectionFailure: function (){},
	
	// # Worklight server connection timeout
	timeout: 30000,
	
	// # How often heartbeat request will be sent to Worklight Server
	//heartBeatIntervalInSecs: 20 * 60,
	
	// # The options of busy indicator used during application start up
	busyOptions: {text: "Processing..."}
};

var setupOnForegroundListener = function ()
{  
   document.addEventListener("foreground", generateAccessToken, false);
};

if (window.addEventListener) {
	window.addEventListener('load', function() { 
	   WL.Client.init(wlInitOptions); 
	}, false);
} else if (window.attachEvent) {
	window.attachEvent('onload',  function() { 
	   WL.Client.init(wlInitOptions);
	});
}