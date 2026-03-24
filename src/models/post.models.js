import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // cloudinary URL
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// atleast one of text or image must be present
postSchema.pre("validate", function (next) {
  if (!this.text && !this.image) {
    return next(new Error("Post must have either text or image"));
  }
  next();
});

export const Post = mongoose.model("Post", postSchema);
