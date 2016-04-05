// Content is in a display:none div classed 'responses' at the bottom of the html for this page
// You will need to copy/add more else if statements to fit your content - scripting caters for any combination of 40 total responses

jQuery(function() { 
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
	//generate steps
	jQuery(stepsinit)
	//generate tooltips
	jQuery('[data-toggle="tooltip"]').tooltip()
	$("#continue").click( function() {
	cnt();
	});
	$("#reset").click( function() {
	back();
	});
	$('.ans').on("click", function() {
		$(".ans.selectedWiz").removeClass("selectedWiz");
		$(this).addClass('selectedWiz');
	});
});

//$("#elementID").css({ display: "block" });





//***START TOOLTIPS
jQuery('body').on('click', function (e) {
    //only works with buttons types
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
   parent.location.hash = ''
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
//***END INDEX GENERATION

//* START INDEX STYLING
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
function cnt() {
	stepstyle();
	if(window.location.href.indexOf("#s01") > -1) {
	update(2); 
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s02") > -1) {
	update(3);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s03") > -1) {
	update(4);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s04") > -1) {
	update(5);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s05") > -1) {
	update(6); 
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s06") > -1) {
	update(7);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s07") > -1) {
	update(8);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s08") > -1) {
	update(9);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s09") > -1) {
	update(10); 
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s10") > -1) {
	update(11);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s11") > -1) {
	update(12);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s12") > -1) {
	update(13);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s13") > -1) {
	update(14); 
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s14") > -1) {
	update(15);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s15") > -1) {
	update(16);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s16") > -1) {
	update(17);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s17") > -1) {
	update(18); 
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s18") > -1) {
	update(19);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s19") > -1) {
	update(20);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s20") > -1) {
	update(21);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s21") > -1) {
	update(22);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s22") > -1) {
	update(23);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s23") > -1) {
	update(24);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s24") > -1) {
	update(25); 
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s25") > -1) {
	update(26);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s26") > -1) {
	update(27);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s27") > -1) {
	update(28);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s28") > -1) {
	update(29); 
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s29") > -1) {
	update(30);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s30") > -1) {
	update(31);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s31") > -1) {
	update(32);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s32") > -1) {
	update(33); 
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s33") > -1) {
	update(34);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s34") > -1) {
	update(35);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s35") > -1) {
	update(36);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s36") > -1) {
	update(37); 
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s37") > -1) {
	update(38);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s38") > -1) {
	update(39);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s39") > -1) {
	update(40);
	parent.location.hash = ''
	}
	else if(window.location.href.indexOf("#s40") > -1) {
	update(41);
	parent.location.hash = ''
	}
	}
//**END CHECK RADIOBOX STATE 
