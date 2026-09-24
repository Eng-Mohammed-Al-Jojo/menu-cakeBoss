import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../components/menu/footer";
import Menu from "../components/menu/Menu";
import LoadingScreen from "../components/common/LoadingScreen";
import { motion, AnimatePresence } from "framer-motion";
import FeedbackModal from "../components/menu/FeedbackModal";
import FeaturedModal from "../components/menu/FeaturedModal";
import ItemDetailModal from "../components/menu/ItemDetailModal";
import { Flame, MessageCircle } from "lucide-react";
import { useMenu } from "../context/MenuContext";
import type { Item } from "../components/menu/Menu";

export default function MenuPage() {
  const { t } = useTranslation();
  const { complaintsWhatsapp, hasFeaturedItems, hasLoaded, featuredItems, orderSystem } = useMenu();

  const initiallyLoaded = useRef(hasLoaded);
  const [isLoading, setIsLoading] = useState(!initiallyLoaded.current);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);

  // ItemDetailModal state (opened from FeaturedModal)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    if (!initiallyLoaded.current) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleFeaturedItemDetails = (item: Item) => {
    setSelectedItem(item);
  };

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ background: "var(--gradient-bg)" }}>


      {/* Loading Screen */}
      <LoadingScreen visible={isLoading} />

      {/* ═══════ FEATURED BUTTON — Top Left ═══════ */}
      <AnimatePresence>
        {hasFeaturedItems && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
            className="fixed top-6 left-6 z-40"
          >
            <button
              onClick={() => setShowFeatured(true)}
              className="fab-featured"
              aria-label="العروض المميزة"
              id="featured-fab-btn"
            >
              {/* Shine overlay */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none opacity-40"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%)",
                }}
              />
              <Flame
                size={23}
                className="relative z-10"
                style={{ color: "#FFFFFF" }}
                strokeWidth={2}
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* ═══════ HERO SECTION ═══════ */}
      <header className="relative w-full overflow-hidden pt-12 pb-16 px-4 md:pt-16 md:pb-20">

        {/* Layered Luxury Backgrounds & Glows */}
        <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(180deg, #E9E9D2 0%, #F1EFE1 50%, #FBF8F0 100%)", opacity: 0.95 }} />

        {/* Cohesive background ornament pattern (tying with the footer) */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `url('/footerbg.png')`,
            backgroundSize: '160px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Dynamic radial glow meshes for depth */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square max-w-[800px] -z-10 pointer-events-none opacity-40 blur-[100px]"
          style={{
            background: "radial-gradient(circle, rgba(110, 112, 72, 0.18) 0%, rgba(184, 137, 120, 0.14) 50%, transparent 70%)"
          }}
        />

        {/* Dual-tone shimmer top edge */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(74,86,56,0.4) 30%, rgba(107,123,83,0.7) 50%, rgba(183,146,117,0.5) 70%, transparent 100%)",
          }}
        />

        {/* Hero Content Container */}
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center relative z-10">

          {/* Logo Badge Container */}
          <motion.div
            initial={hasLoaded ? false : { y: -30, opacity: 0, scale: 0.85 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 120, delay: 0.1 }}
            className="relative mb-8 mt-4"
          >
            {/* Outer halo / pulse rings */}
            <div className="absolute -inset-4 rounded-full bg-radial-gradient from-olive-500/20 to-transparent blur-xl animate-halo" />

            {/* Logo Container */}
            <div
              className="relative w-40 h-40 md:w-56 md:h-56 rounded-full p-[3px] shadow-2xl transition-transform duration-500 hover:scale-105 animate-logo-float"
              style={{
                background: "linear-gradient(135deg, #D9D9B6 0%, #9EA06B 50%, #D7B2A5 100%)",
                boxShadow: "var(--shadow-premium), 0 0 0 1px rgba(255,255,255,0.6)",
              }}
            >
              <div
                className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white/95 backdrop-blur-sm"
              >
                <img
                  src="/logo.png"
                  className="w-[95%] h-[95%] object-contain"
                  alt="CakeBoss Logo"
                  onError={(e) => { e.currentTarget.src = '/hamada.png' }}
                />
              </div>
            </div>
          </motion.div>

          {/* Brand Identity / Typography */}
          <div className="space-y-4 max-w-lg px-2">
            {/* Main Name English & Arabic */}
            <motion.div
              initial={hasLoaded ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-col items-center"
            >
              <h1 className="text-4xl md:text-5xl font-black tracking-wider uppercase drop-shadow-sm select-none font-serif"
                style={{
                  background: "linear-gradient(135deg, #5E603F 0%, #343528 70%, #754A42 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                Cake Boss
              </h1>

            </motion.div>

            {/* Decorative Gold Stars / Divider */}
            <motion.div
              initial={hasLoaded ? false : { scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex items-center justify-center gap-3 w-48 mx-auto"
            >
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-primary/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-primary/60" />
            </motion.div>

            {/* Luxury Subtitle Pill */}
            <motion.div
              initial={hasLoaded ? false : { y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full border shadow-sm backdrop-blur-md"
              style={{
                background: "rgba(255, 255, 255, 0.45)",
                borderColor: "var(--border-gold)",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              {/* Gold dot accent */}
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span
                className="text-xs md:text-sm font-black tracking-widest uppercase text-(--text-main)"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {t("menu.subtitle")}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            </motion.div>
          </div>
        </div>

        {/* Elegant Bottom Transition Wave */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, #FBF8F0 100%)",
          }}
        />
      </header>


      {/* ═══════ MAIN CONTENT ═══════ */}
      <main className="relative z-10 flex flex-col flex-1 pb-12 md:pb-16">
        <div className="w-full max-w-5xl mx-auto px-4 md:px-8">
          <Menu onLoadingChange={handleLoadingChange} />
        </div>
      </main>

      {/* ═══════ FEATURED MODAL ═══════ */}
      <FeaturedModal
        isOpen={showFeatured}
        onClose={() => setShowFeatured(false)}
        items={featuredItems}
        orderSystem={orderSystem}
        onDetailsClick={handleFeaturedItemDetails}
      />

      {/* ═══════ ITEM DETAIL MODAL (opened from Featured) ═══════ */}
      {selectedItem && (
        <ItemDetailModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
          orderSystem={orderSystem}
        />
      )}

      {complaintsWhatsapp !== "" && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          complaintsWhatsapp={complaintsWhatsapp}
        />
      )}

      <Footer
      />
    </div>
  );
}