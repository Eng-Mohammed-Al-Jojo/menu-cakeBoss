import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiStar } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { type Item } from "./Menu";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
  categoryName?: string;
  orderSystem?: boolean;
}

// Arabic size labels for multi-price items
const SIZE_LABELS_AR = ["صغير", "وسط", "كبير", "عائلي", "خامس", "سادس"];
const SIZE_LABELS_EN = ["Small", "Medium", "Large", "Family", "5th", "6th"];

export default function ItemDetailModal({
  isOpen,
  onClose,
  item,
  categoryName,
  orderSystem = false,
}: Props) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const itemName = isRtl
    ? item.nameAr || item.name || ""
    : item.name || item.nameAr || "";
  const ingredients = isRtl
    ? item.ingredientsAr || item.ingredients || ""
    : item.ingredients || item.ingredientsAr || "";
  const rawPrices = String(item.price ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const imageSrc = item.image ? `/images/${item.image}` : "/logo.png";
  const unavailable = item.visible === false;
  const sizeLabels = isRtl ? SIZE_LABELS_AR : SIZE_LABELS_EN;

  // Lock body scroll + Escape key
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
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
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="absolute inset-0 cursor-pointer"
            style={{
              background: "rgba(28, 18, 12, 0.72)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
            onClick={onClose}
          />

          {/* ── Modal card ── */}
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 36, scale: 0.97 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="relative w-full sm:max-w-lg mx-auto flex flex-col overflow-hidden z-10 rounded-t-[24px] sm:rounded-[24px]"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-gold)",
              boxShadow:
                "0 32px 80px -8px rgba(28,18,12,0.55), 0 0 0 1px rgba(201,151,58,0.12)",
              maxHeight: "92vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Dual-tone top border ── */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] z-20 rounded-t-3xl"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(201,151,58,0.5) 25%, rgba(232,190,92,0.85) 42%, rgba(192,48,96,0.65) 50%, rgba(232,190,92,0.85) 58%, rgba(201,151,58,0.5) 75%, transparent 100%)",
              }}
            />

            {/* ── Close button ── */}
            <button
              onClick={onClose}
              className="feedback-close-btn z-30"
              aria-label={t("common.close")}
              style={isRtl ? { right: "auto", left: "1rem" } : {}}
            >
              <FiX size={17} />
            </button>

            {/* ── Hero image ── */}
            <div
              className="relative w-full shrink-0 overflow-hidden"
              style={{ height: "240px", background: "var(--bg-surface)" }}
            >
              <img
                src={imageSrc}
                alt={itemName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.src = "/logo.png";
                  el.className =
                    "w-1/3 h-1/3 object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20";
                }}
              />
              {/* Gradient fade into card */}
              <div
                className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 0%, var(--bg-card) 100%)",
                }}
              />
              {/* Unavailable overlay */}
              {unavailable && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background: "rgba(253,249,240,0.78)",
                    backdropFilter: "blur(3px)",
                  }}
                >
                  <span className="unavailable-badge text-sm">
                    {t("common.unavailable") || "غير متوفر"}
                  </span>
                </div>
              )}
            </div>

            {/* ── Scrollable content ── */}
            <div
              className="flex-1 overflow-y-auto"
              style={{ overscrollBehavior: "contain" }}
            >
              <div className="px-6 pb-8 pt-1 flex flex-col gap-5">

                {/* ── Name + badges row ── */}
                <div className="flex flex-col gap-2.5">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {item.star && (
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(192,48,96,0.15), rgba(122,23,51,0.08))",
                          border: "1px solid rgba(122,23,51,0.28)",
                          color: "var(--color-accent)",
                        }}
                      >
                        <FiStar size={11} fill="currentColor" />
                        {isRtl ? "مميز" : "Featured"}
                      </span>
                    )}
                    {categoryName && (
                      <span className="badge-gold text-[10px]">
                        {categoryName}
                      </span>
                    )}
                  </div>

                  {/* Item name */}
                  <h2
                    className="text-2xl sm:text-3xl font-black leading-snug"
                    style={{ color: "var(--text-main)" }}
                  >
                    {itemName || t("common.untitled") || "—"}
                  </h2>
                </div>

                {/* ── Gold divider ── */}
                <div className="gold-divider">
                  <div className="gold-divider-dot" />
                </div>

                {/* ── Ingredients ── */}
                {ingredients && (
                  <div className="flex flex-col gap-1.5">
                    <span
                      className="text-[10px] font-black uppercase tracking-[0.18em]"
                      style={{ color: "var(--color-primary)", opacity: 0.8 }}
                    >
                      {isRtl ? "المكونات" : "Ingredients"}
                    </span>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-secondary)", fontWeight: 500 }}
                    >
                      {ingredients}
                    </p>
                  </div>
                )}

                {/* ── Prices ── */}
                <div className="flex flex-col gap-3">
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.18em]"
                    style={{ color: "var(--color-primary)", opacity: 0.8 }}
                  >
                    {isRtl ? "الأسعار" : "Prices"}
                  </span>

                  {rawPrices.length === 1 ? (
                    /* Single price — large centered display */
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="text-4xl font-black"
                        style={{ color: "var(--color-primary-dark)" }}
                      >
                        {rawPrices[0]}
                      </span>
                      <span
                        className="text-2xl font-bold"
                        style={{ color: "var(--color-primary)" }}
                      >
                        ₪
                      </span>
                    </div>
                  ) : (
                    /* Multiple prices — tabular dotted list */
                    <div
                      className="rounded-2xl overflow-hidden"
                      style={{
                        border: "1px solid var(--border-color)",
                        background: "var(--bg-surface)",
                      }}
                    >
                      {rawPrices.map((price, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between px-4 py-3"
                          style={{
                            borderBottom:
                              idx < rawPrices.length - 1
                                ? "1px solid var(--border-color)"
                                : "none",
                          }}
                        >
                          {/* Size label */}
                          <span
                            className="text-sm font-bold"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {sizeLabels[idx] || `${idx + 1}`}
                          </span>
                          {/* Dotted fill */}
                          <div
                            className="flex-1 mx-3 h-px"
                            style={{
                              background:
                                "repeating-linear-gradient(90deg, var(--border-gold) 0, var(--border-gold) 3px, transparent 3px, transparent 8px)",
                            }}
                          />
                          {/* Price */}
                          <div className="flex items-baseline gap-1">
                            <span
                              className="text-base font-black"
                              style={{ color: "var(--color-primary-dark)" }}
                            >
                              {price}
                            </span>
                            <span
                              className="text-sm font-bold"
                              style={{ color: "var(--color-primary)" }}
                            >
                              ₪
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Ordering controls (only when enabled) ── */}
                {orderSystem && !unavailable && (
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      className="btn-primary flex-1"
                      style={{ fontSize: "0.9rem", padding: "12px 20px" }}
                    >
                      {isRtl ? "أضف للسلة" : "Add to Cart"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
