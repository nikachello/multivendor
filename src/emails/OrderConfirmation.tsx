import React from "react";
import {
  Html,
  Body,
  Head,
  Preview,
  Section,
  Row,
  Column,
  Text,
  Heading,
  Hr,
} from "@react-email/components";

type Props = {
  orderId: string;
  customerName: string;
  shopName: string;
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

const OrderConfirmation = ({
  orderId,
  currency,
  customerName,
  items,
  shippingAddress,
  shopName,
  total,
}: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Your order from {shopName} is confirmed</Preview>
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f9f9f9" }}>
        <Section
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: 24,
            backgroundColor: "#fff",
          }}
        >
          <Heading>Order confirmed</Heading>
          <Text>
            Thanks {customerName}, your order #{orderId.slice(0, 8)} is placed.
          </Text>
          <Hr />
          {items.map((item, i) => (
            <Row key={i} style={{ marginBottom: 12 }}>
              <Column>
                <Text style={{ margin: 0, fontWeight: "bold" }}>{item.productName}</Text>
                <Text style={{ margin: 0, color: "#666", fontSize: 13 }}>{item.variantOptions}</Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={{ margin: 0 }}>x{item.quantity}</Text>
                <Text style={{ margin: 0 }}>{currency} {(item.price * item.quantity).toFixed(2)}</Text>
              </Column>
            </Row>
          ))}
          <Hr />
          <Text style={{ fontWeight: "bold" }}>Shipping to</Text>
          <Text style={{ margin: 0 }}>{shippingAddress.name}</Text>
          <Text style={{ margin: 0 }}>{shippingAddress.line1}</Text>
          <Text style={{ margin: 0 }}>{shippingAddress.city}, {shippingAddress.country}</Text>
          <Hr />
          <Row>
            <Column><Text style={{ fontWeight: "bold" }}>Total</Text></Column>
            <Column style={{ textAlign: "right" }}>
              <Text style={{ fontWeight: "bold" }}>{currency} {total.toFixed(2)}</Text>
            </Column>
          </Row>
        </Section>
      </Body>
    </Html>
  );
};

export default OrderConfirmation;
