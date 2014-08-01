
/* JavaScript content from js/initOptions.js in folder common */
/*
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
*/

 var wlInitOptions = 
 {
	// # Worklight server connection timeout
	timeout: 30000,
	
	// # The options of busy indicator used during application start up
	busyOptions: {text: "Busy..."},
	onSuccess: generateAccessToken
};

if (window.addEventListener)
{
	window.addEventListener('load', function()
	{ 
		WL.Client.init(wlInitOptions);
	}, false);
} else if (window.attachEvent) {
	window.attachEvent('onload',  function() { WL.Client.init(wlInitOptions); });
}
