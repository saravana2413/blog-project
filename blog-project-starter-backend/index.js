require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// MongoDB Connection
// ===============================

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connection Successful");
    })
    .catch((error) => {
        console.error("MongoDB Connection Error:", error);
    });

// ===============================
// Blog Schema
// ===============================

const blogSchema = new mongoose.Schema({
    newTitle: {
        type: String,
        required: true,
    },

    newContent: {
        type: String,
        required: true,
    },

    date: {
        type: String,
        required: true,
    },

    likes: {
        type: Number,
        default: 0,
    },
});

// ===============================
// Blog Model
// ===============================

const Blog = mongoose.model("Blog", blogSchema);

// ===============================
// GET - Get all blogs
// ===============================

app.get("/api/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({
            _id: -1,
        });

        res.status(200).json(blogs);

    } catch (error) {
        console.error("Error fetching blogs:", error);

        res.status(500).json({
            message: error.message,
        });
    }
});

// ===============================
// POST - Add new blog
// ===============================

app.post("/api/blogs", async (req, res) => {
    try {
        const {
            newTitle,
            newContent,
            date,
            likes,
        } = req.body;

        const blog = new Blog({
            newTitle,
            newContent,
            date,
            likes: likes ?? 0,
        });

        const newBlog = await blog.save();

        res.status(201).json(newBlog);

    } catch (error) {
        console.error("Error creating blog:", error);

        res.status(400).json({
            message: error.message,
        });
    }
});

// ===============================
// PATCH - Like blog
// ===============================

app.patch("/api/blogs/like/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(
            req.params.id
        );

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
            });
        }

        const updatedBlog =
            await Blog.findByIdAndUpdate(
                req.params.id,
                {
                    $inc: {
                        likes: 1,
                    },
                },
                {
                    new: true,
                }
            );

        res.status(200).json(updatedBlog);

    } catch (error) {
        console.error("Error liking blog:", error);

        res.status(500).json({
            message: error.message,
        });
    }
});

// ===============================
// DELETE - Delete blog
// ===============================

app.delete("/api/blogs/:id", async (req, res) => {
    try {
        const deletedBlog =
            await Blog.findByIdAndDelete(
                req.params.id
            );

        if (!deletedBlog) {
            return res.status(404).json({
                message: "Blog not found",
            });
        }

        res.status(200).json({
            message: "Blog deleted successfully",
            blog: deletedBlog,
        });

    } catch (error) {
        console.error("Error deleting blog:", error);

        res.status(500).json({
            message: error.message,
        });
    }
});

// ===============================
// Start Server
// ===============================

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});