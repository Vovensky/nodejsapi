import { createServer } from 'node:http';
import { isUser } from './guards/isUser';
import { sendJson } from './helpers/sendJson';

const PORT = Number(process.env.PORT) || 3000
const address = process.env.ADDRESS || '127.0.0.1'

const server = createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    if(url.pathname === '/health' && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        const checkStatus = url.searchParams.get('check');
        if(checkStatus === null) {
            res.end(JSON.stringify({ status: 'ok' }));
            return;
        } 
        if(checkStatus === '') {
            res.statusCode = 400;
            res.end(JSON.stringify({ message: 'check must not be empty' }));
            return;
        }
            res.statusCode = 400;
            res.end(JSON.stringify({ message: 'Unsupported check' }));
            return
    }

    if(url.pathname === '/echo' && req.method === 'POST') {
        const buffer: Buffer[] = [];

        req.on('data', (chunk) => {
            buffer.push(chunk);
        })

        req.on('end', () => {
            const body = Buffer.concat(buffer).toString('utf8');
            let data: { name: string } | unknown = {};

            try {
                data = JSON.parse(body);
            } catch (error) {
                sendJson(res, 400, { message: 'Invalid user data' });
                return;
            }

            if(!isUser(data)) {
                sendJson(res, 400, { message: 'Invalid user data' });
                return;
            }

            sendJson(res, 200, data);

        })

        return;
    }

    res.writeHead(404, {
        'Content-Type': 'text/plain; charset=utf-8',
    });
    res.end('Not Found');
});


server.listen(PORT, address, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})