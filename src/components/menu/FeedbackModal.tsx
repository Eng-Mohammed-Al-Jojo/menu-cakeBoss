import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSend, FiMessageSquare, FiCheckCircle, FiStar, FiUser, FiPhone } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  complaintsWhatsapp: string;
}

export default function FeedbackModal({ isOpen, onClose, complaintsWhatsapp }: Props) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setPhone("");
      setRating(0);
      setMessage("");
      setShowSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const isValid = rating > 0 && message.trim().length > 0;

  const handleSend = () => {
    if (!isValid) return;
    setIsSubmitting(true);

    const structuredMessage = `📩 Feedback جديد\n\n👤 الاسم: ${name.trim() || (isRtl ? "غير محدد" : "Not specified")}\n📞 الرقم: ${phone.trim() || (isRtl ? "غير محدد" : "Not specified")}\n\n⭐ التقييم: ${rating}/5\n\n📝 الملاحظات:\n${message.trim()}`;
    const encodedMessage = encodeURIComponent(structuredMessage);
    window.open(`https://wa.me/${complaintsWhatsapp}?text=${encodedMessage}`, "_blank");

    setShowSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2200);
  };

  const inputStyle = {
    width: "100%",
    background: "var(--bg-page)",
    border: "1.5px solid var(--border-color)",
    borderRadius: "12px",
    padding: "12px 16px",
    fontFamily: "'Cairo', sans-serif",
    fontWeight: 600,
    fontSize: "0.9rem",
    color: "var(--text-main)",
    outline: "none",
    transition: "all 0.25s ease",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="feedback-overlay"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
        >
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
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-lg flex flex-col items-center text-center z-10 p-5 sm:p-8 rounded-3xl overflow-y-auto max-h-[92vh]"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-gold)",
              boxShadow: "0 24px 80px rgba(44,32,24,0.35)",
            }}
          >
            {/* Olive top border */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: "linear-gradient(90deg, transparent 0%, #556B43 30%, #8FA87E 50%, #B79275 70%, transparent 100%)" }}
            />

            {/* Background radial decoration */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(74,86,56,0.06) 0%, transparent 60%)" }}
            />

            {/* Close Button */}
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="feedback-close-btn"
              aria-label={t('common.close')}
            >
              <FiX size={18} />
            </button>

            <AnimatePresence mode="wait">
              {!showSuccess ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="w-full flex flex-col items-center relative z-10"
                >
                  {/* Icon */}
                  <div
                    className="mb-4 w-14 h-14 flex items-center justify-center rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(74,86,56,0.15), rgba(74,86,56,0.08))",
                      border: "1px solid var(--border-gold)",
                    }}
                  >
                    <FiMessageSquare size={24} style={{ color: "var(--color-primary)" }} />
                  </div>

                  <h2
                    className="text-2xl sm:text-3xl font-black mb-2"
                    style={{ color: "var(--text-main)" }}
                  >
                    {t("common.feedback")}
                  </h2>

                  <p
                    className="text-sm font-medium mb-4 sm:mb-6"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {isRtl
                      ? "رأيك يطوّر خدمتنا! شاركنا تجربتك بكل صراحة."
                      : "Your feedback improves our service! Share your experience."}
                  </p>

                  {/* Ornamental divider */}
                  <div className="flex items-center gap-3 w-40 mb-4 sm:mb-6">
                    <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(74,86,56,0.4))" }} />
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--gradient-gold)" }} />
                    <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(74,86,56,0.4), transparent)" }} />
                  </div>

                  {/* Star Rating */}
                  <div className="flex flex-col items-center gap-2 mb-4 sm:mb-6">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setRating(star)}
                          className="w-10 h-10 flex items-center justify-center transition-all duration-200"
                          style={{
                            color: rating >= star ? "#556B43" : "var(--border-color)",
                          }}
                        >
                          <FiStar
                            size={26}
                            fill={rating >= star ? "currentColor" : "none"}
                            strokeWidth={2}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-3">
                    <div className="relative">
                      <FiUser
                        className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2`}
                        style={{ color: "var(--text-muted)" }}
                      />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isRtl ? "الاسم" : "Name"}
                        style={{
                          ...inputStyle,
                          paddingRight: isRtl ? "44px" : "16px",
                          paddingLeft: isRtl ? "16px" : "44px",
                        }}
                        onFocus={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = "rgba(201,151,58,0.5)";
                          (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(201,151,58,0.1)";
                        }}
                        onBlur={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = "var(--border-color)";
                          (e.target as HTMLInputElement).style.boxShadow = "none";
                        }}
                      />
                    </div>
                    <div className="relative">
                      <FiPhone
                        className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2`}
                        style={{ color: "var(--text-muted)" }}
                      />
                      <input
                        type="tel"
                        dir="ltr"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={isRtl ? "رقم الهاتف" : "Phone"}
                        style={{
                          ...inputStyle,
                          paddingRight: isRtl ? "44px" : "16px",
                          paddingLeft: isRtl ? "16px" : "44px",
                          textAlign: isRtl ? "right" : "left",
                        }}
                        onFocus={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = "rgba(201,151,58,0.5)";
                          (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(201,151,58,0.1)";
                        }}
                        onBlur={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = "var(--border-color)";
                          (e.target as HTMLInputElement).style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isRtl ? "اكتب ملاحظاتك هنا..." : "Write your feedback here..."}
                    className="h-[90px] sm:h-[112px]"
                    style={{
                      ...inputStyle,
                      resize: "none",
                      borderRadius: "16px",
                      marginBottom: "16px",
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLTextAreaElement).style.borderColor = "rgba(201,151,58,0.5)";
                      (e.target as HTMLTextAreaElement).style.boxShadow = "0 0 0 3px rgba(201,151,58,0.1)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLTextAreaElement).style.borderColor = "var(--border-color)";
                      (e.target as HTMLTextAreaElement).style.boxShadow = "none";
                    }}
                  />

                  {/* Send Button */}
                  <button
                    onClick={handleSend}
                    disabled={!isValid || isSubmitting}
                    className="w-full py-3.5 rounded-2xl font-black text-base tracking-wide flex items-center justify-center gap-3 group transition-all duration-300"
                    style={{
                      background: isValid
                        ? "linear-gradient(135deg, #6B8457 0%, #4A5638 60%, #353E27 100%)"
                        : "var(--bg-surface)",
                      color: isValid ? "white" : "var(--text-muted)",
                      boxShadow: isValid ? "0 6px 24px rgba(74,86,56,0.35)" : "none",
                      border: isValid ? "none" : "1px solid var(--border-color)",
                      cursor: isValid ? "pointer" : "not-allowed",
                    }}
                    onMouseEnter={(e) => {
                      if (!isValid) return;
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 10px 32px rgba(74,86,56,0.45)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = isValid ? "0 6px 24px rgba(74,86,56,0.35)" : "none";
                    }}
                  >
                    <span>{t("common.send")}</span>
                    <FiSend className="group-hover:translate-x-[-3px] group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-10 relative z-10"
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                    style={{
                      background: "linear-gradient(135deg, #4ade80, #22c55e)",
                      boxShadow: "0 8px 32px rgba(34,197,94,0.4)",
                    }}
                  >
                    <FiCheckCircle size={40} color="white" />
                  </div>
                  <h2
                    className="text-2xl font-black mb-2"
                    style={{ color: "var(--text-main)" }}
                  >
                    {isRtl ? "تم الإرسال بنجاح!" : "Sent Successfully!"}
                  </h2>
                  <p style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                    {isRtl ? "شكراً لملاحظاتك القيمة." : "Thank you for your feedback."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <span
              className="mt-5 text-[9px] font-black uppercase tracking-[0.2em] relative z-10"
              style={{ color: "var(--text-muted)", opacity: 0.5 }}
            >
              {isRtl ? "عبر واتسـاب" : "via WhatsApp"}
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
