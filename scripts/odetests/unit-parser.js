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
      new ode.NameNode("."),
      new ode.NameNode("+")
    ]);
  
  verify();
});

test("blocks", function() {
  actual = parseStatement("[] [. +]");
  expected = 
    new ode.PhraseStatementNode([
      new ode.BlockNode([]),
      new ode.BlockNode([
        new ode.NameNode("."),
        new ode.NameNode("+")
      ])
    ]);
    
  verify();
});

});