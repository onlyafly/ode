/** @type {Object} */
ode.joynatives = ode.joynatives || {};

/**
 * @param {ode.Interpreter} i The interpreter.
 */
ode.joynatives.initialize = function(i) {

  // IO
  i.addNativeOperation('.', ode.joynatives.print);

  // Math and Logic
  i.addNativeOperation('+', ode.joynatives.makeMathOperator('+', '+'));
  i.addNativeOperation('-', ode.joynatives.makeMathOperator('-', '-'));
  i.addNativeOperation('*', ode.joynatives.makeMathOperator('*', '*'));
  i.addNativeOperation('/', ode.joynatives.makeMathOperator('/', '/'));
  i.addNativeOperation('<', ode.joynatives.makeComparisonOperator('<', '<'));
  i.addNativeOperation('>', ode.joynatives.makeComparisonOperator('>', '>'));
  i
    .addNativeOperation('<=', ode.joynatives
      .makeComparisonOperator('<=', '<='));
  i
    .addNativeOperation('>=', ode.joynatives
      .makeComparisonOperator('>=', '>='));
  i.addNativeOperation('eq', ode.joynatives
    .makeComparisonOperator('===', 'eq'));

  // Control
  i.addNativeOperation('ifte', ode.joynatives.ifte);

  // Stack
  i.addNativeOperation('dup', ode.joynatives.dup);
  i.addNativeOperation('dup#', ode.joynatives.dupLocation);
  i.addNativeOperation('swap', ode.joynatives.swap);
  i.addNativeOperation('drop', ode.joynatives.drop);
  i.addNativeOperation('drop#', ode.joynatives.dropLocation);
  i.addNativeOperation('rot', ode.joynatives.makeRot(3));

  // Predicates
  i.addNativeOperation('number?', ode.joynatives.numberPredicate);
  i.addNativeOperation('block?', ode.joynatives.blockPredicate);
  i.addNativeOperation('empty?', ode.joynatives.emptyPredicate);

  // Advanced
  i.addNativeOperation('$eval', ode.joynatives.evaluate);
  i.addNativeOperation('$type', ode.joynatives.type);
  i.addNativeOperation('$def', ode.joynatives.dollarDef);
  i.addNativeOperation('def', ode.joynatives.def);
  i.addNativeOperation('undef', ode.joynatives.undef);
  i.addNativeOperation('newstack', ode.joynatives.newstack);
  i.addNativeOperation('throw-error', ode.joynatives.throwError);

  // Block
  i.addNativeOperation('apply', ode.joynatives.apply);
  i.addNativeOperation('cat', ode.joynatives.cat);
  i.addNativeOperation('block', ode.joynatives.block);
  i.addNativeOperation('block#', ode.joynatives.blockLocation);
  i.addNativeOperation('cons', ode.joynatives.cons);
  i.addNativeOperation('uncons', ode.joynatives.uncons);
  i.addNativeOperation('stack', ode.joynatives.stack);
  i.addNativeOperation('unstack', ode.joynatives.unstack);
  i.addNativeOperation('length', ode.joynatives.length);

  // Functional
  i.addNativeOperation('map', ode.joynatives.map);
  i.addNativeOperation('fold', ode.joynatives.fold);
};

/**
 * @param {string} javaScriptOperatorString The operator in JavaScript.
 * @param {string} operationName The name of the operation in Ode.
 * @return {function(ode.Environment)} The native definition.
 */
ode.joynatives.makeComparisonOperator = function(javaScriptOperatorString,
  operationName) {
  /**
   * @param {ode.Environment} e Current environment.
   */
  return function(e) {
    var y = e.stack.pop();
    var x = e.stack.pop();

    if (x.toNumberValue && y.toNumberValue) {

      var result = eval(x.toNumberValue().toString() +
        javaScriptOperatorString + y.toNumberValue().toString());

      if (result) {
        e.stack.push(new ode.NumberNode(1));
      } else {
        e.stack.push(new ode.NumberNode(0));
      }
    } else {
      e.parameterError(operationName, 'number, number', x.toString() + ', ' +
        y.toString());
    }
  };
};

/**
 * @param {string} javaScriptOperatorString The operator in JavaScript.
 * @param {string} operationName The name of the operation in Ode.
 * @return {function(ode.Environment)} The native definition.
 */
ode.joynatives.makeMathOperator = function(javaScriptOperatorString,
  operationName) {
  /**
   * @param {ode.Environment} e Current environment.
   */
  return function(e) {
    var y = e.stack.pop();
    var x = e.stack.pop();

    if (x.toNumberValue && y.toNumberValue) {

      // Spaces must be here or negative numbers can cause problem
      var result = eval(x.toNumberValue().toString() + ' ' +
        javaScriptOperatorString + ' ' + y.toNumberValue().toString());

      e.stack.push(new ode.NumberNode(result));

    } else {
      e.parameterError(operationName, 'number, number', x.toString() + ', ' +
        y.toString());
    }
  };
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.print = function(e) {
  var x = e.stack.pop();

  if (x instanceof ode.NumberNode) {
    e.print(x.toString());
  } else if (x instanceof ode.BlockNode) {
    e.print(x.toString());
  } else if (x instanceof ode.NameNode) {
    e.print(x.toString());
  } else {
    e.parameterError('.', 'number, name, or block', x.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.dup = function(e) {
  e.stack.duplicate(0);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.dupLocation = function(e) {
  var x = e.stack.pop();

  if (x.toNumberValue) { // Can x be converted to a number value?
    var position = x.toNumberValue();
    e.stack.duplicate(position);
  } else {
    e.parameterError('dup#', 'number', x.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.swap = function(e) {
  var x = e.stack.pop();
  var y = e.stack.pop();
  e.stack.push(x);
  e.stack.push(y);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.apply = function(e) {
  var x = e.stack.pop();

  if (x instanceof ode.BlockNode) {
    e.runNestableNodes(x.nodes);
  } else {
    e.parameterError('apply', 'block', x.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.ifte = function(e) {
  var pelse = e.stack.pop();
  var pthen = e.stack.pop();
  var pif = e.stack.pop();

  if (extras.hasInstances(ode.BlockNode, pif, pthen, pelse)) {
    // eval if
    e.stack.push(pif);
    ode.joynatives.apply(e);
    var predicateResult = e.stack.pop();

    // Can predicateResult be converted to a boolean value?
    if (predicateResult.toBooleanValue) {
      if (predicateResult.toBooleanValue()) {
        e.stack.push(pthen);
      } else {
        e.stack.push(pelse);
      }
      ode.joynatives.apply(e);
    } else {
      e.parameterError('ifte', 'boolean', predicateResult.toString());
    }
  } else {
    e.parameterError('ifte', 'three blocks', pif.toString() + ',' +
      pthen.toString() + ',' + pelse.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.dropLocation = function(e) {
  var x = e.stack.pop();

  if (x.toNumberValue) { // Can x be converted to a number value?
    var position = x.toNumberValue();

    if (extras.isInteger(position) && (position >= 0)) {
      e.stack.drop(position);
    } else {
      e.parameterError('drop#', 'non-negative integer', x.toString());
    }
  } else {
    e.parameterError('drop#', 'number', x.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.drop = function(e) {
  e.stack.pop();
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.numberPredicate = function(e) {
  var x = e.stack.pop();

  if (x instanceof ode.NumberNode) {
    e.stack.push(new ode.NumberNode(1));
  } else {
    e.stack.push(new ode.NumberNode(0));
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.blockPredicate = function(e) {
  var x = e.stack.pop();

  if (x instanceof ode.BlockNode) {
    e.stack.push(new ode.NumberNode(1));
  } else {
    e.stack.push(new ode.NumberNode(0));
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.emptyPredicate = function(e) {
  var x = e.stack.pop();

  if (x instanceof ode.BlockNode) {
    if (x.nodes.length === 0) {
      e.stack.push(new ode.NumberNode(1));
    } else {
      e.stack.push(new ode.NumberNode(0));
    }
  } else {
    e.parameterError('empty?', 'block', x.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.cat = function(e) {
  var y = e.stack.pop();
  var x = e.stack.pop();

  if (x instanceof ode.BlockNode && y instanceof ode.BlockNode) {
    e.stack.push(x.concatenate(y));
  } else {
    e.parameterError('cat', 'two blocks', x.toString() + ',' + y.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.cons = function(e) {
  var y = e.stack.pop();
  var x = e.stack.pop();

  if (y instanceof ode.BlockNode) {
    e.stack.push(y.prepend(x));
  } else {
    e.parameterError('cons', 'node,block', x.toString() + ',' + y.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.uncons = function(e) {
  var x = e.stack.pop();

  if (x instanceof ode.BlockNode) {
    if (x.nodes.length === 0) {
      e.parameterError('uncons', 'non-empty block', x.toString());
    }
    e.stack.push(x.nodes[0]);
    e.stack.push(new ode.BlockNode(x.nodes.slice(1)));
  } else {
    e.parameterError('uncons', 'block', x.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.block = function(e) {
  e.runCreateBlock(1);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.blockLocation = function(e) {
  var x = e.stack.pop();

  if (x.toNumberValue) { // Can x be converted to a number value?
    var length = x.toNumberValue();

    if (extras.isInteger(length) && (length >= 0)) {
      e.runCreateBlock(length);
    } else {
      e.parameterError('block#', 'non-negative integer', x.toString());
    }
  } else {
    e.parameterError('block#', 'number', x.toString());
  }
};

/**
 * @param {number} n The nth item will be rotated to the front.
 * @return {function(ode.Environment)} The native definition.
 */
ode.joynatives.makeRot = function(n) {
  /**
   * @param {ode.Environment} e Current environment.
   */
  return function(e) {
    e.stack.rotate(n);
  };
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.evaluate = function(e) {
  var block = e.stack.pop();

  if (block instanceof ode.BlockNode) {

    e.enterFrame();

    e.stack.push(block);
    ode.joynatives.apply(e);
    var stackNodes = e.getStackNodes();

    e.exitFrame();

    e.stack.push(new ode.BlockNode(stackNodes));
  } else {
    e.parameterError('$eval', 'block', block.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.type = function(e) {
  var x = e.stack.pop();

  if (x instanceof ode.NameNode) {
    e.stack.push(new ode.BlockNode([new ode.NameNode('name')]));
  } else if (x instanceof ode.NumberNode) {
    e.stack.push(new ode.BlockNode([new ode.NameNode('number')]));
  } else if (x instanceof ode.BlockNode) {
    e.stack.push(new ode.BlockNode([new ode.NameNode('block')]));
  } else {
    e.stack.push(new ode.BlockNode([new ode.NameNode('?')]));
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.dollarDef = function(e) {

  /** @type {ode.BlockNode} */
  var block = e.stack.pop();

  if (!extras.hasInstances(ode.BlockNode, block)) {
    e.parameterError('$def', 'block', block.toString());
  }

  if (block.nodes.length === 0) {
    e.parameterError('$def', 'name in a block', block.toString());
  }

  var name = block.nodes[0];

  if (!extras.hasInstances(ode.NameNode, name)) {
    e.parameterError('$def', 'name in a block', name.toString());
  }

  var body = e.symbolTable.get(name.toString());
  var result;

  if (body instanceof ode.CustomDefinitionBody) {
    result = new ode.BlockNode(body.phraseNode.nodes);
  } else if (body instanceof ode.NativeDefinitionBody) {
    result = new ode.BlockNode([new ode.NameNode('native')]);
  } else {
    result = new ode.BlockNode([new ode.NameNode('unknown')]);
  }

  e.stack.push(result);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.map = function(e) {
  var f = e.stack.pop();
  var v = e.stack.pop();

  if (extras.hasInstances(ode.BlockNode, f, v)) {
    var resultArray = [];

    e.enterFrame();

    extras.each(v.nodes, function(originalNode) {

      e.stack.push(originalNode);
      e.stack.push(f);
      ode.joynatives.apply(e);

      extras.each(e.getStackNodes(), function(resultNode) {
        resultArray.push(resultNode);
      });

      e.stack.empty(); // clear stack for next iteration of the map

    });

    e.exitFrame();

    e.stack.push(new ode.BlockNode(resultArray));
  } else {
    e.parameterError('map', 'two blocks', f.toString() + ',' + v.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.fold = function(e) {
  var func = e.stack.pop();
  var init = e.stack.pop();
  var block = e.stack.pop();

  if (!extras.hasInstances(ode.BlockNode, func, block)) {
    e.expectationError('map', 'list,value,block', [block, init, func]);
  } else {

    e.enterFrame();

    e.stack.push(init);

    extras.each(block.nodes, function(node) {
      e.stack.push(node);
      e.stack.push(func);
      ode.joynatives.apply(e);
    });

    var stackNodes = e.getStackNodes();
    e.exitFrame();

    extras.each(stackNodes, function(node) {
      e.stack.push(node);
    });
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.def = function(e) {

  /** @type {ode.BlockNode} */
  var nameBlock = e.stack.pop();
  /** @type {ode.BlockNode} */
  var definitionBlock = e.stack.pop();

  if (!extras.hasInstances(ode.BlockNode, nameBlock, definitionBlock)) {
    e
      .expectationError(
        'def',
        ['block', 'block'],
        [nameBlock, definitionBlock]);
  }

  if (nameBlock.nodes.length !== 1) {
    e.expectationError('def', ['name in a block'], [nameBlock]);
  }

  var name = nameBlock.nodes[0];

  if (!extras.hasInstances(ode.NameNode, name)) {
    e.expectationError('def', ['name in a block'], [name]);
  }

  var bodyPhraseNode = new ode.PhraseStatementNode(definitionBlock.nodes);
  var bodyCustomDefinition = new ode.CustomDefinitionBody(bodyPhraseNode);
  e.symbolTable.set(name.val, bodyCustomDefinition);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.undef = function(e) {

  /** @type {ode.BlockNode} */
  var nameBlock = e.stack.pop();

  if (!extras.hasInstances(ode.BlockNode, nameBlock)) {
    e.expectationError('undef', ['block'], [nameBlock]);
  }

  if (nameBlock.nodes.length !== 1) {
    e.expectationError('undef', ['name in a block'], [nameBlock]);
  }

  var name = nameBlock.nodes[0];

  if (!extras.hasInstances(ode.NameNode, name)) {
    e.expectationError('undef', ['name in a block'], [name]);
  }

  e.symbolTable.drop(name.val);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.stack = function(e) {
  // Slice is used to get a shallow copy of the array.
  var nodes = e.stack.getInternalArray().slice();
  var block = new ode.BlockNode(nodes);
  e.stack.push(block);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.unstack = function(e) {

  /** @type {ode.BlockNode} */
  var block = e.stack.pop();

  if (!extras.hasInstances(ode.BlockNode, block)) {
    e.expectationError('unstack', 'block', [block]);
  }

  e.stack.setInternalArray(block.nodes);

};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.newstack = function(e) {
  e.stack.empty();
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.throwError = function(e) {
  throw new ode.RuntimeCustomException();
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.length = function(e) {

  /** @type {ode.BlockNode} */
  var block = e.stack.pop();

  if (!extras.hasInstances(ode.BlockNode, block)) {
    e.expectationError('length', 'block', [block]);
  }

  var len = block.nodes.length;
  e.stack.push(new ode.NumberNode(len));

};
