import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Megaphone, ExternalLink, Sparkles } from "lucide-react";
import { getAdvertisements } from "../lib/firestoreService";

interface AdSlotProps {
  position: string;
  fallbackSize?: "728x90" | "970x90" | "970x100" | "300x250" | "300x600" | "320x100" | string;
  label?: string;
  className?: string;
  ads?: any[];
}

export default function AdSlot({
  position,
  fallbackSize = "728x90",
  label,
  className = "",
  ads: passedAds,
}: AdSlotProps) {
  const [internalAds, setInternalAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(!passedAds);

  useEffect(() => {
    if (passedAds) {
      setInternalAds(passedAds);
      setLoading(false);
      return;
    }

    getAdvertisements()
      .then((adsList) => {
        if (adsList && adsList.length > 0) {
          setInternalAds(adsList);
        } else {
          fetch("/api/advertisements")
            .then((res) => res.json())
            .then((data) => {
              if (Array.isArray(data)) setInternalAds(data);
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        fetch("/api/advertisements")
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) setInternalAds(data);
          })
          .catch(() => {});
      })
      .finally(() => setLoading(false));
  }, [passedAds]);

  const allAds = passedAds || internalAds;

  // Find matching active ad for this position
  const activeAd = allAds.find((a: any) => {
    if (!a.isActive && a.isActive !== undefined && a.isActive !== null && a.isActive === false) return false;
    if (a.position === position) return true;
    
    // Position alias fallbacks
    if (position === "header" && (a.position === "header_top" || a.position === "top_banner")) return true;
    if (position === "below_breaking" && (a.position === "homepage_banner" || a.position === "top_lead")) return true;
    if (position === "homepage_middle" && (a.position === "middle" || a.position === "homepage_banner")) return true;
    if (position === "sidebar" && (a.position === "sidebar_top" || a.position === "sidebar_banner")) return true;
    if (position === "article_sidebar" && a.position === "sidebar") return true;
    
    return false;
  });

  const getSlotHeight = () => {
    switch (fallbackSize) {
      case "300x600":
        return "min-h-[300px] sm:min-h-[450px] max-h-[600px]";
      case "300x250":
        return "min-h-[160px] sm:min-h-[220px]";
      case "970x90":
      case "970x100":
        return "min-h-[70px] sm:min-h-[90px]";
      case "728x90":
      default:
        return "min-h-[70px] sm:min-h-[90px]";
    }
  };

  return (
    <div className={`w-full my-4 ${className}`}>
      {/* Top micro badge */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1 px-1">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
          विज्ञापन / ADVERTISEMENT {label ? `• ${label}` : ""}
        </span>
        <span className="text-[9px] text-slate-400 font-mono hidden sm:inline">[{fallbackSize}]</span>
      </div>

      {activeAd ? (
        // Active Real Advertisement Banner
        <div className="relative group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all">
          <a
            href={activeAd.adUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full overflow-hidden"
            title={activeAd.title}
          >
            {activeAd.htmlCode ? (
              <div
                dangerouslySetInnerHTML={{ __html: activeAd.htmlCode }}
                className="w-full flex justify-center items-center overflow-hidden"
              />
            ) : (
              <div className="relative w-full flex items-center justify-center bg-slate-900/5">
                <img
                  src={activeAd.imageUrl}
                  alt={activeAd.title}
                  className="w-full h-auto max-h-[130px] sm:max-h-[160px] md:max-h-[200px] object-cover group-hover:scale-[1.01] transition-transform duration-300"
                  loading="lazy"
                />
                {activeAd.adUrl && (
                  <div className="absolute bottom-2 right-2 bg-black/75 hover:bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>थप जानकारी</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
            )}
          </a>
        </div>
      ) : (
        // Professional Available Advertisement Space Placeholder
        <div
          className={`w-full ${getSlotHeight()} rounded-xl border-2 border-dashed border-red-200 bg-gradient-to-r from-red-50/60 via-amber-50/40 to-red-50/60 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left transition-all hover:border-red-300 shadow-2xs`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h4 className="text-xs sm:text-sm font-black text-slate-800">
                  विज्ञापनका लागि स्थान उपलब्ध छ
                </h4>
                <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded text-center">
                  Space Available
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 max-w-xl">
                आफ्नो ब्राण्ड, व्यवसाय वा संस्थाको व्यापक प्रचारका लागि नयाँदृष्टि डिजिटल पोर्टलमा विज्ञापन गर्नुहोस्।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-1.5 sm:py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>दररेट र बुकिङ</span>
            </Link>
            <Link
              to="/admin/ads"
              className="inline-flex items-center text-[11px] font-semibold text-slate-500 hover:text-slate-900 border border-slate-300 hover:bg-white bg-white/70 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="एडमिन प्यानलबाट सिधै विज्ञापन ब्यानर राख्नुहोस्"
            >
              + विज्ञापन राख्नुहोस्
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
