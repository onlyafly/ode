$(function() {

  // Simplify testing

  var expected = "";
  var actual = "";
  function verify() {
    same(expected.toString(), actual.toString());
  }

  // Actual tests

  module("Unit - Nodes");

  test("atomic nodes", function() {
    var nameNode = new ode.SymbolNode("foo");
    actual = nameNode.toString();
    expected = "foo";
    verify();

    var numNode = new ode.NumberNode(36);
    actual = numNode.toString();
    expected = "36";
    verify();
  });

  test("definition nodes", function() {

    var d = new ode.DefinitionStatementNode(
      'foo',
      new ode.PhraseStatementNode([new ode.NumberNode(42)]));
    actual = d.toString();
    expected = "foo == 42;";
    verify();
    
  });

  test("inheritance heirarchy", function() {
    var num = new ode.NumberNode(42);
    var name = new ode.SymbolNode("dude");
    var list = new ode.ListNode([num, name]);
    var phrase = new ode.PhraseStatementNode([list]);
    var def = new ode.DefinitionStatementNode("test", phrase);
    var prog = new ode.ProgramNode([phrase, phrase, def]);

    ok(extras.hasInstances(ode.Node, num, name, list, phrase, def, prog));
    ok(extras.hasInstances(ode.AtomicNode, num, name));
    ok(extras.hasInstances(ode.NumberNode, num));
    ok(extras.hasInstances(ode.SymbolNode, name));
    ok(extras.hasInstances(ode.NestableNode, num, name, list));
    ok(extras.hasInstances(ode.ListNode, list));
    ok(extras.hasInstances(ode.StatementNode, phrase, def));
    ok(extras.hasInstances(ode.PhraseStatementNode, phrase));
    ok(extras.hasInstances(ode.DefinitionStatementNode, def));
    ok(extras.hasInstances(ode.ProgramNode, prog));
  });

});
