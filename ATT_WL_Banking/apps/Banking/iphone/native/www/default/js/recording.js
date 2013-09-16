
/* JavaScript content from js/recording.js in folder common */
var fileName = "recordedAudio.amr";

function startRecording(recordedCallback)
{
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
    }, 4000);
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
/* JavaScript content from js/recording.js in folder iphone */
var fileName = "recordedAudio.wav";

var mediaRec=null;
var recordSettings = {
   "FormatID": "kAudioFormatLinearPCM",
   "SampleRate": 8000.0,
   "NumberOfChannels": 1,
   "LinearPCMBitDepth": 16
};


function stopRecording()
{
    recordingOn="false";
    mediaRec.stopRecordWithSettings();
}

function startRecording(recordedCallback)
{
   console.log("Enter startRecording");
   
   if(recordingOn === "true") {
      console.log("startRecording>  recording is already on, stop it");
      stopRecording();
   }
   
	recordingOn = "true";
   
	speechFilePath = storageDir + "/" + fileName;
   console.log("startRecording speechFilePath IS: " + speechFilePath);
   
   fs.root.getFile(speechFilePath, {create: true, exclusive: false}, function(entry){
      filePath = entry.fullPath;
      console.log("startRecording: getFile full path is: " + entry.fullPath);
      mediaRec = new Media(entry.fullPath, 
            function(){console.log("new Media success");}, 
            function(){console.log("new Media failed");});
      
      console.log("sstartRecordingWithSettings being called.");
      mediaRec.startRecordWithSettings(recordSettings);
      
      setTimeout(function()
      {
         stopRecording();
         recordedCallback(speechFilePath);
      }, 4000);
   }, function(){console.log("startRecording getFile failed");});
}

function initRecording()
{
   // Extend cordova media with caller defined settings functionality
   Media.prototype.startRecordWithSettings = function(options)
   {
      console.log("Media.startRecordWithSettings id: " + this.id + " src: " + this.src +
         " options: " + JSON.stringify(options));
      cordova.exec(null, null, "AudioRecord","startAudioRecord", [this.id, this.src, options]);
   };
   Media.prototype.stopRecordWithSettings = function() {
      cordova.exec(null, null, "AudioRecord","stopAudioRecord", [this.id, this.src]);
   };
}

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