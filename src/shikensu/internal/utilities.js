// @flow
//
// Shikensu.Internal.Utilities
// ===========================
//
// Additional functions for internal use.

import * as arr from "flow-static-land/lib/Arr"
import * as maybe from "flow-static-land/lib/Maybe"
import * as fun from "flow-static-land/lib/Fun"
import * as task from "flow-static-land/lib/Task"

import path from "path"

import type { Arr } from "flow-static-land/lib/Arr"
import type { Maybe } from "flow-static-land/lib/Maybe"
import type { Task } from "flow-static-land/lib/Task"



// Definitions


/**
 **   Path to root, when there is one.
 **
 **   For example, if `dirname` is 'example/subdir',
 **   then this will be `../../`.
 **
 **   If the `dirname` is empty,
 **   then this will be empty as well.
 */
export const compilePathToRoot = (dirname: string): Maybe<string> => {
  const ds: Array<string> =
    dirname.split(path.sep).slice(1)

  return ds.length === 0
    ? maybe.Nothing
    : maybe.of(
        ds.map(_ => "..").join(path.sep) + path.sep
      )
}



/**
 **   Path to parent, when there is one.
 */
export const compileParentPath = (dirname: string): Maybe<string> => {
  return dirname === ""
    ? maybe.Nothing
    : maybe.of(".." + path.sep)
}



// Tasks


/**
 **   Sequence
 */
export const sequence = function<A, B>(list: Arr<Task<A, B>>): Task<A, Arr<B>> {
  return arr.reduce(
    (previousTask: Task<A, Arr<B>>, nextTask: Task<A, B>) => task.chain(
      (acc: Arr<B>) => task.map(
        (a: B) => arr.concat(acc, arr.of(a)),
        nextTask
      ),

      previousTask
    ),

    task.of(arr.empty()),
    list
  )
}



// Curried functions and aliases


export const arrMap2 = fun.curry(arr.map)
export const arrReduce3 = fun.curry(arr.reduce)
export const taskMap2 = fun.curry(task.map)
export const taskSequence = sequence
