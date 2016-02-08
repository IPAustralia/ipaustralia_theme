/*
 * This is an example module.
 * Reading: http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
 * 
 * Please copy and rename this file.
 * 
 */

/*globals jQuery, ND, window */
var ND = (function(ND, $) {
	
	//The create function creates the module object; It does no initialise the object
	ND.myModuleName = function () {
	
		/*
		 * Write private variables and functions here in this closure.
		 * They don't need to be just utility functions, they can refer to the private instance variables 
		 */
		var element;
		
		/*
		 * returns a new object that is the functionality of the module
		 * It has access to the private variables and functions declared in this closure.
		 */
		return {

			/*
			 * init Function. Needs to be called to initialise the new module object
			 * 
			 * eg. var myModule = ND.myModuleName()
			 *     myModule.init(); 
			 */
			init: function( elem ) { 
				
				/* Cache the jQuery instance of the element(s) this belongs too.
				 * Bake in default selectors. 
				 */
				element = $(elem || ".blog-intro");
					
				/* Check this module needs to be initalised for this page */
				if( !element || !element.size() ) { return; }
			
				/* Do stuff */
				element.find("P:first").each(function(){
					$(this).before( '<SPAN class="start" />').after( '<SPAN class="end" />');
				});
				
				/* Return this so it can be chained / assigned
				 * eg. var myModule = ND.myModuleName().init();
				 */
				return this;
			
			}
			
			/* Write Public Methods
			 * These will exist as methods on the new module object
			 * 
			 */
		
		
		};	
	};
	
	/* Return ND after it's been augmented */ 
	return ND;	

}(window.ND || {}, jQuery));
/* End File */
