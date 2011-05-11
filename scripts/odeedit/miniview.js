var odeedit = odeedit || {};

odeedit.MiniView = function() {
  
  var controller, resultsTextBox, inputTextBox;
  
  this.setInputText = function(s) {
    inputTextBox.value = s;
  };
  
  this.setResultsText = function(s) {
    resultsTextBox.value = s;
  };
  
  this.appendResultsText = function(s) {
    resultsTextBox.value += s;
    resultsTextBox.scrollTop = resultsTextBox.scrollHeight -
      resultsTextBox.clientHeight;
  };  
  
  this.setEditorText = function(s) {
    // Nothing for the mini view
  };
  
  this.getEditorText = function() {
    // Nothing for the mini view
  };
  
  $('#shell-input').keypress(function(e) {
    if (e.which == 13 || e.which == 10) {
      controller.enter(e.target.value);
      controller.clearInput();
    }
  });

  $('#resetButton').click(function(e) {
    controller.resetMemoryAndStorage();
  });

  $('#clearButton').click(function(e) {
    controller.clearOutput();
  });

  $('#traceButton').click(function(e) {
    controller.toggleStackTracing();
  });

  $('#printNamesButton').click(function(e) {
    controller.printAllCustomDefinitions();
  });

  // For documentation
  odeedit.enter = function(s) {
    controller.enter(s);
  };
  
  // Initialize
  
  resultsTextBox = $('#shell-results')[0];
  inputTextBox = $('#shell-input')[0];
  controller = new odeedit.Controller(this);
  
  $('#version').html(controller.getVersion() + '<br />Author: ' + controller.getAuthor());
};

$(function() {
  var ode = new odeedit.MiniView();
});

