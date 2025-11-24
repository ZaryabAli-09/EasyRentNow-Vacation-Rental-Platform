import { getErrorMessage, response } from "@/lib/helperFunctions";
import { Home } from "@/models/Home";

export async function POST(req: Request) {
  try {
    const { category } = await req.json();

    const homes = await Home.aggregate([
      {
        $match: {
          categoryName: category,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return response(
      true,
      200,
      "Successfully filtered Listings by category",
      homes
    );
  } catch (err: unknown) {
    return response(false, 500, getErrorMessage(err));
  }
}
