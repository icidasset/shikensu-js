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
 ** No single dots for directories please.
 */
export const withoutSingleDot = (directoryPath: string): string => {
  return directoryPath === "."
    ? ""
    : directoryPath
}



// Tasks


/**
 ** Sequence
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


export const arrMap = fun.curry(arr.map)
export const arrReduce = fun.curry(arr.reduce)
export const maybeWithDefault = fun.curry(maybe.fromMaybe)
export const taskChain = fun.curry(task.chain)
export const taskMap = fun.curry(task.map)
export const taskSequence = sequence
