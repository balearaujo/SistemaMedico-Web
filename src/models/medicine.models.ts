import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/sequelize.connection.ts";

const sequelize = sequelizeConnection.getSequelize();

export interface MedicineInstance extends Model {
  id_medication: number;
  brand_name: string;
  generic_name: string;
  presentation: string;
  is_controlled: boolean;
}

const Medicine = sequelize.define<MedicineInstance>(
  "Medicine",
  {
    id_medication: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    brand_name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    generic_name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    presentation: {
      type: DataTypes.STRING(100),
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