jQuery(function(){
    // Functionality for checklist boxes and slide ups
    jQuery(".checklist-section-top input[type='checkbox']").click(function() {

    jQuery(this).parents().toggleClass('is-active');
        
    var checked = jQuery(this).attr('checked');

        if(checked){

            jQuery('ans1').show();
            
            jQuery('ans1').slideUp();
            
            jQuery('ans1').removeClass('toggle-active');
    }
    });
    jQuery(".checklist-section-top ").find('.toggle').click(function(){
        jQuery(this).nextAll('.is-hidden').slideToggle();
        jQuery(this).toggleClass("toggle-active");
    });
});

jQuery(function(){
    if (jQuery('toggle').hasClass('color-copyright')){
        (jQuery('arrow_carrot-down').addClass('whitearrow'));
    }
});