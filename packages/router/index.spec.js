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

    test('routes to index without chomping path', () => {
        const handler = jest.fn()
        const route = router({
            path: { index: { to: { handler } } },
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

    test('handles slashes in route keys', () => {
        const handler = jest.fn()
        const route = router({
            'path/to': { handler },
        })

        route('/path/to/handler')

        expect(handler).toBeCalled()
    })

    test('collects variables and provides an object', () => {
        const handler = jest.fn()
        const route = router({
            hello: {
                ':greeting': handler,
            },
        })

        route('/hello/world')

        expect(handler).toBeCalledWith({ greeting: 'world' })
    })

    test('handles param keys at multiple levels', () => {
        const handler = jest.fn()
        const route = router({
            hello: {
                ':greeting': { and: { ':others': handler } },
            },
        })

        route('/hello/world/and/everyone')

        expect(handler).toBeCalledWith({ greeting: 'world', others: 'everyone' })
    })

    test('picks the route that matches requiring the least parameters', () => {
        const handler1 = jest.fn()
        const handler2 = jest.fn()
        const route = router({
            hello: {
                ':greeting': { and: { ':others': handler1 } },
                ':otherGreeting': { and: { everyone: handler2 } },
            },
        })

        route('/hello/world/and/everyone')

        expect(handler1).not.toBeCalled()
        expect(handler2).toBeCalledWith({ otherGreeting: 'world' })
    })

    test('all together now', () => {
        const handler = jest.fn()
        const route = router({
            'hello/:greeting': { index: handler },
        })

        route('/hello/world/and/everyone')

        expect(handler).toBeCalledWith({ greeting: 'world' }, 'and', 'everyone')
    })
})
