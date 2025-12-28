import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName: string;
}

export function setUser(newUserName: string) {
  const config = readConfig();
  writeConfig({
    ...config,
    currentUserName: newUserName
  })
}

export function readConfig(): Config {
  const data = fs.readFileSync(getConfigFilePath(), {encoding: 'utf-8'});
  return validateConfig(JSON.parse(data));
}

function getConfigFilePath(): string {
  const filePath = path.join(process.cwd(), ".gatorconfig.json");
  return filePath; 
}

function writeConfig(cfg: Config) {
  fs.writeFileSync(getConfigFilePath(), JSON.stringify({
    "db_url": cfg.dbUrl,
    "current_user_name": cfg.currentUserName,
  }));
}


function validateConfig(rawConfig: any) {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url is required in config file");
  }
  if (
    !rawConfig.current_user_name ||
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error("current_user_name is required in config file");
  }

  const config: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };

  return config;
}