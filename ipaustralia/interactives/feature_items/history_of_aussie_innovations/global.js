/*globals jQuery, ND, window */
(function(ND, $){
	$(function($){


		//var timeline = ND.timeline().init('#timeline');
		
		if( window.location.href.indexOf('text-only=true') === -1 ){
			$(".text-only-link").after('<p class="loading">Loading...</p>');
			$("#timeline").removeClass("disabled").find(".non-js").hide();
			
			
			var backgrounds = ND.backgrounds().init('#timeline');		
			var timelineContents = ND.timelineContents().init( {
				elem: '#timeline',
				data: '/images/int/history/data.js',
				popupConent: '/images/int/history/contents-popup.html'
			});
			var slider = ND.slider().init('#timeline');
		}
		else{
			$("#timeline").removeClass("not-loaded");
			$("#timeline").find(".non-js").show();
		}
		
	});
}(window.ND || {}, jQuery));