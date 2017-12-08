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
import type { Maybe } from "flow-static-land/lib/Maybe"


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
      Contrib.clone("example.md", "cloned.md"),
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
      Contrib.exclude("example.md"),
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
      Contrib.permalink("index"),
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
      Contrib.prefixDirname("prefix/"),
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


test("rename", async t => {
  const effect: Eff<{}, Promise<Dictionary>> = runTask(
    task.map(
      Contrib.rename("example.md", "test.html"),
      Shikensu.listRelative([PATTERN], "./tests/fixtures")
    )
  )

  await runEff(effect).then(dictionary => {
    const def: Definition = fun.pipe(arr.last, maybe.fromJust)(dictionary)

    t.is(def.basename, "test")
    t.is(def.extname, ".html")
  })
})


test("renameExt", async t => {
  const effect: Eff<{}, Promise<Dictionary>> = runTask(
    task.map(
      Contrib.renameExt(".md", ".html"),
      Shikensu.listRelative([PATTERN], "./tests/fixtures")
    )
  )

  await runEff(effect).then(dictionary => {
    const def: Definition = fun.pipe(arr.last, maybe.fromJust)(dictionary)

    t.is(def.extname, ".html")
  })
})


test("renderContent", async t => {
  const buf: Buffer = Buffer.from("🥑", "utf8")
  const bufm: Maybe<Buffer> = maybe.of(buf)
  const to_s = m => maybe.map(b => b.toString(), m)

  const effect: Eff<{}, Promise<Dictionary>> = runTask(
    task.map(
      Contrib.renderContent(_ => bufm),
      Shikensu.listRelative([PATTERN], "./tests/fixtures")
    )
  )

  await runEff(effect).then(dictionary => {
    const def: Definition = fun.pipe(arr.last, maybe.fromJust)(dictionary)
    t.is(to_s(def.content), to_s(bufm))
  })
})


test("setContent", async t => {
  const buf: Buffer = Buffer.from("🥑", "utf8")
  const bufm: Maybe<Buffer> = maybe.of(buf)
  const to_s = m => maybe.map(b => b.toString(), m)

  const effect: Eff<{}, Promise<Dictionary>> = runTask(
    task.map(
      Contrib.setContent(buf),
      Shikensu.listRelative([PATTERN], "./tests/fixtures")
    )
  )

  await runEff(effect).then(dictionary => {
    const def: Definition = fun.pipe(arr.last, maybe.fromJust)(dictionary)
    t.is(to_s(def.content), to_s(bufm))
  })
})
