import type { IncomingMessage, ServerResponse } from 'node:http'
import type { IUsers } from '../store/Users'
import { sendJson } from '../helpers/sendJson'

interface IGetUserById {
    id: string | undefined;
    users: IUsers[];
    res: ServerResponse;
}

export function getUserById({ id, users, res }: IGetUserById): void {
    const user = users.find((user) => user.id === id)
    if (user) {
        sendJson(res, 200, { user })
        return
    }
    sendJson(res, 404, { message: `User with id: ${id} is not found` })
}
