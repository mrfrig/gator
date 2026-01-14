import { CommandHandler, UserCommandHandler } from "src/commands/commands";
import { readConfig } from "src/config";
import { getUserByName } from "./db/queries/users";

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName: string, ...args: string[]) => {
    const {currentUserName} = readConfig();
    const user = await getUserByName(currentUserName);

    if (!user) {
        throw new Error("User doesn't exist");
    }
    await handler(cmdName, user, ...args);
  }
}