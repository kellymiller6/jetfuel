module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/jetfuel',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
     directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'pg',
    connection: 'postgres://localhost/jetfuel',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/jetfuel_test',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/test'
    },
    useNullAsDefault: true
  }
};
