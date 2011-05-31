//////// JQUERY EVENTS

$(function() {

  $('code').addClass('not-hovering');

  $('code').click(function() {
    var thisText = $(this).text();
    odeedit.enter(thisText);
  });

  $('code').hover(
    function() {
      $(this).removeClass('not-hovering');
      $(this).addClass('hovering');
    },
    function() {
      $(this).addClass('not-hovering');
      $(this).removeClass('hovering');
    }
  );

});
