import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/db";
import { getSession } from "@/lib/auth";
import EditableSection from "@/components/EditableSection";
import FormattedDate from "@/components/FormattedDate";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [isAuthenticated, page] = await Promise.all([
        getSession(),
        getPageBySlug(slug)
    ]);

    if (!page) {
        notFound();
    }

    return (
        <>
            {/* Date header */}
            <p className="text-center text-[12px] text-[#666] pt-6 md:pt-10 mb-6 mt-12 md:mt-0 px-6">
                <FormattedDate date={page.updated_at || page.created_at} />
            </p>

            <div className="max-w-[600px] md:ml-6 px-6 pb-6 md:pb-10">
                <section key={page.slug} id={page.slug} className="mb-12">
                    <h1 className="text-[20px] font-medium text-[var(--notes-text)] mb-4 flex items-center gap-2">
                        <span>{page.sidebar_emoji}</span> {page.title}
                    </h1>
                    <EditableSection
                        slug={page.slug}
                        initialContent={page.content}
                        isAuthenticated={isAuthenticated}
                    />
                </section>
            </div>
        </>
    );
}
