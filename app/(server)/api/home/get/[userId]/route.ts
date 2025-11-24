import { response } from "@/lib/helperFunctions";
import { Home } from "@/models/Home";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
export async function GET(
  req: NextRequest,
  params: { params: { userId: string } }
) {
  try {
    const { userId } = await params.params;
    if (!userId) {
      return response(false, 404, "UserId not found");
    }

    // const homes = await Home.find({ userId });
    const homes = await Home.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId), //     },
        },
      },
      { $sort: { createdAt: -1 } },

      {
        $project: {
          userId: 1,
          _id: 1,
          photo: 1,
          description: 1,
          country: 1,
          price: 1,
        },
      },
    ]);

    return response(true, 200, "Successfully get my Listings", homes);
  } catch (error: any) {
    console.error((error as Error).message);
    return response(false, 501, "Something Went Wrong");
  }
}
