// @flow
//
// Shikensu.Internal.IO
// ====================
//
// Some IO functions.

import * as fun from "flow-static-land/lib/Fun"
import { localPath } from "./paths"

import fs from "fs"
import mkdirp from "mkdirp"
import path from "path"

import type { Definition } from "./types"



// Read


export const readFile = _readFile


function _readFile(path: string): (() => Promise<Buffer>) {
  return () => new Promise((resolve, reject) => {
    fs.readFile(
      path,
      {},
      (err: ?ErrnoError, contents: Buffer) => err
        ? reject(err)
        : resolve(contents)
    )
  })
}



// Write


export const writeFile = fun.curry(_writeFile)


function _writeFile(
  destination: string,
  def: Definition,
  contents: Buffer
): (() => Promise<void>) {
  const targetDir = path.join(def.rootDirname, destination)
  const targetPath = path.join(targetDir, localPath(def))

  return () => makeDirectoryPath(targetDir).then(_ => new Promise((resolve, reject) => {
    fs.writeFile(
      targetPath,
      contents,
      {},
      (err: ?ErrnoError) => err
        ? reject(err)
        : resolve()
    )
  }))
}



// OTHER


export const emptyBuffer: Buffer = Buffer.from([])


export const makeDirectoryPath = (path: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    mkdirp(path, (err: ?ErrnoError) => err
      ? reject(err)
      : resolve()
    )
  })
}
