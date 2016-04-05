window.onload = function() {

//** START ANIMATION **//
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
//** END ANIMATION **//

//** START TRADE MARK **//
jQuery("#sumAssuredTM").change(function()
{ 
  //alert(jQuery(this).val());
 var selectedvalue = jQuery(this).val();
 // do your calculation
 jQuery("#tb").val(selectedvalue);
jQuery(".classSel").html(selectedvalue);
var firstOne = selectedvalue * 120;
var firstTwo = selectedvalue * 120;
var firstThree = selectedvalue * 200;
var firstFour = selectedvalue * 200;
jQuery(".oneTotal").html("$" + firstOne);
jQuery(".twoTotal").html("$" + firstTwo);
jQuery(".threeTotal").html("$" +  firstThree);
jQuery(".fourTotal").html("$" + firstFour); 
var partTwo = selectedvalue * 80;
jQuery(".partTwoTotal").html("$" + partTwo);
var oneApplyTotal = firstOne + partTwo;
jQuery(".applyOne").html("$" + oneApplyTotal);
jQuery(".applyTwo").html("$" + firstTwo);
jQuery(".applyThree").html("$" + firstThree);
jQuery(".applyFour").html("$" + firstFour); 
var regRen = selectedvalue * 300;
jQuery(".oneRegisterTotal").html("$" + regRen);
jQuery(".twoRegisterTotal").html("$" + regRen);
jQuery(".threeRegisterTotal").html("$" + regRen);
jQuery(".fourRegisterTotal").html("$" + regRen); 
jQuery(".oneRenewTotal").html("$" + regRen);
jQuery(".twoRenewTotal").html("$" + regRen);
jQuery(".threeRenewTotal").html("$" + regRen);
jQuery(".fourRenewTotal").html("$" + regRen); 
});
jQuery("tr:even").css("background-color", "#E5CCCC");
jQuery("tr:odd").css("background-color", "#c53e47"); 
//** END TM **//

//** START DESIGN **//
jQuery("#sumAssuredDes").change(function()
{ 
//alert(jQuery(this).val());
var selectedvalue = jQuery(this).val();
// do your calculation
jQuery("#tb").val(selectedvalue);
jQuery(".classSel").html(selectedvalue);
var firstOne = selectedvalue * 350;
var firstTwo = selectedvalue * 250;
var firstThree = selectedvalue * 250;
var firstFour = selectedvalue * 250;
jQuery(".oneTotal").html("$" + firstOne);
jQuery(".twoTotal").html("$" + firstTwo);
jQuery(".threeTotal").html("$" +  firstThree);
jQuery(".fourTotal").html("$" + firstFour); 
var partTwo = selectedvalue * 80;
jQuery(".partTwoTotal").html("$" + partTwo);
var oneApplyTotal = firstOne + partTwo;
jQuery(".applyOne").html("$" + firstOne);
jQuery(".applyTwo").html("$" + firstTwo);
jQuery(".applyThree").html("$" + firstThree);
jQuery(".applyFour").html("$" + firstFour); 
var regRen = selectedvalue * 420;
var regRen1 = selectedvalue * 370;
var regRen2 = selectedvalue * 320;
jQuery(".oneRegisterTotal").html("$" + regRen);
jQuery(".twoRegisterTotal").html("$" + regRen);
jQuery(".threeRegisterTotal").html("$" + regRen);
jQuery(".fourRegisterTotal").html("$" + regRen); 
jQuery(".oneRenewTotal").html("$" + regRen1);
jQuery(".twoRenewTotal").html("$" + regRen2);
jQuery(".threeRenewTotal").html("$" + regRen);
jQuery(".fourRenewTotal").html("$" + regRen); 
});
jQuery("tr:even").css("background-color", "#E5CCCC");
jQuery("tr:odd").css("background-color", "#c53e47");
//** END DESIGN **//

//** START PBR **//
//** END PBR **//

//** START PATENTS **//
//** END PATENTS **//

}