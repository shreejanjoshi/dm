//  this hook allows to add items to the card
// remove item
// clear the card
// (keep track of cart items)
//  how we do that we can simply create our own store and that is a function that or state management libirary provides to us. We can import create function from zustand

import { create } from "zustand";

export const useCart = create
