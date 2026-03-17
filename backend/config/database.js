import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "postgresql://postgres.zxwbhlrhwachhowwdokm:7Mar@Kathir@aws-1-ap-south-1.pooler.supabase.com:6543/postgres",
  {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

export default sequelize;