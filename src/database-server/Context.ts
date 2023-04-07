import { resolve } from "node:path"
import { createDatabase, Database } from "../database"

export type Context = {
  db: Database
}

type ContextOptions = {
  path: string
}

export async function createContext(options: ContextOptions): Promise<Context> {
  const { path } = options

  const db = await createDatabase({ path: resolve(path) })

  return { db }
}
