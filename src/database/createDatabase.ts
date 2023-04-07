import fs from "node:fs"
import { join, normalize, resolve } from "node:path"
import { isErrnoException } from "../utils/node/isErrnoException"
import { readJson } from "../utils/node/readJson"
import type { Database } from "./Database"
import {
  DatabaseConfig,
  DatabaseConfigOptionsSchema,
  emptyDatabaseConfig,
} from "./DatabaseConfig"

type Options = {
  path: string
  config?: DatabaseConfig
}

export async function createDatabase(options: Options): Promise<Database> {
  const path = normalize(resolve(options.path))

  await fs.promises.mkdir(path, { recursive: true })

  const config = (await loadDatabaseConfig(path)) || emptyDatabaseConfig

  return {
    path,
    config,
  }
}

async function loadDatabaseConfig(
  path: string,
): Promise<DatabaseConfig | undefined> {
  try {
    const json = await readJson(join(path, "database.json"))
    const options = DatabaseConfigOptionsSchema.validate(json)
    return {
      name: options.name,
      description: options.description || "",
      authDirectories: options.authDirectories || {},
    }
  } catch (error) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      return undefined
    }

    throw error
  }
}
