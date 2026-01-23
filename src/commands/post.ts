import { getPostsForUser } from "src/lib/db/queries/posts";
import { User } from "src/lib/db/schema";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
  let limit = 2;
  if (args.length === 1) {
    limit = Number(args[0]);
  }
  if (isNaN(limit)) throw new Error("Limit must be a number");
  const posts = await getPostsForUser(user.id, limit);

  for (const post of posts) {
    console.log(`* ${post.title}`);
    console.log(`  - ID:            ${post.id}`);
    console.log(`  - Created:       ${post.createdAt}`);
    console.log(`  - Updated:       ${post.updatedAt}`);
    console.log(`  - URL:           ${post.url}`);
    console.log(`  - Description:   ${post.description}`);
  }
}