// @flow
//
// Shikensu.Internal.Paths
// =======================
//
// Some path functions.

import path from "path"
import type { Definition } from "../internal/types"



// 🌱


export const absolutePath = (def: Definition) => {
  return path.join(def.rootDirname, workspacePath(def))
}


export const localPath = (def: Definition) => {
  return path.join(def.dirname, def.basename + def.extname)
}


export const workspacePath = (def: Definition) => {
  return path.join(def.workingDirname, localPath(def))
}
