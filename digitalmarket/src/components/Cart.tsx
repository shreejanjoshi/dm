"use client";

// ------------------------------------------------------------
// ------------------------------------------------------------

import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import CartItem from "./CartItem";
import { useEffect, useState } from "react";

// ------------------------------------------------------------
// ------------------------------------------------------------

const Cart = () => {
  const { items } = useCart();
  const itemCount = items.length;

  // ------------------------------------------------------------

  //   error like "text content does not match server-rendered HTML" because we maintain itemor card state in loacl storage which is purly client side and the server doesnt have access to it. What that means is that the html between server and client will be different on the server it will be 0 beacuse there is no local storage and the client when we hydrate this then we wilol have one item  in our card to completely avoid this issue we can this.Keep track of whetather our compentent is already mounted or not we are going to do that instead of used staed in our card that doesnt go in the card item this will happen in cart.tsx compentent... min 8:36:00
  // i think isMounted is not necessery now
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // onces this componetent mount we get notified of that inside of use effect and can set is mounted state to true
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ------------------------------------------------------------

  // we can also calculate total amount of product prices in our cart to do that we do this
  // we use reduces so we can reduces an array to one single value an dthis give us two things the total and also the current products
  // reduces -> it will go over evry item and we start at zero, that we need to pass default at last
  const cartTotal = items.reduce(
    (total, { product }) => total + product.price,
    0
  );

  // ------------------------------------------------------------

  const fee = 1;

  // ------------------------------------------------------------

  return (
    <Sheet>
      <SheetTrigger className="group -m-2 flex items-center p-2">
        <ShoppingCart
          aria-hidden="true"
          className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
        />

        {/* amount of item in shopping cart */}
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {isMounted ? itemCount : 0}
        </span>
      </SheetTrigger>

      {/* what will be inside sidebar */}
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart ({itemCount})</SheetTitle>
        </SheetHeader>

        {itemCount > 0 ? (
          <>
            <div className="flex w-full flex-col pr-6">
              {/* TODO: cart logic */}
              <ScrollArea>
                {items.map(({ product }) => (
                  <CartItem product={product} key={product.id} />
                ))}
              </ScrollArea>
            </div>
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Transaction Fee</span>
                  <span>{formatPrice(fee)}</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(cartTotal + fee)}</span>
                </div>
              </div>

              <SheetFooter>
                {/* by default it will create an entire button elemet so whatever we wrap in it will be wrap in button  element with the aschild we can disable that default behavior and provide our own element like link component */}
                <SheetTrigger asChild>
                  <Link
                    href="/cart"
                    className={buttonVariants({ className: "w-full" })}
                  >
                    Continue to Checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div
              aria-hidden="true"
              className="relative mb-4 h-60 w-60  text-muted-foreground"
            >
              <Image src="/hippo-empty-cart.png" fill alt="empty cart hippo" />
            </div>

            <div className="text-xl font-semibold">Your cart is empty</div>

            <SheetTrigger asChild>
              <Link
                href="/product"
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "text-sm text-muted-foreground",
                })}
              >
                Add items to your cart to checkout
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

// ------------------------------------------------------------
// ------------------------------------------------------------

export default Cart;
