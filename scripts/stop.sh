#!/usr/bin/env bash
forever stop "content-explorer"
netstat -tulpn | grep ::400
