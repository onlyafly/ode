$(document).ready(function(){

//// Simplify testing

var expected = "";
var actual = "";

//// Actual tests
   
module("Unit - Interpreter");

/*
test("toString", function() {
  actual = symbolTable.toString();
  expected = "";
  same(actual,expected);
  
  symbolTable.set("foo", new ode.NativeDefinitionBody(function() {}));
  actual = symbolTable.toString();
  expected = "foo = <native definition>\n";
  same(actual,expected);
  
  symbolTable.set("+", new ode.NativeDefinitionBody(function() {}));
  actual = symbolTable.toString();
  expected = "foo = <native definition>\n+ = <native definition>\n";
  same(actual,expected);
  
  symbolTable.set("+", new ode.CustomDefinitionBody(new ode.PhraseStatementNode([new ode.NumberNode(42)])));
  actual = symbolTable.toString();
  expected = "foo = <native definition>\n+ = <native definition>\n+ = 42\n";
  same(actual,expected);
  
  ok(symbolTable.get("+") instanceof ode.CustomDefinitionBody);
  
  symbolTable.emptyCustomDefinitions();
  ok(symbolTable.get("+") instanceof ode.NativeDefinitionBody);
});
*/

});