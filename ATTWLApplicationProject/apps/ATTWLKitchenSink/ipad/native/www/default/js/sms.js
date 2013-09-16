
/* JavaScript content from js/sms.js in folder common */
var shortCode='48507088';
var accessToken;
var params={},invocationData={},options={};

/**
 * Function to send an SMS to one or more AT&T Mobile Network devices
 * @param number address to send the SMS to
 * @param message Text to be sent in the SMS
 * @param cbData Success Callback Function after SMS is sent successfully
 */
	function sendSMS(number,message,cbData,busyInd){
		busyInd.show();
		
		/* UNCOMMENT THE FOLLOWING FOR CONTENT TYPE AS 'application/json' */
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
		
		/* UNCOMMENT THE FOLLOWING FOR CONTENT TYPE AS 'application/xml' */
		 
//		params={
//				"body":"<outboundSmsRequest>"+"<address>"+number+"</address>"+"<message>"+message+"</message>"+"</outboundSmsRequest>",
//				'contentType' : 'application/xml',
//				'accept' : 'application/json',
//				'accessToken': window.localStorage.accessToken
//					};
		
		/* UNCOMMENT THE FOLLOWING FOR CONTENT TYPE AS 'application/x-www-form-urlencoded' */
		
//		params={
//				"body":"address="+encodeURIComponent(number)+"&message="+encodeURIComponent(message),
//				'contentType' : 'application/x-www-form-urlencoded',
//				'accept' : 'application/json',
//					};
//				'accessToken': window.localStorage.accessToken
		invocationData= {
				adapter : 'SMSAdapter' ,
				procedure : 'sendSMS' ,
				parameters : [params]			
		};
		options = {
			onSuccess : function(data) {
				busyInd.hide();
				WL.Logger.debug("Success : Response is - "+JSON.stringify(data));
				var smsId='';
				
				if(data.invocationResult.outboundSMSResponse !== undefined)
				{
					smsId = data.invocationResult.outboundSMSResponse.messageId;
				}
				
				cbData(data, smsId);
			},
			onFailure : function(error) {
							busyInd.hide();
							WL.Logger.debug("Failiure : Response is - "+error);
							console.log(error);
							cbData(error);
			} ,
			invocationContext : {}
		};
		
		WL.Client.invokeProcedure(invocationData, options);
	}
		
	/**
	 * Function to get the delivery status of an SMS sent to AT&T Mobile network devices 
	 * @param smsId - SMS ID generated after SMS is sent
	 * @param cbData - CallBack function after successful call of delivery status
	 */
		
	getSmsDeliveryStatus = function(smsId, cbData) {
		busyInd.show();
		/* UNCOMMENT THE FOLLOWING FOR CONTENT TYPE AS 'application/json' */
			params={
					'smsId':smsId,
					'accept' : 'application/json',
					'contentType' : 'application/json',
					'accessToken': window.localStorage.accessToken
			};
			
		/* UNCOMMENT THE FOLLOWING FOR CONTENT TYPE AS 'application/xml' */
//			params={
//					'smsId':smsId,
//					'accept' : 'application/json',
//					'contentType' : 'application/xml',
//					'accessToken': window.localStorage.accessToken
//			};
			
		/* UNCOMMENT THE FOLLOWING FOR CONTENT TYPE AS 'application/x-www-form-urlencoded' */
//			params={
//					'smsId':smsId,
//					'accept' : 'application/json',
//					'contentType' : 'application/x-www-form-urlencoded',
//					'accessToken': window.localStorage.accessToken
//			};
			
			invocationData= {
					adapter : 'SMSAdapter' ,
					procedure : 'getSMSDeliveryStatus' ,
					parameters : [params]			
			};
			options = {
					onSuccess : function(data) {
									busyInd.hide();
									WL.Logger.debug("Success : Response is - "+JSON.stringify(data));
									cbData(data);
					} ,
					onFailure : function(error) {
									busyInd.hide();
									WL.Logger.debug("Failiure : Response is - "+error);
									console.log('error');
									cbData(error);
					} ,
					invocationContext : {}
			};
			
			WL.Client.invokeProcedure(invocationData, options);
		};
	
/**
 * Function to get the SMS sent to a shortcode
 * @param cbData - Callback function after successful invocation of the method
 */
	getSms = function(cbData) {
		
		busyInd.show();
		
		/* UNCOMMENT THE FOLLOWING FOR CONTENT TYPE AS 'application/json' */
			params={
					'accept' : 'application/json',
					'registrationId' : shortCode,
					'contentType' : 'application/json',
					'accessToken': window.localStorage.accessToken
			};
	
		/* UNCOMMENT THE FOLLOWING FOR CONTENT TYPE AS 'application/xml' */
//			params={
//					'accept' : 'application/json',
//					'registrationId' : shortCode,
//					'contentType' : 'application/xml',
//					'accessToken': window.localStorage.accessToken
//			};
			
		/* UNCOMMENT THE FOLLOWING FOR CONTENT TYPE AS 'application/x-www-form-urlencoded' */
//			params={
//					'accept' : 'application/json',
//					'registrationId' : shortCode,
//					'contentType' : 'application/x-www-form-urlencoded',
//					'accessToken': window.localStorage.accessToken
//			};
			
			invocationData= {
					adapter : 'SMSAdapter' ,
					procedure : 'getSMS' ,
					parameters : [params]			
			};
			options = {
					onSuccess : function(data) {
									busyInd.hide();
									console.log('success : ' + JSON.stringify(data));
									cbData(data);
					} ,
					onFailure : function(error) {
									busyInd.hide();
									WL.Logger.debug("Failiure : Response is - "+error);
									cbData(error);
					} ,
					invocationContext : {}
			};
			
			WL.Client.invokeProcedure(invocationData, options);
		};