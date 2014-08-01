
/* JavaScript content from js/ATTWLKitchenSink.js in folder common */

// Worklight comes with the jQuery framework bundled inside. If you do not want to use it, please comment out the line below.
window.$ = WLJQ;
var busyInd;
function wlCommonInit(){
	// Common initialization code goes here
	busyInd = new WL.BusyIndicator('',{text : 'Loading...'});
	
	WL.Client.connect({
	   onSuccess: generateAccessToken,
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
	if(tempFileSystem != undefined) return;
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
	alert("fileSystem storage: " + storageDir);
}

function onFileError(error) 
{
	alert("Unable to access file system via Cordova. Error: " + JSON.stringify(error, null, 3));
}

/*document.addEventListener("deviceready", function()
{
	console.log("entered deviceready event listener");
	alert("entered deviceready event listener");
	getFileSystem();
}, false);
*/

function exists(thing) 
{
   return (typeof (thing) !== 'undefined');	
}
