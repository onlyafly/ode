var odeedit = odeedit || {};

odeedit.FullView = function() {

  var controller, resultsTextBox, inputTextBox, editorTextBox;

  this.hasEditor = true;

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
    editorTextBox.value = s;
  };

  this.getEditorText = function() {
    return editorTextBox.value;
  };

  this.getFileNameText = function() {
    return $('#fileNameTextBox')[0].value;
  };

  this.setBufferNameList = function(bufferNames) {
    var $list = $('#bufferNameList');
    $list.html('');

    extras.each(bufferNames, function(bufferName) {
      $list.append('<option value="' + bufferName + '">' + bufferName +
        '</option>');
    });
  };

  this.getSelectedBufferName = function() {
    var list = $('#bufferNameList')[0];
    if (list.options.length > 0) {
      return list.options[list.selectedIndex].value;
    } else {
      return null;
    }
  };

  this.setSelectedBufferName = function(name) {
    var list = $('#bufferNameList')[0];
    for ( var i = 0; i < list.length; i++) {
      if (list.options[i].value === name) {
        list.selectedIndex = i;
        break;
      }
    }
  };

  this.setFileNameText = function(s) {
    $('#fileNameTextBox')[0].value = s;
  };

  $('#shell-input').keypress(function(e) {
    if (e.which == 13 || e.which == 10) {
      controller.enter(e.target.value);
      controller.clearInput();
    }
  });

  $('#dev-editor').keydown(function(e) {
    checkTab(e, e.target, e.which);
  });

  function checkTab(evt, t, code) {
    var tab = '  ';
    var ss = t.selectionStart;
    var se = t.selectionEnd;

    // Tab key - insert tab expansion
    if (code == 9) {
      evt.preventDefault();

      // Special case of multi line selection
      if (ss != se && t.value.slice(ss, se).indexOf("\n") != -1) {
        // In case selection was not of entire lines (e.g. selection begins in
        // the middle of a line)
        // we ought to tab at the beginning as well as at the start of every
        // following line.
        var pre = t.value.slice(0, ss);
        var sel = t.value.slice(ss, se).replace(/\n/g, "\n" + tab);
        var post = t.value.slice(se, t.value.length);
        t.value = pre.concat(tab).concat(sel).concat(post);

        t.selectionStart = ss + tab.length;
        t.selectionEnd = se + tab.length;
      }

      // "Normal" case (no selection or selection on one line only)
      else {
        t.value = t.value.slice(0, ss).concat(tab).concat(
          t.value.slice(ss, t.value.length));
        if (ss == se) {
          t.selectionStart = t.selectionEnd = ss + tab.length;
        } else {
          t.selectionStart = ss + tab.length;
          t.selectionEnd = se + tab.length;
        }
      }
    }

    // Backspace key - delete preceding tab expansion, if exists
    else if (code == 8 && t.value.slice(ss - tab.length, ss) == tab) {
      evt.preventDefault();

      t.value = t.value.slice(0, ss - tab.length).concat(
        t.value.slice(ss, t.value.length));
      t.selectionStart = t.selectionEnd = ss - tab.length;
    }

    // Delete key - delete following tab expansion, if exists
    else if (code == 46 && t.value.slice(se, se + tab.length) == tab) {
      evt.preventDefault();

      t.value = t.value.slice(0, ss).concat(
        t.value.slice(ss + tab.length, t.value.length));
      t.selectionStart = t.selectionEnd = ss;
    }
    // Left/right arrow keys - move across the tab in one go
    else if (code == 37 && t.value.slice(ss - tab.length, ss) == tab) {
      evt.preventDefault();
      t.selectionStart = t.selectionEnd = ss - tab.length;
    } else if (evt.keyCode == 39 && t.value.slice(ss, ss + tab.length) == tab) {
      evt.preventDefault();
      t.selectionStart = t.selectionEnd = ss + tab.length;
    }
  }

  $('#execEditorButton').click(function(e) {
    controller.enterEditor($('#dev-editor')[0].value);
  });

  $('#saveBufferButton').click(function(e) {
    controller.saveBufferClick();
  });

  $('#saveBufferAsButton').click(function(e) {
    controller.saveBufferAsClick();
  });

  $('#loadBufferButton').click(function(e) {
    controller.loadBufferClick();
  });

  $('#deleteBufferButton').click(function(e) {
    controller.deleteBufferClick();
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

  resultsTextBox = $('#dev-results')[0];
  inputTextBox = $('#shell-input')[0];
  editorTextBox = $('#dev-editor')[0];
  controller = new odeedit.Controller(this);

  $('#version').html(
    controller.getVersion() + '<br />Author: ' + controller.getAuthor());
};

$(function() {
  var ode = new odeedit.FullView();
});
