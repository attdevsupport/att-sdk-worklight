/**
 * @class ATT
 * The AT&#38;T API Platform Adapters for IBM&#174; Worklight&#174; provide the following APIs.
 *
 * <ul>
 *   <li>{@link Advertising}</li>
 *   <li>{@link DeviceCapabilities}</li>
 *   <li>{@link InAppMessaging}</li>
 *   <li>{@link OAuthAdapter OAuth}</li>
 *   <li>{@link SMSAdapter SMS}</li>
 *   <li>{@link SpeechAdapter Speech}</li>
 *   <li>{@link TextToSpeech}</li>
 * </ul>
 */

/**
 * @class SMSAdapter
 * The Short Message Service (SMS) API enables your app to reliably send and receive secure text messages to mobile devices on the AT&amp;T network.
 * <p>Authorization Scope: <b>SMS</b></p>
 *
 * <b>The SMSAdapter API provides the following methods:</b>
 *
 * - {@link SMSAdapter#getSMS}
 * - {@link SMSAdapter#getSMSDeliveryStatus}
 * - {@link SMSAdapter#sendSMS}
 *
 */

 /**
 * @method sendSMS
 * Sends an SMS message to a recipient.
 * <p>Authorization Model: <b>client_credentials</b></p>
 *
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>SMSAdapter</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this parameter is <b>sendSMS</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} [invocationData.parameters.params.accept] Specifies the format of the object returned.
 * <p>The defined values for this parameter are:</p>
 * <ul>
 *   <li><b>application/json</b></li>
 *   <li><b>application/xml</b></li>
 * </ul>
 * @param {String} invocationData.parameters.params.contentType Specifies the format of the contents of the <b>body</b> parameter.
 * <p>The defined values for this parameter are:</p>
 * <ul>
 *   <li><b>application/json</b></li>
 *   <li><b>application/xml</b></li>
 *   <li><b>application/x-www-form-urlencoded</b></li>
 * </ul>
 * @param {Object} invocationData.parameters.params.body Specifies an object containing the following parameters.
 * @param {Object} invocationData.parameters.params.body.outBoundSMSRequest Specifies an object containing the following parameters.
 * @param {String} invocationData.parameters.params.body.outBoundSMSRequest.address Specifies the MSISDN of the recipients. Use an array of strings for multiple addresses.
 * @param {String} invocationData.parameters.params.body.outBoundSMSRequest.message Specifies the text of the message to send.
 * @param {Boolean} [invocationData.parameters.params.body.outBoundSMSRequest.notifyDeliveryStatus] Indicates whether the app expects a delivery status notification. The defined values for this parameter are:
 * <ul>
 *   <li><b>true</b>
 *      <br/>
 *      Specifies that the API Gateway sends a push notification for each recipient to the enpoint URI which was specified when the app was registered. If no endpoint was specified when the app was registered, the response contains a bad request.
 *   </li>
 *   <li><b>false</b>
 *      <br/>
 *      Specifies that the API Gateway does not send a push notification.
 *   </li>
 * </ul>
 *
 * @param {String} invocationData.parameters.params.accept Specifies the format of the object returned.
 * <p>The defined values for this parameter are:</p>
 * <ul>
 *   <li><b>application/json</b></li>
 *   <li><b>application/xml</b></li>
 * </ul>
 * <p>The default is <b>application/json</b>.</p>
 * @param {String} invocationData.parameters.params.accessToken Specifies the access token, which is the value of the <b>access_token</b> parameter returned in the {@link OAuthAdapter#getAccessToken} method response.
 * @param {Object} callbacks An object containing the success and failure callbacks.
 * @param {Function} callbacks.onSuccess Specifies the function that is called if the method returns succeeds.
 * @param {Function} callbacks.onFailure Specifies the function that is called if the method fails.
 *
 * @return {Object} An object containing the results of the call. This object has the following parameters.
 * <ul>
 *   <li>Id : String
 *   <br/>
 *   The unique identifier of the SMS message.</li>
 *   <li>ResourceReference : Object
 *   <br/>
 *   The container for the resource references for the SMS message.
 *   <ul>
 *     <li>ResourceURL : String
 *     <br/>
 *     The URL to the mobile number inbox.</li>
 *   </ul>
 *   </li>
 * </ul>
 *
 * <strong>Examples</strong>
 *
 * The following example sends the SMS message "Hello world" to the mobile number <b>1234567890</b>. For multiple phone numbers, separate the numbers by commas (,).
 *
 *     params = {
 *        'body' : {
 *           'outBoundSMSRequest' : {
 *              "message" : "Hello world",
 *              "address" : "tel:1234567890"
 *           }
 *        },
 *        'contentType' : 'application/json',
 *        'accessToken': '1a2b3c4d5e6f7g8h9i0j'
 *     };
 *     invocationData = {
 *        adapter : 'SMSAdapter',
 *        procedure : 'sendSMS',
 *        parameters : [params]           
 *     };
 *     options = {
 *        onSuccess : function(data) {
 *           var smsId = data.invocationResult.Id;
 *           cbData(data, smsId);
 *        },
 *        onFailure : function(error) {
 *           console.log(error);
 *           cbData(error);
 *        } 
 *     };
 *      
 *     WL.Client.invokeProcedure(invocationData, options);
 *
 * The following example shows a JSON object returned by this method. The user's outgoing mailbox folder is located at <code>https://api.att.com/rest/sms/2/messaging/outbox/SMSa01234zz98765432</code>.
 * 
 *     { 
 *        "Id":"SMSa01234ff98765432", 
 *        "ResourceReference": { 
 *           "ResourceURL":"https://api.att.com/sms/v3/messaging/outbox/SMSa01234ff98765432" 
 *        } 
 *     }
 */

/**
 * @method getSMSDeliveryStatus
 * Checks the status of a SMS messages sent by the app.
 * <p>Authorization Model: <b>client_credentials</b></p>
 *
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>SMSAdapter</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this paramter is <b>getSMSDeliveryStatus</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} [invocationData.parameters.params.accept] Specifies the format of the object returned.
 * <p>The defined values for this parameter are:</p>
 * <ul>
 *   <li><b>application/json</b></li>
 *   <li><b>application/xml</b></li>
 * </ul>
 * @param {String} invocationData.parameters.params.smsId Specifies the SMS request identifier (ID). This value is returned by a previous call to {@link SMSAdapter#sendSMS}.
 * @param {String} invocationData.parameters.params.accept Specifies the format of the object returned.
 * <p>The defined values for this parameter are:</p>
 * <ul>
 *   <li><b>application/json</b></li>
 *   <li><b>application/xml</b></li>
 * </ul>
 * <p>The default is <b>application/json</b>.</p>
 * @param {String} invocationData.parameters.params.accessToken Specifies the access token, which is the value of the <b>access_token</b> parameter returned in the {@link OAuthAdapter#getAccessToken} method response.
 * @param {Object} callbacks An object containing the success and failure callbacks.
 * @param {Function} callbacks.onSuccess Specifies the function that is called if the method returns succeeds.
 * @param {Function} callbacks.onFailure Specifies the function that is called if the method fails.
 *
 * @return {Object} An object containing the results of the call. This object has the following parameters.
 * <ul>
 *   <li>DeliveryInfoList : Object
 *     <br/>
 *     The list of sent messages.
 *     <ul>
 *       <li>DeliveryInfo : Object
 *         <br/>
 *         Information about a sent message.
 *         <ul>
 *           <li>Id : String
 *             <br/>
 *             The unique identifier for the message.</li>
 *           <li>Address : String
 *             <br/>
 *             The mobile number to which the message was sent.</li>
 *           <li>DeliveryStatus : String
 *             <br/>
 *             The status of the sent message. The following values are defined.
 *             <ul>
 *               <li>DeliveredToTerminal : String
 *                 <br/>
 *                 The message has been delivered to the mobile device.</li>
 *               <li>DeliveryImpossible : String
 *                 <br/>
 *                 The message cannot be delivered.</li>
 *               <li>DeliveredToNetwork : String
 *                 <br/>
 *                 The message has been delivered to the network, but not to the mobile device.</li>
 *             </ul>
 *           </li>
 *         </ul>
 *       </li>
 *     </ul>
 *   </li>
 * </ul>
 *
 * Delivery status is not available thirty minutes after the status becomes final (either <b>DeliveredToTerminal</b> or <b>DeliverImpossible</b>).
 *
 * <strong>Example:</strong>
 *
 * The following example gets the delivery status of SMS message for the mobile number <b>1234567890</b>.
 *
 *     params = {
 *        'Id' : 'tel:1234567890',
 *        'Authorization' : '1a2b3c4d5e6f7g8h9i0j'
 *     };
 *     invocationData = {
 *        adapter : 'SMSAdapter',
 *        procedure : 'getSMSDeliveryStatus',
 *        parameters : [params]
 *     };
 *     options = {
 *        onSuccess : function(data) {
 *        },
 *        onFailure : function(error) {
 *           console.log('error');
 *        } 
 *     };
 *          
 *     WL.Client.invokeProcedure(invocationData, options);
 * 
 * The following example shows a JSON object returned by this method. The user's outgoing mailbox folder is located at <code>https://api.att.com/rest/sms/2/messaging/outbox/SMSa01234zz98765432</code>.
 * 
 *     {
 *        "DeliveryInfoList": {
 *           "DeliveryInfo": [ {
 *              "Id":"msg0",
 *              "Address":"1234567890",
 *              "DeliveryStatus":"DeliveredToTerminal"
 *           } ],
 *           "ResourceUrl":"https://api.att.com/sms/v3/messaging/outbox/SMSa01234ff98765432"
 *        }
 *     } 
 */

/**
 * @method getSMS
 * Retrieves a list of the SMS messages that were sent to the application's short code.
 * <p>Authorization Model: <b>client_credentials</b></p>
 *
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>SMSAdapter</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this paramter is <b>getSMS</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} [invocationData.parameters.params.accept] Specifies the format of the object returned.
 * <p>The defined values for this parameter are:</p>
 * <ul>
 *   <li><b>application/json</b></li>
 *   <li><b>application/xml</b></li>
 * </ul>
 * @param {String} invocationData.parameters.params.registrationId Specifies the short code identifier (ID) of the application that is obtained when you register your application with AT&amp;T.
 * @param {String} invocationData.parameters.params.accessToken Specifies the access token, which is the value of the <b>access_token</b> parameter returned in the {@link OAuthAdapter#getAccessToken} method response.
 * @param {Object} callbacks An object containing the success and failure callbacks.
 * @param {Function} callbacks.onSuccess Specifies the function that is called if the method returns succeeds.
 * @param {Function} callbacks.onFailure Specifies the function that is called if the method fails.
 *
 * @return {Object} An object containing the results of the call. This object has the following parameters.
 * <ul>
 *   <li>InboundSmsMessageList : Object
 *     <br/>
 *     The list of messages. The list has the following parameters.
 *     <ul>
 *       <li>InboundSmsMessage : Object
 *         <br/>
 *         A specific message. Each message has the following parameters.
 *         <ul>
 *           <li>MessageId : String
 *           <br/>
 *           The unique identifier for this message.</li>
 *           <li>Message : String
 *           <br/>
 *           The text of the message.</li>
 *           <li>SenderAddress : String
 *             <br/>
 *             The MSISDNs of the recipients.</li>
 *         </ul>
 *       </li>
 *       <li>NumberOfMessagesInThisBatch : String
 *         <br/>
 *         The number of messages in the list.</li>
 *       <li>ResourceUrl : String
 *         <br/>
 *         The URL to the mobile number inbox.</li>
 *       <li>TotalNumberOfPendingMessages : String
 *         <br/>
 *         The number of pending (unsent) messages.</li>
 *     </ul>
 *   </li>
 * </ul>
 *
 * <strong>Example</strong>
 *
 * The following example gets the list of SMS messages sent to the short code <b>12345</b>
 *
 *     params = {
 *        'registrationId' : '123456',
 *        'accessToken': '1a2b3c4d5e6f7g8h9i0j'
 *     };
 *     invocationData = {
 *        adapter : 'SMSAdapter',
 *        procedure : 'getSMS',
 *        parameters : [params]           
 *     };
 *     options = {
 *        onSuccess : function(data) {
 *           console.log('success : ' + JSON.stringify(data));
 *           cbData(data);
 *        },
 *        onFailure : function(error) {
 *           console.log('error');
 *           cbData(error);
 *        }
 *     };
 *          
 *     WL.Client.invokeProcedure(invocationData, options);
 *
 * The following example shows a JSON object returned by this method. The inbox contains one message, "Hello", from mobile number <code>1234567890</code>.
 *
 *     { 
 *        "InboundSmsMessageList": { 
 *           "InboundSmsMessage": [{ 
 *              "MessageId":"msg0", 
 *              "Message":"Hello", 
 *              "SenderAddress":"tel:1234567890" 
 *           }], 
 *           "NumberOfMessagesInThisBatch":"1", 
 *           "ResourceUrl":"http://api.att.com:8080/rest/sms/2/messaging/inbox/SMSa01234zz98765432", 
 *           "TotalNumberOfPendingMessages":"0" 
 *        } 
 *     }
 */

/**
 * @class OAuthAdapter
 * The AT&amp;T OAuthAdapter provides access to the AT&amp;T OAuth service.
 * The OAuth service provides a safe and secure way for AT&amp;T subscribers to access AT&amp;T network resources through a third-party application without requiring the end-user to provide credentials (such as username and password) to the third party application and without the risk of compromising security. The OAuth service ensures that secure, sensitive, and private AT&amp;T subscription details are not exposed to the third-party application.
 * <p>OAuth authorization management is an open standard recognized as providing a strong protection to clients and applications. The OAuth service provides developers with a security model that allows them to obtain an authorization code and an access token. By acquiring an authorization code, a resource owner has authorized an application to access a protected resource on their behalf. The receipt of an access token enables an application to access a protected resource on behalf of a resource owner via the AT&amp;T network.</p>
 *
 * <b>The OAuthAdapter provides access to the following methods.</b>
 *
 * - {@link OAuthAdapter#getAccessToken}
 * - {@link OAuthAdapter#getAuthCode}
 * - {@link OAuthAdapter#revokeToken}
 *
 */

/**
 * @method getAccessToken
 * Retrieves an OAuth access token from the AT&amp;T authorization server.
 *
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>OAuthAdapter</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this parameter is <b>getAccessToken</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.parameters.params.contentType Specifies the format of the contents of the <b>params</b> parameter. The only defined value for this parameter is <b>application/x-www-form-urlencoded</b>.
 * @param {String} [invocationData.parameters.params.code] Specifies the authorization code. This value is returned in the response object of the {@link OAuthAdapter#getAuthCode} method. This parameter is required when using the {@link DeviceCapabilities} API and ignored by other APIs.
 * @param {String} [invocationData.parameters.params.refreshToken] Specifies the refresh token as returned in the response object to a previous call to this method.
 * @param {Object} callbacks An object containing the success and failure callbacks.
 * @param {Function} callbacks.onSuccess Specifies the function that is called if the method returns succeeds.
 * @param {Function} callbacks.onFailure Specifies the function that is called if the method fails.
 *
 * @return {Object} A JSON object containing the results of the call. This object has the following parameters.
 * <ul>
 *   <li>access_token
 *     <br/>
 *     Specifies a token that is used to request access to an API. If the value of the <i>grant_type</i> parameter in the request is <b>authorization_code</b>, use this value in an API call on the behalf of the user. If the value of the <i>grant_type</i> parameter in the request is <b>client_credentials</b>, use this value in an API method call on the behalf of the app.</li>
 *   <li>expires_in
 *     <br/>
 *     Specifies the number of seconds before the access token expires. A value of zero (0) indicates that the access token does not expire.</li>
 *   <li>refresh_token
 *     <br/>
 *     Specifies the token to use to obtain a new access token after the access token that was returned in this response expires.</li>
 * </ul>
 *
 * <b>Examples</b>
 *
 * The following example gets an OAuth access token.
 *
 *     params = {
 *        accept : 'application/json'
 *     }
 *     invocationData = {
 *        adapter : 'OAuthAdapter',
 *        procedure : 'getAccessToken',
 *        parameters : [params]
 *     };
 *     options = {
 *        onSuccess : function(data) {
 *        },
 *        onFailure : function(error) {} 
 *        };
 *  
 *     WL.Client.invokeProcedure(invocationData, options);
 *
 * The following example shows a JSON object returned by this method.
 *
 *     {
 *        "access_token":"a07af07a0f7ad0fa0ss7fu",
 *        "expires_in":"0",
 *        "refresh_token":"08as0d7807af070a7g078"
 *     }
 *     
 */

/**
 * @method getAuthCode
 * Retrieves an OAuth authorization code that is required to obtain an OAuth access token. This method is the initial operation in the OAuth call flow. It is invoked by an application that requires subscriber authorization in order to obtain an OAuth access token. The application's request for an OAuth access token is forwarded by redirecting the subscriber's browser to the AT&amp;T Gateway OAuth Server.
 * This method must be used to get the user's permissionto to use the {@link DeviceCapabilities} API.
 * 
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>OAuthAdapter</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this parameter is <b>getAuthCode</b>.
 * @param {Array}  invocationData.parameters Specifies an empty array.
 * @param {Object} invocationData.parameters.params Contains options for authorization
 * @param {Boolean} invocationData.parameters.params.bypassOnnetworkAuth  If this boolean is true, user consent will not the on-network consent flow.
 * @param {Boolean} invocationData.parameters.params.suppressLandingPage  If this boolean is true, when the user has an AT&T RememberMe cookie, they will not see an AT&T landing page that allows them to change consent. 
 * @param {Object} callbacks An object containing the success and failure callbacks.
 * @param {Function} callbacks.onSuccess Specifies the function that is called if the method returns succeeds.
 * @param {Function} callbacks.onFailure Specifies the function that is called if the method fails.
 *
 * @return {Object} Specifies a query parameter that is included with the redirect_url parameter of the authorize method in the original OAuth request.
 * <ul>
 *   <li>code
 *     <br/>
 *     Specifies the authorization code that represents the successfully processed consent. The {@link OAuthAdapter#getAccessToken} method uses this value to retrieve an OAuth access token.</li>
 * </ul>
 *
 * <b>Examples</b>
 *
 * The following example gets the end user authorization.
 *
 *     var params = {bypassOnnetworkAuth: true, suppressLandingPage: false};
 *
 *     invocationData= {
 *        adapter : 'OAuthAdapter' ,
 *        procedure : 'getAuthCode' ,
 *        parameters : [params]           
 *     };
 *     options = {
 *        onSuccess : function(data) {} ,
 *        onFailure : function(error) {} 
 *     };
 *  
 *     WL.Client.invokeProcedure(invocationData, options);
 *
 * The following example shows the response from this method:
 *     https://api.att.com/oauth/v4/authorize?custom_param=bypass_onnetwork_auth
 * 
 * User consent for your application starts at this URL.  Show the contents of this URL to your user so they may provide API consent.  Once the consent flow is complete (allowed or dis-allowed), your user will be
 * redirected to the below URL, where <strong>https://yourAppRedirectURL</strong> is your AT&T developer app redirect URL and <strong>ABCDEF0123456789</strong> is the authorization code.
 *
 *     https://yourAppRedirectURL?code=ABCDEF0123456789
 * or 
 *     https://yourAppRedirectURL?error=failure_reason
 */
 
 /**
 * @method revokeToken
 * Revokes an OAuth access token on the AT&amp;T authorization server.
 *
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>OAuthAdapter</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this parameter is <b>revokeToken</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.parameters.params.token Specifies the token token you wish to revoke
 * @param {String} invocationData.parameters.params.tokenType Specifies the type of token.  Valid values are "access_token" or "refresh_token".  If you specify "refresh_token", the access token will also be revoked.
 * @param {Object} callbacks An object containing the success and failure callbacks.
 * @param {Function} callbacks.onSuccess Specifies the function that is called if the method returns succeeds.
 * @param {Function} callbacks.onFailure Specifies the function that is called if the method fails.
 *
 * @return {Object} A JSON object containing the results of the call. This object has the following parameters.
 * <ul>
 *   <li>message Specifies a success or fail message </li>
 * </ul>
 *
 * <b>Examples</b>
 *
 * The following example gets an OAuth access token.
 *
 *     params = {
 *        token: 'abcdef',
 *		  tokenType: 'refresh_token'
 *     }
 *     invocationData = {
 *        adapter : 'OAuthAdapter',
 *        procedure : 'revokeToken',
 *        parameters : [params]
 *     };
 *     options = {
 *        onSuccess : function(data) {
 *        },
 *        onFailure : function(error) {} 
 *        };
 *  
 *     WL.Client.invokeProcedure(invocationData, options);
 *     
 */


/**
 * @class SpeechAdapter
 * The Speech API enables your app to transcribe speech (audio) to text using different contexts.
 * <p>Authorization Scope: <b>SPEECH</b></p>
 *
 * <b>The SpeechAdapter API provides the following methods.</b>
 *
 * {@link SpeechAdapter#speechToText}
 */

/**
 * @method speechToText
 * Retrieves a text translation of the specified audio file using the specified speech context.
 *
 * <b>Limitations</b>
 * <p>This method has the following limitations.</p>
 * <ul>
 *   <li>It accepts only an audio data file or streaming (chunked) audio data as input.</li>
 *   <li>
 *     If the Speech service cannot transcribe the audio data,
 *     the Speech API returns the HTTP status code <b>200 OK</b>,
 *     the Status <b>Speech Not Recognized</b>,
 *     and the response contains an empty <b>NBest</b> parameter
 *     when the <b>accept</b> value is <b>application/json</b> or <b>application/xml</b>
 *     or the response contains a <b>emma:no-input="true"</b> attribute
 *     when the <b>accept</b> value is <b>application/emma</b>.
 *   </li>
 *   <li>The Speech API does not retry failed requests.</li>
 * </ul>
 *
 * Authorization Scope: <b>client_credentials</b>
 *
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>SpeechAdapter</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this parameter is <b>speechToText</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} [invocationData.parameters.params.accept] Specifies the format of the object returned.
 * <p>The defined values for this parameter are:</p>
 * <ul>
 *   <li><b>application/json</b></li>
 *   <li><b>application/xml</b></li>
 *   <li><b>application/emma+xml</b></li>
 * </ul>
 * <p>The default is <b>application/json</b>.</p>
 * @param {String} invocationData.parameters.params.fileObject Specifies the base-64 encoded file data.
 * @param {String} invocationData.parameters.params.accessToken Specifies the access token, which is the value of the <b>access_token</b> parameter returned in the {@link OAuthAdapter#getAccessToken} method response.
 * @param {String} [invocationData.parameters.params.XSpeechContent] Specifies the speech context that is applied to the transcribed text to improve the accuracy of the results. The defined values for this parameter are:
 * <ul>
 *   <li>BusinessSearch
 *     <br/>
 *     The text applies to a search for a business.</li>
 *   <li>Generic
 *     <br/>
 *     The text applies to a context that is not otherwise shown. This is the default.</li>
 *   <li>QuestionAndAnswer
 *     <br/>
 *     The text applies to a question-and-answer session.</li>
 *   <li>SMS
 *     <br/>
 *     The text applies to an SMS or MMS text message.</li>
 *   <li>UVerseEPG
 *     <br/>
 *     The text applies to a U-verse session. This value is appropriate for all apps that provide a broad range of TV applications.</li>
 *   <li>Voicemail
 *     <br/>
 *     The text applies to a voicemail.</li>
 *   <li>Websearch
 *     <br/>
 *     The text applies to a web search.</li>
 * </ul>
 * 
 * @param {String} invocationData.parameters.params.contentType Specifies the type of base64-encoded contents in the file specified in <b>filePath</b>. The defined values for this parameter are:
 * <ul>
 *   <li>audio/amr</li>
 *   <li>audio/amr-wb</li>
 *   <li>audio/wav</li>
 *   <li>audio/x-wav</li>
 *   <li>audio/x-speex</li>
 * </ul>
 * 
 * @param {Number} invocationData.parameters.params.contentLength The length, in bytes, of the audio. This parameter is required for a non-streaming request on iOS.
 * @param {Object} callbacks An object containing the success and failure callbacks.
 * @param {Function} callbacks.onSuccess Specifies the function that is called if the method returns succeeds.
 * @param {Function} callbacks.onFailure Specifies the function that is called if the method fails.
 *
 * @return {Object} An object containing the results of the call. This object has the following parameters.
 *
 * The following parameters are returned in the response when the <b>accept</b> value is <b>application/emma+xml</b>.
 *
 * <ul>
 *   <li>emma:emma : Object
 *     <br/>
 *     Container for the <a href"http://www.w3.org/TR/emma/">EMMA</a> (Extensible Multimodal Annotation markup language) parameters.
 *     <ul>
 *       <li>version : Number
 *         <br/>
 *         Specifies the version of EMMA.</li>
 *       <li>emma:one-of 
 *         <br/>
 *         Container for the speech interpretations.
 *         <ul>
 *           <li>disjunction-type : String
 *             <br/>
 *             Specifies the disjunction type. The only defined value for this parameter is <b>recognition</b>.</li>
 *           <li>emma:medium : String
 *             <br/>
 *             Specifies the acousting medium. The only defined value for this parameter is <b>acoustic</b>.</li>
 *           <li>emma:mode : String
 *             <br/>
 *             Specifies the input mode. The only defined value for this parameter is <b>voice</b>.</li>
 *           <li>emma:process : String
 *             <br/>
 *             Specifies the resource used to process the speech to text.
 *             <ul>
 *               <li>id : String
 *                 <br/>
 *                 Specifies the unique ID of the process that converted the speech to text.</li>
 *             </ul>
 *           </li>
 *           <li>emma:interpretation : Object
 *             <br/>
 *             Container for the interpretation results.
 *             <ul>
 *               <li>id : Number
 *                 <br/>
 *                 Specifies the ID of the interpretation.</li>
 *               <li>emma:tokens : String
 *                 <br/>
 *                 Specifies the initial interpretation of the speech. This value is the same as value for <b>Hypothesis</b>.</li>
 *               <li>emma:confidence : String
 *                 <br/>
 *                 Specifies the overall confidence in the transcription, from <b>0.0</b> (not confident) to <b>1.0</b> (very confident).</li>
 *               <li>emma:lang : String
 *                 <br/>
 *                 Specifies the language of the text in the response.</li>
 *               <li>Grade : String
 *                 <br/>
 *                 Specifies the relative grade of the resulting text in the <b>ResultText</b> parameter. The defined values for this parameter are:
 *                 <ul>
 *                   <li>accept
 *                     <br/>
 *                     The text in the <b>ResultText</b> parameter has acceptable confidence and should be accepted.</li>
 *                   <li>confirm
 *                     <br/>
 *                     The text in the <b>ResultText</b> parameter has lower confidence and should be independently confirmed.</li>
 *                   <li>reject
 *                     <br/>
 *                     The text in the <b>ResultText</b> parameter has low confidence and should be rejected.</li>
 *                 </ul>
 *               </li>
 *               <li>ResultText : String
 *                 <br/>
 *                 Specifies the resulting text based on the context.</li>
 *               <li>ResultTextWords : Object
 *                 <br/>
 *                 Container for the words of the <b>ResultText</b> parameter value. This value may omit some of the words of the <b>ResultText</b> parameter value and may be empty, but it never contains words that are not in the <b>ResultText</b> parameter value.
 *                 <ul>
 *                   <li>ResultTextWord : String
 *                     <br/>
 *                     Container for each word in the <b>ResultText</b> parameter, with a confidence level.</li>
 *                   <li>emma:confidence : Number
 *                     <br/>
 *                     Specifies the confidence in the word, from <b>0.0</b> (not confident) to <b>1.0</b> (very confident).</li>
 *                 </ul>
 *               </li>
 *             </ul>
 *           </li>
 *         </ul>
 *       </li>
 *     </ul>
 *   </li>
 * </ul>
 *
 * The following parameters are returned in the response when the <b>accept</b> value is <b>application/json</b> or <b>application/xml</b>. Note that some of the following parameters are only present when the <b>xSpeechContext</b> value is <b>TV</b>.
 *
 * <ul>
 *   <li>Recognition : Object
 *     <br/>
 *     Container for the following parameters.
 *     <ul>
 *       <li>Status : String
 *         <br/>
 *         Specifies the status of the request. The defined values for this parameter are:
 *         <ul>
 *           <li>Ok</li>
 *           <li>Speech Not Recognized</li>
 *         </ul>
 *       </li>
 *       <li>ResponseId : String
 *         <br/>
 *         Specifies the unique identifier for the response.</li>
 *       <li class="optional">Info : Object
 *         <br/>
 *         Container for television information. The following parameters are only present when the <b>xSpeechContext</b> value is <b>TV</b>.
 *         <ul>
 *           <li>actionType : String
 *             <br/>
 *             Specifies the high-level action to associate with the results. The defined values for this parameter are:
 *             <ul>
 *               <li>COMMAND
 *                 <br/>
 *                 Specifies that the input audio was interpreted as a U-verse command.</li>
 *               <li>EPG
 *                 <br/>
 *                 Specifies that the request was interpreted as a request to an Electronic Programming Guide (EPG) service. The response from that service response is in the <b>search</b> parameter.</li>
 *             </ul>
 *           </li>
 *           <li>interpretation : Object
 *             <br/>
 *             Container for interpreted results.
 *             <ul>
 *               <li>genre.id : String
 *                 <br/>
 *                 Specifies an identifier for a genre matching all or part of the speech.</li>
 *               <li>genre.words : String
 *                 <br/>
 *                 Specifies the keywords associated with the <b>genre.id</b> value.</li>
 *               <li>station.name : String
 *                 <br/>
 *                 The name of the station. This value should match or partially match the call sign of the station, which is the value of the <b>callSign</b> parameter.</li>
 *             </ul>
 *           </li>
 *           <li>metrics : Object
 *             <br/>
 *             Container for information about the audio metrics.
 *             <ul>
 *               <li>audioBytes : Number
 *                 <br/>
 *                 Specifies the number of bytes in the audio.</li>
 *               <li>audioTime : Number
 *                 <br/>
 *                 Specifies the duration, in seconds, of the audio.</li>
 *             </ul>
 *           </li>
 *           <li>recognized : String
 *             <br/>
 *             Specifies the text used as the search term.</li>
 *           <li>search : Object
 *             <br/>
 *             Container for the search results.
 *             <ul>
 *               <li>meta : Object
 *                 <br/>
 *                 Container for meta-data about the search results.
 *                 <ul>
 *                   <li>description
 *                     <br/>
 *                     Specifies the description of the meta-data for the search results.</li>
 *                   <li>guideDateEnd : String
 *                     <br/>
 *                     Specifies the start date of the guide data included in the search results. This parameter is always empty.</li>
 *                   <li>guideDateStart : String
 *                     <br/>
 *                     Specifies the end date of the guide data included in the search results. This parameter is always empty.</li>
 *                   <li>lineup : Number
 *                     <br/>
 *                     Specifies the television market searched.</li>
 *                   <li>market : String
 *                     <br/>
 *                     Specifies the name of the television market searched.</li>
 *                   <li>resultCount : Number
 *                     <br/>
 *                     Specifies the number of entries in the <b>programs</b> parameter.</li>
 *                 </ul>
 *               </li>
 *               <li>programs : Object
 *                 <br/>
 *                 Container for the programs that match the search term.
 *                 <ul>
 *                   <li>cast : String
 *                     <br/>
 *                     Specifies the names of the cast. This parameter is always empty.</li>
 *                   <li>category : String
 *                     <br/>
 *                     Specifies keywords describing the program.</li>
 *                   <li>description : String
 *                     <br/>
 *                     Specifies the description of the program.</li>
 *                   <li>director : String
 *                     <br/>
 *                     Specifies the director of the program. This parameter is always empty.</li>
 *                   <li>language : String
 *                     <br/>
 *                     Specifies the language used in the program. The defined values are:
 *                     <ul>
 *                       <li>en-US
 *                         <br/>
 *                         US English</li>
 *                       <li>es-US
 *                         <br/>
 *                         US Spanish</li>
 *                     </ul>
 *                   </li>
 *                   <li>mpaaRating : String
 *                     <br/>
 *                     Specifies the Motion Picture Association of America (MPAA) rating of the program.</li>
 *                   <li>originalAirDate : String
 *                     <br/>
 *                     Specifies the date when the program originally aired. This parameter is empty for movies.</li>
 *                   <li>pid : Number
 *                     <br/>
 *                     Specifies the program ID.</li>
 *                   <li>runTime : Number
 *                     <br/>
 *                     Specifies the duration, in minutes, of the program.</li>
 *                   <li>showType : String
 *                     <br/>
 *                     Specifies the type of program. The defined values are:
 *                     <ul>
 *                       <li>Movie</li>
 *                       <li>News</li>
 *                       <li>Special</li>
 *                       <li>TV Show</li>
 *                     </ul>
 *                   </li>
 *                   <li>starRating : String
 *                     <br/>
 *                     Specifies the program rating, from <b>1</b> to <b>5</b>, with a possible <b>+</b> to indicate one-half star. If no rating is available, this parameter is empty.</li>
 *                   <li>subtitle : String
 *                     <br/>
 *                     Specifies the sub-title of the program. This value is the episode title for television shows and empty for movies.</li>
 *                   <li>title : String
 *                     <br/>
 *                     Specifies the title of the program.</li>
 *                   <li>year : Number
 *                     <br/>
 *                     Specifies the year in which the program was made. This value can be used to distinguish an original from a remake.</li>
 *                 </ul>
 *               </li>
 *               <li>showtimes : Object
 *                 <br/>
 *                 Container for the times when the program is available.
 *                 <ul>
 *                   <li>affiliate : String
 *                     <br/>
 *                     Specifies the affiliation of the <b>channel</b>.
 *                     <ul>
 *                       <li>ABC</li>
 *                       <li>CBS</li>
 *                       <li>FOX</li>
 *                       <li>MY NETWORK TV</li>
 *                       <li>PBS</li>
 *                       <li>NBC</li>
 *                       <li>n/a
 *                          <br/>
 *                          There is no affiliation.</li>
 *                     </ul>
 *                   </li>
 *                   <li>callSign : String
 *                     <br/>
 *                     Specifies the station call sign. High-definition station call signs include an <b>HD</b> suffix.</li>
 *                   <li>channel : Number
 *                     <br/>
 *                     Specifies the station channel.</li>
 *                   <li>closeCaptioned : String
 *                     <br/>
 *                     Specifies whether the program is close captioned. If this value is <b>CC</b>, the program is close captioned.</li>
 *                   <li>dolby : Number
 *                     <br/>
 *                     Specifies whether the program offers Dolby&reg; stereo channel sound, where <b>1</b> means Dolby stereo is offered and <b>0</b> means it is not.</li>
 *                   <li>duration : Number
 *                     <br/>
 *                     Specifies the duration, in minutes, of the program.</li>
 *                   <li>endTime : Number
 *                     <br/>
 *                     Specifies the end time, in <i>YYMMDDhhmm</i> format, where <i>YY</i> is the last two digits of the year, <i>MM</i> is the month, where January is <b>1</b>, <i>DD</i> is the day, <i>hh</i> is the hour, and <i>mm</i> is the minute.</li>
 *                   <li>finale : Number
 *                     <br/>
 *                     Specifies whether the program is the season finale, where <b>1</b> means that the program is the finale and <b>0</b> means it is not.</li>
 *                   <li>hdtv : Number
 *                     <br/>
 *                     Specifies whether the program is in high definition, where <b>1</b> means that the program is in high definition and <b>0</b> means it is not.</li>
 *                  <li>newShow : Number
 *                     <br/>
 *                     Specifies whether the program is a new episode, where <b>1</b> means that the program is a new episode and <b>0</b> means it is not.</li>
 *                   <li>pid : Number
 *                     <br/>
 *                     Specifies the program ID.</li>
 *                   <li>premier : Number
 *                     <br/>
 *                     Specifies whether the program is a premier, where <b>1</b> means that the program is a premier and <b>0</b> means it is not.</li>
 *                   <li>repeat : Number
 *                     <br/>
 *                     Specifies whether the program is a repeat, where <b>1</b> means that the program is a repeat and <b>0</b> means it is not.</li>
 *                   <li>showTime : Number
 *                     <br/>
 *                     Specifies the time when the program runs, in <i>YYMMDDhhmm</i> format, where <i>YY</i> is the last two digits of the year, <i>MM</i> is the month, where January is <b>1</b>, <i>DD</i> is the day, <i>hh</i> is the hour, and <i>mm</i> is the minute.</li>
 *                   <li>station : Number
 *                     <br/>
 *                     Specifies the station on which the program runs.</li>
 *                   <li>stereo : Number
 *                     <br/>
 *                     Specifies whether the program is in stereo, where <b>1</b> means that the program is in stereo and <b>0</b> means it is not.</li>
 *                   <li>subtitled : Number
 *                     <br/>
 *                     Specifies whether the program has subtitles, where <b>1</b> means that the program has subtitles and <b>0</b> means it does not.</li>
 *                   <li>weekday : Number
 *                     <br/>
 *                     Specifies the day of the week when the program runs, from <b>0</b> (Monday) through <b>6</b> is (Sunday).</li>
 *                 </ul>
 *               </li>
 *             </ul>
 *           </li>
 *           <li>version : String
 *             <br/>
 *             Specifies the version of the processor providing the response.</li>
 *         </ul>
 *       </li>
 *       <li>NBest : Array of objects
 *         <br/>
 *         Container for the results of the transcription. There can be multiple transcriptions.
 *         <ul>
 *           <li>Confidence : Number
 *             <br/>
 *             Specifies the relative confidence, from <b>0.0</b> (low confidence) to <b>1.0</b> (high confidence), of the resulting text in the <b>Hypothesis</b> parameter.</li>
 *           <li>Grade : String
 *             <br/>
 *             Specifies the relative grade of the resulting text in the <b>ResultText</b> parameter. The defined values for this parameter are:
 *             <ul>
 *               <li>accept
 *                 <br/>
 *                 The text in the <b>ResultText</b> parameter has acceptable confidence and should be accepted.</li>
 *               <li>confirm
 *                 <br/>
 *                 The text in the <b>ResultText</b> parameter has lower confidence and should be independently confirmed.</li>
 *               <li>reject
 *                 <br/>
 *                 The text in the <b>ResultText</b> parameter has low confidence and should be rejected.</li>
 *             </ul>
 *           </li>
 *           <li>Hypothesis : String
 *             <br/>
 *             Specifies the text resulting from the speech translation.</li>
 *           <li>LanguageId : String
 *             <br/>
 *             Specifies the language in which the <b>Hypothesis</b> parameter is encoded. This five-letter value consists of the two-letter ISO639 language code, followed by a hypen (<b>-</b>), and finally followed by the two-letter country code, such as <b>en-us</b>, which specifies US English.</li>
 *           <li class="optional">NluHypothesis
 *             <br/>
 *             Container for the initial interpretation of the speech. These parameters only apply when the <b>xSpeechContext</b> parameter is <b>TV</b>.
 *             <ul>
 *               <li>genre.id : String
 *                 <br/>
 *                 Specifies an identifier for a genre matching all or part of the speech.</li>
 *               <li>genre.words : String
 *                 <br/>
 *                 Specifies the keywords associated with the <b>genre.id</b> value.</li>
 *               <li>station.name : String
 *                 <br/>
 *                 The name of the station. This value should match or partially match the call sign of the station, which is the value of the <b>callSign</b> parameter.</li>
 *             </ul>
 *           </li>
 *           <li>ResultText : String
 *             <br/>
 *             Specifies the resulting text based on the context. This value is typically a variation of the <b>Hypothesis</b> parameter value to make the result more readable or usable for the client.
 *             <ul>
 *               <li>Words : Object
 *                 <br/>
 *                 Container for the words of the <b>ResultText</b> parameter value. This value may omit some of the words of the <b>ResultText</b> parameter value and may be empty, but it never contains words that are not in the <b>ResultText</b> parameter value.</li>
 *               <li>Word : Object
 *                 <br/>
 *                 Container for each word in the <b>ResultText</b> parameter, with a score.</li>
 *               <li>Score
 *                 <br/>
 *                 Specifies the confidence in the word, from <b>0.0</b> (not confident) to <b>1.0</b> (very confident).</li>
 *             </ul>
 *           </li>
 *         </ul>
 *       </li>
 *     </ul>
 *   </li>
 * </ul>
 *
 * <b>Examples</b>
 *
 * The following example translates the contents as a web search.
 *
 *     var params = {
 *        "fileObject" : "pad7f-9asffhnawe097y...",
 *        "accessToken" : '1a2b3c4d5e6f7g8h9i0j',
 *        "contentType" : 'audio/wav',
 *        "XSpeechContent" : 'WebSearch'
 *     };
 *     var invocationData = {
 *        adapter : 'SpeechAdapter',
 *        procedure : 'speechToText',
 *        parameters : [params]
 *     };
 *     options = {
 *        onSuccess : function(data) {},
 *        onFailure : function(error) {} 
 *     };
 *
 *     WL.Client.invokeProcedure(invocationData,options);
 *
 * The following example shows the results of a speech translation of a web search with the text "bookstores in Glendale, CA". The results have a high confidence.
 *
 *     {
 *        "Recognition": {
 *           "ResponseId": "1234567890",
 *           "NBest": [{
 *              "Hypothesis": "bookstores in glendale california",
 *              "LanguageId": "en-us",
 *              "Confidence": 0.9,
 *              "Grade": "accept",
 *              "ResultText": "bookstores in Glendale, CA",
 *              "Words": ["bookstores", "in", "glendale","california"],
 *              "WordScores": [0.92, 0.73, 0.81, 0.96]
 *           }]
 *        }
 *     }
 */

/**
 * @class DeviceCapabilities
 * The Device Capabilities API enables your app to identify the capabilities of a device on the AT&amp;T network.
 * <p>Authorization Scope: <b>DC</b></p>
 * <p><b>Other Considerations</b></p>
 * <ul>
 *   <li>The MSISDN in the API request must be an AT&amp;T post-paid mobile subscriber number.</li>
 *   <li>This API only works for AT&amp;T-supported devices. If the user has a device from another carrier and uses an AT&amp;T SIM, the results are not accurate.</li>
 *   <li>The user's device running your app must be connected to the AT&amp;T mobile data connection.</li>
 *   <li>The AT&amp;T service prompts the user for permission to release their device information to your app. The user must allow permission before the app can call <b>getDeviceCapabilities</b> on the device. After the user grants permission, access is valid forever.</li>
 *   <li>The resulting attributes contain AT&amp;T-specific, comma-delimited strings of <i>name</i>:<i>value</i> pairs.</li>
 * </ul>
 * 
 * <b>The Device Capabilities API provides the following methods.</b>
 *
 * - {@link DeviceCapabilities#getDeviceCapabilities}
 *
 */

/**
 * @method getDeviceCapabilities
 * Retrieves information, such as the model and whether it accepts a WAP push, about the device. The device must be using an AT&amp;T mobile data connection.
 * <p>Authorization Model: <b>authorization_code</b></p>
 *
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>DeviceCapabilities</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this parameter is <b>getDeviceCapabilities</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} [invocationData.parameters.params.accept] Specifies the format of the object returned.
 * <p>The defined values for this parameter are:</p>
 * <ul>
 *   <li><b>application/json</b></li>
 *   <li><b>application/xml</b></li>
 * </ul>
 * <p>The default is <b>application/json</b>.</p>
 * @param {String} invocationData.parameters.params.oAuthToken Specifies the access token, which is the value of the <b>access_token</b> parameter returned in the {@link OAuthAdapter#getAccessToken} method response.
 * @param {Object} options An object containing the success and failure callbacks.
 * @param {Function} options.onSuccess Specifies the function that is called if the method returns succeeds.
 * @param {Function} options.onFailure Specifies the function that is called if the method fails.
 *
 * @return {Object} An object containing the results of the call. This object has the following parameters.
 * <ul>
 *   <li>DeviceInfo
 *     <br/>
 *     Specifies a JSON object containing the following parameters.
 *     <ul>
 *       <li>DeviceId
 *         <br/>
 *         Specifies a JSON object containing the following parameters.
 *         <ul>
 *           <li>TypeAllocationCode
 *             <br/>
 *             Specifies the first eight digits of the International Mobile Equipment Identity of the mobile device.</li>
 *         </ul>
 *       </li>
 *     </ul>
 *   </li>
 *   <li>Capabilities
 *     <br/>
 *     Specifies a JSON object containing the following parameters.
 *     <ul>
 *       <li>AssistedGps
 *         <br/>
 *         Specifies whether the device supports assisted-GPS. The defined values for this parameter are:
 * <ul>
 *   <li>Y
 *     <br/>
 *     The device supports assisted GPS.</li>
 *     <br/>
 *     The device does not support assisted GPS.</li>
 * </ul></li>
 *       <li>DeviceBrowser
 *         <br/>
 *         Specifies the name of the browser, such as <b>RIM</b> for Blackberry device, that is resident on the device.</li>
 *       <li>FirmwareVersion
 *         <br/>
 *         Specifies the firmware release number used by AT&amp;T for the mobile device. This value may correspond to the firmware release number provided by the device manaufacturer.</li>
 *       <li>LocationTechnology
 *         <br/>
 *         Specifies the location technology network that the device supports.</li>
 *       <li>MmsCapable
 *         <br/>
 *         Specifies whether the device supports MMS. The defined values for this parameter are:
 * <ul>
 *   <li>Y
 *     <br/>
 *     The device supports MMS.</li>
 *   <li>N
 *     <br/>
 *     The device does not support MMS.</li>
 * </ul></li>
 *       <li>Model
 *         <br/>
 *         Specifies the model number used by AT&amp;T for the mobile device. This value may correspond to the model number in the User Agent Profile.</li>
 *       <li>Name
 *         <br/>
 *         Specifies the abbreviated code used by AT&amp;T for the mobile device manufacturer and model number, separated by a space. This value may correspond to the name and model number in the User Agent Profile.</li>
 *       <li>UaProf
 *         <br/>
 *         Specifies the URL of the device manufacturer web site containing the User Agent Profile of the device.</li>
 *       <li>Vendor
 *         <br/>
 *         Specifies the abbreviated code used by AT&amp;T for the manufacturer of the mobile device. This value may correspond to the name of the device manufacturer in the User Agent Profile.</li>
 *       <li>WapPushCapable
 *         <br/>
 *         Specifies whether the device supports WAP Push.  The defined values for this parameter are:
 *       </li>
 * <ul>
 *   <li>Y
 *     <br/>
 *     The device supports WAP Push.</li>
 *   <li>N
 *     <br/>
 *     The device does not support WAP Push.</li>
 * </ul>
 *
 * <b>Examples</b>
 *
 * The following example retrieves the device capabilities for the user with the token value <b>1a2b3c4d5e6f7g8h9i0j</b>.
 *
 *     params = {
 *        'oAuthToken' : '1a2b3c4d5e6f7g8h9i0j'
 *     };
 *     invocationData = {
 *        adapter : 'DeviceCapabilities',
 *        procedure : 'getDeviceCapabilities',
 *        parameters : [params]           
 *     };
 *     options = {
 *        onSuccess : successCallback,
 *        onFailure : failureCallback
 *        invocationContext : {}
 *     };
 *  
 *     WL.Client.invokeProcedure(invocationData, options);
 *
 * The following example shows a JSON object returned by this method.
 *
 *     { 
 *        "DeviceInfo": "DeviceId":{ 
 *           "TypeAllocationCode" : " 01196499" 
 *        }, 
 *        "Capablities": { 
 *           "Name" : "LGE CU920", 
 *           "Vendor":  "LGE", 
 *           "Model":  "CU920", 
 *           "FirmwareVersion":  "CU920-MSM4090201D-V10h-FEB-05", 
 *           "UaProf":     "http://gsm.lge.com/html/gsm/LG-CU920.xml", 
 *           "MmsCapable":  "Y", 
 *           "AssistedGps":  "Y", 
 *           "LocationTechnology":  "SUPL2", 
 *           "DeviceBrowser" : "safari", 
 *           "WapPushCapable" : "Y" 
 *        } 
 *     }
 */
 
/**
 * @class Advertising
 * The Advertising API enables your app to support advertisements within the app. This allows the developer of the application to collect a revenue share of the advertisement. When users click the advertisement in the app, they are redirected to detailed information regarding the advertisement, such as a web page.
 * 
 * <b>The Advertising API provides the following methods:</b>
 *
 *  {@link Advertising#getAds}
 *
 */

/**
 * @method getAds
 * Retrieves the ads appropriate for the specified audience.
 * <p>Authorization Model: <b>client_credentials</b></p>
 *
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>Advertising</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this parameter is <b>getAds</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.parameters.params.accessToken Specifies the access token, which is the value of the <b>access_token</b> parameter returned in the {@link OAuthAdapter#getAccessToken} method response.
 * @param {String} [invocationData.parameters.params.accept] Specifies the format of the object returned.
 * <p>The defined values for this parameter are:</p>
 * <ul>
 *   <li><b>application/json</b></li>
 *   <li><b>application/xml</b></li>
 * </ul>
 * <p>The default is <b>application/json</b>.</p>
 * @param {Object} invocationData.parameters.params.queryParameters Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.parameters.params.queryParameters.Category Specifies the category of the app.
 * The defined values for this parameter are:
 * <ul>
 *   <li>auto</li>
 *   <li>business</li>
 *   <li>chat</li>
 *   <li>communication</li>
 *   <li>community</li>
 *   <li>entertainment</li>
 *   <li>finance</li>
 *   <li>games</li>
 *   <li>health</li>
 *   <li>local</li>
 *   <li>maps</li>
 *   <li>medical</li>
 *   <li>movies</li>
 *   <li>music</li>
 *   <li>news</li>
 *   <li>personals</li>
 *   <li>photos</li>
 *   <li>shopping</li>
 *   <li>social</li>
 *   <li>sports</li>
 *   <li>technology</li>
 *   <li>tools</li>
 *   <li>travel</li>
 *   <li>tv</li>
 *   <li>video</li>
 *   <li>weather</li>
 *   <li>other</li>
 * </ul>
 *
 * @param {String} [invocationData.parameters.params.queryParameters.Gender] Specifies the gender of the audience demographic for the app.
 * The defined values for this parameter are:
 * <ul>
 *   <li>M</li>
 *   <li>F</li>
 * </ul>
 *
 * @param {Number} [invocationData.parameters.params.queryParameters.ZipCode] Specifies the USA zip code of the app user.
 * @param {Number} [invocationData.parameters.params.queryParameters.AreaCode] Specifies the USA area code of the app user
 * @param {String} [invocationData.parameters.params.queryParameters.City] Specifies the the USA city and state of the user.
 * @param {String} [invocationData.parameters.params.queryParameters.Country] Specifies the three-letter, ISO-3166 country code of the user.
 * @param {String} [invocationData.parameters.params.queryParameters.Longitude] Specifies the current longitude, in degrees, of the geographical position for the mobile device.
 * @param {String} [invocationData.parameters.params.queryParameters.Latitude] Specifies the current latitude, in degrees, of the geographical position for the mobile device.
 * @param {Number} [invocationData.parameters.params.queryParameters.MaxHeight] Specifies the maximum height, in pixels, of the advertisement banner. The height of the content can be less than or equal to, but not greater than, this value.
 * @param {Number} [invocationData.parameters.params.queryParameters.MinHeight] Specifies the minimum height, in pixels, of the advertisement banner. The height of the content may be greater than or equal to, but not less than, this value.
 * @param {Number} [invocationData.parameters.params.queryParameters.MaxWidth] Specifies the maximum width, in pixels, of the advertisement banner. The width of the content may be less than or equal to, but not greater than, this value.
 * @param {Number} [invocationData.parameters.params.queryParameters.MinWidth] Specifies the minimum width, in pixels, of the advertisement banner. The width of the content may be greater than or equal to, but not less than this value.
 * @param {Number} [invocationData.parameters.params.queryParameters.Timeout] Specifies the timeout, in milliseconds, of this method. This is the maximum time the user is willing to wait for a response. The maximum value is 3000ms (three seconds) and the default value is 1000ms (one second).
 * @param {String} [invocationData.parameters.params.queryParameters.AgeGroup] The age group of the demographic audience of the app.
 * The defined values for this parameter are:
 * <ul>
 *   <li>1-13</li>
 *   <li>14-25</li>
 *   <li>26-35</li>
 *   <li>36-55</li>
 *   <li>55-100</li>
 * </ul>
 *
 * @param {Number} [invocationData.parameters.params.queryParameters.Over18] Specifies whether to display adult ads.
 * The defined values for this parameter are:
 * <ol start="0">
 *   <li>Do not display adult ads.</li>
 *   <li>Do not display adult ads.</li>
 *   <li>Show only adult ads.</li>
 *   <li>Show all ads.</li>
 * </ol>
 *
 * @param {String} [invocationData.parameters.params.queryParameters.Keywords] Specifies the keywords that are used to filter the ads. The values are not case-sensitive and multiple values must be separated by commas. For example, to filter for ads about music, tv, or games, use "music,tv,games".
 * @param {Number} [invocationData.parameters.params.queryParameters.Premium] Specifies whether to show premium ads.
 * The defined values for this parameter are:
 * <ol start="0">
 *   <li>Do not show premium ads.</li>
 *   <li>Show only premium ads.</li>
 *   <li>Show all ads.</li>
 * </ol>
 *
 * @param {Object} options A JSON object containing the success and failure callbacks.
 * @param {Function} options.onSuccess Specifies the function that is called if the method returns succeeds.
 * @param {Function} options.onFailure Specifies the function that is called if the method fails.
 *
 * @return {Object} An object containing the results of the call. This object has the following parameters.
 * <ul>
 *   <li>AdsResponse
 *     <br/>
 *     Specifies an object containing the following parameters.
 *     <ul>
 *       <li>Ads
 *         <br/>
 *         Specifies an object containing the following parameters.
 *         <ul>
 *           <li>ClickUrl
 *             <br/>
 *             Specifies the web site to which the user is sent if they click the ad on their device. For SMS advertisements, the URL is shortened to between 35 and 40 characters.</li>
 *           <li>Content
 *             <br/>
 *             Contains the content of the ad from the third party.</li>
 *           <li>Text
 *             <br/>
 *             Contains any textual representation of the ad.</li>
 *           <li>TrackUrl
 *             <br/>
 *             Contains the pixel tracking URL.</li>
 *           <li>Type
 *             <br/>
 *             Specifies the type of ad.</li>
 *           </li>
 *         </ul>
 *       </li>
 *     </ul>
 *   </li>
 * </ul>
 *
 * <b>Examples</b>
 *
 * The following example retrieves ads related to music.
 *
 *     params = {
 *        'accessToken' : '1a2b3c4d5e6f7g8h9i0j',
 *        'queryParameters' : {
 *           'Category': 'music'
 *        }
 *     };
 *     invocationData= {
 *        adapter : 'Advertising' ,
 *        procedure : 'getAds' ,
 *        parameters : [params]           
 *     };
 *     options = {
 *        onSuccess : successCallback ,
 *        onFailure : failureCallback
 *        invocationContext : {}
 *     };
 *  
 *     WL.Client.invokeProcedure(invocationData, options);
 *
 * The following example shows a JSON object returned by this method.
 *
 *     {
 *        "AdsResponse": {
 *           "Ads": {
 *              "Type": "thirdparty",
 *              "ClickUrl" : "http://ads.advertising.bf.sl.attcompute.com/1/redir/21707",
 *              "TrackUrl": "http://bos-tapreq25.jumptap.com/a30/r/bos-tapreq25/13499/L",
 *              "Text": "",
 *              "Content": "<a href="http://ads.advertising.bf.sl.attcompute.com/1/redir/6dea9/0/221707">
 *                             <img src="http://i.jumptap.com/img/13450.jpg" alt="" width="320px" height="50px" /></a>
 *                          <img src="http://bos-tapreq25.jumptap.com/11468/L" alt="" width="1px" height="1px" />"
 *        }
 *     }
 *
 */
 
 /**
 * @class TextToSpeech
 * The TextToSpeech API enables your app to convert text to different speech audio formats.
 * <p>Authorization Scope: <b>TTS</b></p>
 *
 * <b>The TextToSpeech API provides the following methods.</b>
 * <ul>
 *   <li>{@link TextToSpeech#textToSpeech}</li>
 * </ul>
 */

/**
 * @method textToSpeech
 * Gets an audio transcription of the specified text.
 * <p>Authorization Model: <b>client_credentials</b></p>
 *
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>TextToSpeech</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this parameter is <b> textToSpeech</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.parameters.params.body The text to convert into speech.
 * @param {String} invocationData.parameters.params.accessToken Specifies the access token, which is the value of the <b>access_token</b> parameter returned in the {@link OAuthAdapter#getAccessToken} method response.
 * @param {String} invocationData.parameters.params.contentType Specifies the format of the text to convert. The following values are defined for this parameter.
 * <ul>
 *   <li>text/plain
 *     <br/>
 *     The content is in plain text.</li>
 *   <li>application/ssml+xml
 *     <br/>
 *     The content is in the Speech Synthesis Markup Language format.</li>
 * </ul>
 *
 * @param {String} [invocationData.parameters.params.accept] Specifies the format of the base64-encoded body of the response. The following values are defined for this parameter.
 * <ul>
 *   <li>audio/amr
 *     <br/>
 *     Base64-encoded Adaptive Multi-Rate.</li>
 *   <li>audio/amr-wb
 *     <br/>
 *     Base64-encoded Adaptive Multi-Rate Wideband. This is the default value.</li>
 *   <li>audio/x-wav
 *     <br/>
 *     Base64-encoded Waveform.</li>
 * </ul>
 * 
 * @param {String} invocationData.parameters.params.contentLanguage The language of the text in the <b>body</b> parameter value. The following values are defined for this parameter.
 * <ul>
 *   <li>en-US
 *     <br/>
 *     US English. This is the default value.</li>
 *   <li>es-US
 *     <br/>
 *     US Spanish.</li>
 * </ul>
 *
 * @param {Number} invocationData.parameters.params.contentLength Specifies the length, in bytes, of the text in the <b>body</b> value.
 * @param {String} invocationData.parameters.params.xArg Specifies the multipart paramaters for the X-Arg header.
 * @param {Object} options An object containing the success and failure callbacks.
 * @param {Function} options.onSuccess Specifies the function that is called if the method returns succeeds.
 * @param {Function} options.onFailure Specifies the function that is called if the method fails.
 *
 * @return {Object} Binary data in the format specified by the <b>accept</b> parameter, or audio/amr-wb (Adaptive Multi-Rate Wideband), if the <b>accept</b> parameter is not specified, containing the audio transcription.
 *
 * <b>Example</b>
 *
 * The following example gets a WAV version of the text "Hello world".
 *
 *     params = {
 *        'accept' : 'audio/x-wav',
 *        'accessToken' : '<accessToken value>',
 *        'body' : 'Hello world',
 *        'contentType' : 'text/plain',
 *        'contentLength' : 11,
 *        'contentLanguage' : 'en-US',
 *        'xArg' : "VoiceName=mike'
 *     };
 *     invocationData = {
 *        adapter : 'TextToSpeech' ,
 *        procedure : 'textToSpeech' ,
 *        parameters : [params]           
 *     };
 *     options = {
 *        onSuccess : successCallback ,
 *        onFailure : failureCallback
 *        invocationContext : {}
 *     };
 *  
 *     WL.Client.invokeProcedure(invocationData, options);
 *
 */

/**
 * @class InAppMessaging
 * The In App Messaging API enables 
 * your app to reliably send and receive secure SMS and MMS messages on behalf of an AT&amp;T subscriber
 * <p>Authorization Scope: <b>IMMN,MIM</b></p>
 * <p>The InAppMessaging adapter only supports JSON requests and responses.  No XML or binary is supported since Worklight RPC is a JSON protocol.</p>
 *
 * <b>The InAppMessaging adapter API provides the following methods:</b>
 *
 * - {@link InAppMessaging#createMessageIndex}
 * - {@link InAppMessaging#deleteMessage}
 * - {@link InAppMessaging#deleteMessages}
 * - {@link InAppMessaging#getMessage}
 * - {@link InAppMessaging#getMessageContent}
 * - {@link InAppMessaging#getMessagesDelta}
 * - {@link InAppMessaging#getMessageIndexInfo}
 * - {@link InAppMessaging#getMessageList}
 * - {@link InAppMessaging#sendMessage}
 * - {@link InAppMessaging#updateMessage}
 * - {@link InAppMessaging#updateMessages}
 *
 */

 /**
 * @method sendMessage
 * Sends a message to a recipient.
 * <p>Authorization Model: <b>client_consent</b></p>
 *
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>InAppMessaging</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this parameter is <b>sendMessage</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.parameters.params.accessToken Specifies access token for authorization
 * @param {Object} invocationData.parameters.params.messageRequest Specifies a JSON object of the message, containing the following parameters:
 * @param {String} invocationData.parameters.params.messageRequest.addresses Specifies a comma seperated list of phone numbers (prefix with "tel:"), short codes (prefix with "short:"), and email addresses
 * @param {String} [invocationData.parameters.params.messageRequest.text] Specifies the text to be sent in a message 
 * @param {String} [invocationData.parameters.params.messageRequest.subject] Specifies the message subject 
 * @param {Boolean} [invocationData.parameters.params.messageRequest.isGroup] Specifies if the message is a broadcast to a group
 * @param {Array} [invocationData.parameters.params.messageRequest.messageContent] Array of file attachements
 * @param {String} [invocationData.parameters.params.messageRequest.messageContent.fileName] String for the filename of the media content 
 * @param {String} [invocationData.parameters.params.messageRequest.messageContent.content-type] Specifies the content type this media
 * @param {String} [invocationData.parameters.params.messageRequest.messageContent.content-transfer-encoding] The only accepted value when using Worklight is "BASE64" 
 * @param {String} [invocationData.parameters.params.messageRequest.messageContent.body] A string containing the BASE64 encoded attachment
 * @param {String} invocationData.parameters.params.accessToken Specifies the access token, which is the value of the <b>access_token</b> parameter returned in the {@link OAuthAdapter#getAccessToken} method response.
 * @param {Object} callbacks An object containing the success and failure callbacks.
 * @param {Function} callbacks.onSuccess Specifies the function that is called if the method returns succeeds.
 * @param {Function} callbacks.onFailure Specifies the function that is called if the method fails.
 *
 * @return {Object} An object containing the results of the call. This object has the following parameters.
 * <ul>
 *   <li>Id : String
 *   <br/>
 *   The unique identifier of the message.
 *   </li>
 * </ul>
 *
 * <strong>Example</strong>
 *
 * The following example sends the message "Hello world" and some attachements to the mobile number <b>1234567890</b>. For multiple phone numbers, separate the numbers by commas (,).
 *
 *     params = {
 *        'body' : {
 *           'messageRequest' : {
 *              "text" : "Hello world",
 *              "addresses" : ["tel:1234567890"],
 *              "messageContent":
 *              [
 *   				{
 *       				"fileName":"template.smil",
 *      				"content-type":"application/smil",
 *       				"content-transfer-encoding":"BASE64",
 *       				"body":"PQTasasd112NN"
 *    				},
 *    				{
 *       				"fileName":"Image2.jpg",
 *       				"content-type":"image/jpeg",
 *       				"content-transfer-encoding":"BASE64",
 *       				"body":"AQKfdsfsdwKFE/…"
 *    				}
 *  			]
 *           }
 *        },
 *        'accessToken': 'ffffffffffffffff'
 *     };
 *     invocationData = {
 *        adapter : 'InAppMessaging',
 *        procedure : 'sendMessage',
 *        parameters : [params]           
 *     };
 *     options = {
 *        onSuccess : function(data) {
 *           var sentId = data.invocationResult.id;
 *           myCallback(sentId);
 *        },
 *        onFailure : function(error) {
 *           myErrorCallback(error);
 *        } 
 *     };
 *      
 *     WL.Client.invokeProcedure(invocationData, options);
 *
 * The following example shows a JSON object returned by this method.
 * 
 *     { 
 *        "id": "a01234ff987654321"
 *     }
 */

/**
 * @method getMessageList
 * Enables applications to request meta-data for one or more Subscriber Messages from the AT&T Messages environment.
 * <p>Authorization Model: <b>authorization_code</b></p>
 * <p>Authorization Scope: <b>MIM</b></p>
 *
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>InAppMessaging</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this paramter is <b>getMessageList</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.parameters.params.accessToken Specifies the access token, which is the value of the <b>access_token</b> parameter returned in the {@link OAuthAdapter#getAccessToken} method response.
 * @param {String} invocationData.parameters.params.messageIds This parameter gets the list of messages by passing in a comma delimited list of distinct message IDs. This is an OR-based subset. If this parameter is supplied, then it will override any other parameter given. It will ignore the other parameters.
 * @param {String} invocationData.parameters.params.limit This parameter defines the upper limit of the number of returned messages.  A maximum value of 500 is supported. 
 * @param {String} invocationData.parameters.params.offset This parameter defines the offset from the beginning of the ordered set of messages.
 * @param {String} [invocationData.parameters.params.isUnread] This parameter filters by the following isUnread flag statuses: "true" or "false". 
 * @param {String} [invocationData.parameters.params.type] This parameter supports filter by message type of "SMS" or "MMS". Note: If the parameter is not passed, the type will default to "SMS, MMS"
 * @param {String} [invocationData.parameters.params.keyword] Retrieve message by passing address as a filter criteria.  Currently supports only a address is supported. Note:  For US numbers, do not pass +1.
 * @param {Boolean} invocationData.parameters.params.isIncoming] Specifies filtering by isIncoming. Can be either true or false 
 * @param {Object} callbacks An object containing the success and failure callbacks.
 * @param {Function} callbacks.onSuccess Specifies the function that is called if the method returns succeeds.
 * @param {Function} callbacks.onFailure Specifies the function that is called if the method fails.
 *
 * @return {Object} An object containing the results of the call. This object has the following parameters.
 * <ul>
 * <li>messageList:	Object containing a list of messages object and attributes about the list</li> 
 * <ul>
 * <li>offset: Integer specifying the offset from the beginning of the ordered set of messages.</li>
 * <li>limit: An integer number representing the number of messages requested. </li>
 * <li>total: An integer number of total messages returned based on filter criteria.</li>
 * <li>state: An opaque string that denotes the current state of the mailbox in the platform.</li>
 * <li>cacheStatus:	String indicating the status of the message index cache. The following values could be returned
 * <ul>
 * <li>NOT_INITIALIZED</li>
 * <li>INITIALIZING</li>
 * <li>INITIALIZED</li>
 * <li>ERROR In this case the caller should re-initialize</li>
 * </ul>
 * <li>failedMessages An array of string messageIds returned only when specific messageIds were requested.  If one or more of the messages requested does not exist on the platform while the others requested exist. This field will indicate the ids of the messages that no longer exist.</li>
 * <li>messages: Object containing an array of message object</li>
 * <ul>
 * <li>messageId String of the unique message id</li>
 * <li>from String with the message sender</li>
 * <li>recipients A list of strings containing the recpients.  If a Group Message, this will contain multiple addresses</li>
 * <li>Text	Message text string if type is TEXT.</li>
 * <li>mmsContent	List of Message part descriptions if type is MMS</li>
 * <li>timeStamp DateTime when the message was stored in the cloud.</li>
 * <li>isUnread Boolean indicating if message is unread.</li>
 * <li>type	String with the type of message "TEXT" or "MMS"</li>
 * <li>typeMetaData Object This parameter is part of the message object, which encapsulates message specific data fields.</li>
 * <li>isIncoming String in Indicates if message is incoming or not. Can be either "true" or "false"</li>
 * </ul></ul></ul>
 * <li>mmsContent Object</li>
 * <ul>
 * <li>contentName A String with the name of the content</li>
 * <li>contentType A String with the content type</li>
 * <li>contentURL A String with the relative URL to content<li>
 * <li>Type A string with the generic content type:  TEXT, IMAGE, AUDIO, VIDEO</li>
 * </ul>
 * <li>typeMetaData Object</li>
 * <ul>
 * <li>isSegmented A Boolean that indicates if this message is part of a of a segmented SMS message.</li>
 * <li>segmentationDetails An Object containing the segmentation details</li>
 * <li>subject A string containing the message subject</li>
 * </ul>
 * <li>segmentationDetails Object</li>
 * <ul>
 * <li>segmentationMsgRefNumber An Integer reference number for messages that are part of the same segmented SMS message. This parameter only mandatory if segmentationDetails exists.</li>
 * <li>totalNumberOfParts An Integer Total number of segments for this segmented SMS message. This parameter only mandatory if segmentationDetails exists.</li>
 * <li>thisPartNumber An Integer with the segmentation part number for this particular message. This parameter only mandatory if segmentationDetails exists.</li>
 * </ul>
 *
 */

/**
 * @method getMessage
 * The Get Message operation will get a single message from a subscriber’s message inbox.
 * <p>Authorization Model: <b>client_authorization</b></p>
 * <p>Authorization Scope: <b>MIM</b></p>
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>InAppMessaging</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this paramter is <b>getMessage</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} [invocationData.parameters.params.accept] Specifies the format of the object returned.
 * @param {String} invocationData.parameters.params.accessToken Specifies the access token, which is the value of the <b>access_token</b> parameter returned in the {@link OAuthAdapter#getAccessToken} method response.
 * @param {String} invocationData.parameters.params.messageId A message identifier representing a Subscriber Message in the AT&T Messages environment.
 *
 * @return {Object} A Message Object containing the results 
 */

/**
 * @method getMessageContent
 * This methodo uses information returned by getMessageList to enable applications to fetch one or more subscriber messages from the AT&T Messages environment.
 * <p>Authorization Model: <b>client_authorization</b></p>
 * <p>Authorization Scope: <b>MIM</b></p>
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>InAppMessaging</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this paramter is <b>getMessageContent</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.parameters.params.accessToken Specifies the access token, which is the value of the <b>access_token</b> parameter returned in the {@link OAuthAdapter#getAccessToken} method response.
 * @param {String} invocationData.parameters.params.messageId A message identifier representing a Subscriber Message in the AT&T Messages environment.
 * @param {String} invocationData.parameters.params.partId A content identifier representing an attachment in the referenced Subscriber Message.
 *
 * @return {Object} an object containing the message content in BASE64 encoded form 
 * 
 * { data: "4AAQSkZJRgABAgEAYABgAAD...7Q0YUGhvdG9zaG9wIDMuMAA4QklNA" }
 */
 
/**
 * @method getMessagesDelta
 * This method provides capability to check for updates by passing in a client state.  
 * This is typically used when a client goes from being offline to becoming online. 
 * If the subscriber’s mailbox index cache does not exist an error would be returned to the client and the client would have to re-initialize the cache.
 * <p>Authorization Model: <b>client_authorization</b></p>
 * <p>Authorization Scope: <b>MIM</b></p>
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>InAppMessaging</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this paramter is <b>getMessageDelta</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.parameters.params.accessToken Specifies the access token, which is the value of the <b>access_token</b> parameter returned in the {@link OAuthAdapter#getAccessToken} method response.
 * @param {String} invocationData.parameters.params.state The client would have this string from a either the Get Message Index request, or from the getMessageList request.
 *
 * @return {Object} an object containing the deltaResponse object 
 * 
 * {"deltaResponse": {
 * "state": "I:1291659705|H4sIAAAAAAAAAGNgYAAAEtlB_wMAAAA|:,S:1291659706|H4sIAAAAAAAAAGNkYqzhyWBgHIUYkAkIB9oNIx0yQTECMkPF4aKcjIMHsLIOtAsoBZgeAABR7gcNIgQAAA|:,t:1348690584.000019000.N.00000000:,r:1346267668.000005000.N.00000000:,u:1336148844.000009000.N.00000000:,p:1292019761.000702000.N.00000000:,",
 * "delta": [
 *   {
 *     "type": "TEXT",
 *     "adds": [{
 *         "isFavorite": true,
 *         "messageId": "t123",
 *         "isUnread": false
 *       },{
 *         "isFavorite": true,
 *         "messageId": "t456",
 *         "isUnread": false
 *       }
 *     ],
 *     "deletes": [{
 *         "isFavorite": true,
 *         "messageId": "t789",
 *         "isUnread": false
 *       }
 *     ],
 *     "updates": [{
 *         "isFavorite": true,
 *         "messageId": "t222",
 *         "isUnread": false
 *       },{
 *         "isFavorite": true,
 *         "messageId": "t223",
 *         "isUnread": false
 *       }
 *     ]
 *   },{
 *     "type": "MMS",
 *     "adds": [],
 *     "deletes": [],
 *     "updates": []
 *   }   
 * ]
 *}
 *}
 *
 */

/**
 * @method updateMessages
 * This operation allows the developer to update the flags that are associated with a collection of messages. The developer can pass in any number of messages.
 * <p>Authorization Model: <b>client_authorization</b></p>
 * <p>Authorization Scope: <b>IMMN</b></p>
 *
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>InAppMessaging</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this paramter is <b>updateMessages</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.parameters.params.accessToken Specifies the access token, which is the value of the <b>access_token</b> parameter returned in the {@link OAuthAdapter#getAccessToken} method response.
 * @param {Array} invocationData.parameters.params.messages Array of message objects containting the flags that need updating
 * @param {Object} callbacks An object containing the success and failure callbacks.
 * @param {Function} callbacks.onSuccess Specifies the function that is called if the method returns succeeds.
 * @param {Function} callbacks.onFailure Specifies the function that is called if the method fails.
 *
 * <strong>Example messages object</strong>
 *   "messages":
 *   [
 *      {
 *         "messageId":"a123",
 *         "isUnread":true
 *      },{
 *         "messageId":"b456",
 *         "isUnread":false
 *      }
 *   ]
 *
 * @return {Object} And content is returned, only HTTP Code 204 (No Content)
 *
 **/
 
/**
 * @method updateMessage
 * This operation allows the developer to update the flags that are associated with a message.
 * <p>Authorization Model: <b>client_authorization</b></p>
 * <p>Authorization Scope: <b>IMMN</b></p>
 *
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>InAppMessaging</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this paramter is <b>updateMessage</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.parameters.params.accessToken Specifies the access token, which is the value of the <b>access_token</b> parameter returned in the {@link OAuthAdapter#getAccessToken} method response.
 * @param {String} invocationData.parameters.params.messageId This parameter is the message identifier. 
 * @param {String} [invocationData.parameters.params.isUnread] This parameter filters by the following isUnread flag statuses: "true" or "false". 
 * @param {Object} callbacks An object containing the success and failure callbacks.
 * @param {Function} callbacks.onSuccess Specifies the function that is called if the method returns succeeds.
 * @param {Function} callbacks.onFailure Specifies the function that is called if the method fails.
 *
 * @return {Object} No content is returned, only HTTP Code 204 (No Content)
 *
 **/

 /**
 * @method deleteMessage
 * This operation gives the developer the ability to delete a message
 * <p>Authorization Model: <b>client_authorization</b></p>
 * <p>Authorization Scope: <b>IMMN</b></p>
 *
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>InAppMessaging</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this paramter is <b>deleteMessages</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.parameters.params.accessToken Specifies the access token, which is the value of the <b>access_token</b> parameter returned in the {@link OAuthAdapter#getAccessToken} method response.
 * @param {String} invocationData.parameters.params.messageId The ID of the message to delete. 
 * @param {Object} callbacks An object containing the success and failure callbacks.
 * @param {Function} callbacks.onSuccess Specifies the function that is called if the method returns succeeds.
 * @param {Function} callbacks.onFailure Specifies the function that is called if the method fails.
 *
 * @return {Object} No content is returned, only HTTP Code 204 (No Content)
 *
 **/
 
/**
 * @method deleteMessages
 * This operation gives the developer the ability to delete messages in an inbox
 * <p>Authorization Model: <b>client_authorization</b></p>
 * <p>Authorization Scope: <b>IMMN</b></p>
 *
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>InAppMessaging</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this paramter is <b>deleteMessages</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.parameters.params.accessToken Specifies the access token, which is the value of the <b>access_token</b> parameter returned in the {@link OAuthAdapter#getAccessToken} method response.
 * @param {String} invocationData.parameters.params.messageIds Comma delimited message ids list. 
 * @param {Object} callbacks An object containing the success and failure callbacks.
 * @param {Function} callbacks.onSuccess Specifies the function that is called if the method returns succeeds.
 * @param {Function} callbacks.onFailure Specifies the function that is called if the method fails.
 *
 * @return {Object} No content is returned, only HTTP Code 204 (No Content)
 *
 **/

/**
 * @method createMessageIndex
 * This operation gives the developer the ability to delete a messages in an inbox.
 * <p>Authorization Model: <b>client_authorization</b></p>
 * <p>Authorization Scope: <b>IMMN</b></p>
 *
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>InAppMessaging</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this paramter is <b>createMessageIndex</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.parameters.params.accessToken Specifies the access token, which is the value of the <b>access_token</b> parameter returned in the {@link OAuthAdapter#getAccessToken} method response.
 * @param {Object} callbacks An object containing the success and failure callbacks.
 * @param {Function} callbacks.onSuccess Specifies the function that is called if the method returns succeeds.
 * @param {Function} callbacks.onFailure Specifies the function that is called if the method fails.
 *
 * @return {Object} No content is returned, only HTTP Code 202 (Accepted)
 *
 **/

/**
 * @method getMessageIndexInfo
 * This operation gives the developer the ability to delete a messages in an inbox.
 * <p>Authorization Model: <b>client_authorization</b></p>
 * <p>Authorization Scope: <b>IMMN</b></p>
 *
 * @param {Object} invocationData Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.adapter Specifies the name of the adapter. The only defined value for this parameter is <b>InAppMessaging</b>.
 * @param {String} invocationData.procedure Specifies the name of the procedure. The only defined value for this paramter is <b>createMessageIndex</b>.
 * @param {Array}  invocationData.parameters Specifies an array that contains a JSON object.
 * @param {Object} invocationData.parameters.params Specifies a JSON object containing the following parameters.
 * @param {String} invocationData.parameters.params.accessToken Specifies the access token, which is the value of the <b>access_token</b> parameter returned in the {@link OAuthAdapter#getAccessToken} method response.
 * @param {Object} callbacks An object containing the success and failure callbacks.
 * @param {Function} callbacks.onSuccess Specifies the function that is called if the method returns succeeds.
 * @param {Function} callbacks.onFailure Specifies the function that is called if the method fails.
 *
 * @return {Object} A messageIndexInfo object is returned with the following parameters:
 * @param {String} status This parameters indicates the status of the message index cache. The following values could be returned
 *    <ul>
 *    <li>NOT_INITIALIZED</li>
 *    <li>INITIALIZING</li>
 *	  <li>INITIALIZED</li>
 *    <li>ERROR</li>
 *    </ul>
 * @param {String} state This is an opaque string that denotes the current state of the mailbox in the platform.
 * @param {Number} messageCount Number of message indexes cached for the subscriber
 * 
 **/
