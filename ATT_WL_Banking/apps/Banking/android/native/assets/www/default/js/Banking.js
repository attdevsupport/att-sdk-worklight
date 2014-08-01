
/* JavaScript content from js/Banking.js in folder common */
var busyInd;
var viewTime = 2000;

function wlCommonInit()
{
   // Common initialization code goes here
   busyInd = new WL.BusyIndicator('', {
      text : 'Working...'
   });

   document.addEventListener("pause", onPause, false);
   
   WL.App.overrideBackButton(function()
   {
      WL.App.close();
   });
}

var storageDir;
var fileScheme = "file://";
var recordingOn = "false";
var speechFilePath = "";
var submitDate;
var amount;

function startOptionRecorder()
{
   //alert($.mobile.activePage.attr("id"));
   //alert("recording is: " + recordingOn);
   if($.mobile.activePage.attr("id") !== "pageOptions") return;
   //alert("on right page");
   setListeningStatus("#optionPageStatus");
   startRecording(optionPageRecordingCallback);
}

function startAmountRecorder()
{
   if($.mobile.activePage.attr("id") !== "pagePaymentDetails") return;
   
   $("#paymentInstructions").html("How much do you want to pay?");
   $("#paymentAmount").val("");
   $("#paymentDate").val("");
   setListeningStatus("#paymentDetailsStatus");
   startRecording(paymentAmountRecordingCallback, 5000);   
}

var fs;

document.addEventListener("deviceready", function()
{
   window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function onSuccess(
         fileSystem)
   {
      fs = fileSystem;
      iScheme = fileSystem.root.fullPath.indexOf(fileScheme);
      if (iScheme >= 0) {
         storageDir = fileSystem.root.fullPath.substring(iScheme
               + fileScheme.length);
      } else {
         storageDir = fileSystem.root.fullPath;
      }
      
      console.log("sD: " + storageDir + " name: " + fileName);
      
      // iOS Cordova audio plugin needs the file to already be created
      fileSystem.root.getFile(storageDir + "/" + fileName, {create: true, exclusive: false},
         function success(entry)
         {
            initRecording();  // plug-in specific initialization
            
            // storage is flaky before now.  Starting mic here so
            // we know the media player has file system access/availability
            startOptionRecorder();
         },
         function()
         {
            console.log("could not create/find audio file");
         }
      );
   }, function onError(error)
   {
      alert("Cannot get file system path. Error: " + error.code);
   });

   // This does not fire the first time in, so the equivalent is done on deviceReady
   $("#pageOptions").on("pageshow", function()
   {
      amount=0;
      submitDate="";
      startOptionRecorder();
   });

   $("#pagePaymentDetails").on("pageshow", function()
   {
      startAmountRecorder();
   });

   $("#pageConfirmation").on("pageshow", function()
   {
      startConfirmRecorder();
   });

   $("#pageSuccess").on("pageshow", function()
   {
      confCode = new Date();
      $("#confirmationCode").html("Your confirmation code is " + confCode.getTime());
   });   
}, false);

function setPageStatus(statusID, statusText)
{
   $(statusID).show();
   $(statusID).html("<p>" + statusText + "</p>");
}

function hidePageStatus(statusID)
{
   $(statusID).hide();
   $(statusID).html("<p> </p>");
}

function setListeningStatus(statusID)
{
   setTimeout(function() {
      $(statusID).show();
      $(statusID).html(
         '<p>Listening...<img src="jqueryMobile/images/Animated_WAVE.gif"></p>');
   }, 10);
}

function sanitizeResponse(response)
{
   var cleanResponse = {
      isSuccessful : false,
      result : "No response."
   };

   if (typeof response !== "undefined") {
      try {
         if (response.status == 200 && response.invocationResult.isSuccessful) {
            if (typeof response.invocationResult.result.message.Recognition.NBest !== "undefined") {
               cleanResponse.isSuccessful = true;
               cleanResponse.result = response.invocationResult.result.message.Recognition.NBest[0].Hypothesis;
            } else {
               cleanResponse.response = response.invocationResult.result.message.Recognition.Status;
            }
         } else {
            cleanResponse.result = JSON.stringify(response);
         }
      } catch (santizeException) {
         cleanResponse.result = JSON.stringify(santizeException) + " "
               + JSON.stringify(response);
      }
   }
   return cleanResponse;
}

var params = {}, invocationData = {}, options = {};

function handleWorklightSstCallback(wlResponse)
{
   wlResponse.invocationContext.devCallback(sanitizeResponse(wlResponse));
}

/**
 * Function to send the request for speechToText Conversion
 * 
 * @param audioString -
 *           Audio data in Base-64 encoded format
 * @param audioType -
 *           Audio format
 * @param sstCallback -
 *           Callback function after method invocation
 */
speechToText = function(audioString, audioType, context, language, sstCallback)
{
   var audioData = {};
   var searchString = 'base64,';
   var index = audioString.indexOf(searchString);
   if (index >= 0) {
      audioData = audioString.substring(index + searchString.length,
            audioString.length);
   } else {
      audioData = audioString;
   }

   var params = {
      "fileObject" : audioData,
      "accessToken" : window.localStorage.accessToken,
      "contentType" : audioType,
      "xSpeechContext" : context,
      "accept" : "application/json"
   };

   if (context === "Generic" && language !== undefined) {
      params.contentLanguage = language;
   }

   var invocationData = {
      adapter : 'SpeechAdapter',
      procedure : 'speechToText',
      parameters : [ params ]
   };
   options = {
      onSuccess : handleWorklightSstCallback,
      onFailure : handleWorklightSstCallback,
      invocationContext : {
         'devCallback' : sstCallback
      }
   };
   WL.Client.invokeProcedure(invocationData, options);
};

/**
 * Function to remove the Base-64 header from the string
 * 
 * @param audioString -
 *           Audio data in Base-64 encoded format
 */
function setAudioDataFromBase64(audioString)
{
   var searchString = 'base64,';
   var index = audioString.indexOf(searchString);
   if (index >= 0) {
      var base64AudioString = audioString.substring(
            index + searchString.length, audioString.length);
      audioData = base64AudioString;
   }
}

function searchResultsCallback(results)
{
   window.localStorage.contacts = "{'contacts':[]}";
   clearList();
   hideSearchLabel();

   if (results.status == 200 && results.invocationResult.isSuccessful) {
      if (results.invocationResult.Contacts.length > 0) {
         for ( var iContact = 0; iContact < results.invocationResult.Contacts.length; iContact++) {
            addNameToList(results.invocationResult.Contacts[iContact].name,
                  iContact);
         }
         $('#contactsList ul').listview('refresh');
         window.localStorage.contacts = JSON
               .stringify(results.invocationResult.Contacts);
      } else {
         setSearchLabel("No match found for: "
               + results.invocationContext.searchKey);
      }
   } else {
      setSearchLabel("Search failed: " + JSON.stringify(results, null, 3));
   }
}

function toggleRecording()
{
   // var recordingOn = localStorage.getItem("recordingOn");
   if (typeof (recordingOn) === "undefined" || recordingOn === "false") {
      startRecording();
   } else {
      stopRecording();
      readSpeechFile(speechFilePath);
   }
}

function readSpeechFile(file, resultCallback)
{
   console.log("entered readSpeechFile");

   if(file == "")
   {
      console.log("readSpeechFile: no audio recorded");
      resultCallback(
      {
         'isSuccessful' : false,
          'result' : "No audio recorded."
      });
   }
   
   var FileReader = cordova.require('cordova/plugin/FileReader');
   var reader = new FileReader();
   reader.onloadend = function(evt)
   {
      // busyInd.show();
      console.log("readSpeechFile onloadedend event: \n" + JSON.stringify(evt,null,3));
      
      if (evt.target.result) {
         var lastindex = file.lastIndexOf("/");
         var fileNamePre = file.substring(lastindex + 1, (file.length));
         var fileExt = "audio/"
               + fileNamePre.substring(fileNamePre.lastIndexOf('.') + 1,
                     (fileNamePre.length));
         speechToText(evt.target.result, fileExt, "Generic", "en-US",
               resultCallback);
      } else {
         if(evt.target.error.code === FileError.NOT_FOUND_ERR) {
            console.log("FileReader: file not found");
         } else if(evt.target.error.code === FileError.SECURITY_ERR) {
            console.log("FileReader security error");
         } else {
            console.log("FileReader error: " + event.target.error);
         }       
         resultCallback({
            'isSuccessful' : false,
            'result' : "No audio recorded."
         });
      }
   };

   console.log("readSpeechFile is using file: " + fileScheme + file);
   // TESTING!!!  
   //The following works for android but not ios
   //reader.readAsDataURL(fileScheme + file);
   
   // Trying for ios:
   reader.readAsDataURL(file);
}

function optionTextCallback(response)
{
   // alert("optionTextCallback response: " + JSON.stringify(response, null,
   // 3));
   if (response.isSuccessful) {
      // if an option matches result, change to that page
      // Otherwise restart the listener
      if (response.result.indexOf("bill") != -1 ||
          response.result.indexOf("pay ") != -1)
      {
         $.mobile.changePage($("#pagePaymentDetails"));
         return;
      } else if(response.result.indexOf("view") != -1 ||
                response.result.indexOf("account") != -1) {
         stopRecording(); 
         $.mobile.changePage($('#pageAccount'));
      } else if(response.result.indexOf("add ") != -1 ||
                response.result.indexOf("services") != -1) {
         stopRecording(); 
         $.mobile.changePage($('#pageServices'));         
      } else if(response.result.indexOf("contact") != -1) {
         stopRecording(); 
         $.mobile.changePage($('#pageContact'));
      } else {
         setPageStatus("#optionPageStatus", "No match for " + response.result);
      }
   } else {
      setPageStatus("#optionPageStatus", response.result);
   }
   setTimeout(function()
   {
      startOptionRecorder();
   }, viewTime);
}

function optionPageRecordingCallback(recordingFile)
{
   //alert("option callback on page: " + $.mobile.activePage.attr("id"));
   if($.mobile.activePage.attr("id") !== "pageOptions") return;
   
   setPageStatus("#optionPageStatus", "Converting to text..");
   readSpeechFile(recordingFile, optionTextCallback);
}

function paymentAmountCallback(response)
{
   // alert("optionTextCallback response: " + JSON.stringify(response, null,3));
   if (response.isSuccessful)
   {
      if (response.result.indexOf("cancel") !== -1)
      {
         $.mobile.changePage($("#pageOptions"));
      }
   
      // if dollar amount, fill it in and take the date
      // Otherwise restart the listener      
      amount = wordsToCurrency(response.result);
      if (amount !== undefined  && amount !== -1) {
         // set amount field to
         $("#paymentAmount").val(formatMoney(amount, 2, "$"));
         // look for date 
         startDateRecorder();
         return;
      } else {
         setPageStatus("#paymentDetailsStatus", "No number: " + response.result);
      }
   } else {
      setPageStatus("#paymentDetailsStatus", response.result);
   }
   setTimeout(function()
   {
      startAmountRecorder();
   }, viewTime);
}

function paymentAmountRecordingCallback(recordingFile)
{
   if($.mobile.activePage.attr("id") !== "pagePaymentDetails") return;
   
   setPageStatus("#paymentDetailsStatus", "Converting to text..");
   readSpeechFile(recordingFile, paymentAmountCallback);
}

function paymentDateCallback(response)
{
   if (response.isSuccessful) {
      // if date was found, use it
      // Otherwise restart the listener
      submitDate = dateWordsToNum(response.result);
      if (submitDate !== "" && submitDate !== undefined) {
         // set date field
         $("#paymentDate").val(submitDate);
         // look for submit/cancel 
         startSubmitRecorder();
         return;
      } else {
         setPageStatus("#paymentDetailsStatus", "No date of: " + response.result);
      }
   } else {
      setPageStatus("#paymentDetailsStatus", response.result);
   }
   setTimeout(function()
   {
      startDateRecorder();
   }, viewTime);
}

function paymentDateRecordingCallback(recordingFile)
{
   if($.mobile.activePage.attr("id") !== "pagePaymentDetails") return;
   
   setPageStatus("#paymentDetailsStatus", "Converting to text..");
   readSpeechFile(recordingFile, paymentDateCallback);
}

function startDateRecorder()
{
   if($.mobile.activePage.attr("id") !== "pagePaymentDetails") return;
   
   $("#paymentInstructions").html("When to send payment?");
   $("#paymentDate").val("");
   setListeningStatus("#paymentDetailsStatus");
   startRecording(paymentDateRecordingCallback);   
}

function loadConfirmationPage() {
   if(amount!==undefined && amount!=0 && submitDate!==undefined) {
      $.mobile.changePage('#pageConfirmation');
   }
}

function paymentSubmitCallback(response)
{
   if (response.isSuccessful) {
      // if Submit found, then continue 
      if (response.result.indexOf("submit") !== -1)
      {
         $.mobile.changePage($("#pageConfirmation"));
         return;
      } else if (response.result.indexOf("cancel") !== -1)
      {
         $.mobile.changePage($("#pageOptions"));
      }
      else {
         setPageStatus("#paymentDetailsStatus", "Unrecognized: " + response.result);
      }
   } else {
      setPageStatus("#paymentDetailsStatus", response.result);
   }
   setTimeout(function()
   {
      startSubmitRecorder();
   }, viewTime);
}

function paymentSubmitRecordingCallback(recordingFile)
{
   if($.mobile.activePage.attr("id") !== "pagePaymentDetails") return;
   
   setPageStatus("#paymentDetailsStatus", "Converting to text..");
   readSpeechFile(recordingFile, paymentSubmitCallback);
}

function startSubmitRecorder()
{
   if($.mobile.activePage.attr("id") !== "pagePaymentDetails") return;
   $("#paymentInstructions").html("Submit or Cancel Payment?");
   setListeningStatus("#paymentDetailsStatus");
   startRecording(paymentSubmitRecordingCallback);   
}

function confirmationCallback(response)
{
   if (response.isSuccessful) {
      // if yes found, then continue 
      if (response.result.indexOf("yes") !== -1)
      {
         $.mobile.changePage($("#pageSuccess"));
         return;
      } else if (response.result.indexOf("cancel") !== -1)
      {
         $.mobile.changePage($("#pageOptions"));
      }
      else {
         setPageStatus("#confirmationPageStatus", "Unrecognized: " + response.result);
      }
   } else {
      setPageStatus("#confirmationPageStatus", response.result);
   }
   setTimeout(function()
   {
      startConfirmRecorder();
   }, viewTime);
}

function confirmationRecordingCallback(recordingFile)
{
   if($.mobile.activePage.attr("id") !== "pageConfirmation") return;
   
   setPageStatus("#confirmationPageStatus", "Converting to text..");
   readSpeechFile(recordingFile, confirmationCallback);
}

function startConfirmRecorder()
{
   if($.mobile.activePage.attr("id") !== "pageConfirmation") return;
   $("#confirmAmountLabel").html("Pay: " + formatMoney(amount, 2, "$"));
   $("#confirmDateLabel").html("On: " + submitDate);
   
   setListeningStatus("#confirmationPageStatus");
   startRecording(confirmationRecordingCallback);   
}

function onPause() 
{
   WL.App.close();
}
/* JavaScript content from js/Banking.js in folder android */
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