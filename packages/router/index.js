const deepSet = require('dset')

const hole = Symbol('hole')

const pathToComponents = (path) => path.split('/').filter(Boolean)

function lookup(tree, [component, ...rest]) {
	if (typeof tree === 'function') {
		return tree(component, ...rest)
	}

	return lookup(tree[component], rest)
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
