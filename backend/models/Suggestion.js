import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Suggestion = sequelize.define("Suggestion", {

  suggestion_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },

  type: {
    type: DataTypes.STRING,
    allowNull: false
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  category: {
    type: DataTypes.STRING,
    allowNull: false
  },

  proof_url: {
    type: DataTypes.STRING,
    allowNull: true   // ✅ changed
  },

  priority: {
    type: DataTypes.STRING,
    allowNull: false
  },

  date: {
    type: DataTypes.DATE,
    allowNull: false
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }

}, {
  tableName: "suggestions",
  timestamps: false
});

export default Suggestion;