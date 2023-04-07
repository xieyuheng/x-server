import type { Buffer } from "node:buffer"
import fs from "node:fs"
import { extname, normalize, resolve } from "node:path"
import { contentTypeRecord } from "../utils/contentTypeRecord"
import { pathIsDirectory } from "../utils/node/pathIsDirectory"
import { pathIsFile } from "../utils/node/pathIsFile"
import type { Context } from "./Context"

export type Content = {
  type: string
  buffer: Buffer
}

export async function readContent(
  ctx: Context,
  path: string,
): Promise<Content | undefined> {
  const resolvedPath = normalize(resolve(ctx.directory, path))

  // NOTE We should not access path outside of given directory.

  // The URL constructor can already
  // rewrite
  //   "http://example.com/../secret"
  // to
  //   "http://example.com/secret"
  // But we want to be absolutely sure about this.

  if (!resolvedPath.startsWith(ctx.directory)) {
    return undefined
  }

  if (
    (await pathIsDirectory(resolvedPath)) &&
    (await pathIsFile(resolvedPath + "/index.html"))
  ) {
    return {
      type: "text/html",
      buffer: await fs.promises.readFile(resolvedPath + "/index.html"),
    }
  }

  if (await pathIsFile(resolvedPath)) {
    return {
      type:
        contentTypeRecord[extname(resolvedPath)] || "application/octet-stream",
      buffer: await fs.promises.readFile(resolvedPath),
    }
  }
}
