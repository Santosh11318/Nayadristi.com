import { pgTable, serial, text, timestamp, boolean, jsonb, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").default("subscriber").notNull(), // superadmin, admin, editor, journalist, moderator, subscriber
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  designation: text("designation"),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  socialLinks: jsonb("social_links"), // e.g. { facebook: "", twitter: "" }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary"),
  content: text("content"),
  featuredImageUrl: text("featured_image_url"),
  imageCaption: text("image_caption"),
  categoryId: integer("category_id").references(() => categories.id),
  authorId: integer("author_id").references(() => authors.id),
  status: text("status").default("draft").notNull(), // draft, pending, approved, scheduled, published, archived
  isFeatured: boolean("is_featured").default(false),
  isBreaking: boolean("is_breaking").default(false),
  breakingExpiry: timestamp("breaking_expiry"),
  videoUrl: text("video_url"),
  views: integer("views").default(0),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  seoKeywords: text("seo_keywords"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id").references(() => articles.id),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  status: text("status").default("pending").notNull(), // pending, approved, rejected, spam
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const advertisements = pgTable("advertisements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  position: text("position").notNull(), // header, homepage_top, sidebar, article_middle, etc.
  imageUrl: text("image_url"),
  adUrl: text("ad_url"),
  htmlCode: text("html_code"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  articles: many(articles),
}));

export const authorsRelations = relations(authors, ({ many, one }) => ({
  articles: many(articles),
  user: one(users, {
    fields: [authors.userId],
    references: [users.id],
  }),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),
  author: one(authors, {
    fields: [articles.authorId],
    references: [authors.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  article: one(articles, {
    fields: [comments.articleId],
    references: [articles.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));
