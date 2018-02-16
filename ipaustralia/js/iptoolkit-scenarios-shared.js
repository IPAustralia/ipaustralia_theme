(function($) {
  /* -- script for reset -- */
  $(document).ready(function() {
    $("button:reset").click(function() {
      $("#step-2, #step-3, #step-4").slideUp();
    })

    /* -- script for building link -- */
    $("input[type=radio]").on("change", function() {
      var arr = []
      $(":radio").each(function() {
        if ($(this).is(":checked")) {
          arr.push($(this).val())
        }
      })
      var vals = arr.join("-")
      var str = 'https://www.ipaustralia.gov.au/ip-management-scenarios-toolkit/' + vals
      //		var str = vals + '.html'
      console.log(vals.length);

      if (arr.length > 2) {
        $('.link').html($('<a>', {
          href: str,
          text: ("Choose scenario")
        }));
      } else {
        $('.link').html('');
      }
    })

    /* -- script for show hide divs -- */
    $(':radio').change(function(event) {
      var id = $(this).data('id');
      $('#' + id).removeClass('none');
    })

    /* -- animate divs -- */
    $(':radio').click(function(event) {
      var id = $(this).data('id');
      $('#' + id).slideDown();
    })

    /* -- script for tooltip -- */
    $(document).ready(function() {
      $('[data-toggle="tooltip"]').tooltip();
    })

  })
})(jQuery);
