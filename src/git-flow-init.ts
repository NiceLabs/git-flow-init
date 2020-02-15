import _ from "lodash";
import { getField, setField } from "./git-kit";

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

export async function restore(options: Partial<Options>) {
  const values = _.defaults(options, defaultOptions);
  const names = _.keys(defaultOptions) as [keyof Options];
  for (const name of names) {
    await setField(name, values[name]);
  }
}

export async function backup(): Promise<Partial<Options>> {
  const options: Partial<Options> = {};
  const names = _.keys(defaultOptions) as [keyof Options];
  for (const name of names) {
    options[name] = await getField(name);
  }
  return _.defaults(options, defaultOptions);
}
