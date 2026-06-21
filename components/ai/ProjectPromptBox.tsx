"use client";

import { useState } from "react";

const examples = [
  "Build me a home gym under $500",
  "Create a drone for aerial photography",
  "Gaming setup under $1000",
  "Smart room setup with LED lights",
];

type BuildItem = {
  name: string;
  quantity: number;
  reason: string;
  searchKeyword: string;
};

type BuildPlan = {
  projectName: string;
  userPrompt?: string;
  estimatedBudget: string;
  difficulty: string;
  items: BuildItem[];
};

type Product = {
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  productUrl: string;
  store: string;
  shippingCost: number;
};

type ProductGroup = {
  componentName: string;
  quantity: number;
  reason: string;
  searchKeyword: string;
  products: Product[];
};

export default function ProjectPromptBox() {
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [story, setStory] = useState("");
  const [plan, setPlan] = useState<BuildPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setPlan(null);
      setProductGroups([]);

      const response = await fetch("process.env.NEXT_PUBLIC_API_URL/ai/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ story }),
      });

      const data: BuildPlan = await response.json();
      console.log("AI Plan", data);

      setPlan(data);

      const groups: ProductGroup[] = [];

      for (const item of data.items) {
        if (!item.searchKeyword) continue;

        const productResponse = await fetch(
          `http://localhost:3001/marketplaces/search?keyword=${encodeURIComponent(
            item.searchKeyword
          )}`
        );

        const productData: Product[] = await productResponse.json();

        groups.push({
          componentName: item.name,
          quantity: item.quantity,
          reason: item.reason,
          searchKeyword: item.searchKeyword,
          products: productData,
        });
      }

      console.log("Product Groups", groups);
      setProductGroups(groups);
    } catch (error) {
      console.error("Failed to generate plan:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#0B0B0F] px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl text-center">
        <div className="mb-6 inline-flex rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm text-yellow-300">
          AI Project Planner
        </div>

        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          Tell us what you want to{" "}
          <span className="text-yellow-400">build</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
          BuildWise creates the plan, budget, parts list, and shopping options.
        </p>

        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Example: I need to build a racing remote control car under $300."
            className="min-h-[180px] w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-5 text-base text-white outline-none placeholder:text-gray-500 focus:border-yellow-400"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            {examples.map((example) => (
              <button
                key={example}
                onClick={() => setStory(example)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:border-yellow-400/60 hover:text-yellow-300"
              >
                {example}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={!story.trim() || loading}
            className="mt-6 w-full rounded-2xl bg-yellow-400 px-6 py-4 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Generating Plan & Searching Products..." : "Generate Build Plan"}
          </button>
        </div>

        {plan && (
          <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="text-2xl font-bold text-yellow-400">
              {plan.projectName}
            </h2>

            <div className="mt-4 grid gap-3 text-sm text-gray-300 md:grid-cols-2">
              <p>Budget: {plan.estimatedBudget}</p>
              <p>Difficulty: {plan.difficulty}</p>
            </div>

            <div className="mt-6 space-y-4">
              {plan.items.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white">{item.name}</h3>
                      <p className="mt-1 text-xs text-yellow-300">
                        Search: {item.searchKeyword}
                      </p>
                    </div>

                    <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-sm text-yellow-300">
                      Qty: {item.quantity}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-400">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {productGroups.length > 0 && (
          <div className="mx-auto mt-12 max-w-6xl text-left">
            <h2 className="mb-6 text-3xl font-bold text-yellow-400">
              Product Options by Component
            </h2>

            <div className="space-y-12">
              {productGroups.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="mb-5">
                    <h3 className="text-2xl font-bold text-white">
                      {group.componentName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      Qty: {group.quantity} · {group.reason}
                    </p>
                    <p className="mt-1 text-xs text-yellow-300">
                      eBay search: {group.searchKeyword}
                    </p>
                  </div>

                  {group.products.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No products found for this component.
                    </p>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {group.products.map((product, index) => (
                        <div
                          key={index}
                          className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur"
                        >
                          <div className="h-52 bg-black/30">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                                No image
                              </div>
                            )}
                          </div>

                          <div className="p-5">
                            <p className="text-xs font-semibold text-yellow-300">
                              {product.store}
                            </p>

                            <h4 className="mt-2 line-clamp-3 min-h-[72px] font-semibold text-white">
                              {product.title}
                            </h4>

                            <div className="mt-4 flex items-center justify-between gap-4">
                              <div>
                                <p className="text-sm text-gray-400">Price</p>
                                <p className="text-2xl font-bold text-yellow-400">
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
                                rel="noopener noreferrer"
                                className="rounded-xl bg-yellow-400 px-4 py-2 font-semibold text-black"
                              >
                                View
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}