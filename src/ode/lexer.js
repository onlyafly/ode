/**
 * Enum for token types.
 *
 * @enum {string}
 */
ode.TokenType = {
  OPEN_LIST: 'open list',
  CLOSE_LIST: 'close list',
  OPEN_SET: 'open set',
  CLOSE_SET: 'close set',
  STRING: 'string',
  SEMICOLON: 'semicolon',
  EQUALS: 'equals',
  SYMBOL: 'symbol',
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
 * @param {string} input Source code to process.
 */
ode.Lexer = function(input) {

  var scannedTokens = [];
  var currentTokenIndex = 0;
  var pos = 0;

  this.getInput = function() {
    return input;
  };

  /**
   * @return {ode.Token} The current token.
   */
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
  var LEGAL_NAME_SYMBOLS = [
    '+',
    '-',
    '.',
    '<',
    '>',
    '*',
    '/',
    '#',
    '?',
    '$',
    '!',
    '='];

  function isSymbolBegin(c) {
    return (extras.contains(extras.range('A', 'Z'), c) ||
      extras.contains(extras.range('a', 'z'), c) || extras.contains(
      LEGAL_NAME_SYMBOLS,
      c));
  }

  function isSymbolContinue(c) {
    return (isSymbolBegin(c) || isNumeric(c) || extras.contains(['='], c));
  }

  function isNumberBegin(c) {
    return (isNumeric(c));
  }

  function isNumeric(c) {
    return extras.contains(extras.range('0', '9'), c);
  }

  function isNumberContinue(c) {
    return (isNumeric(c) || extras.contains(['e', 'E', '.'], c));
  }

  function isCharacterBegin(c) {
    return c === "'";
  }

  function isStringBegin(c) {
    return c === '"';
  }

  function isStringEnd(c) {
    return c === '"';
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
          return getSymbol();
        }
      }

      if (c === '=') {
        if (input.charAt(pos + 1) === '=') {
          pos += 2;
          return new ode.Token(ode.TokenType.EQUALS, '==');
        } else {
          return getSymbol();
        }
      }

      else if (isCharacterBegin(c)) {
        return getCharacter();
      }

      else if (isStringBegin(c)) {
        return getString();
      }

      else if (isSymbolBegin(c)) {
        return getSymbol();
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
            return getOperator(new ode.Token(ode.TokenType.OPEN_LIST, '['));
          case (']'):
            return getOperator(new ode.Token(ode.TokenType.CLOSE_LIST, ']'));
          case ('{'):
            return getOperator(new ode.Token(ode.TokenType.OPEN_SET, '{'));
          case ('}'):
            return getOperator(new ode.Token(ode.TokenType.CLOSE_SET, '}'));
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

    pos++; // skip initial single quote

    output = input.charAt(pos);
    pos++;

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

  function getString() {
    var output = '';

    pos++; // skip the first double quote

    while (pos < input.length && !isStringEnd(input.charAt(pos))) {
      output += input.charAt(pos);
      pos += 1;
    }

    pos++; // skip the last double quote

    return new ode.Token(ode.TokenType.STRING, '"' + output + '"', output);
  }

  function getSymbol() {
    var output = '';

    while (pos < input.length && isSymbolContinue(input.charAt(pos))) {
      output += input.charAt(pos);
      pos += 1;
    }

    return new ode.Token(ode.TokenType.SYMBOL, output);
  }

  function getOperator(token) {
    pos += 1;
    return token;
  }

};
