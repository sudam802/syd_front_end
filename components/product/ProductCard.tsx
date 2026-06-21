import { ProductResult } from "@/types/product";

export default function ProductCard({ product }: { product: ProductResult }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="h-44 bg-white/10">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4">
        <p className="text-xs font-semibold text-yellow-300">
          {product.store}
        </p>

        <h3 className="mt-2 line-clamp-2 min-h-[48px] font-semibold text-white">
          {product.title}
        </h3>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400">Price</p>
            <p className="text-xl font-bold text-yellow-400">
              {product.currency} {product.price}
            </p>

            <p className="text-xs text-gray-500">
              Shipping:{" "}
              {product.shippingCost === 0
                ? "Free"
                : `${product.currency} ${product.shippingCost}`}
            </p>
          </div>

          <a
            href={product.productUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-bold text-black"
          >
            View
          </a>
        </div>
      </div>
    </div>
  );
}