import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Home } from "@/models/Home";
import { getErrorMessage, response } from "@/lib/helperFunctions";
import { cloudinary } from "@/lib/cloudinaryConfig";

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const { homeId, userId, photoUrl } = await req.json();

    const home = await Home.findById(homeId);

    if (!home) {
      return response(false, 404, "Listing not found");
    }

    if (home.userId.toString() !== userId) {
      return response(false, 403, "Unauthorized request");
    }

    if (photoUrl) {
      const segments = photoUrl.split("/");
      const publicIdWithExtension = segments[segments.length - 1];
      const publicId = publicIdWithExtension.split(".")[0];

      await cloudinary.uploader.destroy(publicId);
    }

    await Home.findByIdAndDelete(homeId);

    return response(true, 200, "Listing deleted successfully");
  } catch (err: unknown) {
    return response(false, 500, getErrorMessage(err));
  }
}
