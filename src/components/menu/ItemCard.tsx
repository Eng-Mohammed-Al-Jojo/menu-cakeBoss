import { useState } from "react";
import { motion } from "framer-motion";
import { type Item } from "./Menu";
import ItemDetailModal from "./ItemDetailModal";
import { FiStar } from "react-icons/fi";

interface Props {
  item: Item;
  index: number;
  categoryName?: string;
  className?: string;
}

export default function ItemCard({ item, index, categoryName, className }: Props) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const itemName = item.nameAr || item.name || "";
  const itemIngredients = item.ingredientsAr || item.ingredients || "";
  const prices = String(item.price).split(",");
  const unavailable = item.visible === false;
  const imageSrc = item.image ? `/images/${item.image}` : "/logo.png";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 16 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{
          delay: index * 0.04,
          duration: 0.55,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`relative group flex flex-col overflow-hidden rounded-2xl ${className ?? "mb-20"} transition-all duration-400 bg-white border border-(--border-color) shadow-(--shadow-soft) ${
          unavailable ? "opacity-60 grayscale-[0.7]" : "cursor-pointer hover:border-olive-500/40 hover:shadow-[0_10px_36px_-6px_rgba(74,86,56,0.16),0_4px_16px_-2px_rgba(183,146,117,0.1)] hover:-translate-y-1"
        }`}
        onClick={() => {
          if (!unavailable) setIsDetailModalOpen(true);
        }}
      >
        {/* Olive/Mocha top border reveal on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 bg-gradient-to-r from-transparent via-olive-500 to-mocha-500"
        />

        {/* Mocha Star Badge */}
        {item.star && (
          <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-gradient-to-br from-mocha-400 to-mocha-600 flex items-center justify-center shadow-md z-10">
            <FiStar size={11} fill="white" stroke="white" />
          </div>
        )}

        {/* ─── Image ─── */}
        <div
          className="relative aspect-square overflow-hidden"
          style={{ background: "linear-gradient(160deg, #EEF2E8 0%, #E7ECE1 40%, #D8E4CE 80%, #CBDABF 100%)" }}
        >
          <img
            src={imageSrc}
            alt={itemName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.src = "/logo.png";
              el.className =
                "w-1/2 h-1/2 object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 drop-shadow-sm";
            }}
          />

          {/* Hover shimmer */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none bg-gradient-to-tr from-transparent via-olive-500/10 to-transparent"
          />

          {/* Unavailable */}
          {unavailable && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-cream-100/70 backdrop-blur-[2px]"
            >
              <span className="unavailable-badge">غير متوفر</span>
            </div>
          )}
        </div>

        {/* ─── Content ─── */}
        <div className="flex flex-col items-center text-center gap-2 p-3.5 flex-1">
          {/* Name */}
          <h4
            className={`text-sm font-black leading-snug line-clamp-2 w-full ${unavailable ? "text-(--text-muted)" : "text-(--text-main)"}`}
          >
            {itemName}
          </h4>

          {/* Ingredients */}
          {itemIngredients && (
            <p
              className="text-[10px] md:text-xs leading-relaxed line-clamp-2 text-(--text-muted) font-medium"
            >
              {itemIngredients}
            </p>
          )}

          {/* Price — Olive/Mocha tag */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-auto pt-1">
            {prices.map((p, idx) => (
              <div
                key={idx}
                className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full ${
                  unavailable
                    ? "bg-(--bg-surface) border border-(--border-color)"
                    : "bg-olive-50 border border-olive-200/80 shadow-xs"
                }`}
              >
                <span
                  className={`text-sm font-black ${
                    unavailable ? "text-(--text-muted)" : "text-olive-900"
                  }`}
                >
                  {p.trim()}
                </span>
                <span
                  className={`text-xs font-bold ${
                    unavailable ? "text-(--text-muted)" : "text-olive-600"
                  }`}
                >
                  ₪
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <ItemDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        item={item}
        categoryName={categoryName}
        orderSystem={false}
      />
    </>
  );
}
