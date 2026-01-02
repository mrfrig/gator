import { setUser } from "./config";
import { createUser, getUserByName } from "./lib/db/queries/users";

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("Username is required");
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