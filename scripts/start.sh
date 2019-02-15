#!/usr/bin/env bash

PWD=$(pwd)

mkdir -p logs

npm install && \
npm run build && \
forever start \
    --id "content-explorer" \
    -l "${PWD}/logs/content.log"  \
    -e "${PWD}/logs/content.err"  \
    -c "npm run server"  \
    -a \
    ./

forever list

