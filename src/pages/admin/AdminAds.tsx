import React, { useEffect, useState } from "react";
import { Megaphone, Plus, Trash2, ExternalLink, Image as ImageIcon, CheckCircle2, XCircle, Power, Eye, Sparkles } from "lucide-react";
import { 
  getAllAdminAdvertisements, createAdvertisement as createFirestoreAd, 
  toggleAdvertisement as toggleFirestoreAd, deleteAdvertisement as deleteFirestoreAd 
} from "../../lib/firestoreService";

export default function AdminAds() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState("header");
  const [imageUrl, setImageUrl] = useState("");
  const [adUrl, setAdUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [filterPosition, setFilterPosition] = useState("all");

  const positionsList = [
    { value: "header", label: "शीर्ष हेडरल ब्यानर (Top Header)", size: "728x90" },
    { value: "below_breaking", label: "ब्रेकिङ न्युज मुनि (Below Breaking)", size: "970x90" },
    { value: "homepage_middle", label: "गृहपृष्ठ मुख्य ब्यानर (Homepage Mid)", size: "970x100" },
    { value: "homepage_category_divider", label: "समाचार विधा बीचको ब्यानर (Category Divider)", size: "728x90" },
    { value: "sidebar", label: "दायाँ साइडबार माथिल्लो (Sidebar Box)", size: "300x250" },
    { value: "sidebar_bottom", label: "दायाँ साइडबार स्काइस्क्र्यापर (Sidebar Tall)", size: "300x600" },
    { value: "article_top", label: "समाचार शीर्षक मुनि (Article Top)", size: "728x90" },
    { value: "article_middle", label: "समाचार अनुच्छेद भित्र (Article In-Body)", size: "728x90" },
    { value: "article_bottom", label: "कमेन्ट अगाडिको ब्यानर (Pre-Comments)", size: "728x90" },
    { value: "article_sidebar", label: "समाचार दायाँ साइडबार (Article Sidebar)", size: "300x250" },
    { value: "article_sidebar_bottom", label: "समाचार साइडबार लामो (Article Skyscraper)", size: "300x600" },
    { value: "category_top", label: "क्याटेगोरी शीर्ष ब्यानर (Category Top)", size: "728x90" },
    { value: "footer", label: "फुटर माथिको ब्यानर (Pre-Footer)", size: "970x90" },
  ];

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const fbAds = await getAllAdminAdvertisements();
      if (fbAds && fbAds.length > 0) {
        setAds(fbAds);
      } else {
        const res = await fetch("/api/admin/advertisements");
        const data = await res.json();
        if (Array.isArray(data)) setAds(data);
      }
    } catch (err) {
      console.error(err);
      fetch("/api/admin/advertisements")
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setAds(data); })
        .catch(() => {});
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;
    setSaving(true);
    try {
      // 1. Direct save to Firestore
      const newAd = await createFirestoreAd({ title, position, imageUrl, adUrl });
      
      // 2. Also sync to API if available
      fetch("/api/advertisements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, position, imageUrl, adUrl })
      }).catch(() => {});

      setAds([newAd, ...ads]);
      setTitle("");
      setImageUrl("");
      setAdUrl("");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: any) => {
    const currentAd = ads.find(a => a.id === id);
    if (!currentAd) return;
    try {
      await toggleFirestoreAd(String(id), Boolean(currentAd.isActive));
      fetch(`/api/advertisements/${id}/toggle`, { method: "PATCH" }).catch(() => {});
      setAds(ads.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: any) => {
    if (!confirm("के तपाईं यो विज्ञापन हटाउन निश्चित हुनुहुन्छ?")) return;
    try {
      await deleteFirestoreAd(String(id));
      fetch(`/api/advertisements/${id}`, { method: "DELETE" }).catch(() => {});
      setAds(ads.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const setSampleAd = (sampleTitle: string, samplePos: string, sampleImg: string, sampleUrl: string) => {
    setTitle(sampleTitle);
    setPosition(samplePos);
    setImageUrl(sampleImg);
    setAdUrl(sampleUrl);
  };

  const filteredAds = filterPosition === "all" 
    ? ads 
    : ads.filter(a => a.position === filterPosition);

  return (
    <div className="space-y-6">
      {/* Header and Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-2xl font-black font-serif text-slate-900 flex items-center gap-2.5">
            <Megaphone className="w-7 h-7 text-red-600" />
            विज्ञापन ब्यानर व्यवस्थापन (Advertisement CMS)
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            हेडर, गृहपृष्ठ, समाचार भित्र, साइडबार तथा फुटरका विज्ञापन ब्यानरहरू सजिलै नियन्त्रण गर्नुहोस्।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-red-50 text-red-700 font-bold px-3 py-1.5 rounded-lg border border-red-200">
            जम्मा विज्ञापनहरू: {ads.length}
          </span>
          <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-lg border border-emerald-200">
            सक्रिय: {ads.filter(a => a.isActive).length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Ads List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Position Filter */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setFilterPosition("all")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterPosition === "all" ? "bg-red-600 text-white" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                सबै ({ads.length})
              </button>
              {positionsList.slice(0, 6).map(p => (
                <button
                  key={p.value}
                  onClick={() => setFilterPosition(p.value)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    filterPosition === p.value ? "bg-red-600 text-white font-bold" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {p.value}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {loading ? (
              <div className="p-12 text-center text-slate-500">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent mb-2" />
                <p className="text-xs">विज्ञापनहरू लोड हुँदैछन्...</p>
              </div>
            ) : filteredAds.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">कुनै विज्ञापन भेटिएन</p>
                <p className="text-xs text-slate-400 mt-1">दायाँतर्फको फारमबाट नयाँ विज्ञापन ब्यानर थप्नुहोस्।</p>
              </div>
            ) : (
              filteredAds.map((ad) => {
                const posMeta = positionsList.find(p => p.value === ad.position);
                return (
                  <div key={ad.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Thumbnail Preview */}
                      <div className="w-24 h-16 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0 relative group">
                        <img src={ad.imageUrl} alt="" className="w-full h-full object-cover" />
                        <a 
                          href={ad.imageUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] transition-opacity"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-sm">{ad.title}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            ad.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${ad.isActive ? "bg-emerald-600" : "bg-slate-500"}`} />
                            {ad.isActive ? "सक्रिय (Live)" : "निष्क्रिय (Off)"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                          <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {posMeta?.label || ad.position}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            [{posMeta?.size || "728x90"}]
                          </span>
                        </div>

                        {ad.adUrl && (
                          <a 
                            href={ad.adUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1 truncate max-w-xs"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span className="truncate">{ad.adUrl}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleToggleActive(ad.id)}
                        className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          ad.isActive 
                            ? "bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-800" 
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                        title={ad.isActive ? "ब्यानर बन्द गर्नुहोस्" : "ब्यानर सुरु गर्नुहोस्"}
                      >
                        <Power className="w-4 h-4" />
                        <span className="hidden sm:inline">{ad.isActive ? "बन्द" : "चालु"}</span>
                      </button>

                      <button 
                        onClick={() => handleDelete(ad.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="हटाउनुहोस्"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Add Ad Form & Presets (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-600" />
                नयाँ विज्ञापन थप्नुहोस् (Add Banner)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                कुनै पनि स्थानको विज्ञापन ब्यानर सिधै प्रकाशित गर्नुहोस्।
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  विज्ञापनको शीर्षक / संस्थाको नाम *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="उदा. नबिल बैंक डिजिटल बैंकिङ अफर"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  विज्ञापन रहने स्थान (Ad Placement Position) *
                </label>
                <select
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:ring-1 focus:ring-red-600 bg-white"
                >
                  {positionsList.map(p => (
                    <option key={p.value} value={p.value}>
                      {p.label} — [{p.size}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ब्यानर तस्विरको लिङ्क (Banner Image URL) *
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  क्लिक गरेपछि खुल्ने लिङ्क (Destination / Target URL)
                </label>
                <input
                  type="url"
                  value={adUrl}
                  onChange={e => setAdUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                {saving ? "सुरक्षित हुँदैछ..." : "विज्ञापन प्रकाशित गर्नुहोस्"}
              </button>
            </form>
          </div>

          {/* Quick Demo Templates */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              १-क्लिक नमुना विज्ञापन टेम्प्लेट (Quick Presets)
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              तलका कुनै पनि नमुना विज्ञापनमा क्लिक गरेर फारममा विवरणहरू स्वतः भर्न सक्नुहुन्छ:
            </p>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => setSampleAd(
                  "नेपाल टेलिकम ५जी अल्ट्रा स्पिड इन्टरनेट",
                  "header",
                  "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&auto=format&fit=crop&q=80",
                  "https://ntc.net.np"
                )}
                className="w-full text-left p-2.5 bg-white hover:bg-red-50 hover:border-red-300 rounded-xl border border-slate-200 text-xs transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-800 block">नेपाल टेलिकम ५जी ब्यानर</span>
                  <span className="text-[10px] text-slate-400">स्थान: header [728x90]</span>
                </div>
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">प्रयोग</span>
              </button>

              <button
                type="button"
                onClick={() => setSampleAd(
                  "नबिल बैंक - सुरक्षित डिजिटल मुद्दती खाता",
                  "sidebar",
                  "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80",
                  "https://nabilbank.com"
                )}
                className="w-full text-left p-2.5 bg-white hover:bg-red-50 hover:border-red-300 rounded-xl border border-slate-200 text-xs transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-800 block">नबिल बैंक साइडबार विज्ञापन</span>
                  <span className="text-[10px] text-slate-400">स्थान: sidebar [300x250]</span>
                </div>
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">प्रयोग</span>
              </button>

              <button
                type="button"
                onClick={() => setSampleAd(
                  "बजाज पल्सर - नयाँ वर्ष विशेष अफर",
                  "homepage_middle",
                  "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80",
                  "https://bajajnepal.com"
                )}
                className="w-full text-left p-2.5 bg-white hover:bg-red-50 hover:border-red-300 rounded-xl border border-slate-200 text-xs transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-800 block">बजाज पल्सर बीचको ब्यानर</span>
                  <span className="text-[10px] text-slate-400">स्थान: homepage_middle [970x100]</span>
                </div>
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">प्रयोग</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
