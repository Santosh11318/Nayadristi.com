import { useState } from "react";
import { Image as ImageIcon, Copy, Check, ExternalLink } from "lucide-react";

export default function AdminMedia() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const sampleImages = [
    {
      title: "संसद भवन बानेश्वर (Parliament House)",
      category: "राजनीति",
      url: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "नेपालको अर्थतन्त्र र बजेट",
      category: "अर्थतन्त्र",
      url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "नेपाली क्रिकेट टोली र खेलकुद",
      category: "खेलकुद",
      url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "सूचना प्रविधि र डिजिटल नेपाल",
      category: "प्रविधि",
      url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "स्वास्थ्य सेवा र अस्पताल",
      category: "स्वास्थ्य",
      url: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "नेपाली कला र संस्कृति",
      category: "समाज",
      url: "https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?w=800&auto=format&fit=crop&q=80"
    }
  ];

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-red-600" />
            मिडिया ग्यालरी (Media Gallery)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            समाचारमा प्रयोग गर्न सकिने उच्च गुणस्तरका तस्विरहरू (Copy image URL to use in articles)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleImages.map((img, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative aspect-video overflow-hidden bg-slate-100">
              <img 
                src={img.url} 
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 bg-black/70 backdrop-blur text-white text-[11px] font-bold px-2 py-0.5 rounded">
                {img.category}
              </span>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-slate-800 text-sm mb-3 line-clamp-1">{img.title}</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(img.url)}
                  className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 text-xs font-semibold rounded-md border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedUrl === img.url ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      लिङ्क कपि भयो!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      URL कपि गर्नुहोस्
                    </>
                  )}
                </button>
                <a
                  href={img.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md border border-slate-200 hover:bg-slate-50"
                  title="Open full size"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
