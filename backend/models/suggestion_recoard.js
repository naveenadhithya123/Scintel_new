import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const SuggestionRecoard = sequelize.define("SuggestionRecoard", {
  record_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "No Title"
  },
  suggestion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "suggestion_records",
  timestamps: false
});

export default SuggestionRecoard;
