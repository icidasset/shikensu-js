// @flow
//
// Tests.Shikensu
// ==============
//
// Tests for the Main module.

import { runEff } from "flow-static-land/lib/Eff"
import { runTask } from "flow-static-land/lib/Task"

import * as arr from "flow-static-land/lib/Arr"
import * as fun from "flow-static-land/lib/Fun"
import * as maybe from "flow-static-land/lib/Maybe"
import * as task from "flow-static-land/lib/Task"

import path from "path"
import test from "ava"

import type { Eff } from "flow-static-land/lib/Eff"


// Library code


import * as Shikensu from "../src/shikensu"
import type { Definition, Dictionary } from "../src/shikensu/internal/types"



// 👩‍🍳


test("regular", async t => {
  const pattern = path.join("tests", "**", "*.md")
  const effect: Eff<{}, Promise<Dictionary>> = runTask(
    Shikensu.list([pattern], process.cwd())
  )

  await runEff(effect).then(dictionary => {
    const def: Definition = fun.pipe(arr.head, maybe.fromJust)(dictionary)

    t.is(def.basename, "example")
    t.is(def.dirname, "fixtures")
    t.is(def.extname, ".md")
    t.is(def.pattern, pattern)
    t.is(def.workingDirname, "tests")
  })
})


test("dot", async t => {
  const pattern = path.join(".", "tests", "**", "*.md")
  const effect: Eff<{}, Promise<Dictionary>> = runTask(
    Shikensu.listF(process.cwd(), [pattern])
  )

  await runEff(effect).then(dictionary => {
    const def: Definition = fun.pipe(arr.head, maybe.fromJust)(dictionary)

    t.is(def.basename, "example")
    t.is(def.dirname, "fixtures")
    t.is(def.extname, ".md")
    t.is(def.pattern, pattern)
    t.is(def.workingDirname, "tests")
  })
})


test("without workingDirname", async t => {
  const pattern = path.join("**", "*.md")
  const effect: Eff<{}, Promise<Dictionary>> = runTask(
    Shikensu.listRelative([pattern], "tests")
  )

  await runEff(effect).then(dictionary => {
    const def: Definition = fun.pipe(arr.head, maybe.fromJust)(dictionary)

    t.is(def.basename, "example")
    t.is(def.dirname, "fixtures")
    t.is(def.extname, ".md")
    t.is(def.pattern, pattern)
    t.is(def.workingDirname, "")
  })
})


test("no dirname", async t => {
  const pattern = path.join("fixtures/*.md")
  const effect: Eff<{}, Promise<Dictionary>> = runTask(
    Shikensu.listRelativeF("tests", [pattern])
  )

  await runEff(effect).then(dictionary => {
    const def: Definition = fun.pipe(arr.head, maybe.fromJust)(dictionary)

    t.is(def.basename, "example")
    t.is(def.dirname, "")
    t.is(def.extname, ".md")
    t.is(def.pattern, pattern)
    t.is(def.workingDirname, "fixtures")
  })
})


test("root file", async t => {
  const pattern = path.join("*.md")
  const effect: Eff<{}, Promise<Dictionary>> = runTask(
    Shikensu.listRelative([pattern], ".")
  )

  await runEff(effect).then(dictionary => {
    const def: Definition = fun.pipe(arr.head, maybe.fromJust)(dictionary)

    t.is(def.basename, "README")
    t.is(def.dirname, "")
    t.is(def.extname, ".md")
    t.is(def.pattern, pattern)
    t.is(def.workingDirname, "")
  })
})
