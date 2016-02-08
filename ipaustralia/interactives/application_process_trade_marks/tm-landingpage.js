$(function(){
	// Functionality for slide ups
	$(".list-header").find('.toggle').click(function(){
			$(this).parent('.list-header').parent('li').toggleClass('is-active');
		$(this).parent('.list-header').next('.list-content').slideToggle();

		$(this).parent('.list-header').next('.inner-list').find('.is-hidden').slideToggle();
	
	});


	// Check current window size and slide down content
	$(window).resize(function(){
	var windowWidth = $(window).width();

		var showElements = $('.is-hidden, .list-content');

	if(windowWidth > 560){
		$(showElements).slideDown();
	} 


	});



});