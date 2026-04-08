import { Sequelize } from "sequelize";
import db from "../configs/database.js"

const { DataTypes } = Sequelize;

const CTFEvent = db.define('ctf_events', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
}, {
    freezeTableName: true,
    createdAt: true,
    updatedAt: true,
    underscored: true
});
export default CTFEvent;