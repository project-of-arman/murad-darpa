
import mysql from 'mysql2/promise';

// Extend the NodeJS global type to include our MySQL pool
declare const global: typeof globalThis & {
  dbPool?: mysql.Pool | null;
};

let pool: mysql.Pool | null;

function getPool(): mysql.Pool | null {
  // If this is a build process, don't attempt to connect to the database.
  if (process.env.IS_BUILD_PROCESS === 'true') {
    console.log("Build process detected. Skipping database connection and using mock data.");
    return null;
  }

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
    return null;
  }

  const newPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000, // 10 seconds
    idleTimeout: 60000, // 60 seconds
    enableKeepAlive: true,
  });
  
  if (process.env.NODE_ENV !== 'production') {
    global.dbPool = newPool;
  }
  
  pool = newPool;

  pool.getConnection().then(conn => {
    console.log("Successfully connected to the database.");
    conn.release();
  }).catch(err => {
    console.error("Failed to establish initial database connection:", err);
  });

  return pool;
}

// Export the initialized pool.
const db = getPool();
export default db;

// Function to retry a query on connection errors
export async function queryWithRetry<T>(query: string, params: any[] = [], retries = 3, delay = 100): Promise<T> {
  if (!db) {
    throw new Error("Database not connected. Mock data should be used.");
  }
  
  for (let i = 0; i < retries; i++) {
    try {
      const [rows] = await db.query(query, params);
      return rows as T;
    } catch (error: any) {
      if ((error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') && i < retries - 1) {
        console.warn(`Query failed with ${error.code} on attempt ${i + 1}. Retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Database query failed after multiple retries.");
}
