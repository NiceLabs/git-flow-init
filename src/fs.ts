import { promises as fs, PathLike } from "fs";

export const exists = (path: PathLike) =>
  fs.stat(path).then(
    () => true,
    () => false
  );
