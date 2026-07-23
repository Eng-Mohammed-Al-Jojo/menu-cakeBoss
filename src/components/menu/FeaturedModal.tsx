import { useMemo, useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useMenu } from "../../context/MenuContext";
import { type Item } from "./Menu";
import ItemDetailModal from "./ItemDetailModal";

interface Props {
  show: boolean;
  onClose: () => void;
}

/* ─── Size labels ─── */
const SIZE_LABELS_AR = ["صغير", "وسط", "كبير", "عائلي"];
const SIZE_LABELS_EN = ["S", "M", "L", "XL"];

/* ─── Individual Premium Card ─── */
function FeaturedCard({
  item,
  index,
}: {
  item: Item;
  index: number;
}) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: index * 0.07,
          duration: 0.55,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`group relative flex flex-col overflow-hidden rounded-3xl select-none ${
          unavailable ? "opacity-60 grayscale-[0.6]" : "cursor-pointer"
        }`}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          boxShadow:
            "0 4px 28px -6px rgba(28,18,12,0.12), 0 2px 8px -2px rgba(201,151,58,0.08)",
          transition: "transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.45s cubic-bezier(0.25,0.46,0.45,0.94), border-color 0.35s ease",
        }}
        onClick={() => {
          if (!unavailable) setIsDetailOpen(true);
        }}
        onMouseEnter={(e) => {
          if (unavailable) return;
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "translateY(-7px) scale(1.012)";
          el.style.boxShadow =
            "0 20px 56px -10px rgba(28,18,12,0.22), 0 8px 24px -4px rgba(122,23,51,0.14), 0 0 0 1px rgba(201,151,58,0.22)";
          el.style.borderColor = "rgba(201,151,58,0.4)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "translateY(0) scale(1)";
          el.style.boxShadow =
            "0 4px 28px -6px rgba(28,18,12,0.12), 0 2px 8px -2px rgba(201,151,58,0.08)";
          el.style.borderColor = "var(--border-color)";
        }}
      >
        {/* ── Dual-tone top reveal border ── */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(201,151,58,0.6) 25%, rgba(232,190,92,0.9) 42%, rgba(192,48,96,0.7) 50%, rgba(232,190,92,0.9) 58%, rgba(201,151,58,0.6) 75%, transparent 100%)",
          }}
        />

        {/* ── Featured Star badge ── */}
        <div
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{
            background: "linear-gradient(135deg, rgba(192,48,96,0.92), rgba(122,23,51,0.92))",
            backdropFilter: "blur(8px)",
            boxShadow: "0 2px 12px rgba(122,23,51,0.45)",
          }}
        >
          <FiStar size={10} fill="white" stroke="white" />
          <span className="text-white font-black text-[10px] tracking-wider uppercase">
            {isRtl ? "مميز" : "Featured"}
          </span>
        </div>

        {/* ── Image Area ── */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "4 / 3", background: "var(--bg-surface)" }}
        >
          {/* Shimmer placeholder */}
          {!imgLoaded && (
            <div className="absolute inset-0 skeleton-line" />
          )}

          <img
            src={imageSrc}
            alt={itemName}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
            style={{ opacity: imgLoaded ? 1 : 0, transition: "opacity 0.4s ease, transform 0.7s ease" }}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.src = "/logo.png";
              el.className =
                "w-2/5 h-2/5 object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15";
              setImgLoaded(true);
            }}
          />

          {/* Hover burgundy shimmer */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, transparent 40%, rgba(122,23,51,0.07) 70%, transparent 100%)",
            }}
          />

          {/* Bottom gradient fade into card */}
          <div
            className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(253,251,248,0.6) 100%)",
            }}
          />

          {/* Unavailable overlay */}
          {unavailable && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(253,249,240,0.75)", backdropFilter: "blur(3px)" }}
            >
              <span className="unavailable-badge text-xs">غير متوفر</span>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="flex flex-col gap-3 p-4 flex-1">
          {/* Name */}
          <h3
            className="text-base font-black leading-snug line-clamp-2 text-right"
            style={{ color: "var(--text-main)" }}
          >
            {itemName}
          </h3>

          {/* Ingredients */}
          {ingredients && (
            <p
              className="text-xs leading-relaxed line-clamp-2 text-right"
              style={{ color: "var(--text-muted)", fontWeight: 500 }}
            >
              {ingredients}
            </p>
          )}

          {/* Decorative gold separator */}
          <div className="flex items-center gap-2 my-0.5">
            <div
              className="h-px flex-1 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(201,151,58,0.3), transparent)",
              }}
            />
            <div
              className="w-1 h-1 rounded-full"
              style={{ background: "rgba(201,151,58,0.5)" }}
            />
            <div
              className="h-px flex-1 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(201,151,58,0.3), transparent)",
              }}
            />
          </div>

          {/* Prices */}
          <div className="flex flex-col gap-1.5 mt-auto">
            {rawPrices.length === 1 ? (
              <div className="flex items-baseline gap-1 justify-end">
                <span
                  className="text-2xl font-black"
                  style={{ color: "var(--color-primary-dark)" }}
                >
                  {rawPrices[0]}
                </span>
                <span
                  className="text-base font-bold"
                  style={{ color: "var(--color-primary)" }}
                >
                  ₪
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {rawPrices.map((price, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(201,151,58,0.06), rgba(201,151,58,0.03))",
                      border: "1px solid rgba(201,151,58,0.15)",
                    }}
                  >
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {sizeLabels[idx] || `${idx + 1}`}
                    </span>
                    <div className="flex items-baseline gap-0.5">
                      <span
                        className="text-sm font-black"
                        style={{ color: "var(--color-primary-dark)" }}
                      >
                        {price}
                      </span>
                      <span
                        className="text-xs font-bold"
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

          {/* View Details CTA */}
          {!unavailable && (
            <button
              className="w-full mt-1 py-2.5 rounded-xl font-black text-xs text-white tracking-wider uppercase transition-all duration-300 group-hover:shadow-[0_6px_20px_rgba(122,23,51,0.4)]"
              style={{
                background: "linear-gradient(135deg, #C9973A 0%, #9A6D18 100%)",
                boxShadow: "0 3px 12px rgba(201,151,58,0.3)",
                transition: "background 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "linear-gradient(135deg, #C03060 0%, #7A1733 100%)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 6px 20px rgba(122,23,51,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "linear-gradient(135deg, #C9973A 0%, #9A6D18 100%)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 3px 12px rgba(201,151,58,0.3)";
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsDetailOpen(true);
              }}
            >
              {i18n.language === "ar" ? "عرض التفاصيل" : "View Details"}
            </button>
          )}
        </div>
      </motion.div>

      <ItemDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        item={item}
        orderSystem={false}
      />
    </>
  );
}

/* ══════════════════════════════════
   Main FeaturedModal
══════════════════════════════════ */
export default function FeaturedModal({ show, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const { menuData } = useMenu();
  const isRtl = i18n.language === "ar";

  /* ── items from context, no extra DB fetch ── */
  const items = useMemo(() => {
    if (!menuData) return [];
    return menuData.items.filter(
      (item) => item.star === true && item.visible !== false
    );
  }, [menuData]);

  /* ── Carousel state ── */
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHoveringRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);

  /* ── Slides per view based on viewport ── */
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setSlidesPerView(3);
      else if (window.innerWidth >= 640) setSlidesPerView(2);
      else setSlidesPerView(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalSlides = items.length;
  const canGoNext = activeIndex < totalSlides - slidesPerView;
  const canGoPrev = activeIndex > 0;

  /* ── Scroll to slide ── */
  const scrollToIndex = useCallback(
    (idx: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = Math.max(0, Math.min(idx, totalSlides - slidesPerView));
      setActiveIndex(clamped);
      const slideWidth = track.scrollWidth / totalSlides;
      track.scrollTo({
        left: isRtl ? -(clamped * slideWidth) : clamped * slideWidth,
        behavior: "smooth",
      });
    },
    [totalSlides, slidesPerView, isRtl]
  );

  const goNext = useCallback(() => {
    if (canGoNext) scrollToIndex(activeIndex + 1);
    else scrollToIndex(0); // loop back
  }, [canGoNext, activeIndex, scrollToIndex]);

  const goPrev = useCallback(() => {
    if (canGoPrev) scrollToIndex(activeIndex - 1);
    else scrollToIndex(totalSlides - slidesPerView); // loop to end
  }, [canGoPrev, activeIndex, scrollToIndex, totalSlides, slidesPerView]);

  /* ── Autoplay ── */
  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (!isHoveringRef.current && !isDraggingRef.current) {
        setActiveIndex((prev) => {
          const next = prev < totalSlides - slidesPerView ? prev + 1 : 0;
          const track = trackRef.current;
          if (track) {
            const slideWidth = track.scrollWidth / totalSlides;
            track.scrollTo({
              left: isRtl ? -(next * slideWidth) : next * slideWidth,
              behavior: "smooth",
            });
          }
          return next;
        });
      }
    }, 3500);
  }, [totalSlides, slidesPerView, isRtl]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = null;
  }, []);

  useEffect(() => {
    if (show && items.length > slidesPerView) {
      startAutoplay();
    }
    return stopAutoplay;
  }, [show, items.length, slidesPerView, startAutoplay, stopAutoplay]);

  /* ── Keyboard & body scroll lock ── */
  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") isRtl ? goNext() : goPrev();
      if (e.key === "ArrowRight") isRtl ? goPrev() : goNext();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [show, onClose, goNext, goPrev, isRtl]);

  /* ── Mouse drag on carousel track ── */
  const onMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = trackRef.current?.scrollLeft ?? 0;
    stopAutoplay();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    trackRef.current.scrollLeft = dragStartScrollRef.current - dx;
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    isDraggingRef.current = false;
    if (Math.abs(dx) > 60) {
      if (dx < 0) goNext();
      else goPrev();
    }
    startAutoplay();
  };

  /* ── Track scroll sync for indicator ── */
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const slideWidth = track.scrollWidth / totalSlides;
    if (slideWidth === 0) return;
    const idx = Math.round(Math.abs(track.scrollLeft) / slideWidth);
    setActiveIndex(Math.max(0, Math.min(idx, totalSlides - 1)));
  };

  /* ── Touch events ── */
  const touchStartXRef = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    stopAutoplay();
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) goNext();
      else goPrev();
    }
    startAutoplay();
  };

  if (typeof document === "undefined") return null;

  const slideWidthPct = 100 / slidesPerView;
  const showArrows = totalSlides > slidesPerView;
  const dotCount = Math.max(0, totalSlides - slidesPerView + 1);

  return createPortal(
    <AnimatePresence>
      {show && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label={isRtl ? "الأصناف المميزة" : "Featured Items"}
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* ── Backdrop ── */}
          <motion.div
            key="featured-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
            style={{
              background: "rgba(22,13,8,0.75)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
            onClick={onClose}
          />

          {/* ── Modal Shell ── */}
          <motion.div
            key="featured-modal"
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            className="relative z-10 w-full max-w-5xl flex flex-col overflow-hidden"
            style={{
              background: "var(--bg-card)",
              borderRadius: "28px",
              border: "1px solid rgba(201,151,58,0.28)",
              boxShadow:
                "0 40px 100px -15px rgba(22,13,8,0.55), 0 16px 40px -8px rgba(22,13,8,0.3), 0 0 0 1px rgba(201,151,58,0.1)",
              maxHeight: "92vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Decorative top gradient line ── */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] z-10 rounded-t-[28px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(201,151,58,0.5) 18%, rgba(232,190,92,0.85) 36%, rgba(192,48,96,0.7) 50%, rgba(232,190,92,0.85) 64%, rgba(201,151,58,0.5) 82%, transparent 100%)",
              }}
            />

            {/* ── Decorative radial glow behind header ── */}
            <div
              className="absolute top-0 left-0 right-0 h-28 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(201,151,58,0.06) 0%, transparent 70%)",
              }}
            />

            {/* ════════════ HEADER ════════════ */}
            <div
              className="relative flex items-center justify-between px-6 py-5 shrink-0"
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              {/* Left: Icon + Title */}
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_4px_18px_rgba(201,151,58,0.4)]"
                  style={{
                    background:
                      "linear-gradient(135deg, #E8BE5C 0%, #C9973A 50%, #9A6D18 100%)",
                  }}
                >
                  <FiStar size={22} fill="white" stroke="white" />
                </div>

                <div className="flex flex-col gap-0.5">
                  <h2
                    className="text-lg sm:text-xl font-black leading-tight"
                    style={{ color: "var(--text-main)" }}
                  >
                    {t("common.most_ordered")}
                  </h2>
                  {/* Mini gold/burgundy accent bar */}
                  <div className="flex items-center gap-1">
                    <div
                      className="h-0.5 w-10 rounded-full"
                      style={{ background: "var(--gradient-gold)" }}
                    />
                    <div
                      className="h-0.5 w-5 rounded-full opacity-70"
                      style={{ background: "var(--gradient-burgundy)" }}
                    />
                  </div>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {isRtl ? "أفضل ما نقدّمه لكم" : "Our finest selections"}
                  </p>
                </div>
              </div>

              {/* Right: Item count pill + Close */}
              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <div
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(201,151,58,0.1), rgba(201,151,58,0.05))",
                      border: "1px solid rgba(201,151,58,0.25)",
                    }}
                  >
                    <span
                      className="text-xs font-black"
                      style={{ color: "var(--color-primary-dark)" }}
                    >
                      {items.length}
                    </span>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {isRtl ? "صنف مميز" : "items"}
                    </span>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="feedback-close-btn"
                  style={{ position: "relative", top: "auto", right: "auto" }}
                  aria-label={isRtl ? "إغلاق" : "Close"}
                >
                  <FiX size={17} />
                </button>
              </div>
            </div>

            {/* ════════════ BODY ════════════ */}
            <div className="relative flex-1 overflow-hidden">
              {items.length === 0 ? (
                /* ── Empty state ── */
                <div className="flex flex-col items-center justify-center gap-5 py-24 px-8">
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center"
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <FiStar size={32} style={{ color: "var(--text-muted)" }} />
                  </div>
                  <div className="text-center">
                    <p
                      className="font-black text-base"
                      style={{ color: "var(--text-main)" }}
                    >
                      {t("common.no_items_placeholder")}
                    </p>
                    <p
                      className="text-sm font-medium mt-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {isRtl
                        ? "لا توجد أصناف مميزة حالياً"
                        : "No featured items available"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* ── Carousel Track Wrapper ── */}
                  <div
                    className="relative px-4 sm:px-6 pt-5 pb-2 flex-1"
                    onMouseEnter={() => { isHoveringRef.current = true; stopAutoplay(); }}
                    onMouseLeave={() => { isHoveringRef.current = false; startAutoplay(); }}
                  >
                    {/* Track */}
                    <div
                      ref={trackRef}
                      className="flex gap-4 overflow-x-auto cursor-grab active:cursor-grabbing"
                      style={{
                        scrollSnapType: "x mandatory",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        WebkitOverflowScrolling: "touch",
                        userSelect: "none",
                      }}
                      onScroll={onScroll}
                      onMouseDown={onMouseDown}
                      onMouseMove={onMouseMove}
                      onMouseUp={onMouseUp}
                      onMouseLeave={onMouseUp}
                      onTouchStart={onTouchStart}
                      onTouchEnd={onTouchEnd}
                    >
                      {/* Hide native scrollbar */}
                      <style>{`.featured-track::-webkit-scrollbar { display: none; }`}</style>
                      {items.map((item, i) => (
                        <div
                          key={item.id}
                          className="shrink-0"
                          style={{
                            width: `calc(${slideWidthPct}% - ${((slidesPerView - 1) * 16) / slidesPerView}px)`,
                            scrollSnapAlign: "start",
                          }}
                        >
                          <FeaturedCard item={item} index={i} />
                        </div>
                      ))}
                    </div>

                    {/* ── Prev Arrow ── */}
                    {showArrows && (
                      <AnimatePresence>
                        {canGoPrev && (
                          <motion.button
                            key="prev-arrow"
                            initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isRtl ? 10 : -10 }}
                            transition={{ duration: 0.25 }}
                            onClick={goPrev}
                            className="absolute top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300"
                            style={{
                              [isRtl ? "right" : "left"]: "0px",
                              background: "rgba(255,255,255,0.92)",
                              backdropFilter: "blur(8px)",
                              border: "1px solid rgba(201,151,58,0.3)",
                              boxShadow: "0 4px 20px rgba(28,18,12,0.15)",
                              color: "var(--color-primary-dark)",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background =
                                "linear-gradient(135deg, #E8BE5C, #C9973A)";
                              (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background =
                                "rgba(255,255,255,0.92)";
                              (e.currentTarget as HTMLButtonElement).style.color =
                                "var(--color-primary-dark)";
                            }}
                            aria-label={isRtl ? "السابق" : "Previous"}
                          >
                            {isRtl ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
                          </motion.button>
                        )}
                      </AnimatePresence>
                    )}

                    {/* ── Next Arrow ── */}
                    {showArrows && (
                      <AnimatePresence>
                        {(canGoNext || totalSlides > slidesPerView) && (
                          <motion.button
                            key="next-arrow"
                            initial={{ opacity: 0, x: isRtl ? -10 : 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isRtl ? -10 : 10 }}
                            transition={{ duration: 0.25 }}
                            onClick={goNext}
                            className="absolute top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300"
                            style={{
                              [isRtl ? "left" : "right"]: "0px",
                              background: "rgba(255,255,255,0.92)",
                              backdropFilter: "blur(8px)",
                              border: "1px solid rgba(201,151,58,0.3)",
                              boxShadow: "0 4px 20px rgba(28,18,12,0.15)",
                              color: "var(--color-primary-dark)",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background =
                                "linear-gradient(135deg, #E8BE5C, #C9973A)";
                              (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background =
                                "rgba(255,255,255,0.92)";
                              (e.currentTarget as HTMLButtonElement).style.color =
                                "var(--color-primary-dark)";
                            }}
                            aria-label={isRtl ? "التالي" : "Next"}
                          >
                            {isRtl ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
                          </motion.button>
                        )}
                      </AnimatePresence>
                    )}
                  </div>

                  {/* ════ PAGINATION DOTS ════ */}
                  {dotCount > 1 && (
                    <div className="flex items-center justify-center gap-2 py-4 px-6 shrink-0">
                      {/* Progress bar style */}
                      <div
                        className="flex-1 max-w-[200px] h-0.5 rounded-full overflow-hidden"
                        style={{ background: "var(--bg-muted)" }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: "var(--gradient-gold)" }}
                          animate={{
                            width: `${((activeIndex + 1) / dotCount) * 100}%`,
                          }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                      </div>

                      {/* Dot indicators */}
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: Math.min(dotCount, 8) }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => scrollToIndex(i)}
                            className="transition-all duration-350"
                            style={{
                              width: i === activeIndex ? "20px" : "6px",
                              height: "6px",
                              borderRadius: "3px",
                              background:
                                i === activeIndex
                                  ? "var(--gradient-gold)"
                                  : "var(--bg-muted)",
                            }}
                            aria-label={`Go to slide ${i + 1}`}
                          />
                        ))}
                      </div>

                      {/* Numeric counter */}
                      <span
                        className="text-[11px] font-black tabular-nums shrink-0"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {activeIndex + 1} / {totalSlides}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}