$(document).ready(function(){

//// Simplify testing

//// Actual tests

module("Integration - extras.js inheritance");

test("basic instantiation", function() {

  var Ball = function(color) {
    this.color = color;
  };

  var ball = new Ball("red");
  same(ball.color, "red");
});

test("basic inheritance", function() {

  var Animal = function(color) {
    this.color = color;
  };
  
  var Dog = function(color) {
    extras.base(this, color);
  };
  extras.inherits(Dog, Animal);

  var dog = new Dog("red");
  same(dog.color, "red");
  
});

test("virtual methods", function() {

  var Animal = function(color) {
    this.color = color;
  };
  Animal.prototype.getColor = function() {
    return this.color;
  };
  
  var Dog = function(color) {
    extras.base(this, color);
  };
  extras.inherits(Dog, Animal);
  
  var dog = new Dog("red");
  same(dog.getColor(), "red");
  
});


test("virtual methods with toString", function() {

  var Foo = function() {
  };
  Foo.prototype.toString = function() {
    return "from Foo";
  };
  
  var foo = new Foo();
  same(foo.toString(), "from Foo");

});

test("Person/Ninja test", function() {
  
  var personConstructorCalls = 0;
  
  var Person = function(isDancing) {
    this.dancing = isDancing;
    personConstructorCalls++;
  };
  Person.prototype.dance = function() {
    return this.dancing;
  };

  var Ninja = function() {
    extras.base(this, false);
  };
  extras.inherits(Ninja, Person);
  
  Ninja.prototype.dance = function() {
    return Person.prototype.dance.call(this);
  };
  Ninja.prototype.swingSword = function() {
    return true;
  };

  var p = new Person(true);
  ok( p.dance(), "Method returns the internal true value." );

  var n = new Ninja();
  ok( n.swingSword(), "Get true, as we expect." );
  ok( !n.dance(), "The inverse of the super method's value - false." );
  
  same( personConstructorCalls, 2, "Person constructor called only twice." );

  // Should all be true
  ok( p instanceof Person && n instanceof Ninja && n instanceof Person,
    "The objects inherit functionality from the correct sources." );
  
});

});