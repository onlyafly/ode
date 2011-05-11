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
 * @param {function(number)} runCreateBlock Create a block out of the top n
 * nodes.
 */
ode.Environment = function(stack, symbolTable, print, runNestableNodes,
  runCreateBlock) {
  this.stack = stack;
  this.symbolTable = symbolTable;
  this.print = print;
  this.runNestableNodes = runNestableNodes;
  this.runCreateBlock = runCreateBlock;

  // Setup frame stack
  this.frames = new ode.FrameStack();
  this.frames.push(this.stack);
};

/**
 * Place a new frame on top of the stack.
 */
ode.Environment.prototype.enterFrame = function() {
  this.frames.push(new ode.RuntimeStack());
  this.stack = this.frames.top();
};

/**
 * Drop the frame on top of the stack.
 */
ode.Environment.prototype.exitFrame = function() {
  this.frames.pop();
  this.stack = this.frames.top();
};

/**
 * Drop all frames on top of the stack.
 */
ode.Environment.prototype.resetFrames = function() {
  this.frames.dropAllChildFrames();
  this.stack = this.frames.top();
};

/**
 * Get the array of nodes on the stack.
 *
 * @return {Array.<ode.NestableNode>} The array of nodes on top of the stack.
 */
ode.Environment.prototype.getStackNodes = function() {
  return this.stack.getInternalArray();
};

/**
 * @param {string} operation The name of the operation.
 * @param {string} expected The expected value on the stack.
 * @param {string} actual The actual value on the stack.
 */
ode.Environment.prototype.parameterError = function(operation, expected,
  actual) {
  throw new ode.RuntimeException('Operation <' + operation + '> expected <' +
    expected + '> but got <' + actual + '>');
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

/**
 * @constructor
 * @param {ode.RuntimeStack} primaryStack The top-level runtime stack.
 * @param {ode.SymbolTable} symbolTable Symbol table.
 * @param {function(string)} print The function to use to display something to
 * the user.
 */
ode.Interpreter = function(primaryStack, symbolTable, print) {

  // Need to bind these so that this refers to interpreter.
  this.e = new ode.Environment(
    primaryStack,
    symbolTable,
    print,
    extras.bind(this.runNestableNodes, this),
    extras.bind(this.runCreateBlock, this));
};

/**
 * @param {ode.ProgramNode} programNode The program node to execute.
 */
ode.Interpreter.prototype.run = function(programNode) {
  var that = this;

  extras.each(programNode.statements, function(statement) {

    try {
      if (statement instanceof ode.DefinitionStatementNode) {
        that.runDefinition(statement);
      } else if (statement instanceof ode.PhraseStatementNode) {
        that.runPhrase(statement, 0);
      } else {
        throw new ode.RuntimeException('Unrecognized statement: <' +
          statement.toString() + '>');
      }
    } catch (ex) {
      // Here we drop all child frames so that if an error occurs while
      // in a child frame, that frame is not left on the top of the frame
      // stack.
      that.e.resetFrames();
      throw ex;
    }

  });
};

/**
 * @param {ode.PhraseStatementNode} phraseNode The phrase node to execute.
 * @param {number} recursionCount The current recursion count.
 */
ode.Interpreter.prototype.runPhrase = function(phraseNode, recursionCount) {
  if (recursionCount > 100) {
    throw new ode.RuntimeException(
      'Possible infinite recursion detected; Operation terminated');
  }
  this.runNestableNodes(phraseNode.nodes, recursionCount);
};

/**
 * @param {Array.<ode.NestableNode>} nestableNodesArray Array of nestable
 * nodes.
 * @param {number=} recursionCountParam The current recursion count.
 */
ode.Interpreter.prototype.runNestableNodes = function(nestableNodesArray,
  recursionCountParam) {

  var that = this;
  var recursionCount = recursionCountParam || 0;

  extras.each(nestableNodesArray, function(nestableNode) {
    if (nestableNode instanceof ode.BlockNode) {
      that.runBlock(nestableNode);
    } else if (nestableNode instanceof ode.NameNode) {
      that.runName(nestableNode.val, recursionCount);
    } else if (nestableNode instanceof ode.NumberNode) {
      that.runNumber(nestableNode.val);
    } else {
      throw new ode.RuntimeException('Unrecognized nested node: <' +
        nestableNode.toString() + '>');
    }
  });
};

/**
 * @param {ode.DefinitionStatementNode} definitionNode Definition node to
 * execute.
 */
ode.Interpreter.prototype.runDefinition = function(definitionNode) {
  this.e.symbolTable.set(definitionNode.name, new ode.CustomDefinitionBody(
    definitionNode.body));
};

/**
 * @param {ode.BlockNode} blockNode Block node to execute.
 */
ode.Interpreter.prototype.runBlock = function(blockNode) {
  this.e.stack.push(blockNode);
};

/**
 * @param {number} numberValue The number to execute.
 */
ode.Interpreter.prototype.runNumber = function(numberValue) {
  this.e.stack.push(new ode.NumberNode(numberValue));
};

/**
 * @param {string} name Name of to execute.
 * @param {number} recursionCount The current recursion count.
 */
ode.Interpreter.prototype.runName = function(name, recursionCount) {
  var definition = this.e.symbolTable.get(name);

  if (definition instanceof ode.CustomDefinitionBody) {
    while (true) {
      try {
        this.runPhrase(definition.phraseNode, recursionCount + 1);
      } catch (ex) {
        // This is a tail callback, so continue the while
        if (ex instanceof ode.TailCallbackException) {
          continue;
        }
        // This is some other exception, so rethrow the exception
        else {
          throw ex;
        }
      }

      // End the loop when there is no tail callbacks
      break;
    }
  } else if (definition instanceof ode.NativeDefinitionBody) {
    definition.nativeFunction(this.e);
  } else if (name === 'self') {
    throw new ode.TailCallbackException();
  } else {
    throw new ode.RuntimeException('Undefined name: ' + name);
  }
};

/**
 * @param {number} length Number of nodes on top of the stack to put in block.
 */
ode.Interpreter.prototype.runCreateBlock = function(length) {
  var that = this;
  var nodesArray = [];

  if (length > 0) {
    extras.each(extras.range(length - 1), function() {
      nodesArray.unshift(that.e.stack.pop());
    });
  }

  this.e.stack.push(new ode.BlockNode(nodesArray));
};

/**
 * @param {string} name Name of the operation.
 * @param {function(ode.Environment)} implementation The native implementation
 * of the operation.
 */
ode.Interpreter.prototype.addNativeOperation = function(name, implementation) {
  this.e.symbolTable.set(name, new ode.NativeDefinitionBody(implementation));
};
