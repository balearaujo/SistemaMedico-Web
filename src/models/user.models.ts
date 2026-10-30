import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/sequelize.connection";

const sequelize = sequelizeConnection.getSequelize();

export interface UserInstance extends Model {
    id_user: number;
    username: string;
    password_hash: string;
    role: string;
    failed_attempts: number;
    locked_until: Date | null;
}

export const User = sequelize.define<UserInstance>(
    "User",
    {
        id_user: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        failed_attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        locked_until: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    },
    {
        tableName: 'users',
        timestamps: false,
    }
);