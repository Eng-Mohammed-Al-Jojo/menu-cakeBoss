import { useEffect, useState } from "react";
import { FiX, FiStar } from "react-icons/fi";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { type Item } from "./Menu";
import ItemCard from "./ItemCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

interface Props {
  show: boolean;
  onClose: () => void;
}

export default function FeaturedModal({ show, onClose }: Props) {
  const { t } = useTranslation();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!show) return;

    const fetchStarItems = async () => {
      setLoading(true);
      try {
        const snap = await get(ref(db, "items"));
        if (snap.exists()) {
          const data = snap.val();
          const starItems = Object.entries(data)
            .map(([id, item]: any) => ({ id, ...item }))
            .filter((item: any) => item.star === true && item.visible !== false);
          setItems(starItems);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStarItems();
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{ background: "rgba(44,32,24,0.65)", backdropFilter: "blur(10px)" }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 28 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative z-10 w-full max-w-4xl flex flex-col overflow-hidden rounded-3xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-gold)",
              boxShadow: "0 24px 80px rgba(44,32,24,0.4), 0 0 0 1px rgba(201,151,58,0.15)",
              maxHeight: "90vh",
            }}
          >
            {/* Dual-tone top border: gold + burgundy */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 z-10"
              style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,151,58,0.45) 20%, rgba(232,190,92,0.75) 38%, rgba(192,48,96,0.65) 50%, rgba(232,190,92,0.75) 62%, rgba(201,151,58,0.45) 80%, transparent 100%)" }}
            />

            {/* Header */}
            <div
              className="flex items-center justify-between p-5 sm:p-6"
              style={{
                borderBottom: "1px solid var(--border-color)",
                background: "linear-gradient(135deg, rgba(201,151,58,0.05) 0%, transparent 100%)",
              }}
            >
              <div className="flex items-center gap-3">
                {/* Gold star icon */}
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #E8BE5C, #C9973A)",
                    boxShadow: "0 4px 16px rgba(201,151,58,0.4)",
                  }}
                >
                  <FiStar size={20} fill="white" stroke="white" />
                </div>

                <div>
                  <h2
                    className="text-lg sm:text-xl font-black"
                    style={{ color: "var(--text-main)" }}
                  >
                    {t("common.most_ordered")}
                  </h2>
                  <p
                    className="text-xs font-semibold mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    أفضل ما نقدمه
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-muted)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(122,23,51,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--color-accent)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(122,23,51,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-surface)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-color)";
                }}
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              {loading ? (
                <div className="text-center py-20 flex flex-col items-center gap-4">
                  {/* Gold loading spinner */}
                  <div
                    className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: "rgba(201,151,58,0.2)", borderTopColor: "#C9973A" }}
                  />
                  <span style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: "0.9rem" }}>
                    {t("common.loading")}
                  </span>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)" }}
                  >
                    <FiStar size={28} style={{ color: "var(--text-muted)" }} />
                  </div>
                  <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>
                    {t("common.no_items_placeholder")}
                  </p>
                </div>
              ) : (
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={20}
                  slidesPerView={1}
                  navigation={true}
                  pagination={{ clickable: true }}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                    },
                    1024: {
                      slidesPerView: 3,
                    },
                  }}
                  className="w-full pb-12 featured-swiper"
                >
                  {items.map((item) => (
                    <SwiperSlide key={item.id}>
                      <ItemCard item={item} index={0} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}