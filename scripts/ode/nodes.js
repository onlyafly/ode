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

// Block

/**
 * @constructor
 * @extends {ode.NestableNode}
 * @param {Array.<ode.NestableNode>} nodes The nodes in the block.
 */
ode.BlockNode = function(nodes) {
  extras.base(this);

  /**
   * @type {Array.<ode.NestableNode>}
   */
  this.nodes = nodes;
};
extras.inherits(ode.BlockNode, ode.NestableNode);

/** @inheritDoc */
ode.BlockNode.prototype.toString = function() {
  if (this.nodes.length > 0) {
    var stringList = extras.mapMethod(this.nodes, 'toString');
    return '[' + stringList.join(' ') + ']';
  } else {
    return '[]';
  }
};

/**
 * @param {ode.BlockNode} otherBlockNode The block node to concatenate.
 * @return {ode.BlockNode} The two block nodes concatenated.
 */
ode.BlockNode.prototype.concatenate = function(otherBlockNode) {
  return new ode.BlockNode(this.nodes.concat(otherBlockNode.nodes));
};

/**
 * @param {ode.NestableNode} otherNode The node to insert at the beginning.
 * @return {ode.BlockNode} The block node with the other node prepended.
 */
ode.BlockNode.prototype.prepend = function(otherNode) {
  return new ode.BlockNode([otherNode].concat(this.nodes));
};

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
   */
  this.nodes = nodes;
};
extras.inherits(ode.PhraseStatementNode, ode.StatementNode);

/** @inheritDoc */
ode.PhraseStatementNode.prototype.toString = function() {
  var stringList = extras.mapMethod(this.nodes, 'toString');
  return stringList.join(' ');
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
