import React from "react";
import { Resend } from "resend";
import { render } from "@react-email/components";
import OrderConfirmation from "@/emails/OrderConfirmation";

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
