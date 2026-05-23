// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_settings_comp/SettingsModal.jsx

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const SettingsModal = ({ open, onClose, title, children }) => {

  // ── Prevent body scroll when open ─────────────────
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
          style={{
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            background: "rgba(0,0,0,0.45)",
            // ✅ force full coverage
            top:    0,
            left:   0,
            right:  0,
            bottom: 0,
            width:  "100vw",
            height: "100vh",
          }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            className="relative w-full overflow-hidden bg-white
              rounded-t-3xl sm:rounded-3xl
              max-h-[92vh] sm:max-h-[85vh]
              sm:max-w-md
              flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* top orange bar */}
            <div className="h-1 w-full shrink-0 bg-gradient-to-r from-transparent via-orange-400 to-transparent" />

            {/* drag handle — mobile only */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
              <div className="h-1 w-10 rounded-full bg-gray-200" />
            </div>

            {/* header */}
            <div className="flex shrink-0 items-center justify-between px-5 py-4 border-b border-gray-100 sm:px-6">
              <h3 className="text-base font-black text-black">{title}</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-all"
              >
                <X size={15} />
              </motion.button>
            </div>

            {/* scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;