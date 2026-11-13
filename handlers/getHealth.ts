import { ServerResponse } from 'http'

export const getHealth = (res: ServerResponse, url: URL): void => {
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
}