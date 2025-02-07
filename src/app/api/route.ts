import { NextResponse } from "next/server";

const GET = async () => {
  return NextResponse.json({ message: "Hello, world!" });
};

export { GET };