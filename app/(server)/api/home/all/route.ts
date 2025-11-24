import { dbConnect } from "@/lib/db";
import { getErrorMessage, response } from "@/lib/helperFunctions";
import { Home } from "@/models/Home";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const homes = await Home.aggregate([
      {
        $match: {},
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 1,
          description: 1,
          price: 1,
          photo: 1,
          country: 1,
        },
      },
    ]);

    return response(true, 200, "Success", homes);
  } catch (err: unknown) {
    return response(false, 500, getErrorMessage(err));
  }
}
