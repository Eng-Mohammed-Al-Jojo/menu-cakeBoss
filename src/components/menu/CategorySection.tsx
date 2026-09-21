import { useMemo } from "react";
import ItemCard from "./ItemCard";
import type { Category, Item, Subcategory } from "./Menu";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface Props {
  category: Category;
  subcategories: Subcategory[];
  items: Item[];
  orderSystem?: boolean;
  index?: number;
}

export default function CategorySection({ category, subcategories, items }: Props) {
  const { i18n } = useTranslation();

  const groupedItems = useMemo(() => {
    const groups: Record<string, Item[]> = {};
    const noSubItems: Item[] = [];

    items.forEach(item => {
      const sub = subcategories.find(s => s.id === item.subcategoryId);
      if (item.subcategoryId && sub) {
        if (sub.visible === false) return;
        if (!groups[item.subcategoryId]) groups[item.subcategoryId] = [];
        groups[item.subcategoryId].push(item);
      } else {
        noSubItems.push(item);
      }
    });

    return { groups, noSubItems };
  }, [items, subcategories]);

  const activeSubcategories = useMemo(() => {
    return subcategories
      .filter(sub => sub.categoryId === category.id && sub.visible !== false && groupedItems.groups[sub.id])
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [category.id, subcategories, groupedItems.groups]);

  if (category.visible === false) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col gap-14 pb-16"
    >
      <div className="flex flex-col gap-14">
        {/* Items without subcategory */}
        {groupedItems.noSubItems.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {groupedItems.noSubItems.map((item, i) => (
              <ItemCard
                key={item.id}
                item={item}
                index={i}
                categoryName={category.nameAr || category.name}
              />
            ))}
          </div>
        )}

        {/* Items grouped by subcategory */}
        {activeSubcategories.map((sub, subIdx) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: subIdx * 0.07, duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            {/* ── Subcategory Header (Centered Modern Luxury Design) ── */}
            <div className="flex flex-col items-center justify-center gap-2.5 my-2 w-full">
              <div className="flex items-center justify-center w-full max-w-xl px-2">
                {/* Left Gradient Line */}
                <div
                  className="h-[1.5px] flex-1 rounded-full opacity-60 bg-gradient-to-r from-transparent via-mocha-400/30 to-olive-500/70"
                />

                {/* Center Subcategory Pill */}
                <div
                  className="mx-2 sm:mx-4 px-5 sm:px-7 py-2 sm:py-2.5 rounded-full flex items-center gap-2.5 sm:gap-3 shrink-0 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] bg-white border border-olive-500/25 shadow-sm"
                >
                  {/* Left Mocha Dot */}
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 bg-gradient-to-br from-mocha-400 to-mocha-600 shadow-[0_0_8px_rgba(183,146,117,0.5)]"
                  />

                  {/* Subcategory Title */}
                  <h3
                    className="text-lg sm:text-xl font-black tracking-tight text-center text-(--text-main)"
                  >
                    {i18n.language === "en" ? (sub.nameEn || sub.nameAr) : sub.nameAr}
                  </h3>

                  {/* Right Olive Dot */}
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 bg-gradient-to-br from-olive-400 to-olive-600 shadow-[0_0_8px_rgba(74,86,56,0.5)]"
                  />
                </div>

                {/* Right Gradient Line */}
                <div
                  className="h-[1.5px] flex-1 rounded-full opacity-60 bg-gradient-to-l from-transparent via-mocha-400/30 to-olive-500/70"
                />
              </div>

              {/* Symmetrical Micro Underline Accent */}
              <div className="flex items-center gap-1">
                <div
                  className="h-0.5 rounded-full w-4 bg-gradient-to-r from-mocha-400 to-mocha-500 opacity-70"
                />
                <div
                  className="h-0.5 rounded-full w-9 bg-gradient-to-r from-olive-600 to-olive-500 shadow-sm"
                />
                <div
                  className="h-0.5 rounded-full w-4 bg-gradient-to-r from-mocha-400 to-mocha-500 opacity-70"
                />
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {groupedItems.groups[sub.id].map((item, iIdx) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  index={iIdx}
                  categoryName={category.nameAr || category.name}
                />
              ))}
            </div>

            {/* Bottom divider (not on last) */}
            {subIdx < activeSubcategories.length - 1 && (
              <div
                className="mt-4 h-px bg-gradient-to-r from-transparent via-olive-500/20 to-transparent"
              />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}