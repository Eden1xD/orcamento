import { createRequire } from "node:module";
import { Pool } from "pg";
import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const env = readFileSync(resolve(process.cwd(), ".env"), "utf8");
const match = env.match(/^DATABASE_URL=(.*)$/m);
if (!match) {
  console.error("DATABASE_URL not found in .env");
  process.exit(1);
}
const url = match[1].trim().replace(/^"|"$/g, "");

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

const pool = new Pool({ connectionString: url });

try {
  const seedSettings = [
    ["studio_name", "VETOR"],
    ["studio_tagline", "Independent digital development studio"],
    ["email_contact", "oi@vetor.studio"],
    ["whatsapp_number", "5511999990000"],
    [
      "whatsapp_message",
      "Olá! Vim pelo site do estúdio e quero tirar minha ideia do papel. Podemos conversar?",
    ],
  ];
  for (const [key, value] of seedSettings) {
    await pool.query(
      `insert into settings (key, value) values ($1, $2) on conflict (key) do nothing`,
      [key, value],
    );
  }

  const svc = await pool.query("select 1 from services limit 1");
  if (svc.rows.length === 0) {
    const services = [
      ["websites", "Websites", "Sites, landing pages, lojas e portfólios", 350000, 1],
      ["applications", "Applications", "Aplicativos iOS e Android nativos e multiplataforma", 1200000, 2],
      ["systems", "Systems", "Sistemas administrativos, dashboards e plataformas", 800000, 3],
      ["automation", "Automation", "Automações, integrações e pipelines em Python", 250000, 4],
    ];
    for (const [slug, name, tagline, price, order] of services) {
      await pool.query(
        `insert into services (slug, name, tagline, base_price, "order") values ($1, $2, $3, $4, $5)
         on conflict (slug) do nothing`,
        [slug, name, tagline, price, order],
      );
    }

    const addons = [
      ["Identidade visual e logotipo", "Direção de marca aplicada à interface", 80000, 1],
      ["Redação e copywriting", "Conteúdo técnico e persuasivo para o produto", 60000, 2],
      ["SEO técnico", "Performance, indexação e dados estruturados", 45000, 3],
      ["Integrações avançadas (APIs, ERP, CRM)", "Conexão com sistemas externos e payloads complexos", 90000, 4],
      ["Tela adicional", "Uma tela extra além do escopo padrão", 50000, 5],
      ["Segurança e permissões avançadas", "RBAC, auditoria e proteções extras", 120000, 6],
      ["Suporte pós-lançamento (1 mês)", "Monitoramento, correções e ajustes", 100000, 7],
      ["Treinamento e documentação", "Handover com manual técnico e vídeos", 70000, 8],
    ];
    for (const [name, description, price, order] of addons) {
      await pool.query(
        `insert into addons (name, description, price, "order") values ($1, $2, $3, $4) on conflict do nothing`,
        [name, description, price, order],
      );
    }
    console.log("Seeded services and addons.");
  }

  const admin = await pool.query(
    "select 1 from users where email = 'admin@vetor.studio'",
  );
  if (admin.rows.length === 0) {
    await pool.query(
      `insert into users (name, email, password_hash, role) values ('Studio Admin', 'admin@vetor.studio', $1, 'admin')`,
      [hashPassword("admin123")],
    );
    console.log("Seeded admin user (admin@vetor.studio / admin123).");
  }

  console.log("Seed complete.");
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await pool.end();
}
