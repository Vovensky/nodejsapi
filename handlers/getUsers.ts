import { ServerResponse } from 'node:http';
import { sendJson } from '../helpers/sendJson';
import { users } from '../store/Users';

export const getUsers = (res: ServerResponse): void => {
    sendJson(res, 200, { users })
}