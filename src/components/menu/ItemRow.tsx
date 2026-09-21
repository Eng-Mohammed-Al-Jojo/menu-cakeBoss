import { type Item } from "./Menu";
import React, { useState } from "react";
import { FiStar } from "react-icons/fi";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ItemDetailModal from "./ItemDetailModal";

interface Props {
  item: Item;
  categoryName?: string;
  featuredMode?: boolean;
}

const ItemRow = React.memo(({ item, categoryName }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const prices = String(item.price).split(",");
  const unavailable = item.visible === false;

  const itemName = item.nameAr || "";
  const itemIngredients = item.ingredientsAr || "";
  const imageSrc = item.image ? `/images/${item.image}` : "/logo.png";

  return (
    <>
      <motion.div
        layout
        whileHover={unavailable ? {} : { y: -3 }}
        whileTap={unavailable ? {} : { scale: 0.99 }}
        className={`relative group flex flex-col sm:flex-row gap-4 p-4 sm:p-5 rounded-2xl transition-all duration-400 ${
          unavailable ? "opacity-60 grayscale-[0.7]" : "cursor-pointer"
        }`}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-soft)",
        }}
        onClick={() => {
          if (!unavailable) setIsModalOpen(true);
        }}
        onMouseEnter={(e) => {
          if (unavailable) return;
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "rgba(74,86,56,0.35)";
          el.style.boxShadow = "0 8px 32px rgba(74,86,56,0.14)";
          el.style.background = "var(--bg-card-hover)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "var(--border-color)";
          el.style.boxShadow = "var(--shadow-soft)";
          el.style.background = "var(--bg-card)";
        }}
      >
        {/* Olive/Mocha hover border */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-t-2xl bg-gradient-to-r from-transparent via-olive-500 to-mocha-500"
        />

        {/* ─── Image ─── */}
        <div
          className="relative shrink-0 overflow-hidden rounded-xl w-full sm:w-24 h-44 sm:h-24"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)" }}
        >
          <img
            src={imageSrc}
            alt={itemName}
            className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/logo.png";
            }}
          />

          {unavailable && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(253,249,240,0.75)", backdropFilter: "blur(2px)" }}
            >
              <span className="unavailable-badge text-[8px]">{t("common.unavailable") || "غير متوفر"}</span>
            </div>
          )}
        </div>

        {/* ─── Content ─── */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <div className="flex items-start justify-between gap-3">
            {/* Name + Ingredients */}
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3
                  className="text-base md:text-lg font-black leading-snug line-clamp-2 w-full"
                  style={{ color: unavailable ? "var(--text-muted)" : "var(--text-main)" }}
                >
                  {itemName}
                </h3>
                {item.star && (
                  <FiStar
                    size={14}
                    fill="#816148"
                    stroke="#816148"
                    className="shrink-0"
                  />
                )}
              </div>

              {itemIngredients && (
                <p
                  className="text-xs sm:text-sm leading-relaxed line-clamp-2"
                  style={{ color: "var(--text-muted)", fontWeight: 500 }}
                >
                  {itemIngredients}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <div className="flex items-center gap-1">
                <span
                  className="text-base sm:text-xl font-black"
                  style={{
                    color: unavailable ? "var(--text-muted)" : "var(--color-primary-dark)",
                  }}
                >
                  {prices.map((p) => p.trim()).join(" - ")}
                </span>
                <span
                  className="text-sm font-bold mt-0.5"
                  style={{
                    color: unavailable ? "var(--text-muted)" : "var(--color-primary)",
                  }}
                >
                  ₪
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <ItemDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={item}
        categoryName={categoryName}
        orderSystem={false}
      />
    </>
  );
});

export default ItemRow;
