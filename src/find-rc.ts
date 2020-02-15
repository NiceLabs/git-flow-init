import _ from "lodash";
import path from "path";
import findUp from "find-up";
import glob from "glob";
import { promisify } from "util";

const RC_FILE = ".gitflow-rc.json";

export async function findConfigurePath() {
  const matched = await findUp("package.json");
  const cwd = _.isNil(matched) ? process.cwd() : path.dirname(matched);

  const paths = await promisify(glob)(`*/${RC_FILE}`, { cwd });
  return _.first(paths) || path.join(cwd || "", RC_FILE);
}
