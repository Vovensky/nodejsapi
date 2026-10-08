import type { ServerResponse } from 'node:http';

export const sendJson = (res: ServerResponse, statusCode: number, data: unknown): void => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(data));
}