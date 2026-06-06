import { ShopSection } from "@/lib/types/store-section";
import { pros, shopTestimonials } from "@/lib/mock-data";

export const shopSections: Record<string, ShopSection[]> = {
  shop_1: [
    {
      id: "announcement_1",
      type: "announcement",
      props: {
        text: "უფასო მიტანა",
        bgColor: "#F5D7C7",
        textColor: "#000000",
      },
    },
    {
      id: "navbar_1",
      type: "navbar",
      props: {
        items: [
          { type: "link", label: "Home", href: "/" },

          {
            type: "group",
            label: "Shop",
            children: [
              { type: "link", label: "Watches", href: "/shop/watches" },
              { type: "link", label: "Accessories", href: "/shop/accessories" },
              { type: "link", label: "Jewelry", href: "/shop/jewelry" },
            ],
          },

          { type: "link", label: "Journal", href: "/journal" },
          { type: "link", label: "About us", href: "/about" },
        ],
      },
    },
    {
      id: "banner_1",
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
      id: "categories_1",
      type: "categories",
      props: {
        title: "კატეგორიები",
        categoryIds: [],
        columns: 4,
      },
    },
    {
      id: "collection_1",
      type: "collection",
      props: { categoryId: "cat_1" },
    },
    {
      id: "pros_1",
      type: "pros",
      props: { pros },
    },
    {
      id: "testimonials_1",
      type: "testimonials",
      props: { testimonials: shopTestimonials },
    },
    {
      id: "collection_2",
      type: "collection",
      props: { categoryId: "cat_2" },
    },
  ],
};
