import Link from "next/link";

type Props = {
  phone?: string;
  message?: string;
  label?: string;
  shopName?: string;
};

function buildWhatsAppUrl(phone: string, message: string) {
  const clean = phone.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export default function CreatorWhatsappCta({
  phone = "",
  message,
  label = "Order via WhatsApp",
  shopName = "",
}: Props) {
  if (!phone) return null;

  const defaultMessage = message ?? `Hi! I found you on ${shopName} and I'd like to place an order.`;
  const href = buildWhatsAppUrl(phone, defaultMessage);

  return (
    <section
      className="px-5 py-4 max-w-[600px] mx-auto w-full"
      style={{ fontFamily: "var(--creator-body-font)" }}
    >
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 h-14 w-full rounded-2xl text-white text-base font-semibold shadow-sm active:scale-[0.98] transition-transform"
        style={{ backgroundColor: "#25D366" }}
      >
        {/* WhatsApp icon */}
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.11 1.523 5.84L.057 23.269a.75.75 0 00.917.918l5.43-1.467A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.712 9.712 0 01-4.94-1.35l-.354-.212-3.668.991.99-3.668-.212-.354A9.712 9.712 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
        </svg>
        {label}
      </Link>
    </section>
  );
}
