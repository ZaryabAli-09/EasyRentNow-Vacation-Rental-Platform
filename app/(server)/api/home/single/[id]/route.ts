import { dbConnect } from "@/lib/db";
import { getErrorMessage, response } from "@/lib/helperFunctions";
import { Home } from "@/models/Home";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const homeId = (await context.params).id; // params.userId is a string
    if (!homeId) {
      return response(false, 404, "Home not found");
    }

    const home = await Home.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(homeId) },
      },
    ]);

    return response(true, 200, "Successfully get single home", home);
  } catch (err: unknown) {
    console.error(err);
    return response(false, 500, getErrorMessage(err));
  }
}
