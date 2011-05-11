//////// FTEST NAMESPACE

var FT = {};

$(function(){

var result = '';
var stack = new ode.RuntimeStack();
var symbolTable = new ode.SymbolTable();
var controller = new ode.Controller(function(s) { result += s; }, stack, symbolTable);

FT.clearResult = function() {
  result = '';
};

FT.check = function(input, output, retainState) {
  controller.exec(input);
  same(result, output);
  
  if (retainState) {
    // nothing
  }
  else {
    result = '';
    stack.empty();
    symbolTable.emptyCustomDefinitions();
  }
};

// Run ode for its side effect
FT.checkException = function(input, exception, retainState) {
  try {
    controller.execNoErrorHandling(input);
    ok(false, "No expected exception occured in: <" + input + ">");
  }
  catch(e) {
    if (exception) {
      if (e instanceof exception) {
        ok(true, "Expected exception type caught in: <" + input + ">");
      } else {
        ok(false, "Expected exception type did not occur in: <" + input + ">");
        throw e;
      }
    } else {
      ok(true, "An expected exception caught in: <" + input + ">");
    }  
  }
  
  if (retainState) {
    // nothing
  }
  else {
    result = '';
    stack.empty();
    symbolTable.emptyCustomDefinitions();
  }
};

});