import React, { Component, createRef } from "react";
import { motion } from "framer-motion";
import axios from "./axios";
import config from "./config.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import { Paginate } from "./paginatedata";

let defaultIndex = -1;

class Posts extends Component {
  Button = createRef();

  state = {
    Posts: [],
    data: { title: "", body: "" },
    errors: {},
    currentPage: 1,
    pageSize: 6,
    loading: true,
  };

  async componentDidMount() {
    try {
      const posts = await axios.get(config.endpoint);
      const { data } = posts;
      this.setState({ Posts: data, loading: false });
      toast.success("Posts loaded successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      this.setState({ loading: false });
      toast.error("Failed to load posts");
    }
  }

  Pagedata = () => {
    const { pageSize, currentPage, Posts } = this.state;
    const posts = Paginate(Posts, currentPage, pageSize);
    return { totalCount: Posts.length, posts };
  };

  validateForm = () => {
    const { title, body } = this.state.data;
    
    if (title.trim() === "" || title.length < 4) {
      return false;
    }
    if (body.trim() === "" || body.length < 8) {
      return false;
    }
    return true;
  };

  handleInput = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.validateForm()) return;
    this.handleAdd();
  };

  handleAdd = async () => {
    const { data, Posts } = this.state;
    
    try {
      if (defaultIndex === -1) {
        const Add = await axios.post(config.endpoint, data);
        const { data: obj } = Add;
        const newPost = [{ ...obj, id: Posts.length + 1 }, ...Posts];
        
        this.setState({ 
          Posts: newPost, 
          data: { title: "", body: "" } 
        });
        
        toast.success("Post created successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        const Update = await axios.put(config.Updateendpoint, data);
        const { data: post } = Update;
        const UpdatePost = [...Posts];
        UpdatePost[defaultIndex] = { ...post };
        
        defaultIndex = -1;
        this.setState({ 
          Posts: UpdatePost, 
          data: { title: "", body: "" } 
        });
        
        toast.success("Post updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Operation failed. Please try again.");
    }
  };

  handleUpdate = (post) => {
    const { Posts } = this.state;
    const data = { title: post.title, body: post.body };
    
    this.setState({ data });
    config.Updateendpoint = `${config.endpoint}/${post.id}`;
    const index = Posts.indexOf(post);
    defaultIndex = index;
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  handleDelete = async (post) => {
    const originalPosts = this.state.Posts;
    const Posts = this.state.Posts.filter((p) => p.id !== post.id);
    this.setState({ Posts });

    try {
      await axios.delete(`${config.endpoint}/${post.id}`);
      toast.success("Post deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.warning("This post has already been deleted");
      } else {
        this.setState({ Posts: originalPosts });
        toast.error("Failed to delete post");
      }
    }
  };

  PageChange = (page) => {
    this.setState({ currentPage: page });
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  render() {
    const { data, currentPage, pageSize, loading } = this.state;
    const { totalCount, posts } = this.Pagedata();
    const isUpdating = defaultIndex !== -1;

    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Modern Posts Manager
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Create, manage, and organize your posts with style
            </p>
          </motion.div>

          {/* Post Form */}
          <PostForm
            data={data}
            onInputChange={this.handleInput}
            onSubmit={this.handleSubmit}
            isValid={this.validateForm()}
            isUpdating={isUpdating}
            buttonRef={this.Button}
          />

          {/* Posts Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">
                Your Posts
              </h2>
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="text-white font-medium">
                  {totalCount} {totalCount === 1 ? 'Post' : 'Posts'}
                </span>
              </div>
            </div>

            <LoadingSpinner loading={loading} />

            {!loading && posts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-white/60 text-xl mb-4">
                  No posts found
                </div>
                <p className="text-white/40">
                  Create your first post using the form above
                </p>
              </motion.div>
            )}

            {!loading && posts.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {posts.map((post, index) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onUpdate={this.handleUpdate}
                      onDelete={this.handleDelete}
                      index={index}
                    />
                  ))}
                </div>

                <Pagination
                  totalItem={totalCount}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  onPageChange={this.PageChange}
                />
              </>
            )}
          </motion.div>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    );
  }
}

export default Posts;