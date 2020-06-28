const deepSet = require('dset')

const hole = Symbol('hole')

const pathToComponents = (path) => path.split('/').filter(Boolean)

function lookup(tree, [component, ...rest]) {
	if (typeof tree === 'function') {
		return tree(component, ...rest)
	}

	return lookup(tree[component], rest)
}

function buildRouteTree(routes) {
	const tree = {}

	function traverseRoutes(routes, path = []) {
		for (const [key, subtree] of Object.entries(routes)) {
			const newPath = [...path, ...pathToComponents(key)]

			if (typeof subtree === 'object') {
				traverseRoutes(subtree, newPath)
			} else {
				deepSet(tree, newPath, subtree)
			}
		}
	}

	traverseRoutes(routes)
	return tree
}

module.exports = (routes) => {
	const tree = buildRouteTree(routes)
	return (path) => lookup(tree, pathToComponents(path))
}
