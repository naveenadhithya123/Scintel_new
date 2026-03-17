import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AssociationMember = sequelize.define("AssociationMember", {

  register_number: {
    type: DataTypes.STRING,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  batch_year: {
    type: DataTypes.STRING,
    allowNull: false
  },

  role: {
    type: DataTypes.STRING,
    allowNull: false
  }

}, {
  tableName: "association_members",
  timestamps: false
});

export default AssociationMember;