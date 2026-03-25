import { Router } from "express";
import {
  createPost,
  getFeed,
  toggleLike,
  addComment,
  getPost,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getFeed); // public
// post routes are protected
router.use(verifyJWT);

router.route("/create").post(upload.single("image"), createPost);
router.route("/:postId").get(getPost);
router.route("/:postId/like").post(toggleLike);
router.route("/:postId/comment").post(addComment);

export default router;
