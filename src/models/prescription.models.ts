import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/sequelize.connection";

const sequelize = sequelizeConnection.getSequelize();

export interface PrescriptionInstance extends Model{
    id_prescription: number;
    id_consultation: number;
    id_origin_prescription: number | null;
    issue_date: Date;
    is_controlled: boolean;
    medical_snapshot: object;
}

const Prescription = sequelize.define<PrescriptionInstance>(
    "Prescription",
    {
        id_prescription: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_consultation: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_origin_prescription: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        issue_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes. NOW,
        },
        is_controlled:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        medical_snapshot: {
            type: DataTypes.JSON,
            allowNull: false,
        },
    },
    {
        tableName: "prescriptions",
        timestamps: false,
    }
);

export default Prescription;