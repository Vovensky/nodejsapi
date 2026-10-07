import { createServer } from 'node:http';

const PORT = Number(process.env.PORT) || 3000
const address = process.env.ADDRESS || '127.0.0.1'

console.log(`PORT:`, PORT);
console.log(`PROCESS.ID:`, process.pid);
console.log(`PROCESS.ENV:`,process.env);


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
});


server.listen(PORT, address, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})