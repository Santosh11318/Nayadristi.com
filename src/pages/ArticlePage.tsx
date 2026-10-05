import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { 
  Clock, User, Share2, Facebook, MessageCircle, Twitter, 
  Copy, Check, MessageSquare, ChevronRight, Flame, ZoomIn, ZoomOut, RotateCcw, Send, AlertCircle
} from "lucide-react";
import { getNepaliDate } from "../lib/nepaliDate";
import AdSlot from "../components/AdSlot";

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<any[]>([]);
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Font Size control (0 = normal, 1 = large, 2 = extra large)
  const [fontSizeLevel, setFontSizeLevel] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Comment Form state
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    setLoading(true);
    setCommentSuccess(false);
    setCommentError("");

    fetch(`/api/articles`)
      .then(res => res.json())
      .then(all => {
        if (!Array.isArray(all)) return;
        const current = all.find((a: any) => a.slug === slug);
        setArticle(current);

        if (current) {
          // Fetch comments
          fetch(`/api/articles/${current.id}/comments`)
            .then(res => res.json())
            .then(data => {
              if (Array.isArray(data)) setCommentsList(data);
            })
            .catch(console.error);

          // Related news from same category
          const related = all
            .filter((a: any) => a.id !== current.id && a.categoryId === current.categoryId)
            .slice(0, 3);
          setRelatedArticles(related.length > 0 ? related : all.filter(a => a.id !== current.id).slice(0, 3));
        }

        setTrendingArticles(all.slice(0, 6));
        setLoading(false);
      })
      .catch(console.error);
  }, [slug]);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !article) return;
    setSubmittingComment(true);
    setCommentError("");
    setCommentSuccess(false);
    try {
      const res = await fetch(`/api/articles/${article.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: commentName,
          email: commentEmail,
          content: commentContent,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "कमेन्ट पोस्ट हुन सकेन");
      }
      setCommentsList([data, ...commentsList]);
      setCommentContent("");
      setCommentSuccess(true);
    } catch (err: any) {
      setCommentError(err.message || "कमेन्ट पठाउन सकिएन");
    } finally {
      setSubmittingComment(false);
    }
  };

  // Font size classes
  const fontSizes = [
    "text-base sm:text-lg leading-relaxed sm:leading-loose",
    "text-lg sm:text-xl leading-relaxed sm:leading-loose",
    "text-xl sm:text-2xl leading-relaxed sm:leading-loose",
  ];

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent mb-3" />
        <p className="text-slate-500 text-sm">समाचार खुल्दैछ...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="py-20 text-center bg-white rounded-xl border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">माफ गर्नुहोस्, समाचार फेला परेन</h2>
        <p className="text-sm text-slate-500 mb-6">तपाईंले खोज्नुभएको समाचार हटाइएको वा लिंक परिवर्तन भएको हुन सक्छ।</p>
        <Link to="/" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold">
          गृहपृष्ठमा जानुहोस्
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
        <Link to="/" className="hover:text-red-700">गृहपृष्ठ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        {article.category && (
          <>
            <Link to={`/category/${article.category.slug || article.category.name}`} className="text-red-700 font-bold hover:underline">
              {article.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </>
        )}
        <span className="text-slate-700 truncate max-w-xs">{article.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Article Content (8 Cols) */}
        <article className="lg:col-span-8 space-y-6">
          
          {/* Article Header */}
          <div className="space-y-4">
            {article.category && (
              <Link 
                to={`/category/${article.category.slug || article.category.name}`}
                className="inline-block bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-3 py-1 rounded"
              >
                {article.category.name}
              </Link>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-slate-900 leading-[1.2]">
              {article.title}
            </h1>

            {article.summary && (
              <p className="text-lg sm:text-xl font-medium text-slate-600 leading-relaxed font-serif border-l-4 border-red-600 pl-4 py-1">
                {article.summary}
              </p>
            )}

            {/* Author & Timestamp Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-slate-200 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <img 
                  src={article.author?.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} 
                  alt="" 
                  className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0" 
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {article.author?.name || "नयाँदृष्टि डेस्क"}
                  </h4>
                  <p className="text-[11px] text-red-600 font-medium">
                    {article.author?.designation || "सम्पादकीय टोली"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {article.publishedAt ? format(new Date(article.publishedAt), "MMMM d, yyyy h:mm a") : "हालै"}
                  </p>
                </div>
              </div>

              {/* Text Size Resizer */}
              <div className="flex items-center gap-1.5 self-start sm:self-center bg-slate-100 p-1 rounded-lg">
                <span className="text-[11px] font-semibold text-slate-600 px-2">अक्षर:</span>
                <button
                  onClick={() => setFontSizeLevel(Math.max(0, fontSizeLevel - 1))}
                  className="px-2 py-1 bg-white hover:bg-slate-200 rounded text-xs font-bold shadow-xs cursor-pointer"
                  title="अक्षर सानो पार्नुहोस्"
                >
                  अ-
                </button>
                <button
                  onClick={() => setFontSizeLevel(0)}
                  className="px-2 py-1 bg-white hover:bg-slate-200 rounded text-xs font-bold shadow-xs cursor-pointer"
                  title="सामान्य"
                >
                  अ
                </button>
                <button
                  onClick={() => setFontSizeLevel(Math.min(2, fontSizeLevel + 1))}
                  className="px-2 py-1 bg-white hover:bg-slate-200 rounded text-xs font-bold shadow-xs cursor-pointer"
                  title="अक्षर ठूलो पार्नुहोस्"
                >
                  अ+
                </button>
              </div>
            </div>

            {/* Social Share Bar */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5" /> सेयर:
              </span>
              
              {/* Facebook */}
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded text-xs font-bold transition-colors"
              >
                <Facebook className="w-3.5 h-3.5 fill-white" /> Facebook
              </a>

              {/* WhatsApp */}
              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + " " + currentUrl)}`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded text-xs font-bold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </a>

              {/* Twitter / X */}
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title)}`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded text-xs font-bold transition-colors"
              >
                <Twitter className="w-3.5 h-3.5 fill-white" /> X
              </a>

              {/* Copy Link */}
              <button 
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-bold transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? "लिंक कपि भयो!" : "लिंक कपि"}
              </button>
            </div>

            {/* Article Top Banner Advertisement Slot */}
            <div className="pt-2">
              <AdSlot position="article_top" fallbackSize="728x90" label="समाचार शीर्ष ब्यानर" />
            </div>
          </div>

          {/* Featured Image */}
          {article.featuredImageUrl && (
            <div className="rounded-xl overflow-hidden shadow-xs border border-slate-200 bg-slate-100">
              <img 
                src={article.featuredImageUrl} 
                alt={article.title} 
                className="w-full max-h-[500px] object-cover" 
              />
              {article.imageCaption && (
                <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 italic">
                  तस्विर: {article.imageCaption}
                </div>
              )}
            </div>
          )}

          {/* Article Main Body */}
          <div 
            className={`font-serif text-slate-900 ${fontSizes[fontSizeLevel]} space-y-4`}
            dangerouslySetInnerHTML={{ __html: article.content || `<p>${article.summary || ""}</p>` }}
          />

          {/* In-Article Mid Banner Advertisement Slot */}
          <div className="py-2">
            <AdSlot position="article_middle" fallbackSize="728x90" label="इन-आर्टिकल ब्यानर" />
          </div>

          {/* Bottom Social Share */}
          <div className="p-5 bg-slate-100 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
            <span className="text-sm font-bold text-slate-800">समाचार उपयोगी लाग्यो भने आफ्ना साथीभाइलाई सेयर गर्नुहोस्:</span>
            <div className="flex gap-2">
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-[#1877F2] text-white rounded-full hover:opacity-90"
              >
                <Facebook className="w-4 h-4 fill-white" />
              </a>
              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + " " + currentUrl)}`} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-[#25D366] text-white rounded-full hover:opacity-90"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title)}`} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-black text-white rounded-full hover:opacity-90"
              >
                <Twitter className="w-4 h-4 fill-white" />
              </a>
            </div>
          </div>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <div className="pt-8 border-t-2 border-slate-200 space-y-4">
              <h3 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-xs" />
                सम्बन्धित समाचारहरू (Related Stories)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedArticles.map((rel: any) => (
                  <Link 
                    key={rel.id} 
                    to={`/news/${rel.slug}`} 
                    className="group bg-white rounded-lg overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="aspect-video w-full overflow-hidden bg-slate-100">
                      <img 
                        src={rel.featuredImageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&auto=format&fit=crop&q=80"} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-700 leading-snug line-clamp-2">
                        {rel.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 mt-2 block">
                        {rel.publishedAt ? format(new Date(rel.publishedAt), "MMM d") : ""}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Pre-Comments Advertisement Slot */}
          <div className="pt-6">
            <AdSlot position="article_bottom" fallbackSize="728x90" label="कमेन्ट अगाडिको ब्यानर" />
          </div>

          {/* Reader Comments Section */}
          <div className="pt-8 border-t border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-red-600" />
                पाठक प्रतिक्रियाहरू ({commentsList.length})
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-800">तपाईंको विचार व्यक्त गर्नुहोस्:</h4>
              
              {commentSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-medium">
                  धन्यवाद! तपाईंको प्रतिक्रिया सफलतापूर्वक प्रकाशित भयो।
                </div>
              )}

              {commentError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {commentError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">तपाईंको नाम (Full Name)</label>
                  <input 
                    type="text" 
                    required 
                    value={commentName} 
                    onChange={e => setCommentName(e.target.value)}
                    placeholder="उदा. राम बहादुर थापा" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">इमेल ठेगाना (Email - गोप्य रहनेछ)</label>
                  <input 
                    type="email" 
                    value={commentEmail} 
                    onChange={e => setCommentEmail(e.target.value)}
                    placeholder="example@gmail.com" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">प्रतिक्रिया (Comment Message)</label>
                <textarea 
                  required 
                  rows={3} 
                  value={commentContent}
                  onChange={e => setCommentContent(e.target.value)}
                  placeholder="यस समाचारबारे आफ्नो शिष्ट र मर्यादित विचार यहाँ लेख्नुहोस्..." 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <button 
                type="submit" 
                disabled={submittingComment}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {submittingComment ? "पठाउँदैछ..." : "प्रतिक्रिया पठाउनुहोस्"}
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {commentsList.map((c: any) => (
                <div key={c.id} className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-xs">
                      {c.user?.name || "नयाँदृष्टि पाठक"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {c.createdAt ? format(new Date(c.createdAt), "MMM d, yyyy h:mm a") : "भर्खरै"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {c.content}
                  </p>
                </div>
              ))}

              {commentsList.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-400">
                  अहिलेसम्म कुनै प्रतिक्रिया आएको छैन। पहिलो प्रतिक्रिया तपाईंले दिनुहोस्!
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Sidebar: Trending & Latest (4 Cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Sidebar Top Ad Slot (300x250) */}
          <AdSlot position="article_sidebar" fallbackSize="300x250" label="साइडबार विज्ञापन" />

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-1.5 mb-4">
              <Flame className="w-4 h-4 text-red-600" />
              ताजा तथा ट्रेन्डिङ समाचार
            </h3>
            <div className="divide-y divide-slate-100">
              {trendingArticles.map((article, idx) => (
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

          {/* Sidebar Skyscraper Bottom Ad Slot (300x600) */}
          <div className="sticky top-24">
            <AdSlot position="article_sidebar_bottom" fallbackSize="300x600" label="साइडबार स्काइस्क्र्यापर" />
          </div>
        </aside>
      </div>
    </div>
  );
}
