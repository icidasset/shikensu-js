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

import { emptyBuffer, readFile, writeFile } from "../internal/io"
import { absolutePath } from "../internal/paths"
import { arrMap, maybeWithDefault, sequence, taskMap } from "../internal/utilities"
import fs from "fs"

import type { Task } from "flow-static-land/lib/Task"
import type { Dictionary, Definition } from "../internal/types"



// Read


export const read = _read
export const readDef = _readDef


function _read(
  dict: Dictionary
): Task<{}, Dictionary> {

  return fun.pipe
    (arrMap(readDef), sequence)
    (dict)

}


function _readDef(
  def: Definition
): Task<{}, Definition> {

  return fun.pipe(
    absolutePath,
    readFile,
    task.inj,
    taskMap(c => {
      // assign contents to the definition
      return { ...def, content: maybe.of(c) }
    })
  )(
    def
  )

}



// Write


export const write = fun.curry(_write)
export const writeDef = fun.curry(_writeDef)


function _write(
  dest: string,
  dict: Dictionary
): Task<{}, Dictionary> {

  return fun.pipe
    (arrMap(writeDef(dest)), sequence)
    (dict)

}


function _writeDef(
  dest: string,
  def: Definition
): Task<{}, Definition> {

  return fun.pipe(
    maybeWithDefault(emptyBuffer),
    writeFile(dest, def),
    task.inj,
    taskMap(_ => def)
  )(
    def.content
  )

}
