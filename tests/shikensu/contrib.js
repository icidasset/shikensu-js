// @flow
//
// Tests.Shikensu.Contrib
// ======================
//
// Tests for the `Shikensu.Contrib` module.

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


import * as Contrib from "../../src/shikensu/contrib"
import * as Shikensu from "../../src/shikensu"
import { localPath } from "../../src/shikensu/internal/paths"

import type { Definition, Dictionary } from "../../src/shikensu/internal/types"



// 🍉


const PATTERN = path.join("**", "*.md")



// 👩‍🍳


test("clone", async t => {
  const effect: Eff<{}, Promise<Dictionary>> = runTask(
    task.map(
      Contrib.clone3("example.md")("cloned.md"),
      Shikensu.listRelative([PATTERN], "./tests/fixtures")
    )
  )

  await runEff(effect).then(dictionary => {
    const def: Definition = fun.pipe(arr.last, maybe.fromJust)(dictionary)

    t.is(def.basename, "cloned")
    t.is(def.pattern, PATTERN)
    t.is(arr.length(dictionary), 2)
  })
})


test("exclude", async t => {
  const effect: Eff<{}, Promise<Dictionary>> = runTask(
    task.map(
      Contrib.exclude2("example.md"),
      Shikensu.listRelative([PATTERN], "./tests/fixtures")
    )
  )

  await runEff(effect).then(dictionary => {
    t.is(arr.length(dictionary), 0)
  })
})


test("permalink", async t => {
  const effect: Eff<{}, Promise<Dictionary>> = runTask(
    task.map(
      Contrib.permalink2("index"),
      Shikensu.listRelative([PATTERN], "./tests/fixtures")
    )
  )

  await runEff(effect).then(dictionary => {
    const def: Definition = fun.pipe(arr.last, maybe.fromJust)(dictionary)

    t.is(localPath(def), "example/index.md")
    t.is(def.parentPath, maybe.of(".." + path.sep))
    t.is(def.pathToRoot, maybe.of(".." + path.sep))
  })
})


test("prefixDirname", async t => {
  const effect: Eff<{}, Promise<Dictionary>> = runTask(
    task.map(
      Contrib.prefixDirname2("prefix/"),
      Shikensu.listRelative([PATTERN], "./tests")
    )
  )

  await runEff(effect).then(dictionary => {
    const def: Definition = fun.pipe(arr.last, maybe.fromJust)(dictionary)

    t.is(localPath(def), "prefix/fixtures/example.md")
    t.is(def.parentPath, maybe.of(".." + path.sep))
    t.is(def.pathToRoot, maybe.of(".." + path.sep + ".." + path.sep))
  })
})
