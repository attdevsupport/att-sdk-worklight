
/* JavaScript content from js/lateMessage.js in folder common */
var sendLateMessage = function(numberToDial, message)
{
	var sessionParams =
	{
       "feature": "broadcastMsg",
       "numberToDial": numberToDial,
       "messageText" : message
	};
	
	if(window.localStorage.accessToken===undefined)
	{
		generateAccessToken(function()
		{
			sessionParams.accessToken = window.localStorage.accessToken;
			createSession(sessionParams, progressCallback);
		});
	}
	else
	{
		sessionParams.accessToken = window.localStorage.accessToken;
		createSession(sessionParams, openDialog);
	}
};

var broadcastLateMessage = function()
{
	//clearProgress();
	
	var lateMessage = document.getElementById("broadcastMsg").value;
	var phoneNumbersText = document.getElementById("phoneNumbers").value;

	if (phoneNumbersText.length > 0 && lateMessage.length > 0)
	{
		var phoneNumberList = phoneNumbersText.split(",");

		for ( var i = 0; i < phoneNumberList.length; i = i + 1)
		{
		   sendLateMessage(phoneNumberList[i], lateMessage);
		}
	}
};



