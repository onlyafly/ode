/**
 * @constructor
 * @param {function(string)} otherOutputFun Function used to print results.
 * @param {function(string)=} otherErrorFun Function used to print error
 * messages.
 * @param {ode.RuntimeStack=} otherStack Optional top-level runtime stack.
 * @param {ode.SymbolTable=} otherSymbolTable Optional symbol table.
 * @param {ode.Parser=} otherParser Optional parser.
 * @param {ode.Interpreter=} otherInterpreter Optional interpreter.
 */
ode.Controller = function(otherOutputFun, otherErrorFun, otherStack,
  otherSymbolTable, otherParser, otherInterpreter) {

  this.outputFun = otherOutputFun;
  this.errorFun = otherErrorFun || otherOutputFun;
  this.stack = otherStack || new ode.RuntimeStack();
  this.symbolTable = otherSymbolTable || new ode.SymbolTable();
  this.parser = otherParser || new ode.Parser();
  this.interpreter = otherInterpreter ||
    new ode.Interpreter(this.stack, this.symbolTable, this.outputFun);

  ode.joynatives.initialize(this.interpreter);
};

/**
 * @param {string} input Source code of Ode program to execute.
 */
ode.Controller.prototype.exec = function(input) {
  try {
    this.execNoErrorHandling(input);
  } catch (e) {
    if (e instanceof ode.LexingException) {
      this.errorFun('Lexing error: ' + e.toString());
    } else if (e instanceof ode.ParsingException) {
      this.errorFun('Parsing error: ' + e.toString());
    } else if (e instanceof ode.RuntimeException) {
      this.errorFun('Runtime error: ' + e.toString());
    } else if (e instanceof ode.TailCallbackException) {
      this.errorFun("Runtime error: 'self' used outside of definition");
    } else {
      var err = 'Error';

      if (e instanceof Error) {
        err = 'JavaScript Error';

        if ((typeof e.name !== 'undefined') && (e.name.length > 0)) {
          err += '\n  Name: ' + e.name;
        }
        if ((typeof e.message !== 'undefined') && (e.message.length > 0)) {
          err += '\n  Message: ' + e.message;
        }
        if ((typeof e.description !== 'undefined') &&
          (e.description.length > 0)) {
          err += '\n  Description: ' + e.description;
        }
        if ((typeof e.number !== 'undefined') && (e.number.length > 0)) {
          err += '\n  Error Number: ' + e.number;
        }
      } else {
        err = 'Unrecognized Error:' + e.toString();
      }

      this.errorFun(err);
    }
  }
};

/**
 * @param {string} input Source code of Ode program to execute.
 */
ode.Controller.prototype.execNoErrorHandling = function(input) {
  var lexer = new ode.Lexer(input);
  var parsedCode = this.parser.parse(lexer);
  this.interpreter.run(parsedCode);
};

/**
 * Empties the stack.
 */
ode.Controller.prototype.emptyStack = function() {
  this.stack.empty();
};

/**
 * Empties the custom definitions.
 */
ode.Controller.prototype.emptyCustomDefinitions = function() {
  this.symbolTable.emptyCustomDefinitions();
};

/**
 * @return {string} The stack as a parsable string.
 */
ode.Controller.prototype.stringifyStack = function() {
  return this.stack.toString();
};

/**
 * @param {string=} separator Optional separator.
 * @return {string} The custom definitions as a parsable string.
 */
ode.Controller.prototype.stringifyCustomDefinitions = function(separator) {
  return this.symbolTable.stringifyCustomDefinitions(separator || ' ');
};

/**
 * @return {string} The author's name.
 */
ode.Controller.prototype.getAuthorInfo = function() {
  return 'Kevin P. Albrecht';
};

/**
 * @return {string} The current version information.
 */
ode.Controller.prototype.getVersionInfo = function() {
  return 'Ode v0.4.1dev';
};
