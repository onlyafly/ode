/**
 * @constructor
 */
ode.AbstractDefinitionBody = function() {
};

/**
 * @constructor
 * @extends {ode.AbstractDefinitionBody}
 * @param {function(ode.Environment)} nativeFunction Function to run when this
 * native name is executed.
 */
ode.NativeDefinitionBody = function(nativeFunction) {
  extras.base(this);
  this.nativeFunction = nativeFunction;
};
extras.inherits(ode.NativeDefinitionBody, ode.AbstractDefinitionBody);

/**
 * @constructor
 * @extends {ode.AbstractDefinitionBody}
 * @param {ode.PhraseStatementNode} phraseNode Node containing the body of a
 * native name.
 */
ode.CustomDefinitionBody = function(phraseNode) {
  extras.base(this);
  this.phraseNode = phraseNode;
};
extras.inherits(ode.CustomDefinitionBody, ode.AbstractDefinitionBody);

/**
 * @constructor
 */
ode.SymbolTable = function() {
  this.natives = {};
  this.customs = {};
};

/**
 * @param {string} name Name of the symbol to set.
 * @param {ode.AbstractDefinitionBody} def Definition of this symbol.
 */
ode.SymbolTable.prototype.set = function(name, def) {
  if (def instanceof ode.CustomDefinitionBody) {
    this.customs[name] = def;
  } else if (def instanceof ode.NativeDefinitionBody) {
    this.natives[name] = def;
  } else {
    throw new ode.RuntimeException(
      'Symbol Table does not recognize definition type');
  }
};

/**
 * @param {string} name Name of the symbol to drop.
 */
ode.SymbolTable.prototype.drop = function(name) {
  if (this.customs[name]) {
    delete this.customs[name];
  } else if (this.natives[name]) {
    throw new ode.RuntimeException('Cannot drop native definitions');
  } else {
    throw new ode.RuntimeException('No definition found to drop');
  }
};

/**
 * @param {string} name Name of the symbol to get.
 * @return {ode.AbstractDefinitionBody} The definition body of this symbol.
 */
ode.SymbolTable.prototype.get = function(name) {
  if (this.customs[name]) {
    return this.customs[name];
  } else {
    return this.natives[name];
  }
};

/**
 * Empties the custom definitions.
 */
ode.SymbolTable.prototype.emptyCustomDefinitions = function() {
  this.customs = {};
};

/** @inheritDoc */
ode.SymbolTable.prototype.toString = function() {

  var output = '';

  extras.each([this.natives, this.customs], function(table) {
    extras.each(extras.keys(table), function(name) {
      output += name + ' = ';

      var definition = table[name];

      if (definition instanceof ode.CustomDefinitionBody) {
        output += definition.phraseNode.toString();
      } else if (definition instanceof ode.NativeDefinitionBody) {
        output += '<native definition>';
      } else {
        output += '<unknown>';
      }

      output += ';\n';
    });
  });

  return output;
};

/**
 * @param {string} separator String to use to separate definitions.
 * @return {string} The custom definitions in a single string.
 */
ode.SymbolTable.prototype.stringifyCustomDefinitions = function(separator) {

  var defs = [];
  var customs = this.customs; // "this" is not available in closure

  extras.each(extras.keys(this.customs), function(name) {
    var definition = customs[name];

    if (definition instanceof ode.CustomDefinitionBody) {
      defs.push(name + ' = ' + definition.phraseNode.toString() + ';');
    }
  });

  var output = defs.join(separator);
  return output;
};
