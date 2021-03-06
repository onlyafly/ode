// TODO

/** @type {Object} */
ode.natives = ode.natives || {};

/**
 * @param {ode.Interpreter} i The interpreter.
 */
ode.natives.initialize = function(i) {

  // IO
  i.addNativeOperation('.', ode.natives.print);

  // Math and Logic
  i.addNativeOperation('+', ode.natives.makeMathOperator('+', '+'));
  i.addNativeOperation('-', ode.natives.makeMathOperator('-', '-'));
  i.addNativeOperation('*', ode.natives.makeMathOperator('*', '*'));
  i.addNativeOperation('/', ode.natives.makeMathOperator('/', '/'));
  i.addNativeOperation('<', ode.natives.makeComparisonOperator('<', '<'));
  i.addNativeOperation('>', ode.natives.makeComparisonOperator('>', '>'));
  i.addNativeOperation('<=', ode.natives.makeComparisonOperator('<=', '<='));
  i.addNativeOperation('>=', ode.natives.makeComparisonOperator('>=', '>='));
  i.addNativeOperation('eq', ode.natives.makeComparisonOperator('===', 'eq'));

  // Control
  i.addNativeOperation('ifte', ode.natives.ifte);

  // Stack
  i.addNativeOperation('dup', ode.natives.dup);
  i.addNativeOperation('dup#', ode.natives.dupLocation);
  i.addNativeOperation('swap', ode.natives.swap);
  i.addNativeOperation('drop', ode.natives.drop);
  i.addNativeOperation('drop#', ode.natives.dropLocation);
  i.addNativeOperation('rot', ode.natives.makeRot(3));

  // Predicates
  i.addNativeOperation('number?', ode.natives.numberPredicate);
  i.addNativeOperation('block?', ode.natives.blockPredicate);
  i.addNativeOperation('empty?', ode.natives.emptyPredicate);

  // Advanced
  i.addNativeOperation('$eval', ode.natives.evaluate);
  i.addNativeOperation('$type', ode.natives.type);
  i.addNativeOperation('$def', ode.natives.dollarDef);
  i.addNativeOperation('def', ode.natives.def);
  i.addNativeOperation('undef', ode.natives.undef);
  i.addNativeOperation('newstack', ode.natives.newstack);
  i.addNativeOperation('throw-error', ode.natives.throwError);

  // List
  i.addNativeOperation('apply', ode.natives.apply);
  i.addNativeOperation('cat', ode.natives.cat);
  i.addNativeOperation('block', ode.natives.block);
  i.addNativeOperation('block#', ode.natives.blockLocation);
  i.addNativeOperation('cons', ode.natives.cons);
  i.addNativeOperation('uncons', ode.natives.uncons);
  i.addNativeOperation('stack', ode.natives.stack);
  i.addNativeOperation('unstack', ode.natives.unstack);
  i.addNativeOperation('length', ode.natives.length);

  // Functional
  i.addNativeOperation('map', ode.natives.map);
  i.addNativeOperation('fold', ode.natives.fold);
};

/**
 * @param {string} javaScriptOperatorString The operator in JavaScript.
 * @param {string} operationName The name of the operation in Ode.
 * @return {function(ode.Environment)} The native definition.
 */
ode.natives.makeComparisonOperator = function(javaScriptOperatorString,
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
      e.expectationError(operationName, 'number, number', x.toString() + ', ' +
        y.toString());
    }
  };
};

/**
 * @param {string} javaScriptOperatorString The operator in JavaScript.
 * @param {string} operationName The name of the operation in Ode.
 * @return {function(ode.Environment)} The native definition.
 */
ode.natives.makeMathOperator = function(javaScriptOperatorString,
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
      e.expectationError(operationName, 'number, number', x.toString() + ', ' +
        y.toString());
    }
  };
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.print = function(e) {
  var x = e.stack.pop();

  if (x instanceof ode.NumberNode) {
    e.print(x.toString());
  } else if (x instanceof ode.ListNode) {
    e.print(x.toString());
  } else if (x instanceof ode.SymbolNode) {
    e.print(x.toString());
  } else {
    e.expectationError('.', 'number, name, or block', x.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.dup = function(e) {
  e.stack.duplicate(0);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.dupLocation = function(e) {
  var x = e.stack.pop();

  if (x.toNumberValue) { // Can x be converted to a number value?
    var position = x.toNumberValue();
    e.stack.duplicate(position);
  } else {
    e.expectationError('dup#', 'number', x.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.swap = function(e) {
  var x = e.stack.pop();
  var y = e.stack.pop();
  e.stack.push(x);
  e.stack.push(y);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.apply = function(e) {
  var x = e.stack.pop();

  if (x instanceof ode.ListNode) {
    e.runNestableNodes(x.nodes);
  } else {
    e.expectationError('apply', 'block', x.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.ifte = function(e) {
  var pelse = e.stack.pop();
  var pthen = e.stack.pop();
  var pif = e.stack.pop();

  if (extras.hasInstances(ode.ListNode, pif, pthen, pelse)) {
    // eval if
    e.stack.push(pif);
    ode.natives.apply(e);
    var predicateResult = e.stack.pop();

    // Can predicateResult be converted to a boolean value?
    if (predicateResult.toBooleanValue) {
      if (predicateResult.toBooleanValue()) {
        e.stack.push(pthen);
      } else {
        e.stack.push(pelse);
      }
      ode.natives.apply(e);
    } else {
      e.expectationError('ifte', 'boolean', predicateResult.toString());
    }
  } else {
    e.expectationError('ifte', 'three blocks', pif.toString() + ',' +
      pthen.toString() + ',' + pelse.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.dropLocation = function(e) {
  var x = e.stack.pop();

  if (x.toNumberValue) { // Can x be converted to a number value?
    var position = x.toNumberValue();

    if (extras.isInteger(position) && (position >= 0)) {
      e.stack.drop(position);
    } else {
      e.expectationError('drop#', 'non-negative integer', x.toString());
    }
  } else {
    e.expectationError('drop#', 'number', x.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.drop = function(e) {
  e.stack.pop();
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.numberPredicate = function(e) {
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
ode.natives.blockPredicate = function(e) {
  var x = e.stack.pop();

  if (x instanceof ode.ListNode) {
    e.stack.push(new ode.NumberNode(1));
  } else {
    e.stack.push(new ode.NumberNode(0));
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.emptyPredicate = function(e) {
  var x = e.stack.pop();

  if (x instanceof ode.ListNode) {
    if (x.nodes.length === 0) {
      e.stack.push(new ode.NumberNode(1));
    } else {
      e.stack.push(new ode.NumberNode(0));
    }
  } else {
    e.expectationError('empty?', 'block', x.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.cat = function(e) {
  var y = e.stack.pop();
  var x = e.stack.pop();

  if (x instanceof ode.ListNode && y instanceof ode.ListNode) {
    e.stack.push(x.concatenate(y));
  } else {
    e.expectationError('cat', 'two blocks', x.toString() + ',' + y.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.cons = function(e) {
  var y = e.stack.pop();
  var x = e.stack.pop();

  if (y instanceof ode.ListNode) {
    e.stack.push(y.prepend(x));
  } else {
    e.expectationError('cons', 'node,block', x.toString() + ',' + y.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.uncons = function(e) {
  var x = e.stack.pop();

  if (x instanceof ode.ListNode) {
    if (x.nodes.length === 0) {
      e.expectationError('uncons', 'non-empty block', x.toString());
    }
    e.stack.push(x.nodes[0]);
    e.stack.push(new ode.ListNode(x.nodes.slice(1)));
  } else {
    e.expectationError('uncons', 'block', x.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.block = function(e) {
  e.runCreateList(1);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.blockLocation = function(e) {
  var x = e.stack.pop();

  if (x.toNumberValue) { // Can x be converted to a number value?
    var length = x.toNumberValue();

    if (extras.isInteger(length) && (length >= 0)) {
      e.runCreateList(length);
    } else {
      e.expectationError('block#', 'non-negative integer', x.toString());
    }
  } else {
    e.expectationError('block#', 'number', x.toString());
  }
};

/**
 * @param {number} n The nth item will be rotated to the front.
 * @return {function(ode.Environment)} The native definition.
 */
ode.natives.makeRot = function(n) {
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
ode.natives.evaluate = function(e) {
  var block = e.stack.pop();

  if (block instanceof ode.ListNode) {

    e.enterFrame();

    e.stack.push(block);
    ode.natives.apply(e);
    var stackNodes = e.getStackNodes();

    e.exitFrame();

    e.stack.push(new ode.ListNode(stackNodes));
  } else {
    e.expectationError('$eval', 'block', block.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.type = function(e) {
  var x = e.stack.pop();

  if (x instanceof ode.SymbolNode) {
    e.stack.push(new ode.ListNode([new ode.SymbolNode('name')]));
  } else if (x instanceof ode.NumberNode) {
    e.stack.push(new ode.ListNode([new ode.SymbolNode('number')]));
  } else if (x instanceof ode.ListNode) {
    e.stack.push(new ode.ListNode([new ode.SymbolNode('block')]));
  } else {
    e.stack.push(new ode.ListNode([new ode.SymbolNode('?')]));
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.dollarDef = function(e) {

  /** @type {ode.ListNode} */
  var block = e.stack.pop();

  if (!extras.hasInstances(ode.ListNode, block)) {
    e.expectationError('$def', 'block', block.toString());
  }

  if (block.nodes.length === 0) {
    e.expectationError('$def', 'name in a block', block.toString());
  }

  var name = block.nodes[0];

  if (!extras.hasInstances(ode.SymbolNode, name)) {
    e.expectationError('$def', 'name in a block', name.toString());
  }

  var body = e.symbolTable.get(name.toString());
  var result;

  if (body instanceof ode.CustomDefinitionBody) {
    result = new ode.ListNode(body.phraseNode.nodes);
  } else if (body instanceof ode.NativeDefinitionBody) {
    result = new ode.ListNode([new ode.SymbolNode('native')]);
  } else {
    result = new ode.ListNode([new ode.SymbolNode('unknown')]);
  }

  e.stack.push(result);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.map = function(e) {
  var f = e.stack.pop();
  var v = e.stack.pop();

  if (extras.hasInstances(ode.ListNode, f, v)) {
    var resultArray = [];

    e.enterFrame();

    extras.each(v.nodes, function(originalNode) {

      e.stack.push(originalNode);
      e.stack.push(f);
      ode.natives.apply(e);

      extras.each(e.getStackNodes(), function(resultNode) {
        resultArray.push(resultNode);
      });

      e.stack.empty(); // clear stack for next iteration of the map

    });

    e.exitFrame();

    e.stack.push(new ode.ListNode(resultArray));
  } else {
    e.expectationError('map', 'two blocks', f.toString() + ',' + v.toString());
  }
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.fold = function(e) {
  var func = e.stack.pop();
  var init = e.stack.pop();
  var block = e.stack.pop();

  if (!extras.hasInstances(ode.ListNode, func, block)) {
    e.expectationError('map', 'list,value,block', [block, init, func]);
  } else {

    e.enterFrame();

    e.stack.push(init);

    extras.each(block.nodes, function(node) {
      e.stack.push(node);
      e.stack.push(func);
      ode.natives.apply(e);
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
ode.natives.def = function(e) {

  /** @type {ode.ListNode} */
  var nameList = e.stack.pop();
  /** @type {ode.ListNode} */
  var definitionList = e.stack.pop();

  if (!extras.hasInstances(ode.ListNode, nameList, definitionList)) {
    e
      .expectationError(
        'def',
        ['block', 'block'],
        [nameList, definitionList]);
  }

  if (nameList.nodes.length !== 1) {
    e.expectationError('def', ['name in a block'], [nameList]);
  }

  var name = nameList.nodes[0];

  if (!extras.hasInstances(ode.SymbolNode, name)) {
    e.expectationError('def', ['name in a block'], [name]);
  }

  var bodyPhraseNode = new ode.PhraseStatementNode(definitionList.nodes);
  var bodyCustomDefinition = new ode.CustomDefinitionBody(bodyPhraseNode);
  e.symbolTable.set(name.val, bodyCustomDefinition);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.undef = function(e) {

  /** @type {ode.ListNode} */
  var nameList = e.stack.pop();

  if (!extras.hasInstances(ode.ListNode, nameList)) {
    e.expectationError('undef', ['block'], [nameList]);
  }

  if (nameList.nodes.length !== 1) {
    e.expectationError('undef', ['name in a block'], [nameList]);
  }

  var name = nameList.nodes[0];

  if (!extras.hasInstances(ode.SymbolNode, name)) {
    e.expectationError('undef', ['name in a block'], [name]);
  }

  e.symbolTable.drop(name.val);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.stack = function(e) {
  // Slice is used to get a shallow copy of the array.
  var nodes = e.stack.getInternalArray().slice();
  var block = new ode.ListNode(nodes);
  e.stack.push(block);
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.unstack = function(e) {

  /** @type {ode.ListNode} */
  var block = e.stack.pop();

  if (!extras.hasInstances(ode.ListNode, block)) {
    e.expectationError('unstack', 'block', [block]);
  }

  e.stack.setInternalArray(block.nodes);

};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.newstack = function(e) {
  e.stack.empty();
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.throwError = function(e) {
  throw new ode.RuntimeCustomException();
};

/**
 * @param {ode.Environment} e Current environment.
 */
ode.natives.length = function(e) {

  /** @type {ode.ListNode} */
  var block = e.stack.pop();

  if (!extras.hasInstances(ode.ListNode, block)) {
    e.expectationError('length', 'block', [block]);
  }

  var len = block.nodes.length;
  e.stack.push(new ode.NumberNode(len));

};
