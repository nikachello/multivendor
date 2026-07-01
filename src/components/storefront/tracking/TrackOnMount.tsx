"use client";

import { useEffect } from "react";
import { trackInitiateCheckout, trackPurchase, trackGoogleAdsConversion } from "@/lib/tracking";

type InitiateCheckoutProps = {
  event: "InitiateCheckout";
  value: number;
  currency: string;
  numItems: number;
};

type PurchaseProps = {
  event: "Purchase";
  orderId: string;
  value: number;
  currency: string;
  items: { id: string; name: string; price: number; quantity: number }[];
  googleAdsConversionTarget?: string; // "AW-XXXXXXXXX/LABEL" — fires Google Ads conversion if set
};

type Props = InitiateCheckoutProps | PurchaseProps;

export default function TrackOnMount(props: Props) {
  useEffect(() => {
    if (props.event === "InitiateCheckout") {
      trackInitiateCheckout(props.value, props.currency, props.numItems);
    } else {
      trackPurchase(props.orderId, props.value, props.currency, props.items);
      if (props.googleAdsConversionTarget) {
        trackGoogleAdsConversion(props.googleAdsConversionTarget, props.value, props.currency, props.orderId);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
