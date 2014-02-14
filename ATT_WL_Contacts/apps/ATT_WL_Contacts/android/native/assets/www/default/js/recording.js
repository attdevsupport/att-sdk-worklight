
/* JavaScript content from js/recording.js in folder common */
var fileName = "recordedAudio.amr";

function readSpeechFile(file) 
{
	stopRecording();
	
	setSearchLabel("Converting to text...");
	
    var FileReader = cordova.require('cordova/plugin/FileReader');
    var reader = new FileReader();
    reader.onloadend = function (evt)
    {
        busyInd.show();
        console.log("Read as data URL: \n" + evt.target.result);
        if(evt.target.result)
        {
	        var lastindex = file.lastIndexOf("/");
	        var fileNamePre = file.substring(lastindex + 1, (file.length));
	        var fileExt = "audio/" + fileNamePre.substring(fileNamePre.lastIndexOf('.') + 1, (fileNamePre.length));
	        speechToText(evt.target.result, fileExt, "Generic", "en-US", speechToTextCallback);
        } else {
        	setSearchLabel("No audio recorded.");
        }
    };
    
    reader.readAsDataURL(fileScheme + file);
}

function startRecording()
{
	clearList();
	setSearchLabel("Listening...");
	window.localStorage.speechFilePath = storageDir + "/" + fileName;
    var args = [{
            filePath: window.localStorage.speechFilePath,
            audioChannels: 1,
            samplingRate: 8000,
            encodingBitRate: 1220
        }
    ];
    Cordova.exec(null, null, "Recorder", "start", args);
}

function stopRecording() {
	setSearchLabel(" ");
    Cordova.exec(null, null, "Recorder", "stop", [{}]);
}

function playRecording()
{
	stopRecording();
	
	setSearchLabel("Playback..." + window.localStorage.speechFilePath);
    
	// Play the audio file at url
    var my_media = new Media(window.localStorage.speechFilePath,
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