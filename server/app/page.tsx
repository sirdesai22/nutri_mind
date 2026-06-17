import {
  IconArrowDownCircle,
  IconBolt,
  IconBrain,
  IconBrandGithub,
  IconChartBar,
  IconChartLine,
  IconCheck,
  IconDeviceMobile,
  IconKey,
  IconMoon,
  IconPencil,
  IconShield,
  IconStar,
  IconWifi,
} from "@tabler/icons-react";
import { FadeUp } from "../components/fade-up";
import { Navbar } from "../components/navbar";

const stats = [
  { label: "meals analyzed", value: "10000+" },
  { label: "AI response time", value: "2 sec" },
  { label: "open source", value: "100%" },
  { label: "subscriptions needed", value: "0" },
];

const howItWorks = [
  {
    step: "01",
    icon: IconPencil,
    title: "Type what you ate",
    description:
      "No barcode scanner. No food database hunting. Just write it like you'd text a friend: \"2 eggs, toast, and black coffee\".",
  },
  {
    step: "02",
    icon: IconBrain,
    title: "AI does the math",
    description:
      "Gemini 2.5 Flash analyzes your meal against USDA nutritional data and returns calories, carbs, protein, and fats in under 2 seconds.",
  },
  {
    step: "03",
    icon: IconChartBar,
    title: "See your progress",
    description:
      "Weekly calorie trends, macro breakdowns, meal history grouped by time of day. Everything you need, nothing you don't.",
  },
];

const features = [
  {
    icon: IconBolt,
    title: "Instant AI Analysis",
    description:
      "Gemini 1.5 Flash returns nutrition data in under 2 seconds.",
  },
  {
    icon: IconKey,
    title: "Bring Your Own Key",
    description:
      "Use your own Gemini API key and analyze meals completely free.",
  },
  {
    icon: IconChartLine,
    title: "Weekly Trends",
    description:
      "Visual calorie and macro patterns across your week.",
  },
  {
    icon: IconMoon,
    title: "Dark & Light Mode",
    description:
      "Designed for both. Perfected for dark.",
  },
  {
    icon: IconWifi,
    title: "Offline First",
    description:
      "Logs meals without internet. Syncs automatically when connected.",
  },
  {
    icon: IconShield,
    title: "Private by Default",
    description:
      "Your meals never leave your device unless you want them to.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0D1210] text-[#EFF5F0]">
      <Navbar />

      <main className="relative mx-auto max-w-[1200px] px-6 pt-28 md:px-20">
        {/* Background orbs + noise */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute right-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(ellipse_60%_60%_at_80%_10%,rgba(168,255,107,0.07)_0%,transparent_70%)]" />
          <div className="absolute bottom-[-10%] left-[-10%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(ellipse_40%_40%_at_10%_90%,rgba(168,255,107,0.04)_0%,transparent_70%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.03]" aria-hidden>
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <filter id="noiseFilter">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.8"
                  numOctaves="4"
                  stitchTiles="noStitch"
                />
              </filter>
              <rect
                width="100%"
                height="100%"
                filter="url(#noiseFilter)"
              />
            </svg>
          </div>
        </div>

        {/* HERO */}
        <section
          id="hero"
          className="relative flex min-h-[90vh] flex-col items-center gap-12 pb-24 pt-10 md:flex-row md:items-center md:gap-16 lg:min-h-screen"
        >
          <div className="relative z-10 w-full md:w-[55%]">
            <FadeUp delay={0}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(168,255,107,0.18)] bg-[#1C2620]/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A8FF6B]">
                <IconBrandGithub size={14} />
                Open Source ✦ Powered by Gemini AI ✦ No barcode scanning
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h1 className="mt-6 font-[var(--font-syne)] text-[44px] leading-[1.05] tracking-tight text-[#EFF5F0] sm:text-[54px] lg:text-[72px]">
                <span className="block">Eat anything.</span>
                <span className="block">
                  Know{" "}
                  <span className="text-[#A8FF6B]">
                    everything.
                  </span>
                </span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="mt-6 max-w-xl text-[16px] leading-[1.7] text-[#A8B8A8] sm:text-[18px]">
                Just tell NutriMind what you ate. Our AI instantly breaks down
                calories, protein, carbs, and fats — no searching, no scanning.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#A8FF6B] px-7 py-3.5 text-[15px] font-bold text-[#0D1210] transition-transform duration-200 hover:scale-[1.02] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8FF6B]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1210]"
                >
                  <IconArrowDownCircle size={20} />
                  Get Early Access
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-2xl border border-[rgba(168,255,107,0.18)] px-7 py-3.5 text-[15px] font-semibold text-[#A8FF6B] transition-colors duration-200 hover:bg-[#1C2620] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8FF6B]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1210]"
                >
                  See how it works
                </a>
              </div>
            </FadeUp>

            <FadeUp delay={0.4}>
              <div className="mt-6 space-y-3 text-[13px] text-[#566356]">
                <p className="font-medium">
                  Available on iOS &amp; Android
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1 rounded-full bg-[#1C2620] px-3 py-1 text-[12px] text-[#A8B8A8]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#A8FF6B]" />
                    <span>iOS</span>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-[#1C2620] px-3 py-1 text-[12px] text-[#A8B8A8]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#A8FF6B]" />
                    <span>Android</span>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* App screenshot */}
          {/* <FadeUp delay={0.3}>
            <div className="relative hidden w-full items-center justify-center md:flex md:w-[45%]">
              <div className="absolute inset-auto h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,255,107,0.08)_0%,transparent_70%)] blur-3xl" />
              <img
                src="/logo.png"
                alt="NutriMind"
                className="relative z-10 w-[260px] rounded-[56px] shadow-[0_30px_80px_rgba(0,0,0,0.75)] md:w-[300px] lg:w-[340px]"
              />
            </div>
          </FadeUp> */}
        </section>

        {/* SOCIAL PROOF */}
        <section
          aria-label="Social proof"
          className="mt-4 rounded-3xl border border-[rgba(168,255,107,0.08)] bg-[#131A17] py-6"
        >
          <div className="grid grid-cols-2 gap-6 md:flex md:items-center md:justify-between md:divide-x md:divide-[rgba(168,255,107,0.12)]">
            {stats.map((stat, idx) => (
              <FadeUp key={stat.label} delay={0.05 * idx}>
                <div className="flex flex-1 flex-col items-center px-6 text-center md:items-start md:text-left">
                  <div className="font-[var(--font-syne)] text-[24px] text-[#A8FF6B] md:text-[28px]">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[13px] text-[#566356]">
                    {stat.label}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="space-y-10 py-24 md:py-32"
        >
          <FadeUp>
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#566356]">
              HOW IT WORKS
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-[var(--font-syne)] text-[32px] leading-[1.1] text-[#EFF5F0] md:text-[40px] lg:text-[48px]">
              Three steps to knowing exactly what you ate.
            </h2>
          </FadeUp>

          <div className="relative mt-6 grid gap-6 md:mt-10 md:grid-cols-3">
            {/* connecting line */}
            <div className="pointer-events-none absolute inset-y-1/2 left-[16.666%] right-[16.666%] hidden -translate-y-1/2 items-center justify-between md:flex">
              <div className="h-px w-full border-t border-dashed border-[#A8FF6B]/30" />
            </div>

            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <FadeUp key={item.step} delay={0.1 * index}>
                  <article className="relative overflow-hidden rounded-2xl border border-[rgba(168,255,107,0.08)] bg-[#1C2620]/60 p-7 backdrop-blur-sm">
                    <div className="pointer-events-none absolute -left-1 -top-6 font-[var(--font-syne)] text-[64px] font-bold text-[#A8FF6B]/20">
                      {item.step}
                    </div>
                    <div className="relative space-y-3">
                      <Icon
                        size={28}
                        className="text-[#A8FF6B]"
                      />
                      <h3 className="font-[var(--font-syne)] text-[20px] text-[#EFF5F0]">
                        {item.title}
                      </h3>
                      <p className="text-[14px] leading-[1.7] text-[#A8B8A8]">
                        {item.description}
                      </p>
                    </div>
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          className="space-y-8 rounded-[32px] bg-[#131A17] px-4 py-24 md:px-8 md:py-32"
        >
          <FadeUp>
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#566356]">
              FEATURES
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-[var(--font-syne)] text-[30px] leading-[1.15] text-[#EFF5F0] md:text-[38px] lg:text-[44px]">
              Everything you need. Nothing you don&apos;t.
            </h2>
          </FadeUp>

          <div className="mt-6 grid gap-4 md:mt-10 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <FadeUp key={feature.title} delay={0.08 * index}>
                  <article className="group h-full rounded-2xl border border-[rgba(168,255,107,0.08)] bg-[#1C2620]/70 p-6 transition-transform transition-colors duration-200 hover:-translate-y-[2px] hover:border-[rgba(168,255,107,0.18)]">
                    <Icon
                      size={24}
                      className="text-[#A8FF6B]"
                    />
                    <h3 className="mt-4 font-[var(--font-syne)] text-[18px] text-[#EFF5F0]">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.6] text-[#A8B8A8]">
                      {feature.description}
                    </p>
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </section>

        {/* DEMO / SCREENSHOT STRIP */}
        <section className="overflow-hidden py-24 md:py-32">
          <FadeUp>
            <h2 className="text-center font-[var(--font-syne)] text-[32px] leading-[1.15] text-[#EFF5F0] md:text-[40px] lg:text-[48px]">
              See it in action.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="mt-3 text-center text-[15px] text-[#A8B8A8] md:text-[16px]">
              Everything is designed to get out of your way.
            </p>
          </FadeUp>

          <div className="relative mt-10 flex flex-col items-center justify-center md:mt-16">
            <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-80 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(168,255,107,0.08)_0%,transparent_70%)] blur-3xl" />

            <div className="relative flex w-full max-w-[860px] items-end justify-center gap-0">
              {/* Left — Chat UI */}
              <FadeUp delay={0.1}>
                <img
                  src="/playstore/chatUI.png"
                  alt="Chat interface"
                  className="relative z-10 w-[220px] translate-y-6 -rotate-6 rounded-[28px] shadow-[0_24px_60px_rgba(0,0,0,0.7)] md:w-[240px]"
                />
              </FadeUp>

              {/* Center — Macros page */}
              <FadeUp delay={0.2}>
                <img
                  src="/playstore/macros_page.png"
                  alt="Macros breakdown"
                  className="relative z-20 w-[240px] scale-[1.04] rounded-[28px] shadow-[0_32px_80px_rgba(0,0,0,0.85)] md:w-[270px]"
                />
              </FadeUp>

              {/* Right — Progress */}
              <FadeUp delay={0.3}>
                <img
                  src="/playstore/progress_ui.png"
                  alt="Progress screen"
                  className="relative z-10 w-[220px] translate-y-6 rotate-6 rounded-[28px] shadow-[0_24px_60px_rgba(0,0,0,0.7)] md:w-[240px]"
                />
              </FadeUp>
            </div>
          </div>
        </section>

        {/* OPEN SOURCE */}
        <section className="rounded-[32px] bg-[#131A17] px-4 py-24 md:px-8 md:py-32">
          <FadeUp>
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#566356]">
              OPEN SOURCE
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-[var(--font-syne)] text-[30px] leading-[1.15] text-[#EFF5F0] md:text-[38px] lg:text-[44px]">
              Self-host or contribute.
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="mt-3 max-w-2xl text-[15px] leading-[1.7] text-[#A8B8A8] md:text-[16px]">
              NutriMind is fully open source. Use it as a SaaS starter, fork it
              for your own product, or contribute back. Everything is managed —
              database, auth, AI, analytics — all wired up and ready to scale.
            </p>
          </FadeUp>

          <FadeUp delay={0.25}>
            <a
              href="https://github.com/sirdesai22/nutri_mind"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-[rgba(168,255,107,0.18)] bg-[#1C2620]/80 px-6 py-3.5 text-[15px] font-semibold text-[#A8FF6B] transition-all duration-200 hover:bg-[#1C2620] hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8FF6B]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#131A17]"
            >
              <IconBrandGithub size={20} />
              Star on GitHub
              <span className="inline-flex items-center gap-1 rounded-full bg-[#A8FF6B]/10 px-2.5 py-0.5 text-[12px] text-[#A8FF6B]">
                <IconStar size={12} />
                sirdesai22/nutri_mind
              </span>
            </a>
          </FadeUp>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "MIT Licensed",
                desc: "Use it anywhere — personal, commercial, or as a template for your SaaS.",
              },
              {
                title: "Self-Hostable",
                desc: "Bring your own Gemini key, Supabase instance, and everything runs on your infra.",
              },
              {
                title: "AI-First Stack",
                desc: "Expo + Next.js + Supabase + Gemini. Modern, fast, and easy to extend.",
              },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={0.1 * i}>
                <div className="h-full rounded-2xl border border-[rgba(168,255,107,0.08)] bg-[#1C2620]/70 p-6">
                  <h3 className="font-[var(--font-syne)] text-[18px] text-[#EFF5F0]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.6] text-[#A8B8A8]">
                    {item.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section
          id="pricing"
          className="space-y-8 rounded-[32px] bg-[#131A17] px-4 py-24 md:px-8 md:py-32 mt-5"
        >
          <FadeUp>
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#566356]">
              PRICING
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-[var(--font-syne)] text-[30px] leading-[1.15] text-[#EFF5F0] md:text-[38px] lg:text-[44px]">
              One price. Yours forever.
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-[15px] text-[#A8B8A8]">
              No subscription. No renewal. No catch.
            </p>
          </FadeUp>

          <FadeUp delay={0.25}>
            <div className="mx-auto mt-8 max-w-[440px] rounded-3xl border border-[rgba(168,255,107,0.18)] bg-[#1C2620]/80 p-8 shadow-[0_0_60px_rgba(168,255,107,0.06)] md:p-10">
              <div className="inline-flex rounded-full bg-[#A8FF6B] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0D1210]">
                Most Popular
              </div>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-[var(--font-syne)] text-[64px] leading-none text-[#A8FF6B] md:text-[80px]">
                  $9
                </span>
              </div>
              <p className="mt-2 text-[16px] text-[#566356]">
                one-time payment
              </p>

              <div className="my-8 h-px bg-[rgba(168,255,107,0.18)]" />

              <ul className="space-y-3 text-[15px]">
                {[
                  "Unlimited AI food analysis",
                  "Full progress tracking & history",
                  "Dark and light mode",
                  "All future updates included",
                  "Priority support",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-[#EFF5F0]"
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#A8FF6B]">
                      <IconCheck
                        size={14}
                        className="text-[#0D1210]"
                      />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled
                className="mt-8 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-[#1C2620] border border-[rgba(168,255,107,0.18)] px-6 py-3.5 text-[16px] font-bold text-[#A8FF6B]/60"
              >
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#A8FF6B]/60" />
                Coming Soon
              </button>

              <p className="mt-3 text-center text-[13px] text-[#566356]">
                Payments launching shortly — stay tuned
              </p>
            </div>
          </FadeUp>
        </section>

        {/* FINAL CTA */}
        <section className="relative py-24 md:py-32">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[420px] -translate-y-1/2 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(168,255,107,0.08)_0%,transparent_70%)]" />
          <div className="mx-auto max-w-3xl text-center">
            <FadeUp>
              <h2 className="font-[var(--font-syne)] text-[34px] leading-[1.12] text-[#EFF5F0] md:text-[44px] lg:text-[56px]">
                Start knowing what you eat.
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="mt-4 text-[16px] leading-[1.7] text-[#A8B8A8] md:text-[18px]">
                Join thousands of people who ditched the barcode scanner.
              </p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#A8FF6B] px-7 py-3.5 text-[15px] font-bold text-[#0D1210] transition-transform duration-200 hover:scale-[1.02] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8FF6B]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1210]"
                >
                  <IconDeviceMobile size={20} />
                  Get Early Access
                </a>
                <a
                  href="https://github.com/sirdesai22/nutri_mind"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-[rgba(168,255,107,0.18)] px-7 py-3.5 text-[15px] font-semibold text-[#A8FF6B] transition-colors duration-200 hover:bg-[#1C2620] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8FF6B]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1210]"
                >
                  <IconBrandGithub size={20} />
                  Star on GitHub
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-2xl border border-[rgba(168,255,107,0.18)] px-7 py-3.5 text-[15px] font-semibold text-[#A8FF6B] transition-colors duration-200 hover:bg-[#1C2620] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8FF6B]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1210]"
                >
                  See how it works
                </a>
              </div>
            </FadeUp>

            <FadeUp delay={0.3}>
              <p className="mt-4 text-[13px] text-[#566356]">
                Open source on GitHub — self-host or contribute
              </p>
            </FadeUp>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[rgba(168,255,107,0.08)] bg-[#131A17] py-10 text-[#566356]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 md:px-20">
          <div className="flex flex-col items-center justify-between gap-4 text-[13px] md:flex-row">
            <div className="flex items-center gap-2 text-[18px] font-semibold">
              <img src="/logo.png" alt="NutriMind" className="h-7 w-7 rounded-[6px]" />
              <span className="font-[var(--font-syne)] text-[#EFF5F0]">Nutri</span>
              <span className="font-[var(--font-syne)] text-[#A8FF6B]">Mind</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-6 text-[13px]">
              <a href="#features" className="hover:text-[#EFF5F0]">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-[#EFF5F0]">
                How It Works
              </a>
              <a href="#pricing" className="hover:text-[#EFF5F0]">
                Pricing
              </a>
              <a
                href="https://github.com/sirdesai22/nutri_mind"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-[#EFF5F0]"
              >
                <IconBrandGithub size={14} />
                GitHub
              </a>
            </nav>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(168,255,107,0.18)] bg-[#1C2620] px-3 py-1 text-[11px] text-[#A8B8A8]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A8FF6B]" />
              <span>Built with Gemini AI</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 text-[12px] md:flex-row">
            <p>© 2026 NutriMind. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#" className="hover:text-[#EFF5F0]">
                Privacy
              </a>
              <span>·</span>
              <a href="#" className="hover:text-[#EFF5F0]">
                Terms
              </a>
              <span>·</span>
              <a href="#" className="hover:text-[#EFF5F0]">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

