$(document).ready(function(){
    
module("Language - names and definitions");

test("basic definitions", function() {
  FT.check("x = 1; x .", "1");
});

test("minus sign in names", function() {
  FT.check("- = 1; - .", "1");
  FT.check("-s = 1; -s .", "1");
  FT.check("-s-s- = -1; -s-s- .", "-1");
});

});