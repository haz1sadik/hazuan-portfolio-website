import { CTFWriteup, Admin, CTFEvent } from "../models/index.model.js"

export const getCTFWriteups = async (req, res) => {
    try {
        const writeups = await CTFWriteup.findAll();
        res.json(writeups);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving CTF writeups" });
    }
}

export const getCTFWriteupById = async (req, res) => {
    try {
        const { id } = req.params;
        const writeup = await CTFWriteup.findByPk(id, {
            attributes: { exclude: ['adminId'] },
            include: [{ model: Admin, attributes: ['name'] }, { model: CTFEvent, attributes: ['name'] }], 
        });
        if (!writeup) {
            return res.status(404).json({ message: "CTF writeup not found." });
        }
        res.json(writeup);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving CTF writeup" });
    }
}

export const createCTFWriteup = async (req, res) => {
    try {
        const { title, content, category, difficulty, eventId } = req.body;
        const { id } = req.user;

        if (!title || !content || !eventId) {
            return res.status(400).json({ message: "Title, content, and CTF event ID are required." });
        }
        if (!['Beginner', 'Intermediate', 'Advanced'].includes(difficulty)) {
            return res.status(400).json({ message: "Please provide a valid difficulty level." });
        }

        let baseSlug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        let slug = baseSlug;
        let counter = 1;
        while (await CTFWriteup.findOne({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const newWriteup = await CTFWriteup.create({ title, content, slug, adminId: id, event_id: eventId, category, difficulty });

        res.status(201).json(newWriteup);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating CTF writeup" });
    }
}

export const updateCTFWriteup = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content,category, difficulty, eventId } = req.body;

        if (!title || !content || !eventId) {
            return res.status(400).json({ message: "Title, content, and CTF event ID are required." });
        }
        if (!['Beginner', 'Intermediate', 'Advanced'].includes(difficulty)) {
            return res.status(400).json({ message: "Please provide a valid difficulty level." });
        }
        const writeup = await CTFWriteup.findByPk(id);
        if (!writeup) {
            return res.status(404).json({ message: "CTF writeup not found." });
        }
        if (writeup.adminId !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this CTF writeup." });
        }

        await writeup.update({ title, content, category, difficulty, event_id: eventId });

        res.json(writeup);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating CTF writeup" });
    }
}

export const deleteCTFWriteup = async (req, res) => {
    try {
        const { id } = req.params;
        const writeup = await CTFWriteup.findByPk(id);
        if (!writeup) {
            return res.status(404).json({ message: "CTF writeup not found." });
        }
        if (writeup.adminId !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this CTF writeup." });
        }
        await writeup.destroy();
        res.json({ message: "CTF writeup deleted successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting CTF writeup" });
    }
}

export const getCTFWriteupsByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const writeups = await CTFWriteup.findAll({ where: { event_id: eventId } });
        res.json(writeups);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving CTF writeups for event" });
    }
}