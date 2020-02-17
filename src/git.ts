import cp from "child_process";
import { promisify } from "util";

const execFile = promisify(cp.execFile);

export interface Options {
  "gitflow.branch.master": string;
  "gitflow.branch.develop": string;
  "gitflow.prefix.feature": string;
  "gitflow.prefix.support": string;
  "gitflow.prefix.release": string;
  "gitflow.prefix.hotfix": string;
  "gitflow.prefix.versiontag": string;
}

const defaultOptions: Options = {
  "gitflow.branch.master": "master",
  "gitflow.branch.develop": "develop",
  "gitflow.prefix.feature": "feature/",
  "gitflow.prefix.support": "support/",
  "gitflow.prefix.release": "release/",
  "gitflow.prefix.hotfix": "hotfix/",
  "gitflow.prefix.versiontag": ""
};

async function getTopLevel(cwd?: string) {
  const { stdout } = await execFile("git", ["rev-parse", "--show-toplevel"], {
    cwd
  });
  return stdout.trim();
}

export class Git {
  private cwd: string;

  private constructor(cwd: string) {
    this.cwd = cwd;
  }

  public static async create(cwd?: string) {
    return new Git(await getTopLevel(cwd));
  }

  protected async getField(name: string) {
    const { stdout, stderr } = await execFile(
      "git",
      ["config", "--get", name],
      { cwd: this.cwd }
    );
    if (stderr) {
      return undefined;
    }
    return stdout.trim();
  }

  protected async setField(name: string, value: string) {
    const { stderr } = await execFile("git", ["config", name, value], {
      cwd: this.cwd
    });
    if (stderr) {
      throw new Error(stderr.trim());
    }
  }

  public async restoreFlow(options: Options) {
    const names = Object.keys(defaultOptions) as [keyof Options];
    for (const name of names) {
      await this.setField(name, options[name]);
    }
  }

  public async backupFlow(): Promise<Options> {
    const options: Partial<Options> = {};
    const names = Object.keys(defaultOptions) as [keyof Options];
    for (const name of names) {
      options[name] = (await this.getField(name)) || defaultOptions[name];
    }
    return options as Options;
  }
}
