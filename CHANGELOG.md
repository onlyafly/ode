Ode Changelog
=============

v0.4.0 (2001-05-16)
-------------------

* Implemented the majority of Joy.

v0.3.0 (2011-05-10)
-------------------

* Renamed the language from "Fika" to "Ode".
* Heavy refactoring to improve future extensibility.
* Added automatic saving of shell state on the client side via the HTML 5 Local Storage API.
* Added these advanced operations: def, undef, newstack, throw-error
* Added these block operations: cons, uncons, stack, unstack, length
* Added these other operations: empty?

v0.2.0 (2011-04-10)
-------------------

* Implemented tail-call optimization via the 'self' name.
* Added these advanced operations: $eval, $type, $def
* Added these other operations: number?, block?
* Added these functional operations: map, fold
* Fixed compatibility problems with Internet Explorer.
* Increased maximum stack size to 5000.

v0.1.0 (2008-12-14)
-------------------

* First released version.