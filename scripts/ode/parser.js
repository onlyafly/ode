/**
 * @constructor
 */
ode.Parser = function() {

  this.parse = function(lexer) {

    var statements = [];

    while (lexer.getCurrent() !== null) {
      statements.push(this.parseStatement(lexer));
    }

    return (new ode.ProgramNode(statements));
  };

  this.parseStatement = function(lexer) {

    var first = lexer.getCurrent();

    if (first && first.getType() === 'name') {
      lexer.moveNext();
      var second = lexer.getCurrent();

      if (second && second.getType() === 'equals') {
        lexer.movePrev();
        return parseDefinitionStatement(lexer);
      } else {
        lexer.movePrev();
        return parsePhraseStatement(lexer);
      }
    } else {
      return parsePhraseStatement(lexer);
    }

  };

  function parsePhraseStatement(lexer) {
    var nestableNodes = [];
    var shouldContinuePhrase = true;

    while (lexer.getCurrent() !== null && shouldContinuePhrase) {

      var first = lexer.getCurrent();

      if (first && first.getType() === 'semiColon') {
        lexer.moveNext();
        shouldContinuePhrase = false;
      } else {
        nestableNodes.push(parseNestableNode(lexer));
        lexer.moveNext();
      }
    }

    return new ode.PhraseStatementNode(nestableNodes);
  }

  function parseDefinitionStatement(lexer) {

    var first = lexer.getCurrent();

    if (first && first.getType() === 'name') {
      var definitionName = lexer.getCurrent().getRepr();
      lexer.moveNext();
      ensureAndSkip(lexer, 'equals', '=');
      return new ode.DefinitionStatementNode(
        definitionName,
        parsePhraseStatement(lexer));
    } else {
      throw new ode.ParsingException('Unexpected token in definition: ' +
        lexer.getCurrent().getRepr());
    }
  }

  /**
   * @param {ode.Lexer} lexer The lexer.
   * @return {ode.AtomicNode} The resulting node.
   */
  function parseNestableNode(lexer) {

    var first = lexer.getCurrent();

    if (first && first.getType() === 'openBlock') {
      return parseBlock(lexer);
    } else if (first && first.getType() === 'name') {
      return new ode.NameNode(lexer.getCurrent().getRepr());
    } else if (first && first.getType() === 'number') {
      return new ode.NumberNode(lexer.getCurrent().getVal());
    } else if (first && first.getType() === 'closeBlock') {
      throw new ode.ParsingException('Unbalanced brackets');
    } else if (first && first.getType() === 'semiColon') {
      throw new ode.ParsingException('Unexpected end of statement');
    } else if (first && first.getType() === 'equals') {
      throw new ode.ParsingException(
        "Only a name can appear before '=' in a definition");
    } else {
      throw new ode.ParsingException('Unexpected token: ' +
        lexer.getCurrent().getRepr());
    }

  }

  function parseBlock(lexer) {

    lexer.moveNext();

    var nestableNodes = [];
    var continueParsingBlock = true;

    while (lexer.getCurrent() !== null && continueParsingBlock) {
      var first = lexer.getCurrent();

      if (first && first.getType() === 'closeBlock') {
        continueParsingBlock = false;
      } else {
        nestableNodes.push(parseNestableNode(lexer));
        lexer.moveNext();
      }
    }

    return new ode.BlockNode(nestableNodes);
  }

  function ensureAndSkip(lexer, expectedType, expectedRepr) {

    var first = lexer.getCurrent();

    if (first && first.getType() === expectedType) {
      lexer.moveNext();
    } else {
      throw new ode.ParsingException('Unexpected token. Expected: ' +
        expectedRepr + '; Actual: ' + lexer.getCurrent().getRepr());
    }

  }

};
