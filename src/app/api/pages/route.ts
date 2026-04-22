
import { NextRequest, NextResponse } from "next/server";
import { getPages, getSidebarPages, createPage } from "@/lib/db";
import { verifySession } from "@/lib/auth";

async function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get("auth_session")?.value;
  if (!token) return false;
  return verifySession(token);
}

export async function GET() {
  const pages = await getPages();
  return NextResponse.json(pages);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Basic validation
  if (!body.title || !body.slug) {
    return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
  }

  const { data: newPage, error } = await createPage(body);

  if (error || !newPage) {
    console.error("Create Page Error:", error);
    return NextResponse.json(
      { error: "Failed to create page", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }

  return NextResponse.json(newPage);
}
