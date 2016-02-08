function png_fix_on_the_fly( imgObj )
{
    if ($.browser.msie && parseInt($.browser.version.substr(0, 1)) < 7) { // ie6 or 5
        imgObj.css("filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + imgObj.attr('src') + "', sizingMethod='scale')").attr("src", "/images/int/victa/blank.gif");
    }
}

function png_fix_css()
{
    if ($.browser.msie && parseInt($.browser.version.substr(0, 1)) < 7) { // ie6 or 5
        $(".png").each(function(){
            var bg = $(this).css("backgroundImage");
            bg.match(/^url[("']+(.*\.png)[)"']+$/i);
            bg = RegExp.$1;
            $(this).css("filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + bg + "', sizingMethod='crop')").css("backgroundImage", "none");
        });
    }
}

function png_fix_img( multiSelector )
{
    if ($.browser.msie && parseInt($.browser.version.substr(0, 1)) < 7) { // ie6 or 5
        $(multiSelector).each(function(){
            $(this).css("filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + $(this).attr('src') + "', sizingMethod='scale')").attr("src", "/images/int/victa/blank.gif");
        });
    }
}

function png_fix_css_dynamic( obj )
{
    if ($.browser.msie && parseInt($.browser.version.substr(0, 1)) < 7) { // ie6 or 5  
        var bg = obj.css("backgroundImage");
        bg.match(/^url[("']+(.*\.png)[)"']+$/i);
        bg = RegExp.$1;
        obj.css("filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + bg + "', sizingMethod='crop')").css("backgroundImage", "none");
    }
}