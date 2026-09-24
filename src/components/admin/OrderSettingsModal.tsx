import { useState, useEffect } from "react";
import { ref, update } from "firebase/database";
import { db } from "../../firebase";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX, FiCheck, FiSettings, FiInfo,
  FiMapPin, FiPhone, FiPlus, FiTrash2, FiHome, FiClock, FiCalendar, FiShare2
} from "react-icons/fi";
import { FaWhatsapp, FaFacebook, FaInstagram, FaTiktok, FaTelegramPlane } from "react-icons/fa";
import { useTranslation } from "react-i18next";

/* ─── Types ─── */
interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
}

interface WorkingHoursItem {
  id: string;
  title: string;
  days: string;
  hours: string;
  note: string;
}

/* ─── Toast ─── */
function Toast({ type, message }: { type: "success" | "error"; message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: 50, x: "-50%" }}
      className={`fixed bottom-10 left-1/2 z-100 px-8 py-4 rounded-2xl shadow-2xl text-white font-black flex items-center gap-3 ${
        type === "success" ? "bg-secondary" : "bg-red-500"
      }`}
    >
      {type === "success" ? <FiCheck /> : "❌"}
      {message}
    </motion.div>
  );
}

const inputClass =
  "w-full bg-(--bg-main) border border-(--border-color) rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-(--text-muted)/50";

/* ─── BranchCard editor ─── */
function BranchEditor({
  branch,
  index,
  isRtl,
  onChange,
  onDelete,
}: {
  branch: Branch;
  index: number;
  isRtl: boolean;
  onChange: (id: string, field: keyof Branch, value: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      className="p-5 rounded-3xl border border-(--border-color) bg-(--bg-main)/60 space-y-3 shadow-sm"
    >
      {/* Branch header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-black">
            {index + 1}
          </div>
          <span className="text-xs font-black text-(--text-main) uppercase tracking-widest">
            {isRtl ? `الفرع ${index + 1}` : `Branch ${index + 1}`}
          </span>
        </div>
        <button
          onClick={() => onDelete(branch.id)}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
        >
          <FiTrash2 size={14} />
        </button>
      </div>

      {/* Name */}
      <div className="relative">
        <FiHome className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-(--text-muted) opacity-50`} size={14} />
        <input
          value={branch.name}
          onChange={(e) => onChange(branch.id, 'name', e.target.value)}
          placeholder={isRtl ? 'اسم الفرع' : 'Branch Name'}
          className={`${inputClass} ${isRtl ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'}`}
        />
      </div>

      {/* Address */}
      <div className="relative">
        <FiMapPin className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-(--text-muted) opacity-50`} size={14} />
        <input
          value={branch.address}
          onChange={(e) => onChange(branch.id, 'address', e.target.value)}
          placeholder={isRtl ? 'العنوان التفصيلي' : 'Full Address'}
          className={`${inputClass} ${isRtl ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'}`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Phone */}
        <div className="relative">
          <FiPhone className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-(--text-muted) opacity-50`} size={13} />
          <input
            value={branch.phone}
            onChange={(e) => onChange(branch.id, 'phone', e.target.value)}
            placeholder={isRtl ? 'رقم الهاتف' : 'Phone'}
            className={`${inputClass} ${isRtl ? 'pr-10 pl-2 text-right' : 'pl-10 pr-2 text-left'} text-xs`}
          />
        </div>
        {/* WhatsApp */}
        <div className="relative">
          <FaWhatsapp className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-green-500 opacity-50`} size={13} />
          <input
            value={branch.whatsapp}
            onChange={(e) => onChange(branch.id, 'whatsapp', e.target.value.replace(/\D/g, ''))}
            placeholder={isRtl ? 'واتساب (أرقام)' : 'WhatsApp (digits)'}
            className={`${inputClass} ${isRtl ? 'pr-10 pl-2 text-right' : 'pl-10 pr-2 text-left'} text-xs`}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── WorkingHours editor ─── */
function WorkingHoursEditor({
  item,
  index,
  isRtl,
  onChange,
  onDelete,
}: {
  item: WorkingHoursItem;
  index: number;
  isRtl: boolean;
  onChange: (id: string, field: keyof WorkingHoursItem, value: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      className="p-5 rounded-3xl border border-(--border-color) bg-(--bg-main)/60 space-y-3 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-black">
            <FiClock size={13} />
          </div>
          <span className="text-xs font-black text-(--text-main) uppercase tracking-widest">
            {isRtl ? `موعد دوام ${index + 1}` : `Schedule ${index + 1}`}
          </span>
        </div>
        <button
          onClick={() => onDelete(item.id)}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
        >
          <FiTrash2 size={14} />
        </button>
      </div>

      {/* Title */}
      <div className="relative">
        <FiClock className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-(--text-muted) opacity-50`} size={14} />
        <input
          value={item.title}
          onChange={(e) => onChange(item.id, 'title', e.target.value)}
          placeholder={isRtl ? 'عنوان الموعد (مثال: الدوام اليومي، أوقات الفرع)' : 'Schedule Title (e.g. Daily Schedule)'}
          className={`${inputClass} ${isRtl ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'}`}
        />
      </div>

      {/* Days */}
      <div className="relative">
        <FiCalendar className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-(--text-muted) opacity-50`} size={14} />
        <input
          value={item.days}
          onChange={(e) => onChange(item.id, 'days', e.target.value)}
          placeholder={isRtl ? 'الأيام (مثال: طوال أيام الأسبوع، السبت - الخميس)' : 'Days (e.g. All Week Days, Sat - Thu)'}
          className={`${inputClass} ${isRtl ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'}`}
        />
      </div>

      {/* Hours */}
      <div className="relative">
        <FiClock className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-(--text-muted) opacity-50`} size={14} />
        <input
          value={item.hours}
          onChange={(e) => onChange(item.id, 'hours', e.target.value)}
          placeholder={isRtl ? 'ساعات العمل (مثال: 10:00 ص – 12:00 منتصف الليل)' : 'Hours (e.g. 10:00 AM – 12:00 AM)'}
          className={`${inputClass} ${isRtl ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'}`}
        />
      </div>

      {/* Note (optional) */}
      <div className="relative">
        <FiInfo className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-(--text-muted) opacity-50`} size={14} />
        <input
          value={item.note}
          onChange={(e) => onChange(item.id, 'note', e.target.value)}
          placeholder={isRtl ? 'ملاحظة إضافية (اختياري: مثال: الجمعة بعد صلاة الجمعة)' : 'Optional Note (e.g. Friday after prayer)'}
          className={`${inputClass} ${isRtl ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'} text-xs`}
        />
      </div>
    </motion.div>
  );
}

/* ─── Main Modal ─── */
export default function OrderSettingsModal({
  setShowOrderSettings,
  orderSettings: initialSettings,
  onSave,
}: any) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [activeTab, setActiveTab] = useState<'branches' | 'workingHours' | 'social'>('branches');
  const [complaintsWhatsapp, setComplaintsWhatsapp] = useState("");
  const [footer, setFooter] = useState({
    facebook: "",
    instagram: "",
    tiktok: "",
    telegram: "",
  });
  const [branches, setBranches] = useState<Branch[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHoursItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<any>(null);

  useEffect(() => {
    if (!initialSettings) return;
    setComplaintsWhatsapp(initialSettings.complaintsWhatsapp || "");
    setFooter({
      facebook: initialSettings.footerInfo?.facebook || "",
      instagram: initialSettings.footerInfo?.instagram || "",
      tiktok: initialSettings.footerInfo?.tiktok || "",
      telegram: initialSettings.footerInfo?.telegram || "",
    });

    // Load branches array
    const rawBranches = initialSettings.branches;
    if (rawBranches) {
      const arr: Branch[] = Array.isArray(rawBranches)
        ? rawBranches
        : Object.entries(rawBranches).map(([id, v]: any) => ({ id, ...v }));
      setBranches(arr);
    }

    // Load working hours array
    const rawWH = initialSettings.workingHours;
    if (rawWH) {
      const arrWH: WorkingHoursItem[] = Array.isArray(rawWH)
        ? rawWH
        : Object.entries(rawWH).map(([id, v]: any) => ({ id, ...v }));
      setWorkingHours(arrWH);
    } else {
      setWorkingHours([
        {
          id: `wh_${Date.now()}`,
          title: isRtl ? "الدوام الرسمي" : "Official Schedule",
          days: isRtl ? "طوال أيام الأسبوع" : "All Week Days",
          hours: isRtl ? "10:00 ص – 12:00 منتصف الليل" : "10:00 AM – 12:00 AM",
          note: isRtl ? "الجمعة: بعد صلاة الجمعة حتى 12:00 منتصف الليل" : "Friday: After Friday prayer until 12:00 AM",
        },
      ]);
    }

    setLoading(false);
  }, [initialSettings, isRtl]);

  if (loading) return null;

  /* Branch helpers */
  const addBranch = () => {
    setBranches((prev) => [
      ...prev,
      { id: `branch_${Date.now()}`, name: "", address: "", phone: "", whatsapp: "" },
    ]);
  };

  const updateBranch = (id: string, field: keyof Branch, value: string) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  const deleteBranch = (id: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  /* Working hours helpers */
  const addWorkingHours = () => {
    setWorkingHours((prev) => [
      ...prev,
      {
        id: `wh_${Date.now()}`,
        title: "",
        days: "",
        hours: "",
        note: "",
      },
    ]);
  };

  const updateWorkingHours = (id: string, field: keyof WorkingHoursItem, value: string) => {
    setWorkingHours((prev) =>
      prev.map((wh) => (wh.id === id ? { ...wh, [field]: value } : wh))
    );
  };

  const deleteWorkingHours = (id: string) => {
    setWorkingHours((prev) => prev.filter((wh) => wh.id !== id));
  };

  /* Save */
  const handleSave = async () => {
    const newSettings = {
      complaintsWhatsapp,
      footerInfo: {
        facebook: footer.facebook || "",
        instagram: footer.instagram || "",
        tiktok: footer.tiktok || "",
        telegram: footer.telegram || "",
      },
      branches,
      workingHours,
    };
    try {
      setSaving(true);
      await update(ref(db, "settings"), newSettings);
      onSave?.(newSettings);
      setToast({ type: "success", message: t('admin.settings_saved_success') });
      setTimeout(() => setShowOrderSettings(false), 1500);
    } catch (error) {
      console.error("❌ [Settings] Save failed:", error);
      setToast({ type: "error", message: t('admin.settings_save_error') });
      setSaving(false);
    }
  };

  const tabs = [
    { key: 'branches' as const, label: isRtl ? 'الفروع' : 'Branches', icon: <FiHome size={15} /> },
    { key: 'workingHours' as const, label: isRtl ? 'ساعات العمل' : 'Working Hours', icon: <FiClock size={15} /> },
    { key: 'social' as const, label: isRtl ? 'التواصل والاقتراحات' : 'Social & Feedback', icon: <FiShare2 size={15} /> },
  ];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowOrderSettings(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-(--bg-card)/90 backdrop-blur-2xl w-full max-w-lg rounded-[2.5rem] border border-(--border-color) shadow-2xl flex flex-col max-h-[90vh] overflow-hidden z-10"
      >
        {/* ── Header ── */}
        <div className="p-6 border-b border-(--border-color) flex items-center justify-between bg-(--bg-main)/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl shadow-inner">
              <FiSettings />
            </div>
            <div>
              <h2 className="text-xl font-black text-(--text-main)">{t('admin.system_settings')}</h2>
              <p className="text-(--text-muted) text-[10px] uppercase tracking-widest font-bold">
                {t('admin.system_config_desc')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowOrderSettings(false)}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-(--bg-main) text-(--text-muted) hover:text-red-500 transition-all border border-(--border-color) cursor-pointer"
          >
            <FiX />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 px-6 pt-4 pb-0 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-(--bg-main) text-(--text-muted) border border-(--border-color) hover:border-primary/30'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4 space-y-4 custom-scrollbar">
          <AnimatePresence mode="wait">
            {/* ── TAB 1: BRANCHES ── */}
            {activeTab === 'branches' && (
              <motion.div
                key="branches"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiHome className="text-primary" size={16} />
                    <p className="font-black text-sm text-(--text-main)">
                      {isRtl ? 'إدارة الفروع' : 'Manage Branches'}
                    </p>
                    <span className="text-xs bg-primary/10 text-primary font-black px-2 py-0.5 rounded-full">
                      {branches.length}
                    </span>
                  </div>
                  <button
                    onClick={addBranch}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-primary text-white text-xs font-black shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <FiPlus size={14} />
                    {isRtl ? 'فرع جديد' : 'Add Branch'}
                  </button>
                </div>

                {branches.length === 0 && (
                  <div className="flex flex-col items-center gap-3 py-10 text-(--text-muted)">
                    <FiHome size={32} className="opacity-30" />
                    <p className="text-sm font-bold">
                      {isRtl ? 'لا توجد فروع بعد، أضف فرعاً جديداً' : 'No branches yet. Add your first branch.'}
                    </p>
                  </div>
                )}

                <AnimatePresence>
                  {branches.map((branch, i) => (
                    <BranchEditor
                      key={branch.id}
                      branch={branch}
                      index={i}
                      isRtl={isRtl}
                      onChange={updateBranch}
                      onDelete={deleteBranch}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ── TAB 2: WORKING HOURS ── */}
            {activeTab === 'workingHours' && (
              <motion.div
                key="workingHours"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiClock className="text-primary" size={16} />
                    <p className="font-black text-sm text-(--text-main)">
                      {isRtl ? 'مواعيد وساعات العمل' : 'Working Hours'}
                    </p>
                    <span className="text-xs bg-primary/10 text-primary font-black px-2 py-0.5 rounded-full">
                      {workingHours.length}
                    </span>
                  </div>
                  <button
                    onClick={addWorkingHours}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-primary text-white text-xs font-black shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <FiPlus size={14} />
                    {isRtl ? 'موعد جديد' : 'Add Schedule'}
                  </button>
                </div>

                {workingHours.length === 0 && (
                  <div className="flex flex-col items-center gap-3 py-10 text-(--text-muted)">
                    <FiClock size={32} className="opacity-30" />
                    <p className="text-sm font-bold">
                      {isRtl ? 'لا توجد مواعيد عمل مسجلة، أضف موعداً' : 'No working hours yet. Add a schedule.'}
                    </p>
                  </div>
                )}

                <AnimatePresence>
                  {workingHours.map((wh, i) => (
                    <WorkingHoursEditor
                      key={wh.id}
                      item={wh}
                      index={i}
                      isRtl={isRtl}
                      onChange={updateWorkingHours}
                      onDelete={deleteWorkingHours}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ── TAB 3: SOCIAL MEDIA & SUGGESTIONS ── */}
            {activeTab === 'social' && (
              <motion.div
                key="social"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {/* Suggestions & Complaints WhatsApp */}
                <div className="p-6 rounded-3xl bg-red-50/50 border border-red-100/60 space-y-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-500 flex items-center justify-center shadow-inner">
                      <FiInfo />
                    </div>
                    <div>
                      <p className="font-black text-sm text-(--text-main)">
                        {isRtl ? 'واتساب الشكاوى والاقتراحات' : 'Complaints & Suggestions WhatsApp'}
                      </p>
                      <p className="text-[11px] font-semibold text-(--text-muted)">
                        {isRtl ? 'رقم مخصص لاستقبال آراء واقتراحات وشكاوى الزبائن' : 'Dedicated number for customer feedback and complaints'}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <FaWhatsapp className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-green-500 opacity-60`} size={16} />
                    <input
                      value={complaintsWhatsapp}
                      onChange={(e) => setComplaintsWhatsapp(e.target.value.replace(/\D/g, ""))}
                      placeholder={t('admin.whatsapp_placeholder')}
                      className={`${inputClass} ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
                    />
                  </div>
                </div>

                {/* Social Media Accounts */}
                <div className="p-6 rounded-3xl bg-(--bg-main)/50 border border-(--border-color) space-y-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-(--bg-card) text-primary flex items-center justify-center shadow-inner border border-(--border-color)">
                      <FiShare2 />
                    </div>
                    <div>
                      <p className="font-black text-sm text-(--text-main)">
                        {isRtl ? 'بيانات التواصل الاجتماعي' : 'Social Media Links'}
                      </p>
                      <p className="text-[11px] font-semibold text-(--text-muted)">
                        {isRtl ? 'روابط الحسابات الرسمية على منصات التواصل' : 'Official social media profile links'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Facebook */}
                    <div className="relative">
                      <FaFacebook className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-blue-600 opacity-60`} size={14} />
                      <input
                        placeholder="Facebook"
                        value={footer.facebook}
                        onChange={(e) => setFooter({ ...footer, facebook: e.target.value })}
                        className={`${inputClass} ${isRtl ? 'pr-10 pl-2 text-right' : 'pl-10 pr-2 text-left'} text-xs`}
                      />
                    </div>

                    {/* Instagram */}
                    <div className="relative">
                      <FaInstagram className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-pink-500 opacity-60`} size={14} />
                      <input
                        placeholder="Instagram"
                        value={footer.instagram}
                        onChange={(e) => setFooter({ ...footer, instagram: e.target.value })}
                        className={`${inputClass} ${isRtl ? 'pr-10 pl-2 text-right' : 'pl-10 pr-2 text-left'} text-xs`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* TikTok */}
                    <div className="relative">
                      <FaTiktok className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-800 opacity-60`} size={14} />
                      <input
                        placeholder="TikTok"
                        value={footer.tiktok}
                        onChange={(e) => setFooter({ ...footer, tiktok: e.target.value })}
                        className={`${inputClass} ${isRtl ? 'pr-10 pl-2 text-right' : 'pl-10 pr-2 text-left'} text-xs`}
                      />
                    </div>

                    {/* Telegram */}
                    <div className="relative">
                      <FaTelegramPlane className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-sky-500 opacity-60`} size={14} />
                      <input
                        placeholder="Telegram"
                        value={footer.telegram}
                        onChange={(e) => setFooter({ ...footer, telegram: e.target.value })}
                        className={`${inputClass} ${isRtl ? 'pr-10 pl-2 text-right' : 'pl-10 pr-2 text-left'} text-xs`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Save button ── */}
        <div className="p-6 border-t border-(--border-color) bg-(--bg-main)/30">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full py-4 rounded-2xl font-black text-white shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ${
              saving ? "bg-green-500/50 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 shadow-green-500/20"
            }`}
          >
            {saving ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>⚙️</motion.div>
            ) : (
              <FiCheck />
            )}
            <span>{t('admin.save_changes')}</span>
          </button>
        </div>

        <AnimatePresence>
          {toast && <Toast type={toast.type} message={toast.message} />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
