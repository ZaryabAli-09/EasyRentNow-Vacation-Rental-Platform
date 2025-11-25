import { Favorite } from "@/models/Favorite";
import { dbConnect } from "@/lib/db";
import { getServerSession } from "next-auth";
import { getErrorMessage, response } from "@/lib/helperFunctions";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session?.user?._id) {
      return response(false, 404, "No favourites found");
    }

    const favorites = await Favorite.find({
      userId: session.user._id,
    }).select("homeId");

    const favoriteHomeIds = favorites.map((fav) => fav.homeId.toString());
    return response(
      true,
      200,
      "Successfully get favorite home ids",
      favoriteHomeIds
    );
  } catch (err) {
    return response(false, 501, getErrorMessage(err));
  }
}
