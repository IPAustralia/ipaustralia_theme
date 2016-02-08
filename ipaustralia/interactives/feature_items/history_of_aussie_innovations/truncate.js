(function($){  
	 $.fn.truncate = function(options) {
	      
		var defaults = {
		   length: 23,
		   ellipsisText: "..."
		  },
		  
		  options = $.extend(defaults, options),
		  
		lastExpanded;
		
		function clickHandler( controller, expand ){
			var moreContent = controller.prev('p').find('.truncate-more');
			var ellipsis = controller.prev('p').find('.truncate-ellipsis');
			var container = controller.parent();
			
			if ( expand ){
				moreContent.slideUp( 200 );
				container.removeClass('active');
				ellipsis.show();
				lastExpanded = null;
			}
			else{
				moreContent.slideDown( 400 );
				ellipsis.hide();
				container.addClass('active');
				lastExpanded = controller;
			}
			
			
			return false;
		}

		return this.each(function() { 
			$this = $(this);
			var textContent = $this.html(); 

			if(textContent.length > options.length) {
				
				var words = textContent.split(' '),
					length = 0,
					index,
					start,
					end;
				
				$.each( words, function(i, word) {
					var futureLength = length + word.length + 1;
					if( futureLength > options.length ) {
						index = i;
						return false;
					}					
					length = futureLength;
				});
				
				start = words.slice(0, index).join(' ');
				end = words.slice(index, words.length).join(' ');
				
				$this
					.html( [ start,
							'<span class="truncate-ellipsis">',
							options.ellipsisText,
							'</span> ',
							'<span class="truncate-more">',
							end,
							'</span>'].join('') )
					.find('.truncate-more').hide(0);
	
				if ($this.parent().hasClass('collapse')){
					$($this.next('.icon')).click(function(e){
						var controller = $(this);
						if(  lastExpanded && !controller.is( lastExpanded ) ) {
							clickHandler( lastExpanded, true ); 
						}
						clickHandler( controller, controller.parent().hasClass('active') ); 
						e.preventDefault();
					});
				}
			}
	  });  
 };  
})(jQuery);