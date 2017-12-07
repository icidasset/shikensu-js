// @flow
//
// Shikensu.Contrib.Effects
// ========================
//
// IO operations and stuff.

import * as arr from "flow-static-land/lib/Arr"
import * as maybe from "flow-static-land/lib/Maybe"
import * as fun from "flow-static-land/lib/Fun"
import * as task from "flow-static-land/lib/Task"

import { absolutePath } from "../internal/paths"
import { arrMap2, sequence, taskMap2 } from "../internal/utilities"
import fs from "fs"

import type { Task } from "flow-static-land/lib/Task"
import type { Dictionary, Definition } from "../internal/types"



// Read


export const read = (dict: Dictionary): Task<{}, Dictionary> => fun.pipe(
  arrMap2(readDef),
  sequence
)(
  dict
)


export const readDef = (def: Definition): Task<{}, Definition> => fun.pipe(
  absolutePath,
  readFile,
  task.inj,
  taskMap2(c => {
    // assign contents to the definition
    return Object.assign({}, def, { contents: maybe.of(c) })
  })
)(
  def
)



// ⚗️


const readFile = (path: string): (() => Promise<string>) => () => new Promise((resolve, reject) => {
  fs.readFile(path, { encoding: "utf-8" }, (err: ?ErrnoError, contents: string) => {
    err
      ? reject(err)
      : resolve(contents)
  })
})
