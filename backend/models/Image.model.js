import { Sequelize } from "sequelize";
import db from "../configs/database.js"

const { DataTypes } = Sequelize;

const Image = db.define('images', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    public_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    r2_key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    alt_text: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    freezeTableName: true,
    createdAt: true,
    updatedAt: true,
    underscored: true
});

export default Image;