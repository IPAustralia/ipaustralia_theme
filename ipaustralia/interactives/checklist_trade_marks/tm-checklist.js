$(function(){
	// Functionality for checklist boxes and slide ups
	$(".checklist-section-top input[type='checkbox']").click(function() {

	$(this).parent('div').parent('li').toggleClass('is-active');
		
	var checked = $(this).attr('checked');

		if(checked){

			$(this).nextAll('.is-hidden').slideUp();
			
			$(this).nextAll('button').removeClass('toggle-active');
		
		}
		

	});


	$(".checklist-section-top ").find('.toggle').click(function(){
		$(this).nextAll('.is-hidden').slideToggle();
		$(this).toggleClass("toggle-active");
	});

});