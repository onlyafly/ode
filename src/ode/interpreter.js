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
    extras.bind(this.runCreateList, this));
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
  this.runNestableNodes(phraseNode.getNodes(), recursionCount);
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
    if (nestableNode instanceof ode.ListNode) {
      that.runList(nestableNode);
    } else if (nestableNode instanceof ode.SetNode) {
      that.runSet(nestableNode);
    } else if (nestableNode instanceof ode.StringNode) {
      that.runString(nestableNode.val);
    } else if (nestableNode instanceof ode.SymbolNode) {
      that.runSymbol(nestableNode.val, recursionCount);
    } else if (nestableNode instanceof ode.NumberNode) {
      that.runNumber(nestableNode.val);
    } else if (nestableNode instanceof ode.BooleanNode) {
      that.runBoolean(nestableNode.val);
    } else if (nestableNode instanceof ode.CharacterNode) {
      that.runCharacter(nestableNode.val);
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
  this.e.setSymbol(definitionNode.name, new ode.CustomDefinitionBody(
    definitionNode.body));
};

/**
 * @param {ode.ListNode} listNode List node to execute.
 */
ode.Interpreter.prototype.runList = function(listNode) {
  this.e.push(listNode);
};

/**
 * @param {ode.SetNode} setNode Set node to execute.
 */
ode.Interpreter.prototype.runSet = function(setNode) {
  this.e.push(setNode);
};

/**
 * @param {string} stringValue The string to execute.
 */
ode.Interpreter.prototype.runString = function(stringValue) {
  this.e.push(new ode.StringNode(stringValue));
};

/**
 * @param {number} numberValue The number to execute.
 */
ode.Interpreter.prototype.runNumber = function(numberValue) {
  this.e.push(new ode.NumberNode(numberValue));
};

/**
 * @param {boolean} booleanValue The value to execute.
 */
ode.Interpreter.prototype.runBoolean = function(booleanValue) {
  this.e.push(new ode.BooleanNode(booleanValue));
};

/**
 * @param {string} characterValue The value to execute.
 */
ode.Interpreter.prototype.runCharacter = function(characterValue) {
  this.e.push(new ode.CharacterNode(characterValue));
};

/**
 * @param {string} symbolName Name of symbol to execute.
 * @param {number} recursionCount The current recursion count.
 */
ode.Interpreter.prototype.runSymbol = function(symbolName, recursionCount) {
  var definition = this.e.getSymbol(symbolName);

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
  } else if (symbolName === 'self') {
    throw new ode.TailCallbackException();
  } else {
    throw new ode.RuntimeException('Undefined symbol: ' + symbolName);
  }
};

/**
 * @param {number} length Number of nodes on top of the stack to put in list.
 */
ode.Interpreter.prototype.runCreateList = function(length) {
  var that = this;
  var nodesArray = [];

  if (length > 0) {
    extras.each(extras.range(length - 1), function() {
      nodesArray.unshift(that.e.pop());
    });
  }

  this.e.push(new ode.ListNode(nodesArray));
};

/**
 * @param {string} symbolName Symbol name of the operation.
 * @param {function(ode.Environment)} implementation The native implementation
 * of the operation.
 */
ode.Interpreter.prototype.addNativeOperation = function(
  symbolName,
  implementation) {

  this.e.setSymbol(
    symbolName,
    new ode.NativeDefinitionBody(implementation));
};
