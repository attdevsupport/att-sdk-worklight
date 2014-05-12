
// Worklight comes with the jQuery framework bundled inside. If you do not want to use it, please comment out the line below.
window.$ = WLJQ;
var busyInd;
function wlCommonInit(){
	// Common initialization code goes here
	busyInd = new WL.BusyIndicator('',{text : 'Loading...'});
	WL.App.overrideBackButton(function() { backNav();});
	getFileSystem();
}

var storageDir;
var tempFileSystem;
var fileScheme = "file://";

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
		    iScheme = fileSystem.root.fullPath.indexOf(fileScheme);
		    if(iScheme >= 0) {
		    	storageDir = fileSystem.root.fullPath.substring(iScheme + fileScheme.length);
		    } else {
		    	storageDir = fileSystem.root.fullPath;
		    }		
			tempFileSystem = fileSystem;
			console.log("fileSystem storage: " + storageDir);
			alert("fileSystem storage: " + storageDir);
		},
		function onError(error) 
		{
			alert("Cannot get file system path. Error: " + error.code);
		}
	);
};

document.addEventListener("deviceready", function()
{
	console.log("entered deviceready event listener");
	getFileSystem();
}, false);

function exists(thing) 
{
   return (typeof (thing) !== 'undefined');	
}
