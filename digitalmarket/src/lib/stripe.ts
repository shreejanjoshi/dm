// the reason why we write Stripe in capitalized so that we can export the lowercase from this file and not get the naming config
import Stripe from "stripe";

// min : 9:29:00
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
  typescript: true,
});
