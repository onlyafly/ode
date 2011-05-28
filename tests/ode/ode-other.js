$(document).ready(function(){
    
  module("Language - math (number operations)");

  // TODO
  
//Numbers



test("number?", function() {
 Is.output("1 number? .","1");
 Is.output("[] number? .","0");
 Is.output("[1 2 3] number? .","0");
});

//Math

module("Language - math (boolean operations)");



module("Language - optimizations");

test("tail call optimization via 'self'", function() {
  // retain state
  Is.output("range = dup [0 >] [dup 1 - self] [] ifte", "", true);
  Is.output("[5 range] $eval .", "[5 4 3 2 1 0]");
});

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

test("length", function() {
  Is.output("[1 2 3 x] length .", "4");
  Is.output("[] length .", "0");
  Is.exception("6 length", ode.RuntimeException);
});

module("Language - names and definitions");

test("basic definitions", function() {
  Is.output("x = 1; x .", "1");
});

test("minus sign in names", function() {
  Is.output("- = 1; - .", "1");
  Is.output("-s = 1; -s .", "1");
  Is.output("-s-s- = -1; -s-s- .", "-1");
});

module("Language - stack operations");

test("dup#", function() {
  Is.output("1 2 3 4 0 dup# . .", "44");
  Is.output("1 2 3 4 1 dup# . .", "34");
  Is.output("1 2 3 4 2 dup# . . .", "243");
});


test("pop#", function() {
  Is.output("1 2 3 4 0 pop# . .", "32");
  Is.output("1 2 3 4 1 pop# . .", "42");
  Is.output("1 2 3 4 2 pop# . . .", "431");
});

module("Language - advanced");

test("$type", function() {
  Is.output("[1 [] 3 four [5 6]] [$type] map .", "[[number] [block] [number] [name] [block]]");
});



test("def", function() {
  Is.output("[+] [add] def", "", true);
  Is.clearResult();
  Is.output("1 2 add .", "3");
});

test("undef", function() {
  Is.output("[drop] [+] def", "", true);
  Is.clearResult();
  Is.output("1 2 + .", "1", true);
  Is.clearResult();
  Is.output("[+] undef", "", true);
  Is.clearResult();
  Is.output("1 2 + .", "3");
});

test("newstack", function() {
  Is.output("1 2 3 newstack stack .", "[]");
});

test("throw-error", function() {
  Is.exception("throw-error", ode.RuntimeCustomException);
});

});