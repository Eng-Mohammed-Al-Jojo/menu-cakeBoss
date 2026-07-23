import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { useMenu } from "../context/MenuContext";
import CategorySection from "../components/menu/CategorySection";
import Footer from "../components/menu/footer";
import FeedbackModal from "../components/menu/FeedbackModal";
import LoadingScreen from "../components/common/LoadingScreen";
import { MessageCircle } from "lucide-react";

const BACK_TRANSITION_MS = 1000;

export default function CategoryItemsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const { menuData, hasLoaded, complaintsWhatsapp } = useMenu();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isGoingBack, setIsGoingBack] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleBack = useCallback(() => {
    if (isGoingBack) return;
    setIsGoingBack(true);
    timerRef.current = setTimeout(() => {
      navigate("/");
    }, BACK_TRANSITION_MS);
  }, [isGoingBack, navigate]);

  const category = useMemo(
    () => menuData?.categories.find((c) => c.id === id),
    [menuData, id]
  );
  const items = useMemo(
    () =>
      menuData?.items.filter((i) => i.categoryId === id && i.visible !== false) || [],
    [menuData, id]
  );
  const subcategories = useMemo(
    () => menuData?.subcategories.filter((s) => s.categoryId === id) || [],
    [menuData, id]
  );

  if (!hasLoaded) return <LoadingScreen visible={true} />;

  if (!category)
    return (
      <div
        className="text-center p-20 text-xl font-bold"
        style={{ color: "var(--text-main)" }}
      >
        {t("common.not_found")}
      </div>
    );

  return (
    <div
      className="min-h-screen flex flex-col"

    >
      {/* ═══ Back-Navigation Loading Overlay ═══ */}
      <AnimatePresence>
        {isGoingBack && (
          <motion.div
            key="back-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none"
            style={{ background: "var(--bg-page)", pointerEvents: "all" }}
          >
            {/* Warm radial background */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(201,151,58,0.08) 0%, transparent 65%)",
              }}
            />

            {/* Animated logo */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <motion.div
                className="absolute rounded-full border"
                style={{
                  inset: 0,
                  borderColor: "rgba(201,151,58,0.15)",
                }}
                animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* SVG spinner */}
              <svg
                className="absolute inset-0 w-full h-full"
                style={{ transform: "rotate(-90deg)" }}
                viewBox="0 0 160 160"
              >
                <circle
                  cx="80"
                  cy="80"
                  r="72"
                  stroke="rgba(201,151,58,0.08)"
                  strokeWidth="2"
                  fill="none"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="72"
                  stroke="#C9973A"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 72 * 0.3} ${2 * Math.PI * 72 * 0.7}`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "80px 80px" }}
                />
              </svg>

              {/* Logo */}
              <motion.div
                className="relative z-10 rounded-full flex items-center justify-center p-1"
                style={{
                  width: "88px",
                  height: "88px",
                  background: "linear-gradient(145deg, #E8BE5C, #C9973A, #9A6D18)",
                  boxShadow: "0 4px 24px rgba(201,151,58,0.4)",
                }}
                animate={{ scale: [0.97, 1.03, 0.97] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div
                  className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
                  style={{ background: "var(--bg-card)" }}
                >
                  <img
                    src="/logo.png"
                    className="w-[88%] h-[88%] object-contain"
                    alt="Logo"
                  />
                </div>
              </motion.div>
            </div>

            {/* Going back text */}
            <motion.div
              className="mt-8 flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span
                className="font-bold text-sm tracking-widest uppercase"
                style={{ color: "var(--color-primary)", letterSpacing: "0.1em" }}
              >
                {isRtl ? "جارٍ العودة" : "Going back"}
              </span>
              <span className="flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full inline-block"
                    style={{ background: "var(--color-primary)" }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ HEADER ═══ */}
      <header
        className="sticky top-0 z-50 px-4 sm:px-6 py-3.5 flex items-center justify-between"
        style={{
          background: "rgba(253,251,248,0.90)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-color)",
          boxShadow: "0 2px 20px rgba(122,23,51,0.06), 0 1px 8px rgba(201,151,58,0.06)",
        }}
      >
        {/* Dual-tone bottom border: gold + burgundy */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(201,151,58,0.4) 25%, rgba(232,190,92,0.7) 40%, rgba(192,48,96,0.55) 50%, rgba(232,190,92,0.7) 60%, rgba(201,151,58,0.4) 75%, transparent 100%)",
          }}
        />

        {/* Back Button — burgundy hover */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 font-black rounded-xl px-3.5 py-2 transition-all duration-250"
          style={{ color: "var(--color-accent)" }}
          onMouseEnter={(e) => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background = "rgba(122,23,51,0.08)";
            b.style.color = "var(--color-accent-dark)";
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background = "transparent";
            b.style.color = "var(--color-accent)";
          }}
        >
          {isRtl ? <FiArrowRight size={22} /> : <FiArrowLeft size={22} />}
          <span className="text-sm">{t("common.back")}</span>
        </button>

        {/* Category Title */}
        <div className="flex flex-col items-center gap-1">
          <h1
            className="text-lg font-black tracking-tight"
            style={{ color: "var(--text-main)" }}
          >
            {category.nameAr || category.name}
          </h1>
          {/* Burgundy + gold underline */}
          <div className="flex items-center gap-0.5">
            <div
              className="h-0.5 w-4 rounded-full"
              style={{ background: "var(--gradient-burgundy)" }}
            />
            <div
              className="h-0.5 w-6 rounded-full"
              style={{ background: "var(--gradient-gold)" }}
            />
          </div>
        </div>

        {/* Spacer */}
        <div className="w-16" />
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <main
        className="flex-1 max-w-4xl mx-auto w-full px-4 py-8"
      >
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <CategorySection
            category={category}
            items={items}
            subcategories={subcategories}
            orderSystem={false}
          />
        </motion.div>
      </main>

      {complaintsWhatsapp !== "" && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          complaintsWhatsapp={complaintsWhatsapp}
        />
      )}

      {/* ═══════ FLOATING FEEDBACK FAB — Bottom Right ═══════ */}
      <AnimatePresence>
        {complaintsWhatsapp !== "" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 22 }}
            className="fixed bottom-7 right-7 z-[200]"
            style={{ isolation: "isolate" }}
          >
            {/* FAB Button */}
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="fab-feedback"
              aria-label="شاركنا برأيك"
              id="feedback-fab-btn"
            >
              {/* Shine overlay */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none opacity-40"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%)",
                }}
              />
              <MessageCircle
                size={23}
                className="relative z-10"
                style={{ color: "#FFFFFF" }}
                strokeWidth={2}
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer
      />
    </div>
  );
}
