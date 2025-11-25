import { Favorite } from "@/models/Favorite";
import { dbConnect } from "@/lib/db";
import { getServerSession } from "next-auth";
import { getErrorMessage, response } from "@/lib/helperFunctions";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    console.log(session?.user?._id);
    if (!session || !session.user._id) {
      return response(false, 403, "Please sign in");
    }

    const { homeId } = await req.json();
    const userId = session.user._id;

    const existing = await Favorite.findOne({ homeId, userId });

    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return response(true, 200, "Removed from favorite", { removed: true });
    }

    await Favorite.create({ homeId, userId });

    return response(true, 200, "Added to favorite", { added: true });
  } catch (err) {
    return response(true, 200, getErrorMessage(err));
  }
}
