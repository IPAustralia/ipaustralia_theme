var ND = (function(ND, $) {
	
	//The create function creates the module object; It does no initialise the object
	ND.timeline = function () {
	
		var readyApp = function( $element ) {

			if( window.location.href.indexOf('text-only=true') !== -1 ) {return false;}
			
			$element.removeClass("disabled").find(".non-js").hide();

			return true;
		};

		return {

		init: function( elem ) { 

				$element = $(elem || "#timeline");
					
				/* Check this module needs to be initalised for this page */
				if (!$element || !$element.size() ) {return;}
			
				/* Do stuff */
				if( !readyApp( $element ) ) { return false; }

				
				/* Return this so it can be chained / assigned
				 * eg. var myModule = ND.myModuleName().init();
				 */
				return true;
			
			}
					
		};	
	};
	
	/* Return ND after it's been augmented */ 
	return ND;	

}(window.ND || {}, jQuery));
/* End File */
