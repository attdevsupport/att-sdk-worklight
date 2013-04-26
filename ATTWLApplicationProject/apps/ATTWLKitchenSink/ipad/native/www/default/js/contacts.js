
/* JavaScript content from js/contacts.js in folder common */
/*var getContacts = function()
{
	document.getElementById('phoneNumbers').value="4255032246";
};*/

var showContacts = function()
{
	$('#mainCMS').hide();
	$('#contactsContent').show();
};

var hideContacts = function()
{
	$('#contactsContent').hide();
	$('#mainCMS').show();
};

function getContacts()
{
	var myJsonObj;
	
	busyInd.show();
	
	showContacts();
	
	$.getJSON('https://ldev.code-api-att.com/ATTDPSDEMO/cliniccontacts.json', function(data)
	{
		busyInd.hide();
		
		myJsonObj = data;

		var contactsListTB = document.getElementById('contactListTB');
		var contactsListTBBody = contactsListTB.getElementsByTagName('tbody')[0];
		var tableRow;
		var tableCell;
		
		while (contactsListTBBody.childNodes.length > 0) {
			contactsListTBBody.removeChild(contactsListTBBody.firstChild);
		}
		
		for (var contactCnt=0; contactCnt<myJsonObj.Contacts.Doctor.length; contactCnt++) {
			tableRow = contactsListTBBody.insertRow(0);
			//tableRow.class = "trow";
			tableCell = tableRow.insertCell(0);
			//tableCell.class = "tcol";
			tableCell.innerHTML= "<input name=\"contacts\" type=\"checkbox\" value=\"" +
			   myJsonObj.Contacts.Patient[contactCnt].number+"\" />" +
			   myJsonObj.Contacts.Doctor[contactCnt].name +
			   " (" + myJsonObj.Contacts.Doctor[contactCnt].number + ")";
		}
		
		for (var contactCnt=0; contactCnt<myJsonObj.Contacts.Patient.length; contactCnt++) {
			tableRow = contactsListTBBody.insertRow(0);
			//tableRow.class = "trow";
			tableCell = tableRow.insertCell(0);
			//tableCell.class = "tcol";
			tableCell.innerHTML= "<input name=\"contacts\" type=\"checkbox\" value=\"" +
			   myJsonObj.Contacts.Patient[contactCnt].number+"\" />" +
			   myJsonObj.Contacts.Patient[contactCnt].name + " (" +
			   myJsonObj.Contacts.Patient[contactCnt].number + ")";
		}
	});
}

function returnToMainCMS()
{
    hideContacts();

	var numbersList = "";
	var checkBoxContacts = document.getElementsByName("contacts");
	for(var isChecked=0;isChecked<checkBoxContacts.length;isChecked++)
	{
	    if(checkBoxContacts[isChecked].checked)
	    {
    		if(isChecked>0) {
    			numbersList = numbersList + ",";
    		}
    		numbersList = numbersList + checkBoxContacts[isChecked].value;
	    }
	}
	document.getElementById('phoneNumbers').value = numbersList;
}