import { NextRequest, NextResponse } from "next/server";
import codes from "../codes.json";

export const GET = async (req: NextRequest, { params }: { params: { id: number } }) => {
  const code = codes.find((code) => code.id === params.id);
  return NextResponse.json(code);
};