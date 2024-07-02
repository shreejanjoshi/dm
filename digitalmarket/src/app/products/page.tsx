import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";
import { PRODUCT_CATEGORIES } from "@/config";

// ------------------------------------------------------------
// ------------------------------------------------------------

type Param = string | string[] | undefined;

// ------------------------------------------------------------

interface ProductsPageProps {
  // key value and value type
  searchParams: { [key: string]: Param };
}

// ------------------------------------------------------------

const parse = (param: Param) => {
  // so we are actually making sure it is not string [] so we can easily work with it right now in our product page
  return typeof param === "string" ? param : undefined;
};

// ------------------------------------------------------------
// ------------------------------------------------------------

const ProductsPage = ({ searchParams }: ProductsPageProps) => {
  // it can be string or undefiend but not string []
  const sort = parse(searchParams.sort);
  const category = parse(searchParams.category);

  // ------------------------------------------------------------

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === category
  )?.label;

  // ------------------------------------------------------------

  return (
    <MaxWidthWrapper>
      <ProductReel
        title={label ?? "Browse high-quality assets"}
        query={{
          category,
          limit: 40,
          sort: sort === "desc" || sort === "asc" ? sort : undefined,
        }}
      />
    </MaxWidthWrapper>
  );
};

// ------------------------------------------------------------
// ------------------------------------------------------------

export default ProductsPage;
