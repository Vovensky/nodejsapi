import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'
import { sendJson } from './helpers/sendJson'
import { readBody } from './helpers/readBody'
import { isUser } from './guards/isUser'
import { userRoutePattern } from './model/regExps'

const PORT = Number(process.env.PORT) || 3000
const address = process.env.ADDRESS || '127.0.0.1'

const maxBytes = 12

interface IUsers {
    id: string;
    name: string
};

const users: IUsers[] = [];

const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost')
    if (url.pathname === '/health' && req.method === 'GET') {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        const checkStatus = url.searchParams.get('check')
        if (checkStatus === null) {
            res.end(JSON.stringify({ status: 'ok' }))
            return
        }
        if (checkStatus === '') {
            res.statusCode = 400
            res.end(JSON.stringify({ message: 'check must not be empty' }))
            return
        }
        res.statusCode = 400
        res.end(JSON.stringify({ message: 'Unsupported check' }))
        return
    }

    if (url.pathname === '/echo' && req.method === 'POST') {
        let data: unknown
        let body: string

        if(req.headers['content-type']?.split(';')[0].trim().toLowerCase() !== 'application/json') {
            sendJson(res, 415, { message: 'Invalid ContentType'})
            return;
        }

        try {
            body = await readBody(req, maxBytes)
        } catch (error) {
            if (error instanceof Error && error.message === '413') {
                sendJson(res, 413, { message: 'Payload Too Large' })
                return
            }
            if (!res.destroyed && !res.writableEnded && !res.headersSent) {
                sendJson(res, 500, { message: 'Stream reading error' })
            }
            return
        }

        try {
            data = JSON.parse(body)
        } catch {
            sendJson(res, 400, { message: 'Invalid json' })
            return
        }

        if (!isUser(data)) {
            sendJson(res, 400, { message: 'Invalid user data' })
            return
        }

        sendJson(res, 200, data)
        return
    }

    console.log(url.pathname)

    if(url.pathname === '/users' && req.method === 'POST') {
        let body;
        let data;

        if(req.headers['content-type']?.split(';')[0].trim().toLowerCase() !== 'application/json') {
            sendJson(res, 415, { message: 'Invalid ContentType'})
            return;
        }

        try {
            body = await readBody(req, 256)
        } catch (error) {
            if (error instanceof Error && error.message === '413') {
                sendJson(res, 413, { message: 'Payload Too Large' })
                return
            }
            if (!res.destroyed && !res.writableEnded && !res.headersSent) {
                sendJson(res, 500, { message: 'Stream reading error' })
            }
            return
        }

        try {
            data = JSON.parse(body)
        } catch {
            sendJson(res, 400, { message: 'Invalid json'});
            return;
        }

        if(!isUser(data)) {
            sendJson(res, 400, { message: 'Invalid user data' })
            return
        }
        const user = { id: randomUUID(), name: data.name}
        users.push(user);
        sendJson(res, 200, { message: 'User successfully created', user})
        return;
    }

    if(url.pathname === '/users' && req.method === 'GET') {
        sendJson(res, 200, { users })
        return;
    }

    const id = url.pathname.match(userRoutePattern)?.[1];
    if(id && req.method ==='GET') {
        const user = users.find(user => user.id === id)
        if(user) {
            sendJson(res, 200, { user });
            return;
        }
        sendJson(res, 404, { message: `User with id: ${id} is not found`});
        return;
    }

    res.writeHead(404, {
        'Content-Type': 'text/plain; charset=utf-8',
    })
    res.end('Not Found')
})

server.listen(PORT, address, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
