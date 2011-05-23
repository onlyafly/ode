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

    if (first && first.getType() === ode.TokenType.SYMBOL) {
      lexer.moveNext();
      var second = lexer.getCurrent();

      if (second && second.getType() === ode.TokenType.EQUALS) {
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

      if (first && first.getType() === ode.TokenType.SEMICOLON) {
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

    if (first && first.getType() === ode.TokenType.SYMBOL) {
      var symbolName = lexer.getCurrent().getRepr();
      lexer.moveNext();
      ensureAndSkip(lexer, ode.TokenType.EQUALS, '=');
      return new ode.DefinitionStatementNode(
        symbolName,
        parsePhraseStatement(lexer));
    } else {
      throw new ode.ParsingException('Unexpected token in definition: ' +
        lexer.getCurrent().getRepr());
    }
  }

  /**
   * @param {ode.Lexer} lexer The lexer.
   * @return {ode.NestableNode} The resulting node.
   */
  function parseNestableNode(lexer) {

    var first = lexer.getCurrent();

    if (first) {
      switch (first.getType()) {

        case ode.TokenType.OPEN_BLOCK:
        case ode.TokenType.OPEN_SET:
        case ode.TokenType.STRING:
          return parseAggregateNode(lexer);

        case ode.TokenType.SYMBOL:
        case ode.TokenType.NUMBER:
        case ode.TokenType.CHARACTER:
          return parseAtomicNode(lexer);

        case ode.TokenType.CLOSE_BLOCK:
        case ode.TokenType.CLOSE_SET:
          throw new ode.ParsingException('Unbalanced brackets');

        case ode.TokenType.SEMICOLON:
          throw new ode.ParsingException('Unexpected end of statement');

        case ode.TokenType.EQUALS:
          throw new ode.ParsingException(
            "Only a name can appear before '=' in a definition");
      }
    }

    throw new ode.ParsingException('Unexpected token: ' +
      lexer.getCurrent().getRepr());
  }

  /**
   * @param {ode.Lexer} lexer The lexer.
   * @return {ode.AggregateNode} The resulting node.
   */
  function parseAggregateNode(lexer) {

    var first = lexer.getCurrent();

    if (first) {
      switch (first.getType()) {

        case ode.TokenType.OPEN_BLOCK:
          return parseBlock(lexer);

        case ode.TokenType.OPEN_SET:
          return parseSet(lexer);

        case ode.TokenType.STRING:
          return parseString(lexer);
      }
    }

    throw new ode.ParsingException('Unexpected token: ' +
      lexer.getCurrent().getRepr());
  }

  /**
   * @param {ode.Lexer} lexer The lexer.
   * @return {ode.AtomicNode} The resulting node.
   */
  function parseAtomicNode(lexer) {

    var first = lexer.getCurrent();

    if (first) {
      switch (first.getType()) {

        case ode.TokenType.SYMBOL:
          return parseSymbolLike(lexer);

        case ode.TokenType.NUMBER:
          return new ode.NumberNode(lexer.getCurrent().getVal());

        case ode.TokenType.CHARACTER:
          return new ode.CharacterNode(lexer.getCurrent().getVal());
      }
    }

    throw new ode.ParsingException('Unexpected token: ' +
      lexer.getCurrent().getRepr());
  }


  function parseSymbolLike(lexer) {

    var token = lexer.getCurrent();

    if (token.getRepr() === 'true') {
      return new ode.BooleanNode(true);
    } else if (token.getRepr() === 'false') {
      return new ode.BooleanNode(false);
    } else {
      return new ode.SymbolNode(lexer.getCurrent().getRepr());
    }
  }

  function parseBlock(lexer) {

    lexer.moveNext();

    var nestableNodes = [];
    var continueParsingBlock = true;

    while (lexer.getCurrent() !== null && continueParsingBlock) {
      var first = lexer.getCurrent();

      if (first && first.getType() === ode.TokenType.CLOSE_BLOCK) {
        continueParsingBlock = false;
      } else {
        nestableNodes.push(parseNestableNode(lexer));
        lexer.moveNext();
      }
    }

    return new ode.BlockNode(nestableNodes);
  }

  function parseSet(lexer) {

    lexer.moveNext();

    var atomicNodes = [];
    var continueParsingBlock = true;

    while (lexer.getCurrent() !== null && continueParsingBlock) {
      var first = lexer.getCurrent();

      if (first && first.getType() === ode.TokenType.CLOSE_SET) {
        continueParsingBlock = false;
      } else {
        atomicNodes.push(parseAtomicNode(lexer));
        lexer.moveNext();
      }
    }

    return new ode.SetNode(atomicNodes);
  }

  function parseString(lexer) {

    /** @type {ode.Token} */
    var stringToken = lexer.getCurrent();

    return new ode.StringNode(stringToken.getVal());
  }

  /**
   * @param {ode.Lexer} lexer The lexer.
   * @param {ode.TokenType} expectedType The type of the token to expect.
   * @param {string} expectedRepr The expected representation.
   */
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
