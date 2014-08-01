
/* JavaScript content from js/ATT_WL_Contacts_2.js in folder common */
var busyInd;

function wlCommonInit()
{
	// Common initialization code goes here
	busyInd = new WL.BusyIndicator('',{text : 'Working...'});
	
	WL.App.overrideBackButton( function() 
	{
		WL.App.close();
	});
}

var storageDir;
var fileScheme = "file://";
document.addEventListener("deviceready", function()
{
	window.requestFileSystem(LocalFileSystem.TEMPORARY, 0,
		function onSuccess(fileSystem)
		{
		    iScheme = fileSystem.root.fullPath.indexOf(fileScheme);
		    if(iScheme >= 0) {
		    	storageDir = fileSystem.root.fullPath.substring(iScheme + fileScheme.length);
		    } else {
		    	storageDir = fileSystem.root.fullPath;
		    }
		    console.log("storageDir: " + storageDir);
		},
		function onError(error) 
		{
			alert("Cannot get file system path. Error: " + error.code);
		}
	);
}, false);


function clearSendLabel()
{
	$("#sendLabel").html("<p> </p>");	
}

function setSearchLabel(labelText)
{
	$("#searchLabel").show();
	$("#searchLabel").html("<p>" + labelText + "</p>");
}

function hideSearchLabel()
{
	$("#searchLabel").hide();
	$("#searchLabel").html("<p> </p>");	
}

function setListeningLabel()
{
	$("#searchLabel").show();
	$("#searchLabel").html('<p>Listening...<img src="jqueryMobile/images/Animated_WAVE.gif"></p>');
}

function speechToTextCallback(response)
{
	if(typeof response !== "undefined") 
    {
		try {
			if(response.status==200 && response.invocationResult.isSuccessful)
			{
				if(typeof response.invocationResult.result.message.Recognition.NBest !== "undefined")
				{
				   var result = response.invocationResult.result.message.Recognition.NBest[0];
				   setSearchLabel("Searching for: " + result.Hypothesis + " ...");
			       searchContacts(result.Hypothesis, searchResultsCallback);
				} else {
					setSearchLabel(response.invocationResult.result.message.Recognition.Status);
				}
			} else {
				setSearchLabel(JSON.stringify(response, null, 3));			
			}
		} catch(sttException) {
			setSearchLabel(JSON.stringify(sttException, null, 3) + " " + 
					JSON.stringify(response, null, 3));
		}
    }
}

var params={},invocationData={},options={};

/**
 * Function to send the request for speechToText Conversion
 * @param audioString - Audio data in Base-64 encoded format
 * @param audioType - Audio format
 * @param sstCallback - Callback function after method invocation
 */
speechToText = function(audioString, audioType, context, language, sstCallback)
{
    //setAudioDataFromBase64(audioString);
	
	var audioData = {};
	var searchString = 'base64,';
    var index = audioString.indexOf(searchString);
    if(index >= 0)
    {
    	audioData = audioString.substring(index+searchString.length, audioString.length);
    } else {
    	audioData=audioString;
    }	
	
	var params = 
	{
		"fileObject" : audioData,
		"accessToken" : window.localStorage.accessToken,
		"contentType" : audioType,
		"xSpeechContext" : context,
		"accept" : "application/json"
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
							sstCallback(data);		
			} ,
			onFailure : function(error) {
							busyInd.hide();
							sstCallback(error);
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

function searchResultsCallback(results)
{
	window.localStorage.contacts = "{'contacts':[]}";
	clearList();
	hideSearchLabel();	
	
	if(results.status == 200 && results.invocationResult.isSuccessful) 
	{
		if(results.invocationResult.Contacts.length > 0)
		{
			for(var iContact = 0; iContact < results.invocationResult.Contacts.length; iContact++)
			{
				addNameToList(results.invocationResult.Contacts[iContact].name, iContact);
			}
			$('#contactsList ul').listview('refresh');
			window.localStorage.contacts = JSON.stringify(results.invocationResult.Contacts);
		} else {
			setSearchLabel("No match found for: " + results.invocationContext.searchKey);
		}
	} else {
		setSearchLabel("Search failed: "+ JSON.stringify(results, null, 3));		
	}
}

searchContacts = function(searchString, searchCallback)
{
	var params = 
	{
		"searchKey" : searchString.toLowerCase()
	};
	
	var invocationData = {
            adapter : 'Contacts',
            procedure : 'search',
            parameters : [params]
    };
	options = {
			onSuccess : function(data) {
			   searchCallback(data);		
			} ,
			onFailure : function(error) {
		       searchCallback(error);
			} ,
			invocationContext : { "searchKey" : searchString.toLowerCase() }
	};
	WL.Client.invokeProcedure(invocationData, options);
};

function addDetailsRow(rowLabel, rowValue)
{
    return('<tr><td><p class="listener"><b>' + rowLabel + '</b></p><td><p><b>' + rowValue + '</b></p></td></tr>');
}

function setContactPageDetails(selectedContact)
{
   $('#contactDetails').html(
	  '<p> Company: ' + selectedContact.company + '</p>' +
	  '<p> Name: ' + selectedContact.name  + '</p>' +
	  '<p> eMail: ' + selectedContact.email  + '</p>' +
	  '<p> Phone: ' + selectedContact.phone  + '</p>');
}

function loadContactDetails(iContact)
{
	try {
	   clearSendLabel();
	   contacts = JSON.parse(window.localStorage.contacts);	
	   window.localStorage.selectedContact = JSON.stringify(contacts[iContact]);
	   setContactPageDetails(contacts[iContact]);
	   $.mobile.changePage($("#page2"));
	} catch(loadContactDetailsException) {
		setSearchLabel("No contacts selected.");
	};
}

function addNameToList(name, contactIndex)
{  
	$('#contactsList ul').append('<li data-mini="false" data-theme="a" data-icon="arrow" data-iconpos="right" onclick="loadContactDetails(' +
			contactIndex + ');" data-transition="slide"> '+ 
			'<a href="#">' + name + '</a>' +
			'</li>');
}

function clearList()
{
	try {
	   $('#contactsList ul').empty();
	} catch (clearListExcption) {
		
	}
}

/**
 * Function to send an SMS to one or more AT&T Mobile Network devices
 * @param number address to send the SMS to
 * @param message Text to be sent in the SMS
 * @param sendSmsCallback callback function
 */
function sendSMS(number, message, sendSmsCallback)
{
	busyInd.show();
	
	if(number.indexOf("tel:") <0 )
	{
		number = "tel:" + number;
	}
	number.replace("+" , "");
	number.replace("-" , "");
	number.replace("(" , "");
	number.replace(")" , "");
	number.replace("." , "");
	number.replace("," , "");
	number.replace(" " , "");
	
	params={
		'body' : { 
			'outboundSMSRequest' : {
				"message" : message,
				"address" : number
			}
		},
		'contentType' : 'application/json',
		'accept' : 'application/json',
		'accessToken': window.localStorage.accessToken
	};
	
	invocationData= {
			adapter : 'SMSAdapter' ,
			procedure : 'sendSMS' ,
			parameters : [params]			
	};
	options = {
		onSuccess : function(data)
		{
			busyInd.hide();
			WL.Logger.debug("Success : Response is - "+JSON.stringify(data));
			sendSmsCallback(data);
		},
		onFailure : function(error)
		{
			busyInd.hide();
			WL.Logger.debug("Failiure : Response is - "+error);
			console.log(error);
			sendSmsCallback(error);
		} ,
		invocationContext : {}
	};
	
	WL.Client.invokeProcedure(invocationData, options);
}

function sendBusinessCard()
{
	contact = JSON.parse(window.localStorage.selectedContact);
	
	$('#sendLabel').html('<p></p>');
	  
	sendSMS(contact.phone, "AT&T Developer Platform @attdeveloper 18003310500", 
	   function(response)
	   {
		  if(response.status==200 && response.invocationResult.isSuccessful)
		  {
			  $('#sendLabel').html('<p><b>Send successful.</b></p>');
		  } else {
			  $('#sendLabel').html('<p><b>Send failed! </b>' + 
			     JSON.stringify(response) + '</p>');
		  }
	   }
	);	
}

function toggleRecording()
{
	var recordingOn = window.localStorage.recordingOn;
	if(typeof(recordingOn) === "undefined" || recordingOn==="false" )
	{
		startRecording();
	} else {
		stopRecording();
		readSpeechFile(window.localStorage.speechFilePath);
	}
}
/* JavaScript content from js/ATT_WL_Contacts_2.js in folder iphone */
/*
 *  Licensed Materials - Property of IBM
 *  5725-G92 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

// This method is invoked after loading the main HTML and successful initialization of the Worklight runtime.
function wlEnvInit(){
    wlCommonInit();
    // Environment initialization code goes here
}