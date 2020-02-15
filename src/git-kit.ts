import cp from "child_process";
import { promisify } from "util";

const execFile = promisify(cp.execFile);

export async function getField(name: string) {
  const { stdout, stderr } = await execFile("git", ["config", "--get", name]);
  if (stderr) {
    return undefined;
  }
  return stdout.trim();
}

export async function setField(name: string, value: string) {
  const { stderr } = await execFile("git", ["config", name, value]);
  if (stderr) {
    throw new Error(stderr.trim());
  }
}
