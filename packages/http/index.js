const createEffect = require('@pacer/effect')
const { send, status } = require('./effects')

function defaultHandleError(error) {
	return (request, response) => {
		status(500)(request, response)
		send(error.stack)(request, response)
		console.error(error.stack)
	}
}

module.exports = function createHandler(
	effectful,
	{ handleBody = send, handleError = defaultHandleError } = {},
) {
	const runEffect = createEffect(effectful)
	return async function handler(request, response) {
		try {
			const body = await runEffect(request, response)

			if (!response.writableEnded && !response.finished) {
				handleBody(body)(request, response)
			}
		} catch (error) {
			handleError(error)(request, response)
		}
	}
}
