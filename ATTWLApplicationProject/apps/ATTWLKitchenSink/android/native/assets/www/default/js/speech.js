
/* JavaScript content from js/speech.js in folder common */

/* JavaScript content from js/speech.js in folder common */
		
var params={},invocationData={},options={};

/**
 * Function to send the request for speechToText Conversion
 * @param audioString - Audio data in Base-64 encoded format
 * @param audioType - Audio format
 * @param cbData - Callback function after successful invocation of the method
 */
speechToText = function(audioString, audioType, context, language, cbData)
{
    var audioData = {};
    var searchString = 'base64,';
    var index = audioString.indexOf(searchString);
    if(index >= 0)
    {
    	audioData = audioString.substring(index+searchString.length, audioString.length);
    	console.log("audioData now begins at: " + audioData.substring(0, 16) + "\n\tand length is " + audioData.length);
    } else {
    	audioData = audioString;
    }   
	var params = 
	{
		"fileObject" : audioData,
		"accessToken" : window.localStorage.accessToken,
		"contentType" : audioType,
		"xSpeechContext" : context,
		"accept" : "application/json",
		"xArg" : "FormatFlag=true"
	};
	
	if(context==="Generic" && language !== undefined)
	{
	   params.contentLanguage = language;
	}
	
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

function speechContextSelected()
{
	var languageStyle = document.getElementById('languageRow').style;
	if($('#context').val() === "Generic")
	{
		languageStyle.display = 'table-row';		
	} else {
		languageStyle.display = 'none';
	}
}

