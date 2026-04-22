import { unstable_cache, revalidateTag } from "next/cache";
import { supabase } from "./supabase";

export interface Page {
  id: number;
  slug: string;
  title: string;
  content: string;
  sidebar_order: number | null;
  sidebar_label: string | null;
  sidebar_emoji: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SidebarPage extends Pick<Page, "slug" | "title" | "sidebar_emoji" | "created_at" | "updated_at"> {
  snippet: string;
  // sidebar_order is needed for sorting in MobileHeader
  sidebar_order?: number | null;
}

export async function getPages(): Promise<Page[]> {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("is_published", true)
    .order("sidebar_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching pages:", error);
    return [];
  }
  return data || [];
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching page:", error);
    return null;
  }
  return data;
}

export async function updatePage(
  slug: string,
  data: { title?: string; content?: string; sidebar_emoji?: string }
): Promise<Page | null> {
  const { data: updated, error } = await supabase
    .from("pages")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug)
    .select()
    .single();

  if (error) {
    console.error("Error updating page:", error);
    return null;
  }

  revalidateTag('sidebar-data');
  return updated;
}

export async function createPage(data: {
  slug: string;
  title: string;
  content: string;
  sidebar_order?: number;
  sidebar_label?: string;
  sidebar_emoji?: string;
}): Promise<{ data: Page | null; error: any }> {
  const { data: newPage, error } = await supabase
    .from("pages")
    .insert({
      slug: data.slug,
      title: data.title,
      content: data.content,
      sidebar_order: data.sidebar_order || null,
      sidebar_label: data.sidebar_label || data.title,
      sidebar_emoji: data.sidebar_emoji || "📝",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating page:", error);
    return { data: null, error };
  }

  revalidateTag('sidebar-data');
  return { data: newPage, error: null };
}

export async function deletePage(slug: string): Promise<boolean> {
  const { error } = await supabase.from("pages").delete().eq("slug", slug);
  if (!error) {
    revalidateTag('sidebar-data');
  }
  return !error;
}

export async function getSidebarPages(): Promise<
  Pick<Page, "slug" | "sidebar_label" | "sidebar_emoji" | "sidebar_order">[]
> {
  const { data, error } = await supabase
    .from("pages")
    .select("slug, sidebar_label, sidebar_emoji, sidebar_order")
    .eq("is_published", true)
    .not("sidebar_order", "is", null)
    .order("sidebar_order", { ascending: true });

  if (error) {
    console.error("Error fetching sidebar pages:", error);
    return [];
  }
  return data || [];
}

const fetchSidebarData = async (): Promise<SidebarPage[]> => {
  const { data, error } = await supabase
    .from("pages")
    .select("slug, title, sidebar_emoji, sidebar_order, created_at, updated_at, content")
    .eq("is_published", true)
    .order("sidebar_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching sidebar data:", error);
    return [];
  }

  return (data || []).map((p) => ({
    slug: p.slug,
    title: p.title,
    sidebar_emoji: p.sidebar_emoji,
    created_at: p.created_at,
    updated_at: p.updated_at,
    sidebar_order: p.sidebar_order,
    snippet: p.content ? p.content.replace(/<[^>]*>?/gm, '').substring(0, 30) + (p.content.length > 30 ? '...' : '') : ''
  }));
};

export const getSidebarData = unstable_cache(
  fetchSidebarData,
  ['sidebar-data'],
  { tags: ['sidebar-data'] }
);
