import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { Feed, feeds } from "../schema";

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db.insert(feeds).values({ name, url, userId }).returning();
  return result;
}

export async function getFeedByUrl(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}

export async function getFeeds() {
  return await db.select().from(feeds);
}

export async function markFeedFetched(id: number) {
  const now = new Date();
  const [result] = await db.update(feeds).set({
    updatedAt: now,
    last_fetched_at: now
  }).where(eq(feeds.id, id)).returning();
  return result;
}

export async function getNextFeedToFetch() {
  const result = await db.execute(sql`SELECT * FROM ${feeds} ORDER BY ${feeds.last_fetched_at} NULLS FIRST`);

  if (result.length > 0) {
    return result[0] as Feed;
  }

  return;
}