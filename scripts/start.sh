#!/bin/bash
set -e
systemctl restart mercadoandino.service
systemctl is-active --quiet mercadoandino.service
