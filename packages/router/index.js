const deepSet = require('dset')

const hole = Symbol('hole')

const pathToComponents = (path) => path.split('/').filter(Boolean)

function* lookup(tree, path, values = {}) {
	if (typeof tree === 'object') {
		const [component, ...rest] = path

		if (Object.prototype.hasOwnProperty.call(tree, component)) {
			yield* lookup(tree[component], rest)
		}
	}

	if (typeof tree === 'function') {
		yield { result: tree, values, remaining: path }
	}
}

function buildRouteTree(routes, path = [], tree = {}) {
	for (const [key, subtree] of Object.entries(routes)) {
		const newPath = [...path, ...pathToComponents(key)]

		if (typeof subtree === 'object') {
			buildRouteTree(subtree, newPath, tree)
		} else {
			deepSet(tree, newPath, subtree)
		}
	}

	return tree
}

module.exports = (routes) => {
	const tree = buildRouteTree(routes)
	return (path) => {
		const candidates = Array.from(lookup(tree, pathToComponents(path)))

		if (candidates.length > 0) {
			const { result, values, remaining } = candidates[0]
			return Object.keys(values).length > 0
				? result(values, ...remaining)
				: result(...remaining)
		}
	}
}
