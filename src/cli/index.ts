import _ from "lodash";
import yargs from "yargs";
import { findConfigurePath } from "../find-rc";
import { backup, restore, Options } from "../git-flow-init";
import { promises as fs } from "fs";
import validate from "schema-utils";
import schema from "../../schema.json";

const argv = yargs
  .command("restore", "Restore git-flow init configuration")
  .command("backup", "Backup git-flow init configuration")
  .command("on-post-install", "Handle npm postinstall event").argv;

async function main(command: string) {
  const path = await findConfigurePath();
  switch (command) {
    case "on-post-install":
      onRestore(path).catch(console.log);
    case "restore":
      onRestore(path);
      break;
    case "backup":
      onBackup(path);
      break;
  }
}

async function onRestore(path: string) {
  const configure: Partial<Options> = JSON.parse(
    await fs.readFile(path, "utf-8")
  );
  if (_.isNil(configure)) {
    throw new Error(".gitflow-rc.json not found");
  }
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
