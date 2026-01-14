import { readConfig, setUser } from "../config";
import { createUser, getUserByName, getUsers } from "../lib/db/queries/users";

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error(`usage: ${cmdName} <username>`);
    }
    
    const name = args[0];
    let result = await getUserByName(name);
    if (result) {
        throw new Error("User already exists");
    }

    result = await createUser(name);

    setUser(result.name);
    console.log(`User ${result.name} has been created`);
    console.log(result);
}


export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error(`usage: ${cmdName} <username>`);
    }

    const name = args[0];
    const result = await getUserByName(name);
    if (!result) {
        throw new Error("User doesn't exist");
    }

    setUser(result.name);
    console.log(`User ${result.name} has been set`);
}

export async function handlerUsers() {
    const users = await getUsers();

    const {currentUserName} = readConfig();

    for (const user of users) {
      const currentIndicator = currentUserName === user.name ? " (current)" : "";
      console.log(`* ${user.name}${currentIndicator}`); 
    }
}