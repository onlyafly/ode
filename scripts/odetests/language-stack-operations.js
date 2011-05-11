$(document).ready(function(){
    
module("Language - stack operations");

test("dup", function() {
  FT.check("1 dup + .", "2");
  FT.check("1 2 3 4 0 dup# . .", "44");
  FT.check("1 2 3 4 1 dup# . .", "34");
  FT.check("1 2 3 4 2 dup# . . .", "243");
});

test("swap", function() {
  FT.check("2 1 swap / .", "0.5");
});

test("drop", function() {
  FT.check("2 1 drop .", "2");
  FT.check("1 2 3 4 0 drop# . .", "32");
  FT.check("1 2 3 4 1 drop# . .", "42");
  FT.check("1 2 3 4 2 drop# . . .", "431");
});

test("rot", function() {
  FT.check("4 3 2 1 rot . . . .", "3124");
});

});