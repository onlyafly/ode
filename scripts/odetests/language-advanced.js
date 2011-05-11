$(document).ready(function(){
    
module("Language - advanced");

test("$eval", function() {
  FT.check("y = 1 2 3 4 5 6 7 8 9 10; [y] $eval .", "[1 2 3 4 5 6 7 8 9 10]");
});

test("$type", function() {
  FT.check("[1 [] 3 four [5 6]] [$type] map .", "[[number] [block] [number] [name] [block]]");
});

test("$def", function() {
  FT.check("[block] $def .", "[native]");
  FT.check("double = 2 *; [double] $def .", "[2 *]");
  FT.check("[x] $def .", "[unknown]");
});

test("def", function() {
  FT.check("[+] [add] def", "", true);
  FT.clearResult();
  FT.check("1 2 add .", "3");
});

test("undef", function() {
  FT.check("[drop] [+] def", "", true);
  FT.clearResult();
  FT.check("1 2 + .", "1", true);
  FT.clearResult();
  FT.check("[+] undef", "", true);
  FT.clearResult();
  FT.check("1 2 + .", "3");
});

test("newstack", function() {
  FT.check("1 2 3 newstack stack .", "[]");
});

test("throw-error", function() {
  FT.checkException("throw-error", ode.RuntimeCustomException);
});

});