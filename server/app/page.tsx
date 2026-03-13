import {
  IconArrowDownCircle,
  IconBolt,
  IconBrain,
  IconChartBar,
  IconChartLine,
  IconCheck,
  IconDeviceMobile,
  IconKey,
  IconMoon,
  IconPencil,
  IconShield,
  IconWifi,
} from "@tabler/icons-react";
import { FadeUp } from "../components/fade-up";
import { Navbar } from "../components/navbar";

const stats = [
  { label: "meals analyzed", value: "10000+" },
  { label: "AI response time", value: "2 sec" },
  { label: "one-time, forever", value: "$9" },
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
                Powered by Gemini AI ✦ No barcode scanning ✦ No meal plans
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
          <FadeUp delay={0.3}>
            <div className="relative hidden w-full items-center justify-center md:flex md:w-[45%]">
              <div className="absolute inset-auto h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,255,107,0.08)_0%,transparent_70%)] blur-3xl" />
              <div className="relative">
                {/* Replace src with your app screenshot */}
                <img
                  src="/app-screenshot.png"
                  alt="NutriMind app screenshot"
                  className="relative z-10 w-[300px] rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.75)]"
                />
              </div>
            </div>
          </FadeUp>
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

            <FadeUp delay={0.1}>
              {/* Replace src with your app demo screenshot */}
              <img
                src="/app-demo.png"
                alt="NutriMind app in action"
                className="relative z-10 w-full max-w-[880px] rounded-[24px] border border-[rgba(168,255,107,0.10)] shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
              />
            </FadeUp>
          </div>
        </section>

        {/* PRICING */}
        <section
          id="pricing"
          className="space-y-8 rounded-[32px] bg-[#131A17] px-4 py-24 md:px-8 md:py-32"
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
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-2xl border border-[rgba(168,255,107,0.18)] px-7 py-3.5 text-[15px] font-semibold text-[#A8FF6B] transition-colors duration-200 hover:bg-[#1C2620] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8FF6B]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1210]"
                >
                  See how it works
                </a>
              </div>
            </FadeUp>

            <FadeUp delay={0.3}>
              <p className="mt-4 text-[13px] text-[#566356]">
                No account required with BYOK
              </p>
            </FadeUp>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[rgba(168,255,107,0.08)] bg-[#131A17] py-10 text-[#566356]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 md:px-20">
          <div className="flex flex-col items-center justify-between gap-4 text-[13px] md:flex-row">
            <div className="flex items-center gap-1 text-[18px] font-semibold">
              <span className="font-[var(--font-syne)] text-[#EFF5F0]">
                Nutri
              </span>
              <span className="font-[var(--font-syne)] text-[#A8FF6B]">
                Mind
              </span>
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



function TrackerPhone() {
  return (
    <PhoneFrame>
      <header className="mb-4 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[12px] uppercase tracking-[0.2em] text-[#566356]">
            Tracker
          </p>
          <p className="font-[var(--font-syne)] text-[16px] text-[#EFF5F0]">
            Today
          </p>
        </div>
        <span className="rounded-full bg-[#1C2620] px-3 py-1 text-[11px] text-[#A8B8A8]">
          27 Mar
        </span>
      </header>

      <div className="rounded-2xl bg-[#131A17] p-4">
        <p className="text-[12px] text-[#566356]">Total calories</p>
        <p className="mt-1 font-[var(--font-syne)] text-[40px] leading-none text-[#EFF5F0]">
          1840
        </p>
        <p className="mt-1 text-[12px] text-[#566356]">kcal of 2100 goal</p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#1C2620]">
          <div className="h-full w-[80%] rounded-full bg-[#A8FF6B]" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-[10px]">
        <MacroPill label="Carbs" value="220g" />
        <MacroPill label="Protein" value="148g" />
        <MacroPill label="Fats" value="52g" />
      </div>

      <div className="mt-4 space-y-2 text-[12px]">
        <MealRow name="Chicken rice bowl" calories="520 kcal" />
        <MealRow name="Protein shake" calories="240 kcal" />
        <MealRow name="Avocado toast" calories="310 kcal" />
      </div>

      <div className="mt-auto flex items-center gap-2 pt-4">
        <div className="flex-1 rounded-full bg-[#131A17] px-4 py-2 text-[11px] text-[#566356]">
          what did you eat?
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A8FF6B]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0D1210]" />
        </div>
      </div>
    </PhoneFrame>
  );
}

function ProgressPhone() {
  return (
    <PhoneFrame>
      <header className="mb-4 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[12px] uppercase tracking-[0.2em] text-[#566356]">
            Progress
          </p>
          <p className="font-[var(--font-syne)] text-[16px] text-[#EFF5F0]">
            This week
          </p>
        </div>
        <span className="rounded-full bg-[#1C2620] px-3 py-1 text-[11px] text-[#A8B8A8]">
          Today
        </span>
      </header>

      <div className="rounded-2xl bg-[#131A17] p-4">
        <p className="text-[12px] text-[#566356]">Calories</p>
        <div className="mt-3 flex items-end justify-between gap-1">
          {[60, 48, 52, 40, 56, 44, 80].map((h, idx) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              className="flex-1 rounded-full bg-[#1C2620]"
            >
              <div
                className={`mx-auto w-[60%] rounded-full ${
                  idx === 6 ? "bg-[#A8FF6B]" : "bg-[#3B4A3D]"
                }`}
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-[#566356]">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
        <StatCard label="Today" value="1840 kcal" />
        <StatCard label="Carbs" value="220 g" />
        <StatCard label="Protein" value="148 g" />
        <StatCard label="Fats" value="52 g" />
      </div>
    </PhoneFrame>
  );
}

function OnboardingPhone() {
  return (
    <PhoneFrame>
      <div className="flex h-full flex-col justify-between">
        <div className="mt-6 space-y-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#566356]">
            Welcome to NutriMind
          </p>
          <h3 className="font-[var(--font-syne)] text-[24px] leading-[1.2] text-[#EFF5F0]">
            Eat freely. Know exactly.
          </h3>
          <ul className="mt-3 space-y-2 text-[12px] text-[#A8B8A8]">
            <li>• Just type what you ate — no scanning.</li>
            <li>• AI turns meals into calories &amp; macros.</li>
            <li>• Private, offline-first, and yours forever.</li>
          </ul>
        </div>

        <button
          type="button"
          className="mb-4 mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#A8FF6B] px-4 py-2.5 text-[14px] font-semibold text-[#0D1210]"
        >
          Get Started
        </button>
      </div>
    </PhoneFrame>
  );
}

function MacroPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full bg-[#131A17] px-3 py-2">
      <p className="text-[10px] text-[#566356]">{label}</p>
      <p className="text-[11px] text-[#EFF5F0]">{value}</p>
    </div>
  );
}

function MealRow({ name, calories }: { name: string; calories: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#131A17] px-3 py-2">
      <p className="max-w-[60%] truncate text-[#EFF5F0]">{name}</p>
      <p className="text-[11px] text-[#566356]">{calories}</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#131A17] px-3 py-3">
      <p className="text-[11px] text-[#566356]">{label}</p>
      <p className="mt-1 text-[13px] text-[#EFF5F0]">{value}</p>
    </div>
  );
}

