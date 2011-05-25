# Works with Distillery v0.3.0

node ../../distillery/distillery.js \
  ../tests/ode/joy-basic.js \
  -o ../docs/odelang.html \
  -s distillery-odelang/start.html \
  -m distillery-odelang/middle.html \
  -e distillery-odelang/end.html
  
node ../../distillery/distillery.js \
  ../CHANGELOG.md \
  -M \
  -o ../docs/changelog.html \
  -s distillery-changelog/start.html \
  -e distillery-changelog/end.html