module.exports = function runEffect(effectful) {
	return async function effect(...context) {
		const effects = effectful()
		let done, value, returned

		while ((({ done, value } = await effects.next(returned)), !done)) {
			returned = value(...context)
		}

		return value
	}
}
