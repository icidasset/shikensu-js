// @flow
//
// Shikensu.Contrib.IO
// ===================
//
// IO operations and stuff.

import * as arr from "flow-static-land/lib/Arr"
import * as maybe from "flow-static-land/lib/Maybe"
import * as fun from "flow-static-land/lib/Fun"
import * as task from "flow-static-land/lib/Task"

import { emptyBuffer, readFile, writeFile2 } from "../internal/io"
import { absolutePath } from "../internal/paths"
import { arrMap2, maybeWithDefault2, sequence, taskMap2 } from "../internal/utilities"
import fs from "fs"

import type { Task } from "flow-static-land/lib/Task"
import type { Dictionary, Definition } from "../internal/types"



// Read


export const read = (
  dict: Dictionary
): Task<{}, Dictionary> => (

  fun.pipe
    (arrMap2(readDef), sequence)
    (dict)

)


export const readDef = (
  def: Definition
): Task<{}, Definition> => (

  fun.pipe(
    absolutePath,
    readFile,
    task.inj,
    taskMap2(c => {
      // assign contents to the definition
      return { ...def, content: maybe.of(c) }
    })
  )(
    def
  )

)



// Write


export const write = (
  dest: string,
  dict: Dictionary
): Task<{}, Dictionary> => (

  fun.pipe
    (arrMap2(writeDef2(dest)), sequence)
    (dict)

)


export const writeDef = (
  dest: string,
  def: Definition
): Task<{}, Definition> => (

  fun.pipe(
    maybeWithDefault2(emptyBuffer),
    writeFile2(dest, def),
    task.inj,
    taskMap2(_ => def)
  )(
    def.content
  )

)


export const write2 = fun.curry(write)
export const writeDef2 = fun.curry(writeDef)
