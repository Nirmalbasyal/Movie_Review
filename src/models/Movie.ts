import mongoose, { Document, Schema } from "mongoose";

interface IMovie extends Document {
  name: string;
  thumbnail: string;
  description: string;
  genre: string;
  createdBy: mongoose.Types.ObjectId;
}

const movieSchema = new Schema<IMovie>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    genre: {
         type: String, required: true 
        },

    description: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Movie = mongoose.model<IMovie>("Movie", movieSchema);

export default Movie;
