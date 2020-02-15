import _ from "lodash";
import path from "path";
import findUp from "find-up";
import glob from "glob";
import { promisify } from "util";

const RC_FILE = ".gitflow-rc.json";

export async function findConfigurePath() {
  const cwd = path.dirname((await findUp("package.json")) ?? process.cwd());

  const paths = await promisify(glob)(`*/${RC_FILE}`, { cwd });
  return _.first(paths) || path.join(cwd || "", RC_FILE);
}
