import { integer, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  userId: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
  last_fetched_at: timestamp("last_fetched_at")
});

export const feedFollows = pgTable("feed_follows", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
  feedId: integer("feed_id").notNull().references(() => feeds.id, {onDelete: "cascade"}),
}, (t) => [
  unique().on(t.userId, t.feedId)
]);

export const posts = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  title: text("title").notNull(),
  url: text("url").notNull().unique(),
  description: text("description").notNull(),
  published_at: timestamp("published_at").notNull(),
  feedId: integer("feed_id").notNull().references(() => feeds.id, {onDelete: "cascade"}),
});

export type User = typeof users.$inferSelect;
export type Feed = typeof feeds.$inferSelect;
export type Post = typeof posts.$inferSelect;