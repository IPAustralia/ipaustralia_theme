/*
*   Custom code for Alex for IP Australia.
*
*/
var $ab = jQuery("#ipAustralia-block");
NinaVars = { 
    welcome: "Hello. I'm Alex, IP Australia's virtual assistant. I'm here to help you start your trademark enquiries. I can show you where to view your <a href='/about-us/agency-overview/privacy-policy'>privacy information.</a>"
};
if(getParameterByName('preprod')) {
   NinaVars.preprod = true;
}

// add skip link to Alex
if (($ab.length()) > 0 ) {
    //only if #ipAustralia-block for alex is on the page.
    jQuery("#skip-link").append('<a id="skip-to-alex" href="#" class="element-invisible element-focusable toc-filter-processed">Skip to Virtual Assistant</a>');
}
jQuery("#skip-to-alex").click(function(){
    //attempt to focus on alex
    alexFocus();
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

function alexFocus() {
/*    if (!va.isOpen()) {
        va.open();
    }*/
    var lastMessage = $ab.find('.nw_Conversation').find('.nw_AgentSays, .nw_UserSays').last();
    lastMessage.focus();
};
