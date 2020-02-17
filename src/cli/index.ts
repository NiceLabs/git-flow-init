#!/usr/bin/env node
import _ from "lodash";
import yargs from "yargs";
import { promises as fs } from "fs";
import validate from "schema-utils";

import { findConfigurePath } from "../find-rc";
import { backup, restore, Options } from "../git-flow-init";
import schema from "../../schema.json";
import { exists } from "./fs";

const argv = yargs
  .command("restore", "Restore git-flow init configuration")
  .command("backup", "Backup git-flow init configuration")
  .command("on-post-install", "Handle npm postinstall event")
  .strict().argv;

async function main(command: string) {
  const path = await findConfigurePath();
  console.log(path);
  switch (command) {
    case "restore":
      return onRestore(path);
    case "backup":
      return onBackup(path);
    case "on-post-install":
      return onPostInstall(path);
    default:
      yargs.showHelp();
      break;
  }
}

async function onPostInstall(path: string) {
  if (await exists(path)) {
    onRestore(path);
  } else {
    console.error(".gitflow-rc.json not found");
  }
}

async function onRestore(path: string) {
  const configure: Options = JSON.parse(await fs.readFile(path, "utf-8"));

  validate(schema, configure);
  await restore(configure);

  console.table(configure);
  console.log("git-flow init # restore done");
}

async function onBackup(path: string) {
  const configure = await backup();

  validate(schema, configure);
  fs.writeFile(path, JSON.stringify(configure, null, 2), { encoding: "utf-8" });

  console.table(configure);
  console.log("git-flow init # backup done");
}

main(argv._[0]).catch(console.error);
