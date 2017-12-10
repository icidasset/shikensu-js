# Shīkensu

> シーケンス    
> Sequence

Run a sequence of functions on in-memory representations of files.  
__Build static websites with ease__, without conforming to a specific structure.



### Port

This is a port of the original [Haskell version](https://github.com/icidasset/shikensu).



### Usage

This library was built with [`flow-static-land`](https://github.com/gcanti/flow-static-land), which you may or may not use. You can look at the examples for both use cases.

- [Example with](examples/blog/index.js#L61)
- [Example without](examples/portfolio/index.js#L56)

It basically boils down to this:

```
import * as shikensu from "shikensu"
import { renameExt, permalink } from "shikensu/lib/contrib"

const io = fn => dictionary => fn(dictionary)()

shikensu.listRelative("./blog", ["posts/**/*.md"])()
  .then( io(read) )
  .then( renameExt(".md", ".html") )
  .then( permalink("index" ))
  .then( io(write("build")) )
```

Given `./blog/posts/code/example-post.md`,  
this code will produce `./blog/build/code/example-post/index.html`.


#### Contrib

You can see all the functions in the [source code](src/shikensu/contrib.js) which includes documentation and some examples.


#### List functions

The main module has the following list functions:

- `list(a: string, b: Array<string>)`
- `listF(a: Array<string>, b: string)`
- `listRelative(a: string, b: Array<string>)`
- `listRelativeF(a: Array<string>, b: string)`

And the following functions to [construct paths](src/shikensu/internal/paths.js#L16):

- `absolutePath(definition)`
- `localPath(definition)`
- `workspacePath(definition)`

See the [source code](src/shikensu.js) for other functions.


#### Curried functions

__All functions are curried by default.__  
This means that you can make all these combinations:

- `renameExt(a, b, c)`
- `renameExt(a, b)(c)`
- `renameExt(a)(b)(c)`
