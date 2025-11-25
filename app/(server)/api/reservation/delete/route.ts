// app/api/reservation/delete/route.ts
import { dbConnect } from "@/lib/db";
import { Reservation } from "@/models/Reservation";
import { getErrorMessage, response } from "@/lib/helperFunctions";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const { reservationId, userId } = await req.json();

    if (!userId) {
      return response(false, 403, "Unauthorized request");
    }

    if (!reservationId) {
      return response(false, 404, "Reservation not found");
    }

    const deleted = await Reservation.findOneAndDelete({
      _id: reservationId,
      userId,
    });

    if (!deleted) {
      return response(false, 404, "Reservation not found or not yours");
    }

    return response(true, 200, "Reservation deleted successfully");
  } catch (err) {
    return response(false, 500, getErrorMessage(err));
  }
}
