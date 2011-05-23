/**
 * @constructor
 */
ode.Node = function() {
};

/**
 * @constructor
 * @extends {ode.Node}
 */
ode.NestableNode = function() {
  extras.base(this);
};
extras.inherits(ode.NestableNode, ode.Node);

// Atomic

/**
 * @constructor
 * @param {!*} val The value of the node.
 * @extends {ode.NestableNode}
 */
ode.AtomicNode = function(val) {
  extras.base(this);
  this.val = val;
};
extras.inherits(ode.AtomicNode, ode.NestableNode);

/** @inheritDoc */
ode.AtomicNode.prototype.toString = function() {
  return this.val.toString();
};

// Name

/**
 * @constructor
 * @extends {ode.AtomicNode}
 * @param {!*} val Value for this node.
 */
ode.NameNode = function(val) {
  extras.base(this, val);
};
extras.inherits(ode.NameNode, ode.AtomicNode);

/**
 * @return {string} The name of this symbol.
 */
ode.NameNode.prototype.getName = function() {
  return this.val.toString();
};

// Boolean

/**
 * @constructor
 * @extends {ode.AtomicNode}
 * @param {!boolean} val Value for this node.
 */
ode.BooleanNode = function(val) {
  extras.base(this, val);
};
extras.inherits(ode.BooleanNode, ode.AtomicNode);

/** @inheritDoc */
ode.BooleanNode.prototype.toString = function() {
  return this.val ? 'true' : 'false';
};

/**
 * @return {boolean} The boolean value of the node.
 */
ode.BooleanNode.prototype.toBooleanValue = function() {
  return this.val ? true : false;
};

// Character

/**
 * @constructor
 * @extends {ode.AtomicNode}
 * @param {!string} val Value for this node.
 */
ode.CharacterNode = function(val) {
  extras.base(this, val);
};
extras.inherits(ode.CharacterNode, ode.AtomicNode);

/** @inheritDoc */
ode.CharacterNode.prototype.toString = function() {
  return "'" + this.val;
};

// Number

/**
 * @constructor
 * @extends {ode.AtomicNode}
 * @param {!*} val Value for this node.
 */
ode.NumberNode = function(val) {
  extras.base(this, val);
};
extras.inherits(ode.NumberNode, ode.AtomicNode);

/** @inheritDoc */
ode.NumberNode.prototype.toString = function() {
  if (Math.floor(this.val) === this.val) {
    return Math.floor(this.val).toString();
  } else {
    return this.val.toString();
  }
};

/**
 * @return {boolean} The boolean value of the node.
 */
ode.NumberNode.prototype.toBooleanValue = function() {
  if (this.val === 0) {
    return false;
  } else if (this.val === 1) {
    return true;
  } else {
    throw new ode.RuntimeConversionException('number', 'boolean', this.val);
  }
};

/**
 * @return {number} The number value of the node.
 */
ode.NumberNode.prototype.toNumberValue = function() {
  return parseFloat(this.val.toString());
};

// Aggregate

/**
 * @constructor
 * @extends {ode.NestableNode}
 * @param {Array} nodes The nodes in the aggregate.
 */
ode.AggregateNode = function(nodes) {
  extras.base(this);

  /** @private */
  this.nodes_ = nodes;
};
extras.inherits(ode.AggregateNode, ode.NestableNode);

/**
 * @return {number} The size of the aggregate.
 */
ode.AggregateNode.prototype.getSize = function() {
  return this.nodes_.length;
};

/**
 * @return {Array} The nodes of the aggregate.
 */
ode.AggregateNode.prototype.getNodes = function() {
  return this.nodes_;
};

/**
 * @return {ode.NestableNode} The first node of the aggregate.
 */
ode.AggregateNode.prototype.getFirst = function() {
  return this.nodes_[0];
};

/**
 * @return {ode.AggregateNode} The nodes of the aggregate.
 */
ode.AggregateNode.prototype.getRest = function() {
  return new this.constructor(this.nodes_.slice(1));
};

// Block

/**
 * @constructor
 * @extends {ode.AggregateNode}
 * @param {Array.<ode.NestableNode>} nodes The nodes in the block.
 */
ode.BlockNode = function(nodes) {
  extras.base(this, nodes);
};
extras.inherits(ode.BlockNode, ode.AggregateNode);

/** @inheritDoc */
ode.BlockNode.prototype.toString = function() {
  if (this.nodes_.length > 0) {
    var stringList = extras.mapMethod(this.nodes_, 'toString');
    return '[' + stringList.join(' ') + ']';
  } else {
    return '[]';
  }
};

/**
 * @param {ode.AggregateNode} other The other node to concatenate.
 * @return {ode.BlockNode} The two nodes concatenated.
 */
ode.BlockNode.prototype.concatenate = function(other) {
  return new ode.BlockNode(this.nodes_.concat(other.getNodes()));
};

/**
 * @param {ode.AggregateNode} other The other node to concatenate.
 * @return {boolean} True if the two nodes can be concatenated.
 */
ode.BlockNode.prototype.canConcatenateWith = function(other) {
  return other.getNodes ? true : false;
};

/**
 * @param {ode.NestableNode} other The other node to prepend.
 * @return {ode.BlockNode} The new node.
 */
ode.BlockNode.prototype.prependNode = function(other) {
  return new ode.BlockNode([other].concat(this.nodes_));
};

/**
 * @param {ode.NestableNode} other The other node to prepend.
 * @return {boolean} True if the node can be prepended to this.
 */
ode.BlockNode.prototype.canPrependNode = function(other) {
  return other instanceof ode.NestableNode;
};

// Set

/**
 * @constructor
 * @extends {ode.AggregateNode}
 * @param {Array.<ode.AtomicNode>} nodes The atomic nodes in the set.
 */
ode.SetNode = function(nodes) {
  extras.base(this, nodes);
};
extras.inherits(ode.SetNode, ode.AggregateNode);

/** @inheritDoc */
ode.SetNode.prototype.toString = function() {
  if (this.nodes_.length > 0) {
    var stringList = extras.mapMethod(this.nodes_, 'toString');
    return '{' + stringList.join(' ') + '}';
  } else {
    return '{}';
  }
};

// String

/**
 * @constructor
 * @extends {ode.AggregateNode}
 * @param {string} val The value in this string node.
 */
ode.StringNode = function(val) {
  extras.base(this, null);

  this.val = val;
};
extras.inherits(ode.StringNode, ode.AggregateNode);

/** @inheritDoc */
ode.StringNode.prototype.toString = function() {
  if (this.val.length > 0) {
    return '"' + this.val + '"';
  } else {
    return '""';
  }
};

/**
 * @return {number} The size of the string.
 */
ode.StringNode.prototype.getSize = function() {
  return this.val.length;
};

/**
 * @param {ode.StringNode} other The other node to concatenate.
 * @return {ode.StringNode} The two nodes concatenated.
 */
ode.StringNode.prototype.concatenate = function(other) {
  return new ode.StringNode(this.val + other.val);
};

/**
 * @param {ode.AggregateNode} other The other node to concatenate.
 * @return {boolean} True if the two nodes can be concatenated.
 */
ode.StringNode.prototype.canConcatenateWith = function(other) {
  return other instanceof ode.StringNode;
};

/**
 * @param {ode.CharacterNode} other The other node to prepend.
 * @return {ode.StringNode} The new node.
 */
ode.StringNode.prototype.prependNode = function(other) {
  return new ode.StringNode(other.val + this.val);
};

/**
 * @param {ode.CharacterNode} other The other node to prepend.
 * @return {boolean} True if the node can be prepended to this.
 */
ode.StringNode.prototype.canPrependNode = function(other) {
  return other instanceof ode.CharacterNode;
};

/**
 * @return {Array} The nodes of the string.
 */
ode.StringNode.prototype.getNodes = function() {
  var i;
  var nodes = [];

  for (i = 0; i < this.val.length; i++) {
    nodes.push(new ode.CharacterNode(this.val.charAt(i)));
  }

  return nodes;
};

/**
 * @return {ode.NestableNode} The first node of the aggregate.
 */
ode.StringNode.prototype.getFirst = function() {
  return new ode.CharacterNode(this.val.charAt(0));
};

/**
 * @return {ode.StringNode} The nodes of the aggregate.
 */
ode.StringNode.prototype.getRest = function() {
  return new this.constructor(this.val.slice(1));
};

// Statement

/**
 * @constructor
 * @extends {ode.Node}
 */
ode.StatementNode = function() {
  extras.base(this);
};
extras.inherits(ode.StatementNode, ode.Node);

/**
 * @constructor
 * @extends {ode.StatementNode}
 * @param {Array.<ode.NestableNode>} nodes Nodes in this phrase.
 */
ode.PhraseStatementNode = function(nodes) {
  extras.base(this);

  /**
   * @type {Array.<ode.NestableNode>}
   * @private
   */
  this.nodes_ = nodes;
};
extras.inherits(ode.PhraseStatementNode, ode.StatementNode);

/** @inheritDoc */
ode.PhraseStatementNode.prototype.toString = function() {
  var stringList = extras.mapMethod(this.nodes_, 'toString');
  return stringList.join(' ');
};

/**
 * @return {Array.<ode.NestableNode>} The nodes of the phrase.
 */
ode.PhraseStatementNode.prototype.getNodes = function() {
  return this.nodes_;
};

/**
 * @constructor
 * @extends {ode.StatementNode}
 * @param {string} nameString The name of this definition.
 * @param {ode.PhraseStatementNode} bodyPhraseNode The body of the definition.
 */
ode.DefinitionStatementNode = function(nameString, bodyPhraseNode) {
  extras.base(this);

  /**
   * @type {string}
   */
  this.name = nameString;

  /**
   * @type {ode.PhraseStatementNode}
   */
  this.body = bodyPhraseNode;
};
extras.inherits(ode.DefinitionStatementNode, ode.StatementNode);

/** @inheritDoc */
ode.DefinitionStatementNode.prototype.toString = function() {
  return this.name + ' = ' + this.body.toString() + ';';
};

/**
 * @constructor
 * @extends {ode.Node}
 * @param {Array.<ode.StatementNode>} statementsArray The statements in the
 * program.
 */
ode.ProgramNode = function(statementsArray) {
  extras.base(this);

  /**
   * @type {Array.<ode.StatementNode>}
   */
  this.statements = statementsArray;
};
extras.inherits(ode.ProgramNode, ode.Node);

/** @inheritDoc */
ode.ProgramNode.prototype.toString = function() {
  var stringList = extras.mapMethod(this.statements, 'toString');
  return stringList.join('; ');
};
