import mysql from 'mysql2/promise';

// Extend the NodeJS global type to include our MySQL pool
declare const global: typeof globalThis & {
  dbPool?: mysql.Pool;
};

let pool: mysql.Pool;

function getPool() {
  // If the pool is already cached on the global object (in a dev environment), use it.
  if (process.env.NODE_ENV !== 'production' && global.dbPool) {
    return global.dbPool;
  }

  // If the pool is already initialized in the current module scope, use it.
  if (pool) {
    return pool;
  }

  // If there are no credentials, return null. This supports DB-less development.
  if (
    !process.env.DB_HOST ||
    !process.env.DB_USER ||
    !process.env.DB_PASSWORD ||
    !process.env.DB_NAME
  ) {
    console.warn("Database credentials are not set in .env. Running without a database connection.");
    // We return a null object that looks like a pool but will throw errors if used.
    // This makes it clear in the code that the DB is not available.
    return null as any as mysql.Pool;
  }

  const newPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Add a timeout to automatically close idle connections,
    // which helps prevent them from becoming stale.
    idleTimeout: 60000, // 60 seconds
    enableKeepAlive: true,
  });
  
  // In development, cache the pool on the global object.
  // This prevents new pools from being created on every hot reload.
  if (process.env.NODE_ENV !== 'production') {
    global.dbPool = newPool;
  }
  
  pool = newPool;

  return pool;
}

// Export the initialized pool.
const db = getPool();
export default db;
