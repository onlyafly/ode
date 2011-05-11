var odeedit = odeedit || {};

/**
 * @constructor
 * @param {odeedit.FullView} view The view.
 */
odeedit.Controller = function(view) {

  this.enter = function(s) {
    appendToResults('> ' + s + '\n');
    controller.exec(s);
    storeMemory();

    if (isDisplayingStackTrace) {
      displayStackTrace();
    }
  };

  this.enterEditor = function(s) {
    appendToResults('(Executed editor contents)\n');
    controller.exec(s);
    storeMemory();

    if (isDisplayingStackTrace) {
      displayStackTrace();
    }
  };

  this.printAllCustomDefinitions = function() {
    appendWithNewLine('Currently defined names:');
    appendWithNewLine('  ' + controller.stringifyCustomDefinitions('\n  '));
  };

  this.toggleStackTracing = function() {
    isDisplayingStackTrace = !(isDisplayingStackTrace);
    if (isDisplayingStackTrace) {
      appendWithNewLine('Stack tracing enabled');
      displayStackTrace();
    } else {
      appendWithNewLine('Stack tracing disabled');
    }
  };

  this.clearInput = function() {
    view.setInputText('');
  };

  this.clearOutput = function() {
    view.setResultsText('');
  };

  this.resetMemoryAndStorage = function() {
    appendWithNewLine('Memory reset');
    resetMemory();

    // Erase local storage
    setStorage("s", "");
    setStorage("n", "");
  };

  this.getAuthor = function() {
    return controller.getAuthorInfo();
  };

  this.getVersion = function() {
    return controller.getVersionInfo();
  };

  this.saveBufferClick = function() {
    var bufferName = view.getSelectedBufferName();
    if (bufferName) {
      var text = view.getEditorText();
      saveEditorToStorage(bufferName, text);
    }
  };
  
  this.saveBufferAsClick = function() {
    var bufferName = view.getFileNameText();
    var text = view.getEditorText();
    saveEditorToStorage(bufferName, text);
  };
  
  this.deleteBufferClick = function() {
    var bufferName = view.getSelectedBufferName();
    deleteBuffer(bufferName);
  };
  
  this.loadBufferClick = function() {
    var bufferName = view.getSelectedBufferName();
    if (bufferName) {
      loadEditorFromStorage(bufferName);
    }    
  };

  function displayStackTrace() {
    appendToResults('Stack: ' + controller.stringifyStack() + '\n');
  }

  function appendToResults(s) {
    view.appendResultsText(s);
  }

  function appendWithNewLine(s) {
    view.appendResultsText(s + '\n');
  }

  function initStorage() {
    if (!getStorage("s")) {
      setStorage("s", "");
    }
    if (!getStorage("n")) {
      setStorage("n", "");
    }
    if (!getStorage("editorBuffer")) {
      setStorage("editorBuffer", "");
    }
    if (!getStorage("bufferList")) {
      setStorage("bufferList", JSON.stringify(bufferList));
    }
  }

  function storeMemory() {
    initStorage();

    var s = controller.stringifyStack();
    setStorage("s", s);

    var n = controller.stringifyCustomDefinitions();
    setStorage("n", n);
  }

  function loadMemory() {
    resetMemory();

    initStorage();

    var s = getStorage("s");
    controller.exec(s);

    var n = getStorage("n");
    controller.exec(n);
  }

  function resetMemory() {
    // Drop stack, drop custom names
    controller.emptyStack();
    controller.emptyCustomDefinitions();
  }

  function setStorage(key, val) {
    if (Modernizr.localstorage) {
      window.localStorage[key] = val;
    }
  }

  function getStorage(key) {
    if (Modernizr.localstorage) {
      return window.localStorage[key];
    }
  }
  
  function removeStorage(key) {
    if (Modernizr.localstorage) {
      window.localStorage.removeItem(key);
    }
  }

  function deleteBuffer(bufferName) {
    bufferList = extras.withoutElement(bufferList, bufferName);
    removeStorage("buffer," + bufferName);
    saveBufferListToStorage();
    refreshBufferNameList();
  }
  
  function loadEditorFromStorage(bufferName) {
    if (view.hasEditor) {
      view.setEditorText(getStorage("buffer," + bufferName));
    }
  }

  function saveEditorToStorage(bufferName, text) {
    if (view.hasEditor) {
      setStorage("buffer," + bufferName, text);
      if (!extras.contains(bufferList, bufferName)) {
        bufferList.push(bufferName);
      }      
      saveBufferListToStorage();
      refreshBufferNameList();
      view.setSelectedBufferName(bufferName);
      view.setFileNameText('');
    }
  }
  
  function loadBufferListFromStorage() {
    if (view.hasEditor) {
      var bufferListJson = getStorage('bufferList');
      bufferList = JSON.parse(bufferListJson);
    }
  }
  
  function saveBufferListToStorage() {
    if (view.hasEditor) {
      var bufferListJson = JSON.stringify(bufferList);
      setStorage('bufferList', bufferListJson);
    }
  }
  
  function refreshBufferNameList() {
    if (view.hasEditor) {
      view.setBufferNameList(bufferList);
    }
  }

  // Initialize

  var controller = new ode.Controller(appendWithNewLine);
  var isDisplayingStackTrace = false;
  var bufferList = [];

  initStorage();
  loadBufferListFromStorage();
  refreshBufferNameList();
  loadMemory();
  this.clearInput();
  this.clearOutput();
};
