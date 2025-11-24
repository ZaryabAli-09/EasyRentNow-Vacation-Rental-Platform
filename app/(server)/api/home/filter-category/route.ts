import { Home } from "@/models/Home";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { category } = await req.json();
    console.log(category);
    const homes = await Home.find({ categoryName: category });

    return NextResponse.json({ data: homes });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
