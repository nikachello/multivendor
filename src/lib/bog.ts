import crypto from "crypto";

const BOG_AUTH_URL = "https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token";
const BOG_ORDERS_URL = "https://api.bog.ge/payments/v1/ecommerce/orders";

const BOG_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu4RUyAw3+CdkS3ZNILQh
zHI9Hemo+vKB9U2BSabppkKjzjjkf+0Sm76hSMiu/HFtYhqWOESryoCDJoqffY0Q
1VNt25aTxbj068QNUtnxQ7KQVLA+pG0smf+EBWlS1vBEAFbIas9d8c9b9sSEkTrr
TYQ90WIM8bGB6S/KLVoT1a7SnzabjoLc5Qf/SLDG5fu8dH8zckyeYKdRKSBJKvhx
tcBuHV4f7qsynQT+f2UYbESX/TLHwT5qFWZDHZ0YUOUIvb8n7JujVSGZO9/+ll/g
4ZIWhC1MlJgPObDwRkRd8NFOopgxMcMsDIZIoLbWKhHVq67hdbwpAq9K9WMmEhPn
PwIDAQAB
-----END PUBLIC KEY-----`;

async function getAccessToken(): Promise<string> {
  const clientId = process.env.BOG_CLIENT_ID!;
  const clientSecret = process.env.BOG_CLIENT_SECRET!;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(BOG_AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error(`BOG auth failed: ${res.status}`);
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

export async function createBogOrder({
  shopId,
  amountGel,
  callbackUrl,
  successUrl,
  failUrl,
}: {
  shopId: string;
  amountGel: number;
  callbackUrl: string;
  successUrl: string;
  failUrl: string;
}): Promise<{ orderId: string; redirectUrl: string }> {
  const token = await getAccessToken();

  const res = await fetch(BOG_ORDERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Accept-Language": "ka",
    },
    body: JSON.stringify({
      callback_url: callbackUrl,
      external_order_id: `sub_${shopId}`,
      purchase_units: {
        currency: "GEL",
        total_amount: amountGel,
        basket: [
          {
            product_id: "platform_subscription",
            description: "Multistore Platform Subscription",
            quantity: 1,
            unit_price: amountGel,
          },
        ],
      },
      redirect_urls: {
        success: successUrl,
        fail: failUrl,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`BOG order failed: ${res.status} — ${body}`);
  }

  const data = await res.json() as {
    id: string;
    _links: { redirect: { href: string } };
  };

  return { orderId: data.id, redirectUrl: data._links.redirect.href };
}

export function verifyBogCallback(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  // Node's crypto module wants OpenSSL digest names ("RSA-SHA256"), not the
  // Java/JCA name ("SHA256withRSA") — the latter threw "Invalid digest" here,
  // which a broad try/catch previously swallowed into "false" for every call,
  // silently killing all subscription billing. createVerify is left outside
  // the try so a real config/algorithm error throws loudly instead of hiding
  // as a 401. Only malformed attacker-supplied signature bytes are caught.
  const verify = crypto.createVerify("RSA-SHA256");
  verify.update(rawBody, "utf8");
  try {
    return verify.verify(BOG_PUBLIC_KEY, signature, "base64");
  } catch (e) {
    console.error("[bog] malformed callback signature:", e);
    return false;
  }
}
