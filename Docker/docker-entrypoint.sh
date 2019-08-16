#!/bin/bash

if [[ ! -d node_modules ]];
then
    npm install
fi
echo "Starting the container"
npm start