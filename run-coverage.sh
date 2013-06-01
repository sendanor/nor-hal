#!/bin/sh -x
test -e

node-lint src/ --config=lint.json

if test -d src-inst/; then
	rm -rf src-inst/
fi

jscoverage src/ src-inst/

vows tests/*.js --spec --isolate
