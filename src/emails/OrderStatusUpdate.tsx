import {
  Html,
  Body,
  Head,
  Preview,
  Section,
  Text,
  Heading,
  Hr,
} from "@react-email/components";

type Props = {
  shopName: string;
  orderId: string;
  customerName: string;
  status: string;
  currency: string;
  total: number;
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

const STATUS_MESSAGES: Record<string, string> = {
  confirmed: "Your order has been confirmed and will be prepared shortly.",
  processing: "Your order is being processed.",
  shipped: "Your order is on its way! You should receive it soon.",
  delivered: "Your order has been delivered. Thank you for shopping with us!",
  cancelled: "Your order has been cancelled. If you have questions, please contact us.",
  refunded: "Your order has been refunded. It may take a few days to appear on your account.",
};

export default function OrderStatusUpdate({
  shopName,
  orderId,
  customerName,
  status,
  currency,
  total,
}: Props) {
  const label = STATUS_LABELS[status] ?? status;
  const message = STATUS_MESSAGES[status] ?? "Your order status has been updated.";
  const firstName = customerName.split(" ")[0];

  return (
    <Html>
      <Head />
      <Preview>
        Order #{orderId.slice(-8).toUpperCase()} — {label}
      </Preview>
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f9f9f9", padding: "40px 0" }}>
        <Section style={{ maxWidth: 520, margin: "0 auto", backgroundColor: "#ffffff", padding: "40px", borderRadius: 4 }}>
          <Heading style={{ fontSize: 20, fontWeight: 600, color: "#111", marginBottom: 8 }}>
            {shopName}
          </Heading>
          <Hr style={{ borderColor: "#eee", margin: "16px 0" }} />

          <Heading style={{ fontSize: 16, fontWeight: 600, color: "#111", marginBottom: 4 }}>
            Order update — {label}
          </Heading>
          <Text style={{ color: "#555", fontSize: 14, marginTop: 4 }}>
            Hi {firstName}, {message}
          </Text>

          <Hr style={{ borderColor: "#eee", margin: "24px 0" }} />

          <Section style={{ backgroundColor: "#f5f5f5", padding: "16px 20px", borderRadius: 4 }}>
            <Text style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>
              Order
            </Text>
            <Text style={{ color: "#111", fontFamily: "monospace", fontSize: 14, margin: "4px 0 0" }}>
              #{orderId.slice(-8).toUpperCase()}
            </Text>
            <Text style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, margin: "12px 0 0" }}>
              Total
            </Text>
            <Text style={{ color: "#111", fontSize: 14, margin: "4px 0 0" }}>
              {currency} {total.toFixed(2)}
            </Text>
          </Section>
        </Section>
      </Body>
    </Html>
  );
}
