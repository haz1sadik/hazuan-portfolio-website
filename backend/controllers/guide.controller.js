import e from "express";
import { Guide, Admin } from "../models/index.model.js"

export const getGuides = async (req, res) => {
    try {
        const guides = await Guide.findAll();
        res.json(guides);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving guides" });
    }
}

export const getGuideById = async (req, res) => {
    try {
        const { id } = req.params;
        const guide = await Guide.findByPk(id, {
            attributes: { exclude: ['adminId'] },
            include: [{ model: Admin, attributes: ['name'] }], 
        });
        if (!guide) {
            return res.status(404).json({ message: "Guide not found." });
        }
        res.json(guide);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving guide" });
    }
}

export const createGuide = async (req, res) => {
    try {
        const { title, content, category, difficulty } = req.body;
        const { id } = req.user;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required." });
        }
        if (!['Beginner', 'Intermediate', 'Advanced'].includes(difficulty)) {
            return res.status(400).json({ message: "Please provide a valid difficulty level." });
        }

        let baseSlug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        let slug = baseSlug;
        let counter = 1;
        while (await Guide.findOne({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const newGuide = await Guide.create({ title, content, slug, adminId: id, category, difficulty });

        res.status(201).json(newGuide);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating guide" });
    }
}

export const updateGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category, difficulty } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required." });
        }
        if (!['Beginner', 'Intermediate', 'Advanced'].includes(difficulty)) {
            return res.status(400).json({ message: "Please provide a valid difficulty level." });
        }

        const guide = await Guide.findByPk(id);
        if (!guide) {
            return res.status(404).json({ message: "Guide not found." });
        }
        if (guide.adminId !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this guide." });
        }
        
        await guide.update({ title, content, category, difficulty });
        res.json(guide);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating guide" });
    }
}

export const deleteGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const guide = await Guide.findByPk(id);
        if (!guide) {
            return res.status(404).json({ message: "Guide not found." });
        }
        if (guide.adminId !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this guide." });
        }
        await guide.destroy();
        res.json({ message: "Guide deleted successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting guide" });
    }
}