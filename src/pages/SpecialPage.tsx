import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Star, ChevronRight, Clock, User } from "lucide-react";

export default function SpecialPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Special articles are featured or breaking or latest top
          const special = data.filter((a: any) => a.isFeatured || a.isBreaking);
          setArticles(special.length > 0 ? special : data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-red-700">गृहपृष्ठ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-medium">विशेष समाचार</span>
      </div>

      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-red-950 text-white p-6 sm:p-10 rounded-2xl border border-amber-500/30 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-slate-950 text-xs font-black uppercase rounded-full mb-3">
            <Star className="w-3.5 h-3.5 fill-slate-950" />
            सम्पादकको छनोट
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-serif">
            नयाँदृष्टि विशेष खोज तथा अनुसन्धान
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            गहिरो खोज, स्थलगत रिपोर्टिङ र विशेष विश्लेषणात्मक सामग्रीहरूको संगालो।
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-600 border-t-transparent mb-3" />
          <p className="text-slate-500 text-sm">लोड हुँदैछ...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: any) => (
            <Link 
              key={article.id} 
              to={`/news/${article.slug}`}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col group"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 relative">
                <img 
                  src={article.featuredImageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80"} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <span className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                  विशेष
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {article.category && (
                    <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider block mb-1">
                      {article.category.name}
                    </span>
                  )}
                  <h3 className="text-base font-bold font-serif text-slate-900 group-hover:text-red-700 leading-snug mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-red-600" />
                    {article.author?.name || "नयाँदृष्टि"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.publishedAt ? format(new Date(article.publishedAt), "MMM d, yyyy") : ""}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
