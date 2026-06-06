import { StoreSection } from "./types/store-section";
import { pros, shopTestimonials } from "./mock-data";

export const homepageSections: StoreSection[] = [
  {
    id: "1",
    type: "banner",
    props: {
      title: "აწიე შოპინგის ხარისხი",
      subtitle: "Discover curated products",
      image: "/banner.jpg",
      buttonText: "იშოპინგე",
      href: "/shop",
    },
  },

  {
    id: "2",
    type: "pros",
    props: {
      pros,
    },
  },

  {
    id: "3",
    type: "testimonials",
    props: {
      testimonials: shopTestimonials,
    },
  },
];
