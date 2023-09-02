import React, { Component, createRef } from "react";
import axios from "./axios";
import config from "./config.json";
import { HashLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "./pagination";
import { Paginate } from "./paginatedata";

let defaultIndex = -1;

class Posts extends Component {
  Button = createRef();

  state = {
    Posts: [],
    data: { title: "", body: "" },
    errors: {},
    currentPage: 1,
    pageSize: 10,
    loading: true,
  };

  async componentDidMount() {
    const posts = await axios.get(config.endpoint);
    const { data } = posts;
    this.setState({ Posts: data, loading: false });
  }
  Pagedata = () => {
    const { pageSize, currentPage, Posts } = this.state;

    const movies = Paginate(Posts, currentPage, pageSize);

    return { totalCount: Posts.length, posts: movies };
  };
  render() {
    const { data, currentPage, pageSize, loading } = this.state;
    const { totalCount, posts } = this.Pagedata();

    return (
      <div>
        <div className="container my-3">
          <div className="card ">
            <div className="card-header bg-success text-white">Add Post</div>
            <div className="card-body">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={data.title}
                    onChange={this.handleInput}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="body">Body</label>
                  <textarea
                    name="body"
                    cols="30"
                    value={data.body}
                    rows="7"
                    className="form-control"
                    onChange={this.handleInput}
                  ></textarea>
                </div>
                <button
                  className="btn btn-primary d-flex ms-auto my-2"
                  onClick={this.handleAdd}
                  disabled={this.validiateForm()}
                  ref={this.Button}
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
        <ToastContainer />
        <div className="container my-3">
          <div className="card">
            <div className="card-header">Posts</div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Title</th>
                    <th>Operation</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => {
                    return (
                      <tr key={post.id}>
                        <td>{post.id}</td>
                        <td>{post.title}</td>
                        <td>
                          <button
                            className="btn btn-outline-warning mx-2"
                            onClick={() => this.handleUpdate(post)}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-outline-danger mx-2"
                            onClick={() => this.handleDelete(post)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <HashLoader
                color="#000000"
                loading={loading}
                className="m-auto"
              />
              <Pagination
                totalItem={totalCount}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={this.PageChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  validiateForm = () => {
    const errors = {};

    const { title, body } = this.state.data;

    if (title.trim() === "" || title.length < 4) {
      errors.title = "Username Must be at least 4 charachter";
    }
    if (body.trim() === "" || body.length < 8) {
      errors.body = "Password Must be at least 8 charachter";
    }
    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleInput = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validiateForm();
    this.setState({ errors: errors || {} });
    if (errors) return;
  };
  handleAdd = async () => {
    const { data, Posts } = this.state;
    if (defaultIndex === -1) {
      const Add = await axios.post(config.endpoint, data);
      const { data: obj } = Add;
      const newPost = [obj, ...Posts];
      data.body = "";
      data.title = "";
      this.setState({ Posts: newPost, data });
    } else {
      const Update = await axios.put(config.Updateendpoint, data);
      const { data: post } = Update;
      const UpdatePost = [...Posts];
      UpdatePost[defaultIndex] = { ...post };
      this.Button.current.innerHTML = "Add";
      // endpoint = "https://jsonplaceholder.typicode.com/posts";
      defaultIndex = -1;
      data.body = "";
      data.title = "";
      this.setState({ Posts: UpdatePost, data });
    }
  };

  handleUpdate = (post) => {
    const { data, Posts } = this.state;
    data.title = post.title;
    data.body = post.body;
    this.setState({ data });
    config.Updateendpoint = `${config.endpoint}/${post.id}`;
    const index = Posts.indexOf(post);
    defaultIndex = index;
    this.Button.current.innerHTML = "Update";
  };

  handleDelete = async (post) => {
    const originalPosts = this.state.Posts;

    const Posts = this.state.Posts.filter((p) => p.id !== post.id);
    this.setState({ Posts });

    try {
      await axios.delete(`${config.endpoint}/${post.id}`);
      //   throw new Error("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("This post has been already deleted");
      } else this.setState({ Posts: originalPosts });
    }
  };
  PageChange = (page) => {
    this.setState({ currentPage: page });
  };
}

export default Posts;
