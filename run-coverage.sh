#!/bin/sh -x
test -e
if test -d src-inst/; then
	rm -rf src-inst/
fi
node_modules/jscoverage/bin/jscoverage src/ src-inst/
node_modules/vows/bin/vows tests/test-*.js --cover-html
