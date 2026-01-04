import { readConfig } from "./config";
import { createFeed } from "./lib/db/queries/feeds";
import { getUserByName } from "./lib/db/queries/users";
import { printFeed } from "./printFeed";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <feed_name> <url>`);
    }

    const {currentUserName} = readConfig();
    const user = await getUserByName(currentUserName);
    
    const name = args[0];
    const url = args[1];
    const feed = await createFeed(name, url, user.id);
    console.log(`Feed has been created`);
    printFeed(feed, user);
}