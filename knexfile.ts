import { config } from './src/config'

module.exports = {
  client: 'pg',
  connection: {
    connectionString: config.database.url,
  },
  pool: {
    min: 1,
    max: 2,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: 'migrations',
  },
  timezone: 'UTC',
}
