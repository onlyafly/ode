$(document).ready(function(){
    
module("Language - block operations");

test("block?", function() {
  Is.output("1 block? .","0");
  Is.output("[] block? .","1");
  Is.output("[1 2 3] block? .","1");
});

test("empty?", function() {
  Is.output("[] empty? .","1");
  Is.output("[1 2 3] empty? .","0");
});

test("block", function() {
  Is.output("1 2 3 4 block . . . .", "[4]321");
  Is.output("1 2 3 4 0 block# . . . . .", "[]4321");
  Is.output("1 2 3 4 1 block# . . . .", "[4]321");
  Is.output("1 2 3 4 2 block# . . .", "[3 4]21");
  Is.output("1 2 3 4 3 block# . .", "[2 3 4]1");
  Is.output("1 2 3 4 4 block# .", "[1 2 3 4]");
});

test("apply", function() {
  Is.output("[2 1] apply . .", "12");
  Is.output("4 2 block apply . .", "24");
});

test("length", function() {
  Is.output("[1 2 3 x] length .", "4");
  Is.output("[] length .", "0");
  Is.exception("6 length", ode.RuntimeException);
});

});