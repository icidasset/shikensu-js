// @flow
//
// Shikensu.Rendering
// ==================
//
// Some helper functions for rendering things.

import { pipe } from "flow-static-land/lib/Fun"


// Buffers


export const bufferToString     = (buf: Buffer): string => buf.toString("utf8")
export const stringToBuffer     = (str: string): Buffer => Buffer.from(str, "utf8")



// Renderers


export function renderUtf8Content(fn: (string => string)): (Buffer => Buffer) {
  return pipe(bufferToString, fn, stringToBuffer)
}
