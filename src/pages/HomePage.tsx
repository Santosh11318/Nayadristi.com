import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Clock, User, Flame, ArrowRight, TrendingUp } from "lucide-react";
import { toNepaliNumber } from "../lib/nepaliDate";
import AdSlot from "../components/AdSlot";

export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/articles").then(res => res.json()),
      fetch("/api/advertisements").then(res => res.json()).catch(() => [])
    ])
      .then(([articlesData, adsData]) => {
        if (Array.isArray(articlesData)) setArticles(articlesData);
        if (Array.isArray(adsData)) setAds(adsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const featured = articles.filter(a => a.isFeatured)[0] || articles[0];
  const secondary = articles.filter(a => a.id !== featured?.id).slice(0, 3);
  const latest = articles.slice(0, 8);

  // Group by popular categories
  const politicsArticles = articles.filter(a => 
    a.category?.name === "राजनीति" || a.category?.slug === "politics"
  ).slice(0, 4);

  const economyArticles = articles.filter(a => 
    a.category?.name === "अर्थतन्त्र" || a.category?.slug === "economy"
  ).slice(0, 4);

  const sportsArticles = articles.filter(a => 
    a.category?.name === "खेलकुद" || a.category?.slug === "sports"
  ).slice(0, 4);

  const sidebarAd = ads.find(a => a.position === "sidebar");
  const middleAd = ads.find(a => a.position === "middle" || a.position === "homepage_banner");

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent mb-3" />
        <p className="text-slate-500 text-sm">समाचार पोर्टल लोड हुँदैछ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 1. Hero Lead Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Lead Story (8 Cols) */}
        {featured ? (
          <Link 
            to={`/news/${featured.slug}`} 
            className="lg:col-span-8 group relative overflow-hidden bg-slate-900 rounded-2xl flex flex-col justify-end aspect-[16/10] sm:aspect-[16/9] shadow-md"
          >
            <img 
              src={featured.featuredImageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80"} 
              alt={featured.title} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
            
            <div className="relative p-6 sm:p-8 text-white space-y-3 z-10">
              {featured.category && (
                <span className="bg-[#B22222] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm inline-block">
                  {featured.category.name}
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif leading-tight group-hover:text-red-300 transition-colors">
                {featured.title}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 max-w-2xl font-sans leading-relaxed">
                {featured.summary}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 border-t border-white/20">
                <span className="font-semibold text-white">{featured.author?.name || "नयाँदृष्टि सम्पादक"}</span>
                <span>•</span>
                <span>{featured.publishedAt ? format(new Date(featured.publishedAt), 'MMM d, yyyy') : ''}</span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="lg:col-span-8 bg-slate-100 aspect-[16/9] rounded-2xl flex items-center justify-center text-slate-400">
            समाचार उपलब्ध छैन। एडमिनबाट समाचार थप्नुहोस्।
          </div>
        )}
        
        {/* Right 4 Cols: Fast Updates List */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="border-b-2 border-slate-900 pb-2 flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-xs" />
              ताजा अपडेट (Latest)
            </h3>
            <span className="text-[11px] text-red-600 font-bold">प्रत्यक्ष</span>
          </div>

          <div className="space-y-4 divide-y divide-slate-100">
            {secondary.map((article: any) => (
              <Link 
                key={article.id} 
                to={`/news/${article.slug}`} 
                className="pt-4 first:pt-0 flex gap-3 group"
              >
                <div className="w-24 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                  <img 
                    src={article.featuredImageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300&auto=format&fit=crop&q=80"} 
                    alt="" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    {article.category && (
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mb-0.5">
                        {article.category.name}
                      </span>
                    )}
                    <h4 className="text-xs sm:text-sm font-bold leading-snug text-slate-900 group-hover:text-red-700 line-clamp-2">
                      {article.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {article.publishedAt ? format(new Date(article.publishedAt), 'MMM d, h:mm a') : ''}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Sidebar Advertisement Slot (300x250) */}
          <div className="pt-2">
            <AdSlot position="sidebar" fallbackSize="300x250" label="ताजा अपडेट साइडबार" />
          </div>
        </div>
      </section>

      {/* Middle Full-Width Banner Advertisement Slot (970x100) */}
      <section className="w-full">
        <AdSlot position="homepage_middle" fallbackSize="970x100" label="गृहपृष्ठ मुख्य ब्यानर" />
      </section>

      {/* 2. Main News Grid & Trending Sidebar */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: News Grid (8 Cols) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Recent Articles */}
          <div className="space-y-6">
            <div className="border-b-2 border-slate-900 pb-2 flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-xs" />
                मुख्य समाचारहरू
              </h2>
              <span className="text-xs text-slate-500">ताजा संकलन</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {latest.map((article: any) => (
                <Link 
                  key={article.id} 
                  to={`/news/${article.slug}`} 
                  className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                    <img 
                      src={article.featuredImageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80"} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {article.category && (
                        <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider block mb-1">
                          {article.category.name}
                        </span>
                      )}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700 leading-snug mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100">
                      <span>{article.author?.name || "नयाँदृष्टि"}</span>
                      <span>{article.publishedAt ? format(new Date(article.publishedAt), 'MMM d, yyyy') : ''}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Politics Row */}
          {politicsArticles.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="border-b-2 border-red-600 pb-2 flex items-center justify-between">
                <h3 className="text-lg font-black font-serif text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-red-600 rounded-xs" />
                  राजनीति (Politics)
                </h3>
                <Link to="/category/politics" className="text-xs text-red-700 font-bold hover:underline flex items-center gap-1">
                  सबै हेर्नुहोस् <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {politicsArticles.map(art => (
                  <Link 
                    key={art.id} 
                    to={`/news/${art.slug}`}
                    className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs hover:border-red-400 flex gap-3 group"
                  >
                    <div className="w-20 h-16 rounded overflow-hidden bg-slate-100 shrink-0">
                      <img src={art.featuredImageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-700 line-clamp-2 leading-snug">
                        {art.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {art.publishedAt ? format(new Date(art.publishedAt), 'MMM d') : ''}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Economy Row */}
          {economyArticles.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="border-b-2 border-emerald-600 pb-2 flex items-center justify-between">
                <h3 className="text-lg font-black font-serif text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-600 rounded-xs" />
                  अर्थतन्त्र (Economy & Business)
                </h3>
                <Link to="/category/economy" className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1">
                  सबै हेर्नुहोस् <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {economyArticles.map(art => (
                  <Link 
                    key={art.id} 
                    to={`/news/${art.slug}`}
                    className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs hover:border-emerald-400 flex gap-3 group"
                  >
                    <div className="w-20 h-16 rounded overflow-hidden bg-slate-100 shrink-0">
                      <img src={art.featuredImageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 line-clamp-2 leading-snug">
                        {art.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {art.publishedAt ? format(new Date(art.publishedAt), 'MMM d') : ''}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Category In-Feed Advertisement Slot */}
          <div className="pt-4">
            <AdSlot position="homepage_category_divider" fallbackSize="728x90" label="समाचार विधा ब्यानर" />
          </div>
        </div>

        {/* Right: Trending List (4 Cols) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-slate-950 text-white p-6 rounded-2xl shadow-md sticky top-24 border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <h2 className="text-base font-bold uppercase tracking-wider flex items-center gap-2 text-white">
                <Flame className="w-5 h-5 text-amber-500" />
                ट्रेन्डिङ / सर्वाधिक पढिएका
              </h2>
              <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold">TOP</span>
            </div>

            <div className="space-y-4">
              {latest.map((article: any, idx: number) => (
                <Link 
                  key={article.id} 
                  to={`/news/${article.slug}`} 
                  className="flex items-start gap-3 group cursor-pointer pb-4 border-b border-slate-900 last:border-none last:pb-0"
                >
                  <span className="text-2xl font-black text-slate-600 group-hover:text-amber-500 transition-colors w-7 shrink-0 font-serif">
                    {toNepaliNumber(idx + 1)}
                  </span>
                  <div className="space-y-1">
                    {article.category && (
                      <span className="text-[10px] text-amber-400 font-semibold block uppercase">
                        {article.category.name}
                      </span>
                    )}
                    <h3 className="text-xs font-bold text-slate-200 group-hover:text-white leading-snug">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            {/* Newsletter Subscription Box */}
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase">दैनिक न्युजलेटर</h4>
              <p className="text-[11px] text-slate-400">
                दिनभरिका मुख्य समाचार बिहानै तपाईंको मोबाइलमा पाउनुहोस्।
              </p>
              <div className="flex gap-1.5">
                <input 
                  type="email" 
                  placeholder="तपाईंको इमेल..." 
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-red-600"
                />
                <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                  Join
                </button>
              </div>
            </div>

            {/* Sidebar Skyscraper Advertisement Slot (300x600) */}
            <div className="pt-2">
              <AdSlot position="sidebar_bottom" fallbackSize="300x600" label="साइडबार स्काइस्क्र्यापर" />
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
