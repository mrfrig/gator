import { runCommand, type CommandsRegistry } from "./commands.js";
import { handlerLogin } from "./handlerLogin.js";
import { handlerRegister } from "./handlerRegister.js";

async function main() {
  const registry: CommandsRegistry = {
    login: handlerLogin,
    register: handlerRegister,
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