import { pool } from './db';

export const getDbUsers = () => {
    return pool.query('SELECT * FROM users')
        .then((result) => {
            console.log(`results:`, result.rows);
            return result.rows;
        });
};

export const createDbUser = (name: string) => {
    return pool.query('INSERT INTO users (name) VALUES ($1) RETURNING *', [name]).then((result) => {
        console.log(`User created:`, result.rows[0]);
        return result.rows[0];
    })
}