import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { Search, ChevronRight, Clock, ArrowLeft } from "lucide-react";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchTerm(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setResults(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-red-700">गृहपृष्ठ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-medium">समाचार खोजी</span>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h1 className="text-2xl sm:text-3xl font-black font-serif text-slate-900">
          समाचार खोजी गर्नुहोस् (Search News)
        </h1>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="कुनै पनि शब्द वा शीर्षक टाइप गर्नुहोस्..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button 
            type="submit" 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer shrink-0"
          >
            खोजी गर्नुहोस्
          </button>
        </form>
      </div>

      {/* Results Header */}
      {searchParams.get("q") && (
        <div className="flex justify-between items-center text-sm text-slate-600 border-b border-slate-200 pb-3">
          <span>
            <strong>'{searchParams.get("q")}'</strong> को लागि खोज परिणामहरू:
          </span>
          <span className="font-semibold text-red-600">{results.length} वटा समाचार भेटियो</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent mb-3" />
          <p className="text-slate-500 text-sm">खोज्दैछ...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          {results.map((article: any) => (
            <Link 
              key={article.id} 
              to={`/news/${article.slug}`}
              className="block bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs hover:border-red-400 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {article.featuredImageUrl && (
                  <div className="w-full sm:w-48 aspect-video sm:aspect-square sm:h-28 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src={article.featuredImageUrl} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {article.category && (
                      <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider block mb-1">
                        {article.category.name}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-700 leading-snug mb-1.5">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                    <span>{article.author?.name || "नयाँदृष्टि"}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.publishedAt ? format(new Date(article.publishedAt), "MMM d, yyyy") : ""}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : searchParams.get("q") ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <p className="text-base font-bold text-slate-700 mb-1">
            तपाईंको खोजी अनुसार कुनै पनि समाचार फेला परेन।
          </p>
          <p className="text-xs text-slate-500 mb-6">
            हिज्जे जाँच गर्नुहोस् वा अर्को सरल शब्द खोजेर हेर्नुहोस्।
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            गृहपृष्ठमा फर्कनुहोस्
          </Link>
        </div>
      ) : null}
    </div>
  );
}
