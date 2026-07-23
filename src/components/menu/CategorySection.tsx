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
            {/* ── Subcategory Header ── */}
            <div className="flex flex-col items-end gap-2.5">
              {/* Title row with burgundy dot */}
              <div className="flex items-center gap-3">
                {/* Burgundy dot — larger and more vibrant */}
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #C03060, #7A1733)",
                    boxShadow: "0 0 10px rgba(122,23,51,0.5), 0 0 0 3px rgba(122,23,51,0.12)",
                  }}
                />
                <h3
                  className="text-xl sm:text-2xl font-black tracking-tight"
                  style={{ color: "var(--text-main)" }}
                >
                  {i18n.language === "en" ? (sub.nameEn || sub.nameAr) : sub.nameAr}
                </h3>
              </div>

              {/* Burgundy + gold decorative underline */}
              <div className="flex items-center gap-1 self-end">
                <div
                  className="h-0.5 rounded-full"
                  style={{
                    width: "20px",
                    background: "var(--gradient-burgundy)",
                    opacity: 0.8,
                  }}
                />
                <div
                  className="h-0.5 rounded-full"
                  style={{
                    width: "52px",
                    background: "var(--gradient-gold)",
                    boxShadow: "0 1px 6px rgba(201,151,58,0.35)",
                  }}
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
                className="mt-4 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(122,23,51,0.15) 30%, rgba(201,151,58,0.25) 50%, rgba(122,23,51,0.15) 70%, transparent 100%)",
                }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}