import type { ServerResponse } from 'node:http'
import { sendJson } from '../helpers/sendJson'
import { users } from '../store/Users'

interface IGetUserById {
    id: string | undefined;
    res: ServerResponse;
}

export function getUserById({ id, res }: IGetUserById): void {
    const user = users.find((user) => user.id === id)
    if (user) {
        sendJson(res, 200, { user })
        return
    }
    sendJson(res, 404, { message: `User with id: ${id} is not found` })
}
