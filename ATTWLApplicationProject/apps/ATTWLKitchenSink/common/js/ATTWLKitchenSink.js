
// Worklight comes with the jQuery framework bundled inside. If you do not want to use it, please comment out the line below.
window.$ = WLJQ;
var busyInd;
function wlCommonInit(){
	// Common initialization code goes here
	busyInd = new WL.BusyIndicator('',{text : 'Loading...'});

	WL.Client.connect({
	   onSuccess: function (transport) {generateAccessToken(WLJSX.emptyFunction);}, // ignore any success details
	   onFailure: function(error) {
		   alert("Unable to connect to Worklight Server" + JSON.stringify(error));
	   }
	});
	
	WL.App.overrideBackButton(function() { backNav();});
	getFileSystem();
}

var storageDir;
var tempFileSystem;
var fileScheme = "://";

// Get the file system reference
// The file system is ready on different events in iOS simulator than 
// other devices/emulators, so split this out here to be called anywhere,
// but check for file system being defined already
var getFileSystem = function()
{
	// if we've already got the file system, return immediately
	if (tempFileSystem != undefined) return;
	
	// if the file system isn't available yet, return immediately
	if (!window.LocalFileSystem) {
		WL.Logger.warn("LocalFileSystem global variable not defined");
		return;
	}
	
    window.requestFileSystem(LocalFileSystem.TEMPORARY, 0,
		function onSuccess(fileSystem)
		{
			tempFileSystem = fileSystem;
	        tempFileSystem.root.getFile("phoneGapFileSystemPlugin1_0.hack", 
	           {create: true}, 
	           gotFileEntry, 
	           onFileError);	
		},
		onFileError
	);
};

function gotFileEntry(fileEntry)
{
    storageDir = fileEntry.nativeURL;
    var iScheme = fileEntry.nativeURL.indexOf(fileScheme);
    if(iScheme >= 0) {
    	storageDir = storageDir.substring(iScheme + fileScheme.length);
    } else {
    	storageDir = fileEntry.nativeURL();
    }
    storageDir = storageDir.substring(0, storageDir.lastIndexOf('/') + 1);
    
	console.log("fileSystem storage: " + storageDir);
	//alert("fileSystem storage: " + storageDir);
}

function onFileError(error) 
{
	alert("Unable to access file system via Cordova. Error: " + JSON.stringify(error, null, 3));
}

function exists(thing) 
{
   return (typeof (thing) !== 'undefined');	
}
