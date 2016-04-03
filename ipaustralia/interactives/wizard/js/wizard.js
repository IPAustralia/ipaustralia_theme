// Content is in a display:none div classed 'responses' at the bottom of the html for this page
// You will need to copy/add more else if statements to fit your content
// #default is the initial state of content
// #title = title text for slide
// #maincontent is primary div
// #step1/2/etc is position indicator above main content under heading

backid=0

jQuery(document).ready(function() { 
  jQuery('#qTable li.q').on('click',function() {
	//add css class for selected
	jQuery(this).addClass('selectedAnswer').siblings().removeClass('selectedAnswer');								
	//find the id of jQuery(this) item, hide items following it
	var rowCurrent = jQuery(this).closest("tr").prevAll("tr").length + 2; 
	var rowsAfter = ' tr:nth-child(n+' + rowCurrent + ')';
	jQuery('#qTable' + rowsAfter).hide().find('li').removeClass('selectedAnswer');
	//show the next row that matches the question id
	var italNum =  jQuery(this).find('i').text();
	var qNext = ' tr:nth-child(' + italNum + ')'; 
	jQuery('#qTable' + qNext).fadeIn(800);
	})
})


//***START TOOLTIPS
jQuery(function () {
	jQuery('[data-toggle="tooltip"]').tooltip()
})
jQuery('body').on('click', function (e) {
    //only works with buttons
    if (jQuery(e.target).data('toggle') !== 'popover'
        && jQuery(e.target).parents('.popover.in').length === 0) { 
        jQuery('[data-toggle="popover"]').popover('hide');
    }
});
//***END TOOLTIPS

//**START RESET FUNCTION
function back() {
	jQuery('#info-steps li').first().addClass("is-active").siblings().removeClass("is-active");
	update(1);
	return false;
	}
//**END RESET


//**START DYNAMIC INDEX GENERATION (STEP NUMBERS)
function stepsinit() {
	var stepNo = jQuery('.step').length
	var counter = 1
	var maxout = parseInt(10)-(parseInt(10)-stepNo)
	console.log(maxout)
	console.log(counter)
	while(counter<=maxout && counter>0) {
    var infosteps = '<li id="step'+counter+'">'+counter+'</li>';
	jQuery('#info-steps').append(infosteps);
	console.log(infosteps);
	counter+=1;
	jQuery('#info-steps li').first().addClass("is-active");
	}	
}
jQuery(stepsinit)
//***END INDEX GENERATION

//* START ACTIVE INDEX STYLING
function stepstyle(){
	jQuery('#info-steps li.is-active').next().addClass("is-active").siblings().removeClass();
}


//** END INDEX STYLING

//** WARNING: MANY IF STATEMENTS LIVE BELOW 
//   v====================================v

//** START CONTENT UPDATE
function update(idElement) {
	if(idElement==1){ //reset
	jQuery('#quest').html(jQuery('#title0').html());
	jQuery('#maincontent').html(jQuery('#default').html());
	return false;
	backid=1
	}
	else if(idElement==2){
	jQuery('#quest').html(jQuery('#title1').html());
	jQuery('#maincontent').html(jQuery('#response1').html());
	return false;
	backid=2;
	}
	else if(idElement==3){
	jQuery('#quest').html(jQuery('#title2').html());
	jQuery('#maincontent').html(jQuery('#response2').html());
	return false;
	backid=3
	}
	else if(idElement==4){
	jQuery('#quest').html(jQuery('#title3').html());
	jQuery('#maincontent').html(jQuery('#response3').html());
	return false;
	backid=4
	}
	else if(idElement==5){
	jQuery('#quest').html(jQuery('#title4').html());
	jQuery('#maincontent').html(jQuery('#response4').html());
	return false;
	backid=5
	}
	else if(idElement==6){
	jQuery('#quest').html(jQuery('#title5').html());
	jQuery('#maincontent').html(jQuery('#response5').html());
	return false;
	backid=2;
	}
	else if(idElement==7){
	jQuery('#quest').html(jQuery('#title6').html());
	jQuery('#maincontent').html(jQuery('#response6').html());
	return false;
	backid=3
	}
	else if(idElement==8){
	jQuery('#quest').html(jQuery('#title7').html());
	jQuery('#maincontent').html(jQuery('#response7').html());
	return false;
	backid=4
	}
	else if(idElement==9){
	jQuery('#quest').html(jQuery('#title8').html());
	jQuery('#maincontent').html(jQuery('#response8').html());
	return false;
	backid=5
	}
	else if(idElement==10){
	jQuery('#quest').html(jQuery('#title9').html());
	jQuery('#maincontent').html(jQuery('#response9').html());
	return false;
	backid=2;
	}
	else if(idElement==11){
	jQuery('#quest').html(jQuery('#title10').html());
	jQuery('#maincontent').html(jQuery('#response10').html());
	return false;
	backid=3
	}
	else if(idElement==12){
	jQuery('#quest').html(jQuery('#title11').html());
	jQuery('#maincontent').html(jQuery('#response11').html());
	return false;
	backid=4
	}
	else if(idElement==13){
	jQuery('#quest').html(jQuery('#title12').html());
	jQuery('#maincontent').html(jQuery('#response12').html());
	return false;
	backid=5
	}
	else if(idElement==14){
	jQuery('#quest').html(jQuery('#title13').html());
	jQuery('#maincontent').html(jQuery('#response13').html());
	return false;
	backid=2;
	}
	else if(idElement==15){
	jQuery('#quest').html(jQuery('#title14').html());
	jQuery('#maincontent').html(jQuery('#response14').html());
	return false;
	backid=3
	}
	else if(idElement==16){
	jQuery('#quest').html(jQuery('#title15').html());
	jQuery('#maincontent').html(jQuery('#response15').html());
	return false;
	backid=4
	}
	else if(idElement==17){
	jQuery('#quest').html(jQuery('#title16').html());
	jQuery('#maincontent').html(jQuery('#response16').html());
	return false;
	backid=5
	}
	else if(idElement==18){
	jQuery('#quest').html(jQuery('#title17').html());
	jQuery('#maincontent').html(jQuery('#response17').html());
	return false;
	backid=2;
	}
	else if(idElement==19){
	jQuery('#quest').html(jQuery('#title18').html());
	jQuery('#maincontent').html(jQuery('#response18').html());
	return false;
	backid=3
	}
	else if(idElement==20){
	jQuery('#quest').html(jQuery('#title19').html());
	jQuery('#maincontent').html(jQuery('#response19').html());
	return false;
	backid=4
	}
	else if(idElement==21){
	jQuery('#quest').html(jQuery('#title20').html());
	jQuery('#maincontent').html(jQuery('#response20').html());
	return false;
	backid=5
	}
	else if(idElement==22){
	jQuery('#quest').html(jQuery('#title21').html());
	jQuery('#maincontent').html(jQuery('#response21').html());
	return false;
	backid=2;
	}
	else if(idElement==23){
	jQuery('#quest').html(jQuery('#title22').html());
	jQuery('#maincontent').html(jQuery('#response22').html());
	return false;
	backid=3
	}
	else if(idElement==24){
	jQuery('#quest').html(jQuery('#title23').html());
	jQuery('#maincontent').html(jQuery('#response23').html());
	return false;
	backid=4
	}
	else if(idElement==25){
	jQuery('#quest').html(jQuery('#title24').html());
	jQuery('#maincontent').html(jQuery('#response24').html());
	return false;
	backid=5
	}
	else if(idElement==26){
	jQuery('#quest').html(jQuery('#title25').html());
	jQuery('#maincontent').html(jQuery('#response25').html());
	return false;
	backid=2;
	}
	else if(idElement==27){
	jQuery('#quest').html(jQuery('#title26').html());
	jQuery('#maincontent').html(jQuery('#response26').html());
	return false;
	backid=3
	}
	else if(idElement==28){
	jQuery('#quest').html(jQuery('#title27').html());
	jQuery('#maincontent').html(jQuery('#response27').html());
	return false;
	backid=4
	}
	else if(idElement==29){
	jQuery('#quest').html(jQuery('#title28').html());
	jQuery('#maincontent').html(jQuery('#response28').html());
	return false;
	backid=5
	}
	else if(idElement==30){
	jQuery('#quest').html(jQuery('#title29').html());
	jQuery('#maincontent').html(jQuery('#response29').html());
	return false;
	backid=2;
	}
	else if(idElement==31){
	jQuery('#quest').html(jQuery('#title30').html());
	jQuery('#maincontent').html(jQuery('#response30').html());
	return false;
	backid=3
	}
	else if(idElement==32){
	jQuery('#quest').html(jQuery('#title31').html());
	jQuery('#maincontent').html(jQuery('#response31').html());
	return false;
	backid=4
	}
	else if(idElement==33){
	jQuery('#quest').html(jQuery('#title32').html());
	jQuery('#maincontent').html(jQuery('#response32').html());
	return false;
	backid=5
	}
	else if(idElement==34){
	jQuery('#quest').html(jQuery('#title33').html());
	jQuery('#maincontent').html(jQuery('#response33').html());
	return false;
	backid=3
	}
	else if(idElement==35){
	jQuery('#quest').html(jQuery('#title34').html());
	jQuery('#maincontent').html(jQuery('#response34').html());
	return false;
	backid=4
	}
	else if(idElement==36){
	jQuery('#quest').html(jQuery('#title35').html());
	jQuery('#maincontent').html(jQuery('#response35').html());
	return false;
	backid=5
	}
	else if(idElement==37){
	jQuery('#quest').html(jQuery('#title36').html());
	jQuery('#maincontent').html(jQuery('#response36').html());
	return false;
	backid=2;
	}
	else if(idElement==38){
	jQuery('#quest').html(jQuery('#title37').html());
	jQuery('#maincontent').html(jQuery('#response37').html());
	return false;
	backid=3
	}
	else if(idElement==39){
	jQuery('#quest').html(jQuery('#title38').html());
	jQuery('#maincontent').html(jQuery('#response38').html());
	return false;
	backid=4
	}
	else if(idElement==40){
	jQuery('#quest').html(jQuery('#title39').html());
	jQuery('#maincontent').html(jQuery('#response39').html());
	return false;
	backid=5
	}
	else if(idElement==41){
	jQuery('#quest').html(jQuery('#title40').html());
	jQuery('#maincontent').html(jQuery('#response40').html());
	return false;
	backid=2;
	}
	}
//** END CONTENT UPDATE

//**START CHECK RADIOBOX STATE 
function nxt() {
	stepstyle();
	if (jQuery('#op1').is(":checked")) {
	update(2); 
	return false;
	}
	else if (jQuery('#op2').is(":checked")) {
	update(3);
	return false;
	}
	else if (jQuery('#op3').is(":checked")) {
	update(4);
	return false;
	}
	else if (jQuery('#op4').is(":checked")) {
	update(5);
	return false;
	}
	else if (jQuery('#op5').is(":checked")) {
	update(6); 
	return false;
	}
	else if (jQuery('#op6').is(":checked")) {
	update(7);
	return false;
	}
	else if (jQuery('#op7').is(":checked")) {
	update(8);
	return false;
	}
	else if (jQuery('#op8').is(":checked")) {
	update(9);
	return false;
	}
	else if (jQuery('#op9').is(":checked")) {
	update(10); 
	return false;
	}
	else if (jQuery('#op10').is(":checked")) {
	update(11);
	return false;
	}
	else if (jQuery('#op11').is(":checked")) {
	update(12);
	return false;
	}
	else if (jQuery('#op12').is(":checked")) {
	update(13);
	return false;
	}
	else if (jQuery('#op13').is(":checked")) {
	update(14); 
	return false;
	}
	else if (jQuery('#op14').is(":checked")) {
	update(15);
	return false;
	}
	else if (jQuery('#op15').is(":checked")) {
	update(16);
	return false;
	}
	else if (jQuery('#op16').is(":checked")) {
	update(17);
	return false;
	}
	else if (jQuery('#op17').is(":checked")) {
	update(18); 
	return false;
	}
	else if (jQuery('#op18').is(":checked")) {
	update(19);
	return false;
	}
	else if (jQuery('#op19').is(":checked")) {
	update(20);
	return false;
	}
	else if (jQuery('#op20').is(":checked")) {
	update(21);
	return false;
	}
	else if (jQuery('#op21').is(":checked")) {
	update(22);
	return false;
	}
	else if (jQuery('#op22').is(":checked")) {
	update(23);
	return false;
	}
	else if (jQuery('#op23').is(":checked")) {
	update(24);
	return false;
	}
	else if (jQuery('#op24').is(":checked")) {
	update(25); 
	return false;
	}
	else if (jQuery('#op25').is(":checked")) {
	update(26);
	return false;
	}
	else if (jQuery('#op26').is(":checked")) {
	update(27);
	return false;
	}
	else if (jQuery('#op27').is(":checked")) {
	update(28);
	return false;
	}
	else if (jQuery('#op28').is(":checked")) {
	update(29); 
	return false;
	}
	else if (jQuery('#op29').is(":checked")) {
	update(30);
	return false;
	}
	else if (jQuery('#op30').is(":checked")) {
	update(31);
	return false;
	}
	else if (jQuery('#op31').is(":checked")) {
	update(32);
	return false;
	}
	else if (jQuery('#op32').is(":checked")) {
	update(33); 
	return false;
	}
	else if (jQuery('#op33').is(":checked")) {
	update(34);
	return false;
	}
	else if (jQuery('#op34').is(":checked")) {
	update(35);
	return false;
	}
	else if (jQuery('#op35').is(":checked")) {
	update(36);
	return false;
	}
	else if (jQuery('#op36').is(":checked")) {
	update(37); 
	return false;
	}
	else if (jQuery('#op37').is(":checked")) {
	update(38);
	return false;
	}
	else if (jQuery('#op38').is(":checked")) {
	update(39);
	return false;
	}
	else if (jQuery('#op39').is(":checked")) {
	update(40);
	return false;
	}
	else if (jQuery('#op40').is(":checked")) {
	update(41);
	return false;
	}
	}
//**END CHECK RADIOBOX STATE 