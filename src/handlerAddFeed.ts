import { readConfig } from "./config";
import { createFeed } from "./lib/db/queries/feeds";
import { getUserByName } from "./lib/db/queries/users";
import { printFeed } from "./printFeed";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("Name and URL are required");
    }

    if (args.length === 1) {
        throw new Error("URL is required");
    }

    const {currentUserName} = readConfig();
    let user = await getUserByName(currentUserName);
    
    const name = args[0];
    const url = args[1];
    const feed = await createFeed(name, url, user.id);
    console.log(`Feed has been created`);
    printFeed(feed, user);
}