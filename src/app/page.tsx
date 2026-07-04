"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/lib/auth/client";

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
const DEMO_URL = ROOT ? `https://zari.${ROOT}` : "/shop/zari";

// ── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  const [open, setOpen] = useState(false);
  const { data: sessionData } = useSession();
  const isLoggedIn = !!sessionData?.session;

  return (
    <div
      style={{
        position: "sticky",
        top: 12,
        zIndex: 50,
        padding: "0 16px",
        pointerEvents: "none",
      }}
    >
      {/* Floating pill */}
      <div
        style={{
          maxWidth: 1060,
          margin: "0 auto",
          background: "rgba(255,255,255,0.5)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.6)",
          borderRadius: 20,
          boxShadow:
            "0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)",
          pointerEvents: "auto",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 52,
            padding: "0 20px",
            position: "relative",
          }}
        >
          {/* Wordmark */}
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-jakarta)",
              fontSize: 15,
              fontWeight: 700,
              color: "#0a0a0a",
              textDecoration: "none",
              letterSpacing: "-0.025em",
              flexShrink: 0,
            }}
          >
            MultiStore
          </Link>

          {/* Center links — desktop */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              alignItems: "center",
              gap: 32,
            }}
            className="hidden md:flex"
          >
            <a href="#features" style={{ fontSize: 13.5, color: "#444", textDecoration: "none" }}>
              ფუნქციები
            </a>
            <a href="#pricing" style={{ fontSize: 13.5, color: "#444", textDecoration: "none" }}>
              ფასები
            </a>
          </div>

          {/* Right auth — desktop */}
          <div
            style={{ alignItems: "center", gap: 20, flexShrink: 0 }}
            className="hidden md:flex"
          >
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#fff",
                  background: "#0a0a0a",
                  padding: "6px 16px",
                  borderRadius: 980,
                  textDecoration: "none",
                }}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{ fontSize: 13.5, color: "#444", textDecoration: "none" }}
                >
                  შესვლა
                </Link>
                <Link
                  href="/register"
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#fff",
                    background: "#0a0a0a",
                    padding: "6px 16px",
                    borderRadius: 980,
                    textDecoration: "none",
                  }}
                >
                  დაიწყე
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
            className="md:hidden"
            aria-label="menu"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#0a0a0a"
              strokeWidth={1.8}
            >
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            style={{
              borderTop: "1px solid rgba(0,0,0,0.07)",
              padding: "16px 20px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <a
              href="#features"
              onClick={() => setOpen(false)}
              style={{ fontSize: 15, color: "#0a0a0a", textDecoration: "none" }}
            >
              ფუნქციები
            </a>
            <a
              href="#pricing"
              onClick={() => setOpen(false)}
              style={{ fontSize: 15, color: "#0a0a0a", textDecoration: "none" }}
            >
              ფასები
            </a>
            <div
              style={{
                borderTop: "1px solid rgba(0,0,0,0.07)",
                paddingTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  style={{ fontSize: 15, fontWeight: 600, color: "#0a0a0a", textDecoration: "none" }}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    style={{ fontSize: 15, color: "#555", textDecoration: "none" }}
                  >
                    შესვლა
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#fff",
                      background: "#0a0a0a",
                      padding: "11px 16px",
                      borderRadius: 12,
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    დაიწყე
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Storefront preview ───────────────────────────────────────────────────────

function StorefrontPreview() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e4e4e7",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow:
          "0 2px 4px rgba(0,0,0,0.04), 0 12px 40px -8px rgba(0,0,0,0.16), 0 40px 80px -24px rgba(0,0,0,0.1)",
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          background: "#f4f4f5",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: "1px solid #e4e4e7",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
            <span
              key={i}
              style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "block" }}
            />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-jakarta)",
              fontSize: 11.5,
              color: "#86868b",
              background: "#fff",
              border: "1px solid #e4e4e7",
              padding: "4px 16px",
              borderRadius: 6,
            }}
          >
            zari.multistore.ge
          </div>
        </div>
      </div>

      {/* Storefront */}
      <div style={{ background: "#fff" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 32px",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.2em" }}>ZARI</span>
          <div style={{ display: "flex", gap: 22, fontSize: 12, color: "#888" }}>
            <span>მაღაზია</span>
            <span>კოლექციები</span>
            <span style={{ color: "#0a0a0a", fontWeight: 500 }}>კალათა (2)</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr" }}>
          <div
            style={{
              background: "linear-gradient(145deg, #f2ece3 0%, #e8dfd0 100%)",
              padding: "40px 44px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              minHeight: 200,
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#96703e",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              ახალი კოლექცია
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                lineHeight: 1.08,
                marginBottom: 16,
              }}
            >
              ზაფხული 2026
            </div>
            <div
              style={{
                display: "inline-block",
                background: "#0a0a0a",
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
                padding: "7px 16px",
                borderRadius: 980,
                alignSelf: "flex-start",
              }}
            >
              კოლექცია
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#e8e8e8" }}>
            {["#f5f0ea", "#ede5d8", "#f8f4ef", "#e8dfd2"].map((c, i) => (
              <div key={i} style={{ background: c, aspectRatio: "1" }} />
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, padding: "24px 32px" }}>
          {[
            { name: "სელის კაბა", price: "₾240" },
            { name: "შალის ჟაკეტი", price: "₾320" },
            { name: "ტყავის ჩანთა", price: "₾180" },
            { name: "მატყლის შარფი", price: "₾95" },
          ].map((p) => (
            <div key={p.name}>
              <div style={{ aspectRatio: "3/4", background: "#f5f5f7", borderRadius: 8 }} />
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 8 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{p.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div
      style={{
        fontFamily: "var(--font-georgian), sans-serif",
        color: "#0a0a0a",
        background: "#f6f6f8",
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          .lp-hero-h1 { font-size: 44px !important; letter-spacing: -0.03em !important; }
          .lp-stats { grid-template-columns: 1fr 1fr !important; }
          .lp-themes-inner { flex-direction: column !important; }
          .lp-dash-inner { flex-direction: column !important; }
          .lp-dash-table { display: none !important; }
          .lp-cards { grid-template-columns: 1fr !important; }
          .lp-steps { grid-template-columns: 1fr !important; }
          .lp-pricing { grid-template-columns: 1fr !important; }
          .lp-footer-cols { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
          .lp-steps-item + .lp-steps-item { border-left: none !important; border-top: 1px solid #e8e8eb !important; }
        }
      `}</style>

      <Nav />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          background:
            "radial-gradient(ellipse 90% 45% at 50% 0%, rgba(31,122,82,0.09) 0%, #f6f6f8 100%)",
          padding: "132px 24px 100px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(31,122,82,0.09)",
              color: "#1a6944",
              fontSize: 13,
              fontWeight: 600,
              padding: "6px 14px",
              borderRadius: 980,
              marginBottom: 36,
              letterSpacing: "0.01em",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#1f7a52",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            ახლა ხელმისაწვდომია
          </div>

          <h1
            className="lp-hero-h1"
            style={{
              fontSize: "clamp(48px, 7.5vw, 90px)",
              fontWeight: 800,
              lineHeight: 1.01,
              letterSpacing: "-0.04em",
              color: "#0a0a0a",
              margin: "0 0 26px",
            }}
          >
            ააწყვე მაღაზია.
            <br />
            გაყიდე პირველივე დღეს.
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 2.2vw, 20px)",
              lineHeight: 1.55,
              color: "#636366",
              margin: "0 auto 44px",
              maxWidth: 490,
              fontWeight: 400,
            }}
          >
            ქართული ბიზნესისთვის შექმნილი პლატფორმა. ონლაინ მაღაზია 10 წუთში, კოდის გარეშე.
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            <Link
              href="/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: 15,
                fontWeight: 600,
                color: "#fff",
                background: "#0a0a0a",
                padding: "13px 28px",
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
                fontSize: 15,
                fontWeight: 500,
                color: "#0a0a0a",
                background: "rgba(0,0,0,0.06)",
                padding: "13px 24px",
                borderRadius: 980,
                textDecoration: "none",
              }}
            >
              ნახე დემო
            </a>
          </div>

          <div style={{ fontSize: 13, color: "#9b9ba0" }}>
            უფასო ვერსია სამუდამოდ. ბარათი საჭირო არ არის.
          </div>
        </div>
      </div>

      {/* ── Mockup ────────────────────────────────────────────────────────── */}
      <div className="hidden sm:block" style={{ maxWidth: 1100, margin: "-16px auto 0", padding: "0 24px" }}>
        <StorefrontPreview />
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "88px 24px" }}>
        <div
          className="lp-stats"
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", textAlign: "center" }}
        >
          {[
            { value: "2,400+", label: "აქტიური მაღაზია", mono: true },
            { value: "10 წთ", label: "გასაშვებად", mono: false },
            { value: "₾0", label: "საწყისი ღირებულება", mono: true },
          ].map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: "0 20px",
                borderLeft: i > 0 ? "1px solid #e8e8eb" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: s.mono ? "var(--font-jakarta)" : "inherit",
                  fontSize: "clamp(38px, 5.5vw, 60px)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: "#0a0a0a",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 14, color: "#636366", marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <div id="features" style={{ background: "#f2f2f7", paddingBottom: 80 }}>
        {/* Section label */}
        <div
          style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 56px", textAlign: "center" }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#1f7a52",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            ფუნქციები
          </div>
          <h2
            style={{
              fontSize: "clamp(30px, 4vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: "0 0 16px",
            }}
          >
            ყველაფერი ერთ ადგილას
          </h2>
          <p style={{ fontSize: 18, color: "#636366", margin: "0 auto", maxWidth: 460, lineHeight: 1.5 }}>
            პროფესიონალური ხელსაწყოები. მარტივი გამოყენება.
          </p>
        </div>

        {/* Glass card: Themes */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 20px" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.65)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.85)",
              borderRadius: 28,
              padding: "52px 56px",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.95)",
              overflow: "hidden",
            }}
          >
            <div className="lp-themes-inner" style={{ display: "flex", gap: 56, alignItems: "center" }}>
              <div style={{ flex: "0 0 300px" }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#1f7a52",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 18,
                  }}
                >
                  თემები
                </div>
                <h3
                  style={{
                    fontSize: "clamp(24px, 3vw, 36px)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.08,
                    marginBottom: 16,
                  }}
                >
                  შენი ბრენდის სტილი
                </h3>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: "#636366" }}>
                  4 ხელნაკეთი თემა კომბინირებული ფერების სისტემით. შეცვალე ლოგო, ფერები და შრიფტები კოდის გარეშე.
                </p>
              </div>
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* Maison */}
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                  }}
                >
                  <div style={{ background: "#faf6ef", padding: "28px 24px 24px" }}>
                    <div
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.22em",
                        color: "#b8965a",
                        fontWeight: 700,
                        marginBottom: 7,
                      }}
                    >
                      MAISON
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                        marginBottom: 14,
                      }}
                    >
                      ლუქს ედიტორიალი
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["#ece4d6", "#dfd6c4", "#d5c9b4"].map((c) => (
                        <span
                          key={c}
                          style={{
                            flex: 1,
                            aspectRatio: "3/4",
                            background: c,
                            borderRadius: 5,
                            display: "block",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "11px 16px",
                      fontSize: 12,
                      color: "#888",
                      borderTop: "1px solid #f5f5f7",
                    }}
                  >
                    ელეგანტური, ორგანული
                  </div>
                </div>

                {/* Pipeline */}
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                  }}
                >
                  <div style={{ background: "#0a0a0a", padding: "28px 24px 24px" }}>
                    <div
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.22em",
                        color: "#666",
                        fontWeight: 700,
                        marginBottom: 7,
                      }}
                    >
                      PIPELINE
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                        color: "#fff",
                        marginBottom: 14,
                      }}
                    >
                      თანამედროვე ბოლდი
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["#1e1e1e", "#2a2a2a", "#383838"].map((c) => (
                        <span
                          key={c}
                          style={{
                            flex: 1,
                            aspectRatio: "3/4",
                            background: c,
                            borderRadius: 5,
                            display: "block",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "11px 16px",
                      fontSize: 12,
                      color: "#888",
                      borderTop: "1px solid #f5f5f7",
                    }}
                  >
                    მონოქრომატული, სმარტი
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dark card: Dashboard */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 20px" }}>
          <div
            style={{
              background: "#0a0a0a",
              borderRadius: 28,
              padding: "52px 56px",
              overflow: "hidden",
              color: "#f5f5f7",
            }}
          >
            <div className="lp-dash-inner" style={{ display: "flex", gap: 48, alignItems: "center" }}>
              <div style={{ flex: "0 0 280px" }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#4ade80",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 18,
                  }}
                >
                  შეკვეთები
                </div>
                <h3
                  style={{
                    fontSize: "clamp(22px, 3vw, 34px)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.08,
                    color: "#fff",
                    marginBottom: 16,
                  }}
                >
                  მართე ბიზნესი ერთი ეკრანიდან
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: "#a1a1a6" }}>
                  ახალი შეკვეთები, სტატუსების განახლება, ინვენტარი, კუპონები და ანალიტიკა. ყველაფერი ერთ სუფთა პანელში.
                </p>
              </div>

              <div className="lp-dash-table" style={{ flex: 1 }}>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    overflow: "hidden",
                    color: "#0a0a0a",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
                  }}
                >
                  <div
                    style={{
                      padding: "14px 20px",
                      borderBottom: "1px solid #f0f0f2",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 700 }}>შეკვეთები</span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#1f7a52",
                        background: "#e7f3ec",
                        padding: "4px 10px",
                        borderRadius: 980,
                      }}
                    >
                      12 ახალი
                    </span>
                  </div>
                  {[
                    { id: "1042", name: "ნინო ბერიძე", amount: "₾125", status: "ახალი", sc: "#1f7a52", sb: "#e7f3ec" },
                    { id: "1041", name: "გიორგი მაისურაძე", amount: "₾80", status: "გაგზავნილი", sc: "#6e6e73", sb: "#f1f1f3" },
                    { id: "1040", name: "თამარ ქავთარაძე", amount: "₾240", status: "დასრულდა", sc: "#3a6ea5", sb: "#eef2f8" },
                    { id: "1039", name: "ლუკა გვასალია", amount: "₾64", status: "ახალი", sc: "#1f7a52", sb: "#e7f3ec" },
                  ].map((o) => (
                    <div
                      key={o.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "48px 1fr 58px 88px",
                        padding: "11px 20px",
                        borderBottom: "1px solid #f8f8f8",
                        fontSize: 13,
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{ fontFamily: "var(--font-jakarta)", color: "#bbb", fontSize: 11 }}
                      >
                        #{o.id}
                      </span>
                      <span style={{ fontWeight: 500 }}>{o.name}</span>
                      <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 600 }}>{o.amount}</span>
                      <span>
                        <span
                          style={{
                            background: o.sb,
                            color: o.sc,
                            fontSize: 10.5,
                            padding: "3px 8px",
                            borderRadius: 980,
                            fontWeight: 600,
                          }}
                        >
                          {o.status}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glass cards: Editor + Analytics */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div className="lp-cards" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Editor */}
            <div
              style={{
                background: "rgba(255,255,255,0.65)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.85)",
                borderRadius: 24,
                padding: "44px 40px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.95)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#1f7a52",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                ვიზუალური რედაქტორი
              </div>
              <h3
                style={{
                  fontSize: "clamp(20px, 2.5vw, 28px)",
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  marginBottom: 12,
                }}
              >
                მოაწყე გვერდი ვიზუალურად
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "#636366", marginBottom: 28 }}>
                გადაათრიე სექციები, შეცვალე შინაარსი. ცვლილებები ჩანს დაუყოვნებლივ.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "ჰეროს ბანერი", active: false },
                  { label: "პროდუქტების ბადე", active: true },
                  { label: "კოლექციები", active: false },
                  { label: "ტექსტი და სურათი", active: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: item.active ? "#0a0a0a" : "#fff",
                      border: `1px solid ${item.active ? "#0a0a0a" : "#e8e8eb"}`,
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      color: item.active ? "#fff" : "#0a0a0a",
                    }}
                  >
                    <span style={{ fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      style={{ opacity: 0.3 }}
                    >
                      <circle cx="3" cy="3" r="1.2" fill="currentColor" />
                      <circle cx="9" cy="3" r="1.2" fill="currentColor" />
                      <circle cx="3" cy="9" r="1.2" fill="currentColor" />
                      <circle cx="9" cy="9" r="1.2" fill="currentColor" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics */}
            <div
              style={{
                background: "rgba(255,255,255,0.65)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.85)",
                borderRadius: 24,
                padding: "44px 40px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.95)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#1f7a52",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                ანალიტიკა
              </div>
              <h3
                style={{
                  fontSize: "clamp(20px, 2.5vw, 28px)",
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  marginBottom: 12,
                }}
              >
                გაყიდვების სრული სურათი
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "#636366", marginBottom: 28 }}>
                შემოსავალი, კონვერსია, საუკეთესო პროდუქტები. 7, 30 ან 90 დღის განახლებით.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { value: "₾4,820", label: "ამ თვე" },
                  { value: "68", label: "შეკვეთა" },
                  { value: "3.2%", label: "კონვერსია" },
                  { value: "₾70.9", label: "საშ. შეკვეთა" },
                ].map((m) => (
                  <div
                    key={m.label}
                    style={{ background: "rgba(0,0,0,0.04)", borderRadius: 12, padding: "14px 16px" }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-jakarta)",
                        fontSize: 22,
                        fontWeight: 700,
                        letterSpacing: "-0.025em",
                        color: "#0a0a0a",
                      }}
                    >
                      {m.value}
                    </div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#1f7a52",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            პროცესი
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            სამი ნაბიჯი გაყიდვამდე
          </h2>
        </div>

        <div className="lp-steps" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
          {[
            {
              n: "01",
              title: "შექმენი ანგარიში",
              desc: "დარეგისტრირდი ელ. ფოსტით. სერვერი, ჰოსტინგი, ტექნიკა — ეს ყველაფერი ჩვენ გვაქვს.",
            },
            {
              n: "02",
              title: "მოარგე მაღაზია",
              desc: "აირჩიე თემა, დაამატე პროდუქტები, მოაწყე გვერდი ვიზუალური რედაქტორით.",
            },
            {
              n: "03",
              title: "გამოაქვეყნე",
              desc: "შენი მაღაზია ონლაინ. შეკვეთები პანელში, გადახდა მიწოდებისას.",
            },
          ].map((s, i) => (
            <div
              key={s.n}
              className="lp-steps-item"
              style={{
                padding: "40px 36px",
                borderLeft: i > 0 ? "1px solid #e8e8eb" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jakarta)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#ccc",
                  marginBottom: 20,
                  letterSpacing: "0.06em",
                }}
              >
                {s.n}
              </div>
              <div
                style={{ fontSize: 21, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}
              >
                {s.title}
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.65, color: "#636366" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <div id="pricing" style={{ background: "#f2f2f7", padding: "100px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#1f7a52",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              ფასები
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: "0 0 14px",
              }}
            >
              მარტივი. გამჭვირვალე.
            </h2>
            <p style={{ fontSize: 18, color: "#636366", margin: 0 }}>
              დაიწყე უფასოდ. გადადი Pro-ზე, როცა გაიზრდება.
            </p>
          </div>

          <div className="lp-pricing" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Free */}
            <div
              style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.85)",
                borderRadius: 24,
                padding: "40px 36px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>უფასო</div>
              <div style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>დასაწყებად</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 32 }}>
                <span
                  style={{
                    fontFamily: "var(--font-jakarta)",
                    fontSize: 54,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  ₾0
                </span>
                <span style={{ fontSize: 14, color: "#888" }}>სამუდამოდ</span>
              </div>
              <Link
                href="/register"
                style={{
                  display: "block",
                  textAlign: "center",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#0a0a0a",
                  background: "transparent",
                  border: "1.5px solid #d2d2d7",
                  padding: "12px 20px",
                  borderRadius: 980,
                  marginBottom: 32,
                  textDecoration: "none",
                }}
              >
                დაიწყე
              </Link>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {["10 პროდუქტამდე", "1 თემა", "შეკვეთების მართვა", "გადახდა მიწოდებისას"].map(
                  (f) => (
                    <div
                      key={f}
                      style={{ fontSize: 14.5, color: "#3c3c43", display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <span
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: "#c8c8cc",
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      {f}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Pro */}
            <div
              style={{
                background: "#0a0a0a",
                borderRadius: 24,
                padding: "40px 36px",
                color: "#f5f5f7",
                boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}
              >
                <div style={{ fontSize: 17, fontWeight: 700 }}>Pro</div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    background: "#1f7a52",
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: 980,
                  }}
                >
                  პოპულარული
                </div>
              </div>
              <div style={{ fontSize: 14, color: "#636366", marginBottom: 28 }}>
                მზარდი ბიზნესისთვის
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 32 }}>
                <span
                  style={{
                    fontFamily: "var(--font-jakarta)",
                    fontSize: 54,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  ₾29
                </span>
                <span style={{ fontSize: 14, color: "#636366" }}>თვეში</span>
              </div>
              <Link
                href="/register"
                style={{
                  display: "block",
                  textAlign: "center",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#0a0a0a",
                  background: "#fff",
                  padding: "12px 20px",
                  borderRadius: 980,
                  marginBottom: 32,
                  textDecoration: "none",
                }}
              >
                აირჩიე Pro
              </Link>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {[
                  "ულიმიტო პროდუქტი",
                  "ყველა თემა",
                  "მიწოდების ზონები",
                  "საკუთარი დომენი",
                  "კუპონები და ფასდაკლება",
                  "პრიორიტეტული მხარდაჭერა",
                ].map((f) => (
                  <div
                    key={f}
                    style={{ fontSize: 14.5, color: "#a1a1a6", display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "#1f7a52",
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <div style={{ background: "#0a0a0a", padding: "128px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(36px, 5.5vw, 68px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.03,
              color: "#fff",
              margin: "0 0 24px",
            }}
          >
            შენი მაღაზია 10 წუთში.
          </h2>
          <p
            style={{
              fontSize: 18,
              color: "#636366",
              margin: "0 auto 40px",
              maxWidth: 400,
              lineHeight: 1.5,
            }}
          >
            პირველი შეკვეთა დღეს. ბარათი საჭირო არ არის.
          </p>
          <Link
            href="/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: 16,
              fontWeight: 600,
              color: "#0a0a0a",
              background: "#fff",
              padding: "15px 36px",
              borderRadius: 980,
              textDecoration: "none",
            }}
          >
            დაიწყე უფასოდ
          </Link>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid #e8e8eb", padding: "52px 24px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            className="lp-footer-cols"
            style={{
              display: "grid",
              gridTemplateColumns: "1.8fr 1fr 1fr 1fr",
              gap: 32,
              marginBottom: 40,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-jakarta)",
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  color: "#0a0a0a",
                  marginBottom: 12,
                }}
              >
                MultiStore
              </div>
              <div style={{ fontSize: 14, color: "#888", lineHeight: 1.6, maxWidth: 220 }}>
                ქართული მცირე ბიზნესისთვის. ონლაინ მაღაზია კოდის გარეშე.
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#0a0a0a",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                პროდუქტი
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
                <a href="#features" style={{ color: "#636366", textDecoration: "none" }}>
                  ფუნქციები
                </a>
                <a href="#pricing" style={{ color: "#636366", textDecoration: "none" }}>
                  ფასები
                </a>
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#0a0a0a",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                ანგარიში
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
                <Link href="/login" style={{ color: "#636366", textDecoration: "none" }}>
                  შესვლა
                </Link>
                <Link href="/register" style={{ color: "#636366", textDecoration: "none" }}>
                  რეგისტრაცია
                </Link>
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#0a0a0a",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                სამართლებრივი
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
                <Link href="/terms" style={{ color: "#636366", textDecoration: "none" }}>
                  წესები
                </Link>
                <Link href="/privacy" style={{ color: "#636366", textDecoration: "none" }}>
                  კონფიდენციალურობა
                </Link>
              </div>
            </div>
          </div>
          <div
            style={{ borderTop: "1px solid #e8e8eb", paddingTop: 20, fontSize: 13, color: "#aaa" }}
          >
            © 2026 MultiStore
          </div>
        </div>
      </div>
    </div>
  );
}
