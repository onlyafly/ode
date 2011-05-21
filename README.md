Ode
===

__Current Version__:
v0.4.0dev (not stable)

__License__:
MIT (see included LICENSE file)

__Author__:
Kevin P. Albrecht <http://www.kevinalbrecht.com>
        
__Web Site__:
<http://www.kevinalbrecht.com/code/ode>

About
-----

A concatenative, functional programming language, with the goal of being a superset of
the Joy language, originally created by Dr. Manfred von Thun.

Directory Structure
-------------------

* __root__
  * __bin__ -- compiled JavaScript files, generated from source
  * __build__ -- build scripts
  * __docs__ -- documentation, generated from source and
  * __editor__ -- Ode's online development environment
  * __images__
  * __lib__ -- required third-party JavaScript libraries
  * __other__ -- unorganized pages
  * __src__ -- source code
    * __extras__
    * __ode__ -- the Ode interpreter
    * __odeedit__ -- the Ode programming environment
  * __tests__ -- unit and other tests

Dependencies
------------

### Required (Included)

### Required (Not Included)

### To compile/minify/combine the Ode sources

* Google Closure Compiler <http://code.google.com/closure/compiler/>

### To generate language documentation

* Node <https://github.com/joyent/node>
* Distillery <https://github.com/onlyafly/distillery>

Compiling/Minifying/Combining the Ode Sources
---------------------------------------------

Ode is set up to be easily minified and combined into a single JavaScript file
using Google's Closure Compiler. In order to compile it, you will need to have
the following directory structure:

* (parent folder)
  * closure-compiler
    * compiler.jar (downloaded from <http://code.google.com/closure/compiler/>)
  * ode (this folder)
    * build
      * compile-ode.bat
      
In the Windows command line prompt, change directory to build, then
run this command:

    > compile-ode.bat

Generating Language Documentation
---------------------------------

To generate the language documentation, you need the following directory
structure:

* root
  * distillery
  * ode (this folder)
    * build
      * distillery-odelang.sh
      * docs
        * odelang.html (will be created)

In a bash shell which can run Node, change directory to the build-
directory. Then run this command:

    > . distillery-odelang.sh