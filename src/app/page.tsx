import { getSidebarData, getPageBySlug } from "@/lib/db";
import { getSession } from "@/lib/auth";
import EditableSection from "@/components/EditableSection";
import FormattedDate from "@/components/FormattedDate";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [isAuthenticated, aboutPage] = await Promise.all([
    getSession(),
    getPageBySlug("about")
  ]);

  let page = aboutPage;
  if (!page) {
    const sidebarPages = await getSidebarData();
    if (sidebarPages.length > 0) {
      page = await getPageBySlug(sidebarPages[0].slug);
    }
  }

  return (
    <>
      <div className="hidden">
        {/* Hidden metadata or prefetch could go here */}
      </div>

      {page ? (
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
      ) : (
        <div className="flex items-center justify-center h-full text-[#666] text-sm pt-20">
          No content found. Start by creating a page.
        </div>
      )}
    </>
  );
}
