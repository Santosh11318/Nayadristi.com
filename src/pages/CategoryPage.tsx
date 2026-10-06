import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { Clock, User, ChevronRight, Flame, ArrowLeft } from "lucide-react";
import AdSlot from "../components/AdSlot";
import { getPublishedArticles, getCategories } from "../lib/firestoreService";

export default function CategoryPage() {
  const { slug } = useParams();
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [fbArticles, fbCats] = await Promise.all([
          getPublishedArticles(),
          getCategories()
        ]);

        if (fbArticles && fbArticles.length > 0) {
          setArticles(fbArticles);
        } else {
          const res = await fetch("/api/articles").then(r => r.json()).catch(() => []);
          if (Array.isArray(res)) setArticles(res);
        }

        if (fbCats && fbCats.length > 0) {
          setCategories(fbCats);
        } else {
          const res = await fetch("/api/categories").then(r => r.json()).catch(() => []);
          if (Array.isArray(res)) setCategories(res);
        }
      } catch (err) {
        console.error("Category page load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  // Find active category
  const decodedSlug = decodeURIComponent(slug || "").toLowerCase();
  const currentCategory = categories.find(
    (c) =>
      c.slug?.toLowerCase() === decodedSlug ||
      c.name?.toLowerCase() === decodedSlug ||
      (decodedSlug === "national" && c.name === "राष्ट्रिय") ||
      (decodedSlug === "politics" && c.name === "राजनीति") ||
      (decodedSlug === "economy" && c.name === "अर्थतन्त्र") ||
      (decodedSlug === "sports" && c.name === "खेलकुद") ||
      (decodedSlug === "society" && c.name === "समाज")
  );

  const categoryName = currentCategory?.name || slug;

  useEffect(() => {
    if (categoryName) {
      document.title = `${categoryName} | नयाँदृष्टि`;
    }
  }, [categoryName]);

  // Filter articles belonging to this category
  const categoryArticles = articles.filter(a => {
    if (!a.category) return false;
    const catSlug = a.category.slug?.toLowerCase();
    const catName = a.category.name?.toLowerCase();
    return (
      catSlug === decodedSlug ||
      catName === decodedSlug ||
      (currentCategory && a.categoryId === currentCategory.id) ||
      (decodedSlug === "national" && catName === "राष्ट्रिय") ||
      (decodedSlug === "politics" && catName === "राजनीति") ||
      (decodedSlug === "economy" && catName === "अर्थतन्त्र") ||
      (decodedSlug === "sports" && catName === "खेलकुद") ||
      (decodedSlug === "society" && catName === "समाज")
    );
  });

  const leadStory = categoryArticles[0];
  const otherStories = categoryArticles.slice(1);
  const trendingNews = articles.slice(0, 6);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent mb-3" />
        <p className="text-slate-500 text-sm">समाचार लोड हुँदैछ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Header */}
      <div className="border-b-2 border-[#B22222] pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xs text-slate-500 hover:text-red-700">गृहपृष्ठ</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            {categoryName}
          </h1>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {categoryArticles.length} समाचार फेला पर्यो
        </span>
      </div>

      {/* Category Top Banner */}
      <AdSlot position="category_top" fallbackSize="728x90" label={`${categoryName} शीर्ष ब्यानर`} />

      {categoryArticles.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <p className="text-lg font-bold text-slate-700 mb-2">
            '{categoryName}' विधामा हाल कुनै समाचार प्रकाशित भएको छैन।
          </p>
          <p className="text-xs text-slate-500 mb-6">
            हाम्रा सम्पादकहरूले यस विधामा छिट्टै नयाँ समाचारहरू थप्नेछन्।
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            गृहपृष्ठका ताजा समाचार हेर्नुहोस्
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Category Articles */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Lead Story */}
            {leadStory && (
              <Link 
                to={`/news/${leadStory.slug}`} 
                className="block group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  <img 
                    src={leadStory.featuredImageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=80"} 
                    alt={leadStory.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 group-hover:text-red-700 transition-colors leading-tight mb-3">
                    {leadStory.title}
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {leadStory.summary}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-red-600" />
                      {leadStory.author?.name || "नयाँदृष्टि संवाददाता"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {leadStory.publishedAt ? format(new Date(leadStory.publishedAt), "MMMM d, yyyy") : "हालै"}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Other Stories Grid */}
            {otherStories.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                {otherStories.map(story => (
                  <Link 
                    key={story.id} 
                    to={`/news/${story.slug}`}
                    className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="aspect-video w-full overflow-hidden bg-slate-100">
                      <img 
                        src={story.featuredImageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80"} 
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug mb-2">
                          {story.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                          {story.summary}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100">
                        <span>{story.author?.name || "नयाँदृष्टि"}</span>
                        <span>{story.publishedAt ? format(new Date(story.publishedAt), "MMM d") : ""}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Trending & Other Categories Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-1.5 mb-4">
                <Flame className="w-4 h-4 text-red-600" />
                ट्रेन्डिङ / ताजा समाचार
              </h3>
              <div className="divide-y divide-slate-100">
                {trendingNews.map((article, idx) => (
                  <Link 
                    key={article.id} 
                    to={`/news/${article.slug}`}
                    className="py-3 flex items-start gap-3 group first:pt-0 last:pb-0"
                  >
                    <span className="text-xl font-black text-slate-300 group-hover:text-red-600 w-5 shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      {article.category && (
                        <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider block mb-0.5">
                          {article.category.name}
                        </span>
                      )}
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-red-700 leading-snug line-clamp-2">
                        {article.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Other Categories Widget */}
            <div className="bg-slate-900 text-white p-5 rounded-xl">
              <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-3 pb-2 border-b border-slate-800">
                अन्य विधाहरू
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <Link 
                    key={c.id} 
                    to={`/category/${c.slug || c.name}`}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-red-600 text-slate-200 hover:text-white rounded text-xs transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Category Sidebar Banners */}
            <AdSlot position="sidebar" fallbackSize="300x250" label="क्याटेगोरी साइडबार" />
            <div className="sticky top-24">
              <AdSlot position="sidebar_bottom" fallbackSize="300x600" label="साइडबार स्काइस्क्र्यापर" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
