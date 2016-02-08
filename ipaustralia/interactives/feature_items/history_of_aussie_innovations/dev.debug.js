/*!
 * Project Name: IP Australia Timeline
 * File Build Date: Mon Aug 29 2011 09:36:53 GMT+0800 (CST)
 */
/* logging.js */
/*! logging.js version 1.0 */
/*jslint onevar: true, undef: true, eqeqeq: true, regexp: true, newcap: true, immed: true */
/*globals jQuery, console, window */
(function($){
	if (!window.console || !console.firebug)
	{
	    var i, defn = function(){}, 
	        names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
	    "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
	
	    window.console = {};
	    for (i = names.length; i--;) {
	        window.console[names[i]] = defn;
	    }
	}
	
	$.fn.log = function (msg) {
		console.log("%s: %o", msg, this); 
		return this;
	};
}(jQuery));

/* jquery.colorbox.js */
// ColorBox v1.3.17.1 - a full featured, light-weight, customizable lightbox based on jQuery 1.3+
// Copyright (c) 2011 Jack Moore - jack@colorpowered.com
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
(function ($, document, window) {
	var
	// ColorBox Default Settings.	
	// See http://colorpowered.com/colorbox for details.
	defaults = {
		transition: "elastic",
		speed: 300,
		width: false,
		initialWidth: "600",
		innerWidth: false,
		maxWidth: false,
		height: false,
		initialHeight: "450",
		innerHeight: false,
		maxHeight: false,
		scalePhotos: true,
		scrolling: true,
		inline: false,
		html: false,
		iframe: false,
		fastIframe: true,
		photo: false,
		href: false,
		title: false,
		rel: false,
		opacity: 0.9,
		preloading: true,
		current: "image {current} of {total}",
		previous: "previous",
		next: "next",
		close: "close",
		open: false,
		returnFocus: true,
		loop: true,
		slideshow: false,
		slideshowAuto: true,
		slideshowSpeed: 2500,
		slideshowStart: "start slideshow",
		slideshowStop: "stop slideshow",
		onOpen: false,
		onLoad: false,
		onComplete: false,
		onCleanup: false,
		onClosed: false,
		overlayClose: true,		
		escKey: true,
		arrowKey: true,
        top: false,
        bottom: false,
        left: false,
        right: false,
        fixed: false,
        data: false
	},
	
	// Abstracting the HTML and event identifiers for easy rebranding
	colorbox = 'colorbox',
	prefix = 'cbox',
	
	// Events	
	event_open = prefix + '_open',
	event_load = prefix + '_load',
	event_complete = prefix + '_complete',
	event_cleanup = prefix + '_cleanup',
	event_closed = prefix + '_closed',
	event_purge = prefix + '_purge',
	
	// Special Handling for IE
	isIE = $.browser.msie && !$.support.opacity, // Detects IE6,7,8.  IE9 supports opacity.  Feature detection alone gave a false positive on at least one phone browser and on some development versions of Chrome, hence the user-agent test.
	isIE6 = isIE && $.browser.version < 7,
	event_ie6 = prefix + '_IE6',

	// Cached jQuery Object Variables
	$overlay,
	$box,
	$wrap,
	$content,
	$topBorder,
	$leftBorder,
	$rightBorder,
	$bottomBorder,
	$related,
	$window,
	$loaded,
	$loadingBay,
	$loadingOverlay,
	$title,
	$current,
	$slideshow,
	$next,
	$prev,
	$close,
	$groupControls,

	// Variables for cached values or use across multiple functions
	settings = {},
	interfaceHeight,
	interfaceWidth,
	loadedHeight,
	loadedWidth,
	element,
	index,
	photo,
	open,
	active,
	closing,
    handler,
    loadingTimer,
	
	publicMethod,
	boxElement = prefix + 'Element';
	
	// ****************
	// HELPER FUNCTIONS
	// ****************

	// jQuery object generator to reduce code size
	function $div(id, cssText) { 
		var div = document.createElement('div');
		if (id) {
            div.id = prefix + id;
        }
		div.style.cssText = cssText || '';
		return $(div);
	}

	// Convert % values to pixels
	function setSize(size, dimension) {
		dimension = dimension === 'x' ? $window.width() : $window.height();
		return (typeof size === 'string') ? Math.round((/%/.test(size) ? (dimension / 100) * parseInt(size, 10) : parseInt(size, 10))) : size;
	}
	
	// Checks an href to see if it is a photo.
	// There is a force photo option (photo: true) for hrefs that cannot be matched by this regex.
	function isImage(url) {
		return settings.photo || /\.(gif|png|jpg|jpeg|bmp)(?:\?([^#]*))?(?:#(\.*))?$/i.test(url);
	}
	
	// Assigns function results to their respective settings.  This allows functions to be used as values.
	function process(settings) {
		for (var i in settings) {
			if ($.isFunction(settings[i]) && i.substring(0, 2) !== 'on') { // checks to make sure the function isn't one of the callbacks, they will be handled at the appropriate time.
			    settings[i] = settings[i].call(element);
			}
		}
        
		settings.rel = settings.rel || element.rel || 'nofollow';
		settings.href = settings.href || $(element).attr('href');
		settings.title = settings.title || element.title;
        
        if (typeof settings.href === "string") {
            settings.href = $.trim(settings.href);
        }
	}

	function trigger(event, callback) {
		if (callback) {
			callback.call(element);
		}
		$.event.trigger(event);
	}

	// Slideshow functionality
	function slideshow() {
		var
		timeOut,
		className = prefix + "Slideshow_",
		click = "click." + prefix,
		start,
		stop,
		clear;
		
		if (settings.slideshow && $related[1]) {
			start = function () {
				$slideshow
					.text(settings.slideshowStop)
					.unbind(click)
					.bind(event_complete, function () {
						if (index < $related.length - 1 || settings.loop) {
							timeOut = setTimeout(publicMethod.next, settings.slideshowSpeed);
						}
					})
					.bind(event_load, function () {
						clearTimeout(timeOut);
					})
					.one(click + ' ' + event_cleanup, stop);
				$box.removeClass(className + "off").addClass(className + "on");
				timeOut = setTimeout(publicMethod.next, settings.slideshowSpeed);
			};
			
			stop = function () {
				clearTimeout(timeOut);
				$slideshow
					.text(settings.slideshowStart)
					.unbind([event_complete, event_load, event_cleanup, click].join(' '))
					.one(click, start);
				$box.removeClass(className + "on").addClass(className + "off");
			};
			
			if (settings.slideshowAuto) {
				start();
			} else {
				stop();
			}
		} else {
            $box.removeClass(className + "off " + className + "on");
        }
	}

	function launch(elem) {
		if (!closing) {
			
			element = elem;
			
			process($.extend(settings, $.data(element, colorbox)));
			
			$related = $(element);
			
			index = 0;
			
			if (settings.rel !== 'nofollow') {
				$related = $('.' + boxElement).filter(function () {
					var relRelated = $.data(this, colorbox).rel || this.rel;
					return (relRelated === settings.rel);
				});
				index = $related.index(element);
				
				// Check direct calls to ColorBox.
				if (index === -1) {
					$related = $related.add(element);
					index = $related.length - 1;
				}
			}
			
			if (!open) {
				open = active = true; // Prevents the page-change action from queuing up if the visitor holds down the left or right keys.
				
				$box.show();
				
				if (settings.returnFocus) {
					try {
						element.blur();
						$(element).one(event_closed, function () {
							try {
								this.focus();
							} catch (e) {
								// do nothing
							}
						});
					} catch (e) {
						// do nothing
					}
				}
				
				// +settings.opacity avoids a problem in IE when using non-zero-prefixed-string-values, like '.5'
				$overlay.css({"opacity": +settings.opacity, "cursor": settings.overlayClose ? "pointer" : "auto"}).show();
				
				// Opens inital empty ColorBox prior to content being loaded.
				settings.w = setSize(settings.initialWidth, 'x');
				settings.h = setSize(settings.initialHeight, 'y');
				publicMethod.position(0);
				
				if (isIE6) {
					$window.bind('resize.' + event_ie6 + ' scroll.' + event_ie6, function () {
						$overlay.css({width: $window.width(), height: $window.height(), top: $window.scrollTop(), left: $window.scrollLeft()});
					}).trigger('resize.' + event_ie6);
				}
				
				trigger(event_open, settings.onOpen);
				
				$groupControls.add($title).hide();
				
				$close.html(settings.close).show();
			}
			
			publicMethod.load(true);
		}
	}

	// ****************
	// PUBLIC FUNCTIONS
	// Usage format: $.fn.colorbox.close();
	// Usage from within an iframe: parent.$.fn.colorbox.close();
	// ****************
	
	publicMethod = $.fn[colorbox] = $[colorbox] = function (options, callback) {
		var $this = this, autoOpen;
		
		if (!$this[0] && $this.selector) { // if a selector was given and it didn't match any elements, go ahead and exit.
			return $this;
		}
		
		options = options || {};
		
		if (callback) {
			options.onComplete = callback;
		}
		
		if (!$this[0] || $this.selector === undefined) { // detects $.colorbox() and $.fn.colorbox()
			$this = $('<a/>');
			options.open = true; // assume an immediate open
		}
		
		$this.each(function () {
			$.data(this, colorbox, $.extend({}, $.data(this, colorbox) || defaults, options));
			$(this).addClass(boxElement);
		});
		
		autoOpen = options.open;
		
		if ($.isFunction(autoOpen)) {
			autoOpen = autoOpen.call($this);
		}
		
		if (autoOpen) {
			launch($this[0]);
		}
		
		return $this;
	};

	// Initialize ColorBox: store common calculations, preload the interface graphics, append the html.
	// This preps colorbox for a speedy open when clicked, and lightens the burdon on the browser by only
	// having to run once, instead of each time colorbox is opened.
	publicMethod.init = function () {
		// Create & Append jQuery Objects
		$window = $(window);
		$box = $div().attr({id: colorbox, 'class': isIE ? prefix + (isIE6 ? 'IE6' : 'IE') : ''});
		$overlay = $div("Overlay", isIE6 ? 'position:absolute' : '').hide();
		
		$wrap = $div("Wrapper");
		$content = $div("Content").append(
			$loaded = $div("LoadedContent", 'width:0; height:0; overflow:hidden'),
			$loadingOverlay = $div("LoadingOverlay").add($div("LoadingGraphic")),
			$title = $div("Title"),
			$current = $div("Current"),
			$next = $div("Next"),
			$prev = $div("Previous"),
			$slideshow = $div("Slideshow").bind(event_open, slideshow),
			$close = $div("Close")
		);
		$wrap.append( // The 3x3 Grid that makes up ColorBox
			$div().append(
				$div("TopLeft"),
				$topBorder = $div("TopCenter"),
				$div("TopRight")
			),
			$div(false, 'clear:left').append(
				$leftBorder = $div("MiddleLeft"),
				$content,
				$rightBorder = $div("MiddleRight")
			),
			$div(false, 'clear:left').append(
				$div("BottomLeft"),
				$bottomBorder = $div("BottomCenter"),
				$div("BottomRight")
			)
		).children().children().css({'float': 'left'});
		
		$loadingBay = $div(false, 'position:absolute; width:9999px; visibility:hidden; display:none');
		
		$('body').prepend($overlay, $box.append($wrap, $loadingBay));
		
		$content.children()
		.hover(function () {
			$(this).addClass('hover');
		}, function () {
			$(this).removeClass('hover');
		}).addClass('hover');
		
		// Cache values needed for size calculations
		interfaceHeight = $topBorder.height() + $bottomBorder.height() + $content.outerHeight(true) - $content.height();//Subtraction needed for IE6
		interfaceWidth = $leftBorder.width() + $rightBorder.width() + $content.outerWidth(true) - $content.width();
		loadedHeight = $loaded.outerHeight(true);
		loadedWidth = $loaded.outerWidth(true);
		
		// Setting padding to remove the need to do size conversions during the animation step.
		$box.css({"padding-bottom": interfaceHeight, "padding-right": interfaceWidth}).hide();
		
        // Setup button events.
        $next.click(function () {
            publicMethod.next();
        });
        $prev.click(function () {
            publicMethod.prev();
        });
        $close.click(function () {
            publicMethod.close();
        });
		
		$groupControls = $next.add($prev).add($current).add($slideshow);
		
		// Adding the 'hover' class allowed the browser to load the hover-state
		// background graphics.  The class can now can be removed.
		$content.children().removeClass('hover');
		


        
		$overlay.click(function () {
			if (settings.overlayClose) {
				publicMethod.close();
			}
		});
		
		// Set Navigation Key Bindings
		$(document).bind('keydown.' + prefix, function (e) {
            var key = e.keyCode;
			if (open && settings.escKey && key === 27) {
				e.preventDefault();
				publicMethod.close();
			}
			if (open && settings.arrowKey && $related[1]) {
				if (key === 37) {
					e.preventDefault();
					$prev.click();
				} else if (key === 39) {
					e.preventDefault();
					$next.click();
				}
			}
		});
	};
	
	publicMethod.remove = function () {
		$box.add($overlay).remove();
		$('.' + boxElement).removeData(colorbox).removeClass(boxElement);
	};

	publicMethod.position = function (speed, loadedCallback) {
        var animate_speed, top = 0, left = 0;
        
        // remove the modal so that it doesn't influence the document width/height        
        $box.hide();
        
        if (settings.fixed && !isIE6) {
            $box.css({position: 'fixed'});
        } else {
            top = $window.scrollTop();
            left = $window.scrollLeft();
            $box.css({position: 'absolute'});
        }
        
		// keeps the top and left positions within the browser's viewport.
        if (settings.right !== false) {
            left += Math.max($window.width() - settings.w - loadedWidth - interfaceWidth - setSize(settings.right, 'x'), 0);
        } else if (settings.left !== false) {
            left += setSize(settings.left, 'x');
        } else {
            left += Math.max($window.width() - settings.w - loadedWidth - interfaceWidth, 0) / 2;
        }
        
        if (settings.bottom !== false) {
            top += Math.max(document.documentElement.clientHeight - settings.h - loadedHeight - interfaceHeight - setSize(settings.bottom, 'y'), 0);
        } else if (settings.top !== false) {
            top += setSize(settings.top, 'y');
        } else {
            top += Math.max(document.documentElement.clientHeight - settings.h - loadedHeight - interfaceHeight, 0) / 2;
        }
        
        $box.show();
        
		// setting the speed to 0 to reduce the delay between same-sized content.
		animate_speed = ($box.width() === settings.w + loadedWidth && $box.height() === settings.h + loadedHeight) ? 0 : speed;
        
		// this gives the wrapper plenty of breathing room so it's floated contents can move around smoothly,
		// but it has to be shrank down around the size of div#colorbox when it's done.  If not,
		// it can invoke an obscure IE bug when using iframes.
		$wrap[0].style.width = $wrap[0].style.height = "9999px";
		
		function modalDimensions(that) {
			// loading overlay height has to be explicitly set for IE6.
			$topBorder[0].style.width = $bottomBorder[0].style.width = $content[0].style.width = that.style.width;
			$loadingOverlay[0].style.height = $loadingOverlay[1].style.height = $content[0].style.height = $leftBorder[0].style.height = $rightBorder[0].style.height = that.style.height;
		}
		
		$box.dequeue().animate({width: settings.w + loadedWidth, height: settings.h + loadedHeight, top: top, left: left}, {
			duration: animate_speed,
			complete: function () {
				modalDimensions(this);
				
				active = false;
				
				// shrink the wrapper down to exactly the size of colorbox to avoid a bug in IE's iframe implementation.
				$wrap[0].style.width = (settings.w + loadedWidth + interfaceWidth) + "px";
				$wrap[0].style.height = (settings.h + loadedHeight + interfaceHeight) + "px";
				
				if (loadedCallback) {
					loadedCallback();
				}
			},
			step: function () {
				modalDimensions(this);
			}
		});
	};

	publicMethod.resize = function (options) {
		if (open) {
			options = options || {};
			
			if (options.width) {
				settings.w = setSize(options.width, 'x') - loadedWidth - interfaceWidth;
			}
			if (options.innerWidth) {
				settings.w = setSize(options.innerWidth, 'x');
			}
			$loaded.css({width: settings.w});
			
			if (options.height) {
				settings.h = setSize(options.height, 'y') - loadedHeight - interfaceHeight;
			}
			if (options.innerHeight) {
				settings.h = setSize(options.innerHeight, 'y');
			}
			if (!options.innerHeight && !options.height) {				
				var $child = $loaded.wrapInner("<div style='overflow:auto'></div>").children(); // temporary wrapper to get an accurate estimate of just how high the total content should be.
				settings.h = $child.height();
				$child.replaceWith($child.children()); // ditch the temporary wrapper div used in height calculation
			}
			$loaded.css({height: settings.h});
			
			publicMethod.position(settings.transition === "none" ? 0 : settings.speed);
		}
	};

	publicMethod.prep = function (object) {
		if (!open) {
			return;
		}
		
		var speed = settings.transition === "none" ? 0 : settings.speed;
		
		$window.unbind('resize.' + prefix);
		$loaded.remove();
		$loaded = $div('LoadedContent').html(object);
		
		function getWidth() {
			settings.w = settings.w || $loaded.width();
			settings.w = settings.mw && settings.mw < settings.w ? settings.mw : settings.w;
			return settings.w;
		}
		function getHeight() {
			settings.h = settings.h || $loaded.height();
			settings.h = settings.mh && settings.mh < settings.h ? settings.mh : settings.h;
			return settings.h;
		}
		
		$loaded.hide()
		.appendTo($loadingBay.show())// content has to be appended to the DOM for accurate size calculations.
		.css({width: getWidth(), overflow: settings.scrolling ? 'auto' : 'hidden'})
		.css({height: getHeight()})// sets the height independently from the width in case the new width influences the value of height.
		.prependTo($content);
		
		$loadingBay.hide();
		
		// floating the IMG removes the bottom line-height and fixed a problem where IE miscalculates the width of the parent element as 100% of the document width.
		//$(photo).css({'float': 'none', marginLeft: 'auto', marginRight: 'auto'});
		
        $(photo).css({'float': 'none'});
        
		// Hides SELECT elements in IE6 because they would otherwise sit on top of the overlay.
		if (isIE6) {
			$('select').not($box.find('select')).filter(function () {
				return this.style.visibility !== 'hidden';
			}).css({'visibility': 'hidden'}).one(event_cleanup, function () {
				this.style.visibility = 'inherit';
			});
		}
		
		function setPosition(s) {
			publicMethod.position(s, function () {
				var prev, prevSrc, next, nextSrc, total = $related.length, iframe, complete;
				
				if (!open) {
					return;
				}
				
                function removeFilter() {
                    if (isIE) {
                        $box[0].style.removeAttribute('filter');
                    }
                }
                
				complete = function () {
                    clearTimeout(loadingTimer);
					$loadingOverlay.hide();
					trigger(event_complete, settings.onComplete);
				};
				
				if (isIE) {
					//This fadeIn helps the bicubic resampling to kick-in.
					if (photo) {
						$loaded.fadeIn(100);
					}
				}
				
				$title.html(settings.title).add($loaded).show();
				
				if (total > 1) { // handle grouping
					if (typeof settings.current === "string") {
						$current.html(settings.current.replace(/\{current\}/, index + 1).replace(/\{total\}/, total)).show();
					}
					
					$next[(settings.loop || index < total - 1) ? "show" : "hide"]().html(settings.next);
					$prev[(settings.loop || index) ? "show" : "hide"]().html(settings.previous);
					
					prev = index ? $related[index - 1] : $related[total - 1];
					next = index < total - 1 ? $related[index + 1] : $related[0];
					
					if (settings.slideshow) {
						$slideshow.show();
					}
					
					// Preloads images within a rel group
					if (settings.preloading) {
						nextSrc = $.data(next, colorbox).href || next.href;
						prevSrc = $.data(prev, colorbox).href || prev.href;
						
						nextSrc = $.isFunction(nextSrc) ? nextSrc.call(next) : nextSrc;
						prevSrc = $.isFunction(prevSrc) ? prevSrc.call(prev) : prevSrc;
						
						if (isImage(nextSrc)) {
							$('<img/>')[0].src = nextSrc;
						}
						
						if (isImage(prevSrc)) {
							$('<img/>')[0].src = prevSrc;
						}
					}
				} else {
					$groupControls.hide();
				}
				
				if (settings.iframe) {
					iframe = $('<iframe/>').addClass(prefix + 'Iframe')[0];
					
					if (settings.fastIframe) {
						complete();
					} else {
						$(iframe).one('load', complete);
					}
					iframe.name = prefix + (+new Date());
					iframe.src = settings.href;
					
					if (!settings.scrolling) {
						iframe.scrolling = "no";
					}
					
					if (isIE) {
                        iframe.frameBorder = 0;
						iframe.allowTransparency = "true";
					}
					
					$(iframe).appendTo($loaded).one(event_purge, function () {
						iframe.src = "//about:blank";
					});
				} else {
					complete();
				}
				
				if (settings.transition === 'fade') {
					$box.fadeTo(speed, 1, removeFilter);
				} else {
                    removeFilter();
				}
				
				$window.bind('resize.' + prefix, function () {
					publicMethod.position(0);
				});
			});
		}
		
		if (settings.transition === 'fade') {
			$box.fadeTo(speed, 0, function () {
				setPosition(0);
			});
		} else {
			setPosition(speed);
		}
	};

	publicMethod.load = function (launched) {
		var href, setResize, prep = publicMethod.prep;
		
		active = true;
		
		photo = false;
		
		element = $related[index];
		
		if (!launched) {
			process($.extend(settings, $.data(element, colorbox)));
		}
		
		trigger(event_purge);
		
		trigger(event_load, settings.onLoad);
		
		settings.h = settings.height ?
				setSize(settings.height, 'y') - loadedHeight - interfaceHeight :
				settings.innerHeight && setSize(settings.innerHeight, 'y');
		
		settings.w = settings.width ?
				setSize(settings.width, 'x') - loadedWidth - interfaceWidth :
				settings.innerWidth && setSize(settings.innerWidth, 'x');
		
		// Sets the minimum dimensions for use in image scaling
		settings.mw = settings.w;
		settings.mh = settings.h;
		
		// Re-evaluate the minimum width and height based on maxWidth and maxHeight values.
		// If the width or height exceed the maxWidth or maxHeight, use the maximum values instead.
		if (settings.maxWidth) {
			settings.mw = setSize(settings.maxWidth, 'x') - loadedWidth - interfaceWidth;
			settings.mw = settings.w && settings.w < settings.mw ? settings.w : settings.mw;
		}
		if (settings.maxHeight) {
			settings.mh = setSize(settings.maxHeight, 'y') - loadedHeight - interfaceHeight;
			settings.mh = settings.h && settings.h < settings.mh ? settings.h : settings.mh;
		}
		
		href = settings.href;
		
        loadingTimer = setTimeout(function () {
            $loadingOverlay.show();
        }, 100);
        
		if (settings.inline) {
			// Inserts an empty placeholder where inline content is being pulled from.
			// An event is bound to put inline content back when ColorBox closes or loads new content.
			$div().hide().insertBefore($(href)[0]).one(event_purge, function () {
				$(this).replaceWith($loaded.children());
			});
			prep($(href));
		} else if (settings.iframe) {
			// IFrame element won't be added to the DOM until it is ready to be displayed,
			// to avoid problems with DOM-ready JS that might be trying to run in that iframe.
			prep(" ");
		} else if (settings.html) {
			prep(settings.html);
		} else if (isImage(href)) {
			$(photo = new Image())
			.addClass(prefix + 'Photo')
			.error(function () {
				settings.title = false;
				prep($div('Error').text('This image could not be loaded'));
			})
			.load(function () {
				var percent;
				photo.onload = null; //stops animated gifs from firing the onload repeatedly.
				
				if (settings.scalePhotos) {
					setResize = function () {
						photo.height -= photo.height * percent;
						photo.width -= photo.width * percent;	
					};
					if (settings.mw && photo.width > settings.mw) {
						percent = (photo.width - settings.mw) / photo.width;
						setResize();
					}
					if (settings.mh && photo.height > settings.mh) {
						percent = (photo.height - settings.mh) / photo.height;
						setResize();
					}
				}
				
				if (settings.h) {
					photo.style.marginTop = Math.max(settings.h - photo.height, 0) / 2 + 'px';
				}
				
				if ($related[1] && (index < $related.length - 1 || settings.loop)) {
					photo.style.cursor = 'pointer';
					photo.onclick = function () {
                        publicMethod.next();
                    };
				}
				
				if (isIE) {
					photo.style.msInterpolationMode = 'bicubic';
				}
				
				setTimeout(function () { // A pause because Chrome will sometimes report a 0 by 0 size otherwise.
					prep(photo);
				}, 1);
			});
			
			setTimeout(function () { // A pause because Opera 10.6+ will sometimes not run the onload function otherwise.
				photo.src = href;
			}, 1);
		} else if (href) {
			$loadingBay.load(href, settings.data, function (data, status, xhr) {
				prep(status === 'error' ? $div('Error').text('Request unsuccessful: ' + xhr.statusText) : $(this).contents());
			});
		}
	};
        
	// Navigates to the next page/image in a set.
	publicMethod.next = function () {
		if (!active && $related[1] && (index < $related.length - 1 || settings.loop)) {
			index = index < $related.length - 1 ? index + 1 : 0;
			publicMethod.load();
		}
	};
	
	publicMethod.prev = function () {
		if (!active && $related[1] && (index || settings.loop)) {
			index = index ? index - 1 : $related.length - 1;
			publicMethod.load();
		}
	};

	// Note: to use this within an iframe use the following format: parent.$.fn.colorbox.close();
	publicMethod.close = function () {
		if (open && !closing) {
			
			closing = true;
			
			open = false;
			
			trigger(event_cleanup, settings.onCleanup);
			
			$window.unbind('.' + prefix + ' .' + event_ie6);
			
			$overlay.fadeTo(200, 0);
			
			$box.stop().fadeTo(300, 0, function () {
                 
				$box.add($overlay).css({'opacity': 1, cursor: 'auto'}).hide();
				
				trigger(event_purge);
				
				$loaded.remove();
				
				setTimeout(function () {
					closing = false;
					trigger(event_closed, settings.onClosed);
				}, 1);
			});
		}
	};

	// A method for fetching the current element ColorBox is referencing.
	// returns a jQuery object.
	publicMethod.element = function () {
		return $(element);
	};

	publicMethod.settings = defaults;
    
	// Bind the live event before DOM-ready for maximum performance in IE6 & 7.
    handler = function (e) {
        // checks to see if it was a non-left mouse-click and for clicks modified with ctrl, shift, or alt.
        if (!((e.button !== 0 && typeof e.button !== 'undefined') || e.ctrlKey || e.shiftKey || e.altKey)) {
            e.preventDefault();
            launch(this);
        }
    };
    
    if ($.fn.delegate) {
        $(document).delegate('.' + boxElement, 'click', handler);
    } else {
        $('.' + boxElement).live('click', handler);
    }
    
	// Initializes ColorBox when the DOM has loaded
	$(publicMethod.init);

}(jQuery, document, this));

/* jquery-ui-1.8.13.custom.min.js */
/*!
 * jQuery UI 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function(c,j){function k(a,b){var d=a.nodeName.toLowerCase();if("area"===d){b=a.parentNode;d=b.name;if(!a.href||!d||b.nodeName.toLowerCase()!=="map")return false;a=c("img[usemap=#"+d+"]")[0];return!!a&&l(a)}return(/input|select|textarea|button|object/.test(d)?!a.disabled:"a"==d?a.href||b:b)&&l(a)}function l(a){return!c(a).parents().andSelf().filter(function(){return c.curCSS(this,"visibility")==="hidden"||c.expr.filters.hidden(this)}).length}c.ui=c.ui||{};if(!c.ui.version){c.extend(c.ui,{version:"1.8.13",
keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}});c.fn.extend({_focus:c.fn.focus,focus:function(a,b){return typeof a==="number"?this.each(function(){var d=this;setTimeout(function(){c(d).focus();
b&&b.call(d)},a)}):this._focus.apply(this,arguments)},scrollParent:function(){var a;a=c.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(c.curCSS(this,"position",1))&&/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,
"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0);return/fixed/.test(this.css("position"))||!a.length?c(document):a},zIndex:function(a){if(a!==j)return this.css("zIndex",a);if(this.length){a=c(this[0]);for(var b;a.length&&a[0]!==document;){b=a.css("position");if(b==="absolute"||b==="relative"||b==="fixed"){b=parseInt(a.css("zIndex"),10);if(!isNaN(b)&&b!==0)return b}a=a.parent()}}return 0},disableSelection:function(){return this.bind((c.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",
function(a){a.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}});c.each(["Width","Height"],function(a,b){function d(f,g,m,n){c.each(e,function(){g-=parseFloat(c.curCSS(f,"padding"+this,true))||0;if(m)g-=parseFloat(c.curCSS(f,"border"+this+"Width",true))||0;if(n)g-=parseFloat(c.curCSS(f,"margin"+this,true))||0});return g}var e=b==="Width"?["Left","Right"]:["Top","Bottom"],h=b.toLowerCase(),i={innerWidth:c.fn.innerWidth,innerHeight:c.fn.innerHeight,outerWidth:c.fn.outerWidth,
outerHeight:c.fn.outerHeight};c.fn["inner"+b]=function(f){if(f===j)return i["inner"+b].call(this);return this.each(function(){c(this).css(h,d(this,f)+"px")})};c.fn["outer"+b]=function(f,g){if(typeof f!=="number")return i["outer"+b].call(this,f);return this.each(function(){c(this).css(h,d(this,f,true,g)+"px")})}});c.extend(c.expr[":"],{data:function(a,b,d){return!!c.data(a,d[3])},focusable:function(a){return k(a,!isNaN(c.attr(a,"tabindex")))},tabbable:function(a){var b=c.attr(a,"tabindex"),d=isNaN(b);
return(d||b>=0)&&k(a,!d)}});c(function(){var a=document.body,b=a.appendChild(b=document.createElement("div"));c.extend(b.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0});c.support.minHeight=b.offsetHeight===100;c.support.selectstart="onselectstart"in b;a.removeChild(b).style.display="none"});c.extend(c.ui,{plugin:{add:function(a,b,d){a=c.ui[a].prototype;for(var e in d){a.plugins[e]=a.plugins[e]||[];a.plugins[e].push([b,d[e]])}},call:function(a,b,d){if((b=a.plugins[b])&&a.element[0].parentNode)for(var e=
0;e<b.length;e++)a.options[b[e][0]]&&b[e][1].apply(a.element,d)}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b)},hasScroll:function(a,b){if(c(a).css("overflow")==="hidden")return false;b=b&&b==="left"?"scrollLeft":"scrollTop";var d=false;if(a[b]>0)return true;a[b]=1;d=a[b]>0;a[b]=0;return d},isOverAxis:function(a,b,d){return a>b&&a<b+d},isOver:function(a,b,d,e,h,i){return c.ui.isOverAxis(a,d,h)&&c.ui.isOverAxis(b,e,i)}})}})(jQuery);
;/*!
 * jQuery UI Widget 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function(b,j){if(b.cleanData){var k=b.cleanData;b.cleanData=function(a){for(var c=0,d;(d=a[c])!=null;c++)b(d).triggerHandler("remove");k(a)}}else{var l=b.fn.remove;b.fn.remove=function(a,c){return this.each(function(){if(!c)if(!a||b.filter(a,[this]).length)b("*",this).add([this]).each(function(){b(this).triggerHandler("remove")});return l.call(b(this),a,c)})}}b.widget=function(a,c,d){var e=a.split(".")[0],f;a=a.split(".")[1];f=e+"-"+a;if(!d){d=c;c=b.Widget}b.expr[":"][f]=function(h){return!!b.data(h,
a)};b[e]=b[e]||{};b[e][a]=function(h,g){arguments.length&&this._createWidget(h,g)};c=new c;c.options=b.extend(true,{},c.options);b[e][a].prototype=b.extend(true,c,{namespace:e,widgetName:a,widgetEventPrefix:b[e][a].prototype.widgetEventPrefix||a,widgetBaseClass:f},d);b.widget.bridge(a,b[e][a])};b.widget.bridge=function(a,c){b.fn[a]=function(d){var e=typeof d==="string",f=Array.prototype.slice.call(arguments,1),h=this;d=!e&&f.length?b.extend.apply(null,[true,d].concat(f)):d;if(e&&d.charAt(0)==="_")return h;
e?this.each(function(){var g=b.data(this,a),i=g&&b.isFunction(g[d])?g[d].apply(g,f):g;if(i!==g&&i!==j){h=i;return false}}):this.each(function(){var g=b.data(this,a);g?g.option(d||{})._init():b.data(this,a,new c(d,this))});return h}};b.Widget=function(a,c){arguments.length&&this._createWidget(a,c)};b.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(a,c){b.data(c,this.widgetName,this);this.element=b(c);this.options=b.extend(true,{},this.options,
this._getCreateOptions(),a);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()});this._create();this._trigger("create");this._init()},_getCreateOptions:function(){return b.metadata&&b.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled")},
widget:function(){return this.element},option:function(a,c){var d=a;if(arguments.length===0)return b.extend({},this.options);if(typeof a==="string"){if(c===j)return this.options[a];d={};d[a]=c}this._setOptions(d);return this},_setOptions:function(a){var c=this;b.each(a,function(d,e){c._setOption(d,e)});return this},_setOption:function(a,c){this.options[a]=c;if(a==="disabled")this.widget()[c?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",c);return this},
enable:function(){return this._setOption("disabled",false)},disable:function(){return this._setOption("disabled",true)},_trigger:function(a,c,d){var e=this.options[a];c=b.Event(c);c.type=(a===this.widgetEventPrefix?a:this.widgetEventPrefix+a).toLowerCase();d=d||{};if(c.originalEvent){a=b.event.props.length;for(var f;a;){f=b.event.props[--a];c[f]=c.originalEvent[f]}}this.element.trigger(c,d);return!(b.isFunction(e)&&e.call(this.element[0],c,d)===false||c.isDefaultPrevented())}}})(jQuery);
;/*!
 * jQuery UI Mouse 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function(b){var d=false;b(document).mousedown(function(){d=false});b.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var a=this;this.element.bind("mousedown."+this.widgetName,function(c){return a._mouseDown(c)}).bind("click."+this.widgetName,function(c){if(true===b.data(c.target,a.widgetName+".preventClickEvent")){b.removeData(c.target,a.widgetName+".preventClickEvent");c.stopImmediatePropagation();return false}});this.started=false},_mouseDestroy:function(){this.element.unbind("."+
this.widgetName)},_mouseDown:function(a){if(!d){this._mouseStarted&&this._mouseUp(a);this._mouseDownEvent=a;var c=this,f=a.which==1,g=typeof this.options.cancel=="string"?b(a.target).parents().add(a.target).filter(this.options.cancel).length:false;if(!f||g||!this._mouseCapture(a))return true;this.mouseDelayMet=!this.options.delay;if(!this.mouseDelayMet)this._mouseDelayTimer=setTimeout(function(){c.mouseDelayMet=true},this.options.delay);if(this._mouseDistanceMet(a)&&this._mouseDelayMet(a)){this._mouseStarted=
this._mouseStart(a)!==false;if(!this._mouseStarted){a.preventDefault();return true}}true===b.data(a.target,this.widgetName+".preventClickEvent")&&b.removeData(a.target,this.widgetName+".preventClickEvent");this._mouseMoveDelegate=function(e){return c._mouseMove(e)};this._mouseUpDelegate=function(e){return c._mouseUp(e)};b(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate);a.preventDefault();return d=true}},_mouseMove:function(a){if(b.browser.msie&&
!(document.documentMode>=9)&&!a.button)return this._mouseUp(a);if(this._mouseStarted){this._mouseDrag(a);return a.preventDefault()}if(this._mouseDistanceMet(a)&&this._mouseDelayMet(a))(this._mouseStarted=this._mouseStart(this._mouseDownEvent,a)!==false)?this._mouseDrag(a):this._mouseUp(a);return!this._mouseStarted},_mouseUp:function(a){b(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate);if(this._mouseStarted){this._mouseStarted=
false;a.target==this._mouseDownEvent.target&&b.data(a.target,this.widgetName+".preventClickEvent",true);this._mouseStop(a)}return false},_mouseDistanceMet:function(a){return Math.max(Math.abs(this._mouseDownEvent.pageX-a.pageX),Math.abs(this._mouseDownEvent.pageY-a.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return true}})})(jQuery);
;/*
 * jQuery UI Slider 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Slider
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(d){d.widget("ui.slider",d.ui.mouse,{widgetEventPrefix:"slide",options:{animate:false,distance:0,max:100,min:0,orientation:"horizontal",range:false,step:1,value:0,values:null},_create:function(){var b=this,a=this.options,c=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),f=a.values&&a.values.length||1,e=[];this._mouseSliding=this._keySliding=false;this._animateOff=true;this._handleIndex=null;this._detectOrientation();this._mouseInit();this.element.addClass("ui-slider ui-slider-"+
this.orientation+" ui-widget ui-widget-content ui-corner-all"+(a.disabled?" ui-slider-disabled ui-disabled":""));this.range=d([]);if(a.range){if(a.range===true){if(!a.values)a.values=[this._valueMin(),this._valueMin()];if(a.values.length&&a.values.length!==2)a.values=[a.values[0],a.values[0]]}this.range=d("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header"+(a.range==="min"||a.range==="max"?" ui-slider-range-"+a.range:""))}for(var j=c.length;j<f;j+=1)e.push("<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>");
this.handles=c.add(d(e.join("")).appendTo(b.element));this.handle=this.handles.eq(0);this.handles.add(this.range).filter("a").click(function(g){g.preventDefault()}).hover(function(){a.disabled||d(this).addClass("ui-state-hover")},function(){d(this).removeClass("ui-state-hover")}).focus(function(){if(a.disabled)d(this).blur();else{d(".ui-slider .ui-state-focus").removeClass("ui-state-focus");d(this).addClass("ui-state-focus")}}).blur(function(){d(this).removeClass("ui-state-focus")});this.handles.each(function(g){d(this).data("index.ui-slider-handle",
g)});this.handles.keydown(function(g){var k=true,l=d(this).data("index.ui-slider-handle"),i,h,m;if(!b.options.disabled){switch(g.keyCode){case d.ui.keyCode.HOME:case d.ui.keyCode.END:case d.ui.keyCode.PAGE_UP:case d.ui.keyCode.PAGE_DOWN:case d.ui.keyCode.UP:case d.ui.keyCode.RIGHT:case d.ui.keyCode.DOWN:case d.ui.keyCode.LEFT:k=false;if(!b._keySliding){b._keySliding=true;d(this).addClass("ui-state-active");i=b._start(g,l);if(i===false)return}break}m=b.options.step;i=b.options.values&&b.options.values.length?
(h=b.values(l)):(h=b.value());switch(g.keyCode){case d.ui.keyCode.HOME:h=b._valueMin();break;case d.ui.keyCode.END:h=b._valueMax();break;case d.ui.keyCode.PAGE_UP:h=b._trimAlignValue(i+(b._valueMax()-b._valueMin())/5);break;case d.ui.keyCode.PAGE_DOWN:h=b._trimAlignValue(i-(b._valueMax()-b._valueMin())/5);break;case d.ui.keyCode.UP:case d.ui.keyCode.RIGHT:if(i===b._valueMax())return;h=b._trimAlignValue(i+m);break;case d.ui.keyCode.DOWN:case d.ui.keyCode.LEFT:if(i===b._valueMin())return;h=b._trimAlignValue(i-
m);break}b._slide(g,l,h);return k}}).keyup(function(g){var k=d(this).data("index.ui-slider-handle");if(b._keySliding){b._keySliding=false;b._stop(g,k);b._change(g,k);d(this).removeClass("ui-state-active")}});this._refreshValue();this._animateOff=false},destroy:function(){this.handles.remove();this.range.remove();this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider");this._mouseDestroy();
return this},_mouseCapture:function(b){var a=this.options,c,f,e,j,g;if(a.disabled)return false;this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()};this.elementOffset=this.element.offset();c=this._normValueFromMouse({x:b.pageX,y:b.pageY});f=this._valueMax()-this._valueMin()+1;j=this;this.handles.each(function(k){var l=Math.abs(c-j.values(k));if(f>l){f=l;e=d(this);g=k}});if(a.range===true&&this.values(1)===a.min){g+=1;e=d(this.handles[g])}if(this._start(b,g)===false)return false;
this._mouseSliding=true;j._handleIndex=g;e.addClass("ui-state-active").focus();a=e.offset();this._clickOffset=!d(b.target).parents().andSelf().is(".ui-slider-handle")?{left:0,top:0}:{left:b.pageX-a.left-e.width()/2,top:b.pageY-a.top-e.height()/2-(parseInt(e.css("borderTopWidth"),10)||0)-(parseInt(e.css("borderBottomWidth"),10)||0)+(parseInt(e.css("marginTop"),10)||0)};this.handles.hasClass("ui-state-hover")||this._slide(b,g,c);return this._animateOff=true},_mouseStart:function(){return true},_mouseDrag:function(b){var a=
this._normValueFromMouse({x:b.pageX,y:b.pageY});this._slide(b,this._handleIndex,a);return false},_mouseStop:function(b){this.handles.removeClass("ui-state-active");this._mouseSliding=false;this._stop(b,this._handleIndex);this._change(b,this._handleIndex);this._clickOffset=this._handleIndex=null;return this._animateOff=false},_detectOrientation:function(){this.orientation=this.options.orientation==="vertical"?"vertical":"horizontal"},_normValueFromMouse:function(b){var a;if(this.orientation==="horizontal"){a=
this.elementSize.width;b=b.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)}else{a=this.elementSize.height;b=b.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)}a=b/a;if(a>1)a=1;if(a<0)a=0;if(this.orientation==="vertical")a=1-a;b=this._valueMax()-this._valueMin();return this._trimAlignValue(this._valueMin()+a*b)},_start:function(b,a){var c={handle:this.handles[a],value:this.value()};if(this.options.values&&this.options.values.length){c.value=this.values(a);
c.values=this.values()}return this._trigger("start",b,c)},_slide:function(b,a,c){var f;if(this.options.values&&this.options.values.length){f=this.values(a?0:1);if(this.options.values.length===2&&this.options.range===true&&(a===0&&c>f||a===1&&c<f))c=f;if(c!==this.values(a)){f=this.values();f[a]=c;b=this._trigger("slide",b,{handle:this.handles[a],value:c,values:f});this.values(a?0:1);b!==false&&this.values(a,c,true)}}else if(c!==this.value()){b=this._trigger("slide",b,{handle:this.handles[a],value:c});
b!==false&&this.value(c)}},_stop:function(b,a){var c={handle:this.handles[a],value:this.value()};if(this.options.values&&this.options.values.length){c.value=this.values(a);c.values=this.values()}this._trigger("stop",b,c)},_change:function(b,a){if(!this._keySliding&&!this._mouseSliding){var c={handle:this.handles[a],value:this.value()};if(this.options.values&&this.options.values.length){c.value=this.values(a);c.values=this.values()}this._trigger("change",b,c)}},value:function(b){if(arguments.length){this.options.value=
this._trimAlignValue(b);this._refreshValue();this._change(null,0)}else return this._value()},values:function(b,a){var c,f,e;if(arguments.length>1){this.options.values[b]=this._trimAlignValue(a);this._refreshValue();this._change(null,b)}else if(arguments.length)if(d.isArray(arguments[0])){c=this.options.values;f=arguments[0];for(e=0;e<c.length;e+=1){c[e]=this._trimAlignValue(f[e]);this._change(null,e)}this._refreshValue()}else return this.options.values&&this.options.values.length?this._values(b):
this.value();else return this._values()},_setOption:function(b,a){var c,f=0;if(d.isArray(this.options.values))f=this.options.values.length;d.Widget.prototype._setOption.apply(this,arguments);switch(b){case "disabled":if(a){this.handles.filter(".ui-state-focus").blur();this.handles.removeClass("ui-state-hover");this.handles.attr("disabled","disabled");this.element.addClass("ui-disabled")}else{this.handles.removeAttr("disabled");this.element.removeClass("ui-disabled")}break;case "orientation":this._detectOrientation();
this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation);this._refreshValue();break;case "value":this._animateOff=true;this._refreshValue();this._change(null,0);this._animateOff=false;break;case "values":this._animateOff=true;this._refreshValue();for(c=0;c<f;c+=1)this._change(null,c);this._animateOff=false;break}},_value:function(){var b=this.options.value;return b=this._trimAlignValue(b)},_values:function(b){var a,c;if(arguments.length){a=this.options.values[b];
return a=this._trimAlignValue(a)}else{a=this.options.values.slice();for(c=0;c<a.length;c+=1)a[c]=this._trimAlignValue(a[c]);return a}},_trimAlignValue:function(b){if(b<=this._valueMin())return this._valueMin();if(b>=this._valueMax())return this._valueMax();var a=this.options.step>0?this.options.step:1,c=(b-this._valueMin())%a;alignValue=b-c;if(Math.abs(c)*2>=a)alignValue+=c>0?a:-a;return parseFloat(alignValue.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},
_refreshValue:function(){var b=this.options.range,a=this.options,c=this,f=!this._animateOff?a.animate:false,e,j={},g,k,l,i;if(this.options.values&&this.options.values.length)this.handles.each(function(h){e=(c.values(h)-c._valueMin())/(c._valueMax()-c._valueMin())*100;j[c.orientation==="horizontal"?"left":"bottom"]=e+"%";d(this).stop(1,1)[f?"animate":"css"](j,a.animate);if(c.options.range===true)if(c.orientation==="horizontal"){if(h===0)c.range.stop(1,1)[f?"animate":"css"]({left:e+"%"},a.animate);
if(h===1)c.range[f?"animate":"css"]({width:e-g+"%"},{queue:false,duration:a.animate})}else{if(h===0)c.range.stop(1,1)[f?"animate":"css"]({bottom:e+"%"},a.animate);if(h===1)c.range[f?"animate":"css"]({height:e-g+"%"},{queue:false,duration:a.animate})}g=e});else{k=this.value();l=this._valueMin();i=this._valueMax();e=i!==l?(k-l)/(i-l)*100:0;j[c.orientation==="horizontal"?"left":"bottom"]=e+"%";this.handle.stop(1,1)[f?"animate":"css"](j,a.animate);if(b==="min"&&this.orientation==="horizontal")this.range.stop(1,
1)[f?"animate":"css"]({width:e+"%"},a.animate);if(b==="max"&&this.orientation==="horizontal")this.range[f?"animate":"css"]({width:100-e+"%"},{queue:false,duration:a.animate});if(b==="min"&&this.orientation==="vertical")this.range.stop(1,1)[f?"animate":"css"]({height:e+"%"},a.animate);if(b==="max"&&this.orientation==="vertical")this.range[f?"animate":"css"]({height:100-e+"%"},{queue:false,duration:a.animate})}}});d.extend(d.ui.slider,{version:"1.8.13"})})(jQuery);
;

/* jquery.pubsub.js */
/*	

	jQuery pub/sub plugin by Peter Higgins (dante@dojotoolkit.org)

	Loosely based on Dojo publish/subscribe API, limited in scope. Rewritten blindly.

	Original is (c) Dojo Foundation 2004-2010. Released under either AFL or new BSD, see:
	http://dojofoundation.org/license for more information.

*/	

;(function(d){

	// the topic/subscription hash
	var cache = {};

	d.publish = function(/* String */topic, /* Array? */args){
		// summary: 
		//		Publish some data on a named topic.
		// topic: String
		//		The channel to publish on
		// args: Array?
		//		The data to publish. Each array item is converted into an ordered
		//		arguments on the subscribed functions. 
		//
		// example:
		//		Publish stuff on '/some/topic'. Anything subscribed will be called
		//		with a function signature like: function(a,b,c){ ... }
		//
		//	|		$.publish("/some/topic", ["a","b","c"]);
		cache[topic] && d.each(cache[topic], function(){
			this.apply(d, args || []);
		});
	};

	d.subscribe = function(/* String */topic, /* Function */callback){
		// summary:
		//		Register a callback on a named topic.
		// topic: String
		//		The channel to subscribe to
		// callback: Function
		//		The handler event. Anytime something is $.publish'ed on a 
		//		subscribed channel, the callback will be called with the
		//		published array as ordered arguments.
		//
		// returns: Array
		//		A handle which can be used to unsubscribe this particular subscription.
		//	
		// example:
		//	|	$.subscribe("/some/topic", function(a, b, c){ /* handle data */ });
		//
		if(!cache[topic]){
			cache[topic] = [];
		}
		cache[topic].push(callback);
		return [topic, callback]; // Array
	};

	d.unsubscribe = function(/* Array */handle){
		// summary:
		//		Disconnect a subscribed function for a topic.
		// handle: Array
		//		The return value from a $.subscribe call.
		// example:
		//	|	var handle = $.subscribe("/something", function(){});
		//	|	$.unsubscribe(handle);
		
		var t = handle[0];
		cache[t] && d.each(cache[t], function(idx){
			if(this == handle[1]){
				cache[t].splice(idx, 1);
			}
		});
	};

})(jQuery);

/* jquery.bgpos.js */
/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 */
(function($) {
    // backgroundPosition[X,Y] get hooks
    var $div = $('<div style="background-position: 3px 5px">');
    $.support.backgroundPosition   = $div.css('backgroundPosition')  === "3px 5px" ? true : false;
    $.support.backgroundPositionXY = $div.css('backgroundPositionX') === "3px" ? true : false;
    $div = null;

    var xy = ["X","Y"];

    // helper function to parse out the X and Y values from backgroundPosition
    function parseBgPos(bgPos) {
        var parts  = bgPos.split(/\s/),
            values = {
                "X": parts[0],
                "Y": parts[1]
            };
        return values;
    }

    if (!$.support.backgroundPosition && $.support.backgroundPositionXY) {
        $.cssHooks.backgroundPosition = {
            get: function( elem, computed, extra ) {
                return $.map(xy, function( l, i ) {
                    return $.css(elem, "backgroundPosition" + l);
                }).join(" ");
            },
            set: function( elem, value ) {
                $.each(xy, function( i, l ) {
                    var values = parseBgPos(value);
                    elem.style[ "backgroundPosition" + l ] = values[ l ];
                });
            }
        };
    }

    if ($.support.backgroundPosition && !$.support.backgroundPositionXY) {
        $.each(xy, function( i, l ) {
            $.cssHooks[ "backgroundPosition" + l ] = {
                get: function( elem, computed, extra ) {
                    var values = parseBgPos( $.css(elem, "backgroundPosition") );
                    return values[ l ];
                },
                set: function( elem, value ) {
                    var values = parseBgPos( $.css(elem, "backgroundPosition") ),
                        isX = l === "X";
                    elem.style.backgroundPosition = (isX ? value : values[ "X" ]) + " " + 
                                                    (isX ? values[ "Y" ] : value);
                }
            };
            $.fx.step[ "backgroundPosition" + l ] = function( fx ) {
                $.cssHooks[ "backgroundPosition" + l ].set( fx.elem, fx.now + fx.unit );
            };
        });
    }
})(jQuery);

/* cufon-yui.js */
/*
 * Copyright (c) 2009 Simo Kinnunen.
 * Licensed under the MIT license.
 *
 * @version 1.09i
 */
var Cufon=(function(){var m=function(){return m.replace.apply(null,arguments)};var x=m.DOM={ready:(function(){var C=false,E={loaded:1,complete:1};var B=[],D=function(){if(C){return}C=true;for(var F;F=B.shift();F()){}};if(document.addEventListener){document.addEventListener("DOMContentLoaded",D,false);window.addEventListener("pageshow",D,false)}if(!window.opera&&document.readyState){(function(){E[document.readyState]?D():setTimeout(arguments.callee,10)})()}if(document.readyState&&document.createStyleSheet){(function(){try{document.body.doScroll("left");D()}catch(F){setTimeout(arguments.callee,1)}})()}q(window,"load",D);return function(F){if(!arguments.length){D()}else{C?F():B.push(F)}}})(),root:function(){return document.documentElement||document.body}};var n=m.CSS={Size:function(C,B){this.value=parseFloat(C);this.unit=String(C).match(/[a-z%]*$/)[0]||"px";this.convert=function(D){return D/B*this.value};this.convertFrom=function(D){return D/this.value*B};this.toString=function(){return this.value+this.unit}},addClass:function(C,B){var D=C.className;C.className=D+(D&&" ")+B;return C},color:j(function(C){var B={};B.color=C.replace(/^rgba\((.*?),\s*([\d.]+)\)/,function(E,D,F){B.opacity=parseFloat(F);return"rgb("+D+")"});return B}),fontStretch:j(function(B){if(typeof B=="number"){return B}if(/%$/.test(B)){return parseFloat(B)/100}return{"ultra-condensed":0.5,"extra-condensed":0.625,condensed:0.75,"semi-condensed":0.875,"semi-expanded":1.125,expanded:1.25,"extra-expanded":1.5,"ultra-expanded":2}[B]||1}),getStyle:function(C){var B=document.defaultView;if(B&&B.getComputedStyle){return new a(B.getComputedStyle(C,null))}if(C.currentStyle){return new a(C.currentStyle)}return new a(C.style)},gradient:j(function(F){var G={id:F,type:F.match(/^-([a-z]+)-gradient\(/)[1],stops:[]},C=F.substr(F.indexOf("(")).match(/([\d.]+=)?(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)/ig);for(var E=0,B=C.length,D;E<B;++E){D=C[E].split("=",2).reverse();G.stops.push([D[1]||E/(B-1),D[0]])}return G}),quotedList:j(function(E){var D=[],C=/\s*((["'])([\s\S]*?[^\\])\2|[^,]+)\s*/g,B;while(B=C.exec(E)){D.push(B[3]||B[1])}return D}),recognizesMedia:j(function(G){var E=document.createElement("style"),D,C,B;E.type="text/css";E.media=G;try{E.appendChild(document.createTextNode("/**/"))}catch(F){}C=g("head")[0];C.insertBefore(E,C.firstChild);D=(E.sheet||E.styleSheet);B=D&&!D.disabled;C.removeChild(E);return B}),removeClass:function(D,C){var B=RegExp("(?:^|\\s+)"+C+"(?=\\s|$)","g");D.className=D.className.replace(B,"");return D},supports:function(D,C){var B=document.createElement("span").style;if(B[D]===undefined){return false}B[D]=C;return B[D]===C},textAlign:function(E,D,B,C){if(D.get("textAlign")=="right"){if(B>0){E=" "+E}}else{if(B<C-1){E+=" "}}return E},textShadow:j(function(F){if(F=="none"){return null}var E=[],G={},B,C=0;var D=/(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/ig;while(B=D.exec(F)){if(B[0]==","){E.push(G);G={};C=0}else{if(B[1]){G.color=B[1]}else{G[["offX","offY","blur"][C++]]=B[2]}}}E.push(G);return E}),textTransform:(function(){var B={uppercase:function(C){return C.toUpperCase()},lowercase:function(C){return C.toLowerCase()},capitalize:function(C){return C.replace(/\b./g,function(D){return D.toUpperCase()})}};return function(E,D){var C=B[D.get("textTransform")];return C?C(E):E}})(),whiteSpace:(function(){var D={inline:1,"inline-block":1,"run-in":1};var C=/^\s+/,B=/\s+$/;return function(H,F,G,E){if(E){if(E.nodeName.toLowerCase()=="br"){H=H.replace(C,"")}}if(D[F.get("display")]){return H}if(!G.previousSibling){H=H.replace(C,"")}if(!G.nextSibling){H=H.replace(B,"")}return H}})()};n.ready=(function(){var B=!n.recognizesMedia("all"),E=false;var D=[],H=function(){B=true;for(var K;K=D.shift();K()){}};var I=g("link"),J=g("style");function C(K){return K.disabled||G(K.sheet,K.media||"screen")}function G(M,P){if(!n.recognizesMedia(P||"all")){return true}if(!M||M.disabled){return false}try{var Q=M.cssRules,O;if(Q){search:for(var L=0,K=Q.length;O=Q[L],L<K;++L){switch(O.type){case 2:break;case 3:if(!G(O.styleSheet,O.media.mediaText)){return false}break;default:break search}}}}catch(N){}return true}function F(){if(document.createStyleSheet){return true}var L,K;for(K=0;L=I[K];++K){if(L.rel.toLowerCase()=="stylesheet"&&!C(L)){return false}}for(K=0;L=J[K];++K){if(!C(L)){return false}}return true}x.ready(function(){if(!E){E=n.getStyle(document.body).isUsable()}if(B||(E&&F())){H()}else{setTimeout(arguments.callee,10)}});return function(K){if(B){K()}else{D.push(K)}}})();function s(D){var C=this.face=D.face,B={"\u0020":1,"\u00a0":1,"\u3000":1};this.glyphs=D.glyphs;this.w=D.w;this.baseSize=parseInt(C["units-per-em"],10);this.family=C["font-family"].toLowerCase();this.weight=C["font-weight"];this.style=C["font-style"]||"normal";this.viewBox=(function(){var F=C.bbox.split(/\s+/);var E={minX:parseInt(F[0],10),minY:parseInt(F[1],10),maxX:parseInt(F[2],10),maxY:parseInt(F[3],10)};E.width=E.maxX-E.minX;E.height=E.maxY-E.minY;E.toString=function(){return[this.minX,this.minY,this.width,this.height].join(" ")};return E})();this.ascent=-parseInt(C.ascent,10);this.descent=-parseInt(C.descent,10);this.height=-this.ascent+this.descent;this.spacing=function(L,N,E){var O=this.glyphs,M,K,G,P=[],F=0,J=-1,I=-1,H;while(H=L[++J]){M=O[H]||this.missingGlyph;if(!M){continue}if(K){F-=G=K[H]||0;P[I]-=G}F+=P[++I]=~~(M.w||this.w)+N+(B[H]?E:0);K=M.k}P.total=F;return P}}function f(){var C={},B={oblique:"italic",italic:"oblique"};this.add=function(D){(C[D.style]||(C[D.style]={}))[D.weight]=D};this.get=function(H,I){var G=C[H]||C[B[H]]||C.normal||C.italic||C.oblique;if(!G){return null}I={normal:400,bold:700}[I]||parseInt(I,10);if(G[I]){return G[I]}var E={1:1,99:0}[I%100],K=[],F,D;if(E===undefined){E=I>400}if(I==500){I=400}for(var J in G){if(!k(G,J)){continue}J=parseInt(J,10);if(!F||J<F){F=J}if(!D||J>D){D=J}K.push(J)}if(I<F){I=F}if(I>D){I=D}K.sort(function(M,L){return(E?(M>=I&&L>=I)?M<L:M>L:(M<=I&&L<=I)?M>L:M<L)?-1:1});return G[K[0]]}}function r(){function D(F,G){if(F.contains){return F.contains(G)}return F.compareDocumentPosition(G)&16}function B(G){var F=G.relatedTarget;if(!F||D(this,F)){return}C(this,G.type=="mouseover")}function E(F){C(this,F.type=="mouseenter")}function C(F,G){setTimeout(function(){var H=d.get(F).options;m.replace(F,G?h(H,H.hover):H,true)},10)}this.attach=function(F){if(F.onmouseenter===undefined){q(F,"mouseover",B);q(F,"mouseout",B)}else{q(F,"mouseenter",E);q(F,"mouseleave",E)}}}function u(){var C=[],D={};function B(H){var E=[],G;for(var F=0;G=H[F];++F){E[F]=C[D[G]]}return E}this.add=function(F,E){D[F]=C.push(E)-1};this.repeat=function(){var E=arguments.length?B(arguments):C,F;for(var G=0;F=E[G++];){m.replace(F[0],F[1],true)}}}function A(){var D={},B=0;function C(E){return E.cufid||(E.cufid=++B)}this.get=function(E){var F=C(E);return D[F]||(D[F]={})}}function a(B){var D={},C={};this.extend=function(E){for(var F in E){if(k(E,F)){D[F]=E[F]}}return this};this.get=function(E){return D[E]!=undefined?D[E]:B[E]};this.getSize=function(F,E){return C[F]||(C[F]=new n.Size(this.get(F),E))};this.isUsable=function(){return !!B}}function q(C,B,D){if(C.addEventListener){C.addEventListener(B,D,false)}else{if(C.attachEvent){C.attachEvent("on"+B,function(){return D.call(C,window.event)})}}}function v(C,B){var D=d.get(C);if(D.options){return C}if(B.hover&&B.hoverables[C.nodeName.toLowerCase()]){b.attach(C)}D.options=B;return C}function j(B){var C={};return function(D){if(!k(C,D)){C[D]=B.apply(null,arguments)}return C[D]}}function c(F,E){var B=n.quotedList(E.get("fontFamily").toLowerCase()),D;for(var C=0;D=B[C];++C){if(i[D]){return i[D].get(E.get("fontStyle"),E.get("fontWeight"))}}return null}function g(B){return document.getElementsByTagName(B)}function k(C,B){return C.hasOwnProperty(B)}function h(){var C={},B,F;for(var E=0,D=arguments.length;B=arguments[E],E<D;++E){for(F in B){if(k(B,F)){C[F]=B[F]}}}return C}function o(E,M,C,N,F,D){var K=document.createDocumentFragment(),H;if(M===""){return K}var L=N.separate;var I=M.split(p[L]),B=(L=="words");if(B&&t){if(/^\s/.test(M)){I.unshift("")}if(/\s$/.test(M)){I.push("")}}for(var J=0,G=I.length;J<G;++J){H=z[N.engine](E,B?n.textAlign(I[J],C,J,G):I[J],C,N,F,D,J<G-1);if(H){K.appendChild(H)}}return K}function l(D,M){var C=D.nodeName.toLowerCase();if(M.ignore[C]){return}var E=!M.textless[C];var B=n.getStyle(v(D,M)).extend(M);var F=c(D,B),G,K,I,H,L,J;if(!F){return}for(G=D.firstChild;G;G=I){K=G.nodeType;I=G.nextSibling;if(E&&K==3){if(H){H.appendData(G.data);D.removeChild(G)}else{H=G}if(I){continue}}if(H){D.replaceChild(o(F,n.whiteSpace(H.data,B,H,J),B,M,G,D),H);H=null}if(K==1){if(G.firstChild){if(G.nodeName.toLowerCase()=="cufon"){z[M.engine](F,null,B,M,G,D)}else{arguments.callee(G,M)}}J=G}}}var t=" ".split(/\s+/).length==0;var d=new A();var b=new r();var y=new u();var e=false;var z={},i={},w={autoDetect:false,engine:null,forceHitArea:false,hover:false,hoverables:{a:true},ignore:{applet:1,canvas:1,col:1,colgroup:1,head:1,iframe:1,map:1,optgroup:1,option:1,script:1,select:1,style:1,textarea:1,title:1,pre:1},printable:true,selector:(window.Sizzle||(window.jQuery&&function(B){return jQuery(B)})||(window.dojo&&dojo.query)||(window.Ext&&Ext.query)||(window.YAHOO&&YAHOO.util&&YAHOO.util.Selector&&YAHOO.util.Selector.query)||(window.$$&&function(B){return $$(B)})||(window.$&&function(B){return $(B)})||(document.querySelectorAll&&function(B){return document.querySelectorAll(B)})||g),separate:"words",textless:{dl:1,html:1,ol:1,table:1,tbody:1,thead:1,tfoot:1,tr:1,ul:1},textShadow:"none"};var p={words:/\s/.test("\u00a0")?/[^\S\u00a0]+/:/\s+/,characters:"",none:/^/};m.now=function(){x.ready();return m};m.refresh=function(){y.repeat.apply(y,arguments);return m};m.registerEngine=function(C,B){if(!B){return m}z[C]=B;return m.set("engine",C)};m.registerFont=function(D){if(!D){return m}var B=new s(D),C=B.family;if(!i[C]){i[C]=new f()}i[C].add(B);return m.set("fontFamily",'"'+C+'"')};m.replace=function(D,C,B){C=h(w,C);if(!C.engine){return m}if(!e){n.addClass(x.root(),"cufon-active cufon-loading");n.ready(function(){n.addClass(n.removeClass(x.root(),"cufon-loading"),"cufon-ready")});e=true}if(C.hover){C.forceHitArea=true}if(C.autoDetect){delete C.fontFamily}if(typeof C.textShadow=="string"){C.textShadow=n.textShadow(C.textShadow)}if(typeof C.color=="string"&&/^-/.test(C.color)){C.textGradient=n.gradient(C.color)}else{delete C.textGradient}if(!B){y.add(D,arguments)}if(D.nodeType||typeof D=="string"){D=[D]}n.ready(function(){for(var F=0,E=D.length;F<E;++F){var G=D[F];if(typeof G=="string"){m.replace(C.selector(G),C,true)}else{l(G,C)}}});return m};m.set=function(B,C){w[B]=C;return m};return m})();Cufon.registerEngine("vml",(function(){var e=document.namespaces;if(!e){return}e.add("cvml","urn:schemas-microsoft-com:vml");e=null;var b=document.createElement("cvml:shape");b.style.behavior="url(#default#VML)";if(!b.coordsize){return}b=null;var h=(document.documentMode||0)<8;document.write(('<style type="text/css">cufoncanvas{text-indent:0;}@media screen{cvml\\:shape,cvml\\:rect,cvml\\:fill,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute;}cufoncanvas{position:absolute;text-align:left;}cufon{display:inline-block;position:relative;vertical-align:'+(h?"middle":"text-bottom")+";}cufon cufontext{position:absolute;left:-10000in;font-size:1px;}a cufon{cursor:pointer}}@media print{cufon cufoncanvas{display:none;}}</style>").replace(/;/g,"!important;"));function c(i,j){return a(i,/(?:em|ex|%)$|^[a-z-]+$/i.test(j)?"1em":j)}function a(l,m){if(m==="0"){return 0}if(/px$/i.test(m)){return parseFloat(m)}var k=l.style.left,j=l.runtimeStyle.left;l.runtimeStyle.left=l.currentStyle.left;l.style.left=m.replace("%","em");var i=l.style.pixelLeft;l.style.left=k;l.runtimeStyle.left=j;return i}function f(l,k,j,n){var i="computed"+n,m=k[i];if(isNaN(m)){m=k.get(n);k[i]=m=(m=="normal")?0:~~j.convertFrom(a(l,m))}return m}var g={};function d(p){var q=p.id;if(!g[q]){var n=p.stops,o=document.createElement("cvml:fill"),i=[];o.type="gradient";o.angle=180;o.focus="0";o.method="sigma";o.color=n[0][1];for(var m=1,l=n.length-1;m<l;++m){i.push(n[m][0]*100+"% "+n[m][1])}o.colors=i.join(",");o.color2=n[l][1];g[q]=o}return g[q]}return function(ac,G,Y,C,K,ad,W){var n=(G===null);if(n){G=K.alt}var I=ac.viewBox;var p=Y.computedFontSize||(Y.computedFontSize=new Cufon.CSS.Size(c(ad,Y.get("fontSize"))+"px",ac.baseSize));var y,q;if(n){y=K;q=K.firstChild}else{y=document.createElement("cufon");y.className="cufon cufon-vml";y.alt=G;q=document.createElement("cufoncanvas");y.appendChild(q);if(C.printable){var Z=document.createElement("cufontext");Z.appendChild(document.createTextNode(G));y.appendChild(Z)}if(!W){y.appendChild(document.createElement("cvml:shape"))}}var ai=y.style;var R=q.style;var l=p.convert(I.height),af=Math.ceil(l);var V=af/l;var P=V*Cufon.CSS.fontStretch(Y.get("fontStretch"));var U=I.minX,T=I.minY;R.height=af;R.top=Math.round(p.convert(T-ac.ascent));R.left=Math.round(p.convert(U));ai.height=p.convert(ac.height)+"px";var F=Y.get("color");var ag=Cufon.CSS.textTransform(G,Y).split("");var L=ac.spacing(ag,f(ad,Y,p,"letterSpacing"),f(ad,Y,p,"wordSpacing"));if(!L.length){return null}var k=L.total;var x=-U+k+(I.width-L[L.length-1]);var ah=p.convert(x*P),X=Math.round(ah);var O=x+","+I.height,m;var J="r"+O+"ns";var u=C.textGradient&&d(C.textGradient);var o=ac.glyphs,S=0;var H=C.textShadow;var ab=-1,aa=0,w;while(w=ag[++ab]){var D=o[ag[ab]]||ac.missingGlyph,v;if(!D){continue}if(n){v=q.childNodes[aa];while(v.firstChild){v.removeChild(v.firstChild)}}else{v=document.createElement("cvml:shape");q.appendChild(v)}v.stroked="f";v.coordsize=O;v.coordorigin=m=(U-S)+","+T;v.path=(D.d?"m"+D.d+"xe":"")+"m"+m+J;v.fillcolor=F;if(u){v.appendChild(u.cloneNode(false))}var ae=v.style;ae.width=X;ae.height=af;if(H){var s=H[0],r=H[1];var B=Cufon.CSS.color(s.color),z;var N=document.createElement("cvml:shadow");N.on="t";N.color=B.color;N.offset=s.offX+","+s.offY;if(r){z=Cufon.CSS.color(r.color);N.type="double";N.color2=z.color;N.offset2=r.offX+","+r.offY}N.opacity=B.opacity||(z&&z.opacity)||1;v.appendChild(N)}S+=L[aa++]}var M=v.nextSibling,t,A;if(C.forceHitArea){if(!M){M=document.createElement("cvml:rect");M.stroked="f";M.className="cufon-vml-cover";t=document.createElement("cvml:fill");t.opacity=0;M.appendChild(t);q.appendChild(M)}A=M.style;A.width=X;A.height=af}else{if(M){q.removeChild(M)}}ai.width=Math.max(Math.ceil(p.convert(k*P)),0);if(h){var Q=Y.computedYAdjust;if(Q===undefined){var E=Y.get("lineHeight");if(E=="normal"){E="1em"}else{if(!isNaN(E)){E+="em"}}Y.computedYAdjust=Q=0.5*(a(ad,E)-parseFloat(ai.height))}if(Q){ai.marginTop=Math.ceil(Q)+"px";ai.marginBottom=Q+"px"}}return y}})());Cufon.registerEngine("canvas",(function(){var b=document.createElement("canvas");if(!b||!b.getContext||!b.getContext.apply){return}b=null;var a=Cufon.CSS.supports("display","inline-block");var e=!a&&(document.compatMode=="BackCompat"||/frameset|transitional/i.test(document.doctype.publicId));var f=document.createElement("style");f.type="text/css";f.appendChild(document.createTextNode(("cufon{text-indent:0;}@media screen,projection{cufon{display:inline;display:inline-block;position:relative;vertical-align:middle;"+(e?"":"font-size:1px;line-height:1px;")+"}cufon cufontext{display:-moz-inline-box;display:inline-block;width:0;height:0;overflow:hidden;text-indent:-10000in;}"+(a?"cufon canvas{position:relative;}":"cufon canvas{position:absolute;}")+"}@media print{cufon{padding:0;}cufon canvas{display:none;}}").replace(/;/g,"!important;")));document.getElementsByTagName("head")[0].appendChild(f);function d(p,h){var n=0,m=0;var g=[],o=/([mrvxe])([^a-z]*)/g,k;generate:for(var j=0;k=o.exec(p);++j){var l=k[2].split(",");switch(k[1]){case"v":g[j]={m:"bezierCurveTo",a:[n+~~l[0],m+~~l[1],n+~~l[2],m+~~l[3],n+=~~l[4],m+=~~l[5]]};break;case"r":g[j]={m:"lineTo",a:[n+=~~l[0],m+=~~l[1]]};break;case"m":g[j]={m:"moveTo",a:[n=~~l[0],m=~~l[1]]};break;case"x":g[j]={m:"closePath"};break;case"e":break generate}h[g[j].m].apply(h,g[j].a)}return g}function c(m,k){for(var j=0,h=m.length;j<h;++j){var g=m[j];k[g.m].apply(k,g.a)}}return function(V,w,P,t,C,W){var k=(w===null);if(k){w=C.getAttribute("alt")}var A=V.viewBox;var m=P.getSize("fontSize",V.baseSize);var B=0,O=0,N=0,u=0;var z=t.textShadow,L=[];if(z){for(var U=z.length;U--;){var F=z[U];var K=m.convertFrom(parseFloat(F.offX));var I=m.convertFrom(parseFloat(F.offY));L[U]=[K,I];if(I<B){B=I}if(K>O){O=K}if(I>N){N=I}if(K<u){u=K}}}var Z=Cufon.CSS.textTransform(w,P).split("");var E=V.spacing(Z,~~m.convertFrom(parseFloat(P.get("letterSpacing"))||0),~~m.convertFrom(parseFloat(P.get("wordSpacing"))||0));if(!E.length){return null}var h=E.total;O+=A.width-E[E.length-1];u+=A.minX;var s,n;if(k){s=C;n=C.firstChild}else{s=document.createElement("cufon");s.className="cufon cufon-canvas";s.setAttribute("alt",w);n=document.createElement("canvas");s.appendChild(n);if(t.printable){var S=document.createElement("cufontext");S.appendChild(document.createTextNode(w));s.appendChild(S)}}var aa=s.style;var H=n.style;var j=m.convert(A.height);var Y=Math.ceil(j);var M=Y/j;var G=M*Cufon.CSS.fontStretch(P.get("fontStretch"));var J=h*G;var Q=Math.ceil(m.convert(J+O-u));var o=Math.ceil(m.convert(A.height-B+N));n.width=Q;n.height=o;H.width=Q+"px";H.height=o+"px";B+=A.minY;H.top=Math.round(m.convert(B-V.ascent))+"px";H.left=Math.round(m.convert(u))+"px";var r=Math.max(Math.ceil(m.convert(J)),0)+"px";if(a){aa.width=r;aa.height=m.convert(V.height)+"px"}else{aa.paddingLeft=r;aa.paddingBottom=(m.convert(V.height)-1)+"px"}var X=n.getContext("2d"),D=j/A.height;X.scale(D,D*M);X.translate(-u,-B);X.save();function T(){var x=V.glyphs,ab,l=-1,g=-1,y;X.scale(G,1);while(y=Z[++l]){var ab=x[Z[l]]||V.missingGlyph;if(!ab){continue}if(ab.d){X.beginPath();if(ab.code){c(ab.code,X)}else{ab.code=d("m"+ab.d,X)}X.fill()}X.translate(E[++g],0)}X.restore()}if(z){for(var U=z.length;U--;){var F=z[U];X.save();X.fillStyle=F.color;X.translate.apply(X,L[U]);T()}}var q=t.textGradient;if(q){var v=q.stops,p=X.createLinearGradient(0,A.minY,0,A.maxY);for(var U=0,R=v.length;U<R;++U){p.addColorStop.apply(p,v[U])}X.fillStyle=p}else{X.fillStyle=P.get("color")}T();return s}})());

/* timeline.js */
var ND = (function(ND, $) {
	
	//The create function creates the module object; It does no initialise the object
	ND.timeline = function () {
	
		var readyApp = function( $element ) {

			if( window.location.href.indexOf('text-only=true') !== -1 ) {return false;}
			
			$element.removeClass("disabled").find(".non-js").hide();

			return true;
		};

		return {

		init: function( elem ) { 

				$element = $(elem || "#timeline");
					
				/* Check this module needs to be initalised for this page */
				if (!$element || !$element.size() ) {return;}
			
				/* Do stuff */
				if( !readyApp( $element ) ) { return false; }

				
				/* Return this so it can be chained / assigned
				 * eg. var myModule = ND.myModuleName().init();
				 */
				return true;
			
			}
					
		};	
	};
	
	/* Return ND after it's been augmented */ 
	return ND;	

}(window.ND || {}, jQuery));
/* End File */

/* truncate.js */
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

/* slider.js */
/*
 * 
 */

/*globals jQuery, ND, window */
var ND = (function(ND, $) {
	
	//The create function creates the module object; It does no initialise the object
	ND.slider = function () {
	
		var $element, $slider, $periodical, $arrows,
			sliderValue, startTime,
			thisPeriodIndex,
			speed = 200,
			pf = 'time-',
			periodsCount = 7,
			dragging = false,
			sliderStart = 2.5,
			sliderEnd = 96,
			periods = ['1800 - 1900', '1901 - 1920', '1921 - 1940', '1940 - 1960', '1961 - 1980', '1981 - 2000', '2001 - Present'],
			
			initJQueryUISlider = function() {
				$element.append('<div id="'+pf+'slider"><div></div></div>');
				
				$slider = $('#'+pf+'slider > div').slider({
					animate: speed,
					step: 0.1,
					value: sliderStart,
					start: function() {
						dragging = true;
						startTime = +new Date();
					},
					stop: function() {
						dragging = false;
						stopTime = +new Date();
					},
					change: function() {
					},
					slide: function(event, ui) {
						if( ui.value < sliderStart || ui.value > sliderEnd ) {
							setSliderValue( ui.value < sliderStart ? sliderStart : sliderEnd );
							changeTimeline(!dragging);
							return false;
						}
						sliderValue = ui.value;
						changeTimeline(!dragging);
						updatePeriodicalTimeline();
					}
				});
				initJQueryUISliderHover();
			},
			
			initJQueryUISliderHover = function() {
				var width = $slider.width(),
					currentPos;
				
				$slider.bind('mousemove', function( e ) {
					var offset = $slider.offset();
					var pos = Math.floor(((e.pageX - offset.left) / width) * 7);
					if( currentPos !== pos ) {
						$periodical
							.children()
							.removeClass('over')
							.eq(pos)
							.addClass('over');
						currentPos = pos;
					}
				}).bind('mouseleave', function( e ) {
					$periodical
						.children()
						.removeClass('over');
					currentPos = -1;
				});
			},
			
			initPeriodicalTimeline = function() {
				var periodicalHTML = '<ul id="'+pf+'periodical">';
				thisPeriodIndex = 1; // start with first period being current period
				$.each(periods, function(i, v) {
					periodicalHTML += '<li class="'+pf+'item">' + v + '</li>';
				});
				periodicalHTML += '</ul>';
				$periodical = $(periodicalHTML);
				$periodical
					.children()
					.first()
					.addClass('active');
				$periodical
					.children()
					.last()
					.addClass('last');
				$slider.after($periodical);
				
				$("#time-periodical li").hover(function(){
					$(this).addClass("active");
				});
				Cufon.replace('#time-periodical li');
			},
			
			// highlight the current period on perdiodical timeline
			updatePeriodicalTimeline = function() {
				var newPeriodIndex = Math.floor(sliderValue / (100 / periodsCount)) + 1;
				if (newPeriodIndex > periodsCount) newPeriodIndex = periodsCount;
				if (thisPeriodIndex != newPeriodIndex) {
					thisPeriodIndex = newPeriodIndex;
					$periodical.find('.'+pf+'item').removeClass('active').end().find(':nth-child('+thisPeriodIndex+')').addClass('active');
				}
			},
			
			setSliderValue = function(val) {
				if( val < sliderStart || val > sliderEnd ) {
					val = val < sliderStart ? sliderStart : sliderEnd ;
				}
				
				sliderValue = val;
				$slider.slider('value', sliderValue);
				updatePeriodicalTimeline();
			},
			
			listenToTimeline = function() {
				$.subscribe('/timeline/changeslider', function(sliderValue) {
					setSliderValue(sliderValue);
				});
			},
			
			// init backward and forward arrow
			initArrows = function() {
				$arrows = $('<div id="'+pf+'arrow-backward"><a href="#"></a></div><div id="'+pf+'arrow-forward"><a href="#"></a></div>');
				$element.append($arrows);
				$element.find('#'+pf+'arrow-backward a').click(function(e) {
					sliderValue -= 5; // for demo purpose
					if (sliderValue < sliderStart) sliderValue = sliderStart;
					setSliderValue(sliderValue);
					changeTimeline(true);
					e.preventDefault();
				});
				$element.find('#'+pf+'arrow-forward a').click(function(e) {
					sliderValue += 5; // for demo purpose
					if (sliderValue > sliderEnd) sliderValue = sliderEnd;
					setSliderValue(sliderValue);
					changeTimeline(true);
					e.preventDefault();
				});
			},
			
			lastPublishedSilderValue = -1,
			
			changeTimeline = function(animating) {
				if( sliderValue !== lastPublishedSilderValue ) {
					console.log('publish /timeline/move')
					$.publish('/timeline/move', [sliderValue, animating]);
					lastPublishedSilderValue = sliderValue;
				}
			};
			
		/*
		 * returns a new object that is the functionality of the module
		 * It has access to the private variables and functions declared in this closure.
		 */
		return {

			/*
			 * init Function. Needs to be called to initialise the new module object
			 * 
			 * eg. var myModule = ND.myModuleName()
			 *     myModule.init(); 
			 */
			init: function( elem ) { 
				
				/* Cache the jQuery instance of the element(s) this belongs too.
				 * Bake in default selectors. 
				 */
				$element = $(elem || '#everyday');
					
				// check this module needs to be initalised for this page
				if (!$element || !$element.size()) {return;}
			
				initJQueryUISlider();
				sliderValue = $slider.slider('value');
				initPeriodicalTimeline();
				initArrows();
				listenToTimeline();
				
				$.subscribe('timeline/content-loaded', function() {
					changeTimeline(false);
				});				

				// return this so it can be chained / assigned, eg. var myModule = ND.myModuleName().init();
				return this;
			
			},
			
			setValue: function(val) {
				setSliderValue(val);
			}
			
		
		
		};	
	};
	
	/* Return ND after it's been augmented */ 
	return ND;	

}(window.ND || {}, jQuery));
/* End File */

/* backgrounds.js */
var ND = (function(ND, $) {
	
	//The create function creates the module object; It does no initialise the object
	ND.backgrounds = function () {
	
		var $element, $landscapeLayer, $overlayLayer
			landscapeImgWidth = 1500,
			overlayImgWidth = 6900,
			speed = 500,
			pf = "time-",
			
			initBGLayer = function() {
				$landscapeLayer = $('<div id="'+pf+'landscape"></div>');
				$overlayLayer = $('<div id="'+pf+'overlay"></div>');
				$element.prepend($landscapeLayer,$overlayLayer);
			},
			
			moveBg = function($elem, sliderValue, bgWidth, animating) {
				if (animating) {
					$elem.stop(true).animate({backgroundPositionX: -sliderValue/97*bgWidth}, speed);
				} else {
					$elem.css('backgroundPositionX', -sliderValue/97*bgWidth + 'px');
				}
			},
			
			listenToSlider = function() {
				$.subscribe('/timeline/move', function(sliderValue, animating) {
					moveBg($landscapeLayer, sliderValue, landscapeImgWidth, animating);
					moveBg($overlayLayer, sliderValue, overlayImgWidth, animating);
				});
			};
		
		/*
		 * returns a new object that is the functionality of the module
		 * It has access to the private variables and functions declared in this closure.
		 */
		return {

			/*
			 * init Function. Needs to be called to initialise the new module object
			 * 
			 * eg. var myModule = ND.myModuleName()
			 *     myModule.init(); 
			 */
			init: function( elem ) { 
				
				/* Cache the jQuery instance of the element(s) this belongs too.
				 * Bake in default selectors. 
				 */
				$element = $(elem || "#timeline");
					
				/* Check this module needs to be initalised for this page */
				if (!$element || !$element.size() ) {return;}
			
				/* Do stuff */
				initBGLayer();
				listenToSlider();
				
				/* Return this so it can be chained / assigned
				 * eg. var myModule = ND.myModuleName().init();
				 */
				return this;
			
			}
			
			/* Write Public Methods
			 * These will exist as methods on the new module object
			 * 
			 */
		
		
		};	
	};
	
	/* Return ND after it's been augmented */ 
	return ND;	

}(window.ND || {}, jQuery));
/* End File */

/* timeline-contents.js */
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

/* FranklinGDC_400.font.js */
/*!
 * The following copyright notice may not be removed under any circumstances.
 * 
 * Copyright:
 *  ITC Franklin Gothic is a trademark of The International Typeface Corporation
 * which may be registered in certain jurisdictions. Portions copyright Microsoft
 * Corporation.  All rights reserved.
 * 
 * Trademark:
 * ITC Franklin Gothic is a trademark of The International Typeface Corporation
 * which may be registered in certain jurisdictions.
 * 
 * Description:
 * Designed in 1902 by Morris Fuller Benton for the American Type Founders
 * company, Franklin Gothic still reigns as one of the most-widely used sans serif
 * typefaces. Originally issued in only one weight, the ATF version of Franklin
 * Gothic was eventually expanded to include five additional weights, but no light
 * or intermediate weights were ever developed. In 1979, under license from ATF,
 * ITC developed four new weights in roman and italic: book, medium, demi and
 * heavy. Designed by Victor Caruso, ITCs new weights matched the original faces
 * characteristics, but featured a slightly enlarged lowercase x-height. ITC
 * Franklin Gothic also features a slightly condensed lowercase a-z alphabet. In
 * 1991, ITC commissioned the Font Bureau in Boston to create condensed, compressed
 * and extra compressed versions of ITC Franklin Gothic, which increased the
 * flexibility and usefulness of the design.
 * 
 * Manufacturer:
 * International Typeface Corporation
 * 
 * Designer:
 * Victor Caruso -- Font Bureau
 * 
 * Vendor URL:
 * http://www.itcfonts.com
 * 
 * License information:
 * http://www.itcfonts.com/itc/licensing.html
 */
Cufon.registerFont({"w":184,"face":{"font-family":"FranklinGDC","font-weight":400,"font-stretch":"condensed","units-per-em":"360","panose-1":"2 11 7 6 3 4 2 2 2 4","ascent":"288","descent":"-72","x-height":"4","bbox":"-95 -361 360 110","underline-thickness":"17.9297","underline-position":"-18.1055","unicode-range":"U+0020-U+FB02"},"glyphs":{" ":{"w":67},"!":{"d":"30,-240r63,0r-16,168r-32,0xm37,-53r49,0r0,53r-49,0r0,-53","w":122},"\"":{"d":"35,-240r47,0r-7,106r-33,0xm103,-240r46,0r-7,106r-33,0"},"#":{"d":"61,-240r31,0r-10,69r35,0r11,-69r31,0r-11,69r33,0r-5,29r-32,0r-6,39r32,0r-4,29r-32,0r-12,74r-31,0r11,-74r-35,0r-11,74r-31,0r11,-74r-32,0r4,-29r32,0r6,-39r-32,0r4,-29r32,0xm77,-142r-6,39r36,0r6,-39r-36,0"},"$":{"d":"49,-116v-48,-25,-30,-120,30,-119r0,-25r27,0r0,25v30,4,49,20,58,51r-37,16v-7,-21,-19,-32,-34,-32v-22,0,-34,28,-18,40v33,23,98,26,96,84v-2,39,-26,66,-65,69r0,33r-27,0r0,-33v-35,-4,-58,-23,-66,-61r42,-11v-1,42,67,48,68,9v0,-30,-55,-30,-74,-46"},"%":{"d":"57,-241v33,0,48,26,48,62v0,35,-15,61,-48,61v-33,0,-46,-24,-47,-61v0,-37,14,-62,47,-62xm57,-144v20,-1,19,-72,0,-71v-15,1,-13,15,-13,36v0,23,0,31,13,35xm163,-240r27,0r-113,240r-27,0xm182,-122v33,0,47,24,47,62v0,37,-14,61,-47,61v-33,0,-48,-26,-48,-61v0,-37,15,-62,48,-62xm182,-25v20,-1,19,-71,0,-71v-19,1,-19,71,0,71","w":239},"&":{"d":"112,-244v35,-1,61,24,61,58v0,24,-13,43,-41,57r33,44v8,-12,14,-29,19,-52r39,7v-6,28,-18,54,-33,77v11,11,18,15,33,12r0,41v-29,6,-46,-1,-65,-20v-47,45,-141,25,-141,-47v0,-31,18,-54,54,-69v-42,-46,-20,-108,41,-108xm115,-209v-29,3,-21,32,-3,53v14,-8,21,-19,21,-33v0,-12,-6,-21,-18,-20xm91,-109v-34,16,-32,73,10,73v13,0,23,-5,33,-14","w":233},"'":{"d":"38,-240r47,0r-7,106r-33,0","w":122},"(":{"d":"62,-240r38,0v-48,87,-48,213,0,300r-38,0v-58,-82,-59,-218,0,-300","w":122},")":{"d":"22,60v47,-75,48,-225,0,-300r39,0v58,82,57,218,0,300r-39,0","w":122},"*":{"d":"77,-240r30,0r-4,44r36,-24r15,26r-40,18r40,17r-15,27r-36,-25r4,45r-30,0r4,-45r-36,25r-15,-27r39,-17r-39,-18r15,-26r36,24"},"+":{"d":"112,-139r54,0r0,38r-54,0r0,55r-40,0r0,-55r-54,0r0,-38r54,0r0,-55r40,0r0,55"},",":{"d":"21,-53r49,0r0,48r-29,62r-20,0r23,-57r-23,0r0,-53","w":91,"k":{"1":8}},"-":{"d":"13,-110r72,0r0,38r-72,0r0,-38","w":98,"k":{"\u0443":-1,"\u0442":5,"\u0423":8,"\u0422":8,"\u0410":-6,"Y":8,"W":-1,"V":-1,"T":6,"A":-6}},".":{"d":"21,-53r49,0r0,53r-49,0r0,-53","w":91,"k":{"1":8}},"\/":{"d":"139,-240r34,0r-147,300r-33,0","w":190},"0":{"d":"92,-244v64,0,80,52,80,121v0,75,-14,127,-80,127v-64,0,-80,-52,-80,-121v0,-78,13,-127,80,-127xm92,-35v32,-7,24,-28,24,-85v0,-52,7,-77,-24,-85v-31,7,-25,30,-25,85v0,55,-6,77,25,85","k":{"7":7,"4":-3,"1":10}},"1":{"d":"89,-242r40,0r0,203r40,0r0,39r-133,0r0,-39r40,0r0,-142v-12,12,-25,22,-40,30r0,-47v21,-11,39,-26,53,-44","k":{"9":3,"7":20,"6":9,"5":2,"4":6,"2":-1,"1":12,"0":5,".":-2,",":-2}},"2":{"d":"86,-201v-22,1,-26,22,-28,46r-48,-10v8,-52,34,-79,79,-79v44,0,78,29,75,70v-5,66,-43,85,-100,127r104,0r-4,47r-154,0r0,-47v61,-58,85,-62,99,-124v0,-20,-8,-30,-23,-30","k":{"7":7,"4":3,"1":12}},"3":{"d":"60,-144v30,2,49,-2,49,-30v-1,-41,-48,-37,-52,1r-46,-9v12,-41,38,-62,79,-62v71,0,99,94,36,118v27,9,40,27,40,57v0,69,-83,92,-132,57v-15,-11,-24,-29,-28,-55r46,-8v2,24,13,36,32,36v18,0,28,-14,28,-33v1,-28,-21,-35,-52,-33r0,-39","k":{"7":8,"1":15}},"4":{"d":"91,-244r57,0r0,147r27,0r0,41r-27,0r0,56r-53,0r0,-56r-86,0r0,-41xm99,-95r0,-98r-53,98r53,0","k":{"7":14,"4":-5,"1":16}},"5":{"d":"121,-78v0,-38,-45,-54,-57,-20r-41,-8r8,-134r128,0r-5,47r-84,0r-3,54v38,-46,114,-8,105,58v8,77,-84,108,-135,66v-14,-12,-23,-28,-25,-49r48,-8v3,22,13,33,31,33v20,0,30,-13,30,-39","k":{"7":10,"4":-4,"1":13}},"6":{"d":"18,-117v0,-94,61,-159,130,-111v13,9,20,27,24,48r-42,13v-3,-40,-36,-50,-54,-23v-6,10,-9,33,-9,66v31,-56,107,-17,107,48v0,49,-30,80,-76,80v-53,0,-80,-41,-80,-121xm69,-73v0,22,8,37,27,38v18,0,27,-13,27,-41v0,-24,-9,-37,-26,-37v-18,0,-28,13,-28,40","k":{"4":-4,"1":10}},"7":{"d":"25,-240r142,0r0,40v-38,49,-57,116,-58,200r-57,0v1,-73,24,-138,70,-193r-101,0","k":{":":14,"7":5,"6":10,"4":21,"1":12,".":24}},"8":{"d":"94,-244v72,-9,98,83,42,113v67,35,37,144,-47,135v-80,11,-106,-99,-39,-122v-60,-34,-32,-133,44,-126xm95,-209v-27,-2,-38,35,-16,48v8,6,16,10,25,14v23,-18,25,-60,-9,-62xm91,-33v26,0,43,-26,26,-46v-5,-6,-18,-13,-37,-22v-33,15,-30,68,11,68","k":{"7":5,"4":-4,"1":11}},"9":{"d":"86,-244v66,0,80,57,80,120v0,85,-27,128,-81,128v-37,0,-60,-20,-69,-59r46,-9v3,19,11,29,25,29v22,0,31,-30,30,-75v-9,14,-23,21,-42,21v-41,2,-65,-39,-65,-76v0,-44,28,-79,76,-79xm87,-205v-17,0,-26,16,-26,36v0,25,9,37,27,37v18,0,27,-12,27,-36v0,-21,-9,-37,-28,-37","k":{"7":10,"1":13}},":":{"d":"21,-178r49,0r0,54r-49,0r0,-54xm21,-53r49,0r0,53r-49,0r0,-53","w":91},";":{"d":"21,-178r49,0r0,54r-49,0r0,-54xm21,-53r49,0r0,48r-29,62r-20,0r23,-57r-23,0r0,-53","w":91},"\u037e":{"d":"21,-178r49,0r0,54r-49,0r0,-54xm21,-53r49,0r0,48r-29,62r-20,0r23,-57r-23,0r0,-53","w":91},"<":{"d":"170,-224r0,53r-99,51r99,51r0,53r-156,-82r0,-45"},"=":{"d":"166,-130r-148,0r0,-38r148,0r0,38xm166,-72r-148,0r0,-38r148,0r0,38"},">":{"d":"14,-16r0,-53r99,-51r-99,-51r0,-53r156,82r0,45"},"?":{"d":"102,-177v0,-14,-8,-23,-21,-24v-17,0,-26,14,-26,43r-45,-6v0,-46,28,-80,74,-80v59,0,83,55,63,103v-9,22,-52,34,-47,72r-42,0v-12,-63,44,-61,44,-108xm55,-51r47,0r0,51r-47,0r0,-51","w":171},"@":{"d":"101,-48v-61,0,-42,-140,14,-137v12,0,20,6,26,18r2,-16r24,0r-12,95v0,8,3,12,8,12v19,-1,28,-34,28,-60v0,-51,-23,-85,-72,-85v-52,0,-81,45,-81,101v0,57,29,102,85,100v23,0,44,-6,63,-19r9,24v-83,56,-188,1,-188,-104v0,-70,44,-129,112,-129v63,0,102,46,102,108v0,46,-25,90,-63,91v-14,0,-22,-6,-26,-20v-7,14,-18,21,-31,21xm117,-153v-16,2,-21,23,-20,45v0,18,4,27,13,27v13,0,19,-16,19,-48v0,-16,-4,-24,-12,-24","w":226},"A":{"d":"65,-240r53,0r69,240r-54,0r-12,-50r-68,0r-12,50r-48,0xm111,-91r-24,-98r-24,98r48,0","k":{"\u2019":12,"\u201d":13,"\u00ab":6,"y":1,"u":-2,"t":2,"g":-5,"b":-4,"Y":9,"W":4,"V":4,"U":4,"T":7,"Q":3,"O":3,"G":4,"C":4,".":-8,"-":-4,",":-8}},"B":{"d":"148,-125v69,27,46,142,-43,125r-82,0r0,-240v75,1,160,-15,160,63v0,27,-12,44,-35,52xm129,-173v0,-26,-25,-31,-56,-28r0,58v32,2,56,-2,56,-30xm136,-73v0,-33,-30,-32,-63,-31r0,63v33,2,63,-1,63,-32","w":202,"k":{"V":-1,"O":1}},"C":{"d":"70,-117v1,47,2,78,35,78v19,0,31,-16,34,-48r49,3v-3,49,-34,88,-83,88v-66,0,-91,-55,-91,-124v0,-71,25,-123,91,-124v50,0,78,31,82,93r-48,4v-1,-36,-12,-54,-33,-54v-34,0,-37,33,-36,84","w":196,"k":{"A":-3}},"D":{"d":"190,-121v0,74,-26,124,-104,121r-63,0r0,-240r56,0v81,-2,111,40,111,119xm135,-123v0,-49,-10,-80,-60,-76r0,158v52,3,60,-30,60,-82","w":202,"k":{"Y":3,"T":-3,"A":2}},"E":{"d":"23,-240r146,0r0,41r-94,0r0,56r73,0r0,41r-73,0r0,59r94,0r0,43r-146,0r0,-240","w":171},"F":{"d":"23,-240r142,0r0,41r-90,0r0,63r69,0r0,41r-69,0r0,95r-52,0r0,-240","w":159,"k":{"u":3,"r":4,"a":5,"O":-3,"J":4,"A":4,".":17,"-":-4,",":17}},"G":{"d":"70,-117v0,46,5,78,40,78v21,0,33,-16,33,-48r-36,0r0,-41r83,0r0,128r-22,0r-7,-27v-13,21,-32,31,-58,31v-59,-1,-89,-55,-89,-119v0,-71,27,-128,94,-129v49,0,76,28,82,83r-47,7v-3,-31,-15,-47,-34,-47v-35,0,-39,34,-39,84","w":208,"k":{"Y":2,"T":-4,"A":-8}},"H":{"d":"23,-240r52,0r0,97r58,0r0,-97r53,0r0,240r-53,0r0,-98r-58,0r0,98r-52,0r0,-240","w":208},"I":{"d":"23,-240r52,0r0,240r-52,0r0,-240","w":98},"J":{"d":"-2,-44v32,6,44,1,44,-37r0,-159r53,0r0,159v7,70,-32,96,-97,81r0,-44","w":116},"K":{"d":"23,-240r52,0r0,100r59,-100r53,0r-60,88r65,152r-54,0r-43,-111r-20,29r0,82r-52,0r0,-240","w":190,"k":{"y":7,"o":3,"e":3,"a":-1,"T":-14,"O":5,"G":6,"C":6,"-":2}},"L":{"d":"23,-240r52,0r0,195r78,0r0,45r-130,0r0,-240","w":153,"k":{"\u2019":26,"\u201d":28,"y":5,"u":-4,"Y":11,"W":6,"V":6,"T":8,"O":-1}},"M":{"d":"23,-240r77,0r34,148r38,-148r75,0r0,240r-49,0r0,-201r-49,201r-39,0r-44,-201r0,201r-43,0r0,-240","w":269},"N":{"d":"21,-240r58,0r62,149r0,-149r41,0r0,240r-47,0r-73,-174r0,174r-41,0r0,-240","w":202,"k":{"u":-2,"o":-1,"a":1,"A":-7,".":-1,",":-1}},"O":{"d":"101,-244v64,0,88,52,87,124v0,82,-29,124,-87,124v-64,0,-87,-53,-87,-124v0,-82,29,-124,87,-124xm101,-39v33,-6,32,-32,32,-81v0,-48,1,-75,-32,-81v-33,5,-31,33,-31,81v0,49,-1,74,31,81","w":202,"k":{"Y":3,"X":5,"W":1,"T":-3,"A":1}},"P":{"d":"181,-165v1,64,-36,80,-106,76r0,89r-52,0r0,-240r69,0v61,-4,88,20,89,75xm126,-166v0,-30,-17,-39,-51,-35r0,71v33,3,51,-5,51,-36","k":{"a":1,"J":9,"A":6,".":27,",":27}},"Q":{"d":"144,-7v-1,20,18,21,35,15r0,38v-37,12,-70,-4,-70,-43v-70,5,-95,-47,-95,-123v0,-82,29,-124,87,-124v108,0,112,197,43,237xm101,-39v33,-6,32,-32,32,-81v0,-48,1,-75,-32,-81v-33,5,-31,33,-31,81v0,49,-1,74,31,81","w":202},"R":{"d":"98,-240v88,-17,108,103,49,135r44,105r-57,0r-32,-95r-27,0r0,95r-52,0r0,-240r75,0xm130,-168v0,-30,-22,-36,-55,-33r0,67v32,2,55,-1,55,-34","w":196,"k":{"y":-7,"o":2,"e":2,"W":-1,"V":-2,"U":2,"T":-7,"O":1,"G":2,"C":1,"-":2}},"S":{"d":"47,-113v-58,-34,-29,-131,44,-131v42,0,68,19,78,56r-43,17v-6,-20,-17,-30,-34,-30v-22,0,-34,26,-17,38v33,22,102,29,99,90v-2,46,-36,78,-85,77v-43,0,-71,-22,-83,-66r46,-13v6,24,18,36,38,36v24,0,41,-23,25,-42v-10,-11,-56,-25,-68,-32","k":{"t":2,"Y":-1,"W":-2,"V":-4,"T":-8,"A":-4}},"T":{"d":"-4,-240r149,0r0,45r-49,0r0,195r-52,0r0,-195r-48,0r0,-45","w":140,"k":{"\u00ab":17,"y":8,"w":9,"v":8,"u":10,"s":12,"r":10,"o":12,"j":-5,"i":-5,"g":13,"e":13,"c":12,"a":15,"Y":-21,"W":-17,"V":-18,"S":-7,"O":-4,"J":5,"G":-2,"C":-2,"A":5,";":12,":":12,".":10,"-":6,",":10}},"U":{"d":"105,4v-67,-4,-82,-30,-82,-107r0,-137r52,0r0,137v0,40,2,62,35,64v32,-4,32,-23,32,-64r0,-137r44,0v-6,105,32,249,-81,244","w":208,"k":{"A":2,".":4,",":4}},"V":{"d":"-5,-240r55,0r37,183r39,-183r45,0r-59,241r-59,-1","w":165,"k":{"\u00ab":10,"y":-10,"r":1,"o":5,"g":6,"e":6,"a":8,"T":-18,"S":-2,"G":1,"A":3,";":2,":":2,".":10,",":10}},"W":{"d":"-2,-240r54,0r25,166r32,-166r48,0r30,167r29,-167r44,0r-51,241r-47,0r-32,-167r-33,167r-47,0","w":257,"k":{"\u00ab":8,"y":-9,"r":1,"o":4,"g":5,"e":5,"a":7,"T":-17,"S":-1,"G":1,"A":2,":":2,".":8,"-":-2,",":8}},"X":{"d":"2,-240r58,0r29,62r30,-62r51,0r-57,109r64,131r-58,0r-35,-78r-39,78r-50,0r65,-123","w":171,"k":{"y":2,"o":2,"e":2,"Q":4,"O":4,"C":4,"-":3}},"Y":{"d":"-10,-240r58,0r34,88r36,-88r51,0r-66,139r0,101r-53,0r0,-101","w":159,"k":{"\u00ab":21,"v":-3,"u":7,"p":7,"o":14,"g":15,"e":15,"a":17,"T":-21,"O":4,"G":5,"C":5,"A":10,";":8,":":8,".":17,"-":11,",":17}},"Z":{"d":"8,-240r154,0r0,38r-100,159r103,0r0,43r-165,0r0,-37r101,-160r-93,0r0,-43","w":165},"[":{"d":"26,-240r74,0r0,23r-30,0r0,255r30,0r0,22r-74,0r0,-300","w":122},"\\":{"d":"51,-240r146,300r-33,0r-147,-300r34,0","w":190},"]":{"d":"96,60r-74,0r0,-22r31,0r0,-255r-31,0r0,-23r74,0r0,300","w":122},"^":{"d":"53,-126r-48,0r55,-115r60,0r54,115r-47,0r-37,-79","w":180},"_":{"d":"0,20r180,0r0,32r-180,0r0,-32","w":180},"`":{"d":"114,-211r-14,14r-65,-40r19,-30","w":165},"a":{"d":"104,-110v-1,-21,3,-39,-17,-38v-13,0,-20,9,-21,27r-47,-5v4,-35,33,-55,72,-55v91,0,54,105,66,181r-46,0v-2,-5,-3,-14,-3,-27v-18,47,-99,39,-95,-18v4,-50,32,-61,91,-65xm81,-29v21,0,24,-27,23,-56v-25,4,-39,8,-40,34v0,15,6,22,17,22","w":171,"k":{"y":2,"v":1}},"b":{"d":"161,-90v0,52,-17,92,-63,94v-20,0,-33,-9,-41,-27v-3,6,-6,14,-9,23r-30,0r0,-240r49,0r0,79v43,-47,94,2,94,71xm110,-89v0,-31,0,-55,-21,-58v-27,-4,-22,44,-22,73v0,26,0,41,21,43v24,-3,22,-27,22,-58","w":171,"k":{"y":1}},"c":{"d":"11,-88v-1,-55,22,-92,72,-93v41,0,64,23,68,69r-46,2v-2,-17,-3,-32,-20,-33v-17,0,-25,17,-25,52v0,53,41,80,45,22r46,3v-4,47,-28,70,-70,70v-51,-1,-70,-37,-70,-92","w":159},"d":{"d":"11,-88v-1,-53,16,-92,59,-92v17,0,28,6,35,19r0,-79r49,0r0,240r-46,0r0,-29v-8,21,-21,31,-40,31v-44,0,-57,-43,-57,-90xm83,-32v27,2,21,-41,22,-71v0,-28,-2,-42,-22,-44v-24,5,-21,25,-21,63v0,29,-1,51,21,52","w":171},"e":{"d":"11,-86v0,-81,72,-123,124,-74v14,14,20,41,20,79r-93,0v0,27,0,50,23,50v15,0,24,-10,26,-30r44,3v-8,41,-32,62,-71,62v-49,0,-73,-38,-73,-90xm108,-109v1,-24,-7,-40,-23,-39v-15,0,-23,13,-23,39r46,0","w":165,"k":{"y":2,"x":1,"v":1}},"f":{"d":"27,-178v-5,-57,24,-77,80,-70r0,39v-25,-3,-36,2,-33,31r31,0r0,39r-31,0r0,139r-47,0r0,-139r-20,0r0,-39r20,0","w":104,"k":{"t":-8,"s":-4,"o":-2,"l":-3,"j":-2,"i":-3,"f":-8,"e":-1}},"g":{"d":"122,-173v1,-29,18,-38,47,-34r0,33v-14,-5,-26,-1,-29,14v37,44,-11,107,-74,86v-12,5,-17,17,-6,23v39,7,107,-4,107,54v0,40,-29,60,-87,60v-73,0,-97,-55,-43,-76v-36,-16,-29,-52,7,-69v-50,-26,-23,-99,40,-99v13,0,26,3,38,8xm86,-98v15,-1,16,-11,16,-28v0,-19,-6,-29,-16,-29v-14,1,-17,12,-17,30v0,18,6,27,17,27xm124,13v0,-26,-35,-15,-60,-21v-28,18,-20,42,25,40v23,0,35,-7,35,-19","w":165},"h":{"d":"90,-143v-17,0,-22,9,-22,31r0,112r-50,0r0,-240r50,0r0,81v9,-15,23,-22,43,-22v74,0,36,114,45,181r-49,0r0,-114v-2,-20,0,-29,-17,-29","w":171},"i":{"d":"68,-192r-50,0r0,-49r50,0r0,49xm18,-178r50,0r0,178r-50,0r0,-178","w":85},"j":{"d":"70,-192r-50,0r0,-49r50,0r0,49xm-3,22v22,1,23,-5,23,-29r0,-171r49,0r0,172v5,56,-18,79,-72,69r0,-41","w":85},"k":{"d":"18,-240r50,0r0,131r50,-69r45,0r-45,60r49,118r-53,0r-28,-82r-18,25r0,57r-50,0r0,-240","w":165,"k":{"u":-1,"o":4,"g":-3,"e":4,".":-4,"-":4,",":-4}},"l":{"d":"18,-240r50,0r0,240r-50,0r0,-240","w":85},"m":{"d":"88,-143v-21,0,-19,15,-20,40r0,103r-50,0r0,-178r47,0r0,25v11,-36,75,-39,82,0v8,-19,22,-28,43,-28v76,-2,36,114,46,181r-50,0r0,-111v0,-22,2,-32,-15,-32v-21,0,-19,14,-19,40r0,103r-49,0r0,-112v-1,-21,1,-31,-15,-31","w":251,"k":{"w":-1,"p":-1}},"n":{"d":"90,-143v-22,0,-21,13,-22,39r0,104r-50,0r0,-178r47,0r0,25v8,-19,24,-28,45,-28v74,0,38,112,46,181r-49,0r0,-116v-1,-19,-2,-27,-17,-27","w":171,"k":{"w":-1,"p":-1}},"o":{"d":"155,-89v0,62,-24,93,-72,93v-48,0,-72,-31,-72,-93v0,-62,24,-92,72,-92v48,0,72,30,72,92xm83,-31v22,-5,21,-25,21,-58v0,-34,2,-53,-21,-58v-23,4,-21,24,-21,58v0,34,-2,53,21,58","w":165,"k":{"y":1,"x":1,"v":1}},"p":{"d":"161,-92v0,68,-46,120,-94,79r0,73r-49,0r0,-238r46,0r0,27v10,-19,23,-29,40,-29v39,0,57,37,57,88xm89,-147v-29,-3,-22,44,-22,74v0,28,-1,41,21,41v25,0,22,-21,22,-59v0,-33,2,-54,-21,-56","w":171,"k":{"y":1}},"q":{"d":"11,-86v-12,-78,61,-125,102,-69v5,-6,9,-14,13,-23r28,0v-4,70,-1,162,-2,238r-49,0r0,-78v-39,50,-102,-3,-92,-68xm83,-32v26,0,20,-43,20,-75v0,-26,-1,-38,-21,-40v-24,2,-20,20,-20,54v0,39,-4,56,21,61","w":171},"r":{"d":"18,-178r44,0r0,43v10,-33,23,-49,50,-44r0,48v-58,-10,-42,77,-44,131r-50,0r0,-178","w":110,"k":{"z":-5,"y":-13,"x":-12,"w":-13,"v":-13,"t":-8,"s":-5,"q":-4,"p":-2,"o":-4,"k":-2,"h":-2,"g":-2,"f":-8,"d":-4,"c":-4,"a":-2,";":-2,":":-2,".":12,"-":4,",":12}},"s":{"d":"24,-92v-31,-38,2,-89,51,-89v32,0,51,15,60,46r-35,11v-5,-16,-13,-24,-26,-24v-16,0,-20,21,-10,28v27,18,78,20,77,66v-1,35,-30,58,-68,58v-40,0,-62,-18,-66,-53r39,-7v0,29,45,38,48,10v-3,-28,-61,-26,-70,-46","w":147,"k":{"t":-1}},"t":{"d":"109,0v-54,12,-83,-5,-83,-68r0,-71r-20,0r0,-39r20,0r0,-54r48,-2r0,56r33,0r0,39r-33,0v7,39,-23,114,35,101r0,38","w":110,"k":{"o":-1,"a":-3,";":-2,":":-2}},"u":{"d":"61,4v-75,1,-35,-115,-45,-182r49,0r0,114v2,19,0,29,17,29v26,0,22,-19,22,-52r0,-91r50,0r0,178r-47,0r0,-24v-12,21,-20,28,-46,28","w":171},"v":{"d":"-4,-178r48,0r24,105r25,-105r41,0r-49,178r-39,0","w":128,"k":{"s":-1,"a":2,";":-4,":":-4,".":7,"-":-4,",":7}},"w":{"d":"-3,-178r48,0r21,108r20,-108r48,0r16,108r24,-108r39,0r-44,178r-42,0r-23,-121r-22,121r-40,0","w":208,"k":{"s":-1,"a":2,";":-4,":":-4,".":5,"-":-5,",":5}},"x":{"d":"-2,-178r54,0r19,42r23,-42r43,0r-46,79r53,99r-54,0r-26,-53r-30,53r-43,0r53,-91","w":135,"k":{"e":1,"c":1,"a":-2}},"y":{"d":"-5,-178r50,0r24,109r23,-109r42,0r-53,181v-9,44,-30,67,-79,57r0,-39v26,3,40,0,44,-24","w":128,"k":{"o":1,"g":1,"e":2,"c":1,"a":3,";":-4,":":-4,".":9,"-":-3,",":9}},"z":{"d":"13,-178r111,0r0,32r-66,111r68,0r0,35r-119,0r0,-35r65,-107r-59,0r0,-36","w":128},"{":{"d":"33,-144v0,-57,-7,-109,63,-96r0,24v-50,-4,9,117,-41,124v34,5,16,55,21,97v2,24,-2,30,20,31r0,24v-47,3,-65,-6,-63,-55v-5,-28,15,-83,-18,-83r0,-29v22,-2,18,-8,18,-37","w":122},"|":{"d":"63,-240r54,0r0,300r-54,0r0,-300","w":180},"}":{"d":"90,-66v-7,55,19,136,-47,126r-16,0r0,-24v49,4,-11,-119,40,-128v-33,-6,-17,-52,-21,-93v-1,-25,3,-30,-19,-31r0,-24v74,-14,61,48,63,112v0,16,2,20,17,21r0,29v-11,0,-16,4,-17,12","w":122},"~":{"d":"151,-201v-9,3,-53,-20,-66,-20v-9,0,-17,7,-25,22r-27,-22v13,-33,31,-49,54,-49v9,-3,57,22,68,22v10,0,18,-8,26,-23r26,22v-12,32,-31,48,-56,48","w":239},"\u00c4":{"d":"65,-240r53,0r69,240r-54,0r-12,-50r-68,0r-12,50r-48,0xm111,-91r-24,-98r-24,98r48,0xm141,-281v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm61,-262v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19"},"\u00c5":{"d":"65,-240r53,0r69,240r-54,0r-12,-50r-68,0r-12,50r-48,0xm111,-91r-24,-98r-24,98r48,0xm92,-255v-17,0,-34,-15,-34,-34v0,-18,17,-34,34,-34v17,0,34,16,34,34v0,19,-17,34,-34,34xm92,-303v-7,-1,-15,7,-14,14v0,7,8,14,14,14v6,0,13,-7,13,-14v0,-7,-6,-14,-13,-14"},"\u00c7":{"d":"142,47v-2,36,-51,39,-77,18r6,-16v11,6,21,9,29,9v8,0,12,-3,12,-10v0,-13,-16,-17,-32,-15r11,-30v-51,-9,-77,-51,-77,-123v0,-71,25,-123,91,-124v50,0,78,31,82,93r-48,4v-1,-36,-12,-54,-33,-54v-34,0,-37,33,-36,84v1,47,2,78,35,78v19,0,31,-16,34,-48r49,3v-2,47,-30,85,-78,88r-4,14v22,-2,36,9,36,29","w":196},"\u00c9":{"d":"23,-240r146,0r0,41r-94,0r0,56r73,0r0,41r-73,0r0,59r94,0r0,43r-146,0r0,-240xm67,-273r60,-56r20,30r-65,40","w":171},"\u00d1":{"d":"21,-240r58,0r62,149r0,-149r41,0r0,240r-47,0r-73,-174r0,174r-41,0r0,-240xm46,-275v21,-38,54,-21,83,-12v5,0,11,-4,17,-12r16,11v-20,38,-55,25,-84,14v-5,0,-10,4,-17,11","w":202},"\u00d6":{"d":"101,-244v64,0,88,52,87,124v0,82,-29,124,-87,124v-64,0,-87,-53,-87,-124v0,-82,29,-124,87,-124xm101,-39v33,-6,32,-32,32,-81v0,-48,1,-75,-32,-81v-33,5,-31,33,-31,81v0,49,-1,74,31,81xm153,-281v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm73,-262v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":202},"\u00dc":{"d":"105,4v-67,-4,-82,-30,-82,-107r0,-137r52,0r0,137v0,40,2,62,35,64v32,-4,32,-23,32,-64r0,-137r44,0v-6,105,32,249,-81,244xm156,-281v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm76,-262v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":208},"\u00e1":{"d":"104,-110v-1,-21,3,-39,-17,-38v-13,0,-20,9,-21,27r-47,-5v4,-35,33,-55,72,-55v91,0,54,105,66,181r-46,0v-2,-5,-3,-14,-3,-27v-18,47,-99,39,-95,-18v4,-50,32,-61,91,-65xm81,-29v21,0,24,-27,23,-56v-25,4,-39,8,-40,34v0,15,6,22,17,22xm64,-211r60,-56r20,30r-65,40","w":171},"\u00e0":{"d":"104,-110v-1,-21,3,-39,-17,-38v-13,0,-20,9,-21,27r-47,-5v4,-35,33,-55,72,-55v91,0,54,105,66,181r-46,0v-2,-5,-3,-14,-3,-27v-18,47,-99,39,-95,-18v4,-50,32,-61,91,-65xm81,-29v21,0,24,-27,23,-56v-25,4,-39,8,-40,34v0,15,6,22,17,22xm117,-211r-14,14r-65,-40r19,-30","w":171},"\u00e2":{"d":"104,-110v-1,-21,3,-39,-17,-38v-13,0,-20,9,-21,27r-47,-5v4,-35,33,-55,72,-55v91,0,54,105,66,181r-46,0v-2,-5,-3,-14,-3,-27v-18,47,-99,39,-95,-18v4,-50,32,-61,91,-65xm81,-29v21,0,24,-27,23,-56v-25,4,-39,8,-40,34v0,15,6,22,17,22xm10,-199r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":171},"\u00e4":{"d":"104,-110v-1,-21,3,-39,-17,-38v-13,0,-20,9,-21,27r-47,-5v4,-35,33,-55,72,-55v91,0,54,105,66,181r-46,0v-2,-5,-3,-14,-3,-27v-18,47,-99,39,-95,-18v4,-50,32,-61,91,-65xm81,-29v21,0,24,-27,23,-56v-25,4,-39,8,-40,34v0,15,6,22,17,22xm140,-223v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm60,-204v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":171},"\u00e3":{"d":"104,-110v-1,-21,3,-39,-17,-38v-13,0,-20,9,-21,27r-47,-5v4,-35,33,-55,72,-55v91,0,54,105,66,181r-46,0v-2,-5,-3,-14,-3,-27v-18,47,-99,39,-95,-18v4,-50,32,-61,91,-65xm81,-29v21,0,24,-27,23,-56v-25,4,-39,8,-40,34v0,15,6,22,17,22xm32,-219v21,-38,54,-21,83,-12v5,0,11,-4,17,-12r16,11v-20,38,-55,25,-84,14v-5,0,-10,4,-17,11","w":171},"\u00e5":{"d":"104,-110v-1,-21,3,-39,-17,-38v-13,0,-20,9,-21,27r-47,-5v4,-35,33,-55,72,-55v91,0,54,105,66,181r-46,0v-2,-5,-3,-14,-3,-27v-18,47,-99,39,-95,-18v4,-50,32,-61,91,-65xm81,-29v21,0,24,-27,23,-56v-25,4,-39,8,-40,34v0,15,6,22,17,22xm90,-195v-17,0,-34,-15,-34,-34v0,-18,17,-34,34,-34v17,0,34,16,34,34v0,19,-17,34,-34,34xm90,-243v-7,-1,-15,7,-14,14v0,7,8,14,14,14v6,0,13,-7,13,-14v0,-7,-6,-14,-13,-14","w":171},"\u00e7":{"d":"11,-88v-1,-55,22,-92,72,-93v41,0,64,23,68,69r-46,2v-2,-17,-3,-32,-20,-33v-17,0,-25,17,-25,52v0,53,41,80,45,22r46,3v-4,43,-25,66,-62,70r-6,14v20,-4,36,8,36,27v-1,35,-48,37,-75,18r6,-16v15,9,36,18,41,-1v-1,-13,-16,-18,-32,-14r10,-29v-39,-6,-58,-37,-58,-91","w":159},"\u00e9":{"d":"11,-86v0,-81,72,-123,124,-74v14,14,20,41,20,79r-93,0v0,27,0,50,23,50v15,0,24,-10,26,-30r44,3v-8,41,-32,62,-71,62v-49,0,-73,-38,-73,-90xm108,-109v1,-24,-7,-40,-23,-39v-15,0,-23,13,-23,39r46,0xm59,-211r60,-56r20,30r-65,40","w":165},"\u00e8":{"d":"11,-86v0,-81,72,-123,124,-74v14,14,20,41,20,79r-93,0v0,27,0,50,23,50v15,0,24,-10,26,-30r44,3v-8,41,-32,62,-71,62v-49,0,-73,-38,-73,-90xm108,-109v1,-24,-7,-40,-23,-39v-15,0,-23,13,-23,39r46,0xm114,-211r-14,14r-65,-40r19,-30","w":165},"\u00ea":{"d":"11,-86v0,-81,72,-123,124,-74v14,14,20,41,20,79r-93,0v0,27,0,50,23,50v15,0,24,-10,26,-30r44,3v-8,41,-32,62,-71,62v-49,0,-73,-38,-73,-90xm108,-109v1,-24,-7,-40,-23,-39v-15,0,-23,13,-23,39r46,0xm16,-199r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":165},"\u00eb":{"d":"11,-86v0,-81,72,-123,124,-74v14,14,20,41,20,79r-93,0v0,27,0,50,23,50v15,0,24,-10,26,-30r44,3v-8,41,-32,62,-71,62v-49,0,-73,-38,-73,-90xm108,-109v1,-24,-7,-40,-23,-39v-15,0,-23,13,-23,39r46,0xm137,-223v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm57,-204v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":165},"\u00ed":{"d":"18,-178r50,0r0,178r-50,0r0,-178xm15,-211r60,-56r20,30r-65,40","w":85},"\u00ec":{"d":"18,-178r50,0r0,178r-50,0r0,-178xm71,-211r-14,14r-65,-40r19,-30","w":85},"\u00ee":{"d":"18,-178r50,0r0,178r-50,0r0,-178xm-28,-199r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":85},"\u00ef":{"d":"18,-178r50,0r0,178r-50,0r0,-178xm93,-223v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm13,-204v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":85},"\u00f1":{"d":"90,-143v-22,0,-21,13,-22,39r0,104r-50,0r0,-178r47,0r0,25v8,-19,24,-28,45,-28v74,0,38,112,46,181r-49,0r0,-116v-1,-19,-2,-27,-17,-27xm27,-219v21,-38,54,-21,83,-12v5,0,11,-4,17,-12r16,11v-20,38,-55,25,-84,14v-5,0,-10,4,-17,11","w":171},"\u00f3":{"d":"155,-89v0,62,-24,93,-72,93v-48,0,-72,-31,-72,-93v0,-62,24,-92,72,-92v48,0,72,30,72,92xm83,-31v22,-5,21,-25,21,-58v0,-34,2,-53,-21,-58v-23,4,-21,24,-21,58v0,34,-2,53,21,58xm57,-211r60,-56r20,30r-65,40","w":165},"\u00f2":{"d":"155,-89v0,62,-24,93,-72,93v-48,0,-72,-31,-72,-93v0,-62,24,-92,72,-92v48,0,72,30,72,92xm83,-31v22,-5,21,-25,21,-58v0,-34,2,-53,-21,-58v-23,4,-21,24,-21,58v0,34,-2,53,21,58xm112,-211r-14,14r-65,-40r19,-30","w":165},"\u00f4":{"d":"155,-89v0,62,-24,93,-72,93v-48,0,-72,-31,-72,-93v0,-62,24,-92,72,-92v48,0,72,30,72,92xm83,-31v22,-5,21,-25,21,-58v0,-34,2,-53,-21,-58v-23,4,-21,24,-21,58v0,34,-2,53,21,58xm12,-199r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":165},"\u00f6":{"d":"155,-89v0,62,-24,93,-72,93v-48,0,-72,-31,-72,-93v0,-62,24,-92,72,-92v48,0,72,30,72,92xm83,-31v22,-5,21,-25,21,-58v0,-34,2,-53,-21,-58v-23,4,-21,24,-21,58v0,34,-2,53,21,58xm133,-223v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm53,-204v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":165},"\u00f5":{"d":"155,-89v0,62,-24,93,-72,93v-48,0,-72,-31,-72,-93v0,-62,24,-92,72,-92v48,0,72,30,72,92xm83,-31v22,-5,21,-25,21,-58v0,-34,2,-53,-21,-58v-23,4,-21,24,-21,58v0,34,-2,53,21,58xm25,-219v21,-38,54,-21,83,-12v5,0,11,-4,17,-12r16,11v-20,38,-55,25,-84,14v-5,0,-10,4,-17,11","w":165},"\u00fa":{"d":"61,4v-75,1,-35,-115,-45,-182r49,0r0,114v2,19,0,29,17,29v26,0,22,-19,22,-52r0,-91r50,0r0,178r-47,0r0,-24v-12,21,-20,28,-46,28xm57,-211r60,-56r20,30r-65,40","w":171},"\u00f9":{"d":"61,4v-75,1,-35,-115,-45,-182r49,0r0,114v2,19,0,29,17,29v26,0,22,-19,22,-52r0,-91r50,0r0,178r-47,0r0,-24v-12,21,-20,28,-46,28xm112,-211r-14,14r-65,-40r19,-30","w":171},"\u00fb":{"d":"61,4v-75,1,-35,-115,-45,-182r49,0r0,114v2,19,0,29,17,29v26,0,22,-19,22,-52r0,-91r50,0r0,178r-47,0r0,-24v-12,21,-20,28,-46,28xm14,-199r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":171},"\u00fc":{"d":"61,4v-75,1,-35,-115,-45,-182r49,0r0,114v2,19,0,29,17,29v26,0,22,-19,22,-52r0,-91r50,0r0,178r-47,0r0,-24v-12,21,-20,28,-46,28xm135,-223v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm55,-204v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":171},"\u2020":{"d":"68,-240r48,0r0,64r50,0r0,42r-50,0r0,194r-48,0r0,-194r-50,0r0,-42r50,0r0,-64"},"\u00b0":{"d":"92,-244v31,0,57,25,57,57v0,31,-26,58,-57,58v-31,0,-57,-27,-57,-58v0,-31,26,-57,57,-57xm92,-158v14,0,25,-15,25,-29v1,-14,-11,-28,-25,-28v-14,0,-24,14,-24,28v0,14,10,29,24,29"},"\u00a2":{"d":"82,-36v-78,-6,-77,-170,0,-173r0,-32r26,0r0,32v31,4,48,26,52,64r-41,3v-1,-21,-9,-32,-23,-32v-22,0,-22,21,-22,51v0,31,0,48,22,51v17,-2,19,-11,23,-32r41,4v-5,39,-22,60,-52,64r0,38r-26,0r0,-38"},"\u00a3":{"d":"111,-205v-23,-1,-14,38,-13,58r40,0r0,37r-35,0v1,37,-8,53,-27,69v42,3,74,-3,79,-36r38,15v-10,45,-31,62,-90,62r-100,0r0,-41v49,8,55,-24,51,-69r-28,0r0,-37r22,0v-9,-56,10,-97,63,-97v33,0,53,16,61,46r-38,18v-4,-17,-12,-25,-23,-25"},"\u00a7":{"d":"53,-143v-41,-33,-14,-101,45,-101v35,0,58,15,67,45r-37,12v-1,-29,-50,-33,-50,-4v0,41,84,30,84,91v0,19,-7,34,-23,47v50,34,20,113,-47,113v-41,0,-65,-17,-73,-54r41,-7v0,33,64,38,60,3v-5,-47,-95,-34,-95,-97v0,-22,10,-37,28,-48xm91,-120v-17,-14,-25,-2,-25,13v0,23,26,27,47,39v21,-22,5,-44,-22,-52"},"\u2022":{"d":"120,-173v26,0,49,24,49,51v0,27,-23,50,-49,50v-26,0,-50,-24,-50,-50v0,-27,23,-51,50,-51","w":239},"\u00b6":{"d":"8,-167v0,-51,20,-73,77,-73r83,0r0,300r-28,0r0,-271r-17,0r0,271r-28,0r0,-153v-60,4,-87,-18,-87,-74","w":196},"\u00df":{"d":"100,-220v-28,2,-28,21,-27,57r0,184r-50,0r0,-143r-19,0r0,-39r19,0v-1,-58,29,-93,85,-93v38,0,61,19,62,52v0,27,-18,46,-54,57v28,21,76,31,76,81v0,56,-55,83,-106,60r12,-33v21,9,51,10,50,-17v-3,-40,-66,-37,-64,-81v0,-9,2,-19,6,-30v22,-3,34,-13,34,-30v-1,-14,-9,-26,-24,-25","w":196},"\u00ae":{"d":"140,4v-67,0,-126,-57,-126,-124v0,-67,60,-124,126,-124v67,0,126,57,126,124v0,67,-59,124,-126,124xm140,-216v-51,0,-95,45,-95,96v0,52,44,96,95,96v51,0,95,-45,95,-96v0,-52,-44,-96,-95,-96xm89,-192v51,-1,106,-7,104,44v0,18,-8,30,-22,37r27,63r-42,0r-19,-55r-9,0r0,55r-39,0r0,-144xm128,-165r0,35v16,1,27,-2,27,-18v0,-14,-11,-18,-27,-17","w":280},"\u00a9":{"d":"140,4v-67,0,-126,-57,-126,-124v0,-67,60,-124,126,-124v67,0,126,57,126,124v0,67,-59,124,-126,124xm140,-216v-51,0,-95,45,-95,96v0,52,44,96,95,96v51,0,95,-45,95,-96v0,-52,-44,-96,-95,-96xm123,-118v0,46,37,61,41,15r36,2v-2,31,-23,56,-57,55v-40,-1,-62,-28,-61,-73v0,-45,18,-75,62,-75v34,0,52,19,55,58r-36,2v-1,-21,-7,-31,-19,-31v-14,0,-21,16,-21,47","w":280},"\u2122":{"d":"5,-233r90,0r0,26r-30,0r0,111r-32,0r0,-111r-28,0r0,-26xm105,-233r48,0r19,84r22,-84r46,0r0,137r-29,0r0,-114r-30,114r-23,0r-27,-114r0,114r-26,0r0,-137","w":263},"\u00b4":{"d":"65,-211r60,-56r20,30r-65,40","w":165},"\u00a8":{"d":"133,-223v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm53,-204v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":165},"\u2260":{"d":"136,-168r30,0r0,38r-48,0r-10,20r58,0r0,38r-76,0r-18,40r-34,-16r11,-24r-31,0r0,-38r48,0r10,-20r-58,0r0,-38r76,0r18,-40r34,16"},"\u00c6":{"d":"80,-240r162,0r0,41r-89,0r0,56r70,0r0,41r-70,0r0,59r89,0r0,43r-139,0r0,-56r-53,0r-19,56r-45,0xm104,-94r0,-111r-40,111r40,0","w":245},"\u00d8":{"d":"155,-254r28,0r-20,38v17,20,25,53,25,96v0,101,-53,145,-129,114r-11,21r-27,0r19,-38v-17,-21,-26,-54,-26,-97v0,-102,56,-146,130,-113xm123,-195v-42,-25,-58,12,-58,75v0,18,0,33,2,44xm80,-43v49,23,61,-23,58,-85v0,-11,-1,-23,-3,-34","w":202},"\u221e":{"d":"69,-181v21,0,41,16,50,31v27,-62,111,-49,111,21v0,35,-21,61,-54,61v-22,0,-41,-13,-57,-40v-9,15,-28,30,-50,30v-26,0,-43,-24,-43,-51v0,-28,17,-52,43,-52xm204,-130v0,-17,-9,-36,-27,-35v-13,0,-26,11,-41,35v18,24,16,34,41,36v18,1,27,-19,27,-36xm51,-130v3,35,35,30,53,0v-12,-17,-22,-25,-33,-25v-11,0,-21,11,-20,25","w":256},"\u00b1":{"d":"112,-139r54,0r0,38r-54,0r0,51r-40,0r0,-51r-54,0r0,-38r54,0r0,-55r40,0r0,55xm166,4r-148,0r0,-38r148,0r0,38"},"\u2264":{"d":"170,-230r0,50r-97,32r97,31r0,50r-156,-59r0,-45xm170,-57r0,47r-156,0r0,-47r156,0"},"\u2265":{"d":"14,-67r0,-50r98,-31r-98,-32r0,-50r156,59r0,45xm14,-10r0,-47r156,0r0,47r-156,0"},"\u00a5":{"d":"9,-240r51,0r36,98r38,-98r41,0r-39,94r36,0r0,26r-47,0r-10,21r57,0r0,27r-57,0r0,72r-47,0r0,-72r-54,0r0,-27r54,0r-9,-21r-45,0r0,-26r34,0"},"\u00b5":{"d":"85,-35v24,-2,19,-21,19,-52r0,-91r50,0r0,178r-47,0r0,-24v-3,19,-7,26,-22,28v-16,-2,-19,-10,-23,-28r0,84r-46,0r0,-238r49,0r0,91v1,32,-4,49,20,52","w":171},"\u2202":{"d":"145,-166v7,-63,-55,-88,-78,-31r-24,-15v9,-29,32,-50,65,-50v45,0,65,43,64,97v-2,80,-31,168,-109,170v-34,0,-56,-25,-55,-62v1,-67,62,-112,137,-109xm48,-59v0,42,50,35,69,2v12,-20,22,-44,26,-76v-54,-5,-95,29,-95,74","w":177},"\u2211":{"d":"24,-270r218,0r0,29r-174,0r107,141r-114,147r183,0r0,28r-223,0r0,-33r109,-141r-106,-140r0,-31","w":256},"\u220f":{"d":"28,-270r240,0r0,345r-34,0r0,-314r-172,0r0,314r-34,0r0,-345","w":296},"\uf006":{"d":"172,-137r0,137r-50,0r0,-137r-49,0r0,137r-50,0r0,-137r-18,0r0,-41r184,0r0,41r-17,0","w":194},"\u222b":{"d":"0,17v1,-25,28,-14,37,-6v5,0,6,-3,6,-10v-4,-82,-14,-243,2,-300v9,-31,45,-38,53,-10v0,24,-24,20,-36,9v-5,0,-7,3,-7,11v4,88,11,121,6,225v-4,67,-2,93,-40,103v-12,0,-21,-9,-21,-22","w":98},"\u00aa":{"d":"73,-111v-15,26,-65,22,-65,-14v0,-25,20,-38,60,-40v4,-19,-19,-24,-20,-5r-36,-3v5,-22,21,-33,48,-33v60,0,39,65,47,110r-32,0v-1,-5,-2,-10,-2,-15xm68,-144v-21,-6,-32,22,-14,26v9,0,14,-8,14,-26","w":116},"\u00ba":{"d":"104,-151v0,38,-16,57,-49,57v-33,0,-49,-19,-49,-56v0,-37,16,-56,49,-56v33,0,49,18,49,55xm55,-120v17,-2,16,-60,0,-60v-17,0,-15,58,0,60","w":110},"\u2126":{"d":"68,-139v1,46,21,81,55,96r0,43r-113,0r0,-40v25,0,47,3,71,4v-45,-19,-67,-55,-67,-107v-1,-73,50,-121,124,-121v80,0,127,45,127,121v0,51,-22,87,-67,107r71,-4r0,40r-113,0r0,-43v75,-24,75,-183,-18,-183v-46,0,-70,41,-70,87","w":276},"\u00e6":{"d":"101,-110v1,-21,0,-38,-19,-38v-13,0,-21,9,-22,28r-43,-5v0,-55,80,-74,110,-38v32,-36,100,-12,107,27v2,13,7,31,7,55r-92,0v-1,28,4,50,23,50v14,0,23,-9,25,-29r42,3v-2,66,-93,82,-118,30v-21,45,-112,42,-108,-19v4,-48,32,-61,88,-64xm194,-109v0,-26,-7,-39,-22,-39v-14,0,-22,13,-23,39r45,0xm101,-85v-27,4,-39,9,-39,33v0,15,6,23,17,23v19,0,23,-28,22,-56","w":251},"\u00f8":{"d":"127,-196r23,0r-17,34v14,16,22,40,22,73v0,76,-43,107,-104,87r-11,23r-23,0r17,-35v-15,-16,-23,-41,-23,-75v0,-76,44,-106,105,-86xm99,-145v-48,-21,-47,44,-42,92xm69,-31v46,16,45,-41,41,-89","w":165},"\u00bf":{"d":"116,-126r-47,0r0,-52r47,1r0,51xm70,0v0,14,8,23,21,23v17,0,25,-14,25,-43r45,6v-1,46,-26,80,-73,80v-79,0,-91,-99,-36,-134v16,-16,20,-13,20,-41r42,0v10,62,-41,62,-44,109","w":171},"\u00a1":{"d":"86,-124r-49,0r0,-54r49,1r0,53xm93,63r-63,0r15,-169r32,0","w":122},"\u00ac":{"d":"116,0r0,-57r-104,0r0,-48r156,0r0,105r-52,0","w":180},"\u221a":{"d":"184,-329r13,0r-55,343r-87,-180r-35,16r-6,-11r53,-27r71,145","w":197},"\u0192":{"d":"82,-173v7,-62,30,-81,87,-69r-6,39v-24,-9,-34,4,-35,30r31,0r-6,39r-30,0v-18,75,4,207,-102,184r6,-39v27,4,31,-5,34,-32r15,-113r-25,0r6,-39r25,0"},"\u2248":{"d":"123,-124v-10,2,-52,-21,-67,-21v-9,0,-17,6,-25,19r-26,-18v13,-33,31,-49,54,-49v9,-3,56,21,68,21v9,0,18,-6,26,-19r26,18v-12,32,-31,49,-56,49xm122,-47v-9,2,-52,-20,-66,-20v-9,0,-17,6,-25,19r-26,-19v13,-33,31,-49,54,-49v9,-3,58,21,68,22v9,0,18,-6,26,-19r26,18v-12,32,-31,48,-57,48"},"\u2206":{"d":"216,0r-211,0r110,-244xm174,-14r-70,-170r-77,170r147,0","w":220},"\u00ab":{"d":"142,-29r-26,0r-37,-63r37,-63r26,0r-22,63xm81,-29r-27,0r-37,-63r37,-63r27,0r-22,63","w":159,"k":{"\u0447":3,"\u0442":-6,"\u043b":-1,"\u042f":5,"\u0427":3,"\u0423":5,"\u0422":14,"\u041b":-3,"\u0410":-4}},"\u00bb":{"d":"17,-155r27,0r37,63r-37,63r-27,0r22,-63xm79,-155r26,0r37,63r-37,63r-26,0r22,-63","w":159,"k":{"Y":17,"W":9,"V":9,"T":16,"A":4}},"\u2026":{"d":"21,-53r49,0r0,53r-49,0r0,-53xm113,-53r50,0r0,53r-50,0r0,-53xm205,-53r50,0r0,53r-50,0r0,-53","w":275},"\u00a0":{"w":67},"\u00c0":{"d":"65,-240r53,0r69,240r-54,0r-12,-50r-68,0r-12,50r-48,0xm111,-91r-24,-98r-24,98r48,0xm120,-269r-14,14r-65,-40r19,-30"},"\u00c3":{"d":"65,-240r53,0r69,240r-54,0r-12,-50r-68,0r-12,50r-48,0xm111,-91r-24,-98r-24,98r48,0xm34,-275v21,-38,54,-21,83,-12v5,0,11,-4,17,-12r16,11v-20,38,-55,25,-84,14v-5,0,-10,4,-17,11"},"\u00d5":{"d":"101,-244v64,0,88,52,87,124v0,82,-29,124,-87,124v-64,0,-87,-53,-87,-124v0,-82,29,-124,87,-124xm101,-39v33,-6,32,-32,32,-81v0,-48,1,-75,-32,-81v-33,5,-31,33,-31,81v0,49,-1,74,31,81xm43,-275v21,-38,54,-21,83,-12v5,0,11,-4,17,-12r16,11v-20,38,-55,25,-84,14v-5,0,-10,4,-17,11","w":202},"\u0152":{"d":"14,-114v0,-91,38,-144,125,-126r140,0r0,41r-94,0r0,56r73,0r0,41r-73,0r0,59r94,0r0,43r-143,0v-80,21,-122,-38,-122,-114xm107,-201v-36,0,-36,46,-37,85v-2,66,25,92,64,68r0,-143v-7,-6,-16,-10,-27,-10","w":282},"\u0153":{"d":"81,4v-50,0,-70,-38,-70,-93v0,-88,73,-116,120,-71v30,-41,102,-15,109,26v2,14,7,31,7,53r-94,0v-1,28,2,50,25,50v15,0,23,-10,25,-30r44,3v-7,62,-77,80,-118,43v-11,13,-27,19,-48,19xm200,-109v1,-24,-6,-39,-23,-39v-16,0,-24,13,-24,39r47,0xm83,-31v23,-3,21,-26,21,-58v0,-34,1,-53,-21,-58v-23,4,-21,24,-21,58v0,34,-2,53,21,58","w":257},"\u2013":{"d":"14,-109r131,0r0,36r-131,0r0,-36","w":159},"\u2014":{"d":"13,-109r213,0r0,36r-213,0r0,-36","w":239},"\u201c":{"d":"130,-144r-45,0r0,-53r25,-47r20,0r-20,47r20,0r0,53xm68,-144r-45,0r0,-53r26,-47r19,0r-19,47r19,0r0,53","w":153,"k":{"Y":-5,"W":-5,"V":-7,"T":-4,"A":13}},"\u201d":{"d":"23,-240r45,0r0,53r-25,47r-20,0r20,-47r-20,0r0,-53xm85,-240r45,0r0,53r-26,47r-19,0r19,-47r-19,0r0,-53","w":153,"k":{"Y":-7,"W":-5,"V":-6,"T":-4,"A":14}},"\u2018":{"d":"65,-144r-45,0r0,-53r26,-47r19,0r-19,47r19,0r0,53","w":85},"\u2019":{"d":"20,-240r45,0r0,53r-25,47r-20,0r20,-47r-20,0r0,-53","w":85},"\u00f7":{"d":"113,-156r-42,0r0,-47r42,0r0,47xm166,-101r-148,0r0,-38r148,0r0,38xm113,-37r-42,0r0,-48r42,0r0,48"},"\u25ca":{"d":"97,-250r73,125r-73,125r-20,0r-69,-125r69,-125r20,0xm87,-233r-60,108r60,108r63,-108","w":177},"\u00ff":{"d":"-5,-178r50,0r24,109r23,-109r42,0r-53,181v-9,44,-30,67,-79,57r0,-39v26,3,40,0,44,-24xm117,-223v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm37,-204v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":128},"\u0178":{"d":"-10,-240r58,0r34,88r36,-88r51,0r-66,139r0,101r-53,0r0,-101xm130,-281v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm50,-262v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":159},"\u2215":{"d":"58,-240r29,0r-115,240r-28,0","w":30},"\u20ac":{"d":"22,-159v-2,-97,146,-116,160,-19r-45,11v-4,-23,-16,-34,-33,-34v-18,0,-30,14,-33,42r39,0r0,27r-41,0r0,21r41,0r0,27r-40,0v1,55,58,58,66,14r45,10v-11,43,-29,64,-78,64v-51,0,-76,-37,-82,-88r-20,0r0,-27r17,0r0,-21r-17,0r0,-27r21,0"},"\u2039":{"d":"81,-29r-27,0r-37,-63r37,-63r27,0r-22,63","w":98},"\u203a":{"d":"18,-155r26,0r37,63r-37,63r-26,0r22,-63","w":98},"\ufb01":{"d":"105,-209v-23,-3,-33,4,-31,31r31,0r0,39r-31,0r0,139r-47,0r0,-139r-20,0r0,-39r20,0v-5,-59,23,-75,78,-70r0,39xm172,-192r-50,0r0,-49r50,0r0,49xm122,-178r50,0r0,178r-50,0r0,-178","w":190},"\ufb02":{"d":"105,-209v-23,-3,-33,4,-31,31r31,0r0,39r-31,0r0,139r-47,0r0,-139r-20,0r0,-39r20,0v-5,-59,23,-75,78,-70r0,39xm122,-240r50,0r0,240r-50,0r0,-240","w":190},"\u2021":{"d":"68,-240r48,0r0,64r50,0r0,42r-50,0r0,88r50,0r0,42r-50,0r0,64r-48,0r0,-64r-50,0r0,-42r50,0r0,-88r-50,0r0,-42r50,0r0,-64"},"\u2219":{"d":"21,-119r49,0r0,53r-49,0r0,-53","w":91},"\u201a":{"d":"20,-53r45,0r0,53r-25,47r-20,0r20,-47r-20,0r0,-53","w":85},"\u201e":{"d":"23,-53r45,0r0,53r-25,47r-20,0r20,-47r-20,0r0,-53xm85,-53r45,0r0,53r-26,47r-19,0r19,-47r-19,0r0,-53","w":153,"k":{"Y":14,"W":10,"V":10,"T":11,"A":-9}},"\u2030":{"d":"57,-241v33,0,48,26,48,62v0,35,-15,61,-48,61v-33,0,-46,-24,-47,-61v0,-37,14,-62,47,-62xm57,-144v20,-1,19,-72,0,-71v-15,1,-13,15,-13,36v0,23,0,31,13,35xm163,-240r27,0r-113,240r-27,0xm182,-122v33,0,47,24,47,62v0,37,-14,61,-47,61v-33,0,-48,-26,-48,-61v0,-37,15,-62,48,-62xm182,-25v20,-1,19,-71,0,-71v-19,1,-19,71,0,71xm291,-122v33,0,49,24,48,62v0,35,-15,61,-48,61v-33,0,-47,-24,-47,-61v1,-36,13,-62,47,-62xm291,-25v22,-1,19,-71,0,-71v-15,0,-13,15,-13,36v0,23,0,31,13,35","w":349},"\u00c2":{"d":"65,-240r53,0r69,240r-54,0r-12,-50r-68,0r-12,50r-48,0xm111,-91r-24,-98r-24,98r48,0xm21,-262r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0"},"\u00ca":{"d":"23,-240r146,0r0,41r-94,0r0,56r73,0r0,41r-73,0r0,59r94,0r0,43r-146,0r0,-240xm26,-262r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":171},"\u00c1":{"d":"65,-240r53,0r69,240r-54,0r-12,-50r-68,0r-12,50r-48,0xm111,-91r-24,-98r-24,98r48,0xm66,-269r60,-56r20,30r-65,40"},"\u00cb":{"d":"23,-240r146,0r0,41r-94,0r0,56r73,0r0,41r-73,0r0,59r94,0r0,43r-146,0r0,-240xm146,-281v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm66,-262v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":171},"\u00c8":{"d":"23,-240r146,0r0,41r-94,0r0,56r73,0r0,41r-73,0r0,59r94,0r0,43r-146,0r0,-240xm126,-269r-14,14r-65,-40r19,-30","w":171},"\u00cd":{"d":"23,-240r52,0r0,240r-52,0r0,-240xm16,-269r60,-56r20,30r-65,40","w":98},"\u00ce":{"d":"23,-240r52,0r0,240r-52,0r0,-240xm-22,-257r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":98},"\u00cf":{"d":"23,-240r52,0r0,240r-52,0r0,-240xm99,-281v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm19,-262v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":98},"\u00cc":{"d":"23,-240r52,0r0,240r-52,0r0,-240xm80,-269r-14,14r-65,-40r19,-30","w":98},"\u00d3":{"d":"101,-244v64,0,88,52,87,124v0,82,-29,124,-87,124v-64,0,-87,-53,-87,-124v0,-82,29,-124,87,-124xm101,-39v33,-6,32,-32,32,-81v0,-48,1,-75,-32,-81v-33,5,-31,33,-31,81v0,49,-1,74,31,81xm71,-273r60,-56r20,30r-65,40","w":202},"\u00d4":{"d":"101,-244v64,0,88,52,87,124v0,82,-29,124,-87,124v-64,0,-87,-53,-87,-124v0,-82,29,-124,87,-124xm101,-39v33,-6,32,-32,32,-81v0,-48,1,-75,-32,-81v-33,5,-31,33,-31,81v0,49,-1,74,31,81xm32,-257r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":202},"\u00d2":{"d":"101,-244v64,0,88,52,87,124v0,82,-29,124,-87,124v-64,0,-87,-53,-87,-124v0,-82,29,-124,87,-124xm101,-39v33,-6,32,-32,32,-81v0,-48,1,-75,-32,-81v-33,5,-31,33,-31,81v0,49,-1,74,31,81xm131,-273r-14,14r-65,-40r19,-30","w":202},"\u00da":{"d":"105,4v-67,-4,-82,-30,-82,-107r0,-137r52,0r0,137v0,40,2,62,35,64v32,-4,32,-23,32,-64r0,-137r44,0v-6,105,32,249,-81,244xm76,-269r60,-56r20,30r-65,40","w":208},"\u00db":{"d":"105,4v-67,-4,-82,-30,-82,-107r0,-137r52,0r0,137v0,40,2,62,35,64v32,-4,32,-23,32,-64r0,-137r44,0v-6,105,32,249,-81,244xm20,-260r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":208},"\u00d9":{"d":"105,4v-67,-4,-82,-30,-82,-107r0,-137r52,0r0,137v0,40,2,62,35,64v32,-4,32,-23,32,-64r0,-137r44,0v-6,105,32,249,-81,244xm136,-269r-14,14r-65,-40r19,-30","w":208},"\u0131":{"d":"18,-178r50,0r0,178r-50,0r0,-178","w":85},"\u02c6":{"d":"12,-199r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":165},"\u02dc":{"d":"25,-219v21,-38,54,-21,83,-12v5,0,11,-4,17,-12r16,11v-20,38,-55,25,-84,14v-5,0,-10,4,-17,11","w":165},"\u02c9":{"d":"33,-236r99,0r0,26r-99,0r0,-26","w":165},"\u02d8":{"d":"25,-246r28,0v7,24,53,24,60,0r28,0v-11,58,-104,59,-116,0","w":165},"\u02d9":{"d":"83,-201v-11,0,-24,-10,-23,-22v0,-12,10,-22,23,-22v12,0,22,9,22,22v0,12,-11,22,-22,22","w":165},"\u02da":{"d":"83,-195v-17,0,-34,-15,-34,-34v0,-18,17,-34,34,-34v17,0,34,16,34,34v0,19,-17,34,-34,34xm83,-243v-7,-1,-15,7,-14,14v0,7,8,14,14,14v6,0,13,-7,13,-14v0,-7,-6,-14,-13,-14","w":165},"\u00b8":{"d":"96,46v-1,-13,-16,-18,-32,-14r11,-32r20,0r-7,18v20,-4,36,7,36,27v-1,35,-48,37,-75,18r6,-15v15,9,37,16,41,-2","w":165},"\u02dd":{"d":"89,-258r20,22r-50,39r-13,-13xm144,-258r20,22r-50,39r-13,-13","w":165},"\u02db":{"d":"133,63v-30,8,-65,-1,-66,-29v0,-15,15,-38,43,-34v-28,19,-17,55,19,46","w":165},"\u02c7":{"d":"12,-251r39,0r32,21r32,-21r38,0r-70,55","w":165},"\u0141":{"d":"23,-240r52,0r0,84r40,-40r0,43r-40,39r0,69r78,0r0,45r-130,0r0,-78r-21,21r0,-43r21,-21r0,-119","w":153},"\u0142":{"d":"24,-240r50,0r0,81r21,-21r0,35r-21,21r0,124r-50,0r0,-91r-21,21r0,-35r21,-21r0,-114","w":98},"\u0160":{"d":"47,-113v-58,-34,-29,-131,44,-131v42,0,68,19,78,56r-43,17v-6,-20,-17,-30,-34,-30v-22,0,-34,26,-17,38v33,22,102,29,99,90v-2,46,-36,78,-85,77v-43,0,-71,-22,-83,-66r46,-13v6,24,18,36,38,36v24,0,41,-23,25,-42v-10,-11,-56,-25,-68,-32xm24,-310r39,0r32,21r32,-21r38,0r-70,55"},"\u0161":{"d":"24,-92v-31,-38,2,-89,51,-89v32,0,51,15,60,46r-35,11v-5,-16,-13,-24,-26,-24v-16,0,-20,21,-10,28v27,18,78,20,77,66v-1,35,-30,58,-68,58v-40,0,-62,-18,-66,-53r39,-7v0,29,45,38,48,10v-3,-28,-61,-26,-70,-46xm5,-251r39,0r32,21r32,-21r38,0r-70,55","w":147},"\u017d":{"d":"8,-240r154,0r0,38r-100,159r103,0r0,43r-165,0r0,-37r101,-160r-93,0r0,-43xm16,-310r39,0r32,21r32,-21r38,0r-70,55","w":165},"\u017e":{"d":"13,-178r111,0r0,32r-66,111r68,0r0,35r-119,0r0,-35r65,-107r-59,0r0,-36xm0,-251r39,0r32,21r32,-21r38,0r-70,55","w":128},"\u00a6":{"d":"63,-240r54,0r0,126r-54,0r0,-126xm63,-55r54,0r0,115r-54,0r0,-115","w":180},"\u00d0":{"d":"190,-121v0,74,-26,124,-104,121r-63,0r0,-104r-21,0r0,-35r21,0r0,-101r56,0v81,-2,111,38,111,119xm135,-123v0,-49,-10,-79,-60,-76r0,60r36,0r0,35r-36,0r0,63v52,3,60,-30,60,-82","w":202},"\u00f0":{"d":"11,-89v0,-60,34,-110,84,-84v-4,-12,-9,-23,-14,-32r-25,15r-11,-18r25,-15r-12,-20r28,-17r13,20r23,-14r11,18r-23,13v30,47,45,93,45,137v-1,52,-19,90,-71,90v-49,0,-73,-31,-73,-93xm83,-31v22,-5,21,-25,21,-58v0,-34,2,-53,-21,-58v-23,4,-21,24,-21,58v0,34,-2,53,21,58","w":165},"\u00dd":{"d":"-10,-240r58,0r34,88r36,-88r51,0r-66,139r0,101r-53,0r0,-101xm53,-269r60,-56r20,30r-65,40","w":159},"\u00fd":{"d":"-5,-178r50,0r24,109r23,-109r42,0r-53,181v-9,44,-30,67,-79,57r0,-39v26,3,40,0,44,-24xm41,-211r60,-56r20,30r-65,40","w":128},"\u00de":{"d":"181,-132v0,63,-37,80,-106,76r0,56r-52,0r0,-240r52,0r0,33v68,-5,106,13,106,75xm126,-133v0,-30,-17,-39,-51,-35r0,71v33,3,51,-6,51,-36"},"\u00fe":{"d":"161,-92v8,67,-46,121,-93,79r-1,73r-49,0r0,-300r49,0r0,85v39,-57,102,-5,94,63xm90,-147v-29,1,-23,43,-23,74v0,28,-1,41,21,41v25,0,22,-21,22,-59v0,-34,1,-51,-20,-56","w":171},"\u2212":{"d":"166,-101r-148,0r0,-38r148,0r0,38"},"\u00d7":{"d":"92,-148r41,-41r28,28r-41,41r41,41r-28,28r-41,-41r-41,41r-28,-28r41,-41r-41,-41r28,-28"},"\u00b9":{"d":"58,-241r30,0r0,117r25,0r0,28r-91,0r0,-28r26,0r0,-73v-8,7,-17,12,-26,16r0,-34v14,-7,27,-15,36,-26","w":122},"\u00b2":{"d":"6,-127v39,-34,54,-34,63,-70v0,-9,-3,-15,-11,-15v-9,0,-15,9,-16,27r-37,-7v0,-64,105,-66,105,-7v0,38,-23,46,-61,70r64,0r-3,33r-104,0r0,-31","w":122},"\u00b3":{"d":"85,-172v49,17,22,78,-27,78v-33,0,-51,-15,-55,-46r35,-5v-2,25,33,30,33,5v0,-15,-15,-18,-33,-17r0,-27v16,1,33,-1,31,-15v0,-9,-4,-14,-13,-14v-8,0,-13,6,-15,18r-35,-6v6,-52,101,-57,102,-2v0,14,-7,24,-23,31","w":122},"\u00bd":{"d":"55,-241r30,0r0,117r25,0r0,28r-91,0r0,-28r26,0r0,-73v-8,7,-17,12,-26,16r0,-34v14,-7,27,-15,36,-26xm187,-240r29,0r-115,240r-28,0xm164,-31v39,-34,54,-34,63,-70v0,-9,-3,-15,-11,-15v-9,0,-15,9,-16,27r-37,-7v0,-64,105,-66,105,-7v0,38,-23,46,-61,70r64,0r-3,33r-104,0r0,-31","w":288},"\u00bc":{"d":"54,-241r30,0r0,117r25,0r0,28r-91,0r0,-28r26,0r0,-73v-8,7,-17,12,-26,16r0,-34v14,-7,27,-15,36,-26xm187,-240r29,0r-115,240r-28,0xm218,-146r41,0r0,84r18,0r0,30r-18,0r0,32r-39,0r0,-32r-55,0r0,-28xm224,-58r0,-55r-32,55r32,0","w":288},"\u00be":{"d":"93,-172v49,17,22,78,-27,78v-33,0,-51,-15,-55,-46r35,-5v-2,25,33,30,33,5v0,-15,-15,-18,-33,-17r0,-27v16,1,33,-1,31,-15v0,-9,-4,-14,-13,-14v-8,0,-13,6,-15,18r-35,-6v6,-52,101,-57,102,-2v0,14,-7,24,-23,31xm195,-240r29,0r-115,240r-28,0xm220,-146r41,0r0,84r18,0r0,30r-18,0r0,32r-39,0r0,-32r-55,0r0,-28xm226,-58r0,-55r-32,55r32,0","w":288},"\u20a3":{"d":"75,-67r35,0r0,36r-35,0r0,31r-52,0r0,-31r-21,0r0,-36r21,0r0,-173r142,0r0,41r-90,0r0,63r69,0r0,41r-69,0r0,28","w":159},"\u011e":{"d":"70,-117v0,46,5,78,40,78v21,0,33,-16,33,-48r-36,0r0,-41r83,0r0,128r-22,0r-7,-27v-13,21,-32,31,-58,31v-59,-1,-89,-55,-89,-119v0,-71,27,-128,94,-129v49,0,76,28,82,83r-47,7v-3,-31,-15,-47,-34,-47v-35,0,-39,34,-39,84xm51,-304r28,0v7,24,53,24,60,0r28,0v-11,58,-104,59,-116,0","w":208},"\u011f":{"d":"122,-173v1,-29,18,-38,47,-34r0,33v-14,-5,-26,-1,-29,14v37,44,-11,107,-74,86v-12,5,-17,17,-6,23v39,7,107,-4,107,54v0,40,-29,60,-87,60v-73,0,-97,-55,-43,-76v-36,-16,-29,-52,7,-69v-50,-26,-23,-99,40,-99v13,0,26,3,38,8xm86,-98v15,-1,16,-11,16,-28v0,-19,-6,-29,-16,-29v-14,1,-17,12,-17,30v0,18,6,27,17,27xm124,13v0,-26,-35,-15,-60,-21v-28,18,-20,42,25,40v23,0,35,-7,35,-19xm28,-246r28,0v7,24,53,24,60,0r28,0v-11,58,-104,59,-116,0","w":165},"\u0130":{"d":"23,-240r52,0r0,240r-52,0r0,-240xm49,-259v-11,0,-24,-10,-23,-22v0,-12,10,-22,23,-22v12,0,22,9,22,22v0,12,-11,22,-22,22","w":98},"\u015e":{"d":"90,18v23,-2,37,10,37,29v0,36,-51,39,-78,18r6,-16v11,6,22,9,30,9v8,0,11,-3,11,-10v0,-14,-16,-16,-32,-15r11,-30v-36,-5,-59,-27,-69,-65r46,-13v6,24,18,36,38,36v24,0,41,-23,25,-42v-36,-25,-100,-27,-100,-89v0,-43,32,-75,76,-74v42,0,68,19,78,56r-43,17v-6,-20,-17,-30,-34,-30v-22,0,-34,26,-17,38v33,22,99,29,99,90v0,45,-34,75,-79,77"},"\u015f":{"d":"109,45v-1,35,-49,37,-75,18r6,-15v16,9,37,16,41,-2v-1,-13,-17,-18,-33,-14r11,-29v-31,-5,-48,-22,-52,-52r39,-7v0,29,45,38,48,10v-3,-28,-61,-26,-70,-46v-31,-38,2,-89,51,-89v32,0,51,15,60,46r-35,11v-5,-16,-13,-24,-26,-24v-16,0,-20,21,-10,28v27,18,79,20,77,66v0,33,-27,57,-62,58r-6,14v19,-4,37,8,36,27","w":147},"\u0106":{"d":"70,-117v1,47,2,78,35,78v19,0,31,-16,34,-48r49,3v-3,49,-34,88,-83,88v-66,0,-91,-55,-91,-124v0,-71,25,-123,91,-124v50,0,78,31,82,93r-48,4v-1,-36,-12,-54,-33,-54v-34,0,-37,33,-36,84xm74,-269r60,-56r20,30r-65,40","w":196},"\u0107":{"d":"11,-88v-1,-55,22,-92,72,-93v41,0,64,23,68,69r-46,2v-2,-17,-3,-32,-20,-33v-17,0,-25,17,-25,52v0,53,41,80,45,22r46,3v-4,47,-28,70,-70,70v-51,-1,-70,-37,-70,-92xm58,-211r60,-56r20,30r-65,40","w":159},"\u010c":{"d":"70,-117v1,47,2,78,35,78v19,0,31,-16,34,-48r49,3v-3,49,-34,88,-83,88v-66,0,-91,-55,-91,-124v0,-71,25,-123,91,-124v50,0,78,31,82,93r-48,4v-1,-36,-12,-54,-33,-54v-34,0,-37,33,-36,84xm34,-309r39,0r32,21r32,-21r38,0r-70,55","w":196},"\u010d":{"d":"6,-88v-1,-55,22,-92,72,-93v41,0,64,23,68,69r-46,2v-2,-17,-3,-32,-20,-33v-17,0,-25,17,-25,52v0,53,41,80,45,22r46,3v-4,47,-28,70,-70,70v-51,-1,-70,-37,-70,-92xm10,-251r39,0r32,21r32,-21r38,0r-70,55","w":159},"\u0111":{"d":"11,-88v-1,-52,16,-92,58,-92v17,0,29,6,36,19r0,-34r-35,0r0,-24r35,0r0,-21r49,0r0,21r19,0r0,24r-19,0r0,195r-46,0r0,-29v-8,21,-21,31,-40,31v-43,0,-57,-43,-57,-90xm83,-32v27,2,21,-41,22,-71v0,-28,-2,-42,-22,-44v-24,5,-21,25,-21,63v0,29,-1,51,21,52","w":171},"\u00ad":{"d":"13,-110r72,0r0,38r-72,0r0,-38","w":98},"\u00af":{"d":"0,-292r180,0r0,31r-180,0r0,-31","w":180},"\u00b7":{"d":"21,-119r49,0r0,53r-49,0r0,-53","w":91},"\u0100":{"d":"65,-240r53,0r69,240r-54,0r-12,-50r-68,0r-12,50r-48,0xm111,-91r-24,-98r-24,98r48,0xm40,-294r99,0r0,26r-99,0r0,-26"},"\u0101":{"d":"104,-110v-1,-21,3,-39,-17,-38v-13,0,-20,9,-21,27r-47,-5v4,-35,33,-55,72,-55v91,0,54,105,66,181r-46,0v-2,-5,-3,-14,-3,-27v-18,47,-99,39,-95,-18v4,-50,32,-61,91,-65xm81,-29v21,0,24,-27,23,-56v-25,4,-39,8,-40,34v0,15,6,22,17,22xm40,-236r99,0r0,26r-99,0r0,-26","w":171},"\u0102":{"d":"65,-240r53,0r69,240r-54,0r-12,-50r-68,0r-12,50r-48,0xm111,-91r-24,-98r-24,98r48,0xm32,-306r28,0v7,24,53,24,60,0r28,0v-11,58,-104,59,-116,0"},"\u0103":{"d":"104,-110v-1,-21,3,-39,-17,-38v-13,0,-20,9,-21,27r-47,-5v4,-35,33,-55,72,-55v91,0,54,105,66,181r-46,0v-2,-5,-3,-14,-3,-27v-18,47,-99,39,-95,-18v4,-50,32,-61,91,-65xm81,-29v21,0,24,-27,23,-56v-25,4,-39,8,-40,34v0,15,6,22,17,22xm32,-246r28,0v7,24,53,24,60,0r28,0v-11,58,-104,59,-116,0","w":171},"\u0104":{"d":"210,65v-31,8,-68,-1,-68,-30v0,-14,8,-25,25,-35r-34,0r-12,-50r-68,0r-12,50r-48,0r72,-240r53,0r69,240v-28,19,-19,57,19,48xm111,-91r-24,-98r-24,98r48,0"},"\u0105":{"d":"104,-110v-1,-21,3,-39,-17,-38v-13,0,-20,9,-21,27r-47,-5v3,-35,33,-55,71,-55v47,0,64,19,64,71v0,31,-2,89,3,110v-27,18,-17,55,18,46r4,17v-31,8,-66,0,-66,-29v0,-13,8,-25,25,-34r-27,0v-2,-5,-3,-14,-3,-27v-18,47,-99,39,-95,-18v4,-50,32,-61,91,-65xm81,-29v21,0,24,-27,23,-56v-25,4,-39,8,-40,34v0,15,6,22,17,22","w":171},"\u0108":{"d":"70,-117v1,47,2,78,35,78v19,0,31,-16,34,-48r49,3v-3,49,-34,88,-83,88v-66,0,-91,-55,-91,-124v0,-71,25,-123,91,-124v50,0,78,31,82,93r-48,4v-1,-36,-12,-54,-33,-54v-34,0,-37,33,-36,84xm34,-262r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":196},"\u0109":{"d":"11,-88v-1,-55,22,-92,72,-93v41,0,64,23,68,69r-46,2v-2,-17,-3,-32,-20,-33v-17,0,-25,17,-25,52v0,53,41,80,45,22r46,3v-4,47,-28,70,-70,70v-51,-1,-70,-37,-70,-92xm13,-199r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":159},"\u010a":{"d":"70,-117v1,47,2,78,35,78v19,0,31,-16,34,-48r49,3v-3,49,-34,88,-83,88v-66,0,-91,-55,-91,-124v0,-71,25,-123,91,-124v50,0,78,31,82,93r-48,4v-1,-36,-12,-54,-33,-54v-34,0,-37,33,-36,84xm104,-259v-11,0,-24,-10,-23,-22v0,-12,10,-22,23,-22v12,0,22,9,22,22v0,12,-11,22,-22,22","w":196},"\u010b":{"d":"11,-88v-1,-55,22,-92,72,-93v41,0,64,23,68,69r-46,2v-2,-17,-3,-32,-20,-33v-17,0,-25,17,-25,52v0,53,41,80,45,22r46,3v-4,47,-28,70,-70,70v-51,-1,-70,-37,-70,-92xm85,-201v-11,0,-24,-10,-23,-22v0,-12,10,-22,23,-22v12,0,22,9,22,22v0,12,-11,22,-22,22","w":159},"\u010e":{"d":"190,-121v0,74,-26,124,-104,121r-63,0r0,-240r56,0v81,-2,111,40,111,119xm135,-123v0,-49,-10,-80,-60,-76r0,158v52,3,60,-30,60,-82xm24,-309r39,0r32,21r32,-21r38,0r-70,55","w":202},"\u010f":{"d":"11,-88v-1,-53,16,-92,59,-92v17,0,28,6,35,19r0,-79r49,0r0,240r-46,0r0,-29v-8,21,-21,31,-40,31v-44,0,-57,-43,-57,-90xm83,-32v27,2,21,-41,22,-71v0,-28,-2,-42,-22,-44v-24,5,-21,25,-21,63v0,29,-1,51,21,52xm175,-240r36,0r-28,70r-18,0","w":209},"\u0110":{"d":"190,-121v0,74,-26,124,-104,121r-63,0r0,-104r-21,0r0,-35r21,0r0,-101r56,0v81,-2,111,38,111,119xm135,-123v0,-49,-10,-79,-60,-76r0,60r36,0r0,35r-36,0r0,63v52,3,60,-30,60,-82","w":202},"\u0112":{"d":"23,-240r146,0r0,41r-94,0r0,56r73,0r0,41r-73,0r0,59r94,0r0,43r-146,0r0,-240xm46,-294r99,0r0,26r-99,0r0,-26","w":171},"\u0113":{"d":"11,-86v0,-81,72,-123,124,-74v14,14,20,41,20,79r-93,0v0,27,0,50,23,50v15,0,24,-10,26,-30r44,3v-8,41,-32,62,-71,62v-49,0,-73,-38,-73,-90xm108,-109v1,-24,-7,-40,-23,-39v-15,0,-23,13,-23,39r46,0xm37,-236r99,0r0,26r-99,0r0,-26","w":165},"\u0114":{"d":"23,-240r146,0r0,41r-94,0r0,56r73,0r0,41r-73,0r0,59r94,0r0,43r-146,0r0,-240xm38,-306r28,0v7,24,53,24,60,0r28,0v-11,58,-104,59,-116,0","w":171},"\u0115":{"d":"11,-86v0,-81,72,-123,124,-74v14,14,20,41,20,79r-93,0v0,27,0,50,23,50v15,0,24,-10,26,-30r44,3v-8,41,-32,62,-71,62v-49,0,-73,-38,-73,-90xm108,-109v1,-24,-7,-40,-23,-39v-15,0,-23,13,-23,39r46,0xm29,-246r28,0v7,24,53,24,60,0r28,0v-11,58,-104,59,-116,0","w":165},"\u0116":{"d":"23,-240r146,0r0,41r-94,0r0,56r73,0r0,41r-73,0r0,59r94,0r0,43r-146,0r0,-240xm96,-259v-11,0,-24,-10,-23,-22v0,-12,10,-22,23,-22v12,0,22,9,22,22v0,12,-11,22,-22,22","w":171},"\u0117":{"d":"11,-86v0,-81,72,-123,124,-74v14,14,20,41,20,79r-93,0v0,27,0,50,23,50v15,0,24,-10,26,-30r44,3v-8,41,-32,62,-71,62v-49,0,-73,-38,-73,-90xm108,-109v1,-24,-7,-40,-23,-39v-15,0,-23,13,-23,39r46,0xm86,-201v-11,0,-24,-10,-23,-22v0,-12,10,-22,23,-22v12,0,22,9,22,22v0,12,-11,22,-22,22","w":165},"\u0118":{"d":"192,65v-31,8,-68,-1,-68,-30v0,-14,8,-25,25,-35r-126,0r0,-240r146,0r0,41r-94,0r0,56r73,0r0,41r-73,0r0,59r94,0r0,43v-28,19,-19,57,19,48","w":171},"\u0119":{"d":"155,-58v-2,37,-42,52,-45,83v-1,18,15,20,34,19r4,16v-31,8,-66,0,-66,-29v0,-12,6,-21,19,-29v-60,11,-90,-32,-90,-88v0,-82,77,-125,125,-72v14,15,19,41,19,77r-93,0v0,27,0,50,23,50v15,0,24,-10,26,-30xm108,-109v1,-24,-7,-40,-23,-39v-15,0,-23,13,-23,39r46,0","w":165},"\u011a":{"d":"23,-240r146,0r0,41r-94,0r0,56r73,0r0,41r-73,0r0,59r94,0r0,43r-146,0r0,-240xm25,-309r39,0r32,21r32,-21r38,0r-70,55","w":171},"\u011b":{"d":"11,-86v0,-81,72,-123,124,-74v14,14,20,41,20,79r-93,0v0,27,0,50,23,50v15,0,24,-10,26,-30r44,3v-8,41,-32,62,-71,62v-49,0,-73,-38,-73,-90xm108,-109v1,-24,-7,-40,-23,-39v-15,0,-23,13,-23,39r46,0xm16,-251r39,0r32,21r32,-21r38,0r-70,55","w":165},"\u011c":{"d":"70,-117v0,46,5,78,40,78v21,0,33,-16,33,-48r-36,0r0,-41r83,0r0,128r-22,0r-7,-27v-13,21,-32,31,-58,31v-59,-1,-89,-55,-89,-119v0,-71,27,-128,94,-129v49,0,76,28,82,83r-47,7v-3,-31,-15,-47,-34,-47v-35,0,-39,34,-39,84xm37,-262r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":208},"\u011d":{"d":"122,-173v1,-29,18,-38,47,-34r0,33v-14,-5,-26,-1,-29,14v37,44,-11,107,-74,86v-12,5,-17,17,-6,23v39,7,107,-4,107,54v0,40,-29,60,-87,60v-73,0,-97,-55,-43,-76v-36,-16,-29,-52,7,-69v-50,-26,-23,-99,40,-99v13,0,26,3,38,8xm86,-98v15,-1,16,-11,16,-28v0,-19,-6,-29,-16,-29v-14,1,-17,12,-17,30v0,18,6,27,17,27xm124,13v0,-26,-35,-15,-60,-21v-28,18,-20,42,25,40v23,0,35,-7,35,-19xm7,-217r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":165},"\u0120":{"d":"70,-117v0,46,5,78,40,78v21,0,33,-16,33,-48r-36,0r0,-41r83,0r0,128r-22,0r-7,-27v-13,21,-32,31,-58,31v-59,-1,-89,-55,-89,-119v0,-71,27,-128,94,-129v49,0,76,28,82,83r-47,7v-3,-31,-15,-47,-34,-47v-35,0,-39,34,-39,84xm108,-259v-11,0,-24,-10,-23,-22v0,-12,10,-22,23,-22v12,0,22,9,22,22v0,12,-11,22,-22,22","w":208},"\u0121":{"d":"122,-173v1,-29,18,-38,47,-34r0,33v-14,-5,-26,-1,-29,14v37,44,-11,107,-74,86v-12,5,-17,17,-6,23v39,7,107,-4,107,54v0,40,-29,60,-87,60v-73,0,-97,-55,-43,-76v-36,-16,-29,-52,7,-69v-50,-26,-23,-99,40,-99v13,0,26,3,38,8xm86,-98v15,-1,16,-11,16,-28v0,-19,-6,-29,-16,-29v-14,1,-17,12,-17,30v0,18,6,27,17,27xm124,13v0,-26,-35,-15,-60,-21v-28,18,-20,42,25,40v23,0,35,-7,35,-19xm86,-201v-11,0,-24,-10,-23,-22v0,-12,10,-22,23,-22v12,0,22,9,22,22v0,12,-11,22,-22,22","w":165},"\u0122":{"d":"70,-117v0,46,5,78,40,78v21,0,33,-16,33,-48r-36,0r0,-41r83,0r0,128r-22,0r-7,-27v-13,21,-32,31,-58,31v-59,-1,-89,-55,-89,-119v0,-71,27,-128,94,-129v49,0,76,28,82,83r-47,7v-3,-31,-15,-47,-34,-47v-35,0,-39,34,-39,84xm91,19r37,0r-28,67r-19,0","w":208},"\u0123":{"d":"122,-173v1,-29,18,-38,47,-34r0,33v-14,-5,-26,-1,-29,14v37,44,-11,107,-74,86v-12,5,-17,17,-6,23v39,7,107,-4,107,54v0,40,-29,60,-87,60v-73,0,-97,-55,-43,-76v-36,-16,-29,-52,7,-69v-50,-26,-23,-99,40,-99v13,0,26,3,38,8xm86,-98v15,-1,16,-11,16,-28v0,-19,-6,-29,-16,-29v-14,1,-17,12,-17,30v0,18,6,27,17,27xm124,13v0,-26,-35,-15,-60,-21v-28,18,-20,42,25,40v23,0,35,-7,35,-19xm102,-200r-37,0r28,-66r19,0","w":165},"\u0124":{"d":"23,-240r52,0r0,97r58,0r0,-97r53,0r0,240r-53,0r0,-98r-58,0r0,98r-52,0r0,-240xm33,-262r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":208},"\u0125":{"d":"90,-143v-17,0,-22,9,-22,31r0,112r-50,0r0,-240r50,0r0,81v9,-15,23,-22,43,-22v74,0,36,114,45,181r-49,0r0,-114v-2,-20,0,-29,-17,-29xm-25,-261r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":171},"\u0126":{"d":"75,-211r58,0r0,-29r53,0r0,29r24,0r0,39r-24,0r0,172r-53,0r0,-98r-58,0r0,98r-52,0r0,-172r-24,0r0,-39r24,0r0,-29r52,0r0,29xm75,-172r0,29r58,0r0,-29r-58,0","w":208},"\u0127":{"d":"90,-143v-17,0,-22,9,-22,31r0,112r-50,0r0,-197r-24,0r0,-29r24,0r0,-14r50,0r0,14r64,0r0,29r-64,0r0,38v9,-15,23,-22,43,-22v74,0,36,114,45,181r-49,0r0,-114v-2,-20,0,-29,-17,-29","w":171},"\u0128":{"d":"23,-240r52,0r0,240r-52,0r0,-240xm-8,-276v21,-38,54,-21,83,-12v5,0,11,-4,17,-12r16,11v-20,38,-55,25,-84,14v-5,0,-10,4,-17,11","w":98},"\u0129":{"d":"18,-178r50,0r0,178r-50,0r0,-178xm-16,-219v21,-38,54,-21,83,-12v5,0,11,-4,17,-12r16,11v-20,38,-55,25,-84,14v-5,0,-10,4,-17,11","w":85},"\u012a":{"d":"23,-240r52,0r0,240r-52,0r0,-240xm-1,-295r99,0r0,26r-99,0r0,-26","w":98},"\u012b":{"d":"18,-178r50,0r0,178r-50,0r0,-178xm-7,-236r99,0r0,26r-99,0r0,-26","w":85},"\u012c":{"d":"23,-240r52,0r0,240r-52,0r0,-240xm-9,-306r28,0v7,24,53,24,60,0r28,0v-11,58,-104,59,-116,0","w":98},"\u012d":{"d":"18,-178r50,0r0,178r-50,0r0,-178xm-16,-246r28,0v7,24,53,24,60,0r28,0v-11,58,-104,59,-116,0","w":85},"\u012e":{"d":"90,65v-30,9,-62,-2,-63,-30v0,-14,9,-26,28,-35r-32,0r0,-240r52,0r0,240v-28,13,-25,55,11,48","w":98},"\u012f":{"d":"68,-192r-50,0r0,-49r50,0r0,49xm82,63v-49,19,-86,-41,-34,-63r-30,0r0,-178r50,0r0,178v-25,11,-23,54,10,46","w":85},"\u0132":{"d":"23,-240r52,0r0,240r-52,0r0,-240xm95,-44v32,6,44,1,44,-37r0,-159r53,0r0,159v7,70,-32,96,-97,81r0,-44","w":213},"\u0133":{"d":"68,-192r-50,0r0,-49r50,0r0,49xm18,-178r50,0r0,178r-50,0r0,-178xm156,-192r-50,0r0,-49r50,0r0,49xm83,22v22,1,23,-5,23,-29r0,-171r49,0r0,172v5,56,-18,79,-72,69r0,-41","w":171},"\u0134":{"d":"-2,-44v32,6,44,1,44,-37r0,-159r53,0r0,159v7,70,-32,96,-97,81r0,-44xm-2,-260r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":116},"\u0135":{"d":"-23,-200r70,-55r71,55r-38,0r-33,-21r-32,21r-38,0xm-3,22v22,1,23,-5,23,-29r0,-171r49,0r0,172v5,57,-18,79,-72,69r0,-41","w":85},"\u0136":{"d":"23,-240r52,0r0,100r59,-100r53,0r-60,88r65,152r-54,0r-43,-111r-20,29r0,82r-52,0r0,-240xm90,19r37,0r-28,67r-19,0","w":190},"\u0137":{"d":"18,-240r50,0r0,131r50,-69r45,0r-45,60r49,118r-53,0r-28,-82r-18,25r0,57r-50,0r0,-240xm72,19r37,0r-28,67r-19,0","w":165},"\u0138":{"d":"18,-178r50,0r0,69r50,-69r45,0r-45,60r49,118r-53,0r-28,-82r-18,25r0,57r-50,0r0,-178","w":165},"\u0139":{"d":"23,-240r52,0r0,195r78,0r0,45r-130,0r0,-240xm22,-269r60,-56r20,30r-65,40","w":153},"\u013a":{"d":"18,-240r50,0r0,240r-50,0r0,-240xm16,-269r60,-56r20,30r-65,40","w":85},"\u013b":{"d":"23,-240r52,0r0,195r78,0r0,45r-130,0r0,-240xm71,19r37,0r-28,67r-19,0","w":153},"\u013c":{"d":"18,-240r50,0r0,240r-50,0r0,-240xm25,19r37,0r-28,67r-19,0","w":85},"\u013d":{"d":"23,-240r52,0r0,195r78,0r0,45r-130,0r0,-240xm110,-240r36,0r-28,70r-18,0","w":153},"\u013e":{"d":"18,-240r50,0r0,240r-50,0r0,-240xm90,-240r36,0r-28,70r-18,0","w":85},"\u013f":{"d":"23,-240r52,0r0,195r78,0r0,45r-130,0r0,-240xm99,-150r54,0r0,55r-54,0r0,-55","w":153},"\u0140":{"d":"18,-240r50,0r0,240r-50,0r0,-240xm86,-148r50,0r0,53r-50,0r0,-53","w":136},"\u0143":{"d":"21,-240r58,0r62,149r0,-149r41,0r0,240r-47,0r-73,-174r0,174r-41,0r0,-240xm72,-269r60,-56r20,30r-65,40","w":202},"\u0144":{"d":"90,-143v-22,0,-21,13,-22,39r0,104r-50,0r0,-178r47,0r0,25v8,-19,24,-28,45,-28v74,0,38,112,46,181r-49,0r0,-116v-1,-19,-2,-27,-17,-27xm60,-211r60,-56r20,30r-65,40","w":171},"\u0145":{"d":"21,-240r58,0r62,149r0,-149r41,0r0,240r-47,0r-73,-174r0,174r-41,0r0,-240xm85,19r37,0r-28,67r-19,0","w":202},"\u0146":{"d":"90,-143v-22,0,-21,13,-22,39r0,104r-50,0r0,-178r47,0r0,25v8,-19,24,-28,45,-28v74,0,38,112,46,181r-49,0r0,-116v-1,-19,-2,-27,-17,-27xm70,19r37,0r-28,67r-19,0","w":171},"\u0147":{"d":"21,-240r58,0r62,149r0,-149r41,0r0,240r-47,0r-73,-174r0,174r-41,0r0,-240xm30,-309r39,0r32,21r32,-21r38,0r-70,55","w":202},"\u0148":{"d":"90,-143v-22,0,-21,13,-22,39r0,104r-50,0r0,-178r47,0r0,25v8,-19,24,-28,45,-28v74,0,38,112,46,181r-49,0r0,-116v-1,-19,-2,-27,-17,-27xm14,-251r39,0r32,21r32,-21r38,0r-70,55","w":171},"\u0149":{"d":"106,-143v-22,0,-21,13,-22,39r0,104r-50,0r0,-178r47,0r0,25v8,-19,24,-28,45,-28v74,0,38,112,46,181r-49,0r0,-116v-1,-19,-2,-27,-17,-27xm-10,-247r45,0r0,53r-25,47r-20,0r20,-47r-20,0r0,-53","w":195},"\u014a":{"d":"114,-198v-69,0,-37,126,-44,198r-53,0r0,-240r51,0r0,24v45,-54,126,-25,126,63r0,130v5,70,-44,102,-109,85r0,-43v33,8,56,8,56,-33r0,-145v0,-26,-9,-39,-27,-39","w":210},"\u014b":{"d":"110,-181v74,0,41,112,46,181v4,52,-33,70,-81,57r0,-41v20,5,32,6,32,-16r0,-116v-1,-19,-2,-27,-17,-27v-22,0,-21,13,-22,39r0,104r-50,0r0,-178r47,0r0,25v8,-19,24,-28,45,-28","w":165},"\u014c":{"d":"101,-244v64,0,88,52,87,124v0,82,-29,124,-87,124v-64,0,-87,-53,-87,-124v0,-82,29,-124,87,-124xm101,-39v33,-6,32,-32,32,-81v0,-48,1,-75,-32,-81v-33,5,-31,33,-31,81v0,49,-1,74,31,81xm53,-294r99,0r0,26r-99,0r0,-26","w":202},"\u014d":{"d":"155,-89v0,62,-24,93,-72,93v-48,0,-72,-31,-72,-93v0,-62,24,-92,72,-92v48,0,72,30,72,92xm83,-31v22,-5,21,-25,21,-58v0,-34,2,-53,-21,-58v-23,4,-21,24,-21,58v0,34,-2,53,21,58xm34,-236r99,0r0,26r-99,0r0,-26","w":165},"\u014e":{"d":"101,-244v64,0,88,52,87,124v0,82,-29,124,-87,124v-64,0,-87,-53,-87,-124v0,-82,29,-124,87,-124xm101,-39v33,-6,32,-32,32,-81v0,-48,1,-75,-32,-81v-33,5,-31,33,-31,81v0,49,-1,74,31,81xm43,-306r28,0v7,24,53,24,60,0r28,0v-11,58,-104,59,-116,0","w":202},"\u014f":{"d":"155,-89v0,62,-24,93,-72,93v-48,0,-72,-31,-72,-93v0,-62,24,-92,72,-92v48,0,72,30,72,92xm83,-31v22,-5,21,-25,21,-58v0,-34,2,-53,-21,-58v-23,4,-21,24,-21,58v0,34,-2,53,21,58xm24,-243r28,0v7,24,53,24,60,0r28,0v-11,58,-104,59,-116,0","w":165},"\u0150":{"d":"101,-244v64,0,88,52,87,124v0,82,-29,124,-87,124v-64,0,-87,-53,-87,-124v0,-82,29,-124,87,-124xm101,-39v33,-6,32,-32,32,-81v0,-48,1,-75,-32,-81v-33,5,-31,33,-31,81v0,49,-1,74,31,81xm100,-318r20,22r-50,39r-13,-13xm155,-318r20,22r-50,39r-13,-13","w":202},"\u0151":{"d":"155,-89v0,62,-24,93,-72,93v-48,0,-72,-31,-72,-93v0,-62,24,-92,72,-92v48,0,72,30,72,92xm83,-31v22,-5,21,-25,21,-58v0,-34,2,-53,-21,-58v-23,4,-21,24,-21,58v0,34,-2,53,21,58xm81,-258r20,22r-50,39r-13,-13xm136,-258r20,22r-50,39r-13,-13","w":165},"\u0154":{"d":"98,-240v88,-17,108,103,49,135r44,105r-57,0r-32,-95r-27,0r0,95r-52,0r0,-240r75,0xm130,-168v0,-30,-22,-36,-55,-33r0,67v32,2,55,-1,55,-34xm64,-271r60,-56r20,30r-65,40","w":196},"\u0155":{"d":"18,-178r44,0r0,43v10,-33,23,-49,50,-44r0,48v-58,-10,-42,77,-44,131r-50,0r0,-178xm42,-211r60,-56r20,30r-65,40","w":110},"\u0156":{"d":"98,-240v88,-17,108,103,49,135r44,105r-57,0r-32,-95r-27,0r0,95r-52,0r0,-240r75,0xm130,-168v0,-30,-22,-36,-55,-33r0,67v32,2,55,-1,55,-34xm86,19r37,0r-28,67r-19,0","w":196},"\u0157":{"d":"18,-178r44,0r0,43v10,-33,23,-49,50,-44r0,48v-58,-10,-42,77,-44,131r-50,0r0,-178xm25,19r37,0r-28,67r-19,0","w":110},"\u0158":{"d":"98,-240v88,-17,108,103,49,135r44,105r-57,0r-32,-95r-27,0r0,95r-52,0r0,-240r75,0xm130,-168v0,-30,-22,-36,-55,-33r0,67v32,2,55,-1,55,-34xm27,-309r39,0r32,21r32,-21r38,0r-70,55","w":196},"\u0159":{"d":"18,-178r44,0r0,43v10,-33,23,-49,50,-44r0,48v-58,-10,-42,77,-44,131r-50,0r0,-178xm-5,-251r39,0r32,21r32,-21r38,0r-70,55","w":110},"\u015a":{"d":"47,-113v-58,-34,-29,-131,44,-131v42,0,68,19,78,56r-43,17v-6,-20,-17,-30,-34,-30v-22,0,-34,26,-17,38v33,22,102,29,99,90v-2,46,-36,78,-85,77v-43,0,-71,-22,-83,-66r46,-13v6,24,18,36,38,36v24,0,41,-23,25,-42v-10,-11,-56,-25,-68,-32xm61,-270r60,-56r20,30r-65,40"},"\u015b":{"d":"24,-92v-31,-38,2,-89,51,-89v32,0,51,15,60,46r-35,11v-5,-16,-13,-24,-26,-24v-16,0,-20,21,-10,28v27,18,78,20,77,66v-1,35,-30,58,-68,58v-40,0,-62,-18,-66,-53r39,-7v0,29,45,38,48,10v-3,-28,-61,-26,-70,-46xm49,-211r60,-56r20,30r-65,40","w":147},"\u015c":{"d":"47,-113v-58,-34,-29,-131,44,-131v42,0,68,19,78,56r-43,17v-6,-20,-17,-30,-34,-30v-22,0,-34,26,-17,38v33,22,102,29,99,90v-2,46,-36,78,-85,77v-43,0,-71,-22,-83,-66r46,-13v6,24,18,36,38,36v24,0,41,-23,25,-42v-10,-11,-56,-25,-68,-32xm24,-262r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0"},"\u015d":{"d":"24,-92v-31,-38,2,-89,51,-89v32,0,51,15,60,46r-35,11v-5,-16,-13,-24,-26,-24v-16,0,-20,21,-10,28v27,18,78,20,77,66v-1,35,-30,58,-68,58v-40,0,-62,-18,-66,-53r39,-7v0,29,45,38,48,10v-3,-28,-61,-26,-70,-46xm5,-199r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":147},"\u0162":{"d":"-4,-240r149,0r0,45r-49,0r0,195r-52,0r0,-195r-48,0r0,-45xm53,19r37,0r-28,67r-19,0","w":140},"\u0163":{"d":"109,0v-54,12,-83,-5,-83,-68r0,-71r-20,0r0,-39r20,0r0,-54r48,-2r0,56r33,0r0,39r-33,0v7,39,-23,114,35,101r0,38xm49,19r37,0r-28,67r-19,0","w":110},"\u0164":{"d":"-4,-240r149,0r0,45r-49,0r0,195r-52,0r0,-195r-48,0r0,-45xm0,-310r39,0r32,21r32,-21r38,0r-70,55","w":140},"\u0165":{"d":"109,0v-54,12,-83,-5,-83,-68r0,-71r-20,0r0,-39r20,0r0,-54r48,-2r0,56r33,0r0,39r-33,0v7,39,-23,114,35,101r0,38xm101,-267r36,0r-28,70r-18,0","w":110},"\u0166":{"d":"96,-161r61,0r0,46r-61,0r0,115r-52,0r0,-115r-57,0r0,-46r57,0r0,-34r-48,0r0,-45r149,0r0,45r-49,0r0,34","w":140},"\u0167":{"d":"109,0v-64,16,-93,-16,-83,-89r-20,0r0,-35r20,0r0,-15r-20,0r0,-39r22,0r4,-52r42,-4r0,56r33,0r0,39r-33,0r0,15r25,0r0,35r-25,0v-1,33,-4,60,35,51r0,38","w":110},"\u0168":{"d":"105,4v-67,-4,-82,-30,-82,-107r0,-137r52,0r0,137v0,40,2,62,35,64v32,-4,32,-23,32,-64r0,-137r44,0v-6,105,32,249,-81,244xm47,-275v21,-38,54,-21,83,-12v5,0,11,-4,17,-12r16,11v-20,38,-55,25,-84,14v-5,0,-10,4,-17,11","w":208},"\u0169":{"d":"61,4v-75,1,-35,-115,-45,-182r49,0r0,114v2,19,0,29,17,29v26,0,22,-19,22,-52r0,-91r50,0r0,178r-47,0r0,-24v-12,21,-20,28,-46,28xm28,-219v21,-38,54,-21,83,-12v5,0,11,-4,17,-12r16,11v-20,38,-55,25,-84,14v-5,0,-10,4,-17,11","w":171},"\u016a":{"d":"105,4v-67,-4,-82,-30,-82,-107r0,-137r52,0r0,137v0,40,2,62,35,64v32,-4,32,-23,32,-64r0,-137r44,0v-6,105,32,249,-81,244xm56,-295r99,0r0,26r-99,0r0,-26","w":208},"\u016b":{"d":"61,4v-75,1,-35,-115,-45,-182r49,0r0,114v2,19,0,29,17,29v26,0,22,-19,22,-52r0,-91r50,0r0,178r-47,0r0,-24v-12,21,-20,28,-46,28xm35,-236r99,0r0,26r-99,0r0,-26","w":171},"\u016c":{"d":"105,4v-67,-4,-82,-30,-82,-107r0,-137r52,0r0,137v0,40,2,62,35,64v32,-4,32,-23,32,-64r0,-137r44,0v-6,105,32,249,-81,244xm47,-305r28,0v7,24,53,24,60,0r28,0v-11,58,-104,59,-116,0","w":208},"\u016d":{"d":"61,4v-75,1,-35,-115,-45,-182r49,0r0,114v2,19,0,29,17,29v26,0,22,-19,22,-52r0,-91r50,0r0,178r-47,0r0,-24v-12,21,-20,28,-46,28xm27,-246r28,0v7,24,53,24,60,0r28,0v-11,58,-104,59,-116,0","w":171},"\u016e":{"d":"105,4v-67,-4,-82,-30,-82,-107r0,-137r52,0r0,137v0,40,2,62,35,64v32,-4,32,-23,32,-64r0,-137r44,0v-6,105,32,249,-81,244xm106,-255v-17,0,-34,-15,-34,-34v0,-18,17,-34,34,-34v17,0,34,16,34,34v0,19,-17,34,-34,34xm106,-303v-7,-1,-15,7,-14,14v0,7,8,14,14,14v6,0,13,-7,13,-14v0,-7,-6,-14,-13,-14","w":208},"\u016f":{"d":"61,4v-75,1,-35,-115,-45,-182r49,0r0,114v2,19,0,29,17,29v26,0,22,-19,22,-52r0,-91r50,0r0,178r-47,0r0,-24v-12,21,-20,28,-46,28xm85,-195v-17,0,-34,-15,-34,-34v0,-18,17,-34,34,-34v17,0,34,16,34,34v0,19,-17,34,-34,34xm85,-243v-7,-1,-15,7,-14,14v0,7,8,14,14,14v6,0,13,-7,13,-14v0,-7,-6,-14,-13,-14","w":171},"\u0170":{"d":"105,4v-67,-4,-82,-30,-82,-107r0,-137r52,0r0,137v0,40,2,62,35,64v32,-4,32,-23,32,-64r0,-137r44,0v-6,105,32,249,-81,244xm102,-318r20,22r-50,39r-13,-13xm157,-318r20,22r-50,39r-13,-13","w":208},"\u0171":{"d":"61,4v-75,1,-35,-115,-45,-182r49,0r0,114v2,19,0,29,17,29v26,0,22,-19,22,-52r0,-91r50,0r0,178r-47,0r0,-24v-12,21,-20,28,-46,28xm87,-258r20,22r-50,39r-13,-13xm142,-258r20,22r-50,39r-13,-13","w":171},"\u0172":{"d":"110,-39v32,-4,32,-23,32,-64r0,-137r44,0r0,135v-1,55,1,71,-30,96v-14,11,-21,23,-21,35v0,18,19,23,36,19r3,17v-32,9,-68,-1,-68,-30v0,-12,6,-22,19,-30v-75,9,-102,-23,-102,-105r0,-137r52,0r0,137v0,40,2,62,35,64","w":208},"\u0173":{"d":"82,-35v26,0,22,-19,22,-52r0,-91r50,0r0,178v-27,18,-17,55,18,46r4,17v-31,8,-65,-1,-66,-29v0,-13,8,-25,25,-34r-28,0r0,-24v-12,21,-20,28,-46,28v-75,1,-35,-115,-45,-182r49,0r0,114v2,19,0,29,17,29","w":171},"\u0174":{"d":"-2,-240r54,0r25,166r32,-166r48,0r30,167r29,-167r44,0r-51,241r-47,0r-32,-167r-33,167r-47,0xm62,-262r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":257},"\u0175":{"d":"-3,-178r48,0r21,108r20,-108r48,0r16,108r24,-108r39,0r-44,178r-42,0r-23,-121r-22,121r-40,0xm35,-199r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":208},"\u0176":{"d":"-10,-240r58,0r34,88r36,-88r51,0r-66,139r0,101r-53,0r0,-101xm9,-262r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":159},"\u0177":{"d":"-5,-178r50,0r24,109r23,-109r42,0r-53,181v-9,44,-30,67,-79,57r0,-39v26,3,40,0,44,-24xm-5,-199r71,-55r70,55r-38,0r-32,-21r-32,21r-39,0","w":128},"\u0179":{"d":"8,-240r154,0r0,38r-100,159r103,0r0,43r-165,0r0,-37r101,-160r-93,0r0,-43xm53,-274r60,-56r20,30r-65,40","w":165},"\u017a":{"d":"13,-178r111,0r0,32r-66,111r68,0r0,35r-119,0r0,-35r65,-107r-59,0r0,-36xm45,-211r60,-56r20,30r-65,40","w":128},"\u017b":{"d":"8,-240r154,0r0,38r-100,159r103,0r0,43r-165,0r0,-37r101,-160r-93,0r0,-43xm87,-259v-11,0,-24,-10,-23,-22v0,-12,10,-22,23,-22v12,0,22,9,22,22v0,12,-11,22,-22,22","w":165},"\u017c":{"d":"13,-178r111,0r0,32r-66,111r68,0r0,35r-119,0r0,-35r65,-107r-59,0r0,-36xm71,-201v-11,0,-24,-10,-23,-22v0,-12,10,-22,23,-22v12,0,22,9,22,22v0,12,-11,22,-22,22","w":128},"\u017f":{"d":"18,-178v-3,-60,24,-74,81,-70r0,39v-28,-1,-33,0,-33,31r0,178r-48,0r0,-178","w":85},"\u01fa":{"d":"92,-296v28,0,47,36,27,58r68,238r-54,0r-12,-50r-68,0r-12,50r-48,0r72,-239v-19,-22,0,-57,27,-57xm50,-322r74,-39r12,35r-75,23xm92,-276v-8,-1,-15,7,-14,15v0,8,7,15,14,15v7,1,15,-7,14,-15v1,-9,-7,-15,-14,-15xm111,-91r-24,-98r-24,98r48,0"},"\u01fb":{"d":"104,-110v-1,-21,3,-39,-17,-38v-13,0,-20,9,-21,27r-47,-5v4,-35,33,-55,72,-55v91,0,54,105,66,181r-46,0v-2,-5,-3,-14,-3,-27v-18,47,-99,39,-95,-18v4,-50,32,-61,91,-65xm81,-29v21,0,24,-27,23,-56v-25,4,-39,8,-40,34v0,15,6,22,17,22xm90,-195v-17,0,-34,-15,-34,-34v0,-18,17,-34,34,-34v17,0,34,16,34,34v0,19,-17,34,-34,34xm90,-243v-7,-1,-15,7,-14,14v0,7,8,14,14,14v6,0,13,-7,13,-14v0,-7,-6,-14,-13,-14xm51,-276r60,-56r20,30r-65,40","w":171},"\u01fc":{"d":"80,-240r162,0r0,41r-89,0r0,56r70,0r0,41r-70,0r0,59r89,0r0,43r-139,0r0,-56r-53,0r-19,56r-45,0xm104,-94r0,-111r-40,111r40,0xm126,-273r60,-56r20,30r-65,40","w":245},"\u01fd":{"d":"101,-110v1,-21,0,-38,-19,-38v-13,0,-21,9,-22,28r-43,-5v0,-55,80,-74,110,-38v32,-36,100,-12,107,27v2,13,7,31,7,55r-92,0v-1,28,4,50,23,50v14,0,23,-9,25,-29r42,3v-2,66,-93,82,-118,30v-21,45,-112,42,-108,-19v4,-48,32,-61,88,-64xm194,-109v0,-26,-7,-39,-22,-39v-14,0,-22,13,-23,39r45,0xm101,-85v-27,4,-39,9,-39,33v0,15,6,23,17,23v19,0,23,-28,22,-56xm95,-211r60,-56r20,30r-65,40","w":251},"\u01fe":{"d":"155,-254r28,0r-20,38v17,20,25,53,25,96v0,101,-53,145,-129,114r-11,21r-27,0r19,-38v-17,-21,-26,-54,-26,-97v0,-102,56,-146,130,-113xm123,-195v-42,-25,-58,12,-58,75v0,18,0,33,2,44xm80,-43v49,23,61,-23,58,-85v0,-11,-1,-23,-3,-34xm60,-273r60,-56r20,30r-65,40","w":202},"\u01ff":{"d":"127,-196r23,0r-17,34v14,16,22,40,22,73v0,76,-43,107,-104,87r-11,23r-23,0r17,-35v-15,-16,-23,-41,-23,-75v0,-76,44,-106,105,-86xm99,-145v-48,-21,-47,44,-42,92xm69,-31v46,16,45,-41,41,-89xm49,-212r60,-56r20,30r-65,40","w":165},"\u0384":{"d":"-39,-191r46,-71r31,21r-56,62","w":183},"\u0385":{"d":"72,-263r49,-45r17,24r-56,35xm119,-205v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v10,-1,21,9,20,19v0,12,-10,19,-20,19xm80,-224v-1,23,-40,25,-40,0v-1,-11,8,-20,20,-19v11,-1,20,9,20,19","w":178},"\u0386":{"d":"66,-240r53,0r69,240r-54,0r-12,-50r-68,0r-12,50r-48,0xm112,-91r-24,-98r-24,98r48,0xm-29,-190r46,-71r31,21r-56,62","w":185},"\u0387":{"d":"21,-119r49,0r0,53r-49,0r0,-53","w":91},"\u0388":{"d":"25,-240r146,0r0,41r-94,0r0,56r73,0r0,41r-73,0r0,59r94,0r0,43r-146,0r0,-240xm-76,-191r46,-71r31,21r-56,62","w":179},"\u0389":{"d":"24,-240r52,0r0,97r58,0r0,-97r53,0r0,240r-53,0r0,-98r-58,0r0,98r-52,0r0,-240xm-69,-190r46,-71r31,21r-56,62","w":209},"\u038a":{"d":"24,-240r52,0r0,240r-52,0r0,-240xm-69,-190r46,-71r31,21r-56,62","w":99},"\u038c":{"d":"106,-244v64,0,88,52,87,124v0,82,-29,124,-87,124v-64,0,-87,-53,-87,-124v0,-82,29,-124,87,-124xm106,-39v33,-6,32,-32,32,-81v0,-48,1,-75,-32,-81v-33,5,-31,33,-31,81v0,49,-1,74,31,81xm-43,-190r46,-71r31,21r-56,62","w":205},"\u038e":{"d":"-5,-240r58,0r34,88r36,-88r51,0r-66,139r0,101r-53,0r0,-101xm-95,-190r46,-71r31,21r-56,62","w":164},"\u038f":{"d":"74,-132v0,34,-2,81,28,90r0,42r-93,0r0,-44r41,0v-25,-19,-37,-49,-37,-89v-1,-66,34,-107,94,-111v101,-7,124,152,57,200r41,0r0,44r-93,0r0,-42v29,-7,28,-56,28,-88v0,-48,-11,-71,-33,-71v-22,0,-33,23,-33,69xm-43,-190r46,-71r31,21r-56,62","w":210},"\u0390":{"d":"18,-178r50,0r0,178r-50,0r0,-178xm26,-261r49,-45r17,24r-56,35xm73,-203v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v10,-1,21,9,20,19v0,12,-10,19,-20,19xm34,-222v-1,23,-40,25,-40,0v-1,-11,8,-20,20,-19v11,-1,20,9,20,19","w":85},"\u0391":{"d":"65,-240r53,0r69,240r-54,0r-12,-50r-68,0r-12,50r-48,0xm111,-91r-24,-98r-24,98r48,0"},"\u0392":{"d":"148,-125v69,27,46,142,-43,125r-82,0r0,-240v75,1,160,-15,160,63v0,27,-12,44,-35,52xm129,-173v0,-26,-25,-31,-56,-28r0,58v32,2,56,-2,56,-30xm136,-73v0,-33,-30,-32,-63,-31r0,63v33,2,63,-1,63,-32","w":202},"\u0393":{"d":"169,-240r0,44r-94,0r0,196r-52,0r0,-240r146,0","w":168},"\u0394":{"d":"61,-240r59,0r68,240r-193,0xm125,-45r-37,-144r-34,144r71,0","w":182},"\u0395":{"d":"23,-240r146,0r0,41r-94,0r0,56r73,0r0,41r-73,0r0,59r94,0r0,43r-146,0r0,-240","w":171},"\u0396":{"d":"8,-240r154,0r0,38r-100,159r103,0r0,43r-165,0r0,-37r101,-160r-93,0r0,-43","w":165},"\u0397":{"d":"23,-240r52,0r0,97r58,0r0,-97r53,0r0,240r-53,0r0,-98r-58,0r0,98r-52,0r0,-240","w":208},"\u0398":{"d":"102,-244v64,0,91,49,91,122v0,84,-31,126,-91,126v-64,0,-91,-49,-90,-122v0,-84,30,-126,90,-126xm102,-39v34,-5,33,-32,33,-81v0,-49,1,-76,-33,-81v-33,5,-32,33,-32,81v0,48,-1,75,32,81xm126,-143r0,42r-47,0r0,-42r47,0","w":204},"\u0399":{"d":"23,-240r52,0r0,240r-52,0r0,-240","w":98},"\u039a":{"d":"23,-240r52,0r0,100r59,-100r53,0r-60,88r65,152r-54,0r-43,-111r-20,29r0,82r-52,0r0,-240","w":190},"\u039b":{"d":"43,0r-49,0r66,-240r60,0r68,240r-52,0r-48,-189"},"\u039c":{"d":"23,-240r77,0r34,148r38,-148r75,0r0,240r-49,0r0,-201r-49,201r-39,0r-44,-201r0,201r-43,0r0,-240","w":269},"\u039d":{"d":"21,-240r58,0r62,149r0,-149r41,0r0,240r-47,0r-73,-174r0,174r-41,0r0,-240","w":202},"\u039e":{"d":"151,-240r0,44r-140,0r0,-44r140,0xm129,-144r0,44r-96,0r0,-44r96,0xm151,-44r0,44r-140,0r0,-44r140,0","w":162},"\u039f":{"d":"101,-244v64,0,88,52,87,124v0,82,-29,124,-87,124v-64,0,-87,-53,-87,-124v0,-82,29,-124,87,-124xm101,-39v33,-6,32,-32,32,-81v0,-48,1,-75,-32,-81v-33,5,-31,33,-31,81v0,49,-1,74,31,81","w":202},"\u03a0":{"d":"23,-240r163,0r0,240r-53,0r0,-195r-58,0r0,195r-52,0r0,-240","w":208},"\u03a1":{"d":"181,-165v1,64,-36,80,-106,76r0,89r-52,0r0,-240r69,0v61,-4,88,20,89,75xm126,-166v0,-30,-17,-39,-51,-35r0,71v33,3,51,-5,51,-36"},"\u03a3":{"d":"10,-240r140,0r0,41r-87,0r48,66r-53,90r98,0r0,43r-146,0r0,-43r50,-86r-50,-70r0,-41","w":160},"\u03a4":{"d":"-4,-240r149,0r0,45r-49,0r0,195r-52,0r0,-195r-48,0r0,-45","w":140},"\u03a5":{"d":"-10,-240r58,0r34,88r36,-88r51,0r-66,139r0,101r-53,0r0,-101","w":159},"\u03a6":{"d":"140,-218v51,7,81,43,82,98v0,55,-27,88,-82,98r0,29r-46,0r0,-29v-55,-8,-82,-42,-82,-98v0,-55,31,-91,82,-98r0,-29r46,0r0,29xm94,-178v-41,10,-42,105,0,115r0,-115xm140,-63v41,-10,42,-105,0,-115r0,115","w":234},"\u03a7":{"d":"2,-240r58,0r29,62r30,-62r51,0r-57,109r64,131r-58,0r-35,-78r-39,78r-50,0r65,-123","w":171},"\u03a8":{"d":"236,-167v4,81,-17,115,-82,124r0,43r-53,0r0,-43v-93,-2,-82,-98,-81,-197r52,0v7,56,-19,144,29,153r0,-153r53,0r0,153v47,-8,23,-95,29,-153r53,0r0,73","w":255},"\u03a9":{"d":"74,-132v0,34,-2,81,28,90r0,42r-93,0r0,-44r41,0v-25,-19,-37,-49,-37,-89v-1,-66,34,-107,94,-111v101,-7,124,152,57,200r41,0r0,44r-93,0r0,-42v29,-7,28,-56,28,-88v0,-48,-11,-71,-33,-71v-22,0,-33,23,-33,69","w":214},"\u03aa":{"d":"23,-240r52,0r0,240r-52,0r0,-240xm99,-281v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm19,-262v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":98},"\u03ab":{"d":"-10,-240r58,0r34,88r36,-88r51,0r-66,139r0,101r-53,0r0,-101xm130,-281v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm50,-262v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":159},"\u03ac":{"d":"10,-89v0,-80,88,-130,121,-55r9,-34r49,0r-30,84r34,94r-51,0r-13,-41v-13,30,-31,45,-53,45v-42,0,-66,-48,-66,-93xm89,-146v-34,7,-33,109,1,115v21,-7,20,-27,30,-59v-11,-32,-9,-48,-31,-56xm60,-211r60,-56r20,30r-65,40","w":195},"\u03ad":{"d":"66,-127v0,21,10,20,35,20r0,33v-26,1,-39,-2,-39,20v0,35,38,31,45,-2r42,7v-16,39,-27,49,-70,53v-64,7,-94,-72,-40,-97v-48,-26,-17,-88,40,-88v38,0,60,16,66,49r-44,9v-1,-31,-35,-35,-35,-4xm55,-211r60,-56r20,30r-65,40","w":152},"\u03ae":{"d":"91,-150v-43,12,-16,99,-23,150r-50,0r0,-178r50,0r0,25v20,-48,104,-33,88,37r0,176r-49,0r0,-176v-1,-26,3,-32,-16,-34xm65,-211r60,-56r20,30r-65,40","w":173},"\u03af":{"d":"18,-178r50,0r0,178r-50,0r0,-178xm15,-211r60,-56r20,30r-65,40","w":85},"\u03b0":{"d":"86,4v-91,0,-66,-100,-69,-182r50,0r0,103v2,28,-4,41,18,41v22,0,18,-13,18,-41r0,-103r50,0v-3,81,22,182,-67,182xm69,-261r49,-45r17,24r-56,35xm116,-203v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v10,-1,21,9,20,19v0,12,-10,19,-20,19xm77,-222v-1,23,-40,25,-40,0v-1,-11,8,-20,20,-19v11,-1,20,9,20,19","w":169},"\u03b1":{"d":"10,-89v0,-80,88,-130,121,-55r9,-34r49,0r-30,84r34,94r-51,0r-13,-41v-13,30,-31,45,-53,45v-42,0,-66,-48,-66,-93xm89,-146v-34,7,-33,109,1,115v21,-7,20,-27,30,-59v-11,-32,-9,-48,-31,-56","w":195},"\u03b2":{"d":"121,-136v79,11,57,143,-16,140v-17,0,-28,-6,-36,-18r0,74r-50,0r0,-215v0,-58,15,-85,72,-89v70,-5,95,92,30,108xm90,-214v-24,0,-21,19,-21,52r0,114v0,12,11,19,22,19v22,0,29,-24,29,-50v0,-23,-8,-40,-32,-39r0,-29v22,0,26,-12,27,-31v1,-21,-8,-36,-25,-36","w":181},"\u03b3":{"d":"43,60r0,-60r-47,-178r49,0r29,115r29,-115r42,0r-52,178r0,60r-50,0","w":138},"\u03b4":{"d":"11,-84v0,-42,30,-77,65,-81r-44,-42r0,-33r115,0r0,33r-60,0v36,28,80,72,80,123v0,51,-29,88,-78,88v-50,1,-78,-36,-78,-88xm119,-83v0,-29,-3,-51,-26,-51v-18,0,-27,18,-27,52v0,34,8,51,26,51v18,0,27,-17,27,-52","w":177},"\u03b5":{"d":"66,-127v0,21,10,20,35,20r0,33v-26,1,-39,-2,-39,20v0,35,38,31,45,-2r42,7v-16,39,-27,49,-70,53v-64,7,-94,-72,-40,-97v-48,-26,-17,-88,40,-88v38,0,60,16,66,49r-44,9v-1,-31,-35,-35,-35,-4","w":152},"\u03b6":{"d":"64,1v-41,-1,-53,-28,-53,-70v0,-47,20,-91,62,-133r-56,0r0,-38r104,0r0,31v-46,47,-71,98,-56,160v21,12,59,2,59,49v0,17,-5,38,-14,61r-44,-5v8,-19,12,-34,12,-44v0,-10,-4,-11,-14,-11","w":125},"\u03b7":{"d":"91,-150v-43,12,-16,99,-23,150r-50,0r0,-178r50,0r0,25v20,-48,104,-33,88,37r0,176r-49,0r0,-176v-1,-26,3,-32,-16,-34","w":173},"\u03b8":{"d":"11,-120v0,-67,19,-124,78,-124v58,0,78,58,78,124v0,66,-20,124,-78,124v-58,0,-78,-58,-78,-124xm58,-140r61,0v-1,-46,-11,-69,-30,-69v-19,0,-29,23,-31,69xm58,-108v0,51,11,77,31,77v20,0,29,-26,30,-77r-61,0","w":177},"\u03b9":{"d":"18,-178r50,0r0,178r-50,0r0,-178","w":85},"\u03ba":{"d":"18,-178r50,0r0,69r50,-69r45,0r-45,60r49,118r-53,0r-28,-82r-18,25r0,57r-50,0r0,-178","w":165},"\u03bb":{"d":"-4,0r50,-162r-22,-78r50,0r71,240r-51,0r-26,-102r-30,102r-42,0","w":139},"\u03bc":{"d":"87,-34v21,-4,20,-16,21,-50r0,-94r49,0r0,178r-48,0r0,-24v-4,36,-41,38,-44,1r0,84r-47,0r0,-239r50,0r0,94v-1,32,-4,46,19,50","w":175},"\u03bd":{"d":"-4,-178r48,0r24,105r25,-105r41,0r-49,178r-39,0","w":128},"\u03be":{"d":"65,-72v1,51,78,13,78,75v0,15,-4,35,-11,59r-39,-7v6,-29,14,-49,-14,-50v-48,-2,-68,-21,-69,-68v0,-38,18,-53,47,-64v-47,-10,-48,-62,-1,-75r-39,0r0,-38r120,0r0,38v-33,-2,-60,0,-61,30v-1,27,20,31,48,29r0,38v-35,-2,-60,1,-59,33","w":143},"\u03bf":{"d":"155,-89v0,62,-24,93,-72,93v-48,0,-72,-31,-72,-93v0,-62,24,-92,72,-92v48,0,72,30,72,92xm83,-31v22,-5,21,-25,21,-58v0,-34,2,-53,-21,-58v-23,4,-21,24,-21,58v0,34,-2,53,21,58","w":165},"\u03c0":{"d":"172,-137r0,137r-50,0r0,-137r-49,0r0,137r-50,0r0,-137r-18,0r0,-41r184,0r0,41r-17,0","w":194},"\u03c1":{"d":"162,-89v1,53,-19,93,-63,95v-19,0,-30,-6,-33,-19r0,73r-50,0v7,-98,-30,-241,73,-241v48,0,73,30,73,92xm90,-31v23,-4,21,-24,21,-58v0,-34,2,-53,-21,-58v-23,4,-21,24,-21,58v0,37,-2,54,21,58","w":171},"\u03c2":{"d":"84,-144v-32,3,-30,88,-4,98v26,10,70,7,70,49v0,15,-3,35,-11,59r-45,-9v8,-21,22,-48,-6,-50v-50,-3,-78,-37,-78,-91v0,-72,61,-119,116,-80v12,8,19,25,24,49r-45,8v-3,-22,-10,-33,-21,-33","w":155},"\u03c3":{"d":"137,-142v15,14,17,26,17,55v0,61,-24,91,-72,91v-48,0,-72,-31,-72,-93v0,-73,36,-102,98,-89r63,0r0,36r-34,0xm82,-31v22,-5,21,-25,21,-58v0,-34,2,-53,-21,-58v-23,4,-21,24,-21,58v0,34,-2,53,21,58","w":174},"\u03c4":{"d":"-1,-178r134,0r0,40r-43,0r0,138r-50,0r0,-138r-41,0r0,-40","w":131},"\u03c5":{"d":"86,4v-91,0,-66,-100,-69,-182r50,0r0,103v2,28,-4,41,18,41v22,0,18,-13,18,-41r0,-103r50,0v-3,81,22,182,-67,182","w":169},"\u03c6":{"d":"213,-88v0,49,-28,91,-79,92r0,56r-45,0r0,-56v-89,3,-105,-149,-29,-177r14,41v-22,24,-16,94,15,100r0,-148v77,-9,123,23,124,92xm134,-31v38,-6,37,-111,0,-116r0,116","w":223},"\u03c7":{"d":"49,-65r-47,-113r47,0r29,68r34,-68r42,0r-52,118r52,119r-47,0r-34,-82r-39,82r-42,0","w":148},"\u03c8":{"d":"210,-178v0,86,15,184,-72,181r0,57r-49,0r0,-57v-51,-6,-72,-27,-72,-88r0,-93r50,0v1,41,-5,98,4,130v2,7,9,11,18,12r0,-142r49,0r0,142v23,-4,22,-18,22,-49r0,-93r50,0","w":227},"\u03c9":{"d":"77,-34v22,-8,8,-65,12,-99r45,0v3,34,-9,88,11,99v11,0,17,-16,17,-47v0,-33,-8,-60,-23,-82r37,-20v27,37,32,54,37,101v7,67,-61,114,-102,67v-39,46,-101,0,-101,-66v0,-48,15,-75,36,-102r38,20v-15,22,-23,49,-23,82v0,31,5,47,16,47","w":222},"\u03ca":{"d":"18,-178r50,0r0,178r-50,0r0,-178xm93,-223v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm13,-204v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":85},"\u03cb":{"d":"86,4v-91,0,-66,-100,-69,-182r50,0r0,103v2,28,-4,41,18,41v22,0,18,-13,18,-41r0,-103r50,0v-3,81,22,182,-67,182xm137,-223v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm57,-204v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":169},"\u03cc":{"d":"155,-89v0,62,-24,93,-72,93v-48,0,-72,-31,-72,-93v0,-62,24,-92,72,-92v48,0,72,30,72,92xm83,-31v22,-5,21,-25,21,-58v0,-34,2,-53,-21,-58v-23,4,-21,24,-21,58v0,34,-2,53,21,58xm57,-211r60,-56r20,30r-65,40","w":165},"\u03cd":{"d":"86,4v-91,0,-66,-100,-69,-182r50,0r0,103v2,28,-4,41,18,41v22,0,18,-13,18,-41r0,-103r50,0v-3,81,22,182,-67,182xm59,-211r60,-56r20,30r-65,40","w":169},"\u03ce":{"d":"77,-34v22,-8,8,-65,12,-99r45,0v3,34,-9,88,11,99v11,0,17,-16,17,-47v0,-33,-8,-60,-23,-82r37,-20v27,37,32,54,37,101v7,67,-61,114,-102,67v-39,46,-101,0,-101,-66v0,-48,15,-75,36,-102r38,20v-15,22,-23,49,-23,82v0,31,5,47,16,47xm91,-211r60,-56r20,30r-65,40","w":222},"\u0401":{"d":"23,-240r146,0r0,41r-94,0r0,56r73,0r0,41r-73,0r0,59r94,0r0,43r-146,0r0,-240xm146,-281v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm66,-262v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":171},"\u0402":{"d":"125,-185v71,3,37,116,43,185v5,52,-33,70,-81,57r0,-41v19,4,32,8,32,-16r0,-116v-1,-21,0,-29,-17,-29v-18,0,-20,11,-20,30r0,115r-53,0r0,-199r-32,0r0,-41r150,0r0,41r-65,0r0,37v9,-15,23,-23,43,-23","w":182},"\u0403":{"d":"169,-240r0,44r-94,0r0,196r-52,0r0,-240r146,0xm52,-273r60,-56r20,30r-65,40","w":168,"k":{"\u045e":-5,"\u0459":24,"\u0454":20,"\u044f":18,"\u044e":8,"\u044a":-6,"\u0447":6,"\u0446":9,"\u0445":-1,"\u0444":24,"\u0443":-3,"\u0442":-3,"\u0441":19,"\u0440":7,"\u043f":8,"\u043e":19,"\u043d":8,"\u043c":8,"\u043b":22,"\u043a":8,"\u0438":8,"\u0437":13,"\u0435":20,"\u0434":22,"\u0432":8,"\u0430":19,"\u0427":-5,"\u0424":7,"\u0423":-17,"\u0422":-14,"\u041e":-1,"\u041b":10,"\u0414":12,"\u040e":-16,"\u040b":-15,"\u0409":10}},"\u0404":{"d":"12,-119v0,-71,27,-124,94,-125v51,-1,83,27,90,66r-52,11v-4,-23,-17,-34,-37,-34v-24,0,-38,19,-42,57r71,0r0,40r-71,0v-3,79,72,86,85,22r47,10v-7,51,-37,76,-91,76v-67,1,-94,-55,-94,-123","w":201},"\u0405":{"d":"47,-113v-58,-34,-29,-131,44,-131v42,0,68,19,78,56r-43,17v-6,-20,-17,-30,-34,-30v-22,0,-34,26,-17,38v33,22,102,29,99,90v-2,46,-36,78,-85,77v-43,0,-71,-22,-83,-66r46,-13v6,24,18,36,38,36v24,0,41,-23,25,-42v-10,-11,-56,-25,-68,-32"},"\u0406":{"d":"23,-240r52,0r0,240r-52,0r0,-240","w":98},"\u0407":{"d":"23,-240r52,0r0,240r-52,0r0,-240xm99,-281v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm19,-262v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":98},"\u0408":{"d":"-2,-44v32,6,44,1,44,-37r0,-159r53,0r0,159v7,70,-32,96,-97,81r0,-44","w":116},"\u0409":{"d":"272,-75v0,74,-59,79,-136,75r-48,-189r-45,189r-49,0r66,-240r60,0r25,89v73,-4,127,4,127,76xm217,-74v2,-35,-24,-39,-60,-36r20,71v29,3,38,-10,40,-35","w":278,"k":{"\u044a":-3,"\u042a":11,"\u0427":2,"\u0423":1,"\u0422":13,"\u040e":2,"\u040b":3}},"\u040a":{"d":"292,-75v-2,54,-26,75,-90,75r-69,0r0,-100r-58,0r0,100r-52,0r0,-240r52,0r0,99r58,0r0,-99r53,0r0,89v67,-4,108,14,106,76xm236,-75v0,-30,-18,-37,-50,-35r0,69v31,2,50,-3,50,-34","w":297,"k":{"\u044a":-2,"\u042a":11,"\u0427":3,"\u0423":1,"\u0422":13,"\u040e":2,"\u040b":3}},"\u040b":{"d":"125,-185v71,3,34,117,43,185r-49,0r0,-116v-1,-21,0,-29,-17,-29v-18,0,-20,11,-20,30r0,115r-53,0r0,-199r-32,0r0,-41r150,0r0,41r-65,0r0,37v9,-15,23,-23,43,-23","w":187},"\u040c":{"d":"23,-240r52,0r0,100r59,-100r53,0r-60,88r65,152r-54,0r-43,-111r-20,29r0,82r-52,0r0,-240xm72,-273r60,-56r20,30r-65,40","w":190,"k":{"\u0454":6,"\u0447":15,"\u0444":7,"\u0443":12,"\u0442":9,"\u0441":6,"\u043e":5,"\u0435":6,"\u0431":7,"\u0424":13,"\u0421":8,"\u041e":7,"\u0417":2,"\u0404":8}},"\u040e":{"d":"65,-72r-72,-168r54,0r41,105r36,-105r49,0r-65,180v-15,48,-29,63,-88,60r0,-44v27,0,39,2,45,-28xm32,-304r28,0v7,24,53,24,60,0r28,0v-11,58,-104,59,-116,0","w":164,"k":{"\u0459":15,"\u0454":10,"\u044f":10,"\u044e":5,"\u0447":3,"\u0446":6,"\u0445":-4,"\u0444":12,"\u0442":-6,"\u0441":10,"\u0440":4,"\u043f":5,"\u043e":10,"\u043d":5,"\u043c":5,"\u043b":14,"\u043a":5,"\u0438":5,"\u0437":6,"\u0436":-3,"\u0435":11,"\u0434":14,"\u0431":4,"\u0430":10,"\u042f":1,"\u0427":-8,"\u0424":6,"\u0422":-17,"\u0421":2,"\u041e":2,"\u041b":9,"\u0417":-1,"\u0414":10,"\u0410":9,"\u040e":-20,"\u040b":-18,"\u0409":9,"\u0404":2}},"\u040f":{"d":"85,0r-62,0r0,-240r52,0r0,195r58,0r0,-195r53,0r0,240r-63,0r-4,51r-31,-1","w":208},"\u0410":{"d":"65,-240r53,0r69,240r-54,0r-12,-50r-68,0r-12,50r-48,0xm111,-91r-24,-98r-24,98r48,0","k":{"\u045e":3,"\u0459":-16,"\u0447":6,"\u0443":3,"\u0442":3,"\u043b":-15,"\u0437":-5,"\u042a":7,"\u0427":12,"\u0424":5,"\u0423":-5,"\u0422":9,"\u0421":2,"\u041e":2,"\u041b":-18,"\u0417":-3,"\u040e":-4,"\u0409":-18,"\u0404":2,"\u00bb":-2,";":-4,":":-4,".":-8,"-":-4,",":-8}},"\u0411":{"d":"181,-75v0,83,-76,77,-158,75r0,-240r136,0r0,41r-84,0r0,48v68,-3,106,14,106,76xm126,-75v0,-30,-18,-37,-51,-35r0,69v31,1,51,-3,51,-34","w":192,"k":{"\u045e":4,"\u0443":4,"\u0442":1,"\u0436":4,"\u0428":1,"\u0427":5,"\u0422":2,"\u0416":2,"\u0410":-4,"\u040b":1}},"\u0412":{"d":"148,-125v69,27,46,142,-43,125r-82,0r0,-240v75,1,160,-15,160,63v0,27,-12,44,-35,52xm129,-173v0,-26,-25,-31,-56,-28r0,58v32,2,56,-2,56,-30xm136,-73v0,-33,-30,-32,-63,-31r0,63v33,2,63,-1,63,-32","w":202,"k":{"\u045e":-4,"\u044a":-8,"\u0447":2,"\u0443":-4,"\u0442":-5,"\u0436":-3,"\u0427":4,"\u0422":-4,"\u0416":1,"\u0410":-4,"\u040e":1,"\u040b":-5}},"\u0413":{"d":"169,-240r0,41r-94,0r0,199r-52,0r0,-240r146,0","w":168,"k":{"\u045e":-5,"\u0459":24,"\u0454":20,"\u044f":18,"\u044e":8,"\u044a":-6,"\u0447":6,"\u0446":9,"\u0445":-1,"\u0444":24,"\u0443":-3,"\u0442":-3,"\u0441":19,"\u0440":7,"\u043f":8,"\u043e":19,"\u043d":8,"\u043c":8,"\u043b":22,"\u043a":8,"\u0438":8,"\u0437":13,"\u0435":20,"\u0434":22,"\u0432":8,"\u0430":19,"\u0427":-5,"\u0424":7,"\u0423":-17,"\u0422":-14,"\u0421":-1,"\u041e":-1,"\u041b":10,"\u0414":12,"\u040e":-16,"\u040b":-15,"\u0409":10,";":8,":":8,".":35,"-":26,",":35}},"\u0414":{"d":"10,-44r52,-196r68,0r47,196r15,0r0,93r-39,0r-5,-49r-110,0r-4,49r-39,0r0,-93r15,0xm58,-44r66,0r-29,-145r-7,0","w":186},"\u0415":{"d":"23,-240r146,0r0,41r-94,0r0,56r73,0r0,41r-73,0r0,59r94,0r0,43r-146,0r0,-240","w":171,"k":{"\u0424":6}},"\u0416":{"d":"197,-137r75,137r-55,0r-57,-105v-6,29,0,72,-2,105r-53,0v-2,-34,4,-75,-2,-105r-57,105r-51,0r71,-125r-66,-115r55,0r46,88r4,1r0,-89r53,0r0,89r49,-89r51,0","w":258,"k":{"\u045e":-5,"\u0454":-1,"\u0447":11,"\u0443":5,"\u0441":-1,"\u043e":-2,"\u0437":-7,"\u0435":-1,"\u0430":-8,"\u0424":8,"\u0421":2,"\u041e":2,"\u0417":-5,"\u0404":2}},"\u0417":{"d":"85,-203v-20,0,-23,10,-28,36r-46,-9v10,-48,31,-63,80,-68v72,-7,98,94,36,118v27,8,40,28,40,58v0,72,-104,94,-141,50v-11,-13,-17,-33,-22,-57r47,-7v7,30,8,41,34,43v18,1,28,-15,28,-33v0,-25,-16,-35,-45,-33r0,-39v27,2,42,-5,42,-30v0,-19,-9,-29,-25,-29","w":178,"k":{"\u045e":-5,"\u0459":-1,"\u044f":1,"\u0447":1,"\u0445":-5,"\u0443":-5,"\u0442":-7,"\u043b":-2,"\u042f":2,"\u0427":2,"\u0422":-5,"\u041b":-4,"\u0417":-7,"\u0414":-9,"\u0410":-5,"\u040b":-7,"\u0409":-4}},"\u0418":{"d":"75,-25r0,25r-52,0r0,-240r52,0r0,135r62,-108r0,-27r53,0r0,240r-53,0r0,-134v-19,38,-42,72,-62,109","w":212},"\u0419":{"d":"75,-25r0,25r-52,0r0,-240r52,0r0,135r62,-108r0,-27r53,0r0,240r-53,0r0,-134v-19,38,-42,72,-62,109xm51,-304r28,0v7,24,53,24,60,0r28,0v-11,58,-104,59,-116,0","w":212},"\u041a":{"d":"23,-240r52,0r0,100r59,-100r53,0r-60,88r65,152r-54,0r-43,-111r-20,29r0,82r-52,0r0,-240","w":190,"k":{"\u0454":6,"\u0447":15,"\u0444":7,"\u0443":12,"\u0442":9,"\u0441":6,"\u043e":5,"\u0437":1,"\u0435":6,"\u0431":7,"\u0424":13,"\u0421":8,"\u041e":7,"\u0417":2,"\u0404":8}},"\u041b":{"d":"43,0r-49,0r66,-240r60,0r68,240r-52,0r-48,-189"},"\u041c":{"d":"23,-240r77,0r34,148r38,-148r75,0r0,240r-49,0r0,-201r-49,201r-39,0r-44,-201r0,201r-43,0r0,-240","w":269},"\u041d":{"d":"23,-240r52,0r0,97r58,0r0,-97r53,0r0,240r-53,0r0,-98r-58,0r0,98r-52,0r0,-240","w":208},"\u041e":{"d":"101,-244v64,0,88,52,87,124v0,82,-29,124,-87,124v-64,0,-87,-53,-87,-124v0,-82,29,-124,87,-124xm101,-39v33,-6,32,-32,32,-81v0,-48,1,-75,-32,-81v-33,5,-31,33,-31,81v0,49,-1,74,31,81","w":202,"k":{"\u0459":1,"\u042f":2,"\u042a":-7,"\u0427":1,"\u0425":4,"\u0423":2,"\u0422":-2,"\u0417":-4,"\u0416":5,"\u0414":-3,"\u040e":3,"\u040b":-3}},"\u041f":{"d":"23,-240r163,0r0,240r-53,0r0,-195r-58,0r0,195r-52,0r0,-240","w":208},"\u0420":{"d":"181,-165v1,64,-36,80,-106,76r0,89r-52,0r0,-240r69,0v61,-4,88,20,89,75xm126,-166v0,-30,-17,-39,-51,-35r0,71v33,3,51,-5,51,-36","k":{"\u0459":13,"\u0454":1,"\u0444":3,"\u0441":1,"\u043e":1,"\u043b":11,"\u0437":-2,"\u0435":2,"\u0434":11,"\u0430":1,"\u042f":-1,"\u0427":-1,"\u0421":-3,"\u041b":7,"\u0414":9,"\u0410":8,"\u0409":7,".":29,"-":1,",":29}},"\u0421":{"d":"70,-117v1,47,2,78,35,78v19,0,31,-16,34,-48r49,3v-3,49,-34,88,-83,88v-66,0,-91,-55,-91,-124v0,-71,25,-123,91,-124v50,0,78,31,82,93r-48,4v-1,-36,-12,-54,-33,-54v-34,0,-37,33,-36,84","w":196,"k":{"\u045e":-7,"\u0447":-1,"\u0443":-7,"\u0442":-10,"\u0425":2,"\u0424":-2,"\u0422":-6,"\u0421":-3,"\u041e":-3,"\u041b":-3,"\u0417":-8,"\u0416":3,"\u0410":-3,"\u040e":1,"\u040b":-7,"\u0409":-3}},"\u0422":{"d":"-4,-240r149,0r0,45r-49,0r0,195r-52,0r0,-195r-48,0r0,-45","w":140,"k":{"\u045e":-6,"\u0459":9,"\u0454":12,"\u044f":13,"\u044a":-8,"\u0447":4,"\u0446":8,"\u0445":-3,"\u0444":15,"\u0443":-5,"\u0442":-5,"\u0441":12,"\u0440":5,"\u043f":7,"\u043e":12,"\u043d":7,"\u043c":7,"\u043b":10,"\u043a":7,"\u0438":7,"\u0437":12,"\u0436":-2,"\u0435":12,"\u0434":10,"\u0433":7,"\u0432":7,"\u0430":13,"\u042f":-2,"\u0424":5,"\u0423":-17,"\u0422":-14,"\u0421":-1,"\u041e":-2,"\u041b":8,"\u0417":-6,"\u0414":8,"\u0410":7,"\u040e":-16,"\u040b":-15,"\u0409":8,"\u0404":-1,"\u00bb":14,";":6,":":6,".":13,"-":8,",":13}},"\u0423":{"d":"65,-72r-72,-168r54,0r41,105r36,-105r49,0r-65,180v-15,48,-29,63,-88,60r0,-44v27,0,39,2,45,-28","w":164,"k":{"\u045e":-9,"\u0459":14,"\u0454":9,"\u044f":9,"\u044e":4,"\u0447":2,"\u0446":5,"\u0445":-5,"\u0444":12,"\u0443":-6,"\u0442":-7,"\u0441":9,"\u0440":4,"\u043f":4,"\u043e":9,"\u043d":4,"\u043c":4,"\u043b":13,"\u043a":4,"\u0438":4,"\u0437":5,"\u0436":-4,"\u0435":10,"\u0434":13,"\u0431":4,"\u0430":10,"\u042f":1,"\u0427":-9,"\u0424":5,"\u0423":-21,"\u0422":-18,"\u0421":1,"\u041e":1,"\u041b":8,"\u0417":-2,"\u0414":9,"\u0410":9,"\u040b":-20,"\u0409":8,"\u0404":2,"\u00bb":7,";":4,":":4,".":21,"-":6,",":21}},"\u0424":{"d":"139,-218v52,7,82,41,82,98v0,55,-27,88,-82,98r0,29r-45,0r0,-29v-55,-8,-82,-42,-82,-98v0,-55,31,-91,82,-98r0,-29r45,0r0,29xm94,-178v-41,10,-42,105,0,115r0,-115xm139,-63v41,-10,42,-105,0,-115r0,115","w":233,"k":{"\u0459":5,"\u043b":4,"\u0434":4,"\u042f":4,"\u042a":1,"\u0427":1,"\u0425":9,"\u0423":8,"\u041b":2,"\u0416":10,"\u0414":5,"\u0410":3,"\u040e":9,"\u0409":2}},"\u0425":{"d":"2,-240r58,0r29,62r30,-62r51,0r-57,109r64,131r-58,0r-35,-78r-39,78r-50,0r65,-123","w":171,"k":{"\u0454":2,"\u0447":12,"\u0444":4,"\u0443":4,"\u0442":3,"\u0441":2,"\u043e":1,"\u0437":-3,"\u0435":2,"\u0430":-4,"\u0424":9,"\u0421":3,"\u041e":2,"\u0417":-1,"\u0404":3}},"\u0426":{"d":"188,-45r35,0r0,94r-39,0r-4,-49r-156,0r0,-240r53,0r0,195r58,0r0,-195r53,0r0,195","w":222},"\u0427":{"d":"70,-153v-5,43,33,44,52,19r0,-106r53,0r0,240r-53,0r0,-88v-49,33,-104,2,-104,-67r0,-85r52,0r0,87","w":197},"\u0428":{"d":"24,0r0,-240r53,0r0,195r44,0r0,-195r53,0r0,195r44,0r0,-195r52,0r0,240r-246,0","w":294},"\u0429":{"d":"269,-45r36,0r0,94r-39,0r-5,-49r-238,0r0,-240r52,0r0,195r44,0r0,-195r53,0r0,195r44,0r0,-195r53,0r0,195","w":302},"\u042a":{"d":"206,-74v0,81,-76,76,-159,74r0,-192r-56,0r0,-48r109,0r0,89v69,-3,106,14,106,77xm150,-74v0,-31,-17,-39,-50,-36r0,71v33,3,50,-5,50,-35","w":211,"k":{"\u044a":-2,"\u042a":12,"\u0427":3,"\u0423":1,"\u0422":13,"\u040e":2,"\u040b":4}},"\u042b":{"d":"181,-75v0,83,-76,77,-158,75r0,-240r52,0r0,89v68,-3,106,14,106,76xm126,-74v0,-31,-18,-39,-51,-36r0,71v33,3,51,-5,51,-35xm207,-240r52,0r0,240r-52,0r0,-240","w":282},"\u042c":{"d":"181,-75v0,83,-76,77,-158,75r0,-240r52,0r0,89v68,-3,106,14,106,76xm126,-74v0,-31,-18,-39,-51,-36r0,71v33,3,51,-5,51,-35","w":187,"k":{"\u044a":-2,"\u042a":12,"\u0427":3,"\u0423":1,"\u0422":13,"\u040e":2,"\u040b":4}},"\u042d":{"d":"189,-119v-1,68,-25,123,-94,123v-53,0,-83,-25,-90,-76r47,-10v6,29,20,43,43,43v25,0,39,-22,42,-65r-72,0r0,-40r71,0v2,-64,-67,-78,-79,-23r-51,-11v7,-39,39,-67,89,-66v67,1,95,53,94,125","w":201,"k":{"\u0459":1,"\u042f":2,"\u042a":-6,"\u0427":1,"\u0423":3,"\u0422":-1,"\u041b":1,"\u0414":-2,"\u0410":1,"\u040e":4,"\u040b":-2,"\u0409":1}},"\u042e":{"d":"191,-244v64,0,87,53,87,124v0,82,-29,124,-87,124v-52,0,-81,-34,-87,-102r-29,0r0,98r-52,0r0,-240r52,0r0,97r29,0v7,-67,36,-101,87,-101xm191,-39v33,-6,32,-32,32,-81v0,-48,1,-75,-32,-81v-33,5,-31,33,-31,81v0,48,-2,76,31,81","w":290,"k":{"\u0459":1,"\u042f":3,"\u042a":-7,"\u0427":1,"\u0425":4,"\u0423":2,"\u0422":-2,"\u041b":1,"\u0417":-4,"\u0416":5,"\u0414":-3,"\u040e":3,"\u040b":-3,"\u0409":1}},"\u042f":{"d":"15,-168v0,-49,27,-72,83,-72r75,0r0,240r-52,0r0,-95r-27,0r-32,95r-57,0r44,-105v-22,-12,-34,-33,-34,-63xm121,-201v-32,-2,-54,1,-54,33v0,33,22,36,54,34r0,-67","w":196},"\u0430":{"d":"104,-110v-1,-21,3,-39,-17,-38v-13,0,-20,9,-21,27r-47,-5v4,-35,33,-55,72,-55v91,0,54,105,66,181r-46,0v-2,-5,-3,-14,-3,-27v-18,47,-99,39,-95,-18v4,-50,32,-61,91,-65xm81,-29v21,0,24,-27,23,-56v-25,4,-39,8,-40,34v0,15,6,22,17,22","w":171,"k":{"\u045e":4,"\u0459":-5,"\u0447":5,"\u0443":4,"\u0442":-3}},"\u0431":{"d":"163,-91v0,55,-25,95,-77,95v-50,0,-75,-34,-75,-102v1,-70,15,-126,66,-139v16,-4,23,-3,25,-18r45,0v2,56,-81,25,-87,81v53,-34,103,18,103,83xm85,-146v-18,0,-26,19,-26,57v0,36,9,55,27,55v17,0,26,-19,26,-55v0,-38,-10,-57,-27,-57","w":173,"k":{"\u045e":3,"\u044f":2,"\u0447":2,"\u0445":1,"\u0443":3,"\u0442":-4,"\u0437":-1,"\u0436":3}},"\u0432":{"d":"138,-95v47,18,30,95,-23,95r-97,0r0,-178v60,4,144,-18,142,46v0,16,-7,28,-22,37xm114,-126v4,-24,-22,-19,-43,-19r0,36v20,-2,47,7,43,-17xm118,-58v3,-25,-25,-20,-47,-20r0,40v22,-1,50,6,47,-20","w":174,"k":{"\u045e":1,"\u044f":2,"\u0447":4,"\u0445":-1,"\u0443":1,"\u0442":-5,"\u0437":-4,"\u0436":1}},"\u0433":{"d":"18,-178r101,0r0,39r-51,0r0,139r-50,0r0,-178","w":120,"k":{"\u045e":-10,"\u0459":9,"\u0454":-2,"\u044f":-2,"\u0444":1,"\u0441":-2,"\u043e":-2,"\u043b":8,"\u0434":8,";":-1,":":-1,".":17,"-":13,",":17}},"\u0434":{"d":"11,-38r36,-140r64,0r32,140r15,0r0,78r-36,0r-4,-40r-81,0r-4,40r-36,0r0,-78r14,0xm48,-38r46,0r-19,-92r-3,0","w":154},"\u0435":{"d":"11,-86v0,-81,72,-123,124,-74v14,14,20,41,20,79r-93,0v0,27,0,50,23,50v15,0,24,-10,26,-30r44,3v-8,41,-32,62,-71,62v-49,0,-73,-38,-73,-90xm108,-109v1,-24,-7,-40,-23,-39v-15,0,-23,13,-23,39r46,0","w":165,"k":{"\u045e":3,"\u044f":2,"\u0447":1,"\u0445":1,"\u0443":3,"\u0437":-3,"\u0436":2}},"\u0436":{"d":"169,-107r55,107r-51,0r-40,-77v-3,23,0,52,-1,77r-46,0v-2,-25,4,-56,-2,-77r-41,77r-48,0r54,-95r-49,-83r50,0r31,58r5,2r0,-60r46,0r0,60v16,-16,23,-41,36,-60r48,0","w":214,"k":{"\u045e":-11,"\u0454":1,"\u0444":3,"\u0441":1,"\u0437":-2,"\u0435":1,"\u0431":-2}},"\u0437":{"d":"91,-54v-2,-22,-12,-19,-39,-20r0,-33v26,1,35,0,35,-20v0,-14,-5,-21,-16,-21v-10,0,-16,8,-19,25r-44,-9v2,-66,132,-65,130,1v0,16,-8,29,-24,38v54,24,25,104,-40,97v-42,-4,-55,-14,-70,-53r42,-7v5,18,14,27,26,27v11,-1,20,-10,19,-25","w":152,"k":{"\u045e":1,"\u0459":-2,"\u044f":2,"\u0447":3,"\u0443":1,"\u0442":-5,"\u043b":-2,"\u0436":1}},"\u0438":{"d":"108,-83v-12,30,-41,41,-40,83r-50,0r0,-178r50,0r0,86r40,-63r0,-23r49,0r0,178r-49,0r0,-83","w":175},"\u0439":{"d":"108,-83v-12,30,-41,41,-40,83r-50,0r0,-178r50,0r0,86r40,-63r0,-23r49,0r0,178r-49,0r0,-83xm32,-243r28,0v7,24,53,24,60,0r28,0v-11,58,-104,59,-116,0","w":175,"k":{"\u0459":-4}},"\u043a":{"d":"18,-178r50,0r0,69r50,-69r45,0r-45,60r49,118r-53,0r-28,-82r-18,25r0,57r-50,0r0,-178","w":165,"k":{"\u045e":-12,"\u0444":2,"\u0437":-3,"\u0431":-3,"\u0430":-4}},"\u043b":{"d":"-5,0r53,-178r51,0r49,178r-51,0r-27,-115r-29,115r-46,0","w":145},"\u043c":{"d":"18,0r0,-178r64,0r33,121r32,-121r60,0r0,178r-45,0r0,-100r-28,100r-47,0r-27,-99r0,99r-42,0","w":225},"\u043d":{"d":"18,0r0,-178r50,0r0,64r39,0r0,-64r50,0r0,178r-50,0r0,-75r-39,0r0,75r-50,0","w":174},"\u043e":{"d":"155,-89v0,62,-24,93,-72,93v-48,0,-72,-31,-72,-93v0,-62,24,-92,72,-92v48,0,72,30,72,92xm83,-31v22,-5,21,-25,21,-58v0,-34,2,-53,-21,-58v-23,4,-21,24,-21,58v0,34,-2,53,21,58","w":165,"k":{"\u045e":2,"\u0459":1,"\u044a":-7,"\u0443":2,"\u0442":-4,"\u0437":-2,"\u0436":2}},"\u043f":{"d":"18,0r0,-178r132,0r0,178r-49,0r0,-145r-33,0r0,145r-50,0","w":168},"\u0440":{"d":"161,-92v0,68,-46,120,-94,79r0,73r-49,0r0,-238r46,0r0,27v10,-19,23,-29,40,-29v39,0,57,37,57,88xm89,-147v-29,-3,-22,44,-22,74v0,28,-1,41,21,41v25,0,22,-21,22,-59v0,-33,2,-54,-21,-56","w":171,"k":{"\u045e":2,"\u0454":-1,"\u044f":1,"\u0447":1,"\u0443":2,"\u0442":-5,"\u0437":-1,"\u0436":2,";":2,":":1,"-":-8,",":1}},"\u0441":{"d":"11,-88v-1,-55,22,-92,72,-93v41,0,64,23,68,69r-46,2v-2,-17,-3,-32,-20,-33v-17,0,-25,17,-25,52v0,53,41,80,45,22r46,3v-4,47,-28,70,-70,70v-51,-1,-70,-37,-70,-92","w":159,"k":{"\u0459":-1,"\u0447":-1,"\u0444":-2,"\u0443":-1,"\u0442":-8,"\u043e":-2,"\u043b":-2,"\u0437":-5,"\u0436":1,"\u0430":-2,"\u040e":3}},"\u0442":{"d":"-1,-178r134,0r0,40r-43,0r0,138r-50,0r0,-138r-41,0r0,-40","w":131,"k":{"\u045e":-12,"\u0459":6,"\u0454":-4,"\u044f":-4,"\u0447":-5,"\u0444":-1,"\u0443":-12,"\u0442":-14,"\u0441":-4,"\u043e":-4,"\u043b":5,"\u0437":-8,"\u0435":-3,"\u0434":5,"\u0430":-4,"\u00bb":-5,";":-3,":":-3,".":10,"-":6,",":10}},"\u0443":{"d":"-5,-178r50,0r24,109r23,-109r42,0r-53,181v-9,44,-30,67,-79,57r0,-39v26,3,40,0,44,-24","w":128,"k":{"\u0459":7,"\u0454":4,"\u044f":4,"\u0447":-2,"\u0444":6,"\u0442":-11,"\u0441":4,"\u043e":4,"\u043b":6,"\u0435":5,"\u0434":6,"\u0430":4,"\u00bb":1,".":12,",":13}},"\u0444":{"d":"198,-89v0,49,-29,83,-73,88r0,60r-41,0r0,-60v-44,-5,-73,-40,-73,-88v0,-50,24,-80,73,-91r0,-57r41,0r0,57v49,11,73,41,73,91xm84,-37r0,-106v-34,11,-33,95,0,106xm125,-37v34,-11,33,-95,0,-106r0,106","w":208,"k":{"\u045e":4,"\u0459":2,"\u044f":3,"\u044a":-4,"\u0447":2,"\u0445":4,"\u0443":4,"\u0442":-2,"\u043b":2,"\u0437":-1,"\u0436":5,"\u0434":-2,"\u0433":1}},"\u0445":{"d":"-2,-178r54,0r19,42r23,-42r43,0r-46,79r53,99r-54,0r-26,-53r-30,53r-43,0r53,-91","w":135,"k":{"\u045e":-12,"\u0454":1,"\u0444":3,"\u0437":-2,"\u0435":1,"\u0430":-4}},"\u0446":{"d":"18,0r0,-178r50,0r0,140r35,0r0,-140r50,0r0,140r22,0r0,80r-36,0r-4,-42r-117,0","w":172},"\u0447":{"d":"94,-59v-37,18,-80,-1,-80,-46r0,-73r49,0v3,33,-14,105,31,82r0,-82r50,0r0,178r-50,0r0,-59","w":162},"\u0448":{"d":"19,0r0,-178r50,0r0,140r30,0r0,-140r50,0r0,140r30,0r0,-140r50,0r0,178r-210,0","w":248},"\u0449":{"d":"18,0r0,-178r49,0r0,140r32,0r0,-140r48,0r0,140r32,0r0,-140r49,0r0,140r22,0r0,80r-35,0r-5,-42r-192,0","w":247},"\u044a":{"d":"165,-58v0,36,-18,58,-57,58r-80,0r0,-142r-38,0r0,-36r88,0r0,62v53,-6,87,11,87,58xm78,-35v23,2,40,0,40,-23v0,-26,-17,-23,-40,-23r0,46","w":171,"k":{"\u045e":8,"\u044a":7,"\u0447":2,"\u0443":8,"\u0442":11,"\u0441":-2,"\u0435":-2}},"\u044b":{"d":"155,-58v0,36,-18,58,-57,58r-80,0r0,-178r50,0r0,62v53,-6,87,12,87,58xm68,-35v23,2,39,0,39,-23v0,-26,-16,-24,-39,-23r0,46xm175,0r0,-178r49,0r0,178r-49,0","w":242},"\u044c":{"d":"155,-58v0,36,-18,58,-57,58r-80,0r0,-178r50,0r0,62v53,-6,87,12,87,58xm68,-35v23,2,39,0,39,-23v0,-26,-16,-24,-39,-23r0,46","w":161,"k":{"\u045e":8,"\u044a":7,"\u0447":2,"\u0443":8,"\u0442":11,"\u0441":-2,"\u0435":-2}},"\u044d":{"d":"145,-91v0,55,-21,95,-73,95v-38,0,-61,-18,-68,-54r46,-10v2,15,8,23,20,23v16,0,25,-13,26,-38r-56,0r0,-32r55,0v4,-38,-37,-53,-45,-17r-46,-5v9,-35,31,-53,66,-53v48,0,75,35,75,91","w":154,"k":{"\u045e":2,"\u0459":2,"\u044f":2,"\u044a":-7,"\u0447":1,"\u0443":2,"\u0442":-4,"\u043b":1}},"\u044e":{"d":"84,-75r-16,0r0,75r-50,0r0,-176r50,0r0,64r17,0v6,-46,30,-69,71,-69v48,0,72,30,72,92v0,62,-24,93,-72,93v-44,0,-68,-27,-72,-79xm156,-31v23,-4,21,-24,21,-58v0,-34,2,-53,-21,-58v-22,5,-21,23,-21,58v0,37,-2,54,21,58","w":237,"k":{"\u045e":3,"\u0459":1,"\u044a":-7,"\u0447":1,"\u0445":1,"\u0443":3,"\u0442":-4,"\u043b":1,"\u0437":-2,"\u0436":2}},"\u044f":{"d":"40,-78v-44,-25,-28,-100,36,-100r77,0r0,178r-49,0r0,-67r-22,0r-28,67r-50,0xm63,-123v-4,23,19,20,41,20r0,-42v-22,0,-44,-3,-41,22","w":171},"\u0451":{"d":"11,-86v0,-81,72,-123,124,-74v14,14,20,41,20,79r-93,0v0,27,0,50,23,50v15,0,24,-10,26,-30r44,3v-8,41,-32,62,-71,62v-49,0,-73,-38,-73,-90xm108,-109v1,-24,-7,-40,-23,-39v-15,0,-23,13,-23,39r46,0xm137,-223v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm57,-204v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":165},"\u0452":{"d":"92,-136v-42,8,-19,90,-25,136r-49,0r0,-191r-26,0r0,-33r26,0r0,-20r49,0r0,20r57,0r0,33r-57,0r0,26v9,-8,21,-12,36,-12v58,0,51,46,53,121v1,76,-3,112,-70,113r-4,-36v36,-3,28,-22,28,-78v0,-48,6,-70,-18,-79","w":169},"\u0453":{"d":"18,-178r101,0r0,39r-51,0r0,139r-50,0r0,-178xm38,-213r60,-56r20,30r-65,40","w":120,"k":{"\u0459":9,"\u0454":-2,"\u044f":-2,"\u0441":-2,"\u043e":-2,"\u043b":8,"\u0434":8}},"\u0454":{"d":"10,-91v-9,-96,122,-126,141,-38r-47,5v-2,-23,-24,-27,-36,-13v-4,5,-7,15,-8,30r55,0r0,32r-56,0v-3,41,40,53,46,15r46,10v-7,36,-30,54,-68,54v-53,0,-68,-40,-73,-95","w":155},"\u0455":{"d":"24,-92v-31,-38,2,-89,51,-89v32,0,51,15,60,46r-35,11v-5,-16,-13,-24,-26,-24v-16,0,-20,21,-10,28v27,18,78,20,77,66v-1,35,-30,58,-68,58v-40,0,-62,-18,-66,-53r39,-7v0,29,45,38,48,10v-3,-28,-61,-26,-70,-46","w":147},"\u0456":{"d":"68,-192r-50,0r0,-49r50,0r0,49xm18,-178r50,0r0,178r-50,0r0,-178","w":85},"\u0457":{"d":"18,-178r50,0r0,178r-50,0r0,-178xm93,-223v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm13,-204v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":85},"\u0458":{"d":"70,-192r-50,0r0,-49r50,0r0,49xm-3,22v22,1,23,-5,23,-29r0,-171r49,0r0,172v5,56,-18,79,-72,69r0,-41","w":85},"\u0459":{"d":"220,-58v0,36,-18,58,-57,58r-69,0r-20,-114r-33,114r-46,0r58,-178r52,0r13,62v57,-5,102,3,102,58xm135,-36v21,1,40,1,37,-22v3,-30,-22,-22,-46,-23","w":225,"k":{"\u045e":7,"\u044a":6,"\u0447":2,"\u0443":7,"\u0442":10}},"\u045a":{"d":"244,-58v0,36,-18,58,-57,58r-80,0r0,-75r-39,0r0,75r-50,0r0,-178r50,0r0,64r39,0r0,-64r50,0r0,62v53,-5,87,10,87,58xm157,-35v23,2,39,1,39,-23v0,-27,-17,-23,-39,-23r0,46","w":250,"k":{"\u045e":7,"\u0454":-2,"\u044a":7,"\u0447":2,"\u0443":7,"\u0442":11,"\u0441":-2,"\u0435":-2}},"\u045b":{"d":"93,-137v-42,8,-21,89,-26,137r-49,0r0,-191r-26,0r0,-33r26,0r0,-21r49,0r0,21r56,0r0,33r-56,0r0,30v37,-35,89,-9,89,56r0,105r-48,0r0,-101v-2,-21,0,-33,-15,-36","w":171},"\u045c":{"d":"18,-178r50,0r0,69r50,-69r45,0r-45,60r49,118r-53,0r-28,-82r-18,25r0,57r-50,0r0,-178xm60,-212r60,-56r20,30r-65,40","w":165,"k":{"\u045e":-13,"\u0444":3,"\u0437":-3,"\u0431":-3,"\u0430":-4}},"\u045e":{"d":"-5,-178r50,0r24,109r23,-109r42,0r-53,181v-9,44,-30,67,-79,57r0,-39v26,3,40,0,44,-24xm7,-243r28,0v7,24,53,24,60,0r28,0v-11,58,-104,59,-116,0","w":128,"k":{"\u0454":4,"\u044f":4,"\u0447":-2,"\u0444":6,"\u0442":-11,"\u0441":4,"\u043e":4,"\u043b":6,"\u0435":5,"\u0434":6,"\u0430":4}},"\u045f":{"d":"18,0r0,-178r50,0r0,140r35,0r0,-140r49,0r0,178r-47,0r-3,42r-34,0r-3,-42r-47,0","w":170},"\u0490":{"d":"169,-285r0,89r-94,0r0,196r-52,0r0,-240r103,0r0,-45r43,0","w":168},"\u0491":{"d":"75,-181r0,-36r49,0r0,75r-56,0r0,142r-50,0r0,-181r57,0","w":125},"\u1e80":{"d":"-2,-240r54,0r25,166r32,-166r48,0r30,167r29,-167r44,0r-51,241r-47,0r-32,-167r-33,167r-47,0xm164,-269r-14,14r-65,-40r19,-30","w":257},"\u1e81":{"d":"-3,-178r48,0r21,108r20,-108r48,0r16,108r24,-108r39,0r-44,178r-42,0r-23,-121r-22,121r-40,0xm142,-212r-14,14r-65,-40r19,-30","w":208},"\u1e82":{"d":"-2,-240r54,0r25,166r32,-166r48,0r30,167r29,-167r44,0r-51,241r-47,0r-32,-167r-33,167r-47,0xm99,-269r60,-56r20,30r-65,40","w":257},"\u1e83":{"d":"-3,-178r48,0r21,108r20,-108r48,0r16,108r24,-108r39,0r-44,178r-42,0r-23,-121r-22,121r-40,0xm77,-214r60,-56r20,30r-65,40","w":208},"\u1e84":{"d":"-2,-240r54,0r25,166r32,-166r48,0r30,167r29,-167r44,0r-51,241r-47,0r-32,-167r-33,167r-47,0xm183,-281v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm103,-262v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":257},"\u1e85":{"d":"-3,-178r48,0r21,108r20,-108r48,0r16,108r24,-108r39,0r-44,178r-42,0r-23,-121r-22,121r-40,0xm156,-222v0,25,-40,24,-41,0v0,-10,9,-20,20,-19v12,-1,21,9,21,19xm76,-203v-10,0,-21,-7,-20,-19v0,-10,9,-20,20,-19v11,-1,20,9,20,19v0,11,-10,19,-20,19","w":208},"\u1ef2":{"d":"-10,-240r58,0r34,88r36,-88r51,0r-66,139r0,101r-53,0r0,-101xm107,-269r-14,14r-65,-40r19,-30","w":159},"\u1ef3":{"d":"-5,-178r50,0r24,109r23,-109r42,0r-53,181v-9,44,-30,67,-79,57r0,-39v26,3,40,0,44,-24xm100,-213r-14,14r-65,-40r19,-30","w":128},"\u2015":{"d":"13,-109r213,0r0,36r-213,0r0,-36","w":239},"\u2017":{"d":"0,17r180,0r0,28r-180,0r0,-28xm0,60r180,0r0,28r-180,0r0,-28","w":180},"\u201b":{"d":"65,-240r0,53r-19,0r19,47r-19,0r-26,-47r0,-53r45,0","w":85},"\u2032":{"d":"37,-140r-30,0r27,-100r43,0","w":69},"\u2033":{"d":"37,-140r-30,0r27,-100r43,0xm105,-140r-29,0r27,-100r42,0","w":133},"\u203c":{"d":"21,-240r63,0r-16,168r-32,0xm28,-53r49,0r0,53r-49,0r0,-53xm109,-240r63,0r-16,168r-32,0xm116,-53r49,0r0,53r-49,0r0,-53","w":195},"\u203e":{"d":"-7,-329r216,0r0,13r-216,0r0,-13","w":201},"\u2044":{"d":"58,-240r29,0r-115,240r-28,0","w":30},"\u207f":{"d":"60,-178v-9,1,-10,6,-11,19r0,63r-37,0r0,-108r29,0r0,15v17,-28,74,-22,65,23r0,70r-37,0r0,-70v0,-8,-3,-12,-9,-12","w":116},"\u20a4":{"d":"46,-161v-4,-50,18,-84,65,-83v33,0,53,16,61,46r-38,18v-4,-30,-40,-37,-39,-1v0,5,1,11,2,20r47,0r0,32r-44,0r2,17r42,0r0,32r-43,0v-3,14,-11,27,-25,39v42,3,74,-3,79,-36r38,15v-10,45,-31,62,-90,62r-100,0r0,-41v33,3,52,-4,51,-39r-28,0r0,-32r27,0r-3,-17r-24,0r0,-32r20,0"},"\u20a7":{"d":"181,-165v1,64,-36,80,-106,76r0,89r-52,0r0,-240r69,0v61,-4,88,20,89,75xm126,-166v0,-30,-17,-39,-51,-35r0,71v33,3,51,-5,51,-36xm248,-1v-36,9,-64,-1,-60,-41r0,-38r-14,0r0,-28r17,0r3,-30r30,-3r0,33r22,0r0,28r-22,0v4,24,-14,63,24,52r0,27xm293,-41v-56,-7,-42,-71,6,-69v21,0,35,10,41,29r-28,7v-1,-14,-21,-20,-23,-6v9,21,57,13,54,46v-2,22,-20,36,-45,36v-27,0,-42,-11,-46,-33r31,-4v-1,16,24,21,26,6v-1,-10,-6,-8,-16,-12","w":346},"\u2105":{"d":"15,-178v0,-76,101,-91,106,-19r-39,4v-2,-10,-1,-18,-11,-19v-15,2,-14,12,-15,36v0,20,4,31,14,31v12,-1,11,-8,13,-22r39,3v-4,35,-21,52,-53,52v-37,0,-54,-28,-54,-66xm181,-240r29,0r-114,240r-28,0xm208,-127v36,0,56,25,55,64v0,41,-17,67,-56,67v-39,1,-56,-27,-56,-66v0,-39,18,-65,57,-65xm222,-63v0,-23,-5,-35,-15,-35v-10,0,-14,12,-14,35v0,23,4,34,14,34v10,0,15,-11,15,-34","w":278},"\u2113":{"d":"144,-243v18,1,29,15,29,34v0,34,-21,72,-63,114v-7,34,-10,55,-10,64v0,8,1,11,5,11v7,3,13,-24,23,-24v4,0,6,2,6,7v0,19,-19,44,-40,43v-28,-1,-30,-34,-29,-69v-10,12,-16,13,-19,0v2,-11,20,-25,22,-30v7,-41,17,-77,29,-106v12,-29,28,-44,47,-44xm115,-128v17,-18,35,-49,36,-78v0,-9,-3,-13,-7,-13v-9,0,-18,30,-29,91","w":211},"\u2116":{"d":"23,-240r58,0r62,149r0,-149r41,0r0,240r-47,0r-74,-174r0,174r-40,0r0,-240xm309,-122v0,38,-16,57,-49,57v-33,0,-49,-19,-49,-56v0,-37,16,-56,49,-56v33,0,49,18,49,55xm260,-91v17,-3,14,-58,0,-60v-17,0,-17,58,0,60xm211,-37r98,0r0,37r-98,0r0,-37","w":321},"\u212e":{"d":"16,-93v0,-86,99,-132,157,-75v18,17,28,42,29,75r-146,0r0,65v37,35,99,25,122,-22r13,7v-23,32,-40,48,-82,49v-55,2,-93,-44,-93,-99xm161,-106r0,-53v-28,-28,-79,-28,-105,1r0,52r105,0","w":216},"\u215b":{"d":"220,-146v46,-6,68,47,28,67v47,22,24,87,-31,81v-52,6,-74,-55,-27,-73v-42,-20,-18,-81,30,-75xm226,-89v13,-9,13,-32,-5,-32v-23,5,-18,24,5,32xm218,-25v11,0,18,-4,18,-13v0,-8,-8,-15,-25,-22v-17,8,-18,35,7,35xm50,-241r30,0r0,117r25,0r0,28r-91,0r0,-28r26,0r0,-73v-8,7,-17,12,-26,16r0,-34v14,-7,27,-15,36,-26xm183,-240r29,0r-115,240r-28,0","w":288},"\u215c":{"d":"226,-146v47,-5,69,48,28,67v47,22,24,87,-31,81v-51,5,-74,-55,-27,-73v-41,-21,-18,-81,30,-75xm232,-89v13,-9,13,-32,-5,-32v-23,5,-18,24,5,32xm225,-25v28,-5,21,-25,-7,-35v-18,8,-19,37,7,35xm83,-172v49,17,22,78,-27,78v-33,0,-51,-15,-55,-46r35,-5v-2,25,33,30,33,5v0,-15,-15,-18,-33,-17r0,-27v16,1,33,-1,31,-15v0,-9,-4,-14,-13,-14v-8,0,-13,6,-15,18r-35,-6v6,-52,101,-57,102,-2v0,14,-7,24,-23,31xm185,-240r29,0r-115,240r-28,0","w":288},"\u215d":{"d":"228,-146v47,-5,69,48,28,67v47,22,24,87,-31,81v-51,5,-74,-55,-27,-73v-42,-20,-18,-81,30,-75xm234,-89v13,-9,13,-32,-5,-32v-23,5,-18,24,5,32xm227,-25v28,-5,21,-25,-7,-35v-18,8,-19,37,7,35xm115,-146v5,49,-57,65,-91,41v-10,-7,-15,-17,-17,-30r37,-6v2,11,7,17,17,17v11,0,16,-7,16,-20v0,-22,-28,-25,-32,-8r-31,-6r6,-82r88,0r-4,32r-56,0r-2,27v26,-26,74,-5,69,35xm187,-240r29,0r-115,240r-28,0","w":288},"\u215e":{"d":"212,-146v46,-6,68,47,28,67v47,22,23,87,-31,81v-52,6,-74,-55,-27,-73v-42,-20,-18,-81,30,-75xm218,-89v13,-9,13,-32,-5,-32v-23,5,-18,24,5,32xm210,-25v11,0,18,-4,18,-13v0,-8,-8,-15,-25,-22v-17,8,-18,35,7,35xm16,-240r96,0r0,27v-25,28,-37,68,-37,117r-42,0v0,-42,15,-79,43,-111r-63,0xm171,-240r29,0r-115,240r-28,0","w":288},"\u2190":{"d":"86,-154r14,0v-10,20,-21,38,-34,54r280,0r0,18r-280,0v12,12,23,30,34,54r-14,0v-26,-30,-50,-50,-72,-60r0,-7v21,-8,44,-28,72,-59","w":360},"\u2191":{"d":"27,-184v31,-28,50,-52,58,-73r9,0v10,22,29,47,59,73r0,13v-24,-11,-42,-22,-54,-34r0,280r-18,0r0,-280v-16,13,-34,24,-54,34r0,-13","w":180},"\u2192":{"d":"273,-154v28,31,52,51,73,59r0,7v-22,10,-47,30,-73,60r-13,0v11,-24,22,-42,34,-54r-280,0r0,-18r280,0v-13,-16,-25,-34,-34,-54r13,0","w":360},"\u2193":{"d":"27,2r0,-13v20,10,38,21,54,34r0,-280r18,0r0,280v12,-12,30,-23,54,-34r0,13v-30,26,-49,51,-59,73r-9,0v-8,-21,-27,-45,-58,-73","w":180},"\u2194":{"d":"346,-95r0,8v-21,9,-45,29,-71,59r-14,0v8,-20,19,-38,34,-54r-230,0v15,16,26,34,34,54r-14,0v-26,-30,-50,-50,-71,-59r0,-8v21,-9,45,-29,71,-59r14,0v-8,20,-19,38,-34,54r230,0v-15,-16,-26,-34,-34,-54r14,0v26,30,50,50,71,59","w":360},"\u2195":{"d":"86,-257r8,0v9,21,29,45,59,71r0,14v-20,-8,-39,-19,-55,-34r0,230v16,-15,35,-26,55,-34r0,14v-30,26,-50,50,-59,71r-8,0v-9,-21,-29,-45,-59,-71r0,-14v20,8,38,19,54,34r0,-230v-16,15,-34,26,-54,34r0,-14v30,-26,50,-50,59,-71","w":180},"\u21a8":{"d":"86,-257r8,0v9,21,29,45,59,71r0,14v-20,-8,-38,-19,-54,-34r0,230v16,-15,34,-26,54,-34r0,14v-30,26,-50,50,-59,71r-8,0v-9,-21,-29,-45,-59,-71r0,-14v20,8,39,19,55,34r0,-230v-16,15,-35,26,-55,34r0,-14v30,-26,50,-50,59,-71xm27,92r126,0r0,17r-126,0r0,-17","w":180},"\u221f":{"d":"64,-225r17,0r0,207r208,0r0,18r-225,0r0,-225","w":352},"\u2229":{"d":"130,-230v-96,0,-63,132,-68,230r-37,0r0,-112v-7,-100,25,-144,105,-153v79,9,104,53,104,153r0,112r-37,0r0,-113v5,-77,-9,-117,-67,-117","w":258},"\u2261":{"d":"166,-159r-148,0r0,-38r148,0r0,38xm166,-100r-148,0r0,-38r148,0r0,38xm166,-41r-148,0r0,-38r148,0r0,38"},"\u2302":{"d":"27,0r0,-111r81,-92r81,92r0,111r-162,0xm41,-14r134,0r0,-91r-67,-76r-67,76r0,91","w":216},"\u2310":{"d":"64,0r-52,0r0,-105r156,0r0,48r-104,0r0,57","w":180},"\u2320":{"d":"130,-287v-12,2,-9,10,-9,31r0,347r-26,0r0,-319v-1,-40,18,-74,52,-77v26,-2,32,33,8,35v-14,1,-15,-15,-25,-17","w":216},"\u2321":{"d":"86,72v12,-2,9,-10,9,-31r0,-346r26,0r0,318v1,41,-18,76,-52,78v-25,2,-32,-33,-9,-36v13,-1,17,15,26,17","w":216},"\u2500":{"d":"260,-94r-263,0r0,-31r263,0r0,31","w":256},"\u2502":{"d":"113,109r0,-437r31,0r0,437r-31,0","w":256},"\u250c":{"d":"260,-125r0,31r-116,0r0,203r-31,0r0,-234r147,0","w":256},"\u2510":{"d":"113,-94r-116,0r0,-31r147,0r0,234r-31,0r0,-203","w":256},"\u2514":{"d":"113,-94r0,-234r31,0r0,203r116,0r0,31r-147,0","w":256},"\u2518":{"d":"144,-94r-147,0r0,-31r116,0r0,-203r31,0r0,234","w":256},"\u251c":{"d":"113,109r0,-437r31,0r0,203r116,0r0,31r-116,0r0,203r-31,0","w":256},"\u2524":{"d":"113,109r0,-203r-116,0r0,-31r116,0r0,-203r31,0r0,437r-31,0","w":256},"\u252c":{"d":"113,-94r-116,0r0,-31r263,0r0,31r-116,0r0,203r-31,0r0,-203","w":256},"\u2534":{"d":"260,-94r-263,0r0,-31r116,0r0,-203r31,0r0,203r116,0r0,31","w":256},"\u253c":{"d":"113,-94r-116,0r0,-31r116,0r0,-203r31,0r0,203r116,0r0,31r-116,0r0,203r-31,0r0,-203","w":256},"\u2550":{"d":"260,-127r-263,0r0,-31r263,0r0,31xm260,-60r-263,0r0,-31r263,0r0,31","w":256},"\u2551":{"d":"146,109r0,-437r31,0r0,437r-31,0xm80,109r0,-437r30,0r0,437r-30,0","w":256},"\u2552":{"d":"113,109r0,-267r147,0r0,31r-116,0r0,36r116,0r0,31r-116,0r0,169r-31,0","w":256},"\u2553":{"d":"80,109r0,-234r180,0r0,31r-83,0r0,203r-31,0r0,-200r-36,0r0,200r-30,0","w":256},"\u2554":{"d":"110,109r-30,0r0,-267r180,0r0,31r-150,0r0,236xm177,-60r0,169r-31,0r0,-200r114,0r0,31r-83,0","w":256},"\u2555":{"d":"113,-60r-116,0r0,-31r116,0r0,-36r-116,0r0,-31r147,0r0,267r-31,0r0,-169","w":256},"\u2556":{"d":"79,109r0,-203r-82,0r0,-31r180,0r0,234r-31,0r0,-203r-36,0r0,203r-31,0","w":256},"\u2557":{"d":"146,109r0,-236r-149,0r0,-31r180,0r0,267r-31,0xm79,-60r-82,0r0,-31r113,0r0,200r-31,0r0,-169","w":256},"\u2558":{"d":"113,-60r0,-268r31,0r0,170r116,0r0,31r-116,0r0,36r116,0r0,31r-147,0","w":256},"\u2559":{"d":"260,-94r-180,0r0,-234r30,0r0,203r36,0r0,-203r31,0r0,203r83,0r0,31","w":256},"\u255a":{"d":"110,-328r0,237r150,0r0,31r-180,0r0,-268r30,0xm177,-158r83,0r0,31r-114,0r0,-201r31,0r0,170","w":256},"\u255b":{"d":"144,-60r-147,0r0,-31r116,0r0,-36r-116,0r0,-31r116,0r0,-170r31,0r0,268","w":256},"\u255c":{"d":"177,-94r-180,0r0,-31r82,0r0,-203r31,0r0,203r36,0r0,-203r31,0r0,234","w":256},"\u255d":{"d":"146,-328r31,0r0,268r-180,0r0,-31r149,0r0,-237xm79,-158r0,-170r31,0r0,201r-113,0r0,-31r82,0","w":256},"\u255e":{"d":"113,109r0,-437r31,0r0,170r116,0r0,31r-116,0r0,36r116,0r0,31r-116,0r0,169r-31,0","w":256},"\u255f":{"d":"146,109r0,-437r31,0r0,203r83,0r0,31r-83,0r0,203r-31,0xm80,109r0,-437r30,0r0,437r-30,0","w":256},"\u2560":{"d":"80,109r0,-437r30,0r0,437r-30,0xm146,-127r0,-201r31,0r0,170r83,0r0,31r-114,0xm146,109r0,-200r114,0r0,31r-83,0r0,169r-31,0","w":256},"\u2561":{"d":"113,-60r-116,0r0,-31r116,0r0,-36r-116,0r0,-31r116,0r0,-170r31,0r0,437r-31,0r0,-169","w":256},"\u2562":{"d":"79,109r0,-203r-82,0r0,-31r82,0r0,-203r31,0r0,437r-31,0xm146,109r0,-437r31,0r0,437r-31,0","w":256},"\u2563":{"d":"146,109r0,-437r31,0r0,437r-31,0xm110,-328r0,201r-113,0r0,-31r82,0r0,-170r31,0xm79,-60r-82,0r0,-31r113,0r0,200r-31,0r0,-169","w":256},"\u2564":{"d":"260,-127r-263,0r0,-31r263,0r0,31xm113,-60r-116,0r0,-31r263,0r0,31r-116,0r0,169r-31,0r0,-169","w":256},"\u2565":{"d":"79,109r0,-203r-82,0r0,-31r263,0r0,31r-83,0r0,203r-31,0r0,-200r-36,0r0,200r-31,0","w":256},"\u2566":{"d":"260,-127r-263,0r0,-31r263,0r0,31xm79,-60r-82,0r0,-31r113,0r0,200r-31,0r0,-169xm146,109r0,-200r114,0r0,31r-83,0r0,169r-31,0","w":256},"\u2567":{"d":"260,-127r-263,0r0,-31r116,0r0,-170r31,0r0,170r116,0r0,31xm260,-60r-263,0r0,-31r263,0r0,31","w":256},"\u2568":{"d":"260,-94r-263,0r0,-31r82,0r0,-203r31,0r0,203r36,0r0,-203r31,0r0,203r83,0r0,31","w":256},"\u2569":{"d":"110,-127r-113,0r0,-31r82,0r0,-170r31,0r0,201xm260,-127r-114,0r0,-201r31,0r0,170r83,0r0,31xm260,-60r-263,0r0,-31r263,0r0,31","w":256},"\u256a":{"d":"113,-60r-116,0r0,-31r116,0r0,-36r-116,0r0,-31r116,0r0,-170r31,0r0,170r116,0r0,31r-116,0r0,36r116,0r0,31r-116,0r0,169r-31,0r0,-169","w":256},"\u256b":{"d":"79,109r0,-203r-82,0r0,-31r82,0r0,-203r31,0r0,203r36,0r0,-203r31,0r0,203r83,0r0,31r-83,0r0,203r-31,0r0,-203r-36,0r0,203r-31,0","w":256},"\u256c":{"d":"177,-158r83,0r0,31r-114,0r0,-201r31,0r0,170xm79,-158r0,-170r31,0r0,201r-113,0r0,-31r82,0xm79,-60r-82,0r0,-31r113,0r0,200r-31,0r0,-169xm177,-60r0,169r-31,0r0,-200r114,0r0,31r-83,0","w":256},"\u2580":{"d":"260,-109r-263,0r0,-219r263,0r0,219","w":256},"\u2584":{"d":"260,109r-263,0r0,-218r263,0r0,218","w":256},"\u2588":{"d":"-3,109r0,-437r263,0r0,437r-263,0","w":256},"\u258c":{"d":"-3,109r0,-437r131,0r0,437r-131,0","w":256},"\u2590":{"d":"128,109r0,-437r132,0r0,437r-132,0","w":256},"\u2591":{"d":"19,-328r22,0r0,22r-22,0r0,-22xm106,-328r22,0r0,22r-22,0r0,-22xm194,-328r22,0r0,22r-22,0r0,-22xm63,-284r22,0r0,22r-22,0r0,-22xm150,-284r22,0r0,22r-22,0r0,-22xm238,-284r22,0r0,22r-22,0r0,-22xm194,-240r22,0r0,22r-22,0r0,-22xm106,-240r22,0r0,22r-22,0r0,-22xm19,-240r22,0r0,22r-22,0r0,-22xm238,-196r22,0r0,22r-22,0r0,-22xm150,-196r22,0r0,22r-22,0r0,-22xm63,-196r22,0r0,22r-22,0r0,-22xm19,-152r22,0r0,22r-22,0r0,-22xm106,-152r22,0r0,22r-22,0r0,-22xm194,-152r22,0r0,22r-22,0r0,-22xm238,-109r22,0r0,22r-22,0r0,-22xm150,-109r22,0r0,22r-22,0r0,-22xm63,-109r22,0r0,22r-22,0r0,-22xm19,-65r22,0r0,22r-22,0r0,-22xm106,-65r22,0r0,22r-22,0r0,-22xm194,-65r22,0r0,22r-22,0r0,-22xm63,-21r22,0r0,22r-22,0r0,-22xm150,-21r22,0r0,22r-22,0r0,-22xm238,-21r22,0r0,22r-22,0r0,-22xm194,23r22,0r0,22r-22,0r0,-22xm106,23r22,0r0,22r-22,0r0,-22xm19,23r22,0r0,22r-22,0r0,-22xm63,67r22,0r0,22r-22,0r0,-22xm150,67r22,0r0,22r-22,0r0,-22xm238,67r22,0r0,22r-22,0r0,-22","w":256},"\u2592":{"d":"19,-328r22,0r0,22r-22,0r0,-22xm63,-328r21,0r0,22r-21,0r0,-22xm106,-328r22,0r0,22r-22,0r0,-22xm150,-328r22,0r0,22r-22,0r0,-22xm194,-328r22,0r0,22r-22,0r0,-22xm238,-328r22,0r0,22r-22,0r0,-22xm-3,-284r22,0r0,22r-22,0r0,-22xm41,-284r22,0r0,22r-22,0r0,-22xm84,-284r22,0r0,22r-22,0r0,-22xm128,-284r22,0r0,22r-22,0r0,-22xm172,-284r22,0r0,22r-22,0r0,-22xm216,-284r22,0r0,22r-22,0r0,-22xm19,-240r22,0r0,22r-22,0r0,-22xm63,-240r21,0r0,22r-21,0r0,-22xm106,-240r22,0r0,22r-22,0r0,-22xm150,-240r22,0r0,22r-22,0r0,-22xm194,-240r22,0r0,22r-22,0r0,-22xm238,-240r22,0r0,22r-22,0r0,-22xm-3,-196r22,0r0,22r-22,0r0,-22xm41,-196r22,0r0,22r-22,0r0,-22xm84,-196r22,0r0,22r-22,0r0,-22xm128,-196r22,0r0,22r-22,0r0,-22xm172,-196r22,0r0,22r-22,0r0,-22xm216,-196r22,0r0,22r-22,0r0,-22xm19,-152r22,0r0,22r-22,0r0,-22xm63,-152r21,0r0,22r-21,0r0,-22xm106,-152r22,0r0,22r-22,0r0,-22xm150,-152r22,0r0,22r-22,0r0,-22xm194,-152r22,0r0,22r-22,0r0,-22xm238,-152r22,0r0,22r-22,0r0,-22xm-3,-109r22,0r0,22r-22,0r0,-22xm84,-109r22,0r0,22r-22,0r0,-22xm128,-109r22,0r0,22r-22,0r0,-22xm172,-109r22,0r0,22r-22,0r0,-22xm216,-109r22,0r0,22r-22,0r0,-22xm41,-109r22,0r0,22r-22,0r0,-22xm238,-65r22,0r0,22r-22,0r0,-22xm194,-65r22,0r0,22r-22,0r0,-22xm150,-65r22,0r0,22r-22,0r0,-22xm106,-65r22,0r0,22r-22,0r0,-22xm63,-65r21,0r0,22r-21,0r0,-22xm19,-65r22,0r0,22r-22,0r0,-22xm-3,-21r22,0r0,22r-22,0r0,-22xm41,-21r22,0r0,22r-22,0r0,-22xm84,-21r22,0r0,22r-22,0r0,-22xm128,-21r22,0r0,22r-22,0r0,-22xm172,-21r22,0r0,22r-22,0r0,-22xm216,-21r22,0r0,22r-22,0r0,-22xm238,23r22,0r0,22r-22,0r0,-22xm194,23r22,0r0,22r-22,0r0,-22xm150,23r22,0r0,22r-22,0r0,-22xm106,23r22,0r0,22r-22,0r0,-22xm63,23r21,0r0,22r-21,0r0,-22xm19,23r22,0r0,22r-22,0r0,-22xm-3,67r22,0r0,22r-22,0r0,-22xm41,67r22,0r0,22r-22,0r0,-22xm84,67r22,0r0,22r-22,0r0,-22xm128,67r22,0r0,22r-22,0r0,-22xm172,67r22,0r0,22r-22,0r0,-22xm216,67r22,0r0,22r-22,0r0,-22","w":256},"\u2593":{"d":"263,-262r0,66r-22,0r0,22r22,0r0,65r-22,0r0,22r22,0r0,66r-22,0r0,22r22,0r0,66r-22,0r0,22r22,0r0,21r-263,0r0,-65r22,0r0,-22r-22,0r0,-66r22,0r0,-22r-22,0r0,-65r22,0r0,-22r-22,0r0,-66r22,0r0,-22r-22,0r0,-66r22,0r0,-22r22,0r0,22r22,0r0,-22r22,0r0,22r22,0r0,-22r21,0r0,22r22,0r0,-22r22,0r0,22r22,0r0,-22r22,0r0,22r22,0r0,-22r22,0r0,44r-22,0r0,22r22,0xm22,-284r0,22r22,0r0,-22r-22,0xm66,-284r0,22r22,0r0,-22r-22,0xm110,-284r0,22r21,0r0,-22r-21,0xm153,-284r0,22r22,0r0,-22r-22,0xm197,-284r0,22r22,0r0,-22r-22,0xm241,-240r-22,0r0,22r22,0r0,-22xm197,-240r-22,0r0,22r22,0r0,-22xm153,-240r-22,0r0,22r22,0r0,-22xm110,-240r-22,0r0,22r22,0r0,-22xm66,-240r-22,0r0,22r22,0r0,-22xm22,-196r0,22r22,0r0,-22r-22,0xm66,-196r0,22r22,0r0,-22r-22,0xm110,-196r0,22r21,0r0,-22r-21,0xm153,-196r0,22r22,0r0,-22r-22,0xm197,-196r0,22r22,0r0,-22r-22,0xm66,-152r-22,0r0,22r22,0r0,-22xm88,-152r0,22r22,0r0,-22r-22,0xm131,-152r0,22r22,0r0,-22r-22,0xm175,-152r0,22r22,0r0,-22r-22,0xm219,-152r0,22r22,0r0,-22r-22,0xm22,-109r0,22r22,0r0,-22r-22,0xm110,-109r0,22r21,0r0,-22r-21,0xm88,-87r0,-22r-22,0r0,22r22,0xm153,-109r0,22r22,0r0,-22r-22,0xm197,-109r0,22r22,0r0,-22r-22,0xm241,-43r0,-22r-22,0r0,22r22,0xm197,-43r0,-22r-22,0r0,22r22,0xm153,-43r0,-22r-22,0r0,22r22,0xm110,-43r0,-22r-22,0r0,22r22,0xm66,-43r0,-22r-22,0r0,22r22,0xm22,-21r0,22r22,0r0,-22r-22,0xm66,-21r0,22r22,0r0,-22r-22,0xm110,-21r0,22r21,0r0,-22r-21,0xm153,-21r0,22r22,0r0,-22r-22,0xm197,-21r0,22r22,0r0,-22r-22,0xm241,45r0,-22r-22,0r0,22r22,0xm197,45r0,-22r-22,0r0,22r22,0xm153,45r0,-22r-22,0r0,22r22,0xm110,45r0,-22r-22,0r0,22r22,0xm66,45r0,-22r-22,0r0,22r22,0xm22,67r0,22r22,0r0,-22r-22,0xm66,67r0,22r22,0r0,-22r-22,0xm110,67r0,22r21,0r0,-22r-21,0xm153,67r0,22r22,0r0,-22r-22,0xm197,67r0,22r22,0r0,-22r-22,0","w":262},"\u25a0":{"d":"26,-166r166,0r0,166r-166,0r0,-166","w":217},"\u25a1":{"d":"26,-166r166,0r0,166r-166,0r0,-166xm39,-153r0,140r139,0r0,-140r-139,0","w":217},"\u25aa":{"d":"112,-167r0,96r-96,0r0,-96r96,0","w":127},"\u25ab":{"d":"112,-167r0,96r-96,0r0,-96r96,0xm98,-153r-68,0r0,68r68,0r0,-68","w":127},"\u25ac":{"d":"0,-124r360,0r0,68r-360,0r0,-68","w":360},"\u25b2":{"d":"53,0r125,-249r125,249r-250,0","w":356},"\u25ba":{"d":"51,-249r255,127r-255,127r0,-254","w":356},"\u25bc":{"d":"303,-244r-125,249r-125,-249r250,0","w":356},"\u25c4":{"d":"306,-249r0,254r-255,-127","w":356},"\u25cb":{"d":"108,-179v41,0,77,35,77,77v0,42,-36,78,-77,78v-41,0,-77,-36,-77,-78v0,-42,36,-77,77,-77xm108,-37v34,0,64,-31,64,-65v0,-35,-29,-64,-64,-64v-34,0,-64,31,-64,64v0,33,30,65,64,65","w":216},"\u25cf":{"d":"109,-179v41,0,77,36,77,77v0,41,-36,78,-77,78v-41,0,-78,-37,-78,-78v0,-41,37,-77,78,-77","w":217},"\u25d8":{"d":"22,0r0,-172r172,0r0,172r-172,0xm108,-51v19,0,35,-16,35,-35v0,-19,-16,-36,-35,-36v-19,0,-36,17,-36,36v0,19,17,35,36,35","w":216},"\u25d9":{"d":"7,0r0,-203r203,0r0,203r-203,0xm108,-24v41,0,78,-36,78,-77v0,-41,-37,-78,-78,-78v-41,0,-77,36,-77,78v0,42,35,77,77,77xm108,-166v34,0,64,30,64,65v0,34,-30,64,-64,64v-34,0,-64,-30,-64,-64v0,-34,30,-65,64,-65","w":216},"\u25e6":{"d":"64,-169v26,0,50,24,50,50v0,27,-23,50,-50,50v-27,0,-50,-22,-50,-50v0,-27,23,-50,50,-50xm64,-82v20,0,37,-17,37,-37v0,-20,-17,-37,-37,-37v-20,0,-37,17,-37,37v0,20,17,37,37,37","w":127},"\u263a":{"d":"184,-203v60,0,112,52,112,112v0,60,-52,112,-112,112v-60,0,-112,-52,-112,-112v0,-60,52,-112,112,-112xm184,5v50,0,96,-46,96,-96v0,-50,-45,-96,-96,-96v-51,0,-96,45,-96,96v0,51,46,96,96,96xm141,-128v7,0,14,7,14,14v0,7,-7,14,-14,14v-7,0,-14,-7,-14,-14v0,-7,7,-14,14,-14xm227,-128v7,0,14,7,14,14v0,7,-7,14,-14,14v-7,0,-14,-7,-14,-14v0,-7,7,-14,14,-14xm132,-55r11,-6v16,33,66,34,81,0r12,6v-22,46,-82,45,-104,0","w":367},"\u263b":{"d":"189,-203v60,0,112,51,112,112v0,61,-52,112,-112,112v-60,0,-112,-52,-112,-112v0,-60,52,-112,112,-112xm146,-100v8,0,15,-6,15,-14v0,-8,-7,-14,-15,-14v-7,0,-14,7,-14,14v0,7,7,14,14,14xm232,-100v8,0,15,-7,15,-14v0,-7,-7,-14,-15,-14v-7,-1,-14,7,-14,14v0,7,7,15,14,14xm138,-55v21,46,81,45,103,0r-11,-6v-16,33,-66,34,-81,0","w":378},"\u263c":{"d":"159,-285r13,0r0,59v22,1,42,9,61,25r51,-50r9,9r-50,51v16,21,25,42,25,63r59,0r0,12r-59,0v-2,22,-10,42,-25,61r50,51r-10,9r-50,-49v-20,15,-40,22,-61,24r0,59r-13,0r0,-59v-24,-3,-44,-11,-61,-24r-52,49r-9,-9r50,-51v-15,-18,-23,-39,-25,-62r-59,0r0,-12r59,0v2,-23,10,-43,25,-61r-50,-51r9,-10r51,50v21,-15,42,-24,62,-25r0,-59xm165,-33v48,0,90,-42,90,-90v0,-48,-42,-90,-90,-90v-48,0,-90,42,-90,90v0,48,42,90,90,90","w":330},"\u2640":{"d":"183,-168v0,45,-36,81,-79,83r0,65r73,0r0,9r-73,0r0,70r-10,0r0,-70r-73,0r0,-9r73,0r0,-65v-42,-3,-78,-37,-78,-83v-1,-45,38,-84,83,-84v45,0,84,39,84,84xm99,-93v40,0,75,-35,75,-75v0,-40,-35,-75,-75,-75v-40,0,-75,35,-75,75v0,40,35,75,75,75","w":198},"\u2642":{"d":"96,-191v49,-16,53,-20,99,-50r5,2v4,42,13,78,28,108r-4,3v-17,-22,-30,-46,-39,-73r-52,111v24,9,51,42,51,76v0,44,-38,74,-81,74v-45,0,-85,-37,-85,-81v0,-52,53,-94,107,-72r51,-112v-25,11,-52,16,-80,18r0,-4xm162,-21v0,-37,-34,-70,-69,-70v-36,-1,-68,32,-68,67v-1,38,32,70,69,70v37,0,68,-31,68,-67","w":240},"\u2660":{"d":"95,-82v-15,46,-81,43,-84,-5v0,-18,11,-36,33,-54v31,-25,48,-50,52,-75v5,54,79,73,85,128v2,21,-18,41,-38,40v-18,0,-33,-12,-45,-34v-1,51,22,72,67,75r1,7r-140,0r2,-7v45,1,70,-28,67,-75","w":191},"\u2663":{"d":"179,-48v-28,-2,-44,-17,-58,-42v2,55,22,76,71,84r2,6r-149,0r1,-6v50,-7,70,-31,71,-84v-10,24,-30,41,-58,42v-25,1,-48,-22,-48,-49v0,-37,36,-64,71,-40v-27,-33,-4,-79,36,-79v41,-1,66,48,37,79v36,-23,71,2,72,39v1,27,-21,51,-48,50","w":238},"\u2665":{"d":"107,-172v4,-56,97,-57,95,0v-1,36,-14,47,-37,78v-32,43,-53,75,-58,98v-12,-52,-61,-94,-90,-146v-18,-34,3,-74,39,-74v24,0,41,15,51,44","w":212},"\u2666":{"d":"91,-216v23,38,50,74,81,110v-16,15,-70,86,-81,110v-12,-22,-38,-59,-80,-110v38,-45,64,-81,80,-110","w":182},"\u266a":{"d":"5,25v0,-65,101,-89,163,-54r-5,-241r10,0v25,14,96,77,100,105v0,4,-6,12,-10,12v-23,-15,-61,-60,-88,-74r4,242v0,80,-174,95,-174,10","w":277},"\u266b":{"d":"53,33v0,-43,53,-65,93,-42r0,-201r164,-51r0,228v2,48,-21,67,-63,69v-31,1,-49,-18,-50,-46v0,-43,52,-65,93,-42r0,-149r-123,38r0,172v1,45,-22,70,-65,70v-28,0,-49,-18,-49,-46","w":360},"\uf001":{"d":"105,-209v-23,-3,-33,4,-31,31r31,0r0,39r-31,0r0,139r-47,0r0,-139r-20,0r0,-39r20,0v-5,-59,23,-75,78,-70r0,39xm172,-192r-50,0r0,-49r50,0r0,49xm122,-178r50,0r0,178r-50,0r0,-178","w":190},"\uf002":{"d":"105,-209v-23,-3,-33,4,-31,31r31,0r0,39r-31,0r0,139r-47,0r0,-139r-20,0r0,-39r20,0v-5,-59,23,-75,78,-70r0,39xm122,-240r50,0r0,240r-50,0r0,-240","w":190},"\uf003":{"d":"58,-242r41,0r0,84r18,0r0,30r-18,0r0,32r-39,0r0,-32r-55,0r0,-28xm64,-154r0,-55r-32,55r32,0","w":122},"\uf004":{"d":"80,-240r36,0r-28,70r-18,0","w":165},"\uf005":{"d":"67,19r37,0r-28,67r-19,0","w":165},"\u00a4":{"d":"122,-179r23,-23r25,25r-23,24v10,17,11,40,0,58r24,24r-27,26r-23,-23v-20,10,-40,9,-59,-1r-23,24r-25,-25r23,-24v-10,-18,-11,-41,0,-59r-24,-23r27,-26r23,23v18,-10,41,-9,59,0xm92,-152v-14,1,-29,12,-28,28v0,16,12,28,28,28v16,0,28,-13,28,-28v0,-15,-13,-28,-28,-28"}}});

/* cufon-config.js */
Cufon.set('fontFamily','FranklinGDC');
Cufon.replace('h1');


/* global.js */
/*globals jQuery, ND, window */
(function(ND, $){
	$(function($){


		//var timeline = ND.timeline().init('#timeline');
		
		if( window.location.href.indexOf('text-only=true') === -1 ){
			$(".text-only-link").after('<p class="loading">Loadingtf...</p>');
			$("#timeline").removeClass("disabled").find(".non-js").hide();
			
			
			var backgrounds = ND.backgrounds().init('#timeline');		
			var timelineContents = ND.timelineContents().init( {
				elem: '#timeline',
				data: '/images/int/history/data.js',
				popupConent: '/images/int/history/contents-popup.html'
			});
			var slider = ND.slider().init('#timeline');
		}
		else{
			$("#timeline").removeClass("not-loaded");
			$("#timeline").find(".non-js").show();
		}
		
	});
}(window.ND || {}, jQuery));

