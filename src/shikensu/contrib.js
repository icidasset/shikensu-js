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
export const clone = fun.curry(_clone)


function _clone(existingPath: string, newPath: string, dict: Dictionary): Dictionary {
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



/**
 ** Copy definition properties into the metadata.
 **/
export function copyPropsToMetadata(dict: Dictionary): Dictionary {
  return arr.map(copyPropsToMetadataDef, dict)
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
    metadata: { ...def.metadata, ...props }
  }
}



/**
 ** Exclude.
 **
 ** Filter out the definitions that have the given `localPath`.
 **/
export const exclude = fun.curry(_exclude)


function _exclude(path: string, dict: Dictionary): Dictionary {
  return arr.filter(def => localPath(def) !== path, dict)
}



/**
 ** Insert metadata.
 **
 ** Merge the current metadata object with another one.
 **/
export const insertMetadata = fun.curry(_insertMetadata)
export const insertMetadataDef = fun.curry(_insertMetadataDef)


function _insertMetadata(obj: any, dict: Dictionary): Dictionary {
  return arr.map(def => insertMetadataDef(obj, def), dict)
}


function _insertMetadataDef(obj: any, def: Definition): Definition {
  return {
    ...def,
    metadata: { ...def.metadata, ...obj }
  }
}



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
export const permalink = fun.curry(_permalink)
export const permalinkDef = fun.curry(_permalinkDef)


function _permalink(newBasename: string, dict: Dictionary): Dictionary {
  return arr.map(def => permalinkDef(newBasename, def), dict)
}


function _permalinkDef(newBasename: string, def: Definition): Definition {
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



/**
 ** Prefix dirname.
 **
 ** Prefix the dirname of each definition with a given string.
 */
export const prefixDirname = fun.curry(_prefixDirname)
export const prefixDirnameDef = fun.curry(_prefixDirnameDef)


function _prefixDirname(prefix: string, dict: Dictionary): Dictionary {
  return arr.map(def => prefixDirnameDef(prefix, def), dict)
}


function _prefixDirnameDef(prefix: string, def: Definition): Definition {
  const newDirname = prefix + def.dirname

  return {
    ...def,
    dirname: newDirname,
    parentPath: paths.compileParentPath(newDirname),
    pathToRoot: paths.compilePathToRoot(newDirname)
  }
}



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
export const rename = fun.curry(_rename)
export const renameDef = fun.curry(_renameDef)


function _rename(oldPath: string, newPath: string, dict: Dictionary): Dictionary {
  return arr.map(def => renameDef(oldPath, newPath, def), dict)
}


function _renameDef(oldPath: string, newPath: string, def: Definition): Definition {
  return (localPath(def) === oldPath)
    ? forkDefinition(newPath, def)
    : def
}



/**
 ** Rename extension.
 **
 ** @example
 ** renameExt(".markdown", ".html", dictionary)
 **
 ** The definitions that had the extname ".markdown"
 ** now have the extname ".html".
 */
export const renameExt = fun.curry(_renameExt)
export const renameExtDef = fun.curry(_renameExtDef)


function _renameExt(oldExtname: string, newExtname: string, dict: Dictionary): Dictionary {
  return arr.map(def => renameExtDef(oldExtname, newExtname, def), dict)
}


function _renameExtDef(oldExtname: string, newExtname: string, def: Definition): Definition {
  return (def.extname === oldExtname)
    ? { ...def, extname: newExtname }
    : def
}



/**
 ** Render content.
 **
 ** Replace the content property by providing a renderer.
 ** A renderer is a function with the signature `Definition -> Maybe Buffer`.
 ** You can use this to render templates, markdown, etc.
 */
export const renderContent = fun.curry(_renderContent)
export const renderContentDef = fun.curry(_renderContentDef)


function _renderContent(renderer: Renderer, dict: Dictionary): Dictionary {
  return arr.map(def => renderContentDef(renderer, def), dict)
}


function _renderContentDef(renderer: Renderer, def: Definition): Definition {
  return { ...def, content: renderer(def) }
}



/**
 ** Set content.
 **
 ** Replace the content property by providing some static content.
 */
export const setContent = fun.curry(_setContent)
export const setContentDef = fun.curry(_setContentDef)


function _setContent(content: Buffer, dict: Dictionary): Dictionary {
  return arr.map(def => setContentDef(content, def), dict)
}


function _setContentDef(content: Buffer, def: Definition): Definition {
  return { ...def, content: maybe.of(content) }
}



/**
 ** Transform content.
 **
 ** Alias for `renderContent`.
 */
export const transformContent = renderContent
export const transformContentDef = renderContentDef



/**
 ** Replace metadata.
 **
 ** Replace the current hash map with another one.
 */
export const replaceMetadata = fun.curry(_replaceMetadata)
export const replaceMetadataDef = fun.curry(_replaceMetadataDef)


function _replaceMetadata(obj: any, dict: Dictionary): Dictionary {
  return arr.map(def => replaceMetadataDef(obj, def), dict)
}


function _replaceMetadataDef(obj: any, def: Definition): Definition {
  return { ...def, metadata: obj }
}
