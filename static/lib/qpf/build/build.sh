#!/bin/sh
node update.js
node r.js -o config.js
lessc ../src/style/base.less ../dist/css/base.css
cp -r ../src/style/images ../dist/css/images