import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "კონფიდენციალურობის პოლიტიკა – MultiStore",
  description: "MultiStore-ის კონფიდენციალურობის პოლიტიკა — როგორ ვაგროვებთ და ვიცავთ თქვენს მონაცემებს.",
};

export default function PrivacyPage() {
  return (
    <div style={{ fontFamily: "var(--font-georgian), sans-serif", color: "#1d1d1f", background: "#fff", minHeight: "100vh" }}>
      {/* Nav */}
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
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", color: "#1d1d1f" }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: "#1d1d1f", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: "#fff" }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>MultiStore</span>
          </Link>
          <div style={{ display: "flex", gap: 20, fontSize: 13.5 }}>
            <Link href="/login" style={{ color: "#1d1d1f", textDecoration: "none" }}>შესვლა</Link>
            <Link href="/register" style={{ color: "#fff", background: "#1d1d1f", padding: "7px 15px", borderRadius: 980, textDecoration: "none", fontWeight: 600 }}>
              დაიწყე
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "72px 28px 100px" }}>
        <p style={{ fontSize: 13, color: "#86868b", marginBottom: 16 }}>ბოლო განახლება: 1 ივლისი, 2026</p>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 12px" }}>
          კონფიდენციალურობის პოლიტიკა
        </h1>
        <p style={{ fontSize: 18, color: "#6e6e73", lineHeight: 1.6, margin: "0 0 56px" }}>
          ჩვენ სერიოზულად ვეკიდებით თქვენი მონაცემების დაცვას. ეს დოკუმენტი განმარტავს რა ინფორმაციას ვაგროვებთ, როგორ ვიყენებთ და როგორ ვიცავთ მას.
        </p>

        <Section title="1. ვინ ვართ ჩვენ">
          <p>მონაცემთა დამუშავებაზე პასუხისმგებელი პირი: <strong>MultiStore</strong>, multistore.ge</p>
          <p>კონტაქტი: <a href="mailto:privacy@multistore.ge" style={{ color: "#1f7a52" }}>privacy@multistore.ge</a></p>
        </Section>

        <Section title="2. რა მონაცემებს ვაგროვებთ">
          <p><strong>ანგარიშის მონაცემები:</strong> სახელი, ელ. ფოსტა, პაროლი (დაშიფრული). ეს მონაცემები შეგყავთ პირდაპირ.</p>
          <p><strong>მაღაზიის მონაცემები:</strong> მაღაზიის სახელი, აღწერა, პროდუქტები, კატეგორიები, შეკვეთები, მომხმარებელთა ინფორმაცია. ეს მონაცემები გენერირდება სერვისის გამოყენებისას.</p>
          <p><strong>ტექნიკური მონაცემები:</strong> IP მისამართი, ბრაუზერის ტიპი, ოპერაციული სისტემა, ვიზიტის დრო, გვერდები. ავტომატურად გროვდება სერვისის სტაბილური მუშაობისთვის.</p>
          <p><strong>გადახდის მონაცემები:</strong> ჩვენ ვერ ვინახავთ ბარათის ნომრებს ან ბანკის დეტალებს. გადახდები მუშავდება სერტიფიცირებული საგადახდო სისტემების მეშვეობით.</p>
        </Section>

        <Section title="3. როგორ ვიყენებთ მონაცემებს">
          <ul>
            <li>სერვისის მიწოდება და ანგარიშის მართვა;</li>
            <li>ტექნიკური პრობლემების გამოვლენა და გადაჭრა;</li>
            <li>უსაფრთხოების უზრუნველყოფა და თაღლითობის პრევენცია;</li>
            <li>სერვისის გაუმჯობესება ანონიმური სტატისტიკის საფუძველზე;</li>
            <li>სავალდებულო სამართლებრივი ვალდებულებების შესასრულებლად;</li>
            <li>ტრანზაქციული შეტყობინებების გაგზავნა (შეკვეთის დადასტურება, პაროლის განახლება).</li>
          </ul>
          <p>ჩვენ <strong>არ</strong> ვყიდით თქვენს პერსონალურ მონაცემებს მესამე მხარეებს.</p>
        </Section>

        <Section title="4. მონაცემთა გაზიარება">
          <p>მონაცემები შეიძლება გადაეცეს:</p>
          <ul>
            <li><strong>ტექნიკური პარტნიორები</strong> — სერვერის ჰოსტინგი, მონაცემთა ბაზა, ელ. ფოსტის სერვისი. ისინი ვალდებულნი არიან დაიცვან მონაცემები.</li>
            <li><strong>საგადახდო სისტემები</strong> — გადახდის დამუშავებისთვის.</li>
            <li><strong>სამართალდამცავი ორგანოები</strong> — კანონმდებლობის მოთხოვნისამებრ.</li>
          </ul>
          <p>სხვა შემთხვევაში მონაცემები არ გადადის მესამე მხარეებს თქვენი პირდაპირი თანხმობის გარეშე.</p>
        </Section>

        <Section title="5. Cookies">
          <p>ჩვენ ვიყენებთ cookies-ებს:</p>
          <ul>
            <li><strong>სავალდებულო:</strong> სესიის მართვა, ანგარიშში შესვლა — ამ გარეშე სერვისი ვერ იმუშავებს.</li>
            <li><strong>ანალიტიკური:</strong> სერვისის სტატისტიკა (ანონიმური) — შეგიძლიათ გამორთოთ ბრაუზერის პარამეტრებში.</li>
          </ul>
        </Section>

        <Section title="6. მონაცემების შენახვის ვადა">
          <ul>
            <li>ანგარიშის მონაცემები — ანგარიშის არსებობის განმავლობაში + 30 დღე გაუქმების შემდეგ;</li>
            <li>შეკვეთების მონაცემები — 7 წელი (სააღრიცხვო კანონმდებლობის მოთხოვნა);</li>
            <li>ტექნიკური ლოგები — 90 დღე.</li>
          </ul>
        </Section>

        <Section title="7. თქვენი უფლებები">
          <p>თქვენ გაქვთ უფლება:</p>
          <ul>
            <li><strong>წვდომა</strong> — მოითხოვოთ თქვენს შესახებ შენახული მონაცემების ასლი;</li>
            <li><strong>გასწორება</strong> — შეასწოროთ არასწორი ინფორმაცია;</li>
            <li><strong>წაშლა</strong> — მოითხოვოთ მონაცემების წაშლა (გარდა კანონმდებლობით განსაზღვრული გამონაკლისებისა);</li>
            <li><strong>გადატანა</strong> — მიიღოთ მონაცემები სტრუქტურირებულ ფორმატში;</li>
            <li><strong>წინააღმდეგობა</strong> — გამოხვიდეთ მარკეტინგული შეტყობინებებიდან.</li>
          </ul>
          <p>მოთხოვნის გასაგზავნად: <a href="mailto:privacy@multistore.ge" style={{ color: "#1f7a52" }}>privacy@multistore.ge</a>. ვუპასუხებთ 30 კალენდარული დღის განმავლობაში.</p>
        </Section>

        <Section title="8. მონაცემების უსაფრთხოება">
          <p>ჩვენ ვიყენებთ ინდუსტრიის სტანდარტული უსაფრთხოების ზომებს: HTTPS დაშიფვრა, პაროლების ჰეშირება, წვდომის კონტროლი. მიუხედავად ამისა, ინტერნეტში გადაცემა 100%-ით უსაფრთხო ვერ იქნება.</p>
        </Section>

        <Section title="9. ბავშვების კონფიდენციალურობა">
          <p>ჩვენი სერვისი განკუთვნილია 18 წელს გადაცილებული პირებისთვის. ჩვენ შეგნებულად არ ვაგროვებთ 18 წლამდე ასაკის პირთა მონაცემებს.</p>
        </Section>

        <Section title="10. ცვლილებები">
          <p>ამ პოლიტიკის განახლებისას შეგატყობინებთ ელ. ფოსტით ან პლატფორმის მეშვეობით. განახლებული ვერსია ძალაში შედის გამოქვეყნებიდან 14 დღის შემდეგ.</p>
        </Section>

        <Section title="11. კონტაქტი">
          <p>კონფიდენციალურობასთან დაკავშირებული კითხვებისთვის: <a href="mailto:privacy@multistore.ge" style={{ color: "#1f7a52" }}>privacy@multistore.ge</a></p>
        </Section>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #e3e3e6", padding: "32px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#86868b", display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "#86868b", textDecoration: "none" }}>← მთავარი</Link>
          <Link href="/terms" style={{ color: "#86868b", textDecoration: "none" }}>წესები და პირობები</Link>
          <span>© 2026 MultiStore</span>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 44 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 14px" }}>{title}</h2>
      <div style={{ fontSize: 15.5, lineHeight: 1.75, color: "#374151", display: "flex", flexDirection: "column", gap: 10 }}>
        {children}
      </div>
    </div>
  );
}
