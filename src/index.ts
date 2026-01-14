import { handlerAgg } from "./commands/aggregate.js";
import { registerCommand, runCommand, type CommandsRegistry } from "./commands/commands.js";
import { handlerAddFeed, handlerFeeds } from "./commands/feed.js";
import { handlerFollow, handlerFollowing, handlerUnfollow } from "./commands/follows.js";
import { handlerReset } from "./commands/reset.js";
import { handlerLogin, handlerRegister, handlerUsers } from "./commands/users.js";
import { middlewareLoggedIn } from "./lib/middlewareLoggedIn.js";

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handlerAgg);
  registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(registry, "feeds", handlerFeeds);
  registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(registry, "unfollow", middlewareLoggedIn(handlerUnfollow));
  registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));
  registerCommand(registry, "reset", handlerReset);
  
  const argv = process.argv.slice(2);

  if (argv.length === 0) {
    console.error("Not enough arguments were provided");
    process.exit(1);
  }

  const [cmdName, ...args] = argv;

  try {
    await runCommand(registry, cmdName, ...args);
  } catch (error) {
    
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('An unknown error occurred');
    }
    process.exit(1);
  }

  process.exit(0);
}

main();