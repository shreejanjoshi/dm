"use client";

// ------------------------------------------------------------
// ------------------------------------------------------------

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/payload-types";

// ------------------------------------------------------------
// ------------------------------------------------------------

const AddToCartButton = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // ------------------------------------------------------------

  useEffect(
    () => {
      const timeout = setTimeout(() => {
        setIsSuccess(false);
      }, 2000);

      return () => clearTimeout(timeout);
    },
    //   when ever isSuccess state changes this use effect should run
    [isSuccess]
  );

  // ------------------------------------------------------------

  return (
    <Button
      onClick={() => {
        // this will add the currecnt item to the shopping cart
        addItem(product);
        setIsSuccess(true);
      }}
      size="lg"
      className="w-full"
    >
      {isSuccess ? "Added!" : "Add to cart"}
    </Button>
  );
};

// ------------------------------------------------------------
// ------------------------------------------------------------

export default AddToCartButton;
