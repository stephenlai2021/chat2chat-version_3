import { NextResponse } from "next/server";
import connect from "@/lib/mongodb/connect";
import User from "@/models/Users";

export const GET = async (request) => {
  try {
    await connect();
    const users = await User.find()
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new NextResponse("Error in fetching users " + error, {
      status: 500
    });
  }
};
