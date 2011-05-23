$(document).ready(function(){

//// Simplify testing

var parser = new ode.Parser();

function parseStatement(input) {
  return parser.parseStatement(new ode.Lexer(input));
}

function parseProgram(input) {
  return parser.parse(new ode.Lexer(input));
}

var expected = "";
var actual = "";
function verify() {
  same(expected.toString(), actual.toString());
}

//// Actual tests
   
module("Unit - Parser");

test("operators", function() {
  actual = parseStatement(". +");
  expected =
    new ode.PhraseStatementNode([
      new ode.SymbolNode("."),
      new ode.SymbolNode("+")
    ]);
  
  verify();
});

test("lists", function() {
  actual = parseStatement("[] [. +]");
  expected = 
    new ode.PhraseStatementNode([
      new ode.ListNode([]),
      new ode.ListNode([
        new ode.SymbolNode("."),
        new ode.SymbolNode("+")
      ])
    ]);
    
  verify();
});

});