import { dbConnect } from "@/lib/db";
import { Reservation } from "@/models/Reservation";
import { getErrorMessage, response } from "@/lib/helperFunctions";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { homeId } = await req.json();
    console.log("home", homeId);

    if (!homeId) {
      return response(false, 404, "Listing not found please refresh the page");
    }
    const reservations = await Reservation.find({ homeId }).select(
      "startDate endDate -_id"
    );
    return response(true, 200, "Fetched reservations", reservations);
  } catch (err) {
    return response(false, 500, getErrorMessage(err));
  }
}
