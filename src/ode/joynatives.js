/** @type {Object} */
ode.joynatives = ode.joynatives || {};

/**
 * @param {ode.Interpreter} i The interpreter.
 */
ode.joynatives.initialize = function(i) {

  // Definitions and Symbols
  i.addNativeOperation('body', ode.joynatives.body);
  i.addNativeOperation('name', ode.joynatives.name);
  i.addNativeOperation('intern', ode.joynatives.intern);

  // Control Flow
  i.addNativeOperation('ifte', ode.joynatives.ifte);

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

  // Basic Stack Operations
  i.addNativeOperation('id', function(e) {});
  i.addNativeOperation('dup', ode.joynatives.dup);
  i.addNativeOperation('dupd', ode.joynatives.dupd);
  i.addNativeOperation('swap', ode.joynatives.swap);
  i.addNativeOperation('rollup', ode.joynatives.makeRotationOp([2, 2]));
  i.addNativeOperation('rolldown', ode.joynatives.makeRotationOp([2]));
  i.addNativeOperation('rotate', ode.joynatives.makeRotationOp([1, 2]));
  i.addNativeOperation('popd', function(e) { e.stack.drop(1); });
  i.addNativeOperation('swapd', ode.joynatives.makeRotationOp([2, 1]));
  i.addNativeOperation('rollupd', ode.joynatives.makeRotationOp([3, 3, 2]));
  i.addNativeOperation('rolldownd', ode.joynatives.makeRotationOp([3, 1]));
  i.addNativeOperation('rotated', ode.joynatives.makeRotationOp([2, 3, 2]));
  i.addNativeOperation('pop', ode.joynatives.pop);

  // Advanced Stack Operations
  i.addNativeOperation('newstack', ode.joynatives.newstack);
  i.addNativeOperation('stack', ode.joynatives.stack);
  i.addNativeOperation('unstack', ode.joynatives.unstack);
  i.addNativeOperation('infra', ode.joynatives.infra);

  // Recursion
  i.addNativeOperation('primrec', ode.joynatives.primrec);
  i.addNativeOperation('genrec', ode.joynatives.genrec);
  i.addNativeOperation('linrec', ode.joynatives.linrec);
  i.addNativeOperation('binrec', ode.joynatives.binrec);

  // Functional
  i.addNativeOperation('split', ode.joynatives.split);

  // TODO: some things below might not be in Joy

  // IO
  i.addNativeOperation('.', ode.joynatives.print);

  // Stack
  i.addNativeOperation('dup#', ode.joynatives.dupLocation);
  i.addNativeOperation('drop#', ode.joynatives.dropLocation);

  // Predicates
  i.addNativeOperation('number?', ode.joynatives.numberPredicate);
  i.addNativeOperation('block?', ode.joynatives.blockPredicate);
  i.addNativeOperation('empty?', ode.joynatives.emptyPredicate);

  // Advanced
  i.addNativeOperation('$type', ode.joynatives.type);
  i.addNativeOperation('def', ode.joynatives.def);
  i.addNativeOperation('undef', ode.joynatives.undef);
  i.addNativeOperation('throw-error', ode.joynatives.throwError);

  // Block
  i.addNativeOperation('block', ode.joynatives.block);
  i.addNativeOperation('block#', ode.joynatives.blockLocation);

  // Functional
  i.addNativeOperation('map', ode.joynatives.map);
  i.addNativeOperation('fold', ode.joynatives.fold);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.name = function(e) {
  var node = e.stack.pop();

  if (node.getName) {
    e.stack.push(new ode.StringNode(node.getName()));
  } else if (node.getTypeName) {
    e.stack.push(new ode.StringNode(node.getTypeName()));
  } else {
    e.expectationError('name', 'symbol or literal', [node]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.intern = function(e) {
  var node = e.stack.pop();

  if (node instanceof ode.StringNode) {
    e.stack.push(new ode.SymbolNode(node.val));
  } else {
    e.expectationError('intern', 'string', [node]);
  }
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
ode.joynatives.split = function(e) {
  var test = e.stack.pop();
  var list = e.stack.pop();

  if (test.getNodes && list.getNodes) {

    var first = [];
    var second = [];

    extras.each(list.getNodes(), function(node) {

      var preservedStack = ode.joynatives.getPreservedStack_(e);

      e.stack.push(node);

      e.stack.push(test);
      ode.joynatives.i(e);
      var result = e.stack.pop();

      ode.joynatives.restorePreservedStack_(e, preservedStack);

      if (result.toBooleanValue) {
        if (result.toBooleanValue()) {
          first.push(node);
        } else {
          second.push(node);
        }
      } else {
        e.expectationError('split', 'boolean', [result]);
      }
    });

    e.stack.push(new ode.BlockNode(first));
    e.stack.push(new ode.BlockNode(second));
  } else {
    e.expectationError('split', 'list, quote', [list, test]);
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
  } else if (x instanceof ode.SymbolNode) {
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
ode.joynatives.dupd = function(e) {
  e.stack.duplicate(1);
  e.stack.moveToTop(1);
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

    var predicateResult = ode.joynatives.executeBlockAndPreserveStack_(e, pif);

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
    e.expectationError(
      'ifte',
      'if-block, then-block, else-block',
      [pif, pthen, pelse]);
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
ode.joynatives.pop = function(e) {
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
 * @param {Array.<number>} movements Array containing the sequence of movements
 * from the given number to the top of the stack.
 * @return {function(ode.Environment)} The native definition.
 */
ode.joynatives.makeRotationOp = function(movements) {
  /**
   * @param {ode.Environment} e Current environment.
   */
  return function(e) {
    extras.each(movements, function(n) {
      e.stack.moveToTop(n);
    });
  };
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.infra = function(e) {
  var quote = e.stack.pop();
  var list = e.stack.pop();

  if (extras.hasInstances(ode.BlockNode, quote, list)) {

    e.enterFrame();

    // Push the list as the new stack.
    var listNodes = extras.reverseArray(list.getNodes());
    extras.each(listNodes, function(node) {
      e.stack.push(node);
    });

    // Execute the quote in the new stack.
    e.stack.push(quote);
    ode.joynatives.i(e);

    var stackNodes = extras.reverseArray(e.getStackNodes());

    e.exitFrame();

    e.stack.push(new ode.BlockNode(stackNodes));
  } else {
    e.expectationError('infra', 'list, quote', [list, quote]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.type = function(e) {
  var x = e.stack.pop();

  if (x instanceof ode.SymbolNode) {
    e.stack.push(new ode.BlockNode([new ode.SymbolNode('name')]));
  } else if (x instanceof ode.NumberNode) {
    e.stack.push(new ode.BlockNode([new ode.SymbolNode('number')]));
  } else if (x instanceof ode.BlockNode) {
    e.stack.push(new ode.BlockNode([new ode.SymbolNode('block')]));
  } else {
    e.stack.push(new ode.BlockNode([new ode.SymbolNode('?')]));
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.body = function(e) {

  var node = e.stack.pop();
  var name;

  if (extras.hasInstances(ode.BlockNode, node)) {
    if (node.getSize() !== 1) {
      e.expectationError('body', 'name in a block', [node]);
    }

    name = node.getNodes()[0];

    if (!extras.hasInstances(ode.SymbolNode, name)) {
      e.expectationError('body', 'name in block', [node]);
    }
  } else if (extras.hasInstances(ode.SymbolNode, node)) {
    name = node;
  } else {
    e.expectationError('body', 'name or name in block', [name]);
  }

  var body = e.symbolTable.get(name.toString());
  var result;

  if (body instanceof ode.CustomDefinitionBody) {
    result = new ode.BlockNode(body.phraseNode.getNodes());
  } else if (body instanceof ode.NativeDefinitionBody) {
    result = new ode.BlockNode([new ode.SymbolNode('native')]);
  } else {
    result = new ode.BlockNode([new ode.SymbolNode('unknown')]);
  }

  e.stack.push(result);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.primrec = function(e) {
  var computation = e.stack.pop();
  var initialBlock = e.stack.pop();

  if (extras.hasInstances(ode.BlockNode, computation, initialBlock)) {

    var data = e.stack.pop();

    if (data.toNumberValue) {

      var endingNumber = data.toNumberValue();

      // Execute initial block to calculate the starting value
      e.stack.push(initialBlock);
      ode.joynatives.i(e);

      for (var i = endingNumber; i > 0; i--) {
        e.stack.push(new ode.NumberNode(i));
        ode.joynatives.swap(e);
        e.stack.push(computation);
        ode.joynatives.i(e);
      }

    } else if (data.getNodes) {

      var reversedNodes = extras.reverseArray(data.getNodes());

      // Execute initial block to calculate the starting value
      e.stack.push(initialBlock);
      ode.joynatives.i(e);

      extras.each(reversedNodes, function(node, i) {
        e.stack.push(node);
        ode.joynatives.swap(e);
        e.stack.push(computation);
        ode.joynatives.i(e);
      });

    } else {
      e.expectationError(
        'primrec',
        'number or block, block, block',
        [data, initialBlock, computation]);
    }

  } else {
    e.expectationError(
      'primrec',
      'block, block',
      [initialBlock, computation]);
  }
};

/**
 * @private
 * @param {ode.Environment} e Current environment.
 * @param {ode.BlockNode} block Block to execute.
 * @return {ode.NestableNode} The top node after executing the block.
 */
ode.joynatives.executeBlockAndPreserveStack_ = function(e, block) {

  // Preserve stack.
  ode.joynatives.stack(e);
  var preservedStack = e.stack.pop();

  // Eval if.
  e.stack.push(block);
  ode.joynatives.i(e);
  var result = e.stack.pop();

  // Restore stack.
  e.stack.push(preservedStack);
  ode.joynatives.unstack(e);

  return result;
};

/**
 * @private
 * @param {ode.Environment} e Current environment.
 * @param {ode.BlockNode} preservedStack Block to restore as the stack.
 */
ode.joynatives.restorePreservedStack_ = function(e, preservedStack) {
  // Restore stack.
  e.stack.push(preservedStack);
  ode.joynatives.unstack(e);
};

/**
 * @private
 * @param {ode.Environment} e Current environment.
 * @return {ode.BlockNode} The stack preserved as a block.
 */
ode.joynatives.getPreservedStack_ = function(e) {
  // Preserve stack.
  ode.joynatives.stack(e);
  var preservedStack = e.stack.pop();
  return preservedStack;
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.genrec = function(e) {
  var belse2 = e.stack.pop();
  var belse1 = e.stack.pop();
  var bthen = e.stack.pop();
  var bif = e.stack.pop();

  if (extras.hasInstances(ode.BlockNode, bif, bthen, belse1, belse2)) {

    var result = ode.joynatives.executeBlockAndPreserveStack_(e, bif);

    if (result.toBooleanValue) {

      if (result.toBooleanValue()) {
        e.stack.push(bthen);
        ode.joynatives.i(e);
      } else {
        e.stack.push(belse1);
        ode.joynatives.i(e);
        e.stack.push(
          new ode.BlockNode(
            [bif, bthen, belse1, belse2, new ode.SymbolNode('genrec')]));
        e.stack.push(belse2);
        ode.joynatives.i(e);
      }

    } else {
      e.expectationError(
        'genrec',
        'if-block that generates a boolean value',
        [bif]);
    }

  } else {
    e.expectationError(
      'genrec',
      'if-block, then-block, else1-block, else2-block',
      [bif, bthen, belse1, belse2]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.linrec = function(e) {
  var belse2 = e.stack.pop();
  var belse1 = e.stack.pop();
  var bthen = e.stack.pop();
  var bif = e.stack.pop();

  if (extras.hasInstances(ode.BlockNode, bif, bthen, belse1, belse2)) {

    var result = ode.joynatives.executeBlockAndPreserveStack_(e, bif);

    if (result.toBooleanValue) {

      if (result.toBooleanValue()) {
        e.stack.push(bthen);
        ode.joynatives.i(e);
      } else {
        e.stack.push(belse1);
        ode.joynatives.i(e);
        e.stack.push(
          new ode.BlockNode(
            [bif, bthen, belse1, belse2, new ode.SymbolNode('linrec')]));
        ode.joynatives.i(e);
        e.stack.push(belse2);
        ode.joynatives.i(e);
      }

    } else {
      e.expectationError(
        'linrec',
        'if-block that generates a boolean value',
        [bif]);
    }

  } else {
    e.expectationError(
      'linrec',
      'if-block, then-block, else1-block, else2-block',
      [bif, bthen, belse1, belse2]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.binrec = function(e) {
  var belse2 = e.stack.pop();
  var belse1 = e.stack.pop();
  var bthen = e.stack.pop();
  var bif = e.stack.pop();

  if (extras.hasInstances(ode.BlockNode, bif, bthen, belse1, belse2)) {

    var result = ode.joynatives.executeBlockAndPreserveStack_(e, bif);

    if (result.toBooleanValue) {

      if (result.toBooleanValue()) {
        e.stack.push(bthen);
        ode.joynatives.i(e);
      } else {
        e.stack.push(belse1);
        ode.joynatives.i(e);

        var recursiveQuote = new ode.BlockNode(
          [bif, bthen, belse1, belse2, new ode.SymbolNode('binrec')]);
        var second = e.stack.pop(e);
        var first = e.stack.pop(e);

        e.stack.push(first);
        e.stack.push(recursiveQuote);
        ode.joynatives.i(e);

        e.stack.push(second);
        e.stack.push(recursiveQuote);
        ode.joynatives.i(e);

        e.stack.push(belse2);
        ode.joynatives.i(e);
      }

    } else {
      e.expectationError(
        'binrec',
        'if-block that generates a boolean value',
        [bif]);
    }

  } else {
    e.expectationError(
      'binrec',
      'if-block, then-block, else1-block, else2-block',
      [bif, bthen, belse1, belse2]);
  }
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

  if (!extras.hasInstances(ode.SymbolNode, name)) {
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

  if (!extras.hasInstances(ode.SymbolNode, name)) {
    e.expectationError('undef', ['name in a block'], [name]);
  }

  e.symbolTable.drop(name.val);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.stack = function(e) {
  var block = new ode.BlockNode(
    extras.reverseArray(
      e.stack.getInternalArray()));
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

  e.stack.setInternalArray(extras.reverseArray(block.getNodes()));

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
