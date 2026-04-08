import { Sequelize } from "sequelize";
import db from "../configs/database.js"

const { DataTypes } = Sequelize;

const Blog = db.define('blogs', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    freezeTableName: true,
    createdAt: true,
    updatedAt: true,
    underscored: true
});

export default Blog;