import _ from "lodash";
import path from "path";
import findUp from "find-up";
import { promises as fs } from "fs";

const RC_FILE = ".gitflow-rc.json";

export async function findConfigurePath() {
  const matched = await findUp("package.json");
  const cwd = _.isNil(matched) ? process.cwd() : path.dirname(matched);

  for (const name of await fs.readdir(cwd)) {
    const subpath = path.join(cwd, name);
    if (await isFile(subpath, RC_FILE)) {
      return path.join(subpath, RC_FILE);
    }
  }
  return path.join(cwd, RC_FILE);
}

const isFile = async (...paths: string[]) =>
  fs.stat(path.join(...paths)).then(
    stat => stat.isFile(),
    () => false
  );
