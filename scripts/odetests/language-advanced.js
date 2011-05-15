$(document).ready(function(){
    
module("Language - advanced");

test("$type", function() {
  Is.output("[1 [] 3 four [5 6]] [$type] map .", "[[number] [block] [number] [name] [block]]");
});

test("$def", function() {
  Is.output("[block] $def .", "[native]");
  Is.output("double = 2 *; [double] $def .", "[2 *]");
  Is.output("[x] $def .", "[unknown]");
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