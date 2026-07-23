import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { type Category } from "./Menu";

interface Props {
  category: Category;
  index: number;
}

export default function CategoryCard({ category, index }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full"
    >
      <button
        onClick={() => navigate(`/category/${category.id}`)}
        className="w-full group relative flex flex-col sm:flex-row items-stretch overflow-hidden outline-none rounded-3xl transition-all duration-500 focus-visible:ring-2 focus-visible:ring-offset-2 hover:border-[rgba(122,23,51,0.3)] hover:shadow-[0_16px_56px_-12px_rgba(122,23,51,0.18),0_6px_24px_-4px_rgba(201,151,58,0.14)] hover:-translate-y-1"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Burgundy top border on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(122,23,51,0.5) 30%, rgba(192,48,96,0.8) 50%, rgba(122,23,51,0.5) 70%, transparent 100%)",
          }}
        />

        {/* ─── Image Section ─── */}
        <div className="relative w-full sm:w-2/5 aspect-video sm:aspect-auto overflow-hidden" style={{ minHeight: "200px" }}>
          {category.image ? (
            <img
              src={`/images/${category.image}`}
              alt={category.nameAr || category.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
              style={{ transform: "scale(1.02)" }}
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.style.display = "none";
                const parent = t.parentElement;
                if (parent) {
                  parent.style.display = "flex";
                  parent.style.alignItems = "center";
                  parent.style.justifyContent = "center";
                  parent.style.background = "var(--bg-surface)";
                }
              }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-muted) 100%)" }}
            >
              <img src="/logo.png" className="w-1/3 opacity-20" alt="fallback" />
            </div>
          )}

          {/* Dark overlay on hover */}
          <div
            className="absolute inset-0 transition-opacity duration-400 opacity-0 group-hover:opacity-100"
            style={{
              background: "linear-gradient(to bottom, transparent 30%, rgba(44,32,24,0.4) 100%)",
            }}
          />

          {/* Burgundy shimmer on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background:
                "linear-gradient(115deg, transparent 30%, rgba(122,23,51,0.1) 50%, transparent 70%)",
            }}
          />
        </div>

        {/* ─── Content Section ─── */}
        <div className="relative flex-1 flex flex-col justify-center gap-4 py-6 px-4 sm:py-8 sm:px-6 text-right">
          {/* Background pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "radial-gradient(ellipse at 80% 50%, rgba(122,23,51,0.04) 0%, transparent 65%)",
            }}
          />

          {/* Category Title */}
          <h3
            className="text-2xl sm:text-3xl font-black leading-tight transition-all duration-300 group-hover:translate-x-[-4px]"
            style={{ color: "var(--text-main)" }}
          >
            {category.nameAr || category.name}
          </h3>

          {/* Dual-accent line: gold + burgundy */}
          <div className="flex items-center gap-0 h-0.5 self-start">
            <div
              className="h-full rounded-full transition-all duration-500 w-8 group-hover:w-[60px]"
              style={{
                background: "var(--gradient-gold)",
              }}
            />
            <div
              className="h-full rounded-full ms-1 transition-all duration-700 w-5 opacity-70 group-hover:w-[28px] group-hover:opacity-100"
              style={{
                background: "var(--gradient-burgundy)",
              }}
            />
          </div>

          {/* Browse CTA — switches to burgundy on hover */}
          <div className="mt-2">
            <div
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full font-bold text-sm text-white transition-all duration-400 group-hover:gap-3 bg-gradient-to-br from-gold-500 to-gold-700 group-hover:from-burgundy-400 group-hover:to-burgundy-500 shadow-[0_4px_16px_rgba(201,151,58,0.35)] group-hover:shadow-[0_4px_20px_rgba(122,23,51,0.45)]"
              style={{
                letterSpacing: "0.06em",
              }}
            >
              <span>{t("common.browse_menu")}</span>
              <span
                className="text-base transition-transform duration-300 group-hover:-translate-x-1.5"
                style={{ display: "inline-block" }}
              >
                ←
              </span>
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
}
