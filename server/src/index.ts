
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "node:path";
import fs from "node:fs";
import { db, seed } from "./db.js";
import { loadUser } from "./auth.js";
import { api } from "./api.js";
import { admin } from "./admin.js";
import { errorHandler } from "./util.js";

seed();

const app = express();
app.set("trust proxy", 1);

const DATA_DIR = process.env.DATA_DIR || path.resolve("data");
const AVATARS_DIR = path.join(DATA_DIR, "avatars");

fs.mkdirSync(AVATARS_DIR, { recursive: true });

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        upgradeInsecureRequests: null,
      },
    },
    strictTransportSecurity: false,
    crossOriginOpenerPolicy: false,
  })
);

// Pasta pública exclusiva das fotos de perfil.
app.use(
  "/uploads/avatars",
  express.static(AVATARS_DIR, {
    index: false,
    dotfiles: "deny",
    maxAge: "1y",
    immutable: true,
  })
);

// Recebe imagens de até 5 MB.
app.use("/api/me/avatar", express.raw({
  type: "application/octet-stream",
  limit: "5mb",
}));

app.use(express.json({ limit: "200kb" }));
app.use(cookieParser());
app.use(loadUser);

app.use("/api/admin", admin);
app.use("/api", api);
app.use("/api", (_req, res) => res.status(404).json({ error: "Rota não encontrada." }));
app.use("/api", errorHandler);

// Frontend compilado (SPA).
const WEB_DIR = path.resolve(process.env.WEB_DIR || "../web/dist");

if (fs.existsSync(WEB_DIR)) {
  app.use(express.static(WEB_DIR, { index: false, maxAge: "1h" }));
  app.use((req, res, next) =>
    req.method === "GET"
      ? res.sendFile(path.join(WEB_DIR, "index.html"))
      : next()
  );
}

const PORT = Number(process.env.PORT || 3000);
const HOST_PORT = process.env.APP_PORT || PORT;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("[conecta-escola] site no ar!");
  console.log(`[conecta-escola] neste computador: http://localhost:${HOST_PORT}`);
  console.log(`[conecta-escola] no celular (mesmo Wi-Fi): http://IP-DO-NOTEBOOK:${HOST_PORT} (QR code em /qr)`);
});

// Desliga rápido e sem corromper o banco quando o Docker pede para parar.
for (const sig of ["SIGTERM", "SIGINT"] as const) {
  process.on(sig, () => {
    server.close();
    db.close();
    process.exit(0);
  });
}
