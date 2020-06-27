const createEffect = require('./')

describe('@pacer/effect', () => {
	const sink = jest.fn()

	async function* effectful() {
		await Promise.resolve()
		yield sink
		return 'return value'
	}

	const runEffect = createEffect(effectful)

	test('returns the return value of the effectful function', async () => {
		expect(await runEffect()).toBe('return value')
	})

	test('calls the effects with the arguments from the original call', async () => {
		await runEffect({ context: ['argument'] })
		expect(sink).toBeCalledWith('argument')
	})
})
