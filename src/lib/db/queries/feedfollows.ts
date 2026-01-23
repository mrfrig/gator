import { db } from "..";
import { and, eq } from "drizzle-orm";
import { users, feeds, feedFollows } from "../schema";
import { getFeedByUrl } from "./feeds";

export async function createFeedFollow(userId: string, feedId: number) {
  const [newFeedFollow] = await db.insert(feedFollows).values({ userId, feedId }).returning();

  const [result] = await db.select({
    id: feedFollows.id,
    createdAt: feedFollows.createdAt,
    updatedAt: feedFollows.updatedAt,
    feedName: feeds.name,
    userName: users.name,
  }).from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.id, newFeedFollow.id));

  return result;
}

export async function deleteFeedFollow(url: string, userId: string) {
  const feed = await getFeedByUrl(url);
  const [result] = await db.delete(feedFollows).where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feed.id))).returning();
  return result;
}


export async function getFeedFollowsForUser(userId: string) {
  const results = await db.select({
    id: feedFollows.id,
    createdAt: feedFollows.createdAt,
    updatedAt: feedFollows.updatedAt,
    feedName: feeds.name,
    userName: users.name,
    feedId: feedFollows.feedId
  }).from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(users.id, userId));

  return results;
}