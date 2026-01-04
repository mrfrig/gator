import { readConfig } from "./config";
import { getUsers } from "./lib/db/queries/users";

export async function handlerUsers() {
    const users = await getUsers();

    const {currentUserName} = readConfig();

    for (const user of users) {
      const currentIndicator = currentUserName === user.name ? " (current)" : "";
      console.log(`* ${user.name}${currentIndicator}`); 
    }
}