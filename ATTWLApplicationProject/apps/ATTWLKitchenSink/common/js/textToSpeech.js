var params={},invocationData={},options={};
var ttsAudioFileName = "/ttsAudio.wav";

/**
 * Function to send the request for speechToText Conversion
 * @param textString - text to convert to an audio file
 * @param language - language of the text
 * @param voice - person's voice you want to speak the text
 * @param callback - Callback function after successful invocation of the method
 */

textToSpeech = function(textString, language, voice, callback)
{
	var params = 
	{
		"accessToken" : window.localStorage.accessToken,
		"contentType" : "text/plain",
		"accept" : "audio/x-wav",
		"contentLanguage" : language,
		"xArg": "VoiceName=" + voice,
		"contentLength" : textString.length,
		"body" : textString
	};
	
	var invocationData = 
	{
        adapter : 'TextToSpeech',
        procedure : 'textToSpeech',
        parameters : [params]
    };
	
	options = 
	{
		onSuccess : function (result)
		{
			busyInd.hide();
			callback(result);
		},
		onFailure : function (result)
		{
			busyInd.hide();
			callback(result);
		},
		invocationContext : {}
	};
	
	busyInd.show();
	
	WL.Client.invokeProcedure(invocationData, options);
};

playTextToSpeechResult = function(speechResult)
{ 
	if(speechResult.status < 300 &&
	   speechResult.invocationResult.isSuccessful &&
	   parseInt(speechResult.invocationResult.result.message.code) < 300)
	{
		writeBase64ToBinaryFile(function (params)
		    {
			   playTextToSpeechFile();
	        },
	        function(error)
	        {
	        	alert("write plugin failed. " + error);
	        },
			speechResult.invocationResult.result.message.content, 
			storageDir + ttsAudioFileName
		);
    } else {
    	busyInd.hide();
   	 	window.localStorage.response = JSON.stringify(speechResult, null, 3);
   	 	$('#pagePort').load("popup.html",'',function(){});
    } 
};

var playTextToSpeechFile = function ()
{
	var ttsMedia = new Media(storageDir + ttsAudioFileName,
	    function ()
	    {
	       $('ttsPlayButton').removeAttr("disabled");
        },
        function (mediaErr)
        {
        	alert("Failed to play audio file.  Error:" + mediaErr);
        }
    );
	ttsMedia.play();
};