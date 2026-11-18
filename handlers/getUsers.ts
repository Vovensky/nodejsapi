import { ServerResponse } from 'node:http';
import { sendJson } from '../helpers/sendJson';
import { getDbUsers } from '../db/usersController';

export const getUsers = async (res: ServerResponse): Promise<void> => {
    let dbUsers;
    try {
        dbUsers = await getDbUsers();
    } catch (error) {
        console.error('Error fetching users from database:', error);
        sendJson(res, 503, { message: 'Error fetching users from database' });
        return;
    }
    
    sendJson(res, 200, { users: dbUsers });
}