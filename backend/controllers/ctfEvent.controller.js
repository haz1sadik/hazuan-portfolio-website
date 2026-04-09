import { CTFEvent, Admin } from "../models/index.model.js"

export const getCTFEvents = async (req, res) => {
    try {
        const events = await CTFEvent.findAll();
        res.json(events);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving CTF events" });
    }
}

export const getCTFEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await CTFEvent.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: "CTF event not found." });
        }
        res.json(event);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving CTF event" });
    }
}

export const createCTFEvent = async (req, res) => {
    try {
        const { name, date, description } = req.body;

        if (!name || !date) {
            return res.status(400).json({ message: "Name and date are required." });
        }

        const existingEvent = await CTFEvent.findOne({ where: { name } });
        if (existingEvent) {
            return res.status(400).json({ message: "A CTF event with this name already exists." });
        }

        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const existingSlug = await CTFEvent.findOne({ where: { slug } });
        if (existingSlug) {
            return res.status(400).json({ message: "A CTF event with a similar name already exists." });
        }

        const newEvent = await CTFEvent.create({ name, date, description, slug });

        res.status(201).json(newEvent);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating CTF event" });
    }
}

export const updateCTFEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, date, description } = req.body;

        if (!name || !date) {
            return res.status(400).json({ message: "Name and date are required." });
        }

        const event = await CTFEvent.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: "CTF event not found." });
        }

        await event.update({ name, date, description });

        res.json(event);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating CTF event" });
    }
}

export const deleteCTFEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await CTFEvent.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: "CTF event not found." });
        }
        await event.destroy();
        res.json({ message: "CTF event deleted successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting CTF event" });
    }
}