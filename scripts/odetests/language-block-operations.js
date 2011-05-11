$(document).ready(function(){
    
module("Language - block operations");

test("block?", function() {
  FT.check("1 block? .","0");
  FT.check("[] block? .","1");
  FT.check("[1 2 3] block? .","1");
});

test("empty?", function() {
  FT.check("[] empty? .","1");
  FT.check("[1 2 3] empty? .","0");
});

test("block", function() {
  FT.check("1 2 3 4 block . . . .", "[4]321");
  FT.check("1 2 3 4 0 block# . . . . .", "[]4321");
  FT.check("1 2 3 4 1 block# . . . .", "[4]321");
  FT.check("1 2 3 4 2 block# . . .", "[3 4]21");
  FT.check("1 2 3 4 3 block# . .", "[2 3 4]1");
  FT.check("1 2 3 4 4 block# .", "[1 2 3 4]");
});

test("cat", function() {
  FT.check("[B] [A] cat .", "[B A]");
});

test("apply", function() {
  FT.check("[2 1] apply . .", "12");
  FT.check("4 2 block apply . .", "24");
});

test("cons", function() {
  FT.check("[B] [A] cons .", "[[B] A]");
});

test("uncons", function() {
  FT.check("[[B] A] uncons . .", "[A][B]");
  FT.check("[B A] uncons . .", "[A]B");
});

test("stack", function() {
  FT.check("1 2 3 stack . . . .", "[1 2 3]321");
});

test("unstack", function() {
  FT.check("[1 2 3 x] unstack . . . .", "x321");
  FT.checkException("[] unstack .", ode.RuntimeException);
});

test("length", function() {
  FT.check("[1 2 3 x] length .", "4");
  FT.check("[] length .", "0");
  FT.checkException("6 length", ode.RuntimeException);
});

});