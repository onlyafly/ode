# To run this script, you need the following directory structure:
#
# root
#   - odejs
#     - build-scripts
#       - distillery-odelang.sh (this file)
#     - docs
#       - odelang.html (will be created)
#   - distillery
#
# Works with Distillery v0.2.0

node ../../distillery/distillery.js \
  ../scripts/odetests/joy-basic.js \
  ../scripts/odetests/joy-advanced.js \
  -o ../docs/odelang.html \
  -s distillery-odelang/start.html \
  -m distillery-odelang/middle.html \
  -e distillery-odelang/end.html