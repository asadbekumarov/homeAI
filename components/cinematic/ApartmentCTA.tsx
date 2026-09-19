"use client";

import React, { forwardRef, useState, useEffect } from "react";
import { InquiryFormData } from "./types";

interface ApartmentCTAProps {
  onOpenDrawer?: () => void;
}

export const ApartmentCTA = forwardRef<HTMLDivElement, ApartmentCTAProps>(
  (props, ref) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [formData, setFormData] = useState<InquiryFormData>({
      name: "",
      phone: "",
      email: "",
      message: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Close on Escape key
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isDrawerOpen) {
          setIsDrawerOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isDrawerOpen]);

    const validateForm = (): boolean => {
      const errs: Record<string, string> = {};
      if (!formData.name.trim()) errs.name = "Name is required";
      if (!formData.phone.trim()) errs.phone = "Phone is required";
      if (!formData.email.trim()) {
        errs.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errs.email = "Please enter a valid email address";
      }
      setErrors(errs);
      return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;
      // Simulate successful submission
      setIsSubmitted(true);
    };

    const handleReset = () => {
      setIsSubmitted(false);
      setFormData({ name: "", phone: "", email: "", message: "" });
      setErrors({});
      setIsDrawerOpen(false);
    };

    return (
      <>
        {/* Pinned Viewport Section Overlay */}
        <div
          ref={ref}
          style={{ opacity: 0, visibility: "hidden", willChange: "opacity" }}
          className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-center items-center md:items-end p-6 md:p-20 transition-opacity duration-200"
        >
          <div className="max-w-md text-center md:text-right pointer-events-auto bg-[#050505]/40 backdrop-blur-xs p-6 md:p-8 rounded-xs border border-white/5">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-neutral-400 font-light block mb-2">
              Featured Residence
            </span>
            <h2 className="text-3xl md:text-5xl font-light tracking-[0.2em] text-white uppercase leading-tight select-none">
              YOUR SPACE
            </h2>
            <p className="mt-3 text-xs md:text-sm text-neutral-300 font-light tracking-wide select-none">
              Explore the featured residence.
            </p>

            <div className="mt-8 flex justify-center md:justify-end">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="px-6 py-3.5 border border-white/40 text-white text-[11px] md:text-xs uppercase tracking-[0.25em] hover:bg-white hover:text-black transition-all duration-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/80 active:scale-95"
                aria-haspopup="dialog"
                aria-expanded={isDrawerOpen}
              >
                Request Private Viewing
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Inquiry Drawer / Modal */}
        {isDrawerOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-title"
            className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm p-0 md:p-6 transition-all duration-300"
          >
            {/* Backdrop click */}
            <div
              className="absolute inset-0"
              onClick={() => setIsDrawerOpen(false)}
            />

            <div className="relative w-full md:max-w-md h-full md:h-auto max-h-[90vh] bg-[#0c0c0c] border border-white/10 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl z-10">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div>
                    <h3
                      id="inquiry-title"
                      className="text-xs tracking-[0.3em] uppercase text-white font-medium"
                    >
                      PRIVATE VIEWING
                    </h3>
                    <p className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase mt-1">
                      Featured Residence Inquiry
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="text-neutral-400 hover:text-white p-1 transition-colors cursor-pointer text-sm"
                    aria-label="Close inquiry modal"
                  >
                    ✕
                  </button>
                </div>

                {isSubmitted ? (
                  <div className="py-12 text-center flex flex-col items-center">
                    <span className="text-white text-2xl mb-4 font-light">✓</span>
                    <h4 className="text-xs uppercase tracking-[0.3em] text-white font-medium mb-3">
                      INQUIRY RECEIVED
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed max-w-xs font-light tracking-wide">
                      Thank you. A private client advisor will contact you
                      shortly regarding the featured residence.
                    </p>
                    <button
                      onClick={handleReset}
                      className="mt-8 px-6 py-2.5 border border-white/20 text-white text-[10px] tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-all cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div>
                      <label
                        htmlFor="inquiry-name"
                        className="block text-[10px] uppercase tracking-[0.25em] text-neutral-400 mb-1.5 font-light"
                      >
                        Full Name *
                      </label>
                      <input
                        id="inquiry-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-[#161616] border border-white/15 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                        placeholder="Your Name"
                      />
                      {errors.name && (
                        <span className="text-[10px] text-red-400 mt-1 block">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-phone"
                        className="block text-[10px] uppercase tracking-[0.25em] text-neutral-400 mb-1.5 font-light"
                      >
                        Phone Number *
                      </label>
                      <input
                        id="inquiry-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full bg-[#161616] border border-white/15 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                        placeholder="+1 (555) 000-0000"
                      />
                      {errors.phone && (
                        <span className="text-[10px] text-red-400 mt-1 block">
                          {errors.phone}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-email"
                        className="block text-[10px] uppercase tracking-[0.25em] text-neutral-400 mb-1.5 font-light"
                      >
                        Email Address *
                      </label>
                      <input
                        id="inquiry-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-[#161616] border border-white/15 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                        placeholder="client@domain.com"
                      />
                      {errors.email && (
                        <span className="text-[10px] text-red-400 mt-1 block">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-message"
                        className="block text-[10px] uppercase tracking-[0.25em] text-neutral-400 mb-1.5 font-light"
                      >
                        Message (Optional)
                      </label>
                      <textarea
                        id="inquiry-message"
                        rows={3}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full bg-[#161616] border border-white/15 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors resize-none"
                        placeholder="Preferred timing or inquiry notes..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-4 py-3 bg-white text-black text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-neutral-200 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-white"
                    >
                      Send Inquiry
                    </button>
                  </form>
                )}
              </div>

              {/* Minimal Footer */}
              <div className="mt-8 pt-4 border-t border-white/5 text-[9px] uppercase tracking-[0.2em] text-neutral-400 text-center">
                Confidential Client Representation
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);

ApartmentCTA.displayName = "ApartmentCTA";
