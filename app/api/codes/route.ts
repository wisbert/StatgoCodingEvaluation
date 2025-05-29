import { NextResponse } from "next/server";
import code from "./codes.json"

export const GET = async () => {
  return NextResponse.json(code);
};
