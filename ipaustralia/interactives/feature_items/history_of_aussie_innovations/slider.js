/*
 * 
 */

/*globals jQuery, ND, window */
var ND = (function(ND, $) {
	
	//The create function creates the module object; It does no initialise the object
	ND.slider = function () {
	
		var $element, $slider, $periodical, $arrows,
			sliderValue, startTime,
			thisPeriodIndex,
			speed = 200,
			pf = 'time-',
			periodsCount = 7,
			dragging = false,
			sliderStart = 2.5,
			sliderEnd = 96,
			periods = ['1800 - 1900', '1901 - 1920', '1921 - 1940', '1940 - 1960', '1961 - 1980', '1981 - 2000', '2001 - Present'],
			
			initJQueryUISlider = function() {
				$element.append('<div id="'+pf+'slider"><div></div></div>');
				
				$slider = $('#'+pf+'slider > div').slider({
					animate: speed,
					step: 0.1,
					value: sliderStart,
					start: function() {
						dragging = true;
						startTime = +new Date();
					},
					stop: function() {
						dragging = false;
						stopTime = +new Date();
					},
					change: function() {
					},
					slide: function(event, ui) {
						if( ui.value < sliderStart || ui.value > sliderEnd ) {
							setSliderValue( ui.value < sliderStart ? sliderStart : sliderEnd );
							changeTimeline(!dragging);
							return false;
						}
						sliderValue = ui.value;
						changeTimeline(!dragging);
						updatePeriodicalTimeline();
					}
				});
				initJQueryUISliderHover();
			},
			
			initJQueryUISliderHover = function() {
				var width = $slider.width(),
					currentPos;
				
				$slider.bind('mousemove', function( e ) {
					var offset = $slider.offset();
					var pos = Math.floor(((e.pageX - offset.left) / width) * 7);
					if( currentPos !== pos ) {
						$periodical
							.children()
							.removeClass('over')
							.eq(pos)
							.addClass('over');
						currentPos = pos;
					}
				}).bind('mouseleave', function( e ) {
					$periodical
						.children()
						.removeClass('over');
					currentPos = -1;
				});
			},
			
			initPeriodicalTimeline = function() {
				var periodicalHTML = '<ul id="'+pf+'periodical">';
				thisPeriodIndex = 1; // start with first period being current period
				$.each(periods, function(i, v) {
					periodicalHTML += '<li class="'+pf+'item">' + v + '</li>';
				});
				periodicalHTML += '</ul>';
				$periodical = $(periodicalHTML);
				$periodical
					.children()
					.first()
					.addClass('active');
				$periodical
					.children()
					.last()
					.addClass('last');
				$slider.after($periodical);
				
				$("#time-periodical li").hover(function(){
					$(this).addClass("active");
				});
				Cufon.replace('#time-periodical li');
			},
			
			// highlight the current period on perdiodical timeline
			updatePeriodicalTimeline = function() {
				var newPeriodIndex = Math.floor(sliderValue / (100 / periodsCount)) + 1;
				if (newPeriodIndex > periodsCount) newPeriodIndex = periodsCount;
				if (thisPeriodIndex != newPeriodIndex) {
					thisPeriodIndex = newPeriodIndex;
					$periodical.find('.'+pf+'item').removeClass('active').end().find(':nth-child('+thisPeriodIndex+')').addClass('active');
				}
			},
			
			setSliderValue = function(val) {
				if( val < sliderStart || val > sliderEnd ) {
					val = val < sliderStart ? sliderStart : sliderEnd ;
				}
				
				sliderValue = val;
				$slider.slider('value', sliderValue);
				updatePeriodicalTimeline();
			},
			
			listenToTimeline = function() {
				$.subscribe('/timeline/changeslider', function(sliderValue) {
					setSliderValue(sliderValue);
				});
			},
			
			// init backward and forward arrow
			initArrows = function() {
				$arrows = $('<div id="'+pf+'arrow-backward"><a href="#"></a></div><div id="'+pf+'arrow-forward"><a href="#"></a></div>');
				$element.append($arrows);
				$element.find('#'+pf+'arrow-backward a').click(function(e) {
					sliderValue -= 5; // for demo purpose
					if (sliderValue < sliderStart) sliderValue = sliderStart;
					setSliderValue(sliderValue);
					changeTimeline(true);
					e.preventDefault();
				});
				$element.find('#'+pf+'arrow-forward a').click(function(e) {
					sliderValue += 5; // for demo purpose
					if (sliderValue > sliderEnd) sliderValue = sliderEnd;
					setSliderValue(sliderValue);
					changeTimeline(true);
					e.preventDefault();
				});
			},
			
			lastPublishedSilderValue = -1,
			
			changeTimeline = function(animating) {
				if( sliderValue !== lastPublishedSilderValue ) {
					console.log('publish /timeline/move')
					$.publish('/timeline/move', [sliderValue, animating]);
					lastPublishedSilderValue = sliderValue;
				}
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
				$element = $(elem || '#everyday');
					
				// check this module needs to be initalised for this page
				if (!$element || !$element.size()) {return;}
			
				initJQueryUISlider();
				sliderValue = $slider.slider('value');
				initPeriodicalTimeline();
				initArrows();
				listenToTimeline();
				
				$.subscribe('timeline/content-loaded', function() {
					changeTimeline(false);
				});				

				// return this so it can be chained / assigned, eg. var myModule = ND.myModuleName().init();
				return this;
			
			},
			
			setValue: function(val) {
				setSliderValue(val);
			}
			
		
		
		};	
	};
	
	/* Return ND after it's been augmented */ 
	return ND;	

}(window.ND || {}, jQuery));
/* End File */
