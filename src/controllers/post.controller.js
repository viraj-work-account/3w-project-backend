import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/post.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// create post
const createPost = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const imageLocalPath = req.file?.path;

  // at least one of text or image is required
  if (!text && !imageLocalPath) {
    throw new ApiError(400, "Post must have either text or image");
  }

  // upload image to cloudinary if present
  let imageUrl = null;
  if (imageLocalPath) {
    const uploadedImage = await uploadOnCloudinary(imageLocalPath);
    if (!uploadedImage) {
      throw new ApiError(500, "Error while uploading image");
    }
    imageUrl = uploadedImage.url;
  }

  // create post
  const post = await Post.create({
    author: req.user._id,
    text: text || null,
    image: imageUrl,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully!"));
});

// get all posts
const getFeed = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("author", "username") // replace author ObjectId with username
    .populate("comments.user", "username") // replace comment user ObjectId with username
    .sort({ createdAt: -1 }); // newest post first

  // filter out posts where author was deleted
  const validPosts = posts.filter((post) => post.author !== null);

  return res
    .status(200)
    .json(new ApiResponse(200, validPosts, "Feed fetched successfully"));
});

// toggle like unlike
const toggleLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // check if user already liked the post
  const alreadyLiked = post.likes.includes(req.user._id);

  if (alreadyLiked) {
    // unlike
    post.likes = post.likes.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
  } else {
    // like
    post.likes.push(req.user._id);
  }

  await post.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        likes: post.likes.length,
        isLiked: !alreadyLiked,
      },
      alreadyLiked ? "Post unliked successfully" : "Post liked successfully"
    )
  );
});

// add comment
const addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  if (!text?.trim()) {
    throw new ApiError(400, "Comment text is required");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // add comment
  post.comments.push({
    user: req.user._id,
    text,
  });

  await post.save();

  // populate the last added comment's user
  await post.populate("comments.user", "username");

  const newComment = post.comments[post.comments.length - 1];

  return res
    .status(201)
    .json(new ApiResponse(201, newComment, "Comment added successfully"));
});

// get single post
const getPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId)
    .populate("author", "username")
    .populate("comments.user", "username");

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post fetched successfully"));
});

export { createPost, getFeed, toggleLike, addComment, getPost };
