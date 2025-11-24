import { dbConnect } from "@/lib/db";
import { response } from "@/lib/helperFunctions";
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
  } catch (error) {
    console.error((error as Error).message);
    return response(false, 501, "Something Went Wrong");
  }
}
