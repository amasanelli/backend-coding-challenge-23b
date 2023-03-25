export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  mysql: {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  jwtSecret: process.env.JWT_SECRET,
  hashRounds: parseInt(process.env.HASH_ROUNDS, 10) || 10,
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  gmail: {
    user: process.env.GMAIL_USER,
    password: process.env.GMAIL_PASSWORD,
  },
});
