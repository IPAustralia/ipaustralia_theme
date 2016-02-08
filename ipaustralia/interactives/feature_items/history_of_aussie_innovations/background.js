var ND = (function(ND, $) {
	
	//The create function creates the module object; It does no initialise the object
	ND.backgrounds = function () {
	
		var $element, $landscapeLayer, $overlayLayer
			landscapeImgWidth = 1500,
			overlayImgWidth = 6900,
			speed = 500,
			pf = "time-",
			
			initBGLayer = function() {
				$landscapeLayer = $('<div id="'+pf+'landscape"></div>');
				$overlayLayer = $('<div id="'+pf+'overlay"></div>');
				$element.prepend($landscapeLayer,$overlayLayer);
			},
			
			moveBg = function($elem, sliderValue, bgWidth, animating) {
				if (animating) {
					$elem.stop(true).animate({backgroundPositionX: -sliderValue/97*bgWidth}, speed);
				} else {
					$elem.css('backgroundPositionX', -sliderValue/97*bgWidth + 'px');
				}
			},
			
			listenToSlider = function() {
				$.subscribe('/timeline/move', function(sliderValue, animating) {
					moveBg($landscapeLayer, sliderValue, landscapeImgWidth, animating);
					moveBg($overlayLayer, sliderValue, overlayImgWidth, animating);
				});
			};
		
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
				$element = $(elem || "#timeline");
					
				/* Check this module needs to be initalised for this page */
				if (!$element || !$element.size() ) {return;}
			
				/* Do stuff */
				initBGLayer();
				listenToSlider();
				
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
