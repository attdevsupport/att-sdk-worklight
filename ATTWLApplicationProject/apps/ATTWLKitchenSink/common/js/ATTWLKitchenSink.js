
// Worklight comes with the jQuery framework bundled inside. If you do not want to use it, please comment out the line below.
window.$ = WLJQ;
var busyInd ;
function wlCommonInit(){
	// Common initialization code goes here
	busyInd = new WL.BusyIndicator('',{text : 'Loading...'});
	WL.App.overrideBackButton(function() { backNav();});
}

