/*
 * 
 */
function search(options)
{
	var input = {
		method :'get',
		path : '/ATTDPSDEMO/contacts.json',
		headers: {
			"Accept" : "Content-type: application/json"
		}
	};
	
	logInfo('********* Contacts.search ***********');
	logInfo('Input : '+com.worklight.server.integration.api.JSObjectConverter.toFormattedString(input));
	
	options.searchKey = options.searchKey;
	
	var result=WL.Server.invokeHttp(input);
	
	logInfo('Contacts.search Response : '+com.worklight.server.integration.api.JSObjectConverter.toFormattedString(result));
	
	var filteredContacts = [];
	
	if(result && result.statusCode == 200 && result.isSuccessful) {
		resultContacts = result.Contacts;
		iMatch=-1;
		logInfo('Search list');
		for(var iContact=0; iContact<resultContacts.length; iContact++)
	    {
			logInfo('Check '+ resultContacts[iContact].name.toLowerCase());
			if(resultContacts[iContact].name.toLowerCase().indexOf(options.searchKey) >=0 )
			{
			   logInfo('Found match');
			   filteredContacts[++iMatch] = resultContacts[iContact];
			}
		}
	}
	return { 'Contacts': filteredContacts };
}

function logInfo(value) {
	WL.Logger.debug(value);
}

