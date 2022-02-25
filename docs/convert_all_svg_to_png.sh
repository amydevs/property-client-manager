#!/bin/sh
find -name "*drawio.svg" -exec sh -c 'drawio -x -f png ${1%.png} ${1%}' _ {} \;
