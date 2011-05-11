$(document).ready(function(){
    
module("Language - math (number operations)");

// Numbers

test("negative numbers", function() {
  FT.check("1 5 - .","-4");
  FT.check("-1 -5 + .","-6");
});

test("number?", function() {
  FT.check("1 number? .","1");
  FT.check("[] number? .","0");
  FT.check("[1 2 3] number? .","0");
});

// Math

test("add", function() {
  FT.check("3 4 + .", "7");
});

test("subtract", function() {
  FT.check("10 -5 - .", "15");
  FT.check("-10 5 - .", "-15");
  FT.check("-10 -5 - .", "-5");
  FT.check("0 -5 - .", "5");
  FT.check("42 10 - .", "32");
  FT.check("1.5 0.6 - .", "0.9");
});

test("multiply", function() {
  FT.check("2 3 * .", "6");
});

test("divide", function() {
  FT.check("5 2.5 / .", "2");
});

module("Language - math (boolean operations)");

test("equality", function() {
  FT.check("1 0 eq .", "0");
  FT.check("1 1 eq .", "1");
});

test("less than", function() {
  FT.check("1 2 < .", "1");
  FT.check("1 1 < .", "0");
  FT.check("1 2 <= .", "1");
  FT.check("1 1 <= .", "1");
  FT.check("1 0 <= .", "0");
});

test("greater than", function() {
  FT.check("2 1 > .", "1");
  FT.check("1 1 > .", "0");
  FT.check("2 1 >= .", "1");
  FT.check("1 1 >= .", "1");
  FT.check("0 1 >= .", "0");
});

});