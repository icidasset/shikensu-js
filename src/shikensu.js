// @flow
//
// Main module
// ===========
//
// Most things you"ll need will be available through this module.

import * as arr from "flow-static-land/lib/Arr"
import * as fun from "flow-static-land/lib/Fun"
import * as functor from "flow-static-land/lib/Functor"
import * as maybe from "flow-static-land/lib/Maybe"
import * as monoid from "flow-static-land/lib/Monoid"
import * as task from "flow-static-land/lib/Task"
import * as utils from "./shikensu/internal/utilities"

import {
  arrMap2, arrReduce3,
  taskMap2, taskSequence,
  withoutSingleDot
} from "./shikensu/internal/utilities"

import globby from "globby"
import globParent from "glob-parent"
import path from "path"

import type { Arr } from "flow-static-land/lib/Arr"
import type { Task } from "flow-static-land/lib/Task"
import type { Dictionary, Definition, ListTask } from "./shikensu/internal/types"



// RE-EXPORT


export type { Dictionary, Definition }
export * from "./shikensu/internal/paths"



// IO


/**
 **   Make a single dictionary based on multiple glob patterns
 **   and the absolute path of some directory.
 */
export const list = (patterns: Array<string>, rootDirname: string): ListTask => fun.pipe(
  arr.inj,

  // make a task that will run `globby` for each pattern
  // and transform the resulting array into an `Arr`
  arrMap2(
    pattern => fun.pipe(
      p => () => globby(p, { cwd: rootDirname }),
      t => task.inj(t),
      t => task.map(arr.inj, t),
      t => task.map(makeDictionary3(rootDirname)(pattern), t)
    )(pattern)
  ),

  // transform the list of tasks into one task
  // and concatenate all the resulting dictionaries
  taskSequence,
  taskMap2(
    arrReduce3
      (arr.concat)
      (arr.empty())
  )
)(
  patterns
)


/**
 **   Flipped version of `list`.
 */
export const listF = fun.flip(list)


/**
 **   Same as `list`, but given a relative directory.
 */
export const listRelative = (patterns: Array<string>, relativePath: string): ListTask => {
  const absolutePath = path.join(process.cwd(), relativePath)
  return list(patterns, absolutePath)
}


/**
 **   Flipped version of `listRelative`.
 */
export const listRelativeF = fun.flip(listRelative)


/**
 **   Curried versions.
 */
export const list2 = fun.curry(list)
export const listF2 = fun.curry(listF)
export const listRelative2 = fun.curry(listRelative)
export const listRelativeF2 = fun.curry(listRelativeF)



// Pure


/**
 **   Fork a Definition.
 */
export const forkDefinition = undefined


/**
 **   Make a Definition.
 */
export const makeDefinition = (
  rootDirname: string,
  pattern: string,
  workspacePath: string
): Definition => {
  const workingDirname = fun.pipe
    (globParent, withoutSingleDot)
    (pattern)

  const localPath = workingDirname.length
    ? workspacePath.replace(new RegExp("^" + workingDirname + path.sep), "")
    : workspacePath

  const dirname = withoutSingleDot(path.dirname(localPath))
  const extname = path.extname(localPath)

  return {
    basename: path.basename(localPath, extname),
    dirname: dirname,
    extname: extname,
    pattern: pattern,
    rootDirname: rootDirname,
    workingDirname: workingDirname,

    content: maybe.Nothing,
    metadata: {},
    parentPath: utils.compileParentPath(dirname),
    pathToRoot: utils.compilePathToRoot(dirname)
  }
}


export const makeDefinition3 = fun.curry(makeDefinition)



/**
 **   Make a Dictionary.
 */
export const makeDictionary = (
  rootDirname: string,
  pattern: string,
  filepaths: Arr<string>
): Dictionary => arr.map(
  makeDefinition3(rootDirname)(pattern),
  filepaths
)


export const makeDictionary3 = fun.curry(makeDictionary)
