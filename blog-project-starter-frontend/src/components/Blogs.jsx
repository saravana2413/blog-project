import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "./common/Footer";
import { useAuth } from "../context/AuthContext";

function Blogs() {
    const { isAdmin } = useAuth();

    const [blogs, setBlogs] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch blogs
    const fetchBlogs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "https://blog-project-backend-e38i.onrender.com/api/blogs"
            );

            setBlogs(response.data);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            setError("Error fetching blogs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchBlogs();
    }, []);

    // Like blog
    const handleLike = async (blogId) => {
        try {
            await axios.patch(
                `https://blog-project-backend-e38i.onrender.com/api/blogs/like/${blogId}`
            );

            fetchBlogs();
        } catch (error) {
            console.error("Error liking the blog:", error);
        }
    };

    // Add new blog - Admin only
    const handleNewBlogSubmit = async (event) => {
        event.preventDefault();

        if (!isAdmin) {
            return;
        }

        try {
            const today = new Date();

            const date = today.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });

            const blogData = {
                newTitle,
                newContent,
                date,
                likes: 0,
            };

            await axios.post(
                "https://blog-project-backend-e38i.onrender.com/api/blogs",
                blogData
            );

            setNewTitle("");
            setNewContent("");

            fetchBlogs();

        } catch (error) {
            console.error("Error creating blog:", error);
            setError("Error creating blog");
        }
    };

    // Delete blog - Admin only
    const handleDelete = async (blogId) => {
        if (!isAdmin) {
            return;
        }

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this blog?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(
                `https://blog-project-backend-e38i.onrender.com/api/blogs/${blogId}`
            );

            setBlogs((previousBlogs) =>
                previousBlogs.filter(
                    (blog) => blog._id !== blogId
                )
            );

        } catch (error) {
            console.error("Error deleting blog:", error);
            setError("Error deleting blog");
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="text-center py-20">
                <p className="text-xl">Loading blogs...</p>
            </div>
        );
    }

    return (
        <div className="blog-section py-14">

            <h2 className="text-center text-5xl font-bold mb-14">
                Latest{" "}
                <span className="text-orange-400">
                    Blogs
                </span>{" "}
                📚
            </h2>

            {/* Error */}
            {error && (
                <p className="text-center text-red-500 mb-6">
                    {error}
                </p>
            )}

            {/* ADMIN BLOG CREATION FORM */}
            {isAdmin && (
                <div
                    className="blog-creation-form mb-8"
                    style={{
                        width: "80%",
                        margin: "auto",
                    }}
                >
                    <h3 className="text-2xl font-bold mb-4">
                        Admin: Add New Blog
                    </h3>

                    <form
                        onSubmit={handleNewBlogSubmit}
                        className="flex flex-col gap-4"
                    >
                        <input
                            type="text"
                            placeholder="Blog Title"
                            value={newTitle}
                            onChange={(e) =>
                                setNewTitle(e.target.value)
                            }
                            className="p-2 border rounded"
                            required
                        />

                        <textarea
                            placeholder="Blog Content"
                            value={newContent}
                            onChange={(e) =>
                                setNewContent(e.target.value)
                            }
                            className="p-2 border rounded"
                            rows="4"
                            required
                        />

                        <button
                            type="submit"
                            className="bg-orange-400 text-white p-2 rounded hover:bg-orange-600"
                        >
                            Add Blog
                        </button>
                    </form>
                </div>
            )}

            {/* BLOG LIST */}
            <div className="blogs-container grid grid-cols-1 md:grid-cols-2 gap-6 container mx-auto px-4">

                {blogs.length === 0 ? (
                    <p className="text-center col-span-full text-gray-500">
                        No blogs available.
                    </p>
                ) : (
                    blogs.map((blog) => (
                        <div
                            key={blog._id}
                            className="blog-post mb-8 p-6 bg-white shadow-lg rounded-lg"
                        >
                            <h3 className="blog-title font-semibold text-2xl text-gray-800 mb-3">
                                {blog.newTitle}
                            </h3>

                            <p className="blog-date text-gray-400 text-sm mb-4">
                                {blog.date}
                            </p>

                            <p className="blog-content text-gray-600 mb-4">
                                {blog.newContent}
                            </p>

                            {/* LIKE */}
                            <div className="flex items-center">

                                <button
                                    className="text-blue-500 cursor-pointer"
                                    onClick={() =>
                                        handleLike(blog._id)
                                    }
                                >
                                    Like
                                </button>

                                <span className="ml-2">
                                    {blog.likes || 0} Likes
                                </span>

                                {/* ADMIN DELETE */}
                                {isAdmin && (
                                    <button
                                        onClick={() =>
                                            handleDelete(blog._id)
                                        }
                                        className="ml-6 text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                )}

                            </div>
                        </div>
                    ))
                )}

            </div>

            <Footer />

        </div>
    );
}

export default Blogs;