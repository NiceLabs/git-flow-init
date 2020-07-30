#!/usr/bin/env node
import yargs from "yargs";
import path from "path";
import { promises as fs } from "fs";
import validate from "schema-utils";

import { findConfigureFilePath } from "./find-rc";
import { Git } from "./git";
import schema from "../schema.json";
import { exists } from "./fs";

const argv = yargs
  .command("restore", "Restore git-flow init configuration")
  .command("backup", "Backup git-flow init configuration")
  .command("on-post-install", "Handle npm postinstall event")
  .strict().argv;

async function main(command: string) {
  const filePath = await findConfigureFilePath();
  const git = await Git.create(path.dirname(filePath));
  switch (command) {
    case "restore":
      return onRestore.call(git, filePath);
    case "backup":
      return onBackup.call(git, filePath);
    case "on-post-install":
      return onPostInstall.call(git, filePath);
    default:
      yargs.showHelp();
      break;
  }
}

async function onPostInstall(this: Git, filePath: string) {
  if (await exists(filePath)) {
    onRestore.call(this, filePath);
  } else {
    console.error(".gitflow-rc.json not found");
  }
}

async function onRestore(this: Git, filePath: string) {
  const configure = JSON.parse(await fs.readFile(filePath, "utf-8"));

  validate(schema, configure);
  await this.restoreFlow(configure);

  console.table(configure);
  console.log(`read file from ${filePath}`);
  console.log("git-flow init # restore done");
}

async function onBackup(this: Git, filePath: string) {
  const configure = await this.backupFlow();

  const encoded = JSON.stringify(configure, null, 2);
  fs.writeFile(filePath, encoded, "utf-8");

  console.table(configure);
  console.log(`wrote file to ${filePath}`);
  console.log("git-flow init # backup done");
}

main(argv._[0]).catch(console.error);
