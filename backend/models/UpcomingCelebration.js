import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UpcomingCelebration = sequelize.define("UpcomingCelebration", {

  event_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },

  event_title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  event_description: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  brochure_url: {
    type: DataTypes.STRING
  },

  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },

  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },

  faculty_contact: {
    type: DataTypes.STRING,
    allowNull: false
  },

  student_contact: {
    type: DataTypes.STRING,
    allowNull: false
  }

}, {
  tableName: "upcoming_celebrations",
  timestamps: false
});

export default UpcomingCelebration;