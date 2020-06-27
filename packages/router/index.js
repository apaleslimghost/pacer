function route(controller, [component, ...rest]) {
	if (typeof controller === 'function') {
		return controller(component, ...rest)
	}

	return route(controller[component], rest)
}

module.exports = (controller) => (path) =>
	route(controller, path.split('/').filter(Boolean))
