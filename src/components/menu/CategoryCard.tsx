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
        className="w-full group relative flex flex-col sm:flex-row items-stretch overflow-hidden outline-none rounded-3xl transition-all duration-500 focus-visible:ring-2 focus-visible:ring-offset-2 hover:border-olive-500/40 hover:shadow-[0_16px_48px_-12px_rgba(74,86,56,0.18),0_6px_24px_-4px_rgba(183,146,117,0.14)] hover:-translate-y-1 bg-white border border-(--border-color) shadow-(--shadow-card)"
      >
        {/* Olive & Mocha top border on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 bg-gradient-to-r from-transparent via-olive-500 to-mocha-500"
        />

        {/* ─── Image Section ─── */}
        <div className="relative w-full sm:w-2/5 aspect-video sm:aspect-auto overflow-hidden min-h-[200px]">
          {category.image ? (
            <img
              src={`/images/${category.image}`}
              alt={category.nameAr || category.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07] scale-[1.02]"
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
              className="w-full h-full flex items-center justify-center bg-gradient-to-br from-(--bg-surface) to-(--bg-muted)"
            >
              <img src="/logo.png" className="w-1/3 opacity-20" alt="fallback" />
            </div>
          )}

          {/* Dark overlay on hover */}
          <div
            className="absolute inset-0 transition-opacity duration-400 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/40 via-transparent to-transparent"
          />

          {/* Soft shimmer on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-tr from-transparent via-olive-500/10 to-transparent"
          />
        </div>

        {/* ─── Content Section ─── */}
        <div className="relative flex-1 flex flex-col justify-center gap-4 py-6 px-4 sm:py-8 sm:px-6 text-right">
          {/* Subtle background radial pattern on hover */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_80%_50%,rgba(74,86,56,0.04)_0%,transparent_65%)]"
          />

          {/* Category Title */}
          <h3
            className="text-2xl sm:text-3xl font-black leading-tight transition-all duration-300 group-hover:translate-x-[-4px] text-(--text-main)"
          >
            {category.nameAr || category.name}
          </h3>

          {/* Dual-accent line: olive + mocha */}
          <div className="flex items-center gap-0 h-0.5 self-start">
            <div
              className="h-full rounded-full transition-all duration-500 w-8 group-hover:w-[60px] bg-gradient-to-r from-olive-600 to-olive-500"
            />
            <div
              className="h-full rounded-full ms-1 transition-all duration-700 w-5 opacity-70 group-hover:w-[28px] group-hover:opacity-100 bg-gradient-to-r from-mocha-500 to-mocha-400"
            />
          </div>

          {/* Browse CTA — Tailwind styled button */}
          <div className="mt-2">
            <div
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full font-bold text-sm text-white tracking-wider transition-all duration-400 group-hover:gap-3 bg-gradient-to-r from-olive-600 to-olive-700 group-hover:from-mocha-600 group-hover:to-mocha-500 shadow-md group-hover:shadow-lg"
            >
              <span>{t("common.browse_menu")}</span>
              <span
                className="text-base transition-transform duration-300 group-hover:-translate-x-1.5 inline-block"
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
