import { setUser } from "./config";
import { getUserByName } from "./lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("Username is required");
    }

    const name = args[0];
    const result = await getUserByName(name);
    if (!result) {
        throw new Error("User doesn't exist");
    }

    setUser(result.name);
    console.log(`User ${result.name} has been set`);
}