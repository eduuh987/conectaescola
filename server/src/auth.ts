
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { one, run, type Row } from "./db.js";

// Segredo do JWT: variável de ambiente ou gerado e guardado no volume de dados.
function loadSecret(): string {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;

  const dataDir = process.env.DATA_DIR || path.resolve("data");
  fs.mkdirSync(dataDir, { recursive: true });

  const file = path.join(dataDir, ".jwt-secret");

  if (fs.existsSync(file)) {
    const existingSecret = fs.readFileSync(file, "utf8").trim();

    if (existingSecret.length >= 32) {
      return existingSecret;
    }
  }

  const secret = crypto.randomBytes(48).toString("hex");
  fs.writeFileSync(file, secret, { mode: 0o600 });

  return secret;
}

const SECRET = loadSecret();
const COOKIE = "ce_session";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.COOKIE_SECURE === "true",
  path: "/",
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  school_id: number | null;
  is_family: number;
  is_professional: number;
  is_admin: number;
  status: "pending" | "approved" | "rejected" | "suspended";
  status_reason: string;
  avatar_url: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function setSession(res: Response, userId: number) {
  const token = jwt.sign({ uid: userId }, SECRET, { expiresIn: "7d" });

  res.cookie(COOKIE, token, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 3600 * 1000,
  });
}

export function clearSession(res: Response) {
  res.clearCookie(COOKIE, COOKIE_OPTIONS);
}

export function loadUser(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE];

  if (token) {
    try {
      const payload = jwt.verify(token, SECRET) as { uid?: number };

      if (typeof payload.uid === "number" && Number.isInteger(payload.uid) && payload.uid > 0) {
        const u = one(
          "SELECT id, name, email, phone, school_id, is_family, is_professional, is_admin, status, status_reason, avatar_url FROM users WHERE id = ?",
          payload.uid
        );

        if (u) {
          req.user = u as AuthUser;
        }
      }
    } catch {
      // Token inválido ou expirado: segue como visitante.
    }
  }

  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Faça login para continuar." });
  }

  next();
}

export function requireApproved(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Faça login para continuar." });
  }

  if (req.user.status !== "approved") {
    return res.status(403).json({
      error: "Seu cadastro ainda não foi aprovado pela escola.",
      status: req.user.status,
    });
  }

  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.is_admin) {
    return res.status(403).json({ error: "Acesso restrito." });
  }

  next();
}

export function logAdmin(
  adminId: number,
  action: string,
  targetType: string,
  targetId: number | null,
  detail = ""
) {
  run(
    "INSERT INTO admin_log (admin_id, action, target_type, target_id, detail) VALUES (?, ?, ?, ?, ?)",
    adminId,
    action,
    targetType,
    targetId,
    detail
  );
}

export function publicUser(u: Row | AuthUser) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    school_id: u.school_id,
    is_family: !!u.is_family,
    is_professional: !!u.is_professional,
    is_admin: !!u.is_admin,
    status: u.status,
    status_reason: u.status_reason,
    avatar_url: u.avatar_url || "",
  };
}
