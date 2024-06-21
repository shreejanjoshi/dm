//  this hook allows to add items to the card
// remove item
// clear the card
// (keep track of cart items)
//  how we do that we can simply create our own store and that is a function that or state management libirary provides to us. We can import create function from zustand

import { Product } from "@/payload-types";
import { create } from "zustand";
// that will gonna store our stuff in local storage
import { createJSONStorage, persist } from "zustand/middleware";

// ------------------------------------------------------------
// ------------------------------------------------------------

// custom types
export type CartItem = {
  product: Product;
};

// ------------------------------------------------------------

type CartState = {
  items: CartItem[];
  //   pass in the product
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  //   we wont resive nothing and return nothing
  clearCart: () => void;
};

// ------------------------------------------------------------
// ------------------------------------------------------------

// for type script to be happy with this -> create() we need to pass in the type of the store of the you know State essentially that we will keeping track of in this hook
// this is how it is done in documentesion
export const useCart = create<CartState>()(
  // regular react state is not persisted when you reload the page or card should be though we want to persist the card
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          return { items: [...state.items, { product }] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      // what our state apperies in our local storage
      name: "cart-storage",
      //   get this from zustand middelware
      storage: createJSONStorage(() => localStorage),
    }
  )
);
