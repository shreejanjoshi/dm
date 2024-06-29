import { getServerSideUser } from "@/lib/payload-utils";
import Image from "next/image";
import { cookies } from "next/headers";
import { getPayloadClient } from "@/get-payload";
import { notFound, redirect } from "next/navigation";
import { Product, ProductFile, User } from "@/payload-types";
import { PRODUCT_CATEGORIES } from "@/config";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import PaymentStatus from "@/components/PaymentStatus";

// ------------------------------------------------------------
// ------------------------------------------------------------

// 10:05:00

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

// ------------------------------------------------------------
// ------------------------------------------------------------

// need acesss to order that we are passing in the query parameters by serachparms
const ThankYouPage = async ({ searchParams }: PageProps) => {
  const orderId = searchParams.orderId;
  const nextCookies = cookies();

  // ------------------------------------------------------------

  //   only allow authorized user to download content that they own.
  const { user } = await getServerSideUser(nextCookies);

  // ------------------------------------------------------------

  const payload = await getPayloadClient();
  //   getting order that this page is for
  const { docs: orders } = await payload.find({
    collection: "orders",
    // what this will do is give us you know instead of the id and joining those toegether ex the user it will give us actual user insted of just the id of that user so it is kind of sql join
    depth: 2,
    where: {
      id: {
        equals: orderId,
      },
    },
  });

  // ------------------------------------------------------------

  //   even tho we rae just seraching for one it is array of order. So this help on taking the first array element. Which will be order or nothing
  const [order] = orders;

  if (!order) return notFound();

  // ------------------------------------------------------------

  //   check weather logged in user and and user trying to acess this page is the same one that bought this order. If we dont do this anyone can access this order you could send that link and everyone can download this product
  // id of user that made order
  const orderUserId =
    typeof order.user === "string" ? order.user : order.user.id;

  // if the user that order this product is not the login user than redirect to signin page
  if (orderUserId !== user?.id) {
    // then sign in and if they sign in now they again direct to this order
    return redirect(`/sign-in?origin=thank-you?orderId=${order.id}`);
  }

  // ------------------------------------------------------------

  const products = order.products as Product[];

  const orderTotal = products.reduce((total, product) => {
    return total + product.price;
  }, 0);

  // ------------------------------------------------------------

  return (
    <main className="relative lg:min-h-full">
      <div className="hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          fill
          src="/checkout-thank-you.jpg"
          className="h-full w-full object-cover object-center"
          alt="thank you for your order"
        />
      </div>

      <div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
          <div className="lg:col-start-2">
            <p className="text-sm font-medium text-blue-600">
              Order successful
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Thanks for ordering
            </h1>
            {order._isPaid ? (
              <p className="mt-2 text-base text-muted-foreground">
                Your order was processed and your assets are available to
                download below. We&apos;ve sent your receipt and order details
                to{" "}
                {/* we need to do check here beacause again the oder.user could be either the string or user. We need to be the actual user in order to render all their email which it will be beacuse we have set the search depth we know it will be that but the typescript doesn't */}
                {typeof order.user !== "string" ? (
                  <span className="font-medium text-gray-900">
                    {order.user.email}
                  </span>
                ) : null}
                .
              </p>
            ) : (
              <p className="mt-2 text-base text-muted-foreground">
                We appreciate your order, and we&apos;re currently processing
                it. So hang tight and we&apos;ll send you confirmation very
                soon!
              </p>
            )}

            <div className="mt-16 text-sm font-medium">
              <div className="text-muted-foreground">Order nr.</div>
              <div className="mt-2 text-gray-900">{order.id}</div>

              <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
                {/* 10:15:00 */}
                {(order.products as Product[]).map((product) => {
                  const label = PRODUCT_CATEGORIES.find(
                    ({ value }) => value === product.category
                  )?.label;

                  // where do we download the asset that we are mapping over. ProductFile is casting here so
                  const downloadUrl = (product.product_files as ProductFile)
                    .url as string;

                  const { image } = product.images[0];

                  return (
                    <li key={product.id} className="flex space-x-6 py-6">
                      <div className="relative h-24 w-24">
                        {typeof image !== "string" && image.url ? (
                          <Image
                            fill
                            src={image.url}
                            alt={`${product.name} image`}
                            className="flex-none rounded-md bg-gray-100 object-cover object-center"
                          />
                        ) : null}
                      </div>

                      <div className="flex-auto flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="text-gray-900">{product.name}</h3>

                          <p className="my-1">Category: {label}</p>
                        </div>

                        {order._isPaid ? (
                          <a
                            href={downloadUrl}
                            download={product.name}
                            className="text-blue-600 hover:underline underline-offset-2"
                          >
                            Download asset
                          </a>
                        ) : null}
                      </div>

                      <p className="flex-none font-medium text-gray-900">
                        {formatPrice(product.price)}
                      </p>
                    </li>
                  );
                })}
              </ul>

              <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p className="text-gray-900">{formatPrice(orderTotal)}</p>
                </div>

                <div className="flex justify-between">
                  <p>Transaction Fee</p>
                  <p className="text-gray-900">{formatPrice(1)}</p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <p className="text-base">Total</p>
                  <p className="text-base">{formatPrice(orderTotal + 1)}</p>
                </div>
              </div>

              {/* was this product paid or not asked in stripe */}
              <PaymentStatus
                isPaid={order._isPaid}
                orderEmail={(order.user as User).email}
                orderId={order.id}
              />

              <div className="mt-16 border-t border-gray-200 py-6 text-right">
                <Link
                  href="/products"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Continue shopping &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// ------------------------------------------------------------
// ------------------------------------------------------------

export default ThankYouPage;
