import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/sequelize.connection.ts";

const sequelize = sequelizeConnection.getSequelize();

export interface IDoctor extends Model {
  id_doctor: number;
  id_user: number;
  full_name: string;
  address: string;
  office: string;
  office_phone: string;
  whatsapp: string;
  email: string;
}

const Doctor = sequelize.define<IDoctor>(
    "Medicine",
    {
        id_doctor: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        },
        id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        },
        full_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        },
        address: {
        type: DataTypes.STRING(255),
        allowNull: false,
        },
        office: {
        type: DataTypes.STRING(100),
        allowNull: false,
        },
        office_phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        },
        whatsapp: {
        type: DataTypes.STRING(20),
        allowNull: false,
        },
        email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        },
    },
    { 
    tableName: "doctors",
    timestamps: false },
);

export default Doctor;