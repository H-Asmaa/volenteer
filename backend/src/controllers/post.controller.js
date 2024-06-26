const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const postService = require('../services/post.service');
// const { postService } = require('../services');

const createPost = catchAsync(async (req, res) => {
  const post = await postService.createPost({ ...req.body, author: req.user._id });
  res.status(httpStatus.CREATED).send(post);
});

const getPosts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await postService.queryPosts(filter, options);
  res.send(result);
});

const getPost = catchAsync(async (req, res) => {
  const post = await postService.getPostById(req.params.postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  res.send(post);
});

const updatePost = catchAsync(async (req, res) => {
  const post = await postService.updatePostById(req.params.postId, req.body);
  res.send(post);
});

const deletePost = catchAsync(async (req, res) => {
  await postService.deletePostById(req.params.postId);
  res.status(httpStatus.NO_CONTENT).send();
});

const createComment = catchAsync(async (req, res) => {
  const comment = await postService.createComment(req.params.postId, req.body);
  res.status(httpStatus.CREATED).send(comment);
});

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  createComment,
};
