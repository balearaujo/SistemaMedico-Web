import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/sequelize.connection.ts";

const sequelize = sequelizeConnection.getSequelize();

export interface ITitles extends Model {
    id_tittle: number;
    id_doctor: number;
    tittle: string;
    university: string;
    proffesional_license: string;
}

const professional_title = sequelize.define<ITitles>(
    "professional_titles",
        {
        id_title: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        },
        id_doctor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        },
        title: {
        type: DataTypes.STRING(150),
        allowNull: false,
        },
        university: {
        type: DataTypes.STRING(150),
        allowNull: false,
        },
        professional_license: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        },
        },
    { 
    tableName: "professional_titles",
    timestamps: false },
);

export default professional_title;