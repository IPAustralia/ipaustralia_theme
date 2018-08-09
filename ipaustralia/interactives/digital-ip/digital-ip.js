(function($) {
$(window).load(function() {
  // $(document).ready(function() {
  $(".main-menu-wrapper").find("h3").replaceWith(function() {
    return this.innerHTML;
  });
  var menusArray = $('.sort-list').toArray();
  $.each(menusArray, function(_i, ol) {
    var liArray = $(ol).find('.menu-list-item').toArray();

    liArray.sort(function(a, b) {
      var textA = $(a).text().toLowerCase();
      var textB = $(b).text().toLowerCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    $.each(liArray, function(_i, li) {
      //$(ol).append($(li));
      $(ol).parent().find('.replace-sort-list').append($(li));
    });
  });
});
}); // end load
})(jQuery);
