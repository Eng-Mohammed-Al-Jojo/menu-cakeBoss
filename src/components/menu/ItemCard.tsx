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
        className={`relative group flex flex-col overflow-hidden rounded-2xl ${className ?? "mb-20"} transition-all duration-500 ${
          unavailable ? "opacity-60 grayscale-[0.7]" : "cursor-pointer"
        }`}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-soft)",
        }}
        onClick={() => {
          if (!unavailable) setIsDetailModalOpen(true);
        }}
        onMouseEnter={(e) => {
          if (unavailable) return;
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "rgba(122,23,51,0.28)";
          el.style.boxShadow =
            "0 10px 36px -6px rgba(122,23,51,0.16), 0 4px 16px -2px rgba(201,151,58,0.1)";
          el.style.transform = "translateY(-5px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "var(--border-color)";
          el.style.boxShadow = "var(--shadow-soft)";
          el.style.transform = "translateY(0)";
        }}
      >
        {/* Burgundy top border reveal on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(122,23,51,0.5) 30%, rgba(192,48,96,0.8) 50%, rgba(122,23,51,0.5) 70%, transparent)",
          }}
        />

        {/* Burgundy Star Badge */}
        {item.star && (
          <div className="star-badge-burgundy">
            <FiStar size={11} fill="white" stroke="white" />
          </div>
        )}

        {/* ─── Image ─── */}
        <div
          className="relative aspect-square overflow-hidden"
          style={{ background: "var(--bg-surface)" }}
        >
          <img
            src={imageSrc}
            alt={itemName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.src = "/logo.png";
              el.className =
                "w-1/2 h-1/2 object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15";
            }}
          />

          {/* Hover shimmer — burgundy tint */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
            style={{
              background:
                "linear-gradient(115deg, transparent 25%, rgba(122,23,51,0.08) 50%, transparent 75%)",
            }}
          />

          {/* Unavailable */}
          {unavailable && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(253,249,240,0.7)", backdropFilter: "blur(2px)" }}
            >
              <span className="unavailable-badge">غير متوفر</span>
            </div>
          )}
        </div>

        {/* ─── Content ─── */}
        <div className="flex flex-col items-center text-center gap-2 p-3.5 flex-1">
          {/* Name */}
          <h4
            className="text-sm font-black leading-snug line-clamp-2 w-full"
            style={{ color: unavailable ? "var(--text-muted)" : "var(--text-main)" }}
          >
            {itemName}
          </h4>

          {/* Ingredients */}
          {itemIngredients && (
            <p
              className="text-[10px] md:text-xs leading-relaxed line-clamp-2"
              style={{ color: "var(--text-muted)", fontWeight: 500 }}
            >
              {itemIngredients}
            </p>
          )}

          {/* Price — stays gold (brand identity) */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-auto pt-1">
            {prices.map((p, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full"
                style={{
                  background: unavailable
                    ? "var(--bg-surface)"
                    : "linear-gradient(135deg, rgba(201,151,58,0.12), rgba(201,151,58,0.06))",
                  border: `1px solid ${unavailable ? "var(--border-color)" : "rgba(201,151,58,0.3)"}`,
                }}
              >
                <span
                  className="text-sm font-black"
                  style={{
                    color: unavailable ? "var(--text-muted)" : "var(--color-primary-dark)",
                  }}
                >
                  {p.trim()}
                </span>
                <span
                  className="text-xs font-bold"
                  style={{
                    color: unavailable ? "var(--text-muted)" : "var(--color-primary)",
                  }}
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
