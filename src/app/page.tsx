import Link from "next/link";
import LandingNav from "@/components/landing/LandingNav";

// ── Design tokens ─────────────────────────────────────────────────────────────
const INK = "#1c1a17";
const PAPER = "#fcfbf9";
const ACCENT = "#9a6a3a";
const MUTED = "#78716c";
const SURFACE = "#ece8df";
const SUBTLE = "#f1ede5";

// ── Data ──────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    n: "01",
    title: "შექმენი ანგარიში",
    desc: "დარეგისტრირდი ელ. ფოსტით წუთებში. დაყენება და ინსტალაცია არ სჭირდება.",
  },
  {
    n: "02",
    title: "მოარგე შენი მაღაზია",
    desc: "აირჩიე თემა და დაამატე შენი ლოგო, ფერები და პროდუქტები — ერთ ადგილას.",
  },
  {
    n: "03",
    title: "დაიწყე გაყიდვა",
    desc: "გამოაქვეყნე მაღაზია და მიიღე შეკვეთები. გადახდა — მიწოდებისას.",
  },
];

const FEATURES = [
  {
    title: "გვერდის რედაქტორი",
    desc: "მოაწყე მთავარი გვერდი drag & drop-ით, კოდის გარეშე.",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
  },
  {
    title: "შეკვეთების მართვა",
    desc: "მართე შეკვეთები, პროდუქტები და კატეგორიები ერთი პანელიდან.",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
  },
  {
    title: "მიწოდების ზონები",
    desc: "განსაზღვრე მიწოდების ფასი თბილისსა და სხვა რეგიონების მიხედვით.",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    title: "პროფესიონალური თემები",
    desc: "აირჩიე დიზაინი, რომელიც შენს ბრენდს უხდება. ახალი თემები რეგულარულად.",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
      </svg>
    ),
  },
  {
    title: "საკუთარი დომენი",
    desc: "დაუკავშირე შენი დომენი — ბრენდი გამოიყურება პროფესიონალურად.",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    title: "გადახდა მიწოდებისას",
    desc: "ავტომატური COD სისტემა. საბანკო ტერმინალი ან ინტეგრაცია არ გჭირდება.",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
];

const FREE_FEATURES = [
  "10 პროდუქტამდე",
  "ბაზისური თემა",
  "შეკვეთების მართვა",
  "COD გადახდა",
  "მიწოდების ზონები",
];

const PRO_FEATURES = [
  "ულიმიტო პროდუქტი",
  "ყველა პროფესიონალური თემა",
  "გვერდის სრული რედაქტორი",
  "საკუთარი დომენი",
  "პრიორიტეტული მხარდაჭერა",
];

const TESTIMONIALS = [
  {
    name: "ნინო ბერიძე",
    shop: "Nino Studio",
    text: "MultiStore-მა ჩემი ხელნაკეთი ნაწარმი ოფლაინიდან ონლაინ გადაიყვანა. ახლა თბილისიდანაც ვიღებ შეკვეთებს.",
    product: "სელის კაბა",
    price: "₾240",
  },
  {
    name: "გიორგი მაისურაძე",
    shop: "Leather Works",
    text: "10 წუთში გავუშვი მაღაზია. პირველი შეკვეთა იმავე დღეს მივიღე. ძალიან მარტივი პლატფორმაა.",
    product: "ტყავის ჩანთა",
    price: "₾320",
  },
  {
    name: "თამარ ქავთარაძე",
    shop: "TK Atelier",
    text: "თემები მაოცებს — ჩემი ბრენდი ახლა ნამდვილ მაღაზიას ჰგავს. მომხმარებლები გაოცებული არიან.",
    product: "შალის ჟაკეტი",
    price: "₾180",
  },
];

// ── Storefront mockup ─────────────────────────────────────────────────────────
function StorefrontMockup() {
  return (
    <div
      className="w-full max-w-sm mx-auto rounded-xl overflow-hidden shadow-2xl"
      style={{ background: "#fff", border: "1px solid #e5e7eb" }}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ background: "#f3f4f6", borderBottom: "1px solid #e5e7eb" }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "#fc5f57" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#fdbc2e" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#34c749" }} />
        </div>
        <div
          className="flex-1 h-5 rounded text-[10px] flex items-center justify-center"
          style={{ background: "#e5e7eb", color: "#6b7280" }}
        >
          multistore.ge/shop/anano-atelier
        </div>
      </div>

      {/* Storefront preview — Maison style */}
      <div style={{ background: "#fbf7f0" }}>
        {/* Announcement bar */}
        <div
          className="text-center text-[9px] py-1.5 tracking-widest"
          style={{ background: "#1f1b16", color: "#c9b99a" }}
        >
          უფასო მიწოდება ₾200-დან · თბილისი
        </div>

        {/* Navbar */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid #e0d8c8" }}
        >
          <div className="flex gap-3">
            {["ახალი", "კატეგორიები", "ყველა"].map((item) => (
              <div key={item} className="text-[8px]" style={{ color: "#6b5b45" }}>
                {item}
              </div>
            ))}
          </div>
          <div className="font-display text-sm font-semibold tracking-wider" style={{ color: "#1f1b16" }}>
            ANANO
          </div>
          <div className="flex gap-3">
            <div className="text-[8px]" style={{ color: "#6b5b45" }}>ძიება</div>
            <div className="text-[8px]" style={{ color: "#6b5b45" }}>კალათა · 2</div>
          </div>
        </div>

        {/* Hero banner */}
        <div
          className="relative flex items-end px-5 pb-5"
          style={{ background: "#e8e0d2", minHeight: "100px" }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(31,27,22,.55), transparent)" }}
          />
          <div className="relative z-10">
            <div className="text-[8px] mb-1 tracking-widest uppercase" style={{ color: "#c9b99a" }}>
              ახალი კოლექცია
            </div>
            <div className="font-display text-base font-semibold leading-tight" style={{ color: "#fbf7f0" }}>
              ზაფხული
              <br />
              2026
            </div>
            <div
              className="inline-block mt-2 text-[8px] px-3 py-1 tracking-wider"
              style={{ background: "#9a6a3a", color: "#fbf7f0" }}
            >
              ნახე კოლექცია
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="p-4">
          <div
            className="text-[9px] text-center tracking-widest uppercase mb-3"
            style={{ color: "#6b5b45" }}
          >
            პოპულარული
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: "სელის კაბა", price: "₾240" },
              { name: "ტყავის ჩანთა", price: "₾320" },
              { name: "შალის ჟაკეტი", price: "₾180" },
            ].map((p) => (
              <div key={p.name}>
                <div
                  className="w-full rounded-sm"
                  style={{ background: "#f3ece0", aspectRatio: "3/4" }}
                />
                <div className="mt-1.5">
                  <div className="text-[8px] truncate" style={{ color: "#1f1b16" }}>
                    {p.name}
                  </div>
                  <div className="text-[8px]" style={{ color: "#9a6a3a" }}>
                    {p.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Theme previews ────────────────────────────────────────────────────────────
function MaisonPreview() {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: "#fbf7f0" }}>
      <div className="w-full h-[8px]" style={{ background: "#1f1b16" }} />
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid #e0d8c8" }}>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-px w-4" style={{ background: "#8c7a65" }} />)}
        </div>
        <div className="font-display text-xs font-semibold" style={{ color: "#1f1b16" }}>ANANO</div>
        <div className="h-px w-8" style={{ background: "#c0a882" }} />
      </div>
      <div className="flex items-end p-3" style={{ background: "#e8e0d2", minHeight: "56px" }}>
        <div>
          <div className="h-1.5 w-10 mb-1" style={{ background: "#c0a882" }} />
          <div className="h-3 w-20 font-display" style={{ background: "#1f1b16" }} />
        </div>
      </div>
      <div className="p-3">
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ background: "#f3ece0", aspectRatio: "3/4" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function EcruPreview() {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: "#EFE8DA" }}>
      <div className="w-full h-[8px]" style={{ background: "#D8432B" }} />
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid #D7CDB9" }}>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-px w-4" style={{ background: "#1B1714" }} />)}
        </div>
        <div className="font-display text-xs font-semibold tracking-widest" style={{ color: "#1B1714" }}>NOIR</div>
        <div className="h-px w-8" style={{ background: "#D7CDB9" }} />
      </div>
      <div className="flex items-end p-3" style={{ background: "#C8BDA8", minHeight: "56px" }}>
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(20,17,14,.6), transparent)" }}
        />
        <div className="relative">
          <div className="h-px w-8 mb-1" style={{ background: "#D8432B" }} />
          <div className="h-3 w-20" style={{ background: "#EFE8DA" }} />
        </div>
      </div>
      <div className="p-3">
        <div className="grid grid-cols-4 gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ background: "#F6F1E7", aspectRatio: "4/5" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DewPreview() {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: "#F4ECE6" }}>
      <div className="w-full h-[8px]" style={{ background: "#6C63E8" }} />
      <div
        className="flex items-center px-3 py-2"
        style={{ borderBottom: "1px solid #E7DBD2", display: "grid", gridTemplateColumns: "1fr auto 1fr" }}
      >
        <div className="flex gap-1.5">
          {[14, 10, 16].map((w, i) => (
            <div key={i} style={{ height: "5px", width: w, background: "#2C2530", borderRadius: "2px" }} />
          ))}
        </div>
        <div style={{ height: "7px", width: "22px", background: "#2C2530", borderRadius: "2px" }} />
        <div className="flex items-center gap-1.5 justify-end">
          <div style={{ height: "11px", width: "20px", background: "#6C63E8", borderRadius: "999px" }} />
        </div>
      </div>
      <div
        className="flex items-center p-3"
        style={{
          background: "radial-gradient(ellipse 130% 120% at 80% 60%, #D9D2F2, #E7DCEF 40%, #F4ECE6)",
          minHeight: "48px",
        }}
      >
        <div className="flex flex-col gap-1">
          <div style={{ height: "4px", width: "24px", background: "#6C63E8", borderRadius: "2px" }} />
          <div style={{ height: "8px", width: "48px", background: "#2C2530", borderRadius: "2px" }} />
          <div style={{ height: "11px", width: "28px", background: "#6C63E8", borderRadius: "999px", marginTop: "2px" }} />
        </div>
      </div>
      <div className="p-3">
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ background: "#FCF8F3", aspectRatio: "1/1", borderRadius: "6px" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ background: PAPER, color: INK, fontFamily: "inherit" }}>
      <LandingNav />

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div
            className="inline-block text-xs font-medium px-3 py-1.5 mb-6 tracking-wide"
            style={{ background: SUBTLE, color: ACCENT }}
          >
            ონლაინ მაღაზია — კოდის გარეშე
          </div>
          <h1
            className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight mb-6"
            style={{ color: INK }}
          >
            შენი ონლაინ
            <br />
            მაღაზია —
            <br />
            <span style={{ color: ACCENT }}>10 წუთში</span>
          </h1>
          <p className="text-base md:text-lg mb-8 leading-relaxed max-w-md" style={{ color: MUTED }}>
            შექმენი ლამაზი ონლაინ მაღაზია კოდის გარეშე. აირჩიე თემა, დაამატე
            პროდუქტები და დაიწყე გაყიდვა დღესვე.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Link
              href="/register"
              className="px-6 py-3 text-sm font-medium text-center"
              style={{ background: INK, color: PAPER }}
            >
              დაიწყე უფასოდ
            </Link>
            <a
              href="#how"
              className="px-6 py-3 text-sm font-medium text-center border"
              style={{ borderColor: SURFACE, color: INK }}
            >
              როგორ მუშაობს →
            </a>
          </div>
          <p className="text-xs" style={{ color: "#a8a29e" }}>
            უფასო ვერსია სამუდამოდ · საკრედიტო ბარათი არ არის საჭირო
          </p>
        </div>

        <div className="hidden md:block">
          <StorefrontMockup />
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" style={{ background: SUBTLE }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: ACCENT }}>
              პროცესი
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: INK }}>
              სამი ნაბიჯი მაღაზიის გასაშვებად
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.n} className="flex flex-col gap-4">
                <div
                  className="font-display text-4xl font-semibold"
                  style={{ color: SURFACE }}
                >
                  {step.n}
                </div>
                <div
                  className="w-10 h-px"
                  style={{ background: ACCENT }}
                />
                <h3 className="text-lg font-semibold" style={{ color: INK }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: ACCENT }}>
              ფუნქციები
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4" style={{ color: INK }}>
              ყველაფერი, რაც გჭირდება გასაყიდად
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: MUTED }}>
              პროფესიონალური ხელსაწყოები მცირე ბიზნესისთვის — ერთ პლატფორმაზე
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-sm"
                style={{ background: SUBTLE }}
              >
                <div className="mb-4" style={{ color: ACCENT }}>
                  {f.icon}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: INK }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Themes ── */}
      <section style={{ background: SUBTLE }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: ACCENT }}>
              თემები
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4" style={{ color: INK }}>
              მოარგე შენი სტილი
            </h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: MUTED }}>
              პროფესიონალური თემები ყველა სახის ბიზნესისთვის. ახალი დიზაინები
              რეგულარულად ემატება.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { id: "maison", label: "Maison", sub: "თბილი · სერიფი · ელეგანტური", Preview: MaisonPreview },
              { id: "ecru", label: "Écru", sub: "ედიტორიალი · კონტრასტი · მოდა", Preview: EcruPreview },
              { id: "dew", label: "Dew", sub: "სილამაზე · პასტელი · მოდერნი", Preview: DewPreview },
            ].map(({ id, label, sub, Preview }) => (
              <div key={id} className="rounded-sm overflow-hidden" style={{ border: `1px solid ${SURFACE}` }}>
                <div className="aspect-video overflow-hidden relative">
                  <Preview />
                </div>
                <div className="px-4 py-3" style={{ background: PAPER }}>
                  <p className="text-sm font-semibold" style={{ color: INK }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: MUTED }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm mt-8" style={{ color: MUTED }}>
            + კიდევ 5 თემა — Minimal, Solo, Market, Forma, Roaster
          </p>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: ACCENT }}>
              ფასები
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4" style={{ color: INK }}>
              მარტივი, გამჭვირვალე ფასი
            </h2>
            <p className="text-base" style={{ color: MUTED }}>
              დაიწყე უფასოდ. გადახვიდე Pro-ზე, როდესაც ბიზნესი გაიზრდება.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="p-8 rounded-sm" style={{ border: `1px solid ${SURFACE}` }}>
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: MUTED }}>
                უფასო
              </p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display text-4xl font-semibold" style={{ color: INK }}>
                  ₾0
                </span>
                <span className="text-sm" style={{ color: MUTED }}>/სამუდამოდ</span>
              </div>
              <p className="text-sm mb-8" style={{ color: MUTED }}>
                მცირე ბიზნესის დასაწყებად
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: INK }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: ACCENT, flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full py-3 text-sm font-medium text-center border"
                style={{ borderColor: INK, color: INK }}
              >
                დაიწყე უფასოდ
              </Link>
            </div>

            {/* Pro */}
            <div
              className="p-8 rounded-sm relative overflow-hidden"
              style={{ background: INK }}
            >
              <div
                className="absolute top-4 right-4 text-[10px] font-medium px-2.5 py-1 tracking-wide"
                style={{ background: ACCENT, color: PAPER }}
              >
                პოპულარული
              </div>
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#78716c" }}>
                პრო
              </p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display text-4xl font-semibold" style={{ color: PAPER }}>
                  ₾29
                </span>
                <span className="text-sm" style={{ color: "#78716c" }}>/თვეში</span>
              </div>
              <p className="text-sm mb-8" style={{ color: "#78716c" }}>
                მზარდი ბიზნესისთვის
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: PAPER }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: ACCENT, flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full py-3 text-sm font-medium text-center"
                style={{ background: ACCENT, color: PAPER }}
              >
                დაიწყე Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ background: SUBTLE }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: ACCENT }}>
              მომხმარებლები
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: INK }}>
              ვინ ყიდის MultiStore-ზე
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-sm flex flex-col gap-4"
                style={{ background: PAPER }}
              >
                {/* Product card mini */}
                <div className="flex gap-3 items-center pb-4" style={{ borderBottom: `1px solid ${SURFACE}` }}>
                  <div
                    className="w-12 h-16 rounded-sm flex-shrink-0"
                    style={{ background: SURFACE }}
                  />
                  <div>
                    <p className="text-xs font-medium" style={{ color: INK }}>{t.product}</p>
                    <p className="text-xs" style={{ color: ACCENT }}>{t.price}</p>
                    <p className="text-[10px] mt-1" style={{ color: MUTED }}>{t.shop}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed flex-1" style={{ color: MUTED }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="text-sm font-semibold" style={{ color: INK }}>
                  {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section>
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-semibold mb-6 leading-tight" style={{ color: INK }}>
            გაუშვი შენი ონლაინ
            <br />
            მაღაზია დღესვე
          </h2>
          <p className="text-base mb-10 max-w-md mx-auto" style={{ color: MUTED }}>
            შექმენი ანგარიში წუთებში. პირველი გაყიდვა — ბევრად უფრო ახლოს,
            ვიდრე ფიქრობ.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="px-8 py-3.5 text-sm font-medium"
              style={{ background: INK, color: PAPER }}
            >
              დაიწყე უფასოდ
            </Link>
            <a
              href="/shop/anano-atelier"
              className="px-8 py-3.5 text-sm font-medium border"
              style={{ borderColor: SURFACE, color: INK }}
            >
              ნახე დემო მაღაზია →
            </a>
          </div>
          <p className="text-xs mt-6" style={{ color: "#a8a29e" }}>
            უფასო ვერსია სამუდამოდ · საკრედიტო ბარათი არ არის საჭირო
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${SURFACE}` }}>
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <p className="font-display text-lg font-semibold mb-1" style={{ color: INK }}>
                MultiStore
              </p>
              <p className="text-sm" style={{ color: MUTED }}>
                ონლაინ მაღაზია კოდის გარეშე
              </p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {[
                { href: "#features", label: "ფუნქციები" },
                { href: "#how", label: "როგორ მუშაობს" },
                { href: "#pricing", label: "ფასები" },
                { href: "/login", label: "შესვლა" },
                { href: "/register", label: "რეგისტრაცია" },
              ].map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="text-sm"
                  style={{ color: MUTED }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div
            className="flex flex-col md:flex-row justify-between gap-3 mt-8 pt-6 text-xs"
            style={{ borderTop: `1px solid ${SURFACE}`, color: "#a8a29e" }}
          >
            <p>© 2026 MultiStore · multistore.ge</p>
            <div className="flex gap-6">
              <a href="/privacy" style={{ color: "#a8a29e" }}>კონფიდენციალურობა</a>
              <a href="/terms" style={{ color: "#a8a29e" }}>წესები და პირობები</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
