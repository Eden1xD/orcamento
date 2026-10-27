import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["admin", "client"]);
export const quoteStatus = pgEnum("quote_status", [
  "novo",
  "analise",
  "aprovado",
  "recusado",
  "concluido",
]);
export const projectStatus = pgEnum("project_status", [
  "planejamento",
  "andamento",
  "revisao",
  "pausado",
  "concluido",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull().default("client"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  description: text("description"),
  basePrice: integer("base_price").notNull().default(0),
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const addons = pgTable("addons", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull().default(0),
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email"),
  phone: text("phone"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  clientId: uuid("client_id").references(() => clients.id, {
    onDelete: "set null",
  }),
  status: projectStatus("status").notNull().default("planejamento"),
  budget: integer("budget"),
  dueDate: timestamp("due_date"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const portfolio = pgTable("portfolio", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull().default("Website"),
  tagline: text("tagline"),
  description: text("description"),
  challenge: text("challenge"),
  solution: text("solution"),
  features: text("features").array().notNull().default([]),
  technologies: text("technologies").array().notNull().default([]),
  coverImage: text("cover_image"),
  gallery: text("gallery").array().notNull().default([]),
  link: text("link"),
  published: boolean("published").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quotes = pgTable(
  "quotes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    protocol: text("protocol").notNull().unique(),
    clientName: text("client_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    company: text("company"),
    serviceId: uuid("service_id").references(() => services.id, {
      onDelete: "set null",
    }),
    addons: text("addons").array().notNull().default([]),
    description: text("description"),
    timeline: text("timeline"),
    baseValue: integer("base_value").notNull().default(0),
    finalValue: integer("final_value"),
    status: quoteStatus("status").notNull().default("novo"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("quotes_status_idx").on(t.status)],
);

export const quoteEvents = pgTable("quote_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  quoteId: uuid("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  type: text("type").notNull().default("info"),
  read: boolean("read").notNull().default(false),
  link: text("link"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
