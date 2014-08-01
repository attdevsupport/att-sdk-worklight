
/* JavaScript content from js/recording.js in folder common */
var fileName = "recordedAudio.amr";

function startRecording(recordedCallback, recordTimeout)
{
   if(recordTimeout === undefined)
   {
      recordTimeout = 4000;
   }
   
   if(recordingOn === "true") {
      //alert("stopped recording");
      stopRecording();
   }
   
	recordingOn = "true";
    
	speechFilePath = storageDir + "/" + fileName;
    var args = [{
            filePath: speechFilePath,
            audioChannels: 1,
            samplingRate: 8000,
            encodingBitRate: 1220
        }
    ];
    Cordova.exec(null, null, "Recorder", "start", args);
    
    setTimeout(function()
    {
    	// If the recorder wasn't stopped manually, stop it
      //if(recordingOn==="true")
    	//{
    		stopRecording();
    		recordedCallback(speechFilePath);
    	//} else {
    	//   alert("timedout but not recording");
      //}
    }, recordTimeout);
}

function stopRecording()
{
	 recordingOn="false";
    Cordova.exec(null, null, "Recorder", "stop", [{}]);
}

function initRecording() 
{
   // NO-OP
};

function playRecording()
{
	stopRecording();
	
	setSearchLabel("Playback..." + speechFilePath);
    
	// Play the audio file at url
    var my_media = new Media(speechFilePath,
	    // success callback
	    function () {
    		setSearchLabel(" Playback done");
	    },
	    // error callback
	    function (err) {
	    	setSearchLabel("Playback failed "+ JSON.stringify(err, null, 3));
	    }
    );

    // Play audio
    my_media.play();
}