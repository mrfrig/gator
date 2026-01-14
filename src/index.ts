import { handlerAgg } from "./commands/aggregate.js";
import { runCommand, type CommandsRegistry } from "./commands/commands.js";
import { handlerAddFeed, handlerFeeds } from "./commands/feed.js";
import { handlerFollow, handlerFollowing } from "./commands/follows.js";
import { handlerReset } from "./commands/reset.js";
import { handlerLogin, handlerRegister, handlerUsers } from "./commands/users.js";

async function main() {
  const registry: CommandsRegistry = {
    login: handlerLogin,
    register: handlerRegister,
    users: handlerUsers,
    agg: handlerAgg,
    addfeed: handlerAddFeed,
    feeds: handlerFeeds,
    follow: handlerFollow,
    following: handlerFollowing,
    reset: handlerReset,
  };
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