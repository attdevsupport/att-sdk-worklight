var MerchantPaymentRedirectUrl = "https://ldev.code-api-att.com/ATTDPSDEMO/payment_lp.html";
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
			var windowRef = window.open(signedData.invocationResult.url, '_blank', 'location=no');
			
			windowRef.addEventListener('loadstop', function(event) {
				busyInd.hide();
				var url = event.url;
				
				if (url.indexOf('success') !== -1) {
					alert("Failed transaction: \n" + url);
					windowRef.close();
				} else {
					if (url.indexOf('TransactionAuthCode') !== -1)
					{
						var index = url.indexOf("TransactionAuthCode");
						window.localStorage.TransactionAuthCode = url
								.substr(index + 20,
										url.length + 1);
						WL.Logger
								.debug("TransactionAuthCode is "
										+ window.localStorage.TransactionAuthCode);
						$("#btntransactionstatus").attr(
								"disabled", false);
						alert("Transaction successful: " + window.localStorage.TransactionAuthCode);
						windowRef.close();
					}
				}
			});
			
			windowRef.addEventListener('loaderror', function(event) {
				alert("Unable to load payment consent page. " + event.message);
				windowRef.close();
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
				    "RefundReasonCode":9,
				    "RefundReasonText":"Refunding test payments",
				    "Action": "refund"
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
			alert("Refund successful");
			$("#txtable tr").each(function() {
				if (this.id == window.localStorage.TransactionId) {
					$(this).remove();
					window.localStorage.removeItem("TransactionId");
					window.localStorage.removeItem("subscriptionAuthCode");
					window.localStorage.removeItem("TransactionAuthCode");
					$("#refundtransaction").attr("disabled", "true");
				}
			});
		};

		function getFailure(error) {
			busyInd.hide();
			WL.Logger.debug('ERROR : ' + JSON.stringify(error));
			alert('Refund Error :' + JSON.stringify(error));
		};
		
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

			$("#transactionFrame").load(function() {
				busyInd.hide();
				$("#iframe").show();
				var url = this.contentDocument.location.href;
				if (url.indexOf('success') != -1) {
					$("#iframe").hide();
					alert("Failed transaction: \n" + url);
				} else {
					if (url.indexOf('SubscriptionAuthCode') !== -1) {
						var index = url
								.indexOf("SubscriptionAuthCode");
						window.localStorage.subscriptionAuthCode = url
								.substr(index + 21,
										url.length + 1);
						WL.Logger.debug("SubscriptionAuthCode is " +
						     window.localStorage.subscriptionAuthCode);
						$("#btnsubscriptionstatus").attr(
								"disabled", false);
						$("#btnsubscriptiondetails").attr(
								"disabled", false);
						$("#iframe").hide();
						alert("Subscription successful: " + window.localStorage.subscriptionAuthCode);
					}
				}
			});
		};
		
		function getFailure(error) {
			busyInd.hide();
			WL.Logger.debug('ERROR : ' + JSON.stringify(error));
			console.log(error);
		};
		
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
			alert("GetSubscriptionDetails Success:" + JSON.stringify(data, null, 3));
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

	}
};