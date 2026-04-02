import "dotenv/config";
import { Sequelize } from "sequelize";

const databaseUrl = process.env.DATABASE_URL;
const poolMax = Number.parseInt(process.env.DB_POOL_MAX ?? "10", 10);
const poolMin = Number.parseInt(process.env.DB_POOL_MIN ?? "0", 10);
const poolAcquire = Number.parseInt(process.env.DB_POOL_ACQUIRE_MS ?? "30000", 10);
const poolIdle = Number.parseInt(process.env.DB_POOL_IDLE_MS ?? "10000", 10);

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
