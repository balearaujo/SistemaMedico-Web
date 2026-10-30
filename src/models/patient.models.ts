import {DataTypes, Model} from "sequelize";
import sequelizeConnection from "../conf/sequelize.connection.ts";

const sequelize = sequelizeConnection.getSequelize();

export interface PatientInstance extends Model{
    id_patient: number;
    full_name: string;
    birthdate: Date;
    contact: string;
    opening_date?: Date;
}

const Patient = sequelize.define<PatientInstance>(
    "Patient",
    {
        id_patient:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        full_name:{
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        birthdate:{
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        contact:{
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        opening_date:{
            type:DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        tableName: "patients",
        timestamps: false,
    }
);

export default Patient;