//////// JQUERY EVENTS

$(function() {

  hideAllSections();
  showSection($('#nav a.initial-item'));

  $('.code').addClass('not-hovering');

  $('.code').click(function() {
    var thisText = $(this).text();
    odeedit.enter(thisText);
  });

  $('.code').hover(
    function() {
      $(this).removeClass('not-hovering');
      $(this).addClass('hovering');
    },
    function() {
      $(this).addClass('not-hovering');
      $(this).removeClass('hovering');
    }
  );

  $("#nav a[href^='#']").click(function() {
    showSection($(this));
    return false;
  });

  function showSection(navItem) {
    var sectionToDisplay = navItem.attr('href');
    hideAllSections();
    $(sectionToDisplay).show();
    navItem.addClass('selected');
  }

  function hideAllSections() {
    $('div#sections > div').hide();
    $('#nav a').removeClass('selected');
  }

});
