import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UpcomingEvent = sequelize.define("UpcomingEvent", {

  event_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true 
  },

  event_title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  event_short_description: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  event_description: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  brochure_url: {
    type: DataTypes.STRING,
    allowNull: true
  },

  start_date: {
    type: DataTypes.DATEONLY,   // better for DATE
    allowNull: false
  },

  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  faculty_contact: {
    type: DataTypes.STRING,
    allowNull: false
  },

  student_contact: {
    type: DataTypes.STRING,
    allowNull: false
  },

  event_type: {
    type: DataTypes.STRING,
    allowNull: false
  },

  event_link: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // ✅ ADD THESE TWO
  registration_start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },

  registration_end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }

}, {
  tableName: "upcoming_events",
  timestamps: false
});

export default UpcomingEvent;
