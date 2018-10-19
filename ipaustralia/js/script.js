// https://stackoverflow.com/a/52116816/1611058
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

jQuery(window).load(function () {
    resizing();
});
jQuery(window).resize(function () {
    resizing();
});
jQuery(document).ready(function () {
    setBreakPoints();
    addTwitterFeed();
    toolsAndResourcesTabsCheck();
    personaCookies();
    externalLink();
    openPopup();
    new ip_contract_generator_pages(jQuery);

    if (jQuery('.application-process-menu').length){
        jQuery('aside.col-sm-3').addClass('app-process-visible');
    } 

    jQuery('body').append("<div id='ZN_0e0bzgMZ1MJCD1H'><!--DO NOT REMOVE-CONTENTS PLACED HERE--></div>");

    jQuery(document).on('click', '.dialog_open', function() {
        openPopup();
        return false;
    });

    jQuery('.view-policy-register li.views-row').matchHeight();

    jQuery(document).ajaxComplete(function(e){
        e.preventDefault();
        jQuery('.view-policy-register li.views-row').matchHeight();
    });
});

jQuery(document).on('click', '.dialog_open', function() {
    openPopup();
    return false;
});

function openPopup() {
    jQuery('#dialog').popup();
}

jQuery(document).ajaxComplete(function(e){
   e.preventDefault();
   jQuery('.view-policy-register li.views-row').matchHeight();
});

jQuery(document).on('click', '.bp-small #block-bean-tools-and-resources-generic-bloc h3', function () {
    openCloseToolsResources(jQuery(this));
});
jQuery(document).on('click', '.bp-small section#block-bean-tools-and-resources h3', function () {
    openCloseToolsResources(jQuery(this));
});
jQuery(document).on('click', '.bp-small section#block-bean-tools-and-resources-trade-mark h3', function () {
    openCloseToolsResources(jQuery(this));
});
jQuery(document).on('click', '.bp-small section#block-bean-tools-and-resources-designs h3', function () {
    openCloseToolsResources(jQuery(this));
});
jQuery(document).on('click', '.bp-small section#block-bean-tools-and-resources-pbr h3', function () {
    openCloseToolsResources(jQuery(this));
});
jQuery(document).on('click', '.bp-small section#block-quicktabs-tools-and-resources .pane-bean-tools-and-resources h3', function () {
    openCloseToolsResources(jQuery(this));
});
jQuery(document).on('click', '.bp-small section#block-quicktabs-tools-and-resources .pane-bean-tools-and-resources-trade-mark h3', function () {
    openCloseToolsResources(jQuery(this));
});
jQuery(document).on('click', '.bp-small section#block-quicktabs-tools-and-resources .pane-bean-tools-and-resources-designs h3', function () {
    openCloseToolsResources(jQuery(this));
});
jQuery(document).on('click', '.bp-small section#block-quicktabs-tools-and-resources .pane-bean-tools-and-resources-pbr h3', function () {
    openCloseToolsResources(jQuery(this));
});
jQuery(document).on('click', '.bp-small section#block-quicktabs-tools-and-resources .pane-bean-tools-and-resources-generic-bloc h3', function () {
    openCloseToolsResources(jQuery(this));
});
jQuery(document).on('click', '.application-process-wrapper li', function () {
    var $link = jQuery(this).find('a').attr('href');
    window.open($link, '_self');
});
jQuery(document).on('click', '.bp-midsmall .group-left h4', function () {
    openCloseGroups(jQuery(this));
});
jQuery(document).on('click', '.bp-midsmall .group-middle h4', function () {
    openCloseGroups(jQuery(this));
});
jQuery(document).on('click', '.bp-midsmall .group-right h4', function () {
    openCloseGroups(jQuery(this));
});
jQuery(document).on('click', '.header-chat-link ', function (event) {
    event.preventDefault();
    triggerChat();
});
jQuery(document).on('click', '.bp-midsmall .panels-flexible-region h4', function () {
    openCloseGroups(jQuery(this));
});
jQuery(document).on('mouseup', 'section#block-quicktabs-tools-and-resources .quicktabs-style-nostyle > li a', function () {
    //using mouse up since click is already used and prevented for element


    var $url = jQuery(this).attr("href");
//    alert($url);
    history.pushState({}, '', $url);

    jQuery(this).parent('li').siblings('li').removeClass('active');
    jQuery(this).parent('li').addClass('active');

    var $active_page = "#" + jQuery(this).attr('id').replace("-tab-", "-tabpage-");
    jQuery('section#block-quicktabs-tools-and-resources .quicktabs-tabpage').hide();
    jQuery($active_page).show();
    equaliseElementsHeight();


});

//Check external links
function externalLink(){
    //if it does not contain ipaustralia.gov.au, does not start with "#" or "/" then run function.
    jQuery('section a:not([href*=".ipaustralia.gov.au"]):not([href^="#"]):not([href^="/"]):not([href^="node/"])').each(function () {
        //if no href is on the link
        if (jQuery(this).attr('href') != undefined && !jQuery(this).hasClass('charcoal-rounded-button') && !(jQuery(this).parent().hasClass('pager-item')) ) {
            if (jQuery(this).attr('title') != undefined) {
                jQuery(this).attr('title', 'external link (new window) - ' + jQuery(this).attr('title'));
                jQuery(this).addClass('external');
                jQuery(this).attr('target', '_blank');
            } else {
                jQuery(this).attr('title', 'external link (new window)');
                jQuery(this).addClass('external');
                jQuery(this).attr('target', '_blank');
            }
        }
    });
};

//Check Mobile Devices
function mobileCheck(){
    //Check Device
    var isTouch = ('ontouchstart' in document.documentElement);
    //Check Device //All Touch Devices
    if ( isTouch ) {
        jQuery('html').addClass('touch');
    }
    else {
        jQuery('html').addClass('no-touch');
    };
};
//run function
mobileCheck();

function toolsAndResourcesTabsCheck() {
    if (jQuery('section#block-quicktabs-tools-and-resources').length > 0) {
        var $active_page = "#" + jQuery('section#block-quicktabs-tools-and-resources .quicktabs-style-nostyle li.active a').attr('id').replace("-tab-", "-tabpage-");
        jQuery($active_page).show();
        equaliseElementsHeight();
    }

}


function resizing() {
    /*
     *  Do action on resizing window or document
     *  This is normally is used on mobile devices when rotating
     */
    removeJsAppliedStyles();
    equaliseElementsHeight();
    showSearchIcon();
    showChatIcon();
    slickSlides();
    slideApplicationProcess();
    stickyMenu();
    jQuery('.view-policy-register li.views-row').matchHeight();
}
function equaliseElementsHeight() {
    /*
     *  Make element same height. example tool box on home page
     */
    equalHeight('#block-bean-tools-and-resources-generic-bloc .panels-flexible-region-inside');
    equalHeight('section#block-bean-tools-and-resources .panels-flexible-region-inside'); // landing page tools and resources
    equalHeight('section#block-bean-tools-and-resources-trade-mark .panels-flexible-region-inside'); // landing page tools and resources
    equalHeight('section#block-bean-tools-and-resources-designs .panels-flexible-region-inside'); // landing page tools and resources
    equalHeight('section#block-bean-tools-and-resources-pbr .panels-flexible-region-inside'); // landing page tools and resources

    equalHeight('section#block-bean-tools-resources-ip-professionals .panels-flexible-region-inside'); // landing page tools and resources

    equalHeight('#block-bean-careers-landing-page-block .field-item.even'); // landing page careers

    equalHeight('section#block-quicktabs-tools-and-resources .pane-bean-tools-and-resources .panels-flexible-region-inside'); // landing page tools and resources
    equalHeight('section#block-quicktabs-tools-and-resources .pane-bean-tools-and-resources-trade-mark .panels-flexible-region-inside'); // landing page tools and resources
    equalHeight('section#block-quicktabs-tools-and-resources .pane-bean-tools-and-resources-designs .panels-flexible-region-inside'); // landing page tools and resources
    equalHeight('section#block-quicktabs-tools-and-resources .pane-bean-tools-and-resources-pbr .panels-flexible-region-inside'); // landing page tools and resources
    equalHeight('section#block-quicktabs-tools-and-resources .pane-bean-tools-and-resources-generic-bloc .panels-flexible-region-inside'); // landing page tools and resources

    equalHeight('section#block-quicktabs-tools-and-resources .pane-bean-patents-faqs .panels-flexible-region-inside'); // landing page tools and resources
    equalHeight('section#block-quicktabs-tools-and-resources .pane-bean-trade-marks-faqs .panels-flexible-region-inside'); // landing page tools and resources
    equalHeight('section#block-quicktabs-tools-and-resources .pane-bean-designs-faqs .panels-flexible-region-inside'); // landing page tools and resources
    equalHeight('section#block-quicktabs-tools-and-resources .pane-bean-pbr-faqs .panels-flexible-region-inside'); // landing page tools and resources

    equalHeight('section#block-quicktabs-tools-and-resources .pane-forms-and-publications-patents-p .inside'); // landing page tools and resources
    equalHeight('section#block-quicktabs-tools-and-resources .pane-forms-and-publications-trade-mar .inside'); // landing page tools and resources
    equalHeight('section#block-quicktabs-tools-and-resources .pane-forms-and-publications-designs-p .inside'); // landing page tools and resources
    equalHeight('section#block-quicktabs-tools-and-resources .pane-forms-and-publications-pbr-panel .inside'); // landing page tools and resources
    equalHeight('section#block-quicktabs-tools-and-resources .pane-forms-and-publications-general-p .inside'); // landing page tools and resources
    equalHeight('.footer li.expanded');

    equalHeight('section#block-bean-all-about-patents-block .panels-flexible-row-four_rows_with_1_x_3_x_3_x_2_columns-1 .panels-flexible-region-inside .list-content'); // landing page tools and resources
    equalHeight('section#block-bean-all-about-patents-block .panels-flexible-row-four_rows_with_1_x_3_x_3_x_2_columns-2 .panels-flexible-region-inside .list-content');
    equalHeight('section#block-bean-all-about-patents-block .panels-flexible-row-four_rows_with_1_x_3_x_3_x_2_columns-3 .panels-flexible-region-inside .list-content');

    equalHeight('section#block-bean-all-about-pbr-block .panels-flexible-row-four_rows_with_1_x_3_x_3_x_2_columns-1 .panels-flexible-region-inside .list-content');
    equalHeight('section#block-bean-all-about-pbr-block .panels-flexible-row-four_rows_with_1_x_3_x_3_x_2_columns-2 .panels-flexible-region-inside .list-content');
    equalHeight('section#block-bean-all-about-pbr-block .panels-flexible-row-four_rows_with_1_x_3_x_3_x_2_columns-3 .panels-flexible-region-inside .list-content');

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
    var $break_point_medium_ipad = "768px"; /*Tablet*/
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
            slickSlides();
        },
        unmatch: function () {
            jQuery('body').removeClass('bp-large');
            slickSlides();
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
    enquire.register("screen and (max-width:" + $break_point_medium_ipad + ")", {
        match: function () {
            jQuery('body').addClass('bp-medium_ipad');
            slickSlides();
        },
        unmatch: function () {
            jQuery('body').removeClass('bp-medium_ipad');
            slickSlides();
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
function showChatIcon() {
    /*
     * On Reponsive device add element to trgger chat
     */

    jQuery('.responsive-chat-icon').remove();

    if (jQuery('.bp-medium').length > 0 && jQuery("#ipAustralia-block").length > 0 ) {
        jQuery('header#navbar .header > .container').prepend('<div class="responsive-chat-icon">chat</div>');
        jQuery('.block-search-api-page').css('width', jQuery(document).width() - 30 + 'px');
    } else {
        jQuery('.responsive-chat-icon').remove();
        jQuery('.block-search-api-page').removeAttr('style');
    }

    jQuery(document).on('click', '.responsive-chat-icon', function () {
        triggerChat();
    });
}

function triggerChat() {
    initialize();
    //jQuery(".responsive-chat-icon").toggleClass("opened");
}

function slickSlides() {
    if (jQuery('.bp-medium_ipad').length > 0) {
        slideHomeMain('attach');
    } else {
        slideHomeMain('detach');
    }

    if (jQuery('.bp-large').length > 0) {
        slideApplicationProcessBody('attach');
    } else {
        slideApplicationProcessBody('detach');
    }

}
function slideHomeMain($action) {
    var $element = '#quicktabs-container-homepage_main_tab';
    if ($action === 'attach') {
        try {
            jQuery($element).slick({
                adaptiveHeight: true,
                arrows: false,
                dots: true
            });
        } catch (exp) {
            //console.log('Attaching slick issue');
        }
    } else {
        try {
            if (jQuery($element).hasClass('slick-initialized')) {
                jQuery($element).slick('unslick');
            }
        } catch (exp) {
            //console.log('Attaching slick issue');
        }
    }

    jQuery($element).on('swipe', function (event, slick, direction) {

        var $active_li = "#" + jQuery(this).find('.slick-active').attr('id').replace("-tabpage-", "-tab-");
        jQuery($active_li).parent('li').siblings('li').removeClass('active'); //remove active class from all tabs
        jQuery($active_li).parent('li').addClass('active'); //add active class to the correct tab
        // left
    });

}
function slideApplicationProcess() {
    var $break_point_xlarge = "1200";
    var $break_point_large = "992"; /*Desktop tablet landscape*/
    var $break_point_medium = "767"; /*Tablet*/
    var $break_point_medium_ipad = "768"; /*Tablet*/
    var $break_point_midsmall = "640"; /*Mobile Landscape*/
    var $break_point_small = "480"; /*Mobile*/

    var $element = 'section.application-process-menu ul';
    var $centermode = false;
    var $initialSlide = 0;
    var $slidesToShow = 6;
    var $index = parseInt(jQuery($element).find('li.active').index());

    if ($index > $slidesToShow - 1) {
//        $centermode = true;

    }
/*    if ($index > -1) {
        $initialSlide = $index;
    }*/


    try {
        jQuery($element).slick({
            adaptiveHeight: true,
            arrows: true,
            slide: 'li',
            infinite: false,
            slidesToShow: $slidesToShow,
            initialSlide: $initialSlide,
            slidesToScroll: 1,
            edgeFriction: 1,
            variableWidth: false,
            centerMode: $centermode,
            dots: false,
            responsive: [
                {
                    breakpoint: $break_point_large,
                    settings: {
                        slidesToShow: 5
                    }
                },
                {
                    breakpoint: $break_point_medium - 100,
                    settings: {
                        centerMode: true,
                        variableWidth: true,
                        arrows: false,
                        slidesToShow: 4

                    }
                },
                {
                    breakpoint: $break_point_medium,
                    settings: {
                        centerMode: true,
                        variableWidth: true,
                        arrows: false,
                        slidesToShow: 4

                    }
                },
                {
                    breakpoint: $break_point_medium_ipad,
                    settings: {
                        centerMode: true,
                        variableWidth: true,
                        arrows: false,
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: $break_point_midsmall,
                    settings: {
                        centerMode: true,
                        variableWidth: true,
                        slidesToScroll: 1,
                        slidesToShow: 2,
                        arrows: false
                    }
                },
                {
                    breakpoint: $break_point_small,
                    settings: {
                        centerMode: true,
                        slidesToShow: 1,
                        variableWidth: true,
                        arrows: false
                    }
                }
                // You can unslick at a given breakpoint now by adding:
                // settings: "unslick"
                // instead of a settings object
            ]
        });

    } catch (exp) {
            //console.log('Attaching slick issue');
    }
//    $($element).on('edge', function (event, slick, direction) {
//        console.log('edge was hit')
//    });
}
function slideApplicationProcessBody($action) {
    var $break_point_xlarge = "1200";
    var $break_point_large = "992"; /*Desktop tablet landscape*/
    var $break_point_medium = "767"; /*Tablet*/
    var $break_point_medium_ipad = "768"; /*Tablet*/
    var $break_point_midsmall = "640"; /*Mobile Landscape*/
    var $break_point_small = "480"; /*Mobile*/

    var $element = '.applicaiton-process-wrapper ul';
    var $centermode = false;
    var $initialSlide = 0;
    var $slidesToShow = 3;

    if ($action === 'attach') {

        var $index = parseInt(jQuery($element).find('li.active').index());

        if ($index > $slidesToShow - 1) {
            $centermode = true;

        }
        if ($index > -1) {
            $initialSlide = $index;
        }


        try {
            jQuery($element).slick({
                adaptiveHeight: true,
                arrows: true,
                slide: 'li',
                infinite: false,
                slidesToShow: $slidesToShow,
                initialSlide: $initialSlide,
                slidesToScroll: 1,
                edgeFriction: 1,
                variableWidth: false,
                centerMode: $centermode,
                dots: false,
                responsive: [
                    {
                        breakpoint: $break_point_medium - 100,
                        settings: {
                            centerMode: true,
                            variableWidth: true,
                            arrows: false

                        }
                    },
                    {
                        breakpoint: $break_point_medium,
                        settings: {
                            centerMode: true,
                            variableWidth: true,
                            arrows: false,
                            slidesToShow: 2

                        }
                    },
                    {
                        breakpoint: $break_point_medium_ipad,
                        settings: {
                            centerMode: true,
                            variableWidth: true,
                            arrows: false,
                            slidesToShow: 2
                        }
                    },
                    {
                        breakpoint: $break_point_midsmall,
                        settings: {
                            centerMode: false,
                            variableWidth: true,
                            slidesToScroll: 1,
                            slidesToShow: 1,
                            arrows: false
                        }
                    },
                    {
                        breakpoint: $break_point_small,
                        settings: {
                            centerMode: true,
                            slidesToShow: 1,
                            variableWidth: true,
                            arrows: false
                        }
                    }
                ]
            });

        } catch (exp) {
//            console.log('Attaching slick issue');
        }
    } else {
        try {
            if (jQuery($element).hasClass('slick-initialized')) {
                jQuery($element).slick('unslick');
            }
        } catch (exp) {
//            console.log('Attaching slick issue');
        }
    }

}
function openCloseToolsResources($object) {
    jQuery($object).closest('.inside').css('height', 'auto');
    if (jQuery($object).closest('.inside').hasClass('open')) {
        jQuery($object).siblings('ul').slideToggle(function () {
            jQuery($object).closest('.inside').removeClass('open');
            jQuery($object).siblings('ul').removeAttr('style');
        });
    } else {
        jQuery($object).siblings('ul').slideToggle(function () {
            jQuery($object).closest('.inside').addClass('open');
        });
    }
}
function openCloseGroups($object) {
    jQuery($object).closest('.inside').css('height', 'auto');
    if (jQuery($object).closest('.field-item').hasClass('open')) {
        jQuery($object).siblings('p').slideToggle(function () {
            jQuery($object).closest('.field-item').removeClass('open');
            jQuery($object).siblings('p').removeAttr('style');
            jQuery($object).closest('.inside').removeAttr('style');
        });
    } else {
        jQuery($object).siblings('p').slideToggle(function () {
            jQuery($object).closest('.field-item').addClass('open');
        });
    }
}
function stickyMenu() {
    // Set sticky only when on large screen
    if (jQuery('.bp-medium').length > 0) {
        jQuery(".navbar-default").trigger("sticky_kit:detach");
        jQuery("#block-bean-patents-anchor-menu-3").trigger("sticky_kit:detach");
        jQuery("#block-bean-trade-marks-anchor-menu").trigger("sticky_kit:detach");
        jQuery("#block-bean-designs-anchor-menu").trigger("sticky_kit:detach");
        jQuery("#block-bean-pbr-anchor-menu").trigger("sticky_kit:detach");
        jQuery("#block-bean-ip-infringement-anchor-block-0").trigger("sticky_kit:detach");
        jQuery("#block-bean-understanding-ip-anchor-block").trigger("sticky_kit:detach");
        jQuery("#block-bean-about-us-anchor-menu").trigger("sticky_kit:detach");
        jQuery("#block-bean-ip-report-anchor-menu").trigger("sticky_kit:detach");
        jQuery("#block-bean-news-and-community-landing-page-").trigger("sticky_kit:detach");
    } else {
        jQuery(".navbar-default").stick_in_parent();
        jQuery("#block-bean-patents-anchor-menu-3").stick_in_parent();
        jQuery("#block-bean-trade-marks-anchor-menu").stick_in_parent();
        jQuery("#block-bean-designs-anchor-menu").stick_in_parent();
        jQuery("#block-bean-pbr-anchor-menu").stick_in_parent();
        jQuery("#block-bean-ip-infringement-anchor-block-0").stick_in_parent();
        jQuery("#block-bean-understanding-ip-anchor-block").stick_in_parent();
        jQuery("#block-bean-about-us-anchor-menu").stick_in_parent();
        jQuery("#block-bean-ip-report-anchor-menu").stick_in_parent();
        jQuery("#block-bean-news-and-community-landing-page-").stick_in_parent();

    }
}

function ip_contract_generator_pages($) {

    var $pages = $('.form-page');
    var _$form = $pages.closest('form')[0];
    var _$formSubmit = document.querySelector('.contract-generator-submit');
    var $progressBtns = $('.progressBar__number');

    _$form.onsubmit = function(e){
        e.preventDefault();
    }

    var controller = this;
    var pages;

    this.hide_all = function() {
        pages.forEach(function(page){
            page.hide();
        })
    }

    pages = $pages.toArray().map(function(_$page, index){
        return new generator_page(_$page, index);
    });

    var invalidLabels = [];

    var disclaimer = new disclaimer_popup();

    function generator_page (_$page, index) {
        var _$next = _$page.querySelector('.next-btn, .submit-btn');
        var _$prev = _$page.querySelector('.back-btn');
        var _$progress = _$page.querySelector('.progressBar');

        init_progress_bar(_$progress);

        this._$page = _$page;

        _$page.setAttribute('tabindex','-1');

        var pageControl = this;

        var $fields = $(_$page).find('.webform-component');
        $fields = $fields.filter(function(){
            return !!this.querySelector('input,textarea,select');
        })
        this.fields = $fields.toArray().map(function(_$field){
            return new form_field(_$field);
        });

        this.hide = function(){
            _$page.style.display = 'none';
        }
        this.show = function(){
            _$page.style.display = 'block';
            _$page.focus();
        }

        this.next = function(){
            if (validate_page(pageControl)) {
                if (_$next.classList.contains('submit-btn')) {
                    disclaimer.open();
                } else {
                    var nextIndex = index + 1;
                    show_page(nextIndex);
                }
            } else {
                // _$form.reportValidity();
                // alert ('invalid');
            }
        }

        this.prev = function(){
            var prevIndex = index - 1;
            show_page(prevIndex);
        }

        //Hides all but the first page
        if (index === 0) {
            pageControl.show();
        }

        bind_events();

        function bind_events () {

            if (_$next) {
                _$next.onclick = function(e) {
                    e.preventDefault();
                    pageControl.next();
                }
            }

            if (_$prev) {
                _$prev.onclick = function(e) {
                    e.preventDefault();
                    pageControl.prev();
                }
            }
        }
    }

    function init_progress_bar (_$progress) {
        var $buttons = $(_$progress).find('button');
        $buttons.each(function(i){
            this.onclick = function(){
                show_page(i);
            }
        });
        fix_progress_disabled_attributes();
    }

    function show_page (selectedIndex) {
        if (pages[selectedIndex]) {
            controller.hide_all();
            pages[selectedIndex].show();
            return true;
        }
        return false;
    }

    function validate_page (pageControl) {
        invalidLabels = [];
        var validation = pageControl.fields.map(function(field){
            return field.validate();
        })
        var valid = !validation.some(function(value){ return !value; });
        if (!valid) {
            show_error_block(pageControl._$page);
        } else {
            hide_error_block(pageControl._$page);
        }
        return valid;
    }

    function show_error_block(_$page) {
        var $page = $(_$page);
        var listHTML = ['<li>', invalidLabels.join('</li><li>'), '</li>'].join('');
        _$errorBlock = _$page.querySelector('.error-block');
        if (_$errorBlock) {
            var _$list = _$errorBlock.querySelector('.error-block-list');
            _$list.innerHTML = listHTML;
        } else {
            $page.prepend([
                '<div class="error-block" role="alert" tabindex="-1">',
                    '<h2>Errors found on page</h2>',
                    '<p>The following fields have errors:</p>',
                    '<ol class="error-block-list">',
                        listHTML,
                    '</ol>',
                '</div>'
            ].join(''))
            _$errorBlock = _$page.querySelector('.error-block');
        }
        _$errorBlock.focus();
    }

    function hide_error_block(_$page) {
        var _$block = _$page.querySelector('.error-block');
        if (_$block) {
            _$block.remove();
        }
    }

    function form_field (_$field) {
        var field = this;
        var _$input = _$field.querySelector('input, textarea, select');
        var type = _$input.type || _$input.nodeName.toLowerCase();
        var isRequired = !!_$field.querySelector('.form-required');

        if (_$input.classList.contains('form-text')) {
            type = 'text';
        }

        this.validate = function () {
            var typeActions = {
                radio: validate_radios,
                text: validate_inputs,
                textarea: validate_inputs,
            };
            if (isRequired) {
                var valid = typeActions[type](_$field);
                handle_error_state(_$field, valid);
                return valid;
            } else {
                return true;
            }
        }

        if (type === 'radio' || type === 'checkbox') {
            var $inputs = $(_$field).find('input');
            $inputs.change(function(){
                field.validate();
                fix_progress_disabled_attributes();
            })
        } else {
            _$input.onchange = function() {
                if (field.validate()) {
                    if (_$input.checkValidity) {
                        var isValid = _$input.checkValidity();
                        var action = isValid ? 'remove' : 'add';
                        _$field.classList[action]('-invalid');
                    }
                }
            }
        }
    }

    // Drupal is removing the disabled attributes on progress bar buttons
    function fix_progress_disabled_attributes(){
        setTimeout(function(){
            $progressBtns.each(function(){
                this.disabled = this.dataset.disabled === 'true';
            })
        }, 1);
    }

    function push_invalid_label(_$label){
        var text = _$label.textContent;
        if (invalidLabels.indexOf(text) === -1) {
            invalidLabels.push(text);
        }
    }

    function validate_inputs (_$wrapper) {
        var _$label = _$wrapper.querySelector('label');
        var $input = $(_$wrapper).find('.form-text, textarea').filter(':visible');
        if ($input.length) {
            var $invalidFields = $input.filter(function(){
                return this.value === '';
            });
            var valid = $invalidFields.length === 0;
            if (!valid) {
                push_invalid_label(_$label);
            }
            return valid;
        }
        return true;
    }

    function validate_radios (_$wrapper) {
        var _$label;
        if (_$wrapper.classList.contains('webform-component--law-and-jurisdiction')){
            _$label = $(_$wrapper).prev()[0];
        } else {
            _$label = _$wrapper.querySelector('.control-label');
        }
        var $radios = $(_$wrapper).find('input[type="radio"]').filter(function(){
            return $(this).parent().is(':visible');
        });
        if (_$label.textContent === 'Disclaimer *') {
            // Disclaimer has it's own special logic
            return true;
        }
        if ($radios.length) {
            // var label = $radios.closest()
            var uncheckedCount = $radios.not(':checked').length;
            var totalCount = $radios.length;
            var valid = uncheckedCount < totalCount;
            if (!valid) {
                push_invalid_label(_$label);
            }
            return valid;
        }
        return true;
    }

    function handle_error_state (_$wrapper, valid) {
        var action = valid ? 'remove' : 'add';
        _$wrapper.classList[action]('-error');
    }

    function disclaimer_popup() {
        var self = this;
        var _$disclaimer = document.querySelector('.webform-component--disclaimer');
        var $disclaimer = $(_$disclaimer);
        var _$trigger = document.querySelector('.submit-btn');
        var _$body = document.querySelector('body');
        $disclaimer.attr('tabindex', '-1').attr('role', 'dialogue');
        $disclaimer.wrap('<div class="disclaimer-overlay"></div>');
        var _$wrapper = _$disclaimer.parentElement;

        var _$agree = _$disclaimer.querySelector('input[type="radio"]');

        this.open = function () {
            _$wrapper.classList.add('-open');
            _$body.classList.add('-scrollLock');
            _$disclaimer.focus();
        }
        this.close = function () {
            _$wrapper.classList.remove('-open');
            _$body.classList.remove('-scrollLock');
            _$trigger.focus();
            _$agree.checked = false;
        }

        _$disclaimer.onclick = function(e) {
            e.stopPropagation();
        }
        // close if the escape key is pressed
        _$disclaimer.addEventListener('keydown', function(e){
            if (e.which === 27) {
                self.close();
            }
        })
        _$wrapper.onclick = function() {
            self.close();
        }
        _$agree.onchange = function() {
            _$formSubmit.click();
            self.close();
        }
    }
}

//bold the "IP Australia" in the footer
jQuery(document).ready(function () {
        jQuery('h2.block-title').html(function (i, html) {
            return html.replace(/(\w+\s\w+)/, '<strong>$1</strong>')
    });
});

/**
 * Function to get the value of a cookie.
 */
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/**
 * Function to set cookies and add classes to body based on cookie value.
 */
function personaCookies() {
  if (window.location.href.indexOf("entrepreneur") > -1) {
    document.cookie = "persona=entrepreneur";
  } else if (window.location.href.indexOf("researcher") > -1) {
    document.cookie = "persona=researcher";
  }

  if (getCookie('persona')) {
    jQuery('body').addClass('persona-' + getCookie('persona'));
  }
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

/*
 _ _      _       _
 ___| (_) ___| | __  (_)___
 / __| | |/ __| |/ /  | / __|
 \__ \ | | (__|   < _ | \__ \
 |___/_|_|\___|_|\_(_)/ |___/
 |__/

 Version: 1.5.9
 Author: Ken Wheeler
 Website: http://kenwheeler.github.io
 Docs: http://kenwheeler.github.io/slick
 Repo: http://github.com/kenwheeler/slick
 Issues: http://github.com/kenwheeler/slick/issues

 */
!function (a) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], a) : "undefined" != typeof exports ? module.exports = a(require("jquery")) : a(jQuery)
}(function (a) {
    "use strict";
    var b = window.Slick || {};
    b = function () {
        function c(c, d) {
            var f, e = this;
            e.defaults = {accessibility: !0, adaptiveHeight: !1, appendArrows: a(c), appendDots: a(c), arrows: !0, asNavFor: null, prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>', nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>', autoplay: !1, autoplaySpeed: 3e3, centerMode: !1, centerPadding: "50px", cssEase: "ease", customPaging: function (a, b) {
                    return'<button type="button" data-role="none" role="button" aria-required="false" tabindex="0">' + (b + 1) + "</button>"
                }, dots: !1, dotsClass: "slick-dots", draggable: !0, easing: "linear", edgeFriction: .35, fade: !1, focusOnSelect: !1, infinite: !0, initialSlide: 0, lazyLoad: "ondemand", mobileFirst: !1, pauseOnHover: !0, pauseOnDotsHover: !1, respondTo: "window", responsive: null, rows: 1, rtl: !1, slide: "", slidesPerRow: 1, slidesToShow: 1, slidesToScroll: 1, speed: 500, swipe: !0, swipeToSlide: !1, touchMove: !0, touchThreshold: 5, useCSS: !0, useTransform: !1, variableWidth: !1, vertical: !1, verticalSwiping: !1, waitForAnimate: !0, zIndex: 1e3}, e.initials = {animating: !1, dragging: !1, autoPlayTimer: null, currentDirection: 0, currentLeft: null, currentSlide: 0, direction: 1, $dots: null, listWidth: null, listHeight: null, loadIndex: 0, $nextArrow: null, $prevArrow: null, slideCount: null, slideWidth: null, $slideTrack: null, $slides: null, sliding: !1, slideOffset: 0, swipeLeft: null, $list: null, touchObject: {}, transformsEnabled: !1, unslicked: !1}, a.extend(e, e.initials), e.activeBreakpoint = null, e.animType = null, e.animProp = null, e.breakpoints = [], e.breakpointSettings = [], e.cssTransitions = !1, e.hidden = "hidden", e.paused = !1, e.positionProp = null, e.respondTo = null, e.rowCount = 1, e.shouldClick = !0, e.$slider = a(c), e.$slidesCache = null, e.transformType = null, e.transitionType = null, e.visibilityChange = "visibilitychange", e.windowWidth = 0, e.windowTimer = null, f = a(c).data("slick") || {}, e.options = a.extend({}, e.defaults, f, d), e.currentSlide = e.options.initialSlide, e.originalSettings = e.options, "undefined" != typeof document.mozHidden ? (e.hidden = "mozHidden", e.visibilityChange = "mozvisibilitychange") : "undefined" != typeof document.webkitHidden && (e.hidden = "webkitHidden", e.visibilityChange = "webkitvisibilitychange"), e.autoPlay = a.proxy(e.autoPlay, e), e.autoPlayClear = a.proxy(e.autoPlayClear, e), e.changeSlide = a.proxy(e.changeSlide, e), e.clickHandler = a.proxy(e.clickHandler, e), e.selectHandler = a.proxy(e.selectHandler, e), e.setPosition = a.proxy(e.setPosition, e), e.swipeHandler = a.proxy(e.swipeHandler, e), e.dragHandler = a.proxy(e.dragHandler, e), e.keyHandler = a.proxy(e.keyHandler, e), e.autoPlayIterator = a.proxy(e.autoPlayIterator, e), e.instanceUid = b++, e.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, e.registerBreakpoints(), e.init(!0), e.checkResponsive(!0)
        }
        var b = 0;
        return c
    }(), b.prototype.addSlide = b.prototype.slickAdd = function (b, c, d) {
        var e = this;
        if ("boolean" == typeof c)
            d = c, c = null;
        else if (0 > c || c >= e.slideCount)
            return!1;
        e.unload(), "number" == typeof c ? 0 === c && 0 === e.$slides.length ? a(b).appendTo(e.$slideTrack) : d ? a(b).insertBefore(e.$slides.eq(c)) : a(b).insertAfter(e.$slides.eq(c)) : d === !0 ? a(b).prependTo(e.$slideTrack) : a(b).appendTo(e.$slideTrack), e.$slides = e.$slideTrack.children(this.options.slide), e.$slideTrack.children(this.options.slide).detach(), e.$slideTrack.append(e.$slides), e.$slides.each(function (b, c) {
            a(c).attr("data-slick-index", b)
        }), e.$slidesCache = e.$slides, e.reinit()
    }, b.prototype.animateHeight = function () {
        var a = this;
        if (1 === a.options.slidesToShow && a.options.adaptiveHeight === !0 && a.options.vertical === !1) {
            var b = a.$slides.eq(a.currentSlide).outerHeight(!0);
            a.$list.animate({height: b}, a.options.speed)
        }
    }, b.prototype.animateSlide = function (b, c) {
        var d = {}, e = this;
        e.animateHeight(), e.options.rtl === !0 && e.options.vertical === !1 && (b = -b), e.transformsEnabled === !1 ? e.options.vertical === !1 ? e.$slideTrack.animate({left: b}, e.options.speed, e.options.easing, c) : e.$slideTrack.animate({top: b}, e.options.speed, e.options.easing, c) : e.cssTransitions === !1 ? (e.options.rtl === !0 && (e.currentLeft = -e.currentLeft), a({animStart: e.currentLeft}).animate({animStart: b}, {duration: e.options.speed, easing: e.options.easing, step: function (a) {
                a = Math.ceil(a), e.options.vertical === !1 ? (d[e.animType] = "translate(" + a + "px, 0px)", e.$slideTrack.css(d)) : (d[e.animType] = "translate(0px," + a + "px)", e.$slideTrack.css(d))
            }, complete: function () {
                c && c.call()
            }})) : (e.applyTransition(), b = Math.ceil(b), e.options.vertical === !1 ? d[e.animType] = "translate3d(" + b + "px, 0px, 0px)" : d[e.animType] = "translate3d(0px," + b + "px, 0px)", e.$slideTrack.css(d), c && setTimeout(function () {
            e.disableTransition(), c.call()
        }, e.options.speed))
    }, b.prototype.asNavFor = function (b) {
        var c = this, d = c.options.asNavFor;
        d && null !== d && (d = a(d).not(c.$slider)), null !== d && "object" == typeof d && d.each(function () {
            var c = a(this).slick("getSlick");
            c.unslicked || c.slideHandler(b, !0)
        })
    }, b.prototype.applyTransition = function (a) {
        var b = this, c = {};
        b.options.fade === !1 ? c[b.transitionType] = b.transformType + " " + b.options.speed + "ms " + b.options.cssEase : c[b.transitionType] = "opacity " + b.options.speed + "ms " + b.options.cssEase, b.options.fade === !1 ? b.$slideTrack.css(c) : b.$slides.eq(a).css(c)
    }, b.prototype.autoPlay = function () {
        var a = this;
        a.autoPlayTimer && clearInterval(a.autoPlayTimer), a.slideCount > a.options.slidesToShow && a.paused !== !0 && (a.autoPlayTimer = setInterval(a.autoPlayIterator, a.options.autoplaySpeed))
    }, b.prototype.autoPlayClear = function () {
        var a = this;
        a.autoPlayTimer && clearInterval(a.autoPlayTimer)
    }, b.prototype.autoPlayIterator = function () {
        var a = this;
        a.options.infinite === !1 ? 1 === a.direction ? (a.currentSlide + 1 === a.slideCount - 1 && (a.direction = 0), a.slideHandler(a.currentSlide + a.options.slidesToScroll)) : (a.currentSlide - 1 === 0 && (a.direction = 1), a.slideHandler(a.currentSlide - a.options.slidesToScroll)) : a.slideHandler(a.currentSlide + a.options.slidesToScroll)
    }, b.prototype.buildArrows = function () {
        var b = this;
        b.options.arrows === !0 && (b.$prevArrow = a(b.options.prevArrow).addClass("slick-arrow"), b.$nextArrow = a(b.options.nextArrow).addClass("slick-arrow"), b.slideCount > b.options.slidesToShow ? (b.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), b.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), b.htmlExpr.test(b.options.prevArrow) && b.$prevArrow.prependTo(b.options.appendArrows), b.htmlExpr.test(b.options.nextArrow) && b.$nextArrow.appendTo(b.options.appendArrows), b.options.infinite !== !0 && b.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : b.$prevArrow.add(b.$nextArrow).addClass("slick-hidden").attr({"aria-disabled": "true", tabindex: "-1"}))
    }, b.prototype.buildDots = function () {
        var c, d, b = this;
        if (b.options.dots === !0 && b.slideCount > b.options.slidesToShow) {
            for (d = '<ul class="' + b.options.dotsClass + '">', c = 0; c <= b.getDotCount(); c += 1)
                d += "<li>" + b.options.customPaging.call(this, b, c) + "</li>";
            d += "</ul>", b.$dots = a(d).appendTo(b.options.appendDots), b.$dots.find("li").first().addClass("slick-active").attr("aria-hidden", "false")
        }
    }, b.prototype.buildOut = function () {
        var b = this;
        b.$slides = b.$slider.children(b.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), b.slideCount = b.$slides.length, b.$slides.each(function (b, c) {
            a(c).attr("data-slick-index", b).data("originalStyling", a(c).attr("style") || "")
        }), b.$slider.addClass("slick-slider"), b.$slideTrack = 0 === b.slideCount ? a('<div class="slick-track"/>').appendTo(b.$slider) : b.$slides.wrapAll('<div class="slick-track"/>').parent(), b.$list = b.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(), b.$slideTrack.css("opacity", 0), (b.options.centerMode === !0 || b.options.swipeToSlide === !0) && (b.options.slidesToScroll = 1), a("img[data-lazy]", b.$slider).not("[src]").addClass("slick-loading"), b.setupInfinite(), b.buildArrows(), b.buildDots(), b.updateDots(), b.setSlideClasses("number" == typeof b.currentSlide ? b.currentSlide : 0), b.options.draggable === !0 && b.$list.addClass("draggable")
    }, b.prototype.buildRows = function () {
        var b, c, d, e, f, g, h, a = this;
        if (e = document.createDocumentFragment(), g = a.$slider.children(), a.options.rows > 1) {
            for (h = a.options.slidesPerRow * a.options.rows, f = Math.ceil(g.length / h), b = 0; f > b; b++) {
                var i = document.createElement("div");
                for (c = 0; c < a.options.rows; c++) {
                    var j = document.createElement("div");
                    for (d = 0; d < a.options.slidesPerRow; d++) {
                        var k = b * h + (c * a.options.slidesPerRow + d);
                        g.get(k) && j.appendChild(g.get(k))
                    }
                    i.appendChild(j)
                }
                e.appendChild(i)
            }
            a.$slider.html(e), a.$slider.children().children().children().css({width: 100 / a.options.slidesPerRow + "%", display: "inline-block"})
        }
    }, b.prototype.checkResponsive = function (b, c) {
        var e, f, g, d = this, h = !1, i = d.$slider.width(), j = window.innerWidth || a(window).width();
        if ("window" === d.respondTo ? g = j : "slider" === d.respondTo ? g = i : "min" === d.respondTo && (g = Math.min(j, i)), d.options.responsive && d.options.responsive.length && null !== d.options.responsive) {
            f = null;
            for (e in d.breakpoints)
                d.breakpoints.hasOwnProperty(e) && (d.originalSettings.mobileFirst === !1 ? g < d.breakpoints[e] && (f = d.breakpoints[e]) : g > d.breakpoints[e] && (f = d.breakpoints[e]));
            null !== f ? null !== d.activeBreakpoint ? (f !== d.activeBreakpoint || c) && (d.activeBreakpoint = f, "unslick" === d.breakpointSettings[f] ? d.unslick(f) : (d.options = a.extend({}, d.originalSettings, d.breakpointSettings[f]), b === !0 && (d.currentSlide = d.options.initialSlide), d.refresh(b)), h = f) : (d.activeBreakpoint = f, "unslick" === d.breakpointSettings[f] ? d.unslick(f) : (d.options = a.extend({}, d.originalSettings, d.breakpointSettings[f]), b === !0 && (d.currentSlide = d.options.initialSlide), d.refresh(b)), h = f) : null !== d.activeBreakpoint && (d.activeBreakpoint = null, d.options = d.originalSettings, b === !0 && (d.currentSlide = d.options.initialSlide), d.refresh(b), h = f), b || h === !1 || d.$slider.trigger("breakpoint", [d, h])
        }
    }, b.prototype.changeSlide = function (b, c) {
        var f, g, h, d = this, e = a(b.target);
        switch (e.is("a") && b.preventDefault(), e.is("li") || (e = e.closest("li")), h = d.slideCount % d.options.slidesToScroll !== 0, f = h ? 0 : (d.slideCount - d.currentSlide) % d.options.slidesToScroll, b.data.message) {
            case"previous":
                g = 0 === f ? d.options.slidesToScroll : d.options.slidesToShow - f, d.slideCount > d.options.slidesToShow && d.slideHandler(d.currentSlide - g, !1, c);
                break;
            case"next":
                g = 0 === f ? d.options.slidesToScroll : f, d.slideCount > d.options.slidesToShow && d.slideHandler(d.currentSlide + g, !1, c);
                break;
            case"index":
                var i = 0 === b.data.index ? 0 : b.data.index || e.index() * d.options.slidesToScroll;
                d.slideHandler(d.checkNavigable(i), !1, c), e.children().trigger("focus");
                break;
            default:
                return
        }
    }, b.prototype.checkNavigable = function (a) {
        var c, d, b = this;
        if (c = b.getNavigableIndexes(), d = 0, a > c[c.length - 1])
            a = c[c.length - 1];
        else
            for (var e in c) {
                if (a < c[e]) {
                    a = d;
                    break
                }
                d = c[e]
            }
        return a
    }, b.prototype.cleanUpEvents = function () {
        var b = this;
        b.options.dots && null !== b.$dots && (a("li", b.$dots).off("click.slick", b.changeSlide), b.options.pauseOnDotsHover === !0 && b.options.autoplay === !0 && a("li", b.$dots).off("mouseenter.slick", a.proxy(b.setPaused, b, !0)).off("mouseleave.slick", a.proxy(b.setPaused, b, !1))), b.options.arrows === !0 && b.slideCount > b.options.slidesToShow && (b.$prevArrow && b.$prevArrow.off("click.slick", b.changeSlide), b.$nextArrow && b.$nextArrow.off("click.slick", b.changeSlide)), b.$list.off("touchstart.slick mousedown.slick", b.swipeHandler), b.$list.off("touchmove.slick mousemove.slick", b.swipeHandler), b.$list.off("touchend.slick mouseup.slick", b.swipeHandler), b.$list.off("touchcancel.slick mouseleave.slick", b.swipeHandler), b.$list.off("click.slick", b.clickHandler), a(document).off(b.visibilityChange, b.visibility), b.$list.off("mouseenter.slick", a.proxy(b.setPaused, b, !0)), b.$list.off("mouseleave.slick", a.proxy(b.setPaused, b, !1)), b.options.accessibility === !0 && b.$list.off("keydown.slick", b.keyHandler), b.options.focusOnSelect === !0 && a(b.$slideTrack).children().off("click.slick", b.selectHandler), a(window).off("orientationchange.slick.slick-" + b.instanceUid, b.orientationChange), a(window).off("resize.slick.slick-" + b.instanceUid, b.resize), a("[draggable!=true]", b.$slideTrack).off("dragstart", b.preventDefault), a(window).off("load.slick.slick-" + b.instanceUid, b.setPosition), a(document).off("ready.slick.slick-" + b.instanceUid, b.setPosition)
    }, b.prototype.cleanUpRows = function () {
        var b, a = this;
        a.options.rows > 1 && (b = a.$slides.children().children(), b.removeAttr("style"), a.$slider.html(b))
    }, b.prototype.clickHandler = function (a) {
        var b = this;
        b.shouldClick === !1 && (a.stopImmediatePropagation(), a.stopPropagation(), a.preventDefault())
    }, b.prototype.destroy = function (b) {
        var c = this;
        c.autoPlayClear(), c.touchObject = {}, c.cleanUpEvents(), a(".slick-cloned", c.$slider).detach(), c.$dots && c.$dots.remove(), c.$prevArrow && c.$prevArrow.length && (c.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), c.htmlExpr.test(c.options.prevArrow) && c.$prevArrow.remove()), c.$nextArrow && c.$nextArrow.length && (c.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), c.htmlExpr.test(c.options.nextArrow) && c.$nextArrow.remove()), c.$slides && (c.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function () {
            a(this).attr("style", a(this).data("originalStyling"))
        }), c.$slideTrack.children(this.options.slide).detach(), c.$slideTrack.detach(), c.$list.detach(), c.$slider.append(c.$slides)), c.cleanUpRows(), c.$slider.removeClass("slick-slider"), c.$slider.removeClass("slick-initialized"), c.unslicked = !0, b || c.$slider.trigger("destroy", [c])
    }, b.prototype.disableTransition = function (a) {
        var b = this, c = {};
        c[b.transitionType] = "", b.options.fade === !1 ? b.$slideTrack.css(c) : b.$slides.eq(a).css(c)
    }, b.prototype.fadeSlide = function (a, b) {
        var c = this;
        c.cssTransitions === !1 ? (c.$slides.eq(a).css({zIndex: c.options.zIndex}), c.$slides.eq(a).animate({opacity: 1}, c.options.speed, c.options.easing, b)) : (c.applyTransition(a), c.$slides.eq(a).css({opacity: 1, zIndex: c.options.zIndex}), b && setTimeout(function () {
            c.disableTransition(a), b.call()
        }, c.options.speed))
    }, b.prototype.fadeSlideOut = function (a) {
        var b = this;
        b.cssTransitions === !1 ? b.$slides.eq(a).animate({opacity: 0, zIndex: b.options.zIndex - 2}, b.options.speed, b.options.easing) : (b.applyTransition(a), b.$slides.eq(a).css({opacity: 0, zIndex: b.options.zIndex - 2}))
    }, b.prototype.filterSlides = b.prototype.slickFilter = function (a) {
        var b = this;
        null !== a && (b.$slidesCache = b.$slides, b.unload(), b.$slideTrack.children(this.options.slide).detach(), b.$slidesCache.filter(a).appendTo(b.$slideTrack), b.reinit())
    }, b.prototype.getCurrent = b.prototype.slickCurrentSlide = function () {
        var a = this;
        return a.currentSlide
    }, b.prototype.getDotCount = function () {
        var a = this, b = 0, c = 0, d = 0;
        if (a.options.infinite === !0)
            for (; b < a.slideCount; )
                ++d, b = c + a.options.slidesToScroll, c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow;
        else if (a.options.centerMode === !0)
            d = a.slideCount;
        else
            for (; b < a.slideCount; )
                ++d, b = c + a.options.slidesToScroll, c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow;
        return d - 1
    }, b.prototype.getLeft = function (a) {
        var c, d, f, b = this, e = 0;
        return b.slideOffset = 0, d = b.$slides.first().outerHeight(!0), b.options.infinite === !0 ? (b.slideCount > b.options.slidesToShow && (b.slideOffset = b.slideWidth * b.options.slidesToShow * -1, e = d * b.options.slidesToShow * -1), b.slideCount % b.options.slidesToScroll !== 0 && a + b.options.slidesToScroll > b.slideCount && b.slideCount > b.options.slidesToShow && (a > b.slideCount ? (b.slideOffset = (b.options.slidesToShow - (a - b.slideCount)) * b.slideWidth * -1, e = (b.options.slidesToShow - (a - b.slideCount)) * d * -1) : (b.slideOffset = b.slideCount % b.options.slidesToScroll * b.slideWidth * -1, e = b.slideCount % b.options.slidesToScroll * d * -1))) : a + b.options.slidesToShow > b.slideCount && (b.slideOffset = (a + b.options.slidesToShow - b.slideCount) * b.slideWidth, e = (a + b.options.slidesToShow - b.slideCount) * d), b.slideCount <= b.options.slidesToShow && (b.slideOffset = 0, e = 0), b.options.centerMode === !0 && b.options.infinite === !0 ? b.slideOffset += b.slideWidth * Math.floor(b.options.slidesToShow / 2) - b.slideWidth : b.options.centerMode === !0 && (b.slideOffset = 0, b.slideOffset += b.slideWidth * Math.floor(b.options.slidesToShow / 2)), c = b.options.vertical === !1 ? a * b.slideWidth * -1 + b.slideOffset : a * d * -1 + e, b.options.variableWidth === !0 && (f = b.slideCount <= b.options.slidesToShow || b.options.infinite === !1 ? b.$slideTrack.children(".slick-slide").eq(a) : b.$slideTrack.children(".slick-slide").eq(a + b.options.slidesToShow), c = b.options.rtl === !0 ? f[0] ? -1 * (b.$slideTrack.width() - f[0].offsetLeft - f.width()) : 0 : f[0] ? -1 * f[0].offsetLeft : 0, b.options.centerMode === !0 && (f = b.slideCount <= b.options.slidesToShow || b.options.infinite === !1 ? b.$slideTrack.children(".slick-slide").eq(a) : b.$slideTrack.children(".slick-slide").eq(a + b.options.slidesToShow + 1), c = b.options.rtl === !0 ? f[0] ? -1 * (b.$slideTrack.width() - f[0].offsetLeft - f.width()) : 0 : f[0] ? -1 * f[0].offsetLeft : 0, c += (b.$list.width() - f.outerWidth()) / 2)), c
    }, b.prototype.getOption = b.prototype.slickGetOption = function (a) {
        var b = this;
        return b.options[a]
    }, b.prototype.getNavigableIndexes = function () {
        var e, a = this, b = 0, c = 0, d = [];
        for (a.options.infinite === !1?e = a.slideCount:(b = - 1 * a.options.slidesToScroll, c = - 1 * a.options.slidesToScroll, e = 2 * a.slideCount); e > b; )
            d.push(b), b = c + a.options.slidesToScroll, c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow;
        return d
    }, b.prototype.getSlick = function () {
        return this
    }, b.prototype.getSlideCount = function () {
        var c, d, e, b = this;
        return e = b.options.centerMode === !0 ? b.slideWidth * Math.floor(b.options.slidesToShow / 2) : 0, b.options.swipeToSlide === !0 ? (b.$slideTrack.find(".slick-slide").each(function (c, f) {
            return f.offsetLeft - e + a(f).outerWidth() / 2 > -1 * b.swipeLeft ? (d = f, !1) : void 0
        }), c = Math.abs(a(d).attr("data-slick-index") - b.currentSlide) || 1) : b.options.slidesToScroll
    }, b.prototype.goTo = b.prototype.slickGoTo = function (a, b) {
        var c = this;
        c.changeSlide({data: {message: "index", index: parseInt(a)}}, b)
    }, b.prototype.init = function (b) {
        var c = this;
        a(c.$slider).hasClass("slick-initialized") || (a(c.$slider).addClass("slick-initialized"), c.buildRows(), c.buildOut(), c.setProps(), c.startLoad(), c.loadSlider(), c.initializeEvents(), c.updateArrows(), c.updateDots()), b && c.$slider.trigger("init", [c]), c.options.accessibility === !0 && c.initADA()
    }, b.prototype.initArrowEvents = function () {
        var a = this;
        a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.on("click.slick", {message: "previous"}, a.changeSlide), a.$nextArrow.on("click.slick", {message: "next"}, a.changeSlide))
    }, b.prototype.initDotEvents = function () {
        var b = this;
        b.options.dots === !0 && b.slideCount > b.options.slidesToShow && a("li", b.$dots).on("click.slick", {message: "index"}, b.changeSlide), b.options.dots === !0 && b.options.pauseOnDotsHover === !0 && b.options.autoplay === !0 && a("li", b.$dots).on("mouseenter.slick", a.proxy(b.setPaused, b, !0)).on("mouseleave.slick", a.proxy(b.setPaused, b, !1))
    }, b.prototype.initializeEvents = function () {
        var b = this;
        b.initArrowEvents(), b.initDotEvents(), b.$list.on("touchstart.slick mousedown.slick", {action: "start"}, b.swipeHandler), b.$list.on("touchmove.slick mousemove.slick", {action: "move"}, b.swipeHandler), b.$list.on("touchend.slick mouseup.slick", {action: "end"}, b.swipeHandler), b.$list.on("touchcancel.slick mouseleave.slick", {action: "end"}, b.swipeHandler), b.$list.on("click.slick", b.clickHandler), a(document).on(b.visibilityChange, a.proxy(b.visibility, b)), b.$list.on("mouseenter.slick", a.proxy(b.setPaused, b, !0)), b.$list.on("mouseleave.slick", a.proxy(b.setPaused, b, !1)), b.options.accessibility === !0 && b.$list.on("keydown.slick", b.keyHandler), b.options.focusOnSelect === !0 && a(b.$slideTrack).children().on("click.slick", b.selectHandler), a(window).on("orientationchange.slick.slick-" + b.instanceUid, a.proxy(b.orientationChange, b)), a(window).on("resize.slick.slick-" + b.instanceUid, a.proxy(b.resize, b)), a("[draggable!=true]", b.$slideTrack).on("dragstart", b.preventDefault), a(window).on("load.slick.slick-" + b.instanceUid, b.setPosition), a(document).on("ready.slick.slick-" + b.instanceUid, b.setPosition)
    }, b.prototype.initUI = function () {
        var a = this;
        a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.show(), a.$nextArrow.show()), a.options.dots === !0 && a.slideCount > a.options.slidesToShow && a.$dots.show(), a.options.autoplay === !0 && a.autoPlay()
    }, b.prototype.keyHandler = function (a) {
        var b = this;
        a.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === a.keyCode && b.options.accessibility === !0 ? b.changeSlide({data: {message: "previous"}}) : 39 === a.keyCode && b.options.accessibility === !0 && b.changeSlide({data: {message: "next"}}))
    }, b.prototype.lazyLoad = function () {
        function g(b) {
            a("img[data-lazy]", b).each(function () {
                var b = a(this), c = a(this).attr("data-lazy"), d = document.createElement("img");
                d.onload = function () {
                    b.animate({opacity: 0}, 100, function () {
                        b.attr("src", c).animate({opacity: 1}, 200, function () {
                            b.removeAttr("data-lazy").removeClass("slick-loading")
                        })
                    })
                }, d.src = c
            })
        }
        var c, d, e, f, b = this;
        b.options.centerMode === !0 ? b.options.infinite === !0 ? (e = b.currentSlide + (b.options.slidesToShow / 2 + 1), f = e + b.options.slidesToShow + 2) : (e = Math.max(0, b.currentSlide - (b.options.slidesToShow / 2 + 1)), f = 2 + (b.options.slidesToShow / 2 + 1) + b.currentSlide) : (e = b.options.infinite ? b.options.slidesToShow + b.currentSlide : b.currentSlide, f = e + b.options.slidesToShow, b.options.fade === !0 && (e > 0 && e--, f <= b.slideCount && f++)), c = b.$slider.find(".slick-slide").slice(e, f), g(c), b.slideCount <= b.options.slidesToShow ? (d = b.$slider.find(".slick-slide"), g(d)) : b.currentSlide >= b.slideCount - b.options.slidesToShow ? (d = b.$slider.find(".slick-cloned").slice(0, b.options.slidesToShow), g(d)) : 0 === b.currentSlide && (d = b.$slider.find(".slick-cloned").slice(-1 * b.options.slidesToShow), g(d))
    }, b.prototype.loadSlider = function () {
        var a = this;
        a.setPosition(), a.$slideTrack.css({opacity: 1}), a.$slider.removeClass("slick-loading"), a.initUI(), "progressive" === a.options.lazyLoad && a.progressiveLazyLoad()
    }, b.prototype.next = b.prototype.slickNext = function () {
        var a = this;
        a.changeSlide({data: {message: "next"}})
    }, b.prototype.orientationChange = function () {
        var a = this;
        a.checkResponsive(), a.setPosition()
    }, b.prototype.pause = b.prototype.slickPause = function () {
        var a = this;
        a.autoPlayClear(), a.paused = !0
    }, b.prototype.play = b.prototype.slickPlay = function () {
        var a = this;
        a.paused = !1, a.autoPlay()
    }, b.prototype.postSlide = function (a) {
        var b = this;
        b.$slider.trigger("afterChange", [b, a]), b.animating = !1, b.setPosition(), b.swipeLeft = null, b.options.autoplay === !0 && b.paused === !1 && b.autoPlay(), b.options.accessibility === !0 && b.initADA()
    }, b.prototype.prev = b.prototype.slickPrev = function () {
        var a = this;
        a.changeSlide({data: {message: "previous"}})
    }, b.prototype.preventDefault = function (a) {
        a.preventDefault()
    }, b.prototype.progressiveLazyLoad = function () {
        var c, d, b = this;
        c = a("img[data-lazy]", b.$slider).length, c > 0 && (d = a("img[data-lazy]", b.$slider).first(), d.attr("src", null), d.attr("src", d.attr("data-lazy")).removeClass("slick-loading").load(function () {
            d.removeAttr("data-lazy"), b.progressiveLazyLoad(), b.options.adaptiveHeight === !0 && b.setPosition()
        }).error(function () {
            d.removeAttr("data-lazy"), b.progressiveLazyLoad()
        }))
    }, b.prototype.refresh = function (b) {
        var d, e, c = this;
        e = c.slideCount - c.options.slidesToShow, c.options.infinite || (c.slideCount <= c.options.slidesToShow ? c.currentSlide = 0 : c.currentSlide > e && (c.currentSlide = e)), d = c.currentSlide, c.destroy(!0), a.extend(c, c.initials, {currentSlide: d}), c.init(), b || c.changeSlide({data: {message: "index", index: d}}, !1)
    }, b.prototype.registerBreakpoints = function () {
        var c, d, e, b = this, f = b.options.responsive || null;
        if ("array" === a.type(f) && f.length) {
            b.respondTo = b.options.respondTo || "window";
            for (c in f)
                if (e = b.breakpoints.length - 1, d = f[c].breakpoint, f.hasOwnProperty(c)) {
                    for (; e >= 0; )
                        b.breakpoints[e] && b.breakpoints[e] === d && b.breakpoints.splice(e, 1), e--;
                    b.breakpoints.push(d), b.breakpointSettings[d] = f[c].settings
                }
            b.breakpoints.sort(function (a, c) {
                return b.options.mobileFirst ? a - c : c - a
            })
        }
    }, b.prototype.reinit = function () {
        var b = this;
        b.$slides = b.$slideTrack.children(b.options.slide).addClass("slick-slide"), b.slideCount = b.$slides.length, b.currentSlide >= b.slideCount && 0 !== b.currentSlide && (b.currentSlide = b.currentSlide - b.options.slidesToScroll), b.slideCount <= b.options.slidesToShow && (b.currentSlide = 0), b.registerBreakpoints(), b.setProps(), b.setupInfinite(), b.buildArrows(), b.updateArrows(), b.initArrowEvents(), b.buildDots(), b.updateDots(), b.initDotEvents(), b.checkResponsive(!1, !0), b.options.focusOnSelect === !0 && a(b.$slideTrack).children().on("click.slick", b.selectHandler), b.setSlideClasses(0), b.setPosition(), b.$slider.trigger("reInit", [b]), b.options.autoplay === !0 && b.focusHandler()
    }, b.prototype.resize = function () {
        var b = this;
        a(window).width() !== b.windowWidth && (clearTimeout(b.windowDelay), b.windowDelay = window.setTimeout(function () {
            b.windowWidth = a(window).width(), b.checkResponsive(), b.unslicked || b.setPosition()
        }, 50))
    }, b.prototype.removeSlide = b.prototype.slickRemove = function (a, b, c) {
        var d = this;
        return"boolean" == typeof a ? (b = a, a = b === !0 ? 0 : d.slideCount - 1) : a = b === !0 ? --a : a, d.slideCount < 1 || 0 > a || a > d.slideCount - 1 ? !1 : (d.unload(), c === !0 ? d.$slideTrack.children().remove() : d.$slideTrack.children(this.options.slide).eq(a).remove(), d.$slides = d.$slideTrack.children(this.options.slide), d.$slideTrack.children(this.options.slide).detach(), d.$slideTrack.append(d.$slides), d.$slidesCache = d.$slides, void d.reinit())
    }, b.prototype.setCSS = function (a) {
        var d, e, b = this, c = {};
        b.options.rtl === !0 && (a = -a), d = "left" == b.positionProp ? Math.ceil(a) + "px" : "0px", e = "top" == b.positionProp ? Math.ceil(a) + "px" : "0px", c[b.positionProp] = a, b.transformsEnabled === !1 ? b.$slideTrack.css(c) : (c = {}, b.cssTransitions === !1 ? (c[b.animType] = "translate(" + d + ", " + e + ")", b.$slideTrack.css(c)) : (c[b.animType] = "translate3d(" + d + ", " + e + ", 0px)", b.$slideTrack.css(c)))
    }, b.prototype.setDimensions = function () {
        var a = this;
        a.options.vertical === !1 ? a.options.centerMode === !0 && a.$list.css({padding: "0px " + a.options.centerPadding}) : (a.$list.height(a.$slides.first().outerHeight(!0) * a.options.slidesToShow), a.options.centerMode === !0 && a.$list.css({padding: a.options.centerPadding + " 0px"})), a.listWidth = a.$list.width(), a.listHeight = a.$list.height(), a.options.vertical === !1 && a.options.variableWidth === !1 ? (a.slideWidth = Math.ceil(a.listWidth / a.options.slidesToShow), a.$slideTrack.width(Math.ceil(a.slideWidth * a.$slideTrack.children(".slick-slide").length))) : a.options.variableWidth === !0 ? a.$slideTrack.width(5e3 * a.slideCount) : (a.slideWidth = Math.ceil(a.listWidth), a.$slideTrack.height(Math.ceil(a.$slides.first().outerHeight(!0) * a.$slideTrack.children(".slick-slide").length)));
        var b = a.$slides.first().outerWidth(!0) - a.$slides.first().width();
        a.options.variableWidth === !1 && a.$slideTrack.children(".slick-slide").width(a.slideWidth - b)
    }, b.prototype.setFade = function () {
        var c, b = this;
        b.$slides.each(function (d, e) {
            c = b.slideWidth * d * -1, b.options.rtl === !0 ? a(e).css({position: "relative", right: c, top: 0, zIndex: b.options.zIndex - 2, opacity: 0}) : a(e).css({position: "relative", left: c, top: 0, zIndex: b.options.zIndex - 2, opacity: 0})
        }), b.$slides.eq(b.currentSlide).css({zIndex: b.options.zIndex - 1, opacity: 1})
    }, b.prototype.setHeight = function () {
        var a = this;
        if (1 === a.options.slidesToShow && a.options.adaptiveHeight === !0 && a.options.vertical === !1) {
            var b = a.$slides.eq(a.currentSlide).outerHeight(!0);
            a.$list.css("height", b)
        }
    }, b.prototype.setOption = b.prototype.slickSetOption = function (b, c, d) {
        var f, g, e = this;
        if ("responsive" === b && "array" === a.type(c))
            for (g in c)
                if ("array" !== a.type(e.options.responsive))
                    e.options.responsive = [c[g]];
                else {
                    for (f = e.options.responsive.length - 1; f >= 0; )
                        e.options.responsive[f].breakpoint === c[g].breakpoint && e.options.responsive.splice(f, 1), f--;
                    e.options.responsive.push(c[g])
                }
        else
            e.options[b] = c;
        d === !0 && (e.unload(), e.reinit())
    }, b.prototype.setPosition = function () {
        var a = this;
        a.setDimensions(), a.setHeight(), a.options.fade === !1 ? a.setCSS(a.getLeft(a.currentSlide)) : a.setFade(), a.$slider.trigger("setPosition", [a])
    }, b.prototype.setProps = function () {
        var a = this, b = document.body.style;
        a.positionProp = a.options.vertical === !0 ? "top" : "left", "top" === a.positionProp ? a.$slider.addClass("slick-vertical") : a.$slider.removeClass("slick-vertical"), (void 0 !== b.WebkitTransition || void 0 !== b.MozTransition || void 0 !== b.msTransition) && a.options.useCSS === !0 && (a.cssTransitions = !0), a.options.fade && ("number" == typeof a.options.zIndex ? a.options.zIndex < 3 && (a.options.zIndex = 3) : a.options.zIndex = a.defaults.zIndex), void 0 !== b.OTransform && (a.animType = "OTransform", a.transformType = "-o-transform", a.transitionType = "OTransition", void 0 === b.perspectiveProperty && void 0 === b.webkitPerspective && (a.animType = !1)), void 0 !== b.MozTransform && (a.animType = "MozTransform", a.transformType = "-moz-transform", a.transitionType = "MozTransition", void 0 === b.perspectiveProperty && void 0 === b.MozPerspective && (a.animType = !1)), void 0 !== b.webkitTransform && (a.animType = "webkitTransform", a.transformType = "-webkit-transform", a.transitionType = "webkitTransition", void 0 === b.perspectiveProperty && void 0 === b.webkitPerspective && (a.animType = !1)), void 0 !== b.msTransform && (a.animType = "msTransform", a.transformType = "-ms-transform", a.transitionType = "msTransition", void 0 === b.msTransform && (a.animType = !1)), void 0 !== b.transform && a.animType !== !1 && (a.animType = "transform", a.transformType = "transform", a.transitionType = "transition"), a.transformsEnabled = a.options.useTransform && null !== a.animType && a.animType !== !1
    }, b.prototype.setSlideClasses = function (a) {
        var c, d, e, f, b = this;
        d = b.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), b.$slides.eq(a).addClass("slick-current"), b.options.centerMode === !0 ? (c = Math.floor(b.options.slidesToShow / 2), b.options.infinite === !0 && (a >= c && a <= b.slideCount - 1 - c ? b.$slides.slice(a - c, a + c + 1).addClass("slick-active").attr("aria-hidden", "false") : (e = b.options.slidesToShow + a, d.slice(e - c + 1, e + c + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === a ? d.eq(d.length - 1 - b.options.slidesToShow).addClass("slick-center") : a === b.slideCount - 1 && d.eq(b.options.slidesToShow).addClass("slick-center")), b.$slides.eq(a).addClass("slick-center")) : a >= 0 && a <= b.slideCount - b.options.slidesToShow ? b.$slides.slice(a, a + b.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : d.length <= b.options.slidesToShow ? d.addClass("slick-active").attr("aria-hidden", "false") : (f = b.slideCount % b.options.slidesToShow, e = b.options.infinite === !0 ? b.options.slidesToShow + a : a, b.options.slidesToShow == b.options.slidesToScroll && b.slideCount - a < b.options.slidesToShow ? d.slice(e - (b.options.slidesToShow - f), e + f).addClass("slick-active").attr("aria-hidden", "false") : d.slice(e, e + b.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false")), "ondemand" === b.options.lazyLoad && b.lazyLoad()
    }, b.prototype.setupInfinite = function () {
        var c, d, e, b = this;
        if (b.options.fade === !0 && (b.options.centerMode = !1), b.options.infinite === !0 && b.options.fade === !1 && (d = null, b.slideCount > b.options.slidesToShow)) {
            for (e = b.options.centerMode === !0?b.options.slidesToShow + 1:b.options.slidesToShow, c = b.slideCount; c > b.slideCount - e; c -= 1)
                d = c - 1, a(b.$slides[d]).clone(!0).attr("id", "").attr("data-slick-index", d - b.slideCount).prependTo(b.$slideTrack).addClass("slick-cloned");
            for (c = 0; e > c; c += 1)
                d = c, a(b.$slides[d]).clone(!0).attr("id", "").attr("data-slick-index", d + b.slideCount).appendTo(b.$slideTrack).addClass("slick-cloned");
            b.$slideTrack.find(".slick-cloned").find("[id]").each(function () {
                a(this).attr("id", "")
            })
        }
    }, b.prototype.setPaused = function (a) {
        var b = this;
        b.options.autoplay === !0 && b.options.pauseOnHover === !0 && (b.paused = a, a ? b.autoPlayClear() : b.autoPlay())
    }, b.prototype.selectHandler = function (b) {
        var c = this, d = a(b.target).is(".slick-slide") ? a(b.target) : a(b.target).parents(".slick-slide"), e = parseInt(d.attr("data-slick-index"));
        return e || (e = 0), c.slideCount <= c.options.slidesToShow ? (c.setSlideClasses(e), void c.asNavFor(e)) : void c.slideHandler(e)
    }, b.prototype.slideHandler = function (a, b, c) {
        var d, e, f, g, h = null, i = this;
        return b = b || !1, i.animating === !0 && i.options.waitForAnimate === !0 || i.options.fade === !0 && i.currentSlide === a || i.slideCount <= i.options.slidesToShow ? void 0 : (b === !1 && i.asNavFor(a), d = a, h = i.getLeft(d), g = i.getLeft(i.currentSlide), i.currentLeft = null === i.swipeLeft ? g : i.swipeLeft, i.options.infinite === !1 && i.options.centerMode === !1 && (0 > a || a > i.getDotCount() * i.options.slidesToScroll) ? void(i.options.fade === !1 && (d = i.currentSlide, c !== !0 ? i.animateSlide(g, function () {
            i.postSlide(d);
        }) : i.postSlide(d))) : i.options.infinite === !1 && i.options.centerMode === !0 && (0 > a || a > i.slideCount - i.options.slidesToScroll) ? void(i.options.fade === !1 && (d = i.currentSlide, c !== !0 ? i.animateSlide(g, function () {
            i.postSlide(d)
        }) : i.postSlide(d))) : (i.options.autoplay === !0 && clearInterval(i.autoPlayTimer), e = 0 > d ? i.slideCount % i.options.slidesToScroll !== 0 ? i.slideCount - i.slideCount % i.options.slidesToScroll : i.slideCount + d : d >= i.slideCount ? i.slideCount % i.options.slidesToScroll !== 0 ? 0 : d - i.slideCount : d, i.animating = !0, i.$slider.trigger("beforeChange", [i, i.currentSlide, e]), f = i.currentSlide, i.currentSlide = e, i.setSlideClasses(i.currentSlide), i.updateDots(), i.updateArrows(), i.options.fade === !0 ? (c !== !0 ? (i.fadeSlideOut(f), i.fadeSlide(e, function () {
            i.postSlide(e)
        })) : i.postSlide(e), void i.animateHeight()) : void(c !== !0 ? i.animateSlide(h, function () {
            i.postSlide(e)
        }) : i.postSlide(e))))
    }, b.prototype.startLoad = function () {
        var a = this;
        a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.hide(), a.$nextArrow.hide()), a.options.dots === !0 && a.slideCount > a.options.slidesToShow && a.$dots.hide(), a.$slider.addClass("slick-loading")
    }, b.prototype.swipeDirection = function () {
        var a, b, c, d, e = this;
        return a = e.touchObject.startX - e.touchObject.curX, b = e.touchObject.startY - e.touchObject.curY, c = Math.atan2(b, a), d = Math.round(180 * c / Math.PI), 0 > d && (d = 360 - Math.abs(d)), 45 >= d && d >= 0 ? e.options.rtl === !1 ? "left" : "right" : 360 >= d && d >= 315 ? e.options.rtl === !1 ? "left" : "right" : d >= 135 && 225 >= d ? e.options.rtl === !1 ? "right" : "left" : e.options.verticalSwiping === !0 ? d >= 35 && 135 >= d ? "left" : "right" : "vertical"
    }, b.prototype.swipeEnd = function (a) {
        var c, b = this;
        if (b.dragging = !1, b.shouldClick = b.touchObject.swipeLength > 10 ? !1 : !0, void 0 === b.touchObject.curX)
            return!1;
        if (b.touchObject.edgeHit === !0 && b.$slider.trigger("edge", [b, b.swipeDirection()]), b.touchObject.swipeLength >= b.touchObject.minSwipe)
            switch (b.swipeDirection()) {
                case"left":
                    c = b.options.swipeToSlide ? b.checkNavigable(b.currentSlide + b.getSlideCount()) : b.currentSlide + b.getSlideCount(), b.slideHandler(c), b.currentDirection = 0, b.touchObject = {}, b.$slider.trigger("swipe", [b, "left"]);
                    break;
                case"right":
                    c = b.options.swipeToSlide ? b.checkNavigable(b.currentSlide - b.getSlideCount()) : b.currentSlide - b.getSlideCount(), b.slideHandler(c), b.currentDirection = 1, b.touchObject = {}, b.$slider.trigger("swipe", [b, "right"])
            }
        else
            b.touchObject.startX !== b.touchObject.curX && (b.slideHandler(b.currentSlide), b.touchObject = {})
    }, b.prototype.swipeHandler = function (a) {
        var b = this;
        if (!(b.options.swipe === !1 || "ontouchend"in document && b.options.swipe === !1 || b.options.draggable === !1 && -1 !== a.type.indexOf("mouse")))
            switch (b.touchObject.fingerCount = a.originalEvent && void 0 !== a.originalEvent.touches ? a.originalEvent.touches.length : 1, b.touchObject.minSwipe = b.listWidth / b.options.touchThreshold, b.options.verticalSwiping === !0 && (b.touchObject.minSwipe = b.listHeight / b.options.touchThreshold), a.data.action) {
                case"start":
                    b.swipeStart(a);
                    break;
                case"move":
                    b.swipeMove(a);
                    break;
                case"end":
                    b.swipeEnd(a)
            }
    }, b.prototype.swipeMove = function (a) {
        var d, e, f, g, h, b = this;
        return h = void 0 !== a.originalEvent ? a.originalEvent.touches : null, !b.dragging || h && 1 !== h.length ? !1 : (d = b.getLeft(b.currentSlide), b.touchObject.curX = void 0 !== h ? h[0].pageX : a.clientX, b.touchObject.curY = void 0 !== h ? h[0].pageY : a.clientY, b.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(b.touchObject.curX - b.touchObject.startX, 2))), b.options.verticalSwiping === !0 && (b.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(b.touchObject.curY - b.touchObject.startY, 2)))), e = b.swipeDirection(), "vertical" !== e ? (void 0 !== a.originalEvent && b.touchObject.swipeLength > 4 && a.preventDefault(), g = (b.options.rtl === !1 ? 1 : -1) * (b.touchObject.curX > b.touchObject.startX ? 1 : -1), b.options.verticalSwiping === !0 && (g = b.touchObject.curY > b.touchObject.startY ? 1 : -1), f = b.touchObject.swipeLength, b.touchObject.edgeHit = !1, b.options.infinite === !1 && (0 === b.currentSlide && "right" === e || b.currentSlide >= b.getDotCount() && "left" === e) && (f = b.touchObject.swipeLength * b.options.edgeFriction, b.touchObject.edgeHit = !0), b.options.vertical === !1 ? b.swipeLeft = d + f * g : b.swipeLeft = d + f * (b.$list.height() / b.listWidth) * g, b.options.verticalSwiping === !0 && (b.swipeLeft = d + f * g), b.options.fade === !0 || b.options.touchMove === !1 ? !1 : b.animating === !0 ? (b.swipeLeft = null, !1) : void b.setCSS(b.swipeLeft)) : void 0)
    }, b.prototype.swipeStart = function (a) {
        var c, b = this;
        return 1 !== b.touchObject.fingerCount || b.slideCount <= b.options.slidesToShow ? (b.touchObject = {}, !1) : (void 0 !== a.originalEvent && void 0 !== a.originalEvent.touches && (c = a.originalEvent.touches[0]), b.touchObject.startX = b.touchObject.curX = void 0 !== c ? c.pageX : a.clientX, b.touchObject.startY = b.touchObject.curY = void 0 !== c ? c.pageY : a.clientY, void(b.dragging = !0))
    }, b.prototype.unfilterSlides = b.prototype.slickUnfilter = function () {
        var a = this;
        null !== a.$slidesCache && (a.unload(), a.$slideTrack.children(this.options.slide).detach(), a.$slidesCache.appendTo(a.$slideTrack), a.reinit())
    }, b.prototype.unload = function () {
        var b = this;
        a(".slick-cloned", b.$slider).remove(), b.$dots && b.$dots.remove(), b.$prevArrow && b.htmlExpr.test(b.options.prevArrow) && b.$prevArrow.remove(), b.$nextArrow && b.htmlExpr.test(b.options.nextArrow) && b.$nextArrow.remove(), b.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
    }, b.prototype.unslick = function (a) {
        var b = this;
        b.$slider.trigger("unslick", [b, a]), b.destroy()
    }, b.prototype.updateArrows = function () {
        var b, a = this;
        b = Math.floor(a.options.slidesToShow / 2), a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && !a.options.infinite && (a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === a.currentSlide ? (a.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : a.currentSlide >= a.slideCount - a.options.slidesToShow && a.options.centerMode === !1 ? (a.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : a.currentSlide >= a.slideCount - 1 && a.options.centerMode === !0 && (a.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
    }, b.prototype.updateDots = function () {
        var a = this;
        null !== a.$dots && (a.$dots.find("li").removeClass("slick-active").attr("aria-hidden", "true"), a.$dots.find("li").eq(Math.floor(a.currentSlide / a.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden", "false"))
    }, b.prototype.visibility = function () {
        var a = this;
        document[a.hidden] ? (a.paused = !0, a.autoPlayClear()) : a.options.autoplay === !0 && (a.paused = !1, a.autoPlay())
    }, b.prototype.initADA = function () {
        var b = this;
        b.$slides.add(b.$slideTrack.find(".slick-cloned")).attr({"aria-hidden": "true", tabindex: "-1"}).find("a, input, button, select").attr({tabindex: "-1"}), b.$slideTrack.attr("role", "listbox"), b.$slides.not(b.$slideTrack.find(".slick-cloned")).each(function (c) {
            a(this).attr({role: "option", "aria-describedby": "slick-slide" + b.instanceUid + c})
        }), null !== b.$dots && b.$dots.attr("role", "tablist").find("li").each(function (c) {
            a(this).attr({role: "presentation", "aria-selected": "false", "aria-controls": "navigation" + b.instanceUid + c, id: "slick-slide" + b.instanceUid + c})
        }).first().attr("aria-selected", "true").end().find("button").attr("role", "button").end().closest("div").attr("role", "toolbar"), b.activateADA()
    }, b.prototype.activateADA = function () {
        var a = this;
        a.$slideTrack.find(".slick-active").attr({"aria-hidden": "false"}).find("a, input, button, select").attr({tabindex: "0"})
    }, b.prototype.focusHandler = function () {
        var b = this;
        b.$slider.on("focus.slick blur.slick", "*", function (c) {
            c.stopImmediatePropagation();
            var d = a(this);
            setTimeout(function () {
                b.isPlay && (d.is(":focus") ? (b.autoPlayClear(), b.paused = !0) : (b.paused = !1, b.autoPlay()))
            }, 0)
        })
    }, a.fn.slick = function () {
        var f, g, a = this, c = arguments[0], d = Array.prototype.slice.call(arguments, 1), e = a.length;
        for (f = 0; e > f; f++)
            if ("object" == typeof c || "undefined" == typeof c ? a[f].slick = new b(a[f], c) : g = a[f].slick[c].apply(a[f].slick, d), "undefined" != typeof g)
                return g;
        return a
    }
});



/*
 Sticky-kit v1.1.2 | WTFPL | Leaf Corcoran 2015 | http://leafo.net
 */
(function () {
    var b, f;
    b = this.jQuery || window.jQuery;
    f = b(window);
    b.fn.stick_in_parent = function (d) {
        var A, w, J, n, B, K, p, q, k, E, t;
        null == d && (d = {});
        t = d.sticky_class;
        B = d.inner_scrolling;
        E = d.recalc_every;
        k = d.parent;
        q = d.offset_top;
        p = d.spacer;
        w = d.bottoming;
        null == q && (q = 0);
        null == k && (k = void 0);
        null == B && (B = !0);
        null == t && (t = "is_stuck");
        A = b(document);
        null == w && (w = !0);
        J = function (a, d, n, C, F, u, r, G) {
            var v, H, m, D, I, c, g, x, y, z, h, l;
            if (!a.data("sticky_kit")) {
                a.data("sticky_kit", !0);
                I = A.height();
                g = a.parent();
                null != k && (g = g.closest(k));
                if (!g.length)
                    throw"failed to find stick parent";
                v = m = !1;
                (h = null != p ? p && a.closest(p) : b("<div />")) && h.css("position", a.css("position"));
                x = function () {
                    var c, f, e;
                    if (!G && (I = A.height(), c = parseInt(g.css("border-top-width"), 10), f = parseInt(g.css("padding-top"), 10), d = parseInt(g.css("padding-bottom"), 10), n = g.offset().top + c + f, C = g.height(), m && (v = m = !1, null == p && (a.insertAfter(h), h.detach()), a.css({position: "", top: "", width: "", bottom: ""}).removeClass(t), e = !0), F = a.offset().top - (parseInt(a.css("margin-top"), 10) || 0) - q,
                            u = a.outerHeight(!0), r = a.css("float"), h && h.css({width: a.outerWidth(!0), height: u, display: a.css("display"), "vertical-align": a.css("vertical-align"), "float": r}), e))
                        return l()
                };
                x();
                if (u !== C)
                    return D = void 0, c = q, z = E, l = function () {
                        var b, l, e, k;
                        if (!G && (e = !1, null != z && (--z, 0 >= z && (z = E, x(), e = !0)), e || A.height() === I || x(), e = f.scrollTop(), null != D && (l = e - D), D = e, m ? (w && (k = e + u + c > C + n, v && !k && (v = !1, a.css({position: "fixed", bottom: "", top: c}).trigger("sticky_kit:unbottom"))), e < F && (m = !1, c = q, null == p && ("left" !== r && "right" !== r || a.insertAfter(h),
                                h.detach()), b = {position: "", width: "", top: ""}, a.css(b).removeClass(t).trigger("sticky_kit:unstick")), B && (b = f.height(), u + q > b && !v && (c -= l, c = Math.max(b - u, c), c = Math.min(q, c), m && a.css({top: c + "px"})))) : e > F && (m = !0, b = {position: "fixed", top: c}, b.width = "border-box" === a.css("box-sizing") ? a.outerWidth() + "px" : a.width() + "px", a.css(b).addClass(t), null == p && (a.after(h), "left" !== r && "right" !== r || h.append(a)), a.trigger("sticky_kit:stick")), m && w && (null == k && (k = e + u + c > C + n), !v && k)))
                            return v = !0, "static" === g.css("position") && g.css({position: "relative"}),
                                    a.css({position: "absolute", bottom: d, top: "auto"}).trigger("sticky_kit:bottom")
                    }, y = function () {
                        x();
                        return l()
                    }, H = function () {
                        G = !0;
                        f.off("touchmove", l);
                        f.off("scroll", l);
                        f.off("resize", y);
                        b(document.body).off("sticky_kit:recalc", y);
                        a.off("sticky_kit:detach", H);
                        a.removeData("sticky_kit");
                        a.css({position: "", bottom: "", top: "", width: ""});
                        g.position("position", "");
                        if (m)
                            return null == p && ("left" !== r && "right" !== r || a.insertAfter(h), h.remove()), a.removeClass(t)
                    }, f.on("touchmove", l), f.on("scroll", l), f.on("resize",
                            y), b(document.body).on("sticky_kit:recalc", y), a.on("sticky_kit:detach", H), setTimeout(l, 0)
            }
        };
        n = 0;
        for (K = this.length; n < K; n++)
            d = this[n], J(b(d));
        return this
    }
}).call(this);



//makes the megamenu top navigation clickable when already toggled.
jQuery( document ).ready(function() {
/*    jQuery("a.dropdown-toggle").hover(function () {
        jQuery(this).toggleClass("meganav-hover");
    });*/
    jQuery("a.dropdown-toggle").click(function(){
        var expandCheck = jQuery(this).attr("aria-expanded");
        var urlLocation = jQuery(this).attr("href");

        //check if toggled, if so change the url.
/*        if (expandCheck == "true" || (jQuery(this).hasClass("meganav-hover"))) {
            window.location.href = urlLocation;
        }*/
        if (expandCheck == "true" || (jQuery('html').hasClass("no-touch"))) {
            window.location.href = urlLocation;
        }
    });
});
