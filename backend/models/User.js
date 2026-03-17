import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false
    },

    phone_number: {
      type: DataTypes.STRING,
      allowNull: false
    },

    year: {
      type: DataTypes.STRING,
      allowNull: false
    },

    section: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "users",
    timestamps: false
  }
);

export default User;