$(document).ready(function(){

//// Simplify testing

var symbolTable = new ode.SymbolTable();

var expected = "";
var actual = "";

//// Actual tests
   
module("Unit - SymbolTable");

test("toString", function() {
  actual = symbolTable.toString();
  expected = "";
  same(actual,expected);
  
  symbolTable.set("foo", new ode.NativeDefinitionBody(function() {}));
  actual = symbolTable.toString();
  expected = "foo = <native definition>;\n";
  same(actual,expected);
  
  symbolTable.set("+", new ode.NativeDefinitionBody(function() {}));
  actual = symbolTable.toString();
  expected = "foo = <native definition>;\n+ = <native definition>;\n";
  same(actual,expected);
  
  symbolTable.set("+", new ode.CustomDefinitionBody(new ode.PhraseStatementNode([new ode.NumberNode(42)])));
  actual = symbolTable.toString();
  expected = "foo = <native definition>;\n+ = <native definition>;\n+ = 42;\n";
  same(actual,expected);
  
  ok(symbolTable.get("+") instanceof ode.CustomDefinitionBody);
  
  symbolTable.emptyCustomDefinitions();
  ok(symbolTable.get("+") instanceof ode.NativeDefinitionBody);
});

test("stringifyCustomDefinitions", function() {
  actual = symbolTable.stringifyCustomDefinitions();
  expected = "";
  same(actual,expected);
  
  symbolTable.set("foo", new ode.NativeDefinitionBody(function() {}));
  actual = symbolTable.stringifyCustomDefinitions();
  expected = "";
  same(actual,expected,'Native definitions should not be displayed');
  
  symbolTable.set("+", new ode.CustomDefinitionBody(new ode.PhraseStatementNode([new ode.NumberNode(42)])));
  actual = symbolTable.stringifyCustomDefinitions();
  expected = "+ = 42;";
  same(actual,expected);
  
  ok(symbolTable.get("+") instanceof ode.CustomDefinitionBody);
  
  symbolTable.emptyCustomDefinitions();
  
  ok(symbolTable.get("+") instanceof ode.NativeDefinitionBody);
});

});