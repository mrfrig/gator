import { readConfig } from "./config";
import { getFeedFollowsForUser } from "./lib/db/queries/feedfollows";
import { getUserByName } from "./lib/db/queries/users";

export async function handlerFollowing(cmdName: string, ...args: string[]) {

  const {currentUserName} = readConfig();
  const user = await getUserByName(currentUserName);
  const feedFollows = await getFeedFollowsForUser(user.id);

  for (const feedFollow of feedFollows) {
    console.log(`* ${feedFollow.feedName}`);
  }
}