
/* this is an amalgamted script of numerous jquery items and a combined commnon file.
Issues with the ordering of scripts and subsequent functions within the CMS have forced the amalgamation
*/

function runInteractiveFunctions(){

pngFix();

function pngFix(){

/* ----------------------------------------------------------------------------------------------------------------------------------*/
/* source: jquery.pngFix.js */

/**
 * --------------------------------------------------------------------
 * jQuery-Plugin "pngFix"
 * Version: 1.1, 11.09.2007
 * by Andreas Eberhard, andreas.eberhard@gmail.com
 *                      http://jquery.andreaseberhard.de/
 *
 * Copyright (c) 2007 Andreas Eberhard
 * Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php)
 */
eval(function(p,a,c,k,e,r){e=function(c){return(c<62?'':e(parseInt(c/62)))+((c=c%62)>35?String.fromCharCode(c+29):c.toString(36))};if('0'.replace(0,e)==0){while(c--)r[e(c)]=k[c];k=[function(e){return r[e]||e}];e=function(){return'([237-9n-zA-Z]|1\\w)'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(s(m){3.fn.pngFix=s(c){c=3.extend({P:\'blank.gif\'},c);8 e=(o.Q=="t R S"&&T(o.u)==4&&o.u.A("U 5.5")!=-1);8 f=(o.Q=="t R S"&&T(o.u)==4&&o.u.A("U 6.0")!=-1);p(3.browser.msie&&(e||f)){3(2).B("img[n$=.C]").D(s(){3(2).7(\'q\',3(2).q());3(2).7(\'r\',3(2).r());8 a=\'\';8 b=\'\';8 g=(3(2).7(\'E\'))?\'E="\'+3(2).7(\'E\')+\'" \':\'\';8 h=(3(2).7(\'F\'))?\'F="\'+3(2).7(\'F\')+\'" \':\'\';8 i=(3(2).7(\'G\'))?\'G="\'+3(2).7(\'G\')+\'" \':\'\';8 j=(3(2).7(\'H\'))?\'H="\'+3(2).7(\'H\')+\'" \':\'\';8 k=(3(2).7(\'V\'))?\'float:\'+3(2).7(\'V\')+\';\':\'\';8 d=(3(2).parent().7(\'href\'))?\'cursor:hand;\':\'\';p(2.9.v){a+=\'v:\'+2.9.v+\';\';2.9.v=\'\'}p(2.9.w){a+=\'w:\'+2.9.w+\';\';2.9.w=\'\'}p(2.9.x){a+=\'x:\'+2.9.x+\';\';2.9.x=\'\'}8 l=(2.9.cssText);b+=\'<y \'+g+h+i+j;b+=\'9="W:X;white-space:pre-line;Y:Z-10;I:transparent;\'+k+d;b+=\'q:\'+3(2).q()+\'z;r:\'+3(2).r()+\'z;\';b+=\'J:K:L.t.M(n=\\\'\'+3(2).7(\'n\')+\'\\\', N=\\\'O\\\');\';b+=l+\'"></y>\';p(a!=\'\'){b=\'<y 9="W:X;Y:Z-10;\'+a+d+\'q:\'+3(2).q()+\'z;r:\'+3(2).r()+\'z;">\'+b+\'</y>\'}3(2).hide();3(2).after(b)});3(2).B("*").D(s(){8 a=3(2).11(\'I-12\');p(a.A(".C")!=-1){8 b=a.13(\'url("\')[1].13(\'")\')[0];3(2).11(\'I-12\',\'none\');3(2).14(0).15.J="K:L.t.M(n=\'"+b+"\',N=\'O\')"}});3(2).B("input[n$=.C]").D(s(){8 a=3(2).7(\'n\');3(2).14(0).15.J=\'K:L.t.M(n=\\\'\'+a+\'\\\', N=\\\'O\\\');\';3(2).7(\'n\',c.P)})}return 3}})(3);',[],68,'||this|jQuery||||attr|var|style||||||||||||||src|navigator|if|width|height|function|Microsoft|appVersion|border|padding|margin|span|px|indexOf|find|png|each|id|class|title|alt|background|filter|progid|DXImageTransform|AlphaImageLoader|sizingMethod|scale|blankgif|appName|Internet|Explorer|parseInt|MSIE|align|position|relative|display|inline|block|css|image|split|get|runtimeStyle'.split('|'),0,{}))

}



wresize();

function wresize(){
/* ----------------------------------------------------------------------------------------------------------------------------------*/
/* source: jquery.wresize.js */


/*  
===============================================================================
WResize is the jQuery plugin for fixing the IE window resize bug
...............................................................................
                                               Copyright 2007 / Andrea Ercolino
-------------------------------------------------------------------------------
LICENSE: http://www.opensource.org/licenses/mit-license.php
WEBSITE: http://noteslog.com/
===============================================================================
*/

( function( $ ) 
{
	$.fn.wresize = function( f ) 
	{
		version = '1.1';
		wresize = {fired: false, width: 0};

		function resizeOnce() 
		{
			if ( $.browser.msie )
			{
				if ( ! wresize.fired )
				{
					wresize.fired = true;
				}
				else 
				{
					var version = parseInt( $.browser.version, 10 );
					wresize.fired = false;
					if ( version < 7 )
					{
						return false;
					}
					else if ( version == 7 )
					{
						//a vertical resize is fired once, an horizontal resize twice
						var width = $( window ).width();
						if ( width != wresize.width )
						{
							wresize.width = width;
							return false;
						}
					}
				}
			}

			return true;
		}

		function handleWResize( e ) 
		{
			if ( resizeOnce() )
			{
				return f.apply(this, [e]);
			}
		}

		this.each( function() 
		{
			if ( this == window )
			{
				$( this ).resize( handleWResize );
			}
			else
			{
				$( this ).resize( f );
			}
		} );

		return this;
	};

} ) ( jQuery );


}


history();

/* ----------------------------------------------------------------------------------------------------------------------------------*/

/* source: jquery.history.js */

function history(){

(function($) {

function History()
{
    this._curHash = '';
    this._callback = function(hash){};
};

$.extend(History.prototype, {

    init: function(callback) {
        this._callback = callback;
        this._curHash = location.hash;

        if($.browser.msie) {
            // To stop the callback firing twice during initilization if no hash present
            if (this._curHash == '') {
                this._curHash = '#';
            }

            // add hidden iframe for IE
            $("body").prepend('<iframe id="jQuery_history" style="display: none;"></iframe>');
            var iframe = $("#jQuery_history")[0].contentWindow.document;
            iframe.open();
            iframe.close();
            iframe.location.hash = this._curHash;
        }
        else if ($.browser.safari) {
            // etablish back/forward stacks
            this._historyBackStack = [];
            this._historyBackStack.length = history.length;
            this._historyForwardStack = [];
            this._isFirst = true;
            this._dontCheck = false;
        }
        this._callback(this._curHash.replace(/^#/, ''));
        setInterval(this._check, 100);
    },

    add: function(hash) {
        // This makes the looping function do something
        this._historyBackStack.push(hash);
        
        this._historyForwardStack.length = 0; // clear forwardStack (true click occured)
        this._isFirst = true;
    },
    
    _check: function() {
        if($.browser.msie) {
            // On IE, check for location.hash of iframe
            var ihistory = $("#jQuery_history")[0];
            var iframe = ihistory.contentDocument || ihistory.contentWindow.document;
            var current_hash = iframe.location.hash;
            if(current_hash != $.history._curHash) {
            
                location.hash = current_hash;
                $.history._curHash = current_hash;
                $.history._callback(current_hash.replace(/^#/, ''));
                
            }
        } else if ($.browser.safari) {
            if (!$.history._dontCheck) {
                var historyDelta = history.length - $.history._historyBackStack.length;
                
                if (historyDelta) { // back or forward button has been pushed
                    $.history._isFirst = false;
                    if (historyDelta < 0) { // back button has been pushed
                        // move items to forward stack
                        for (var i = 0; i < Math.abs(historyDelta); i++) $.history._historyForwardStack.unshift($.history._historyBackStack.pop());
                    } else { // forward button has been pushed
                        // move items to back stack
                        for (var i = 0; i < historyDelta; i++) $.history._historyBackStack.push($.history._historyForwardStack.shift());
                    }
                    var cachedHash = $.history._historyBackStack[$.history._historyBackStack.length - 1];
                    if (cachedHash != undefined) {
                        $.history._curHash = location.hash;
                        $.history._callback(cachedHash);
                    }
                } else if ($.history._historyBackStack[$.history._historyBackStack.length - 1] == undefined && !$.history._isFirst) {
                    // back button has been pushed to beginning and URL already pointed to hash (e.g. a bookmark)
                    // document.URL doesn't change in Safari
                    if (document.URL.indexOf('#') >= 0) {
                        $.history._callback(document.URL.split('#')[1]);
                    } else {
                        $.history._callback('');
                    }
                    $.history._isFirst = true;
                }
            }
        } else {
            // otherwise, check for location.hash
            var current_hash = location.hash;
            if(current_hash != $.history._curHash) {
                $.history._curHash = current_hash;
                $.history._callback(current_hash.replace(/^#/, ''));
            }
        }
    },

    load: function(hash) {
        var newhash;
        
        if ($.browser.safari) {
            newhash = hash;
        } else {
            newhash = '#' + hash;
            location.hash = newhash;
        }
        this._curHash = newhash;
        
        if ($.browser.msie) {
            var ihistory = $("#jQuery_history")[0]; // TODO: need contentDocument?
            var iframe = ihistory.contentWindow.document;
            iframe.open();
            iframe.close();
            iframe.location.hash = newhash;
            this._callback(hash);
        }
        else if ($.browser.safari) {
            this._dontCheck = true;
            // Manually keep track of the history values for Safari
            this.add(hash);
            
            // Wait a while before allowing checking so that Safari has time to update the "history" object
            // correctly (otherwise the check loop would detect a false change in hash).
            var fn = function() {$.history._dontCheck = false;};
            window.setTimeout(fn, 200);
            this._callback(hash);
            // N.B. "location.hash=" must be the last line of code for Safari as execution stops afterwards.
            //      By explicitly using the "location.hash" command (instead of using a variable set to "location.hash") the
            //      URL in the browser and the "history" object are both updated correctly.
            location.hash = newhash;
        }
        else {
          this._callback(hash);
        }
    }
});

$(document).ready(function() {
    $.history = new History(); // singleton instance
});

})(jQuery);

}




cycle();


/* ----------------------------------------------------------------------------------------------------------------------------------*/

/* source: jquery.cycle.lite.min.js */

function cycle(){

(function(D){var A="Lite-1.0";D.fn.cycle=function(E){return this.each(function(){E=E||{};if(this.cycleTimeout){clearTimeout(this.cycleTimeout)}this.cycleTimeout=0;this.cyclePause=0;var I=D(this);var J=E.slideExpr?D(E.slideExpr,this):I.children();var G=J.get();if(G.length<2){if(window.console&&window.console.log){window.console.log("terminating; too few slides: "+G.length)}return }var H=D.extend({},D.fn.cycle.defaults,E||{},D.metadata?I.metadata():D.meta?I.data():{});H.before=H.before?[H.before]:[];H.after=H.after?[H.after]:[];H.after.unshift(function(){H.busy=0});var F=this.className;H.width=parseInt((F.match(/w:(\d+)/)||[])[1])||H.width;H.height=parseInt((F.match(/h:(\d+)/)||[])[1])||H.height;H.timeout=parseInt((F.match(/t:(\d+)/)||[])[1])||H.timeout;if(I.css("position")=="static"){I.css("position","relative")}if(H.width){I.width(H.width)}if(H.height&&H.height!="auto"){I.height(H.height)}var K=0;J.css({position:"absolute",top:0,left:0}).hide().each(function(M){D(this).css("z-index",G.length-M)});D(G[K]).css("opacity",1).show();if(D.browser.msie){G[K].style.removeAttribute("filter")}if(H.fit&&H.width){J.width(H.width)}if(H.fit&&H.height&&H.height!="auto"){J.height(H.height)}if(H.pause){I.hover(function(){this.cyclePause=1},function(){this.cyclePause=0})}D.fn.cycle.transitions.fade(I,J,H);J.each(function(){var M=D(this);this.cycleH=(H.fit&&H.height)?H.height:M.height();this.cycleW=(H.fit&&H.width)?H.width:M.width()});J.not(":eq("+K+")").css({opacity:0});if(H.cssFirst){D(J[K]).css(H.cssFirst)}if(H.timeout){if(H.speed.constructor==String){H.speed={slow:600,fast:200}[H.speed]||400}if(!H.sync){H.speed=H.speed/2}while((H.timeout-H.speed)<250){H.timeout+=H.speed}}H.speedIn=H.speed;H.speedOut=H.speed;H.slideCount=G.length;H.currSlide=K;H.nextSlide=1;var L=J[K];if(H.before.length){H.before[0].apply(L,[L,L,H,true])}if(H.after.length>1){H.after[1].apply(L,[L,L,H,true])}if(H.click&&!H.next){H.next=H.click}if(H.next){D(H.next).bind("click",function(){return C(G,H,H.rev?-1:1)})}if(H.prev){D(H.prev).bind("click",function(){return C(G,H,H.rev?1:-1)})}if(H.timeout){this.cycleTimeout=setTimeout(function(){B(G,H,0,!H.rev)},H.timeout+(H.delay||0))}})};function B(J,E,I,K){if(E.busy){return }var H=J[0].parentNode,M=J[E.currSlide],L=J[E.nextSlide];if(H.cycleTimeout===0&&!I){return }if(I||!H.cyclePause){if(E.before.length){D.each(E.before,function(N,O){O.apply(L,[M,L,E,K])})}var F=function(){if(D.browser.msie){this.style.removeAttribute("filter")}D.each(E.after,function(N,O){O.apply(L,[M,L,E,K])})};if(E.nextSlide!=E.currSlide){E.busy=1;D.fn.cycle.custom(M,L,E,F)}var G=(E.nextSlide+1)==J.length;E.nextSlide=G?0:E.nextSlide+1;E.currSlide=G?J.length-1:E.nextSlide-1}if(E.timeout){H.cycleTimeout=setTimeout(function(){B(J,E,0,!E.rev)},E.timeout)}}function C(E,F,I){var H=E[0].parentNode,G=H.cycleTimeout;if(G){clearTimeout(G);H.cycleTimeout=0}F.nextSlide=F.currSlide+I;if(F.nextSlide<0){F.nextSlide=E.length-1}else{if(F.nextSlide>=E.length){F.nextSlide=0}}B(E,F,1,I>=0);return false}D.fn.cycle.custom=function(K,H,I,E){var J=D(K),G=D(H);G.css({opacity:0});var F=function(){G.animate({opacity:1},I.speedIn,I.easeIn,E)};J.animate({opacity:0},I.speedOut,I.easeOut,function(){J.css({display:"none"});if(!I.sync){F()}});if(I.sync){F()}};D.fn.cycle.transitions={fade:function(F,G,E){G.not(":eq(0)").css("opacity",0);E.before.push(function(){D(this).show()})}};D.fn.cycle.ver=function(){return A};D.fn.cycle.defaults={timeout:4000,speed:1000,next:null,prev:null,before:null,after:null,height:"auto",sync:1,fit:0,pause:0,delay:0,slideExpr:null}})(jQuery)

}
/* ----------------------------------------------------------------------------------------------------------------------------------*/



common();

/* source: common.js */
function common(){


/* Bobby's Code */
jQuery(document).ready(function()
{

    jQuery('.answer').hide();


    jQuery('.button.yes').click(function()
    {
        if(jQuery(this).hasClass('active'))
        {
            jQuery(this).removeClass('active');
            jQuery('.answer').hide();

            return;
        }

        jQuery('.answer').hide();
        jQuery('.button.no').removeClass('active');
        jQuery(this).addClass('active');
        jQuery(this).parent().parent().children('.answer.yes').show();
    });


    jQuery('.button.no').click(function()
    {
        if(jQuery(this).hasClass('active'))
        {
            jQuery(this).removeClass('active');
            jQuery('.answer').hide();

            return;
        }

        jQuery('.answer').hide();
        jQuery('.button.yes').removeClass('active');
        jQuery(this).addClass('active');
        jQuery(this).parent().parent().children('.answer.no').show();
    });

});

jQuery(document).ready(function(){      
    jQuery('.below .clr').before(jQuery('#belowdisclaimer'));
    
    jQuery('#slideshow').css({
        height:'135px',
        overflow:'hidden'
    });
    jQuery('.step').css('display','none');
    
    // this is the stuff to neaten the page if they are running js
    
    jQuery('#closebutton').click(function(){
//        if(confirm('Are you sure you want to close this page?'))
            window.close();
//        else return false;
    });
    
    if(jQuery('.sheet').length){
        jQuery.history.init(gotostep);
        jQuery("a[rel=history]").click(function(){
            var hash = this.href;
            hash = hash.replace(/^.*#/, '');
            jQuery.history.load(hash);
            return false;
        });
    }    

    jQuery('#slideshow').cycle({
        fx: 'fade',
        timeout:2250,
        speed:0
    });

    //jQuery(document).pngFix();



});



function gotostep(hash){
    if(!hash) hash='step0';

    if(hash != 'step0')
    {
        jQuery('#slideshow').cycle('stop');
        jQuery('#slideshow').hide(); 
    } else {
        jQuery('#slideshow').show();
        jQuery('#slideshow').cycle('resume');
    }

    jQuery('.sheet').hide();
    jQuery('#steps').show();

    jQuery('.step').hide();
    jQuery('.step').removeClass('active');
    jQuery('.tab').removeClass('active').removeClass('firstactive').removeClass('lastactive');

    step=substr(hash,4);        
    jQuery('#step'+step).show();
    if(jQuery('#tab'+step).hasClass('last'))
        jQuery('#tab'+step).addClass('lastactive');
    else if(jQuery('#tab'+step).hasClass('first'))
        jQuery('#tab'+step).addClass('firstactive');
    else jQuery('#tab'+step).addClass('active');
    setnextprev(hash);
}

function setnextprev(hash){
    if(hash=='step0'){
        jQuery('#prevbutton').hide().attr('href','#step0');
        jQuery('#nextbutton').show().attr('href','#step1');
        jQuery('#belowdisclaimer').show();
        jQuery('#belowbuttons').hide();
    }
    else{
        if(hash=='step12'){
            jQuery('#prevbutton').show().attr('href','#step11');
            jQuery('#nextbutton').hide().attr('href','#step13'); 
        }
        else{
            step=substr(hash,4);
            jQuery('#prevbutton').show().attr('href','#step'+(parseInt(step)-1));
            jQuery('#nextbutton').show().attr('href','#step'+(parseInt(step)+1));                
        }
        jQuery('#belowdisclaimer').hide();
        jQuery('#belowbuttons').show();                
    }
}


function substr (str, start, len) {
    var i = 0, allBMP = true, es = 0, el = 0, se = 0, ret = '';
    str += '';
    var end = str.length;

    // BEGIN REDUNDANT
    this.php_js = this.php_js || {};
    this.php_js.ini = this.php_js.ini || {};
    // END REDUNDANT
    switch(
        (this.php_js.ini['unicode.semantics'] && 
            this.php_js.ini['unicode.semantics'].local_value.toLowerCase())) {
        case 'on': // Full-blown Unicode including non-Basic-Multilingual-Plane characters
            // strlen()
            for (i=0; i < str.length; i++) {
                if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i+1))) {
                    allBMP = false;
                    break;
                }
            }

            if (!allBMP) {
                if (start < 0) {
                    for (i = end - 1, es = (start += end); i >= es; i--) {
                        if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i-1))) {
                            start--;
                            es--;
                        }
                    }
                }
                else {
                    var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
                    while ((surrogatePairs.exec(str)) != null) {
                        var li = surrogatePairs.lastIndex;
                        if (li - 2 < start) {
                            start++;
                        }
                        else {
                            break;
                        }
                    }
                }

                if (start >= end || start < 0) {
                    return false;
                }
                if (len < 0) {
                    for (i = end - 1, el = (end += len); i >= el; i--) {
                        if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i-1))) {
                            end--;
                            el--;
                        }
                    }
                    if (start > end) {
                        return false;
                    }
                    return str.slice(start, end);
                }
                else {
                    se = start + len;
                    for (i = start; i < se; i++) {
                        ret += str.charAt(i);
                        if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i+1))) {
                            se++; // Go one further, since one of the "characters" is part of a surrogate pair
                        }
                    }
                    return ret;
                }
                break;
            }
            // Fall-through
        case 'off': // assumes there are no non-BMP characters;
                           //    if there may be such characters, then it is best to turn it on (critical in true XHTML/XML)
        default:
            if (start < 0) {
                start += end;
            }
            end = typeof len === 'undefined' ? end : (len < 0 ? len + end : len + start);
            // PHP returns false if start does not fall within the string.
            // PHP returns false if the calculated end comes before the calculated start.
            // PHP returns an empty string if start and end are the same.
            // Otherwise, PHP returns the portion of the string from start to end.
            return start >= str.length || start < 0 || start > end ? !1 : str.slice(start, end);
    }
    return undefined; // Please Netbeans
}

}

