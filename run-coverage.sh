#!/bin/sh -x
test -e
if test -d src-inst/; then
	rm -rf src-inst/
fi
jscoverage src/ src-inst/
vows tests/*.js --cover-html
