#!/bin/bash

# if the package.json file is not exsiting
if [ ! -f package.json ]; then
    echo "An error occured, no package.json found"
    exit 1
fi

