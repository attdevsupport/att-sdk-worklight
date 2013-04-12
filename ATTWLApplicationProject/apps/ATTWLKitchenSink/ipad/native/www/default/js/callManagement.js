
/* JavaScript content from js/callManagement.js in folder common */
var params={},invocationData={},options={};

/**
 * Function to create a Call Management Session
 * @param inParams: Parameters to create session
 * @param callbackFunc: Callback Function after session creation call
 */
function createSession(inParams, callbackFunc)
{
	params=
	{
		'body' : inParams,
		'contentType' : 'application/json',
		'accept' : 'application/json',
		'accessToken': window.localStorage.accessToken
	};
	
	invocationData= {
		adapter : 'CallManagement' ,
		procedure : 'createSession' ,
		parameters : [params]			
	};
	options = {
		onSuccess : function(result)
		{
			WL.Logger.debug("Success : Response is - "+JSON.stringify(result));
			var responseSessionId='';
			if(result.invocationResult.CreateSessionResponse === undefined)
			{
				if(result.invocationResult.Id === undefined) {
				   responseSessionId = result.invocationResult.id;
				} else {
				   responseSessionId = result.invocationResult.Id;	
				}
			} else {
				responseSessionId = result.invocationResult.CreateSessionResponse.id;
			}
			callbackFunc(result, responseSessionId);
		} ,
		onFailure : function(error)
		{
			WL.Logger.debug("Failiure : Response is - "+error);
			console.log(error);
			callbackFunc(error);
		} ,
		invocationContext : inParams
	};
	
	WL.Client.invokeProcedure(invocationData, options);
}
		
/**
 * Function to get the delivery status of an SMS sent to AT&T Mobile network devices 
 * @param smsId - SMS ID generated after SMS is sent
 * @param callbackFunc - CallBack function after successful call of delivery status
 */
	
sendSignal = function(sessionId, callbackFunc) {
	busyInd.show();
	params={
		'accept' : 'application/json',
		'contentType' : 'application/json',
		'accessToken': window.localStorage.accessToken,
		'sessionId' : sessionID,
		'signal' : 'exit'
	};
	
	invocationData= {
		adapter : 'CallManagement' ,
		procedure : 'sendSignal' ,
		parameters : [params]			
	};
	options =
	{
		onSuccess : function(result) {
						busyInd.hide();
						WL.Logger.debug("Success : Response is - "+JSON.stringify(result));
						callbackFunc(result);
					} ,
		onFailure : function(error) {
						busyInd.hide();
						WL.Logger.debug("Failiure : Response is - "+error);
						console.log('error');
						callbackFunc(error);
					},
		invocationContext : inParams
	};
	
	WL.Client.invokeProcedure(invocationData, options);
};