import { db } from "..";
import { and, eq } from "drizzle-orm";
import { users, feeds, feed_follows } from "../schema";
import { getFeedByUrl } from "./feeds";

export async function createFeedFollow(userId: string, feedId: number) {
  const [newFeedFollow] = await db.insert(feed_follows).values({ userId, feedId }).returning();

  const [result] = await db.select({
    id: feed_follows.id,
    createdAt: feed_follows.createdAt,
    updatedAt: feed_follows.updatedAt,
    feedName: feeds.name,
    userName: users.name,
  }).from(feed_follows)
    .innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
    .innerJoin(users, eq(feed_follows.userId, users.id))
    .where(eq(feed_follows.id, newFeedFollow.id));

  return result;
}

export async function deleteFeedFollow(url: string, userId: string) {
  const feed = await getFeedByUrl(url);
  const [result] = await db.delete(feed_follows).where(and(eq(feed_follows.userId, userId), eq(feed_follows.feedId, feed.id))).returning();
  return result;
}


export async function getFeedFollowsForUser(userId: string) {
  const results = await db.select({
    id: feed_follows.id,
    createdAt: feed_follows.createdAt,
    updatedAt: feed_follows.updatedAt,
    feedName: feeds.name,
    userName: users.name,
  }).from(feed_follows)
    .innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
    .innerJoin(users, eq(feed_follows.userId, users.id))
    .where(eq(users.id, userId));

  return results;
}