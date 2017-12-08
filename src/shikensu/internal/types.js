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
  extname: string,
  dirname: string,
  pattern: string,
  workingDirname: string,
  rootDirname: string,

  // Additional properties
  content: Maybe<Buffer>,
  metadata: Metadata,
  parentPath: Maybe<string>,
  pathToRoot: Maybe<string>
}



// Type aliases


export type Dictionary = Arr<Definition>
export type ListTask = Task<{}, Dictionary>
export type Metadata = any
export type Renderer = (Definition => Maybe<Buffer>)
