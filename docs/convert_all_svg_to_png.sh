#!/bin/sh
find -name "*.svg" -exec sh -c 'cp ${1%} ./svg2png/' _ {} \;
drawio -x -f png -o svg2png/ svg2png/