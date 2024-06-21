import { ProductFiles } from "@/collections/ProductFile";
import AddToCartButton from "@/components/AddToCartButton";
import ImageSlider from "@/components/ImageSlider";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";
import { PRODUCT_CATEGORIES } from "@/config";
import { getPayloadClient } from "@/get-payload";
import { formatPrice } from "@/lib/utils";
import { Check, Shield } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// ------------------------------------------------------------
// ------------------------------------------------------------

interface PageProps {
  params: {
    // productId is same from [] angle brackt
    productId: string;
  };
}

// ------------------------------------------------------------
// ------------------------------------------------------------

// value never changes so
const BREADCRUMS = [
  { id: 1, name: "Home", href: "/" },
  //   so if we click href we are going to redirected to the /products
  { id: 2, name: "Products", href: "/products" },
];

// ------------------------------------------------------------
// ------------------------------------------------------------

const Page = async ({ params }: PageProps) => {
  const { productId } = params;
  const payload = await getPayloadClient();

  // ------------------------------------------------------------

  // query the backend to get this data
  // we are just giving this docs name so products
  const { docs: products } = await payload.find({
    // which collection, table do we want to query
    collection: "products",
    // we are searching for one product
    limit: 1,
    // what are we seraching for
    where: {
      id: {
        equals: productId,
      },
      approvedForSale: {
        // we just want the product which are approved by the admin
        equals: "approved",
      },
    },
  });

  // ------------------------------------------------------------

  // we gonna get back array of the products so but we are only seraching for one becasue we put limit of 1 so we can array the structure tyhe first product from the array we get back from our cms payload
  const [product] = products;

  // ------------------------------------------------------------

  // notfound function we get from next/navigation. IT will just throw 404 error. If it is retur it will not return the rest of the code also know as gaurd clause
  if (!product) return notFound();

  // ------------------------------------------------------------

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label;

  // ------------------------------------------------------------

  const validUrls = product.images
    .map(({ image }) => (typeof image === "string" ? image : image.url))
    .filter(Boolean) as string[];

  // ------------------------------------------------------------

  return (
    <MaxWidthWrapper className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* product details */}
        <div className="lg:max-w-lg lg:self-end">
          <ol className="flex items-center space-x-2">
            {/* only purpose of this is to show the current path we are on the page this is also called breadcrums. We made const breadcrums now we can map them here */}
            {BREADCRUMS.map((breadcrumb, i) => (
              <li key={breadcrumb.href}>
                <div className="flex items-center text-sm">
                  <Link
                    href={breadcrumb.href}
                    className="font-medium text-sm text-muted-foreground hover:text-gray-900"
                  >
                    {breadcrumb.name}
                  </Link>
                  {/* if we not at the last element then we rae going to render out a liitle icon and if not no icone  */}
                  {i !== BREADCRUMS.length - 1 ? (
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>
          </div>

          <section className="mt-4">
            <div className="flex items-center">
              <p className="font-medium text-gray-900">
                {formatPrice(product.price)}
              </p>

              <div className="ml-4 border-l text-muted-foreground border-gray-300 pl-4">
                {label}
              </div>
            </div>

            <div className="mt-4 space-y-6">
              <p className="text-base text-muted-foreground">
                {product.description}
              </p>
            </div>

            <div className="mt-6 flex items-center">
              <Check
                aria-hidden="true"
                className="h-5 w-5 flex-shrink-0 text-green-500"
              />
              <p className="ml-2 text-sm text-muted-foreground">
                Eligible for instant delivery
              </p>
            </div>
          </section>
        </div>

        {/* product images */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg-mt-0 lg:self-center">
          <div className="aspect-square rounded-lg">
            <ImageSlider urls={validUrls} />
          </div>
        </div>

        {/* add to cart part */}
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <div>
            <div className="mt-10">
              <AddToCartButton product={product} />
            </div>
            <div className="mt-6 text-center">
              <div className="group inline-flex text-sm text-medium">
                {/* from luside react */}
                <Shield
                  aria-hidden="true"
                  className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400"
                />
                <span className="text-muted-foreground hover:text-gray-700">
                  30 Day Return Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductReel
        href="/products"
        query={{ category: product.category, limit: 4 }}
        title={`Similar ${label}`}
        subtitle={`Brows similar high-quality ${label} just like "${product.name}"`}
      />
    </MaxWidthWrapper>
  );
};

// ------------------------------------------------------------
// ------------------------------------------------------------

export default Page;
