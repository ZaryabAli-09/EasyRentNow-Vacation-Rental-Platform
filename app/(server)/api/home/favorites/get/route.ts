import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/db";
import { getErrorMessage, response } from "@/lib/helperFunctions";
import { Favorite } from "@/models/Favorite";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    console.log("user logger", session?.user._id);

    if (!session || !session.user._id) {
      return response(false, 404, "Unauthorized request please sign in");
    }
    const favoritesHomes = await Favorite.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(session.user._id) } },
      {
        $lookup: {
          from: "homes",
          localField: "homeId",
          foreignField: "_id",
          as: "home",
        },
      },
      { $unwind: "$home" },
      {
        $replaceRoot: { newRoot: "$home" }, // make the home document the root
      },
      {
        $project: {
          _id: 1,
          description: 1,
          photo: 1,
          country: 1,
          price: 1,
        },
      },
    ]);

    console.log(favoritesHomes);
    return response(
      true,
      200,
      "Successfully fetched favorite homes",
      favoritesHomes
    );
  } catch (err) {
    return response(false, 501, getErrorMessage(err));
  }
}
