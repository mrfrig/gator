import { eq } from "drizzle-orm";
import { db } from "..";
import { Post, posts } from "../schema";
import { getFeedFollowsForUser } from "./feedfollows";

export async function createPost(post: Pick<Post, "title" | "description" | "url" | "published_at"| "feedId" >) {
  const {title, description, url, published_at, feedId} = post; 

  const search = await db.select().from(posts).where(eq(posts.url, url));

  if (search.length > 0) {
    return search[0];
  }

  const [result] = await db.insert(posts).values({title, description, url, published_at, feedId}).returning();
  return result;
}

export async function getPostsForUser(userId: string, numOfPosts = 2) {
  const feedFollows = await getFeedFollowsForUser(userId);

  let results: Post[] = [];

  for (const feedFollow of feedFollows) {
    const r = await db.select().from(posts).where(eq(posts.feedId, feedFollow.feedId));

    if (results.length >= numOfPosts) break;

    for (const post of r) {
      if (results.length >= numOfPosts) break;
      results.push(post);
    }
  } 

  results.sort((a, b) => {
    if (a.published_at < b.published_at) {
      return -1;
    } else if (a.published_at > b.published_at) {
      return 1;
    }

    return 0;   
  });

  return results;
}