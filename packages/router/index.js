const deepSet = require('dset')

const hole = Symbol('hole')

const pathToComponents = (path) => path.split('/').filter(Boolean)

function lookup(tree, path) {
	if (typeof tree === 'object') {
		const [component, ...rest] = path

		if (Object.prototype.hasOwnProperty.call(tree, component)) {
			return lookup(tree[component], rest)
		}
	}

	if (typeof tree === 'function') {
		return tree(...path)
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
	return (path) => lookup(tree, pathToComponents(path))
}
