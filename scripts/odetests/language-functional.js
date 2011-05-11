$(document).ready(function(){
    
module("Language - functional");

// Numbers

test("map", function() {
  FT.check("[1 2 3] [dup] map .","[1 1 2 2 3 3]");
  FT.check("[1 2 3 4] [dup *] map .","[1 4 9 16]");
  FT.checkException("2 [1] [drop drop] map", null);
  
  // Check that after the map fails, all frames are dropped
  FT.checkException("33 [66] [drop drop] map", null, true); // true for retaining state
  FT.check(".","33");
});

test("fold", function() {
  FT.check("[1 2 3 4 5] 0 [+] fold .","15");
  FT.check("[1 2 3 4 5] 1 [*] fold .","120");
  
  // Check that after the fold fails, all frames are dropped
  FT.checkException("33 [1] 0 [drop drop drop] fold", null, true); // true for retaining state
  FT.check(".","33");
  
  FT.check("[1 2 3 4 5] 0 [+] fold .","15");
});

});
