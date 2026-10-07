import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

const createdAt = () => timestamp("created_at", { withTimezone: true }).defaultNow().notNull();
const updatedAt = () => timestamp("updated_at", { withTimezone: true }).defaultNow().notNull();

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: createdAt(),
});

/** Key/value site settings (hotline, social links, notification email…). */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const services = pgTable(
  "services",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    shortDesc: text("short_desc").notNull().default(""),
    content: text("content").notNull().default(""),
    icon: text("icon").notNull().default("eye"),
    image: text("image"),
    sortOrder: integer("sort_order").notNull().default(0),
    featured: boolean("featured").notNull().default(true),
    published: boolean("published").notNull().default(true),
    seoTitle: text("seo_title"),
    seoDesc: text("seo_desc"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("services_slug_idx").on(t.slug)],
);

export const priceItems = pgTable("price_items", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  /** Free text so the hospital can write "Liên hệ", ranges, etc. — this is the self-pay price. */
  price: text("price").notNull().default("Liên hệ"),
  /** Price for patients with health insurance (BHYT); null when not covered. */
  insurancePrice: text("insurance_price"),
  unit: text("unit").notNull().default("lần"),
  note: text("note"),
  insured: boolean("insured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const doctors = pgTable(
  "doctors",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    degree: text("degree").notNull().default(""),
    position: text("position").notNull().default(""),
    specialty: text("specialty").notNull().default(""),
    bio: text("bio").notNull().default(""),
    photo: text("photo"),
    /** Practising certificate number (CCHN/GPHN), shown publicly as required for practitioners. */
    license: text("license"),
    /** false = other staff (nurses, technicians, pharmacists, admin) listed on the team page only. */
    isDoctor: boolean("is_doctor").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    published: boolean("published").notNull().default(true),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("doctors_slug_idx").on(t.slug)],
);

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    content: text("content").notNull().default(""),
    coverImage: text("cover_image"),
    category: text("category").notNull().default("Kiến thức về mắt"),
    published: boolean("published").notNull().default(true),
    publishedAt: timestamp("published_at", { withTimezone: true }).defaultNow().notNull(),
    seoTitle: text("seo_title"),
    seoDesc: text("seo_desc"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("posts_slug_idx").on(t.slug), index("posts_pub_idx").on(t.published, t.publishedAt)],
);

export const APPOINTMENT_STATUSES = ["pending", "confirmed", "done", "cancelled"] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const appointments = pgTable(
  "appointments",
  {
    id: serial("id").primaryKey(),
    code: text("code").notNull(),
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    birthYear: integer("birth_year"),
    serviceId: integer("service_id").references(() => services.id, { onDelete: "set null" }),
    doctorId: integer("doctor_id").references(() => doctors.id, { onDelete: "set null" }),
    preferredDate: text("preferred_date").notNull(),
    preferredTime: text("preferred_time").notNull(),
    note: text("note"),
    status: text("status").$type<AppointmentStatus>().notNull().default("pending"),
    adminNote: text("admin_note"),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("appointments_code_idx").on(t.code), index("appointments_date_idx").on(t.preferredDate)],
);

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  email: text("email"),
  topic: text("topic").notNull().default("Khác"),
  question: text("question").notNull(),
  answer: text("answer"),
  answeredBy: text("answered_by"),
  published: boolean("published").notNull().default(false),
  answeredAt: timestamp("answered_at", { withTimezone: true }),
  createdAt: createdAt(),
});

export const jobs = pgTable(
  "jobs",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    department: text("department").notNull().default(""),
    employmentType: text("employment_type").notNull().default("Toàn thời gian"),
    quantity: integer("quantity").notNull().default(1),
    salary: text("salary").notNull().default("Theo quy định"),
    deadline: text("deadline"),
    description: text("description").notNull().default(""),
    published: boolean("published").notNull().default(true),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("jobs_slug_idx").on(t.slug)],
);

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id, { onDelete: "set null" }),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  coverLetter: text("cover_letter"),
  cvUrl: text("cv_url"),
  status: text("status").notNull().default("new"),
  createdAt: createdAt(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  message: text("message").notNull(),
  handled: boolean("handled").notNull().default(false),
  createdAt: createdAt(),
});

export type Service = typeof services.$inferSelect;
export type PriceItem = typeof priceItems.$inferSelect;
export type Doctor = typeof doctors.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
