/*
*   Custom code for Alex for IP Australia.
*
*/
NinaVars = { 
    welcome: "Hello. I'm Alex, IP Australia's virtual assistant. As I am new to IP Australia, please be aware that I am still <strong>learning</strong> and can <strong>only</strong> assist with general trade mark information during this time.  You can view important information about your <a href='/about-us/agency-overview/privacy-policy'>privacy.</a>"
};

if(getParameterByName('preprod')) {
   NinaVars.preprod = true;
}

// add skip link to Alex
jQuery( document ).ready(function() {
    var $ab = jQuery("#ipAustralia-block");
    if ($ab.length) {
        //only if #ipAustralia-block for alex is on the page.
        jQuery("#skip-link").append('<a id="skip-to-alex" href="#" class="element-invisible element-focusable">Skip to Virtual Assistant</a>');
    }
});
jQuery("#skip-to-alex").click(function(){
    //attempt to focus on alex
    va.focusFromSkipLinks;
    console.log("alex-skip");
});


function getParameterByName(name, url) {
    //this function is typically used to return a boolean
    if (!url) url = window.location.href;
    url = url.toLowerCase(); // This is just to avoid case sensitiveness  
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    if(decodeURIComponent(results[2].replace(/\+/g, " ")) === "true"){
        return true; //return boolean for NinaVars
    } else {
        return false;
        //return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
}

/*function alexFocus() {
    if (!$ab.hasClass("nwNormal")||!$ab.hasClass("nwExpand1")) {
        va.open();
    }
    var lastMessage = $ab.find('.nw_Conversation').find('.nw_AgentSays, .nw_UserSays').last();
    lastMessage.focus();
};
*/