import { createFeedFollow } from "../lib/db/queries/feedfollows";
import { createFeed, getFeeds } from "../lib/db/queries/feeds";
import { getUserById } from "../lib/db/queries/users";
import { Feed, User } from "../lib/db/schema";

export function printFeed(feed: Feed, user: User) {
  console.log("Feed:", feed);
  console.log("User:", user);
}

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <feed_name> <url>`);
    }
    
    const name = args[0];
    const url = args[1];
    const feed = await createFeed(name, url, user.id);
    await createFeedFollow(user.id, feed.id);
    console.log(`Feed has been created`);
    printFeed(feed, user);
}

export async function handlerFeeds() {
  const feeds = await getFeeds();

  for (const feed of feeds) {
    const user = await getUserById(feed.userId);
    console.log(`* ${feed.name}`); 
    console.log(` - URL: ${feed.url}`); 
    console.log(` - User: ${user.name}`); 
  }
}