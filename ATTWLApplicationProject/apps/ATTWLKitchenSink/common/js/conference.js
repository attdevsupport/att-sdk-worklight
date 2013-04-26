var makeConference = function()
{
	var phoneNumbersText = document.getElementById("phoneNumbers").value;

	if (phoneNumbersText.length > 0)
	{
		var phoneNumberList = phoneNumbersText.split(",");

		for ( var i = 0; i < phoneNumberList.length; i = i + 1)
		{
		   createSession({
			   "feature": "makeConf",
			   "numberToDial": phoneNumberList[i]
		   }, openDialog);
		}
	} else {
		alert("Please enter phone number(s).");
	}
};