import { Database } from "./database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [

    {
        method: "GET",
        path: buildRoutePath("/users"),
        handler: (req, res) => {
            const { search } = req.query
            const data = database.select('users', search ? { name: search, email: search } : null)

            return res.end(JSON.stringify(data))
        }
    },

    {
        method: "POST",
        path: buildRoutePath("/users"),
        handler: (req, res) => {
            const { email, name } = req.body
            const user = {
                id: randomUUID(),
                name,
                email
            }
            database.insert('users', user)


            return res.writeHead(201).end()
        }
    },
    {
        method: "DELETE",
        path: buildRoutePath("/users/:id"),
        handler: (req, res) => {
            const { id } = req.params
            database.delete(id, 'users')
            return res.writeHead(204).end()
        }
    },
    {
        method: "PUT",
        path: buildRoutePath("/users/:id"),
        handler: (req, res) => {
            const { id } = req.params
            const { email, name } = req.body

            database.update(id, 'users', {
                name,
                email,
            })
            return res.writeHead(204).end()
        }
    }

]