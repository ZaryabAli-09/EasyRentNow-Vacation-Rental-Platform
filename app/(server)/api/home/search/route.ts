import { NextRequest, NextResponse } from "next/server";
import { Home } from "@/models/Home";
import { dbConnect } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { country, guest, room, bathroom } = body;

    const filter: any = {};

    if (country) filter.country = country;
    if (guest) filter.guests = { $gte: guest };
    if (room) filter.bedrooms = { $gte: room };
    if (bathroom) filter.bathrooms = { $gte: bathroom };

    const homes = await Home.find(filter).sort({ createdAT: -1 });

    return NextResponse.json({ success: true, data: homes }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
