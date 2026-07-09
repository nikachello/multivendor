import CreatorProfile from "./sections/CreatorProfile";
import CreatorLinks from "./sections/CreatorLinks";
import CreatorFeaturedProductSection from "./sections/CreatorFeaturedProductSection";
import CreatorProductGrid from "./sections/CreatorProductGrid";
import CreatorCountdown from "./sections/CreatorCountdown";
import CreatorOfferCards from "./sections/CreatorOfferCards";
import CreatorSocialProofBar from "./sections/CreatorSocialProofBar";
import CreatorShoppableImage from "./sections/CreatorShoppableImage";
import CreatorAvailability from "./sections/CreatorAvailability";
import CreatorPortfolio from "./sections/CreatorPortfolio";
import CreatorBooking from "./sections/CreatorBooking";
import CreatorVideo from "./sections/CreatorVideo";
import CreatorWhatsappCta from "./sections/CreatorWhatsappCta";
import CreatorInfoStrip from "./sections/CreatorInfoStrip";
import { creatorSectionMeta } from "./sectionMeta";
import { creatorConfig } from "./config";
import { ThemeDefinition } from "@/themes/types";

export const creatorTheme: ThemeDefinition = {
  id: "creator",
  name: "Creator",
  description: "Mobile-first bio link storefront for creators, coaches, and social-first shops",
  thumbnail: "/themes/creator-thumb.jpg",
  config: creatorConfig,
  sections: {
    "creator-profile": CreatorProfile,
    "creator-links": CreatorLinks,
    "creator-featured-product": CreatorFeaturedProductSection,
    "creator-product-grid": CreatorProductGrid,
    "creator-countdown": CreatorCountdown,
    "creator-offer-cards": CreatorOfferCards,
    "creator-social-proof-bar": CreatorSocialProofBar,
    "creator-shoppable-image": CreatorShoppableImage,
    "creator-availability": CreatorAvailability,
    "creator-portfolio": CreatorPortfolio,
    "creator-booking": CreatorBooking,
    "creator-video": CreatorVideo,
    "creator-whatsapp-cta": CreatorWhatsappCta,
    "creator-info-strip": CreatorInfoStrip,
  },
  sectionMeta: creatorSectionMeta,
};
