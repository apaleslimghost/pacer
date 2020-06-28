const http = require('http')
const createHandler = require('./packages/http')
const {status} = require('./packages/http/effects')
const router = require('./packages/router')

const todos = [
	{done: false, title: 'test'}
]

function renderTodo(todo) {
	return `<label><input type=checkbox ${todo.done ? 'checked' : ''}>${todo.title}</label>`
}

const route = router({
	index() {
		return 'is this thing on'
	},

	todo: {
		*':id'({id}) {
			const todo = todos[id]
			if (!todo) {
				yield status(404)
				return `todo ${id} not found`
			}

			return renderTodo(todo)
		},
	}
})

const getPath = (request) => request.url

http.createServer(
	createHandler(function* effectful() {
		const path = yield getPath
		const result = route(path)
		if (result.next) {
			return yield* result
		}

		return result
	})
).listen(3000)
