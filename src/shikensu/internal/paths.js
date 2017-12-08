// @flow
//
// Shikensu.Internal.Paths
// =======================
//
// Some path functions.

import * as maybe from "flow-static-land/lib/Maybe"
import path from "path"

import type { Maybe } from "flow-static-land/lib/Maybe"
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



// 🎈


/**
 ** Path to root, when there is one.
 **
 ** For example, if `dirname` is 'example/subdir',
 ** then this will be `../../`.
 **
 ** If the `dirname` is empty,
 ** then this will be empty as well.
 */
export const compilePathToRoot = (dirname: string): Maybe<string> => {
  const ds: Array<string> =
    dirname.split(path.sep)

  return !dirname.length || !ds.length
    ? maybe.Nothing
    : maybe.of(
        ds.map(_ => "..").join(path.sep) + path.sep
      )
}


/**
 ** Path to parent, when there is one.
 */
export const compileParentPath = (dirname: string): Maybe<string> => {
  return dirname === ""
    ? maybe.Nothing
    : maybe.of(".." + path.sep)
}
