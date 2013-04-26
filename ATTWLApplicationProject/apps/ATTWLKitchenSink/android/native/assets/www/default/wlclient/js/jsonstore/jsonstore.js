
/* JavaScript content from wlclient/js/jsonstore/jsonstore.js in Common Resources */
/*
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
 * JSONStore is only supported in iOS (iPhone and iPad) and Android.
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
Provides constants
@private
**/
WL.constant = (function(){

	//public api
	return {
		ID_KEY : '_id',
		JSON_DATA_KEY : 'json',
		OPERATION_KEY : '_operation',
		DEFAULT_USERNAME : 'jsonstore',
		DEFAULT_KEYCHAIN_USERNAME: 'jsonstorekey',
		DEFAULT_ANDROID_KEYCHAIN_ID: 'dpk'
	};

})(); //end WL.constant

WL.namespace('WL.check');
/**
Provides some validation methods
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

	/** Checks if a string is alphanumeric.
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
	var __isObject = function (input, obj) {

		obj = obj || {};

		var isArrayValidType = obj.isArrayValid || false;

		if (typeof input === 'undefined' || typeof input !== 'object' || input === null) {
			return false;
		}

		if (isArray(input) && !isArrayValidType) {
			return false;
		}

		return true;
	};

	/** Checks if an object does not contain other objects or arrays.
		@private
	*/
	var __isSimpleObject = function (obj) {

		var key,
			hasOwn = Object.prototype.hasOwnProperty;

		if (!__isObject(obj)) {
			return false;
		}

		for (key in obj) {
			if (hasOwn.call(obj, key) && __isObject(obj[key], {isArrayValid: true}) || obj[key] === null) {
				return false;
			}
		}
		return true;
	};

	/** Private function to check if the array contains only objects and arrays.
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
		@private
	*/
	var __isValidAdapter = function (obj) {

		return __isObject(obj) &&
		typeof obj.name === 'string' &&
		obj.name.length > 0;
	};

	/** Checks if the input (num) is an integer.
		@private
	*/
	var __isInt = function (num) {

		return (typeof num === 'number' && parseFloat(num) == parseInt(num, 10) && !isNaN(num));
	};

	/** Checks if the input (arrray) are all integers.
		@private
	*/
	var __isArrayOfInts = function (intArr) {
		var i,
			len;

		if (!isArray(intArr) || intArr.length < 1) {
			return false;
		}

		for (i = 0, len = intArr.length; i<len; i++) {
			if (!__isInt(intArr[i])) {
				return false;
			}
		}

		return true;
	};

	/** Checks if the input (arrray) are all documents.
		@private
	*/
	var __isArrayOfDocuments = function (docArr) {
		var i,
			len;

		if (!isArray(docArr) || docArr.length < 1) {
			return false;
		}

		for (i = 0, len = docArr.length; i<len; i++) {
			if (!__isValidDocument(docArr[i])) {
				return false;
			}
		}

		return true;
	};

	/** Checks if the object passed is a valid document.
		Valid object: {_id: 0, json: {...}}
		@private
	*/
	var __isValidDocument = function (doc) {

		return (__isObject(doc) &&
			__isInt(Number(doc[constant.ID_KEY])) &&
			__isObject(doc[constant.JSON_DATA_KEY]));
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

	/** Checks if a reserved word is used
		@private
	*/
	var __isReservedWord = function (username) {

		if (!__isString(username)) {
			return false;
		}

		var usr = username.toLowerCase();

		return (usr.indexOf(constant.DEFAULT_USERNAME) === 0 ||
				usr.indexOf(constant.DEFAULT_KEYCHAIN_USERNAME) === 0 ||
				usr.indexOf(constant.DEFAULT_ANDROID_KEYCHAIN_ID) === 0);
	};

	/** Checks if the search fields object has valid types
		@private
	*/
	__isValidSchemaObject = function (obj) {

		var key,
			current,
			hasOwn = Object.prototype.hasOwnProperty,
			validTypes = ['string', 'integer', 'boolean', 'number'];

		for(key in obj) {

			if(hasOwn.call(obj, key) && validTypes.indexOf(obj[key]) === -1) {
				return false;
			}
		}
		return true;
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
		mergeObjects : __mergeObjects,
		isReservedWord : __isReservedWord,
		isArrayOfInts : __isArrayOfInts,
		isValidSchemaObject : __isValidSchemaObject
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

		ErrorObject = function (obj) {
			this.src = obj.src || '';
			this.err = obj.err || -100;
			this.msg = WL.JSONStore.getErrorMessage(this.err);
			this.col = obj.col || '';
			this.usr = obj.usr || WL.JSONStore.constant.DEFAULT_USERNAME;
			this.doc = obj.doc || {};
			this.res = obj.res || {};
		};

		ErrorObject.prototype.toString = function () {
			return JSON.stringify(this);
		};

		//Private Members
		var _generate = function (options, events, src, collectionName, username, deferred) {

			var success,
				failure;

			success = function(data, more) {

				//Push is a special case we handle separately, search for __push
				if (!check.isUndefined(deferred) && 'push'.indexOf(src) < 0) {
					deferred.resolve(data, more);
				}

				//Send the WL/JSONSTORE/SUCCESS event
				$(document.body).trigger(events.success, [data, src, collectionName, more, username]);

				//Call the user provided callback if there is one
				if (check.isObject(options) && check.isFunction(options.onSuccess)) {
					options.onSuccess(data, more);
				}
			},

			failure = function(data, more) {

				var errorObject = {
					src: src,
					col: collectionName,
					usr: username
				};

				if (check.isInt(data)) {
					errorObject.err = data;
					errorObject.msg = WL.JSONStore.getErrorMessage(data);
				}else{
					//We got a document back instead of an error code
					errorObject.doc = data;
					errorObject.err = -11;
					errorObject.msg = WL.JSONStore.getErrorMessage(-11);
				}

				//Resolve with an error object
				if (!check.isUndefined(deferred)) {
					deferred.reject(new ErrorObject(errorObject));
				}

				//Send the WL/JSONSTORE/FAILURE event
				$(document.body).trigger(events.failure, [data, src, collectionName, more, username]);

				//Call the user provided callback if there is one
				if (check.isObject(options) && check.isFunction(options.onFailure)) {
					options.onFailure(data, more);
				}
			};

			return {onSuccess: success, onFailure: failure};
		};

	//public api
	return {
		generate : _generate,
		ErrorObject : ErrorObject
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

				if (check.isObject(current_value, {isArrayValid: true}) && !check.isUndefined(current_value)) {

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

			if (!check.isObject(data, {isArrayValid: true}) ||
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

		__callNative([collection, JSON.stringify(query), JSON.stringify(options)], options, STORAGE_PLUGIN, FIND_METHOD);
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

	_storeSalt = function (salt, options) {

		__callNative([salt], options, STORAGE_PLUGIN, STORE_SALT_METHOD);
	};

	_storeDPK = function (secRand, password, salt, username, options) {
		__callNative([secRand, password, salt, username], options, STORAGE_PLUGIN, STORE_DPK_METHOD);
		password = null;
	};

	_changePW = function (oldPw, newPw, username, options) {

		__callNative([oldPw, newPw, username], options, STORAGE_PLUGIN, CHANGE_PW_METHOD);
		oldPw = null;
		newPw = null;
	};

	_isKeyGenRequired = function (username, options) {

		__callNative([username], options, STORAGE_PLUGIN, IS_KEY_GEN_REQ_METHOD);
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
		storeSalt : _storeSalt,
		storeDPK : _storeDPK,
		isKeyGenRequired: _isKeyGenRequired,
		changePassword: _changePW,
		closeAll : _closeDatabase,
		destroy : _destroy
	};

}());//WL.db

WL.namespace('WL.JSONStore');
/**
Provides the API for storing JSON data locally, it may be linked to an adapter for data syncronization.
The JSONStore feature is only available on iOS and Android.

##Definitions

* **WL.JSONStore** : Creates JSON Document collections via the `init` method.

* **Collection** : A group of related documents.

* **Document** : A JavaScript object that has an `_id` key that holds an integer
	and a `json` key that holds a JavaScript object. Document is an internal structure
	generated when you `add` or data, `_id` should not be modified.

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
	marked as pushed in local storage. `timeout` is an optional parameter that if specified will
	pass a value (in millis) to the WL.Client.invokeProcedure function during push operations.
	See the WL.Client.invokeProcedure API documentation for more details. You may optionally include a 'load' key with an
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
			},
			timeout: 30000
			};

* **Options** : JavaScript object that contains additional options you want to pass to a specific method.
	The onSuccess and onFailure keys you pass via the options object have been deprecated in favor of Promises.
	These success and failure callbacks are specific to the function you're calling, for example
	the `onSuccess` function passed to `initCollection` will only be called when `initCollection` is successful.

		var win =	function (data) { };
		var fail =	function (data) { };
		var options = {onSuccess: win, onFailure: fail};

* **Promises** : All the asynchronous functions in the API currently support jQuery compatible promises.
	A promise object is returned after a JSONStore asynchronous operation is called (find, add, remove, etc.).
	Promises have the following methods:

		.then(success callbackFunction, failure callbackFunction);
		.done(success callback);
		.fail(failure callback);

	See jQuery's API doc for more details: http://api.jquery.com/promise/
	The failure callback, passed as either the second parameter of `.then` or the first parameter of `.fail` will
	return an error object containing  some of these keys: source, error code, message, collection name, user name,
	document and response from the server. A failure will trickle down until it finds the nearest error handler.
	You may use WLJQ.when(promise1, promise2).then(success callback, failure callback) if you need promise1
	and promise2 to finish before calling the callbacks. The deprecated `WL.JSONStore.initCollection` is a special case,
	you need to call `.promise` on the collection instance.

		var collections = {
			customers : {
				searchFields : { fn: 'string' }
			}
		};

		WL.JSONStore.init(collections)

		.then(function () {
			//collection is initialized at this point
			return WL.JSONStore.get('customers').add({name: 'carlos'});
		})
		.then(function (res) {
			//res = 1, since one document was added to the collection
			return WL.JSONStore.get('customers').count();
		})
		.done(function (res) {
			//res = 1, since count returns the total number of documents in the collection
		})
		.fail(function (obj) {
			WL.Logger.debug(obj.toString()); //obj may contain some of these keys:
			//obj.src = operation that failed (eg. 'add', 'count', etc.)
			//obj.err = error code (eg. -50)
			//obj.msg = error code message ('PERSISTENT_STORAGE_FAILURE')
			//obj.col = collection name (eg. 'collection')
			//obj.usr = username (eg. 'jsonstore')
			//obj.doc = document (eg. {_id: 1, jsonstore: {name: 'carlos'}})
			//obj.res = response from the server
		});

* **Events** : You can listen to events and capture succesful and failure status codes and data.
	The following assumes jQuery >1.7 or using WLJQ.

			$(document.body).on('WL/JSONSTORE/SUCCESS', function(evt, data, src, collectionName, more, username){
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
		//see the documentation for init, add, and find
		//for complete examples of those functions.

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

		var orderCollection = WL.JSONStore.init({
			orders: {
				searchFields: searchFields,
				additionalSearchFields : addSearchFields
			}
		});

		//call this after init finishes
		orderCollection.store(orders, {additionalSearchFields : { customerId: 'abc123'} }, <store options>);

		//call this after init finishes
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

		-100 = "UNKNOWN_FAILURE";
		-50 = "PERSISTENT_STORE_NOT_OPEN";
		-40 = "FIPS_ENABLEMENT_FAILURE";
		-12 = "INVALID_SEARCH_FIELD_TYPES";
		-11 = "OPERATION_FAILED_ON_SPECIFIC_DOCUMENT";
		-10 = "ACCEPT_CONDITION_FAILED";
		-9 = "OFFSET_WITHOUT_LIMIT";
		-8 = "INVALID_LIMIT_OR_OFFSET";
		-7 = "INVALID_USERNAME";
		-6 = "USERNAME_MISMATCH_DETECTED";
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

JSONStore can be used to create collections of data and optionally linked to an adapter. When tied to an adapter,
the API supports a convention of tying the various sync operations (pushing to server) based on the action
the user can perform on the local collection in JSONStore.

* Decide if the collections as part of JSONStore need to be encrypted. If there is a requirement to secure
the data at rest, send a password via the options object when you call `WL.JSONStore.init`.

* If you need multiple stores, you should send a username via the options object when you call `WL.JSONStore.init`.

* Start with defining the collections and then initialize them with `WL.JSONStore.init`. This includes defining adapter configuration,
collection name and the searchfields options.

* After you initialize your collections you can get them with `WL.JSONStore.get('collection-name') and it will return the right JSONStoreInstance.`

* You can load data from an adapter using `load` and store new data calling `add` on the JSONStoreInstance.

* Your users can then `find` and work with the collection locally ‐ `replace`, `add` or `remove` JSON Documents.

* Calling `push` on a JSONStoreInstance will send data that has changed to your backend via an adapter.
`isPushRequired`, `getPushRequired` and `pushRequiredCount` provide further information about the state of the collection.

* You can optionally close after using the collection by `closeAll` which will close the JSONStore and the collections in it.

@namespace WL
@class JSONStore
**/
WL.JSONStore = (function (jQuery) {
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
		$ = jQuery,
		ErrorObject = cb.ErrorObject,

		/**
			CONSTANTS / GLOBALS
			@private
		*/
		COLLECTIONS = {},
		EVENT_LABELS = {success: 'WL/JSONSTORE/SUCCESS', failure: 'WL/JSONSTORE/FAILURE'},
		ERROR = [],
		PWD,
		UNDEF;

		/**
			Error Codes - Make sure you update wl.geterrormessage.tests.js
				in QA/jsonstore if you change the error codes.
			@private
		*/
		ERROR[-100] = "UNKNOWN_FAILURE";
		ERROR[-50] = "PERSISTENT_STORE_NOT_OPEN";
		ERROR[-40] = "FIPS_ENABLEMENT_FAILURE";
		ERROR[-12] = "INVALID_SEARCH_FIELD_TYPES";
		ERROR[-11] = "OPERATION_FAILED_ON_SPECIFIC_DOCUMENT";
		ERROR[-10] = "ACCEPT_CONDITION_FAILED";
		ERROR[-9] = "OFFSET_WITHOUT_LIMIT";
		ERROR[-8] = "INVALID_LIMIT_OR_OFFSET";
		ERROR[-7] = "INVALID_USERNAME";
		ERROR[-6] = "USERNAME_MISMATCH_DETECTED";
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
		var JSONStoreInstance = function (name, searchFields, adapter, additionalSearchFields, username, deferred) {

			this.name = name;
			this.username = username;
			this.searchFields = searchFields;
			this.adapter = adapter;
			this.additionalSearchFields = additionalSearchFields || {};
			this.promise = deferred.promise();
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
			Handles failure cases (mostly for push), where we need to do the following:
			- Populate an error object
			- Call the failure callback
			- Async reject of the promise
			@private
			@param errObj {err: object, errCode: int, onFailure: function, deferred: object, doc: <doc object>}
				An object containing all the data we need
		*/
		__handleErrorReturn = function (errObj) {
			var e = errObj.err || {};

			e.err = errObj.errCode;
			e.msg = WL.JSONStore.getErrorMessage(errObj.errCode);

			setTimeout(function () {
				errObj.onFailure(e.err, e.doc);
				errObj.deferred.reject(new ErrorObject(e));
			}, 1);

			return errObj.deferred.promise();
		},

		/**
			Handles success cases (mostly for push), where we need to do the following:
			- Call the success callback
			- Async resolve of the promise
			@private
			@param errObj {retCode: < to callback, ret val>, retVal: <to promise, return val>, onSuccess: function, deferred: object}
				An object containing all the data we need
		*/
		__handleSuccessReturn = function (obj) {

			setTimeout(function () {
				obj.onSuccess(obj.retCode);
				obj.deferred.resolve(obj.retVal);
			}, 1);

			return obj.deferred.promise();
		},

		/**
			Log deprecated message
			@private
			@param old {string} old function
			@param alt {string} new function
		 */

		__logDeprecatedMessage = function (old, alt) {
			if (check.isObject(WL) && check.isObject(WL.Logger) && check.isFunction(WL.Logger.debug)) {
				WL.Logger.debug('[Deprecated] ' + old + ', use ' + alt+ ' instead.');
			}
		},

		/**
			Used to generated onSuccess and onFailure callbacks
			@private
			@param options {object} should contain `onSuccess` and `onFailure` keys
			@param src {string} name of the function that generated the callbacks (ie. find, replace, etc.)
			@return {object} An object that has an onSuccess and onFailure key.
		*/
		__generateCallbacks = function (options, src, collectionName, username, deferred) {

			return cb.generate(options, EVENT_LABELS, src, collectionName, username, deferred);
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

				setTimeout(function () {
					callbacks.onFailure(10);
				}, 1);

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
		__getQueryArray = function (doc, obj) {

			obj = obj || {};

			var idQueryObj = {},
				arrayOfQueries = [],
				i = 0,
				len = 0,
				idOnly = obj.idOnly || false,
				fakeDoc = obj.fakeDoc || false,
				idArray = obj.idArray || false,
				isQueryValid = obj.isQueryValid || false;

			if (check.isValidDocument(doc)) {

				if(idOnly){
					idQueryObj[constant.ID_KEY] = doc[constant.ID_KEY];
					arrayOfQueries.push(idQueryObj);
				}
				else {
					arrayOfQueries.push(doc);
				}

			} else if (isQueryValid && check.isSimpleObject(doc)) {

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

			} else if (idOnly && check.isInt(doc)) {

				idQueryObj[constant.ID_KEY] = doc;

				if (fakeDoc) { //Special case for push, we need this to pass validation
					idQueryObj[constant.JSON_DATA_KEY] = {};
				}

				arrayOfQueries.push(idQueryObj);

			} else if (idArray && check.isArrayOfInts(doc)) {
				len = doc.length;
				while (len--) {
					arrayOfQueries.push({_id: doc[len], json: {}});
				}
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
		__push = function (options, name, username, adapter, doc) {

			var deferred = $.Deferred(),
				collectionAdapter = adapter,
				collectionName = name,
				usr = username || '',
				errObject = {src: 'push', col: collectionName, usr: username},
				callbacks = __generateCallbacks(options, 'push', collectionName, usr, null),
				arrayOfObjects = [],
				arr = [],
				retarr = [],
				i = 0,
				len = 0,
				current = 0,
				inst = {},

				allDirtySuccess = function (data) {

					len = data.length;

					if (len < 1) {

						return __handleSuccessReturn({ retCode: 0,
							retVal: retarr,
							onSuccess: callbacks.onSuccess,
							deferred: deferred
						});

					}

					//Time to push the data Array we got back
					for (i = 0; i < len; i++) {

						inst = new PushInstance({name: collectionName, adapter: collectionAdapter, data: data[i],
							onSuccess: callbacks.onSuccess, onFailure: callbacks.onFailure, usr: usr});
						arr.push(inst.invokeProcedure({timeout: adapter.timeout}));
					}

					$.when.apply($, arr).then(function () {

						//-console.log('Push done!');

						var args = Array.prototype.slice.call(arguments);

						len = args.length;

						while (len--) {

							current = args[len];

							if (!check.isUndefined(current.err)) {
								//Error case handler
								retarr.push(current);
							}
						}

						deferred.resolve(retarr);
					});
				},

				allDirtyFailure = function (data) {
					// If we get the special "can not access the database manager" failure, then return that
					// otherwise, return we could not find dirty doc

					if (data === -50) {

						return __handleErrorReturn( {err : errObject,
							errCode : data,
							onFailure : callbacks.onFailure,
							deferred : deferred
						});

					} else {

						return __handleErrorReturn( {err : errObject,
							errCode : 8,
							onFailure : callbacks.onFailure,
							deferred : deferred
						});

					}

				};

			//Checks if collectionAdapter is an object with a key 'name' that has a string value.
			if (!check.isValidAdapter(collectionAdapter)) {

				return __handleErrorReturn( {err : errObject,
					errCode : 9,
					onFailure : callbacks.onFailure,
					deferred : deferred
				});
			}

			if (check.isUndefined(doc) && doc !== null ) {

				//Get ALL of the dirty records in the database
				db.allDirty(collectionName, [], {onSuccess: allDirtySuccess, onFailure: allDirtyFailure});

			} else if (check.isValidDocument(doc)) {

				db.allDirty(collectionName, [doc], {onSuccess: allDirtySuccess, onFailure: allDirtyFailure});

			} else if (check.isArrayOfObjects(doc)) {

				for (i = 0, len = doc.length ; i < len; i++) {

					if (check.isValidDocument(doc[i])) {

						arrayOfObjects.push(doc[i]);
					} else {

						errObject.data = doc[i];
						return __handleErrorReturn( {err : errObject,
							errCode : 7,
							doc: doc[i],
							onFailure : callbacks.onFailure,
							deferred : deferred
						});

					}
				}

				db.allDirty(collectionName, arrayOfObjects, {onSuccess: allDirtySuccess, onFailure: allDirtyFailure});

			} else {
				//Trying to call push with invalid data

				return __handleErrorReturn( {err : errObject,
					errCode : 10,
					onFailure : callbacks.onFailure,
					deferred : deferred
				});
			}

			return deferred.promise();
		},

		/**
			Holds the store and add logic.
			@private
			@param name {string} Collection name.
			@param searchFields {searchFields}
			@param data {Object} Data we want to store or add.
			@param [options] {Options}
		*/
		__store = function (name, username, searchFields, additionalSearchFields, data, options) {

			var deferred = $.Deferred(),
				arrayOfObjects = __getDataArray(data),
				usr = username || '',
				callbacks = __generateCallbacks(options, 'store', name, usr, deferred),
				additionalSearchFieldsObj = options.additionalSearchFields;

			callbacks.isAdd = options.isAdd;

			if (check.isSimpleObject(additionalSearchFieldsObj)) {

				if (check.isPartofSearchFields(additionalSearchFieldsObj, searchFields, additionalSearchFields)) {

					callbacks.additionalSearchFields = additionalSearchFieldsObj;
				} else {

					callbacks.onFailure(21);
				}
			}

			if(__validDataExists(arrayOfObjects, callbacks)){
				db.store(name, arrayOfObjects, callbacks);
			}

			return deferred.promise();
		},

		/**
			Holds the replace and refresh logic.
			@private
			@param name {string} Collection name.
			@param doc {Document} Document we want to replace or refresh.
			@param [options] {Options}
		*/
		__replace = function (name, username, doc, options) {

			var deferred = $.Deferred(),
				arrayOfQueries = __getQueryArray(doc, {idOnly: false, isQueryValid: false}),
				usr = username || '',
				callbacks = __generateCallbacks(options, 'replace', name, usr, deferred);

			callbacks.isRefresh = options.isRefresh;

			if(__validDataExists(arrayOfQueries, callbacks)){
				db.replace(name, arrayOfQueries, callbacks);
			}

			return deferred.promise();
		},

		/**
			Holds the remove and erase logic.
			@private
			@param name {string} Collection name.
			@param doc {Document} Document we want to remove or erase.
			@param [options] {Options}
		*/
		__remove = function (name, username, doc, options) {

			var deferred = $.Deferred(),
				arrayOfQueries = __getQueryArray(doc, {idOnly: true, isQueryValid: true}),
				usr = username || '',
				callbacks = __generateCallbacks(options, 'remove', name, usr, deferred);

				callbacks.isErase = options.isErase;

			if(__validDataExists(arrayOfQueries, callbacks)){
				db.remove(name, arrayOfQueries, callbacks);
			}

			return deferred.promise();
		},

		/**
			Holds the find and findAll logic.
			@private
			@param name {string} Collection name.
			@param query {Query} Object with a search key from the searchFields
				and a search term in the value. FindAll passes an empty object.
			@param [options] {Options}
		*/
		__find = function (name, username, query, searchFields, additionalSearchFields, options) {

			//Callbacks is an object that has onSuccess and onFailure callbacks
			var deferred = $.Deferred(),
				usr = username || '',
				i,
				len,
				callbacks = __generateCallbacks(options, 'find', name, usr, deferred);

			if (check.isObject(options)) {

				if (check.isUndefined(options.limit) && check.isInt(options.offset)) {
					return callbacks.onFailure(-9);
				}

				if (check.isInt(options.limit)) {

					if(options.limit < 0 ) {
						//If limit is negative, we can not have an offset
						if (!check.isUndefined(options.offset) ){
							return callbacks.onFailure(-8);
						}
					}

					callbacks.limit = options.limit;

					if (check.isInt(options.offset)) {

						if (options.offset < 0) {
							return callbacks.onFailure(-8);
						}

						callbacks.offset = options.offset;
					}
				}
			}

			if (check.isSimpleObject(query)) { //Arrays are not valid objects
				if (check.isPartofSearchFields(query, searchFields, additionalSearchFields)) {

					//(collection, [query], options)
					db.find(name, [query], callbacks);
				} else {
					callbacks.onFailure(22);
				}

			} else if (check.isArrayOfObjects(query)){
				for (i = 0, len = query.length ; i < len; i++) {
					if(! check.isPartofSearchFields(query[i], searchFields, additionalSearchFields)){
						callbacks.onFailure(22);
					}
				}
				//(collection, [query], options)
				db.find(name, query, callbacks);

			} else if (Array.isArray(query) && query.length < 1) {

				setTimeout(function(){
					callbacks.onSuccess([]);
				},1);

			} else {

				setTimeout(function(){
					callbacks.onFailure(6);
				},1);
			}

			return deferred.promise();
		},

		/**
			Creates a Document.
			@method documentify
			@static
			@param id {integer} ID for the Document
			@param data {object} JSON data for the Document
			@return {Document} or an error code.

			@example
				var doc = WL.JSONStore.documentify(1, {fn: 'carlos', age: 99, active: false});
				console.log(doc);
					=> {_id: 1, json:  {fn: 'carlos', age: 99, active: false}}
		*/
		_documentify = function (id, data) {

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
			This function is deprecated.

			**Deprecated, use WL.JSONStore.init**

			@deprecated
			@static
			@method usePassword
			@param pwd {String} String containing the password
			@returns {Boolean} true if the password is a valid string, false otherwise.

			@example
				var pwd = prompt('What is your password?');
				WL.JSONStore.usePassword(pwd);
		*/
		_usePassword = function (pwd) {

			__logDeprecatedMessage('WL.JSONStore.usePassword', 'WL.JSONStore.init');

			if (check.isString(pwd) && pwd.length > 0) {

				PWD = pwd;
				return true;

			} else {

				return false;

			}
		},

		/**
			Removes the password from memory.
			This function is deprecated.

			**Deprecated, use WL.JSONStore.init**

			@deprecated
			@method clearPassword
			@returns {Boolean} true if the password stored in memory was nulled, false if there was no password
				in memory or if the password was not nulled.

			@example
				WL.JSONStore.clearPassword();
		*/
		_clearPassword = function () {

			__logDeprecatedMessage('WL.JSONStore.clearPassword', 'WL.JSONStore.init');

			if(check.isUndefined(PWD)){
				return false;
			}else{
				PWD = null;
				return (PWD === null);
			}

		},

		/**
			Closes all the collections in JSONStore.  After a `closeAll`, each collection in the store will need to have
			`WL.JSONStore.init` called again before that collection can be used.  Note that if the
			collections in the persistent store are password protected, the password will need to be specified
			during init.
			@method closeAll
			@static
			@param [options] {Options}
			@return {Promise} promise

			@example

				WL.JSONStore.closeAll()
				.then(function () {
					//close all finished
				})
				.fail(function (errobject) {
					WL.Logger.debug(errobject.toString());
				});

				//Deprecated Example:

				var win = function () {
					console.log('SUCCESS');
				};

				var fail = function (err) {
					console.log('FAILURE');
				};

				WL.JSONStore.closeAll({onSuccess: win, onFailure: fail});
		*/
		_closeAll = function (options) {

			COLLECTIONS = {};

			var deferred = $.Deferred(),
				callbacks = __generateCallbacks(options, 'closeAll', '', '', deferred);

			db.closeAll(callbacks);

			return deferred.promise();
		},

		/**
			Changes the password for the internal storage. You must have a collection initialized before
			calling change password. Deprecated but currently supported function signature:
			`changePassword(oldPW, newPW, options)`, the user is assumed to be the default user: `jsonstore`.
			@method changePassword
			@static
			@param oldPW {string} The old password. Must be alphanumeric ([a-z, A-Z, 0-9]) with at least 1 character.
			@param newPW {string} The new password. Must be alphanumeric ([a-z, A-Z, 0-9]) with at least 1 character.
			@param user {string} The username. Must be an alphanumeric string ([a-z, A-Z, 0-9]) with length greater than 0.
				See WL.JSONStore.initCollection for more details.
			@param [options] {Options}
			@return {Promise} promise

			@example

				var oldPW = 'myOldPassword',
					newPW = 'newSecret',
					user = 'tim'; //optional, default 'jsonstore'
				WL.JSONStore.changePassword(oldPW, newPW, user)
				.then(function () {
					//the password has been changed
				})
				.fail(function (errobject) {
					WL.Logger.debug(errobject.toString());
				});

				//Deprecated Example:

				var win = function () {
					console.log('SUCCESS');
				};

				var fail = function (err) {
					console.log('FAILURE');
				};

				WL.JSONStore.changePassword(oldPW, newPW, user, {onSuccess: win, onFailure: fail});
		*/
		_changePassword = function (oldPW, newPW, user, options) {

			var deferred = $.Deferred();

			//Preserve legacy signature of changePassword(oldPW, newPW, options)
			var opts = {
					onSuccess: function () {},
					onFailure: function() {}
				},
				usr = WL.constant.DEFAULT_USERNAME,
				rc = 0;

			if (check.isString(user) && user.length > 0) {
				usr = user;

				if(!check.isAlphaNumeric(usr) || check.isReservedWord(usr)){
					rc = -7;
				}
			}

			if (check.isObject(user)) {
				opts.onSuccess = (typeof user.onSuccess === 'function') ? user.onSuccess : function () {};
				opts.onFailure = (typeof user.onFailure === 'function') ? user.onFailure : function () {};

			} else if(check.isObject(options)) {
				opts.onSuccess = (typeof options.onSuccess === 'function') ? options.onSuccess : function () {};
				opts.onFailure = (typeof options.onFailure === 'function') ? options.onFailure : function () {};
			}

			var callbacks = __generateCallbacks(opts, 'changePassword', '', usr, deferred);

			if (rc !== 0) {
				//Invalid username
				callbacks.onFailure(rc);
				return rc;
			}

			if (check.isString(oldPW) && oldPW.length > 0 &&
				check.isString(newPW) && newPW.length > 0) {

				db.changePassword(oldPW, newPW, usr, callbacks);

			} else {
				// Both Passwords must be an alphanumeric string of length greater than zero
				callbacks.onFailure(11);
			}

			return deferred.promise();
		},

		/**
			A complete data wipe for all users, destroys the internal storage and clears the secuirty artifacts.
			@method destroy
			@static
			@param [options] {Options}
			@return {Promise} promise

			@example

				WL.JSONStore.destroy()
				.then(function () {
					//all the stores and keys for decrypting the store are removed from disk
				})
				.fail(function (errobject) {
					WL.Logger.debug(errobject.toString());
				});

				//Deprecated Example:

				var win = function (status) {
					console.log('SUCCESS');
				};

				var fail = function (status) {
					console.log('FAILURE');
				};

				WL.JSONStore.destroy({onSuccess: win, onFailure: fail});
		*/
		_destroy = function (options) {

			COLLECTIONS = {};

			var deferred = $.Deferred(),
				callbacks = __generateCallbacks(options, 'destroy', '', '', deferred);

			db.destroy(callbacks);

			return deferred;
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
			Returns a JSONStoreInstance linked to a collection or undefined if the instance is not found.
			The instances are populated with `WL.JSONStore.init`. The following methods
			clear the instances stored: `WL.JSONStore.init` with `{clear: true}`,
			`WL.JSONStore.destroy` and `WL.JSONStore.closeAll`. Instances should not be altered,
			to update values call `WL.JSONStore.init` again.
			@method get
			@static
			@param collection {String} Name of the collection instance you want to get
			@return {JSONStoreInstance}

			@example
				WL.JSONStore.get('customers') //returns the JSONStoreInstance

				.findAll() //example of an operation performed on a JSONStoreInstance

				.then(function (res) {
					//res =>  array of all documents inside the 'customers' collection
				});

				.fail(function (errobject) {
					WL.Logger.debug(errobject.toString());
				});
		 */
		_get = function (collection) {

			return COLLECTIONS[collection];
		},

		/**
			Initializes a set of collections. See `WL.JSONStore.get` to retrieve JSONStoreInstances.
			There is minimal overhead in initializing all the collections when an application starts.
			Search fields are given a type hint and represent values we index on a specific collection.
			Refer to the `JSONStore Overview` for further details on the collections object,
			such as `additionalSearchfields`.

			You may call `init` multiple times with different collections and it will initialize without
			affecting collections that are already initialized. Passing `{clear: true}` clears the
			JSONStore instances without removing its contents from the store. For encrypted collection sets,
			the password is only required the first time `init` is called. See `WL.JSONStore.closeAll` and
			`WL.JSONStore.destroy` to logout the current user or destroy the contents of the store. See `removeCollection`
			to remove the contents of a specific collection from disk.

			@method init
			@static
			@param collections {Object} Collections that will be initialized. See example for format.
			@param [options] {Object} Username (string [a-z, A-Z, 0-9]), password (string) and clear (boolean).
			@return {Promise} The Promise is resolved when all collections have been initialized.
				If any collection fails to initialize the Promise will be rejected and no
				JSONStoreInstances will be available.

			@example

				var collections = {

					customers : {

						searchFields : {fn: 'string', age: 'integer', active: 'boolean'},

						//Adapter is optional:
						adapter : {	name: 'customerAdapter',
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
								}
					},

					orders: {
						searchFields : {name: 'string', stock: 'boolean'}
					}

				};

				var options = { //all optional
					username: 'carlos', //default: 'jsonstore'
					password: '123' //default: no encryption
				}

				WL.JSONStore.init(collections, options)

				.then(function (res) {
					//res =>  Mutable object of all the JSONStoreInstances
					return WL.JSONStore.get('customers').add({fn: 'carlos', age: 99, active: true});
				})

				.then(function (res) {
					//res => number of documents added to the collection
				})

				.fail(function (errobject) {
					WL.Logger.debug(errobject.toString());
				});
		 */

		_init = function (collections, options) {

			options = options || {};

			if(check.isBoolean(options.clear) && options.clear) {
				COLLECTIONS = {};
			}

			var arrp = [],
				def = $.Deferred(),
				col,
				first,
				firstPromise,
				otherPromise,
				errCode,
				returnError = function (err) {
					COLLECTIONS = {};
					def.reject(err);
				},
				setOptions = function (key) {
					options.adapter = collections[key].adapter;
					options.additionalSearchFields = collections[key].additionalSearchFields || {};
				},
				addToCollections = function (key, value) {
					COLLECTIONS[key] = value;
				},
				genSearchFields = function (key) {
					return collections[key].searchFields || {};
				},
				errorFoundReject = function (faultyPromise, col) {
					errCode = check.isInt(faultyPromise) ? faultyPromise : -100;

					def.reject(new ErrorObject({err: errCode,
								msg: WL.JSONStore.getErrorMessage(errCode),
								src: 'initCollection',
								usr: options.username || WL.constant.DEFAULT_USERNAME,
								col: col
					}));
				};

			if (check.countKeys(collections) < 1) {

				setTimeout(function () {
					def.resolve({});
				}, 1);

			} else {

				for (first in collections) { break; }

				setOptions(first);

				col = _provisionCollection(first, genSearchFields(first), options);

				addToCollections(first, col);

				firstPromise = col.promise;

				if (check.isUndefined(firstPromise)) {

					errorFoundReject(col, first);

				} else {

					firstPromise.then(function () {

						for (var name in collections) {

							if (first !== name) {
								setOptions(name);

								//The password was already used during the first init, we clear it here
								options.password = null;

								col = _provisionCollection(name, genSearchFields(name), options);
								otherPromise = col.promise;

								if (check.isUndefined(otherPromise)) {

									errorFoundReject(col, name);

								} else {
									arrp.push(col.promise);
									addToCollections(name, col);
								}
							}
						}

						$.when.apply(this, arrp)

						.done(function () {
							def.resolve(COLLECTIONS);
						})

						.fail(returnError);
					})

					.fail(returnError);
				}

			}

			return def;
		},

		/**
			Creates an new object to interact with a single collection. `initCollection` must be called sequentially,
			meaning the previous `initCollection` must finish before trying to call `initCollection` again.
			If local storage for the collection does not exist it is provisioned with the searchFields.
			Otherwise the searchFields will be validated against the searchFields used to originally
			provision the collection. If you're using usernames you must call WL.JSONStore.closeAll
			to 'logout' the current user, then you can call WL.JSONStore.initCollection with another username.
			The example below shows how to supply a username and a password, both are optional. If no username
			is passed, it will use the default one. You can not use the following default usernames: jsonstore, JSONStoreKey, dpk.

			**Deprecated, use WL.JSONStore.init**

			@deprecated
			@method initCollection
			@static
			@param name {string} Collection name.
			@param searchFields {searchFields}
			@param [options] {Options} Additionally you may link a collection to an Adapter. You can also pass
				load:true and it will check if the collection is empty and load data using the adapter you defined to get data.
				You may pass a username (alphanumeric strings only: [a-z, A-Z, 0-9]) and a password.
			@return {JSONStoreInstance} The collection will not be usable until the promise is resolved or the succesful callback is called.
				`onSuccess` called if succesful and `onFailure` called if it was unsuccesful with an error code.

			@example

				var name = 'customers';

				var searchFields = {	fn: 'string',
								age: 'integer',
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

				var options = {adapter: adapterDefinition};

				//[Optional] You may assign a username to the store:
				options.username = 'carlos';

				//[Optional] If you want encryption you need to supply a password:
				options.password = '12345';

				var c = WL.JSONStore.initCollection(name, searchFields, options);

				c.promise
				.then(function (res) {
					//res is 0 if a new collection was created, or 1 if an existing collection was opened
				})
				.fail(function (errobject) {
					WL.Logger.debug(errobject.toString());
				});


				//Deprecated Example:

				//Create success and failure callbacks
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

				//Add the success and failure callbacks to options
				var options = {adapter: adapterDefinition, onSuccess: win, onFailure: fail};

				var collection = WL.JSONStore.initCollection(name, searchFields, options);
		*/
		_provisionCollection = function (name, searchFields, options) {

			var instance,
				deferred = $.Deferred(),
				collectionAdapter,
				collectionName = '',
				username = WL.constant.DEFAULT_USERNAME,
				collectionsearchFields = {},
				collectionAdditionalSearchFields = {},
				collectionOptions = {},
				dropCollection = false,
				fipsEnabled = false,
				collectionPassword = '',
                key = '',
                hasOwn = Object.prototype.hasOwnProperty,
				callbacks = __generateCallbacks(options, 'initCollection', name, username, deferred),
				checkKeysCB;

			if (check.isObject(options)) {

				if (check.isBoolean(options.dropCollection)) {
					dropCollection = options.dropCollection;
				}

				if (check.isBoolean(options.fipsEnabled)) {
					fipsEnabled = options.fipsEnabled;
				}

				if(check.isString(options.username) && options.username.length > 0) {

					username = options.username;

					if(!check.isAlphaNumeric(username) || check.isReservedWord(username)) {

						//Those are default usernames that are used only in old versions of JSONStore
						//and the special case where it's not an alphanumeric string
						callbacks.onFailure(-7);
						return -7;
					}

					//Regenerate callback using the correct username
					callbacks = __generateCallbacks(options, 'initCollection', name, username, deferred);
				}

				//check if the password key exists
				if (!check.isUndefined(PWD)) {
					//validate passswrd
					if (check.isString(PWD) && PWD.length > 0) {
						collectionPassword = PWD;
					}else{

						callbacks.onFailure(11);
						return 11;
					}
				}

				if (check.isString(options.password) && options.password.length > 0) {
					collectionPassword = options.password;
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

				if (!check.isValidSchemaObject(searchFields)) {
					callbacks.onFailure(-12);
					return -12;
				}

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

			//Additional search fields (optional parameter)
			if (check.isObject(options) && !check.isUndefined(options.additionalSearchFields)) {

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

			instance = new JSONStoreInstance(collectionName, collectionsearchFields, collectionAdapter,
				collectionAdditionalSearchFields, username, deferred);

			collectionOptions = {dropCollection: dropCollection, collectionPassword: collectionPassword,
					additionalSearchFields: collectionAdditionalSearchFields, username: username,  fipsEnabled: fipsEnabled,
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
						db.storeDPK(sr, collectionPassword, salt, username, {
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
					db.isKeyGenRequired(username, {onSuccess: checkKeysCB});

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
		invokeProcedure : function (options) {

			var deferred = $.Deferred(),
				collectionName = this.pushData.name,
				usr = this.pushData.usr,
				errorObject = {src: 'push', col: collectionName, usr: usr},
				onSuccess = this.pushData.onSuccess,
				onFailure = this.pushData.onFailure,
				collectionAdapter = this.pushData.adapter,
				collectionDocument = this.pushData.data[constant.JSON_DATA_KEY],
				documentId = this.pushData.data[constant.ID_KEY],
				documentOperation = this.pushData.data[constant.OPERATION_KEY],
				documentIdAndOperationObj = {},
				ipOpts = {},

				adapterSuccess = function (data) {

					documentIdAndOperationObj[constant.ID_KEY] = documentId;
					documentIdAndOperationObj[constant.OPERATION_KEY] = documentOperation;

					var acceptCondition = check.isUndefined(collectionAdapter.accept) ||
						collectionAdapter.accept(data, collectionDocument);

					if (acceptCondition) {

						//db.markpushed(collectionName, documentIdAndOperationObj,
						//	{onSuccess: onSuccess, onFailure : onFailure});

						var opts = {};

						opts.onSuccess = function (data) {

							onSuccess(data);
							deferred.resolve({worked: true});
						};

						opts.onFailure = function (err) {

							onFailure(err);
							errorObject.err = 15;
							errorObject.msg = WL.JSONStore.getErrorMessage(15);
							errorObject.doc = collectionDocument;
							deferred.resolve(errorObject);

						};

						db.markpushed(collectionName, documentIdAndOperationObj, opts);

					} else {

						errorObject.err = -10;
						errorObject.msg = WL.JSONStore.getErrorMessage(-10);
						errorObject.doc = collectionDocument;
						deferred.resolve(errorObject);
						adapterFailure(data);
					}
				},

				adapterFailure = function (data) {
					if(deferred.state() !== 'resolved'){
						errorObject.err = 12;
						errorObject.msg = WL.JSONStore.getErrorMessage(12);
						errorObject.res = data;
						errorObject.doc = collectionDocument;

						deferred.resolve(errorObject);
					}
					//Must call the callback with rc 12 to preserve backwards compatibility with
					//th pre-promises api
					onFailure(12, data);
				},

				invocationData = {
					adapter : collectionAdapter.name,
					procedure : collectionAdapter[documentOperation],
					parameters : [JSON.stringify(collectionDocument)]
				};

			if (check.isString(invocationData.procedure) && invocationData.procedure.length > 0 ) {
				ipOpts.onSuccess = adapterSuccess;
				ipOpts.onFailure = adapterFailure;

				if (!check.isUndefined(options.timeout) ){
					ipOpts.timeout = options.timeout;
				}

				WL.Client.invokeProcedure(invocationData, ipOpts);

			} else {

				errorObject.err = 20;
				errorObject.msg = WL.JSONStore.getErrorMessage(20);
				errorObject.doc = collectionDocument;

				deferred.resolve(errorObject);
				onFailure(20, documentOperation);
			}

			return deferred.promise();
		}

	};

	JSONStoreInstance.prototype = {

		/**
			Returns documents stored in the collection that match the query. To find all documents use the
			following query: `var query = {}`.
			@method find
			@param query {Query}
			@param [options] {Options}
			@return {Promise} promise. `onSuccess` An Array of Documents or an Empty Array if no matches,
				`onFailure` an error code.

			@example

				//See .init and .add for context
				var query = {fn: 'carlos'}
				WL.JSONStore.get('customers').find(query)
				.then(function (res) {
					//res => results from find
				})
				.fail(function (errobject) {
					WL.Logger.debug(errobject.toString());
				});

				//Deprecated Example:

				var query = {fn: 'carlos'};

				var win =	function (data) {
								console.log(data);
									=> [{_id : 0, json: {fn : 'carlos', age : 99, active : false}}];
							};

				var options = {onSuccess: win, onFailure: fail};

				collection.find(query, options);
		*/
		find : function (query, options) {

			return __find(this.name, this.username, query, this.searchFields, this.additionalSearchFields, options);

		},

		/**
			Returns one or more documents that match the id or ids supplied to the function.
			@method findById
			@param id {Integer or Array of Integers} Integer values must be greater than 0.
			@param [options] {Options}
			@return {Promise} promise. `onSuccess` An Array of Documents or an Empty Array if no matches,
				`onFailure` an error code.

			@example

				//See .init and .add for context
				WL.JSONStore.get('customers').findById(1)
				.then(function (res) {
					//res => results from find
				})
				.fail(function (errobject) {
					WL.Logger.debug(errobject.toString());
				});

				//Deprecated Example:

				var id = 1;
				//You can also pass id = [1,2,3] if you want the first 3 documents in the JSONStore

				var win =	function (data) {
								console.log(data);
									=> [{_id : 1, json: {fn : 'carlos', age : 99, active : false}}];
							};

				var options = {onSuccess: win, onFailure: fail};

				collection.findById(id, options);
		*/

		findById : function (id, options) {

			var deferred = $.Deferred(),
				callbacks = __generateCallbacks(options, 'findById', this.name, this.username, deferred),
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
				db.findById(this.name, param, callbacks);
			} else {
				callbacks.onFailure(27);
			}

			return deferred.promise();

		},

		/**
			Returns all the documents stored in the JSON Store.
			@method findAll
			@param [options] {Options}
			@return {Promise} promise. `onSuccess` An Array of Documents or an Empty Array if the collection is empty,
				`onFailure` an error code.

			@example

				//See .init and .add for context
				WL.JSONStore.get('customers').findAll()
				.then(function (res) {
					//res => results from findAll
				})
				.fail(function (errobject) {
					WL.Logger.debug(errobject.toString());
				});

				//Deprecated Example:

				var win =	function (data) {
								console.log(data);
									=> [{_id : 0, json: {fn : 'carlos', age : 99, active : false}}];
							};

				var options = {onSuccess: win, onFailure: fail};

				collection.findAll(options);
		*/
		findAll : function (options) {

			return __find(this.name, this.username, {}, this.searchFields, this.additionalSearchFields, options);
		},

		/**
			Used to initially load JSON objects into a collection as Documents.
			Stores data marked as pushed, see `add` to store Documents as unpushed.

			**Deprecated, use add**

			@deprecated
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

			__logDeprecatedMessage('collection.store(doc)', 'collection.add(doc, {push: false})');

			options = options || {};

			if (check.isUndefined(options.isAdd)) {
				options.isAdd = false;
			}

			return __store(this.name, this.username, this.searchFields, this.additionalSearchFields, data, options);

		},

		/**
			Adds data to a collection, creating a new Document(s).
			Will require push, unless `{push: false}` is specified.
			@method add
			@param data {Object or Array of Objects} Data to be added the collection.
			@param [options] {Options} Additional options: 'additionalSearchFields : {}'
			@return {Promise} promise. `onSuccess` Integer with the amount of data stored, ``onFailure` an error code.

			@example

				//See .init for context
				WL.JSONStore.get('customers').add({fn: 'carlos'})
				.then(function (res) {
					//res => number of documents added
				})
				.fail(function (errobject) {
					WL.Logger.debug(errobject.toString());
				});

				//Deprecated Example:

				var data = {fn: 'jeremy', age: 88, active: true};
				collection.add(data, options);
		*/
		add : function (data, options) {

			options = options || {};

			if (check.isUndefined(options.isAdd)) {
				options.isAdd = true;
			}

			if (check.isBoolean(options.push)) {
				options.isAdd = options.push;
			}

			return __store(this.name, this.username, this.searchFields, this.additionalSearchFields, data, options);

		},

		/**
			Replaces a Document with another Document.
			Will require push, unless `{push: false}` is specified.
			@method replace
			@param doc {Document or Array of Documents}
			@param [options] {Options}
			@return {Promise} promise. `onSuccess` Integer with the amount of Documents replaced, `onFailure` an error code.

			@example

				//See .init and .add for context
				var doc = {_id : 0, json: {fn : 'carlos', age : 99, active : false}};
				doc.json.age = 100;
				WL.JSONStore.get('customers').replace(doc)
				.then(function (res) {
					//res => number of documents replaced
				})
				.fail(function (errobject) {
					WL.Logger.debug(errobject.toString());
				});

				//Deprecated Example:

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

			if (check.isBoolean(options.push)) {
				options.isRefresh = !options.push;
			}

			return __replace(this.name, this.username, doc, options);
		},

		/**
			Replaces a Document with another Document just like `replace`, but it does
				not mark that change to push to the back end via an adapter.

			**Deprecated, use replace**

			@deprecated
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

			__logDeprecatedMessage('collection.refresh(doc)', 'collection.replace(doc, {push: false})');

			options = options || {};

			if (check.isUndefined(options.isRefresh)) {
				options.isRefresh = true;
			}

			return __replace(this.name, this.username, doc, options);
		},

		/**
			Marks 1 or more Documents as removed from a collection. Removed Documents are not returned
			by `find` or `count`. The actual Documents are not deleted from the collection until
			succesfully pushed. Will require push, unless `{push: false}` is specified.
			@method remove
			@param doc {Document or Array of Documents or Query or Integer} The Integer is an `_id`.
			@param [options] {Options}
			@return {Promise} promise. `onSuccess` Integer with the amount of documents removed, `onFailure` an error code.

			@example

				//See .init and .add for context
				var doc = {_id : 0, json: {fn : 'carlos', age : 99, active : false}};
				WL.JSONStore.get('customers').remove(doc)
				.then(function (res) {
					//res => number of documents removed
				})
				.fail(function (errobject) {
					WL.Logger.debug(errobject.toString());
				});

				//Deprecated Example:

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

			if (check.isBoolean(options.push)) {
				options.isErase = !options.push;
			}

			return __remove(this.name, this.username, doc, options);

		},

		/**
			Same as `remove` but will really remove the document from the internal storage instead
			of marking it for removal and then really removing it when you call `push` or `pushSelected`
			with that specific document.

			**Deprecated, use remove**

			@deprecated
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

			__logDeprecatedMessage('collection.erase(doc)', 'collection.remove(doc, {push: false})');

			options = options || {};

			if (check.isUndefined(options.isErase)) {
				options.isErase = true;
			}

			return __remove(this.name, this.username, doc, options);

		},

		/**
			Push the collection with an Adapter. For every Document marked requiring push,
			call the corresponding Adapter procedure linked to the collection. The Documents
			will be processed on the client by order of their last modification date.  Error handling for `push`
			is more involved than other methods as a result of sending data to the server.  Errors such as input validation
			or invalid states in the local collection will go to the promise's fail function, this class of error implies the push
			operation as a whole is unable to complete.  Any documents that fail the actual process of being pushed to the server
			Adapter, such as a network error, server rejection or failure by the user written accept function will go to the the promise's
			then or done function.
			@method push
			@param [options] {Options or Array of Documents or Document} You may specify a document or an array of documents you want to push.
			@return {Promise} promise, the sucess callback will be called when all the documents have been pushed.
				If you get an empty array it means everything was pushed, if something fails that array will contain
				error objects. The following is deprecated behavior: `onSuccess` called if it was succesful or there
				where you records to push (you can check the number of records to push with the `getPushRequired` function), `onFailure`
				returns an error code. The success callbacks are called once per document. If you try to push 10 documents, your success
				callback may get called 9 times and the failure callback once.

			@example

				//See .init and .add for context
				WL.JSONStore.get('customers').push()
				.then(function (res) {
					//res => Empty array if everything worked or Array of error objects if something failed
				})
				.fail(function (errobject) {
					//Normal errors: collection is closed, invalid data sent to push, ...
					WL.Logger.debug(errobject.toString());
				});

				//Deprecated Example:

				collection.push(options);
		*/
		push : function (options) {

            options = options || {};

            var arrayOfDocs = __getQueryArray(options, {idOnly: true, idArray: true, fakeDoc: true, isQueryValid: false});

            if (arrayOfDocs.length > 0) {
                return __push(options, this.name, this.username, this.adapter, arrayOfDocs);
            }

            return __push(options, this.name, this.username, this.adapter);
        },

		/**
			Pushes only the selected Documents. See `push`. The Document passed will not be
			sent to the Adapter (pushed) if it is not marked unpushed.

			**Deprecated, use push(doc)**

			@deprecated
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
			return __push(options, this.name, this.username, this.adapter, doc);
		},

		/**
			Determines if a Document is pushed.
			@method isPushRequired
			@param doc {Document or Integer} The Integer is an `_id`.
			@param [options] {Options}
			@return {Promise} promise, `onSuccess` true if it is pushed and false otherwise, `onFailure` an error code.

			@example

				//See .init and .add for context
				WL.JSONStore.get('customers').isPushRequired(0) //{_id : 0}
				.then(function (res) {
					//res => true if document needs to be pushed, false otherwise
				})
				.fail(function (errobject) {
					WL.Logger.debug(errobject.toString());
				});

				//Deprecated Example:

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

			var deferred = $.Deferred(),
				arrayOfQueries = __getQueryArray(doc, {idOnly: true, isQueryValid: false}),
				callbacks = __generateCallbacks(options, 'isPushRequired', this.name, this.username, deferred);

			if(__validDataExists(arrayOfQueries, callbacks)){
				db.isPushRequired(this.name, arrayOfQueries[0], callbacks);
			}

			return deferred.promise();
		},

		/**
			Get all the Documents that are unpushed.
			@method getPushRequired
			@param [options] {Options}
			@return {Promise} promise, `onSuccess` Array of Documents that are not pushed, `onFailure` an error code.

			@example

				//See .init and .add for context
				WL.JSONStore.get('customers').getPushRequired()
				.then(function (res) {
					//res => array of documents that need to be pushed
				})
				.fail(function (errobject) {
					WL.Logger.debug(errobject.toString());
				});

				//Deprecated Example:

				var win =	function (data) {
								console.log(data);
									=> [ {_id: 1, json: {fn: 'jeremy', age: 88, active: true} }]
							};

				var options = {onSuccess: win, onFailure: fail};

				collection.getPushRequired(options)
		*/
		getPushRequired : function (options) {

			var deferred = $.Deferred(),
				callbacks = __generateCallbacks(options, 'getPushRequired', this.name, this.username, deferred);

			db.allDirty(this.name, [], callbacks);

			return deferred.promise();
		},

		/**
			Returns the number of documents not pushed. It includes Documents marked as 'removed'.
			@method pushRequiredCount
			@param [options] {Options}
			@return {Promise} promise, `onSuccess` returns the number of Documents are only changed locally, `onFailure` an error code.

			@example

				//See .init and .add for context
				WL.JSONStore.get('customers').pushRequiredCount()
				.then(function (res) {
					//res => array of documents that need to be pushed
				})
				.fail(function (errobject) {
					WL.Logger.debug(errobject.toString());
				});

				//Deprecated Example:

				//Assumes that 1 document has been modified in the collection.
				var win =	function (data) {
								console.log(data);
									=> 1
							};

				var options = {onSuccess: win, onFailure: fail};

				collection.pushRequiredCount(options);

		*/
		pushRequiredCount: function (options) {

			var deferred = $.Deferred(),
				callbacks = __generateCallbacks(options, 'pushRequiredCount', this.name, this.username, deferred);

			db.pushRequiredCount(this.name, callbacks);

			return deferred.promise();
		},

		/**
			Number of documents in the collection, not including those marked 'removed'.
			@method count
			@param [options] {Options}
			@return {Promise} promise, `onSuccess` Number of documents in the collection, `onFailure` an error code.

			@example

				//See .init and .add for context
				WL.JSONStore.get('customers').count()
				.then(function (res) {
					//res => number of documents inside the collection
				})
				.fail(function (errobject) {
					WL.Logger.debug(errobject.toString());
				});

				//Deprecated Example:

				var win =	function (data) {
								console.log(data);
									=> 5
							};

				var options = {onSuccess: win, onFailure: fail};

				collection.count(options);

		*/
		count : function (options) {

			var deferred = $.Deferred(),
				callbacks = __generateCallbacks(options, 'count', this.name, this.username, deferred);

			db.count(this.name, callbacks);

			return deferred.promise();
		},

		/**
			Removes the collection locally, to use a collection with the same `name`
				you must call `WL.JSONStore.init`. Will not call push before the operation.
				In order to remove specific documents see the `remove` function.
			@method removeCollection
			@param [options] {Options}
			@return {Promise} promise, `onSuccess` Boolean if the operation succeded, `onFailure` an error code.

			@example

				//See .init for context
				WL.JSONStore.get('customers').removeCollection()
				.then(function () {
					// the collection was removed
				})
				.fail(function (errobject) {
					WL.Logger.debug(errobject.toString());
				});

				//Deprecated Example:

				collection.removeCollection(options);
		*/
		removeCollection : function (options) {
			var deferred = $.Deferred(),
				callbacks = __generateCallbacks(options, 'removeCollection', this.name, this.username, deferred);

			db.removeCollection(this.name, callbacks);

			return deferred.promise();
		},

		/**
			Add a new function to a collection's protoype.
			@method enhance
			@param name {string} - Function name.
			@param func {function} - Function to add.
			@return {Integer} 0 if success or an error code.

			@example

				//Definition
				collection.enhance('findByName', function (name) {
					return this.find({fn: name});
				});

				//Usage - see .init for context
				WL.JSONStore.get('customers').findByName('carlos')
				.then(function (res) {
					//res => all documents that have a fn (first name) of 'carlos'
				})
				.fail(function (errobject) {
					WL.Logger.debug(errobject.toString());
				});

		*/
		enhance : function (name, func) {

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
			Gets data defined in load portion of the adapter.  This is analogous to invoking an Adapter using
			WL.Client.invokeProcedure and calling the `add` method in JSONStore with the {push : false} flag
			with the data returned by the adapter

			@method load
			@param [options] {Options}
			@return {Promise} promise, `onSuccess` number of documents stored, `onFailure` an error code.

			@example

				//See .init for context
				WL.JSONStore.get('customers').load()
				.then(function (res) {
					//res => number of documents stored
				})
				.fail(function (errobject) {
					WL.Logger.debug(errobject.toString());
				});

				//Deprecated Example:

				customers.load(options)
		*/
		load : function (options) {

			var deferred = $.Deferred(),
				callbacks = __generateCallbacks(options, 'load', this.name, this.username, deferred),
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

					if (check.isObject(resultData, {isArrayValid: true}) &&
						resultData.length > 0 &&
						!check.isUndefined(resultData[0])) {

						var arr = resultData[0];
						//Special case when the server returned no data via an empty array
						if (typeof arr === 'object' && typeof arr.length !== 'undefined' && arr.length === 0) {
							callbacks.onSuccess(0); //Returns via the success callback 0 docs loaded
						} else {
							
							if (!Array.isArray(arr)) {
								arr = [arr];
							}
							
							db.store(collectionName, arr, callbacks);
						}

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

			return deferred.promise();
		},

		/**
			Prints the contents of the collection using WL.Logger.debug asynchronously.
			@method toString
			@param limit {integer} - How many documents to print.
				0 for none, if it's missing it will print up to the first 100 documents.
			@param offset {integer} - How many documents to skip. Requires a valid limit.

			@example

				collection.toString() // Print up to the first 100 documents
				collection.toString(10) //Prints up to the first 10 documents
				collection.toString(10,10) //Prints up to the first 10 documents after the first 10
				collection.toString(0) //Prints no documents, only the collection metadata
					(name, searchFields and adapter)

				//Equivalent to:
				collection.findAll().done(function(data){console.log(JSON.stringify(data))})

		*/
		toString : function (limit, offset) {

			var col = this,
				output = {},
				options = {},
				deferred = $.Deferred();

			if (check.isUndefined(limit) && check.isUndefined(offset)) {

				col.findAll({limit: 100}).then(function (results) {
					output = {collection: col, docs: results};
					WL.Logger.debug(JSON.stringify(output));
					deferred.resolve(output);
				}).fail(function (err) {
					WL.Logger.debug(JSON.stringify(err));
					deferred.resolve(err);
				});

			} else if (check.isInt(limit) && limit === 0 && check.isUndefined(offset)) {

				setTimeout(function () {
					output = {collection: col};
					output.collection.searchFields[WL.constant.ID_KEY] = 'number';
					WL.Logger.debug(JSON.stringify(output));
					deferred.resolve(output);
				}, 1);

			} else {

				if (check.isInt(limit)) {
					options.limit = limit;
				}

				if (check.isInt(offset) && offset >= 0 && check.isInt(limit) && limit > 0) {
					options.offset = offset;
				}

				col.findAll(options).then(function (results) {
					output = {collection: col, docs: results};
					WL.Logger.debug(JSON.stringify(output));
					deferred.resolve(output);
				}).fail(function (err) {
					WL.Logger.debug(JSON.stringify(err));
					deferred.resolve(err);
				});
			}

			return deferred.promise();
		}

	};

	//public API
	return {
		init: _init,
		get: _get,
		initCollection : _initCollection,
		usePassword : _usePassword,
		clearPassword : _clearPassword,
		closeAll : _closeAll,
		documentify : _documentify,
		changePassword : _changePassword,
		destroy : _destroy,
		getErrorMessage : _getErrorMessage
	};

}(WLJQ)); //WL.JSONStore

}//end if that checks if the device is running iOS or Android
