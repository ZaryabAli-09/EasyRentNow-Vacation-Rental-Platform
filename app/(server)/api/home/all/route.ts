import { dbConnect } from "@/lib/db";
import { response } from "@/lib/helperFunctions";
import { Home } from "@/models/Home";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();

  const homes = await Home.find({});
  console.log(homes);
  return response(true, 200, "Success", homes);
}
