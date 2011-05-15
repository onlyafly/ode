/**
 * extras.js - Library of extensions and helper methods compatible with Google
 * Closure Compiler.
 *
 * @author <a href="mailto:kevin@albrecht.net">Kevin Albrecht</a>
 */

/**
 * @namespace
 * @type {Object}
 */
var extras = extras || {};

/**
 * See: http://javascript.crockford.com/prototypal.html
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create
 *
 * @param {Object} o Object to create a new child object from.
 * @return {Object} A new object inheriting from the parameter.
 */
extras.createObject = function(o) {
  /** @constructor */
  var F = function() {
  };
  F.prototype = o;
  return new F();
};

/**
 * Implements pseudo-classical inheritance.
 *
 * @param {Function} childClass The class to make the child.
 * @param {Function} parentClass The class to make the parent.
 */
extras.inherits = function(childClass, parentClass) {

  /** @type {Object} */
  var childClassNewPrototype = extras.createObject(parentClass.prototype);

  childClass.parentClass_ = parentClass;
  childClassNewPrototype.constructor = childClass;
  childClass.prototype = childClassNewPrototype;
};

/**
 * Call up to the superclass. If this is called from a constructor, then this
 * calls the superclass constructor with arguments 1-N. This function only works
 * if you use extras.inherits to express inheritance relationships between your
 * classes.
 *
 * @param {!Object} me Should always be "this".
 * @param {...*} var_args The arguments to the base constructor. (This parameter
 * name is used by the Closure Compiler.).
 * @return {Object} This object after executing the parent constructor on it.
 */
extras.base = function(me, var_args) {
  var caller = arguments.callee.caller;
  if (caller.parentClass_) {
    // This is a constructor. Call the superclass constructor.
    return caller.parentClass_.apply(me, Array.prototype.slice.call(
      arguments,
      1));
  }
  return null;
};

/**
 * Generates a range from low to high, inclusive.
 *
 * @param {(number|string)} low The first item to return.
 * @param {(number|string)=} high The last item to return.
 * @param {number=} step The optional interval between items to return.
 * @return {Array} An array containing objects in the range low to high,
 * separated by the interval.
 */
extras.range = function(low, high, step) {
  var matrix = [];

  /** @type {number} */
  var inival;

  /** @type {number} */
  var endval;

  var plus;
  var walker = step || 1;
  var chars = false;

  if (typeof low === 'number' && typeof high === 'number') {
    inival = low;
    endval = high;
  } else if (typeof low === 'string' && typeof high === 'string') {
    chars = true;
    inival = low.charCodeAt(0);
    endval = high.charCodeAt(0);
  } else {
    inival = isNaN(low) ? 0 : parseInt(low, 10);
    endval = isNaN(high) ? 0 : parseInt(high, 10);
  }

  plus = ((inival > endval) ? false : true);
  if (plus) {
    while (inival <= endval) {
      matrix.push(((chars) ? String.fromCharCode(inival) : inival));
      inival += walker;
    }
  } else {
    while (inival >= endval) {
      matrix.push(((chars) ? String.fromCharCode(inival) : inival));
      inival -= walker;
    }
  }

  return matrix;
};

/**
 * Inclusive between.
 *
 * @param {*} low The lower bound of the range to check.
 * @param {*} value The value to check.
 * @param {*} high The upper bound of the range to check.
 * @return {boolean} True if the value is between low and high, inclusive.
 */
extras.isBetween = function(low, value, high) {
  return low <= value && value <= high;
};

/**
 * @param {*} value The value to check.
 * @return {boolean} True if the value is an integer.
 */
extras.isInteger = function(value) {
  if (Math.floor(value) === value) {
    return true;
  } else {
    return false;
  }
};

/**
 * @param {*} obj Object to test to see if it is an array.
 * @return {boolean} True if the argument is an array.
 */
extras.isArray = function(obj) {
  return obj instanceof Array;
};

/**
 * @param {Function} classFunction Class to check.
 * @param {...Object} var_args Instances of a class to check inheritance
 * against.
 * @return {boolean} True if the every argument is an instance of the class.
 */
extras.hasInstances = function(classFunction, var_args) {
  if (arguments.length === 1) {
    throw new TypeError();
  }

  var i;
  for (i = 1; i < arguments.length; i++) {
    if (!(arguments[i] instanceof classFunction)) {
      return false;
    }
  }

  return true;
};

/**
 * @param {Array} array Array of objects to map this method over.
 * @param {string} methodName The name of the method to map over the array.
 * @return {Array} A new array resulting from calling the method name on all the
 * elements of the array.
 */
extras.mapMethod = function(array, methodName) {
  var len = array.length;
  if (typeof methodName !== 'string')
    throw new TypeError();

  var res = new Array(len);
  var i;
  for (i = 0; i < len; i++) {
    if (i in array)
      res[i] = array[i][methodName]();
  }

  return res;
};

/**
 * @param {Array} array Array to check.
 * @param {*} possibleElement The object to test if it is contained in the
 * array.
 * @return {boolean} True if the possible element is in this array.
 */
extras.contains = function(array, possibleElement) {
  var len = array.length;

  var i;
  for (i = 0; i < len; i++) {
    if (array[i] === possibleElement) {
      return true;
    }
  }

  return false;
};

/**
 * @param {Array} array Array to check.
 * @param {!Array} arrayOfPossibleElements Array of possible elements.
 * @return {boolean} True if the array contains any element in the array of
 * possible elements.
 */
extras.containsAny = function(array, arrayOfPossibleElements) {
  if (extras.isArray(arrayOfPossibleElements)) {
    var i;
    for (i = 0; i < arrayOfPossibleElements.length; i++) {
      if (extras.contains(array, arrayOfPossibleElements[i])) {
        return true;
      }
    }
  } else {
    throw new TypeError();
  }
  return false;
};

/**
 * See
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
 *
 * @param {Object} o Object to get array of keys for.
 * @return {Array} The array of keys for the object.
 */
extras.keys = function(o) {

  if (o !== Object(o)) {
    throw new TypeError('extras.keys called on non-object');
  }

  var ret = [], p;

  for (p in o) {
    if (Object.prototype.hasOwnProperty.call(o, p)) {
      ret.push(p);
    }
  }

  return ret;
};

/**
 * @param {Array} array Array to loop through.
 * @param {Function} f Function to call on each element of the array.
 */
extras.each = function(array, f) {
  if (array === void 0 || array === null) {
    throw new TypeError();
  }

  var t = Object(array);
  var len = t.length >>> 0;
  if (typeof f !== 'function') {
    throw new TypeError();
  }

  for (var i = 0; i < len; i++) {
    if (i in t) {
      f.call(null, t[i], i, t);
    }
  }
};

/**
 * @param {Function} f A function to partially apply.
 * @param {Object|undefined} self Specifies the object which |this| should
 * point to when the function is run. If the value is null or undefined, it will
 * default to the global object.
 * @param {...*} var_args Additional arguments that are partially applied to the
 * function.
 * @return {!Function} A partially-applied form of the function bind() was
 * invoked as a method of.
 */
extras.bind = function(f, self, var_args) {

  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return f.apply(self, newArgs);
    };

  } else {
    return function() {
      return f.apply(self, arguments);
    };
  }
};

/**
 * @param {Array} arr The array to operate on.
 * @param {*} e The element to find in the array.
 * @return {Array} The array with one less occurance of the element.
 */
extras.withoutElement = function(arr, e) {
  var i = arr.indexOf(e);
  return arr.slice(0, i).concat(arr.slice(i + 1));
};
