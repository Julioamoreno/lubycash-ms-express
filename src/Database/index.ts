import connection from './knexfile';

import knex from 'knex';
const database = knex(connection.development)

export default database;