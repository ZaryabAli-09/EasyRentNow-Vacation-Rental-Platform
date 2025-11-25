// app/api/reservation/user/route.ts
import { dbConnect } from "@/lib/db";
import { Reservation } from "@/models/Reservation";
import { getErrorMessage, response } from "@/lib/helperFunctions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return response(false, 403, "Unauthorized");
    }

    const userId = session.user._id;

    const reservations = await Reservation.find({ userId }).populate({
      path: "homeId",
      select: "title photo country price",
    });

    console.log(reservations);

    return response(true, 200, "Fetched reservations", reservations);
  } catch (err) {
    return response(false, 500, getErrorMessage(err));
  }
}
