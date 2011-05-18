var Is = {};

$(function(){

var result = '';
var errors = '';
var stack = new ode.RuntimeStack();
var symbolTable = new ode.SymbolTable();
var controller = new ode.Controller(
  function(s) { result += s; },
  function(e) { errors += e; }, 
  stack, 
  symbolTable);

Is.clearResult = function() {
  result = '';
};

Is.stack = function(input, stackOutput, retainState) {
  controller.exec(input);
  
  if (errors.length !== 0) {
    ok(false, errors);
    errors = '';
  } else {
    same(stack.toString(), stackOutput);
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

Is.output = function(input, output, retainState) {
  controller.exec(input);
  
  if (errors.length !== 0) {
    ok(false, errors);
    errors = '';
  } else {
    same(result, output);
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

Is.exception = function(input, exception, retainState) {
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
      ok(false, "No type specified for expected exception in: <" + input + ">");
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