fun.pipe(
  t => task.chain(read, t),
  t => task.map(flow, t),
  t => task.map(inspect, t),
  t => task.chain(write("./build"))
)(
  Shikensu.listRelative(["posts/**/*.md"], "./src")
)


const flow = fun.pipe(
  renameExtension(".md", ".html")
)


const inspect = (dict) => {
  console.log(dict)
  return dict
}
