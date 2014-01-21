var MerchantPaymentRedirectUrl = "http://attdemo.somee.com/ATTNotifications/PaymentSuccess.aspx";
var Amount = "0.99";
var Category = 1;
var Channel = "MOBILE_WEB";
var Description = "Test Worklight";
var IsPurchaseOnNoActiveSubscription = false;
var SubscriptionRecurrences = 99999;
var SubscriptionPeriod = 'MONTHLY';
var SubscriptionPeriodAmount = 1;

function isDeviceiOS(){
	if((navigator.userAgent.match(/(iPhone)/))||(navigator.userAgent.match(/(iPad)/)))
	{
	   $("#iframe").attr('class', 'iframeIphone');
	}
	else{
	   $("#iframe").attr('class', 'iframeAndroid');
	}
}

var ATT = {

	/*
	 * NOTARY SIGN PAYLOAD @param Data -notaryData - Mandatory @param clientId
	 * Mandatory @param clientSecret Mandatory
	 */

	transactionData : function()
	{
		WL.Logger.debug('getTransactionData Called');
		var min = 1000000000, max = 9999999999, rnd = Math
				.floor(Math.random() * (max - min + 1))
				+ min;
		window.localStorage.MerchantTransactionId = "skuser" + rnd;
		WL.Logger.debug("value of window.localStorage.MerchantTransactionId"
				+ window.localStorage.MerchantTransactionId);
		var notaryData = {
			"Amount" : Amount,
			"Category" : Category,
			"Channel" : Channel,
			"Description" : Description,
			"MerchantTransactionId" : "skuser" + rnd,
			"MerchantProductId" : "l" + rnd,
			"MerchantPaymentRedirectUrl" : MerchantPaymentRedirectUrl
		};
      return notaryData;
	},
   
	subscriptionData : function()
	{
	   WL.Logger.debug('Subscription Data Called');
	   var min = 1000000000, max = 9999999999, rnd = Math.floor(Math.random() * (max - min + 1)) + min;
	   window.localStorage.MerchantTransactionId = "skuser" + rnd;
	   WL.Logger.debug("value of window.localStorage.MerchantTransactionId"
	         + window.localStorage.MerchantTransactionId);
	   var notaryData = {
	      "Amount" : Amount,
	      "Category" : Category,
	      "Channel" : Channel,
	      "Description" : Description,
	      "MerchantTransactionId" : "skuser" + rnd,
	      "MerchantProductId" : "l" + rnd,
	      "MerchantPaymentRedirectUrl" : MerchantPaymentRedirectUrl,
	      "MerchantSubscriptionIdList" : 'ML' + rnd,
	      "IsPurchaseOnNoActiveSubscription" : IsPurchaseOnNoActiveSubscription,
	      "SubscriptionRecurrences" : SubscriptionRecurrences,
	      "SubscriptionPeriod" : SubscriptionPeriod,
	      "SubscriptionPeriodAmount" : SubscriptionPeriodAmount
	   };
	   return notaryData;
	},
   
   notary : function(cbData, notaryData)
   {
      WL.Logger.debug('Noatry Called');

      var requestData = {
         'contentType' : 'application/json',
         'accept' : 'application/json',
         'data' : notaryData
      };

      var data = {
         adapter : "NotaryAdapter",
         procedure : "getSignedPayload",
         parameters : [ requestData ]
      };
      
      function getSuccess(signedData) {
         WL.Logger.debug('RESPONSE : ' + JSON.stringify(signedData));
         cbData(signedData.invocationResult.Signature,
               signedData.invocationResult.SignedDocument);

      }

      function getFailure(error) {
         WL.Logger.debug('Error : ' + JSON.stringify(error));
         alert("error is  " + JSON.stringify(error));
      }

      WL.Client.invokeProcedure(data, {
         onSuccess : getSuccess,
         onFailure : getFailure
      });
   },
   
	transaction : function(type) {
		busyInd.show();
		isDeviceiOS();
		if (type === "transaction") {
			ATT.notary(ATT.newTransaction, ATT.transactionData());
		} else if (type === "subscription") {
			ATT.notary(ATT.setSubscription, ATT.subscriptionData());
		}
	},

	/*
	 * NEW TRANSACTION @param SignedDocument -SignedDocument(received after
	 * calling sign payload)- Mandatory @param Signature -Signature(received
	 * after calling sign payload)- Mandatory @param ClientId - client- id for
	 * which app is registered for payment - Mandatory
	 */

	newTransaction : function(signature, signedDocument)
	{	
		var params = {
			'signature' : signature,
			'signedDocument' : signedDocument,
		};
		var data = {
			adapter : "PaymentAdapter",
			procedure : "newTransaction",
			parameters : [ params ]
		};
		function getSuccess(signedData)
		{
			document.getElementById("transactionFrame").src = signedData.invocationResult.url;
			
			$("#transactionFrame")
					.load(
							function() {
								busyInd.hide();
								$("#iframe").show();
								var url = this.contentDocument.location.href;
								
								if (url.indexOf('success') !== -1) {
									alert("Failed transaction: \n" + url);
									$("#iframe").hide();
								} else {
									if (url.indexOf('TransactionAuthCode') !== -1) {
										
										var index = url
												.indexOf("TransactionAuthCode");
										window.localStorage.TransactionAuthCode = url
												.substr(index + 20,
														url.length + 1);
										WL.Logger
												.debug("TransactionAuthCode is "
														+ window.localStorage.TransactionAuthCode);
										$("#btntransactionstatus").attr(
												"disabled", false);
										$("#iframe").hide();
									}
								}
							});
		}

		function getFailure(error) {
			busyInd.hide();
			WL.Logger.debug('ERROR : ' + JSON.stringify(error));
			alert("error is " + JSON.stringify(error));

		}
		
		WL.Client.invokeProcedure(data, {
			onSuccess : getSuccess,
			onFailure : getFailure
		});

	},

	/*
	 * GET TRANSACTION STATUS - Status can be check passing one of the following :-
	 * 1)@param TransactionAuthCode -TransactionAuthCode(received after calling
	 * new transaction). 2)@prams MerchantTransactionId -"skuser" + ticks;
	 * 3)@param TransactionId
	 */

	getTransactionStatus : function(OauthCode) {
		busyInd.show();
		WL.Logger.debug('getTransactionStatus called');
		var params = {
		    'idType':'TransactionAuthCode',
			'id' : OauthCode,
			'accessToken' : window.localStorage.accessToken,
			'accept':'application/json'
		};
		var data = {
			adapter : "PaymentAdapter",
			procedure : "getTransactionStatus",
			parameters : [ params ]
		};
		function getSuccess(data) {
			busyInd.hide();
			if (data.invocationResult.TransactionId.length > 19) {
				transacId = data.invocationResult.TransactionId.substring(0,
						18)	+ '..';
			} else {
				transacId = data.invocationResult.TransactionId;
			}
			WL.Logger.debug('RESPONSE : ' + JSON.stringify(data));
			var newRow = $("<tr class=\"txrow\" id=\""
					+ data.invocationResult.TransactionId
					+ "\"><td align=\"left\" class=\"txcolleft\">"
					+transacId
					+ "</td>"
					+ "<td align=\"right\" class=\"txcolright\"><input type=\"radio\" name=\"rdtransaction\"></td></tr>");
			$("#txtable").append(newRow);
			newRow
					.find('td input:radio')
					.click(
							function() {
								window.localStorage.TransactionId = data.invocationResult.TransactionId;
								$("#refundtransaction").attr("disabled", false);
							});
			$("#btntransactionstatus").attr("disabled", true);
			console.log('GetTransactionStatus Success :' + data);
		}

		function getFailure(error) {
			busyInd.hide();
			WL.Logger.debug('ERROR : ' + JSON.stringify(error));
			alert('GetTransactionStatus Error :' + JSON.stringify(error));
		}
		WL.Client.invokeProcedure(data, {
			onSuccess : getSuccess,
			onFailure : getFailure
		});

	},

	/*
	 * REFUND TRANSACTION - @param TransactionOperationStatus - value = Refunded -
	 * Mandatory @param RefundReasonCode - Mandatory @param RefundReasonText -
	 * Mandatory @param transactionID - get after calling gettransactionstatus -
	 * Mandatory
	 */

	refundTransaction : function() {
		busyInd.show();
		WL.Logger.debug('refundTransaction called');
		var params = {
			//"body" : "<RefundTransactionRequest><TransactionOperationStatus>Refunded</TransactionOperationStatus><RefundReasonCode>1</RefundReasonCode><RefundReasonText>Customer was unhappy</RefundReasonText></RefundTransactionRequest>",
			"body":{
				    "TransactionOperationStatus":"Refunded",
				    "RefundReasonCode":1,
				    "RefundReasonText":"Customer was not happy" 
			},
			"transactionId" : window.localStorage.TransactionId,
			"contentType" : "application/json",
			"action" : "refund",
			'accept' : 'application/json',
			'accessToken' : window.localStorage.accessToken
		};
		var data = {
			adapter : "PaymentAdapter",
			procedure : "refundTransaction",
			parameters : [ params ]
		};

		function getSuccess(data) {
			busyInd.hide();
			WL.Logger.debug('RESPONSE : ' + JSON.stringify(data));
			$("#txtable tr").each(function() {
				if (this.id == window.localStorage.TransactionId) {
					$(this).remove();
					window.localStorage.removeItem("TransactionId");
					$("#refundtransaction").attr("disabled", "true");
				}
			});
		}
		;

		function getFailure(error) {
			busyInd.hide();
			WL.Logger.debug('ERROR : ' + JSON.stringify(error));
			alert('RefundTransaction Error :' + JSON.stringify(error));
		}
		;
		WL.Client.invokeProcedure(data, {
			onSuccess : getSuccess,
			onFailure : getFailure
		});

	},

	/*
	 * NEW SUBSCRIPTION @param SignedDocument -SignedDocument(received after
	 * calling sign payload)- Mandatory @param Signature -Signature(received
	 * after calling sign payload)- Mandatory @param ClientId - client- id for
	 * which app is registered for payment - Mandatory
	 */

	setSubscription : function(signature, signedDocument) {
		WL.Logger.debug('setSubscription called');
		var params = {
			'signature' : signature,
			'signedDocument' : signedDocument,
		};
		var data = {
			adapter : "PaymentAdapter",
			procedure : "newSubscription",
			parameters : [ params ]
		};
		function getSuccess(data) {
			document.getElementById("transactionFrame").src = data.invocationResult.url;
			;

			$("#transactionFrame")
					.load(
							function() {
								busyInd.hide();
								$("#iframe").show();
								var url = this.contentDocument.location.href;
								if (url.indexOf('success') != -1) {
									$("#iframe").hide();
								} else {
									if (url.indexOf('SubscriptionAuthCode') !== -1) {
										var index = url
												.indexOf("SubscriptionAuthCode");
										window.localStorage.subscriptionAuthCode = url
												.substr(index + 21,
														url.length + 1);
										WL.Logger
												.debug("SubscriptionAuthCode is "
														+ window.localStorage.TransactionAuthCode);
										$("#btnsubscriptionstatus").attr(
												"disabled", false);
										$("#btnsubscriptiondetails").attr(
												"disabled", false);
										$("#iframe").hide();
									}
								}
							});

		}
		;
		function getFailure(error) {
			busyInd.hide();
			WL.Logger.debug('ERROR : ' + JSON.stringify(error));
			console.log(error);
		}
		;
		WL.Client.invokeProcedure(data, {
			onSuccess : getSuccess,
			onFailure : getFailure
		});
	},

	/*
	 * GET SUBSCRIPTION STATUS - Status can be check passing one of the
	 * following :- 1)@param subscriptionAuthCode -SubscriptionAuthCode(received
	 * after calling new Subscription). 2)@prams merchantTransactionId -passed
	 * in payload 3)@param subscriptionId -
	 */

	getSubscriptionStatus : function() {
		busyInd.show();
		WL.Logger.debug('getSubscriptionStatus called');
		var params = {
				'idType':'SubscriptionAuthCode',
			"id" : window.localStorage.subscriptionAuthCode,
			'accessToken' : window.localStorage.accessToken
		};
		
		var data = {
			adapter : "PaymentAdapter",
			procedure : "getSubscriptionStatus",
			parameters : [ params ]
		};

		function getSuccess(data) {
			WL.Logger.debug('RESPONSE : ' + JSON.stringify(data));
			if (data.invocationResult.SubscriptionId.length > 19) {
				subscrptnId = data.invocationResult.SubscriptionId.substring(0,
						18)	+ '..';
			} else {
				subscrptnId = data.invocationResult.SubscriptionId;
			}
			window.localStorage.MerchantSubscriptionId = data.invocationResult.MerchantSubscriptionId;
			window.localStorage.SubsConsumerId = data.invocationResult.ConsumerId;
			busyInd.hide();
			var newRow = $("<tr class=\"txrow\" id=\""
					+ data.invocationResult.SubscriptionId
					+ "\"><td align=\"left\" class=\"txcolleft\">"
					+ subscrptnId
					+ "</td>"
					+ "<td align=\"right\" class=\"txcolright\"><input type=\"radio\" name=\"rdtransaction\"></td></tr>");
			$("#txtable").append(newRow);
			newRow
					.find('td input:radio')
					.click(
							function() {
								window.localStorage.TransactionId = data.invocationResult.SubscriptionId;
								$("#refundtransaction").attr("disabled", false);
							});
			$("#btnsubscriptionstatus").attr("disabled", true);
		}
		;
		function getFailure(error) {
			WL.Logger.debug('ERROR : ' + JSON.stringify(error));
			busyInd.hide();
			alert("GetSubscriptionStatus Error :" + JSON.stringify(error));
		}
		;
		WL.Client.invokeProcedure(data, {
			onSuccess : getSuccess,
			onFailure : getFailure
		});

	},

	/*
	 * GET SUBSCRIPTION DETAILS - @param ConsumerId -ConsumerId(received after
	 * calling getSubscriptionStatus). @prams MerchantSubscriptionId -
	 * MerchantSubscriptionId(received after calling getSubscriptionStatus).
	 */

	getSubscriptionDetails : function() {
		busyInd.show();
		WL.Logger.debug('getSubscriptionDetails called');
		var params = {
			'consumerId' : window.localStorage.SubsConsumerId,
			'merchantSubscriptionId' : window.localStorage.MerchantSubscriptionId,
			'accessToken' : window.localStorage.accessToken
		};
		var data = {
			adapter : "PaymentAdapter",
			procedure : "getSubscriptionDetails",
			parameters : [ params ]
		};

		function getSuccess(data) {
			WL.Logger.debug('RESPONSE : ' + JSON.stringify(data));
			busyInd.hide();
			alert("GetSubscriptionDetails Success:" + JSON.stringify(data));
			$("#btnsubscriptiondetails").attr("disabled", true);
		}
		;

		function getFailure(error) {
			WL.Logger.debug('ERROR : ' + JSON.stringify(error));
			busyInd.hide();
			alert("GetSubscriptionDetails Error:" + error);
		};

		WL.Client.invokeProcedure(data, {
			onSuccess : getSuccess,
			onFailure : getFailure
		});

	},

	/*
	 * GET NOTIFICATION - @param NotificationID - Get NotificationID From App
	 * Hosted Through Tunnlr
	 */

	getNotification : function(notificationId) {
		busyInd.show();
		WL.Logger.debug('getNotification called');
		var params = {
			'notificationId' : notificationId,
			'accessToken' : window.localStorage.accessToken
		};
		var data = {
			adapter : "PaymentAdapter",
			procedure : "getNotification",
			parameters : [ params ]
		};

		function getSuccess(data) {
			busyInd.hide();
			WL.Logger.debug('RESPONSE : ' + JSON.stringify(data));
			
			alert('getNotification Success :' + JSON.stringify(data));
		};

		function getFailure(error) {
			busyInd.hide();
			WL.Logger.debug('ERROR : ' + JSON.stringify(error));
		
			alert('getNotification Error :' + error);
		}
		;
		WL.Client.invokeProcedure(data, {
			onSuccess : getSuccess,
			onFailure : getFailure
		});
	},

	/*
	 * DELETE NOTIFICATION - @param NotificationID - Get NotificationID
	 * From App Hosted Through Tunnlr
	 */

	deleteNotification : function(notificationId) {
		busyInd.show();
		WL.Logger.debug('deleteNotification called');
		var params = {
			'notificationId' : notificationId,
			'accessToken' : window.localStorage.accessToken
		};
		var data = {
			adapter : "PaymentAdapter",
			procedure : "deleteNotification",
			parameters : [ params ]
		};

		function getSuccess(data) {
			WL.Logger.debug('RESPONSE : ' + JSON.stringify(data));
			busyInd.hide();
			alert("DeleteNotification Success" + JSON.stringify(data));
			$("#notificationtable tr").each(
					function() {
						if (this.id == notificationId) {
							$(this).remove();
							$("#btngetnotification").attr("disabled", true);
							$("#btnacknowledgeNotification").attr("disabled",
									true);

							var originalList = $("#notificationIdToBeRemoved").val();
							if ($("#notificationIdToBeRemoved").val() != "") {
								originalList = originalList + ",";
							}
							$("#notificationIdToBeRemoved").val(
							   originalList + notificationId);
						}
					});
		}
		;
		function getFailure(error) {
			busyInd.hide();
			WL.Logger.debug('ERROR : ' + JSON.stringify(error));
			alert("AcknowleadgeNotification Error" + JSON.stringify(error));
		}
		;
		WL.Client.invokeProcedure(data, {
			onSuccess : getSuccess,
			onFailure : getFailure
		});
	}
};