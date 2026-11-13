import { sendJson } from '../helpers/sendJson'
import { users } from '../store/Users'
import type { IncomingMessage, ServerResponse } from 'http'

export const deleteUser = async (
    res: ServerResponse,
    id: string
): Promise<void> => {
    if(users.find((user) => user.id === id)) {
        const index = users.findIndex((user) => user.id === id)
        users.splice(index, 1)
        sendJson(res, 204)
    } else {
        sendJson(res, 404, { message: `User not found`})
    }
}
