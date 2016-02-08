// Test to see if jQuery has loaded yet, if it has, initiate module.
(function(){
	var jQueryTest = setInterval(function(){
		if (window.jQuery) {  
			clearInterval(jQueryTest);
			TabbedInteractive.BindUI();
			TabbedInteractive.InitSlider();
		}
	}, 50);	
})();
    
// Not importing Global jQuery object due to the fact that it may not have yet been created when this code is exectuted
var TabbedInteractive = (function () {
 
	'use strict';

	var slideWidth,
		speed = 600;

	var module = {

		BindUI: function() {

			$('.tabbed-interactive-intro, .tabbed-interactive .nav, .tabbed-interactive .slides').removeClass('hidden');

			$(window).on('resize', function(){
				module.InitSlider();
			});

			$('.slide-button').on('click', function(event){							
				module.mobileScrollTop();
				module.doSlide($(this));
				event.preventDefault();
			});

			$('.secondary-nav a').on('click', function(event){
				module.slideNav($(this));
				event.preventDefault();
			});
		},

		mobileScrollTop: function(){
			if ($(window).width() <= 640) {
				$('html, body').animate({
					scrollTop: $('.slides').offset().top - $('#header').height()
				}, 1000);	
			}	
		},

		InitSlider: function() {

			$('.slides-wrapper, .slides-wrapper .slide').removeAttr('style');

			slideWidth = $('.slides-wrapper .slide:first-child').outerWidth();
			var slideCount = $('.slides-wrapper .slide').size();

			$('.slides-wrapper').width(slideWidth * slideCount);

			var paddingAmount = (5.8 / slideCount); 
			var slideWidthPercentage = (100 / slideCount) - (paddingAmount * 2);

			$('.slides-wrapper .slide').css('width', slideWidthPercentage + '%')
										.css('padding-left', paddingAmount + '%')
										.css('padding-right', paddingAmount + '%');
		},

		doSlide: function($button) {

			var direction = $button.hasClass('next-slide') ? 'right' : 'left';

			var animateValue = (direction == 'left') ? '0px' : '-' + slideWidth + 'px';

			if (direction == 'left') {
		    	module.rotateLeftSlideManipulation();
		    }

			$('.slides-wrapper').animate({
			    left: animateValue
			}, speed, function() {
			    
			    if (direction == 'right') {
			    	module.rotateRightSlideManipulation();			    	
			    }
				module.slideRotationCallback();

				var currentSlideNumber = $('.slides-wrapper .slide:first-child').attr('data-slide');
				$('.secondary-nav li').removeClass('active');
				$('.secondary-nav li:nth-child(' + currentSlideNumber + ')').addClass('active');
			});

		},

		slideNav: function($button) {

			var currentActiveIndex = $('.secondary-nav li.active').index() + 1; // Plus one to get convert from zero based index
			var newActiveIndex = $button.parent().index() + 1;

			var movementFactor = (newActiveIndex - currentActiveIndex);

			if (movementFactor == 0) return false; // Do nothing, not changing slides

			var direction = (movementFactor < 0) ? 'left' : 'right';

			var animateValue = (direction == 'left') ? '0' : '-' + slideWidth;			

			// Set this to be an absolute value now that we have determined direction
			movementFactor = Math.abs(movementFactor);

			if (direction == 'left') {
				module.rotateLeftSlideManipulation(movementFactor);	
			}

			$('.slides-wrapper').animate({
			   	left: animateValue * movementFactor
			}, speed, function() {

			   	if (direction == 'right') {
			    	module.rotateRightSlideManipulation(movementFactor);			    	
			    }
				module.slideRotationCallback();
			});

			$('.secondary-nav li').removeClass('active');
			$button.parent().addClass('active');
		},

		rotateLeftSlideManipulation: function(movementFactor){
			if (movementFactor == undefined) movementFactor = 1;
			for (var i = 0; i < movementFactor; i++) {
				$('.slides-wrapper .slide:last-child').prependTo('.slides-wrapper');
			}
		    $('.slides-wrapper').css('left', '-' + (slideWidth * movementFactor) + 'px');
		},

		rotateRightSlideManipulation: function(movementFactor){
			if (movementFactor == undefined) movementFactor = 1;
			for (var i = 0; i < movementFactor; i++) {
				$('.slides-wrapper .slide:first-child').appendTo('.slides-wrapper');
			}
		},

		slideRotationCallback: function(){
			$('.slides-wrapper').css('left','0');			
		}

	}

	return {
        BindUI: module.BindUI,
        InitSlider: module.InitSlider
    };

}());