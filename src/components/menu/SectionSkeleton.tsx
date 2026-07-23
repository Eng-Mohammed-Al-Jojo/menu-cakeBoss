import { motion } from "framer-motion";

export default function SectionSkeleton() {
  return (
    <div className="w-full flex flex-col gap-8">
      {/* Header Skeleton */}
      <div className="flex flex-col items-end gap-2.5 mb-2">
        <div className="flex items-center gap-3">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "rgba(201,151,58,0.3)" }}
          />
          <div
            className="h-7 w-40 rounded-full skeleton-line"
          />
        </div>
        <div className="flex items-center gap-1.5 self-end">
          <div
            className="h-0.5 rounded-full skeleton-line"
            style={{ width: "48px" }}
          />
          <div
            className="h-0.5 rounded-full"
            style={{ width: "12px", background: "rgba(122,23,51,0.2)" }}
          />
        </div>
      </div>

      {/* Items Skeleton Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((item, j) => (
          <div
            key={item}
            className="relative overflow-hidden rounded-2xl flex flex-col"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            {/* Gold shimmer */}
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
                delay: j * 0.1,
              }}
            />
            {/* Image area */}
            <div
              className="aspect-square w-full"
              style={{ background: "var(--bg-surface)" }}
            />
            {/* Content */}
            <div className="p-3.5 flex flex-col items-center gap-2.5">
              <div className="h-3.5 w-4/5 rounded-full skeleton-line" />
              <div className="h-2.5 w-3/5 rounded-full skeleton-line" />
              <div className="h-6 w-16 rounded-full skeleton-line mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
