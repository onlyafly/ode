/**
 * @constructor
 * @param {string} type Name of this token type.
 * @param {string} repr Representation of this token as a string.
 * @param {*=} val The optional value of this token, if a literal.
 */
ode.Token = function(type, repr, val) {

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

  function isNumberContinue(c) {
    return (isNumeric(c) || extras.contains(['.'], c));
  }

  function isNumeric(c) {
    return extras.contains(extras.range('0', '9'), c);
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
            return getOperator(new ode.Token('openBlock', '['));
          case (']'):
            return getOperator(new ode.Token('closeBlock', ']'));
          case ('='):
            return getOperator(new ode.Token('equals', '='));
          case (';'):
            return getOperator(new ode.Token('semiColon', ';'));
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

    return new ode.Token('number', output, parseFloat(output));
  }

  function getName() {
    var output = '';

    while (pos < input.length && isNameContinue(input.charAt(pos))) {
      output += input.charAt(pos);
      pos += 1;
    }

    return new ode.Token('name', output);
  }

  function getOperator(token) {
    pos += 1;
    return token;
  }

};
