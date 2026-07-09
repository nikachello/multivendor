type ShopInfo = { name: string; email: string; slug: string };
type PageTemplate = { slug: string; title: string; content: string };

export function getLegalPageTemplates(shop: ShopInfo): PageTemplate[] {
  const year = new Date().getFullYear();
  return [
    { slug: "privacy-policy", title: "Privacy Policy", content: privacyPolicy(shop, year) },
    { slug: "terms", title: "Terms & Conditions", content: termsAndConditions(shop, year) },
    { slug: "returns", title: "Return & Refund Policy", content: returnPolicy(shop) },
    { slug: "shipping", title: "Shipping Policy", content: shippingPolicy(shop) },
  ];
}

function privacyPolicy({ name, email }: ShopInfo, year: number): string {
  return `<h1>Privacy Policy</h1>
<p><em>Last updated: ${year}</em></p>

<p>${name} ("we", "our", or "us") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our store or make a purchase.</p>

<h2>Information We Collect</h2>
<p>When you place an order we collect your name, email address, phone number, and shipping address. We also collect information you voluntarily provide, such as order notes.</p>

<h2>How We Use Your Information</h2>
<ul>
  <li>To process and fulfill your orders</li>
  <li>To send order confirmations and shipping updates</li>
  <li>To respond to your questions and support requests</li>
  <li>To improve our store and customer experience</li>
</ul>

<h2>Data Sharing</h2>
<p>We do not sell or rent your personal data. We may share information with trusted service providers who assist in operating our store (payment processors, shipping carriers) under strict confidentiality agreements.</p>

<h2>Cookies</h2>
<p>Our store may use cookies to remember your cart and preferences. You can disable cookies in your browser settings, though some features may not work correctly.</p>

<h2>Data Retention</h2>
<p>We retain your order information for as long as necessary to fulfill our legal and business obligations.</p>

<h2>Your Rights</h2>
<p>You have the right to access, correct, or request deletion of your personal data. Contact us at <a href="mailto:${email}">${email}</a> to exercise these rights.</p>

<h2>Contact</h2>
<p>Questions about this policy? Email us at <a href="mailto:${email}">${email}</a>.</p>`;
}

function termsAndConditions({ name, email }: ShopInfo, year: number): string {
  return `<h1>Terms &amp; Conditions</h1>
<p><em>Last updated: ${year}</em></p>

<p>By accessing or purchasing from ${name}, you agree to these Terms &amp; Conditions. Please read them carefully.</p>

<h2>Products &amp; Pricing</h2>
<p>We reserve the right to modify prices and product availability at any time. All prices are displayed in the currency shown at checkout. We make every effort to display product information accurately, but we do not warrant that descriptions or images are error-free.</p>

<h2>Orders &amp; Payment</h2>
<p>By placing an order you confirm that the information you provide is accurate and complete. We reserve the right to refuse or cancel any order at our discretion, including cases of suspected fraud or pricing errors.</p>

<h2>Intellectual Property</h2>
<p>All content on this store — including text, images, logos, and graphics — is the property of ${name} and may not be reproduced without permission.</p>

<h2>Limitation of Liability</h2>
<p>To the fullest extent permitted by law, ${name} shall not be liable for any indirect, incidental, or consequential damages arising from your use of our store or products.</p>

<h2>Governing Law</h2>
<p>These terms are governed by applicable local law. Any disputes shall be resolved in the courts of the relevant jurisdiction.</p>

<h2>Changes to Terms</h2>
<p>We may update these terms at any time. Continued use of our store after changes constitutes acceptance of the updated terms.</p>

<h2>Contact</h2>
<p>Questions? Reach us at <a href="mailto:${email}">${email}</a>.</p>`;
}

function returnPolicy({ name, email }: ShopInfo): string {
  return `<h1>Return &amp; Refund Policy</h1>

<p>We want you to be completely satisfied with your purchase from ${name}. If something isn't right, we're here to help.</p>

<h2>Return Window</h2>
<p>You may request a return within <strong>14 days</strong> of receiving your order.</p>

<h2>Eligibility</h2>
<p>To be eligible for a return, items must be:</p>
<ul>
  <li>Unused and in the same condition as received</li>
  <li>In their original packaging</li>
  <li>Accompanied by proof of purchase</li>
</ul>

<h2>Non-Returnable Items</h2>
<p>The following items cannot be returned: perishable goods, digital downloads, custom or personalised orders, and items marked as final sale.</p>

<h2>How to Start a Return</h2>
<p>Contact us at <a href="mailto:${email}">${email}</a> with your order number and the reason for your return. We will provide return instructions within 2 business days.</p>

<h2>Refunds</h2>
<p>Once we receive and inspect your return, we will notify you of the approval or rejection. Approved refunds are processed within <strong>5–10 business days</strong> to your original payment method.</p>

<h2>Exchanges</h2>
<p>If you received a damaged or defective item, contact us and we will arrange a replacement at no extra cost.</p>

<h2>Return Shipping</h2>
<p>Unless the item is defective or we made an error, return shipping costs are the responsibility of the customer.</p>`;
}

function shippingPolicy({ name, email }: ShopInfo): string {
  return `<h1>Shipping Policy</h1>

<p>Thank you for shopping with ${name}. Below you'll find everything you need to know about our shipping process.</p>

<h2>Processing Time</h2>
<p>Orders are processed within <strong>1–3 business days</strong> of payment confirmation. Orders placed on weekends or public holidays are processed on the next business day.</p>

<h2>Delivery Times</h2>
<p>Estimated delivery times after dispatch:</p>
<ul>
  <li><strong>Standard shipping:</strong> 3–7 business days</li>
  <li><strong>Express shipping:</strong> 1–3 business days (where available)</li>
</ul>
<p>Delivery times are estimates and may vary due to carrier delays, weather, or other factors outside our control.</p>

<h2>Shipping Costs</h2>
<p>Shipping rates are calculated at checkout based on your location and chosen delivery method. Free shipping may be available on orders over a specified amount — check the checkout page for current thresholds.</p>

<h2>Order Tracking</h2>
<p>Once your order is dispatched, you will receive a confirmation email. Contact us at <a href="mailto:${email}">${email}</a> if you have questions about your delivery.</p>

<h2>Undeliverable Packages</h2>
<p>If a package is returned to us as undeliverable due to an incorrect address provided by the customer, re-shipment costs are the responsibility of the customer.</p>

<h2>Contact</h2>
<p>Questions about your shipment? Email us at <a href="mailto:${email}">${email}</a>.</p>`;
}
