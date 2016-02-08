// Test to see if jQuery has loaded yet, if it has, initiate module.
(function(){
	var jQueryTest = setInterval(function(){
		if (window.jQuery) {  
			clearInterval(jQueryTest);
			/*Modernizr.load([
				{
					load: 'assets/js/jquery.easing.min.js'
				}
			]);*/
			SteppedInteractive.BindUI();
			SteppedInteractive.onResize();
		}
	}, 50);	
})();
    
// Not importing Global jQuery object due to the fact that it may not have yet been created when this code is exectuted
var SteppedInteractive = (function () {
 
	'use strict';

	var module = {

		BindUI: function() {

			$('.stepped-interactive .nav, .stepped-interactive .slides').removeClass('hidden');

			$('.nav a').on('click', function(){
				module.selectSlide($(this), $(this).data('slide'));
			});

			$('.next-button').on('click', function(){
				module.nextSlide($(this));
			});

			$(window).on('resize', function(){
				module.onResize();
			});
		},

		nextSlide: function($button){
			if ($button.hasClass('yes')) {
				$button.closest('.r-col').find('.more-info').toggle();
			} else { // We can move onto the next slide
				if ($('.nav-intro.active').length) { // If we are viewing the first slide first				
					$('.nav ul li:first-child a').click();				
				} else { // We are on a different slide				
					$('.nav ul li.active').next('li').find('a').click();
				}
			}
		},



		selectSlide: function($button, slideNumber){
			// Add / remove active classes on buttons 			
			$('.nav .active').removeClass('active');
			$button.parent().addClass('active');
			
			$('.slide:visible').fadeOut(400, function(){
				$('.slide[data-slide=' + slideNumber + ']').fadeIn(400);
			});
		},

		onResize: function(){
			
			$('.nav-wrapper').width($('.nav').width() - $('.nav-intro a').width() - 2); // 2 adds some buffer to help fix stange layout issues
			var navWidth = 0;
			$('.nav-wrapper li').each(function(){
				navWidth = navWidth + $(this).outerWidth(true);
			});
			$('.nav-wrapper ul').width(navWidth + 30); // Add some buffer
			if ($('.nav-wrapper ul').width() > $('.nav-wrapper').width()) {
				$('.nav').addClass('shadow');
			} else {
				$('.nav').removeClass('shadow');
			}
		}

	}

	return {
        BindUI: module.BindUI,
        onResize: module.onResize
    };

}());