const { Pool } = require('pg');

const pool = new Pool({
  user: 'youruser',
  host: 'db',
  database: 'MeuNovoApp',
  password: 'yourpassword',
  port: 5432,
});

module.exports = pool;
