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

function startRecording(recordedCallback, recordTimeout)
{
   console.log("Enter startRecording");

   if(recordTimeout === undefined)
   {
      recordTimeout = 4000;
   }
   
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
      }, recordTimeout);
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