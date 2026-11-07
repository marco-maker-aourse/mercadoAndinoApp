#!/bin/bash
set -e

if systemctl list-unit-files mercadoandino.service \
  --no-legend | grep -q mercadoandino; then
  systemctl stop mercadoandino.service
fi

exit 0
