import mongoose from "mongoose";

export interface IHome {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  guests: string;
  bedrooms: string;
  bathrooms: string;
  country: string;
  photo: string;
  price: number;
  categoryName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const homeSchema = new mongoose.Schema<IHome>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    guests: {
      type: String,
      required: true,
    },
    bedrooms: {
      type: String,
      required: true,
    },
    bathrooms: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    categoryName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Home = mongoose.models?.Home || mongoose.model<IHome>("Home", homeSchema);

export { Home };
