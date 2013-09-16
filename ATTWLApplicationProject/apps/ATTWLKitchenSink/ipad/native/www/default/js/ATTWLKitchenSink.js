
/* JavaScript content from js/ATTWLKitchenSink.js in folder common */

// Worklight comes with the jQuery framework bundled inside. If you do not want to use it, please comment out the line below.
window.$ = WLJQ;
var busyInd;
function wlCommonInit(){
	// Common initialization code goes here
	busyInd = new WL.BusyIndicator('',{text : 'Loading...'});
	WL.App.overrideBackButton(function() { backNav();});
}

var storageDir;
document.addEventListener("deviceready", function()
{
	window.requestFileSystem(LocalFileSystem.TEMPORARY, 0,
		function onSuccess(fileSystem)
		{
			storageDir = fileSystem.root.fullPath;
			//alert("storage dir: " + storageDir);
		},
		function onError(error) 
		{
			alert("Cannot get file system path. Error: " + error.code);
		}
	);
}, false);

function exists(thing) 
{
   return (typeof (thing) !== 'undefined');	
}
