import { getFeeds } from "./lib/db/queries/feeds";
import { getUserById } from "./lib/db/queries/users";

export async function handlerFeeds() {
  const feeds = await getFeeds();

  for (const feed of feeds) {
    const user = await getUserById(feed.userId);
    console.log(`* ${feed.name}`); 
    console.log(` - URL: ${feed.url}`); 
    console.log(` - User: ${user.name}`); 
  }
}