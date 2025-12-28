import { setUser, readConfig } from "./config.js";

function main() {
  setUser("Franklin");
  const config = readConfig();
  console.log(config);
}

main();