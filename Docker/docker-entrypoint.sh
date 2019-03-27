#!/bin/bash

echo "Starting the container"

if [ ! -d node_modules ]; then
    npm install
fi

npm start