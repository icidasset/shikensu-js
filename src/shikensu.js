// @flow
//
// Main module
// ===========
//
// Most things you"ll need will be available through this module.

import * as arr from "flow-static-land/lib/Arr"
import * as fun from "flow-static-land/lib/Fun"
import * as maybe from "flow-static-land/lib/Maybe"
import * as paths from "./shikensu/internal/paths"
import * as task from "flow-static-land/lib/Task"

import {
  arrMap, arrReduce,
  taskMap, taskSequence,
  withoutSingleDot
} from "./shikensu/internal/utilities"

import globby from "globby"
import globParent from "glob-parent"
import path from "path"

import type { Arr } from "flow-static-land/lib/Arr"
import type { Task } from "flow-static-land/lib/Task"

import type {
  Dictionary, Definition,
  ListTask, Renderer
} from "./shikensu/internal/types"



// RE-EXPORT


export type { Dictionary, Definition, Renderer }
export * from "./shikensu/internal/paths"



// IO


/**
 ** Make a single dictionary based on multiple glob patterns
 ** and the absolute path of some directory.
 */
export const list   = fun.curry(_list)
export const listF  = fun.pipe(fun.flip, fun.curry)(_list)


function _list(patterns: Array<string>, rootDirname: string): ListTask {
  return fun.pipe(
    arr.inj,

    // make a task that will run `globby` for each pattern
    // and transform the resulting array into an `Arr`
    arrMap(
      pattern => fun.pipe(
        p => () => globby(p, { cwd: rootDirname }),
        t => task.inj(t),
        t => task.map(arr.inj, t),
        t => task.map(makeDictionary(rootDirname, pattern), t)
      )(pattern)
    ),

    // transform the list of tasks into one task
    // and concatenate all the resulting dictionaries
    taskSequence,
    taskMap(
      arrReduce
        (arr.concat)
        (arr.empty())
    )
  )(
    patterns
  )
}


/**
 ** Same as `list`, but given a relative directory.
 */
export const listRelative   = fun.curry(_listRelative)
export const listRelativeF  = fun.pipe(fun.flip, fun.curry)(_listRelative)


function _listRelative(patterns: Array<string>, relativePath: string): ListTask {
  const absolutePath = path.join(process.cwd(), relativePath)
  return _list(patterns, absolutePath)
}



// Pure


/**
 ** Fork a Definition.
 */
export const forkDefinition = fun.curry(_forkDefinition)


function _forkDefinition(
  newLocalPath: string,
  def: Definition
): Definition {
  const dirname = fun.pipe
    (path.dirname, withoutSingleDot)
    (newLocalPath)

  const extname =
    path.extname(newLocalPath)

  return {
    basename:           path.basename(newLocalPath, extname),
    extname:            path.extname(newLocalPath),
    dirname:            dirname,
    pattern :           def.pattern,
    workingDirname:     def.workingDirname,
    rootDirname:        def.rootDirname,

    content:            def.content,
    metadata:           def.metadata,
    parentPath:         paths.compileParentPath(dirname),
    pathToRoot:         paths.compilePathToRoot(dirname)
  }
}


/**
 ** Make a Definition.
 */
export const makeDefinition = fun.curry(_makeDefinition)


function _makeDefinition(
  rootDirname: string,
  pattern: string,
  workspacePath: string
): Definition {
  const workingDirname = fun.pipe
    (globParent, withoutSingleDot)
    (pattern)

  const localPath = workingDirname.length
    ? workspacePath.replace(new RegExp("^" + workingDirname + path.sep), "")
    : workspacePath

  const dirname = fun.pipe
    (path.dirname, withoutSingleDot)
    (localPath)

  const extname =
    path.extname(localPath)

  return {
    basename:           path.basename(localPath, extname),
    extname:            extname,
    dirname:            dirname,
    pattern:            pattern,
    workingDirname:     workingDirname,
    rootDirname:        rootDirname,

    content:            maybe.Nothing,
    metadata:           {},
    parentPath:         paths.compileParentPath(dirname),
    pathToRoot:         paths.compilePathToRoot(dirname)
  }
}



/**
 ** Make a Dictionary.
 */
export const makeDictionary = fun.curry(_makeDictionary)


function _makeDictionary(
  rootDirname: string,
  pattern: string,
  filepaths: Arr<string>
): Dictionary {
  return arr.map(
    makeDefinition(rootDirname, pattern),
    filepaths
  )
}
