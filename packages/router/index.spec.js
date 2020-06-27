const router = require('./')

describe('@pacer/router', () => {
	test('calls a nested function by path', () => {
		const handler = jest.fn()
		const route = router({
			path: { to: { handler } },
		})

		route('/path/to/handler')

		expect(handler).toBeCalled()
	})

	test('calls function with leftover path components', () => {
		const handler = jest.fn()
		const route = router({
			path: { to: { handler } },
		})

		route('/path/to/handler/with/extra/stuff')

		expect(handler).toBeCalledWith('with', 'extra', 'stuff')
	})
})
