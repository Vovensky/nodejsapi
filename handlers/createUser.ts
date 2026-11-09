import type { IncomingMessage, ServerResponse } from 'http';
import { randomUUID } from 'crypto';
import { sendJson } from '../helpers/sendJson';
import { readBody } from '../helpers/readBody';
import { isUser } from '../guards/isUser';
import type { IUsers } from '../store/Users';

export const createUser = async (users: IUsers[], req: IncomingMessage, res: ServerResponse): Promise<void> => {
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
}
