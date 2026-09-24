import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Props {
  visible: boolean;
  onExited?: () => void;
  duration?: number;
}

export default function FancyFixedLoading({
  visible,
  onExited,
  duration = 2000,
}: Props) {
  const [show, setShow] = useState(visible);
  const progress = useSpring(0, { stiffness: 60, damping: 20 });
  const startTimeRef = useRef<number | null>(null);
  const exitCalledRef = useRef(false);

  // ── Scroll lock ──
  useEffect(() => {
    if (!show) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflowY = "scroll";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      window.scrollTo(0, scrollY);
    };
  }, [show]);

  const triggerExit = useRef<() => void>(() => { });
  triggerExit.current = () => {
    if (exitCalledRef.current) return;
    exitCalledRef.current = true;
    progress.set(100);
    setTimeout(() => {
      setShow(false);
      onExited?.();
    }, 250);
  };

  useEffect(() => {
    if (!visible) return;

    setShow(true);
    exitCalledRef.current = false;
    progress.set(0);
    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - (startTimeRef.current ?? Date.now());
      const next = Math.min((elapsed / duration) * 85, 85);
      progress.set(next);
    }, 50);

    const safetyTimer = setTimeout(() => {
      clearInterval(interval);
      triggerExit.current();
    }, duration * 3);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimer);
    };
  }, [visible]);

  useEffect(() => {
    if (visible) return;
    if (!show) return;

    const elapsed = Date.now() - (startTimeRef.current ?? Date.now());
    const remaining = Math.max(duration - elapsed, 0);

    const timer = setTimeout(() => {
      triggerExit.current();
    }, remaining);

    return () => clearTimeout(timer);
  }, [visible]);

  const barWidth = useTransform(progress, (v) => `${v}%`);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="fancy-fixed-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#F1EFE1" }}
        >
          {/* Warm Olive radial background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(110,112,72,0.08) 0%, rgba(184,137,120,0.04) 50%, transparent 75%)",
            }}
          />

          {/* Subtle background grid dots */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(74,86,56,0.4) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Logo Animation */}
          <div className="relative flex items-center justify-center mb-8">
            {/* Outer slow ring */}
            <motion.div
              className="absolute rounded-full border"
              style={{
                width: "256px",
                height: "256px",
                borderColor: "rgba(74,86,56,0.12)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            />

            {/* Middle ring */}
            <motion.div
              className="absolute rounded-full border"
              style={{
                width: "216px",
                height: "216px",
                borderColor: "rgba(74,86,56,0.20)",
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* SVG spinner arc */}
            <svg
              className="absolute"
              style={{ width: "232px", height: "232px", transform: "rotate(-90deg)" }}
              viewBox="0 0 240 240"
            >
              <circle
                cx="120"
                cy="120"
                r="112"
                stroke="rgba(74,86,56,0.08)"
                strokeWidth="1.5"
                fill="none"
              />
              <motion.circle
                cx="120"
                cy="120"
                r="112"
                stroke="url(#oliveGradient)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 112 * 0.28} ${2 * Math.PI * 112 * 0.72}`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "120px 120px" }}
              />
              <defs>
                <linearGradient id="oliveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6B8457" />
                  <stop offset="50%" stopColor="#4A5638" />
                  <stop offset="100%" stopColor="#B79275" />
                </linearGradient>
              </defs>
            </svg>

            {/* Logo container */}
            <motion.div
              className="relative z-10 rounded-full flex items-center justify-center p-1"
              style={{
                width: "160px",
                height: "160px",
                background: "linear-gradient(145deg, #C8D9B8, #AABF96, #D9CCBA)",
                boxShadow: "0 6px 32px rgba(74,86,56,0.40)",
              }}
              animate={{ scale: [0.97, 1.03, 0.97] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
                style={{ background: "var(--bg-card)" }}
              >
                <img
                  src="/logo.png"
                  alt="Cake Boss"
                  className="w-[88%] h-[88%] object-contain"
                />
              </div>
            </motion.div>
          </div>

          {/* Animated Dots */}
          <div className="flex gap-2 mb-5 mt-12">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "linear-gradient(135deg, #6B8457, #4A5638)" }}
                animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>

          {/* Loading text */}
          <motion.span
            className="font-bold text-sm tracking-wider mb-6"
            style={{ color: "var(--color-primary)", letterSpacing: "0.12em" }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            جاري التحميل ...
          </motion.span>

          {/* Gold Progress Bar */}
          <div
            className="w-40 h-0.5 rounded-full overflow-hidden"
            style={{ background: "var(--bg-muted)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                width: barWidth,
                background: "linear-gradient(90deg, #6B8457, #B79275)",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}