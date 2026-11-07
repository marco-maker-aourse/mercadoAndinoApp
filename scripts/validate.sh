#!/bin/bash
set -e
for i in $(seq 1 15); do
  if curl -fsS http://127.0.0.1:80/health; then
    echo "HEALTH CHECK OK"
    exit 0
  fi
  sleep 2
done
echo "ERROR: HEALTH CHECK"
exit 1
