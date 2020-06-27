module.exports = function runEffect(effectful) {
	return async function effect({ context = [], args = [] } = {}) {
		const effects = effectful(...args)
		let done, value

		while ((({ done, value } = await effects.next()), !done)) {
			value(...context)
		}

		return value
	}
}
