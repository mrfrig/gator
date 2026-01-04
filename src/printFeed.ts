import { Feed, User } from "./lib/db/schema";

export function printFeed(feed: Feed, user: User) {
  console.log("Feed:", feed);
  console.log("User:", user);
}