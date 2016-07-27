/*!
 * jQuery JavaScript Library v1.8.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Thu Sep 20 2012 21:13:05 GMT-0400 (Eastern Daylight Time)
 */
(function( window, undefined ) {
var
	// A central reference to the root jQuery(document)
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,
	navigator = window.navigator,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// Save a reference to some core methods
	core_push = Array.prototype.push,
	core_slice = Array.prototype.slice,
	core_indexOf = Array.prototype.indexOf,
	core_toString = Object.prototype.toString,
	core_hasOwn = Object.prototype.hasOwnProperty,
	core_trim = String.prototype.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,

	// Used for detecting and trimming whitespace
	core_rnotwhite = /\S/,
	core_rspace = /\s+/,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// The ready event handler and self cleanup method
	DOMContentLoaded = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			jQuery.ready();
		} else if ( document.readyState === "complete" ) {
			// we're here because readyState === "complete" in oldIE
			// which is good enough for us to call the dom ready!
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	},

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context && context.nodeType ? context.ownerDocument || context : document );

					// scripts is true for back-compat
					selector = jQuery.parseHTML( match[1], doc, true );
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						this.attr.call( selector, context, true );
					}

					return jQuery.merge( this, selector );

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.8.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ),
			"slice", core_slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready, 1 );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ core_toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// scripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, scripts ) {
		var parsed;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			scripts = context;
			context = 0;
		}
		context = context || document;

		// Single tag
		if ( (parsed = rsingleTag.exec( data )) ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts ? null : [] );
		return jQuery.merge( [],
			(parsed.cacheable ? jQuery.clone( parsed.fragment ) : parsed.fragment).childNodes );
	},

	parseJSON: function( data ) {
		if ( !data || typeof data !== "string") {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && core_rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var name,
			i = 0,
			length = obj.length,
			isObj = length === undefined || jQuery.isFunction( obj );

		if ( args ) {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.apply( obj[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( obj[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var type,
			ret = results || [];

		if ( arr != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			type = jQuery.type( arr );

			if ( arr.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( arr ) ) {
				core_push.call( ret, arr );
			} else {
				jQuery.merge( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key,
			ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
		var exec,
			bulk = key == null,
			i = 0,
			length = elems.length;

		// Sets many values
		if ( key && typeof key === "object" ) {
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
			}
			chainable = 1;

		// Sets one value
		} else if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = pass === undefined && jQuery.isFunction( value );

			if ( bulk ) {
				// Bulk operations only iterate when executing function values
				if ( exec ) {
					exec = fn;
					fn = function( elem, key, value ) {
						return exec.call( jQuery( elem ), value );
					};

				// Otherwise they run against the entire set
				} else {
					fn.call( elems, value );
					fn = null;
				}
			}

			if ( fn ) {
				for (; i < length; i++ ) {
					fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
				}
			}

			chainable = 1;
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready, 1 );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.split( core_rspace ), function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" && ( !options.unique || !self.has( arg ) ) ) {
								list.push( arg );
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				return jQuery.inArray( fn, list ) > -1;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ]( jQuery.isFunction( fn ) ?
								function() {
									var returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.done( newDefer.resolve )
											.fail( newDefer.reject )
											.progress( newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								} :
								newDefer[ action ]
							);
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ] = list.fire
			deferred[ tuple[0] ] = list.fire;
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		fragment,
		eventName,
		i,
		isSupported,
		clickFn,
		div = document.createElement("div");

	// Preliminary tests
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Can't get basic test support
	if ( !all || !all.length ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: ( document.compatMode === "CSS1Compat" ),

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", clickFn = function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent("onclick");
		div.detachEvent( "onclick", clickFn );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	input.setAttribute( "checked", "checked" );

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "name", "t" );

	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for ( i in {
			submit: true,
			change: true,
			focusin: true
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, div, tds, marginDiv,
			divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// NOTE: To any future maintainer, we've window.getComputedStyle
		// because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. For more
			// info see bug #3333
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = document.createElement("div");
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";
			div.appendChild( marginDiv );
			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			container.style.zoom = 1;
		}

		// Null elements to avoid leaks in IE
		body.removeChild( container );
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	fragment.removeChild( div );
	all = a = select = opt = input = fragment = div = null;

	return support;
})();
var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	deletedIds: [],

	// Remove at next major release (1.9/2.0)
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = jQuery.deletedIds.pop() || jQuery.guid++;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split(" ");
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject( cache[ id ] ) ) {
				return;
			}
		}

		// Destroy the cache
		if ( isNode ) {
			jQuery.cleanData( [ elem ], true );

		// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
		} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
			delete cache[ id ];

		// When all else fails, null
		} else {
			cache[ id ] = null;
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, part, attr, name, l,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attr = elem.attributes;
					for ( l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split( ".", 2 );
		parts[1] = parts[1] ? "." + parts[1] : "";
		part = parts[1] + "!";

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				data = this.triggerHandler( "getData" + part, [ parts[0] ] );

				// Try to fetch any internally stored data first
				if ( data === undefined && elem ) {
					data = jQuery.data( elem, key );
					data = dataAttr( elem, key, data );
				}

				return data === undefined && parts[1] ?
					this.data( parts[0] ) :
					data;
			}

			parts[1] = value;
			this.each(function() {
				var self = jQuery( this );

				self.triggerHandler( "setData" + part, parts );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + part, parts );
			});
		}, null, value, arguments.length > 1, null, false );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				// Only convert to a number if it doesn't change the string
				+data + "" === data ? +data :
				rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery.removeData( elem, type + "queue", true );
				jQuery.removeData( elem, key, true );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook, fixSpecified,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea|)$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( core_rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( setClass.indexOf( " " + classNames[ c ] + " " ) < 0 ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var removes, className, elem, c, cl, i, l;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}
		if ( (value && typeof value === "string") || value === undefined ) {
			removes = ( value || "" ).split( core_rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];
				if ( elem.nodeType === 1 && elem.className ) {

					className = (" " + elem.className + " ").replace( rclass, " " );

					// loop over each item in the removal list
					for ( c = 0, cl = removes.length; c < cl; c++ ) {
						// Remove until there is nothing to remove,
						while ( className.indexOf(" " + removes[ c ] + " ") >= 0 ) {
							className = className.replace( " " + removes[ c ] + " " , " " );
						}
					}
					elem.className = value ? jQuery.trim( className ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( core_rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	// Unused in 1.8, left in so attrFn-stabbers won't die; remove in 1.9
	attrFn: {},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && jQuery.isFunction( jQuery.fn[ name ] ) ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, isBool,
			i = 0;

		if ( value && elem.nodeType === 1 ) {

			attrNames = value.split( core_rspace );

			for ( ; i < attrNames.length; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;
					isBool = rboolean.test( name );

					// See #9699 for explanation of this approach (setting first, then removal)
					// Do not do this for boolean attributes (see #10870)
					if ( !isBool ) {
						jQuery.attr( elem, name, "" );
					}
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( isBool && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true,
		coords: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.value = value + "" );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/,
	rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var t, tns, type, origType, namespaces, origCount,
			j, events, special, eventType, handleObj,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, "events", true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType,
			type = event.type || event,
			namespaces = [];

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			for ( old = elem; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old === (elem.ownerDocument || document) ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related,
			handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = core_slice.call( arguments ),
			run_all = !event.exclusive && !event.namespace,
			special = jQuery.event.special[ event.type ] || {},
			handlerQueue = [];

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers that should run if there are delegated events
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !(event.button && event.type === "click") ) {

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

				// Don't process clicks (ONLY) on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					selMatch = {};
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
						sel = handleObj.selector;

						if ( selMatch[ sel ] === undefined ) {
							selMatch[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( selMatch[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, matches: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328; IE6/7/8)
		event.metaKey = !!event.metaKey;

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8 –
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "_submit_attached" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "_submit_attached", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "_change_attached" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "_change_attached", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) { // && selector != null
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var cachedruns,
	assertGetIdNotName,
	Expr,
	getText,
	isXML,
	contains,
	compile,
	sortOrder,
	hasDuplicate,
	outermostContext,

	baseHasDuplicate = true,
	strundefined = "undefined",

	expando = ( "sizcache" + Math.random() ).replace( ".", "" ),

	Token = String,
	document = window.document,
	docElem = document.documentElement,
	dirruns = 0,
	done = 0,
	pop = [].pop,
	push = [].push,
	slice = [].slice,
	// Use a stripped-down indexOf if a native one is unavailable
	indexOf = [].indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	// Augment a function for special use by Sizzle
	markFunction = function( fn, value ) {
		fn[ expando ] = value == null || value;
		return fn;
	},

	createCache = function() {
		var cache = {},
			keys = [];

		return markFunction(function( key, value ) {
			// Only keep the most recent entries
			if ( keys.push( key ) > Expr.cacheLength ) {
				delete cache[ keys.shift() ];
			}

			return (cache[ key ] = value);
		}, cache );
	},

	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// Regex

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier (http://www.w3.org/TR/css3-selectors/#attribute-selectors)
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments not in parens/brackets,
	//   then attribute selectors and non-pseudos (denoted by :),
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + attributes + ")|[^:]|\\\\.)*|.*))\\)|)",

	// For matchExpr.POS and matchExpr.needsContext
	pos = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
		"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,

	rnot = /^:not/,
	rsibling = /[\x20\t\r\n\f]*[+~]/,
	rendsWithNot = /:not\($/,

	rheader = /h\d/i,
	rinputs = /input|select|textarea|button/i,

	rbackslash = /\\(?!\\)/g,

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"POS": new RegExp( pos, "i" ),
		"CHILD": new RegExp( "^:(only|nth|first|last)-child(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|" + pos, "i" )
	},

	// Support

	// Used for testing something on an element
	assert = function( fn ) {
		var div = document.createElement("div");

		try {
			return fn( div );
		} catch (e) {
			return false;
		} finally {
			// release memory in IE
			div = null;
		}
	},

	// Check if getElementsByTagName("*") returns only elements
	assertTagNameNoComments = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	}),

	// Check if getAttribute returns normalized href attributes
	assertHrefNotNormalized = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}),

	// Check if attributes should be retrieved by attribute nodes
	assertAttributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	}),

	// Check if getElementsByClassName can be trusted
	assertUsableClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	}),

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	assertUsableName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = document.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			document.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			document.getElementsByName( expando + 0 ).length;
		assertGetIdNotName = !document.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

// If slice is not available, provide a backup
try {
	slice.call( docElem.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		for ( ; (elem = this[i]); i++ ) {
			results.push( elem );
		}
		return results;
	};
}

function Sizzle( selector, context, results, seed ) {
	results = results || [];
	context = context || document;
	var match, elem, xml, m,
		nodeType = context.nodeType;

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( nodeType !== 1 && nodeType !== 9 ) {
		return [];
	}

	xml = isXML( context );

	if ( !xml && !seed ) {
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && assertUsableClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed, xml );
}

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	return Sizzle( expr, null, null, [ elem ] ).length > 0;
};

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (see #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes
	} else {

		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	}
	return ret;
};

isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Element contains another
contains = Sizzle.contains = docElem.contains ?
	function( a, b ) {
		var adown = a.nodeType === 9 ? a.documentElement : a,
			bup = b && b.parentNode;
		return a === bup || !!( bup && bup.nodeType === 1 && adown.contains && adown.contains(bup) );
	} :
	docElem.compareDocumentPosition ?
	function( a, b ) {
		return b && !!( a.compareDocumentPosition( b ) & 16 );
	} :
	function( a, b ) {
		while ( (b = b.parentNode) ) {
			if ( b === a ) {
				return true;
			}
		}
		return false;
	};

Sizzle.attr = function( elem, name ) {
	var val,
		xml = isXML( elem );

	if ( !xml ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( xml || assertAttributes ) {
		return elem.getAttribute( name );
	}
	val = elem.getAttributeNode( name );
	return val ?
		typeof elem[ name ] === "boolean" ?
			elem[ name ] ? name : null :
			val.specified ? val.value : null :
		null;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	// IE6/7 return a modified href
	attrHandle: assertHrefNotNormalized ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		},

	find: {
		"ID": assertGetIdNotName ?
			function( id, context, xml ) {
				if ( typeof context.getElementById !== strundefined && !xml ) {
					var m = context.getElementById( id );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					return m && m.parentNode ? [m] : [];
				}
			} :
			function( id, context, xml ) {
				if ( typeof context.getElementById !== strundefined && !xml ) {
					var m = context.getElementById( id );

					return m ?
						m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
							[m] :
							undefined :
						[];
				}
			},

		"TAG": assertTagNameNoComments ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== strundefined ) {
					return context.getElementsByTagName( tag );
				}
			} :
			function( tag, context ) {
				var results = context.getElementsByTagName( tag );

				// Filter out possible comments
				if ( tag === "*" ) {
					var elem,
						tmp = [],
						i = 0;

					for ( ; (elem = results[i]); i++ ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}

					return tmp;
				}
				return results;
			},

		"NAME": assertUsableName && function( tag, context ) {
			if ( typeof context.getElementsByName !== strundefined ) {
				return context.getElementsByName( name );
			}
		},

		"CLASS": assertUsableClassName && function( className, context, xml ) {
			if ( typeof context.getElementsByClassName !== strundefined && !xml ) {
				return context.getElementsByClassName( className );
			}
		}
	},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( rbackslash, "" );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( rbackslash, "" );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				3 xn-component of xn+y argument ([+-]?\d*n|)
				4 sign of xn-component
				5 x of xn-component
				6 sign of y-component
				7 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1] === "nth" ) {
				// nth-child requires argument
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[3] = +( match[3] ? match[4] + (match[5] || 1) : 2 * ( match[2] === "even" || match[2] === "odd" ) );
				match[4] = +( ( match[6] + match[7] ) || match[2] === "odd" );

			// other types prohibit arguments
			} else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var unquoted, excess;
			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			if ( match[3] ) {
				match[2] = match[3];
			} else if ( (unquoted = match[4]) ) {
				// Only check arguments that contain a pseudo
				if ( rpseudo.test(unquoted) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

					// excess is a negative index
					unquoted = unquoted.slice( 0, excess );
					match[0] = match[0].slice( 0, excess );
				}
				match[2] = unquoted;
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {
		"ID": assertGetIdNotName ?
			function( id ) {
				id = id.replace( rbackslash, "" );
				return function( elem ) {
					return elem.getAttribute("id") === id;
				};
			} :
			function( id ) {
				id = id.replace( rbackslash, "" );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
					return node && node.value === id;
				};
			},

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}
			nodeName = nodeName.replace( rbackslash, "" ).toLowerCase();

			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ expando ][ className ];
			if ( !pattern ) {
				pattern = classCache( className, new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)") );
			}
			return function( elem ) {
				return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
			};
		},

		"ATTR": function( name, operator, check ) {
			return function( elem, context ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.substr( result.length - check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.substr( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, argument, first, last ) {

			if ( type === "nth" ) {
				return function( elem ) {
					var node, diff,
						parent = elem.parentNode;

					if ( first === 1 && last === 0 ) {
						return true;
					}

					if ( parent ) {
						diff = 0;
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								diff++;
								if ( elem === node ) {
									break;
								}
							}
						}
					}

					// Incorporate the offset (or cast to NaN), then check against cycle size
					diff -= last;
					return diff === first || ( diff % first === 0 && diff / first >= 0 );
				};
			}

			return function( elem ) {
				var node = elem;

				switch ( type ) {
					case "only":
					case "first":
						while ( (node = node.previousSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						if ( type === "first" ) {
							return true;
						}

						node = elem;

						/* falls through */
					case "last":
						while ( (node = node.nextSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						return true;
				}
			};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			var nodeType;
			elem = elem.firstChild;
			while ( elem ) {
				if ( elem.nodeName > "@" || (nodeType = elem.nodeType) === 3 || nodeType === 4 ) {
					return false;
				}
				elem = elem.nextSibling;
			}
			return true;
		},

		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"text": function( elem ) {
			var type, attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				(type = elem.type) === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === type );
		},

		// Input types
		"radio": createInputPseudo("radio"),
		"checkbox": createInputPseudo("checkbox"),
		"file": createInputPseudo("file"),
		"password": createInputPseudo("password"),
		"image": createInputPseudo("image"),

		"submit": createButtonPseudo("submit"),
		"reset": createButtonPseudo("reset"),

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"focus": function( elem ) {
			var doc = elem.ownerDocument;
			return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href);
		},

		"active": function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		},

		// Positional types
		"first": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length, argument ) {
			for ( var i = 0; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length, argument ) {
			for ( var i = 1; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			for ( var i = argument < 0 ? argument + length : argument; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			for ( var i = argument < 0 ? argument + length : argument; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

function siblingCheck( a, b, ret ) {
	if ( a === b ) {
		return ret;
	}

	var cur = a.nextSibling;

	while ( cur ) {
		if ( cur === b ) {
			return -1;
		}

		cur = cur.nextSibling;
	}

	return 1;
}

sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		return ( !a.compareDocumentPosition || !b.compareDocumentPosition ?
			a.compareDocumentPosition :
			a.compareDocumentPosition(b) & 4
		) ? -1 : 1;
	} :
	function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

// Always assume the presence of duplicates if sort doesn't
// pass them to our comparison function (as in Google Chrome).
[0, 0].sort( sortOrder );
baseHasDuplicate = !hasDuplicate;

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		i = 1;

	hasDuplicate = baseHasDuplicate;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				results.splice( i--, 1 );
			}
		}
	}

	return results;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type, soFar, groups, preFilters,
		cached = tokenCache[ expando ][ selector ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				soFar = soFar.slice( match[0].length );
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			tokens.push( matched = new Token( match.shift() ) );
			soFar = soFar.slice( matched.length );

			// Cast descendant combinators to space
			matched.type = match[0].replace( rtrim, " " );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				// The last two arguments here are (context, xml) for backCompat
				(match = preFilters[ type ]( match, document, true ))) ) {

				tokens.push( matched = new Token( match.shift() ) );
				soFar = soFar.slice( matched.length );
				matched.type = type;
				matched.matches = match;
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && combinator.dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( checkNonElements || elem.nodeType === 1  ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( !xml ) {
				var cache,
					dirkey = dirruns + " " + doneName + " ",
					cachedkey = dirkey + cachedruns;
				while ( (elem = elem[ dir ]) ) {
					if ( checkNonElements || elem.nodeType === 1 ) {
						if ( (cache = elem[ expando ]) === cachedkey ) {
							return elem.sizset;
						} else if ( typeof cache === "string" && cache.indexOf(dirkey) === 0 ) {
							if ( elem.sizset ) {
								return elem;
							}
						} else {
							elem[ expando ] = cachedkey;
							if ( matcher( elem, context, xml ) ) {
								elem.sizset = true;
								return elem;
							}
							elem.sizset = false;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( checkNonElements || elem.nodeType === 1 ) {
						if ( matcher( elem, context, xml ) ) {
							return elem;
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		// Positional selectors apply to seed elements, so it is invalid to follow them with relative ones
		if ( seed && postFinder ) {
			return;
		}

		var i, elem, postFilterIn,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [], seed ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			postFilterIn = condense( matcherOut, postMap );
			postFilter( postFilterIn, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = postFilterIn.length;
			while ( i-- ) {
				if ( (elem = postFilterIn[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		// Keep seed and results synchronized
		if ( seed ) {
			// Ignore postFinder because it can't coexist with seed
			i = preFilter && matcherOut.length;
			while ( i-- ) {
				if ( (elem = matcherOut[i]) ) {
					seed[ preMap[i] ] = !(results[ preMap[i] ] = elem);
				}
			}
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			// The concatenated values are (context, xml) for backCompat
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && tokens.slice( 0, i - 1 ).join("").replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && tokens.join("")
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Nested matchers should use non-integer dirruns
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.E);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = superMatcher.el;
			}

			// Add elements passing elementMatchers directly to results
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					for ( j = 0; (matcher = elementMatchers[j]); j++ ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++superMatcher.el;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				for ( j = 0; (matcher = setMatchers[j]); j++ ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	superMatcher.el = 0;
	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ expando ][ selector ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results, seed ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results, seed );
	}
	return results;
}

function select( selector, context, results, seed, xml ) {
	var i, tokens, token, type, find,
		match = tokenize( selector ),
		j = match.length;

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !xml &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( rbackslash, "" ), context, xml )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().length );
			}

			// Fetch a seed set for right-to-left matching
			for ( i = matchExpr["POS"].test( selector ) ? -1 : tokens.length - 1; i >= 0; i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( rbackslash, "" ),
						rsibling.test( tokens[0].type ) && context.parentNode || context,
						xml
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && tokens.join("");
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		xml,
		results,
		rsibling.test( selector )
	);
	return results;
}

if ( document.querySelectorAll ) {
	(function() {
		var disconnectedMatch,
			oldSelect = select,
			rescape = /'|\\/g,
			rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

			// qSa(:focus) reports false when true (Chrome 21),
			// A support test would require too much code (would include document ready)
			rbuggyQSA = [":focus"],

			// matchesSelector(:focus) reports false when true (Chrome 21),
			// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
			// A support test would require too much code (would include document ready)
			// just skip matchesSelector for :active
			rbuggyMatches = [ ":active", ":focus" ],
			matches = docElem.matchesSelector ||
				docElem.mozMatchesSelector ||
				docElem.webkitMatchesSelector ||
				docElem.oMatchesSelector ||
				docElem.msMatchesSelector;

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here (do not put tests after this one)
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE9 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<p test=''></p>";
			if ( div.querySelectorAll("[test^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here (do not put tests after this one)
			div.innerHTML = "<input type='hidden'/>";
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push(":enabled", ":disabled");
			}
		});

		// rbuggyQSA always contains :focus, so no need for a length check
		rbuggyQSA = /* rbuggyQSA.length && */ new RegExp( rbuggyQSA.join("|") );

		select = function( selector, context, results, seed, xml ) {
			// Only use querySelectorAll when not filtering,
			// when this is not xml,
			// and when no QSA bugs apply
			if ( !seed && !xml && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
				var groups, i,
					old = true,
					nid = expando,
					newContext = context,
					newSelector = context.nodeType === 9 && selector;

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					groups = tokenize( selector );

					if ( (old = context.getAttribute("id")) ) {
						nid = old.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", nid );
					}
					nid = "[id='" + nid + "'] ";

					i = groups.length;
					while ( i-- ) {
						groups[i] = nid + groups[i].join("");
					}
					newContext = rsibling.test( selector ) && context.parentNode || context;
					newSelector = groups.join(",");
				}

				if ( newSelector ) {
					try {
						push.apply( results, slice.call( newContext.querySelectorAll(
							newSelector
						), 0 ) );
						return results;
					} catch(qsaError) {
					} finally {
						if ( !old ) {
							context.removeAttribute("id");
						}
					}
				}
			}

			return oldSelect( selector, context, results, seed, xml );
		};

		if ( matches ) {
			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				disconnectedMatch = matches.call( div, "div" );

				// This should fail with an exception
				// Gecko does not error, returns false instead
				try {
					matches.call( div, "[test!='']:sizzle" );
					rbuggyMatches.push( "!=", pseudos );
				} catch ( e ) {}
			});

			// rbuggyMatches always contains :active and :focus, so no need for a length check
			rbuggyMatches = /* rbuggyMatches.length && */ new RegExp( rbuggyMatches.join("|") );

			Sizzle.matchesSelector = function( elem, expr ) {
				// Make sure that attribute selectors are quoted
				expr = expr.replace( rattributeQuotes, "='$1']" );

				// rbuggyMatches always contains :active, so no need for an existence check
				if ( !isXML( elem ) && !rbuggyMatches.test( expr ) && (!rbuggyQSA || !rbuggyQSA.test( expr )) ) {
					try {
						var ret = matches.call( elem, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9
								elem.document && elem.document.nodeType !== 11 ) {
							return ret;
						}
					} catch(e) {}
				}

				return Sizzle( expr, null, null, [ elem ] ).length > 0;
			};
		}
	})();
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Back-compat
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, l, length, n, r, ret,
			self = this;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		ret = this.pushStack( "", "find", selector );

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, core_slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rcheckableType = /^(?:checkbox|radio)$/,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
// unless wrapped in a div with non-breaking characters in front of it.
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "X<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( !isDisconnected( this[0] ) ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		}

		if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			return this.pushStack( jQuery.merge( set, this ), "before", this.selector );
		}
	},

	after: function() {
		if ( !isDisconnected( this[0] ) ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		}

		if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			return this.pushStack( jQuery.merge( this, set ), "after", this.selector );
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( elem.getElementsByTagName( "*" ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		if ( !isDisconnected( this[0] ) ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		}

		return this.length ?
			this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
			this;
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = [].concat.apply( [], args );

		var results, first, fragment, iNoClone,
			i = 0,
			value = args[0],
			scripts = [],
			l = this.length;

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && l > 1 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call( this, i, table ? self.html() : undefined );
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			results = jQuery.buildFragment( args, this, scripts );
			fragment = results.fragment;
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				// Fragments from the fragment cache must always be cloned and never used in place.
				for ( iNoClone = results.cacheable || l - 1; i < l; i++ ) {
					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						i === iNoClone ?
							fragment :
							jQuery.clone( fragment, true, true )
					);
				}
			}

			// Fix #11809: Avoid leaking memory
			fragment = first = null;

			if ( scripts.length ) {
				jQuery.each( scripts, function( i, elem ) {
					if ( elem.src ) {
						if ( jQuery.ajax ) {
							jQuery.ajax({
								url: elem.src,
								type: "GET",
								dataType: "script",
								async: false,
								global: false,
								"throws": true
							});
						} else {
							jQuery.error("no ajax");
						}
					} else {
						jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "" ) );
					}

					if ( elem.parentNode ) {
						elem.parentNode.removeChild( elem );
					}
				});
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	if ( nodeName === "object" ) {
		// IE6-10 improperly clones children of object elements using classid.
		// IE10 throws NoModificationAllowedError if parent is null, #12132.
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML)) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;

	// IE blanks contents when cloning scripts
	} else if ( nodeName === "script" && dest.text !== src.text ) {
		dest.text = src.text;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, context, scripts ) {
	var fragment, cacheable, cachehit,
		first = args[ 0 ];

	// Set context from what may come in as undefined or a jQuery collection or a node
	// Updated to fix #12266 where accessing context[0] could throw an exception in IE9/10 &
	// also doubles as fix for #8950 where plain objects caused createDocumentFragment exception
	context = context || document;
	context = !context.nodeType && context[0] || context;
	context = context.ownerDocument || context;

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && context === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		// Mark cacheable and look for a hit
		cacheable = true;
		fragment = jQuery.fragments[ first ];
		cachehit = fragment !== undefined;
	}

	if ( !fragment ) {
		fragment = context.createDocumentFragment();
		jQuery.clean( args, context, fragment, scripts );

		// Update the cache, but only store false
		// unless this is a second parsing of the same content
		if ( cacheable ) {
			jQuery.fragments[ first ] = cachehit && fragment;
		}
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			l = insert.length,
			parent = this.length === 1 && this[0].parentNode;

		if ( (parent == null || parent && parent.nodeType === 11 && parent.childNodes.length === 1) && l === 1 ) {
			insert[ original ]( this[0] );
			return this;
		} else {
			for ( ; i < l; i++ ) {
				elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			clone;

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var i, j, elem, tag, wrap, depth, div, hasBody, tbody, len, handleScript, jsTags,
			safe = context === document && safeFragment,
			ret = [];

		// Ensure that context is a document
		if ( !context || typeof context.createDocumentFragment === "undefined" ) {
			context = document;
		}

		// Use the already-created safe fragment if context permits
		for ( i = 0; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Ensure a safe container in which to render the html
					safe = safe || createSafeFragment( context );
					div = context.createElement("div");
					safe.appendChild( div );

					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Go to html and back, then peel off extra wrappers
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					depth = wrap[0];
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						hasBody = rtbody.test(elem);
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;

					// Take out of fragment container (we need a fresh div each time)
					div.parentNode.removeChild( div );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				jQuery.merge( ret, elem );
			}
		}

		// Fix #11356: Clear elements from safeFragment
		if ( div ) {
			elem = div = safe = null;
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				if ( jQuery.nodeName( elem, "input" ) ) {
					fixDefaultChecked( elem );
				} else if ( typeof elem.getElementsByTagName !== "undefined" ) {
					jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
				}
			}
		}

		// Append elements to a provided document fragment
		if ( fragment ) {
			// Special handling of each script element
			handleScript = function( elem ) {
				// Check if we consider it executable
				if ( !elem.type || rscriptType.test( elem.type ) ) {
					// Detach the script and store it in the scripts array (if provided) or the fragment
					// Return truthy to indicate that it has been handled
					return scripts ?
						scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
						fragment.appendChild( elem );
				}
			};

			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				// Check if we're done after handling an executable script
				if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
					// Append to fragment and handle embedded scripts
					fragment.appendChild( elem );
					if ( typeof elem.getElementsByTagName !== "undefined" ) {
						// handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
						jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );

						// Splice the scripts into ret after their former ancestor and advance our index beyond them
						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
						i += jsTags.length;
					}
				}
			}
		}

		return ret;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var data, id, elem, type,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( elem.removeAttribute ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						jQuery.deletedIds.push( id );
					}
				}
			}
		}
	}
});
// Limit scope pollution from any deprecated API
(function() {

var matched, browser;

// Use of jQuery.browser is frowned upon.
// More details: http://api.jquery.com/jQuery.browser
// jQuery.uaMatch maintained for back-compat
jQuery.uaMatch = function( ua ) {
	ua = ua.toLowerCase();

	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		[];

	return {
		browser: match[ 1 ] || "",
		version: match[ 2 ] || "0"
	};
};

matched = jQuery.uaMatch( navigator.userAgent );
browser = {};

if ( matched.browser ) {
	browser[ matched.browser ] = true;
	browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if ( browser.chrome ) {
	browser.webkit = true;
} else if ( browser.webkit ) {
	browser.safari = true;
}

jQuery.browser = browser;

jQuery.sub = function() {
	function jQuerySub( selector, context ) {
		return new jQuerySub.fn.init( selector, context );
	}
	jQuery.extend( true, jQuerySub, this );
	jQuerySub.superclass = this;
	jQuerySub.fn = jQuerySub.prototype = this();
	jQuerySub.fn.constructor = jQuerySub;
	jQuerySub.sub = this.sub;
	jQuerySub.fn.init = function init( selector, context ) {
		if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
			context = jQuerySub( context );
		}

		return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
	};
	jQuerySub.fn.init.prototype = jQuerySub.fn;
	var rootjQuerySub = jQuerySub(document);
	return jQuerySub;
};

})();
var curCSS, iframe, iframeDoc,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([-+])=(" + core_pnum + ")", "i" ),
	elemdisplay = {},

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],

	eventsToggle = jQuery.fn.toggle;

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var elem, display,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		values[ index ] = jQuery._data( elem, "olddisplay" );
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && elem.style.display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {
			display = curCSS( elem, "display" );

			if ( !values[ index ] && display !== "none" ) {
				jQuery._data( elem, "olddisplay", display );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state, fn2 ) {
		var bool = typeof state === "boolean";

		if ( jQuery.isFunction( state ) && jQuery.isFunction( fn2 ) ) {
			return eventsToggle.apply( this, arguments );
		}

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;

				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, numeric, extra ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( numeric || extra !== undefined ) {
			num = parseFloat( val );
			return numeric || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: To any future maintainer, we've window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	curCSS = function( elem, name ) {
		var ret, width, minWidth, maxWidth,
			computed = window.getComputedStyle( elem, null ),
			style = elem.style;

		if ( computed ) {

			ret = computed[ name ];
			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	curCSS = function( elem, name ) {
		var left, rsLeft,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
			Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
			value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			// we use jQuery.css instead of curCSS here
			// because of the reliableMarginRight CSS hook!
			val += jQuery.css( elem, extra + cssExpand[ i ], true );
		}

		// From this point on we use curCSS for maximum performance (relevant in animations)
		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		valueIsBorderBox = true,
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox
		)
	) + "px";
}


// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	if ( elemdisplay[ nodeName ] ) {
		return elemdisplay[ nodeName ];
	}

	var elem = jQuery( "<" + nodeName + ">" ).appendTo( document.body ),
		display = elem.css("display");
	elem.remove();

	// If the simple way fails,
	// get element's real default display by attaching it to a temp iframe
	if ( display === "none" || display === "" ) {
		// Use the already-created iframe if possible
		iframe = document.body.appendChild(
			iframe || jQuery.extend( document.createElement("iframe"), {
				frameBorder: 0,
				width: 0,
				height: 0
			})
		);

		// Create a cacheable copy of the iframe document on first call.
		// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
		// document to it; WebKit & Firefox won't allow reusing the iframe document.
		if ( !iframeDoc || !iframe.createElement ) {
			iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
			iframeDoc.write("<!doctype html><html><body>");
			iframeDoc.close();
		}

		elem = iframeDoc.body.appendChild( iframeDoc.createElement(nodeName) );

		display = curCSS( elem, "display" );
		document.body.removeChild( iframe );
	}

	// Store the correct default display
	elemdisplay[ nodeName ] = display;

	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				if ( elem.offsetWidth === 0 && rdisplayswap.test( curCSS( elem, "display" ) ) ) {
					return jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					});
				} else {
					return getWidthOrHeight( elem, name, extra );
				}
			}
		},

		set: function( elem, value, extra ) {
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box"
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
				style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				return jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						return curCSS( elem, "marginRight" );
					}
				});
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						var ret = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( ret ) ? jQuery( elem ).position()[ prop ] + "px" : ret;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		return ( elem.offsetWidth === 0 && elem.offsetHeight === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || curCSS( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i,

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ],
				expanded = {};

			for ( i = 0; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	rselectTextarea = /^(?:select|textarea)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType, list, placeBefore,
			dataTypes = dataTypeExpression.toLowerCase().split( core_rspace ),
			i = 0,
			length = dataTypes.length;

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var selection,
		list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters );

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	// Don't do a request if no elements are being requested
	if ( !this.length ) {
		return this;
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// Request the remote document
	jQuery.ajax({
		url: url,

		// if "type" variable is undefined, then "GET" method will be used
		type: type,
		dataType: "html",
		data: params,
		complete: function( jqXHR, status ) {
			if ( callback ) {
				self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
			}
		}
	}).done(function( responseText ) {

		// Save response for use in complete callback
		response = arguments;

		// See if a selector was specified
		self.html( selector ?

			// Create a dummy div to hold the results
			jQuery("<div>")

				// inject the contents of the document in, removing the scripts
				// to avoid any 'Permission Denied' errors in IE
				.append( responseText.replace( rscript, "" ) )

				// Locate the specified elements
				.find( selector ) :

			// If not, just inject the full result
			responseText );

	});

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // ifModified key
			ifModifiedKey,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || strAbort;
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ ifModifiedKey ] = modified;
					}
					modified = jqXHR.getResponseHeader("Etag");
					if ( modified ) {
						jQuery.etag[ ifModifiedKey ] = modified;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.always( tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( core_rspace );

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() ) || false;
			s.crossDomain = parts && ( parts.join(":") + ( parts[ 3 ] ? "" : parts[ 1 ] === "http:" ? 80 : 443 ) ) !==
				( ajaxLocParts.join(":") + ( ajaxLocParts[ 3 ] ? "" : ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) );
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already and return
				return jqXHR.abort();

		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	var conv, conv2, current, tmp,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ],
		converters = {},
		i = 0;

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
var oldCallbacks = [],
	rquestion = /\?/,
	rjsonp = /(=)\?(?=&|$)|\?\?/,
	nonce = jQuery.now();

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		data = s.data,
		url = s.url,
		hasCallback = s.jsonp !== false,
		replaceInUrl = hasCallback && rjsonp.test( url ),
		replaceInData = hasCallback && !replaceInUrl && typeof data === "string" &&
			!( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") &&
			rjsonp.test( data );

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( s.dataTypes[ 0 ] === "jsonp" || replaceInUrl || replaceInData ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;
		overwritten = window[ callbackName ];

		// Insert callback into url or form data
		if ( replaceInUrl ) {
			s.url = url.replace( rjsonp, "$1" + callbackName );
		} else if ( replaceInData ) {
			s.data = data.replace( rjsonp, "$1" + callbackName );
		} else if ( hasCallback ) {
			s.url += ( rquestion.test( url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});
var xhrCallbacks,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									try {
										responses.text = xhr.responseText;
									} catch( _ ) {
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback, 0 );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([-+])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	}, 0 );
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		index = 0,
		tweenerIndex = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				percent = 1 - ( remaining / animation.duration || 0 ),
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end, easing ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;

				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			anim: animation,
			queue: animation.opts.queue,
			elem: elem
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	var index, prop, value, length, dataShow, tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.done(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery.removeData( elem, "fxshow", true );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing any value as a 4th parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, false, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ||
			// special check for .toggle( handler, handler, ... )
			( !i && jQuery.isFunction( speed ) && jQuery.isFunction( easing ) ) ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations resolve immediately
				if ( empty ) {
					anim.stop( true );
				}
			};

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) && !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.interval = 13;

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
var rroot = /^(?:body|html)$/i;

jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	if ( (body = doc.body) === elem ) {
		return jQuery.offset.bodyOffset( elem );
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== "undefined" ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	clientTop  = docElem.clientTop  || body.clientTop  || 0;
	clientLeft = docElem.clientLeft || body.clientLeft || 0;
	scrollTop  = win.pageYOffset || docElem.scrollTop;
	scrollLeft = win.pageXOffset || docElem.scrollLeft;
	return {
		top: box.top  + scrollTop  - clientTop,
		left: box.left + scrollLeft - clientLeft
	};
};

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.body;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					 top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, value, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );

/**
 * Created by IntelliJ IDEA.
 * User: Jeff
 * Date: 11/23/10
 * Time: 11:58 AM
 * To change this template use File | Settings | File Templates.
 */

//= require ../../libs/jquery/jquery-1.8.2

/**
 * @namespace
 */
window.Nina = window.Nina || {};
window.Nina.$ = jQuery.noConflict(true);
/**
 * Created by IntelliJ IDEA.
 * User: Jeff
 * Date: 11/22/10
 * Time: 4:19 PM
 * To change this template use File | Settings | File Templates.
 */

//= require ../common/jquerycompat

/**
 * @namespace
 */
window.Nina = window.Nina || {};
/**
 * @namespace
 */
window.Nina.ui = window.Nina.ui || {};

//TODO: might be good to move them to a helper
// Global function to detect iOS devices (iphone ipad ...)
window.Nina.ui.isIOS = function() {
    "use strict";

    var deviceAgent = navigator.userAgent.toLowerCase();
    return deviceAgent.match(/(iphone|ipod|ipad)/);
};

/**
 * Open a URL in the parent window if it exists or in a new window otherwise
 * @param {string} url
 * @returns {void}
 */
window.Nina.ui.openInParent = function(url) {
    "use strict";
    // Bug in IE8 - it does not support changing the opener url when not in the same domain. Other browsers do, so disable this for IE.
    // Cannot disable it only for IE8 because on a lot of site, IE8 is in compatibility view which identifies as IE7...

    // For iOS devices, we should not try to keep the focus in popup mode since the user won't know the parent has changed

    try {
        if(window.Nina.ui.isIOS()) {
            window.open(url,"agentAnswer");
        } else if(!window.Nina.$.browser.msie && window.opener){
            window.opener.location.href = url;
        } else{
            window.open(url,"agentAnswer");
            window.focus();
        }
    } catch(e) {
        window.open(url,"agentAnswer");
        if(!window.Nina.ui.isIOS()) {
            window.focus();
        }
    }
};

/**
 * Creates a new URL Handler object
 * @param {boolean} _popup
 * @param {Object} _config
 * @param {window.Nina.ui.UIHandler} _ui
 * @returns {window.Nina.ui.URLHandler}
 */
window.Nina.ui.newURLHandler = function(_popup, _config, _ui, _iosBridge) {
    "use strict";
    var me = {};
    // Config parameters
    me.popup = _popup;

    me.ui = _ui;
    me.honorOutUrl = _config.honorOutUrl;
    me.iosBridge = _iosBridge;

    me.targets = {
        "default": function(isOutUrl, url, metaData) {
            if(me.popup) {
                // Open in parent window if it still exists otherwise new window
                window.Nina.ui.openInParent(url);
                trackUrl(url, "default", false, metaData);
            } else {
                // Send tracking (##Url) and once we receive the outUrl, we'll browse (so that we can track the click)
                if(isOutUrl) {
                    if (me.iosBridge) {
                        me.iosBridge.getBridge().callHandler('goto', url);
                    }
                    else {
                        window.location.href = url;
                    }
                } else {
                    trackUrl(url, "default", true, metaData);
                }
            }
        },
        "_blank": function(isOutUrl, url, metaData) {
            if (me.iosBridge) {
                me.iosBridge.getBridge().callHandler('goto', url);
            }
            else {
                window.open(url, "_blank");
            }
            trackUrl(url, "_blank", false, metaData);
        },
        "_self": function(isOutUrl, url, metaData) {
            if(isOutUrl) {
                if (me.iosBridge) {
                    me.iosBridge.getBridge().callHandler('goto', url);
                }
                else {
                    window.location.href = url;
                }
            } else {
                trackUrl(url, "_self", true, metaData);
            }
        },
        "_parent": function(isOutUrl, url, metaData) {
            if(isOutUrl) {
                window.top.location.href = url;
            } else {
                trackUrl(url, "_parent", true, metaData);
            }
        }
    };

    window.Nina.$.extend(me.targets, _config.additionalTargets);
    me.ui.setURLHandler(openURL);

    return {
        /**
         * Open a URL according to the supported targets -> methods
         * @function
         * @param {boolean} isOutUrl
         * @param {string} url
         * @param {string} target
         * @param {object} outUrlMetaData
         * @returns {void}
         */
        URLHandler: openURL,
        /**
         * Track the URL click with the dialog web service
         * @function
         * @param {string} url
         * @params {string} target
         * @params {boolean} followOutUrl
         * @returns {void}
         */
        trackUrl: trackUrl
    };

    /**
     * Track the URL click with the dialog web service
     * @param {string} url
     * @params {string} target
     * @params {boolean} followOutUrl
     * @params metaData The meta data to be sent along with the request or null if none to be sent.
     * @returns {void}
     */
    function trackUrl(url, target, followOutUrl, metaData) {
        metaData = metaData || {};
        metaData.Loopback = {
            OutUrl: {
                Target: target,
                Follow: followOutUrl
            }
        };

        me.ui.sendQuery("",window.Nina.enums.Command.DialogTrackUrl, metaData);
    }

    /**
     * Open a URL according to the supported targets -> methods
     * @param {boolean} isOutUrl
     * @param {string} url
     * @param {string} target
     * @param {object} outUrlMetaData
     * @returns {void}
     */
    function openURL(isOutUrl, url, target, metaData) {
        var follow;

        if(isOutUrl) {
            target = metaData.hasOwnProperty("Target") ? metaData.Target : "";
            if( metaData.hasOwnProperty("Follow") ){
                follow = ( metaData.Follow === "true" ) ? true : false;
            }
            else{
                follow = me.honorOutUrl;
            }

            // bugfix for 6.0 as the new structure is metaData.OutUrl.Target / metaData.OutUrl.Follow
            if( metaData.hasOwnProperty("OutUrl") ){
                target = ("Target" in metaData.OutUrl) ? metaData.OutUrl.Target : "";
                follow = ("Follow" in metaData.OutUrl && metaData.OutUrl.Follow === "true") ? true : false;
            }

            if(!follow) {
                return;
            }
        }

        if (target === undefined || !me.targets.hasOwnProperty(target)) {
            target = "default";
        }

        me.targets[target](isOutUrl, url, metaData);
    }
};
/**
 * Created by .
 * User: jeff
 * Date: 1/25/11
 * Time: 10:14 AM
 * To change this template use File | Settings | File Templates.
 */

//= require ../common/jquerycompat

/**
 * @namespace
 */
window.Nina = window.Nina || {};

/**
 * @namespace
 */
window.Nina.helper = window.Nina.helper || {};
/**
 * @namespace
 */
window.Nina.helper.scripts = (function() {
	"use strict";
    var $ = window.Nina.$;


    /**
     * Retrieves the base path of the location the agent files are stored in
     * @param {string} scriptname
     * @returns {string}
     */
    function getScriptPath(scriptname) {
        scriptname = scriptname.toLowerCase();
        var scriptobjects = document.getElementsByTagName('script');
        for (var i = 0; i < scriptobjects.length; i++) {
            if (scriptobjects[i].src && scriptobjects[i].src.toLowerCase().lastIndexOf(scriptname) !== -1) {
                return scriptobjects[i].src.toString().substring(0, scriptobjects[i].src.toLowerCase().lastIndexOf(scriptname));
            }
        }
        return null;
    }

    return {
        getScriptPath: function(scriptName) { return getScriptPath(scriptName);},
        isScriptLoaded: function(scriptName) { return getScriptPath(scriptName) !== null; },
        loadScript: function(scriptName) {
            $.ajax(scriptName, {
                cache: true,
                dataType: "script"
            });
        }
    };
})();
/**
 * Created by .
 * User: Jeff
 * Date: 26/11/10
 * Time: 20:23
 * To change this template use File | Settings | File Templates.
 */

//= require ../common/jquerycompat
//= require ../helper/scripts
/**
 * @namespace
 */
window.Nina = window.Nina || {};
/**
 * @namespace
 */
window.Nina.config = window.Nina.config || {};

/**
 * @name window.Nina.config.Config
 * @class
 */

/**
 * @name window.Nina.config.CookiesParams
 * @class
 */

/**
 * @name window.Nina.config.FirstMessageParams
 * @class
 */

/**
 * @name window.Nina.config.UIParams
 * @class
 */

/**
 * @name window.Nina.config.DOMParams
 * @class
 */

/**
 * @name window.Nina.config.PopinParams
 * @class
 */

/**
 * @name window.Nina.config.SurveyParams
 * @class
 */

/**
 * @name window.Nina.config.WSParams
 * @class
 */

/**
 * Create a new config object based on the agent specific agent config
 * @param {Object} agentConfig
 * @returns {window.Nina.config.Config}
 */
window.Nina.config.newConfig = function(agentConfig) {
	"use strict";

    var defaultConfig = /** @lends window.Nina.config.Config.prototype */ {
        /**
         * The directory where the agent files are stored and the id of the div that will contain the virtual agent
         * It's automatically populated by sprockets.
         * @const
         * @type string
         * */
        agentId: "ipAustralia-block",
        /**
         * If the current ui is a popup or not
         * @const
         * @type boolean
         */
        popup: ("true" !== "true") && ("false" !== "true"),
        /**
         * The base directory where the files are hosted
         * @type string
         */
        baseDir: window.Nina.helper.scripts.getScriptPath("scripts/Nina"),
        /**
         * Cookies specific parameters
         * @type window.Nina.config.CookiesParams
         */
        cookies: /** @lends window.Nina.config.CookiesParams */{
            /**
             * The lifetime to assign to the persistent cookie
             * @type {int}
             * @default 30 days
             */
            lifeTimePersist: 30*24*60*60*1000,
            /**
             * Should we restrict the cookie to the current TLD rather than the current host
             * @type {boolean}
             * @default true
             */
            restrictDomain: true,
            /**
             * Number of . composing the TLD (not always 2 as ".something.co.uk" shows it) starting from the end.
             * @type {int}
             * @default 2
             * Altered this value to 3 to ensure .ipaustralia.gov.au domain registers the cookie correctly
             * the default value of 2 didn't work as it was set for .gov.au which was invalid
             */
            domainLevel: 3,
            /**
             *  Should we restrict the cookie to the current path
             *  @type {boolean}
             *  @default true
             */
            restrictPath: true,
            /**
             * Should we set the cookie as secure
             * @type {boolean}
             * @default true
             */
            secure: true,
            /**
             * Length of the interaction timeout. Used to figure out if a session is still alive
             * @type {int}
             * @default 5 minutes
             */
            timeoutInteraction: 5*60*1000,
            /**
             * How long before a livechat session times out without polling.
             * @type {int}
             * @default 30s
             */
            timeoutInteractionLiveChat: 30*1000,
            /**
             * Lifetime of a postQualif cookie
             * @type {int}
             * @default 7 days
             */
            lifeTimePostQualif: 7*24*60*60*1000
        },
        /**
         * Parameters specific to the FirstMessage module
         * @type window.Nina.config.FirstMessageParams
         */
        firstMessage: /** @lends window.Nina.config.FirstMessageParams */{
            /**
             * Message (HTML) asking the user to click to retrieve the transcript of the current chat (when switching from one page to another
             * The link triggering the transcript retrieval must have the class nw_TranscriptLink
             * @type {string}
             */
            transcriptMessage: "<span class=\"nw_TranscriptLink\">Click here to retrieve the chat transcript.</span>",
            /**
             * Message (HTML) displayed when the user asks to retrieve the chat transcript after the chat session has timed out
             * @type {string}
             */
            sessionExpiredMessage: "I'm sorry, I cannot retrieve the transcript because your session timed out",
            /**
             * Message (HTML) displayed when opening the UI and there is no ongoing session. It can be a string or a function.
             * If it is a function, it will be called and the return value will be used as the welcome message. This allows
             * to have dynamic welcome messages
             * @type {string|function():string}
             */
            welcome: "Hi, I'm your virtual agent. Just type your question below and I'll be glad to help you."
        },
        /**
         * Parameters specific to the various UI modules (ui, displayhistory, displaysingle, bubble)
         * @type window.Nina.config.UIParams
         */
        ui: /** @lends window.Nina.config.UIParams */{
            /**
             * The version of the UI. Injected by Grunt based on package.json and build #
             * @type {string}
             */
            version: "ipAustraliaBlock-201607221846",
            /**
             * The date and time the build of the UI took place. Automatically generated during build in the client's Gruntfile
             * @type {string}
             */
            date: "2016-07-27 08:01",
            /**
             * The maximum length of a user query
             * @type {int}
             * @default 110
             */
            maxInputLength: 110,
            /**
             * The separator added after the name of the emitter of the message in an history UI.
             * @type {string}
             * @default :&nbsp;
             */
            headerSeparator: ":&nbsp;",
            /**
             * Emitter's name when the virtual agent is speaking in an history UI
             * @type {string}
             * @default ""
             */
            headerAgent: "Agent",
            /**
             * Emitter's name for system messages in an history UI
             * @type {string}
             * @default ""
             */
            headerSystem: "",
            /**
             * Emitter's name for error messages in an history UI
             * @type {string}
             * @default ""
             */
            headerError: "",
            /**
             * Emitter's name for user mesages in an history UI
             * @type {string}
             * @default You
             */
            headerUser: "You",
            /**
             * Emitter's name for CSR messages (if we don't know the name of the specific CSR in an history UI
             * @type {string}
             * @default CSR
             */
            defaultCSRName: "CSR",
            /**
             * Text to display as the user friendly query text when sending data from content forms
             * @type {string}
             * @default "Sent form data"
             */
            sendFormDataMessage: "Sent form data",
            /**
             * Text to display in the status message while the virtual agent service is processing the query
             * @type {string}
             * @default Bot is typing ...
             */
            botIsTyping: "Bot is typing ...",
            /**
             * Text to display in the status message while the CSR is writing status is true as returned by the web service
             * @type {string}
             * @default CSR is typing ...
             */
            csrIsTyping: "CSR is typing ...",
            /**
             * Text to display in the status message telling the user how many characters are left before he reaches the
             * maximum. The sequence ##CHARSLEFT## will be replaced by the actual number of characters left.
             * @type {string}
             * @default ##CHARSLEFT## characters left
             */
            charsLeft: "##CHARSLEFT## characters left",
            /**
             * Array of the available text sizes in an history UI. If empty, do not let the user change the text size
             * @type {Array.<int>}
             * @default []
             */
            textSizes: [],
            /**
             * Index of the default text size used. Any change will move from there inside the array
             * @type {int}
             * @default 0
             */
            initTextSizeIndex: 0,
            /**
             * Should the close button of the UI call window.close() as well . Automatically set by build script
             * @type {boolean}
             */
            closeWindow: ("true" !== "true"),
            /**
             * For bubble UIs, defines the maximum height of the bubble
             * @type {int}
             * @default 140
             */
            maxHeightBubble: 140,
            /**
             * For bubble UIs, the height of the middle part of the bubble will be equal to the text height minus this value
             * @type {int}
             * @default 5 px
             */
            deltaMiddleBubble: 5,
            /**
             * Duration of the animation morphing the bubble from one size to another
             * @type {int}
             * @default 300 ms
             */
            speedAnimationBubble: 300,
            /**
             * Shall we empty the input upon form submission
             * @type {boolean}
             * @default true
             */
            emptyInputUponSubmission: true,
            /**
             * Array containing processors from window.Nina.text.Processors
             * @type {array}
             * @default []
             */
            textProcessorsList: [],
            /**
             * If the response contains the additional field "coBrowsingUrl" set from NIQS, automatically load it.
             */
            loadCoBrowsingUrl: true,
            /**
             * If "loadCoBrowsingUrl" is set to true, you can force the URL to open in a new window by also
             * setting "openCoBrowsingUrlInNewWindow" to true.
             * /!\ WARNING: this will do a window.open() when we receive the agent response, and will
             *              generally trigger the popup blocker of the user browser.
             */
            openCoBrowsingUrlInNewWindow: false,
            /**
             * If the UI is identified as a NinaChat UI, it will set "tap" as the datasource when a link is clicked.
             */
            ninaChatUi: false

        },
        uisync: {
            MissingInteractionsText: "You seem to have opened the virtual agent multiple times. Click <span class=\"nw_TranscriptLink\">here</span> to synchronize your sessions"
        },
        notifications: {
            alwaysShowNotifications: false,
            displayTime: 3000,
            maxLength: 100,
            title: "Virtual Agent",
            icon: ""
        },
        /**
         * Parameters for the dominject module
         * @type window.Nina.config.DOMParams
         */
        dom: /** @lends window.Nina.config.DOMParams */ {
            /**
             * The HTML of the agent to inject into the hosting page
             * Set it to the HTML_AGENT sprocket variable to have the build script replace it with the value contained
             * in the agent.html file
             * @type {string}
             * @const
             */
            agentHTML: "",
            /**
             * The HTML of the minimized version of the agent for popins to inject into the hosting page.
             * Set it to the HTML_AGENT_MIN sprocket variable to have the build script replace it with the value contained
             * in the agent.html file
             * @type {string}
             * @const
             */
            agentMinHTML: ""
        },
        /**
         * Parameters for the popin module
         * @type window.Nina.config.PopinParams
         */
        popin: /** @lends window.Nina.config.PopinParams */ {
            /**
             * Is the popin resizable?
             * @type {boolean}
             * @default true
             */
            resizable: true,
            /**
             * Is the popin draggable?
             * @type {boolean}
             * @default true
             */
            draggable: true,
            /**
             * Should we change the opacity of the popin while moving it? WARNING, this can trigger weird bugs in older versions
             * of IE (6,7,8) where the input text box becomes unresponsive (actually applying CSS filters with a position fixed
             * div seems to be problematic)
             * @type {number|boolean}
             * @default false
             */
            opacity: false,
            /**
             * Use the IE6 position fixed emulation code for IE7 and 8 as well. Can be used to work around some weird bug
             * with position fixed and CSS filter in IE.
             * @type {boolean}
             * @default false
             */
            forceAbsoluteIE78: false,
            /**
             * Minimum width of the popin in pixels
             * @type {int}
             * @default 200
             */
            minWidth: 200,
            /**
             * Minimum height of the popin in pixels
             * @type {int}
             * @default 300
             */
            minHeight: 300,
            /** Maximum width of the popin in pixels
             * @type {int}
             * @default 500
             */
            maxWidth: 500,
            /** Maximum width of the popin in pixels
             * @type {int}
             * @default 600
             */
            maxHeight:600,
            /**
             * The initial position of the popin when opening and we have no previous position stored.
             * The CSS should still contain some position information
             * It contains 3 properties: "what", "x", "y".
             * "what" indicates where from the screen we position relative to (left/middle/right top/middle/bottom)
             * "x" indicates the x offset from the considered base location
             * "y" indicates the y offset from the considered base location
             * @type {object}
             */
            posPopin: {
                what: "right bottom",
                x: -100,
                y: -100
            },
            /**
             * The position of the minimized popin
             * The CSS should still contain some position information
             * It contains 3 properties: "what", "x", "y".
             * "what" (string) indicates where from the screen we position relative to (left/middle/right top/middle/bottom)
             * "x" (int) indicates the x offset from the considered base location
             * "y" (int) indicates the y offset from the considered base location
             * @type {object}
             */
            posMin: {
                what: "right bottom",
                x: -10,
                y: -10
            },
            /**
             * Do we delete the session when we close the popin?
             * @type {boolean}
             * @default false
             */
            deleteSessionOnClose: false,
            /**
             * Configure if the default collapse/expand actions are animated or not.
             */
            animated: true
        },
        /**
         * Parameters for the beam module
         * @type window.Nina.config.PopinParams
         */
        beam: /** @lends window.Nina.config.PopinParams */ {
            /**
             * Weither the beam UI has a fixed position or stays at the top of the document.
             * @type {boolean}
             */
            fixedMode: true,
            /**
             * If true, the beam UI will be displayed at the bottom of the document.
             * @type {boolean}
             */
            bottom: false
        },
        /**
         * Parameters for the survey module (survey)
         * @type window.Nina.config.SurveyParams
         */
        survey: {
            bannerAnimation: "slide", // slide | fade | show
            bannerFadesAfter: 5,
            verbatimMaxLength: 400
        },
        /**
         * Parameters for the web service modules (jbotservice, jtranscriptservice and jqualification)
         * @type window.Nina.config.WSParams
         */
        ws: /** @lends window.Nina.config.WSParams */{
            /**
             * The details for the preprod mode
             * It contains 2 properties "base_url" and "debug"
             * "base_url" (string) contains the directory of the webservice (before jbotservice.asmx). Must end with a trailing /
           * "use_smart_router" (boolean) defines if the UI will connect to the smart-router
           * "smart_router_endpoint" The address of the smart-router, e.g.: "http://smartrouter.dev.local:7768/ui/pikachu"
           * "sr_agent_endpoint" The agent namespace on which the UI will talk, e.g.: "agent/White-Rabbit-EnglishUS"
             * "debug" (boolean) defines if we'll call the web service in debug mode (more information returned)
             */
            preprod: {
                houstonURL: "https://agent-preprod.au.nod.nuance.com/houston/houston.html",
                houstonURL_IE89: "https://agent-preprod.au.nod.nuance.com/houston/houston_ie89.js",
                base_url: {
                    "AS": "https://agent-preprod-as.au.nod.nuance.com/ipaustralia-service_au-englishus-WebBotRouter/",
                    "AM": "https://agent-preprod-am.au.nod.nuance.com/ipaustralia-service_au-englishus-WebBotRouter/"
                },
                use_smart_router: false,
                smart_router_endpoint: "",
                sr_agent_endpoint: "",
                debug: true
            },
            /**
             * The details for the production mode
             * It contains 2 properties "base_url" and "debug"
             * "base_url" (string) contains the directory of the webservice (before jbotservice.asmx). Must end with a trailing /
           * "use_smart_router" (boolean) defines if the UI will connect to the smart-router
           * "smart_router_endpoint" The address of the smart-router, e.g.: "http://smartrouter.dev.local:7768/ui/pikachu"
           * "sr_agent_endpoint" The agent namespace on which the UI will talk, e.g.: "agent/White-Rabbit-EnglishUS"
             * "debug" (boolean) defines if we'll call the web service in debug mode (more information returned)
             */
            prod: {
                houstonURL: "https://agent.au.nod.nuance.com/houston/houston.html",
                houstonURL_IE89: "https://agent.au.nod.nuance.com/houston/houston_ie89.js",
                base_url: {
                    "AS": "https://agent-as.au.nod.nuance.com/ipaustralia-service_au-englishus-WebBotRouter/",
                    "AM": "https://agent-am.au.nod.nuance.com/ipaustralia-service_au-englishus-WebBotRouter/"
                },
                use_smart_router: false,
                smart_router_endpoint: "",
                sr_agent_endpoint: "",
                debug: false
            },
            /**
             * # of seconds to wait before considering the service timed out
             * @type {int}
             * @default 10 seconds
             */
            timeoutQuery: 10,
            /**
             * # of seconds before retrying polling the web service when in livechat mode and running into an error
             * @type {int}
             * @default 5 seconds
             */
            livechatRetryDelay: 5,
            /**
             * Maximum # of poll retries in livechat mode after getting an error
             * @type {int}
             */
            livechatMaxErrors: 16,
            /**
             * Message to display after the service timed out or the response is invalid
             * @type {string}
             * @default Error while contacting the service
             */
            errorMessage: "Error while contacting service",
            /**
             * Message to display when the query URL is too long (> 2048) and cannot be sent
             * @type {string}
             * @default Error request URL too long
             */
            urltoolong: "Error request URL too long",
            /**
             * Message to display when too many pending queries have accumulated
             * @type {string}
             * @default Too many pending queries
             */
            tooManyQueries: "Too many pending queries",
            /**
             * Maximum # of pending queries. If the UI tries to send another query, the system will return an error message
             * @type {int}
             * @default 16
             */
            maxQueries: 16,
            /**
             * Should we use the persistent cookie and send its content to the service
             * @type {boolean}
             * @default false
             */
            usePersistent: false,
            /**
             * Map to replace interactions in the Transcript ("" will remove the Q&A).
             * @type {object}
             * @default {}
             *
             */
            transcriptFilter: {
                "##SkipAlyze#": "(Command sent)"
            },
            /**
             * The transcriptFilter above replaces the whole sentence if it contains the filtered string.
             * This filter will replace only the matched part of the sentence.
             * It allows the use of regexs. For each rule, it will do on each human sentence:
             * humanSentence = humanSentence.replace(new RegExp("toReplace", "g"), "replacingString");
             */
            transcriptRegexReplaceFilter: {
                "^Click URL: ": "(Click) ",
                "^Click: ": "(Click) "
            },
            /**
             * Permit to ask the WBH to add the NLE results in the response (if enabled in the agent config).
             */
            nleResults: false
        },
        avatar: {
            init: "",
            loop: "",
            staticImage: "",
            frameRate: 12.0,
            /* To move the clips inside avtLoader */
            clipPosition: [0,0],
            mapAnim: {},
            /**
             * Should we replace the flash avatar with a static image on mobile devices? (FYI, even when flash is enabled, transparent animations are not supported)
             * @type (boolean)
             * @default false
             */
            staticOnMobileDevices: false
        },
        url: {
            /**
             * Global default that governs whether the UI will follow urls supplied by the agent in the event that the
             * agent doesn't explicitly tell the UI what to do.
             *
             * This property works for 5.x agents only.  For 6.x agents and greater, the "out url" link is always
             * followed.
             */
            honorOutUrl: true,
            additionalTargets: {}
        },
        webtrends: {
            pageDataFeed: null
        }
    };
  return window.Nina.$.extend(true, defaultConfig, agentConfig);
};

/*
    http://www.JSON.org/json2.js
    2010-08-25

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.
    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

/**
 * Created by IntelliJ IDEA.
 * User: Jeff
 * Date: 11/16/10
 * Time: 4:51 PM
 * To change this template use File | Settings | File Templates.
 */

//= require ../../libs/json2/json2

window.Nina = window.Nina || {};
/**
 * @namespace
 */
window.Nina.storage = window.Nina.storage || {};

//dirty hack to have the sci as a global var
window.Nina.storage.sci = '';
/**
 * @name window.Nina.storage.CookiesJar
 * @class
 */

/**
 * Create a new cookies access interface
 * @param {string} _agentId
 * @param {Object} _config
 * @returns {window.Nina.storage.CookiesJar}
 */
window.Nina.storage.newCookiesJar = function newCookiesJar(_agentId,_config){
	"use strict";
	var $ = window.Nina.$;
    /** @private */
    var date = new Date();
    var me = {};
	/** @const **/
    me.lifeTimePersist = getCookie("nina-opt-out") ? "session" : _config.lifeTimePersist;
	/** @const **/
    me.domainLevel = _config.domainLevel;
	/** @const **/
    me.restrictDomain = _config.restrictDomain ? false : getDomain(document.location.hostname);
	/** @const **/
    me.restrictPath = _config.restrictPath ? false : "/";
	/** @const **/
    me.secure = _config.secure && document.location.protocol === "https:";
	/** @const **/
    me.timeoutInteraction = _config.timeoutInteraction;
	/** @const **/
	me.timeoutInteractionLiveChat = _config.timeoutInteractionLiveChat;
	/** @const **/
    me.lifeTimeSession = "session";
    /** @const **/
    me.lifeTimePostQualif = getCookie("nina-opt-out") ? "session" : _config.lifeTimePostQualif;

	/** @const **/
	me.agentId = _agentId;
	/** @const **/
	me.uiID = date.getTime() * Math.random() + date.getTime();
	/** @const **/
	me.preprodCookieName = "preprod";
	/** @const **/
	me.sciCookieName = "sci";
	/** @const **/
	me.uiIDCookieName = "uiID";
	/** @const **/
	me.lastInteractionCookieName = "lastInt";
	/** @const **/
	me.sessionCookieName = "Nina-" + me.agentId + "-session";
    /** @const **/
    me.persistentCookieName = "Nina-" + me.agentId + "-persist";
    /** @const **/
    me.postQualifCookieName = "Nina-" + me.agentId + "-postQualif";


    // If we're in preprod mode, let's store it
    window.NinaVars =  window.NinaVars || {};
    if(window.NinaVars.hasOwnProperty(me.preprodCookieName)) {
        set(me.sessionCookieName, me.preprodCookieName,window.NinaVars.preprod,me.lifeTimeSession);
    }

    //Check if preprod is set in session cookie. If this is the case, then we were in preprod mode and should continue to.
    var preprod = get(me.sessionCookieName, me.preprodCookieName);
    if(preprod !== null) {
        window.NinaVars.preprod = window.NinaVars.preprod || preprod;
    }

	// Disabled for now
	// TODO: figure out if overwriting the onbeforeunload callback is ok or not. It can impact other handlers ...
	// and it seems that bind("beforeunload", function() {}) does not work well in all cases
	var uiID = get(me.sessionCookieName, me.uiIDCookieName);
	/*
	if(!uiID || uiID == me.uiID) {
		// We're the only UI, set our own uiID
		set(me.sessionCookieName, me.uiIDCookieName,me.uiID,me.lifeTimeSession);
	}

	window.onbeforeunload = function(e) {
		if(isMainUI()) {
			remove(me.sessionCookieName, me.uiIDCookieName,me.lifeTimeSession);
		}
		return;
	};
    */

	function isMainUI() {
		var uiID =  get(me.sessionCookieName, me.uiIDCookieName);
		return !uiID || me.uiID === uiID;
	}

    /**
     * returns the domain name from a host name
     * @param {string} hostname
     * @returns {string}
     */
    function getDomain(hostname) {
        // Regex that will match an IP
        var ipRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/;
        if(ipRegex.test(hostname)) {
           return false;
        }

        var i = me.domainLevel;
        var idx = hostname.length;
        while(i>0) {
            idx = hostname.lastIndexOf(".",idx-1);
            if(idx === -1) {
                return false;
            }
            i--;
        }
        return hostname.substring(idx); // We're supposed to keep the leading . when this is not an FQDN
    }

    /**
     * Retrieve the content of a cookie by name.
     * @param {string} cookieName
     * @returns {string}
     */
    function getCookie( cookieName ) {
		/*only cookies for this domain and path will be retrieved */
		var cookieJar = document.cookie.split( "; " );
		for( var x = 0; x < cookieJar.length; x++ ) {
			var split = cookieJar[x].indexOf( '=' );
            var name = cookieJar[x].substring(0,split);
			if( name === encodeURIComponent(cookieName) ) { return decodeURIComponent(cookieJar[x].substring(split+1)); }
		}
		return null;
	}

    /**
     * Set a cookie to a certain value with a given lifetime, path, domain and secure attribute
     * @param {string} cookieName
     * @param {string} cookieValue
     * @param {(string|number)} lifeTime (in ms)
     * @param {string} path
     * @param {string} domain
     * @param {boolean} isSecure
     * @returns {boolean}
     */
	function setCookie( cookieName, cookieValue, lifeTime, path, domain, isSecure ) {
		if( !cookieName ) { return false; }

		document.cookie = encodeURIComponent(cookieName ) + "=" + encodeURIComponent(cookieValue ) +
			( lifeTime !== 'session' ? ";expires=" + ( new Date( ( new Date() ).getTime() + ( lifeTime ) ) ).toGMTString() : "" ) +
			( path ? ";path=" + path : "") + ( domain ? ";domain=" + domain : "") +
			( isSecure ? ";secure" : "");

		/*check if the cookie has been set/deleted as required*/
		if( lifeTime !== 'session' && lifeTime < 0 ) {
            return (typeof getCookie( cookieName ) !== "string");
        }
        return ( typeof getCookie( cookieName ) === "string" );
	}

    /**
     * Retrieves a property from the JSON obect stored inside the cookie
     * @param {string} cookieName
     * @param {string} name
     * @returns {string}
     */
    function get(cookieName, name) {
        var coVal = getCookie(cookieName);
        var objVal;
        try {
            objVal = JSON.parse(coVal);
        } catch(e) {
            objVal = null;
        }
        if(objVal !== null && objVal.hasOwnProperty(name)){
            return objVal[name];
        }
        if(name === 'sci'){
            return window.Nina.storage.sci;
        }
        return null;
    }

    /**
     * Sets a property to a certain value in the JSON object stored inside the cookie
     * @param {string} cookieName
     * @param {object} pairs
     * @param {(string|number)} lifetime
     */
    function set(cookieName, pairs, lifetime){
        var coVal, objVal;
        if(typeof cookieName !== "string" || typeof pairs !== "object"){
            return false;
        }
        coVal = getCookie(cookieName);
        try {
            objVal = JSON.parse(coVal);
        } catch(e) {
            objVal = null;
        }
        if( objVal === null ){
            objVal = {};
        }

        for( var name in pairs ){
            if( pairs.hasOwnProperty(name) ){
                objVal[name] = pairs[name];
                if( name === "sci" ){
                    window.Nina.storage.sci = pairs[name];
                }
            }
        }

        coVal = JSON.stringify(objVal);

        // Uses 4000 as the limit because the 4096 limit includes the name of the cookies (sometimes the = sign as well) and the expires & co directives
        // This code is here just to have a coherent return value. Trying to set a cookie with a string that's too large results in the value being discarded
        // but any existing value of the cookie would be left untouched
        if(coVal.length > 4000) {
            return false;
        }

        return setCookie(cookieName, coVal, lifetime, me.restrictPath, me.restrictDomain, me.secure);
    }

    function remove(cookieName, name, lifetime) {
        var coVal = getCookie(cookieName);
        var objVal;
        try {
            objVal = JSON.parse(coVal);
        } catch(e) {
            objVal = null;
        }
        if(objVal === null) {
            return;
        }

        if(objVal.hasOwnProperty(name)) {
            delete objVal[name];
        }
        coVal = JSON.stringify(objVal);
        if(coVal.length > 4000) {
            return false;
        }
        return setCookie(cookieName,coVal,lifetime,me.restrictPath, me.restrictDomain,me.secure);
    }

    /**
     * Invalidates a cookie
     * @name clear
     * @private
     * @param {string} cookieName
     * @returns {boolean}
     */
    function clear(cookieName) {
        return setCookie(cookieName,null,-1,me.restrictPath, me.restrictDomain, me.secure);
    }

    return /** @lends window.Nina.storage.CookiesJar.prototype */ {
        /**
         * Sets the name property of the session cookie to value
         * @param {string} name
         * @param {Object} value
         * @returns {boolean}
         *
         * use: setSession("sci", 123456);
         * use: setSession({'sci': 123456, 'lastInt': 123456789, 'preprod': true});
         */
        setSession: function() {
            var obj = {};
            if(arguments.length === 1 && typeof arguments[0] === "object" ){
                obj = arguments[0];
            }else if(arguments.length === 2 && typeof arguments[0] === "string"){
                obj[arguments[0]] = arguments[1];
            }else{
                return false;
            }
            return set(me.sessionCookieName, obj, me.lifeTimeSession);
        },
        /**
         * Gets the value of the name property of the session cookie
         * @param {string} name
         * @returns {Object}
         */
        getSession: function(name) {
            return get(me.sessionCookieName, name);
        },
        /**
         * Deletes a property from the session cookie
         * @param name
         * @returns {boolean}
         */
        removeSession: function(name) {
            return remove(me.sessionCookieName, name, me.lifeTimeSession);
        },
        /**
         * Clears the session cookie
         * @returns {boolean}
         */
        clearSession: function() {
            return clear(me.sessionCookieName);
        },
        /**
         * Sets the name property of the persistent cookie to value
         * @param {string} name
         * @param {Object} value
         * @returns {boolean}
         */
        setPersist: function() {
            var obj = {};
            if(arguments.length === 1 && typeof arguments[0] === "object" ){
                obj = arguments[0];
            }else if(arguments.length === 2 && typeof arguments[0] === "string"){
                obj[arguments[0]] = arguments[1];
            }else{
                return false;
            }
            return set(me.persistentCookieName, obj, me.lifeTimePersist);
        },
        /**
         * Gets the value of the name property of the persistent cookie
         * @param {string} name
         * @returns {Object}
         */
        getPersist: function(name) {
            return get(me.persistentCookieName, name);
        },
        /**
         * Set a cookie for postQualification purpose
         * @param name
         * @return {*}
         */
        setPostQualif: function(){
            var sci = this.getSession("sci");
            return setCookie(me.postQualifCookieName, sci, me.lifeTimePostQualif, me.restrictPath, me.restrictDomain, me.secure);
        },
        /**
         * Deletes a property from the session cookie
         * @param name
         * @returns {boolean}
         */
        removePersist: function(name) {
            return remove(me.persistentCookieName, name, me.lifeTimePersist);
        },
        /**
         * Clears the persistent cookie
         * @returns {boolean}
         */
        clearPersist: function() {
            return clear(me.persistentCookieName);
        },
        /**
         * Reads a raw cookie value. Helper function to access other cookies
         * @param {String} name the name of the cookie
         * @returns {string}
         */
        readCookie: function(name) {
            return getCookie(name);
        },
        /**
         * Sets a property to a certain value in the JSON object stored inside the cookie
         * @param {string} cookieName
         * @param {object} pairs
         * @param {(string|number)} lifetime
         */
        setCookie: function(cookieName, pairs, lifetime) {
            return set(cookieName, pairs, lifetime);
        },
        /**
         * Returns whether the current context id is still valid or if it has timed out
         * @returns {boolean}
         */
        isOngoingSession: function() {
            var sci = get(me.sessionCookieName, me.sciCookieName);
            var lastInt = get(me.sessionCookieName, me.lastInteractionCookieName);
            var lcstat = get(me.sessionCookieName, "lcstat");
            var timeout = (lcstat === true) ? me.timeoutInteractionLiveChat : me.timeoutInteraction;

            return !(sci === null || sci === "" || lastInt === null || ((new Date()).getTime() - lastInt) > timeout);
        },
        sessionCookieName: me.sessionCookieName,
        persistentCookieName: me.persistentCookieName,
        postQualifCookieName: me.postQualifCookieName,
        /**
         * Returns whether the current instance of the UI is a main UI (only UI opened or "first" UI opened
         * @function
         * @returns {boolean}
         */
        isMainUI: isMainUI,
        uiID: me.uiID
    };
};

/**
 * Created by .
 * User: Jeff
 * Date: 11/30/10
 * Time: 9:46 AM
 * To change this template use File | Settings | File Templates.
 */

//= require ../common/jquerycompat
//= require ../common/cookies

/**
 * @namespace
 */
window.Nina = window.Nina || {};
/**
 * @namespace
 */
window.Nina.ui = window.Nina.ui || {};

/**
 * Inject a popin / embedded agent HTML inside the DOM
 * @param _agentId
 * @param _config
 */
window.Nina.ui.DOMInject = function(_agentId, _config) {
	"use strict";
    var $ = window.Nina.$;

    var me = {};
    me.agentId = _agentId;

    me.popin = $("#" + me.agentId);
    if(_config.popinHTML !== "") {
        if(me.popin.length === 0) {
            me.popin = $(_config.agentHTML).appendTo('body');
        } else {
            me.popin.replaceWith(_config.agentHTML);
        }
    }

    me.popinMin = $("#" + me.agentId + "-min");
    if(_config.popinMinHTML !== "") {
        if(me.popinMin.length === 0) {
            me.popinMin = $(_config.agentMinHTML).appendTo('body');
        } else {
            me.popinMin.replaceWith(_config.agentMinHTML);
        }
    }

    return $("#" + me.agentId);
};
/* Modernizr 2.8.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-backgroundsize-csstransitions-input-inlinesvg-svg-prefixed-testprop-testallprops-domprefixes-cors
 */
;



window.Modernizr = (function( window, document, undefined ) {

    var version = '2.8.3',

    Modernizr = {},


    docElement = document.documentElement,

    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    inputElem  = document.createElement('input')  ,


    toString = {}.toString,    omPrefixes = 'Webkit Moz O ms',

    cssomPrefixes = omPrefixes.split(' '),

    domPrefixes = omPrefixes.toLowerCase().split(' '),

    ns = {'svg': 'http://www.w3.org/2000/svg'},

    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName,



    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function (object, property) { 
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }


    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F();

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    function setCss( str ) {
        mStyle.cssText = str;
    }

    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    function is( obj, type ) {
        return typeof obj === type;
    }

    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    function testProps( props, prefixed ) {
        for ( var i in props ) {
            var prop = props[i];
            if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }

    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                            if (elem === false) return props[i];

                            if (is(item, 'function')){
                                return item.bind(elem || obj);
                }

                            return item;
            }
        }
        return false;
    }

    function testPropsAll( prop, prefixed, elem ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

            if(is(prefixed, "string") || is(prefixed, "undefined")) {
          return testProps(props, prefixed);

            } else {
          props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
          return testDOMProps(props, prefixed, elem);
        }
    }    tests['backgroundsize'] = function() {
        return testPropsAll('backgroundSize');
    };


    tests['csstransitions'] = function() {
        return testPropsAll('transition');
    };



    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };

    tests['inlinesvg'] = function() {
      var div = document.createElement('div');
      div.innerHTML = '<svg/>';
      return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };    function webforms() {
                                            Modernizr['input'] = (function( props ) {
            for ( var i = 0, len = props.length; i < len; i++ ) {
                attrs[ props[i] ] = !!(props[i] in inputElem);
            }
            if (attrs.list){
                                  attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
            }
            return attrs;
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
        }
    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
                                    featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }

    Modernizr.input || webforms();


     Modernizr.addTest = function ( feature, test ) {
       if ( typeof feature == 'object' ) {
         for ( var key in feature ) {
           if ( hasOwnProp( feature, key ) ) {
             Modernizr.addTest( key, feature[ key ] );
           }
         }
       } else {

         feature = feature.toLowerCase();

         if ( Modernizr[feature] !== undefined ) {
                                              return Modernizr;
         }

         test = typeof test == 'function' ? test() : test;

         if (typeof enableClasses !== "undefined" && enableClasses) {
           docElement.className += ' ' + (test ? '' : 'no-') + feature;
         }
         Modernizr[feature] = test;

       }

       return Modernizr; 
     };


    setCss('');
    modElem = inputElem = null;


    Modernizr._version      = version;

    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;



    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };

    Modernizr.testAllProps  = testPropsAll;


    Modernizr.prefixed      = function(prop, obj, elem){
      if(!obj) {
        return testPropsAll(prop, 'pfx');
      } else {
            return testPropsAll(prop, obj, elem);
      }
    };



    return Modernizr;

})(this, this.document);
// cors
// By Theodoor van Donge
Modernizr.addTest('cors', !!(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()));;
//= require ../common/jquerycompat
//= require ../../libs/modernizr/modernizr.custom

window.Modernizr = window.Modernizr || {};

// Input Placeholder
// Author: @jethrolarson
//License: MIT, GPL, or WTFPL
(function($){
    //id itterator if the inputs don't have ids
    if( 'object' !== typeof Modernizr.input || Modernizr.input.placeholder ){
        return;
    }
    var phid=0;
    $.fn.placeholder = function(){
        return this.bind({
            focus: function(){
                $(this).parent().addClass('placeholder-focus');
            },blur: function(){
                $(this).parent().removeClass('placeholder-focus');
            },'keyup input change': function(){
                $(this).parent().toggleClass('placeholder-changed',this.value!=='');
            }
        }).each(function(){
                var $this = $(this);
                //Adds an id to elements if absent
                if(!this.id) this.id='ph_'+(phid++);
                //Create input wrapper with label for placeholder. Also sets the for attribute to the id of the input if it exists.
                $('<span class="placeholderWrap"><label for="'+this.id+'">'+$this.attr('placeholder')+'</label></span>')
                    .insertAfter($this)
                    .append($this);
                //Disables default placeholder
                $this.attr('placeholder','').keyup();

                //fixes lack of event for autocomplete in firefox < 4:'(
                if($.browser.mozilla && $.browser.version.slice(0,3) == "1.9"){
                    $this.focus(function(){
                        var val = this.value,
                            el = this,
                            $el = $(this);
                        $el.data('ph_timer', setInterval(function(){
                            if(val != el.value){
                                $el.change();
                            }
                        },100));
                    }).blur(function(){
                            clearInterval($(this).data('ph_timer'));
                        });
                }
            });
    };

    //Default plugin invocation
    $(function(){
        $('input[placeholder]').placeholder();
    });
})(window.Nina.$);

/* ADD THIS CSS TO YOUR AGENT
 *  .placeholderWrap{
 *    position: relative;
 *    display: inline-block;}
 *  .placeholderWrap label{
 *    color: #555;
 *    position: absolute;
 *    top: 5px; left: 5px; // Might have to adjust this based on font-size
 *    pointer-events: none;
 *    display: block;}
 *
 *  .placeholder-focus label{
 *    color: #999;} // could use a css animation here if desired
 *
 *  .placeholder-changed label{
 *    display: none;}

*/
/**
 * Created by IntelliJ IDEA.
 * User: Jeff
 * Date: 11/11/10
 * Time: 1:36 PM
 * To change this template use File | Settings | File Templates.
 */

window.Nina = window.Nina || {};
/**
 * @namespace
 */
window.Nina.enums = window.Nina.enums || {};

/**
 * Enum for the various author types
 * @enum {string}
 */
window.Nina.enums.Author = {
    CSR: "AuthorCSR",
    Agent: "AuthorAgent",
    User: "AuthorUser",
    System: "AuthorSystem",
    Error: "AuthorError"
};

/**
 * Enum for the different dialog web service "commands"
 * @enum {string}
 */
window.Nina.enums.Command = {
    LivechatPoll: "##LiveChatPoll",
	LivechatEnd: "##SkipAlyze#LiveChatEndConversation",
	DialogFollowUp: "##FollowUp",
	DialogTrackUrl: "##Url#",
	DialogFirstInit: "##FirstInit",
    DialogTimeOut: "##TimeOut",
	DialogRemark: "##Remark#",
    DialogContinue: "##SkipAlyze#Continue",
    DialogFormData: "##SkipAlyze#FormData",
    DialogSkipAlyze: "##SkipAlyze#",
    DialogBack: "##Back",
    DialogVersion: "##Version",
    SendParams: "##SkipAlyze#Params",
    StartSurvey: "##SkipAlyze#StartSurvey",
    AbortSurvey: "##SkipAlyze#AbortSurvey"
};

/**
 * Enum for the various service response code
 * @enum {string}
 */
window.Nina.enums.ResponseCode = {
    Found: "Found",
    Default: "Default",
    Command: "Command",
    EmptyAnswer: "EmptyAnswer",
    IgnoreInit: "IgnoreInit",
	Simple: "Simple",
	InvalidSession: "InvalidSession",
	ErrorRouterException: "ErrorRouterException",
	ErrorMaxSessions: "ErrorMaxSessions",
	ErrorInputTooLong: "ErrorInputTooLong",
	ErrorInvalidContext: "ErrorInvalidContext",
	ErrorAgentException: "ErrorAgentException",
	ErrorNoOutput: "ErrorNoOutput",
	ErrorBack: "ErrorBack",
	ErrorInvalidSession: "ErrorInvalidSession",
	ErrorUnknownCommand: "ErrorUnknownCommand",
	ErrorDisabledCommand: "ErrorDisabledCommand",
	ErrorConcurrentQueries: "ErrorConcurrentQueries",
	ErrorInputEmpty: "ErrorInputEmpty"
};

/**
 * Enum for the various livechat status
 * @enum {number}
 */
window.Nina.enums.LivechatStatus = {
    NotStarted: 0,
    Waiting: 1,
    Ongoing: 2,
    Ended: 3
};

window.Nina.enums.serviceReponseNames = {
    talkAgentResponse: "TalkAgentResponse",
    postChatSurveyUrl: "PostChatSurvey",
    SCI: "@SCI",
    IID: "@IID",
    responseCode: "@ResponseCode",
    display: "Display",
    CSRIsWriting: "CSRIsWriting",
    CSRName: "CSRName",
    livechatId: "LiveChatId",
    livechatStatus: "LiveChatStatus",
    livechatConversation: "LivechatConversation",
    source: "Source",
    timetowaitbeforepoll: "TimeToWaitBeforePoll"


};

window.Nina.enums.CSS = {
    inputForm: "nw_Input",
    inputText: "nw_UserInputField",
    inputButton: "nw_UserSubmit",
    inputFocus: "nw_UserInputFocus",
    chat: "nw_Conversation",
    chatText: "nw_ConversationText",
    statusMessage: "nw_StatusMessage",
    lastUserQuery: "nw_LastUserQuery",
    closeButton: "nw_CloseX",
    handleDrag: "nw_HandleDrag",
    minimize: "nw_Minimize",
    maximize: "nw_Maximize",
    transcriptLink: "nw_TranscriptLink",
    authorCSR: "nw_CsrSays",
    authorUser: "nw_UserSays",
    authorSystem: "nw_SystemSays",
    authorAgent: "nw_AgentSays",
    authorError: "nw_ErrorSays"
};

window.Nina.enums.resizeHandles = {
    n: ".nw_HandleN",
    e: ".nw_HandleE",
    s: ".nw_HandleS",
    w: ".nw_HandleW",
    ne: ".nw_HandleNE",
    nw: ".nw_HandleNW",
    se: ".nw_HandleSE",
    sw: ".nw_HandleSW"
};

window.Nina.enums.sessionCookiesProperties = {
    x: "popinX",
    y: "popinY",
    state: "popinState",
    w: "popinW",
    h: "popinH",
    lcstat: "lcstat",
    cont: "cont",
    sci: "sci",
    iid: "iid",
    lastInt: "lastInt"
};

/**
 * Enum for the various events triggered
 * nina-<scriptName>-<event>
 * @enum {string}
 */

window.Nina.enums.uiEvents = {
    /* popin.js */
    popinShow: "nina-popin-show",
    popinHide: "nina-popin-hide",
    popinMinimize: "nina-popin-minimize",
    /* ui.js */
    uiClose: "nina-ui-close",
    surveyOpened: "nina-survey-opened",
    surveyClosed: "nina-survey-closed",
    surveyQuestionDisplayed: "nina-survey-question-displayed",
    surveyQuestionSent: "nina-survey-question-sent"
};

/**
 * Created by IntelliJ IDEA.
 * User: brice
 * Date: 23/06/11
 * Time: 15:29
 * To change this template use File | Settings | File Templates.
 */

//= require ../common/enum

/**
 * @namespace
 */
window.Nina = window.Nina || {};
/**
 * @namespace
 */
window.Nina.helper = window.Nina.helper || {};
/**
 * @namespace
 */
window.Nina.helper.newDebug = function(_ui, _cookiesJar) {
	"use strict";

	var me = {};
	me.ui = _ui;
	me.cookiesJar = _cookiesJar;

	var publicMethods = {
		newConversation: function(reload) {
			reload = ( undefined !== reload ) ? reload : true;
			me.cookiesJar.setSession("sci", "");
			if(reload){
                location.reload();
            }
		},
		getUIVersion: function() {
			return "ipAustraliaBlock-201607221846";
		},
		switchPreprodMode: function(reload) {
			reload = (reload !== "undefined") ? reload : true;
			if(publicMethods.isPreprodMode()) {
				me.cookiesJar.removeSession("preprod");
			} else {
				me.cookiesJar.setSession("preprod", "true");
			}
			if(reload){
				publicMethods.newConversation();
            }
		},
		isPreprodMode: function() {
            return me.cookiesJar.getSession("preprod") !== null;
		},
		createTicket: function(remark) {
			if(remark && remark !== "") {
				me.ui.sendQuery("",window.Nina.enums.Command.DialogRemark + remark, {});
			}
		},
		getAgentVersion: function() {
			me.ui.sendQuery("",window.Nina.enums.Command.DialogVersion, {});
		},
        displayCookies: function(){
            var cookies = [
                me.cookiesJar.sessionCookieName,
                me.cookiesJar.persistentCookieName,
                me.cookiesJar.postQualifCookieName
            ];

            for(var index = 0, len = cookies.length ; index < len ; index++ ){
                var cookieString = decodeURIComponent( me.cookiesJar.readCookie( cookies[index] ) );
                console.log(cookies[index] + ": ", cookieString);
            }
        }
	};
	return publicMethods;
};
/**
 * Created by IntelliJ IDEA.
 * User: Jeff
 * Date: 11/15/10
 * Time: 5:26 PM
 * To change this template use File | Settings | File Templates.
 */

//= require ../../libs/modernizr/modernizr.custom
//= require ../common/jquerycompat
//= require ../common/enum

/**
 * @namespace
 */
window.Nina = window.Nina || {};
/**
 * @namespace
 */
window.Nina.ws = window.Nina.ws || {};

/**
 * @name window.Nina.ws.Transcript
 * @class
 */
/**
 * @name window.Nina.ws.JTranscriptService
 * @class
 */

/**
 * Create a new Transcript object
 * @param {Object} data
 * @returns {window.Nina.ws.Transcript}
 */
window.Nina.ws.newTranscript = function(data, filter, regexFilter) {
	"use strict";
    var me = {};
    me.responseCode = "MissingResponseCode";
    me.interactions = [];
    me.filter = {};

    if(typeof data !== 'object' || ! data.hasOwnProperty("TranscriptOutput")) {
        me.responseCode = "InvalidResponse";
        me.text = "Invalid response from service";
        me.author = window.Nina.enums.Author.Error;
    } else {
        var response = data.TranscriptOutput;
        if(response.hasOwnProperty("@Code")) {
            me.responseCode = response["@Code"];
        }
        if(response.hasOwnProperty("Interaction")) {
            var inter = window.Nina.$.isArray(response.Interaction) ? response.Interaction : [response.Interaction];
            window.Nina.$.each(inter, function(index, value) {
                var agent = {
                    timestamp: value["@Timestamp"],
                    toDisplay: value.Agent,
                    author: window.Nina.enums.Author.Agent
                };
                var human = {
                    timestamp: value["@Timestamp"],
                    toDisplay: value.Human,
                    author: window.Nina.enums.Author.User
                };

                var filtered = false;
                //We apply filter on "human" interaction
                for(var f in filter){
                    if(human.toDisplay && human.toDisplay.indexOf(f) > -1){
                        if(filter[f] === ""){
                            filtered = true;
                        }else{
                            human.toDisplay = filter[f];
                        }
                    }
                }

                for (var rf in regexFilter) {
                    if (human.toDisplay) {
                        human.toDisplay = human.toDisplay.replace(new RegExp(rf, "g"), regexFilter[rf]);
                    }
                }

                //Don't add ##FirstInit
                if(!filtered){
                    if(!(index === 0 && human.toDisplay === window.Nina.enums.Command.DialogFirstInit )) {
                        me.interactions.push(human);
                    }
                    me.interactions.push(agent);
                }

            });
        }
    }
    return /** @lends window.Nina.ws.Transcript.prototype */ {
        /**
         * Returns the response code from the service
         * @returns {string}
         */
        getResponseCode: function() { return me.responseCode; },
        /**
         * Returns the interaction arrays
         * @returns {Array.<Object>}
         */
        getInteractions: function() { return me.interactions; }
    };
};
/**
 * Create a new JTranscriptService object
 * @param {Object} _config
 * @returns {window.Nina.ws.JTranscriptProxy}
 */
window.Nina.ws.newJTranscriptService = function(_config) {
    "use strict";

    var me = {};
    me.messageHandler = [];
    me.errorHandler = null;
    me.errorTimer = null;
    me.sending = false;
    me.filter = _config.transcriptFilter;
    me.regexFilter = _config.transcriptRegexReplaceFilter || {};
    me.useJSONP = _config.useJSONP;
    if (!Modernizr.cors) { // force JSONP for IE8 & 9
        me.useJSONP = true;
    }

    // Config parameters
    me.timeoutQuery = _config.timeoutQuery;
    me.errorMessage = _config.errorMessage;
    me.urltoolong = _config.urltoolong;

    me.preprod = window.Nina.$.isPlainObject(window.NinaVars) && window.NinaVars.hasOwnProperty("preprod");
    me.platform = me.preprod ? "preprod" : "prod";
    me.lastRequestFailed = false;

    if( isDualActiveEnabled() ){
        // ACTIVE/ACTIVE MODE
        // we check if there's a stored version in the session cookie
        var as = window.Nina.storage.activeSite;
        me.activeSite = doesBaseUrlContain(as) ? as : undefined;
    }

    function setUrls(){
        var platform = _config[me.platform],
            endpoint = "jagentservice.asmx/Transcript";

        // If base_url is a string, we're in basic mode. We set the url
        // If base_url is an object, we're in active/active mode.
        // 1. we check if we already know which site to pick
        // 2. if not, we will call houston at the first query, and set the urls again.

        if(isDualActiveEnabled() && doesBaseUrlContain(me.activeSite)){
            me.url = platform.base_url[me.activeSite] + endpoint;
        }else if(!isDualActiveEnabled()){
            me.url = platform.base_url + endpoint;
        }
    }

    setUrls();

    function isDualActiveEnabled(){
        var sites = _config[me.platform].base_url;
        return typeof sites === 'object' && !window.Nina.$.isEmptyObject(sites) ;
    }

    function doesBaseUrlContain(site){
        return _config[me.platform].base_url.hasOwnProperty(site);
    }

    me.lastRequestFailed = false;

    /**
     * Called when the web service responds
     * @param {Object} data
     * @returns {void}
     */
    function responseHandler(data) {
        if(me.errorTimer !== null) {
            window.clearTimeout(me.errorTimer);
            me.timer = null;
        }
        var transcript = window.Nina.ws.newTranscript(data, me.filter, me.regexFilter);
        if(transcript.getResponseCode()!== "Success") {
            if(window.Nina.$.isFunction(me.errorHandler)) {
                me.errorHandler(transcript.getResponseCode());
            }
            me.sending = false;
            return;
        }

        window.Nina.$.each(me.messageHandler, function(index, handler) {
            if(window.Nina.$.isFunction(handler)) {
                handler(transcript);
            }
        });
        me.sending = false;
    }

    /**
     * Called when an error occurs
     * @returns {void}
     */
    function errorHandler() {
        window.clearTimeout(me.errorTimer);
        me.errorTimer = null;
        if(window.Nina.$.isFunction(me.errorHandler)) {
            me.errorHandler(me.errorMessage);
        }
        me.sending = false;
    }

    /**
     * Retrieves the transcript for the specified context id
     * @param {string} sci
     * @returns {boolean}
     */
    function retrieveTranscript(sci) {
        me.sending = true;
        var date = new Date();
        var rand = date.getTime() * Math.random() + date.getTime();

        if (!me.useJSONP) {
            window.Nina.$.post(me.url, "SCI=" + sci + "&rnd=" + rand, responseHandler, "json").fail(errorHandler);
        }
        else { // JSONP
            var url = me.url + "?SCI=" + sci + "&rnd=" + rand + "&Callback=?";
            // IE cannot open URLs longer than 2083 characters (at most 2048 in path part)
            if(url.length > 2048) {
                if(window.Nina.$.isFunction(me.errorHandler)) {
                    me.errorHandler(me.urltoolong);
                }
                return false;
            }
            // With jQuery 1.x the .fail() callback is not called unfortunately. Relying on the errorTimer
            window.Nina.$.getJSON(url,responseHandler).fail(errorHandler);
        }

        me.errorTimer = window.setTimeout(errorHandler,me.timeoutQuery*1000);
        return true;
    }

    return /** @lends window.Nina.ws.JTranscriptService.prototype */ {
        /**
         * Retrieve a transcript for the specified context id
         * @param {string} _sci
         * @returns {boolean}
         */
        getTranscript: function(_sci) {
            // Already querying the service, abort.
            if(me.sending) {
                return false;
            }
            return retrieveTranscript(_sci);
        },
        /**
         * Sets the message handler that will receive the transcript
         * @param {function(window.Nina.ws.Transcript):void} handler
         * @returns {void}
         */
        addMessageHandler: function(handler) {
            me.messageHandler.push(handler);
        },
        /**
         * Sets the error handler that will receive any error message
         * @param {function(string):void} handler
         * @returns {void}
         */
        setErrorHandler: function(handler) {
            me.errorHandler = handler;
        }

    };
};

/**
 * Created by IntelliJ IDEA.
 * User: Jeff
 * Date: 11/18/10
 * Time: 4:03 PM
 * To change this template use File | Settings | File Templates.
 */

//= require ../common/jquerycompat
//= require ../common/cookies
//= require ../common/enum
//= require ../webservice/jtranscriptservice.js

/**
 * @namespace
 */
window.Nina = window.Nina || {};
/**
 * @namespace
 */
window.Nina.ui = window.Nina.ui || {};

/**
 * Create a new FirstMessage object
 * @param {Object} _config
 * @param {window.Nina.storage.CookiesJar} _cookiesJar
 * @param {window.Nina.ui.UI} _ui
 * @param {window.Nina.ws.JTranscriptService} _transcript
 * @returns {void}
 */
window.Nina.ui.newFirstMessage = function(_config, _cookiesJar, _ui, _transcript) {
	"use strict";
    var $ = window.Nina.$;
    var me = {};
    me.cookiesJar = _cookiesJar;
    me.ui = _ui;
    me.transcript = _transcript;

    // Config parameters
    me.welcome = _config.welcome;
    me.transcriptMessage = _config.transcriptMessage;
    me.sessionExpiredMessage = _config.sessionExpiredMessage;

    if(me.transcript !== null) {
        me.transcript.addMessageHandler(responseHandler);
        me.transcript.setErrorHandler(errorHandler);
    }

    // If we have no context id or if the last interaction was more than x minutes ago, we display a welcome message
    // and assume we're starting a new dialog
    if( !me.cookiesJar.isOngoingSession() ) {
        var welcomeSentence = $.isFunction(me.welcome) ? me.welcome() : me.welcome.toString();
        me.cookiesJar.removeSession("sci");
        me.cookiesJar.setSession("lcstat", false);
        if (welcomeSentence !== "") {
            me.ui.addChatLine("<span class='nw_Welcome'>"+welcomeSentence+"</span>", window.Nina.enums.Author.Agent);
        }
    } else {
        if(me.transcriptMessage !== "") {
            // Add the line to retrieve the transcript
            var trans = me.ui.addChatLine(me.transcriptMessage, window.Nina.enums.Author.System);
            var link = trans.find(".nw_TranscriptLink");
            link.click(handleGetTranscript);
        }

        // Send the query that corresponds to the use / case
        var lcstat = me.cookiesJar.getSession("lcstat");
        var send;
        var ad = {};
        if(lcstat === true) {
            send = window.Nina.enums.Command.LivechatPoll;
        } else {
            var continueDialog = me.cookiesJar.getSession("cont");
            if(continueDialog === "1") {
                send = window.Nina.enums.Command.DialogContinue;
            } else {
                send = window.Nina.enums.Command.DialogFollowUp;
                // This will prevent the UI from following a OutUrl that would be returned
                ad = { Loopback : { OutUrl : { Follow: false }, FollowUp: true } };
            }
        }
        me.ui.sendQuery("", send, ad);
    }

    /**
     * Retrieves the transcript for the current session
     * @returns {void}
     */
    function handleGetTranscript() {
        var sci = me.cookiesJar.getSession("sci");
        if(me.cookiesJar.isOngoingSession()) {
            me.transcript.getTranscript(sci);
        } else {
            errorHandler(me.sessionExpiredMessage);
        }

    }

    /**
     * Called by the JTranscriptService once we receive the transcript
     * @param {window.Nina.ws.Transcript} transcript
     * @returns {void}
     */
    function responseHandler(transcript) {
        me.ui.clearChatHistory();
        var  interactions = transcript.getInteractions();
        me.ui.addChatLines(interactions);
        //TODO
        //me.components.chatArea.css("scrollTop", me.components.chatText.prop("scrollHeight"));
    }

    /**
     * Called by the JTranscriptService if an error occurs
     * @param {string} errorMessage
     * @returns {void}
     */
    function errorHandler(errorMessage) {
        me.ui.addChatLine(errorMessage, window.Nina.enums.Author.Error);
    }
};
/**
 * Created by IntelliJ IDEA.
 * User: jeff
 * Date: 6/23/11
 * Time: 3:59 PM
 * To change this template use File | Settings | File Templates.
 */

/**
 * @namespace
 */
window.Nina = window.Nina|| {};
/**
 * @namespace
 */
window.Nina.helper = window.Nina.helper || {};
/**
 * @namespace
 */
window.Nina.helper.date = (function() {
	"use strict";

	return {
		/**
         * Convert a date object to an ISO 8601 string including the TimeZone indicator
         * @param {Date} d the date to convert to an ISO 8601 string
         * @returns {string} the ISO 8601 representation of the date
         */
		toISOString: function(d) {
			function pad(n) {
				return n < 10 ? '0' + n : n;
			}

			function pad2(n) {
				return n < 100 ? '0' + ( n < 10 ? '0' + n : n) : n;
			}

			var base, tzsign, tz, tzhours, tzmins;

			base = d.getFullYear() + '-' +
					pad(d.getMonth() + 1) + '-' +
					pad(d.getDate()) + 'T' +
					pad(d.getHours()) + ':' +
					pad(d.getMinutes()) + ':' +
					pad(d.getSeconds()) + "." +
					pad2(d.getMilliseconds());
			tz = d.getTimezoneOffset();
			tzsign = tz > 0 ? "-" : "+";
			tz = Math.abs(tz);
			tzhours = Math.floor(tz / 60);
			tzmins = tz - tzhours * 60;

			base = base + tzsign + pad(tzhours) + ":" + pad(tzmins);

			return base;
		},
		/**
         * Parses a string containing an ISO 8601 date
         * @param date an ISO 8601 date
         * @returns {Number} the date corresponding to the string
         */
		parse: function (date) {
			/**
             * @preserve
             * Date.parse with progressive enhancement for ISO 8601 <https://github.com/csnover/js-iso8601>
             * 2011 Colin Snover <http://zetafleet.com>
             * Released under MIT license.
             */
			var timestamp, struct, minutesOffset = 0, numericKeys = [ 1, 4, 5, 6, 7, 10, 11 ];

			// ES5 15.9.4.2 states that the string should attempt to be parsed as a Date Time String Format string
			// before falling back to any implementation-specific date parsing, so that's what we do, even if native
			// implementations could be faster
			//              1 YYYY                2 MM       3 DD            4 HH     5 mm        6 ss          7 msec        8 Z 9     10 tzHH     11 tzmm
			if ((struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2})?)?)?(?:T(\d{2}):?(\d{2})(?::?(\d{2})(?:[,.](\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?)?)?$/.exec(date))) {
				// avoid NaN timestamps caused by "undefined" values being passed to Date.UTC
				for (var i = 0, k; (k = numericKeys[i]); ++i) {
					struct[k] = +struct[k] || 0;
				}

				// allow undefined days and months
				struct[2] = (+struct[2] || 1) - 1;
				struct[3] = +struct[3] || 1;

				if (struct[8] !== 'Z' && struct[9] !== undefined) {
					minutesOffset = struct[10] * 60 + struct[11];

					if (struct[9] === '+') {
						minutesOffset = 0 - minutesOffset;
					}
				}

				timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
			}
			else {
				timestamp = Date.parse ? Date.parse(date) : NaN;
			}
			return timestamp;
		}
	};
}());

/**
 * Created by IntelliJ IDEA.
 * User: Jeff
 * Date: 11/15/10
 * Time: 5:26 PM
 * To change this template use File | Settings | File Templates.
 */

//= require ../../libs/modernizr/modernizr.custom
//= require ../common/jquerycompat
//= require ../helper/date
//= require ../common/cookies

/**
 * @namespace
 */
window.Nina = window.Nina || {};
/**
 * @namespace
 */
window.Nina.ws = window.Nina.ws || {};

/**
 * @name window.Nina.ws.JQualificationService
 * @class
 */

/**
 * Creates a new JQualificationService object
 * @param {Object} _config
 * @param {window.Nina.storage.CookiesJar} _cookiesJar
 * @returns {window.Nina.ws.JQualificationService}
 */
window.Nina.ws.newJQualificationService = function(_config, _cookiesJar) {
	"use strict";
    var $ = window.Nina.$,
        me = {};
    
    me.sending = false;
    me.cookiesJar = _cookiesJar;

    // Config parameters
    if($.isPlainObject(window.NinaVars) && window.NinaVars.hasOwnProperty("preprod")) {
        me.url = _config.preprod.base_url;
    } else {
        me.url = _config.prod.base_url;
    }
    me.url += "jbotservice.asmx/Qualification";
    me.timeoutQuery = _config.timeoutQuery;
    me.errorMessage = _config.errorMessage;
    me.urltoolong = _config.urltoolong;
    me.useJSONP = _config.useJSONP;
    if (!Modernizr.cors) { // force JSONP for IE8 & 9
        me.useJSONP = true;
    }

    /**
     * Send the qualification info to the webservice
     * @param {object} qualif
     * @returns {boolean}
     */
    function sendQualif( qualif ) {
        me.sending = true;
        var date = new Date();
        var rand = date.getTime() * Math.random() + date.getTime();

        if (!me.useJSONP) {
            window.Nina.$.post(me.url, {
                "Infos": JSON.stringify( qualif ),
                "Rnd": rand
            });
        }
        else { // JSONP
            // IE cannot open URLs longer than 2083 characters (at most 2048 in path part)
            var targetUrl = me.url + "?Infos=" + encodeURIComponent(JSON.stringify( qualif )) + "&Rnd=" + rand;
            if(targetUrl.length > 2048) {
                return false;
            }

            $.ajax({
                url: me.url,
                dataType: 'script',
                data: {
                    "Infos": JSON.stringify( qualif ),
                    "Rnd": rand
                }
            });
        }

        return true;
    }

    return /** @lends window.Nina.ws.JQualificationService.prototype */ {
        /**
         * Send the qualification data
         * @param {string} name
         * @param {string} value
         * @param {Date} date
         * @param {String} sci
         * @returns {boolean}
         */
        sendQualification: function(name, value, datetime, sci) {
            if(sci === undefined || sci === null || sci === "") {
                sci = me.cookiesJar.getSession("sci");
            }

            if(sci === null || sci === "") {
                return false;
            }

            if(typeof datetime !== "Date") {
                datetime = window.Nina.helper.date.toISOString( new Date());
            }
            var infos = {
                Info: [
                    {
                        SCI: sci,
                        Name: name,
                        DateTime: datetime,
                        Value: value
                    }
                ]
            };
            return sendQualif(infos);
        }
    };
};
/**
 * Copyright 2010-2013 Nuance Communications Inc. All rights reserved.
 */

//= require ../../libs/json2/json2
//= require ../../libs/modernizr/modernizr.custom
//= require ../common/jquerycompat
//= require ../common/enum
//= require ../common/cookies
//= require ../helper/date
/**
 * @namespace
 */
window.Nina = window.Nina || {};
/**
 * @namespace
 */
window.Nina.ws = window.Nina.ws || {};

/**
 * @name window.Nina.ws.Query
 * @class
 */
/**
 * @name window.Nina.ws.Interaction
 * @class
 */
/**
 * @name window.Nina.ws.JBotService
 * @class
 */

/**
 * Creates a new query
 * @param _sci {string} the context id to use for the query
 * @param _iid {string} the interlocutor id to use for the query
 * @param _userText {string} the user query to send
 * @param _additionalData {Object} any additional data to send to the web service. If the content of the additional data conflicts with existing basic nodes, they will be silently ignored
 * @returns {window.Nina.ws.Query}
 */
window.Nina.ws.newQuery = function newQuery(_sci, _iid, _userText, _additionalData) {
    "use strict";
    var me = {};
    me["@xmlns"] = "http://www.virtuoz.com";
    me["@SCI"] = _sci;
    me["@IID"] = _iid;
    me["@TimeStamp"] = window.Nina.helper.date.toISOString(new Date());
    me.UserText = _userText;

    for(var k in _additionalData) {
        if(k !== "@xmlns" && k !== "@SCI" && k !== "@IID" && k !== "UserText"){
            me[k] = _additionalData[k];
        }
    }

    return /** @lends window.Nina.ws.Query.prototype */ {
        /**
         * Returns the JSON string representation of the Query object
         * @returns {string}
         */
        toJSON: function() {
            return JSON.stringify(me);
        },
        /**
         * Returns current SCI.
         */
        getSCI: function() {
            return me["@SCI"];
        },
        /**
         * Returns current IID.
         */
        getIID: function() {
            return me["@IID"];
        },
        /**
         * Replaces SCI if the query was queued while waiting for the first answer.
         */
        setSCI: function(_sci) {
            me["@SCI"] = _sci;
        },
        /**
         * Replaces IID if the query was queued while waiting for the first answer.
         */
        setIID: function(_iid) {
            me["@IID"] = _iid;
        }
    };
};

/**
 * Creates a new Interaction from the JON response from the dialog web service
 * @param data {Object} the dialog web service response
 * @returns {window.Nina.ws.Interaction}
 */
window.Nina.ws.newInteraction = function newInteraction(data) {
    "use strict";
    var me = {};
    me.responseCode = "MissingResponseCode";
    me.sci = "";
    me.iid = "";
    me.author = window.Nina.enums.Author.Agent;
    me.text = "";
    me.gui = "";
    me.loop = "";
    me.url = "";
    me.timeout = "";
    me.timestamp = "";
    me.options = [];
    me.rewords = [];
    me.nleResults;
    me.sessionBootstrap;
    me.additionalData = {};
    me.engine = "default";

    me.livechatConversation = false;
    me.livechatStatus = 0;
    me.livechatPollTime = 0;
    me.livechatCSRName = "";
    me.livechatCSRIsWriting = false;
    me.livechatId = "";
    me.livechatInteractionIndex = null;

    var mandatoryFields = 0;

    if(typeof data !== 'object' || ! data.hasOwnProperty("TalkAgentResponse")) {
        me.responseCode = "InvalidResponse";
        me.text = "Invalid response from service";
        me.author = window.Nina.enums.Author.Error;
    } else {
        var response = data.TalkAgentResponse;
        for(var k in response) {
            if(response.hasOwnProperty(k)){
                switch(k) {
                    case "@SCI":
                        me.sci = response[k];
                        mandatoryFields++;
                        break;
                    case "@IID":
                        me.iid = response[k];
                        mandatoryFields++;
                        break;
                    case "@ResponseCode":
                        me.responseCode = response[k];
                        mandatoryFields++;
                        break;
                    case "@TimeStamp":
                        me.timestamp = response[k];
                        break;
                    case "@Version":
                        me.engine = response[k];
                        break;
                    case "Display":
                        processDisplayNode(response[k]);
                        mandatoryFields++;
                        break;
                    case "CSRIsWriting":
                        me.livechatCSRIsWriting = (removeNameSpaceAttributes(response[k]) === "true");
                        break;
                    case "CSRName":
                        me.livechatCSRName = removeNameSpaceAttributes(response[k]);
                        break;
                    case "LiveChatId":
                        me.livechatId = removeNameSpaceAttributes(response[k]);
                        break;
                    case "LiveChatStatus":
                        me.livechatStatus = parseInt(removeNameSpaceAttributes(response[k]), 10);
                        break;
                    case "LivechatConversation":
                            // WBH must see LivechatConversation to be in livechat mode (otherwise regular timeouts apply)
                        me.livechatConversation = (removeNameSpaceAttributes(response[k]) === "true");
                        break;
                    case "LivechatInteractionIndex":
                        var index = parseInt(removeNameSpaceAttributes(response[k]), 10);
                        if( !isNaN(index) ){
                            me.livechatInteractionIndex = index ;
                        }
                        break;
                    case "Source":
                        processLivechatSource(removeNameSpaceAttributes(response[k]));
                        break;
                    case "TimeToWaitBeforePoll":
                        me.livechatPollTime = parseInt(removeNameSpaceAttributes(response[k]), 10);
                        break;
                    case "TimeOut":
                        me.timeout = parseInt(removeNameSpaceAttributes(response[k]), 10);
                        break;
                    // The serialization use a different mechanism for the 4 following fields, so no namespace to remove.
                    case "OutOptions":
                        me.options = response[k].options;
                        break;
                    case "OutRewords":
                        me.rewords = response[k].rewords;
                        break;
                    case "nleResults":
                        me.nleResults = response.nleResults;
                        break;
                    case "sessionBootstrap":
                        me.sessionBootstrap = response.sessionBootstrap;
                        break;
                    default:
                        processAdditionalNode(k, response[k]);
                }
            }
        }
    }

    if(mandatoryFields<5) {
        me.author = window.Nina.enums.Author.Error;
    }

    // Replace any occurence of #FLASH_CID# by the actual context id
    me.text = insertContextId(me.text);
    me.url = insertContextId(me.url);

    /**
     * Takes text and replaces any occurences of #FLASH_CID# with the actual interaction context id.
     * @param {string} text
     * @returns {string}
     */
    function insertContextId(text) {
        return text.replace("#FLASH_CID#",me.sci);
    }

    /**
     * Sets the author property based on the livechat source field of the service response
     * @param {string} source
     * @returns {void}
     */
    function processLivechatSource(source) {
        switch(source) {
            case "System":
                me.author = window.Nina.enums.Author.System;
                break;
            case "CSR":
                me.author = window.Nina.enums.Author.CSR;
                break;
            default:
        }
    }

    /**
     * Iterates over the properties of the display node and extract the values of the Loop, OutGui, OutText, TimeOut and OutUrl parameters.
     * @param {Object} display
     * @returns {void}
     */
    function processDisplayNode(display) {
        for(var k in display) {
            if(display.hasOwnProperty(k)){
                switch(k) {
                    case "Loop":
                        me.loop = removeNameSpaceAttributes(display[k]);
                        break;
                    case "OutGui":
                        me.gui = removeNameSpaceAttributes(display[k]);
                        break;
                    case "OutText":
                        me.text = removeNameSpaceAttributes(display[k]);
                        mandatoryFields++;
                        break;
                    case "AlternateOutText":
                        me.alternateText = removeNameSpaceAttributes(display[k]);
                        break;
                    case "AlternateOutText2":
                        me.alternateText2 = removeNameSpaceAttributes(display[k]);
                        break;
                    case "TimeOut":
                        me.timeout = removeNameSpaceAttributes(display[k]);
                        break;
                    case "OutUrl":
                        me.url = removeNameSpaceAttributes(display[k]);
                        break;
                    default:
                }
            }
        }
    }

    /**
     * Add an additional data field to the response except if it is a namespace attribute
     * @param {string} name
     * @param {Object} object
     * @returns {void}
     */
    function processAdditionalNode(name, object) {
        // Xml namespace stuff, we don't care about
        if(name.indexOf("@xmlns") === 0) {
            return;
        }
        me.additionalData[name] = removeNameSpaceAttributes(object);
    }

    /**
     * Process a response node and remove any namespace attribute
     * @param {Object} node
     * @returns {(Object|string)}
     */
    function removeNameSpaceAttributes(node) {
        // This function looks for any xml namespace related attribute and remove them.
        // Additionally it will convert ##text node to a simple value if no other attribute is left
        if(typeof node === 'object') {
            if(window.Nina.$.isArray(node)) {
                // This is an Array
                window.Nina.$.each(node,function(index, value) {
                    node[index] = removeNameSpaceAttributes(value);
                });
            } else if(node !== null) {
                // This is an associative array
                var hasHHText = false;
                var count = 0;

                for(var k in node) {
                    if(node.hasOwnProperty(k)){
                        count++;

                        if(k.indexOf("@xmlns") === 0 || k.indexOf("@TempActiv") === 0) {
                            delete node[k];
                            count--;
                        } else if(k.indexOf("#text") === 0) {
                            hasHHText = true;
                        } else {
                            node[k] = removeNameSpaceAttributes(node[k]);
                        }
                    }
                }

                // It's a simple value so let's make it so.
                if(hasHHText && count === 1) {
                    node = node["#text"];
                }

                if(count === 0) {
                    node = "";
                }
            }

        }
        return node;
    }

    return /** @lends window.Nina.ws.Interaction.prototype */ {
        /**
         * Returns the response code of the response.
         * @returns {String}
         */
        getResponseCode: function() { return me.responseCode; },
        /**
         * Returns the context id of the interaction
         * @returns {string}
         */
        getSCI: function() {return me.sci; },
        /**
         * Returns the interlocutor id of the interaction
         * @returns {string}
         */
        getIID: function() {return me.iid; },
        /**
        * Returns the timestamp attribute if present
         * @returns {string}
        */
        getTimeStamp: function() { return me.timestamp; },
        /**
         * Returns the author of the interaction
         * @returns {window.Nina.enums.Author}
         */
        getAuthor: function() { return me.author;},
        /**
         * Returns the HTML text of the interaction
         * @returns {string}
         */
        getResponse: function() { return me.text; },
        /**
         * Returns an alternate version of the response, if any
         * @returns {string}
         */
        getAlternateResponse: function() { return me.alternateText; },
        /**
         * Returns an other alternate version of the response, if any
         * @returns {string}
         */
        getAlternateResponse2: function() { return me.alternateText2; },
        /**
         * Returns the extracted options, without html,
         * when the alternateOutText feature is activated.
         * @returns {array of string}
         */
        getOutOptions: function() { return me.options; },
        /**
         * Returns the extracted rewords, without html,
         * when the alternateOutText feature is activated.
         * @returns {array of string}
         */
        getOutRewords: function() { return me.rewords; },
        /**
         * Returns the NLE results, if any
         * @returns {array of NLE results}
         */
        getNleResults: function() { return me.nleResults; },
        /**
         * Returns the session bootstrap object, if activated
         * @returns {object}
         */
        getSessionBootstrap: function() { return me.sessionBootstrap; },
         /**
         * Returns the OutGui of the interaction
         * @returns {string}
         */
        getGUI: function() {return me.gui;},
        /**
         * Returns the OutUrl of the interaction
         * @returns {string}
         */
        getOutUrl: function() { return me.url;},
        /**
         * Returns the OutUrl metadata contained in the Loopback.OutUrl additional data property
         */
        getOutUrlMetadata: function() {
            // in 6.0 agent, loopback information is not in a Loopback.OutUrl node anymore.
            if( me.engine === 'default' ){
                return me.additionalData.hasOwnProperty("Loopback") && me.additionalData.Loopback.hasOwnProperty("OutUrl") ? me.additionalData.Loopback.OutUrl : {};
            }else if( +me.engine >= 6 ){
                return me.additionalData.hasOwnProperty("Loopback") ? me.additionalData.Loopback : {};
            }
        },
        /**
         * Returns the Loop field of the interaction
         * @returns {string}
         */
        getLoop: function() {return me.loop;},
        /**
         * Returns the TimeOut of the interaction
         * @returns {string}
         */
        getTimeOut: function() {return me.timeout;},
        /**
         * Returns the additional data (non standard fields) contained in the interaction
         * @returns {string}
         */
        getAdditionalData: function() {return me.additionalData;},
        /**
         * Returns whether the current interaction is part of a livechat conversation or a regular virtual agent chat.
         * @returns {boolean}
         */
        isLivechatConversation: function() {return me.livechatConversation; },
        /**
         * Returns the livechat status of the interaction
         * @returns {number}
         */
        getLivechatStatus: function() {return me.livechatStatus;},
        /**
         * Returns the livechat status of the interaction
         * @returns {number}
         */
        getLivechatPollTime: function() {return me.livechatPollTime;},
        /**
         * Returns the delay before the next livechat poll
         * @returns {number}
         */
        getLivechatCSRName: function() {return me.livechatCSRName;},
        /**
         * Returns whether the livechat CSR is typing
         * @returns {boolean}
         */
        isLivechatCSRWriting: function() {return me.livechatCSRIsWriting;},
        /**
         * Returns the livechat last interaction's index
         * @returns {number}
         */
        getLivechatInteractionIndex: function() {return me.livechatInteractionIndex;},
        /**
         * Returns the livechat CSR's name
         * @returns {string}
         */
        getLivechatId: function() {return me.livechatId;},
        /**
         * Returns whether the user should be allowed to send new queries or not
         * @returns {boolean}
         */
        canSend: function() { return !(me.livechatStatus === 1 || me.livechatStatus === 3);}
    };
};

/**
 * Creates a new dialog web service object allowing to send queries / receive responses
 * @param {Object} _config
 * @param {window.Nina.config.Config} _storage
 */
window.Nina.ws.newJBotService = function newJBotService(_config, _storage) {
    "use strict";
    var $ = window.Nina.$,
        io = window.io,
        me = {};

    // Config parameters
    me.timeoutQuery = _config.timeoutQuery;
    me.errorMessage = _config.errorMessage;
    me.urltoolong = _config.urltoolong;
    me.tooManyQueries = _config.tooManyQueries;
    me.newSessionMessage = _config.newSessionMessage;
    me.maxQueries = _config.maxQueries;
    me.usePersistent = _config.usePersistent;
    me.useJSONP = _config.useJSONP;
    me.nleResults = _config.nleResults;
    if (!Modernizr.cors) { // force JSONP for IE8 & 9
        // The hack described here (http://stackoverflow.com/questions/9160123) is not enough because
        // as explained here (http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx),
        // IE8/9 doesn't send the Content-Type header, so we would need to make
        // server changes for this to work. Thus, falling back to JSONP instead.
        me.useJSONP = true;
    }
    // if( $.isPlainObject(window.NinaVars) && window.NinaVars.hasOwnProperty("preprod")) {
    //     me.dialog_url = _config.preprod.base_url;
    //     me.debug = _config.preprod.debug;
    //     me.use_smart_router = _config.preprod.use_smart_router;
    //     me.smart_router_endpoint = _config.preprod.smart_router_endpoint;
    //     me.sr_agent_endpoint = _config.preprod.sr_agent_endpoint;
    // } else {
    //     me.dialog_url = _config.prod.base_url;
    //     me.debug = _config.prod.debug;
    //     me.use_smart_router = _config.prod.use_smart_router;
    //     me.smart_router_endpoint = _config.prod.smart_router_endpoint;
    //     me.sr_agent_endpoint = _config.prod.sr_agent_endpoint;
    // }
    // me.dialog_url += "jbotservice.asmx/TalkAgent";

    me.storage = _storage;
    me.preQueryProcessors = [];
    me.messageHandlers = [];
    me.errorHandlers = [];
    me.typingHandler = null;
    me.sessionEndingHandlers = [];
    me.queriesQueue = [];
    me.smartrouterMsgQueue = [];
    me.sending = false;
    me.firstQuery = me.storage.getSession("SCI") ? false : true;
    me.errorTimer = null;
    me.timeoutTimer = null;
    me.livechatMode = false;
    me.livechatTimer = null;
    me.livechatErrors = 0;
    me.livechatMaxErrors = _config.livechatMaxErrors;
    me.livechatRetryDelay = _config.livechatRetryDelay;
    me.livechatInteractionIndex = me.storage.getSession("lcindex");
    me.userTyping = false;
    me.connected_to_smartrouter = false;

    me.preprod = $.isPlainObject(window.NinaVars) && window.NinaVars.hasOwnProperty("preprod");
    me.platform = me.preprod ? "preprod" : "prod";
    me.lastRequestFailed = false;

    if( isDualActiveEnabled() ){
        // ACTIVE/ACTIVE MODE
        // we check if there's a stored version in the session cookie
        var as = _storage.getSession('as');
        me.activeSite = doesBaseUrlContain(as) ? as : undefined;
    }

    function setUrls(){
        var platform = _config[me.platform],
            endpoint = "jbotservice.asmx/TalkAgent";

        // If base_url is a string, we're in basic mode. We set the url
        // If base_url is an object, we're in active/active mode.
        // 1. we check if we already know which site to pick
        // 2. if not, we will call houston at the first query, and set the urls again.

        if(isDualActiveEnabled() && doesBaseUrlContain(me.activeSite)){
            me.dialog_url = platform.base_url[me.activeSite] + endpoint;
        }else if(!isDualActiveEnabled()){
            me.dialog_url = platform.base_url + endpoint;
        }else{
            me.dialog_url = undefined;
        }

        me.debug = platform.debug;
    }

    setUrls();


  if (me.use_smart_router)
  {
    var date = new Date();
    var rand = date.getTime() * Math.random() + date.getTime();
    me.uniqueId = rand.toString();

    me.socket = io.connect(me.smart_router_endpoint);
    me.socket.on('whoareyou', function () {
      me.socket.emit('iam', me.uniqueId);
    });
    me.socket.on('hello', function () {
      me.connected_to_smartrouter = true;
      // Treat all the messages we got while we were connecting to the smart-router
      while (me.smartrouterMsgQueue.length > 0) {
        var msg = me.smartrouterMsgQueue.shift();
        msg.ids.ui = me.uniqueId;
        me.socket.emit('talk', msg);
      }
    });
    me.socket.on('talkback', function (data) {
      me.sr_agent_endpoint = data.ids.agent;
      var talkAgentResponse = JSON.parse(data.payload);
      responseHandler(talkAgentResponse);
    });
    me.socket.on('disconnect', function () {
      me.connected_to_smartrouter = false;
    });
  }

    // When we make AJAX calls using JSONP with JQuery, it tacks on the callback as a randomly-generated function
    // name to handle multi-threaded responses (kind of clever).  Unfortunately, this means that it takes up space in
    // the URL.  Space is limited because IE can only handle URLs of 2K in length, so we have to take that into account
    // here.  First we define the length of the JQuery JSONP callback component in the URL.  It seems to come out around
    // 56 characters but to give a spot of head room, I've defined it here to 70.
    me.JQUERY_JSONP_CALLBACK_URL_COMPONENT_LENGTH = 70;

    // Now define the max allowable URL length we can handle by subtracting the JQuery JSONP callback component length
    // from 2K.  We cannot generate URLs longer than this value.
    me.MAX_ALLOWABLE_URL_LENGTH = 2040 - me.JQUERY_JSONP_CALLBACK_URL_COMPONENT_LENGTH;

    /**
     * Builds the URL for the supplied query.
     * @param {window.Nina.ws.Query} query The query of interest.
     * @returns {string} URL
     */
    me.buildQueryURL = function(query) {
        var date = new Date();
        var rand = date.getTime() * Math.random() + date.getTime();
        return me.dialog_url + "?TalkAgentRequest={\"TalkAgentRequest\":" + encodeURIComponent(query.toJSON()) + "}&rnd=" + rand + "&Callback=?";
    };
    /**
     * Builds the querystring corresponging to the supplied query. It will be put in the Body of a POST request.
     * @param {window.Nina.ws.Query} query The query to be sent.
     * @returns {string} A querystring to be put in the body of the request
     */
    me.getPOSTBody = function(query) {
        var date = new Date();
        var rand = date.getTime() * Math.random() + date.getTime();
        return "TalkAgentRequest={\"TalkAgentRequest\":" + encodeURIComponent(query.toJSON()) + "}&rnd=" + rand;
    };

    function sessionEndingHandler() {
        me.timeoutTimer = null;

        $.each(me.sessionEndingHandlers, function(index, handler) {
            if($.isFunction(handler)) {
                handler();
            }
        });
    }

    /**
     * Callback for the dialog web service response
     * @param {Object} data the web service response
     * @returns {void}
     */
    function responseHandler(data) {
        if(me.errorTimer !== null) {
            window.clearTimeout(me.errorTimer);
            me.errorTimer = null;
        }
        var interaction = window.Nina.ws.newInteraction(data);
        var ad = interaction.getAdditionalData();

        //Store sci and iid in cookie or whatever we use to store them.
        me.storage.setSession({
            'sci': interaction.getSCI(),
            'lastInt': +new Date()
        });

        me.storage.setPersist("iid",interaction.getIID());

        // If we do not get a success response code, display an error message and stop the processing here
        var rc = interaction.getResponseCode();
        if(rc !== window.Nina.enums.ResponseCode.Default && rc !== window.Nina.enums.ResponseCode.Found && rc !== window.Nina.enums.ResponseCode.Command && rc !== window.Nina.enums.ResponseCode.EmptyAnswer && rc !== window.Nina.enums.ResponseCode.IgnoreInit) {
            notifyErrorHandlers(rc, interaction.getResponse());
            me.sending = false;
            return;
        }

        //if we receive a value for in the timeoutnode, we start a timer

        var timeoutValue = interaction.getTimeOut();
        if( +timeoutValue !== 0 ){
            if( me.timeoutTimer !== null ){
                window.clearTimeout(me.timeoutTimer);
            }
            me.timeoutTimer = window.setTimeout(sessionEndingHandler, timeoutValue*1000);
        }

        if(ad.hasOwnProperty("Persistent") && me.usePersistent) {
            me.storage.setPersist("persist",ad.Persistent);
        }

        if(ad.hasOwnProperty("ContinueDialog")) {
            me.storage.setSession("cont",ad.ContinueDialog);
        } else {
           me.storage.setSession("cont",null);
        }

        me.livechatMode = interaction.isLivechatConversation();

        // If we're in livechat mode and there is no pending livechat poll timer, let's start one
        if(me.livechatMode && interaction.getLivechatPollTime() > 0 && me.livechatTimer === null) {
            schedulePoll(interaction.getLivechatPollTime());
        }

        // Store if this is a livechat conversation so we can start back in livechat mode after a page refresh
        me.livechatInteractionIndex = interaction.getLivechatInteractionIndex();
        me.storage.setSession({
            "lcstat": interaction.isLivechatConversation(),
            "lcindex": interaction.getLivechatInteractionIndex()
        });

        // Display CSR is writing notification
        if($.isFunction(me.typingHandler)) {
            me.typingHandler(interaction.isLivechatCSRWriting());
        }

        // Store the livechat id
        if( interaction.getLivechatId() !== "" ) {
            me.storage.setPersist("lcid",interaction.getLivechatId());
        }

        // If an additional message handler is available, use it
        $.each(me.messageHandlers, function(index, value) {

            if($.isFunction(value)) {
                value(interaction);
            }

        });

        me.sending = false;
        processNextQuery();
    }

    /**
     * Schedule a livechat poll in time seconds.
     * @param {int} delay number of seconds to wait
     */
    function schedulePoll(delay) {
        me.livechatTimer = window.setTimeout(livechatPollHandler, delay*1000);
    }

    /**
     * Called by the timer that triggers livechat polls
     * @returns {void}
     */
    function livechatPollHandler() {
        buildAndSendQuery(window.Nina.enums.Command.LivechatPoll,{});
        me.livechatTimer = null;
    }

    /**
     * Called at the end of a liveChat session to remove every scheduledPoll
     */
    function stopPolling() {
        if(me.livechatTimer){
            window.clearTimeout(me.livechatTimer);
            me.livechatTimer = null;
        }
    }

    /**
     * Called by the error timer when the web service takes too long to answer
     * @returns {void}
     */
    function errorHandler() {
        window.clearTimeout(me.errorTimer);
        me.errorTimer = null;

        if(!me.lastRequestFailed && isDualActiveEnabled() ){
            me.lastRequestFailed = true;
            me.activeSite = undefined;
            callHoustonThen(function(){
                // we check again
                sendQueryWS(query);
            });
        }else{
            // we stop here and throw an error
            me.lastRequestFailed = false;
            notifyErrorHandlers("ServiceUnavailable", me.errorMessage);
            me.sending = false;
            processNextQuery();
        }
    }

    /**
     * Need to change then name ... it does more than notifying the error handles
     * @param {string} errorCode code representing the error, for web service errors, code returned in the code attribute
     * @param {string} errorText hopefully comprehensive text detailing the error
     */
    function notifyErrorHandlers(errorCode, errorText) {
        // If there is a service error / timeout, and we're in livechat mode, then we'll check if there is a poll waiting
        // and if not we'll schedule one to continue the livechat session
        // We do not do this if we receive a concurrent queries error since it can be a sign that we have multiple UIs
        // open at the same time and we don't want to continue sending polls in that case.
        if(errorCode !== window.Nina.enums.ResponseCode.ErrorConcurrentQueries && me.livechatMode && me.livechatTimer === null) {
            me.livechatErrors++;
            // We set a max number of tries since it's useless to continue hammering the server if it does not work
            if(me.livechatErrors < me.livechatMaxErrors) {
                schedulePoll(me.livechatRetryDelay);
            }
        }

        $.each(me.errorHandlers, function(index, value) {
            if($.isFunction(value)) {
                value(errorCode, errorText);
            }
        });
    }


    function callHoustonThen(callback)
    {
        if(typeof callback !== "function"){
            throw new Error('Callback is not a valid function');
        }

        var cfg = _config[me.platform];

        $.get(cfg.houstonURL, function(site){
            site = site.trim();

            me.activeSite = doesBaseUrlContain(site) ? site : returnFirstSite();
            storeSite(me.activeSite);
            setUrls();

            callback();
            return;
        });
    }

    function isDualActiveEnabled(){
        var sites = _config[me.platform].base_url;
        return typeof sites === 'object' && !$.isEmptyObject(sites) ;
    }

    function doesBaseUrlContain(site){
        return _config[me.platform].base_url.hasOwnProperty(site);
    }

    if(_storage.getSession('as')){
      window.Nina.storage.activeSite = _storage.getSession('as');
    }
    function storeSite(site) {
      _storage.setSession('as', site);
      window.Nina.storage.activeSite = site;
    }

    function returnFirstSite(){
        var sites = _config[me.platform].base_url;
        for( var site in sites ) {
            if( typeof sites[site] === 'string' && sites[site].length > 0 ){
                return sites[site];
            }
        }
        throw("No site available");
    }

    me.lastRequestFailed = false;

    /**
     * Sends a query to the web service
     * @param {window.Nina.ws.Query} query
     * @returns {void}
     */
    function sendQueryWS(query)
    {
        me.sending = true;

        if (!me.useJSONP) {
            $.post(me.dialog_url, me.getPOSTBody(query), responseHandler, "json")
            .fail( errorHandler );
            me.errorTimer = window.setTimeout(errorHandler, me.timeoutQuery * 1000);
        }
        else { // JSONP
            var url = me.buildQueryURL(query);

            // IE cannot open URLs longer than 2083 characters (at most 2048 in path part)
            if (url.length > me.MAX_ALLOWABLE_URL_LENGTH)
            {
                try
                {
                    notifyErrorHandlers("URLTooLong", me.urltoolong + ": " + url.length);
                }
                finally
                {
                    me.sending = false;
                }
            }
            else
            {
                // With jQuery 1.x the .fail() callback is not called unfortunately. Relying on the errorTimer
                $.getJSON(url, responseHandler).fail(errorHandler);
                me.errorTimer = window.setTimeout(errorHandler, me.timeoutQuery * 1000);
            }
        }
    }


    /**
     * Build a query based on the user text and additional data provided and then queue it for sending
     * @param {string} userText
     * @param {Object} metadata
     * @returns {void}
     */
    function buildAndSendQuery(userText, metadata) {
        if(me.queriesQueue.length >= me.maxQueries) {
            notifyErrorHandlers("TooManyPendingQueries", me.tooManyQueries);
            return;
        }

        var finalMetadata = {};
        if(me.debug) {
            // TODO sbelone 20150318: the parameter to send is actually "debug:true"
            finalMetadata.Debug = {};
        }
        if (me.nleResults) {
            finalMetadata.nleResults = true;
        }

        finalMetadata.uiID = me.storage.uiID;

        // Livechat metadata
        finalMetadata.ClientMetaData = {};
        // Send livechat id if we have one
        var lcid = me.storage.getPersist("lcid");
        if(lcid !== null && lcid !== "") {
            finalMetadata.ClientMetaData.LiveChatId = lcid;
        }
        if( me.livechatInteractionIndex ){
            finalMetadata.lastIndex = me.livechatInteractionIndex;
        }
        // Set if the user is typing
        finalMetadata.VisitorIsTyping = me.userTyping;
        me.userTyping = false;

        // Send persistent node if we have one
        var persist = me.storage.getPersist("persist");
        if( me.usePersistent && persist !== null && persist !== "") {
            finalMetadata.Persistent = persist;
        }

        var sci = me.storage.getSession("sci");
        var iid = me.storage.getPersist("iid");
        sci = sci === null ? "" : sci;
        iid = iid === null ? "" : iid;

        $.extend(true, finalMetadata, metadata);

        // Send datapoints passed by website
        if(typeof window.NinaVars !== "undefined") {

            var processedNinaVars = {};
            $.extend(true, processedNinaVars, window.NinaVars);

            $.each(me.preQueryProcessors, function(index, processor) {
                if($.isFunction(processor)) {
                    processor(processedNinaVars, userText, finalMetadata, testURLLengthValid);
                    }
            });

            finalMetadata.NinaVars = processedNinaVars;
        }

        var query = window.Nina.ws.newQuery(sci, iid, userText, finalMetadata);
      if (!me.use_smart_router)
      {
        me.queriesQueue.push(query);
        processNextQuery();
      }
      else
      {
        talk(query);
      }
    }

    function talk (query) {
      var msg = { ids: { ui: me.uniqueId, agent: me.sr_agent_endpoint },
        metadata: {},
        payload: "{\"TalkAgentRequest\":" + query.toJSON() + "}"
      };
      if (me.connected_to_smartrouter) {
        me.socket.emit('talk', msg);
      }
      else {
        me.smartrouterMsgQueue.push(msg);
      }
    }


    /**
     * Returns true if the URL constructed from the supplied parameters is of a valid length (< 2040 characters) and
     * false if it is too long.
     *
     * @param ninaVars {Object} The Nina vars used to construct the URL.
     * @param userText {string} The text of the user query to be placed in the URL.
     * @param metaData {Object} custom meta data used to construct the URL.
     *
     * @return true if the URL length is valid (< 2040 chars), false if not.
     */
    function testURLLengthValid(ninaVars, userText, metaData) {
        if (!me.useJSONP) {
            return me.dialog_url < me.MAX_ALLOWABLE_URL_LENGTH;
        }

        var sci = me.storage.getSession("sci");
        var iid = me.storage.getPersist("iid");
        sci = sci === null ? "" : sci;
        iid = iid === null ? "" : iid;

        var tempMetaData = {};
        $.extend(true, tempMetaData, metaData);
        tempMetaData.NinaVars = ninaVars;

        var query = window.Nina.ws.newQuery(sci, iid, userText, tempMetaData);
        var url = me.buildQueryURL(query);
        var length = url.length;
        return length < me.MAX_ALLOWABLE_URL_LENGTH - 50;
    }

    /**
     * Processes the Params object and sends as many ##skipAlyze#Params queries as necessary.
     * @param obj {object} The object containing the parameters sent by the webpage in NinaVars
     * @return {void}
     */
    function splitAndSendParams(obj){
        var params = [];
        if(typeof obj !== "object"){
            return;
        }else{
            $.each(obj, function(name, node){
                params.push([name, node]);
            });
        }

        // CREATING THE METADATA NODE
        var metadata = {
            VisitorIsTyping: false,
            newParams: {}
        };

        if(me.debug) {
            metadata.Debug = {};
        }

        var lcid = me.storage.getPersist("lcid");
        if(lcid !== null && lcid !== "") {
            metadata.ClientMetaData.LiveChatId = lcid;
        }

        var persist = me.storage.getPersist("persist");
        if( me.usePersistent && persist !== null && persist !== "") {
            metadata.Persistent = persist;
        }

        var empty = true;
        var deleted = 0;
        var tmpMetadata = $.extend(true, {}, metadata);
        tmpMetadata.newParams = {};

        while(params.length>0){
            var item = params[0];
            tmpMetadata.newParams[item[0]] = item[1];
            if(testURLLengthValid( window.NinaVars, window.Nina.enums.Command.SendParams, tmpMetadata)){
                item = params.shift();
                metadata.newParams[item[0]] = item[1];
                empty = false;
            }else{
                if(empty === true){
                    //it means that this parameter can't even be sent alone. It's just too big.
                    //we delete it
                    params.shift();
                    deleted++;
                }else{
                    //it means that the chunk is ready to be sent
                    buildAndSendParamsQuery(metadata);
                    metadata.newParams = {};
                    tmpMetadata.newParams = {};
                    empty = true;
                }
            }
        }
        if(deleted>0){
            window.NinaVars.paramsDeleted = deleted;
        }
        if(empty === false){
            buildAndSendParamsQuery(metadata);
        }
    }

    /**
    * Build a query only for sending params in several requests
    * @param {Object} metadata
    * @returns {void}
    */
   function buildAndSendParamsQuery(metadata) {
       if(me.queriesQueue.length >= me.maxQueries) {
           notifyErrorHandlers("TooManyPendingQueries", me.tooManyQueries);
           return;
       }

       var finalMetadata = metadata;

       var sci = me.storage.getSession("sci");
       var iid = me.storage.getPersist("iid");
       sci = sci === null ? "" : sci;
       iid = iid === null ? "" : iid;

       var query = window.Nina.ws.newQuery(sci, iid, window.Nina.enums.Command.SendParams, finalMetadata);
       me.queriesQueue.push(query);
       //processNextQuery();
   }



    /**
     * Takes the next query in queue (if any) and send it
     * @returns {void}
     */
    function processNextQuery() {
        if(me.sending || me.queriesQueue.length === 0) {
            return;
        }
        // if we haven't received the first answer, we wait for it before sending a new query
        if(me.storage.getSession('sci') === null && !me.firstQuery) {
            return;
        }
        var query = me.queriesQueue.shift();
        if(query.getSCI() === "" && !me.firstQuery)
        {
            query.setSCI(me.storage.getSession('sci'));
        }
        if(query.getIID() === "" && !me.firstQuery)
        {
            query.setIID(me.storage.getPersist('iid'));
        }
        me.firstQuery = false;

        // here we send a request to Houston to select an active site
        // (only if necessary)
        // then we send the `query`

        // Active/Active is enabled and no site has been selected yet
        if( typeof _config[me.platform].base_url === 'object' && me.activeSite === undefined ){
            // we check Houston first
            callHoustonThen(function(){
              sendQueryWS(query);
            });
        }else{
            sendQueryWS(query);
        };
    }

    return /** @lends window.Nina.ws.JBotService.prototype */ {
        /**
         * Queues a query for sending based on the question and any additional data
         * @param {string} userText
         * @param {!Object} additionalData
         * @returns {void}
         */
        sendQuery: function(userText, additionalData) {
            buildAndSendQuery(userText,additionalData);
        },
        /**
         * Queues queries for sending only additional Data
         * @param {object} options object containing additional options such as nodeName and removeNode
         * @returns {void}
         */
        sendParams: function(obj) {
            splitAndSendParams(obj);
        },
        /**
         * Empty Queue. Useful to delete ##SkipAlyze#Params queries before they're sent
         * @returns {void}
         */
        emptyQueue: function(){
            me.queriesQueue = [];
        },
        /**
         * Adds a processor to be called immediately prior to sending a query.  The processor has the signature:
         *
         * void function(ninaVars, userText, metaData, testURLLengthValid)
         *
         * The processor is free to delete or add properties to ninaVars prior to the query being sent.
         * Understand that the operation takes place on a _copy_ of the NinaVars object defined on the web page;
         * the values in the original NinaVars will _not_ be changed.  That means that the processor will be called
         * with the same values as are in the original NinaVars and must remove or add them each time a query is
         * made.
         *
         * The processor is supplied the userText and the metaData to facilitate ninaVar addition or removal
         * decision logic.
         *
         * The processor is supplied a function that will test the length of the URL that would be used to make the
         * query to the agent  The function will return true if the URL length is acceptable or false if not.  This allows
         * processors to update ninaVars and and be confident that the query issued will not result in a "URLTooLong"
         * error. Here's an example of how this can be called:
         *
         * var toBeRemoved = ["wi", "ui"];
         *
         * var index = 0;
         * while (!testURLLengthValid(ninaVars, userText, metaData) && index < toBeRemoved.length)
         * {
         *   delete ninaVars[toBeRemoved[index]];
         *   index++;
         * }
         *
         * Processors are called in the order they are defined.  The state of the supplied ninaVars object will
         * be passed to the next processor, allowing processor chaining.
         *
         * @param {function(window.Nina.ws.Interaction):void} processor
         * @returns {void}
         */
        addPreQueryProcessor: function(processor) {
            me.preQueryProcessors.push(processor);
        },
        /**
         * Adds a new message handler that will be called when receiving a response from the web service
         * @param {function(window.Nina.ws.Interaction):void} messageHandler
         * @returns {void}
         */
        addMessageHandler: function(messageHandler) {
            me.messageHandlers.push(messageHandler);
        },
        /**
         * Add an error handler that will be called when there is an error
         * @param {function(string,string):void} errorHandler
         * @returns {void}
         */
        addErrorHandler: function(errorHandler) {
            me.errorHandlers.push(errorHandler);
        },
        /**
         * Add an error handler that will be called when there is an error
         * @param {function(string,string):void} errorHandler
         * @returns {void}
         */
        addSessionEndingHandler: function(sessionEndingHandler) {
            me.sessionEndingHandlers.push(sessionEndingHandler);
        },
        /**
         * Sets the handler that will be called to update the CSR is typing status
         * @param {function(boolean):void} typingHandler
         * @returns {void}
         */
        setTypingHandler: function(typingHandler){
            me.typingHandler = typingHandler;
        },
        /**
         * Removes all the message handlers
         * @returns {void}
         */
        clearAdditionalMessageHandler: function() {
            me.messageHandlers = [];
        },
        /**
         * Stop any scheduled poll
         * @returns {void}
         */
        stopPolling: function() {
            stopPolling();
        },
        /**
         * Indicate the user is typing
         * @returns {void}
         */
        setUserIsTyping: function() {
            me.userTyping = true;
        },
        /**
         * Clears the context id which implies the next call will create a new dialog.
         */
        newSession: function() {
            me.storage.setSession("sci","");
        },

        __me: me
    };
};


/**
 * Creates a new pre-query processor that automatically removes variables from the supplied NinaVars parameter
 * until the URL that will be created to send a query to the agent is of an acceptable length.  This processor achieves
 * this by looping through an array of property paths supplied upon construction, removing each corresponding object
 * from the Nina vars structure until the "testURLLengthFunction" indicates that the URL that will be sent is
 * acceptable.
 *
 * Each element in a property path must be separated with the '.' character.  You may not have property keys with ".".
 * For example:
 *
 * NinaVars["a.b"] = "hello";
 *
 * Will not be picked up by this processor because it will assume "a.b" to be nested sub-objects, as would be created
 * by:
 *
 * NinaVars["a"]["b"] = "hello";
 *
 * Note that it's still possible for this processor to execute successfully but the URL still be too long.  This will
 * happen if you do not supply enough properties to be expunged or the properties do not exist in the NinaVars
 * object.
 *
 * To use:
 *
 * // code to initialize config and cookie jar
 * ...
 * var botService = window.Nina.ws.newJBotService(config.ws, cookieJar);
 * ...
 * botService.addPreQueryProcessor(window.Nina.ws.newPrioritizedNinaVarRemovalPreQueryProcessor([
 *    "a.b.c",
 *    "another.path",
 *    "yet.another.object.path"
 *    ...
 *    ]);
 *
 * @param prioritizedPathList An array of property paths that will be tried in order.  Invalid paths (those that do not
 * correspond to an object property addressable in NinaVars) are ignored.
 *
 * @returns A pre-query processor function suitable for adding to the bot service.
 */
window.Nina.ws.newPrioritizedNinaVarRemovalPreQueryProcessor = function newPrioritizedNinaVarRemovalPreQueryProcessor(prioritizedPathList) {
    "use strict";
    var me = {};
    me.prioritizedPathList = prioritizedPathList;


    /**
     * Returns true if the supplied object has properties, false if not.
     */
    function hasProperties(object)
    {
        //noinspection LoopStatementThatDoesntLoopJS
        for (var prop in object){
            if( object.hasOwnProperty(prop) ){
                return true;
            }
        }
        return false;
    }


    return function(ninaVars, userText, metaData, testURLLengthFunction) {

        // Work our way through our ill-fated keys deleting them from ninaVars until our URL is of an acceptable
        // length, as determined by the Nina framework.
        var index = 0;
        while (!testURLLengthFunction(ninaVars, userText, metaData) && index < me.prioritizedPathList.length)
        {
            var stack = [];
            var currentObject = ninaVars;

            var pathElements = me.prioritizedPathList[index].split(".");
            var i = 0;

            // Work our way down through the property path ("a.b.c.d") and build up a stack containing stuff we
            // might remove.
            while (i < pathElements.length && currentObject.hasOwnProperty(pathElements[i]))
            {
                stack.push({object: currentObject, property: pathElements[i]});
                currentObject = currentObject[pathElements[i]];
                i++;
            }

            // Check to see if at least one element in the property path corresponds to an actual property.
            if (stack.length > 0)
            {
                var node = stack.pop();

                if (stack.length === pathElements.length - 1)
                {
                    // The full path matched to something.  We get rid of the last property of the last object on
                    // the path.
                    delete node.object[node.property];
                }

                // Now we work our way back up the path, deleting objects that have no content as we go.  Interestingly,
                // if an object has no content we delete it from its _parent_ object.  In other words, we don't want
                // the parent object (the thing that points to it) to be pointing to empty objects.
                while (stack.length > 0 && !hasProperties(node.object))
                {
                    node = stack.pop();
                    delete node.object[node.property];
                }
            }

            // On to the next path element.
            index++;
        }
    };
};

/**
 * Created by IntelliJ IDEA.
 * User: Jeff
 * Date: 11/11/10
 * Time: 5:12 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 * @namespace
 */
window.Nina = window.Nina || {};
/**
 * @namespace
 */
window.Nina.text = window.Nina.text || {};

/**
 * @namespace
 */
window.Nina.text.Processors = (function() {
	"use strict";
    var $ = window.Nina.$;
    
	function ProcessorWhiteSpace( input ) {
        if(typeof input !== "string") {
            return "";
        }
		var pattern = /^[ \t]+|[ \t]+$/gi;
		var result = input;
		result = result.replace(pattern, "");
		return result;
    }
	function ProcessorPunctSpace( input ) {
        if(typeof input !== "string") {
            return "";
        }
        var pattern = /( +?)(\?|\!|\.|,|:|;)/gi;
		var result = input;
		result = result.replace(pattern, "$2");
		return result;
	}
	function ProcessorBreakLines( input ) {
        if(typeof input !== "string") {
            return "";
        }
        /* first converts all types of end of line markers to <br />
		the eliminates any <br /> tags at the start and end of the string
		*/
		var pattern = /((\r|\n)+ ?(\n|\r)+)|(\r)|(\n)/gi;
		var result = input;
		result = result.replace(pattern, "<br />");
		pattern = /^(<\/? ?br>|<br ?\/>)+|(<\/? ?br>|<br ?\/>)+$/gi;
		result = result.replace(pattern, "");
		return result;
	}
	function ProcessorLists( input ) {
        if(typeof input !== "string") {
            return "";
        }
		/* first it looks for list patterns through the string (assuming there can be
		more than one list in the text
		then it processes each list candidate and replaces it with its html list
		equivalent.
		*/
		var pattern;
		var result = input;
		var matches = [];
		var processedMatches = [];

		pattern = /(\r|\n|\r\n)?^- ?(.+?)(\r\n|\r|\n)(- ?(.+?)(\r\n|\r|\n|$)){0,}/gim;
		result = input ;
		matches = result.match(pattern);
		if(matches){
			for( var i = 0; i < matches.length; i++ ){
				var item = matches[i];
				item = item.replace(/- ?(.+)?/gi, "<li>$1</li>");
				item = item.replace(/(\r\n|\r|\n)/gi, "");
				processedMatches.push(item);
			}
			for( var j = 0; j < matches.length; j++){
				result = result.replace(matches[j], "<ul>" + processedMatches[j] + "</ul>");
			}
		}
		return result;
	}
    function ProcessorScriptTags( input ) {
        if(typeof input !== "string") {
            return "";
        }
        var patternScriptOpen = /<script[^>]*>/gim;
        var patternScriptClose = /<\/script[ ]*>/gim;

        return input.replace(patternScriptOpen,"").replace(patternScriptClose,"");
    }
    function ProcessorEscapeInputText( input ) {
        if(typeof input !== "string") {
            return "";
        }

        return input.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    }
    function Capitalize(input) {
        return input.toLowerCase().replace(/\b[a-z]/g, function(letter){ return letter.toUpperCase();});
    }
    // The following processor is a temporary workaround for 6.0 agents.
    // Links are in the form: <a href="#" target="_blank" data-vtz-browse="http://google.com"...
    // so it's impossible to open them in a new tab using right/wheel click.
    // Until it's fixed in NIQS, we replace "#" with the real link
    function CreateRealLinks(input) {
        var inputAsDom = $('<div>' + input + '</div>');
        inputAsDom.find('a').each(function() {
            if ($(this).attr('data-vtz-browse')) {
                $(this).attr('href', $(this).attr('data-vtz-browse'));
            }
        });
        return inputAsDom.html();
    }
    return {
        getWhiteSpaceProcessor: function() { return ProcessorWhiteSpace;},
        getPunctSpaceProcessor: function() { return ProcessorPunctSpace;},
        getBreakLinesProcessor: function() { return ProcessorBreakLines;},
        getScriptTagsProcessor: function() { return ProcessorScriptTags;},
        getEscapeInputTextProcessor : function() { return ProcessorEscapeInputText;},
        getCapitalizeInputTextProcessor: function() { return Capitalize;},
        getListProcessor: function() {return ProcessorLists;},
        getCreateRealLinksProcessor: function() { return CreateRealLinks; },
        applyProcessors: function(input, processors) {
            if( !processors || processors.length === 0 ) {
                return input;
            }
            var result = input;
            for (var i = 0; i < processors.length; i++) {
                result = processors[i]( result );
            }
            return result;
            }
    };
})();
/**
 * Created by .
 * User: Jeff
 * Date: 12/13/10
 * Time: 3:37 PM
 * To change this template use File | Settings | File Templates.
 */

//= require ../common/enum
//= require ../common/textprocessors
//= require ../common/jquerycompat
//= require ../helper/scripts


/**
 * @namespace
 */
window.Nina = window.Nina || {};
/**
 * @namespace
 */
window.Nina.ui = window.Nina.ui || {};

/**
 * @name window.Nina.ui.DisplayHistory
 * @class
 */

/**
 * Creates a new DisplayHistory object
 * @param {String} _agentId
 * @param {Object} _config
 * @param {window.Nina.storage.CookiesJar} _cookiesJar
 * @returns {window.Nina.ui.DisplayHistory}
 */
window.Nina.ui.newDisplayHistory = function(_agentId, _config, _cookiesJar ) {
    "use strict";
    var $ = window.Nina.$;
    var me = {};

    me.agentId = _agentId;
    me.cookiesJar = _cookiesJar;
    me.text = {};
    me.text.headerSeparator = _config.headerSeparator;
    me.text.headerAgent = _config.headerAgent;
    me.text.headerSystem = _config.headerSystem;
    me.text.headerError = _config.headerError;
    me.text.headerUser = _config.headerUser;
    me.text.defaultCSRName = _config.defaultCSRName;

    me.textSizes = _config.textSizes;
    me.textSizeIndex = _config.initTextSizeIndex;

    me.text.headerCSR = "";
    me.lastLineAuthor = "";
    me.id = {};
    me.id.chatArea = "#" + _agentId + " .nw_Conversation";
    me.id.chatText = "#" + _agentId + " .nw_Conversation .nw_ConversationText";
    me.id.saveButton = "#" + _agentId + " .nw_Save";
    me.id.printButton = "#" + _agentId + " .nw_Print";
    me.id.textPlusButton = "#" + _agentId + " .nw_TextPlus";
    me.id.textMinusButton = "#" + _agentId + " .nw_TextMinus";
    me.id.textCycleButton = "#" + _agentId + " .nw_TextCycle";

    me.components = {};
    me.components.chatArea = null;
    me.components.chatText = null;
    me.components.saveButton = null;
    me.components.printButton = null;
    me.components.textPlusButton = null;
    me.components.textMinusButton = null;
    me.components.textCycleButton = null;

    me.css = {};
    me.css.authorCSR = "nw_CsrSays";
    me.css.authorUser = "nw_UserSays";
    me.css.authorSystem = "nw_SystemSays";
    me.css.authorAgent = "nw_AgentSays";
    me.css.agentLastAnswer = "nw_AgentLastAnswer";
    me.css.authorError = "nw_ErrorSays";
    me.css.print = "nw_PrintPage";

    me.firstDisplay = true;

    populateComponents();
    setupHandlers();

    var textSize = parseInt(me.cookiesJar.getPersist("ts"), 10);
    if(!isNaN(textSize)) {
        changeTextSize(textSize);
    }

    /**
     * Sets the various button handlers
     * @returns {void}
     */
    function setupHandlers() {
        me.components.saveButton.click(function() { newHistoryWindow(false);});
        me.components.printButton.click(function() {newHistoryWindow(true);});
        me.components.textMinusButton.click(function() { changeTextSize(me.textSizeIndex -1);});
        me.components.textPlusButton.click(function() { changeTextSize(me.textSizeIndex + 1);});
        me.components.textCycleButton.click(function() { changeTextSize((me.textSizeIndex + 1) % me.textSizes.length); });
        //TODO: filter the keys that trigger this. space and enter should be enough
        /*me.components.saveButton.keydown(function() { newHistoryWindow(false);});
        me.components.printButton.keydown(function() {newHistoryWindow(true);});
        me.components.textMinusButton.keydown(function() { changeTextSize(me.textSizeIndex -1);});
        me.components.textPlusButton.keydown(function() { changeTextSize(me.textSizeIndex + 1);});*/
    }

    /**
     * Retrieves the components based on their IDs
     * @returns {void}
     */
    function populateComponents() {
        me.components.chatArea = $(me.id.chatArea);
        me.components.chatText = $(me.id.chatText);
        me.components.saveButton = $(me.id.saveButton);
        me.components.printButton = $(me.id.printButton);
        me.components.textPlusButton = $(me.id.textPlusButton);
        me.components.textMinusButton = $(me.id.textMinusButton);
        me.components.textCycleButton = $(me.id.textCycleButton);
    }

    /**
     * Open a new window and fill it with the chat history content
     * @param {boolean} doPrint
     * @returns {void}
     */
    function newHistoryWindow(doPrint) {
        var transcript = getTranscriptHTML();
        var options= "width=500,height=500,menubar=yes,toolbar=yes,scrollbars=yes,resizable=yes,location=no,status=no";
        var newWin;

        newWin = window.open("about:blank", "printpopup", options);
        newWin.document.open("text/html", true);
        newWin.document.write(transcript);
        newWin.document.close();

        if(doPrint) {
            newWin.print();
        }
    }

    /**
     * Returns an HTML version of the transcript of a page
     * @returns {string} the HTML of the transcript page
     */
    function getTranscriptHTML() {
        var baseDir = window.Nina.helper.scripts.getScriptPath("scripts/Nina" + me.agentId + ".js");
        var transcriptHTML = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><link rel='stylesheet' type='text/css' media='all' href='" + baseDir + "css/Nina" + me.agentId + ".css' /></head><body><div id='"+ me.agentId + "' class='" + me.css.print + "'>"+ $(me.id.chatText).html() + "</div></body></html>";

        return transcriptHTML;
    }

    /**
     * Change the text size
     * @param {int} change direction of the change +1/-1
     * @returns {void}
     */
    function changeTextSize(newIndex) {
        if(newIndex < 0 || newIndex >= me.textSizes.length || me.textSizes.length === 0) {
            return;
        }
        me.components.chatText.css("fontSize", me.textSizes[newIndex]);
        me.textSizeIndex = newIndex;

        me.cookiesJar.setPersist("ts", me.textSizeIndex);

        //trigger event that we can listen in agent.js
        $("#" + me.agentId).trigger("changeTextSize", [ me.textSizes[newIndex] ]);
    }

    /**
     * Append the passed HTML to the chat text area
     * @param {string} line
     * @returns {JQuery}
     */
    function appendChatLine(line) {
        var topPadding = parseInt(me.components.chatArea.css("paddingTop"), 10);
        var curHeight = me.components.chatText.outerHeight() + topPadding;
        var messageHeight;
        var newElement;

        me.components.chatText.append(line);
        newElement = me.components.chatText.children("div").last();

        messageHeight = me.components.chatText.outerHeight() + topPadding - curHeight;

        if(messageHeight > me.components.chatArea.height()) {
            me.components.chatArea.animate({ scrollTop: curHeight }, 500);
        } else {
            me.components.chatArea.animate({ scrollTop: me.components.chatText.prop("scrollHeight")}, 500);
        }
        return newElement;
    }

    /**
     * Append the array of lines to the chat text area
     * @param {Array.<Object>}arrayLines
     * @returns {void}
     */
    function appendChatLines(arrayLines) {
        $.each(arrayLines, function(index,line) {
            var text = $.trim(line.toDisplay);
            if(text && text.length > 0) {
                me.components.chatText.append(getChatLine(line.author, line.toDisplay));
            }
        });
        me.components.chatArea.animate({ scrollTop: me.components.chatText.prop("scrollHeight")}, 500);
    }

    /**
     * Returns the HTML to append to the chat text for a given author + text
     * @param {string} author
     * @param {string} text
     * @returns {string}
     */
    function getChatLine(author, text) {
		var itemrole ="role=\"listitem\"";
		var authorSrText="";
        var line="";
        var cssDialogueLineClass;
        var header = "";
        var baseProcessors = [window.Nina.text.Processors.getScriptTagsProcessor(), window.Nina.text.Processors.getWhiteSpaceProcessor(), window.Nina.text.Processors.getBreakLinesProcessor()];
        var processors = [];

        switch(author) {
            case window.Nina.enums.Author.Agent:
				authorSrText = "Alex said";
                header = me.text.headerAgent;
                //TODO use CSS :last-of-type when Modernizr supports the test
                cssDialogueLineClass = me.css.authorAgent + ' ' + me.css.agentLastAnswer;
                window.Nina.$("." + me.css.authorAgent).removeClass(me.css.agentLastAnswer);
                // To remove once urls are changed in NIQS
                processors.push(window.Nina.text.Processors.getCreateRealLinksProcessor());
                break;
            case window.Nina.enums.Author.System:
				authorSrText = "System said";
                header = me.text.headerSystem;
                cssDialogueLineClass = me.css.authorSystem;
                break;
            case window.Nina.enums.Author.User:
				authorSrText = "You said";
                header = me.text.headerUser;
                cssDialogueLineClass = me.css.authorUser;
                processors.push(window.Nina.text.Processors.getEscapeInputTextProcessor());
                break;
            case window.Nina.enums.Author.CSR:
				authorSrText = "CSR";
                header = me.text.headerCSR;
                cssDialogueLineClass = me.css.authorCSR;
                break;
            case window.Nina.enums.Author.Error:
				authorSrText = "Error";
                header = me.text.headerError;
                cssDialogueLineClass = me.css.authorError;
                break;
            default:
                break;
        }

        text = window.Nina.text.Processors.applyProcessors(text, processors.concat(baseProcessors));
        if( author !== window.Nina.enums.Author.User && me.firstDisplay && window.NinaVars && window.NinaVars.hasOwnProperty("preprod")) {
            me.firstDisplay = false;
            text = "<span class='nw_Preprod'>[PREPROD]&nbsp;</span>" + text;
        }

		if(text.indexOf("nw_Welcome")>-1){
				cssDialogueLineClass = cssDialogueLineClass + " alex_Welcome";
		}
        if( author === me.lastLineAuthor || header === "" ) {
            line = "<div class=\""+cssDialogueLineClass+"\" "+itemrole+" aria-label=\""+authorSrText+"\" tabindex=\"0\">"+text+"</div>";
        } else {
            line = "<div class=\""+cssDialogueLineClass+"\" "+itemrole+" aria-label=\""+authorSrText+"\" tabindex=\"0\"><span class=\"nw_Header\">"+header+ me.text.headerSeparator + "</span>"+text+"</div>";
        }
        if( author === window.Nina.enums.Author.System ) {
            line = "<hr>"+line+"<hr>";
        }
        me.lastLineAuthor = author;
        return line;
    }

    return /** @lends window.Nina.ui.DisplayHistory.prototype */ {
        /**
         * Adds a chat line from a given author
         * @param {string} toDisplay
         * @param {window.Nina.enums.Author} author
         * @returns {JQuery}
         */
        addChatLine: function(toDisplay, author) {
            return appendChatLine(getChatLine(author, toDisplay));
        },
        /**
         * Adds an array of lines to the history
         * @param {Array.<Object>} array
         * @returns {void}
         */
        addChatLines: function(array) {
            appendChatLines(array);
        },
        /**
         * Clears the chat history
         * @returns {void}
         */
        clearChatHistory: function() {
            me.components.chatText.children().remove();
            me.lastLineAuthor= "";
        },
        /**
         * Sets the CSR name for livechat
         * @param {string} name
         * @returns {void}
         */
        setCSRName: function(name) {
            if(name.length > 0) {
                me.text.headerCSR = name;
            } else {
                me.text.headerCSR = me.text.defaultCSRName;
            }

        },
        /**
        * Scroll to the bottom of the history
        */
        scrollToBottom: function() {
            me.components.chatArea.animate({ scrollTop: me.components.chatText.prop("scrollHeight")}, 500);
        },
        scrollToLastAnswer: function() {
            me.components.chatArea.animate({
                scrollTop: $('.'+me.css.agentLastAnswer).position().top + me.components.chatArea.scrollTop() - 20
            });
        },
        getTranscriptHTML: getTranscriptHTML
    };
};

//= require ../common/enum
//= require ../common/textprocessors
//= require ../webservice/jbotservice
//= require ../common/jquerycompat


/**
 * @namespace
 */
window.Nina = window.Nina || {};
/**
 * @namespace
 */
window.Nina.ui = window.Nina.ui || {};

/**
 * @name window.Nina.ui.UIHandler
 * @class
 */

/**
 * Creates a new UI Handler object
 * @param {string} _agentId
 * @param {Object} _config
 * @param {window.Nina.ws.JBotService} _jbotservice
 * @param {(window.Nina.ui.DisplaySingle|window.Nina.ui.DisplayHistory)} _display
 * @returns {window.Nina.ui.UIHandler}
 */
window.Nina.ui.newUIHandler = function newUIHandler(_agentId, _config, _jbotservice, _display) {
	"use strict";
    var $ = window.Nina.$;

    var me = {};
    me.jbotservice = _jbotservice;
    me.display = _display;

    // Config parameters
    me.version = _config.version;
    me.date = _config.date;
    me.maxInputLength = _config.maxInputLength;
    me.closeWindow = _config.closeWindow;
    me.sendFormDataMessage = _config.sendFormDataMessage;
    me.emptyInputUponSubmission = _config.emptyInputUponSubmission;
    me.ninaChatUi = _config.ninaChatUi;
    me.loadCoBrowsingUrl = _config.loadCoBrowsingUrl;
    me.openCoBrowsingUrlInNewWindow = _config.openCoBrowsingUrlInNewWindow;

    me.text = {};
    me.text.botIsTyping = _config.botIsTyping;
    me.text.csrIsTyping = _config.csrIsTyping;
    me.text.charsLeft = _config.charsLeft;
	me.text.charsLeftPlaceHolder = "##CHARSLEFT##";
    me.text.csrName = "";
	me.text.csrNamePlaceHolder = "##CSRNAME##";

    me.postChatSurveyUrl = "";

    me.id = {};
    me.id.inputText = "#" + _agentId + " .nw_UserInputField";
    me.id.inputButton = "#" + _agentId + " .nw_UserSubmit";
    me.id.chatText = "#" + _agentId + " .nw_ConversationText";
    me.id.closeButton = "#" + _agentId + " .nw_CloseX";
    me.id.statusMessage = "#" + _agentId + " .nw_StatusMessage";

    me.components = {};
    me.components.inputText = null;
    me.components.inputButton = null;
    me.components.chatText = null;
    me.components.closeButton = null;
    me.components.statusMessage = null;

    me.css = {};
    me.css.inputFocus = "nw_UserInputFocus";
    me.css.agentWriting = "nw_AgentWriting";
    me.css.noCharLeft = "nw_NoCharsLeft";
    me.css.sendDisabled = "nw_Disabled";

    me.urlHandler = null;
    me.inputHandlers = [];
    me.canSend = true;
    me.isLivechat = false;
    me.isLivechatWaiting = false;
    me.csrTyping = false;
    me.numUserQueries = 0;

    // Setup jbotservice to send us notifications
    me.jbotservice.addMessageHandler(responseHandler);
    me.jbotservice.addErrorHandler(errorHandler);
    me.jbotservice.setTypingHandler(typingHandler);

    //Populate components
    populateComponents();
    //Setup input form
    setupInputText();
    setupHandlers();

    /**
     * Retrieve the components by IDs
     * @returns {void}
     */
    function populateComponents() {
        me.components.inputText = $(me.id.inputText);
        me.components.inputButton = $(me.id.inputButton);
        me.components.chatText = $(me.id.chatText);
        me.components.closeButton = $(me.id.closeButton);
        me.components.statusMessage = $(me.id.statusMessage);
    }

    /**
     * Setup the click handlers
     * @returns {void}
     */
    function setupHandlers() {
        // The 6.x response rendered always returns dialog links with href="#".  5.x does not return the href
        // attribute at all.

        me.components.chatText.on("click", ".nw_AgentSays  a", function(event){
            event.preventDefault();
            var link = $(this);
            if(link.data("vtz-link-type") === "Web"){
                // This captures 6.x web links:
                webLinkHandler6x(event);
            }else if(link.data("vtz-link-type") === "Dialog"){
                // This captures 5.6 dialog links:
                dialogLinkHandler(event);
            }else if(!!link.attr("href") && !link.attr("vtz-link-type")){
                // This captures 5.x web links:
                webLinkHandler5x(event);
            }else{
                // This captures 5.6 dialog links:
                dialogLinkHandler(event);
            }
        });
        // Standard form submission capture.
        me.components.chatText.on("submit", ".nw_AgentSays form:first", function(event){
            event.preventDefault();
            formContentHandler(event);
        });
        me.components.closeButton.click(closeClickHandler);
        me.components.inputButton.click(submitHandler);
        me.components.inputButton.keyup(keyUpHandler);
        me.components.inputText.keyup(keyUpHandler);
    }

    /**
     * Setup the input text box properties
     * @returns {void}
     */
    function setupInputText() {
        // Set-up input text box

        me.components.inputText.prop("maxlength",me.maxInputLength);
        sendEnabled(false);
    }

    /**
     * This function handles the press of the enter key inside the input text area
     * @param event
     * @return {void}
     */
    function keyUpHandler(event) {
        if(event.which === 13) {
            //Enter key, we should remove the carriage return at the end of the string before sending it
            var s = me.components.inputText.val();
            s = s.replace("\r","").replace("\n","");
            me.components.inputText.val(s);
            submitUserText();
        } else {
            // Set user is typing
            me.jbotservice.setUserIsTyping();
            //Another key or a copy / paste which could lead to more text than allowed
            if(me.components.inputText.val().length > me.maxInputLength) {
                me.components.inputText.val(me.components.inputText.val().substr(0,me.maxInputLength));
                me.components.inputText.scrollTop(me.components.inputText.prop("scrollHeight"));
            }
            sendEnabled(true);
        }
        updateStatusMessage(0);
    }

    /**
     * This function is called when the CSR is typing in livechat mode
     * @param state
     * @returns {void}
     */
    function typingHandler(state) {
        me.csrTyping = state;
        updateStatusMessage(0);
    }

    /**
     * Function called to update the status message
     * @param toAdd
     * @returns {void}
     */
    function updateStatusMessage(toAdd) {
        var charLeft = me.maxInputLength - me.components.inputText.val().length;
        me.numUserQueries += toAdd;
        me.numUserQueries = ( me.numUserQueries < 0 ) ? 0 : me.numUserQueries; // += 0;

        me.components.statusMessage.removeClass(me.css.agentWriting);
        me.components.statusMessage.removeClass(me.css.noCharLeft);

        if(me.isLivechat) {
            if(me.csrTyping) {
                me.components.statusMessage.addClass(me.css.agentWriting);
                me.components.statusMessage.text(me.text.csrIsTyping.replace(me.text.csrNamePlaceHolder,me.text.csrname));
            } else {
                me.components.statusMessage.text("");
            }
        } else {
            if(me.numUserQueries > 0) {
                me.components.statusMessage.addClass(me.css.agentWriting);
                me.components.statusMessage.html(me.text.botIsTyping);
            } else {
                if(charLeft < 1) {
                    me.components.statusMessage.addClass(me.css.noCharLeft);
                }
                me.components.statusMessage.text(me.text.charsLeft.replace(me.text.charsLeftPlaceHolder,charLeft));
            }
        }
    }

    /**
     * This function is called when there is an error while calling the webservice
     * @param {string} errorCode
     * @param {string} message
     * @returns {void}
     */
    function errorHandler(errorCode, message) {
        me.display.addChatLine(message,window.Nina.enums.Author.Error);
        sendEnabled(true);
    }

    /**
     * This function is called when we receive a webservice answer
     * @param {window.Nina.ws.Interaction} interaction
     * @returns {void}
     */
    function responseHandler(interaction) {

        me.isLivechat = interaction.isLivechatConversation();
        me.isLivechatWaiting = interaction.getLivechatStatus() === 1;

        if(interaction.isLivechatConversation()) {
            me.text.csrname = interaction.getLivechatCSRName();
            me.display.setCSRName(me.text.csrname);
        }

        var ad = interaction.getAdditionalData();

        // dirty fix to avoid display ##EmptyAnswer in 6.0
        if( (me.isLivechat && ad.isEmptyAnswer) || /^##EmptyAnswer/.test(interaction.getResponse()) ){
            updateStatusMessage(-1);
            sendEnabled(true);
            return;
        }

        if(interaction.getResponse().length > 0 && interaction.getResponseCode() !== window.Nina.enums.ResponseCode.Command ) {
            me.display.addChatLine(interaction.getResponse(),interaction.getAuthor());
        }

        if( interaction.getOutUrl().length > 0 && $.isFunction(me.urlHandler) ) {

            /*
            var outUrlMetaData = {};
            var ad = interaction.getAdditionalData();
            if (ad && ad.hasOwnProperty("@Version") && ad["@Version"] >= 6) {
                // We have a 6.x agent on the line, or perhaps greater.  In this case we always follow the out URL.
                outUrlMetaData.Follow = "true";
            }
            outUrlMetaData = $.extend(true, outUrlMetaData, interaction.getOutUrlMetadata());

            if($.isFunction(me.urlHandler)) {
                me.urlHandler(true, interaction.getOutUrl(), undefined, outUrlMetaData);
            }
            */
            me.urlHandler(true, interaction.getOutUrl(), undefined, interaction.getOutUrlMetadata() );
        }

        if(interaction.getAdditionalData().hasOwnProperty("PostChatSurvey")) {
            me.postChatSurveyUrl = interaction.getAdditionalData().PostChatSurvey;
        }
        
        if (me.loadCoBrowsingUrl && ad.coBrowsingUrl) {
            if (me.openCoBrowsingUrlInNewWindow) {
                window.open(ad.coBrowsingUrl);
            }
            else {
                window.location.href = ad.coBrowsingUrl;
            }
        }

        me.canSend = interaction.canSend();
        sendEnabled(true);
        updateStatusMessage(-1);
    }

    /**
     * Allow / Prevent the user from sending any new message
     * @param status
     */
    function sendEnabled(status) {
        if(status && me.canSend && me.components.inputText.val().length > 0) {
            me.components.inputButton.removeClass(me.css.sendDisabled);
            me.components.inputButton.removeAttr("aria-disabled");
        } else {
            me.components.inputButton.addClass(me.css.sendDisabled);
            me.components.inputButton.prop("aria-disabled", "true");
        }
    }

    /**
     * This function is called when the user clicks on a web link inside the chat text area
     * @param event
     * @returns {void}
     */
    function webLinkHandler(event, urlAttribute) {
        event.preventDefault();

        // Defensive move in case some unruly existing agent UI is calling this method directly; we default to 5x
        // behavior.
        if (!urlAttribute) {
            urlAttribute = "href";
        }

        if($.isFunction(me.urlHandler)) {
            var url = $(event.currentTarget).attr(urlAttribute);
            var target = $(event.currentTarget).attr("target");
            me.urlHandler(false, url, target, buildMetaDataFromDataAttributes($(event.currentTarget)));
        }
    }

    /**
     * This function is called when the user clicks on a web link inside the chat text area for a 6x agent.
     */
    function webLinkHandler6x(event) {
        webLinkHandler(event, "data-vtz-browse");
    }

    /**
     * This function is called when the user clicks on a web link inside the chat text area for a 5x agent.
     */
    function webLinkHandler5x(event) {
        webLinkHandler(event, "href");
    }

    /**
     * This function is called when the user clicks on a dialog link inside the chat text area
     * @param event
     * @returns {void}
     */
    function dialogLinkHandler(event) {
        event.preventDefault();
        var target = $(event.currentTarget);
        // Use the code attribute if it's there, otherwise fall back to the text
        var toSend = target.attr("code") || target.text();
        var toDisplay =  target.text();

        send(window.Nina.enums.Author.User, toDisplay, toSend, buildMetaDataFromDataAttributes(target));
        me.components.inputText.focus();
    }

    /**
     * Builds a meta data element from the data-* attributes held by the supplied element.  Returns an empty meta data
     * object if the supplied element has no data-* attributes.
     * If the UI is a NinaChat UI, we add the "tap" datasource, to identify in Analytics that
     * the user clicked on the webview
     * @param element The element with attributes.
     */
    function buildMetaDataFromDataAttributes(element) {
        // Build up meta data from the data-* attributes held by the links.
        var metaData = {};

        // Have to do this to get the link attributes back because, surprisingly, the JQuery API for doing this is
        // non-existent.
        for (var i = 0; i < element[0].attributes.length; i++) {
            var currentAttribute = element[0].attributes[i];
            if (currentAttribute.nodeName !== "data-vtz-link-type" && currentAttribute.nodeName.indexOf("data-") === 0) {

                // Add an element to our meta data with the "data-" bit stripped off, per the 6.x contract.
                metaData[currentAttribute.nodeName.substring(5)] = currentAttribute.value;
            }
        }
        
        if (me.ninaChatUi) {
            metaData.ClientMetaData = { dataSource: "tap" };
        }

        return metaData;
    }

    /**
     * This function is called when the user clicks on the close button
     * @param {JQuery.Event} event
     * @returns {void}
     */
    function closeClickHandler(event) {
        event.preventDefault();
        var pendingQuery = false;
        if(me.isLivechat || me.isLivechatWaiting) {
            //me.jbotservice.stopPolling();
            me.jbotservice.sendQuery(window.Nina.enums.Command.LivechatEnd, { Loopback: { "livechatendconversation": true }});
            pendingQuery = true;
        }
        if(me.postChatSurveyUrl.length > 0) {
            if($.isFunction(me.urlHandler)) {
                me.urlHandler(false,me.postChatSurveyUrl,"PostChatSurvey");
            }
        }
        if(me.closeWindow) {
            window.close();
        }
        $("#" + _agentId).trigger(window.Nina.enums.uiEvents.uiClose, [ pendingQuery ]);
    }

    /**
     * This function is called when the user submits a form located inside the content window
     * A form must systematically contain a submit button (this is the only way to send the data of the form, the
     * "regular" send button only sends text contained in the "regular" input text box).
     * A given answer can contain multiple forms but only the data from the elements inside the submitted form will be
     * sent.
     * Inside a given form each element must have a distinct non empty name attribute.
     * For textarea and input text boxes, if the name of the form element is "UserText", then the content will be sent
     * as the user input rather than being sent as additional metadata with the query. If there are multiple or no form
     * elements with the name "UserText", then a specific command is sent instead.
     * We support: input text box, textarea, checkboxes, radio buttons, listboxes, password fields, hidden form fields
     * Their value is sent in sub properties of the additional data node "formData". The sub property name is the name
     * of the form field.
     * @param event
     * @returns {void}
     */
    function formContentHandler(event) {
        event.preventDefault();

        var target = $(event.currentTarget); // This is the form that just got submitted
        var input;
        var name;
        var node;

        var userText = "";
        var toSend = "";
        var formData = {};

        // Input text box
        input = target.find("input:text");
        input.each(function(index, value) {
            node = $(value);
            name = node.prop("name");
            if(name === "UserText") {
                userText = node.val();
                toSend = node.val();
            } else {
                formData[name] = node.val();
            }
        });

        // Hidden form field, never use that as a user input, just send the data along
        input = target.find("input:hidden");
        input.each(function(index, value) {
            node = $(value);
            name = node.prop("name");
            formData[name] = node.val();
        });

        // Password field, never use as a user input, just send the data along. That way it won't appear in the transcript
        input = target.find("input:password");
        input.each(function(index, value) {
            node = $(value);
            name = node.prop("name");
            formData[name] = node.val();
        });

        // Checkboxes, never use as user input. Send array of checked boxes
        input = target.find("input:checkbox:checked");
        input.each(function(index, value) {
            node = $(value);
            name = node.prop("name");

            // If it does not exists, create the array that will contain the list of checked elements
            if(!formData.hasOwnProperty(name) || !$.isArray(formData[name])) {
                formData[name] = [];
            }
            formData[name].push(node.val());
        });

        // Radio button, never used as user input. Need to retrieve the text to display in label field
        input = target.find("input:radio:checked");
        input.each(function(index, value) {
            node = $(value);
            name = node.prop("name");
            formData[name] = node.val();
        });

        input = target.find("textarea");
        input.each(function(index, value) {
            node = $(value);
            name = node.prop("name");
            if(name === "UserText") {
                userText = node.val();
                toSend = node.val().replace("\r"," ").replace("\n"," "); // Don't want any carriage return
            } else {
                formData[name] = node.val();
            }
        });

        input = target.find("select");
        input.each(function(index, value) {
            node = $(value);
            name = node.prop("name");
            // For select form elements, val already returns an array of all the selected elements
            formData[name] = node.val();
        });

        if(target.find('[name="UserText"]').length !== 1) {
            toSend = buildFormDataCommand(formData);
            userText = me.sendFormDataMessage;
        }

        //TODO add check on length of userText

        send(window.Nina.enums.Author.User, userText, toSend, { formData: formData});
    }

    function buildFormDataCommand(formData) {
        var toSend = window.Nina.enums.Command.DialogFormData;
        $.each(formData, function(key,value) {
           var toAppend = "#" + key + "=" + value;

            //TODO: check in WBH code if commands must abide to maxInputLength or not

            if(toSend.length + toAppend.length <= me.maxInputLength) {
                toSend += toAppend;
            }
        });
        return toSend;
    }

    /**
     * This function is called when the user clicks on the send button
     * @param {JQuery.event} event
     * @returns {void}
     */
    function submitHandler(event) {
        event.preventDefault();
        submitUserText();
    }

	function submitUserText() {
        if(me.components.inputButton.hasClass(me.css.sendDisabled)) {
            return;
        }
        var userText = me.components.inputText.val();
        send(window.Nina.enums.Author.User,userText,userText,{});
        if(me.emptyInputUponSubmission){
            me.components.inputText.val("");
        }
	}

    /**
     * This function sends a user query and displays it as well
     * @param {window.Nina.enums.Author} author
     * @param {string} toDisplay the text that should be displayed in the user interface as the user query
     * @param {string} toSend the text that should be sent to the web service as the user query
     * @param {Object} metadata any additional metadata that should be sent in the user query
     * @returns {void}
     */
    function send(author, toDisplay, toSend, metadata) {
        // If one interaction specified to stop sending, do it.
        if(!me.canSend) {
            return;
        }

        // If something to display, display it
        if(toDisplay.length > 0) {
            me.display.addChatLine(toDisplay,author);
        }

        if(toSend.toLowerCase() === window.Nina.enums.Command.DialogVersion.toLowerCase()) {
            me.display.addChatLine("UI Version: " + me.version + "<br />Client Build date: " + me.date, window.Nina.enums.Author.Agent);
        }


        // Only send something if toSend is not empty
        var result = window.Nina.text.Processors.applyProcessors(toSend, [window.Nina.text.Processors.getWhiteSpaceProcessor()]);
        if(result.length === 0) {
            return;
        }
        updateStatusMessage(1);


        // If additional input handler are available, use them
        $.each(me.inputHandlers, function(index, handler) {
            if($.isFunction(handler)) {
                $.extend(metadata, handler(toDisplay, toSend, metadata));
            }
        });
        me.jbotservice.sendQuery(toSend,metadata);
        sendEnabled(false);
    }

    return /** @lends window.Nina.ui.UIHandler.prototype */ {
        /**
         * Sets the URL handler called when a user clicks on a web link
         * @param {function(boolean,string,string,object):void} handler the URL handler
         * @returns {void}
         */
        setURLHandler: function(handler) {
            me.urlHandler = handler;
        },
        /**
         * Sends a query and display it
         * @param {string} toDisplay text to display in the history
         * @param {string} toSend text to send to the web service as user query
         * @param {Object} metadata additional metadata to send along in the user query
         * @returns {void}
         */
        sendQuery: function(toDisplay, toSend, metadata) {
            send(window.Nina.enums.Author.User,toDisplay,toSend,metadata);
        },
        /**
         * Adds a chat line from a given author
         * @param {string} toDisplay the text to display in the user interface
         * @param {window.Nina.enums.Author} author the source of the message
         * @returns {JQuery}
         */
        addChatLine: function(toDisplay,author) {
            return me.display.addChatLine(toDisplay, author);
        },
        /**
         * Adds an array of lines to the history
         * @param {Array.<Object>} array
         * @returns {void}
         */
        addChatLines: function(array) {
            return me.display.addChatLines(array);
        },
        /**
         * Clears the chat history.
         * @returns {void}
         */
        clearChatHistory: function() {
            return me.display.clearChatHistory();
        },
        /**
         * Add an input handler
         * @param {function(string,string,Object):Object} handler
         * @returns {void}
         */
        addInputHandler: function(handler) {
            me.inputHandlers.push(handler);
        },
        setDisplay: function(display) {
            me.display = display;
        },
        getDisplay: function() {
            return me.display;
        }
    };
};

/**
 * @namespace
 */
window.Nina = window.Nina || {};
/**
 * @namespace
 */
window.Nina.ui = window.Nina.ui || {};

/**
 * Creates a new survey object
 * @returns {void}
 */
window.Nina.ui.newSurvey = function(_agentId, _config, _botService, _cookiesJar) {
    "use strict";
    var $ = window.Nina.$, modules = {}, uiElements = {};

    modules.config = _config;
    modules.botService = _botService;
    modules.cookiesJar = _cookiesJar;

    uiElements.banner = $('#' + _agentId + ' .nw_SurveyBanner');
    uiElements.bannerClose = $('<span class="close fa fa-close"></span>');
    uiElements.survey = $('#' + _agentId + ' .nw_Survey');
    uiElements.surveyClose = $('<span class="close fa fa-close"></span>');

    function newBanner(){

        var toggle = "toggle",
            openSurvey = false,
            autoHideTimer = null,
            isVisible = false;

        if( modules.config.bannerAnimation === "slide" ){
            toggle = "slideToggle";
        }else if ( modules.config.bannerAnimation === "fade" ){
            toggle = "fadeToggle"
        }

        uiElements.banner.append( uiElements.bannerClose );

        uiElements.banner.on('click', function(){
            if( openSurvey ){
                modules.botService.sendQuery( window.Nina.enums.Command.StartSurvey, {});
                hideBanner();
            }
        });

        uiElements.bannerClose.on('click', function(event){
            event.stopPropagation();
            hideBanner();
        });

        function showBanner( text, action ){
            if( typeof text === "string" ){
                uiElements.banner.find('.text').html( text );
            }
            if( undefined !== typeof action ){
                openSurvey = !!action;
            }
            uiElements.banner[ openSurvey ? "removeClass" : "addClass" ]('autoHide');
            uiElements.banner[toggle]();
            isVisible = true;
        }

        function hideBanner(){
            if( autoHideTimer ){
                window.clearTimeout( autoHideTimer );
                autoHideTimer = null;
            }

            uiElements.banner[toggle]();
            isVisible = false;
        }

        function setAutoHideBanner( delay ){
            autoHideTimer = window.setTimeout( hideBanner, delay*1000 )
        }

        return {
            show: showBanner,
            hide: hideBanner,
            isVisible: function(){ return isVisible; },
            setAutoHide: setAutoHideBanner
        }
    }

    function newSurvey( params ){

        var surveyIsOpened = false, sendEnabled = true;
        params.SurveyTitle = params.SurveyTitle || "Survey";

        uiElements.survey.find('h2').html( params.SurveyTitle );
        uiElements.survey.find('form').on('submit', function(event){
            event.preventDefault();
            if(sendEnabled){
                var params = $(this).serializeArray();
                if (params.length > 0) {
                    sendFormData( params );
                    sendEnabled = false;
                }
            }
        });

        uiElements.survey.find(">div").append( uiElements.surveyClose );
        uiElements.surveyClose.on("click", function(){
            if( modules.cookiesJar.isOngoingSession() ){
                modules.botService.sendQuery( window.Nina.enums.Command.AbortSurvey, {} );
            }
            uiElements.survey.fadeOut();
            $("#" + _agentId).trigger( window.Nina.enums.uiEvents.surveyClosed );
        });

        uiElements.survey.on('keyup blur', '[name=verbatim]', function(){
            var trimmed, verbatim = $(this);
            if( verbatim.val().length > modules.config.verbatimMaxLength ){
                trimmed = verbatim.val().substring(0, modules.config.verbatimMaxLength);
                verbatim.val( trimmed );
            }
        });

        function displayQuestions( params ){
            sendEnabled = true;
            if("SurveyQuestions" in params && typeof params.SurveyQuestions === "array"){

                // multiple questions - not implemented yet
                // TODO: implement multiple questions survey

            }else if("SurveyQuestion" in params){
                uiElements.question = uiElements.survey.find('.nw_question');
                var choices = params.SurveyQuestionChoices.split("#"),
                    htmlCode = questionFromTemplate({
                        id:         params.SurveyQuestionID,
                        title:      params.SurveyQuestion || "No title defined",
                        template:   params.SurveyQuestionType || "radio",
                        choices:    choices || null
                    });
                uiElements.question.html( htmlCode );
                var button = uiElements.survey.find('[type="submit"]');
                if( params.SurveyButton === "" ){
                    button.hide();
                }else{
                    button.val( params.SurveyButton || "» Next" );
                    button.show();
                }


                if( params.SurveyQuestionType === "radioH" ){
                    uiElements.question.addClass("nw_survey_horizontal");

                    var columnSize = [,, "half", "third", "fourth", "fifth", "sixth"][ choices.length ] || "default";
                    uiElements.question.find("label").addClass( columnSize );

                }else{
                    uiElements.question.removeClass("nw_survey_horizontal");
                }

                if( params.SurveyQuestionType === "radioOther"){

                    uiElements.verbatim = uiElements.question.find("textarea");
                    uiElements.verbatim.attr("disabled", "disabled");
                    uiElements.question.find("input[type='radio']").on("change", function(event){

                        if( $("input[type='radio']:last").is(":checked") ){
                            uiElements.verbatim.removeAttr("disabled").focus();
                        }else{
                            uiElements.verbatim.html("").attr("disabled", "disabled");
                        }
                    });
                }
            }

            if(!surveyIsOpened){
                uiElements.survey.fadeIn();
                surveyIsOpened = true;
                $("#" + _agentId).trigger( window.Nina.enums.uiEvents.surveyOpened );
            }

            $("#" + _agentId).trigger( window.Nina.enums.uiEvents.surveyQuestionDisplayed, [params] );


        }

        function sendFormData( data ){
            if( data.length < 1 ){
                return false;
            }else{
                var command = window.Nina.enums.Command.DialogFormData;
                // command template is ##SkipAlyze#FormData#Question1=2#AnswerText=choice 2#verbatim=Here's some user text

                for( var index = 0, len = data.length ; index < len ; index++ ){
                    var el = data[index],  // { name: "Question1", value: "1#choice 1" }
                        answer = el.value.split("#");

                    if( answer.length === 2 ){
                        command += "#" + el.name + "=" + answer[0] + "#" + el.name + "Text=" + answer[1];
                    }else{
                        command += "#" + el.name + "=" + answer[0];
                    }
                }
                if( modules.cookiesJar.isOngoingSession() ){
                    modules.botService.sendQuery( command, {} );
                }else{
                    uiElements.survey.fadeOut();
                    $("#" + _agentId).trigger(window.Nina.enums.uiEvents.surveyClosed);
                }

                $("#" + _agentId).trigger(window.Nina.enums.uiEvents.surveyQuestionSent);
                return true;
            }
        }

        function questionFromTemplate( question ){
            var choices, index, id, name, len, html;

            //generate title
            html = ['<h3>' + question.title + '</h3>'];

            if( question.template.indexOf("radio") === 0 && question.choices ){ // we accept radio, radioOther, radioH

                choices = question.choices;

                for( index = 0, len = choices.length ; index < len ; index++ ){
                    id = index + 1;
                    name = (question.template === "radioOther" && index === len-1) ? "other" : choices[index];
                    html.push('<label><input type="radio" name="' + question.id + '" tabindex="' + id + '" value="' + id +'#'+ name.replace(/"/g, "'") + '" />' +
                        choices[index] + '</label>');
                }
                if( question.template === "radioOther" ){
                    html.push("<textarea name='verbatim' tabindex='20' maxlength='400'></textarea>");
                }
                if( question.template === "radioH"){
                    html.push('<div class="clear"></div>');
                }
            }

            if( question.template === "stars" && question.choices ){

                choices = question.choices;
                html.push("<div class='nw_Stars'>");
                for( index = 0, len = choices.length ; index < len ; index++ ){
                    id = index + 1;
                    name = choices[index];
                    html.push("<div class='nw_Star fa fa-star-o' tabindex='" + id + "' data-id='" + id + "' data-label='" + name + "'></div>");
                }
                html.push("</div><div class='nw_StarsLabel'>&nbsp;</div>");
            }

            return html.join('');
        }

        function hideSurvey(){
            uiElements.survey.fadeOut();
            surveyIsOpened = false;
            $("#" + _agentId).trigger( window.Nina.enums.uiEvents.surveyClosed );
        }

        return {
            displayQuestions: displayQuestions,
            hide: hideSurvey,
            isVisible: function(){ return surveyIsOpened; },
            sendFormData: function(params){ return sendFormData(params); },
            sendEnabled: function( value ){
                if( undefined !== value ){
                    sendEnabled = !!value;
                    return true;
                }else{
                    return sendEnabled;
                }
            }
        }
    }

    var banner = newBanner();
    var survey = null;

    modules.botService.addMessageHandler(function surveyMessageHandler(interaction) {
        var ad = interaction.getAdditionalData();

        if("SurveyBanner" in ad){
            var openSurvey = !("SurveyEnded" in ad),
                autoHide = !openSurvey && typeof modules.config.bannerFadesAfter === "number";

            window.setTimeout(function(){
                banner.show( ad.SurveyBanner, openSurvey );

                if( autoHide ){
                    banner.setAutoHide( modules.config.bannerFadesAfter );
                }
            }, 1000);

        }
        if("SurveyQuestion" in ad && !("SurveyEnded" in ad) ){ // this means we receive the next question

            if( !survey ){
                survey = newSurvey( ad );
            }

            survey.displayQuestions( ad );
        }
        if("SurveyEnded" in ad){
            survey.hide();
        }
    });

    window.Nina.aSurvey = function(data){
        return newSurvey( data );
    };

    modules.botService.addSessionEndingHandler(function(){
        if(banner.isVisible()){
            banner.hide();
        }
        if(survey && survey.isVisible()){
            survey.hide();
        }
    });

    $("#" + _agentId).on(window.Nina.enums.uiEvents.surveyQuestionDisplayed, function( event, question ){
        if( undefined === typeof question || !question.hasOwnProperty("SurveyQuestionType") ){
            return;
        }
        var questionName = question.SurveyQuestionID || "questionName";

        if( question.SurveyQuestionType === "stars" ){
            $(".nw_Star").on("mouseover focus", function(event){
                var id = $(this).data("id"), label = $(this).data("label");
                $.each($(".nw_Star"), function(index, star){
                    var s = $(star);
                    s[( s.data("id") <= id ) ? "addClass" : "removeClass"]("fa-star");
                    s[( s.data("id") <= id ) ? "removeClass" : "addClass"]("fa-star-o");
                });
                $(".nw_StarsLabel").html(label);
            });
            $(".nw_Stars").on("mouseout", function(event){
                $.each($(".nw_Star"), function(index, star){
                    $(star).addClass("fa-star-o");
                    $(star).removeClass("fa-star");
                });
                $(".nw_StarsLabel").html("&nbsp;");
            });
            $(".nw_Star").on("click", function(){
                var id = $(this).data("id"), label = $(this).data("label");
                $.each($(".nw_Star"), function(index, star){
                    var s = $(star);
                    s[( s.data("id") <= id ) ? "addClass" : "removeClass"]("nw_StarActive");
                });

                survey.sendFormData( [{ name: questionName, value: id+"#"+label }] );
            });
            $(".nw_Star").on("keyup", function( event ){
                if( event.which === 13 ){
                    $(this).trigger("click");
                }
            });
        }
    });
    $("#" + _agentId).on(window.Nina.enums.uiEvents.surveyQuestionSent, function( event ){
        $(".nw_Star").off("mouseover");
        $(".nw_Stars").off("mouseout");
    });


    return true;
};


//= require ../../../ninajs/framework/ui/domInject
//= require ../../../ninajs/framework/config/config
//= require ../../../ninajs/framework/common/cookies
//= require ../../../ninajs/framework/webservice/jbotservice
//= require ../../../ninajs/framework/webservice/jtranscriptservice
//= require ../../../ninajs/framework/webservice/jqualification
//= require ../../../ninajs/framework/ui/ui
//= require ../../../ninajs/framework/ui/displayHistory
//= require ../../../ninajs/framework/ui/firstmessage
//= require ../../../ninajs/framework/ui/survey
//= require ../../../ninajs/framework/ui/url
//= require ../../../ninajs/framework/helper/polyfills
//= require ../../../ninajs/framework/helper/debug

window.NinaVars = window.NinaVars || {};

(function () {
    "use strict";
    var $ = Nina.$,
        c, di, bs, dh, ui, tr, qs, fm, urlh, isFirstInteraction, firstTime;

    /*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
     *                                               *
     *      Assistant configuration                  *
     *                                               *
     *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

    var config = Nina.config.newConfig({
        ws: {
            preprod: {
                houstonURL: "https://agent-preprod.au.nod.nuance.com/houston/houston.html",
                houstonURL_IE89: "https://agent-preprod.au.nod.nuance.com/houston/houston_ie89.js",
                base_url: {
                    "AS": "https://agent-preprod-as.au.nod.nuance.com/ipaustralia-service_au-englishus-WebBotRouter/",
                    "AM": "https://agent-preprod-am.au.nod.nuance.com/ipaustralia-service_au-englishus-WebBotRouter/"
                },
                use_smart_router: false,
                smart_router_endpoint: "",
                sr_agent_endpoint: "",
                debug: true
            },
            prod: {
                houstonURL: "https://agent.au.nod.nuance.com/houston/houston.html",
                houstonURL_IE89: "https://agent.au.nod.nuance.com/houston/houston_ie89.js",
                base_url: {
                    "AS": "https://agent-as.au.nod.nuance.com/ipaustralia-service_au-englishus-WebBotRouter/",
                    "AM": "https://agent-am.au.nod.nuance.com/ipaustralia-service_au-englishus-WebBotRouter/"
                },
                use_smart_router: false,
                smart_router_endpoint: "",
                sr_agent_endpoint: "",
                debug: false
            },
            timeoutQuery: 15,
            errorMessage: "Error while contacting service",
            urltoolong: "Error request URL too long",
            tooManyQueries: "Too many pending queries",
            maxQueries: 16,
            sendReferrer: false

        },
        cookies: {
            timeoutInteraction: 5 * 60 * 1000,
            lifeTimePersist: 30 * 24 * 60 * 60 * 1000,
            restrictDomain: false,
            restrictPath: false,
            secure: true
        },
        firstMessage: {
            transcriptMessage: "<span class=\"nw_TranscriptLink\">Click here to retrieve the chat transcript.</span>",
            welcome: function () {
                if (NinaVars.welcome) {
                    var obj = NinaVars.welcome;
                    delete NinaVars.welcome;
                    return $.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj.toString();
                } else {
                    return "Hello, I'm Nina, Nuance's virtual assistant. I'm here to help with your general enquiries.";
                }
            }
        },
        ui: {
            maxInputLength: 110,
            maxThrsholdLine: 29,
            headerAgent: "",
            headerUser: "",
             botIsTyping:""
            
        },
        dom: {
            agentHTML: "<div id=\"ipAustralia-block\" class=\"nw_Agent\" role=\"presentation\"> <div id=\"nw_Header\" class=\"nw_Header\" role=\"navigation\"> <div class=\"nw_AvtContainer\" role=\"navigation\"> <div class=\"nw_Avatar\"></div> </div> <div class=\"nw_AgentHeader\" role=\"navigation\">ASK ALEX FOR HELP</div> <div class=\"nw_Controls\" role=\"navigation\"> <a href=\"#\" class=\"button nw_Expand\" aira-live=\"polite\" title=\"Exapnd virtual assistant for a larger view\" aria-label=\"Exapnd virtual assistant for a larger view\" id=\"ex\" accesskey=\"e\"></a> <a href=\"#\" class=\"button nwOpen\" aira-live=\"polite\" title=\"Open virtual assistant to get help around the site.\" aria-label=\"Open virtual assistant to get help around the site.\" id=\"cl\" accesskey=\"c\"></a> </div> </div> <div class=\"nw_Dialog\" role=\"dialog\"> <div class=\"nw_Conversation\" role=\"navigation\" aira-live=\"polite\"> <div class=\"nw_ConversationText\" role=\"navigation\" aira-live=\"polite\"></div> </div> <div class=\"nw_AgentStatus\"> <div class=\"nw_StatusMessage\"></div> </div> <div class=\"nw_Input\" role=\"form\" role=\"navigation\" aira-live=\"polite\" aira-label=\" Enter question for Alex virtual assistant\"> <textarea class=\"nw_UserInputField\" onfocus=\"this.placeholder=''\" onblur=\"this.placeholder='Ask questions about trade marks'\" placeholder=\"Ask questions about trade marks\" rows=\"2\"/> <div class='nw_UserSubmit' role=\"navigation\" aira-live=\"polite\" aira-label=\" Press enter or click on SEND button\"> <button class='nw_SubmitBtn' id=\"sendBtn\">SEND</button> </div> </div> <div id=\"dcw\" class=\"dcw\" /> </div> </div> ",
            agentMinHTML: ""
        }
    });

    /*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
     *                                               *
     *      Modules instanciation                    *
     *                                               *
     *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

    c = Nina.storage.newCookiesJar(config.agentId, config.cookies);
    di = Nina.ui.DOMInject(config.agentId, config.dom);
    bs = Nina.ws.newJBotService(config.ws, c);
    dh = Nina.ui.newDisplayHistory(config.agentId, config.ui, c);
    ui = Nina.ui.newUIHandler(config.agentId, config.ui, bs, dh);
    tr = Nina.ws.newJTranscriptService(config.ws);
    qs = Nina.ws.newJQualificationService(config.ws, c);
    fm = Nina.ui.newFirstMessage(config.firstMessage, c, ui, tr);
    urlh = Nina.ui.newURLHandler(config.popup, config.url, ui);


    /* passing origin variable */
    ui.addInputHandler(function () {
        return {
            origin: document.location.href
        };
    });

    /* passing activeSite variable */
    if (NinaVars.preprod) {
        var temphoustonURL = "https://agent-preprod.au.nod.nuance.com/houston/houston.html";
        var temphoustonURL_IE89 = "https://agent-preprod.au.nod.nuance.com/houston/houston_ie89.js";
    } else {
        var temphoustonURL = "https://agent.au.nod.nuance.com/houston/houston.html";
        var temphoustonURL_IE89 = "https://agent.au.nod.nuance.com/houston/houston_ie89.js";
    }

    $.get(temphoustonURL, function (site) {
        setActiveSite(site);
    });


    function setActiveSite(site) {

        site = site.trim();

        window.NinaVars.activeSite = site;

        return;
    }



    /* passing source variable */
    //if (navigator.userAgent.match(/(iPod|iPhone|Android)/)) {
    if (navigator.userAgent.match(/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/)) {
        NinaVars.source = navigator.userAgent.toString().toLowerCase();
    } else {
        NinaVars.source = "desktop";
    }

    if ("UICallback" in Nina) Nina.UICallback({
        $: $,
        cookieJar: c,
        botservice: bs,
        uihandler: ui
    });
    Nina.debug = Nina.helper.newDebug(ui, c);


    window.ipa = window.ipa || {};
    window.ipa.virtualAssistant = window.ipa.virtualAssistant || {};


    var isLiveAgent = '';
    var isMobileNavigator = false;
    var chatUrl = '';
    var va = window.ipa.virtualAssistant;
    var isIPad = false; // used to check if device is IPAD
    $(document).ready(function () {

        var isMobile = window.matchMedia("only screen and (max-width: 768px)");
        var isDesktop = window.matchMedia("only screen and (min-width: 769px)");


        var endChatSession = "~_End_Chat_Session";
        
        va.OPEN_ALEX_TEXT = "Open Alex virtual assistant. Ask questions to get help around the site.";
        va.OPEN_LIVE_AGENT = "Open Live Agent. Ask questions to Agent";
        va.MINIMIZE_LIVE_AGENT = "Minimize Live Agent Window ";
        va.END_LIVE_AGENT_CHAT = "End Chat With Live Agent";
        va.CLOSE_ALEX_TEXT = "Close Alex virtual assistant";
        va.EXPAND_ALEX_TEXT = "Expand Alex virtual assistant for a larger view";
        va.EXPAND_LIVE_AGENT = "Expand Live Agent Window for Larger View";
        va.CONTRACT_ALEXT_TEXT = "Contract Alex virtual assistant";
        va.CONTRACT_LIVE_AGENT = "Contract Live Agent Window";
        va.ASK_ALEX_TEXT = "Enter question for Alex virtual assistant";

        var $ab = $('#ipAustralia-block');

        isFirstInteraction = !c.isOngoingSession();
        firstTime = isFirstInteraction;
        if (!!navigator.userAgent.match(/iPhone|Android|BlackBerry|Windows Phone|webOS/i)) {
            isMobileNavigator = true;
        }
        if (navigator.userAgent.match(/iPad/)) {
            isIPad = true;
        }
        var cookieJar = document.cookie.split(";");
        for (var x = 0; x < cookieJar.length; x++) {
            var oneCookie = cookieJar[x].split("=");
            if (oneCookie[0].indexOf("Nina-ipAustralia-block-session") !== -1 && oneCookie[1].indexOf('isLiveAgent') > 0) {
                isLiveAgent = true;
                chatUrl = decodeURIComponent(oneCookie[1].substring(oneCookie[1].lastIndexOf('chatUrl') + 16));
                chatUrl = chatUrl.split('\"')[0];
            }
        }

        if (isFirstInteraction) {
            if (!isDesktop.matches || isMobileNavigator) { // this condition for Mobile
                $('#ipAustralia-block , .nw_Input').addClass('nw_initial');
                $('#ex').addClass('nw_Expand nw_initial');
                $('#cl').addClass('nwOpen');
                setLabel($('#cl'), va.OPEN_ALEX_TEXT);
            } else {
                $("#ipAustralia-block , .nw_Expand ,.nw_Input").addClass("nw_initial");
            }
        } else {
            if (!isDesktop.matches || isMobileNavigator) {
                if (isLiveAgent) {
                    loadLiveAgent();
                }
                $('#ipAustralia-block ,.nw_Dialog').addClass('nwMinimize');
                $('#ex').addClass('nw_initial');
            } else {
                if (isLiveAgent) {
                    loadLiveAgent();
                }
                $('#nw_Header').addClass('nwMinimize');
                $('.nw_Dialog').addClass('nwMinimize nwClosed');
                $('#ex').removeClass('nw_Expand nw_collapse');
            }

        }
        if (shouldShowAlex()) {
            confirmAlex();
        } else {
            $ab.remove();
            return;
        }

        function confirmAlex() {
            var confirmClass = 'alex-display-confirmed';
            $ab.addClass(confirmClass);
            $('.btn-ask').addClass(confirmClass);
            $('#skip-link-alex').addClass(confirmClass);
        }


        function shouldShowAlex() {

            // pages where VA is not supposed to be shown
            /*var greylist = [
            	"/law/",
            	"/tax-professionals/",
            	"/newsroom/smallbusiness/",
            	"/calculators-and-tools/host"
            ];*/
            // Added the pages where Alex is to be shown  

            var whiteList = [
                //following are to support Nuance preprod and ui-dev domains
                "/ipa/",
                "/ipa_apac/",
                "/ps/ipa/",
                "/ps/ipa_usa/",
                "/trade-marks/"
            ];

            var urlpath = window.location.pathname.toLowerCase();

            if (insideSiteArea(urlpath, whiteList)) {

                return true;
            } else {
                return alexConversationStarted();
            }
        }


        function insideSiteArea(url, siteAreas) {
            for (var i = 0; i < siteAreas.length; i++) {
                var siteArea = siteAreas[i];
                var match = url.slice(0, siteArea.length) == siteArea;
                if (match) return true;
            }

            return false;
        }

        function alexConversationStarted() {

            var cookie = getAlexCookieValue();
            if (cookie === null) return false;
            var sessionSavedValue = '"sci"';
            return cookie.indexOf(sessionSavedValue) >= 0;
        }

        function getAlexCookieValue() {

            var alexSessionCookieName = "Nina-ipAustralia-block-session";
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim().split("=");
                var name = cookie[0];
                if (name !== alexSessionCookieName) continue;
                var content = unescape(cookie[1]);
                return content;
            }
            return null; // no alex cookie found.
        }


        function setLabel($jqObject, text) {
            $jqObject
                .attr("title", text)
                .attr("aria-label", text);
        }

        $ab.find(".nw_ConversationText").attr("aria-live", "polite");
        setLabel($ab.find(".nw_UserInputField"), va.ASK_ALEX_TEXT);
        setLabel($ab.find(".nw_Close"), va.OPEN_ALEX_TEXT);
        setLabel($ab.find(".nw_Expand"), va.EXPAND_ALEX_TEXT);

        function hasWhiteSpace(s) {
            return /^\s/g.test(s);
        }
        $ab.find(".nw_UserInputField").keydown(function (event) {
            var varLength = $(".nw_UserInputField").val().trim().length;
            var userText = $('.nw_UserInputField').val();
            if (event.which == 13 && hasWhiteSpace(userText)) {
                $('.nw_UserInputField').val(userText.replace(/(^\s+|\s+$)/g, ''));
                
                event.preventDefault();
                event.stopPropagation();
            } else if (event.which == 13 && userText.length > 0) {
                if (isFirstInteraction && firstTime && varLength > 0) {
                    $('#ipAustralia-block ,.nw_Expand ,.nw_Input').removeClass('nw_initial');
                    $('#ipAustralia-block ,.nw_Dialog ,.nw_Conversation').addClass('nwSend');
                    $('#cl').removeClass('nwOpen');
                    $('#cl').addClass('nw_Close');
                    setLabel($('#cl'), va.CLOSE_ALEX_TEXT);
                    firstTime = false;
                } else if (!firstTime) {
                    $('#ipAustralia-block, .nw_Dialog, .nw_Conversation').removeClass('nwSend');
                    $ab.removeClass('nw_initial');
                    $('#ipAustralia-block, .nw_Dialog, .nw_Conversation').addClass('nwNormal');
                }
                if ($('.nw_UserInputField').hasClass('nwAutosize2')) {
                    $('.nw_UserInputField').removeClass('nwAutosize2');
                    $('.nw_UserInputField').addClass('nwAutosize1');
                }
                // written for WCAG , assign tab index for all the divs under conversationTexts .
                $('.nw_ConversationText div').each(function (index) {
                    $(this).attr('tabindex', 0);
                    $(".nw_UserInputField").focus();
                });

                event.preventDefault();
                return false;
            }

            if (event.keyCode == 8) { // backspace
                if ((isDesktop.matches && !isMobileNavigator) || isIPad) {
                    if (varLength > 29) {
                        $('.nw_UserInputField').removeClass('nwAutosize1');
                        $('.nw_UserInputField').addClass('nwAutosize2');
                    } else {
                        $('.nw_UserInputField').removeClass('nwAutosize2');
                        $('.nw_UserInputField').addClass('nwAutosize1');
                    }
                } else {
                    $('.nw_UserInputField').removeClass('nwAutosize2');
                    $('.nw_UserInputField').addClass('nwAutosize1');
                }
            }
        });

        // written for WCAG, pressed enter on Header will open VA. Same as .click() event
        $('#nw_Header').bind('keydown', function (event) {
            if (event.which == 13) { //Enter key pressed
                $('#nw_Header').click();
            }
        });

        // written for WCAG, pressed enter on nw_TranscriptLink , .click() event will be fired.
        $('.nw_SystemSays').on('keydown', function (event) {
            if (event.which == 13) { //Enter key pressed
                $('.nw_TranscriptLink').click();
            }
        });

        // written for WCAG, pressed enter on expand icon will expand the VA. Same as .click() event
        $('#ex').bind('keydown', function (event) {
            if (event.which == 13) { //Enter key pressed
                event.preventDefault();
                event.stopPropagation();
                $ab.toggleClass("expanded");
                var isExpanded = $ab.hasClass("expanded");
                $ab.removeClass('nwNormal');

                if (isExpanded) {
                    $ab.removeClass("nwSend nwNormal nwClosed");
                    $('.nw_Conversation').removeClass('nwNormal nwSend');
                    $('.nw_Dialog').removeClass('nwNormal nwSend nwClosed');
                    if (isIPad) {
                        $ab.addClass('ipadExpand');
                    } else {
                        $ab.addClass('nwExpand1');
                    }
                    $('.nw_Dialog').addClass('nwExpand1');
                    $('.nw_Conversation').addClass('nwExpand1');
                } else {
                    if (isIPad) {
                        $ab.removeClass('ipadExpand');
                    } else {
                        $ab.removeClass('nwExpand1');
                    }
                    $('#ipAustralia-block, .nw_Dialog, .nw_Conversation').addClass('nwNormal');

                }

                if ($('#ex').hasClass('nw_Expand')) {
                    $('.nw_Expand.button').removeClass('nw_Expand');
                    $(this).addClass('nw_collapse');
                    if (!isLiveAgent) {
                        setLabel($('#ex'), va.CONTRACT_ALEXT_TEXT);
                    } else {
                        setLabel($('#ex'), va.CONTRACT_LIVE_AGENT);
                    }

                } else {
                    $('.nw_collapse.button').removeClass('nw_collapse');
                    $(this).addClass('nw_Expand');
                    if (!isLiveAgent) {
                        setLabel($('#ex'), va.EXPAND_ALEX_TEXT);
                    } else {
                        setLabel($('#ex'), va.EXPAND_LIVE_AGENT);
                    }
                }

                return false;
            }
        });

        // written for WCAG, pressed enter on close/open icon will open/close the VA. Same as .click() event
        $('#cl').bind('keydown', function (event) {
            if (event.which == 13) { //Enter key pressed
                event.preventDefault();
                event.stopPropagation();
                if (!isFirstInteraction && !firstTime) {
                    va.open();
                    if (isIPad) {
                        va.iPadOpen();
                    }
                    firstTime = true;
                } else if (!isFirstInteraction && firstTime) {
                    va.close();
                    if (isIPad) {
                        va.iPadClose();
                    }
                    firstTime = false;
                } else {
                    if (firstTime) {
                        va.open();
                        if (isIPad) {
                            va.iPadOpen();
                        }
                        firstTime = false;
                    } else if (va.isOpen() && !firstTime) {
                        va.close();
                        if (isIPad) {
                            va.iPadClose();
                        }
                    } else {
                        va.open();
                        if (isIPad) {
                            va.iPadOpen();
                        }
                    }
                }
                return false;
            }
        });

        // written for WCAG , to maintain tab index
        $(".nw_AgentSays").focus(function (event) {
            $("#cl").attr('tabindex', 0);
        });

        $("#cl").focus(function (event) {
            $("#ex").attr('tabindex', 0);
        });

        $("#ex").focus(function (event) {
            $("#nw_Header").attr('tabindex', 0);
        });


        $('.nw_UserInputField').focus(function (event) {

            $('.nw_AgentLastAnswer').attr('tabindex', 0);

            if (isIPad) {
                va.iPadOpen();
            }
            if ($('#ipAustralia-block').hasClass('nw_initial')) {
                $('.nw_AgentStatus').addClass('nw_StatusVisibilityNone');
            } else {
                $('.nw_AgentStatus').removeClass('nw_StatusVisibilityNone');
            }
        });

        

        $('.nw_UserInputField').focusout(function (event) {
            $('.nw_AgentStatus').addClass('nw_StatusVisibilityNone');
        });

        $('.nw_UserInputField').blur(function (event) {
            if (isIPad) {
                va.iPadClose();
            }
        });

        $('.nw_SystemSays').focus(function (event) {
            $('#cl').attr('tabindex', 0);
        });

        $(".nw_UserInputField").keypress(function (event) {
            var varLength = $(this).val().trim().length;
            // added condition for iPad , since ipad shld have all the functionality same as Desktop view
            if ((isDesktop.matches && !isMobileNavigator) || isIPad) {
                if (varLength > 29) {
                    $('.nw_UserInputField').removeClass('nwAutosize1');
                    $('.nw_UserInputField').addClass('nwAutosize2');
                } else {
                    $('.nw_UserInputField').removeClass('nwAutosize2');
                    $('.nw_UserInputField').addClass('nwAutosize1');
                }
            } else {
                $('.nw_UserInputField').removeClass('nwAutosize2');
                $('.nw_UserInputField').addClass('nwAutosize1');
            }

        });


        $("#ex").click(function (event) { // handler for Expand / shrink icon click

            event.preventDefault();
            event.stopPropagation();
            $ab.toggleClass("expanded");
            var isExpanded = $ab.hasClass("expanded");
            $ab.removeClass('nwNormal');
            if (isExpanded) {
                $('#ipAustralia-block ,.nw_Dialog').removeClass("nwSend nwNormal nwClosed");
                if (!isLiveAgent) {
                    $('.nw_Conversation').removeClass('nwNormal nwSend');
                } else {
                    // live Agent;
                    $('.iwt-received-messages-panel').removeClass('nwNormal');
                }

                
                if (isIPad) {
                    $ab.addClass('ipadExpand');

                } else {
                    $ab.addClass('nwExpand1');
                }
                
                 if (!isLiveAgent) {
                    $('.nw_Dialog,.nw_Conversation').addClass('nwExpand1');
                } else {
                    $('.nw_Dialog,.iwt-received-messages-panel').addClass('nwExpand1');
                }
                
            } else {
                if (isIPad) {
                    $ab.removeClass('ipadExpand');
                } else {
                    $ab.removeClass('nwExpand1');
                }
                 if (!isLiveAgent) {
                    $('.nw_Dialog ,.iwt-received-messages-panel').removeClass('nwExpand1');
                    $('#ipAustralia-block,.nw_Dialog ,.nw_Conversation').addClass('nwNormal');
                } else {
                    $('.nw_Dialog ,.iwt-received-messages-panel').removeClass('nwExpand1');
                    $('#ipAustralia-block,.nw_Dialog ,.iwt-received-messages-panel').addClass('nwNormal');
                }

            }
            if ($('#ex').hasClass('nw_Expand')) {
                $('.nw_Expand.button').removeClass('nw_Expand');
                $(this).addClass('nw_collapse');
                if (!isLiveAgent) {
                    setLabel($('#ex'), va.CONTRACT_ALEXT_TEXT);
                } else {
                    setLabel($('#ex'), va.CONTRACT_LIVE_AGENT);
                }
            } else {
                $('.nw_collapse.button').removeClass('nw_collapse');
                $(this).addClass('nw_Expand');
                if (!isLiveAgent) {
                    setLabel($('#ex'), va.EXPAND_ALEX_TEXT);
                } else {
                    setLabel($('#ex'), va.EXPAND_LIVE_AGENT);
                }

            }

            return false;
        });


        $('.nw_SubmitBtn').click(function (event) { // handler for Submit button click
            var varLength = $(".nw_UserInputField").val().trim().length;
             var userText = $('.nw_UserInputField').val();
            if (hasWhiteSpace(userText)) {
                 $('.nw_UserInputField').val(userText.replace(/(^\s+|\s+$)/g, ''));

                event.preventDefault();
                event.stopPropagation();
            }
            else if(varLength > 0){
            if (isFirstInteraction && firstTime && varLength > 0) {
                $('#ipAustralia-block ,.nw_Expand,.nw_Input ').removeClass('nw_initial');
                $('#ipAustralia-block ,.nw_Dialog,.nw_Conversation').addClass('nwSend');
                $('#cl').removeClass('nwOpen');
                $('#cl').addClass('nw_Close');
                setLabel($('#cl'), va.CLOSE_ALEX_TEXT);
                firstTime = false;
            } else if (!firstTime && $ab.hasClass('nwSend')) {
                $('#ipAustralia-block,.nw_Dialog,.nw_Conversation').removeClass('nwSend');
                $('#ipAustralia-block ,.nw_Dialog,.nw_Conversation').addClass('nwNormal');
                firstTime = false;
            }
        }
            if ($('.nw_UserInputField').hasClass('nwAutosize2')) {
                $('.nw_UserInputField').removeClass('nwAutosize2');
                $('.nw_UserInputField').addClass('nwAutosize1');
            }

        });

        $("#cl,#nw_Header").click(function (event) {
            if (isLiveAgent) {
                $('#nw_Header').unbind('click');
                var eventEle = this.id;
                if (eventEle === "cl") {
                    closeIcon_HeaderClick();
                }
            } else {
                closeIcon_HeaderClick();
            }
            event.preventDefault();
            event.stopPropagation();
        });

        // written this function to rebind the click handler for Header.
        function closeIcon_HeaderClick() {
            if (!isFirstInteraction && !firstTime) {
                va.open();
                if (isIPad) {
                    va.iPadOpen();
                }
                firstTime = true;
            } else if (!isFirstInteraction && firstTime) {
                va.close();
                if (isIPad) {
                    va.iPadClose();
                }
                firstTime = false;
            } else {
                if (firstTime) {
                    va.open();
                    if (isIPad) {
                        va.iPadOpen();
                    }
                    firstTime = false;
                } else if (va.isOpen() && !firstTime) {
                    va.close();
                    if (isIPad) {
                        va.iPadClose();
                    }
                } else {
                    va.open();
                    if (isIPad) {
                        va.iPadOpen();
                    }
                }
            }

            return false;
        }

        $ab.keydown(function (event) {
            if (!va.isOpen()) {
                return;
            }

            if (event.which == 27) { // escape key
                va.close();
            }
        });

        // function written to check if VA is open 
        va.isOpen = function () {

            return !$ab.hasClass("closed");
        };


        va.open = function () {
            
            $ab.removeClass("closed nwClosed nw_initial");
            $('.nw_Dialog').removeClass('nwClosed nwMinimize');
            $('.nw_Expand').removeClass('nwClosed');
            $('#ex , .nw_Input').removeClass('nw_initial');
            $("#nw_Header").removeClass("nwMinimize");
            $('#ex').addClass('nw_Expand');
            $('#ipAustralia-block,.nw_Dialog ,.nw_Conversation').addClass("nwNormal");
            $('#cl').removeClass('nwOpen');
            $('#cl').addClass('nw_Close');
            setLabel($ab.find(".nw_Close"), va.CLOSE_ALEX_TEXT);

            // written for WCAG , assign tab index for all the divs under conversationTexts .
            $('.nw_ConversationText div').each(function (index) {
                $(this).attr('tabindex', 0);
                $(".nw_UserInputField").focus();
            });         
            
            //iPad scrolling issue fix. calculate current scoll height and add Css top property
            if (isIPad) {
                va.iPadOpen();
            }
        };

        va.close = function () {

            if ($ab.hasClass("expanded")) {
                $ab.removeClass("expanded");
            }
            $('.nw_Expand.button').addClass('nw_initial');
            $('#ex').removeClass('nw_collapse nwNormal nwExpand1 nw_Expand');
            $ab.removeClass('nwSend nwExpand1 nwNormal nw_Expand');
            if ($ab.hasClass('ipadExpand') || isIPad) {

                $ab.removeClass('ipadExpand');
            }
            $('#ipAustralia-block').addClass('nwClosed closed');
            $('.nw_Dialog').addClass('nwClosed');
            $('#cl').removeClass('nw_Close');
            $('#cl').addClass('nwOpen');
            if (!isLiveAgent) {
                setLabel($('#cl'), va.OPEN_ALEX_TEXT);
            } else {
                setLabel($('#cl'), va.OPEN_LIVE_AGENT);
            }

            if (isIPad) {
                va.iPadClose();
            }
        };


        va.focusFromSkipLinks = function () {
            if (!va.isOpen()) {
                va.open();
            }
            var lastMessage = $ab.find('.nw_Conversation').find('.nw_AgentSays, .nw_UserSays').last();
            lastMessage.focus();
        };
        
        va.iPadOpen = function() {            
            var divBlock = $('#ipAustralia-block');
            var scrollTopiPad = document.body.scrollTop;
            divBlock.removeProp('position');
            if (firstTime) {
                divBlock.css({
                    'top': scrollTopiPad + 200,
                    'position': 'absolute',
                    'left': 'auto',
                    'bottom': 'auto'
                });
            } else if (scrollTopiPad == 0 || scrollTopiPad < 180) { //this to ensure VA sits nicely and without the header being chopped off
                divBlock.css({
                    'top': '180px',
                    'position': 'absolute',
                    'left': 'auto',
                    'bottom': 'auto'
                });
            } else {
                divBlock.css({
                    'top': scrollTopiPad - 140,
                    'position': 'absolute',
                    'left': 'auto',
                    'bottom': 'auto'
                });
            }
            divBlock.css('animation-name','').css('animation-duration','');
            window.scrollTo(0, document.body.scrollTop + 40); //to ensure input box displays well above the keyboard. Note will not work if users have configured split view or set the keyboard to appear at the top of the screen
        };
        
        va.iPadClose = function() {            
            var divBlock = $('#ipAustralia-block');
            divBlock.css('top', '').css('position', 'fixed').css('left', '').css('bottom', '').css('animation-name', 'ease').css('animation-duration', '2s');
            va.hideKeyboard();
        };

        va.hideKeyboard = function () {
            document.activeElement.blur();
            $("input, textarea").blur();
        };

 function loadLiveAgent() {

            var imageDiv = '<div id="spinnerImage"><img id="loader1"  src="./images/ui/spinner.gif"/></div>';

            var snippet =
                '<!--[if (gte IE 9)|!(IE)]><!--><div id="myObject"><iframe name="chatInfofrm" id="chatInfofrm" class="dcw-iframe" src="' + chatUrl + '"></iframe></div><![endif]-->' +
                '</div>';
            $('.nw_AgentHeader').text(" ASK LIVE AGENT");
            $('.nw_Conversation').removeClass('nwNormal');
            $('.transitionPhase').remove();
            $('#nw_Header').removeClass('nw_Header');
            $('#nw_Header').addClass('nw_LiveAgentHeader');
            var newControl = "<a href='#' id='cross' class='button nw_closeCross'></a>";
            $(newControl).appendTo('.nw_Controls');
            $('.dcw').show();
            $("#dcw").html(imageDiv + snippet);
           
            if (!isLiveAgent) {
                $('.responsive-chat-icon').addClass('responsive-chat-icon-liveagent-close');
            }
           
            // create div dynamically , and show the end chat link.

            var endChatLink = "<div id='endChatMobile' style='text-align: center'><strong>LIVE CHAT </strong>(<a href='#' id='endChat'><strong>END CHAT<strong></a>)</div>";
            $('.nw_Dialog').append(endChatLink);
        }
        $(document).on('click', '#ininChatLink', function () {
            // click on Chat Link Should disable the the yes and No link provided..
            chatUrl = $(this).attr('data-iframe-source');
            $(this).removeAttr('data-iframe-source');
            $(this).removeAttr('href');
            $(this).attr('id', 'noUse');
            $(this).attr('disabled', 'disabled');
            $('#noUse').css('textDecoration', 'none');
            $(this).replaceWith('<textclass id="nw_AgentSays">'+$(this).text()+'</text>');

            //replaced the <a> with <text> tag so that user cannot click on the yes or no link for "Would you like to chat with a live agent now? ". 

            $('a[data-vtz-jump="e95959a6-ba07-4ba4-9435-e932a14fd778"]').replaceWith("<text>"+$('a[data-vtz-jump="e95959a6-ba07-4ba4-9435-e932a14fd778"]').text()+"</text>");
            $('a[data-vtz-jump="1f5a5864-24c0-418f-b42f-c46883f969b9"]').replaceWith("<text>"+$('a[data-vtz-jump="1f5a5864-24c0-418f-b42f-c46883f969b9"]').text()+"</text>");
            
            if (chatUrl != undefined && chatUrl.length > 0) {
                c.setSession("isLiveAgent", isLiveAgent);
                c.setSession('chatUrl', chatUrl);
                loadLiveAgent();
                $('#nw_Header').unbind('click');
                if (isIPad) {
                    va.iPadOpen();
                }

                setLabel($('#ex'), va.EXPAND_LIVE_AGENT);
                setLabel($('#cl'), va.MINIMIZE_LIVE_AGENT);
                setLabel($('#cross'), va.END_LIVE_AGENT_CHAT);

            }
        });

        // ends live Chat and gets back to VA.
        
        va.endChat = function () {
            setLabel($('#cl'), va.END_LIVE_AGENT_CHAT);
            // remove the DIV that Provides the link to endChat in mobile View
            $('#endChatMobile').remove();
            $('#nw_Header').bind('click', closeIcon_HeaderClick);
            $('#nw_Header').removeClass('nw_LiveAgentHeader');
            $('#nw_Header').addClass('nw_Header');
            $('.nw_Conversation, .nw_Input').removeClass('nw_transitionPhase');
            $('.nw_AgentHeader').text(" ASK ALEX FOR HELP");
            $('.nw_Conversation').addClass('nwNormal');
            $('.nw_Controls').find('#cross').remove();
            isLiveAgent = false;
            c.removeSession("isLiveAgent");
            c.removeSession("chatUrl");
            $('.dcw').hide();
            $('#endChatMobile').remove();
            $('.responsive-chat-icon').addClass('responsive-chat-icon-close');
            $('.responsive-chat-icon').removeClass(' responsive-chat-icon-liveagent responsive-chat-icon-liveagent-close');
            setLabel($('#ex'), va.EXPAND_ALEX_TEXT);
            setLabel($('#cl'), va.CLOSE_ALEX_TEXT);
            // send some data to IQStudio to notify liveChat end.
            ui.sendQuery("", endChatSession, {});
            $('#myObject').remove();
        }

        // endChat for Mobile View
        $(document).on('click', '#endChat', function () {
            if (window.confirm('Are you sure you want to exit your Live Chat session?')) {

                $('#chatInfofrm').prop('contentWindow').postMessage("chatExit", 'https://dcomdev-nsw.ccaas.datacom.com.au');
            }

        });

        $(document).on('click', '#cross', function () {
            if (window.confirm('Are you sure you want to exit your Live Chat session?')) {

                $('#chatInfofrm').prop('contentWindow').postMessage("chatExit", 'https://dcomdev-nsw.ccaas.datacom.com.au');

            }

        });
    });


    // written for reply 
    window.addEventListener('message', function (event) {
        var focusIn = 'composeMsgInputFocusIn';
        var focusOut = 'composeMsgInputFocusOut';
        var serverConfiguration = 'ServerConfig';
        var chatExit = 'chatExited';
        var eventData = event.data;
        if (isIPad) {
            if (eventData.toLowerCase() === focusIn.toLowerCase()) {
                va.iPadOpen();

            } else if (eventData.toLowerCase() === focusOut.toLowerCase()) {

                va.iPadClose();
            }
        }
        if (eventData.toLowerCase() === serverConfiguration.toLowerCase()) {
            if (~event.origin.indexOf('https://dcomdev-nsw.ccaas.datacom.com.au') || ~event.origin.indexOf('https://dcomsys-nsw.ccaas.datacom.com.au')) {
                $('#loader1').hide();
            }
        }
        if (eventData.toLowerCase() === chatExit.toLowerCase()) {
            va.endChat();
        }

    });


    window.initialize = function () { //  handler to invoke VA in mobile view

        firstTime = false;
        if (!navigator.userAgent.match(/(iPhone)/) && isMobileNavigator) { 
            $('#ipAustralia-block').css("height", "100%");
        }
        if ($('#ipAustralia-block').hasClass('open') || $('#ipAustralia-block').hasClass('nwNormal') ||
            $('#ipAustralia-block').hasClass('nwSend') || $('#ipAustralia-block').hasClass('nwExpand1') || $('#ipAustralia-block').hasClass('ipadExpand')) {
            $('#ipAustralia-block').removeClass('open nwNormal ipadExpand nwExpand1 expanded nwSend');
            $('.nw_Dialog').removeClass('nwNormal nwSend open nwNormal nwExpand1');
            $('.nw_Conversation').removeClass('nwNormal nwExpand1 open');
            $('#ipAustralia-block').addClass('closed');
            $('#ex').removeClass('nw_collapse');
            $('#ex').addClass('nw_initial');
            $('#cl').addClass('nwOpen');
            if (!isLiveAgent) {
                $('.responsive-chat-icon').removeClass('responsive-chat-icon-close responsive-chat-icon-liveagent responsive-chat-icon-liveagent-close');

            } else {
                $('.responsive-chat-icon').addClass('responsive-chat-icon-liveagent');
                $('.responsive-chat-icon').removeClass('responsive-chat-icon-liveagent-close');
            }

        } else {
            if (!isLiveAgent) {
                $('.responsive-chat-icon').addClass('responsive-chat-icon-close');
                $('.responsive-chat-icon').removeClass('responsive-chat-icon-liveagent responsive-chat-icon-liveagent-close');
            } else {
                //$('.responsive-chat-icon').addClass('responsive-chat-icon-liveagent');
                $('.responsive-chat-icon').addClass('responsive-chat-icon-liveagent-close');
            }

            $('#ipAustralia-block').removeClass('closed nw_initial nwClosed ');
            $('.nw_Input').removeClass('nw_initial');
            $('.nw_Dialog').removeClass('nwClosed');
            $('#ipAustralia-block,.nw_Dialog,.nw_Conversation').addClass('nwNormal');
            $('#cl').removeClass('nwOpen');
            $('#cl').addClass('nw_Close');
            $('#ex').removeClass('nw_initial');
            $('#ex').addClass('nw_Expand');
            // Added following line for WCAG
            $(".nw_UserInputField").focus();
            if (!isFirstInteraction) {
                firstTime = true;
            }
        }
        event.preventDefault();
        event.stopPropagation();
    };

})();