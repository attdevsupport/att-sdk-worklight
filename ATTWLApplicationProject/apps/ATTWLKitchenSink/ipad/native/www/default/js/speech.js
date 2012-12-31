
/* JavaScript content from js/speech.js in folder common */

/* JavaScript content from js/speech.js in folder common */
		
var audioData = {};
var params={},invocationData={},options={};

/**
 * Function to send the request for speechToText Conversion
 * @param audioString - Audio data in Base-64 encoded format
 * @param audioType - Audio format
 * @param cbData - Callback function after successful invocation of the method
 */
speechToText = function(audioString,audioType, cbData)
{
    setAudioDataFromBase64(audioString);
		var params = {
				"fileObject" : audioData,
				"accessToken" : "Bearer " + window.localStorage.accessToken,
				"contentType" : audioType,
				"XSpeechContent" : "BusinessSearch",
				"accept" : "application/json"
			};
		
		var invocationData = {
	            adapter : 'SpeechAdapter',
	            procedure : 'speechToText',
	            parameters : [params]
	    };
		options = {
				onSuccess : function(data) {
								busyInd.hide();
								cbData(data);		
				} ,
				onFailure : function(error) {
								busyInd.hide();
								cbData(error);
				} ,
				invocationContext : {}
		};
		WL.Client.invokeProcedure(invocationData, options);
};


/**
 * Function to remove the Base-64 header from the string
 * @param audioString - Audio data in Base-64 encoded format
 */	
function setAudioDataFromBase64(audioString)
{
	var searchString = 'base64,';
    var index = audioString.indexOf(searchString);
    if(index >= 0)
    {
    	var base64AudioString = audioString.substring(index+searchString.length, audioString.length);
    	audioData = base64AudioString;
    }
}
