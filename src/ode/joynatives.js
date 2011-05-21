/** @type {Object} */
ode.joynatives = ode.joynatives || {};

/**
 * @param {ode.Interpreter} i The interpreter.
 */
ode.joynatives.initialize = function(i) {

  // // // // // In Joy

  // Math
  i.addNativeOperation('pred', ode.joynatives.pred);
  i.addNativeOperation('succ', ode.joynatives.succ);
  i.addNativeOperation('div', ode.joynatives.div);
  i.addNativeOperation('rem', ode.joynatives.rem);
  i.addNativeOperation('+', ode.joynatives.makeMathOperator('+', '+'));
  i.addNativeOperation('-', ode.joynatives.makeMathOperator('-', '-'));
  i.addNativeOperation('*', ode.joynatives.makeMathOperator('*', '*'));
  i.addNativeOperation('/', ode.joynatives.makeMathOperator('/', '/'));

  // Boolean Operations
  i.addNativeOperation('and', ode.joynatives.and);
  i.addNativeOperation('or', ode.joynatives.or);
  i.addNativeOperation('xor', ode.joynatives.xor);
  i.addNativeOperation('not', ode.joynatives.not);
  i.addNativeOperation('choice', ode.joynatives.choice);
  i.addNativeOperation('<', ode.joynatives.makeComparisonOp('<', '<'));
  i.addNativeOperation('>', ode.joynatives.makeComparisonOp('>', '>'));
  i.addNativeOperation('<=', ode.joynatives.makeComparisonOp('<=', '<='));
  i.addNativeOperation('>=', ode.joynatives.makeComparisonOp('>=', '>='));
  i.addNativeOperation('=', ode.joynatives.makeComparisonOp('===', '='));
  i.addNativeOperation('!=', ode.joynatives.makeComparisonOp('!==', '!='));
  i.addNativeOperation('null', ode.joynatives.nullPredicate);
  i.addNativeOperation('small', ode.joynatives.small);

  // Aggregate Operations
  i.addNativeOperation('concat', ode.joynatives.concat);
  i.addNativeOperation('size', ode.joynatives.size);
  i.addNativeOperation('cons', ode.joynatives.cons);
  i.addNativeOperation('uncons', ode.joynatives.uncons);
  i.addNativeOperation('i', ode.joynatives.i);
  i.addNativeOperation('first', ode.joynatives.first);
  i.addNativeOperation('rest', ode.joynatives.rest);

  // // // // // Maybe in Joy???



  // IO
  i.addNativeOperation('.', ode.joynatives.print);

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
  i.addNativeOperation('block', ode.joynatives.block);
  i.addNativeOperation('block#', ode.joynatives.blockLocation);
  i.addNativeOperation('stack', ode.joynatives.stack);
  i.addNativeOperation('unstack', ode.joynatives.unstack);

  // Functional
  i.addNativeOperation('map', ode.joynatives.map);
  i.addNativeOperation('fold', ode.joynatives.fold);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.pred = function(e) {
  var x = e.stack.pop();

  if (x.toNumberValue) {
    e.stack.push(new ode.NumberNode(x.toNumberValue() - 1));
  } else {
    e.expectationError('pred', 'number', [x]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.succ = function(e) {
  var x = e.stack.pop();

  if (x.toNumberValue) {
    e.stack.push(new ode.NumberNode(x.toNumberValue() + 1));
  } else {
    e.expectationError('succ', 'number', [x]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.div = function(e) {
  var y = e.stack.pop();
  var x = e.stack.pop();

  if (x.toNumberValue && y.toNumberValue) {

    var quotient = parseInt(x.toNumberValue() / y.toNumberValue(), 10);
    var remainder = x.toNumberValue() % y.toNumberValue();

    e.stack.push(new ode.NumberNode(quotient));
    e.stack.push(new ode.NumberNode(remainder));

  } else {
    e.expectationError('div', 'number, number', [x, y]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.rem = function(e) {
  var y = e.stack.pop();
  var x = e.stack.pop();

  if (x.toNumberValue && y.toNumberValue) {
    var remainder = x.toNumberValue() % y.toNumberValue();
    e.stack.push(new ode.NumberNode(remainder));
  } else {
    e.expectationError('div', 'number, number', [x, y]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.choice = function(e) {
  var pelse = e.stack.pop();
  var pthen = e.stack.pop();
  var pif = e.stack.pop();

  if (pif.toBooleanValue) {
    if (pif.toBooleanValue()) {
      e.stack.push(pthen);
    } else {
      e.stack.push(pelse);
    }
  } else {
    e.expectationError(
      'choice',
      'boolean, node, node',
      [pif, pthen, pelse]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.and = function(e) {
  var y = e.stack.pop();
  var x = e.stack.pop();

  if (x.toBooleanValue && y.toBooleanValue) {
    var xb = x.toBooleanValue();
    var yb = y.toBooleanValue();
    e.stack.push(new ode.BooleanNode(xb && yb));
  } else {
    e.expectationError(
      'and',
      'boolean, boolean',
      [x, y]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.or = function(e) {
  var y = e.stack.pop();
  var x = e.stack.pop();

  if (x.toBooleanValue && y.toBooleanValue) {
    var xb = x.toBooleanValue();
    var yb = y.toBooleanValue();
    e.stack.push(new ode.BooleanNode(xb || yb));
  } else {
    e.expectationError(
      'or',
      'boolean, boolean',
      [x, y]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.xor = function(e) {
  var y = e.stack.pop();
  var x = e.stack.pop();

  if (x.toBooleanValue && y.toBooleanValue) {
    var xb = x.toBooleanValue();
    var yb = y.toBooleanValue();
    e.stack.push(new ode.BooleanNode(xb ? !yb : yb));
  } else {
    e.expectationError(
      'xor',
      'boolean, boolean',
      [x, y]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.not = function(e) {
  var x = e.stack.pop();

  if (x.toBooleanValue) {
    var xb = x.toBooleanValue();
    e.stack.push(new ode.BooleanNode(!xb));
  } else {
    e.expectationError(
      'not',
      'boolean',
      [x]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.nullPredicate = function(e) {
  var x = e.stack.pop();

  if (x.toNumberValue) {
    var xn = x.toNumberValue();
    e.stack.push(new ode.BooleanNode(xn === 0));
  } else if (x.getSize) {
    e.stack.push(new ode.BooleanNode(x.getSize() === 0));
  } else {
    e.expectationError(
      'null',
      'number or aggregate',
      [x]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.small = function(e) {
  var x = e.stack.pop();

  if (x.toNumberValue) {
    var xn = x.toNumberValue();
    e.stack.push(new ode.BooleanNode(xn === 0 || xn === 1));
  } else if (x.getSize) {
    var xl = x.getSize();
    e.stack.push(new ode.BooleanNode(xl === 0 || xl === 1));
  } else {
    e.expectationError(
      'null',
      'number or aggregate',
      [x]);
  }
};

/**
 * @param {string} javaScriptOperatorString The operator in JavaScript.
 * @param {string} operationName The name of the operation in Ode.
 * @return {function(ode.Environment)} The native definition.
 */
ode.joynatives.makeComparisonOp = function(javaScriptOperatorString,
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
        e.stack.push(new ode.BooleanNode(true));
      } else {
        e.stack.push(new ode.BooleanNode(false));
      }
    } else {
      e.expectationError(operationName, 'number, number', [x, y]);
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
      e.expectationError(operationName, 'number, number', [x, y]);
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
    e.expectationError('.', 'number, name, or block', [x]);
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
    e.expectationError('dup#', 'number', [x]);
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
ode.joynatives.i = function(e) {
  var x = e.stack.pop();

  if (x instanceof ode.BlockNode) {
    e.runNestableNodes(x.getNodes());
  } else {
    e.expectationError('i', 'block', [x]);
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
    ode.joynatives.i(e);
    var predicateResult = e.stack.pop();

    // Can predicateResult be converted to a boolean value?
    if (predicateResult.toBooleanValue) {
      if (predicateResult.toBooleanValue()) {
        e.stack.push(pthen);
      } else {
        e.stack.push(pelse);
      }
      ode.joynatives.i(e);
    } else {
      e.expectationError('ifte', 'boolean', [predicateResult]);
    }
  } else {
    e.expectationError('ifte', 'three blocks', [pif, pthen, pelse]);
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
      e.expectationError('drop#', 'non-negative integer', [x]);
    }
  } else {
    e.expectationError('drop#', 'number', [x]);
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
    if (x.getSize() === 0) {
      e.stack.push(new ode.NumberNode(1));
    } else {
      e.stack.push(new ode.NumberNode(0));
    }
  } else {
    e.expectationError('empty?', 'block', [x]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.concat = function(e) {
  var y = e.stack.pop();
  var x = e.stack.pop();

  if (x.concatenate && x.canConcatenateWith && x.canConcatenateWith(y)) {
    e.stack.push(x.concatenate(y));
  } else {
    e.expectationError('concat', 'two compatible aggregates', [x, y]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.size = function(e) {
  var x = e.stack.pop();

  if (x.getSize) {
    e.stack.push(new ode.NumberNode(x.getSize()));
  } else {
    e.expectationError('size', 'aggregate', [x]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.cons = function(e) {
  var y = e.stack.pop();
  var x = e.stack.pop();

  if (y.prependNode && y.canPrependNode && y.canPrependNode(x)) {
    e.stack.push(y.prependNode(x));
  } else {
    e.expectationError('cons', ['element', 'compatible aggregate'], [x, y]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.uncons = function(e) {
  var x = e.stack.pop();

  if (x.getFirst && x.getRest && x.getSize) {

    if (x.getSize() === 0) {
      e.expectationError('uncons', ['non-empty aggregate'], [x]);
    }

    e.stack.push(x.getFirst());
    e.stack.push(x.getRest());

  } else {
    e.expectationError('uncons', ['aggregate'], [x]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.first = function(e) {
  var x = e.stack.pop();

  if (x.getFirst && x.getSize) {

    if (x.getSize() === 0) {
      e.expectationError('first', ['non-empty aggregate'], [x]);
    }

    e.stack.push(x.getFirst());

  } else {
    e.expectationError('first', ['aggregate'], [x]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.rest = function(e) {
  var x = e.stack.pop();

  if (x.getRest && x.getSize) {

    if (x.getSize() === 0) {
      e.expectationError('rest', ['non-empty aggregate'], [x]);
    }

    e.stack.push(x.getRest());

  } else {
    e.expectationError('rest', ['aggregate'], [x]);
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
      e.expectationError('block#', 'non-negative integer', [x]);
    }
  } else {
    e.expectationError('block#', 'number', [x]);
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
    ode.joynatives.i(e);
    var stackNodes = e.getStackNodes();

    e.exitFrame();

    e.stack.push(new ode.BlockNode(stackNodes));
  } else {
    e.expectationError('$eval', 'block', [block]);
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
    e.expectationError('$def', 'block', [block]);
  }

  if (block.getSize() === 0) {
    e.expectationError('$def', 'name in a block', [block]);
  }

  var name = block.getNodes()[0];

  if (!extras.hasInstances(ode.NameNode, name)) {
    e.expectationError('$def', 'name in a block', [name]);
  }

  var body = e.symbolTable.get(name.toString());
  var result;

  if (body instanceof ode.CustomDefinitionBody) {
    result = new ode.BlockNode(body.phraseNode.getNodes());
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

    extras.each(v.getNodes(), function(originalNode) {

      e.stack.push(originalNode);
      e.stack.push(f);
      ode.joynatives.i(e);

      extras.each(e.getStackNodes(), function(resultNode) {
        resultArray.push(resultNode);
      });

      e.stack.empty(); // clear stack for next iteration of the map

    });

    e.exitFrame();

    e.stack.push(new ode.BlockNode(resultArray));
  } else {
    e.expectationError('map', 'two blocks', [f, v]);
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

    extras.each(block.getNodes(), function(node) {
      e.stack.push(node);
      e.stack.push(func);
      ode.joynatives.i(e);
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
    e.expectationError(
      'def',
      ['block', 'block'],
      [nameBlock, definitionBlock]);
  }

  if (nameBlock.getSize() !== 1) {
    e.expectationError('def', ['name in a block'], [nameBlock]);
  }

  var name = nameBlock.getNodes()[0];

  if (!extras.hasInstances(ode.NameNode, name)) {
    e.expectationError('def', ['name in a block'], [name]);
  }

  var bodyPhraseNode = new ode.PhraseStatementNode(definitionBlock.getNodes());
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

  if (nameBlock.getSize() !== 1) {
    e.expectationError('undef', ['name in a block'], [nameBlock]);
  }

  var name = nameBlock.getNodes()[0];

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

  e.stack.setInternalArray(block.getNodes());

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
