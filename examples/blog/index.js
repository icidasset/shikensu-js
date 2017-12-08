import * as task from "flow-static-land/lib/Task"
import { curry, pipe } from "flow-static-land/lib/Fun"
import { runTask } from "flow-static-land/lib/Task"


// Shikensu imports

import * from "shikensu"
import * from "shikensu/lib/contrib"
import * from "shikensu/lib/contrib/io"



// 🍯


pipe(
  Shikensu.listRelative("./src"),

  chain( read ),
  map( flow ),
  map( inspect ),
  chain( write("./build") ),

  runTask

)([ "posts/**/*.md" ]).then(function() {
  console.success("Build was successful!")

}).catch(function() {
  console.error("Build failed!")

})


const flow = pipe(
  renameExtension(".md", ".html")
)


const inspect = (dict) => {
  console.log(dict)
  return dict
}



// ⚗️


const chain = curry(task.chain)
const map = curry(task.map)
