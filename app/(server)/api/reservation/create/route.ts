import { getErrorMessage, response } from "@/lib/helperFunctions";
import { Reservation } from "@/models/Reservation";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { startDate, endDate, userId, homeId } = await req.json();
  try {
    //   basic validation should be replaced in future with zod etc
    if (!userId) {
      return response(false, 403, "Unauthorized request please sign in");
    }
    if (!homeId) {
      return response(
        false,
        404,
        "Home listing not found please refresh the page"
      );
    }

    if (!startDate || !endDate) {
      return response(false, 403, "Start and End date are required");
    }

    const reservation = new Reservation({
      startDate,
      endDate,
      userId,
      homeId,
    });

    await reservation.save();

    return response(true, 201, "Reservation successfully", reservation);
  } catch (err) {
    response(false, 501, getErrorMessage(err));
  }
}
