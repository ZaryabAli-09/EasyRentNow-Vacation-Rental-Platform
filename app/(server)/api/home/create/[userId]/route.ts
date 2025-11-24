import { NextRequest } from "next/server";
import { cloudinary } from "@/lib/cloudinaryConfig";
import { Home } from "@/models/Home";
import { response } from "@/lib/helperFunctions";
import { dbConnect } from "@/lib/db";

export const POST = async (
  req: NextRequest,
  params: { params: { userId: string } }
) => {
  await dbConnect();

  try {
    const formData = await req.formData();
    const { userId } = await params.params;

    // ----------------- EXTRACT FIELDS -----------------
    const category = formData.get("category") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const guest = formData.get("guest") as string;
    const room = formData.get("room") as string;
    const bathroom = formData.get("bathroom") as string;
    const country = formData.get("countryValue") as string;
    const imageFile = formData.get("image") as File;

    // ----------------- VALIDATION -----------------
    if (
      !category ||
      !title ||
      !description ||
      !price ||
      !guest ||
      !room ||
      !bathroom ||
      !country ||
      !imageFile
    ) {
      return response(false, 400, "All fields including image are required.");
    }

    // ----------------- UPLOAD IMAGE TO CLOUDINARY -----------------
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const base64 = `data:${imageFile.type};base64,${buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64, {
      folder: "EasyRentNow", // store all images in a separate folder
    });

    const imageUrl = uploadResult.secure_url;
    const cloudinaryId = uploadResult.public_id;

    // ----------------- SAVE TO MONGODB -----------------
    try {
      const newHome = await Home.create({
        userId: userId, // replace with actual user ID
        title,
        description,
        price: Number(price),
        guests: guest,
        bedrooms: room,
        bathrooms: bathroom,
        country,
        photo: imageUrl,
        categoryName: category,
      });

      return response(true, 200, "Home created successfully", newHome);
    } catch (err: any) {
      // If DB save fails, delete image from Cloudinary
      await cloudinary.uploader.destroy(cloudinaryId);
      return response(false, 500, err.message || "Failed to create home.");
    }
  } catch (err: any) {
    return response(false, 500, err.message || "Internal server error");
  }
};
