import { resetUsers } from "./lib/db/queries/users";

export async function handlerReset() {
    await resetUsers();
    console.log("Users reset was successful");
}