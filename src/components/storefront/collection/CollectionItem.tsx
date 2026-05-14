"use client";
import { Product } from "@/lib/types";
import { useShopStore } from "@/lib/store/useShopStore";

type Props = {
  product: Product;
};

const CollectionItem = ({ product }: Props) => {
  const currency = useShopStore((state) => state.currency);
  return (
    <div className="space-y-2">
      <div className="bg-gray-100 aspect-square flex items-center justify-center"></div>
      <div>
        <p>{product.name}</p>
        <p>
          {currency} {product.priceFrom}
        </p>
      </div>
    </div>
  );
};

export default CollectionItem;
