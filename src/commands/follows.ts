import { readConfig } from "../config";
import { createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feedfollows";
import { getFeedByUrl } from "../lib/db/queries/feeds";
import { getUserByName } from "../lib/db/queries/users";


export async function handlerFollow(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <feed_url>`);
  }

  const url = args[0];

  const {currentUserName} = readConfig();
  const user = await getUserByName(currentUserName);
  const feed = await getFeedByUrl(url);

  const feedFollow = await createFeedFollow(user.id, feed.id);
  console.log(`User ${feedFollow.userName} is now following ${feedFollow.feedName}`);
}


export async function handlerFollowing() {
  const {currentUserName} = readConfig();
  const user = await getUserByName(currentUserName);
  const feedFollows = await getFeedFollowsForUser(user.id);

  for (const feedFollow of feedFollows) {
    console.log(`* ${feedFollow.feedName}`);
  }
}