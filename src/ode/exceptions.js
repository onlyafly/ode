/**
 * @constructor
 * @param {string} unexpectedCharacter The character that is unexpected.
 */
ode.LexingException = function(unexpectedCharacter) {
  this.toString = function() {
    return 'Unexpected character <' + unexpectedCharacter + '> with code ' +
      unexpectedCharacter.charCodeAt(0);
  };
};

/**
 * @constructor
 * @param {string} message The message to display.
 */
ode.ParsingException = function(message) {
  this.toString = function() {
    return message;
  };
};

/**
 * @constructor
 * @param {string} message The message to display.
 */
ode.RuntimeException = function(message) {
  this.toString = function() {
    return message;
  };
};

/**
 * @constructor
 * @extends {ode.RuntimeException}
 * @param {string} fromType Name of type attempting to convert from.
 * @param {string} toType Name of type attempting to convert to.
 * @param {*} value Value trying to convert.
 */
ode.RuntimeConversionException = function(fromType, toType, value) {
  var message = 'Cannot convert ' + value.toString() + ' from ' + fromType +
    ' to ' + toType;
  extras.base(this, message);
};
extras.inherits(ode.RuntimeConversionException, ode.RuntimeException);

/**
 * @constructor
 * @extends {ode.RuntimeException}
 * @param {string} message The message to display.
 */
ode.RuntimeStackException = function(message) {
  extras.base(this, message);
};
extras.inherits(ode.RuntimeStackException, ode.RuntimeException);

/**
 * @constructor
 * @extends {ode.RuntimeException}
 */
ode.RuntimeCustomException = function() {
  var message = 'Custom exception thrown by program';
  extras.base(this, message);
};
extras.inherits(ode.RuntimeCustomException, ode.RuntimeException);

/**
 * @constructor
 */
ode.TailCallbackException = function() {
  this.toString = function() {
    return 'Tail callback exception';
  };
};
