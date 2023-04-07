import { homedir } from "node:os"
import { join } from "node:path"

const HOME = homedir()
const FIDB_DIR = process.env.FIDB_DIR || join(HOME, ".fidb")
const FIDB_SYSTEM_DB_DIR =
  process.env.FIDB_SYSTEM_DB_DIR || join(FIDB_DIR, "databases/system")

export const env = {
  HOME,
  FIDB_DIR,
  FIDB_SYSTEM_DB_DIR,
}
