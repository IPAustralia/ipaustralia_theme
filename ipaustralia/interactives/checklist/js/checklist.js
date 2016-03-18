$(function(){
    // Functionality for checklist boxes and slide ups
    $(".checklist-section-top input[type='checkbox']").click(function() {

    $(this).parents().toggleClass('is-active');
        
    var checked = $(this).attr('checked');

        if(checked){

            $('ans1').show();
			
			$('ans1').slideUp();
            
            $('ans1').removeClass('toggle-active');
    }
    });
    $(".checklist-section-top ").find('.toggle').click(function(){
        $(this).nextAll('.is-hidden').slideToggle();
        $(this).toggleClass("toggle-active");
    });
});