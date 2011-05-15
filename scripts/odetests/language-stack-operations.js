$(document).ready(function(){
    
module("Language - stack operations");


test("pop#", function() {
  Is.output("1 2 3 4 0 pop# . .", "32");
  Is.output("1 2 3 4 1 pop# . .", "42");
  Is.output("1 2 3 4 2 pop# . . .", "431");
});


test("rot", function() {
  Is.output("4 3 2 1 rot . . . .", "3124");
});

});