import mongoose, { Schema, Document } from 'mongoose';

export interface IWatchlist extends Document {
  user: mongoose.Types.ObjectId;
  movie: mongoose.Types.ObjectId;
}

const watchlistSchema = new Schema<IWatchlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    movie: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Prevents the same user from adding the same movie twice at the database level —
// this is safer than only checking in the controller, since it holds even under
// race conditions (e.g. rapid double-clicks on the watchlist button).
watchlistSchema.index({ user: 1, movie: 1 }, { unique: true });

const Watchlist = mongoose.model<IWatchlist>('Watchlist', watchlistSchema);
export default Watchlist;