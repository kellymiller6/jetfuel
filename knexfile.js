// Update with your config settings.

module.exports = {

  development: {
    client: 'pg', //client property - specify what client (type of db we are using)
    connection: 'postgres://localhost/jetfuel',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
     directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  }
};
