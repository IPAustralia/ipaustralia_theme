var deviceAgent = navigator.userAgent.toLowerCase();
if(deviceAgent.match(/iphone/i)){
    var css = document.createElement('link');
    css.type = "text/css";
    css.rel = "stylesheet";
    css.href = path+"/stylesheets/ios.css";
    var h = document.getElementsByTagName('head')[0];
    h.appendChild(css);
    }
