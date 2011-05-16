$(function(){

//// Simplify testing

var stack = new ode.RuntimeStack();
var symbolTable = new ode.SymbolTable();
var parser = new ode.Parser();

var output = "";
var outputFun = function(s) {
  output += s;
};

var interpreter = new ode.Interpreter(stack, symbolTable, outputFun);

var controller = new ode.Controller(outputFun, outputFun, stack, symbolTable, parser, interpreter);

var expected = "";
var actual = "";
function validate() {
  same(actual,expected);
}

function reset() {
  stack.empty();
}

//// Actual tests
   
module("Unit - Controller");

test("stringifyStack", function() {
  
  stack.push(new ode.NumberNode(5));
  stack.push(new ode.NumberNode(6));
  stack.push(new ode.NumberNode(7));
  
  actual = controller.stringifyStack();
  expected = "5 6 7";
  validate();
  
  stack.push(new ode.BlockNode([new ode.NumberNode(5), new ode.NameNode("dude")]));
  
  actual = controller.stringifyStack();
  expected = "5 6 7 [5 dude]";
  validate();
  
  reset();
});

test("stringifyCustomDefinitions", function() {
  
  symbolTable.set('dude', new ode.CustomDefinitionBody(
    new ode.PhraseStatementNode([
      new ode.NumberNode(5),
      new ode.NumberNode(6),
      new ode.NumberNode(7)])));
  
  actual = controller.stringifyCustomDefinitions();
  expected = "dude = 5 6 7;";
  validate();
  
  symbolTable.set('<', new ode.CustomDefinitionBody(
    new ode.PhraseStatementNode([
      new ode.NumberNode(9),
      new ode.NumberNode(9),
      new ode.NumberNode(9)])));
  
  actual = controller.stringifyCustomDefinitions();
  expected = "dude = 5 6 7; < = 9 9 9;";
  validate();
  
  reset();
});

});