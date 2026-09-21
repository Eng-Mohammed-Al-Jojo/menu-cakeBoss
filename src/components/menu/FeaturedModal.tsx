import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiInfo } from "react-icons/fi";
import { HiStar } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import type { Item } from "./Menu";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  orderSystem: boolean;
  onItemClick?: (item: Item) => void;
  onDetailsClick?: (item: Item) => void;
}

export default function FeaturedModal({
  isOpen,
  onClose,
  items,
  onDetailsClick,
}: Props) {
  const { t } = useTranslation();

  // Lock body scroll + Escape key
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-end sm:items-center justify-center"
          style={{ zIndex: 9000 }}
        >
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{
              background: "var(--dark-a85)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
          />

          {/* ── Modal Panel ── */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="relative flex flex-col w-full rounded-t-[28px] sm:rounded-[28px] overflow-hidden z-10"
            style={{
              maxWidth: "960px",
              maxHeight: "90vh",
              background: "var(--bg-card)",
              border: "1.5px solid var(--gold-a25)",
              boxShadow: "0 32px 80px var(--dark-a72), 0 0 0 1px var(--gold-a15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Top Olive-to-Mocha accent bar ── */}
            <div
              className="absolute top-0 left-0 right-0 h-[2.5px] z-20"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(107,132,87,0.7) 20%, #556B43 40%, #8FA87E 55%, #B79275 75%, transparent 100%)",
              }}
            />

            {/* ── Header ── */}
            <div
              className="flex items-center justify-between px-6 pt-7 pb-5"
              style={{
                background: "linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-card) 100%)",
                borderBottom: "1px solid var(--gold-a25)",
              }}
            >
              <div className="flex items-center gap-3">
                {/* Gold icon disc */}
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--gradient-gold)",
                    boxShadow: "0 4px 20px var(--gold-a40)",
                  }}
                >
                  <HiStar size={24} color="#2C2018" />
                </div>
                <div>
                  <h2
                    className="font-black leading-tight"
                    style={{ fontSize: "22px", color: "var(--text-main)" }}
                  >
                    {t("menu.featured_items") || "الأصناف المميزة"}
                  </h2>
                  <p
                    className="font-bold mt-0.5"
                    style={{
                      fontSize: "12px",
                      color: "var(--brand-red-light)",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {t("menu.chef_recommendations") || "توصيات الشيف"}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="إغلاق"
                className="flex items-center justify-center transition-all duration-200"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "var(--radius-full)",
                  background: "var(--bg-surface)",
                  border: "1.5px solid var(--border-gold)",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-red)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--brand-red)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                  (e.currentTarget as HTMLButtonElement).style.transform = "rotate(90deg)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-surface)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-gold)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "rotate(0deg)";
                }}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* ── Carousel ── */}
            <div
              className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar"
              style={{
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                padding: "24px 24px 28px",
                display: "flex",
                gap: "20px",
                alignItems: "stretch",
              }}
            >
              {items.length > 0 ? (
                items.map((item, index) => {
                  const prices = String(item.price).split(",").map((p) => p.trim()).filter(Boolean);
                  const itemName = item.nameAr || item.name || "";
                  const description = item.ingredientsAr || item.ingredients || "";
                  const unavailable = item.visible === false;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.4, type: "spring", damping: 20 }}
                      className="relative shrink-0 flex flex-col group"
                      style={{
                        scrollSnapAlign: "center",
                        width: "82vw",
                        maxWidth: "320px",
                        height: "460px",
                        borderRadius: "var(--radius-hero)",
                        background: "var(--bg-card)",
                        border: "1.5px solid var(--gold-a25)",
                        boxShadow: "0 8px 32px var(--dark-a60)",
                        overflow: "hidden",
                        opacity: unavailable ? 0.55 : 1,
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        cursor: unavailable ? "not-allowed" : "pointer",
                      }}
                      onMouseEnter={(e) => {
                        if (unavailable) return;
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 24px 56px var(--dark-a72), 0 0 0 2px var(--gold-a40)";
                      }}
                      onMouseLeave={(e) => {
                        if (unavailable) return;
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px var(--dark-a60)";
                      }}
                      onClick={() => {
                        if (unavailable) return;
                        onDetailsClick?.(item);
                        onClose();
                      }}
                    >
                      {/* ── Image Area ── */}
                      <div className="relative w-full overflow-hidden" style={{ height: "55%" }}>
                        <img
                          src={item.image ? `/images/${item.image}` : "/logo.png"}
                          alt={itemName}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/logo.png";
                          }}
                        />
                        {/* Gradient fade into card bg */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background: "linear-gradient(to top, var(--bg-card) 0%, transparent 55%)",
                          }}
                        />

                        {/* Featured Badge */}
                        <div
                          className="absolute top-3 right-3 flex items-center gap-1.5"
                          style={{
                            background: "var(--gradient-gold)",
                            color: "var(--brand-dark)",
                            padding: "5px 12px",
                            borderRadius: "var(--radius-full)",
                            fontWeight: 800,
                            fontSize: "11px",
                            boxShadow: "0 4px 14px var(--gold-a40)",
                            letterSpacing: "0.05em",
                          }}
                        >
                          <HiStar size={13} />
                          <span>{t("menu.featured") || "مميز"}</span>
                        </div>

                        {/* Sold Out Badge */}
                        {unavailable && (
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ background: "rgba(28,18,12,0.60)", backdropFilter: "blur(4px)" }}
                          >
                            <span
                              className="font-black text-white text-lg tracking-widest rotate-12 px-4 py-2 rounded-xl"
                              style={{ border: "2px solid rgba(255,255,255,0.6)" }}
                            >
                              {t("menu.sold_out") || "نفذت الكمية"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* ── Content Area ── */}
                      <div
                        className="flex flex-col flex-1 p-5"
                        style={{ background: "var(--bg-card)" }}
                      >
                        <div className="flex-1">
                          <h3
                            className="font-bold text-xl leading-snug mb-1.5 text-right line-clamp-2"
                            style={{
                              color: "var(--text-main)",
                              fontFamily: "Alexandria, Cairo, sans-serif",
                              fontWeight: 700,
                            }}
                          >
                            {itemName}
                          </h3>
                          {description && (
                            <p
                              className="text-right line-clamp-2 font-medium"
                              style={{
                                color: "var(--text-secondary)",
                                fontSize: "13px",
                                lineHeight: 1.65,
                                fontFamily: "Cairo, sans-serif",
                              }}
                            >
                              {description}
                            </p>
                          )}
                        </div>

                        {/* ── Footer / Actions ── */}
                        <div
                          className="flex items-center justify-between mt-4 pt-4"
                          style={{ borderTop: "1px solid var(--border-light)" }}
                        >
                          {/* Price display */}
                          <div
                            className="flex flex-wrap items-baseline gap-1 font-black"
                            style={{ color: "var(--brand-red)" }}
                          >
                            {prices.map((price, idx) => (
                              <div
                                key={idx}
                                className={`flex items-baseline gap-0.5 font-black ${prices.length > 1 ? "text-[13px]" : "text-[22px]"} leading-none`}
                                style={{ fontFamily: "Cairo, sans-serif" }}
                              >
                                <span className="text-[10px] font-bold opacity-60">₪</span>
                                {price}
                              </div>
                            ))}
                          </div>

                          {/* Details button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (unavailable) return;
                              onDetailsClick?.(item);
                              onClose();
                            }}
                            aria-label="عرض التفاصيل"
                            className="flex items-center justify-center gap-1.5 px-4 py-2 transition-all duration-200"
                            style={{
                              borderRadius: "var(--radius-full)",
                              background: "var(--gradient-gold)",
                              color: "var(--brand-dark)",
                              border: "none",
                              fontWeight: 700,
                              fontSize: "12px",
                              fontFamily: "Cairo, sans-serif",
                              boxShadow: "0 4px 14px var(--gold-a40)",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              letterSpacing: "0.04em",
                              whiteSpace: "nowrap",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
                              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px var(--gold-a40)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px var(--gold-a40)";
                            }}
                          >
                            <FiInfo size={14} />
                            {t("menu.details") || "التفاصيل"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div
                  className="flex flex-col items-center justify-center w-full"
                  style={{ minHeight: "280px" }}
                >
                  <div style={{ fontSize: "56px", opacity: 0.18 }}>🌟</div>
                  <p
                    className="mt-4 font-bold text-lg"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t("menu.no_featured") || "لا توجد أصناف مميزة حالياً"}
                  </p>
                </div>
              )}
            </div>

            {/* ── Scroll hint (only when many items) ── */}
            {items.length > 2 && (
              <div
                className="flex justify-center pb-4 gap-1.5"
                style={{ borderTop: "1px solid var(--gold-a15)" }}
              >
                {items.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === 0 ? "18px" : "6px",
                      height: "6px",
                      background: i === 0 ? "var(--brand-gold)" : "var(--gold-a25)",
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}