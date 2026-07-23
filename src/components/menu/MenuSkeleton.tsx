import { motion } from "framer-motion";

export default function MenuSkeleton() {
  const categories = [1, 2, 3];

  return (
    <div className="w-full flex flex-col gap-8 pt-4">
      {categories.map((cat, i) => (
        <motion.div
          key={cat}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12, duration: 0.6, ease: "easeOut" }}
          className="w-full flex flex-col gap-5"
        >
          {/* Category Card Skeleton */}
          <div
            className="w-full relative overflow-hidden rounded-3xl"
            style={{
              height: "200px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 z-10"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(201,151,58,0.06) 40%, rgba(232,190,92,0.10) 50%, rgba(201,151,58,0.06) 60%, transparent 100%)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />

            {/* Left image area */}
            <div
              className="absolute left-0 top-0 bottom-0 w-2/5"
              style={{ background: "var(--bg-surface)" }}
            />

            {/* Right content placeholders */}
            <div className="absolute right-0 top-0 bottom-0 w-3/5 p-6 flex flex-col justify-center gap-4">
              <div className="h-6 w-3/4 rounded-full skeleton-line" />
              <div className="h-1 w-16 rounded-full skeleton-line" />
              <div className="h-9 w-32 rounded-full skeleton-line mt-2" />
            </div>
          </div>

          {/* Item Skeletons */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item, j) => (
              <div
                key={item}
                className="relative overflow-hidden rounded-2xl flex flex-col"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                {/* Item Shimmer */}
                <motion.div
                  className="absolute inset-0 z-10"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(201,151,58,0.05) 40%, rgba(232,190,92,0.08) 50%, rgba(201,151,58,0.05) 60%, transparent 100%)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.1 + j * 0.08,
                  }}
                />

                {/* Image placeholder */}
                <div
                  className="aspect-square w-full"
                  style={{ background: "var(--bg-surface)" }}
                />

                {/* Content placeholder */}
                <div className="p-3.5 flex flex-col items-center gap-2.5">
                  <div className="h-3.5 w-4/5 rounded-full skeleton-line" />
                  <div className="h-2.5 w-3/5 rounded-full skeleton-line" />
                  <div className="h-6 w-16 rounded-full skeleton-line mt-1" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
