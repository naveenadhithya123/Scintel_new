import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ScintelGlory = sequelize.define("ScintelGlory", {

  glorie_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  image_url: {
    type: DataTypes.STRING
  }

}, {
  tableName: "scintel_glories",
  timestamps: false
});

export default ScintelGlory;