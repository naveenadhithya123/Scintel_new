import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Activity = sequelize.define(
  "Activity",
  {
    activity_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },

    batch: {
      type: DataTypes.STRING,
      allowNull: false
    },

    brochure_url: {
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

    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },

    end_date: {
      type: DataTypes.DATE
    },

    participants: {
      type: DataTypes.STRING,
      allowNull: false
    },

    resource_person_image_url: {
      type: DataTypes.STRING
    },

    resource_person_name: {
      type: DataTypes.STRING
    },

    resource_person_description: {
      type: DataTypes.TEXT
    },

    event_image_url: {
      type: DataTypes.STRING,
      allowNull: false
    },

    winner_image: {
      type: DataTypes.STRING
    },

    winner_name: {
      type: DataTypes.STRING
    },

    winner_description: {
      type: DataTypes.TEXT
    },

    testimonials_name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    testimonials_class: {
      type: DataTypes.STRING,
      allowNull: false
    },

    testimonials_feedback: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    tableName: "activities",
    timestamps: false
  }
);

export default Activity;