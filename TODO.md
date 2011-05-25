Ode Todo
========

General Rules
-------------

* Test for ability to be converted to a type, not for node type.

Work for Joy Compatibility
--------------------------

* Get all basic Joy language tests to pass.
* Ensure that all tests match the requirements of the documentation.
* Clean up wording in test documentation.

Known Issues
------------

* Numbers can reach values of "1.157920892373162e+77" or "Infinity",
  but the parser does not recognize them.