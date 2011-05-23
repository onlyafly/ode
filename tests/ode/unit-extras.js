$(document).ready(function(){

//// Simplify testing

//// Actual tests

module("Unit - extras");

test("hasInstances", function() {

  var Ball = function(color) {
    this.color = color;
  };

  var ball = new Ball("red");
  
  ok(extras.hasInstances(Ball, ball), "ball is an instance of Ball");
  ok(ball instanceof Ball, "ball instanceof Ball === true");
  
  same(ball.color, "red");
});

test("mapMethod", function() {

  var nums = [1, 2, 3];
  var actual = extras.mapMethod(nums, 'toString');
  var expected = ['1', '2', '3'];
  
  same(actual, expected);
});

test("withoutElement", function() {

  var a = [1, 2, 3];
  var actual, expected; 
  
  actual = extras.withoutElement(a, 1);
  expected = [2,3];
  same(actual, expected);
  
  actual = extras.withoutElement(a, 2);
  expected = [1,3];
  same(actual, expected);
  
  actual = extras.withoutElement(a, 3);
  expected = [1,2];
  same(actual, expected);
});

test("reverseArray", function() {

  var a = [1, 2, 3];
  var actual, expected; 
  
  actual = extras.reverseArray(a);
  expected = [3, 2, 1];
  same(actual, expected);
  
  actual = a;
  expected = [1, 2, 3];
  same(actual, expected, "Original array should be unchanged after reverse");
});

});