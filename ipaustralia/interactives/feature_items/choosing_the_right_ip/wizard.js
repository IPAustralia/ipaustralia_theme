/*
 * This is an example module.
 * Reading: http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
 * 
 * Please copy and rename this file.
 * 
 */
 
 /*
'<li>','<a href="#step%STEP%task%ID%" title="%LABEL%">%LABEL%</a>','</li>'
'<h2><a name="step%STEP%task%ID%">%LABEL%</a></h2>'
'<li>','<a href="#step%STEP%task%ID%" title="%LABEL%">%LABEL%</a>','</li>'
*/

/*globals jQuery, ND, window */
var ND = (function(ND, $) {
	
	var HTML = {
			step1: ['<div class="row">',
					'<input type="radio" name="step%STEP%" id="step%STEP%task%ID%" value="step%STEP%task%ID%" />',
					'<label for="step%STEP%task%ID%">%LABEL%%HELP%</label>',
				'</div>'].join('')
			,step2group: '<div class="options" id="option-step1task%ID%"><h2>%LABEL%</h2></div>'
			,step2: ['<div class="row">',
						'<input type="radio" name="step%STEP%" id="step%STEP%task%ID%" value="%VALUE%" />',
						'<label for="step%STEP%task%ID%">%LABEL%%HELP%</label>',
					'</div>'].join('')
			,step3: '<div class="annotations" id="annotation-%ID%">%CONTENT%</div>'
		},
	
		
		/*
		 * Simple Template Helper Function
		 */
		simpleTemplate = function( name, data ) {
			return $(HTML[name].replace( /%([A-Z]*?)%/g, function(m, g) {
			    return data[g.toLowerCase()];
			}));
		};
	
	
	//The create function creates the module object; It does no initialise the object
	ND.wizard = function () {
	
		/*
		 * Write private variables and functions here in this closure.
		 * They don't need to be just utility functions, they can refer to the private instance variables 
		 */
		var wizard,
			data,
			moreLink,
			step1element,
			step1contents,
			step2options,
			step3contents,
			step3annotations,
			rawAnnotations,
			skipStep2 = false,
			scrollInit = false;

		/*
		 * Pre AJAX readiness
		 */
		function readyApp( options ) {
			
			$('<img />').attr('src', options.imgSupport + '?_='+(+new Date())).load(function() {
				$('html').addClass('img-support');
			});	
			
			if( ( window.location.href.indexOf('text-only=true') !== -1 ) 			 ||
				( !wizard || !wizard.size() || !options.contents || !options.data )	 ||
				( wizard.hasClass('ie6') )
				) { 
					wizard
						.removeClass('not-loaded');
					return false; 
				}
			
			rawAnnotations = wizard.find('.annotations');
			
			wizard
				.removeClass('disabled')
				.removeClass('not-loaded')
				.empty()
				.html('<p class="loading">Loading content...</p>');
			
			return true;
		}

		
		/*
		 * Application INIT load.
		 */
		function app( contents, jsonData ) {
			data = jsonData.data;
			
			$.extend($.ui.accordion.animations, {
				  slowslide: function(options) {
					$.ui.accordion.animations.slide(options, { duration: 600 }); }
				  });
			
			wizard
				.html( contents )
				.accordion({
					autoHeight:true,
					animated: 'slowslide'
					//event:false
				});
			initStep1();
			bindButtons();
		}
		
		/*
		 * Populate the Step 1 content into the DOM
		 */		
		function initStep1() {
		
			var firstStep1;
			
			step1contents = $('#step1-contents');
			
			$.each( data.conf, function( i, conf) {
				var step1 = simpleTemplate( 'step1',  $.extend(conf, {
					step:1,
					help: getHelp( conf )
				}));
				if( i === 0 ) {
					firstStep1 = step1;
				}
				step1contents.append( step1 );
			});

			initStep2();
			
			step1contents
				.find('INPUT')
				.change( step1Change );
			firstStep1
				.find('INPUT')
				.attr('checked', 'checked')
				.trigger('change');
		}
		
		function getHelp( obj ) {
			var ret = '';
			/*
			if( obj.help ) {
				ret = '<a href="#" title="What is this?" class="help"><span class="visually-hidden"> Help?</span><div><span class="pointer"></span>%IMG%<span class="para" title="'+obj.help+'">Eg. ' + obj.help + '</span></div></a>';
			}
			
			ret = ret.replace('%IMG%', obj.helpImg ? '<img src="'+obj.helpImg+'" alt="'+obj.help+'" title="'+obj.help+'" />' : '')
			*/
			return ret; 
		}
		
		/*
		 * Event handler for step 1 INPUTs
		 */
		function step1Change() {

			skipStep2 = false;
			
			var current = step2options
				.hide()
				.filter( '#option-' + this.value )
				.show();
			
			var inputs = current.find('input');
			
			inputs
				.eq(0)
				.attr('checked', 'checked')
				.trigger('change');
			
			if( inputs.size() <= 1 ) {
				inputs.eq(0).trigger('change');	
				skipStep2 = true;
			}
		}
		
		/*
		 * Populate the Step 2 content into the DOM
		 */
		function initStep2() {
			
			var firstStep2;
			
			step2contents = $('#step2-contents');

			//Level 2 Group	
			$.each( data.conf, function( i, conf ) {
				
				var step2group = simpleTemplate( 'step2group',  conf );
				
				step2contents.append( step2group );
				
				//Level 2
				$.each( conf.children, function( j, child ) {	
									
					var step2 = simpleTemplate( 'step2',  $.extend( child, {
						id: child.id + "-" + i + "-" + j,
						value: child.id,
						step:2,
						help: getHelp( child )
					}));

					if( i === 0  && j === 0) {
						firstStep2 = step2;
					}
			
					step2group.append( step2 );
								
				});
				
			});
			
			step2options = step2contents.find('.options');
			
			initStep3();
			
			step2options
				.find('INPUT')
				.change( step2Change );
			firstStep2
				.find('INPUT')
				.attr('checked', 'checked')
				.trigger('change');

		}
		
		/*
		 * Event handler for step 2 INPUTs
		 */		
		function step2Change() {
			
			//var item = data.list[this.value];
			
			var furtherMore = step3annotations
				.hide()
				.filter('.annotation-' + this.value )
				.show()
				.find('.for-more');
			
			moreLink.hide();
			
			if( furtherMore.size() ) {
				moreLink
					.show(0)
					.attr('href', furtherMore.eq(0).attr("href") );
			} 
			
		}
		
		/*
		 * Function to enable scroll.
		 * Only works if the element has width and height.
		 */
		function enableScroll(e, ui) {
			if( ui.newContent.is('.step3')) {
				if( $('html').hasClass('img-support') ) {
					step3contents.jScrollPane({contentWidth:385, showArrows:true});
				}				
			}
		}
		
		/*
		 * Populate the Step 3 content into the DOM
		 */
		function initStep3() {
		
			moreLink = $('#moreLink');
			step3contents = $('#step3-contents');
			
			step3contents.append( rawAnnotations );
			
			step3annotations = step3contents.find('.annotations');
			
			/*
			
			//Level 2 Group	
			$.each( data.list, function( id, item ) {
				
				var step3 = simpleTemplate( 'step3',  $.extend( item, {
					id: id
				}) );
				
				step3contents.append( step3 );
				
			});
			
			step3annotations = step3contents.find('.annotations');
			*/
		}
		
		/*
		 * Bind the buttons
		 */ 
		function bindButtons() {
		
			//Next and Prev
			wizard.find('button.next, button.back').click(function() {
				var dif = $(this).val().split('-'),
					val = dif[1] == 1 && skipStep2 ? ( dif[0] === "f" ? 2 : 0 ) : dif[1];
				
				wizard.accordion( "activate" , parseInt(val));
			});

			wizard.bind( "accordionchange", enableScroll );

			var open;
			
			function closeHelp( elem ) {
				if ( elem.hasClass('open') ) {
					open = false;
					elem.removeClass('open');
				}
			}
			
			function openHelp( elem, click ) {
				if( !elem.hasClass('open') ) {
					open = elem;
					elem.addClass('open')
				} 
			}
			
			function openHelpHandler(e) {
				e.preventDefault();
				openHelp( $(this) );				
			}	
			
			function closeHelpHandler(e) {
				e && e.preventDefault();
				closeHelp( $(this) );			
			}

			//Hack because chrome doesn't not trigger blur on click events.
			wizard.click(function() {
				open && closeHelpHandler.apply( open , [])
			});
			wizard
				.delegate('.help', 'click', openHelpHandler)
				.delegate('.help', 'focusin', openHelpHandler)
				.delegate('.help', 'focusout', closeHelpHandler)
				.delegate('.help', 'blur', closeHelpHandler);
		}
		
		//Return the Module
		return {

			/*
			 * eg. var wizard = ND.wizard()
			 *     wizard.init(); 
			 */
			init: function( options ) { 
				
				wizard = $('#wizard');
				
				if( !readyApp( options ) ) { return; }
			
				var cacheBuster = "?_=" + +new Date();
			
				//replace Alternative Version with full JS version				
				$.when(  $.get( options.contents + cacheBuster),  $.getJSON( options.data + cacheBuster)  )
					.done(function( contents, jsonData ) {						
						app( contents[0], jsonData[0] );
					});

				return this;
			}
		
		};	
	};
	
	/* Return ND after it's been augmented */ 
	return ND;	

}(window.ND || {}, jQuery));
/* End File */
