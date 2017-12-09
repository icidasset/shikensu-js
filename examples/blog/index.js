import * as task from "flow-static-land/lib/Task"
import { runEff } from "flow-static-land/lib/Eff"
import { curry, pipe } from "flow-static-land/lib/Fun"
import { runTask } from "flow-static-land/lib/Task"
import chalk from "chalk"


// Shikensu imports

import * as Shikensu from "../../lib/shikensu"
import { renameExt } from "../../lib/shikensu/contrib"
import { read, write } from "../../lib/shikensu/contrib/io"



// ⚗️


const chain = curry(task.chain)
const map = curry(task.map)



// 🍯


pipe(
  Shikensu.listRelative("./blog"),

  chain( inspect ),
  chain( read ),
  map( flow ),
  chain( write("./build") ),

  runTask,
  runEff

)([ "posts/*.md" ]).then(dict => {
  console.log(chalk.green("Build was successful!"))

}).catch(err => {
  console.error(chalk.red("Build failed!"))
  console.error(chalk.red("-------------"))
  console.error(chalk.red(err))

})


function flow(dict) {
  return pipe(
    renameExt(".md", ".html")
  )(
    dict
  )
}


function inspect(dict) {
  dict.forEach(
    def => console.log(`Processing \`${def.basename}${def.extname}\``)
  )

  return task.of(dict)
}
