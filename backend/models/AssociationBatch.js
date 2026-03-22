  import { DataTypes } from "sequelize";
  import sequelize from "../config/database.js";

  const AssociationBatch = sequelize.define("AssociationBatch", {

    batch_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },

    batch_year: {
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

    image_url: {
      type: DataTypes.STRING
    }

  }, {
    tableName: "association_batch",
    timestamps: false
  });

  export default AssociationBatch;