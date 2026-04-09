import { Admin } from "../models/index.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({
            where: {
                username: username,
            }
        });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found." });
        }
        const match = await bcrypt.compare(password, admin.password);
        if (!match) return res.status(400).json({ message: "The password is incorrect." });
        const adminId = admin.id;
        const adminUsername = admin.username;
        const accessToken = jwt.sign({ id: adminId, username: adminUsername }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "5m"
        });
        const refreshToken = jwt.sign({ id: adminId, username: adminUsername }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "1h"
        });

        await Admin.update({ refresh_token: refreshToken }, {
            where: {
                id: adminId
            }
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
        });
        res.json({ accessToken });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(204).json({ message: "No refresh token found." });
        const admin = await Admin.findAll({
            where: {
                refresh_token: refreshToken,
            },
        });
        if (!admin[0]) return res.sendStatus(204);
        const adminId = admin[0].id;
        await Admin.update({ refresh_token: null }, {
            where: {
                id: adminId
            }
        });

        res.clearCookie('refreshToken');
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "Access Denied: Please login." });

    const userToken = await Admin.findOne({
        where: {
            refresh_token: refreshToken,
        }
    });

    if (!userToken) return res.status(403).json({ message: "Access Denied: Please login." });

    try {
        const admin = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const adminId = admin.id;
        const adminUsername = admin.username;

        const accessToken = jwt.sign({ id: adminId, username: adminUsername }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "5m"
        });

        const newRefreshToken = jwt.sign({ id: adminId, username: adminUsername }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "1h"
        });

        await Admin.update({ refresh_token: newRefreshToken }, {
            where: {
                id: adminId
            }
        });
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
        });

        res.json({ accessToken });

    } catch (error) {
        return res.status(403).json({ message: "Access Denied: Please login." });
    }
}

export const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.findAll({
            attributes: ["id", "username"],
        });
        res.json(admins)
    } catch (error) {
        res.json({ message: "Error retrieving admins" })
    }
}