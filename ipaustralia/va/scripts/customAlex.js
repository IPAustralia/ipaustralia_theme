/*
*   Custom code for Alex for IP Australia.
*
*/
NinaVars = {
    //welcome: 'Hello. I&rsquo;m Alex, IP Australia&rsquo;s virtual assistant. I can assist with general intellectual property rights information and online services questions. We have information about your <a href="#" data-vtz-link-type="Dialog" data-vtz-jump="4861991975096831866" class="dialog toc-filter-processed">privacy.</a>',
    welcome: '<p>Hello. I&rsquo;m Alex, IP Australia&rsquo;s virtual assistant.</p><p>I can assist with general intellectual property rights information and online services questions. We have information about your <a href="#" data-vtz-link-type="Dialog" data-vtz-jump="4861991975096831866" class="dialog toc-filter-processed">privacy.</a></p><p style="color:#f00">Please note: I&rsquo;m undergoing some routine maintenance over the next few days and may not be able to respond to your enquiries at this time.  I&rsquo;m sorry for any inconvenience caused.</p>',
    invocationpoint: document.location.href
};
//Activate pre prod when deploying to test site.
if(getParameterByName('preprod')) {
   NinaVars.preprod = true;
}
/*
NinaVars.preprod = true; //Disable for production release
*/
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

window.ipa = window.ipa || {};
window.ipa.virtualAssistant = window.ipa.virtualAssistant || {};

jQuery( document ).ready(function() {

    var va = window.ipa.virtualAssistant;

    va.OPEN_ALEX_TEXT = "Open Alex virtual assistant. Ask questions to get help around the site.";
    va.CLOSE_ALEX_TEXT = "Close Alex virtual assistant";
    va.EXPAND_ALEX_TEXT = "Expand Alex virtual assistant for a larger view";
    va.CONTRACT_ALEXT_TEXT = "Contract Alex virtual assistant";
    va.ASK_ALEX_TEXT = "Enter question for Alex virtual assistant";

    var $ab = jQuery("#ipAustralia-block");

    if ($ab.length) {
        //only if #ipAustralia-block for alex is on the page, add the skip to link.
        jQuery("#skip-link").append('<a id="skip-to-alex" href="#" class="element-invisible element-focusable">Skip to Virtual Assistant</a>');
    }

    jQuery("#skip-to-alex").click(function(){
        //attempt to focus on alex
        alexFocus();
    });

    function alexFocus() {
        if (!$ab.hasClass("nwNormal")||!$ab.hasClass("nwExpand1")) {
            va.open();
        }
        var lastMessage = $ab.find('.nw_Conversation').find('.nw_AgentSays, .nw_UserSays').last();
        lastMessage.focus();
    };
});
