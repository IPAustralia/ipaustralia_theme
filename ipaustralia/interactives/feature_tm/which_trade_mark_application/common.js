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