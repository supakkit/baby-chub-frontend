import React from "react";
import { Link } from "react-router-dom";

/* -----------------------------------------------------------------------------
 * Data model
 * We keep a SINGLE source of truth: `foundersTimeline`.
 * This array is used by BOTH "Our Story" (top cards) and "Co-Founders" (grid).
 * Each founder contains:
 * - id, name, nickname
 * - role (short form like "CEO / Product")
 * - image, alt (include role in alt for SEO)
 * - tagline (short line)
 * - passion (multi-line string using \n)
 * - order (for mobile ordering priority; CEO first, etc.)
 * ---------------------------------------------------------------------------*/
const foundersTimeline = [
  {
    id: "metee",
    name: "Metee Suwannason",
    nickname: "Man",
    role: "CEO / Product",
    image: "/images/founders/metee.png",
    alt: "Portrait of Metee Suwannason, CEO / Product",
    tagline: "From Structures to Solutions",
    passion:
      "For a decade I engineered structures that keep people safe." +
      " JSD10 reminded me that I can build more than bridges—I can build products that help families learn, play, and thrive.\n\n" +
      "I’m excited to bring engineering rigor and product thinking together, turning constraints into reliable, human-centered experiences.",
    order: "order-1",
  },
  {
    id: "siriporn",
    name: "Siriporn Worranawin",
    nickname: "Poompui",
    role: "CMO / Content",
    image: "/images/founders/siriporn.png",
    alt: "Portrait of Siriporn Worranawin, CMO / Content",
    tagline: "Moms’ Voice in Tech",
    passion:
      "As a mom I’ve seen firsthand how hard it is to find reliable, enriching resources for families.\n" +
      "I want to make sure technology carries the voices of mothers everywhere.\n\n" +
      "My mission is to ensure that our products empower parents and nurture the growth of children.",
    order: "order-2",
  },
  {
    id: "pimrawin",
    name: "Pimrawin Wipakorn",
    nickname: "Ryu",
    role: "CPO / UX",
    image: "/images/founders/pimrawin.png",
    alt: "Portrait of Pimrawin Wipakorn, CPO / UX",
    tagline: "Designing with Fresh Eyes",
    passion:
      "I believe design is about empathy." +
      " Fresh perspectives allow us to craft experiences that are inclusive and intuitive.\n\n" +
      "I want to bring joy and clarity to every interaction families have with our platform.",
    order: "order-3",
  },
  {
    id: "suchakree",
    name: "Suchakree Chantanayingyong",
    nickname: "Fluke",
    role: "COO / Legal & Ops",
    image: "/images/founders/suchakree.png",
    alt: "Portrait of Suchakree Chantanayingyong, COO / Legal & Ops",
    tagline: "Clarity, Trust, and Scale",
    passion:
      "Operations are the backbone of any sustainable company.\n\n" +
      "I want to ensure that every process is transparent, scalable, and trustworthy.\n" +
      "Legal and operational clarity will help us grow without losing integrity.",
    order: "order-4",
  },
  {
    id: "supakkit",
    name: "Supakkit Sitthi",
    nickname: "Prem",
    role: "CTO / Engineering",
    image: "/images/founders/supakkit.png",
    alt: "Portrait of Supakkit Sitthi, CTO / Engineering",
    tagline: "Built for Reliability",
    passion:
      "Technology should be reliable and invisible, empowering people without standing in their way.\n\n" +
      "My goal is to build systems that scale, stay secure, and keep families’ trust.\n" +
      "Reliability isn’t just technical—it’s personal.",
    order: "order-5",
  },
];

/* -----------------------------------------------------------------------------
 * Role map (short → full)
 * Used to show a professional, readable full-title under the role pill.
 * ---------------------------------------------------------------------------*/
const roleMap = {
  CEO: "Chief Executive Officer",
  CMO: "Chief Marketing Officer",
  CPO: "Chief Product Officer",
  COO: "Chief Operating Officer",
  CTO: "Chief Technology Officer",
};

export default function About() {
  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      {/* -------------------------------------------------------------------
         Hero section
      -------------------------------------------------------------------- */}
      <section id="about-top" className="relative overflow-hidden scroll-mt-24">
        <div className="relative w-full aspect-[21/9] bg-[color:var(--muted)]/30">
          <img
            src="/images/founders/group.png"
            alt="Group photo of the five co-founders"
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-6xl px-4 pb-8 md:pb-12">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow">
                From Different Paths to One Vision: Empowering Families with
                Digital Innovation
              </h1>
              <p className="mt-3 max-w-3xl text-white/90">
                We are five co-founders from diverse backgrounds who came
                together through Generation Thailand Bootcamp (JSD10) to build a
                digital platform that empowers moms, kids, and families.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------
         V/M/O section (kept as-is)
      -------------------------------------------------------------------- */}
      <section id="vmo" className="mx-auto max-w-6xl px-4 py-12 scroll-mt-24">
        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          <article className="h-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[color:var(--primary)]">
              Vision
            </h2>
            <p className="mt-3 leading-relaxed text-[color:var(--muted-foreground)]">
              To be the leading digital hub that empowers moms, kids, and
              families worldwide with innovative, accessible, and sustainable
              technology solutions.
            </p>
          </article>

          <article className="h-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[color:var(--primary)]">
              Mission
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-[color:var(--muted-foreground)] marker:text-[color:var(--primary)]/70">
              <li>
                Develop an e-commerce platform for moms &amp; kids that
                integrates convenience, safety, and inspiration.
              </li>
              <li>
                Create opportunities for parents to access digital products and
                services that improve their quality of life.
              </li>
              <li>
                Combine our team’s diverse expertise in technology, innovation,
                and creativity to drive sustainable growth.
              </li>
            </ul>
          </article>

          <article className="h-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[color:var(--primary)]">
              Objectives
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-[color:var(--muted-foreground)] marker:text-[color:var(--primary)]/70">
              <li>Build a one-stop digital store for moms &amp; kids.</li>
              <li>
                Expand our user base across Thailand and the Asia-Pacific
                region.
              </li>
              <li>
                Create an ecosystem of digital products such as online courses,
                e-books, and creative content.
              </li>
              <li>
                Promote sustainable practices in both business operations and
                our user community.
              </li>
            </ul>
          </article>
        </div>
      </section>

      {/* -------------------------------------------------------------------
         Our Story (now same width as Co-Founders; names truncate)
      -------------------------------------------------------------------- */}
      <section
        id="ourstory"
        className="bg-[color:var(--muted)]/20 scroll-mt-24"
      >
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h3 className="text-2xl font-semibold">Our Story</h3>
          <p className="mt-4 leading-relaxed text-[color:var(--muted-foreground)]">
            Although we came from very different career paths—civil engineering,
            science and cabin crew, political science, law, and mechanical
            engineering—we discovered a common ground: our deep understanding of
            the needs of modern families. We met at{" "}
            <span className="font-semibold">
              Generation Thailand Bootcamp (JSD10)
            </span>
            , where a shared learning experience became the spark of a bigger
            journey—the foundation of Mom &amp; Kids Digital Store.
          </p>

          {/* Horizontal cards */}
          <div className="mt-8 grid gap-6 md:grid-cols-5 items-stretch">
            {foundersTimeline.map((f, idx) => (
              <figure key={f.id} className="relative">
                <article className="h-full flex flex-col rounded-xl border border-[color:var(--primary)]/25 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] p-4 shadow-sm hover:shadow-md transition">
                  {/* Image */}
                  <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-black/10">
                    <img
                      src={f.image}
                      alt={f.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {/* Name (truncate) + Nickname (next line) */}
                  <h4
                    className="text-sm md:text-base font-semibold truncate block max-w-full"
                    title={f.name}
                  >
                    {f.name}
                  </h4>
                  <p className="text-xs opacity-90">{`(${f.nickname})`}</p>

                  {/* Tagline (optional) */}
                  {f.tagline && (
                    <p className="mt-1 text-xs italic text-[color:var(--primary-foreground)]/80">
                      {f.tagline}
                    </p>
                  )}

                  {/* Passion: allow \n to create line breaks */}
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--primary-foreground)]/90 whitespace-pre-line">
                    {f.passion}
                  </p>

                  <div className="mt-auto" />
                </article>

                {/* Connector line between cards on desktop */}
                {idx < foundersTimeline.length - 1 && (
                  <div
                    aria-hidden
                    className="hidden md:block absolute top-10 right-[-12px] h-0.5 w-6 bg-[color:var(--primary-foreground)]/30"
                  />
                )}
              </figure>
            ))}
          </div>

          <p className="mt-6 text-sm text-[color:var(--muted-foreground)]">
            All paths converge at <span className="font-medium">JSD10</span>.
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------------------
         Co-Founders grid (name left + nickname under it; role pill centered)
      -------------------------------------------------------------------- */}
      <section
        id="cofounders"
        className="mx-auto max-w-6xl px-4 py-12 scroll-mt-24"
      >
        <h3 className="text-2xl font-semibold">Co-Founders</h3>
        <p className="mt-2 text-[color:var(--muted-foreground)]">
          A cross-disciplinary team united by a single mission.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {foundersTimeline.map((f) => {
            // Map short role code (CEO/CMO/...) to full title
            const roleCode = f.role.split(" / ")[0];
            const roleFull = roleMap[roleCode] || roleCode;

            return (
              <article
                key={f.id}
                className={`group flex flex-col h-full rounded-2xl border border-[color:var(--border)]
                      bg-[color:var(--card)] shadow-sm transition
                      hover:shadow-md hover:-translate-y-0.5 ${f.order}`}
              >
                {/* IMAGE with role overlay */}
                {/* IMAGE area with dedicated footer overlay (clean + balanced) */}
                <div className="overflow-hidden rounded-t-2xl bg-[color:var(--muted)]/30">
                  <div className="aspect-[4/5] grid grid-rows-[1fr_auto]">
                    {/* Row 1: Image (auto-resizes because footer takes its own row) */}
                    <img
                      src={f.image}
                      alt={f.alt}
                      className="row-start-1 row-end-2 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 240px"
                    />

                    {/* Row 2: Footer overlay on top of the image area */}
                    <div
                      className="row-start-2 row-end-3 px-3 py-3 text-center
                    bg-gradient-to-t from-black/70 via-black/40 to-transparent
                    backdrop-blur-[1.5px]"
                    >
                      {/* Role pill — single line, centered */}
                      <p
                        className="mx-auto inline-flex items-center justify-center w-fit whitespace-nowrap
                   rounded-full px-4 py-1 text-sm md:text-base font-semibold tracking-wide
                   bg-[color:var(--card)]/95 text-[color:var(--primary)]
                   ring-1 ring-[color:var(--primary)]/25 shadow-sm"
                        aria-label={`Role: ${roleFull}`}
                        title={roleFull}
                      >
                        {f.role}
                      </p>
                      {/* Full title — small, tidy, one line */}
                      <p className="mt-1 text-[10px] md:text-xs text-white/90 whitespace-nowrap">
                        {roleFull}
                      </p>
                    </div>
                  </div>
                </div>

                {/* TEXT under the image (left aligned) */}
                <div className="p-5 flex flex-col grow">
                  {/* Name: single line + truncate. Nickname on next line */}
                  <h4
                    className="text-base md:text-lg font-semibold text-left truncate"
                    title={f.name}
                  >
                    {f.name}
                  </h4>
                  <p className="text-sm text-[color:var(--muted-foreground)] text-left">
                    ({f.nickname})
                  </p>

                  {/* Tagline */}
                  {f.tagline && (
                    <p className="mt-1.5 text-sm italic text-[color:var(--muted-foreground)] text-left">
                      {f.tagline}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------------------------
         Closing CTA
      -------------------------------------------------------------------- */}
      <section className="bg-[color:var(--muted)]/20">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center">
          <blockquote className="text-xl md:text-2xl font-medium">
            “Together, we dream big. Together, we build the future for moms
            &amp; kids.”
          </blockquote>
          <div className="mt-6">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-2xl border border-transparent
                         bg-[color:var(--primary)] px-5 py-3 text-sm font-semibold
                         text-[color:var(--primary-foreground)] shadow-sm hover:opacity-90"
              aria-label="Join Our Journey – Sign up"
            >
              Join Our Journey
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
