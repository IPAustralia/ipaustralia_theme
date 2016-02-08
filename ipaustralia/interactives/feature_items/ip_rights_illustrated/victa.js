var pulsate_animation_time = 200;
var shouldPulsate = true;
var layer_top_position = 200;
var isClosing = false;
var isOpening = false;
var isOpen = false;

$(document).ready(function(){

	//$('#layer_1').show();
	
	png_fix_css();
	png_fix_img( '.content-img' );
	png_fix_on_the_fly( $('#pbr-hotspot-img') );
	png_fix_on_the_fly( $('#design-hotspot-img') );
	png_fix_on_the_fly( $('#patent-hotspot-img') );
	png_fix_on_the_fly( $('#trademarks-hotspot-img') );
	
	var yOffset = 0;
	var fadeInTime = 1000;
	var fadeOutTime = 1500;
	
									//0		1			2			3			4			5			6			7			8			9		 	10			11		 	12			13		 	14			15			16			17			18			19			20			21			22			23			1	
	var patent_hotspots_frame = 	[[0,0],	[-999,-999],[300,300],	[270,310],	[220,310],	[190,300],	[160,300],	[145,290],	[135,280],	[130,265],	[125,260],	[130,250],	[135,245],	[-999,-999],[330,230],	[340,260],	[340,270],	[340,285],	[320,300],	[300,310],	[280,310],	[240,310],	[200,310],	[170,300],	[130,255] ];
	var design_hotspots_frame = 	[[0,0],	[250,112],	[230,110],	[200,108],	[170,100],	[155,80],	[150,70],	[155,60],	[155,55],	[160,50],	[165,45],	[170,40],	[190,35],	[-999,-999],[260,30],	[280,35],	[290,40],	[300,50],	[310,55],	[320,60],	[330,70],	[320,75],	[310,80],	[300,90],	[250,112] ];
	var trademarks_hotspots_frame = [[0,0],	[-999,-999],[-999,-999],[410,270],	[420,280],	[430,290],	[440,310],	[435,310],	[415,325],	[390,340],	[355,350],	[320,355],	[-999,-999],[-999,-999],[-999,-999],	[225,340],	[200,330],	[170,320],	[160,310],	[150,300],	[150,290],	[160,280],	[165,270],	[-999,-999],[210,220] ];
	var pbr_hotspots_frame = 		[[0,0],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310],	[40,310]  ];
	
	var victa_images = [];
	var victa_init = 0;
	for(var i=1; i<=23; i++){
		victa_images.push( '' + ((i<10)?'0'+i:i) + '.jpg' );
	}
	var pbr_hotspot_images = [];
	var design_hotspot_images = [];
	var patent_hotspot_images = [];
	var trademarks_hotspot_images = [];
	for(var i=1; i<=5; i++){
		pbr_hotspot_images.push( 'pbr' + i + '.png' );
		design_hotspot_images.push( 'design' + i + '.png' );
		patent_hotspot_images.push( 'patent' + i + '.png' );
		trademarks_hotspot_images.push( 'trademark' + i + '.png' );
	}
	
	$('#victa').reel({path:'/images/int/victa/grass/', images:victa_images, cw:true, brake:0.2, entry:1, opening:1.1});
	
	if ($.browser.msie && parseInt($.browser.version.substr(0, 1)) < 7) { // ie6 or 5
	
	}else{
		$('#pbr-hotspot-img').reel({path:'/images/int/victa/', images:pbr_hotspot_images, brake:0, speed:0.7, throwable:false, wheelable:false, draggable:false});
		$('#design-hotspot-img').reel({path:'/images/int/victa/', images:design_hotspot_images, brake:0, speed:0.7, throwable:false, wheelable:false, draggable:false});
		$('#patent-hotspot-img').reel({path:'/images/int/victa/', images:patent_hotspot_images, brake:0, speed:0.7, throwable:false, wheelable:false, draggable:false});
		$('#trademarks-hotspot-img').reel({path:'/images/int/victa/', images:trademarks_hotspot_images, brake:0, speed:0.7, throwable:false, wheelable:false, draggable:false});
	}	
	
	$('.jquery-reel-preloader').append('<p id="loading-text">Loading...</p>');
		
	$('#victa').bind('loaded', function(e, frame){
		$('.jquery-reel-preloader').css('display', 'none');
		$('#hotspots').show();
	});
	
	//Position hotspots for each frame:
	$('#victa').bind('frameUpdate', function(e, frame){
		if(frame == 21 && victa_init<=2){
			victa_init++;
			if(victa_init>1){
				$('#victa').trigger('pause');
				$('#victa').trigger('stop');
			}
		}
		//$('#instructions').html('frame: ' + frame);
		
		if( patent_hotspots_frame[frame] ){
			$('#patent-hotspot').css('left', patent_hotspots_frame[frame][0]);
			$('#patent-hotspot').css('top', patent_hotspots_frame[frame][1] + yOffset);
		}
		
		if( trademarks_hotspots_frame[frame] ){
			//if(trademarks_hotspots_frame[frame][0] == 0 && trademarks_hotspots_frame[frame][1] == 0){
			$('#trademarks-hotspot').css('left', trademarks_hotspots_frame[frame][0] - 60);
			$('#trademarks-hotspot').css('top', trademarks_hotspots_frame[frame][1] - 120);
		}

		if( design_hotspots_frame[frame] ){
			$('#design-hotspot').css('left', design_hotspots_frame[frame][0]);
			$('#design-hotspot').css('top', design_hotspots_frame[frame][1] + yOffset);
		}
		
		if( pbr_hotspots_frame[frame] ){
			$('#pbr-hotspot').css('left', pbr_hotspots_frame[frame][0]);
			$('#pbr-hotspot').css('top', pbr_hotspots_frame[frame][1] + yOffset);
		}
	});
	
	//Hotspot Tooltips
	if ($.browser.msie && parseInt($.browser.version.substr(0, 1)) < 7) { // ie6 or 5
		//dont do tooltips in IE6
	}else{
		$("#pbr-hotspot").mouseover(showHotspotOver);
		$("#design-hotspot").mouseover(showHotspotOver);
		$("#patent-hotspot").mouseover(showHotspotOver);
		$("#trademarks-hotspot").mouseover(showHotspotOver);

		$("#pbr-hotspot").mouseout(hideHotspotOver);
		$("#design-hotspot").mouseout(hideHotspotOver);
		$("#patent-hotspot").mouseout(hideHotspotOver);
		$("#trademarks-hotspot").mouseout(hideHotspotOver);
	}

	$('#pbr-hotspot').bind('click', function() {
		$('.close-arrow').css('background', 'url(/images/int/victa/close-white.png) no-repeat');
		openOverlay( '<img src="/images/int/victa/grass.png" class="pbr-zoom">', 'pbr' );
	});

	$('#patent-hotspot').bind('click', function() {
		openOverlay( '<img src="/images/int/victa/blade.png" class="patent-zoom">', 'patent' );
	});

	$('#trademarks-hotspot').bind('click', function() {
		openOverlay( '<img src="/images/int/victa/victa-logo.png" class="trademarks-zoom">', 'trademarks' );
	});
	
	$('#design-hotspot').bind('click', function() {
		openOverlay( '<img src="/images/int/victa/engine-trans.png" class="design-zoom">', 'design' );
	});
	
	$('.close-arrow').bind('click', function() {
		closeOverlay();
	});

	$('#layer_1').bind('click', function() {
		closeOverlay();
	});
	
	$('.hotspot').disableTextSelect();
});

function scrollToPage( selector ){

	$('html, body').animate({
		scrollTop: $(selector).offset().top
	}, 1000);
}

function openOverlay( htmlContent, id ) {
	
	if ($.browser.msie && parseInt($.browser.version.substr(0, 1)) < 7) { // ie6 or 5
		scrollToPage('#'+id+'-content');
		return;
	}
	
	if(isOpening || isOpen){
		return;
	}
	
	isOpening = true;
	//$('#victa-reel').fadeTo('slow', 0.5, function() {
		$('#layer_1').show();
		//png_fix_css_dynamic( $('#layer_1') );
		$('#layer_1').fadeIn('slow', function() {
			$('#layer_1').animate({top:'-='+layer_top_position}, function() {
				$('.layer-content').html(htmlContent);
				//png_fix_on_the_fly( $('.'+id+'-zoom') );
				$('#'+id+'-content').show();
				//png_fix_css_dynamic( $('#'+id+'-content h2') );
				clickedHotspot();
				isOpening = false;
				isOpen = true;
			});
		});
	//});
	
}

function closeOverlay(){
	if(isClosing){
		return;
	}
	isClosing = true;
	isOpen = false;
	$('.layer-content').html('');
	$('#pbr-content').hide(0);
	$('#patent-content').hide(0);
	$('#design-content').hide(0);
	$('#trademarks-content').hide(0);
	$('#top-cover').hide(0);
	$('#layer_1').animate({top:'+='+layer_top_position}, function() {
		
		if ($.browser.msie && parseInt($.browser.version.substr(0, 1)) <= 8) {
			$('#layer_1').hide(0);
			showHotspots(true);
			isClosing = false;
		}
		else{
			$('#layer_1').fadeOut(150, function() {
				//$('#victa-reel').fadeTo('slow', 1, function() {
					showHotspots(true);
					$('.close-arrow').css('background', 'url(/images/int/victa/close.png) no-repeat');
					isClosing = false;
				//});
			});
		}
	});
}

function clickedHotspot(){
	$('#top-cover').show(0);
	showHotspots(false);
	$('#instructions').css('visibility', 'collapse');
}

function showHotspots( bool ) {
	if(!bool){
		shouldPulsate = false;
	}else{
		shouldPulsate = true;
	}
}

var showHotspotOver = function(ev) {
	//var pos = $("#"+ev.currentTarget.id).offset();  
	//var width = $("#"+ev.currentTarget.id).width();
	//$("#"+ev.currentTarget.id+"-tooltip").css( { "left": (pos.left - 60) + "px", "top": (pos.top+50) + "px" } );
	$("#"+ev.currentTarget.id+"-tooltip").show();
}

var hideHotspotOver = function(ev) {
	$("#"+ev.currentTarget.id+"-tooltip").hide();
}
// JavaScript Document