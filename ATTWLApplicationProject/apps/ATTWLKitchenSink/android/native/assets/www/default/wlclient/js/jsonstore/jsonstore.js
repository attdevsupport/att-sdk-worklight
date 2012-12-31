
/* JavaScript content from wlclient/js/jsonstore/jsonstore.js in Common Resources */
/*
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
 * JSONStore is only supported in iOS (iPhone and iPad) and Android
 */
if (WL.Client.getEnvironment() === 'iphone' ||
	WL.Client.getEnvironment() === 'ipad' ||
	WL.Client.getEnvironment() === 'android') {

/**
Provides a namespace function for WL
@private
**/
var WL = WL || {};

WL.namespace = function (ns_string) {
	var parts = ns_string.split('.'),
	parent = WL,
	i;

	if (parts[0] === "WL") {
		parts = parts.slice(1);
	}

	for (i = 0; i < parts.length; i += 1) {
		if (typeof parent[parts[i]] === "undefined") {
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}

	return parent;
};

WL.namespace('WL.constant');
/**
Provides constants we use internally
@private
**/
WL.constant = (function(){

	//public api
	return {
		ID_KEY : '_id',
		JSON_DATA_KEY : 'json',
		OPERATION_KEY : '_operation'
	};

})(); //end WL.constant

WL.namespace('WL.check');
/**
Provides some validation methods we use in WL.JSONStore
@private
**/
WL.check = (function(jQuery){

	//Dependencies
	var constant = WL.constant,
		$ = jQuery;

	//Support for isArray on older browsers
	isArray = Array.isArray || function(obj) {
		return Object.prototype.toString.call(obj) == '[object Array]';
	};

	//Constants
	var ALPHANUMERIC_REGEX = /^[a-z0-9]+$/i;

	/** Checks if a string is alphanumeric
		@private
	*/
	var __isAlphaNumeric = function (string) {

		var result = ALPHANUMERIC_REGEX.exec(string);

		return (typeof string === 'string' && isArray(result) && result.length > 0 && result[0] === string);
	};

	/** Checks if input is an object.
		Note: __isObject([]) = false by default,
			if isArrayValid is true it returns true
		@private
	*/
	var __isObject = function (input, isArrayValid) {

		var isArrayValidType = isArrayValid || false;

		if (typeof input === 'undefined' || typeof input !== 'object' || input === null) {
			return false;
		}

		if (isArray(input) && !isArrayValidType) {
			return false;
		}

		return true;
	};

	/** Checks if an object does not contain
		other objects or arrays.
		@private
	*/
	var __isSimpleObject = function (obj) {

		var key,
			hasOwn = Object.prototype.hasOwnProperty;

		if (!__isObject(obj)) {
			return false;
		}

		for (key in obj) {
			if (hasOwn.call(obj, key) && __isObject(obj[key], true) || obj[key] === null) {
				return false;
			}
		}
		return true;
	};

	/** Private function to check if the array
		contains only objects and arrays.
		@private
	*/
	var __isArrayOfObjects = function (arr) {

		var i,
			len;

		if (!isArray(arr) || arr.length < 1) {
			return false;
		}

		for (i = 0, len = arr.length; i<len; i++) {
			if (!__isObject(arr[i])) {
				return false;
			}
		}

		return true;
	};

	/** Private function to check if an object contains duplicate keys, this will return true:
		{fn: 'carlos', fN: 'Carlos', Fn: 'clos', FN: 'carlitos'})
		contains only objects and arrays.
		@private
	*/
	var __containsDuplicateKeys = function (obj) {

		var i,
			len,
			keys = [],
			key,
			hasOwn = Object.prototype.hasOwnProperty;

		if(!__isObject(obj)){
			// fail the test, because it's not a valid object
			return true;
		}

		for (key in obj) {
			if(hasOwn.call(obj, key)){
				keys.push(key.toLowerCase());
			}
		}

		keys = keys.sort();
		
		//Guard against the {} case
		if (keys.length <= 0) {
			return false;
		}

		for (i = 0, len = keys.length; i < len - 1; i++) {
			if (keys[i + 1] === keys[i]) {
				return true;
			}
		}

		return false; //all green!
	};

	/** Checks if an object is a valid adapter.
		Valid adapter: {name: '', add: '', remove: '', replace: ''}

				typeof obj.add === 'string' &&
				typeof obj.remove === 'string' &&
				typeof obj.replace === 'string'

		@private
	*/
	var __isValidAdapter = function (obj) {

		return __isObject(obj) &&
		typeof obj.name === 'string' &&
		obj.name.length > 0;
	};

	/** Checks if the input (num) is an integrer.
		@private
	*/
	var __isInt = function (num) {

		return (typeof num === 'number' && parseFloat(num) == parseInt(num, 10) && !isNaN(num));
	};

	/** Checks if the object passed is a valid document.
		Valid object: {_id: 0, json: {...}}
		@private
	*/
	var __isValidDocument = function (doc) {

		return (__isObject(doc) && __isInt(Number(doc[constant.ID_KEY])) && __isObject(doc[constant.JSON_DATA_KEY]));
	};

	/** Checks if func is a function
		@private
	*/
	var __isFunction = function (func) {
		return typeof func === 'function';
	};

	/** Checks if str is a string
		@private
	*/
	var __isString = function (str) {
		return typeof str === 'string';
	};

	/** Checks if input is undefined (or null)
		@private
	*/
	var __isUndefined = function (input) {
		return (typeof input === 'undefined' || input === null);
	};

	/** Checks if input is a boolean
		@private
	*/
	var __isBoolean = function (input) {
		return typeof input === 'boolean';
	};

	/** Checks if valid load object
		Valid Example: { procedure: 'getCustomers', params: [], key: "customers" }
		@private
	*/
	var __isValidLoadObject = function (obj) {

		if (!__isObject(obj)) {
			return false;
		}

		return (__isString(obj.procedure) && isArray(obj.params) && __isString(obj.key));
	};

	/** Merges to objects
		var obj1 = {fn: 'carlos'}, var obj2 = {ln: 'andreu'};
		mergeObjects(obj1,obj2) => {fn: 'carlos', ln: 'andreu'}
		@private
	*/
	var __mergeObjects = function (obj1, obj2) {

		if (!__isObject(obj1) || !__isObject(obj2)) {
			return -1;
		}

		return $.extend(obj1, obj2);
	};

	/** Checks if it's part of the searchFields, if you pass additionalSearchFields
		it will also check those and only return true if it's inside one of those objects.
		@private
	*/
	var __isPartofSearchFields = function (obj, searchFields, additionalSearchFields) {

		if (!__isSimpleObject(obj) || !__isSimpleObject(searchFields)) {
			return false;
		}

		var key,
			hasOwn = Object.prototype.hasOwnProperty,
			allSearchFields = searchFields;
		
		//We want to make _id a valid searchField
		allSearchFields[constant.ID_KEY] = 'number';

		if (!__isUndefined(additionalSearchFields)) {
			allSearchFields = __mergeObjects(searchFields, additionalSearchFields);
		}

		//search searchFields in obj
		for (key in obj) {
			if (hasOwn.call(obj, key) && __isUndefined(allSearchFields[key.toLocaleLowerCase()])) {
				return false;
			}
		}

		return true;
	};

	/** Counts how many keys an object has
		@private
	*/
	var __countKeys = function (obj) {

		if (!__isObject(obj)) {
			return -1;
		}

		//This is faster but not supported everywhere
		if (!__isUndefined(Object.keys)) {

			return Object.keys(obj).length;

		//Loop over the keys and count them
		} else {
			var key,
				hasOwn = Object.prototype.hasOwnProperty,
				count = 0;

			for (key in obj) {
				if (hasOwn.call(obj, key)) {
					count++;
				}
			}

			return count;
		}
	};

	//public api
	return {
		isAlphaNumeric: __isAlphaNumeric,
		isObject: __isObject,
		isSimpleObject: __isSimpleObject,
		isArrayOfObjects : __isArrayOfObjects,
		containsDuplicateKeys : __containsDuplicateKeys,
		isValidAdapter : __isValidAdapter,
		isInt : __isInt,
		isValidDocument : __isValidDocument,
		isFunction : __isFunction,
		isString : __isString,
		isUndefined : __isUndefined,
		isBoolean : __isBoolean,
		isValidLoadObject : __isValidLoadObject,
		isPartofSearchFields : __isPartofSearchFields,
		countKeys : __countKeys,
		mergeObjects : __mergeObjects
	};

})(WLJQ); //end WL.check


WL.namespace('WL.callback');

/**
Provides support for setting up callbacks with events.
@private
**/
WL.callback = (function(jQuery){

	//Dependencies
	var check = WL.check,
		$ = jQuery,

		//Private Members
		_generate = function (options, events, src, collectionName) {

			var success,
				failure;

			success = function(data, more){

				$(document.body).trigger(events.success, [data, src, collectionName, more]);

				if(check.isObject(options) && check.isFunction(options.onSuccess)){
					options.onSuccess(data, more);
				}
			},

			failure = function(data, more){

				$(document.body).trigger(events.failure, [data, src, collectionName, more]);

				if(check.isObject(options) && check.isFunction(options.onFailure)){
					options.onFailure(data, more);
				}
			};

			return {onSuccess: success, onFailure: failure};
		};

	//public api
	return {
		generate : _generate
	};

})(WLJQ); //end WL.callback

WL.namespace('WL.jspath');
/**
Provides a way to traverse JSON objects in JavaScript
@private
**/
WL.jspath = (function(jQuery){

	var $ = jQuery,
		check = WL.check,

		__locate = function (search_element, search_key) {

			var arr = [];

			function traverse(current_key, current_value, parent_path) {

				if (check.isObject(current_value, true) && !check.isUndefined(current_value)) {

					if (!check.isUndefined(current_key)) {
						parent_path.push(current_key);
					}

					$.map(current_value, function(v,k) {

						if (search_key === k) {
							arr.push({parent: parent_path.join('.').replace('.',''),key : k, value: v});
						}

						traverse(k, v, parent_path);
					});

					if (!check.isUndefined(current_key)) {
						parent_path.pop();
					}
				}
			}

			traverse('', search_element, []);

			return arr;
		},

		__get = function (data, element, parent) {

			var databack,
				arr = [],
				current_parent;

			if (check.isUndefined(parent)) {
				parent = 'root';
			}

			if (!check.isObject(data, true) ||
				!check.isString(element) ||
				!check.isString(parent)) {

				return [];
			}

			if (parent === 'root') {
				return [data[element]];
			}

			databack = __locate(data, element);

			for (var i=0; i< databack.length; i++) {
				current_parent = databack[i].parent;
				if (current_parent.indexOf(parent) >= 0) {
					arr.push(databack[i].value);
				}
			}

			return arr;
		};

	//public api
	return {
		get : __get
	};

})(WLJQ); //end WL.jspath

WL.namespace('WL.db');

/**
Provides access to our internal storage via cordova.
Internally used in WL.JSONStore.
@private
**/
WL.db = (function(){

	//dependencies
	var cdv = cordova,

	//constants
	STORAGE_PLUGIN = 'StoragePlugin',
	PROVISION_METHOD = 'provision',
	STORE_METHOD = 'store',
	FIND_METHOD = 'find',
	FIND_BY_ID_METHOD = "findById",
	REPLACE_METHOD = 'replace',
	REMOVE_METHOD = 'remove',
    ALL_DIRTY_METHOD = 'allDirty',
    CLEAN_METHOD = "markClean",
	QUEUE_COUNT_METHOD = "localCount",
	COLLECTION_COUNT_METHOD = "count",
	IS_DIRTY_METHOD = "isDirty",
	DROP_TABLE_METHOD = "dropTable",
	STORE_SALT_METHOD = "storeSalt",
	STORE_DPK_METHOD = "storeDPK",
	IS_KEY_GEN_REQ_METHOD = "isKeyGenRequired",
	CHANGE_PW_METHOD = "changePassword",
	CLOSE_METHOD = "closeDatabase",
	DESTROY_METHOD = "destroyDbFileAndKeychain",

	__callNative = function (args, options, pluginName, nativeFunction) {

		cdv.exec(options.onSuccess, options.onFailure, pluginName, nativeFunction, args);
	},

	_provision = function (collection, searchFields, options) {

		__callNative([collection, JSON.stringify(searchFields), JSON.stringify(options)], options, STORAGE_PLUGIN, PROVISION_METHOD);
	};

	_store = function (collection, data, options) {

		__callNative([collection, JSON.stringify(data), JSON.stringify(options)], options, STORAGE_PLUGIN, STORE_METHOD);
	};

	_find = function (collection, query, options) {

		__callNative([collection, JSON.stringify(query)], options, STORAGE_PLUGIN, FIND_METHOD);
	},

	_findById = function (collection, id, options) {

		__callNative([collection, JSON.stringify(id)], options, STORAGE_PLUGIN, FIND_BY_ID_METHOD);
	},
         
	_replace = function (collection, doc, options) {

		__callNative([collection, JSON.stringify(doc), JSON.stringify(options)], options, STORAGE_PLUGIN, REPLACE_METHOD);
	},

	_remove = function (collection, query, options) {

		__callNative([collection, JSON.stringify(query), JSON.stringify(options)], options, STORAGE_PLUGIN, REMOVE_METHOD);
	},

    _allDirty = function (collection, docs, options) {

         __callNative([collection, JSON.stringify(docs)], options, STORAGE_PLUGIN, ALL_DIRTY_METHOD);
    };
         
    _clean = function (collection, docId, options) {
         
         __callNative([collection, JSON.stringify(docId)], options, STORAGE_PLUGIN, CLEAN_METHOD);
    };

	_localCount = function (collection, options) {

		__callNative([collection], options, STORAGE_PLUGIN, QUEUE_COUNT_METHOD);
	};

	_count = function (collection, options) {

		__callNative([collection], options, STORAGE_PLUGIN, COLLECTION_COUNT_METHOD);
	};
	
	_isDirty = function (collection, docId, options) {

		__callNative([collection, JSON.stringify(docId)], options, STORAGE_PLUGIN, IS_DIRTY_METHOD);
	};

	_clear = function (collection, options) {

		__callNative([collection], options, STORAGE_PLUGIN, DROP_TABLE_METHOD);
	};
	
	__storeSalt = function (salt, options) {

		__callNative([salt], options, STORAGE_PLUGIN, STORE_SALT_METHOD);
	};

	_storeDPK = function (secRand, password, salt, options) {
		__callNative([secRand, password, salt], options, STORAGE_PLUGIN, STORE_DPK_METHOD);
		password = null;
	};

	_changePW = function (oldPw, newPw, options) {

		__callNative([oldPw, newPw], options, STORAGE_PLUGIN, CHANGE_PW_METHOD);
		oldPw = null;
		newPw = null;
	};

	_isKeyGenRequired = function (options) {

		__callNative([], options, STORAGE_PLUGIN, IS_KEY_GEN_REQ_METHOD);
	};
    
	_closeDatabase = function(options) {

		__callNative([], options, STORAGE_PLUGIN, CLOSE_METHOD);
	};

	_destroy = function (options) {

		__callNative([], options, STORAGE_PLUGIN, DESTROY_METHOD);
	};

	//public API
	return {
		provision : _provision,
		store : _store,
		find : _find,
		findById : _findById,
		replace : _replace,
		remove : _remove,
		allDirty: _allDirty,
		pushRequiredCount : _localCount,
		count : _count,
		isPushRequired : _isDirty,
		markpushed : _clean,
		removeCollection : _clear,
		storeSalt : __storeSalt,
		storeDPK : _storeDPK,
		isKeyGenRequired: _isKeyGenRequired,
		changePassword: _changePW,
		closeAll : _closeDatabase,
		destroy : _destroy
	};

}());//WL.db

WL.namespace('WL.JSONStore');
/**
Provides the API for storing JSON data locally,
it may be linked to an adapter for data pushronization.

##Definitions

* **WL.JSONStore** : Creates JSON Document collections via the `initCollection` method.

* **Collection** : A group of related documents.

* **Document** : A JavaScript object that has an `_id` key that holds an integrer
	and a `json` key that holds a JavaScript object. Document is an internal structure
	we generate when you `add` or `store` data, `_id` should not be modified.

		var doc = {_id : 0, json: {fn : 'carlos', age : 99, active : false}};

* **Array of Documents** : An array that holds only Documents.

		var doc = [{_id : 0, json : {fn : 'carlos', age : 99, active : false}}];

* **searchFields** : Defines the keys in JavaScript objects that are indexed,
    thus determining what you can query in a collection.  The keys in the searchFields
    object must correspond to paths in the stored JSON object.  Search field keys will
    be applied to the JSON objects in a style similar to object['keyPart1]['keyPart2'].  When a searchField
    is located in the JavaScript object, it will only be indexed if the value is a simple type (integer, number,
    boolean, string).  The values for search fields are type hints and must be one of `'string'`, `'integer'`,
    `'number'`, or `'boolean'`.  The type declared in the searchField does not have to match the type of the 
    item matched at runtime, but the better the match the better the optimization that can be done.
    In the example below, the fields `'fn'`, `'age'`, `'gpa'` and `'active'` will only match keys found at the 
    top level of the JavaScript object:  `var myObj = { age: 42 }`, and  would not match
    `var myObj2 = { person : {age : 18 } }`, the search field would have to be `'person.age'` 
    to match this case.  

		var searchFields = {	fn : 'string',
						age : 'integer',
						gpa : 'number', //floating point or int
						active : 'boolean',
						'address.state' : 'string' };

    Arrays are handled in a pass-through fashion, that is to say that
    you can not index an array or a specific index of the array (arr[n]) but you can index
    objects inside of an array.  
    For example
     
		var myObj = { 
			customers : [ 
				{ fn: "tim", age: 31 }, 
				{ fn: "carlos", age: 11 }
			] 
		};
		 
    searchField keys 'customers.fn' and 'customers.age' will match the values in the objects inside
    the customers array.  However 'customers' would not be matched as the value is an array. 


* **Query** : A JavaScript object that does not contain nested objects or arrays.
	Keys must specified in the searchFields or the special `_id` indentifier.

		var query = {_id : 0};
		var query = {fn : 'carlos'};
		var query = {age : 99};
		var query = {active : false};
		var query = {'address.state' : 'TX'};

* **Adapter** : Collections may be linked to an adapter, this is used to push data
	by invoking the specified adapter procedures based on the local modifications performed.
	For example: A document that was removed from the local collection will be passed to
	the remove procedure in the adapter. There's an optional function you can pass via the
	`accept` key to the `adapter` object that determines if the document we try to pushed is
	marked as pushed in local storage. You may optionally include a 'load' key with an
	object that tells the collection where to load the initial set of data. The procedure name
	must be part of the adapter you linked to the collection, you may pass any number of parameters
	via the parameters array to the procedure or an empty array for no parameters and you
	need to supply a key that will be used to determine what you want to store in the
	invocation result (`response.invocationResult[key]`). See `load()` for more details.

		var adapter = {name: 'customerAdapter',
			add: 'addProcedureInCustomerAdapterName',
			remove: 'removeProcedureInCustomerAdapterName',
			replace: 'replaceProcedureInCustomerAdapterName',
			load: {
				procedure: 'getCustomers',
				params: [],
				key: "customers"
			},
			accept: function (data) {
						return (data.status === 200);
					}
			};

* **Options** : A JavaScript object that contains the failure and success callback functions.
	Aditional parameters may be accepted and will be documented in their respective methods.
	These success and failure callbacks are specific to the function you're calling, for example
	the `onSuccess` function passed to `initCollection` will only be called when `initCollection` is successful.

		var win =	function (data) { };
		var fail =	function (data) { };
		var options = {onSuccess: win, onFailure: fail};

* **Events** : You can listen to events and capture succesful and failure status codes and data.
	The following assumes jQuery >1.7:

			$(document.body).on('WL/JSONSTORE/SUCCESS', function(evt, status, src, data){
				if(src === 'find'){
					console.log(status);
					if(typeof data !== 'undefined'){
						console.log(data);
					}
				}
			});

	You can also listen to the `WL/JSONSTORE/FAILURE` event.


* **additionalSearchFields** : Defines additional fields that are searchable without 
    modifying the stored document.  Usecases for additionalSearchFields include
    "tagging" data and forming relationships.  
    
    	//Note that this example has certain elements omitted for brevity, 
    	//see the documentation for initCollection, store, and find
    	//for complete exammples of those functions. 
    
		var orders = [
			{
				orderid : 23,
				item : 'tasty coffee'
			},
			{
				orderid : 99,
				item : 'good book'
			}		
		];
		//Appear in objects to add to the collection
		var searchFields = { orderid: 'integer', item: 'string' };
		
		//Do not appear in objects to add to the collection
		var addSearchFields = { customerId : 'string' };
		
	  	var options = {additionalSearchFields: addSearchFields, onSuccess: win, onFailure: fail};
	  		  		  	
	  	var orderCollection = WL.JSONStore.initCollection('orders', searchFields, options);
		
		//call this in or after the onSuccess callback from initCollection
		orderCollection.store(orders, {additionalSearchFields : { customerId: 'abc123'} }, <store options>);
		
		//call this in or after the onSuccess callback from store
		orderCollection.find({customerId: 'abc123'}, <find options>);
		
	Find will call the onSuccess callback with a parameter that contains the following data:
	
		[
			{ 
				_id : 1,
			  	json : {
					orderid : 23,
					item : 'tasty coffee'
				}
			},
			{
				_id : 2,
				json : { 
				
					orderid :99,
					item : 'good book'
				}
			}		
		];
		
	Notice how the 'customerId' field was not added to the actual document, but is available as a searchable
	field in the find function. 

##Error Code List

		-50 = "PERSISTENT_STORE_NOT_OPEN";
		-5 = "DESTROY_REMOVE_PERSISTENT_STORE_FAILED";
		-4 = "DESTROY_REMOVE_KEYS_FAILED";
		-3 = "INVALID_KEY_ON_PROVISION";
		-2 = "PROVISION_TABLE_SEARCH_FIELDS_MISMATCH";
		-1 = "PERSISTENT_STORE_FAILURE";
		0 = "SUCCESS";
		1 = "BAD_PARAMETER_EXPECTED_INT";
		2 = "BAD_PARAMETER_EXPECTED_STRING";
		3 = "BAD_PARAMETER_EXPECTED_FUNCTION";
		4 = "BAD_PARAMETER_EXPECTED_ALPHANUMERIC_STRING";
		5 = "BAD_PARAMETER_EXPECTED_OBJECT";
		6 = "BAD_PARAMETER_EXPECTED_SIMPLE_OBJECT";
		7 = "BAD_PARAMETER_EXPECTED_DOCUMENT";
		8 = "FAILED_TO_GET_UNPUSHED_DOCUMENTS_FROM_DB";
		9 = "NO_ADAPTER_LINKED_TO_COLLECTION";
		10 = "BAD_PARAMETER_EXPECTED_DOCUMENT_OR_ARRAY_OF_DOCUMENTS";
		11 = "INVALID_PASSWORD_EXPECTED_ALPHANUMERIC_STRING_WITH_LENGTH_GREATER_THAN_ZERO";
		12 = "ADAPTER_FAILURE";
		13 = "BAD_PARAMETER_EXPECTED_DOCUMENT_OR_ID";
		14 = "CAN_NOT_REPLACE_DEFAULT_FUNCTIONS";
		15 = "COULD_NOT_MARK_DOCUMENT_PUSHED";
		16 = "COULD_NOT_GET_SECURE_KEY";
		17 = "FAILED_TO_LOAD_INITIAL_DATA_FROM_ADAPTER";
		18 = "FAILED_TO_LOAD_INITIAL_DATA_FROM_ADAPTER_INVALID_LOAD_OBJ";
		19 = "INVALID_KEY_IN_LOAD_OBJECT";
		20 = "UNDEFINED_PUSH_OPERATION";
		21 = "INVALID_ADD_INDEX_KEY";
		22 = "INVALID_SEARCH_FIELD";
		23 = "CLOSING_ALL";
		24 = "CHANGING_PASSWORD";
		25 = "DURING_DESTROY";
		26 = "CLEARING_COLLECTION";
		27 = "INVALID_PARAMETER_FOR_FIND_BY_ID";
		
##Typical Usage

The JSONStore can be used to create collection either from an adapter or otherwise. When tied to an adapter,
the current API supports a convention of tying the various sync operations (pushing to server) based on the
action user can performed on the local collection in the JSONStore.

* Decide if the collections as part of the JSONStore needs to be encrypted. If there is a requirement to secure
the data at rest, set the password used to derive the key and encrypt the data (from the user password or other source)
by invoking `usePassword`.

* Start with defining the Collection by using the `initCollection`. This includes defining adapter configuration,
collection name and the searchfields options.

* You can automatically store the records or populate them by invoking `store`.

* Your users can then `find` and work with the collection locally ‐ `replace`, `add` or `remove` JSON Documents.

* When the user is ready they can invoke the action that triggers `push` or `pushSelected`.

* You can optionally close after using the collection by `closeAll` which will close the JSONStore and the collections
in it or destroy the local collections by `destroy`.

@namespace WL
@class JSONStore
**/
WL.JSONStore = (function () {
	"use strict";

	/**
		Dependencies
		@private
	*/
	var db = WL.db,
		check = WL.check,
		cb = WL.callback,
		constant = WL.constant,
		eoc = WL.EncryptedCache,
		jspath = WL.jspath,

		/**
			CONSTANTS
			@private
		*/
		EVENT_LABELS = {success: 'WL/JSONSTORE/SUCCESS', failure: 'WL/JSONSTORE/FAILURE'},
		ERROR = [],
		PWD,
		UNDEF;

		/**
			Error Codes - Make sure you update wl.geterrormessage.tests.js
				in QA/jsonstore if you change the error codes.
			@private
		*/
		ERROR[-50] = "PERSISTENT_STORE_NOT_OPEN";
		ERROR[-5] = "DESTROY_REMOVE_PERSISTENT_STORE_FAILED";
		ERROR[-4] = "DESTROY_REMOVE_KEYS_FAILED";
		ERROR[-3] = "INVALID_KEY_ON_PROVISION";
		ERROR[-2] = "PROVISION_TABLE_SEARCH_FIELDS_MISMATCH";
		ERROR[-1] = "PERSISTENT_STORE_FAILURE";
		ERROR[0] = "SUCCESS";
		ERROR[1] = "BAD_PARAMETER_EXPECTED_INT";
		ERROR[2] = "BAD_PARAMETER_EXPECTED_STRING";
		ERROR[3] = "BAD_PARAMETER_EXPECTED_FUNCTION";
		ERROR[4] = "BAD_PARAMETER_EXPECTED_ALPHANUMERIC_STRING";
		ERROR[5] = "BAD_PARAMETER_EXPECTED_OBJECT";
		ERROR[6] = "BAD_PARAMETER_EXPECTED_SIMPLE_OBJECT";
		ERROR[7] = "BAD_PARAMETER_EXPECTED_DOCUMENT";
		ERROR[8] = "FAILED_TO_GET_UNPUSHED_DOCUMENTS_FROM_DB";
		ERROR[9] = "NO_ADAPTER_LINKED_TO_COLLECTION";
		ERROR[10] = "BAD_PARAMETER_EXPECTED_DOCUMENT_OR_ARRAY_OF_DOCUMENTS";
		ERROR[11] = "INVALID_PASSWORD_EXPECTED_ALPHANUMERIC_STRING_WITH_LENGTH_GREATER_THAN_ZERO";
		ERROR[12] = "ADAPTER_FAILURE";
		ERROR[13] = "BAD_PARAMETER_EXPECTED_DOCUMENT_OR_ID";
		ERROR[14] = "CAN_NOT_REPLACE_DEFAULT_FUNCTIONS";
		ERROR[15] = "COULD_NOT_MARK_DOCUMENT_PUSHED";
		ERROR[16] = "COULD_NOT_GET_SECURE_KEY";
		ERROR[17] = "FAILED_TO_LOAD_INITIAL_DATA_FROM_ADAPTER";
		ERROR[18] = "FAILED_TO_LOAD_INITIAL_DATA_FROM_ADAPTER_INVALID_LOAD_OBJ";
		ERROR[19] = "INVALID_KEY_IN_LOAD_OBJECT";
		ERROR[20] = "UNDEFINED_PUSH_OPERATION";
		ERROR[21] = "INVALID_ADD_INDEX_KEY";
		ERROR[22] = "INVALID_SEARCH_FIELD";
		ERROR[23] = "ERROR_CLOSING_ALL";
		ERROR[24] = "ERROR_CHANGING_PASSWORD";
		ERROR[25] = "ERROR_DURING_DESTROY";
		ERROR[26] = "ERROR_CLEARING_COLLECTION";
		ERROR[27] = "INVALID_PARAMETER_FOR_FIND_BY_ID";

		/**
			Interacts with a single collection.
			@private
			@param name {string} Collection name.
			@param searchFields {searchFields}
			@param [adapter] {Adapter}
		*/
		var JSONStoreInstance = function (name, searchFields, adapter, additionalSearchFields) {

			this.name = name;
			this.searchFields = searchFields;
			this.adapter = adapter;
			this.additionalSearchFields = additionalSearchFields || {};
		},

		/**
			Used to preserve state while pushing.
			@private
			@param pushData {object} Contains the following: 'name' with the collection name,
				'adapter' is an Adapter and 'data' is what we want to push.
		*/
		PushInstance = function (pushData) {

			this.pushData = pushData;
		},

		/**
			Used to generated onSuccess and onFailure callbacks
			@private
			@param options {object} should contain `onSuccess` and `onFailure` keys
			@param src {string} name of the function that generated the callbacks (ie. find, replace, etc.)
			@return {object} An object that has an onSuccess and onFailure key.
		*/
		__generateCallbacks = function (options, src, collectionName) {

			return cb.generate(options, EVENT_LABELS, src, collectionName);
		},

		/**
			Used to check if we can call down to native with data after it's validated an put in an array.
			@private
			@param arr {array} should contain `onSuccess` and `onFailure` keys
			@param callbacks {string} An object that has an onSuccess and onFailure key.
			@return {object} True if there's something in the array, false otherwise.
		*/
		__validDataExists = function (arr, callbacks) {

			if (arr.length > 0) {

				return true;

			} else {

				callbacks.onFailure(10);
				return false;

			}
		},

		/**
			If data is a an object or an array of objects, push it to an array.
			@private
			@param data {object or array of objects} Object we are going to check.
			@return {array} Array with objects in every index
		*/
		__getDataArray = function (data) {

			var arrayOfObjects = [],
				i = 0;

			if (check.isObject(data)) {

				arrayOfObjects.push(data);

			} else if (check.isArrayOfObjects(data)) {

				for ( ; i < data.length; i++) {

					if (check.isObject(data[i])) {

						arrayOfObjects.push(data[i]);

					} else {

						return [];
					}
				}
			}

			return arrayOfObjects;
		},

		/**
			If data is a valid document, a simple object (query), an array of documents or an integer (_id) push it to an array.
			@private
			@param doc {document, simple object, array of documents or int} Valid values.
			@param idOnly {boolean} Determines if we return {_id: [int]} or a whole document.
			@return {array} Array with one of more of those in every index.
		*/
		__getQueryArray = function (doc, idOnly) {

			var idQueryObj = {},
				arrayOfQueries = [],
				i = 0;

			if (check.isValidDocument(doc)) {

				
				if(idOnly){
					idQueryObj[constant.ID_KEY] = doc[constant.ID_KEY];
					arrayOfQueries.push(idQueryObj);
				}
				else {
					arrayOfQueries.push(doc);
				}

			} else if (check.isSimpleObject(doc)) {

				arrayOfQueries.push(doc);

			} else if (check.isArrayOfObjects(doc)) {

				for ( ; i < doc.length; i++) {

					if (check.isValidDocument(doc[i])) {

						if(idOnly){
							idQueryObj[constant.ID_KEY] = doc[i][constant.ID_KEY];
							arrayOfQueries.push(idQueryObj);
						}else{
							arrayOfQueries.push(doc[i]);
						}
						
					} else {
						
						return [];
					}
				}

			} else if (check.isInt(doc) && idOnly) {

				idQueryObj[constant.ID_KEY] = doc;
				arrayOfQueries.push(idQueryObj);
			}

			return arrayOfQueries;
		},

		/**
			Holds the push logic that is used via push and pushSelected.
			@private
			@param [options] {Options}
			@param name {string} Collection name.
			@param searchFields {searchFields}
		*/
		__push = function (options, name, adapter, doc) {

			var collectionAdapter = adapter,
				collectionName = name,
				callbacks = __generateCallbacks(options, 'push', collectionName),
				arrayOfObjects = [],
				i = 0,
				len = 0,
				inst = {},

				allDirtySuccess = function (data) {

					len = data.length;

					if (len < 1) {

						callbacks.onSuccess(0);
						return 0;
					}

					//Time to push the data Array we got back
					for (i = 0; i < len; i++) {

						inst = new PushInstance({name: collectionName, adapter: collectionAdapter, data: data[i],
							onSuccess: callbacks.onSuccess, onFailure: callbacks.onFailure});
						inst.invokeProcedure();
					}
				},

				allDirtyFailure = function (data) {
					// If we get the special "can not access the database manager" failure, then return that
					// otherwise, indicate a general failure
					if (data === -50) {
						callbacks.onFailure(data);
						return data;
					} else {
						callbacks.onFailure(8);
						return 8;
					}
				};

			//Checks if collectionAdapter is an object with a key 'name' that has a string value.
			if (!check.isValidAdapter(collectionAdapter)) {

				callbacks.onFailure(9);
				return 9;
			}

			if (check.isUndefined(doc) && doc !== null ) {

				//Get ALL of the dirty records in the database
				db.allDirty(collectionName, [], {onSuccess: allDirtySuccess, onFailure: allDirtyFailure});

			} else if (check.isValidDocument(doc)) {

				db.allDirty(collectionName, [doc], {onSuccess: allDirtySuccess, onFailure: allDirtyFailure});

			} else if (check.isArrayOfObjects(doc)) {

				for ( i = 0, len = doc.length ; i < len; i++) {

					if (check.isValidDocument(doc[i])) {

						arrayOfObjects.push(doc[i]);
					} else {

						callbacks.onFailure(7, doc[i]);
						return 7;
					}
				}

				db.allDirty(collectionName, arrayOfObjects, {onSuccess: allDirtySuccess, onFailure: allDirtyFailure});

			} else {
				callbacks.onFailure(10);
				return 10;
			}

		},

		/**
			Holds the store and add logic.
			@private
			@param name {string} Collection name.
			@param searchFields {searchFields}
			@param data {Object} Data we want to store or add.
			@param [options] {Options}
		*/
		__store = function (name, searchFields, additionalSearchFields, data, options) {

			var arrayOfObjects = __getDataArray(data),
				callbacks = __generateCallbacks(options, 'store', name),
				additionalSearchFieldsObj = options.additionalSearchFields;

			callbacks.isAdd = options.isAdd;

			if(check.isSimpleObject(additionalSearchFieldsObj)) {

				if(check.isPartofSearchFields(additionalSearchFieldsObj, searchFields, additionalSearchFields)) {

					callbacks.additionalSearchFields = additionalSearchFieldsObj;
				}else{

					callbacks.onFailure(21);
				}
			}

			if(__validDataExists(arrayOfObjects, callbacks)){
				db.store(name, arrayOfObjects, callbacks);
			}

		},

		/**
			Holds the replace and refresh logic.
			@private
			@param name {string} Collection name.
			@param doc {Document} Document we want to replace or refresh.
			@param [options] {Options}
		*/
		__replace = function (name, doc, options) {
			
			var arrayOfQueries = __getQueryArray(doc, false),
				callbacks = __generateCallbacks(options, 'replace', name);

			callbacks.isRefresh = options.isRefresh;

			if(__validDataExists(arrayOfQueries, callbacks)){
				db.replace(name, arrayOfQueries, callbacks);
			}
		},

		/**
			Holds the remove and erase logic.
			@private
			@param name {string} Collection name.
			@param doc {Document} Document we want to remove or erase.
			@param [options] {Options}
		*/
		__remove = function (name, doc, options) {
			
			var arrayOfQueries = __getQueryArray(doc, true),
				callbacks = __generateCallbacks(options, 'remove', name);

				callbacks.isErase = options.isErase;

			if(__validDataExists(arrayOfQueries, callbacks)){
				db.remove(name, arrayOfQueries, callbacks);
			}

		},

		/**
			Holds the find and findAll logic.
			@private
			@param name {string} Collection name.
			@param query {Query} Object with a search key from the searchFields
				and a search term in the value. FindAll passes an empty object.
			@param [options] {Options}
		*/
		__find = function (name, query, searchFields, additionalSearchFields, options) {

			var callbacks = __generateCallbacks(options, 'find', name);

			if (check.isSimpleObject(query)) { //Arrays are not valid objects
				if (check.isPartofSearchFields(query, searchFields, additionalSearchFields)) {
					db.find(name, query, callbacks);
				} else {
					callbacks.onFailure(22);
				}

			} else {

				callbacks.onFailure(6);
			}
		},

		/**
			Creates a Document.
			@method documentify
			@static
			@param id {integrer} ID for the Document
			@param data {object} JSON data for the Document
			@return {Document} or an error code.

			@example
				var doc = WL.JSONStore.documentify(1, {fn: 'carlos', age: 99, active: false});
				console.log(doc);
					=> {_id: 1, json:  {fn: 'carlos', age: 99, active: false}}
		*/
		_documentify = function (id, data, options) {

			var documentId = Number(id),
				documentToReturn = {};

			if (!check.isInt(documentId)) {

				return 1;
			}

			if (!check.isObject(data)) {

				return 5;
			}

			documentToReturn[constant.ID_KEY] = documentId;
			documentToReturn[constant.JSON_DATA_KEY] = data;

			return documentToReturn;
		},


		/**
			Sets the password used to generate keys to encrypt date stored locally on the device.
			@static
			@method usePassword
			@param pwd {String} String containing the password
			@returns {Boolean} true if the password is a valid string, false otherwise.

			@example
				var pwd = prompt('What is your password?');
				WL.JSONStore.usePassword(pwd);
		*/
		_usePassword = function (pwd) {

			if (check.isString(pwd) && pwd.length > 0) {

				PWD = pwd;
				return true;

			} else {

				return false;

			}
		},
        
		/**
			Removes the password from memory.
			@method clearPassword
			@returns {Boolean} true if the password stored in memory was nulled, false if there was no password
				in memory or if the password was not nulled.

			@example
				WL.JSONStore.clearPassword();
		*/
		_clearPassword = function () {

			if(check.isUndefined(PWD)){
				return false;
			}else{
				PWD = null;
				return (PWD === null);
			}

		},

		/**
			Closes all the collections the JSONStore.  After a `closeAll`, each collection in the store will need to have
			`WL.JSONStore.initCollection` called again before that collection can be used.  Note that if the
			collections in the persistent store are password protected, the password will need to be specified
			using `WL.JSONStore.usePassword`.
			@method closeAll
			@static
			@param [options] {Options}
			@return {onSuccess} called if it was succesful. `onFailure` returns an error code.

			@example
				var win = function () {
					console.log('SUCCESS');
				};

				var fail = function (err) {
					console.log('FAILURE');
				};

				WL.JSONStore.closeAll({onSuccess: win, onFailure: fail});
		*/
		_closeAll = function (options) {

			var callbacks = __generateCallbacks(options, 'closeAll');

			db.closeAll(callbacks);
		},

		/**
			Changes the password for the internal storage.
			@method changePassword
			@static
			@param oldPW {string} The old password. Must be alphanumeric with at least 1 character.
			@param newPW {string} The new password. Must be alphanumeric with at least 1 character.
			@param [options] {Options}
			@return {onSuccess} called if succesful and `onFailure` called if it was unsuccesful with an error code.

			@example
				var win = function () {
					console.log('SUCCESS');
				};

				var fail = function (err) {
					console.log('FAILURE');
				};

				WL.JSONStore.changePassword({onSuccess: win, onFailure: fail});
		*/
		_changePassword = function (oldPW, newPW, options) {

			var callbacks = __generateCallbacks(options, 'changePassword');

			if (check.isString(oldPW) && oldPW.length > 0 &&
				check.isString(newPW) && newPW.length > 0) {

				db.changePassword(oldPW, newPW, callbacks);

			} else {
				// Both Passwords must be an alphanumeric string of length greater than zero
				callbacks.onFailure(11);
				//return 11;
			}
		},

		/**
			Destroys the internal storage and clears the keychain that stores necesary keys for decrypting the internal storage.
			@method destroy
			@static
			@param [options] {Options}
			@return {onSuccess} called if succesful and `onFailure` called if it was unsuccesful with an error code.

			@example
				var win = function (status) {
					console.log('SUCCESS');
				};

				var fail = function (status) {
					console.log('FAILURE');
				};

				WL.JSONStore.destroy({onSuccess: win, onFailure: fail});
		*/
		_destroy = function (options) {

			var callbacks = __generateCallbacks(options, 'destroy');

			db.destroy(callbacks);
		},

		/**
			Returns the message associated with a status code.
			@method getErrorMessage
			@static
			@param statusCode {Integer}
			@return {String} The Error Message associated with the status code or 'Not Found'
				if you pass an invalid value (non-integer) or a non-existant status code.

			@example
				WL.JSONStore.getErrorMessage(-50);
					=> "PERSISTENT_STORE_NOT_OPEN"
		*/
		_getErrorMessage = function (statusCode) {

			if(!check.isInt(statusCode)){
				return "Not found";
			}

			return ERROR[statusCode] || "Not found";
		},

		/**
			Creates an new object to interact with a single collection.
			If local storage for the collection does not exist it is provisioned with the searchFields.
			Otherwise the searchFields will be validated against the searchFields used to originally
			provision the collection.
			@method initCollection
			@static
			@param name {string} Collection name.
			@param searchFields {searchFields}
			@param [options] {Options} Additionally you may link a collection to an Adapter. You can also pass
				load:true and it will check if the collection is empty and load data using the adapter you defined to get data.
			@return {JSONStoreInstance} The collection will not be usable until a succesful callback.
				`onSuccess` called if succesful and `onFailure` called if it was unsuccesful with an error code.

			@example

				var name = 'customers';
		
				var searchFields = {	fn: 'string',
								age: 'integrer',
								active: 'boolean' };
		
				var adapterDefinition = {	name: 'customerAdapter',
								add: 'addProcedureInCustomerAdapterName',
								remove: 'removeProcedureInCustomerAdapterName',
								replace: 'replaceProcedureInCustomerAdapterName',
								load: {
									procedure: 'getCustomers',
									params: [],
									key: "customers"
								},
								accept : function (data, doc) { //doc is the document pushed via the adapter
											return (data.status === 200); //data is what we got back from the adapter
										}
								};
			
				var win =	function (status) {
								console.log('SUCCESS');
								if (status === 1) {
									console.log('Collection already existed');
								} else if (status == 0) {
									console.log('New Collection');
								}
							};
							
				var fail =	function (err) {
								console.log('FAILURE');
								
								//Display the error message:
								console.log(WL.JSONStore.getErrorMessage(err));
								
								//Calling getErrorMessage is equivalent to something like this:
								//if (err === -1) {
								//	console.log('PERSISTENT_STORE_FAILURE');
								//} else if (err === -2){
								//	console.log('PROVISION_TABLE_SEARCH_FIELDS_MISMATCH');
								//} else if (err === -3) {
								//	console.log('INVALID_KEY_ON_PROVISION');
								//} else if(err == 16) {
								//	console.log('COULD_NOT_GET_SECURE_KEY');
								//}
								
							};
				
				var options = {adapter: adapterDefinition, onSuccess: win, onFailure: fail};
				
				var collection = WL.JSONStore.initCollection(name, searchFields, options);
		*/
		_provisionCollection = function (name, searchFields, options) {

			var instance,
				collectionAdapter,
				collectionName = '',
				collectionsearchFields = {},
				collectionAdditionalSearchFields = {},
				collectionOptions = {},
				dropCollection = false,
				collectionPassword = '',
                key = '',
                hasOwn = Object.prototype.hasOwnProperty,
				callbacks = __generateCallbacks(options, 'initCollection', name),
				checkKeysCB;
				
			if (check.isObject(options)) {

				if (check.isBoolean(options.dropCollection)) {
					dropCollection = options.dropCollection;
				}

				//check if the password key exists
				if(!check.isUndefined(PWD)){
					//validate passswrd
					if (check.isString(PWD) && PWD.length > 0) {
						collectionPassword = PWD;
					}else{

						callbacks.onFailure(11);
						return 11;
					}
				}
				
				if (check.isValidAdapter(options.adapter)) {
					collectionAdapter = options.adapter;
				}
			}

			if (check.isAlphaNumeric(name)) {
				collectionName = name;
			} else {

				callbacks.onFailure(4);
				return 4;
			}

			//searchFields
			if (check.isSimpleObject(searchFields) && !check.containsDuplicateKeys(searchFields)) {
				//Make lowercase
				for (key in searchFields) {
					if (hasOwn.call(searchFields, key)) {
						collectionsearchFields[key.toLocaleLowerCase()] = searchFields[key];
					}
				}

			} else {
				callbacks.onFailure(6);
				return 6;
			}

			//Additional search fields
			if (!check.isUndefined(options.additionalSearchFields)) { //it's an optional parameter

				if (check.isSimpleObject(options.additionalSearchFields) &&
					!check.containsDuplicateKeys(options.additionalSearchFields)) {
					//Make lowercase
					for (key in options.additionalSearchFields) {
						if (hasOwn.call(options.additionalSearchFields, key)) {
							collectionAdditionalSearchFields[key.toLocaleLowerCase()] = options.additionalSearchFields[key];
						}
					}

				} else {
					callbacks.onFailure(6);
					return 6;
				}

				if (check.countKeys(collectionAdditionalSearchFields) + check.countKeys(collectionsearchFields) !==
					check.countKeys(check.mergeObjects(collectionAdditionalSearchFields, collectionsearchFields))) {
					callbacks.onFailure(22);
					return 22;
				}
			}

			instance = new JSONStoreInstance(collectionName, collectionsearchFields, collectionAdapter, collectionAdditionalSearchFields);

			collectionOptions = {dropCollection: dropCollection, collectionPassword: collectionPassword,
					additionalSearchFields: collectionAdditionalSearchFields,
					onSuccess: callbacks.onSuccess, onFailure: callbacks.onFailure};


			checkKeysCB = function (result) {
				if (result === 1) {
					//All the keys are in the keychain, just need to pass user PW
					db.provision(collectionName, collectionsearchFields, collectionOptions);
				} else {
					//Need to gen keys and store in keychain
					var salt = '' + eoc.random(),
						sr = '';

					eoc.secureRandom(function(response) {
						if (response == eoc.ERROR_SECURE_RANDOM_GENERATOR_UNAVAILABLE) {
							callbacks.onFailure(16);
							return 16;
						}
						sr =  '' + response;
						db.storeDPK(sr, collectionPassword, salt, {
							onSuccess : function(result){
								db.provision(collectionName, collectionsearchFields, collectionOptions);
							}
						});
					});
				}
			};

			//ANDROID-FIX: Provision blocks and returns before 'return instance'
			setTimeout(function () {
				if(collectionPassword.length > 0){
					//User specified a pw
					//If the user specified a password, we need to see if all of the keys are provisioned.
					db.isKeyGenRequired({onSuccess: checkKeysCB});

				}else{
					//Create the tables with the searchFields the user provided
					db.provision(collectionName, collectionsearchFields, collectionOptions);
				}
			}, 1);

			return instance;
		},


		/**
			See _provisionCollection, the code below is used to deal with load = true.
			@private
		*/
		_initCollection = function (name, searchFields, options) {

			var instance;

			if (check.isObject(options) && check.isBoolean(options.load) &&
				options.load && check.isObject(options.adapter) &&
				check.isValidLoadObject(options.adapter.load)) {

				var userOnSuccessCallback = function () {},
					userOnFailureCallback = function () {},

					provisionSuccessData = 0,

					onLoadSuccessCallback = function (data) {

						userOnSuccessCallback(provisionSuccessData);

					},

					onCountSuccessCallback = function (count) {

						if (count === 0) {
							instance.load({onFailure: userOnFailureCallback, onSuccess: onLoadSuccessCallback});
						} else {
							userOnSuccessCallback(provisionSuccessData);
						}

					},

					onProvisionSuccessCallback = function (data) {

						provisionSuccessData = data;

						instance.count({onFailure: userOnFailureCallback, onSuccess: onCountSuccessCallback});

					};

				if(check.isFunction(options.onSuccess)){
					userOnSuccessCallback = options.onSuccess;
				}

				if(check.isFunction(options.onFailure)){
					userOnFailureCallback = options.onFailure;
				}

				options.onSuccess = onProvisionSuccessCallback;
				options.onFailure = userOnFailureCallback;

				instance = _provisionCollection(name, searchFields, options);


			} else {

				instance = _provisionCollection(name, searchFields, options);
			}

			return instance;

		};

	PushInstance.prototype =  {

		/**
			Invoke the adapter linked to the collection.
			@private
		*/
		invokeProcedure : function () {

			var collectionName = this.pushData.name,
				onSuccess = this.pushData.onSuccess,
				onFailure = this.pushData.onFailure,
				collectionAdapter = this.pushData.adapter,
				collectionDocument = this.pushData.data[constant.JSON_DATA_KEY],
				documentId = this.pushData.data[constant.ID_KEY],
				documentOperation = this.pushData.data[constant.OPERATION_KEY],
				documentIdAndOperationObj = {},

				adapterSuccess = function (data) {

					documentIdAndOperationObj[constant.ID_KEY] = documentId;
					documentIdAndOperationObj[constant.OPERATION_KEY] = documentOperation;

					if(check.isUndefined(collectionAdapter.accept) || collectionAdapter.accept(data, collectionDocument)){

						db.markpushed(collectionName, documentIdAndOperationObj,
							{onSuccess: onSuccess, onFailure : onFailure});

					}else{

						adapterFailure(data);
					}
				},

				adapterFailure = function (data) {

					onFailure(12, data);
				},

				invocationData = {
					adapter : collectionAdapter.name,
					procedure : collectionAdapter[documentOperation],
					parameters : [JSON.stringify(collectionDocument)]
				};


			if (check.isString(invocationData.procedure) && invocationData.procedure.length > 0 ) {

				WL.Client.invokeProcedure(invocationData, {
					onSuccess : adapterSuccess,
					onFailure : adapterFailure
				});

			} else {
				//throw error
				onFailure(20, documentOperation);
			}
		}
	};

	JSONStoreInstance.prototype = {

		/**
			Returns documents stored in the collection that match the query.
			@method find
			@param query {Query}
			@param [options] {Options}
			@return {onSuccess} An Array of Documents or an Empty Array if no matches,
			 `onFailure` an error code.

			@example
			
				//To find all documents use the following query: `var query = {}`.
				var query = {fn: 'carlos'};
				
				var win =	function (data) {
								console.log(data);
									=> [{_id : 0, json: {fn : 'carlos', age : 99, active : false}}];
							};
				
				var options = {onSuccess: win, onFailure: fail};

				collection.find(query, options);
		*/
		find : function (query, options) {

			__find(this.name, query, this.searchFields, this.additionalSearchFields, options);

		},

		/**
			Returns one or more documents that match the id or ids supplied to the function.
			@method findById
			@param id {Integer or Array of Integers} Integer values must be greater than 0.
			@param [options] {Options}
			@return {onSuccess} An Array of Documents or an Empty Array if no matches,
				`onFailure` an error code.

			@example
			
				var id = 1; 
				//You can also pass id = [1,2,3] if you want the first 3 documents in the JSONStore
				
				var win =	function (data) {
								console.log(data);
									=> [{_id : 1, json: {fn : 'carlos', age : 99, active : false}}];
							};
				
				var options = {onSuccess: win, onFailure: fail};

				collection.find(id, options);
		*/
	
		findById : function (id, options) {

			var callbacks = __generateCallbacks(options, 'findById', this.name),
				callNative = false,
				param = [],
				validArrayOfInts = function (arr) {
					for (var i = 0, len = id.length; i < len; i++ ) {

						if (!check.isInt(id[i])) {
							return false;
						}

					}
					return true;
				};

			//Check for valid values
			if (check.isInt(id)) {
				callNative = true;
				param = [id];
			}

			if(Array.isArray(id) && id.length > 0) {
				callNative = validArrayOfInts(id);
				param = id;
			}

			//Decide if we want to call native or return an error
			if (callNative) {
				db.findById(this.name, param, options);
			} else {
				callbacks.onFailure(27);
			}

		},

		/**
			Returns all the documents stored in the JSON Store.
			@method findAll
			@param [options] {Options}
			@return {onSuccess} An Array of Documents or an Empty Array if the collection is empty,
				`onFailure` an error code.

			@example
				
				var win =	function (data) {
								console.log(data);
									=> [{_id : 0, json: {fn : 'carlos', age : 99, active : false}}];
							};
				
				var options = {onSuccess: win, onFailure: fail};

				collection.findAll(options);
		*/
		findAll : function (options) {

			__find(this.name, {}, this.searchFields, this.additionalSearchFields, options);

		},

		/**
			Used to initially load JSON objects into a collection as Documents.
			Stores data marked as pushed, see `add` to store Documents as unpushed.
			@method store
			@param data {Object or Array of Objects} Data to be added the collection.
			@param [options] {Options} Additional options: 'additionalSearchFields : {}'
			@return {onSuccess} Integer with the amount of data stored, `onFailure` an error code.

			@example

					//Store an Object
					var data = {fn: 'carlos', age: 99, active: false};
					collection.store(data, options);

					//Store Multiple Objects
					var dataArray = [	{fn: 'Tim', age: 88, active: true},
										{fn: 'Jeff', age: 77, active: false} ];
					collection.store(dataArray, options);
					
					//Store Multuple Objects without the Array
					var data1 = dataArray[0];
					var data2 = dataArray[1];
					collection.store(data1, {onSuccess: function(){
						collection.store(data2, {onSuccess: win});
					}});
		*/
		store : function (data, options) {

			options = options || {};

			if (check.isUndefined(options.isAdd)) {
				options.isAdd = false;
			}

			__store(this.name, this.searchFields, this.additionalSearchFields, data, options);

		},

		/**
			Adds data to a collection, creating a new Document(s). Will require push.
			@method add
			@param data {Object or Array of Objects} Data to be added the collection.
			@param [options] {Options} Additional options: 'additionalSearchFields : {}'
			@return {onSuccess} Integer with the amount of data stored, ``onFailure` an error code.

			@example
					var data = {fn: 'jeremy', age: 88, active: true};
					collection.add(data, options);
		*/
		add : function (data, options) {

			options = options || {};

			if (check.isUndefined(options.isAdd)) {
				options.isAdd = true;
			}

			__store(this.name, this.searchFields, this.additionalSearchFields, data, options);

			//db.store(this.name, data, options);
		},

		/**
			Replaces a Document with another Document.
			@method replace
			@param doc {Document or Array of Documents}
			@param [options] {Options}
			@return {onSuccess} Integer with the amount of Documents replaced, `onFailure` an error code.

			@example

				var doc = {_id : 0, json: {fn : 'carlos', age : 99, active : false}};

				doc.json.age = 100;
		
				collection.replace(doc, options);
				//or
				collection.replace([doc], options);
		*/
		replace : function (doc, options) {

			options = options || {};

			if (check.isUndefined(options.isRefresh)){
				options.isRefresh = false;
			}

			__replace(this.name, doc, options);
		},

		/**
			Replaces a Document with another Document just like `replace`, but it does
				not mark that change to push to the back end via an adapter
			@method refresh
			@param doc {Document or Array of Documents}
			@param [options] {Options}
			@return {onSuccess} Integer with the amount of Documents replaced, `onFailure` an error code.

			@example

				var doc = {_id : 0, json: {fn : 'carlos', age : 99, active : false}};

				doc.json.age = 100;
		
				collection.refresh(doc, options);
				//or
				collection.refresh([doc], options);
		*/
		refresh : function (doc, options) {

			options = options || {};

			if (check.isUndefined(options.isRefresh)) {
				options.isRefresh = true;
			}

			__replace(this.name, doc, options);
		},

		/**
			Marks 1 or more Documents as removed from a collection. Removed Documents are not returned
			by `find` or `count`. The actual Documents are not deleted from the collection until
			succesfully pushed.
			@method remove
			@param doc {Document or Array of Documents or Query or Integer} The Integer is an `_id`.
			@param [options] {Options}
			@return {onSuccess} Integer with the amount of documents removed, `onFailure` an error code.

			@example
					var doc = {_id : 0, json: {fn : 'carlos', age : 99, active : false}};

					collection.remove(doc, options); //Remove a Document
					//or
					collection.remove([doc], options); //Remove an Array of Documents
					//or
					collection.remove(1, options); //Remove by _id
					//or
					collection.remove({fn: 'carlos'}, options); //Remove all Documents that match {fn: 'carlos'}
		*/
		remove : function (doc, options) {

			options = options || {};

			if (check.isUndefined(options.isErase)) {
				options.isErase = false;
			}

			__remove(this.name, doc, options);

		},

		/**
			Same as `remove` but will really remove the document from the internal storage instead
			of marking it for removal and then really removing it when you call `push` or `pushSelected`
			with that specific document.
			@method erase
			@param doc {Document or Array of Documents or Query or Integer} The Integer is an `_id`.
			@param [options] {Options}
			@return {onSuccess} Integer with the amount of documents removed, `onFailure` an error code.

			@example
					var doc = {_id : 0, json: {fn : 'carlos', age : 99, active : false}};

					collection.erase(doc, options); //Remove a Document
					//or
					collection.erase([doc], options); //Remove an Array of Documents
					//or
					collection.erase(1, options); //Remove by _id
					//or
					collection.erase({fn: 'carlos'}, options); //Remove all Documents that match {fn: 'carlos'}
		*/
		erase : function (doc, options) {

			options = options || {};

			if (check.isUndefined(options.isErase)) {
				options.isErase = true;
			}

			__remove(this.name, doc, options);

		},

		/**
			Push the collection with an Adapter. For every Document marked requiring push
			call the corresponding Adapter procedure linked to the collection. The Documents
			will be processed on the client by order of their last modification date.
			@method push
			@param [options] {Options}
			@return {onSuccess} called if it was succesful or there where you records to push (you can check the number of 
				records to push with the `getPushRequired` function), `onFailure` returns an error code. The success callbacks
				are called once per document. If you try to push 10 documents, your success callback may get called 9 times and
				the failure callback once.

			@example

				collection.push(options);
		*/
		push : function (options) {

			__push(options, this.name, this.adapter);
		},

		/**
			Pushes only the selected Documents. See `push`. The Document passed will not be
			sent to the Adapter (pushed) if it is not marked unpushed.
			@method pushSelected
			@param doc {Document or Array of Documents}
			@param [options] {Options}
			@return {see push}

			@example
				
				var doc = {_id : 0, json: {fn : 'carlos', age : 99, active : false}};

				collection.pushSelected(doc, options);
				collection.pushSelected([doc], options);
		*/
		pushSelected : function (doc, options) {

			__push(options, this.name, this.adapter, doc);
		},

		/**
			Determines if a Document is pushed.
			@method isPushRequired
			@param doc {Document or Integer} The Integer is an `_id`.
			@param [options] {Options}
			@return {onSuccess} `true` if it is pushed and `false` otherwise, `onFailure` an error code.

			@example

				var doc = {_id : 0, json: {fn : 'carlos', age : 99, active : false}};

				var win =	function (data) {
						console.log(data);
							=> false
					};

				var options = {onSuccess: win, onFailure: fail};

				collection.isPushRequired(doc, options);
				//or
				collection.isPushRequired(0, options);

		*/
		isPushRequired : function (doc, options) {

			var arrayOfQueries = __getQueryArray(doc, true),
				callbacks = __generateCallbacks(options, 'isPushRequired', this.name);

			if(__validDataExists(arrayOfQueries, callbacks)){
				db.isPushRequired(this.name, arrayOfQueries[0], callbacks);
			}

		},

		/**
			Get all the Documents that are unpushed.
			@method getPushRequired
			@param [options] {Options}
			@return {onSuccess} Array of Documents that are not pushed, `onFailure` an error code.

			@example

				var win =	function (data) {
								console.log(data);
									=> [ {_id: 1, json: {fn: 'jeremy', age: 88, active: true} }]
							};

				var options = {onSuccess: win, onFailure: fail};

				collection.getPushRequired(options)
		*/
		getPushRequired : function (options) {

			var callbacks = __generateCallbacks(options, 'getPushRequired', this.name);

			db.allDirty(this.name, [], callbacks);
		},

		/**
			Returns the number of documents not pushed. It includes Documents marked as 'removed'.
			@method pushRequiredCount
			@param [options] {Options}
			@return {onSuccess} returns the number of Documents are only changed locally, `onFailure` an error code.

			@example
				
				//Assumes that 1 document has been modified in the collection.
				var win =	function (data) {
								console.log(data);
									=> 1
							};
							
				var options = {onSuccess: win, onFailure: fail};

				collection.pushRequiredCount(options);
				
		*/
		pushRequiredCount: function (options) {

			var callbacks = __generateCallbacks(options, 'pushRequiredCount', this.name);

			db.pushRequiredCount(this.name, callbacks);
		},

		/**
			Number of documents in the collection, not including those marked 'removed'.
			@method count
			@param [options] {Options}
			@return {onSuccess} Number of documents in the collection, `onFailure` an error code.

			@example
				var win =	function (data) {
								console.log(data);
									=> 5
							};
							
				var options = {onSuccess: win, onFailure: fail};

				collection(options, options);

		*/
		count : function (options) {

			var callbacks = __generateCallbacks(options, 'count', this.name);

			db.count(this.name, callbacks);
		},

		/**
			Removes the collection locally, to use a collection with the same `name`
				you must call `WL.JSONStore.initCollection`. Will not call push before the operation.
				In order to remove specific documents see the `remove` function.
			@method removeCollection
			@param [options] {Options}
			@return {onSuccess} Boolean if the operation succeded, `onFailure` an error code.

			@example

				collection.removeCollection(options);
		*/
		removeCollection : function (options) {

			var callbacks = __generateCallbacks(options, 'removeCollection', this.name);

			db.removeCollection(this.name, callbacks);
		},
            
		/**
			Add a new function to a collection's protoype.
			@method enhance
			@param name {string} - Function name.
			@param func {function} - Function to add.
			@param [options] {Options}
			@return {Integer} 0 if success or an error code.

			@example

				collection.enhance('getName',	function () {
													return this.name;
												});
				
				// Create a custom function that returns the name of the collection
				var name = collection.getName();

				console.log(name);
					=> 'customers'
		*/
		enhance : function (name, func, options) {

			if (!check.isString(name)) {

				return 2;

			} else if (!check.isFunction(func)) {

				return 3;

			} else if (typeof JSONStoreInstance.prototype[name] !== 'function') {

				JSONStoreInstance.prototype[name] = func ;
				return 0;

			} else {

				return 14;
			}
		},

		/**
			Gets data defined in load portion of the adapter.
			@method load
			@param [options] {Options}
			@return {onSuccess} number of documents stored, `onFailure` an error code.

			@example

				customers.load(options)
		*/
		load : function (options) {

			var callbacks = __generateCallbacks(options, 'load', this.name),
				collectionAdapter = this.adapter,
				collectionName = this.name,
				invocationData = {},
				resultData,
				input,
				myKey,
				myPath,
				invokeProcedureSuccessCallback = function (response) {

					input = collectionAdapter.load.key.split('.');

					if (input.length > 1) {

						myKey = input.pop(),
						myPath = 'invocationResult.' + input.join('.');
						resultData = jspath.get(response, myKey, myPath);
					
					} else {

						resultData = [response.invocationResult[collectionAdapter.load.key]];
					}

					if (check.isObject(resultData, true) &&
						resultData.length > 0 &&
						!check.isUndefined(resultData[0])) {

						db.store(collectionName, resultData[0], callbacks);
					} else {

						callbacks.onFailure(19, response);
					}
				},
				invokeProcedureFailureCallback = function (data) {
					callbacks.onFailure(17, data);
				};

			if (check.isValidAdapter(collectionAdapter) &&
				check.isValidLoadObject(collectionAdapter.load)) {

				invocationData = {
					adapter : collectionAdapter.name,
					procedure : collectionAdapter.load.procedure,
					parameters : collectionAdapter.load.params
				};
						
				WL.Client.invokeProcedure(invocationData, {
					onSuccess : invokeProcedureSuccessCallback,
					onFailure : invokeProcedureFailureCallback
				});

			} else {
				callbacks.onFailure(18);
			}
		}

	};

	//public API
	return {
		initCollection : _initCollection,
		usePassword : _usePassword,
		clearPassword : _clearPassword,
		closeAll : _closeAll,
		documentify : _documentify,
		changePassword : _changePassword,
		destroy : _destroy,
		getErrorMessage : _getErrorMessage
	};

}()); //WL.JSONStore

}//end if that checks if the device is running iOS or Android