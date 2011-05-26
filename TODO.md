Ode Todo
========

General Rules
-------------

* Test for ability to be converted to a type, not for node type.

Known Issues
------------

* Numbers can reach values of "1.157920892373162e+77" or "Infinity",
  but the parser does not recognize them.

Goals for Next Release
----------------------

* Clean up website.
* Clean up joy-advanced.js, making it clear what is not currently
  supported.
* All FIXME comments.

Future Goals
------------

* All TODO comments.
* Website improvements:
  * Transition Joy tutorials to the website, and integrate them with
    the Ode mini shell.
* To achieve Joy compatibility:
  * Get all basic Joy language tests to pass.
  * Ensure that all tests match the requirements of the documentation.
  * Clean up wording in test documentation.
* Add Ode-specific operators to the documentation.
* Ensure that nearly all Joy code works with Ode
* Better document ode-script.js
* Graphics capabilities for Ode
* Node.js based server-side component to the IDE.
* Context for debugging: Context in errors: Error messages that show
  where the error occurred in the code... should be possible with the
  interpreter able to see what the current definition is.
* Replace the parser with a PEG.js parser.
* Improve throw-error with string arguments.
* Language features:
  * Sift through archives of Yahoo Concatenative group for ideas.
  * Shuffle operation: <http://www.nsl.com/papers/interview.htm>
  * Patterns from XY: <http://www.nsl.com/k/xy/xy.htm>