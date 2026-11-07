const express = require("express");
const os = require("os");
const crypto = require("crypto");

const {
  S3Client,
  PutObjectCommand
} = require("@aws-sdk/client-s3");

const {
  getSignedUrl
} = require("@aws-sdk/s3-request-presigner");

const app = express();

const s3 = new S3Client({
  region: "us-east-1"
});

const BUCKET = process.env.BUCKET;

app.get("/", (req, res) => {
  res.send(
    "MercadoAndino v1 - instancia " + os.hostname()
  );
});

app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

app.get("/api/upload-url", async (req, res) => {
  try {
    if (!BUCKET) {
      return res.status(500).json({
        error: "Bucket no configurado"
      });
    }

    const name = String(req.query.name || "");
    const type = String(req.query.type || "");

    const allowedTypes = {
      "image/jpeg": ".jpg",
      "image/png": ".png"
    };

    if (!allowedTypes[type] || !name) {
      return res.status(400).json({
        error: "Se requiere JPG o PNG"
      });
    }

    const key =
      "uploads/" +
      crypto.randomUUID() +
      allowedTypes[type];

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: type
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: 300
    });

    res.json({
      url,
      key,
      expiresIn: 300
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al generar URL prefirmada"
    });
  }
});

app.listen(process.env.PORT || 80, "0.0.0.0");
