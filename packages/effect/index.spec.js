const createEffect = require('./')

describe('@pacer/effect', () => {
	test('returns the return value of the effectful function', async () => {
		// eslint-disable-next-line require-yield
		function* effectful() {
			return 'return value'
		}

		const runEffect = createEffect(effectful)
		expect(await runEffect()).toBe('return value')
	})

	test('calls the effects with the arguments from the original call', async () => {
		const sink = jest.fn()
		function* effectful() {
			yield sink
		}

		const runEffect = createEffect(effectful)
		await runEffect('argument')
		expect(sink).toBeCalledWith('argument')
	})

	test('returns the effect return value from yield', async () => {
		const sink = () => 'return value'

		function* effectful() {
			return yield sink
		}

		const runEffect = createEffect(effectful)
		expect(await runEffect()).toBe('return value')
	})
})
