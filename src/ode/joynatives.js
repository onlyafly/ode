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
  i.addNativeOperation('rand', ode.joynatives.rand);

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
  i.addNativeOperation('integer', ode.joynatives.integer);
  i.addNativeOperation('float', ode.joynatives.floatPredicate);
  i.addNativeOperation('string', ode.joynatives.string);
  i.addNativeOperation('char', ode.joynatives.charPredicate);
  i.addNativeOperation('list', ode.joynatives.list);
  i.addNativeOperation('set', ode.joynatives.set);
  i.addNativeOperation('logical', ode.joynatives.logical);

  // Aggregate Operations
  i.addNativeOperation('concat', ode.joynatives.concat);
  i.addNativeOperation('size', ode.joynatives.size);
  i.addNativeOperation('cons', ode.joynatives.cons);
  i.addNativeOperation('uncons', ode.joynatives.uncons);
  i.addNativeOperation('i', ode.joynatives.i);
  i.addNativeOperation('first', ode.joynatives.first);
  i.addNativeOperation('rest', ode.joynatives.rest);
  i.addNativeOperation('swons', ode.joynatives.swons);

  // Basic Stack Operations
  i.addNativeOperation('id', function(e) {});
  i.addNativeOperation('dup', ode.joynatives.dup);
  i.addNativeOperation('dupd', ode.joynatives.dupd);
  i.addNativeOperation('swap', ode.joynatives.swap);
  i.addNativeOperation('rollup', ode.joynatives.makeRotationOp([2, 2]));
  i.addNativeOperation('rolldown', ode.joynatives.makeRotationOp([2]));
  i.addNativeOperation('rotate', ode.joynatives.makeRotationOp([1, 2]));
  i.addNativeOperation('popd', function(e) { e.drop(1); });
  i.addNativeOperation('swapd', ode.joynatives.makeRotationOp([2, 1]));
  i.addNativeOperation('rollupd', ode.joynatives.makeRotationOp([3, 3, 2]));
  i.addNativeOperation('rolldownd', ode.joynatives.makeRotationOp([3, 1]));
  i.addNativeOperation('rotated', ode.joynatives.makeRotationOp([2, 3, 2]));
  i.addNativeOperation('pop', ode.joynatives.pop);
  i.addNativeOperation('dip', ode.joynatives.dip);

  // Advanced Stack Operations
  i.addNativeOperation('newstack', ode.joynatives.newstack);
  i.addNativeOperation('stack', ode.joynatives.stack);
  i.addNativeOperation('unstack', ode.joynatives.unstack);
  i.addNativeOperation('infra', ode.joynatives.infra);
  i.addNativeOperation('unary', ode.joynatives.makeUnary('unary', 1));
  i.addNativeOperation('unary2', ode.joynatives.makeUnary('unary2', 2));
  i.addNativeOperation('unary3', ode.joynatives.makeUnary('unary3', 3));
  i.addNativeOperation('unary4', ode.joynatives.makeUnary('unary4', 4));

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

  // List
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
  var node = e.pop();

  if (node.getName) {
    e.push(new ode.StringNode(node.getName()));
  } else if (node.getTypeName) {
    e.push(new ode.StringNode(node.getTypeName()));
  } else {
    e.expectationError('name', 'symbol or literal', [node]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.intern = function(e) {
  var node = e.pop();

  if (node instanceof ode.StringNode) {
    e.push(new ode.SymbolNode(node.val));
  } else {
    e.expectationError('intern', 'string', [node]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.pred = function(e) {
  var x = e.pop();

  if (x.toNumberValue) {
    e.push(new ode.NumberNode(x.toNumberValue() - 1));
  } else {
    e.expectationError('pred', 'number', [x]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.rand = function(e) {

  var min = -2147483648; // -(2^31)
  var max = 2147483647; // 2^31 - 1
  var result = Math.floor(Math.random() * (max - min + 1)) + min;

  e.push(new ode.NumberNode(result));
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.split = function(e) {
  var test = e.pop();
  var list = e.pop();

  if (test.getNodes && list.getNodes) {

    var first = [];
    var second = [];

    extras.each(list.getNodes(), function(node) {

      var preservedStack = ode.joynatives.getPreservedStack_(e);

      e.push(node);

      e.push(test);
      ode.joynatives.i(e);
      var result = e.pop();

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

    e.push(new ode.ListNode(first));
    e.push(new ode.ListNode(second));
  } else {
    e.expectationError('split', 'list, quote', [list, test]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.succ = function(e) {
  var x = e.pop();

  if (x.toNumberValue) {
    e.push(new ode.NumberNode(x.toNumberValue() + 1));
  } else {
    e.expectationError('succ', 'number', [x]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.div = function(e) {
  var y = e.pop();
  var x = e.pop();

  if (x.toNumberValue && y.toNumberValue) {

    var quotient = parseInt(x.toNumberValue() / y.toNumberValue(), 10);
    var remainder = x.toNumberValue() % y.toNumberValue();

    e.push(new ode.NumberNode(quotient));
    e.push(new ode.NumberNode(remainder));

  } else {
    e.expectationError('div', 'number, number', [x, y]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.rem = function(e) {
  var y = e.pop();
  var x = e.pop();

  if (x.toNumberValue && y.toNumberValue) {
    var remainder = x.toNumberValue() % y.toNumberValue();
    e.push(new ode.NumberNode(remainder));
  } else {
    e.expectationError('div', 'number, number', [x, y]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.choice = function(e) {
  var pelse = e.pop();
  var pthen = e.pop();
  var pif = e.pop();

  if (pif.toBooleanValue) {
    if (pif.toBooleanValue()) {
      e.push(pthen);
    } else {
      e.push(pelse);
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
  var y = e.pop();
  var x = e.pop();

  if (x.toBooleanValue && y.toBooleanValue) {
    var xb = x.toBooleanValue();
    var yb = y.toBooleanValue();
    e.push(new ode.BooleanNode(xb && yb));
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
  var y = e.pop();
  var x = e.pop();

  if (x.toBooleanValue && y.toBooleanValue) {
    var xb = x.toBooleanValue();
    var yb = y.toBooleanValue();
    e.push(new ode.BooleanNode(xb || yb));
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
  var y = e.pop();
  var x = e.pop();

  if (x.toBooleanValue && y.toBooleanValue) {
    var xb = x.toBooleanValue();
    var yb = y.toBooleanValue();
    e.push(new ode.BooleanNode(xb ? !yb : yb));
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
  var x = e.pop();

  if (x.toBooleanValue) {
    var xb = x.toBooleanValue();
    e.push(new ode.BooleanNode(!xb));
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
  var x = e.pop();

  if (x.toNumberValue) {
    var xn = x.toNumberValue();
    e.push(new ode.BooleanNode(xn === 0));
  } else if (x.getSize) {
    e.push(new ode.BooleanNode(x.getSize() === 0));
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
ode.joynatives.integer = function(e) {
  var x = e.pop();
  var result = false;

  if (x instanceof ode.NumberNode) {
    var num = x.toNumberValue();
    result = num === Math.floor(num);
  }

  e.push(new ode.BooleanNode(result));
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.floatPredicate = function(e) {
  var x = e.pop();
  var result = false;

  if (x instanceof ode.NumberNode) {
    var num = x.toNumberValue();
    result = num !== Math.floor(num);
  }

  e.push(new ode.BooleanNode(result));
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.charPredicate = function(e) {
  var x = e.pop();
  e.push(new ode.BooleanNode(x instanceof ode.CharacterNode));
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.string = function(e) {
  var x = e.pop();
  e.push(new ode.BooleanNode(x instanceof ode.StringNode));
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.set = function(e) {
  var x = e.pop();
  e.push(new ode.BooleanNode(x instanceof ode.SetNode));
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.list = function(e) {
  var x = e.pop();
  e.push(new ode.BooleanNode(x instanceof ode.ListNode));
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.logical = function(e) {
  var x = e.pop();
  e.push(new ode.BooleanNode(x instanceof ode.BooleanNode));
};


/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.small = function(e) {
  var x = e.pop();

  if (x.toNumberValue) {
    var xn = x.toNumberValue();
    e.push(new ode.BooleanNode(xn === 0 || xn === 1));
  } else if (x.getSize) {
    var xl = x.getSize();
    e.push(new ode.BooleanNode(xl === 0 || xl === 1));
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
    var y = e.pop();
    var x = e.pop();

    if (x.toNumberValue && y.toNumberValue) {

      var result = eval(x.toNumberValue().toString() +
        javaScriptOperatorString + y.toNumberValue().toString());

      if (result) {
        e.push(new ode.BooleanNode(true));
      } else {
        e.push(new ode.BooleanNode(false));
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
    var y = e.pop();
    var x = e.pop();

    if (x.toNumberValue && y.toNumberValue) {

      // Spaces must be here or negative numbers can cause problem
      var result = eval(x.toNumberValue().toString() + ' ' +
        javaScriptOperatorString + ' ' + y.toNumberValue().toString());

      e.push(new ode.NumberNode(result));

    } else {
      e.expectationError(operationName, 'number, number', [x, y]);
    }
  };
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.print = function(e) {
  var x = e.pop();

  if (x instanceof ode.NumberNode) {
    e.print(x.toString());
  } else if (x instanceof ode.ListNode) {
    e.print(x.toString());
  } else if (x instanceof ode.SymbolNode) {
    e.print(x.toString());
  } else {
    e.expectationError('.', 'number, name, or list', [x]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.dup = function(e) {
  e.duplicate(0);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.dupd = function(e) {
  e.duplicate(1);
  e.moveToTop(1);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.dupLocation = function(e) {
  var x = e.pop();

  if (x.toNumberValue) { // Can x be converted to a number value?
    var position = x.toNumberValue();
    e.duplicate(position);
  } else {
    e.expectationError('dup#', 'number', [x]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.swap = function(e) {
  var x = e.pop();
  var y = e.pop();
  e.push(x);
  e.push(y);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.i = function(e) {
  var x = e.pop();

  if (x instanceof ode.ListNode) {
    e.runNestableNodes(x.getNodes());
  } else {
    e.expectationError('i', 'list', [x]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.ifte = function(e) {
  var pelse = e.pop();
  var pthen = e.pop();
  var pif = e.pop();

  if (extras.hasInstances(ode.ListNode, pif, pthen, pelse)) {

    var predicateResult = ode.joynatives.executeListAndPreserveStack_(e, pif);

    // Can predicateResult be converted to a boolean value?
    if (predicateResult.toBooleanValue) {
      if (predicateResult.toBooleanValue()) {
        e.push(pthen);
      } else {
        e.push(pelse);
      }
      ode.joynatives.i(e);
    } else {
      e.expectationError('ifte', 'boolean', [predicateResult]);
    }
  } else {
    e.expectationError(
      'ifte',
      'if-list, then-list, else-list',
      [pif, pthen, pelse]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.dropLocation = function(e) {
  var x = e.pop();

  if (x.toNumberValue) { // Can x be converted to a number value?
    var position = x.toNumberValue();

    if (extras.isInteger(position) && (position >= 0)) {
      e.drop(position);
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
  e.pop();
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.dip = function(e) {
  var computation = e.pop();

  if (!(computation instanceof ode.ListNode)) {
    e.expectationError('dip', 'list', [computation]);
  }

  var saved = e.pop();
  e.push(computation);
  ode.joynatives.i(e);
  e.push(saved);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.numberPredicate = function(e) {
  var x = e.pop();

  if (x instanceof ode.NumberNode) {
    e.push(new ode.NumberNode(1));
  } else {
    e.push(new ode.NumberNode(0));
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.blockPredicate = function(e) {
  var x = e.pop();

  if (x instanceof ode.ListNode) {
    e.push(new ode.NumberNode(1));
  } else {
    e.push(new ode.NumberNode(0));
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.emptyPredicate = function(e) {
  var x = e.pop();

  if (x instanceof ode.ListNode) {
    if (x.getSize() === 0) {
      e.push(new ode.NumberNode(1));
    } else {
      e.push(new ode.NumberNode(0));
    }
  } else {
    e.expectationError('empty?', 'list', [x]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.concat = function(e) {
  var y = e.pop();
  var x = e.pop();

  if (x.concatenate && x.canConcatenateWith && x.canConcatenateWith(y)) {
    e.push(x.concatenate(y));
  } else {
    e.expectationError('concat', 'two compatible aggregates', [x, y]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.size = function(e) {
  var x = e.pop();

  if (x.getSize) {
    e.push(new ode.NumberNode(x.getSize()));
  } else {
    e.expectationError('size', 'aggregate', [x]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.cons = function(e) {
  var y = e.pop();
  var x = e.pop();

  if (y.prependNode && y.canPrependNode && y.canPrependNode(x)) {
    e.push(y.prependNode(x));
  } else {
    e.expectationError('cons', ['element', 'compatible aggregate'], [x, y]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.swons = function(e) {
  var x = e.pop();
  var y = e.pop();

  if (y.prependNode && y.canPrependNode && y.canPrependNode(x)) {
    e.push(y.prependNode(x));
  } else {
    e.expectationError('swons', ['compatible aggregate', 'element'], [x, y]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.uncons = function(e) {
  var x = e.pop();

  if (x.getFirst && x.getRest && x.getSize) {

    if (x.getSize() === 0) {
      e.expectationError('uncons', ['non-empty aggregate'], [x]);
    }

    e.push(x.getFirst());
    e.push(x.getRest());

  } else {
    e.expectationError('uncons', ['aggregate'], [x]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.first = function(e) {
  var x = e.pop();

  if (x.getFirst && x.getSize) {

    if (x.getSize() === 0) {
      e.expectationError('first', ['non-empty aggregate'], [x]);
    }

    e.push(x.getFirst());

  } else {
    e.expectationError('first', ['aggregate'], [x]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.rest = function(e) {
  var x = e.pop();

  if (x.getRest && x.getSize) {

    if (x.getSize() === 0) {
      e.expectationError('rest', ['non-empty aggregate'], [x]);
    }

    e.push(x.getRest());

  } else {
    e.expectationError('rest', ['aggregate'], [x]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.block = function(e) {
  e.runCreateList(1);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.blockLocation = function(e) {
  var x = e.pop();

  if (x.toNumberValue) { // Can x be converted to a number value?
    var length = x.toNumberValue();

    if (extras.isInteger(length) && (length >= 0)) {
      e.runCreateList(length);
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
      e.moveToTop(n);
    });
  };
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.infra = function(e) {
  var quote = e.pop();
  var list = e.pop();

  if (extras.hasInstances(ode.ListNode, quote, list)) {

    e.enterFrame();

    // Push the list as the new stack.
    var listNodes = extras.reverseArray(list.getNodes());
    extras.each(listNodes, function(node) {
      e.push(node);
    });

    // Execute the quote in the new stack.
    e.push(quote);
    ode.joynatives.i(e);

    var stackNodes = extras.reverseArray(e.getStackNodes());

    e.exitFrame();

    e.push(new ode.ListNode(stackNodes));
  } else {
    e.expectationError('infra', 'list, quote', [list, quote]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.type = function(e) {
  var x = e.pop();

  if (x instanceof ode.SymbolNode) {
    e.push(new ode.ListNode([new ode.SymbolNode('name')]));
  } else if (x instanceof ode.NumberNode) {
    e.push(new ode.ListNode([new ode.SymbolNode('number')]));
  } else if (x instanceof ode.ListNode) {
    e.push(new ode.ListNode([new ode.SymbolNode('list')]));
  } else {
    e.push(new ode.ListNode([new ode.SymbolNode('?')]));
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.body = function(e) {

  var node = e.pop();
  var name;

  if (extras.hasInstances(ode.ListNode, node)) {
    if (node.getSize() !== 1) {
      e.expectationError('body', 'name in a list', [node]);
    }

    name = node.getNodes()[0];

    if (!extras.hasInstances(ode.SymbolNode, name)) {
      e.expectationError('body', 'name in list', [node]);
    }
  } else if (extras.hasInstances(ode.SymbolNode, node)) {
    name = node;
  } else {
    e.expectationError('body', 'name or name in list', [name]);
  }

  var body = e.symbolTable.get(name.toString());
  var result;

  if (body instanceof ode.CustomDefinitionBody) {
    result = new ode.ListNode(body.phraseNode.getNodes());
  } else if (body instanceof ode.NativeDefinitionBody) {
    result = new ode.ListNode([new ode.SymbolNode('native')]);
  } else {
    result = new ode.ListNode([new ode.SymbolNode('unknown')]);
  }

  e.push(result);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.primrec = function(e) {
  var computation = e.pop();
  var initialList = e.pop();

  if (extras.hasInstances(ode.ListNode, computation, initialList)) {

    var data = e.pop();

    if (data.toNumberValue) {

      var endingNumber = data.toNumberValue();

      // Execute initial list to calculate the starting value
      e.push(initialList);
      ode.joynatives.i(e);

      for (var i = endingNumber; i > 0; i--) {
        e.push(new ode.NumberNode(i));
        ode.joynatives.swap(e);
        e.push(computation);
        ode.joynatives.i(e);
      }

    } else if (data.getNodes) {

      var reversedNodes = extras.reverseArray(data.getNodes());

      // Execute initial list to calculate the starting value
      e.push(initialList);
      ode.joynatives.i(e);

      extras.each(reversedNodes, function(node, i) {
        e.push(node);
        ode.joynatives.swap(e);
        e.push(computation);
        ode.joynatives.i(e);
      });

    } else {
      e.expectationError(
        'primrec',
        'number or list, list, list',
        [data, initialList, computation]);
    }

  } else {
    e.expectationError(
      'primrec',
      'list, list',
      [initialList, computation]);
  }
};

/**
 * @private
 * @param {ode.Environment} e Current environment.
 * @param {ode.ListNode|ode.NestableNode} list List to execute.
 * @return {ode.NestableNode} The top node after executing the list.
 */
ode.joynatives.executeListAndPreserveStack_ = function(e, list) {

  // Preserve stack.
  ode.joynatives.stack(e);
  var preservedStack = e.pop();

  // Eval if.
  e.push(list);
  ode.joynatives.i(e);
  var result = e.pop();

  // Restore stack.
  e.push(preservedStack);
  ode.joynatives.unstack(e);

  return result;
};

/**
 * @private
 * @param {ode.Environment} e Current environment.
 * @param {ode.ListNode|ode.NestableNode} preservedStack List to restore
 * as the stack.
 */
ode.joynatives.restorePreservedStack_ = function(e, preservedStack) {
  // Restore stack.
  e.push(preservedStack);
  ode.joynatives.unstack(e);
};

/**
 * @private
 * @param {ode.Environment} e Current environment.
 * @return {ode.ListNode|ode.NestableNode} The stack preserved as a list.
 */
ode.joynatives.getPreservedStack_ = function(e) {
  // Preserve stack.
  ode.joynatives.stack(e);
  var preservedStack = e.pop();
  return preservedStack;
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.genrec = function(e) {
  var belse2 = e.pop();
  var belse1 = e.pop();
  var bthen = e.pop();
  var bif = e.pop();

  if (extras.hasInstances(ode.ListNode, bif, bthen, belse1, belse2)) {

    var result = ode.joynatives.executeListAndPreserveStack_(e, bif);

    if (result.toBooleanValue) {

      if (result.toBooleanValue()) {
        e.push(bthen);
        ode.joynatives.i(e);
      } else {
        e.push(belse1);
        ode.joynatives.i(e);
        e.push(
          new ode.ListNode(
            [bif, bthen, belse1, belse2, new ode.SymbolNode('genrec')]));
        e.push(belse2);
        ode.joynatives.i(e);
      }

    } else {
      e.expectationError(
        'genrec',
        'if-list that generates a boolean value',
        [bif]);
    }

  } else {
    e.expectationError(
      'genrec',
      'if-list, then-list, else1-list, else2-list',
      [bif, bthen, belse1, belse2]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.linrec = function(e) {
  var belse2 = e.pop();
  var belse1 = e.pop();
  var bthen = e.pop();
  var bif = e.pop();

  if (extras.hasInstances(ode.ListNode, bif, bthen, belse1, belse2)) {

    var result = ode.joynatives.executeListAndPreserveStack_(e, bif);

    if (result.toBooleanValue) {

      if (result.toBooleanValue()) {
        e.push(bthen);
        ode.joynatives.i(e);
      } else {
        e.push(belse1);
        ode.joynatives.i(e);
        e.push(
          new ode.ListNode(
            [bif, bthen, belse1, belse2, new ode.SymbolNode('linrec')]));
        ode.joynatives.i(e);
        e.push(belse2);
        ode.joynatives.i(e);
      }

    } else {
      e.expectationError(
        'linrec',
        'if-list that generates a boolean value',
        [bif]);
    }

  } else {
    e.expectationError(
      'linrec',
      'if-list, then-list, else1-list, else2-list',
      [bif, bthen, belse1, belse2]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.binrec = function(e) {
  var belse2 = e.pop();
  var belse1 = e.pop();
  var bthen = e.pop();
  var bif = e.pop();

  if (extras.hasInstances(ode.ListNode, bif, bthen, belse1, belse2)) {

    var result = ode.joynatives.executeListAndPreserveStack_(e, bif);

    if (result.toBooleanValue) {

      if (result.toBooleanValue()) {
        e.push(bthen);
        ode.joynatives.i(e);
      } else {
        e.push(belse1);
        ode.joynatives.i(e);

        var recursiveQuote = new ode.ListNode(
          [bif, bthen, belse1, belse2, new ode.SymbolNode('binrec')]);
        var second = e.pop();
        var first = e.pop();

        e.push(first);
        e.push(recursiveQuote);
        ode.joynatives.i(e);

        e.push(second);
        e.push(recursiveQuote);
        ode.joynatives.i(e);

        e.push(belse2);
        ode.joynatives.i(e);
      }

    } else {
      e.expectationError(
        'binrec',
        'if-list that generates a boolean value',
        [bif]);
    }

  } else {
    e.expectationError(
      'binrec',
      'if-list, then-list, else1-list, else2-list',
      [bif, bthen, belse1, belse2]);
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.map = function(e) {
  var f = e.pop();
  var v = e.pop();

  if (extras.hasInstances(ode.ListNode, f, v)) {
    var resultArray = [];

    e.enterFrame();

    extras.each(v.getNodes(), function(originalNode) {

      e.push(originalNode);
      e.push(f);
      ode.joynatives.i(e);

      extras.each(e.getStackNodes(), function(resultNode) {
        resultArray.push(resultNode);
      });

      e.emptyStack(); // clear stack for next iteration of the map

    });

    e.exitFrame();

    e.push(new ode.ListNode(resultArray));
  } else {
    e.expectationError('map', 'two lists', [f, v]);
  }
};

/**
 * @param {string} name The name of the operation.
 * @param {number} n The number of iterations.
 * @return {function(ode.Environment)} The native definition function.
 */
ode.joynatives.makeUnary = function(name, n) {
  /**
   * @param {ode.Environment} e Current environment.
   */
  return function(e) {

    var computation = e.pop();

    if (!(computation instanceof ode.ListNode)) {
      e.expectationError(name, 'list', [computation]);
    }

    var args = [];
    var results = [];
    var i;

    for (i = 0; i < n; i++) {
      args.unshift(e.pop());
    }

    var preservedStack = ode.joynatives.getPreservedStack_(e);

    for (i = 0; i < n; i++) {
      e.push(args[i]);
      e.push(computation);
      ode.joynatives.i(e);
      results.push(e.pop());
      ode.joynatives.restorePreservedStack_(e, preservedStack);
    }

    extras.each(results, function(node) {
      e.push(node);
    });
  };
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.fold = function(e) {
  var func = e.pop();
  var init = e.pop();
  var list = e.pop();

  if (!extras.hasInstances(ode.ListNode, func, list)) {
    e.expectationError('map', 'list,value,list', [list, init, func]);
  } else {

    e.enterFrame();

    e.push(init);

    extras.each(list.getNodes(), function(node) {
      e.push(node);
      e.push(func);
      ode.joynatives.i(e);
    });

    var stackNodes = e.getStackNodes();
    e.exitFrame();

    extras.each(stackNodes, function(node) {
      e.push(node);
    });
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.def = function(e) {

  var nameList = e.pop();
  var definitionList = e.pop();

  if (!extras.hasInstances(ode.ListNode, nameList, definitionList)) {
    e.expectationError(
      'def',
      ['list', 'list'],
      [nameList, definitionList]);
  }

  if (nameList.getSize() !== 1) {
    e.expectationError('def', ['name in a list'], [nameList]);
  }

  var name = nameList.getNodes()[0];

  if (!extras.hasInstances(ode.SymbolNode, name)) {
    e.expectationError('def', ['name in a list'], [name]);
  }

  var bodyPhraseNode = new ode.PhraseStatementNode(definitionList.getNodes());
  var bodyCustomDefinition = new ode.CustomDefinitionBody(bodyPhraseNode);
  e.symbolTable.set(name.val, bodyCustomDefinition);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.undef = function(e) {

  var nameList = e.pop();

  if (!extras.hasInstances(ode.ListNode, nameList)) {
    e.expectationError('undef', ['list'], [nameList]);
  }

  if (nameList.getSize() !== 1) {
    e.expectationError('undef', ['name in a list'], [nameList]);
  }

  var name = nameList.getNodes()[0];

  if (!extras.hasInstances(ode.SymbolNode, name)) {
    e.expectationError('undef', ['name in a list'], [name]);
  }

  e.symbolTable.drop(name.val);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.stack = function(e) {
  var list = new ode.ListNode(
    extras.reverseArray(
      e.getStackNodes()));
  e.push(list);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.unstack = function(e) {

  var list = e.pop();

  if (!extras.hasInstances(ode.ListNode, list)) {
    e.expectationError('unstack', 'list', [list]);
  }

  e.setStackNodes(extras.reverseArray(list.getNodes()));

};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.newstack = function(e) {
  e.emptyStack();
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.joynatives.throwError = function(e) {
  throw new ode.RuntimeCustomException();
};
