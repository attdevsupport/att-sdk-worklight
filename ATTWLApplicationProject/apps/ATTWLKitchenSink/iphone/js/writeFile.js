/**
 * writeBase64ToBinary - Take a base64 encoded string, convert to binary and write to a file
 * @param writeCallback
 * @param failCallback
 * @param base64Data
 * @param fileName
 */
writeBase64ToBinaryFile = function (writeCallback, failCallback, base64Data, fileName) 
{
	var writeArgs = {"base64Data": base64Data, "fileName": fileName};
	
	var pluginName = "AudioRecord";

	cordova.exec(
	   writeCallback,
	   failCallback,
	   pluginName,
	   "writeBase64ToBinary",
	   ["id1", "src=TTS", writeArgs]
   );
};
