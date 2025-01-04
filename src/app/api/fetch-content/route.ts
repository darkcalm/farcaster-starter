import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://filedn.com/lxUBX0hA2uQYeRydyYCII9b/(html-64mpp)%F0%9F%92%A1-yak-rover_5456cdd9-027d-485d-b31e-256295e7a1e0/%F0%9F%92%A1-yak-rover_5456cdd9-027d-485d-b31e-256295e7a1e0/%F0%9F%92%A1-yak-rover_page_1.html",
    );
    const text = await response.text();
    return NextResponse.json({ content: text });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch content" + error },
      { status: 500 },
    );
  }
}
