
import { NextRequest, NextResponse } from "next/server";
import { getPageBySlug, updatePage, deletePage } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Helper to check auth for mutations
async function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get("auth_session")?.value;
  if (!token) return false;
  return verifySession(token);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  return NextResponse.json(page);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const body = await request.json();
  const updatedPage = await updatePage(slug, body);

  if (!updatedPage) {
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
  }

  // Revalidate cache immediately after update
  revalidatePath(`/${slug}`);
  revalidatePath("/");

  return NextResponse.json(updatedPage);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const success = await deletePage(slug);

  if (!success) {
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
  }

  // Revalidate cache immediately after delete
  revalidatePath(`/${slug}`);
  revalidatePath("/");

  return NextResponse.json({ success: true });
}

