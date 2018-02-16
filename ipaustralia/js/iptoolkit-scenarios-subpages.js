(function($) {
  $(document).ready(function() {

    /* -- script for scroll to form -- */
    $(document).ready(function() {
      // Handler for .ready() called.
      $('html, body').animate({
        scrollTop: $('#form').offset().top
      }, 'slow');
    })

    /* -- script for checking boxes from url -- */
    //	var queryString = window.location.href.substr(window.location.href.lastIndexOf('?') + 1);
    var queryString = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    var queryArray = queryString.replace('.html', '').split("-");
    if (queryArray.length === 3) {
      for (var i = 0; i < queryArray.length; i++) {
        $("#radios-" + queryArray[i]).prop('checked', true).closest(".form-group").show();
      }
      $("#step-4").show().children().show();
    }

  });
})(jQuery);
