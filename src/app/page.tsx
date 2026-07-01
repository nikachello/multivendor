"use client";

import Link from "next/link";
import { useState } from "react";

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
const DEMO_URL = ROOT ? `https://zari.${ROOT}` : "/shop/zari";

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 54,
          padding: "0 28px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: "#1d1d1f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 2, background: "#fff" }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>MultiStore</span>
        </div>

        {/* Desktop links */}
        <div style={{ alignItems: "center", gap: 30 }} className="hidden md:flex">
          <a href="#features" style={{ fontSize: 13.5, color: "#1d1d1f", textDecoration: "none" }}>ფუნქციები</a>
          <a href="#pricing" style={{ fontSize: 13.5, color: "#1d1d1f", textDecoration: "none" }}>ფასები</a>
          <Link href="/login" style={{ fontSize: 13.5, color: "#1d1d1f", textDecoration: "none" }}>შესვლა</Link>
          <Link
            href="/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: 13.5,
              fontWeight: 600,
              color: "#fff",
              background: "#1d1d1f",
              padding: "7px 15px",
              borderRadius: 980,
              textDecoration: "none",
            }}
          >
            დაიწყე უფასოდ
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
          aria-label="Menu"
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#1d1d1f" strokeWidth={2}>
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{ background: "#fff", borderTop: "1px solid rgba(0,0,0,0.06)", padding: "16px 28px 20px" }}
          className="md:hidden flex flex-col gap-4"
        >
          <a href="#features" onClick={() => setOpen(false)} style={{ fontSize: 15, color: "#1d1d1f", textDecoration: "none" }}>ფუნქციები</a>
          <a href="#pricing" onClick={() => setOpen(false)} style={{ fontSize: 15, color: "#1d1d1f", textDecoration: "none" }}>ფასები</a>
          <Link href="/login" style={{ fontSize: 15, color: "#1d1d1f", textDecoration: "none" }}>შესვლა</Link>
          <Link
            href="/register"
            style={{
              display: "inline-flex",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 600,
              color: "#fff",
              background: "#1d1d1f",
              padding: "11px 15px",
              borderRadius: 980,
              textDecoration: "none",
            }}
          >
            დაიწყე უფასოდ
          </Link>
        </div>
      )}
    </div>
  );
}

// ── Browser mockup ────────────────────────────────────────────────────────────
function BrowserMockup() {
  return (
    <div
      style={{
        border: "1px solid #e3e3e6",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 40px 80px -40px rgba(0,0,0,.28)",
        background: "#fff",
      }}
    >
      {/* Chrome bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 18px",
          background: "#f5f5f7",
          borderBottom: "1px solid #e8e8eb",
        }}
      >
        <div style={{ display: "flex", gap: 7 }}>
          {["#dededf", "#dededf", "#dededf"].map((c, i) => (
            <span key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: c, display: "block" }} />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 12,
              color: "#86868b",
              background: "#fff",
              border: "1px solid #e3e3e6",
              padding: "5px 18px",
              borderRadius: 7,
            }}
          >
            zari.multistore.ge
          </div>
        </div>
      </div>

      {/* Storefront */}
      <div style={{ background: "#fff" }}>
        {/* Navbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 36px",
            borderBottom: "1px solid #f0f0f2",
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "0.16em" }}>ZARI</span>
          <div style={{ display: "flex", gap: 26, alignItems: "center", fontSize: 13, color: "#6e6e73" }}>
            <span>მაღაზია</span>
            <span>კოლექციები</span>
            <span>ჩვენ შესახებ</span>
            <span style={{ color: "#1d1d1f" }}>კალათა · 2</span>
          </div>
        </div>

        {/* Banner */}
        <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", borderBottom: "1px solid #f0f0f2" }}>
          <div
            style={{
              aspectRatio: "16/10",
              background: "#f5f5f7",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: 14,
            }}
          >
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: "#b0b0b5" }}>სარეკლამო ფოტო</span>
          </div>
          <div style={{ padding: "44px 38px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1f7a52", marginBottom: 13 }}>
              ახალი კოლექცია
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 14 }}>
              ზაფხული 2026
            </div>
            <div style={{ fontSize: 14, color: "#6e6e73", lineHeight: 1.6, marginBottom: 22 }}>
              ხელნაკეთი ნაწარმი ქართველი დიზაინერისგან.
            </div>
            <div>
              <span
                style={{
                  display: "inline-flex",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#fff",
                  background: "#1d1d1f",
                  padding: "11px 24px",
                  borderRadius: 980,
                }}
              >
                ნახე კოლექცია
              </span>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, padding: "32px 36px" }}>
          {[
            { name: "სელის კაბა", price: "₾240" },
            { name: "შალის ჟაკეტი", price: "₾320" },
            { name: "ტყავის ჩანთა", price: "₾180" },
            { name: "აბრეშუმის შარფი", price: "₾95" },
          ].map((p) => (
            <div key={p.name}>
              <div
                style={{
                  aspectRatio: "4/5",
                  borderRadius: 10,
                  background: "#f5f5f7",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  paddingBottom: 11,
                }}
              >
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, color: "#b0b0b5" }}>ფოტო</span>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 500, marginTop: 12 }}>{p.name}</div>
              <div style={{ fontSize: 13.5, color: "#6e6e73" }}>{p.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ fontFamily: "var(--font-georgian), sans-serif", color: "#1d1d1f", background: "#ffffff", overflowX: "hidden" }}>
      <style>{`
        @media (max-width: 767px) {
          .ms-hero-sub { font-size: 17px !important; }
          .ms-trust-strip { grid-template-columns: 1fr !important; }
          .ms-how-h2, .ms-feat-h2, .ms-pricing-h2 { font-size: 30px !important; }
          .ms-themes-outer { padding: 32px 20px 0 !important; }
          .ms-themes-grid { grid-template-columns: 1fr !important; }
          .ms-orders-outer { padding: 32px 20px !important; }
          .ms-orders-grid { grid-template-columns: 1fr !important; }
          .ms-orders-table { display: none !important; }
          .ms-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
        }
      `}</style>
      <Nav />

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "96px 28px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#1f7a52", marginBottom: 22 }}>
            ონლაინ მაღაზია კოდის გარეშე
          </div>
          <h1
            style={{
              fontSize: "clamp(44px, 7vw, 80px)",
              lineHeight: 1.04,
              fontWeight: 700,
              letterSpacing: "-0.035em",
              margin: "0 0 26px",
            }}
          >
            ააწყვე შენი მაღაზია.<br />გაყიდე პირველივე დღეს.
          </h1>
          <p className="ms-hero-sub" style={{ fontSize: 22, lineHeight: 1.5, color: "#6e6e73", margin: "0 auto 36px", maxWidth: 620 }}>
            MultiStore გაძლევს ყველა ხელსაწყოს ონლაინ მაღაზიის გასახსნელად. აირჩიე თემა, დაამატე პროდუქტები და მიიღე შეკვეთები. პროგრამირება არ დაგჭირდება.
          </p>
          <div style={{ display: "flex", gap: 22, alignItems: "center", justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
            <Link
              href="/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: 16,
                fontWeight: 600,
                color: "#fff",
                background: "#1d1d1f",
                padding: "13px 30px",
                borderRadius: 980,
                textDecoration: "none",
              }}
            >
              დაიწყე უფასოდ
            </Link>
            <a
              href={DEMO_URL}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 16,
                fontWeight: 600,
                color: "#1f7a52",
                textDecoration: "none",
              }}
            >
              ნახე დემო მაღაზია <span style={{ fontSize: 18 }}>›</span>
            </a>
          </div>
          <div style={{ fontSize: 13, color: "#86868b" }}>უფასო ვერსია სამუდამოდ. ბარათი საჭირო არ არის.</div>
        </div>
      </div>

      {/* Browser mockup — desktop only */}
      <div className="hidden sm:block" style={{ maxWidth: 1120, margin: "60px auto 0", padding: "0 28px" }}>
        <BrowserMockup />
      </div>

      {/* Trust strip */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 28px 0" }}>
        <div className="ms-trust-strip" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, textAlign: "center" }}>
          {[
            { value: "2,400+", label: "აქტიური მაღაზია" },
            { value: "10 წუთი", label: "საშუალო გასაშვები დრო" },
            { value: "₾0", label: "დასაწყებად" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: "-0.03em" }}>{s.value}</div>
              <div style={{ fontSize: 14, color: "#6e6e73", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ marginTop: 96, background: "#f5f5f7", padding: "100px 28px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#1f7a52", marginBottom: 14 }}>როგორ მუშაობს</div>
            <h2 className="ms-how-h2" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.03em", margin: 0 }}>სამი ნაბიჯი გაყიდვამდე</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
            {[
              { n: "01", title: "შექმენი ანგარიში", desc: "დარეგისტრირდი ელ. ფოსტით წამებში. ინსტალაცია არ სჭირდება." },
              { n: "02", title: "მოარგე მაღაზია", desc: "აირჩიე თემა, დაამატე ლოგო, ფერები და პროდუქტები ერთ ადგილას." },
              { n: "03", title: "დაიწყე გაყიდვა", desc: "გამოაქვეყნე მაღაზია და მიიღე შეკვეთები. გადახდა მიწოდებისას." },
            ].map((s) => (
              <div key={s.n} style={{ background: "#fff", borderRadius: 20, padding: 40 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1f7a52", marginBottom: 24 }}>{s.n}</div>
                <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 11 }}>{s.title}</div>
                <div style={{ fontSize: 15, lineHeight: 1.6, color: "#6e6e73" }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features header */}
      <div id="features" style={{ maxWidth: 1120, margin: "0 auto", padding: "100px 28px 0", textAlign: "center" }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#1f7a52", marginBottom: 14 }}>ფუნქციები</div>
        <h2 className="ms-feat-h2" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 18px" }}>ყველაფერი გასაყიდად, ერთ ადგილას</h2>
        <p style={{ fontSize: 19, lineHeight: 1.5, color: "#6e6e73", margin: "0 auto", maxWidth: 560 }}>
          პროფესიონალური ხელსაწყოები მცირე ბიზნესისთვის. მარტივი იმდენად, რომ დღესვე დაიწყო.
        </p>
      </div>

      {/* Feature 1: Themes */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "56px 28px 0" }}>
        <div className="ms-themes-outer" style={{ background: "#f5f5f7", borderRadius: 24, padding: "52px 56px 0", overflow: "hidden" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 9 }}>პროფესიონალური თემები</div>
            <div style={{ fontSize: 15, color: "#6e6e73", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
              აირჩიე Maison ან Minimal. შეცვალე ფერები და ლოგო წამებში, შენი ბრენდის სტილში.
            </div>
          </div>
          <div className="ms-themes-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Maison */}
            <div style={{ background: "#fff", borderRadius: "14px 14px 0 0", padding: 30, boxShadow: "0 20px 40px -28px rgba(0,0,0,.3)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Maison</span>
                <span style={{ fontSize: 12, color: "#86868b" }}>ლუქს ედიტორიალი</span>
              </div>
              <div style={{ background: "#faf6ef", borderRadius: 9, padding: "26px 22px", textAlign: "center" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "#9a6a3a", marginBottom: 8 }}>ZARI</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 14 }}>ზაფხული 2026</div>
                <div style={{ display: "flex", gap: 9, justifyContent: "center" }}>
                  {[1, 2, 3].map((i) => (
                    <span key={i} style={{ width: 44, height: 56, borderRadius: 3, background: "#ece4d6", display: "block" }} />
                  ))}
                </div>
              </div>
            </div>
            {/* Minimal */}
            <div style={{ background: "#fff", borderRadius: "14px 14px 0 0", padding: 30, boxShadow: "0 20px 40px -28px rgba(0,0,0,.3)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Minimal</span>
                <span style={{ fontSize: 12, color: "#86868b" }}>სუფთა თანამედროვე</span>
              </div>
              <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 9, padding: "26px 22px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", marginBottom: 8 }}>ლელა</div>
                <div style={{ width: 46, height: 3, background: "#1f7a52", borderRadius: 2, margin: "0 auto 16px" }} />
                <div style={{ display: "flex", gap: 9, justifyContent: "center" }}>
                  {[1, 2, 3].map((i) => (
                    <span key={i} style={{ width: 44, height: 56, borderRadius: 7, background: "#f1f1f3", display: "block" }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 2: Orders dashboard */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 28px 0" }}>
        <div className="ms-orders-outer" style={{ background: "#1d1d1f", borderRadius: 24, padding: "52px 56px", color: "#f5f5f7" }}>
          <div className="ms-orders-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: 48, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>შეკვეთების მართვა</div>
              <div style={{ fontSize: 16, lineHeight: 1.6, color: "#a1a1a6", marginBottom: 24 }}>
                ნახე ახალი შეკვეთები, განაახლე სტატუსები და მართე პროდუქტები ერთი გასაგები პანელიდან.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13, fontSize: 14.5 }}>
                {["შეკვეთები რეალურ დროში", "პროდუქტები და კატეგორიები", "გაყიდვების მიმოხილვა"].map((f) => (
                  <div key={f} style={{ display: "flex", gap: 11, alignItems: "center" }}>
                    <span style={{ color: "#4ade80", fontSize: 15 }}>✓</span>{f}
                  </div>
                ))}
              </div>
            </div>
            <div className="ms-orders-table" style={{ background: "#fff", borderRadius: 14, overflow: "hidden", color: "#1d1d1f" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f0f0f2" }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>შეკვეთები</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#1f7a52", background: "#e7f3ec", padding: "4px 11px", borderRadius: 980 }}>12 ახალი</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "64px 1fr 64px 96px", padding: "10px 20px", background: "#fafafa", fontSize: 11, color: "#86868b", fontWeight: 500 }}>
                <span>#</span><span>მომხმარებელი</span><span>თანხა</span><span>სტატუსი</span>
              </div>
              {[
                { id: "1042", name: "ნინო ბერიძე", amount: "₾125", status: "ახალი", statusBg: "#e7f3ec", statusColor: "#1f7a52" },
                { id: "1041", name: "გიორგი მაისურაძე", amount: "₾80", status: "გაგზავნილი", statusBg: "#f1f1f3", statusColor: "#6e6e73" },
                { id: "1040", name: "თამარ ქავთარაძე", amount: "₾240", status: "დასრულდა", statusBg: "#eef2f8", statusColor: "#3a6ea5" },
              ].map((o) => (
                <div key={o.id} style={{ display: "grid", gridTemplateColumns: "64px 1fr 64px 96px", padding: "13px 20px", borderTop: "1px solid #f4f4f5", fontSize: 13, alignItems: "center" }}>
                  <span style={{ fontFamily: "'Geist Mono', monospace", color: "#86868b" }}>{o.id}</span>
                  <span>{o.name}</span>
                  <span>{o.amount}</span>
                  <span>
                    <span style={{ background: o.statusBg, color: o.statusColor, fontSize: 10.5, padding: "3px 9px", borderRadius: 980, fontWeight: 600 }}>
                      {o.status}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature 3+4: Editor + Shipping */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 28px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {/* Editor */}
          <div style={{ background: "#f5f5f7", borderRadius: 24, padding: "44px 40px" }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 11 }}>გვერდის რედაქტორი</div>
            <div style={{ fontSize: 15, lineHeight: 1.6, color: "#6e6e73", marginBottom: 28 }}>
              მოაწყე მთავარი გვერდი ნაწილებად. გადაათრიე, შეცვალე, გამოაქვეყნე. კოდი არ არის საჭირო.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { label: "სარეკლამო ბანერი", active: false },
                { label: "პროდუქტების ბადე", active: true },
                { label: "გამოწერის ფორმა", active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "#fff",
                    border: `1px solid ${item.active ? "#1f7a52" : "#e8e8eb"}`,
                    borderRadius: 9,
                    padding: "12px 15px",
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
                  <span style={{ color: item.active ? "#1f7a52" : "#b0b0b5" }}>⋮⋮</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div style={{ background: "#f5f5f7", borderRadius: 24, padding: "44px 40px" }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 11 }}>მიწოდების ზონები</div>
            <div style={{ fontSize: 15, lineHeight: 1.6, color: "#6e6e73", marginBottom: 28 }}>
              განსაზღვრე მიწოდების ფასი ქალაქისა და რეგიონის მიხედვით. დაამატე უფასო მიწოდების ზღვარი.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { zone: "თბილისი", price: "₾5" },
                { zone: "ბათუმი, ქუთაისი", price: "₾8" },
                { zone: "დანარჩენი რეგიონები", price: "₾12" },
              ].map((z) => (
                <div
                  key={z.zone}
                  style={{
                    background: "#fff",
                    border: "1px solid #e8e8eb",
                    borderRadius: 9,
                    padding: "13px 15px",
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{z.zone}</span>
                  <span style={{ fontWeight: 600 }}>{z.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" style={{ marginTop: 100, background: "#f5f5f7", padding: "100px 28px" }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#1f7a52", marginBottom: 14 }}>ფასები</div>
            <h2 className="ms-pricing-h2" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 16px" }}>მარტივი და გამჭვირვალე</h2>
            <p style={{ fontSize: 19, color: "#6e6e73", margin: 0 }}>დაიწყე უფასოდ. გადადი Pro-ზე, როცა მზად იქნები.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {/* Free */}
            <div style={{ background: "#fff", borderRadius: 22, padding: 40 }}>
              <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>უფასო</div>
              <div style={{ fontSize: 14, color: "#86868b", marginBottom: 24 }}>დასაწყებად</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 28 }}>
                <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.03em" }}>₾0</span>
                <span style={{ fontSize: 15, color: "#86868b" }}>სამუდამოდ</span>
              </div>
              <Link
                href="/register"
                style={{
                  display: "block",
                  textAlign: "center",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#1d1d1f",
                  background: "#fff",
                  border: "1px solid #d2d2d7",
                  padding: 13,
                  borderRadius: 980,
                  marginBottom: 30,
                  textDecoration: "none",
                }}
              >
                დაიწყე უფასოდ
              </Link>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 14.5 }}>
                {["10 პროდუქტამდე", "1 თემა", "შეკვეთების მართვა", "გადახდა მიწოდებისას"].map((f) => (
                  <div key={f} style={{ display: "flex", gap: 11 }}>
                    <span style={{ color: "#1f7a52" }}>✓</span>{f}
                  </div>
                ))}
              </div>
            </div>

            {/* Pro */}
            <div style={{ background: "#fff", borderRadius: 22, padding: 40, position: "relative", boxShadow: "0 0 0 2px #1d1d1f" }}>
              <span
                style={{
                  position: "absolute",
                  top: -13,
                  left: 40,
                  background: "#1d1d1f",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "5px 13px",
                  borderRadius: 980,
                }}
              >
                პოპულარული
              </span>
              <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>Pro</div>
              <div style={{ fontSize: 14, color: "#86868b", marginBottom: 24 }}>მზარდი ბიზნესისთვის</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 28 }}>
                <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.03em" }}>₾29</span>
                <span style={{ fontSize: 15, color: "#86868b" }}>თვეში</span>
              </div>
              <Link
                href="/register"
                style={{
                  display: "block",
                  textAlign: "center",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#fff",
                  background: "#1d1d1f",
                  padding: 13,
                  borderRadius: 980,
                  marginBottom: 30,
                  textDecoration: "none",
                }}
              >
                აირჩიე Pro
              </Link>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 14.5 }}>
                {["ულიმიტო პროდუქტი", "ყველა თემა", "მიწოდების ზონები", "საკუთარი დომენი", "პრიორიტეტული მხარდაჭერა"].map((f) => (
                  <div key={f} style={{ display: "flex", gap: 11 }}>
                    <span style={{ color: "#1f7a52" }}>✓</span>{f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div style={{ textAlign: "center", padding: "110px 28px" }}>
        <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-0.035em", margin: "0 0 22px" }}>
          მზად ხარ გასაყიდად?
        </h2>
        <p style={{ fontSize: 20, color: "#6e6e73", margin: "0 auto 34px", maxWidth: 480 }}>
          გახსენი შენი მაღაზია დღესვე. პირველი პროდუქტი 10 წუთში ონლაინ იქნება.
        </p>
        <Link
          href="/register"
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: 17,
            fontWeight: 600,
            color: "#fff",
            background: "#1d1d1f",
            padding: "15px 36px",
            borderRadius: 980,
            textDecoration: "none",
          }}
        >
          დაიწყე უფასოდ
        </Link>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #e3e3e6", padding: "56px 28px 44px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div className="ms-footer-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 32, marginBottom: 44 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: "#1d1d1f", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: "#fff" }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>MultiStore</span>
              </div>
              <div style={{ fontSize: 14, color: "#86868b", lineHeight: 1.6, maxWidth: 240 }}>
                ონლაინ მაღაზია ქართული მცირე ბიზნესისთვის. კოდის გარეშე.
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 15 }}>პროდუქტი</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: 14, color: "#6e6e73" }}>
                <a href="#features" style={{ color: "#6e6e73", textDecoration: "none" }}>ფუნქციები</a>
                <a href="#pricing" style={{ color: "#6e6e73", textDecoration: "none" }}>ფასები</a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 15 }}>ანგარიში</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: 14 }}>
                <Link href="/login" style={{ color: "#6e6e73", textDecoration: "none" }}>შესვლა</Link>
                <Link href="/register" style={{ color: "#6e6e73", textDecoration: "none" }}>რეგისტრაცია</Link>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 15 }}>სამართლებრივი</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: 14 }}>
                <Link href="/terms" style={{ color: "#6e6e73", textDecoration: "none" }}>წესები და პირობები</Link>
                <Link href="/privacy" style={{ color: "#6e6e73", textDecoration: "none" }}>კონფიდენციალურობა</Link>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #e3e3e6", paddingTop: 24, fontSize: 13, color: "#86868b" }}>
            © 2026 MultiStore. multistore.ge
          </div>
        </div>
      </div>
    </div>
  );
}
