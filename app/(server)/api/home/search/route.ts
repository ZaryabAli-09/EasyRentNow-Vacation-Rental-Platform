import { NextRequest } from "next/server";
import { Home } from "@/models/Home";
import { dbConnect } from "@/lib/db";
import { getErrorMessage, response } from "@/lib/helperFunctions";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { country, guest, room, bathroom } = body;

    const matchStage: any = {};

    if (country) matchStage.country = country;
    if (guest) matchStage.guests = { $gte: guest };
    if (room) matchStage.bedrooms = { $gte: room };
    if (bathroom) matchStage.bathrooms = { $gte: bathroom };

    const homes = await Home.aggregate([
      {
        $match: matchStage,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return response(true, 200, "Successfully get Listings by search", homes);
  } catch (err: unknown) {
    return response(false, 500, getErrorMessage(err));
  }
}
