$(document).ready(function(){
    
module("Language - printing");

test("printing numbers", function() {
  FT.check("0 .", "0");
  FT.check("1 .", "1");
  FT.check("1.1 .", "1.1");
});

test("printing numbers", function() {
  FT.check("[] .", "[]");
  FT.check("[1] .", "[1]");
});

module("Language - control operations");

test("ifte", function() {
  FT.check("[1] [1 .] [2 .] ifte", "1");
});

module("Language - other");

test("native name redefinition", function() {
  FT.check("1 2 +; + = .; +", "3");
});

module("Language - optimizations");

test("tail call optimization via 'self'", function() {
  // retain state
  FT.check("range = dup [0 >] [dup 1 - self] [] ifte", "", true);
  FT.check("[5 range] $eval .", "[5 4 3 2 1 0]");
});

});