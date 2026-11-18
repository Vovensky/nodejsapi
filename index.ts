import { createServer } from 'node:http';
import { userRoutePattern } from './model/regExps';
import { getUserById } from './handlers/getUserById';
import { createUser } from './handlers/createUser';
import { getUsers } from './handlers/getUsers';
import { getHealth } from './handlers/getHealth';
import { checkEcho } from './handlers/checkEcho';
import { deleteUser } from './handlers/deleteUser';
import { checkDatabase } from './db/db';

const PORT = Number(process.env.PORT) || 3000
const address = process.env.ADDRESS || '127.0.0.1'

const maxBytes = 128;

const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost')
    if (url.pathname === '/health' && req.method === 'GET') {
        getHealth(res, url);
        return
    }

    if (url.pathname === '/echo' && req.method === 'POST') {
        await checkEcho(res, req, maxBytes);
        return
    }

    if(url.pathname === '/users' && req.method === 'POST') {
        await createUser(req, res);
        return;
    }

    if(url.pathname === '/users' && req.method === 'GET') {
        await getUsers(res);
        return;
    }

    const id = url.pathname.match(userRoutePattern)?.[1];
    if(id && req.method === 'GET') {
        getUserById({ id, res });
        return;
    }

    if(req.method === 'DELETE' && id) {
        await deleteUser(res, id);
        return;
    }

    res.end('Not Found')
})

async function startServer() {
    await checkDatabase();

    server.listen(PORT, address, async () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
}

startServer().catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
})
