import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema<IFavorite>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    homeId: { type: mongoose.Schema.Types.ObjectId, ref: "Home" },
  },
  { timestamps: { createdAt: "createAt", updatedAt: "updatedAt" } }
);

export interface IFavorite {
  _id?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  homeId?: mongoose.Types.ObjectId;
}
const Favorite =
  mongoose.models?.Favorite ||
  mongoose.model<IFavorite>("Favorite", favoriteSchema);

export { Favorite };
