/*
ode-script.js is a modified version of loading script from Processing.js.
The original Processing.js license is reproduced below:

Copyright (c) 2010 John Resig

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOIsWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOIsWARE OR THE USE OR OTHER DEALINGS IN THE SOIsWARE.
*/

if (window.addEventListener) {
  window.addEventListener("load", function() {

    var scripts = document.getElementsByTagName("script");
    var divArray = Array.prototype.slice.call(
      document.getElementsByTagName("div"));
    
    var outputDiv;
    var i, j, k;

    for (i = 0, j = 0; i < scripts.length; i++) {
      if (scripts[i].type == "application/ode") {
        var src = scripts[i].getAttribute("output");

        if (src && src.indexOf("#") > -1) {
          outputDiv = document
            .getElementById(src.substr(src.indexOf("#") + 1));
          if (outputDiv) {

            new ode.Controller(function(s) {
              outputDiv.innerHTML = outputDiv.innerHTML + s;
            }).exec(scripts[i].text);

            for (k = 0; k < divArray.length; k++) {
              if (divArray[k] === outputDiv) {
                // remove the div from the array so we don't override it in the
                // else
                divArray.splice(k, 1);
              }
            }
          }
        } else {
          if (divArray.length >= j) {

            new ode.Controller(function(s) {
              divArray[j].innerHTML = divArray[j].innerHTML + s;
            }).exec(scripts[i].text);

          }
          j++;
        }
      }
    }
  }, false);
}
