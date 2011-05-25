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

Future Goals
------------

* To achieve Joy compatibility:
  * Get all basic Joy language tests to pass.
  * Ensure that all tests match the requirements of the documentation.
  * Clean up wording in test documentation.
* Add Ode-specific operators to the documentation.