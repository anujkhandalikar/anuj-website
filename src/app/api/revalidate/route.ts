import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { slug, secret } = await request.json();

        // Optional: Add a secret token for security
        // if (secret !== process.env.REVALIDATION_SECRET) {
        //   return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
        // }

        // Revalidate the specific page and home page
        if (slug) {
            revalidatePath(`/${slug}`);
        }
        revalidatePath("/");

        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err) {
        return NextResponse.json({ error: "Error revalidating" }, { status: 500 });
    }
}
