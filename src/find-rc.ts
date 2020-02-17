import path from "path";
import findUp from "find-up";
import { promises as fs } from "fs";

const RC_FILE = ".gitflow-rc.json";

export async function findConfigureFilePath() {
  const cwd = await getWorkingDirectory();

  const files = (await fs.readdir(cwd, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(({ name }) => path.join(cwd, name, RC_FILE));
  for (const file of files) {
    if (await isFile(file)) {
      return file;
    }
  }
  return path.join(cwd, RC_FILE);
}

const getWorkingDirectory = async () => {
  const cwd = process.env["INIT_CWD"] ?? process.cwd();
  const matched = await findUp("package.json", { cwd });
  if (matched) {
    return path.dirname(matched);
  } else {
    return cwd;
  }
};

const isFile = async (path: string) =>
  fs.stat(path).then(
    stat => stat.isFile(),
    () => false
  );
