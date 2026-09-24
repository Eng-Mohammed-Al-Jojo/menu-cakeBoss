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
  FaStore,
} from "react-icons/fa";
import { FiClock, FiCalendar, FiMessageSquare } from "react-icons/fi";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const LOCAL_STORAGE_KEY = "footerInfo";
const BRANCHES_STORAGE_KEY = "footerBranches";
const WORKING_HOURS_STORAGE_KEY = "footerWorkingHours";
const COMPLAINTS_STORAGE_KEY = "footerComplaintsWhatsapp";

/* ─── Branch Card ─── */
interface BranchCardProps {
  name: string;
  address: string;
  phone: string;
  whatsapp?: string;
  index: number;
}

function BranchCard({ name, address, phone, whatsapp, index }: BranchCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.08 + index * 0.08 }}
      className="flex flex-col gap-3.5 p-5 rounded-2xl transition-all duration-300 hover:shadow-md"
      style={{
        background: "rgba(255, 255, 255, 0.82)",
        border: "1px solid rgba(110, 112, 72, 0.20)",
        boxShadow: "0 4px 20px -3px rgba(74, 75, 50, 0.08)",
      }}
    >
      {/* Branch header */}
      <div
        className="flex items-center gap-2.5 pb-3"
        style={{ borderBottom: "1px solid rgba(110, 112, 72, 0.14)" }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
          style={{
            background: "linear-gradient(135deg, #9EA06B, #5E603F)",
            color: "#FFFFFF",
          }}
        >
          <FaStore size={13} />
        </div>
        <span
          className="text-sm font-black tracking-wide"
          style={{ color: "#343528" }}
        >
          {name}
        </span>
      </div>

      {/* Address row */}
      {address && (
        <div className="flex items-start gap-2.5">
          <div
            className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5"
            style={{
              background: "rgba(158, 160, 107, 0.16)",
              color: "#6E7048",
            }}
          >
            <FaMapMarkerAlt size={12} />
          </div>
          <span
            className="text-[13px] font-semibold leading-snug"
            style={{ color: "#55563D" }}
          >
            {address}
          </span>
        </div>
      )}

      {/* Contact row: phone + whatsapp */}
      <div className="flex items-center gap-2 flex-wrap pt-0.5">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2 flex-1 min-w-0 hover:scale-[1.01] transition-transform duration-200"
          >
            <div
              className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(158, 160, 107, 0.16)",
                color: "#6E7048",
              }}
            >
              <FaPhoneAlt size={11} />
            </div>
            <span
              className="text-[13px] font-bold truncate"
              style={{ color: "#55563D", direction: "ltr" }}
            >
              {phone}
            </span>
          </a>
        )}
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black hover:scale-105 transition-transform duration-200"
            style={{
              background: "rgba(37, 211, 102, 0.12)",
              color: "#15803D",
              border: "1px solid rgba(37, 211, 102, 0.28)",
            }}
          >
            <FaWhatsapp size={13} />
            <span>WhatsApp</span>
          </a>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Working Hours Card ─── */
interface WorkingHoursCardProps {
  id?: string;
  title: string;
  days: string;
  hours: string;
  note?: string;
  index: number;
}

function WorkingHoursCard({ title, days, hours, note, index }: WorkingHoursCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.08 + index * 0.08 }}
      className="flex flex-col gap-3.5 p-5 rounded-2xl transition-all duration-300 hover:shadow-md"
      style={{
        background: "rgba(255, 255, 255, 0.82)",
        border: "1px solid rgba(110, 112, 72, 0.20)",
        boxShadow: "0 4px 20px -3px rgba(74, 75, 50, 0.08)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 pb-3"
        style={{ borderBottom: "1px solid rgba(110, 112, 72, 0.14)" }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
          style={{
            background: "linear-gradient(135deg, #9EA06B, #5E603F)",
            color: "#FFFFFF",
          }}
        >
          <FiClock size={14} />
        </div>
        <span
          className="text-sm font-black tracking-wide"
          style={{ color: "#343528" }}
        >
          {title}
        </span>
      </div>

      {/* Days row */}
      {days && (
        <div className="flex items-center gap-2.5">
          <div
            className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(158, 160, 107, 0.16)",
              color: "#6E7048",
            }}
          >
            <FiCalendar size={12} />
          </div>
          <span
            className="text-[13px] font-bold leading-snug"
            style={{ color: "#55563D" }}
          >
            {days}
          </span>
        </div>
      )}

      {/* Hours row */}
      {hours && (
        <div className="flex items-center gap-2.5">
          <div
            className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(158, 160, 107, 0.16)",
              color: "#6E7048",
            }}
          >
            <FiClock size={12} />
          </div>
          <span
            className="text-[13px] font-black leading-snug tracking-wide"
            dir="auto"
            style={{ color: "#343528" }}
          >
            {hours}
          </span>
        </div>
      )}

      {/* Note row (if any) */}
      {note && (
        <div
          className="mt-0.5 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2"
          style={{
            background: "rgba(158, 160, 107, 0.10)",
            color: "#55563D",
            border: "1px dashed rgba(110, 112, 72, 0.22)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#7D8053] shrink-0" />
          <span className="leading-tight">{note}</span>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Section Header Pill ─── */
function SectionBadge({ text }: { text: string }) {
  return (
    <div className="flex justify-center mb-4">
      <span
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-xs"
        style={{
          background: "rgba(255, 255, 255, 0.72)",
          border: "1px solid rgba(110, 112, 72, 0.22)",
          color: "#55563D",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#7D8053]" />
        {text}
        <span className="w-1.5 h-1.5 rounded-full bg-[#7D8053]" />
      </span>
    </div>
  );
}

/* ─── Main Footer ─── */
export default function Footer() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [footer, setFooter] = useState(() => ({
    facebook: "",
    instagram: "",
    tiktok: "",
    telegram: "",
    ...JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "null"),
  }));
  const [complaintsWhatsapp, setComplaintsWhatsapp] = useState(
    () => localStorage.getItem(COMPLAINTS_STORAGE_KEY) || ""
  );
  const [branches, setBranches] = useState<BranchCardProps[]>(() => {
    const stored = localStorage.getItem(BRANCHES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [workingHours, setWorkingHours] = useState<WorkingHoursCardProps[]>(() => {
    const stored = localStorage.getItem(WORKING_HOURS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    // --- Footer info (social) ---
    const footerRef = ref(db, "settings/footerInfo");
    const unsubFooter = onValue(footerRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setFooter(data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      }
    });

    // --- Complaints WhatsApp ---
    const complaintsRef = ref(db, "settings/complaintsWhatsapp");
    const unsubComplaints = onValue(complaintsRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        setComplaintsWhatsapp(val);
        localStorage.setItem(COMPLAINTS_STORAGE_KEY, val);
      }
    });

    // --- Branches ---
    const branchesRef = ref(db, "settings/branches");
    const unsubBranches = onValue(branchesRef, (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.val();
        const arr: BranchCardProps[] = (Array.isArray(raw)
          ? raw
          : Object.values(raw)
        ).map((b: any, i: number) => ({ ...b, index: i }));
        setBranches(arr);
        localStorage.setItem(BRANCHES_STORAGE_KEY, JSON.stringify(arr));
      } else {
        setBranches([]);
      }
    });

    // --- Working Hours ---
    const whRef = ref(db, "settings/workingHours");
    const unsubWH = onValue(whRef, (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.val();
        const arr: WorkingHoursCardProps[] = (Array.isArray(raw)
          ? raw
          : Object.values(raw)
        ).map((wh: any, i: number) => ({ ...wh, index: i }));
        setWorkingHours(arr);
        localStorage.setItem(WORKING_HOURS_STORAGE_KEY, JSON.stringify(arr));
      } else {
        setWorkingHours([
          {
            title: isAr ? "الدوام الرسمي" : "Official Working Hours",
            days: isAr ? "طوال أيام الأسبوع" : "All Week Days",
            hours: isAr ? "10:00 ص – 12:00 منتصف الليل" : "10:00 AM – 12:00 AM",
            note: isAr ? "الجمعة: بعد صلاة الجمعة حتى 12:00 منتصف الليل" : "Friday: After Friday prayer until 12:00 AM",
            index: 0,
          },
        ]);
      }
    });

    return () => {
      unsubFooter();
      unsubComplaints();
      unsubBranches();
      unsubWH();
    };
  }, [isAr]);

  /* Social links */
  const socialLinks = [
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
      color: "#111111",
    },
    {
      Icon: FaTelegramPlane,
      url: footer.telegram || undefined,
      label: "Telegram",
      color: "#2AABEE",
    },
  ].filter((s) => s.url);

  return (
    <footer className="footer-surface relative w-full mt-4 sm:mt-8">
      {/* 
        ═══════════════════════════════════════════════════════════
        Curved Island Sheet Architecture:
        Gently elevated rounded top that marks the footer distinctly
        yet flows naturally from the page palette as one harmonious body.
        ═══════════════════════════════════════════════════════════
      */}
      <div
        className="relative w-full rounded-t-[2.5rem] sm:rounded-t-[3.5rem] md:rounded-t-[4.5rem] overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #E9E9D2 0%, #D9D9B6 35%, #C7C795 70%, #B2B47D 100%)",
          boxShadow:
            "0 -16px 40px -12px rgba(74, 75, 50, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
          borderTop: "1px solid rgba(255, 255, 255, 0.8)",
        }}
      >
        {/* Subtle decorative background glow */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full pointer-events-none opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(217, 217, 182, 0.5) 60%, transparent 80%)",
          }}
        />

        {/* ════════════════════════════════════════════ */}
        {/*               Content                        */}
        {/* ════════════════════════════════════════════ */}
        <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-12 pb-10 relative z-10">

          {/* ── Logo + Name ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-3 mb-10"
          >
            <div className="relative group">
              <img
                src="/logo.png"
                alt="CakeBoss Logo"
                className="w-24 md:w-28 relative z-10 drop-shadow-md mx-auto"
              />
            </div>
            <h2
              className="text-2xl font-black tracking-widest uppercase"
              style={{ color: "#343528", textShadow: "0 2px 10px rgba(74, 75, 50, 0.15)" }}
            >
              CakeBoss
            </h2>
            {/* Ornamental divider */}
            <div className="flex items-center gap-3 w-44">
              <div
                className="flex-1 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(110, 112, 72, 0.5))",
                }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#7D8053", boxShadow: "0 0 6px rgba(110, 112, 72, 0.4)" }}
              />
              <div
                className="flex-1 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(110, 112, 72, 0.5), transparent)",
                }}
              />
            </div>
          </motion.div>

          {/* ── Branch Cards ── */}
          {branches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="mb-9"
            >
              <SectionBadge text={isAr ? "فروعنا" : "Our Branches"} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {branches.map((branch) => (
                  <BranchCard key={branch.index} {...branch} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Working Hours Cards ── */}
          {workingHours.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="mb-9"
            >
              <SectionBadge text={isAr ? "مواعيد وساعات العمل" : "Working Hours"} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {workingHours.map((wh) => (
                  <WorkingHoursCard key={wh.index} {...wh} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Complaints & Suggestions + Social Media ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mb-9 flex flex-col items-center gap-5"
          >
            {/* Feedback Banner */}
            {complaintsWhatsapp && (
              <div className="w-full max-w-lg">
                <a
                  href={`https://wa.me/${complaintsWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
                  style={{
                    background: "rgba(255, 255, 255, 0.88)",
                    border: "1px solid rgba(107, 132, 87, 0.22)",
                    boxShadow: "0 4px 20px -3px rgba(60, 75, 45, 0.07)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                      style={{
                        background: "linear-gradient(135deg, #25D366, #128C7E)",
                        color: "#FFFFFF",
                      }}
                    >
                      <FiMessageSquare size={17} />
                    </div>
                    <div className="flex flex-col text-right">
                      <span
                        className="text-xs font-black"
                        style={{ color: "#26331C" }}
                      >
                        {isAr ? "الشكاوى والمقترحات" : "Suggestions & Complaints"}
                      </span>
                      <span
                        className="text-[11px] font-semibold"
                        style={{ color: "#455934" }}
                      >
                        {isAr ? "يسعدنا دائماً تواصلكم ورأيكم عبر واتساب" : "We are happy to receive your feedback on WhatsApp"}
                      </span>
                    </div>
                  </div>

                  <div
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all group-hover:scale-105"
                    style={{
                      background: "rgba(37, 211, 102, 0.12)",
                      color: "#128C7E",
                      border: "1px solid rgba(37, 211, 102, 0.28)",
                    }}
                  >
                    <FaWhatsapp size={14} />
                    <span>{isAr ? "تواصل معنا" : "Chat"}</span>
                  </div>
                </a>
              </div>
            )}

            {/* Social media icons */}
            {socialLinks.length > 0 && (
              <div className="flex flex-col items-center gap-3 pt-2">
                <span
                  className="text-[10px] font-black uppercase tracking-widest"
                  style={{ color: "#455934" }}
                >
                  {isAr ? "تابعونا على مواقع التواصل" : "Follow Us"}
                </span>
                <div className="flex flex-wrap justify-center gap-3">
                  {socialLinks.map(({ Icon, url, label, color }, i) => (
                    <motion.a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      whileHover={{ y: -3, scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      className="flex flex-col items-center gap-1.5 group"
                    >
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xs"
                        style={{
                          background: "rgba(255, 255, 255, 0.85)",
                          border: "1px solid rgba(107, 132, 87, 0.22)",
                          color: "#3F522E",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLDivElement).style.background =
                            "rgba(255, 255, 255, 0.98)";
                          (e.currentTarget as HTMLDivElement).style.borderColor =
                            "rgba(107, 132, 87, 0.40)";
                          (e.currentTarget as HTMLDivElement).style.color = color;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.background =
                            "rgba(255, 255, 255, 0.85)";
                          (e.currentTarget as HTMLDivElement).style.borderColor =
                            "rgba(107, 132, 87, 0.22)";
                          (e.currentTarget as HTMLDivElement).style.color = "#3F522E";
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <span
                        className="text-[9px] font-bold opacity-0 group-hover:opacity-75 transition-opacity duration-200"
                        style={{ color: "#26331C" }}
                      >
                        {label}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* ── Bottom bar ── */}
          <div
            className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: "1px solid rgba(74, 95, 56, 0.16)" }}
          >
            {/* Copyright */}
            <p
              className="text-[10px] font-bold uppercase tracking-widest order-2 sm:order-1"
              style={{ color: "#455934" }}
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
              className="order-1 sm:order-2 flex items-center gap-3 px-4 py-2 rounded-2xl transition-all duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.70)",
                border: "1px solid rgba(107, 132, 87, 0.20)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(255, 255, 255, 0.90)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(107, 132, 87, 0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(255, 255, 255, 0.70)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(107, 132, 87, 0.20)";
              }}
            >
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(107, 132, 87, 0.22), rgba(67, 84, 53, 0.12))",
                  border: "1px solid rgba(107, 132, 87, 0.20)",
                  color: "#3F522E",
                }}
              >
                <FaLaptopCode size={13} />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-[8px] font-black uppercase tracking-[0.2em] leading-none"
                  style={{ color: "#4F643C" }}
                >
                  Developed by
                </span>
                <span
                  className="text-[11px] font-black tracking-wide leading-tight"
                  style={{ color: "#26331C" }}
                >
                  Eng. Mohammed El Joujo
                </span>
              </div>
              <FaGlobe
                size={11}
                style={{ color: "#4F643C", marginInlineStart: "2px" }}
              />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
}
