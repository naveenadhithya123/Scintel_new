import "dotenv/config";
import { Sequelize } from "sequelize";

const databaseUrl = process.env.DATABASE_URL;
const poolMax = Number.parseInt(process.env.DB_POOL_MAX ?? "10", 10);
const poolMin = Number.parseInt(process.env.DB_POOL_MIN ?? "0", 10);
const poolAcquire = Number.parseInt(process.env.DB_POOL_ACQUIRE_MS ?? "60000", 10);
const poolIdle = Number.parseInt(process.env.DB_POOL_IDLE_MS ?? "10000", 10);
const dbRetryCount = Number.parseInt(process.env.DB_RETRY_COUNT ?? "2", 10);
const dbRetryDelay = Number.parseInt(process.env.DB_RETRY_DELAY_MS ?? "1500", 10);

const commonOptions = {
  dialect: "postgres",
  logging: false,
  pool: {
    max: Number.isNaN(poolMax) ? 10 : poolMax,
    min: Number.isNaN(poolMin) ? 0 : poolMin,
    acquire: Number.isNaN(poolAcquire) ? 30000 : poolAcquire,
    idle: Number.isNaN(poolIdle) ? 10000 : poolIdle
  },
  dialectOptions: {
    keepAlive: true,
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
};

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, commonOptions)
  : new Sequelize("postgres", "postgres.zxwbhlrhwachhowwdokm", "7Mar@Kathir", {
      ...commonOptions,
      host: "aws-1-ap-south-1.pooler.supabase.com",
      port: 6543
    });

export default sequelize;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const isTransientConnectionError = (error) => {
  const message = `${error?.name ?? ""} ${error?.message ?? ""}`.toLowerCase();

  return [
    "sequelizeconnectionacquiretimeouterror",
    "connectionacquiretimeouterror",
    "timeout",
    "connection terminated unexpectedly",
    "could not connect",
    "econnreset",
    "econnrefused",
    "enotfound",
    "etimedout",
    "the database system is starting up"
  ].some((needle) => message.includes(needle));
};

export const withDbRetry = async (operation, options = {}) => {
  const {
    retries = Number.isNaN(dbRetryCount) ? 2 : dbRetryCount,
    delayMs = Number.isNaN(dbRetryDelay) ? 1500 : dbRetryDelay,
    label = "database operation"
  } = options;

  let attempt = 0;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      const shouldRetry = attempt < retries && isTransientConnectionError(error);

      if (!shouldRetry) {
        throw error;
      }

      attempt += 1;
      console.warn(
        `${label} failed with a transient database error. Retrying ${attempt}/${retries}...`,
        error.message
      );
      await sleep(delayMs);
    }
  }
};
