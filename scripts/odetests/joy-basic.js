$(function() {

  module("Joy - definitions");

  test("native name redefinition", function() {
    Is.output("1 2 +; + == .; +", "3");
  });

  module("Joy - math operations");

  test("add", function() {
    Is.stack("3 4 +", "7");
  });

  test("pred", function() {
    Is.stack("4 pred", "3");
  });

  test("succ", function() {
    Is.stack("3 succ", "4");
  });

  test("subtract", function() {
    Is.stack("10 -5 -", "15");
    Is.stack("-10 5 -", "-15");
    Is.stack("-10 -5 -", "-5");
    Is.stack("0 -5 -", "5");
    Is.stack("42 10 -", "32");
    Is.stack("1.5 0.6 -", "0.9");
  });

  test("multiply", function() {
    Is.stack("2 3 *", "6");
  });

  test("divide", function() {
    Is.stack("5 2.5 /", "2");
  });

  module("Joy - boolean operations");

  test("and", function() {
    // TODO: how is true and false represented in Joy?
    ok(false);
  });

  test("less than", function() {
    Is.output("1 2 < .", "true");
    Is.output("1 1 < .", "false");
    Is.output("1 2 <= .", "true");
    Is.output("1 1 <= .", "true");
    Is.output("1 0 <= .", "false");
  });

  test("greater than", function() {
    Is.output("2 1 > .", "true");
    Is.output("1 1 > .", "false");
    Is.output("2 1 >= .", "true");
    Is.output("1 1 >= .", "true");
    Is.output("0 1 >= .", "false");
  });
  
  /*
   * Returns true for 0 and empty aggregates.
   */
  test("null", function() {
    Is.output("0 null", "true");
    Is.output("[] null", "true");
    Is.output("42 null", "false");
    Is.output("[42] null", "false");
  });
  
  /*
   * Returns true for integers less than 2 and for aggregates of less than two members.
   */
  test("small", function() {
    Is.output("0 small", "true");
    Is.output("1 small", "true");
    Is.output("2 small", "false");
    
    Is.output("[] small", "true");
    Is.output("[x] small", "true");
    Is.output("[x x] small", "false");
  });

  module("Joy - list operations");

  test("concat", function() {
    Is.stack("[B] [A] concat", "[B A]");
  });

  test("size", function() {
    Is.stack("[A] size", "1");
    Is.stack("[1 2 3 4] size", "4");
    Is.stack("[] size", "0");
    Is.exception("1 size", ode.RuntimeTypeException);
  });

  test("reverse", function() {
    Is.stack("[1 2 3] reverse", "[3 2 1]");
    Is.stack("[1] reverse", "[1]");
    Is.stack("[] reverse", "[]");
    Is.exception("1 reverse", ode.RuntimeTypeException);
  });

  test("cons", function() {
    Is.output("[B] [A] cons .", "[[B] A]");
  });

  test("uncons", function() {
    Is.output("[[B] A] uncons . .", "[A][B]");
    Is.output("[B A] uncons . .", "[A]B");
  });

  test("i", function() {
    Is.stack("[1 2 +] i", "3");
  });

  test("rest", function() {
    Is.stack("[1 2 +] rest", "[2 +]");
  });

  test("first", function() {
    Is.stack("[1 2 +] first", "[1]");
  });

  module("Joy - stack operations");

  test("dup", function() {
    Is.output("1 dup + .", "2");
    Is.output("1 2 3 4 0 dup# . .", "44");
    Is.output("1 2 3 4 1 dup# . .", "34");
    Is.output("1 2 3 4 2 dup# . . .", "243");
  });

  test("swap", function() {
    Is.output("2 1 swap / .", "0.5");
  });

  test("pop", function() {
    Is.output("2 1 pop .", "2");
    Is.output("1 2 3 4 0 pop# . .", "32");
    Is.output("1 2 3 4 1 pop# . .", "42");
    Is.output("1 2 3 4 2 pop# . . .", "431");
  });

  module("Joy - functional");

  test("map", function() {
    Is.output("[1 2 3] [dup] map .", "[1 1 2 2 3 3]");
    Is.output("[1 2 3 4] [dup *] map .", "[1 4 9 16]");
  });

  test("map - stack executes in sandbox", function() {
    // TODO: Not sure if this is Joy

    Is.exception("2 [1] [drop drop] map", null);

    // Check that after the map fails, all frames are dropped
    Is.exception("33 [66] [drop drop] map", null, true);
    Is.output(".", "33");
  });

  test("map - read only stack", function() {
    // TODO This doesn't seem right to me, but it is in faq1.html
    Is.stack("7 [[succ] [2 *] [dup *]] [i] map", "[8 14 49]");
  });

  test("fold", function() {
    Is.output("[1 2 3 4 5] 0 [+] fold .", "15");
    Is.output("[1 2 3 4 5] 1 [*] fold .", "120");

    // Check that after the fold fails, all frames are dropped
    Is.exception("33 [1] 0 [drop drop drop] fold", null, true);
    Is.output(".", "33");

    Is.output("[1 2 3 4 5] 0 [+] fold .", "15");
  });

  module("Joy - recursion operations");

  /*
   * In Joy there is a combinator for primitive recursion which has this pattern
   * built in and thus avoids the need for a definition. The primrec combinator
   * expects two quoted programs in addition to a data parameter. For an integer
   * data parameter it works like this: If the data parameter is zero, then the
   * first quotation has to produce the value to be returned. If the data
   * parameter is positive then the second has to combine the data parameter
   * with the result of applying the function to its predecessor. For the
   * factorial function the required quoted programs are very simple:
   * 
   * [1] [*] primrec
   * 
   * computes the factorial recursively. There is no need for any definition.
   * For example, the following program computes the factorial of 5:
   * 
   * 5 [1] [*] primrec
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
   * functions. It can also be used with data types other than integers. Joy has
   * many more combinators which can be used to calculate many functions without
   * forcing the user to give recursive or non-recursive definitions. Some of
   * the combinators are more data-specific than primrec, and others are far
   * more general.
   */
  test("primrec", function() {
    Is.stack("5  [1]  [*]  primrec", "120");
  });

  /*
   * A high proportion of recursively defined functions exhibit a very simple
   * pattern: There is some test, the if-part, which determines whether the
   * ground case obtains. If it does, then the non-recursive branch is executed,
   * the basis case of recursion. If it does not, then the recursive part is
   * executed, including one or more recursive calls.
   */
  test("linrec", function() {
    Is.stack("fact == [null]  [succ]  [dup pred]  [*]  linrec", "", true);
    Is.stack("5 fact", "120", true);
    Is.stack("[5 2 3] [fact] map", "[120 2 6]");
  });

  /*
   * In many recursive definitions there are two recursive calls of the function
   * being defined. This is the pattern of binary recursion, and it is used in
   * the usual definitions of quicksort and of the Fibonacci function. In
   * analogy with the linrec combinator for linear recursion, Joy has a binrec
   * combinator for binary recursion. The following will quicksort a list whose
   * members can be a mixture of anything except lists.
   */
  test(
    "binrec",
    function() {
      Is
        .stack(
          "quicksort == [small]  []  [uncons [>] split]  [swapd cons concat]  binrec",
          "",
          true);

      Is.stack("[3 1 2] quicksort", "[1 2 3]");
    });

  /*
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
    Is.stack("6 [small] [] [pred dup pred] [app2 +] genrec", "8");
    Is.stack(
      "[6 1 3 2] [small] [] [uncons [>] split] [app2 swapd cons concat] genrec",
      "[1 2 3 6]");
  });

  module("Joy - input/output");

  test("get", function() {
    ok(false); // TODO
  });

  test("put", function() {
    ok(false); // TODO
  });

  test("printing - numbers", function() {
    Is.output("0 .", "0");
    Is.output("1 .", "1");
    Is.output("1.1 .", "1.1");
  });

  test("printing - lists", function() {
    Is.output("[] .", "[]");
    Is.output("[1] .", "[1]");
  });

  module("Joy - control flow");

  test("ifte", function() {
    // TODO: how is true and false represented in Joy?
    Is.output("[1] [1 .] [2 .] ifte", "1");
  });

  module("Joy - definitions");

  test("body", function() {
    Is.output("double == 2 *; [double] first body .", "[2 *]");
  });

  module("Joy - stack");

  test("stack", function() {
    Is.stack("1 2 3 stack", "1 2 3 [1 2 3]");
  });

  test("unstack", function() {
    Is.stack("[1 2 3 x] unstack", "1 2 3 x");
    Is.stack("[] unstack", "");
  });

  /*
   * A list on the stack, such as [1 2 3 4] can be treated temporarily as the
   * stack by a quotation, say [+ *] and the combinator infra, with the result
   * [9 4].
   */
  test("infra", function() {
    Is.output("[1 2 3 4] [+ *] infra", "[9 4]");
  });

});
