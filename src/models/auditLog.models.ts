import { DataTypes, Model, STRING } from "sequelize";
import sequelizeConnection from "../conf/sequelize.connection.ts";

const sequelize = sequelizeConnection.getSequelize();

export type MedAction =
    | "CONSULTA_EXPEDIENTE"
    | "EMISION_RECETA"
    | "REIMPRESION_RECETA"
    | "EXPORTACION_DATOS";

export interface AuditLogInstance extends Model{
    id_event: number;
    id_user: number;
    med_action: MedAction;
    affected_registry: number;
    id_affected_registry: number;
    details?: string | null;
    created_at?: Date;
}

const AuditLog = sequelize.define<AuditLogInstance>(
    "AuditLog",
    {
        id_event:{
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        id_user:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        med_action:{
            type: DataTypes.ENUM(
                "CONSULTA_EXPEDIENTE",
                "EMISION_RECETA",
                "REIMPRESION_RECETA",
                "EXPORTACION_DATOS"
            ),
            allowNull: false,
        },
        affected_entity:{
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        id_affected_registry:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        details:{
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        created_at:{
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "clinical_audit_logs",
        timestamps: false,
    }
);

export default AuditLog;