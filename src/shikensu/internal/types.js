// @flow
//
// Shikensu.Internal.Types
// =======================
//
// All the types!

import type { Arr } from "flow-static-land/lib/Arr"
import type { Maybe } from "flow-static-land/lib/Maybe"
import type { Task } from "flow-static-land/lib/Task"



// Definition


export type Definition = {
  basename: string,
  dirname: string,
  extname: string,
  pattern: string,
  rootDirname: string,
  workingDirname: string,

  // Additional properties
  content: Maybe<string>,
  metadata: Metadata,
  parentPath: Maybe<string>,
  pathToRoot: Maybe<string>
}



// Type aliases


export type Dictionary = Arr<Definition>
export type ListTask = Task<{}, Dictionary>
export type Metadata = any
