import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../get-payload";
import { stripe } from "../lib/stripe";
// 9:35:00
import type Stripe from "stripe";

// ------------------------------------------------------------
// ------------------------------------------------------------

export const paymentRouter = router({
  // in place of public procedure that we have for example in our index file one that evryone can call now we want to call only logged in user can call
  //   onces we have the private procedure in our payment router we can get the user from it
  createSession: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      let { productIds } = input;

      // ------------------------------------------------------------

      //   if no products id so no checkout request
      if (productIds.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      // ------------------------------------------------------------

      //   get the actualproduct that are passed from productsId
      const payload = await getPayloadClient();

      // ------------------------------------------------------------

      // we have pricesid and stripe id this is whats gooing to allow us to securely create the checkout session
      // 9:26:00
      const { docs: products } = await payload.find({
        collection: "products",
        // where do we want to find the product basiclly where the id of the product is in an array in the productIds array
        where: {
          id: {
            in: productIds,
          },
        },
      });

      // ------------------------------------------------------------

      // to create the checkout session for those products in order to craete those checkout session we we need stripe.So we create little help to access stripe. SZo we create stripe.ts
      // only if it is valid boolen price ID so if it is a you know string that exits beacuse it doesn't have to then it will be included in the filtered products
      const filteredProducts = products.filter((prod) => Boolean(prod.priceId));

      // ------------------------------------------------------------

      // we need to create the order in our database to later see which items are in there and has it been paid or not beforehand and that id is going to go right here
      const order = await payload.create({
        collection: "orders",
        data: {
          _isPaid: false,
          // we only want to add those product where we are 100% sure that they have a price id beacuse thats what we need to sucessfully create the checkout session we cannot use any other products. So we create the filterProducts
          // we dont want to create with the entire products but just the ids so for each filtered product which is the entire thing lets map over those and for each product simply return the product.id instead of literally the entire things
          products: filteredProducts.map((prod) => prod.id),
          // then attached the user to the order and this is nothings else that the user that is calling this api router
          user: user.id,
        },
      });

      // ------------------------------------------------------------

      // the reasason we are doing this is so we can push two things into it. first off all is transaction fee
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      // ------------------------------------------------------------

      // we need to push our actual product into the line items
      filteredProducts.forEach((product) => {
        line_items.push({
          // price id come from product.ts
          price: product.priceId! as string,
          // we dont need to buy 2 same digital product so quanyity is 1
          quantity: 1,
        });
      });

      // ------------------------------------------------------------

      // transaction fee
      line_items.push({
        // this is how stripe knows which products to add to the line items
        price: "price_1PWGojRut6GrOZe0IQlfMW6V",
        // only gonna apply one time the transaction fee
        quantity: 1,
        // false because we wont be able to purchase multiple transiaction fees or add multiple transaction fee to one transctions
        adjustable_quantity: {
          enabled: false,
        },
      });

      // ------------------------------------------------------------

      // after initializing stripe now create the track out session
      try {
        const stripeSession = await stripe.checkout.sessions.create({
          // wheather we are in deployment or in production. locally it will be local host and in production it will be your actual url
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ["card", "paypal"],
          mode: "payment",
          // this will be available to us in the stripe web hook. It is super important. We need to know the user id who checkout and this is gonna be user.id. And we also need to know order id which is the order.id. So later on when we notified by stripe that this user paid then we know who paid and we know which order they paid for so we can unlock there item
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          // we need also to pass in here are line_items so the actual products that this user is buying
          line_items,
        });

        return { url: stripeSession.url };
      } catch (err) {
        return { url: null };
      }
    }),

  // ------------------------------------------------------------

  // pollOrderStatus: privateProcedure
  //   .input(z.object({ orderId: z.string() }))
  //   .query(async ({ input }) => {
  //     const { orderId } = input;

  //     const payload = await getPayloadClient();

  //     const { docs: orders } = await payload.find({
  //       collection: "orders",
  //       where: {
  //         id: {
  //           equals: orderId,
  //         },
  //       },
  //     });

  //     if (!orders.length) {
  //       throw new TRPCError({ code: "NOT_FOUND" });
  //     }

  //     const [order] = orders;

  //     return { isPaid: order._isPaid };
  //   }),
});
