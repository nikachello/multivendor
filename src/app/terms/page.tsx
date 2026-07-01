import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "წესები და პირობები – MultiStore",
  description: "MultiStore პლატფორმის გამოყენების წესები და პირობები.",
};

export default function TermsPage() {
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
          წესები და პირობები
        </h1>
        <p style={{ fontSize: 18, color: "#6e6e73", lineHeight: 1.6, margin: "0 0 56px" }}>
          გთხოვთ, ყურადღებით წაიკითხოთ ეს დოკუმენტი MultiStore პლატფორმის გამოყენებამდე.
        </p>

        <Section title="1. ზოგადი დებულებები">
          <p>MultiStore („პლატფორმა", „ჩვენ", „სერვისი") არის ონლაინ სერვისი, რომელიც საშუალებას აძლევს მომხმარებლებს შექმნან და მართონ ონლაინ მაღაზია. პლატფორმით სარგებლობით თქვენ ეთანხმებით წინამდებარე წესებსა და პირობებს.</p>
          <p>თუ არ ეთანხმებით ამ წესებს, გთხოვთ, არ გამოიყენოთ პლატფორმა.</p>
        </Section>

        <Section title="2. ანგარიშის შექმნა">
          <p>MultiStore-ით სარგებლობისთვის საჭიროა ანგარიშის რეგისტრაცია. ანგარიშის შექმნით თქვენ ადასტურებთ, რომ:</p>
          <ul>
            <li>გაქვთ სულ მცირე 18 წლის ასაკი;</li>
            <li>მოწოდებული ინფორმაცია სწორი და სრულია;</li>
            <li>პასუხისმგებელი ხართ ანგარიშის უსაფრთხოებაზე და პაროლის კონფიდენციალურობაზე;</li>
            <li>ყოველგვარი ანგარიშიდან განხორციელებული მოქმედება თქვენს პასუხისმგებლობაში შედის.</li>
          </ul>
        </Section>

        <Section title="3. სერვისის აღწერა">
          <p>MultiStore გაძლევთ შესაძლებლობას:</p>
          <ul>
            <li>შექმნათ და მართოთ ონლაინ მაღაზია;</li>
            <li>დაამატოთ პროდუქტები, კატეგორიები და ფასები;</li>
            <li>მართოთ შეკვეთები და მომხმარებლები;</li>
            <li>გამოიყენოთ მზა თემები მაღაზიის დიზაინისთვის;</li>
            <li>მიიღოთ გადახდები (სერვისის ხელმისაწვდომობის შემდეგ).</li>
          </ul>
          <p>ჩვენ ვიტოვებთ უფლებას შევცვალოთ, შეჩერებული ან გავაუქმოთ სერვისის ნებისმიერი ასპექტი ნებისმიერ დროს.</p>
        </Section>

        <Section title="4. გამოყენების წესები">
          <p>პლატფორმის გამოყენებით თქვენ ეთანხმებით, რომ არ:</p>
          <ul>
            <li>გაავრცელებთ უკანონო, შეურაცხმყოფელ ან სხვისი უფლებების დამრღვევ კონტენტს;</li>
            <li>გამოიყენებთ პლატფორმას თაღლითური ან მატყუარა ინფორმაციის გასავრცელებლად;</li>
            <li>გაყიდით აკრძალულ საქონელს (იარაღი, ნარკოტიკი, ყალბი პროდუქტი და სხვ.);</li>
            <li>შეეცდებით სისტემის უსაფრთხოების გვერდის ავლას;</li>
            <li>გამოიყენებთ ავტომატური სკრეიფინგის ან ბოტ-ტრაფიკის ინსტრუმენტებს.</li>
          </ul>
        </Section>

        <Section title="5. გადახდა და ტარიფები">
          <p><strong>უფასო გეგმა</strong> — 10 პროდუქტამდე, 1 თემა. ღირებულება: ₾0.</p>
          <p><strong>Pro გეგმა</strong> — ულიმიტო პროდუქტები, ყველა თემა, მიწოდების ზონები. ღირებულება: ₾29/თვეში.</p>
          <p>გამოწერა ავტომატურად განახლდება ყოველთვიურად. გაუქმება შესაძლებელია ნებისმიერ დროს dashboard-ის პარამეტრებიდან. გაუქმების შემდეგ ანგარიში რჩება აქტიური მიმდინარე ბილინგის პერიოდის ბოლომდე.</p>
          <p>ჩვენ ვიტოვებთ უფლებას შევცვალოთ ფასები 30-დღიანი წინასწარი შეტყობინებით.</p>
        </Section>

        <Section title="6. ინტელექტუალური საკუთრება">
          <p>პლატფორმის დიზაინი, კოდი, ლოგო და შინაარსი MultiStore-ის საკუთრებაა და დაცულია საავტორო უფლებებით. თქვენ იძენთ შეზღუდულ, არაექსკლუზიურ, გადასაცემ-გაუცვლელ ლიცენზიას პლატფორმის გამოყენებისთვის.</p>
          <p>მაღაზიაში განთავსებული კონტენტი (ფოტოები, ტექსტები, პროდუქტები) თქვენი საკუთრებაა. თქვენ გვაძლევთ ნებართვას გამოვიყენოთ ეს კონტენტი სერვისის მიწოდებისთვის.</p>
        </Section>

        <Section title="7. კონფიდენციალურობა">
          <p>პლატფორმის გამოყენებისას შეგროვებული მონაცემები ექვემდებარება ჩვენს <Link href="/privacy" style={{ color: "#1f7a52" }}>კონფიდენციალურობის პოლიტიკას</Link>, რომელიც ამ წესების განუყოფელი ნაწილია.</p>
        </Section>

        <Section title="8. პასუხისმგებლობის შეზღუდვა">
          <p>MultiStore სერვისი გაგეწევა „როგორც არის" (as-is) პრინციპით. ჩვენ არ გვაქვს გარანტია უწყვეტ, შეუფერხებელ ან შეცდომებისგან თავისუფალ მუშაობაზე.</p>
          <p>ჩვენი პასუხისმგებლობა ნებისმიერ შემთხვევაში შეზღუდულია თქვენ მიერ ბოლო 3 თვეში გადახდილი თანხით.</p>
        </Section>

        <Section title="9. შეწყვეტა">
          <p>ჩვენ ვიტოვებთ უფლებას შეგიჩეროთ ან გაგიუქმოთ ანგარიში წინამდებარე წესების დარღვევის შემთხვევაში. სერიოზული დარღვევისას (თაღლითობა, უკანონო კონტენტი) გაუქმება შეიძლება განხორციელდეს გაფრთხილების გარეშე.</p>
          <p>გაუქმების შემდეგ თქვენი მონაცემები შეინახება 30 დღის განმავლობაში, რის შემდეგაც წაიშლება.</p>
        </Section>

        <Section title="10. მარეგულირებელი კანონმდებლობა">
          <p>ეს წესები და პირობები რეგულირდება საქართველოს კანონმდებლობით. ნებისმიერი დავა განიხილება საქართველოს კომპეტენტური სასამართლოს მიერ.</p>
        </Section>

        <Section title="11. ცვლილებები">
          <p>ჩვენ შეიძლება დროდადრო განვაახლოთ ეს წესები. მნიშვნელოვანი ცვლილებების შემთხვევაში შეგატყობინებთ ელ. ფოსტით ან პლატფორმის მეშვეობით. გამოყენების გაგრძელება ახალი წესების მიღებად ჩაითვლება.</p>
        </Section>

        <Section title="12. კონტაქტი">
          <p>კითხვების შემთხვევაში მოგვწერეთ: <a href="mailto:support@multistore.ge" style={{ color: "#1f7a52" }}>support@multistore.ge</a></p>
        </Section>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #e3e3e6", padding: "32px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#86868b", display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "#86868b", textDecoration: "none" }}>← მთავარი</Link>
          <Link href="/privacy" style={{ color: "#86868b", textDecoration: "none" }}>კონფიდენციალურობა</Link>
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
