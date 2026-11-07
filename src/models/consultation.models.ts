import {DataTypes, Model} from "sequelize";
import SequelizeConnection from "../conf/sequelize.connection.ts";
import sequelizeConnection from "../conf/sequelize.connection.ts";
import { allowedNodeEnvironmentFlags } from "node:process";

const sequelize = sequelizeConnection.getSequelize();

export interface ConsultationIstance extends Model {
    id_consultation: number;
    id_patient: number;
    id_med_app: number | null;
    consultation_date?: Date;
    diagnosis: string;
    blood_pressure?: string | null;
    pulse?: number | null;
    body_temperature?: number | null;
    body_weight?: number | null;
    body_height?: number | null;
}

const Consultation = sequelize.define<ConsultationIstance>(
    "Consultation",
    {
        id_consultation:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_patient:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_doctor:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_med_app:{
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true,
        },
        consultation_date:{
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        diagnosis:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
        blood_pressure:{
            type:DataTypes.STRING(20),
            allowNull: true,
        },
        pulse:{
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: true,
        },
        body_temperature:{
            type: DataTypes.DECIMAL(4,1),
            allowNull: true,
        },
        body_weight:{
            type: DataTypes.DECIMAL(5,2),
            allowNull: true,
        },
        body_height:{
            type: DataTypes.DECIMAL(4,2),
            allowNull: true,
        },
    },
    {
        tableName: "consultations",
        timestamps: false,
    }
);

export default Consultation;