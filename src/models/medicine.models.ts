import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/sequelize.connection.ts";

const sequelize = sequelizeConnection.getSequelize();

interface Medicine extends Model {
  id_medication: number;
  brandName: string;
  genericName: string;
  presentation: string;
  is_Controlled: boolean;
}

const Medicine = sequelize.define<Medicine>(
  "Medicine",
  {
    id_medication: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    brand_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    generic_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    presentation: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    is_controlled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { 
    tableName: "medications",
    timestamps: false },
);

export default Medicine;