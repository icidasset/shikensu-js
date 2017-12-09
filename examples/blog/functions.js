import * as arr from "flow-static-land/lib/Arr"
import * as maybe from "flow-static-land/lib/Maybe"
import * as task from "flow-static-land/lib/Task"
import { curry, pipe } from "flow-static-land/lib/Fun"

import matter from "gray-matter"
import Remarkable from "remarkable"
import slug from "slug"


// Shikensu imports

import {
  bufferToString,
  renderUtf8Content,
  stringToBuffer
} from "../../lib/shikensu/rendering"



// ⚗️


export const chainTask = curry(task.chain)
export const mapTask = curry(task.map)



// Dictionary functions


export function frontmatter(dictionary) {
  return arr.map(_frontmatter, dictionary)
}


function _frontmatter(def) {
  if (maybe.isJust(def.content)) {
    const result = pipe(maybe.fromJust, bufferToString, matter)(def.content)
    const maybuf = pipe(stringToBuffer, maybe.of)(result.content)

    return {
      ...def,
      content: maybuf,
      metadata: { ...def.metadata, ...result.data }
    }
  }

  return def
}


export function renameToTitle(dictionary) {
  return arr.map(_renameToTitle, dictionary)
}


function _renameToTitle(def) {
  return {
    ...def,
    basename: slug(def.metadata.title, { mode: "rfc3986" })
  }
}



// Renderers


export function markdownRenderer(def) {
  return maybe.map(
    renderUtf8Content(renderMarkdown),
    def.content
  )
}


export function layoutRenderer(def) {
  return maybe.map(
    renderUtf8Content(wrapInLayout),
    def.content
  )
}


function renderMarkdown(md) {
  return new Remarkable().render(md)
}


function wrapInLayout(html) {
  return `
<!DOCTYPE>
<html>
<head><title>My f'ing blog</title></head>
<body>
  ${html}
</body>
</html>
  `
  .replace(/^\s*/, "")
  .trim()
}
