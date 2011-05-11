$(function() {

  module("Recursion Test");

  test("tail call optimization via 'self'", function() {
    // retain state
    FT.check("range = dup [0 >] [dup 1 - self] [] ifte", "", true);
    FT.check("4500 range .", "0");
  });

  test("without tail-call optimization", function() {
    // retain state
    FT.check("range = dup [0 >] [dup 1 - range] [] ifte", "", true);
    FT.check("50 range .", "0");
  });

});
