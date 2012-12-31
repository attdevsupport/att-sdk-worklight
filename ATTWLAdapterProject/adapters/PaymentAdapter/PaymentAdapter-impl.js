//Url value that is common in all methods of Payment API.
var baseEndPoint = 'rest/3/Commerce/Payment/';
/*The following variable is used specifically for Refund Transaction method. We have used java code to execute the process as the direct invoke http through
 * javascript was giving unidentified problem in Worklight version 5.0.5. The java code requires the host name which cannot be directly fetched from the domain
 * of the adapter. Thus, we have explicitly mentioned the domain in this file so that it is accessible in the java code.*/
var domain = "https://api.att.com/";
/**
 * method logInfo A common method used to print the debug statements.It is an
 * Internal method.
 * 
 * @param value
 *            statement value hat you want to show in debug.
 */
function logInfo(value) {
	WL.Logger.debug(value);
}
/**
 * method newTransaction newTransaction method of payment API.
 * 
 * @param options
 *            A JSON Object that has all the required Parameters.
 * @returns {String} url value.
 */
function newTransaction(options) {
	var url = {
		"url" : "https://api.att.com/rest/3/Commerce/Payment/Transactions"
				+ '?Signature=' + options.signature + "&SignedPaymentDetail="
				+ options.signedDocument + "&clientid=" + WL.Server.configuration["apiKey"]
	};
	logInfo('********* NEW TRANSACTION LOGS *********');
	logInfo('Input : '
			+ com.worklight.server.integration.api.JSObjectConverter
					.toFormattedString(options));
	logInfo('Response : ' + url);
	return url;
}

/**
 * method getTransactionStatus method of Payment API.
 * 
 * @param options
 *            A JSON Object that has all the required Parameters.
 * @returns response of getTransactionStatus method.
 */
function getTransactionStatus(options) {
	var input = {
		method : 'get',
		path : baseEndPoint + 'Transactions/'+options.idType+'/'+options.id,
		headers : {
			'Authorization' : options.accessToken,
		}
	};
	if (options.accept !== undefined) {
		input.headers.Accept = options.accept;
	}
	logInfo('********* GET TRANSACTION STATUS LOGS *********');
	logInfo('Input : '
			+ com.worklight.server.integration.api.JSObjectConverter
					.toFormattedString(input));
	// http call to AT&T service
	var result = WL.Server.invokeHttp(input);

	logInfo('Response : '
			+ com.worklight.server.integration.api.JSObjectConverter
					.toFormattedString(result));
	return result;
}

/**
 * method refundTransaction method of Payment API.
 * 
 * @param options
 *            A JSON Object that has all the required Parameters.
 * @returns response of refundTransaction method.
 */
/*function refundTransaction(options) {
	var input = {
		method : 'put',
		path : baseEndPoint + 'Transactions/' + options.transactionId
				+ '?Action=' + options.action,
		headers : {
			'Authorization' : options.accessToken,
			"Content-Type" : options.contentType,
		},
		body : {
			"contentType" : options.contentType
		}

	};
	if (options.accept !== undefined) {
		input.headers.Accept = options.accept;
	}
	if (options.contentType !== undefined
			&& options.contentType === "application/json") {
		input.body.content = com.worklight.server.integration.api.JSObjectConverter
				.toFormattedString(options.body);
	} else {
		input.body.content = options.body;
	}
	logInfo('********* REFUND TRANSACTION   LOGS *********');
	logInfo('Input : '
			+ com.worklight.server.integration.api.JSObjectConverter
					.toFormattedString(input));
	// http call to AT&T service
	var result = WL.Server.invokeHttp(input);

	logInfo('Response : '
			+ com.worklight.server.integration.api.JSObjectConverter
					.toFormattedString(result));
	return result;
}*/

function refundTransaction(options) {
	options.host = domain+baseEndPoint + 'Transactions/' + options.transactionId+ '?Action=' + options.action;
	WL.Logger.debug(options.host);
	var refundHelper = new com.att.PaymentHelper();
	var response = refundHelper.refundTransaction(options);
	logInfo('********* REFUND ADAPTER LOGS ***********');
	logInfo('Response : '+com.worklight.server.integration.api.JSObjectConverter.toFormattedString(response));
	return {
		result: response
	};
}

/**
 * method getNotification method of Payment API.
 * 
 * @param options
 *            A JSON Object that has all the required Parameters.
 * @returns response of getNotification method.
 */
function getNotification(options) {
	var input = {
		method : 'get',
		path : baseEndPoint + 'Notifications/' + options.notificationId,
		headers : {
			'Authorization' : options.accessToken,
		}
	};
	if (options.accept !== undefined) {
		input.headers.Accept = options.accept;
	}
	logInfo('********* GET NOTIFICATION  LOGS *********');
	logInfo('Input : '
			+ com.worklight.server.integration.api.JSObjectConverter
					.toFormattedString(input));
	// http call to AT&T service
	var result = WL.Server.invokeHttp(input);

	logInfo('Response : '
			+ com.worklight.server.integration.api.JSObjectConverter
					.toFormattedString(result));
	return result;

}

/**
 * method deleteNotification method of Payment API.
 * 
 * @param options
 *            A JSON Object that has all the required Parameters.
 * @returns response of deleteNotification method.
 */
function deleteNotification(options) {
	var input = {
		method : 'put',
		path : baseEndPoint + 'Notifications/' + options.notificationId,
		headers : {
			'Authorization' : options.accessToken,
		}
	};
	if (options.accept !== undefined) {
		input.headers.Accept = options.accept;
	}
	logInfo('********* DELETE TRANSACTION LOGS *********');
	logInfo('Input : '
			+ com.worklight.server.integration.api.JSObjectConverter
					.toFormattedString(input));
	// http call to AT&T service
	var result = WL.Server.invokeHttp(input);

	logInfo('Response : '
			+ com.worklight.server.integration.api.JSObjectConverter
					.toFormattedString(result));
	return result;
}

/**
 * method newSubscription newSubscription method of payment API.
 * 
 * @param options
 *            A JSON Object that has all the required Parameters.
 * @returns {String} url value.
 */
function newSubscription(options) {
	var url = {
		"url" : "https://api.att.com/rest/3/Commerce/Payment/Subscriptions"
				+ '?Signature=' + options.signature + "&SignedPaymentDetail="
				+ options.signedDocument + "&clientid=" + WL.Server.configuration["apiKey"]
	}
	logInfo('********* NEW SUBSCRIPTION  LOGS *********');
	logInfo('Input : '
			+ com.worklight.server.integration.api.JSObjectConverter
					.toFormattedString(options));
	logInfo('Response : ' + url);
	return url
};

/**
 * method getSubscriptionStatus getSubscriptionStatus method of payment API.
 * 
 * @param options
 *            A JSON Object that has all the required Parameters.
 * @returns response of getSubscriptionStatus method.
 */
function getSubscriptionStatus(options) {
	var input = {
		method : 'get',
		path : baseEndPoint + 'Subscriptions/'+options.idType+'/'+options.id,
		headers : {
			'Authorization' : options.accessToken,
		}
	};
	if (options.accept !== undefined) {
		input.headers.Accept = options.accept;
	}
	logInfo('********* GET SUBSCRIPTION STATUS LOGS *********');
	logInfo('Input : '
			+ com.worklight.server.integration.api.JSObjectConverter
					.toFormattedString(input));
	// http call to AT&T service
	var result = WL.Server.invokeHttp(input);

	logInfo('Response : '
			+ com.worklight.server.integration.api.JSObjectConverter
					.toFormattedString(result));
	return result;
};
/**
 * method getSubscriptionDetails getSubscriptionDetails method of payment API.
 * 
 * @param options
 *            A JSON Object that has all the required Parameters.
 * @returns response of getSubscriptionDetails method.
 */
function getSubscriptionDetails(options) {
	var input = {
		method : 'get',
		path : baseEndPoint + 'Subscriptions/' + options.merchantSubscriptionId
				+ '/Detail/' + options.consumerId,
		headers : {
			'Authorization' : options.accessToken,
		}
	};
	if (options.accept !== undefined) {
		input.headers.Accept = options.accept;
	}
	logInfo('********* GET SUBSCRIPTION DETAILS  LOGS *********');
	logInfo('Input : '
			+ com.worklight.server.integration.api.JSObjectConverter
					.toFormattedString(input));
	// http call to AT&T service
	var result = WL.Server.invokeHttp(input);

	logInfo('Response : '
			+ com.worklight.server.integration.api.JSObjectConverter
					.toFormattedString(result));
	return result;
}