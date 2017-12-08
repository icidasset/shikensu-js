// @flow
//
// Shikensu.Contrib
// ================
//
// Pure functions that operate on dictionaries and definitions.

import * as arr from "flow-static-land/lib/Arr"
import * as fun from "flow-static-land/lib/Fun"
import * as maybe from "flow-static-land/lib/Maybe"
import * as paths from "./internal/paths"

import { localPath } from "./internal/paths"
import { forkDefinition } from "../shikensu"
import path from "path"

import type { Dictionary, Definition, Renderer } from "./internal/types"



/**
 ** Clear metadata.
 **
 ** Replace the current metadata with an empty object.
 */
export function clearMetadata(dict: Dictionary): Dictionary {
  return arr.map(clearMetadataDef, dict)
}


export function clearMetadataDef(def: Definition): Definition {
  return { ...def, metadata: {} }
}



/**
 ** Clone.
 **
 ** For each definition that has the given `localPath` (1st argument),
 ** make a clone with a new `localPath` (2nd argument),
 ** and add that into dictionary just after the matching definition.
 **
 ** @example
 ** clone("index.html", "200.html", dictionary)
 */
export function clone(existingPath: string, newPath: string, dict: Dictionary): Dictionary {
  return arr.concat(
    dict,
    arr.reduce(
      (acc: Dictionary, def: Definition): Dictionary => {
        return (localPath(def) === existingPath)
          ? arr.cons(forkDefinition(newPath, def), acc)
          : acc
      },
      arr.empty(),
      dict
    )
  )
}


export const clone3 = fun.curry(clone)



/**
 ** Copy definition properties into the metadata.
 **/
export function copyPropsToMetadata(dict: Dictionary): Dictionary {
  return arr.map(clearMetadataDef, dict)
}


export function copyPropsToMetadataDef(def: Definition): Definition {
  const props = {
    basename: def.basename,
    extname: def.extname,
    dirname: def.dirname,
    pattern: def.pattern,
    workingDirname: def.workingDirname,
    parentPath: def.parentPath,
    pathToRoot: def.pathToRoot
  }

  return {
    ...def,
    metadata: { ...def.metadata, props }
  }
}



/**
 ** Exclude.
 **
 ** Filter out the definitions that have the given `localPath`.
 **/
export function exclude(path: string, dict: Dictionary): Dictionary {
  return arr.filter(def => localPath(def) !== path, dict)
}


export const exclude2 = fun.curry(exclude)



/**
 ** Insert metadata.
 **
 ** Merge the current metadata object with another one.
 **/
export function insertMetadata(obj: any, dict: Dictionary): Dictionary {
  return arr.map(def => insertMetadataDef(obj, def), dict)
}


export function insertMetadataDef(obj: any, def: Definition): Definition {
  return {
    ...def,
    metadata: { ...def.metadata, ...obj }
  }
}


export const insertMetadata2 = fun.curry(insertMetadata)
export const insertMetadataDef2 = fun.curry(insertMetadataDef)



/**
 ** Permalink.
 **
 ** Append the basename to the dirname,
 ** and change the basename to the given string.
 ** It will NOT change definitions that already have the new basename.
 **
 ** @example
 ** permalink("index", dictionary)
 */
export function permalink(newBasename: string, dict: Dictionary): Dictionary {
  return arr.map(def => permalinkDef(newBasename, def), dict)
}


export function permalinkDef(newBasename: string, def: Definition): Definition {
  if (def.basename !== newBasename) {
    const newDirname = path.join(def.dirname, def.basename)

    return {
      ...def,
      basename: newBasename,
      dirname: newDirname,
      parentPath: paths.compileParentPath(newDirname),
      pathToRoot: paths.compilePathToRoot(newDirname)
    }

  }

  return def
}


export const permalink2 = fun.curry(permalink)
export const permalinkDef2 = fun.curry(permalinkDef)



/**
 ** Prefix dirname.
 **
 ** Prefix the dirname of each definition with a given string.
 */
export function prefixDirname(prefix: string, dict: Dictionary): Dictionary {
  return arr.map(def => prefixDirnameDef(prefix, def), dict)
}


export function prefixDirnameDef(prefix: string, def: Definition): Definition {
  const newDirname = prefix + def.dirname

  return {
    ...def,
    dirname: newDirname,
    parentPath: paths.compileParentPath(newDirname),
    pathToRoot: paths.compilePathToRoot(newDirname)
  }
}


export const prefixDirname2 = fun.curry(prefixDirname)
export const prefixDirnameDef2 = fun.curry(prefixDirnameDef)



/**
 ** Rename.
 **
 ** Change the `localPath` of the definitions that match a given `localPath`.
 ** For example, if you have a definition with the local path `a/b/example.html`:
 **
 ** @example
 ** rename("a/b/example.html", "example/index.html", dictionary)
 **
 ** See `Shikensu.localPath` for more info.
 */
export function rename(oldPath: string, newPath: string, dict: Dictionary): Dictionary {
  return arr.map(def => renameDef(oldPath, newPath, def), dict)
}


export function renameDef(oldPath: string, newPath: string, def: Definition): Definition {
  return (localPath(def) === oldPath)
    ? forkDefinition(newPath, def)
    : def
}


export const rename3 = fun.curry(rename)
export const renameDef3 = fun.curry(renameDef)



/**
 ** Rename extension.
 **
 ** @example
 ** renameExt(".markdown", ".html", dictionary)
 **
 ** The definitions that had the extname ".markdown"
 ** now have the extname ".html".
 */
export function renameExt(oldExtname: string, newExtname: string, dict: Dictionary): Dictionary {
  return arr.map(def => renameExtDef(oldExtname, newExtname, def), dict)
}


export function renameExtDef(oldExtname: string, newExtname: string, def: Definition): Definition {
  return (def.extname === oldExtname)
    ? { ...def, extname: newExtname }
    : def
}


export const renameExt3 = fun.curry(renameExt)
export const renameExtDef3 = fun.curry(renameExtDef)



/**
 ** Render content.
 **
 ** Replace the content property by providing a renderer.
 ** A renderer is a function with the signature `Definition -> Maybe ByteString`.
 ** You can use this to render templates, markdown, etc.
 */
// TODO
export function renderContent(renderer: Renderer, dict: Dictionary): Dictionary {
  return arr.map(def => renderContentDef(renderer, def), dict)
}


export function renderContentDef(renderer: Renderer, def: Definition): Definition {
  return { ...def, content: renderer(def) }
}


export const renderContent2 = fun.curry(renderContent)
export const renderContentDef2 = fun.curry(renderContentDef)



/**
 ** Set content.
 **
 ** Replace the content property by providing some static content.
 */
export function setContent(content: Buffer, dict: Dictionary): Dictionary {
  return arr.map(def => setContentDef(content, def), dict)
}


export function setContentDef(content: Buffer, def: Definition): Definition {
  return { ...def, content: maybe.of(content) }
}


export const setContent2 = fun.curry(setContent)
export const setContentDef2 = fun.curry(setContentDef)



/**
 ** Transform content.
 **
 ** Alias for `renderContent`.
 */
export const transformContent = renderContent
export const transformContent2 = renderContent2
export const transformContentDef = renderContentDef
export const transformContentDef2 = renderContentDef2



/**
 ** Replace metadata.
 **
 ** Replace the current hash map with another one.
 */
export function replaceMetadata(obj: any, dict: Dictionary): Dictionary {
  return arr.map(def => replaceMetadataDef(obj, def), dict)
}


export function replaceMetadataDef(obj: any, def: Definition): Definition {
  return { ...def, metadata: obj }
}


export const replaceMetadata2 = fun.curry(replaceMetadata)
export const replaceMetadataDef2 = fun.curry(replaceMetadataDef)
