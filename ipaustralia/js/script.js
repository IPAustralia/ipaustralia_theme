jQuery(window).load(function () {
    resizing();
});
jQuery(window).resize(function () {
    resizing();
});
jQuery(document).ready(function () {
    setBreakPoints();
    addTwitterFeed();
});

jQuery(document).on('click', '.bp-small #block-bean-tools-and-resources-generic-bloc h3', function () {
    jQuery('#block-bean-tools-and-resources-generic-bloc .inside').css('height', 'auto');

    if (jQuery(this).closest('.inside').hasClass('open')) {
        jQuery(this).siblings('.tools-resources-list').slideToggle(function () {
            jQuery(this).closest('.inside').removeClass('open');
        });
    } else {
        jQuery(this).siblings('.tools-resources-list').slideToggle(function () {
            jQuery(this).closest('.inside').addClass('open');
        });
    }
});


function resizing() {
    /*
     *  Do action on resizing window or document
     *  This is normally is used on mobile devices when rotating 
     */
    removeJsAppliedStyles();
    equaliseElementsHeight();
    showSearchIcon();
}
function equaliseElementsHeight() {
    /*
     *  Make element same height. example tool box on home page
     */
    equalHeight('#block-bean-tools-and-resources-generic-bloc .panels-flexible-region-inside');
    equalHeight('.footer li.expanded');

    setTimeout(function () {
        equalHeight('#block-panels-mini-consultations-and-twitter-feed-2 .panel-panel .inside');
    }, 500);
}
function setBreakPoints() {
    /*
     * Check the current viewport and attach class name to the body
     * Used for responsive styling
     */
    var $break_point_xlarge = "1200px";
    var $break_point_large = "992px"; /*Desktop tablet landscape*/
    var $break_point_medium = "767px"; /*Tablet*/
    var $break_point_midsmall = "640px"; /*Mobile Landscape*/
    var $break_point_small = "480px"; /*Mobile*/

    enquire.register("screen and (max-width:" + $break_point_xlarge + ")", {
        match: function () {
            jQuery('body').addClass('bp-xlarge');
        },
        unmatch: function () {
            jQuery('body').removeClass('bp-xlarge');
        },
        setup: function () {},
        deferSetup: true,
        destroy: function () {}

    });
    enquire.register("screen and (min-width:" + $break_point_xlarge + ")", {
        match: function () {
            jQuery('body').addClass('bp-xxlarge');
        },
        unmatch: function () {
            jQuery('body').removeClass('bp-xxlarge');
        },
        setup: function () {},
        deferSetup: true,
        destroy: function () {}

    });
    enquire.register("screen and (max-width:" + $break_point_large + ")", {
        match: function () {
            jQuery('body').addClass('bp-large');
        },
        unmatch: function () {
            jQuery('body').removeClass('bp-large');
        },
        setup: function () {},
        deferSetup: true,
        destroy: function () {}

    });
    enquire.register("screen and (max-width:" + $break_point_medium + ")", {
        match: function () {
            jQuery('body').addClass('bp-medium');
        },
        unmatch: function () {
            jQuery('body').removeClass('bp-medium');
        },
        setup: function () {},
        deferSetup: true,
        destroy: function () {}

    });
    enquire.register("screen and (max-width:" + $break_point_midsmall + ")", {
        match: function () {
            jQuery('body').addClass('bp-midsmall');
        },
        unmatch: function () {
            jQuery('body').removeClass('bp-midsmall');
        },
        setup: function () {},
        deferSetup: true,
        destroy: function () {}

    });
    enquire.register("screen and (max-width:" + $break_point_small + ")", {
        match: function () {
            jQuery('body').addClass('bp-small');
        },
        unmatch: function () {
            jQuery('body').removeClass('bp-small');
        },
        setup: function () {},
        deferSetup: true,
        destroy: function () {}

    });
}
function removeJsAppliedStyles() {
    /*
     * Cleanup class. Remove styling applied for responsive
     */
    jQuery('#block-bean-tools-and-resources-generic-bloc .inside').removeAttr('style');
}
function addTwitterFeed() {
    //add twitter feed script
    window.twttr = (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
                t = window.twttr || {};
        if (d.getElementById(id))
            return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function (f) {
            t._e.push(f);
        };

        return t;
    }(document, "script", "twitter-wjs"));
//end twitter feed script







}
function showSearchIcon() {
    /*
     * On Reponsive device add element to show the search box
     */
    jQuery('.responsive-search-icon').remove();

    if (jQuery('.bp-medium').length > 0) {
        jQuery('header#navbar .header > .container').prepend('<div class="responsive-search-icon">search</div>');
        jQuery('.block-search-api-page').css('width', jQuery(document).width() - 30 + 'px');
    } else {
        jQuery('.responsive-search-icon').remove();
        jQuery('.block-search-api-page').removeAttr('style');
    }

    jQuery(document).on('click', '.responsive-search-icon', function () {
        console.log('Clicked');
        console.log(jQuery(this).attr('class'));
        if (jQuery(this).hasClass('opened')) {
            jQuery('.block-search-api-page').slideUp(function () {
                jQuery('.responsive-search-icon').removeClass('opened');
            });
        } else {
            jQuery('.block-search-api-page').slideDown(function () {
                jQuery('.responsive-search-icon').addClass('opened');
            });
        }
    });
}


































// Third party scripts
function equalHeight($container) {

    var currentTallest = 0,
            currentRowStart = 0,
            rowDivs = new Array(),
            $el,
            topPosition = 0;
    jQuery($container).each(function () {

        $el = jQuery(this);
        jQuery($el).height('auto')
        topPostion = $el.position().top;

        if (currentRowStart !== topPostion) {
            for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                rowDivs[currentDiv].height(currentTallest);
            }
            rowDivs.length = 0; // empty the array
            currentRowStart = topPostion;
            currentTallest = $el.height();
            rowDivs.push($el);
        } else {
            rowDivs.push($el);
            currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
        }
        for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
            rowDivs[currentDiv].height(currentTallest);
        }
    });

}


/*!
 * enquire.js v2.1.2 - Awesome Media Queries in JavaScript
 * Copyright (c) 2014 Nick Williams - http://wicky.nillia.ms/enquire.js
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

!function (a, b, c) {
    var d = window.matchMedia;
    "undefined" != typeof module && module.exports ? module.exports = c(d) : "function" == typeof define && define.amd ? define(function () {
        return b[a] = c(d)
    }) : b[a] = c(d)
}("enquire", this, function (a) {
    "use strict";
    function b(a, b) {
        var c, d = 0, e = a.length;
        for (d; e > d && (c = b(a[d], d), c !== !1); d++)
            ;
    }
    function c(a) {
        return"[object Array]" === Object.prototype.toString.apply(a)
    }
    function d(a) {
        return"function" == typeof a
    }
    function e(a) {
        this.options = a, !a.deferSetup && this.setup()
    }
    function f(b, c) {
        this.query = b, this.isUnconditional = c, this.handlers = [], this.mql = a(b);
        var d = this;
        this.listener = function (a) {
            d.mql = a, d.assess()
        }, this.mql.addListener(this.listener)
    }
    function g() {
        if (!a)
            throw new Error("matchMedia not present, legacy browsers require a polyfill");
        this.queries = {}, this.browserIsIncapable = !a("only all").matches
    }
    return e.prototype = {setup: function () {
            this.options.setup && this.options.setup(), this.initialised = !0
        }, on: function () {
            !this.initialised && this.setup(), this.options.match && this.options.match()
        }, off: function () {
            this.options.unmatch && this.options.unmatch()
        }, destroy: function () {
            this.options.destroy ? this.options.destroy() : this.off()
        }, equals: function (a) {
            return this.options === a || this.options.match === a
        }}, f.prototype = {addHandler: function (a) {
            var b = new e(a);
            this.handlers.push(b), this.matches() && b.on()
        }, removeHandler: function (a) {
            var c = this.handlers;
            b(c, function (b, d) {
                return b.equals(a) ? (b.destroy(), !c.splice(d, 1)) : void 0
            })
        }, matches: function () {
            return this.mql.matches || this.isUnconditional
        }, clear: function () {
            b(this.handlers, function (a) {
                a.destroy()
            }), this.mql.removeListener(this.listener), this.handlers.length = 0
        }, assess: function () {
            var a = this.matches() ? "on" : "off";
            b(this.handlers, function (b) {
                b[a]()
            })
        }}, g.prototype = {register: function (a, e, g) {
            var h = this.queries, i = g && this.browserIsIncapable;
            return h[a] || (h[a] = new f(a, i)), d(e) && (e = {match: e}), c(e) || (e = [e]), b(e, function (b) {
                d(b) && (b = {match: b}), h[a].addHandler(b)
            }), this
        }, unregister: function (a, b) {
            var c = this.queries[a];
            return c && (b ? c.removeHandler(b) : (c.clear(), delete this.queries[a])), this
        }}, new g
});

