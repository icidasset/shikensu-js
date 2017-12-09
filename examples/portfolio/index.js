import chalk from "chalk"


// Shikensu imports

import * as Shikensu from "../../lib/shikensu"
import { permalink, renameExt, renderContent } from "../../lib/shikensu/contrib"
import { read, write } from "../../lib/shikensu/contrib/io"


// Local imports

import {
  createIndex,
  parseYaml,
  renameToTitle,

  layoutRenderer,
  pageRenderer
} from "./functions"



// 🍯


const flow = dict => [
  renameExt(".yaml", ".html"),
  parseYaml,
  renameToTitle,
  permalink("index"),
  renderContent(pageRenderer),
  createIndex,
  renderContent(layoutRenderer)

].reduce(
  (acc, fn) => fn(acc),
  (dict)

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


const eff = fn => dict => fn(dict)()


Shikensu.listRelative("./portfolio", ["projects/**/*.yaml"])()
  .then(eff( read ))
  .then(flow)
  .then(eff( write("./build") ))
  .then(success)
  .catch(failure)
