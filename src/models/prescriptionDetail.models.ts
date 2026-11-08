import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/sequelize.connection.ts";

const sequelize = sequelizeConnection.getSequelize();

export type RouteAdministration = 
    | "Oral"
    | "Intramuscular"
    | "Intravenosa"
    | "Tópica"
    | "Sublingual"
    | "Oftálmica"
    | "Nasal"
    | "Rectal"
    | "Inhalatoria";

export interface PrescriptionDetailInstance extends Model{
    id_detail: number;
    id_prescription: number;
    id_medication: number;
    dose: string;
    route_administration: RouteAdministration;
    dosing_frequency: string;
    duration: string;
}

const PrescriptionDetail = sequelize.define<PrescriptionDetailInstance>(
    "PrescriptionDetail",
    {
        id_detail:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_prescription:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_medication:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        dose:{
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        route_administration:{
            type: DataTypes.ENUM(
                "Oral",
                "Intramuscular",
                "Intravenosa",
                "Tópica",
                "Sublingual",
                "Oftálmica",
                "Nasal",
                "Rectal",
                "Inhalatoria"
            ),
            allowNull: false,
        },
        dosing_frequency:{
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        duration:{
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },
    {
        tableName: "prescription_details",
        timestamps: false,
    }
);

export default PrescriptionDetail;