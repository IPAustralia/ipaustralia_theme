$(window).load(function() {
  $('.flexslider').flexslider({
    animation: "slide",
    slideshow: true,
    pauseOnHover: true,
    start: function(slider) {
      $('body').removeClass('loading');
    }
  });
});

$(document).ready(function() {
  $("#owl-demo").owlCarousel({
    items: 3,
    lazyLoad: true,
    autoPlay: true,
    pagination: true,
  });

  $(".scroll").click(function(event) {
    event.preventDefault();
    $('html,body').animate({
      scrollTop: $(this.hash).offset().top
    }, 1000);
  });

  /*
  	var defaults = {
  	containerID: 'toTop', // fading element id
  	containerHoverID: 'toTopHover', // fading element hover id
  	scrollSpeed: 1200,
  	easingType: 'linear'
  	};
  */

  $().UItoTop({
    easingType: 'easeOutQuart'
  });

  $('.mobile-nav-button').on('click', function() {
    $(".mobile-nav-button .mobile-nav-button__line:nth-of-type(1)").toggleClass("mobile-nav-button__line--1");
    $(".mobile-nav-button .mobile-nav-button__line:nth-of-type(2)").toggleClass("mobile-nav-button__line--2");
    $(".mobile-nav-button .mobile-nav-button__line:nth-of-type(3)").toggleClass("mobile-nav-button__line--3");

    $('.mobile-menu').toggleClass('mobile-menu--open');
    return false;
  });
});
