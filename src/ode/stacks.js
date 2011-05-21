/**
 * @constructor
 */
ode.RuntimeStack = function() {

  var array = [];

  this.top = function() {
    if (array.length === 0) {
      throw new ode.RuntimeStackException('Stack empty');
    }
    return array[array.length - 1];
  };

  this.pop = function() {
    if (array.length === 0) {
      throw new ode.RuntimeStackException('Stack empty');
    }
    return array.pop();
  };

  this.push = function(value) {
    if (array.length > 5000) {
      throw new ode.RuntimeStackException(
        'Stack has reached limit of 5000 items; Operation terminated');
    }
    array.push(value);
  };

  this.drop = function(position) {
    if (!extras.isBetween(0, position, array.length - 1)) {
      throw new ode.RuntimeStackException(
        'Attempted drop outside of stack bounds; stack size = ' +
          array.length + '; position = ' + position.toString());
    }
    if (!extras.isInteger(position)) {
      throw new ode.RuntimeStackException(
        'Drop expects non-negative integer, got: ' + position.toString());
    }
    array.splice(array.length - 1 - position, 1);
  };

  this.duplicate = function(position) {
    if (!extras.isBetween(0, position, array.length - 1)) {
      throw new ode.RuntimeStackException(
        'Attempted duplication outside of stack bounds; stack size = ' +
          array.length + '; position = ' + position.toString());
    }
    if (!extras.isInteger(position)) {
      throw new ode.RuntimeStackException(
        'Duplication expects non-negative integer, got: ' +
          position.toString());
    }
    array.push(array[array.length - 1 - position]);
  };

  this.rotate = function(n) {
    if (n > array.length) {
      throw new ode.RuntimeStackException(
        'Attempted to rotate more items than on stack; stack size = ' +
          array.length + '; number to rotate = ' + n);
    }
    array.push(array.splice(array.length - n, 1)[0]);
  };

  this.empty = function() {
    array = [];
  };

  this.toString = function() {
    return extras.mapMethod(array, 'toString').join(' ');
  };

  this.getInternalArray = function() {
    return array;
  };

  this.setInternalArray = function(a) {
    array = a;
  };

};

/**
 * @constructor
 */
ode.FrameStack = function() {
  var framesArray = [];

  this.push = function(elem) {
    framesArray.push(elem);
  };

  this.top = function() {
    if (framesArray.length === 0) {
      throw new ode.RuntimeStackException('Frame stack empty; Cannot get top');
    }
    return framesArray[framesArray.length - 1];
  };

  this.pop = function() {
    if (framesArray.length === 0) {
      throw new ode.RuntimeStackException('Frame stack empty; Cannot pop');
    }
    return framesArray.pop();
  };

  this.dropAllChildFrames = function() {
    while (framesArray.length > 1) {
      this.pop();
    }
  };

  this.getLength = function() {
    return framesArray.length;
  };
};
