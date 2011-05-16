/**
 * Enum for token types.
 * @enum {string}
 */
ode.TokenType = {
  OPEN_BLOCK: 'open block',
  CLOSE_BLOCK: 'close block',
  SEMICOLON: 'semicolon',
  EQUALS: 'equals',
  NAME: 'name',
  NUMBER: 'number',
  CHARACTER: 'character'
};

/**
 * @constructor
 * @param {ode.TokenType} type Type of this token.
 * @param {string} repr Representation of this token as a string.
 * @param {*=} val The optional value of this token, if a literal.
 */
ode.Token = function(type, repr, val) {

  /**
   * @return {ode.TokenType} The type of this node.
   */
  this.getType = function() {
    return type;
  };

  this.getRepr = function() {
    return repr;
  };

  this.getVal = function() {
    return val;
  };

  this.toString = function() {
    return 'Token<' + type + ',' + repr + ',' + val + '>';
  };

};

/**
 * @constructor
 * @param {string} input Source code to lex.
 */
ode.Lexer = function(input) {

  var scannedTokens = [];
  var currentTokenIndex = 0;
  var pos = 0;

  this.getInput = function() {
    return input;
  };

  this.getCurrent = function() {
    if (currentTokenIndex >= scannedTokens.length) {
      scannedTokens.push(getNext());
    }

    return scannedTokens[currentTokenIndex];
  };

  // Support for backtracking
  this.movePrev = function() {
    currentTokenIndex -= 1;
  };

  this.moveNext = function() {
    currentTokenIndex += 1;
  };

  // Character recognizing predicates

  /**
   * @const
   * @type {Array.<string>}
   */
  var LEGAL_NAME_SYMBOLS = ['+', '-', '.', '<', '>', '*', '/', '#', '?', '$'];

  function isNameBegin(c) {
    return (extras.contains(extras.range('A', 'Z'), c) ||
      extras.contains(extras.range('a', 'z'), c) || extras.contains(
      LEGAL_NAME_SYMBOLS,
      c));
  }

  function isNameContinue(c) {
    return (isNameBegin(c) || isNumeric(c) || extras.contains(['='], c));
  }

  function isNumberBegin(c) {
    return (isNumeric(c));
  }

  function isNumeric(c) {
    return extras.contains(extras.range('0', '9'), c);
  }
  
  function isNumberContinue(c) {
    return (isNumeric(c) || extras.contains(['.'], c));
  }

  function isCharacterBegin(c) {
    return c === "'";
  }
  
  function isCharacterContinue(c) {
    return !isWhitespace(c);
  }

  function isWhitespace(c) {
    return extras.contains([' ', '\t', '\n'], c);
  }

  function getNext() {

    // More data in input buffer
    if (pos < input.length) {

      var c = input.charAt(pos);

      if (c === '-') {
        if (isNumberBegin(input.charAt(pos + 1))) {
          return getNumber();
        } else {
          return getName();
        }
      }

      else if (isCharacterBegin(c)) {
        return getCharacter();
      }
      
      else if (isNameBegin(c)) {
        return getName();
      }

      else if (isNumberBegin(c)) {
        return getNumber();
      }

      else if (isWhitespace(c)) {
        pos += 1;
        return getNext();
      }

      else {
        switch (c) {
          case ('['):
            return getOperator(new ode.Token(ode.TokenType.OPEN_BLOCK, '['));
          case (']'):
            return getOperator(new ode.Token(ode.TokenType.CLOSE_BLOCK, ']'));
          case ('='):
            return getOperator(new ode.Token(ode.TokenType.EQUALS, '='));
          case (';'):
            return getOperator(new ode.Token(ode.TokenType.SEMICOLON, ';'));
          default:
            throw new ode.LexingException(c);
        }
      }
    }

    // Input buffer is empty
    else {
      return null;
    }

  }

  function getCharacter() {
    var output = '';

    pos++;

    while (pos < input.length && isCharacterContinue(input.charAt(pos))) {
      output += input.charAt(pos);
      pos += 1;
    }

    return new ode.Token(ode.TokenType.CHARACTER, "'" + output, output);
  }
  
  function getNumber() {
    var output = '';

    if (input.charAt(pos) === '-') {
      output += '-';
      pos += 1;
    }

    while (pos < input.length && isNumberContinue(input.charAt(pos))) {
      output += input.charAt(pos);
      pos += 1;
    }

    return new ode.Token(ode.TokenType.NUMBER, output, parseFloat(output));
  }

  function getName() {
    var output = '';

    while (pos < input.length && isNameContinue(input.charAt(pos))) {
      output += input.charAt(pos);
      pos += 1;
    }

    return new ode.Token(ode.TokenType.NAME, output);
  }

  function getOperator(token) {
    pos += 1;
    return token;
  }

};
