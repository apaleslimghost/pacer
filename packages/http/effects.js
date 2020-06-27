function composeEffects(...effects) {
	return (...context) => {
		effects.forEach((effect) => effect(...context))
	}
}

exports.header = (key, value) => (request, response) => {
	if (typeof value === 'undefined') {
		return request.getHeader(key)
	}

	response.setHeader(key, value)
}

exports.status = (status) => (request, response) => {
	response.statusCode = status
}

exports.redirect = (location, status = 302) =>
	composeEffects(exports.header('location', location), exports.status(status))

exports.send = (body) => (request, response) => {
	if (typeof body === 'string') {
		response.end(body)
	} else {
		exports.header('content-type', 'application/json')
		response.end(JSON.stringify(body))
	}
}
