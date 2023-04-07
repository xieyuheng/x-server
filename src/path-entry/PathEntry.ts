export type PathEntry = PathEntryFile | PathEntryDirectory

export type PathEntryFile = {
  kind: "File"
  path: string
}

export type PathEntryDirectory = {
  kind: "Directory"
  path: string
}
