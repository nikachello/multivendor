import React from "react";
import { Resend } from "resend";
import { render } from "@react-email/components";
import OrderConfirmation from "@/emails/OrderConfirmation";
import OrderStatusUpdate from "@/emails/OrderStatusUpdate";

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not set — emails will not be sent");
}

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderConfirmationProps = {
  to: string;
  shopName: string;
  orderId: string;
  customerName: string;
  items: {
    productName: string;
    variantOptions: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  currency: string;
  shippingAddress: {
    name: string;
    line1: string;
    city: string;
    country: string;
  };
};

export const sendOrderConfirmation = async (props: OrderConfirmationProps) => {
  const html = await render(React.createElement(OrderConfirmation, props));
  await resend.emails.send({
    from: "orders@resend.dev",
    to: props.to,
    subject: `Order confirmed — ${props.shopName}`,
    html,
  });
};

type OrderStatusUpdateProps = {
  to: string;
  shopName: string;
  orderId: string;
  customerName: string;
  status: string;
  currency: string;
  total: number;
};

const STATUS_SUBJECT_LABELS: Record<string, string> = {
  confirmed: "Confirmed", processing: "Processing", shipped: "Shipped",
  delivered: "Delivered", cancelled: "Cancelled", refunded: "Refunded",
};

export const sendOrderStatusUpdate = async (props: OrderStatusUpdateProps) => {
  const html = await render(React.createElement(OrderStatusUpdate, props));
  const label = STATUS_SUBJECT_LABELS[props.status] ?? props.status;
  await resend.emails.send({
    from: "orders@resend.dev",
    to: props.to,
    subject: `Order #${props.orderId.slice(-8).toUpperCase()} ${label} — ${props.shopName}`,
    html,
  });
};
