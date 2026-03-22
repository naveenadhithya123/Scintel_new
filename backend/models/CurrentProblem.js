import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CurrentProblem = sequelize.define("CurrentProblem", {

  problem_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },

  title: DataTypes.STRING,
  category: DataTypes.STRING,
  short_description: DataTypes.STRING,
  detailed_description: DataTypes.TEXT,

  creator_user_id: DataTypes.INTEGER,
  solver_user_id: DataTypes.INTEGER,

  // ✅ New column added
  mentor: DataTypes.STRING

}, {
  tableName: "current_problems",
  timestamps: false
});

export default CurrentProblem;