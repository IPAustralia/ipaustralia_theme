window.onload = function() {

//** START ANIMATION **//
var $animation_elements = $('.animation-element');
var $window = $(window);

function check_if_in_view() {
var window_height = $window.height();
var window_top_position = $window.scrollTop();
var window_bottom_position = (window_top_position + window_height);
 
$.each($animation_elements, function() {
var $element = $(this);
var element_height = $element.outerHeight();
var element_top_position = $element.offset().top;
var element_bottom_position = (element_top_position + element_height);
 
//check to see if this current container is within viewport
if ((element_bottom_position >= window_top_position) &&
(element_top_position <= window_bottom_position)) {
$element.addClass('in-view');
} else {
$element.removeClass('in-view');
}
});
}
$window.on('scroll resize', check_if_in_view);
$window.trigger('scroll');
//** END ANIMATION **//

//** START TRADE MARK **//
$("#sumAssuredTM").change(function()
{ 
  //alert($(this).val());
 var selectedvalue = $(this).val();
 // do your calculation
 $("#tb").val(selectedvalue);
$(".classSel").html(selectedvalue);
var firstOne = selectedvalue * 120;
var firstTwo = selectedvalue * 120;
var firstThree = selectedvalue * 200;
var firstFour = selectedvalue * 200;
$(".oneTotal").html("$" + firstOne);
$(".twoTotal").html("$" + firstTwo);
$(".threeTotal").html("$" +  firstThree);
$(".fourTotal").html("$" + firstFour); 
var partTwo = selectedvalue * 80;
$(".partTwoTotal").html("$" + partTwo);
var oneApplyTotal = firstOne + partTwo;
$(".applyOne").html("$" + oneApplyTotal);
$(".applyTwo").html("$" + firstTwo);
$(".applyThree").html("$" + firstThree);
$(".applyFour").html("$" + firstFour); 
var regRen = selectedvalue * 300;
$(".oneRegisterTotal").html("$" + regRen);
$(".twoRegisterTotal").html("$" + regRen);
$(".threeRegisterTotal").html("$" + regRen);
$(".fourRegisterTotal").html("$" + regRen); 
$(".oneRenewTotal").html("$" + regRen);
$(".twoRenewTotal").html("$" + regRen);
$(".threeRenewTotal").html("$" + regRen);
$(".fourRenewTotal").html("$" + regRen); 
});
$("tr:even").css("background-color", "#E5CCCC");
$("tr:odd").css("background-color", "#c53e47"); 
//** END TM **//

//** START DESIGN **//
$("#sumAssuredDes").change(function()
{ 
//alert($(this).val());
var selectedvalue = $(this).val();
// do your calculation
$("#tb").val(selectedvalue);
$(".classSel").html(selectedvalue);
var firstOne = selectedvalue * 350;
var firstTwo = selectedvalue * 250;
var firstThree = selectedvalue * 250;
var firstFour = selectedvalue * 250;
$(".oneTotal").html("$" + firstOne);
$(".twoTotal").html("$" + firstTwo);
$(".threeTotal").html("$" +  firstThree);
$(".fourTotal").html("$" + firstFour); 
var partTwo = selectedvalue * 80;
$(".partTwoTotal").html("$" + partTwo);
var oneApplyTotal = firstOne + partTwo;
$(".applyOne").html("$" + firstOne);
$(".applyTwo").html("$" + firstTwo);
$(".applyThree").html("$" + firstThree);
$(".applyFour").html("$" + firstFour); 
var regRen = selectedvalue * 420;
var regRen1 = selectedvalue * 370;
var regRen2 = selectedvalue * 320;
$(".oneRegisterTotal").html("$" + regRen);
$(".twoRegisterTotal").html("$" + regRen);
$(".threeRegisterTotal").html("$" + regRen);
$(".fourRegisterTotal").html("$" + regRen); 
$(".oneRenewTotal").html("$" + regRen1);
$(".twoRenewTotal").html("$" + regRen2);
$(".threeRenewTotal").html("$" + regRen);
$(".fourRenewTotal").html("$" + regRen); 
});
$("tr:even").css("background-color", "#E5CCCC");
$("tr:odd").css("background-color", "#c53e47");
//** END DESIGN **//

//** START PBR **//
//** END PBR **//

//** START PATENTS **//
//** END PATENTS **//

}