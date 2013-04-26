 var wlInitOptions = {
	
	// # Should application automatically attempt to connect to Worklight Server on application start up
	// # The default value is true, we are overriding it to false here.
    connectOnStartup : true,
	
	// # The callback function to invoke in case application fails to connect to Worklight Server
	//onConnectionFailure: function (){},
	
	// # Worklight server connection timeout
	timeout: 30000,
	
	// # How often heartbeat request will be sent to Worklight Server
	//heartBeatIntervalInSecs: 20 * 60,
	
	// # Should application produce logs
	// # Default value is true
	//enableLogger: false,
	
	// # The options of busy indicator used during application start up
	busyOptions: {text: "Processing..."},
	onSuccess: generateAccessToken
};

if (window.addEventListener) {
	window.addEventListener('load', function() { WL.Client.init(wlInitOptions); }, false);
} else if (window.attachEvent) {
	window.attachEvent('onload',  function() { WL.Client.init(wlInitOptions); });
}