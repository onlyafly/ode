$(document).ready(function(){

//// Simplify testing

var expected = "";
var actual = "";

//// Actual tests
   
module("Unit - SymbolTable");

test("toString", function() {
  
  var symbolTable = new ode.SymbolTable();
  
  actual = symbolTable.toString();
  expected = "";
  same(actual,expected);
  
  symbolTable.set("foo", new ode.NativeDefinitionBody(function() {}));
  actual = symbolTable.toString();
  expected = "foo == <native definition>;\n";
  same(actual,expected);
  
  symbolTable.set("+", new ode.NativeDefinitionBody(function() {}));
  actual = symbolTable.toString();
  expected = "foo == <native definition>;\n+ == <native definition>;\n";
  same(actual,expected);
  
  symbolTable.set("+", new ode.CustomDefinitionBody(new ode.PhraseStatementNode([new ode.NumberNode(42)])));
  actual = symbolTable.toString();
  expected = "foo == <native definition>;\n+ == <native definition>;\n+ == 42;\n";
  same(actual,expected);
  
  ok(symbolTable.get("+") instanceof ode.CustomDefinitionBody);
  
  symbolTable.emptyCustomDefinitions();
  ok(symbolTable.get("+") instanceof ode.NativeDefinitionBody);
});

test("stringifyCustomDefinitions", function() {
  
  var symbolTable = new ode.SymbolTable();
  
  actual = symbolTable.stringifyCustomDefinitions();
  expected = "";
  same(
    actual,
    expected, 
    'Symbol table should start off with no custom definitions');
  
  symbolTable.set("foo", new ode.NativeDefinitionBody(function() {}));
  actual = symbolTable.stringifyCustomDefinitions();
  expected = "";
  same(
    actual,
    expected,
    'Native definitions should not be stringified');
  
  symbolTable.set("+", new ode.CustomDefinitionBody(new ode.PhraseStatementNode([new ode.NumberNode(42)])));
  actual = symbolTable.stringifyCustomDefinitions();
  expected = "+ == 42;";
  same(actual,expected, 'Custom definitions should be stringified');
  
  ok(symbolTable.get("+") instanceof ode.CustomDefinitionBody);
  
  symbolTable.emptyCustomDefinitions();
  
  ok(symbolTable.get("+") === undefined);
});

});