import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Edit, Plus, Trash2, ExternalLink, Flame, Star, Newspaper } from "lucide-react";

export default function AdminNewsList() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/admin/articles");
      const data = await res.json();
      if (Array.isArray(data)) setArticles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("के तपाईं यो समाचार हटाउन निश्चित हुनुहुन्छ?")) return;
    
    try {
      await fetch(`/api/articles/${id}`, { method: "DELETE" });
      setArticles(articles.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-2xl font-black font-serif text-slate-900 flex items-center gap-2.5">
            <Newspaper className="w-7 h-7 text-red-600" />
            समाचार सूची तथा व्यवस्थापन (News Articles)
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            यहाँबाट नयाँ समाचार प्रकाशित गर्न, सम्पादन गर्न तथा पोर्टलमा तत्काल हेर्न सक्नुहुन्छ।
          </p>
        </div>

        <Link 
          to="/admin/news/new" 
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          नयाँ समाचार लेख्नुहोस् (Create News)
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent mb-2" />
            <p className="text-xs">समाचारहरू लोड हुँदैछन्...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200 font-bold">
                  <th className="p-4">समाचार शीर्षक (Title)</th>
                  <th className="p-4">विधा (Category)</th>
                  <th className="p-4">स्थिति (Status)</th>
                  <th className="p-4">प्रकाशन मिति</th>
                  <th className="p-4 text-right">कार्यहरू (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {article.featuredImageUrl && (
                          <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            <img src={article.featuredImageUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 text-sm line-clamp-1">
                            {article.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {article.isFeatured && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> मुख्य विशेष
                              </span>
                            )}
                            {article.isBreaking && (
                              <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <Flame className="w-2.5 h-2.5 fill-red-600 text-red-600" /> ब्रेकिङ
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-mono">
                              /{article.slug}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 text-xs font-semibold whitespace-nowrap">
                      {article.category?.name || "सामान्य"}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-[11px] font-bold rounded-full ${
                        article.status === 'published' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {article.status === 'published' ? 'प्रकाशित (Live)' : 'मस्यौदा (Draft)'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-xs whitespace-nowrap">
                      {article.publishedAt ? format(new Date(article.publishedAt), 'MMM d, yyyy h:mm a') : 'अप्रकासित'}
                    </td>
                    <td className="p-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Live Preview Button */}
                        <Link 
                          to={`/news/${article.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="पोर्टलमा प्रत्यक्ष हेर्नुहोस् (Live Preview)"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        {/* Edit Button */}
                        <Link 
                          to={`/admin/news/${article.id}`}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="सम्पादन गर्नुहोस् (Edit)"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {/* Delete Button */}
                        <button 
                          onClick={() => handleDelete(article.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="हटाउनुहोस् (Delete)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {articles.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500 text-xs">
                      कुनै समाचार भेटिएन। "नयाँ समाचार लेख्नुहोस्" बटनमा क्लिक गरेर समाचार थप्नुहोस्।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
