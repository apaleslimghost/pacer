const holes = Symbol('holes')

const pathToComponents = (path) => path.split('/').filter(Boolean)

function* lookup(tree, path, values = {}) {
	if (typeof tree === 'object') {
		const [component, ...rest] = path

		if (Object.prototype.hasOwnProperty.call(tree, component)) {
			yield* lookup(tree[component], rest, values)
		}

		if (tree[holes]) {
			for (const hole of tree[holes]) {
				yield* lookup(hole.subtree, rest, { ...values, [hole.name]: component })
			}
		}
	}

	if (typeof tree === 'function') {
		yield { result: tree, values, remaining: path }
	}
}

function updateTree(obj, [key, ...rest], value) {
	if (key.startsWith(':')) {
		if (!obj[holes]) {
			obj[holes] = []
		}

		const hole = { name: key.slice(1) }
		obj[holes].push(hole)
		updateTree(hole, ['subtree', ...rest], value)
	} else if (rest.length === 0) {
		obj[key] = value
	} else {
		if (!obj[key]) {
			obj[key] = {}
		}

		updateTree(obj[key], rest, value)
	}
}

function buildRouteTree(routes, path = [], tree = {}) {
	for (const [key, subtree] of Object.entries(routes)) {
		const newPath = [...path, ...pathToComponents(key)]

		if (typeof subtree === 'object') {
			buildRouteTree(subtree, newPath, tree)
		} else {
			updateTree(tree, newPath, subtree)
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
