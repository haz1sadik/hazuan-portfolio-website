import { Sequelize } from "sequelize";
import db from "../configs/database.js"

const { DataTypes } = Sequelize;

const Admin = db.define('admins', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true,
    createdAt: true,
    updatedAt: true,
    underscored: true
});

export default Admin;