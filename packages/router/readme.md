# 🛤 `@pacer/router`

a router for nested controller objects. supports parameters and rest paths. doesn't know anything about HTTP

## example

```javascript
const router = require('@pacer/router')

const route = router({
	nested: {
		path (...args) { return `nested path ${args.join(' ')}` },
		':parameters' (parameters) { return `` }
	},

	'something/with/slashes' () { return 'slashes' },

	'named/:parameters': {
		work: {
			':together/with/other/features' (parameters, ...rest) {
				return { parameters, rest }
			}
		}
	}
})

route('/nested/path') // ⇒ 'nested path '
route('/nested/path/with/extra/bits') // ⇒ 'nested path with extra bits'
route('/nested/parameter') // ⇒ { parameters: 'parameter' }
route('/something/with/slashes') // ⇒ 'slashes'
route('/named/things/work/along/with/other/features/and/stuff') /* ⇒ {
	parameters: { parameters: 'thing', together: 'along' },
	rest: ['and', 'stuff']
} */
```

if multiple routes match, the one that has the most concrete parts matching (i.e. requires the fewest parameters filling in) will be called.
