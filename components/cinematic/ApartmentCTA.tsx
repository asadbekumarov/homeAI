"use client";

import React, { forwardRef, useState, useEffect, useRef } from "react";
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

    const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const firstInputRef = useRef<HTMLInputElement | null>(null);

    // Focus management when opening/closing drawer
    useEffect(() => {
      if (isDrawerOpen) {
        // Focus the first input or dialog container
        setTimeout(() => {
          firstInputRef.current?.focus();
        }, 50);

        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === "Escape") {
            handleClose();
          }

          // Trap focus inside modal
          if (e.key === "Tab" && dialogRef.current) {
            const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements.length > 0) {
              const firstElement = focusableElements[0];
              const lastElement = focusableElements[focusableElements.length - 1];

              if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
      }
    }, [isDrawerOpen]);

    const handleOpen = () => {
      setIsDrawerOpen(true);
    };

    const handleClose = () => {
      setIsDrawerOpen(false);
      // Return focus to triggering button
      setTimeout(() => {
        triggerButtonRef.current?.focus();
      }, 50);
    };

    const validateForm = (): boolean => {
      const errs: Record<string, string> = {};
      if (!formData.name.trim()) errs.name = "Name is required";
      if (!formData.phone.trim()) errs.phone = "Phone number is required";
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
      setIsSubmitted(true);
    };

    const handleReset = () => {
      setIsSubmitted(false);
      setFormData({ name: "", phone: "", email: "", message: "" });
      setErrors({});
      handleClose();
    };

    return (
      <>
        {/* Pinned Viewport Section Overlay */}
        <div
          ref={ref}
          style={{ opacity: 0, visibility: "hidden", willChange: "opacity" }}
          className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-end items-end p-5 md:p-10 pb-16 md:pb-20 transition-opacity duration-200"
        >
          <div className="max-w-xs md:max-w-sm text-right pointer-events-auto bg-[#050505]/85 backdrop-blur-xs p-4 md:p-6 border border-white/15 shadow-2xl">
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-[#c8b28a] font-light block mb-1">
              FEATURED RESIDENCE
            </span>
            <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white uppercase leading-tight select-none">
              YOUR SPACE
            </h2>
            <p className="mt-2 text-[11px] md:text-xs text-neutral-300 font-light tracking-wide select-none">
              Explore the featured residence.
            </p>

            <div className="mt-4 flex justify-end">
              <button
                ref={triggerButtonRef}
                onClick={handleOpen}
                className="px-5 py-2.5 border border-[#c8b28a]/80 text-white text-[10px] md:text-[11px] uppercase tracking-[0.25em] hover:bg-[#c8b28a] hover:text-black transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c8b28a] active:scale-95"
                aria-haspopup="dialog"
                aria-expanded={isDrawerOpen}
              >
                Request Private Viewing
              </button>
            </div>
          </div>
        </div>

        {/* Accessible Inquiry Drawer / Modal */}
        {isDrawerOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-title"
            className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 p-0 md:p-6 transition-all duration-300"
          >
            {/* Backdrop click */}
            <div
              className="absolute inset-0"
              onClick={handleClose}
              aria-hidden="true"
            />

            <div
              ref={dialogRef}
              className="relative w-full md:max-w-md h-full md:h-auto max-h-[90vh] bg-[#090909] border border-white/10 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl z-10"
            >
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
                    <p className="text-[10px] tracking-[0.2em] text-[#c8b28a] uppercase mt-1">
                      FEATURED RESIDENCE
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-neutral-400 hover:text-white p-2 transition-colors cursor-pointer text-sm focus:outline-none focus:ring-1 focus:ring-[#c8b28a]"
                    aria-label="Close inquiry dialog"
                  >
                    ✕
                  </button>
                </div>

                {isSubmitted ? (
                  <div className="py-12 text-center flex flex-col items-center">
                    <span className="text-[#c8b28a] text-2xl mb-4 font-light">✓</span>
                    <h4 className="text-xs uppercase tracking-[0.3em] text-white font-medium mb-3">
                      INQUIRY RECEIVED
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed max-w-xs font-light tracking-wide">
                      Thank you. A private client advisor will contact you shortly regarding the featured residence.
                    </p>
                    <button
                      onClick={handleReset}
                      className="mt-8 px-6 py-2.5 border border-[#c8b28a]/60 text-white text-[10px] tracking-[0.25em] uppercase hover:bg-[#c8b28a] hover:text-black transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#c8b28a]"
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
                        ref={firstInputRef}
                        id="inquiry-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-[#141414] border border-white/15 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#c8b28a] transition-colors"
                        placeholder="Your Name"
                        aria-required="true"
                        aria-invalid={!!errors.name}
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
                        className="w-full bg-[#141414] border border-white/15 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#c8b28a] transition-colors"
                        placeholder="+1 (555) 000-0000"
                        aria-required="true"
                        aria-invalid={!!errors.phone}
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
                        className="w-full bg-[#141414] border border-white/15 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#c8b28a] transition-colors"
                        placeholder="client@domain.com"
                        aria-required="true"
                        aria-invalid={!!errors.email}
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
                        className="w-full bg-[#141414] border border-white/15 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#c8b28a] transition-colors resize-none"
                        placeholder="Preferred viewing timing or inquiry notes..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-4 py-3 bg-[#c8b28a] text-black text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-[#d6c5a3] transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-white"
                    >
                      Send Inquiry
                    </button>
                  </form>
                )}
              </div>

              {/* Minimal Footer */}
              <div className="mt-8 pt-4 border-t border-white/5 text-[9px] uppercase tracking-[0.2em] text-neutral-500 text-center">
                RESIDENCE DETAILS — PRIVATE CLIENT SERVICE
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);

ApartmentCTA.displayName = "ApartmentCTA";
