import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UpcomingEvent = sequelize.define("UpcomingEvent", {

  event_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },

  event_title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  event_short_description: {
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
  },

  event_type: {
    type: DataTypes.STRING,
    allowNull: false
  },

  event_link: {
    type: DataTypes.STRING,
    allowNull: false
  }

}, {
  tableName: "upcoming_events",
  timestamps: false
});

export default UpcomingEvent;