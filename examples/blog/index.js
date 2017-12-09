import { runEff } from "flow-static-land/lib/Eff"
import { curry, pipe } from "flow-static-land/lib/Fun"
import { runTask } from "flow-static-land/lib/Task"
import chalk from "chalk"


// Shikensu imports

import * as Shikensu from "../../lib/shikensu"
import { permalink, renameExt, renderContent } from "../../lib/shikensu/contrib"
import { read, write } from "../../lib/shikensu/contrib/io"


// Local imports

import {
  chainTask,
  mapTask,

  createIndex,
  frontmatter,
  renameToTitle,

  markdownRenderer,
  layoutRenderer
} from "./functions"



// 🍯


const flow = pipe(
  renameExt(".md", ".html"),
  frontmatter,
  renameToTitle,
  permalink("index"),
  createIndex,
  renderContent(markdownRenderer),
  renderContent(layoutRenderer)
)


function success(dictionary) {
  console.log(chalk.green("Build was successful!"))
}


function failure(err) {
  console.error(chalk.red("Build failed!"))
  console.error(chalk.red("-------------"))
  console.error(chalk.red(err))
}



// 🚀


pipe(
  Shikensu.listRelative   ("./blog"),

  chainTask     ( read ),
  mapTask       ( flow ),
  chainTask     ( write("./build") ),

  runTask,
  runEff,

  a => a.then(success, failure)

)([ "posts/*.md" ])
