$(function() {

  module("Recursion Test");

  test("tail call optimization via 'self'", function() {
    // retain state
    Is.output("range = dup [0 >] [dup 1 - self] [] ifte", "", true);
    Is.output("4500 range .", "0");
  });

  test("without tail-call optimization", function() {
    // retain state
    Is.output("range = dup [0 >] [dup 1 - range] [] ifte", "", true);
    Is.output("50 range .", "0");
  });

});
