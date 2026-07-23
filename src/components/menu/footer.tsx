import {
  FaLaptopCode,
  FaMapMarkerAlt,
  FaInstagram,
  FaWhatsapp,
  FaFacebookF,
  FaPhoneAlt,
  FaTelegramPlane,
  FaTiktok,
  FaGlobe,
} from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const LOCAL_STORAGE_KEY = "footerInfo";

/* ─── Small helper: info card ─── */
interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}

function InfoCard({ icon, label, value, href }: InfoCardProps) {
  const inner = (
    <div
      className="flex items-start gap-3 p-4 rounded-2xl transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(212,175,114,0.14)",
      }}
    >
      {/* Icon bubble */}
      <div
        className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
        style={{
          background: "linear-gradient(135deg, rgba(212,175,114,0.22), rgba(201,151,58,0.1))",
          border: "1px solid rgba(212,175,114,0.2)",
          color: "#D4AF72",
        }}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className="text-[9px] font-black uppercase tracking-[0.18em]"
          style={{ color: "rgba(212,175,114,0.6)" }}
        >
          {label}
        </span>
        <span
          className="text-sm font-bold leading-snug break-words"
          style={{ color: "#FBF8F3" }}
        >
          {value}
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:scale-[1.02] transition-transform duration-200"
      >
        {inner}
      </a>
    );
  }
  return <div>{inner}</div>;
}

/* ─── Main Footer ─── */
export default function Footer() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [footer, setFooter] = useState({
    address: "",
    phone: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    telegram: "",
  });

  useEffect(() => {
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) setFooter(JSON.parse(localData));

    const footerRef = ref(db, "settings/footerInfo");
    const unsub = onValue(footerRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setFooter(data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      }
    });
    return () => unsub();
  }, []);

  /* Social links */
  const socialLinks = [
    {
      Icon: FaWhatsapp,
      url: footer.whatsapp ? `https://wa.me/${footer.whatsapp}` : undefined,
      label: "WhatsApp",
      color: "#25D366",
    },
    {
      Icon: FaInstagram,
      url: footer.instagram || undefined,
      label: "Instagram",
      color: "#E1306C",
    },
    {
      Icon: FaFacebookF,
      url: footer.facebook || undefined,
      label: "Facebook",
      color: "#1877F2",
    },
    {
      Icon: FaTiktok,
      url: footer.tiktok || undefined,
      label: "TikTok",
      color: "#FBF8F3",
    },
    {
      Icon: FaTelegramPlane,
      url: footer.telegram || undefined,
      label: "Telegram",
      color: "#2AABEE",
    },
  ].filter((s) => s.url);

  /* Info cards data */
  const infoCards: InfoCardProps[] = [
    footer.address && {
      icon: <FaMapMarkerAlt size={15} />,
      label: isAr ? "العنوان" : "Address",
      value: footer.address,
    },
    footer.phone && {
      icon: <FaPhoneAlt size={14} />,
      label: isAr ? "الهاتف" : "Phone",
      value: footer.phone,
      href: `tel:${footer.phone}`,
    },
    footer.whatsapp && {
      icon: <FaWhatsapp size={15} />,
      label: "WhatsApp",
      value: `+${footer.whatsapp}`,
      href: `https://wa.me/${footer.whatsapp}`,
    },
    {
      icon: <FiClock size={15} />,
      label: isAr ? "ساعات العمل" : "Working Hours",
      value: isAr ? "يومياً: 10:00 ص – 12:00 م" : "Daily: 10:00 AM – 12:00 AM",
    },
  ].filter(Boolean) as InfoCardProps[];

  return (
    <footer className="relative w-full overflow-hidden" style={{ color: "#FBF8F3" }}>

      {/* ── Curved top transition ── */}
      <div
        className="absolute top-0 left-0 w-full h-24 -translate-y-full pointer-events-none"
        style={{ background: "linear-gradient(160deg, #3A0512, #5C0C21)" }}
      >
        <div
          className="absolute bottom-0 w-full h-24"
          style={{
            background: "linear-gradient(160deg, #3A0512, #5C0C21)",
            boxShadow: "0 -20px 40px -15px rgba(58,5,18,0.25)",
          }}
        />
      </div>

      {/* ── Main background ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #3A0512 0%, #5C0C21 40%, #7A1733 80%, #C9973A 100%)",
        }}
      />

      {/* ── Ornament pattern ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/footerbg.png')",
          backgroundSize: "200px",
          backgroundRepeat: "repeat",
          opacity: 0.25,
        }}
      />

      {/* ── Gold top border ── */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #D4AF72, #C4963A, #D4AF72, transparent)",
        }}
      />

      {/* ════════════════════════════════════════════ */}
      {/*               Content                       */}
      {/* ════════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-12 pb-10 relative z-10">

        {/* ── Logo + Name ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="flex flex-col items-center gap-3 mb-10"
        >
          <div className="relative group">
            <div
              className="absolute inset-0 blur-3xl rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-700"
              style={{ background: "rgba(212,175,114,0.4)" }}
            />
            <img
              src="/logo.png"
              alt="CakeBoss Logo"
              className="w-24 md:w-28 relative z-10 drop-shadow-2xl mx-auto"
            />
          </div>
          <h2
            className="text-2xl font-black tracking-widest uppercase"
            style={{ color: "#FFFDF8", textShadow: "0 2px 16px rgba(201,151,58,0.25)" }}
          >
            CakeBoss
          </h2>
          {/* Gold ornamental divider */}
          <div className="flex items-center gap-3 w-48">
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(212,175,114,0.6))",
              }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#D4AF72", boxShadow: "0 0 6px rgba(212,175,114,0.6)" }}
            />
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(90deg, rgba(212,175,114,0.6), transparent)",
              }}
            />
          </div>
        </motion.div>

        {/* ── Info Cards Grid ── */}
        {infoCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10"
          >
            {infoCards.map((card, i) => (
              <InfoCard key={i} {...card} />
            ))}
          </motion.div>
        )}

        {/* ── Social media row ── */}
        {socialLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-10"
          >
            {/* Label */}
            <p
              className="text-center text-[9px] font-black uppercase tracking-[0.22em] mb-4"
              style={{ color: "rgba(212,175,114,0.55)" }}
            >
              {isAr ? "تواصل معنا" : "Follow Us"}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {socialLinks.map(({ Icon, url, label, color }, i) => (
                <motion.a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(212,175,114,0.18)",
                      color: "#D4AF72",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background =
                        "rgba(255,255,255,0.14)";
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(212,175,114,0.4)";
                      (e.currentTarget as HTMLDivElement).style.color = color;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background =
                        "rgba(255,255,255,0.07)";
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(212,175,114,0.18)";
                      (e.currentTarget as HTMLDivElement).style.color = "#D4AF72";
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <span
                    className="text-[9px] font-bold opacity-0 group-hover:opacity-60 transition-opacity duration-200"
                    style={{ color: "#D4AF72" }}
                  >
                    {label}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Bottom bar ── */}
        <div
          className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-5"
          style={{ borderTop: "1px solid rgba(212,175,114,0.2)" }}
        >
          {/* Copyright */}
          <p
            className="text-[10px] font-bold uppercase tracking-widest order-2 sm:order-1"
            style={{ color: "rgba(212,175,114,0.5)" }}
          >
            © {new Date().getFullYear()} CakeBoss. All rights reserved.
          </p>

          {/* Developer card */}
          <motion.a
            href="https://engmohammedaljojo.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="order-1 sm:order-2 flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(212,175,114,0.13)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(212,175,114,0.28)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(212,175,114,0.13)";
            }}
          >
            {/* Icon */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(212,175,114,0.25), rgba(201,151,58,0.12))",
                border: "1px solid rgba(212,175,114,0.2)",
                color: "#D4AF72",
              }}
            >
              <FaLaptopCode size={14} />
            </div>
            {/* Text */}
            <div className="flex flex-col">
              <span
                className="text-[8px] font-black uppercase tracking-[0.2em] leading-none"
                style={{ color: "rgba(212,175,114,0.5)" }}
              >
                Developed by
              </span>
              <span
                className="text-[11px] font-black tracking-wide leading-tight"
                style={{ color: "#FFFDF8" }}
              >
                Eng. Mohammed El Joujo
              </span>
            </div>
            {/* External link icon */}
            <FaGlobe
              size={11}
              style={{ color: "rgba(212,175,114,0.4)", marginInlineStart: "2px" }}
            />
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
