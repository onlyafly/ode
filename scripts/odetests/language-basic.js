$(document).ready(function(){
    


module("Language - optimizations");

test("tail call optimization via 'self'", function() {
  // retain state
  Is.output("range = dup [0 >] [dup 1 - self] [] ifte", "", true);
  Is.output("[5 range] $eval .", "[5 4 3 2 1 0]");
});

});