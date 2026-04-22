
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("🌱 Seeding database with high-fidelity content...");

  // SHARED STYLES (to ensure consistency across seeds)
  const LINK_CLASS = "text-[#e0a84c] hover:underline";
  const LIST_CLASS = "list-disc list-inside space-y-1.5 text-[14px] text-[#e5e5e5] mb-6 ml-0.5";
  const TEXT_CLASS = "text-[14px] text-[#e5e5e5] leading-relaxed mb-6";
  const SUBHEADER_CLASS = "text-[15px] font-medium text-white mb-3";

  const pages = [
    {
      slug: "about",
      title: "about me",
      sidebar_order: 1,
      sidebar_label: "about me",
      sidebar_emoji: "📌",
      content: `
          <p class="${TEXT_CLASS}">I build products, write about interesting ideas that won't leave me alone, and run marathons.</p>
          
          <h2 class="${SUBHEADER_CLASS}">currently</h2>
          <ul class="${LIST_CLASS}">
            <li>
              product manager at <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" class="${LINK_CLASS}">flipkart</a>, working on ads
            </li>
            <li>IIT Madras alum (B.Tech + M.Tech) based in Bengaluru</li>
            <li>writing on <a href="https://anujkhandalikar.medium.com/" target="_blank" rel="noopener noreferrer" class="${LINK_CLASS}">medium</a> since 2017</li>
            <li>running marathons & sharing on <a href="https://www.instagram.com/anuj.khandalikar/" target="_blank" rel="noopener noreferrer" class="${LINK_CLASS}">instagram</a></li>
          </ul>

          <h2 class="${SUBHEADER_CLASS}">previously</h2>
          <ul class="${LIST_CLASS}">
            <li>led business teams, built startups on the side, told stories through film</li>
            <li>business lead at <span class="text-[#e0a84c]">team avishkar hyperloop</span> (2019-2020)</li>
            <li>chief creator at <span class="text-[#e0a84c]">IITM TV</span>, grew from 3K to 10K+ subscribers</li>
          </ul>

          <p class="text-[14px] text-[#999] italic mt-5">biased toward clarity, craft, and building things. TLDR: obsessed about building.</p>
        `
    },
    {
      slug: "building",
      title: "building",
      sidebar_order: 2,
      sidebar_label: "building",
      sidebar_emoji: "🔨",
      content: `
          <h2 class="${SUBHEADER_CLASS}">at flipkart</h2>
          <ul class="${LIST_CLASS}">
            <li>
              <span class="text-white">ads (2024–present)</span> — launched new ad formats with Samsung & Apple exclusivity, led home page revamp, opened net-new 9-figure revenue inventory
            </li>
            <li>
              <span class="text-white">fulfilment (2023–2024)</span> — customer segmentation from supply-chain lens, delivery orchestration
            </li>
            <li>
              <span class="text-white">growth (2022–2023)</span> — owned Paytm-Flipkart partnership, cross-app integrations
            </li>
          </ul>

          <h2 class="${SUBHEADER_CLASS}">side projects</h2>
          <ul class="${LIST_CLASS}">
            <li>
              <a href="https://resonect.medium.com/coursepal-your-course-selection-pal-414e32dfc428" target="_blank" rel="noopener noreferrer" class="${LINK_CLASS}">coursepal</a> — course registration for IIT Madras, 2000+ users
            </li>
            <li>
              <a href="https://drive.google.com/file/d/1tDLNhn8A9PWnxelA1sJxlSGup9brrfTp/view" target="_blank" rel="noopener noreferrer" class="${LINK_CLASS}">watchhelp</a> — Netflix case study on choice paralysis
            </li>
            <li>
              <span class="text-white">the ken UX</span> — unsolicited redesign that landed me a PM internship
            </li>
            <li>
              <a href="https://drive.google.com/file/d/19cBZqBtFFtgyliRreBYRFNYahzToKvAS/view" target="_blank" rel="noopener noreferrer" class="${LINK_CLASS}">data privacy research</a> — PDPB, GDPR, regulatory frameworks
            </li>
          </ul>
        `
    },
    {
      slug: "writing",
      title: "writing",
      sidebar_order: 3,
      sidebar_emoji: "✍️",
      sidebar_label: "writing",
      content: `
          <p class="text-[14px] text-[#e5e5e5] leading-relaxed mb-3">I've been writing since December 2017 — that's 8+ years of putting words on paper (and screens).</p>
          <p class="text-[14px] text-[#e5e5e5] leading-relaxed mb-3">I write about product thinking, interesting ideas that won't leave me alone, and personal reflections. I've completed multiple 30-day writing sprints, written a short novel, and recently started a Write Club in 2025.</p>
          <p class="text-[14px] text-[#e5e5e5] leading-relaxed">Most of my writing lives on <a href="https://anujkhandalikar.medium.com/" target="_blank" rel="noopener noreferrer" class="${LINK_CLASS}">medium</a>. I also completed Ship 30 for 30 — writing 30 atomic essays in 30 days.</p>
        `
    },
    {
      slug: "running",
      title: "running",
      sidebar_order: 4,
      sidebar_emoji: "🏃",
      sidebar_label: "running",
      content: `
          <p class="text-[14px] text-[#e5e5e5] leading-relaxed mb-3">I run marathons. It's a big part of who I am.</p>
          <p class="text-[14px] text-[#e5e5e5] leading-relaxed mb-3">There's something about the long, slow grind of distance running that resonates with how I approach building products — consistency over intensity, showing up even when you don't feel like it, and the compounding effect of small efforts over time.</p>
          <p class="text-[14px] text-[#e5e5e5] leading-relaxed">Follow my running journey on <a href="https://www.instagram.com/anuj.khandalikar/" target="_blank" rel="noopener noreferrer" class="${LINK_CLASS}">instagram</a>.</p>
        `
    },
    {
      slug: "misc",
      title: "misc",
      sidebar_order: 5,
      sidebar_emoji: "📎",
      sidebar_label: "misc",
      content: `
           <ul class="${LIST_CLASS}">
              <li>
                <span class="text-white">team avishkar hyperloop</span> — led business for India's hyperloop team competing globally (2019–2020)
              </li>
              <li>
                <span class="text-white">IITM TV</span> — chief creator, grew the channel from 3K to 10K+ subscribers
              </li>
              <li>
                <a href="https://www.instagram.com/tv/CXLmTZUPjCC/" target="_blank" rel="noopener noreferrer" class="${LINK_CLASS}">gapshap with ganesh</a> — my vlog series since 2019
              </li>
            </ul>
        `
    }
  ];

  for (const page of pages) {
    const { error } = await supabase
      .from("pages")
      .upsert({
        slug: page.slug,
        title: page.title,
        content: page.content,
        sidebar_order: page.sidebar_order,
        sidebar_label: page.sidebar_label,
        sidebar_emoji: page.sidebar_emoji
      }, { onConflict: 'slug' })

    if (error) {
      console.error(`❌ Failed to seed "${page.title}":`, error.message);
    } else {
      console.log(`✅ Seeded "${page.title}" with visual fidelity`);
    }
  }
}

seed();
