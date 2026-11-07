#!/bin/bash
set -e
cd /opt/mercadoandino-app

if ! command -v node >/dev/null 2>&1; then
  dnf install -y nodejs npm
fi

npm install --omit=dev

cat > /etc/systemd/system/mercadoandino.service <<'SERVICE'
[Unit]
Description=Aplicacion MercadoAndino Node.js
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=/opt/mercadoandino-app
ExecStart=/usr/bin/node /opt/mercadoandino-app/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=80
Environment=BUCKET=mercadoandino-uploads-madt-20261107
Environment=AWS_REGION=us-east-1

[Install]
WantedBy=multi-user.target
SERVICE

systemctl daemon-reload
systemctl enable mercadoandino.service
