$(document).ready(function(){
    
module("Language - names and definitions");

test("basic definitions", function() {
  Is.output("x = 1; x .", "1");
});

test("minus sign in names", function() {
  Is.output("- = 1; - .", "1");
  Is.output("-s = 1; -s .", "1");
  Is.output("-s-s- = -1; -s-s- .", "-1");
});

});