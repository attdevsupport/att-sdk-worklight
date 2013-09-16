
/* JavaScript content from js/immn.js in folder common */
var params={},invocationData={},options={};

/**
 * Function to send an MMS message via IMMN
 * @param addresses Array of phone numbers, codes or email addresses to send the message to
 * @param message Text to be sent the message (optional)
 * @param subject Subject of the message (optional)
 * @param attachements Array of attachments.  Each attachment is an object { name:"file.name", contentType : "image/jpeg", file: "BASE64 ENCODED FILE DATA"}, 
 * @param cbData Success Callback Function after SMS is sent successfully
 * @param busyInd Busy indicator
 */
function invokeImmnSendMessage(addresses, text, subject, attachments, cbData, busyInd)
{
	busyInd.show();
	
	params = {
		'addresses' : number,
		'contentType' : 'application/json',
		'accept' : 'application/json',
		'accessToken': window.localStorage.oAuthToken
	};

	if(exists(text)) params.text = text;	
	if(exists(subject)) params.subject = subject;
	if(exists(attachments)) params.attachments = attachments;
	
	invocationData= {
			adapter : 'ImmnAdapter' ,
			procedure : 'sendMessage' ,
			parameters : [params]			
	};
	options = {
		onSuccess : function(data) {
			busyInd.hide();
			WL.Logger.debug("Success : Response is - "+JSON.stringify(data));
			var immnMsgId='';
			
			if(data.invocationResult.messageId !== undefined)
			{
				immnMsgId = data.invocationResult.messageId;
			}
			
			cbData(data, immnMsgId);
		},
		onFailure : function(error) {
						busyInd.hide();
						WL.Logger.debug("Failure : Response is - "+error);
						console.log(error);
						cbData(error);
		} ,
		invocationContext : {}
	};
	
	WL.Client.invokeProcedure(invocationData, options);
}
