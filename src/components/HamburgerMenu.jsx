import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative bg-white">
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((s) => !s)}
        className="z-40 relative w-10 h-10 flex items-center justify-center focus:outline-none"
      >
        <motion.span
          className="block absolute w-6 h-[2px] rounded bg-orange-500"
          animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
        <motion.span
          className="block absolute w-6 h-[2px] rounded bg-orange-500"
          animate={open ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.12 }}
        />
        <motion.span
          className="block absolute w-6 h-[2px] rounded bg-orange-500"
          animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/10 z-30"
            />

            <motion.nav
              initial={{ x: 260 }}
              animate={{ x: 0 }}
              exit={{ x: 260 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 ,duration: 0.1}}
              className="fixed top-0 right-0 z-40 h-full w-64 bg-orange-500 mt-14 shadow-1xl flex flex-col"
              onClick={() => setOpen(false)}
            >
              <ul className="flex-1 space-y-0 text-orange-500 bg-white">
                <li>
                  <Link
                    to="/"
                    className="block py-3 text-base font-medium hover:bg-white/20 px-2"
                  >
                    Home
                  </Link>
                  <div className="h-px bg-gray-200" />
                </li>

                <li>
                  <Link
                    to="/bookmarks"
                    className="block py-3 text-base font-medium hover:bg-white/20 px-2"
                  >
                    Bookmarks
                  </Link>
                  <div className="h-px bg-gray-200" />
                </li>

                <li>
                  <Link
                    to="/history"
                    className="block py-3 text-base font-medium hover:bg-white/20 px-2"
                  >
                    History
                  </Link>
                  <div className="h-px bg-gray-200" />
                </li>

                <li>
                  <Link
                    to="/AboutUs"
                    className="block py-3 text-base font-medium hover:bg-white/20 px-2"
                  >
                    About Us
                  </Link>
                  <div className="h-px bg-gray-200" />
                </li>

                <li>
                  <Link
                    to="/signin"
                    className="block py-3 text-base font-medium hover:bg-white/20 px-2"
                  >
                    Sign In
                  </Link>
                  <div className="h-px bg-gray-200" />
                </li>
              </ul>
              
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
