var ND = (function(ND, $) {
	
	//The create function creates the module object; It does no initialise the object
	ND.timelineContents = function () {
	
		var $element, $contentContainer, $contentItem,
			contentWidth, contentNumber,
			speed = 500,
			pf = "time-",
			sliderStart = 2.5,
			sliderEnd = 96,
			markup = '<div id="timeline-content"><div class="wrap"><ul>%CONTENT%</ul></div></div>',
			
						
			populateData = function(content,jsonData){
				var data = jsonData.data,
					contentMarkup = '',
					$content = $(content),
					counter = 0;
				
				$.each(data.conf, function(i, confVal){
				
					counter++
				
					contentMarkup += '<li class="column"><h3>' + confVal.year + '</h3><div class="text-wrap">';
					
					$.each(confVal.children, function(i, cVal){
						contentMarkup += '<div class="text ' + cVal.type + '"><p>' + cVal.content + '</p><a class="icon" href="#"></a>';
						
						if (cVal.type == 'popup'){
							contentMarkup += '<h1>'+cVal.title+'</h1>';
							contentMarkup += '<img src="'+cVal.image+'" alt="'+cVal.title+'" title="'+cVal.title+'" />';							
							var params = cVal.param.split(",");
							
							if (params.length >0){
								contentMarkup += '<ul class="properties">';
								for (var i=0; i<params.length; i++){
									var ele = params[i];
									if (ele.toLowerCase() == 'pbr') {ele = 'Plant Breader\'s Right'};
									if (ele.toLowerCase() == 'trademark') {ele = 'Trade Mark'};
									contentMarkup += '<li class="'+params[i].toLowerCase()+'">'+ele+'</li>';
								}
								if(cVal.copyright == null) cVal.copyright=' ';
								contentMarkup += '</ul><p class="imgcopyright">'+cVal.copyright+'</p></div>';
							}
						}
						else{
							contentMarkup += "</div>";
						}
					});
					
					contentMarkup += '</div></li>';
					
				});
				
				markup = markup.replace(/%([A-Z]*)%/, contentMarkup);
				

				$element.append(markup);

				$('.popup .icon').colorbox({inline:true, href:"#timeline-popup-content",onLoad:function(){
					var $this = $.colorbox.element();
					
					$(".img",$content).html($this.siblings('img').clone());
					$(".heading",$content).html($this.siblings('h1').clone());
					$(".body .text",$content).html($this.prev().clone());
					$(".parameters",$content).html($this.siblings('.properties').clone());
					$(".imgcopyright",$content).html($this.siblings('p.imgcopyright').clone());
					
					$element.append($content);
					Cufon.replace('#timeline-popup-content h1');
				}});
				
				
				var timer;
				
				//Tab Focus through the timeline.. 
				$element.find('a.icon').focus( function() {
					var columnIndex = $(this).closest('.column').index(),
						newSliderValue = columnIndex/counter*100;
					
					if( newSliderValue < sliderStart || newSliderValue > sliderEnd ) {
						newSliderValue = newSliderValue < sliderStart ? sliderStart : sliderEnd ;
					}

					//Tolorance
					clearTimeout( timer );
					timer = setTimeout( function() {
						$.publish('/timeline/move', [ newSliderValue , true]);
						$.publish('/timeline/changeslider', [ newSliderValue ]);					
					}, 100);
				});
				
			},
			
			
			initContents = function() {
				$("#timeline-content p").truncate();
				$contentContainer = $('#timeline-content .wrap');
				$contentItem = $contentContainer.find('li');
				contentNumber = $contentItem.length;
				contentWidth = contentNumber * $contentItem.outerWidth();
				$contentContainer.css('width',contentWidth);
			},
			
			//The value is 95% not 100% because the slider is limited in values.  sliderStart = 2.5, sliderEnd = 96
			moveContent = function($elem, sliderValue, contentWidth, animating) {
				if (animating) {
					$elem.stop(true).animate({'left': -sliderValue/95*(contentWidth-7400)}, speed);
				} else {
					$elem.css('left', -sliderValue/95*(contentWidth-7400) + 'px');
				}
			},
			
			listenToSlider = function() {
				$.subscribe('/timeline/move', function(sliderValue, animating) {
					moveContent($contentContainer, sliderValue, contentWidth, animating);
				});
			};
		
		/*
		 * returns a new object that is the functionality of the module
		 * It has access to the private variables and functions declared in this closure.
		 */
		return {

			init: function( options ) { 
				
				/* Cache the jQuery instance of the element(s) this belongs too.
				 * Bake in default selectors. 
				 */
				$element = $("#timeline");
				
				
				var cacheBuster = "?_=" + +new Date();
				
				$.when ($.get(options.popupConent + cacheBuster), $.getJSON(options.data + cacheBuster))
					.done(function(contents,jsonData){
						populateData(contents[0],jsonData[0]);
						$element.removeClass("not-loaded");
						initContents();
						$("P.loading").hide();
						$.publish('timeline/content-loaded');
					})
					.fail(function(){
					});
				
				listenToSlider();
				
				/* Return this so it can be chained / assigned
				 * eg. var myModule = ND.myModuleName().init();
				 */
				return this;
			
			}
			
		
		};	
	};
	
	/* Return ND after it's been augmented */ 
	return ND;	

}(window.ND || {}, jQuery));
/* End File */
