$(document).ready(function(){
    
module("Language - future core library");

test("recip", function() {
  Is.output("recip = dup [0 eq] [0] [1 swap /] ifte; 0.2 recip .", "5");
});

test("abs", function() {
  Is.output("abs = dup [0 <] [0 swap -] [] ifte; -42 abs .","42");
  Is.output("abs2 = 0 swap [dup [0 >=] [+] [-] ifte] apply; -33 abs2 .","33");
});

test("fibonacci", function() {
  Is.output("fib = dup [1 <=] [] [dup 1 - fib swap 2 - fib +] ifte; 10 fib .", "55");
});

test("factorial", function() {
  Is.output("factorial = dup [0 eq] [drop 1] [dup 1 - factorial *] ifte; 5 factorial .", "120");
  
  /* COMPARE
   * Joy saves the state of the stack before running the if clause
  Is.output("factorial = [0 eq] [drop 1] [dup 1 - factorial *] ifte; 5 factorial .", "120");
   */
});

test("boolean or", function() {
  // retain state on these
  Is.output("or = swap block [drop 1] [block [1] [0] ifte] ifte", "", true);
  Is.output("0 0 or .; 1 0 or .; 0 1 or .; 1 1 or .", "0111");
});

test("boolean and", function() {
  // retain state on these
  Is.output("and = swap block [block [1] [0] ifte] [drop 0] ifte", "", true);
  Is.output("0 0 and .; 1 0 and .; 0 1 and .; 1 1 and .", "0001");
});

/*
flatten = [dup [block?] [] [block] ifte] map [] [cat] fold
*/

});