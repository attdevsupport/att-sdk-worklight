/**
 * writeBase64ToBinary - Take a base64 encoded string, convert to binary and write to a file
 * @param writeCallback
 * @param failCallback
 * @param base64Data
 * @param fileName
 */
writeBase64ToBinaryFile = function (writeCallback, failCallback, base64Data, fileName) 
{
	var writeArgs = [];
	writeArgs[0] = base64Data;
	writeArgs[1] = fileName;
	
	var pluginName = "Recorder";

	cordova.exec(
	   writeCallback,
	   failCallback,
	   pluginName,
	   "writeBase64ToBinary",
	   writeArgs
   );
};