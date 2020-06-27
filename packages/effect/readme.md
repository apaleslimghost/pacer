# `@pacer/effect`

run an (async) generator that yields effects

## why

you have a function that needs to have side effects somewhere, but the things you need to have an effect on are from a different context to the function and you can't easily pass them around. you want to test your effectful function without mocking or injecting the things the effects are happening on.

## example

an "effect" is a function that you `yield`. it's called with some context from somewhere.

```js
const createEffect = require('@pacer/effect')

const testEffect = (...args) => console.log('test effect', ...args)

function* effectful() {
	yield testEffect
}

const runEffect = createEffect(effectful)

runEffect({ context: [{ some: 'argument' }] }) // logs "test effect { some: 'argument' }"
```

## api

### `runEffect = createEffect(func)`

wraps the (async) generator function in a function that runs it with effects

### `runEffect({ args, context })

runs an effectful function. the function is called with `args`, and the effects it yields are called with `context`. because the effectful function can be `async`, `runEffect` always returns a Promise. if the function returns a value, that's what the Promise resolves to. 
