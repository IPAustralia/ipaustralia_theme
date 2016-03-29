jQuery(document).ready(function(){
	jQuery('a[href^="#"]').on('click',function (e) {
	    e.preventDefault();

	    var target = this.hash;
	    var jQuerytarget = jQuery(target);

	    jQuery('html, body').stop().animate({
	        'scrollTop': jQuerytarget.offset().top
	    }, 900, 'swing', function () {
	        window.location.hash = target;
	    });
	});

var jQueryanimation_elements = jQuery('.animation-element');
var jQuerywindow = jQuery(window);

function check_if_in_view() {
var window_height = jQuerywindow.height();
var window_top_position = jQuerywindow.scrollTop();
var window_bottom_position = (window_top_position + window_height);
 
jQuery.each(jQueryanimation_elements, function() {
var jQueryelement = jQuery(this);
var element_height = jQueryelement.outerHeight();
var element_top_position = jQueryelement.offset().top;
var element_bottom_position = (element_top_position + element_height);
 
//check to see if this current container is within viewport
if ((element_bottom_position >= window_top_position) &&
(element_top_position <= window_bottom_position)) {
jQueryelement.addClass('in-view');
} else {
jQueryelement.removeClass('in-view');
}
});
}
jQuerywindow.on('scroll resize', check_if_in_view);
jQuerywindow.trigger('scroll');
	
});
