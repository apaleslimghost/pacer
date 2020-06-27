const router = require('./packages/router')
const createEffect = require('./packages/effect')

test('router works with effects', async () => {
	const effect = jest.fn()

	const routes = {
		*path() {
			yield effect
		},
	}

	const route = router(routes)
	const runEffect = createEffect(() => route('/path'))

	await runEffect('argument')
	expect(effect).toBeCalledWith('argument')
})
