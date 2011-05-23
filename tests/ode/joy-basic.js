$(function() {

  /////////////////////////////////////////////////////////////////////////////
  
  /***
   * ## Literals
   */
  module("Joy - Literals");
  
  /***
   * ### Boolean Literals
   * 
   * The logical type, or the type of truth values. It has just two
   * literals: true and false.
   * 
   * `false` => false
   */
  test("Boolean Literals", function() {
    Is.stack("true", "true");
    Is.stack("false", "false");
  });
  
  /***
   * ### Character Literals
   * 
   * The type of characters. Literals are written with a single quote.
   * Examples: 'A '7 '; and so on. Unix style escapes are allowed.
   */
  test("Character Literals", function() {
    Is.stack("'A '7", "'A '7");
  });
  
  /***
   * ### Integer Literals
   * 
   * The type of negative, zero or positive integers. Literals are
   * written in decimal notation. Examples: -123 0 42.
   */
  test("Integer Literals", function() {
    Is.stack("1 5 -","-4");
    Is.stack("-1 -5 +","-6");
  });
  
  /***
   * ### Set Literals
   * 
   * The type of sets of small non-negative integers. The maximum is
   * platform dependent, typically the range is 0..31. Literals are 
   * written inside curly braces.
   * 
   * Examples:
   * 
   * - `{}`
   * - `{0}`
   * - `{1 3 5}` 
   * - `{19 18 17}`
   */
  test("Set Literals", function() {
    Is.stack("{} {0} {1 3 5} {19 18 17}","{} {0} {1 3 5} {19 18 17}");
  });
  
  /***
   * ### String Literals
   * 
   * The type of strings of characters. Literals are written inside 
   * double quotes. Examples: "" "A" "hello world" "123". Unix style 
   * escapes are accepted.
   */
  test("String Literals", function() {
    Is.stack('"" "A" "hello world" "123"','"" "A" "hello world" "123"');
  });
  
  /***
   * ### List Literals
   * 
   * The type of lists of values of any type (including lists), or the 
   * type of quoted programs which may contain operators or combinators. 
   * Literals of this type are written inside square brackets. 
   * 
   * Examples:
   * 
   * - `[]`
   * - `[3 512 -7]`
   * - `[john mary]`
   * - `['A 'C ['B]]`
   * - `[dup *]`
   */
  test("List Literals", function() {
    Is.stack("[3 512 -7]","[3 512 -7]");
    Is.stack("[john mary]","[john mary]");
    Is.stack("['A]","['A]");
    Is.stack("['A 'C ['B]]","['A 'C ['B]]");
    Is.stack("[dup *]","[dup *]");
    Is.stack("[]","[]");
  });
  
  /***
   * ### Float Literals
   * 
   * The type of floating-point numbers. Literals of this type are 
   * written with embedded decimal points (like 1.2) and optional 
   * exponent specifiers (like 1.5E2).
   */
  test("Float Literals", function() {
    Is.stack("1.0 5.0 -","-4");
    Is.stack("-1.0 -5.0 +","-6");
    Is.stack("1.5E2","150");
  });
  
  /////////////////////////////////////////////////////////////////////////////
  
  /***
   * ## Definitions and Symbols
   */
  module("Joy - Definitions and Symbols");

  /***
   * ### ==
   * 
   * Defines a definition.
   * 
   *     double == dup +;
   */
  test("native name redefinition", function() {
    Is.output("1 2 +; + == .; +", "3");
  });
  
  /***
   * ### name : sym -> "sym"
   * 
   * For operators and combinators, the string "sym" is the name of item sym,
   * for literals sym the result string is its type.
   */
  test("name", function() {
    Is.stack("[+ / example map] [name] map", '["+" "/" "example" "map"]');
    
    // TODO: not sure if this is real Joy
    Is.stack('[1 \'A [] "a" {} true false] [name] map', '["number" "character" "list" "string" "set" "boolean" "boolean"]');
  });
  
  /***
   * ### intern : "sym" -> sym
   * 
   * Pushes the item whose name is "sym".
   */
  test("intern", function() {
    Is.stack('"+" intern', '+');
    Is.stack('1 2 "+" intern [] cons i', '3');
    
    // Example from http://tech.groups.yahoo.com/group/concatenative/message/1561
    Is.stack('100 200 "p" "op" concat intern [] cons i', '100');
  });
  
  /////////////////////////////////////////////////////////////////////////////
  
  /***
   * ## Math
   */
  module("Joy - Math");
  
  /***
   * ### + : M I -> N
   * 
   * Numeric N is the result of adding integer I to numeric M. Also 
   * supports float.
   */
  test("add", function() {
    Is.stack("3 4 +", "7");
  });

  /**
   * ### pred : M -> N
   * 
   * Numeric N is the predecessor of numeric M.  
   */
  test("pred", function() {
    Is.stack("4 pred", "3");
  });

  /***
   * ### succ : M -> N
   * 
   * Numeric N is the successor of numeric M.
   */
  test("succ", function() {
    Is.stack("3 succ", "4");
  });

  /***
   * ### div : I J -> K L
   * 
   * Integers K and L are the quotient and remainder of dividing I by J.
   */
  test("div", function() {
    Is.stack("5 2 div", "2 1");
  });
  
  /***
   * ### rem : I J -> K
   * 
   * Integer K is the remainder of dividing I by J. Also supports float.
   */
  test("rem", function() {
    Is.stack("5 2 rem", "1");
  });
  
  /***
   * ### - : M I -> N
   * 
   * Numeric N is the result of subtracting integer I from numeric M. 
   * Also supports float.
   */
  test("subtract", function() {
    Is.stack("10 -5 -", "15");
    Is.stack("-10 5 -", "-15");
    Is.stack("-10 -5 -", "-5");
    Is.stack("0 -5 -", "5");
    Is.stack("42 10 -", "32");
    Is.stack("1.5 0.6 -", "0.9");
  });

  /***
   * ### * : I J -> K
   * 
   * Integer K is the product of integers I and J. Also supports float.
   */
  test("multiply", function() {
    Is.stack("2 3 *", "6");
  });

  /***
   * ### / : I J -> K
   * 
   * Integer K is the (rounded) ratio of integers I and J. Also 
   * supports float.
   */
  test("/", function() {
    Is.stack("5 2.5 /", "2");
  });

  /////////////////////////////////////////////////////////////////////////////
  
  /***
   * ## Boolean Operations
   */
  module("Joy - Boolean Operations");

  /***
   * ### choice : B T F -> X
   * 
   * If B is true, then X = T else X = F.
   */
  test("choice", function() {
    Is.stack('true 1 2 choice', '1');
    Is.stack('false 1 2 choice', '2');
  });
  
  /***
   * ### or : X Y -> Z
   * 
   * Z is the logical disjunction for truth values.
   */
  test("or", function() {

    Is.stack('true true or', 'true');
    Is.stack('false true or', 'true');
    Is.stack('true false or', 'true');
    Is.stack('false false or', 'false');
    
  });
  
  /***
   * ### xor : X Y -> Z
   * 
   * Z is the logical exclusive disjunction for truth values.
   */
  test("xor", function() {    
    Is.stack('true true xor', 'false');
    Is.stack('false true xor', 'true');
    Is.stack('true false xor', 'true');
    Is.stack('false false xor', 'false');    
  });
  
  /***
   * ### and : X Y -> Z
   * 
   * Z is the logical conjunction for truth values.
   */
  test("and", function() {
    Is.stack('true true and', 'true');
    Is.stack('false true and', 'false');
    Is.stack('true false and', 'false');
    Is.stack('false false and', 'false');
  });
  
  /***
   * ### not : X -> Y
   * 
   * Y is the logical negation for truth values.
   */
  test("not", function() {
    Is.stack('true not', 'false');
  });

  /***
   * ### >= : X Y -> B
   * 
   * Either both X and Y are numeric or both are strings or symbols. Tests whether X greater than or equal to Y. Also supports float.
   */
  test(">=", function() {
    Is.stack("2 1 >=", "true");
    Is.stack("1 1 >=", "true");
    Is.stack("0 1 >=", "false");
  });
  
  /***
   * ### > : X Y -> B
   * 
   * Either both X and Y are numeric or both are strings or symbols. Tests whether X greater than Y. Also supports float.
   */
  test(">", function() {
    Is.stack("2 1 >", "true");
    Is.stack("1 1 >", "false");
  });
  
  /***
   * ### != : X Y -> B
   * 
   * Either both X and Y are numeric or both are strings or symbols. Tests whether X not equal to Y. Also supports float.
   */
  test("!=", function() {
    Is.stack("1 0 !=", "true");
    Is.stack("1 1 !=", "false");
  });
  
  /***
   * ### = : X Y -> B
   * 
   * Either both X and Y are numeric or both are strings or symbols. Tests whether X equal to Y. Also supports float.
   */
  test("=", function() {
    Is.stack("1 0 =", "false");
    Is.stack("1 1 =", "true");
  });
  
  /***
   * ### < : X Y -> B
   * 
   * Either both X and Y are numeric or both are strings or symbols. Tests whether X less than Y. Also supports float.
   */
  test("<", function() {
    Is.stack("1 2 <", "true");
    Is.stack("1 1 <", "false");
  });

  /***
   * ### <= : X Y -> B
   * 
   * Either both X and Y are numeric or both are strings or symbols. Tests whether X less than or equal to Y. Also supports float.
   */
  test("<=", function() {
    Is.stack("1 2 <=", "true");
    Is.stack("1 1 <=", "true");
    Is.stack("1 0 <=", "false");
  });
  
  /***
   * ### null : X -> B
   * 
   * Tests for empty aggregate X or zero numeric.
   */
  test("null", function() {
    Is.stack("0 null", "true");
    Is.stack("[] null", "true");
    Is.stack("42 null", "false");
    Is.stack("[42] null", "false");
  });
  
  /***
   * ### small : X -> B
   * 
   * Tests whether aggregate X has 0 or 1 members, or numeric 0 or 1.
   */
  test("small", function() {
    Is.stack("0 small", "true");
    Is.stack("1 small", "true");
    Is.stack("2 small", "false");
    
    Is.stack("[] small", "true");
    Is.stack("[x] small", "true");
    Is.stack("[x x] small", "false");
  });
  
  /////////////////////////////////////////////////////////////////////////////

  /***
   * ## Aggregate Operations
   */
  module("Joy - Aggregate Operations");

  /***
   * ### concat : S T -> U
   * 
   * Sequence U is the concatenation of sequences S and T.
   */
  test("concat", function() {
    Is.stack("[B] [A] concat", "[B A]");
    Is.stack('"hello, " "world" concat', '"hello, world"');
  });

  /***
   * ### size : A -> I
   * 
   * Integer I is the number of elements of aggregate A.
   */
  test("size", function() {
    Is.stack("[A] size", "1");
    Is.stack("[1 2 3 4] size", "4");
    Is.stack("[] size", "0");
    Is.stack('"abcde" size', "5");
    Is.exception("1 size", ode.RuntimeException);
  });

  /***
   * ### cons : X A -> B
   * 
   * Aggregate B is A with a new member X (first member for sequences).
   */
  test("cons", function() {
    Is.stack("[B] [A] cons", "[[B] A]");
    Is.stack('\'a "bcd" cons', '"abcd"');
  });

  /***
   * ### uncons : A -> F R
   * 
   * F and R are the first and the rest of non-empty aggregate A.
   */
  test("uncons", function() {
    Is.stack("[[B] A] uncons", "[B] [A]");
    Is.stack("[B A] uncons", "B [A]");
    Is.stack('"abc" uncons', '\'a "bc"');
  });

  /***
   * ### i : [P] -> ...
   *
   * Executes P. So, [P] i == P.
   */
  test("i", function() {
    Is.output("[2 1] i . .", "12");
    Is.output("4 2 block i . .", "24");
    Is.stack("[1 2 +] i", "3");
  });

  /***
   * ### rest : A -> R
   * 
   * R is the non-empty aggregate A with its first member removed.
   */
  test("rest", function() {
    Is.stack("[1 2 +] rest", "[2 +]");
  });

  /***
   * ### first : A -> F
   * 
   * F is the first member of the non-empty aggregate A.
   */
  test("first", function() {
    Is.stack("[1 2 +] first", "1");
  });
  
  /////////////////////////////////////////////////////////////////////////////

  /***
   * ## Functional Operations
   */
  module("Joy - Functional Operations");

  /***
   * ### map : A [P] -> B
   * 
   * Executes P on each member of aggregate A, collects results in same type aggregate B.
   */
  test("map", function() {
    Is.output("[1 2 3] [dup] map .", "[1 1 2 2 3 3]");
    Is.output("[1 2 3 4] [dup *] map .", "[1 4 9 16]");
  });

  /* TODO: Not sure if this is Joy
  test("map - stack executes in sandbox", function() {
    Is.exception("2 [1] [drop drop] map", null);

    // Check that after the map fails, all frames are dropped
    Is.exception("33 [66] [drop drop] map", null, true);
    Is.output(".", "33");
  });
  */

  /* TODO This doesn't seem right to me, but it is in faq1.html
  test("map - read only stack", function() {    
    Is.stack("7 [[succ] [2 *] [dup *]] [i] map", "[8 14 49]");
  });
  */

  /***
   * ### fold : A V0 [P] -> V
   * 
   * Starting with value V0, sequentially pushes members of aggregate A and combines with binary operator P to produce value V.  
   */
  test("fold", function() {
    Is.output("[1 2 3 4 5] 0 [+] fold .", "15");
    Is.output("[1 2 3 4 5] 1 [*] fold .", "120");

    // Check that after the fold fails, all frames are dropped
    Is.exception("33 [1] 0 [drop drop drop] fold", ode.RuntimeException, true);
    Is.output(".", "33");

    Is.output("[1 2 3 4 5] 0 [+] fold .", "15");
  });
  
  /***
   * ### split : A [B] -> A1 A2
   * 
   * Uses test B to split aggregate A into same type aggregates A1 and A2.
   * 
   * (Note: Preserves stack state before each test is run, restoring it after).
   */
  test("split", function() {
    Is.stack("[5 2 4 3 1] [3 <] split", "[2 1] [5 4 3]");
    Is.stack("3 [5 2 4 3 1] [>] split", "3 [2 1] [5 4 3]");
  });

  /////////////////////////////////////////////////////////////////////////////  
  
  /***
   * ## Recursion
   */
  module("Joy - Recursion");

  /***
   * ### primrec : X [I] [C] -> R
   * 
   * Executes I to obtain an initial value R0. For integer X uses increasing
   * positive integers to X, combines by C for new R. For aggregate X uses 
   * successive members and combines by C for new R.
   * 
   * The primrec combinator
   * expects two quoted programs in addition to a data parameter. For an integer
   * data parameter it works like this: If the data parameter is zero, then the
   * first quotation has to produce the value to be returned. If the data
   * parameter is positive then the second has to combine the data parameter
   * with the result of applying the function to its predecessor. For the
   * factorial function the required quoted programs are very simple:
   * 
   *     [1] [*] primrec
   * 
   * computes the factorial recursively. There is no need for any definition.
   * For example, the following program computes the factorial of 5:
   * 
   *     5 [1] [*] primrec
   * 
   * It first pushes the number 5 and then it pushes the two short quoted
   * programs. At this point the stack contains three elements. Then the primrec
   * combinator is executed. It pops the two quotations off the stack and saves
   * them elsewhere. Then primrec tests whether the top element on the stack
   * (initially the 5) is equal to zero. If it is, it pops it off and executes
   * one of the quotations, the [1] which leaves 1 on the stack as the result.
   * Otherwise it pushes a decremented copy of the top element and recurses. On
   * the way back from the recursion it uses the other quotation, [*], to
   * multiply what is now a factorial on top of the stack by the second element
   * on the stack. When all is done, the stack contains 120, the factorial of 5.
   * As may be seen from this program, the usual branching of recursive
   * definitions is built into the combinator. The primrec combinator can be
   * used with many other quotation parameters to compute quite different
   * functions. It can also be used with data types other than integers.
   */
  test("primrec", function() {
    // From Joy docs:
    Is.stack("5 [1] [*] primrec", "120");
    Is.stack("{1 2 3} [[]] [cons] primrec", "[1 2 3]");
    Is.stack("[1 2 3] [[]] [[] cons cons] primrec", "[1 [2 [3 []]]]");
  });

  /***
   * ### linrec : [P] [T] [R1] [R2] -> ...
   * 
   * Executes P. If that yields true, executes T. Else executes R1, recurses,
   * executes R2. 
   * 
   * A high proportion of recursively defined functions exhibit a very simple
   * pattern: There is some test, the if-part, which determines whether the
   * ground case obtains. If it does, then the non-recursive branch is executed,
   * the basis case of recursion. If it does not, then the recursive part is
   * executed, including one or more recursive calls.
   * 
   * The linrec combinator is 
   * very similar to the genrec combinator. The essential difference is that 
   * the bundled up quotation is immediately called before the rec2-part. 
   * Consequently it can only be used for linear recursion.
   */
  test("linrec", function() {
    Is.stack("fact == [null]  [succ]  [dup pred]  [*]  linrec", "", true);
    Is.output("5 fact .", "120", true);
    Is.stack("[5 2 3] [fact] map", "[120 2 6]");
  });

  /***
   * ### binrec : [B] [T] [R1] [R2] -> ...
   * 
   * Executes B. If that yields true, executes T. Else uses R1 to produce two 
   * intermediates, recurses on both, then executes R2 to combines their results.
   * 
   * In many recursive definitions there are two recursive calls of the function
   * being defined. This is the pattern of binary recursion, and it is used in
   * the usual definitions of quicksort and of the Fibonacci function. In
   * analogy with the linrec combinator for linear recursion, Joy has a binrec
   * combinator for binary recursion. The following will quicksort a list whose
   * members can be a mixture of anything except lists:
   * 
   *     quicksort ==
   *       [small]
   *       []
   *       [uncons [>] split]
   *       [swapd cons concat]
   *       binrec;
   * 
   * And an example using the above quicksort:
   * 
   * `[5 3 1 4 2] quicksort` => [1 2 3 4 5]
   */
  test("binrec", function() {
    Is.stack(
      "quicksort == [small]  []  [uncons [>] split]  [swapd cons concat]  binrec",
      "",
      true);
    Is.stack("[3 1 2] quicksort", "[1 2 3]");
    
    Is.stack("10 [small] [] [pred dup pred] [+] binrec", "55");
  });

  /***
   * ### genrec : [B] [T] [R1] [R2] -> ...
   * 
   * Executes B, if that yields true executes T. Else executes R1 and then
   * [[B] [T] [R1] [R2] genrec] R2.
   *
   * One of these is the genrec combinator which takes four program parameters
   * in addition to whatever data parameters it needs. Fourth from the top is an
   * if-part, followed by a then-part. If the if-part yields true, then the
   * then-part is executed and the combinator terminates. The other two
   * parameters are the rec1-part and the rec2part. If the if-part yields false,
   * the rec1-part is executed. Following that the four program parameters and
   * the combinator are again pushed onto the stack bundled up in a quoted form.
   * Then the rec2-part is executed, where it will find the bundled form.
   * Typically it will then execute the bundled form, either with i or with
   * app2, or some other combinator. The following pieces of code, without any
   * definitions, compute the factorial, the (naive) Fibonacci and quicksort.
   * The four parts are here aligned to make comparisons easier.
   */
  test("genrec", function() {
    Is.stack("5 [null] [succ] [dup pred] [i *] genrec", "120");
    /* TODO
    Is.stack("6 [small] [] [pred dup pred] [app2 +] genrec", "8");
    Is.stack(
      "[6 1 3 2] [small] [] [uncons [>] split] [app2 swapd cons concat] genrec",
      "[1 2 3 6]");
      */
  });

  /////////////////////////////////////////////////////////////////////////////
  
  /***
   * ## Input/Output
   */
  module("Joy - Input/Output");

  test("printing - numbers", function() {
    Is.output("0 .", "0");
    Is.output("1 .", "1");
    Is.output("1.1 .", "1.1");
  });

  test("printing - lists", function() {
    Is.output("[] .", "[]");
    Is.output("[1] .", "[1]");
  });
  
  /***
   * ### rand : -> I
   *
   * I is a random integer.
   */
  test("rand", function() {
    // TODO Is.output("rand", "");
  });

  /////////////////////////////////////////////////////////////////////////////
  
  /***
   * ## Control Flow
   */
  module("Joy - Control Flow");

  /***
   * ### ifte : [B] [T] [F] -> ...
   * 
   * Preserves the stack state, then executes B. The stack state is then
   * restored. If B yielded true, then executes T else executes F.
   */
  test("ifte", function() {
    Is.stack("[true] [1] [2] ifte", "1");
    Is.stack("10 [1000 >] [2 /] [3 *] ifte", "30");
  });

  /////////////////////////////////////////////////////////////////////////////
  
  /***
   * ## Definitions and Symbols
   */
  module("Joy - Definitions and Symbols");

  /***
   * ### undefs : -> [...]
   * 
   * Push a list of all undefined symbols in the current symbol table.
   */
  test("undefs", function() {
    // TODO Is.output("undefs", "[]"); 
  });
  
  /***
   * ### body : U -> [P]
   * 
   * Quotation [P] is the body of user-defined symbol U.
   * 
   * Example:
   * 
   * - ´double == 2 *; [double] first body´ => [2 *]
   * 
   * Ode only:
   * 
   * User-defined symbol U can be a name or a name in a list.
   */
  test("body", function() {
    
    // Ode-specific:
    Is.stack("[body] body", "[native]");
    Is.stack("double == 2 *; [double] body", "[2 *]");
    Is.stack("[x] body", "[unknown]");
    
    // Joy:
    Is.stack("double == 2 *; [double] first body", "[2 *]");
  });

  /////////////////////////////////////////////////////////////////////////////
  
  /***
   * ## Basic Stack Operations
   */
  module("Joy - Basic Stack Operations");

  /***
   * ### id : ->
   * 
   * Identity function, does nothing. Any program of the form P id Q
   * is equivalent to just P Q.
   */
  test("id", function() {
    Is.stack("id", "");
  });
  
  /***
   * ### dup : X -> X X
   * 
   * Pushes an extra copy of X onto stack.
   */
  test("dup", function() {
    Is.output("1 dup + .", "2");
  });

  /***
   * ### swap : X Y -> Y X
   * 
   * Interchanges X and Y on top of the stack.
   */
  test("swap", function() {
    Is.stack("2 1 swap", "1 2");
  });
  
  /***
   * ### rollup : X Y Z -> Z X Y
   * 
   * Moves X and Y up, moves Z down
   */
  test("rollup", function() {
    Is.stack("3 2 1 rollup", "1 3 2");
  });
  
  /***
   * ### rolldown : X Y Z -> Y Z X
   * 
   * Moves Y and Z down, moves X up.
   */
  test("rolldown", function() {
    Is.stack("3 2 1 rolldown", "2 1 3");
  });
  
  /***
   * ### rotate : X Y Z -> Z Y X
   * 
   * Interchanges X and Z.
   */
  test("rotate", function() {
    Is.stack("3 2 1 rotate", "1 2 3");
  });
  
  /**
   * ### popd : Y Z -> Z
   * 
   * As if defined by: popd == [pop] dip
   */
  test("popd", function() {
    Is.stack("2 1 popd", "1");
  });
  
  /**
   * ### dupd : Y Z -> Y Y Z
   * 
   * As if defined by: dupd == [dup] dip
   */
  test("dupd", function() {
    Is.stack("2 1 dupd", "2 2 1");
  });
  
  /**
   * ### swapd : X Y Z -> Y X Z
   * 
   * As if defined by: swapd == [swap] dip
   */
  test("swapd", function() {
    Is.stack("3 2 1 swapd", "2 3 1");
  });
  
  /**
   * ### rollupd : X Y Z W -> Z X Y W
   * 
   * As if defined by: rollupd == [rollup] dip
   */
  test("rollupd", function() {
    Is.stack("1 2 3 4 rollupd", "3 1 2 4");
  });
  
  /**
   * ### rolldownd : X Y Z W -> Y Z X W
   * 
   * As if defined by: rolldownd == [rolldown] dip
   */
  test("rolldownd", function() {
    Is.stack("1 2 3 4 rolldownd", "2 3 1 4");
  });
  
  /**
   * ### rotated : X Y Z W -> Z Y X W
   * 
   * As if defined by: rotated == [rotate] dip
   */
  test("rotated", function() {
    Is.stack("1 2 3 4 rotated", "3 2 1 4");
  });
  
  /***
   * ### pop : X ->
   * 
   * Removes X from top of the stack.
   */
  test("pop", function() {
    Is.stack("2 1 pop", "2");
  });
  
  /***
   * ### dip : X [P] -> ... X
   * 
   * Saves X, executes P, pushes X back.
   */
  test("dip", function() {
    Is.stack("1 2 3 [pop] dip", "1 3");
  });
  
  /////////////////////////////////////////////////////////////////////////////
  
  /***
   * ## Advanced Stack Operations
   */
  module("Joy - Advanced Stack");

  /***
   * ### newstack : ... -> 
   * 
   * Removes all items from the stack.
   */
  test("newstack", function() {
    Is.stack("1 2 3 newstack", "");
  });
  
  /***
   * ### stack : .. X Y Z -> .. X Y Z [Z Y X ..] 
   * 
   * Pushes the stack as a list.
   * 
   * (Note that when treating lists as stacks, the first element in the list
   * will be the top item of the stack.)
   */
  test("stack", function() {
    Is.stack("1 2 3 stack", "1 2 3 [3 2 1]");
    Is.stack("[A B C] uncons uncons uncons pop stack", "A B C [C B A]");
    Is.stack("stack", "[]");
  });
  
  /***
   * ### unstack : [X Y ..] -> ..Y X
   * 
   * The list [X Y ..] becomes the new stack.
   * 
   * (Note that when treating lists as stacks, the first element in the list
   * will be the top item of the stack.)
   */
  test("unstack", function() {
    Is.stack("[1 2 3 x] unstack", "x 3 2 1");
    Is.stack("[A B C] unstack", "C B A");
    Is.stack("[] unstack", "");
  });

  /***
   * ### infra : L1 [P] -> L2
   * 
   * Using list L1 as stack, executes P and returns a new list L2. The first
   * element of L1 is used as the top of stack, and after execution of P the 
   * top of stack becomes the first element of L2.  
   * 
   * (Note that when treating lists as stacks, the first element in the list
   * will be the top item of the stack.)
   */
  test("infra", function() {
    Is.stack("[1 2 3 4] [+ *] infra", "[9 4]");
    Is.output("[1 2 3 4] [.] infra", "1");
  });
  
  /***
   * ### unary : X [P] -> R
   * 
   * Executes P, which leaves R on top of the stack. No matter how many 
   * parameters this consumes, exactly one is removed from the stack.
   */
  test("unary", function() {
    Is.stack("1 2 3 4 [2 *] unary", "1 2 3 8");
  });
  
  /***
   * ### unary2 : X1 X2 [P] -> R1 R2
   * 
   * Executes P twice, with X1 and X2 on top of the stack. Returns the
   * two values R1 and R2.
   */
  test("unary2", function() {
    // From "The Algebra of Joy", these two tests should produce identical
    // results:
    Is.stack("2 3 5 [*] unary2 + [pop] dip", "16");
    Is.stack("2 3 5 + *", "16");
  });
  
  /***
   * ### unary3 : X1 X2 X3 [P] -> R1 R2 R3
   * 
   * Executes P three times, with Xi, returns Ri (i = 1..3).
   */
  test("unary3", function() {
    Is.stack("1 2 3 4 [2 *] unary3", "1 4 6 8");
  });
  
  /***
   * ### unary4 : X1 X2 X3 X4 [P] -> R1 R2 R3 R4
   * 
   * Executes P four times, with Xi, returns Ri (i = 1..4).
   */
  test("unary4", function() {
    Is.stack("0 1 2 3 4 [2 *] unary4", "0 2 4 6 8");
  });
  
  /* TODO
  strtol : S I -> J
  String S is converted to the integer J using base I. If I = 0, assumes base 10, but leading "0" means base 8 and leading "0x" means base 16.
  strtod : S -> R
  String S is converted to the float R.
  format : N C I J -> S
  S is the formatted version of N in mode C ('d or 'i = decimal, 'o = octal, 'x or 'X = hex with lower or upper case letters) with maximum width I and minimum width J.
  formatf : F C I J -> S
  S is the formatted version of F in mode C ('e or 'E = exponential, 'f = fractional, 'g or G = general with lower or upper case letters) with maximum width I and precision J.
  srand : I ->
  Sets the random integer seed to integer I.
  max : N1 N2 -> N
  N is the maximum of numeric values N1 and N2. Also supports float.
  min : N1 N2 -> N
  N is the minimum of numeric values N1 and N2. Also supports float.
  swons : A X -> B
  Aggregate B is A with a new member X (first member for sequences).
  compare : A B -> I
  I (=-1,0,+1) is the comparison of aggregates A and B. The values correspond to the predicates <=, =, >=.
  at : A I -> X
  X (= A[I]) is the member of A at position I.
  of : I A -> X
  X (= A[I]) is the I-th member of aggregate A.  
  opcase : X [..[X Xs]..] -> [Xs]
  Indexing on type of X, returns the list [Xs].
  case : X [..[X Y]..] -> Y i
  Indexing on the value of X, execute the matching Y.  
  unswons : A -> R F
  R and F are the rest and the first of non-empty aggregate A.
  drop : A N -> B
  Aggregate B is the result of deleting the first N elements of A.
  take : A N -> B
  Aggregate B is the result of retaining just the first N elements of A.  
  enconcat : X S T -> U
  Sequence U is the concatenation of sequences S and T with X inserted between S and T (== swapd cons concat)

  
  
   predicates:
  
  
  equal : T U -> B
  (Recursively) tests whether trees T and U are identical.
  has : A X -> B
  Tests whether aggregate A has X as a member.
  in : X A -> B
  Tests whether X is a member of aggregate A.
  integer : X -> B
  Tests whether X is an integer.
  char : X -> B
  Tests whether X is a character.
  logical : X -> B
  Tests whether X is a logical.
  set : X -> B
  Tests whether X is a set.
  string : X -> B
  Tests whether X is a string.
  list : X -> B
  Tests whether X is a list.
  leaf : X -> B
  Tests whether X is not a list.
  user : X -> B
  Tests whether X is a user-defined symbol.
  float : R -> B
  Tests whether R is a float.
  file : F -> B
  Tests whether F is a file. combinator
  x : [P]i -> ...
  Executes P without popping [P]. So, [P] x == [P] P.

  app1 : X [P] -> R
  Executes P, pushes result R on stack without X.
  app11 : X Y [P] -> R
  Executes P, pushes result R on stack.
  app12 : X Y1 Y2 [P] -> R1 R2
  Executes P twice, with Y1 and Y2, returns R1 and R2.
  construct : [P] [[P1] [P2] ..] -> R1 R2 ..
  Saves state of stack and then executes [P]. Then executes each [Pi] to give Ri pushed onto saved stack.
  nullary : [P] -> R
  Executes P, which leaves R on top of the stack. No matter how many parameters this consumes, none are removed from the stack.

  binary : X Y [P] -> R
  Executes P, which leaves R on top of the stack. No matter how many parameters this consumes, exactly two are removed from the stack.
  ternary : X Y Z [P] -> R
  Executes P, which leaves R on top of the stack. No matter how many parameters this consumes, exactly three are removed from the stack.
  cleave : X [P1] [P2] -> R1 R2
  Executes P1 and P2, each with X on top, producing two results.
  branch : B [T] [F] -> ...
  If B is true, then executes T else executes F.
  
  ifinteger : X [T] [E] -> ...
  If X is an integer, executes T else executes E.
  ifchar : X [T] [E] -> ...
  If X is a character, executes T else executes E.
  iflogical : X [T] [E] -> ...
  If X is a logical or truth value, executes T else executes E.
  ifset : X [T] [E] -> ...
  If X is a set, executes T else executes E.
  ifstring : X [T] [E] -> ...
  If X is a string, executes T else executes E.
  iflist : X [T] [E] -> ...
  If X is a list, executes T else executes E.
  iffloat : X [T] [E] -> ...
  If X is a float, executes T else executes E.
  iffile : X [T] [E] -> ...
  If X is a file, executes T else executes E.
  cond : [..[[Bi] Ti]..[D]] -> ...
  Tries each Bi. If that yields true, then executes Ti and exits. If no Bi yields true, executes default D.
  while : [B] [D] -> ...
  While executing B yields true executes D.
  
  tailrec : [P] [T] [R1] -> ...
  Executes P. If that yields true, executes T. Else executes R1, recurses.
    condlinrec : [ [C1] [C2] .. [D] ] -> ...
  Each [Ci] is of the forms [[B] [T]] or [[B] [R1] [R2]]. Tries each B. If that yields true and there is just a [T], executes T and exit. If there are [R1] and [R2], executes R1, recurses, executes R2. Subsequent case are ignored. If no B yields true, then [D] is used. It is then of the forms [[T]] or [[R1] [R2]]. For the former, executes T. For the latter executes R1, recurses, executes R2.
  step : A [P] -> ...
  Sequentially putting members of aggregate A onto stack, executes P for each member of A.
  
  times : N [P] -> ...
  N times executes P.
   filter : A [B] -> A1
  Uses test B to filter aggregate A producing sametype aggregate A1.

  some : A [B] -> X
  Applies test B to members of aggregate A, X = true if some pass.
  all : A [B] -> X
  Applies test B to members of aggregate A, X = true if all pass.
  treestep : T [P] -> ...
  Recursively traverses leaves of tree T, executes P for each leaf.
  treerec : T [O] [C] -> ...
  T is a tree. If T is a leaf, executes O. Else executes [[O] [C] treerec] C.
  treegenrec : T [O1] [O2] [C] -> ...
  T is a tree. If T is a leaf, executes O1. Else executes O2 and then [[O1] [O2] [C] treegenrec] C. miscellaneous commands

  */
  test('unimplemented/undocumented functions', function() {
    // TODO ok(false);
  });
  
  /////////////////////////////////////////////////////////////////////////////
  
  /***
   * ## Notes on Joy
   *
   * These operators are mentioned occassionally in Joy examples, but have been
   * replaced by new operations by Manfred von Thun, original author of Joy,
   * himself. 
   * 
   * ### app2 : X1 X2 [P] -> R1 R2
   * 
   * Obsolescent. == unary2
   * 
   * ### app3 : X1 X2 X3 [P] -> R1 R2 R3
   * 
   * Obsolescent. == unary3
   * 
   * ### app4 : X1 X2 X3 X4 [P] -> R1 R2 R3 R4
   * 
   * Obsolescent. == unary4
   */

});
