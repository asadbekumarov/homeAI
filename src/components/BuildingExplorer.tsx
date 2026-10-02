"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Layers,
  Home,
  CheckCircle2,
  Clock,
  XCircle,
  Maximize2,
  DollarSign,
  Sparkles,
  X,
  ArrowUpRight,
  Filter,
  ShieldCheck,
  PhoneCall,
  Download,
} from "lucide-react";
import { mockBuildingData } from "@/data/buildingData";
import {
  type Apartment,
  type ApartmentStatus,
  calculateBuildingStats,
} from "@/types/building";
import { useProject } from "@/context/ProjectContext";

interface BuildingExplorerProps {
  initialBuilding?: typeof mockBuildingData;
}

export default function BuildingExplorer({
  initialBuilding = mockBuildingData,
}: BuildingExplorerProps) {
  const { currentProject } = useProject();
  const building = currentProject?.building || initialBuilding;
  const stats = useMemo(() => calculateBuildingStats(building), [building]);

  // Tanlangan qavat (default: eng yuqori qavat yoki birinchi qavat)
  const [selectedFloorNumber, setSelectedFloorNumber] = useState<number>(
    building.floors[0]?.floorNumber ?? 1
  );

  // Tanlangan kvartira
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(
    null
  );

  // Filtrlar
  const [roomFilter, setRoomFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ApartmentStatus | "all">(
    "all"
  );

  const [downloading, setDownloading] = useState(false);
  const downloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (downloadTimerRef.current) {
        clearTimeout(downloadTimerRef.current);
      }
    };
  }, []);

  const handleDownloadPlan = () => {
    if (downloading) return;
    setDownloading(true);
    if (downloadTimerRef.current) {
      clearTimeout(downloadTimerRef.current);
    }
    downloadTimerRef.current = setTimeout(() => {
      setDownloading(false);
    }, 2000);
  };

  // Escape listener and body scroll lock for apartment detail modal
  useEffect(() => {
    if (!selectedApartment) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedApartment(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedApartment]);

  // Tanlangan qavat ma'lumotlari
  const currentFloor = useMemo(() => {
    return (
      building.floors.find((f) => f.floorNumber === selectedFloorNumber) ||
      building.floors[0]
    );
  }, [building, selectedFloorNumber]);

  // Filtrlangan kvartiralar
  const filteredApartments = useMemo(() => {
    if (!currentFloor) return [];
    return currentFloor.apartments.filter((apt) => {
      const matchRoom = roomFilter === "all" || apt.rooms === roomFilter;
      const matchStatus = statusFilter === "all" || apt.status === statusFilter;
      return matchRoom && matchStatus;
    });
  }, [currentFloor, roomFilter, statusFilter]);

  // Narxni chiroyli formatlash
  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Status badge komponenti
  const renderStatusBadge = (status: ApartmentStatus, size: "sm" | "md" = "sm") => {
    switch (status) {
      case "available":
        return (
          <span
            className={`inline-flex items-center gap-1.5 font-medium rounded-full ${
              size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
            } bg-emerald-500/15 text-emerald-400 border border-emerald-500/30`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <CheckCircle2 className="w-3.5 h-3.5" />
            Bo&apos;sh (Sotuvda)
          </span>
        );
      case "reserved":
        return (
          <span
            className={`inline-flex items-center gap-1.5 font-medium rounded-full ${
              size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
            } bg-amber-500/15 text-amber-400 border border-amber-500/30`}
          >
            <Clock className="w-3.5 h-3.5" />
            Band qilingan
          </span>
        );
      case "sold":
        return (
          <span
            className={`inline-flex items-center gap-1.5 font-medium rounded-full ${
              size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
            } bg-stone-500/15 text-stone-400 border border-stone-500/30`}
          >
            <XCircle className="w-3.5 h-3.5" />
            Sotilgan
          </span>
        );
    }
  };

  return (
    <section id="apartments" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 xl:px-10 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-px bg-accent" />
              <span className="text-xs tracking-[0.25em] uppercase text-accent font-semibold">
                {currentProject?.projectName || "Xon Saroy — Orzular"} · Interaktiv bino rejasi
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground font-normal tracking-tight">
              Qavatlar va <span className="text-accent italic">kvartiralar</span>
            </h2>
            <p className="text-foreground-muted mt-3 max-w-xl text-sm sm:text-base">
              Har bir qavatning joylashuvi, xonalar soni, maydoni va narxlarini
              qulay interfeys orqali real vaqtda ko&apos;zdan kechiring.
            </p>
          </div>

          {/* Quick Statistics Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 p-2 sm:p-3 bg-card rounded-2xl border border-card-border shadow-xs">
            <div className="px-3 py-2 text-center border-r border-divider/60">
              <div className="text-xs text-foreground-muted">Jami kvartiralar</div>
              <div className="text-lg sm:text-xl font-semibold text-foreground">
                1600 ta
              </div>
            </div>
            <div className="px-3 py-2 text-center border-r border-divider/60">
              <div className="text-xs text-emerald-400 font-medium">Bloklar</div>
              <div className="text-lg sm:text-xl font-semibold text-emerald-400">
                14 ta blok
              </div>
            </div>
            <div className="px-3 py-2 text-center">
              <div className="text-xs text-accent font-medium">Shift balandligi</div>
              <div className="text-lg sm:text-xl font-semibold text-foreground">
                3.1 metr
              </div>
            </div>
          </div>
        </div>

        {/* Xon Saroy Layouts & Payment terms notice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-card border border-card-border/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0 mt-0.5">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">
                10 xildan ortiq rejaviy yechimlar
              </h4>
              <p className="text-xs text-foreground-muted leading-relaxed">
                <strong className="text-foreground font-medium">1 xonali:</strong> 35–48 m² ·{" "}
                <strong className="text-foreground font-medium">2 xonali:</strong> 54–72 m² ·{" "}
                <strong className="text-foreground font-medium">3 xonali:</strong> 80–120 m² ·{" "}
                <strong className="text-foreground font-medium">Pentxauslar:</strong> 197.7 m² gacha
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-card-border/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <DollarSign size={16} />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                Qulay to&apos;lov va muddatli to&apos;lov (Rassrochka)
              </h4>
              <p className="text-xs text-foreground-muted leading-relaxed">
                100% to‘lovda maxsus chegirmalar. 30% yoki 50% boshlang‘ich to‘lov bilan uylar topshirilgunga qadar (18 oydan 36 oygacha) 0% foizsiz muddatli to‘lov.
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid: Floors selector + Apartments View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Vertical Floor Selector (Architectural Elevator) */}
          <div className="lg:col-span-3 bg-card rounded-2xl border border-card-border p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-divider/60">
              <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                <Layers className="w-4 h-4 text-accent" />
                <span>Qavatlar</span>
              </div>
              <span className="text-xs text-foreground-muted">
                {building.floors.length} ta qavat
              </span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {building.floors.map((floor) => {
                const isSelected = floor.floorNumber === selectedFloorNumber;
                const availableCount = floor.apartments.filter(
                  (a) => a.status === "available"
                ).length;

                return (
                  <button
                    key={floor.floorNumber}
                    onClick={() => {
                      setSelectedFloorNumber(floor.floorNumber);
                      setSelectedApartment(null);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left ${
                      isSelected
                        ? "bg-accent text-white shadow-md shadow-accent/20"
                        : "hover:bg-background-dark text-foreground border border-transparent hover:border-divider"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-serif text-sm font-semibold ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-background-dark text-foreground-muted"
                        }`}
                      >
                        {floor.floorNumber}
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {floor.floorNumber}-qavat
                          {floor.floorNumber === building.totalFloors && (
                            <span
                              className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                                isSelected
                                  ? "bg-white/20 text-white"
                                  : "bg-accent/15 text-accent"
                              }`}
                            >
                              Penthouse
                            </span>
                          )}
                        </div>
                        <div
                          className={`text-xs ${
                            isSelected ? "text-white/80" : "text-foreground-muted"
                          }`}
                        >
                          {floor.apartments.length} ta xonadon
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {availableCount > 0 ? (
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          }`}
                        >
                          {availableCount} ta bo&apos;sh
                        </span>
                      ) : (
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-white/10 text-white/70"
                              : "bg-white/5 text-stone-400 border border-white/5"
                          }`}
                        >
                          To&apos;liq band
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Visual Legend */}
            <div className="mt-5 pt-4 border-t border-divider/60 space-y-2 text-xs">
              <div className="text-foreground-muted font-medium mb-1">
                Holat belgisi:
              </div>
              <div className="flex items-center gap-2 text-foreground-muted">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Bo&apos;sh (Xarid qilish mumkin)</span>
              </div>
              <div className="flex items-center gap-2 text-foreground-muted">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Band qilingan</span>
              </div>
              <div className="flex items-center gap-2 text-foreground-muted">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
                <span>Sotilgan</span>
              </div>
            </div>
          </div>

          {/* Right Column: Apartments Grid + Detail Drawer Area */}
          <div className="lg:col-span-9 space-y-6">
            {/* Floor Header & Filter Bar */}
            <div className="bg-card rounded-2xl border border-card-border p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-serif text-foreground">
                    {currentFloor?.floorNumber}-qavatdagi xonadonlar
                  </h3>
                  <span className="text-xs bg-background-dark text-foreground-muted px-2.5 py-1 rounded-full">
                    Jami: {currentFloor?.apartments.length} ta
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-foreground-muted mt-1">
                  Kvartiraning ustiga bosib, to&apos;liq texnik ma&apos;lumotlarini ko&apos;ring.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Rooms Filter */}
                <div className="flex items-center bg-background-dark rounded-xl p-1 border border-divider/60">
                  <button
                    onClick={() => setRoomFilter("all")}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-medium ${
                      roomFilter === "all"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-foreground-muted hover:text-foreground"
                    }`}
                  >
                    Barchasi
                  </button>
                  {[1, 2, 3, 4].map((rooms) => (
                    <button
                      key={rooms}
                      onClick={() => setRoomFilter(rooms)}
                      className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-medium ${
                        roomFilter === rooms
                          ? "bg-card text-foreground shadow-xs"
                          : "text-foreground-muted hover:text-foreground"
                      }`}
                    >
                      {rooms} xonali
                    </button>
                  ))}
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as ApartmentStatus | "all")
                  }
                  className="bg-background-dark text-foreground text-xs rounded-xl px-3 py-1.5 border border-divider/60 focus:outline-none focus:border-accent"
                >
                  <option value="all">Barcha holatlar</option>
                  <option value="available">Faqat bo&apos;shlar</option>
                  <option value="reserved">Band qilinganlar</option>
                  <option value="sold">Sotilganlar</option>
                </select>
              </div>
            </div>

            {/* Apartments Grid */}
            {filteredApartments.length === 0 ? (
              <div className="bg-card rounded-2xl border border-card-border p-12 text-center text-foreground-muted">
                <Filter className="w-8 h-8 mx-auto mb-3 text-accent opacity-60" />
                <p className="text-base font-medium text-foreground">
                  Mos kvartiralar topilmadi
                </p>
                <p className="text-xs mt-1">
                  Filtr parametrlarini o&apos;zgartirib qayta urinib ko&apos;ring.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredApartments.map((apt) => {
                  const isSelected = selectedApartment?.id === apt.id;
                  const pricePerSqm = Math.round(apt.price / apt.area);

                  return (
                    <motion.div
                      key={apt.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setSelectedApartment(apt)}
                      className={`group relative bg-card rounded-2xl border p-5 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        isSelected
                          ? "border-accent ring-2 ring-accent/20 shadow-md bg-accent/5"
                          : "border-card-border hover:border-accent/40"
                      }`}
                    >
                      {/* Top Bar: Apartment Number + Status */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-background-dark flex items-center justify-center font-serif text-lg font-semibold text-foreground group-hover:bg-accent group-hover:text-white transition-colors">
                            №{apt.number}
                          </div>
                          <div>
                            <div className="text-xs text-foreground-muted">
                              {apt.floorNumber}-qavat
                            </div>
                            <div className="text-sm font-semibold text-foreground">
                              {apt.rooms} xonali xonadon
                            </div>
                          </div>
                        </div>

                        {renderStatusBadge(apt.status, "sm")}
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-3 py-3 border-y border-divider/60 mb-4 text-xs">
                        <div>
                          <span className="text-foreground-muted block mb-0.5">
                            Umumiy maydon
                          </span>
                          <span className="font-semibold text-foreground text-sm flex items-center gap-1">
                            <Maximize2 className="w-3.5 h-3.5 text-accent" />
                            {apt.area} m²
                          </span>
                        </div>
                        <div>
                          <span className="text-foreground-muted block mb-0.5">
                            1 m² narxi
                          </span>
                          <span className="font-semibold text-foreground text-sm flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-accent" />
                            ${pricePerSqm}
                          </span>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-foreground-muted">
                            Umumiy narxi:
                          </div>
                          <div className="text-lg font-bold text-accent font-serif">
                            {formatPrice(apt.price, apt.currency)}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-dark transition-colors group-hover:translate-x-1"
                        >
                          Batafsil
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apartment Detail Modal / Drawer */}
      <AnimatePresence>
        {selectedApartment && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Xonadon №${selectedApartment.number} ma'lumotlari`}
            onClick={() => setSelectedApartment(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl bg-card rounded-3xl border border-card-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-divider/60 flex items-start justify-between bg-background-dark/50">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs uppercase tracking-wider text-accent font-semibold">
                      {selectedApartment.floorNumber}-qavat • Xonadon №{selectedApartment.number}
                    </span>
                    {renderStatusBadge(selectedApartment.status, "sm")}
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-foreground font-medium">
                    {selectedApartment.rooms} xonali shinam kvartira
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedApartment(null)}
                  aria-label="Yopish (Esc)"
                  className="p-2 rounded-full hover:bg-divider/50 text-foreground-muted hover:text-foreground transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Price highlight banner */}
                <div className="p-5 rounded-2xl bg-accent/10 border border-accent/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-foreground-muted block mb-1">
                      Kvartiraning to&apos;liq narxi:
                    </span>
                    <div className="text-3xl font-serif font-bold text-accent">
                      {formatPrice(selectedApartment.price, selectedApartment.currency)}
                    </div>
                    <span className="text-xs text-foreground-muted mt-1 block">
                      Taxminan {(selectedApartment.price * 12800).toLocaleString()} UZS
                    </span>
                  </div>

                  <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-accent/20 pt-3 sm:pt-0 sm:pl-5">
                    <span className="text-xs text-foreground-muted block mb-1">
                      1 m² maydon narxi:
                    </span>
                    <div className="text-xl font-semibold text-foreground">
                      ${Math.round(selectedApartment.price / selectedApartment.area)} / m²
                    </div>
                    <span className="text-xs text-emerald-400 font-medium">
                      Boshlang&apos;ich to&apos;lov 30% dan
                    </span>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl bg-background-dark border border-divider/60 text-center">
                    <Maximize2 className="w-5 h-5 mx-auto mb-2 text-accent" />
                    <div className="text-xs text-foreground-muted">Maydoni</div>
                    <div className="text-base font-bold text-foreground mt-0.5">
                      {selectedApartment.area} m²
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-background-dark border border-divider/60 text-center">
                    <Home className="w-5 h-5 mx-auto mb-2 text-accent" />
                    <div className="text-xs text-foreground-muted">Xonalar</div>
                    <div className="text-base font-bold text-foreground mt-0.5">
                      {selectedApartment.rooms} xona
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-background-dark border border-divider/60 text-center">
                    <Layers className="w-5 h-5 mx-auto mb-2 text-accent" />
                    <div className="text-xs text-foreground-muted">Qavat</div>
                    <div className="text-base font-bold text-foreground mt-0.5">
                      {selectedApartment.floorNumber} / {building.totalFloors}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-background-dark border border-divider/60 text-center">
                    <ShieldCheck className="w-5 h-5 mx-auto mb-2 text-accent" />
                    <div className="text-xs text-foreground-muted">Shift balandligi</div>
                    <div className="text-base font-bold text-foreground mt-0.5">
                      3.3 metr
                    </div>
                  </div>
                </div>

                {/* Architectural Plan Illustration */}
                <div className="p-6 rounded-2xl bg-background-dark border border-divider/60 flex flex-col items-center justify-center text-center">
                  <div className="w-full h-40 rounded-xl bg-card border border-dashed border-divider flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-radial from-accent/5 to-transparent pointer-events-none" />
                    <Building2 className="w-12 h-12 text-accent/40 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-foreground-muted font-medium">
                      Xonadon rejasi (Architectural Floor Plan)
                    </span>
                    <span className="text-[11px] text-accent mt-0.5">
                      {selectedApartment.area} m² • {selectedApartment.rooms} xonali
                    </span>
                  </div>
                </div>

                {/* Features & Advantages */}
                {selectedApartment.features && selectedApartment.features.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-3">
                      Xonadonning afzalliklari:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedApartment.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background-dark text-foreground text-xs border border-divider/60"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-accent" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="p-5 border-t border-divider/60 bg-background-dark/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <a
                  href="#contact"
                  onClick={() => setSelectedApartment(null)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-[#0A0908] font-bold text-sm hover:bg-accent-light transition-all shadow-lg shadow-accent/25 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PhoneCall className="w-4 h-4" />
                  Bron qilish va konsultatsiya
                </a>

                <button
                  type="button"
                  disabled={downloading}
                  onClick={handleDownloadPlan}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-divider bg-card text-foreground hover:bg-background-dark font-medium text-sm transition-colors cursor-pointer disabled:opacity-80"
                >
                  {downloading ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-bounce" />
                      <span className="text-emerald-700 font-semibold">Reja tayyorlandi!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-accent" />
                      <span>PDF rejasini yuklab olish</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
