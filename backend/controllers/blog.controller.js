import { Blog, Admin } from "../models/index.model.js"

export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll();
        res.json(blogs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving blogs" });
    }
};

export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByPk(id, {
            attributes: { exclude: ['adminId'] },
            include: [{ model: Admin, attributes: ['name'] }], 
        });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found." });
        }
        res.json(blog);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving blog" });
    }
}

export const createBlog = async (req, res) => {

    try {
        const { title, content } = req.body;
        const { id } = req.user;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required." });
        }
        
        let baseSlug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        let slug = baseSlug;
        let counter = 1;
        while (await Blog.findOne({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        const newBlog = await Blog.create({ title, content, slug, adminId: id });
        res.status(201).json(newBlog);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating blog" });
    }
}

export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required." });
        }

        const blog = await Blog.findByPk(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found." });
        }
        if (blog.adminId !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this blog." });
        }
        await blog.update({ title, content });
        res.json(blog);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating blog" });
    }
}

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByPk(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found." });
        }
        if (blog.adminId !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this blog." });
        }
        await blog.destroy();
        res.json({ message: "Blog deleted successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting blog" });
    }
}