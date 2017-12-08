// @flow
//
// Tests.Shikensu.Contrib.IO
// =========================
//
// Tests for the `Shikensu.Contrib.IO` module.

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


import * as Shikensu from "../../../src/shikensu"
import * as ShikensuIO from "../../../src/shikensu/contrib/io"

import * as io from "../../../src/shikensu/internal/io"
import * as utils from "../../../src/shikensu/internal/utilities"

import { emptyBuffer } from "../../../src/shikensu/internal/io"

import type { Definition, Dictionary } from "../../../src/shikensu/internal/types"



// 👩‍🍳


test("read", async t => {
  const pattern = path.join("tests", "fixtures", "example.md")
  const effect: Eff<{}, Promise<Dictionary>> = runTask(
    task.chain(
      ShikensuIO.read,
      Shikensu.list([pattern], process.cwd())
    )
  )

  await runEff(effect).then((dictionary: Dictionary) => {
    const def: Definition = fun.pipe(arr.head, maybe.fromJust)(dictionary)
    const contents: Buffer = maybe.fromMaybe(emptyBuffer, def.content)

    t.truthy(def)
    t.is(contents.toString(), "# Example 🦄\n")
  })
})


test("write", async t => {
  const pattern = path.join("tests", "fixtures", "example.md")
  const destination = path.join("tests", "tmp")

  const effect: Eff<{}, Promise<Dictionary>> = runTask(
    fun.pipe(
      Shikensu.list2([pattern]),
      utils.taskChain2(ShikensuIO.read),
      utils.taskChain2(ShikensuIO.write2(destination)),
    )(
      process.cwd()
    )
  )

  await runEff(effect).then(_ => {
    return io.readFile("./tests/tmp/example.md")()
  }).then((buf: Buffer) => {
    t.is(buf.toString(), "# Example 🦄\n")
  })
})
