
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
  console.log("🌱 Seeding database...");

  // Data to seed
  const pages = [
    {
      slug: "about",
      title: "about me",
      sidebar_order: 1,
      sidebar_label: "about me",
      sidebar_emoji: "📌",
      content: `
          <p>I build products, write about interesting ideas that won't leave me alone, and run marathons.</p>
          
          <h2>currently</h2>
          <ul>
            <li>product manager at <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer">flipkart</a>, working on ads</li>
            <li>IIT Madras alum (B.Tech + M.Tech) based in Bengaluru</li>
            <li>writing on <a href="https://anujkhandalikar.medium.com/" target="_blank" rel="noopener noreferrer">medium</a> since 2017</li>
            <li>running marathons & sharing on <a href="https://www.instagram.com/anuj.khandalikar/" target="_blank" rel="noopener noreferrer">instagram</a></li>
          </ul>

          <h2>previously</h2>
          <ul>
            <li>led business teams, built startups on the side, told stories through film</li>
            <li>business lead at <span style="color: #e0a84c">team avishkar hyperloop</span> (2019-2020)</li>
            <li>chief creator at <span style="color: #e0a84c">IITM TV</span>, grew from 3K to 10K+ subscribers</li>
          </ul>

          <p><em>biased toward clarity, craft, and building things. TLDR: obsessed about building.</em></p>
        `
    },
    {
      slug: "building",
      title: "building",
      sidebar_order: 2,
      sidebar_label: "building",
      sidebar_emoji: "🔨",
      content: `
          <h2>at flipkart</h2>
          <ul>
            <li>
              <strong>ads (2024–present)</strong> — launched new ad formats with Samsung & Apple exclusivity, led home page revamp, opened net-new 9-figure revenue inventory
            </li>
            <li>
              <strong>fulfilment (2023–2024)</strong> — customer segmentation from supply-chain lens, delivery orchestration
            </li>
            <li>
              <strong>growth (2022–2023)</strong> — owned Paytm-Flipkart partnership, cross-app integrations
            </li>
          </ul>

          <h2>side projects</h2>
          <ul>
            <li>
              <a href="https://resonect.medium.com/coursepal-your-course-selection-pal-414e32dfc428" target="_blank" rel="noopener noreferrer">coursepal</a> — course registration for IIT Madras, 2000+ users
            </li>
            <li>
              <a href="https://drive.google.com/file/d/1tDLNhn8A9PWnxelA1sJxlSGup9brrfTp/view" target="_blank" rel="noopener noreferrer">watchhelp</a> — Netflix case study on choice paralysis
            </li>
            <li>
              <strong>the ken UX</strong> — unsolicited redesign that landed me a PM internship
            </li>
            <li>
              <a href="https://drive.google.com/file/d/19cBZqBtFFtgyliRreBYRFNYahzToKvAS/view" target="_blank" rel="noopener noreferrer">data privacy research</a> — PDPB, GDPR, regulatory frameworks
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
          <p>I've been writing since December 2017 — that's 8+ years of putting words on paper (and screens).</p>
          <p>I write about product thinking, interesting ideas that won't leave me alone, and personal reflections. I've completed multiple 30-day writing sprints, written a short novel, and recently started a Write Club in 2025.</p>
          <p>Most of my writing lives on <a href="https://anujkhandalikar.medium.com/" target="_blank" rel="noopener noreferrer">medium</a>. I also completed Ship 30 for 30 — writing 30 atomic essays in 30 days.</p>
        `
    },
    {
      slug: "running",
      title: "running",
      sidebar_order: 4,
      sidebar_emoji: "🏃",
      sidebar_label: "running",
      content: `
          <p>I run marathons. It's a big part of who I am.</p>
          <p>There's something about the long, slow grind of distance running that resonates with how I approach building products — consistency over intensity, showing up even when you don't feel like it, and the compounding effect of small efforts over time.</p>
          <p>Follow my running journey on <a href="https://www.instagram.com/anuj.khandalikar/" target="_blank" rel="noopener noreferrer">instagram</a>.</p>
        `
    },
    {
      slug: "misc",
      title: "misc",
      sidebar_order: 5,
      sidebar_emoji: "📎",
      sidebar_label: "misc",
      content: `
           <ul>
              <li>
                <strong>team avishkar hyperloop</strong> — led business for India's hyperloop team competing globally (2019–2020)
              </li>
              <li>
                <strong>IITM TV</strong> — chief creator, grew the channel from 3K to 10K+ subscribers
              </li>
              <li>
                <a href="https://www.instagram.com/tv/CXLmTZUPjCC/" target="_blank" rel="noopener noreferrer">gapshap with ganesh</a> — my vlog series since 2019
              </li>
            </ul>
        `
    }
  ];

  // Insert data
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
      console.log(`✅ Seeded "${page.title}"`);
    }
  }
}

seed();
