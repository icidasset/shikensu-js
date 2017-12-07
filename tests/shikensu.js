// @flow

import { runEff } from "flow-static-land/lib/Eff"
import { runTask } from "flow-static-land/lib/Task"
import test from "ava"

import type { Eff } from "flow-static-land/lib/Eff"


// Library code


import * as Shikensu from "../src/shikensu"
import type { Definition, Dictionary } from "../lib/shikensu/internal/types"



// Basic execution tests


test(async t => {
  const effect: Eff<{}, Promise<Dictionary>> = runTask(
    Shikensu.list(["src/*.js"], process.cwd())
  )

  await runEff(effect).then(dictionary => {
    t.pass("Dictionary was created")
  })
})
