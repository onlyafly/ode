$(function() {
  
  /***
   * ## ???
   */
  module("Advanced Joy - ???");
  
  
  
  /***
   * ### conts : -> [[P] [Q] ..]
   * 
   * Pushes current continuations. Buggy, do not use.
   */
  test("conts", function() {
    Is.stack("conts", ""); // TODO
  });
  
  /***
   * ### autoput : -> I
   * 
   * Pushes current value of flag for automatic output, I = 0..2.
   */
  test("autoput", function() {
    Is.stack("autoput", ""); // TODO
  });
  
  /***
   * ### undeferror : -> I
   * 
   * Pushes current value of undefined-is-error flag.
   */
  test("undeferror", function() {
    Is.stack("undeferror", ""); // TODO
  });
  
  /***
   * ### echo : -> I
   * 
   * Pushes value of echo flag, I = 0..3.
   */
  test("echo", function() {
    Is.stack("echo", ""); // TODO
  });
  
  /***
   * ### clock : -> I
   * 
   * Pushes the integer value of current CPU usage in hundreds 
   * of a second.
   */
  test("clock", function() {
    Is.stack("clock", ""); // TODO
  });
  
  /***
   * ### time : -> I
   * 
   * Pushes the current time (in seconds since the Epoch).
   */
  test("time", function() {
    Is.stack("time", ""); // TODO
  });
  
  /***
  localtime : I -> T
  Converts a time I into a list T representing local time: [year month day hour minute second isdst yearday weekday]. Month is 1 = January ... 12 = December; isdst is a Boolean flagging daylight savings/summer time; weekday is 0 = Monday ... 7 = Sunday.
  gmtime : I -> T
  Converts a time I into a list T representing universal time: [year month day hour minute second isdst yearday weekday]. Month is 1 = January ... 12 = December; isdst is false; weekday is 0 = Monday ... 7 = Sunday.
  mktime : T -> I
  Converts a list T representing local time into a time I. T is in the format generated by localtime.
  strftime : T S1 -> S2
  Formats a list T in the format of localtime or gmtime using string S1 and pushes the result S2.
   */
  test("random time functions", function() {
    ok(false); // TODO
  });
  
  /***
   * ## File I/O
   */
  module("Advanced Joy - File I/O");
  
  /***
   * ### File Literals
   * 
   * The type of references to open I/O streams, typically but not 
   * necessarily files. The only literals of this type are stdin, 
   * stdout, and stderr.
   */
  test("File Literals", function() {
    Is.stack("stdin stdout stderr","stdin stdout stderr");
    
    // TODO: what are file literals exactly?
    ok(false);
  });
  
  /***
   * ### get : -> F
   * 
   * Reads a factor from input and pushes it onto stack.
   */
  test("get", function() {
    ok(false); // TODO
  });
  
  /***
   * ### put : X ->
   * 
   * Writes X to output, pops X off stack.
   */  
  test("put", function() {
    ok(false); // TODO
  });
  
  /***
   * ### putch : N ->
   * 
   * N : numeric, writes character whose ASCII is N.
   */
  test("putch", function() {
    ok(false); // TODO
  });
  
  /***
   * ### putchars : "abc.." ->
   * 
   * Writes abc.. (without quotes)
   */  
  test("putchars", function() {
    ok(false); // TODO
  });
  
  /***
   * ## Sets
   */
  module("Advanced Joy - Sets");
  
  /***
   * ### setsize : -> N
   * 
   * Pushes the maximum number of elements in a set (platform
   * dependent). Typically it is 32, and set members are in the 
   * range 0..31.
   */
  test("setsize", function() {
    Is.stack("setsize", "32");
  });
  
  /***
   * ### or : X Y -> Z
   * 
   * Z is the union of sets X and Y.
   */
  test("or", function() {
    
    Is.stack('{1 2 3} {0 2 4} or', '{0 1 2 3 4}');
    
  });
  
  /***
   * ### xor : X Y -> Z
   * 
   * Z is the symmetric difference of sets X and Y.
   */
  test("xor", function() {
    
    Is.stack('{1 2 3} {0 2 4} xor', '{0 1 3 4}');
    
  });
  
  /***
   * ### and : X Y -> Z
   * 
   * Z is the intersection of sets X and Y.
   */
  test("and", function() {
    
    Is.stack('{1 2 3} {0 2 4} and', '{2}');
    
  });
  
  /***
   * ### not : X -> Y
   * 
   * Y is the complement of set X.
   */
  test("not", function() {

    ok(false); // TODO: how can we create a non-infinite set complement?
    
  });
  
  /***
   * ## Math
   */
  module("Advanced Joy - Math");
  
  /***
   * ### maxint : -> N
   * 
   * Pushes largest integer (platform dependent). Typically it is
   * 32 bits.
   */
  test("maxint", function() {
    Is.stack("maxint", "4294967295"); // 2 ^ 32 - 1
  });

  /***
   * ### sign : N1 -> N2
   * 
   * Integer N2 is the sign (-1 or 0 or +1) of integer N1, or float N2 is the sign (-1.0 or 0.0 or 1.0) of float N1.
   */
  test("sign", function() {
    Is.stack("-94563 sign", "-1");
  });
  
  /* TODO
  neg : I -> J
  Integer J is the negative of integer I. Also supports float.
  ord : C -> I
  Integer I is the Ascii value of character C (or logical or integer).
  chr : I -> C
  C is the character whose Ascii value is integer I (or logical or character).
  abs : N1 -> N2
  Integer N2 is the absolute value (0,1,2..) of integer N1, or float N2 is the absolute value (0.0 ..) of float N1
  acos : F -> G
  G is the arc cosine of F.
  asin : F -> G
  G is the arc sine of F.
  atan : F -> G
  G is the arc tangent of F.
  atan2 : F G -> H
  H is the arc tangent of F / G.
  ceil : F -> G
  G is the float ceiling of F.
  cos : F -> G
  G is the cosine of F.
  cosh : F -> G
  G is the hyperbolic cosine of F.
  exp : F -> G
  G is e (2.718281828...) raised to the Fth power.
  floor : F -> G
  G is the floor of F.
  frexp : F -> G I
  G is the mantissa and I is the exponent of F. Unless F = 0, 0.5 <= abs(G) < 1.0.
  ldexp : F I -> G
  G is F times 2 to the Ith power.
  log : F -> G
  G is the natural logarithm of F.
  log10 : F -> G
  G is the common logarithm of F.
  modf : F -> G H
  G is the fractional part and H is the integer part (but expressed as a float) of F.
  pow : F G -> H
  H is F raised to the Gth power.
  sin : F -> G
  G is the sine of F.
  sinh : F -> G
  G is the hyperbolic sine of F.
  sqrt : F -> G
  G is the square root of F.
  tan : F -> G
  G is the tangent of F.
  tanh : F -> G
  G is the hyperbolic tangent of F.
  trunc : F -> I
  I is an integer equal to the float F truncated toward zero.
  */
  test("random math operations", function() {
    ok(false);
  });
  
});
