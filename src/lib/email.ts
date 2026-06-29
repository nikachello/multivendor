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

export const sendPasswordResetEmail = async ({ to, url }: { to: string; url: string }) => {
  await resend.emails.send({
    from: "orders@resend.dev",
    to,
    subject: "Reset your password",
    html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px">
      <h2 style="font-size:18px;font-weight:600;color:#111;margin-bottom:8px">Reset your password</h2>
      <p style="font-size:14px;color:#555;margin-bottom:24px">Click the button below to reset your password. This link expires in 1 hour.</p>
      <a href="${url}" style="display:inline-block;background:#111;color:#fff;font-size:13px;padding:12px 24px;text-decoration:none">Reset password</a>
      <p style="font-size:12px;color:#999;margin-top:24px">If you didn't request this, you can ignore this email.</p>
    </div>`,
  });
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
