import path from "path"
import Remarkable from "remarkable"
import slug from "slug"
import yaml from "js-yaml"


// Shikensu imports

import * as Shikensu from "../../lib/shikensu"

import {
  bufferToString,
  renderUtf8Content,
  stringToBuffer
} from "../../lib/shikensu/rendering"



// Dictionary functions


export function createIndex(dictionary) {
  return [...dictionary, _createIndex(dictionary)]
}


function _createIndex(dictionary) {
  const root  = path.join(process.cwd(), "portfolio")
  const def   = Shikensu.makeDefinition(root, "", "index.html")

  return {
    ...def,
    metadata: {
      title: "My f'ing portfolio"
    },
    content: stringToBuffer(_renderMarkdown(
      dictionary
        .map(b => `- [${b.metadata.title}](${b.dirname}/)`)
        .join("\n") + "."
    ))
  }
}


function _renderMarkdown(md) {
  return new Remarkable().render(md)
}


export function parseYaml(dictionary) {
  return dictionary.map(_parseYaml)
}


function _parseYaml(def) {
  if (def.content) {
    const data = def.content
      ? yaml.safeLoad(bufferToString(def.content))
      : {}

    return {
      ...def,
      metadata: { ...def.metadata, ...data }
    }
  }

  return def
}


export function renameToTitle(dictionary) {
  return dictionary.map(_renameToTitle)
}


function _renameToTitle(def) {
  return {
    ...def,
    basename: slug(def.metadata.title, { mode: "rfc3986" })
  }
}



// Renderers


export function layoutRenderer(def) {
  return def.content
    ? renderUtf8Content(html => wrapInLayout(def, html))(def.content)
    : def.content
}


export function pageRenderer(def) {
  return `
<h1>${def.metadata.title}</h1>
<h2>Description</h2>
<p>${def.metadata.description}</p>
  `
  .replace(/^\s*/, "")
  .trim()
}


function wrapInLayout(def, html) {
  return `
<!DOCTYPE>
<html>
<head><title>${def.metadata.title}</title></head>
<body>
  ${html}
</body>
</html>
  `
  .replace(/^\s*/, "")
  .trim()
}
