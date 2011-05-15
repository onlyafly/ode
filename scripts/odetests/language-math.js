$(document).ready(function(){
    
module("Language - math (number operations)");

// Numbers

test("negative numbers", function() {
  Is.output("1 5 - .","-4");
  Is.output("-1 -5 + .","-6");
});

test("number?", function() {
  Is.output("1 number? .","1");
  Is.output("[] number? .","0");
  Is.output("[1 2 3] number? .","0");
});

// Math

module("Language - math (boolean operations)");

test("equality", function() {
  Is.output("1 0 eq .", "0");
  Is.output("1 1 eq .", "1");
});



});