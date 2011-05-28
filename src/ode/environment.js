/**
 * Represents the current execution environment.
 *
 * @constructor
 * @param {ode.RuntimeStack} stack The current runtime stack.
 * @param {ode.SymbolTable} symbolTable The symbol table.
 * @param {function(string)} print The function to use to display something to
 * the user.
 * @param {function(Array.<ode.NestableNode>,number=)} runNestableNodes
 * Execute an array of nestable nodes.
 * @param {function(number)} runCreateList Create a list out of the top n
 * nodes.
 */
ode.Environment = function(
  stack, 
  symbolTable, 
  print, 
  runNestableNodes,
  runCreateList) {

  // Functions
  this.print = print;
  this.runNestableNodes = runNestableNodes;
  this.runCreateList = runCreateList;

  /** @private */
  this.symbolTable_ = symbolTable;

  /** @private */
  this.frames_ = new ode.FrameStack();

  /** @private */
  this.stack_ = stack;

  // Setup frame stack
  this.frames_.push(stack);
};

/**
 * @param {string} name Name of the symbol to set.
 * @param {ode.AbstractDefinitionBody} def Definition of this symbol.
 */
ode.Environment.prototype.setSymbol = function(name, def) {
  this.symbolTable_.set(name, def);
};

/**
 * @param {string} name Name of the symbol to get.
 * @return {ode.AbstractDefinitionBody} def Definition of this symbol.
 */
ode.Environment.prototype.getSymbol = function(name) {
  return this.symbolTable_.get(name);
};

/**
 * @param {string} name Name of the symbol to drop.
 */
ode.Environment.prototype.dropSymbol = function(name) {
  this.symbolTable_.drop(name);
};

/**
 * Place a new frame on top of the stack.
 */
ode.Environment.prototype.enterFrame = function() {
  this.frames_.push(new ode.RuntimeStack());
  this.stack_ = this.frames_.top();
};

/**
 * Drop the frame on top of the stack.
 */
ode.Environment.prototype.exitFrame = function() {
  this.frames_.pop();
  this.stack_ = this.frames_.top();
};

/**
 * Drop all frames on top of the stack.
 */
ode.Environment.prototype.resetFrames = function() {
  this.frames_.dropAllChildFrames();
  this.stack_ = this.frames_.top();
};

/**
 * Get the array of nodes on the stack.
 *
 * @return {Array.<ode.NestableNode>} The array of nodes on top of the stack.
 */
ode.Environment.prototype.getStackNodes = function() {
  return this.stack_.getInternalArray();
};

/**
 * Set the array of nodes on the stack.
 *
 * @param {Array.<ode.NestableNode>} nodes The array of nodes.
 */
ode.Environment.prototype.setStackNodes = function(nodes) {
  this.stack_.setInternalArray(nodes);
};

/**
 * Get the top node, and remove it from the stack.
 *
 * @return {ode.NestableNode} The node on top of the stack.
 */
ode.Environment.prototype.pop = function() {
  return this.stack_.pop();
};

/**
 * Drop a particular node from the stack.
 *
 * @param {number} position The index of the node to drop.
 */
ode.Environment.prototype.drop = function(position) {
  this.stack_.drop(position);
};

/**
 * Duplicate a particular node from the stack and put it on top.
 *
 * @param {number} position The index of the node to duplicate.
 */
ode.Environment.prototype.duplicate = function(position) {
  this.stack_.duplicate(position);
};

/**
 * Move a particular node from the stack and put it on top.
 *
 * @param {number} position The index of the node to move.
 */
ode.Environment.prototype.moveToTop = function(position) {
  this.stack_.moveToTop(position);
};

/**
 * Puts a node on top of the stack.
 *
 * @param {ode.NestableNode} x The node to push on top of the stack.
 */
ode.Environment.prototype.push = function(x) {
  this.stack_.push(x);
};

/**
 * Empty the stack.
 */
ode.Environment.prototype.emptyStack = function() {
  this.stack_.empty();
};

/**
 * @param {string} operation The name of the operation.
 * @param {Array.<string>|string} expected The expected value on the stack.
 * @param {Array.<ode.Node>} actual The actual value on the stack.
 */
ode.Environment.prototype.expectationError = function(operation, expected,
  actual) {

  /** @type {Array.<string>|string} */
  var expectationString;
  if (extras.isArray(expected)) {
    expectationString = expected.join(',');
  } else {
    expectationString = expected;
  }

  var actualStringValues = extras.mapMethod(actual, 'toString');
  var actualString = actualStringValues.join(',');

  throw new ode.RuntimeException('Operation <' + operation + '> expected <' +
    expectationString + '> but got <' + actualString + '>');
};
