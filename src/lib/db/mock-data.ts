import { NavItem } from "@/lib/types/sections";
import { Pro } from "../types/data-types";

export const mainMenu: NavItem[] = [
  {
    id: "1",
    type: "link",
    label: "Home",
    href: "/",
  },
  {
    id: "2",
    type: "group",
    label: "Shop",
    children: [
      {
        id: "3",
        type: "link",
        label: "Luxury Watches",
        href: "/collections/luxury-watches",
      },
      {
        id: "4",
        type: "link",
        label: "Sport Watches",
        href: "/collections/sport-watches",
      },
    ],
  },
  {
    id: "5",
    type: "link",
    label: "About",
    href: "/about",
  },
];

export const pros: Pro[] = [
  {
    type: "pro",
    title: "1. ხარისხი",
    description:
      "ჩვენთან არის უმაღლესი ხარისხი, რომლის შეძენისას გარანტიები გექნებათ",
  },
  {
    type: "image",
    imageUrl: "/banner.jpg",
  },
  {
    type: "pro",
    title: "1. ხარისხი",
    description:
      "ჩვენთან არის უმაღლესი ხარისხი, რომლის შეძენისას გარანტიები გექნებათ",
    buttonText: "ნახეთ ყველაფერი",
    buttonUrl: "/all",
  },
];
