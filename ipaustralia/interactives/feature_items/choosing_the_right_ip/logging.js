/*! logging.js version 1.0 */
/*jslint onevar: true, undef: true, eqeqeq: true, regexp: true, newcap: true, immed: true */
/*globals jQuery, console, window */
(function($){
	if (!window.console || !console.firebug)
	{
	    var i, defn = function(){}, 
	        names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
	    "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
	
	    window.console = {};
	    for (i = names.length; i--;) {
	        window.console[names[i]] = defn;
	    }
	}
	
	$.fn.log = function (msg) {
		console.log("%s: %o", msg, this); 
		return this;
	};
}(jQuery));