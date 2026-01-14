import { User } from "src/lib/db/schema";
import { createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feedfollows";
import { getFeedByUrl } from "../lib/db/queries/feeds";


export async function handlerFollow(cmdName: string, user:User, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <feed_url>`);
  }

  const url = args[0];
  const feed = await getFeedByUrl(url);

  const feedFollow = await createFeedFollow(user.id, feed.id);
  console.log(`User ${feedFollow.userName} is now following ${feedFollow.feedName}`);
}


export async function handlerFollowing(cmdName: string, user:User, ...args: string[]) {
  const feedFollows = await getFeedFollowsForUser(user.id);

  for (const feedFollow of feedFollows) {
    console.log(`* ${feedFollow.feedName}`);
  }
}