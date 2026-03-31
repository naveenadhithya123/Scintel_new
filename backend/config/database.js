import "dotenv/config";
import { Sequelize } from "sequelize";

const databaseUrl = process.env.DATABASE_URL;
const commonOptions = {
  dialect: "postgres",
  dialectOptions: {
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
