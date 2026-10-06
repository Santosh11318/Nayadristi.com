import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import slugify from "slugify";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { 
  createArticle, updateArticle, getCategories, getAuthors, getArticleBySlug 
} from "../../lib/firestoreService";

export default function AdminNewsEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    featuredImageUrl: "",
    imageCaption: "",
    categoryId: "",
    authorId: "",
    status: "published",
    isFeatured: false,
    isBreaking: false,
  });

  useEffect(() => {
    async function loadMeta() {
      try {
        const [cats, auths] = await Promise.all([
          getCategories(),
          getAuthors()
        ]);

        if (cats && cats.length > 0) {
          setCategories(cats);
          if (!id && !formData.categoryId) {
            setFormData(prev => ({ ...prev, categoryId: cats[0].id.toString() }));
          }
        } else {
          fetch("/api/categories").then(res => res.json()).then(data => {
            if (Array.isArray(data)) setCategories(data);
          }).catch(() => {});
        }

        if (auths && auths.length > 0) {
          setAuthors(auths);
        } else {
          fetch("/api/authors").then(res => res.json()).then(data => {
            if (Array.isArray(data)) setAuthors(data);
          }).catch(() => {});
        }
      } catch (err) {
        console.error("Error loading editor meta:", err);
      }
    }

    loadMeta();

    if (id) {
      // Try fetching by id/slug from Firestore or API
      getArticleBySlug(id).then(data => {
        if (data) {
          setFormData({
            title: data.title || "",
            slug: data.slug || "",
            summary: data.summary || "",
            content: data.content || "",
            featuredImageUrl: data.featuredImageUrl || "",
            imageCaption: data.imageCaption || "",
            categoryId: data.categoryId?.toString() || "",
            authorId: data.authorId?.toString() || "",
            status: data.status || "published",
            isFeatured: Boolean(data.isFeatured),
            isBreaking: Boolean(data.isBreaking),
          });
          setLoading(false);
        } else {
          fetch(`/api/articles/${id}`)
            .then(res => res.json())
            .then(apiData => {
              if (apiData) {
                setFormData({
                  title: apiData.title || "",
                  slug: apiData.slug || "",
                  summary: apiData.summary || "",
                  content: apiData.content || "",
                  featuredImageUrl: apiData.featuredImageUrl || "",
                  imageCaption: apiData.imageCaption || "",
                  categoryId: apiData.categoryId?.toString() || "",
                  authorId: apiData.authorId?.toString() || "",
                  status: apiData.status || "published",
                  isFeatured: Boolean(apiData.isFeatured),
                  isBreaking: Boolean(apiData.isBreaking),
                });
              }
              setLoading(false);
            })
            .catch(() => setLoading(false));
        }
      });
    }
  }, [id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!id) {
      setFormData({ 
        ...formData, 
        title, 
        slug: slugify(title, { lower: true, strict: true }) || `news-${Date.now()}` 
      });
    } else {
      setFormData({ ...formData, title });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    try {
      const selectedCategory = categories.find(c => String(c.id) === String(formData.categoryId));
      const selectedAuthor = authors.find(a => String(a.id) === String(formData.authorId));

      const payload: any = {
        ...formData,
        category: selectedCategory ? { id: selectedCategory.id, name: selectedCategory.name, slug: selectedCategory.slug } : undefined,
        author: selectedAuthor ? { id: selectedAuthor.id, name: selectedAuthor.name, designation: selectedAuthor.designation } : undefined,
      };

      // 1. Direct Save to Google Firestore
      if (id) {
        await updateArticle(id, payload);
      } else {
        await createArticle(payload);
      }

      // 2. Also sync with server API if running
      try {
        const url = id ? `/api/articles/${id}` : "/api/articles";
        const method = id ? "PUT" : "POST";
        await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
            authorId: formData.authorId ? parseInt(formData.authorId) : null,
          })
        });
      } catch (e) {
        // Ignored if purely static on GitHub Pages
      }

      navigate("/admin/news");
    } catch (err: any) {
      console.error(err);
      setErrorMsg("त्रुटि भयो: " + (err.message || "Could not save article"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">लोड हुँदैछ...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/news")}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-slate-900 font-serif">
            {id ? "समाचार सम्पादन गर्नुहोस् (Edit News)" : "नयाँ समाचार लेख्नुहोस् (Create News)"}
          </h2>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-slate-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              समाचारको मुख्य शीर्षक (Title) *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="उदा. प्रधानमन्त्रीद्वारा राष्ट्रिय गौरवका आयोजनाहरूको स्थलगत अनुगमन"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-base font-semibold outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              URL स्लग (Slug) *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={e => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-red-600 bg-slate-50 font-mono"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              विधा (Category) *
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-red-600 bg-white"
            >
              <option value="">विधा छान्नुहोस् (Select)</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              लेखक / संवाददाता (Author)
            </label>
            <select
              value={formData.authorId}
              onChange={e => setFormData({ ...formData, authorId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-red-600 bg-white"
            >
              <option value="">नयाँदृष्टि डेस्क (Default Desk)</option>
              {authors.map(author => (
                <option key={author.id} value={author.id}>{author.name} ({author.designation || "संवाददाता"})</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              प्रकाशन स्थिति (Publication Status)
            </label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-red-600 bg-white font-medium"
            >
              <option value="published">तुरुन्तै प्रकाशित गर्नुहोस् (Published)</option>
              <option value="draft">मस्यौदामा राख्नुहोस् (Draft)</option>
            </select>
          </div>

          {/* Summary */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              छोटो सारांश (Summary / Lead Paragraph) *
            </label>
            <textarea
              required
              rows={2}
              value={formData.summary}
              onChange={e => setFormData({ ...formData, summary: e.target.value })}
              placeholder="समाचारको मुख्य सार २-३ वाक्यमा लेख्नुहोस्..."
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              मुख्य तस्विर लिङ्क (Featured Image URL)
            </label>
            <input
              type="url"
              value={formData.featuredImageUrl}
              onChange={e => setFormData({ ...formData, featuredImageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>

          {/* Image Caption */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              तस्विर क्याप्सन / स्रोत (Image Caption & Source)
            </label>
            <input
              type="text"
              value={formData.imageCaption}
              onChange={e => setFormData({ ...formData, imageCaption: e.target.value })}
              placeholder="उदा. रासस / नयाँदृष्टि"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>

          {/* Content (HTML) */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                समाचारको विस्तृत विवरण (Full Content) *
              </label>
              <span className="text-[11px] text-slate-400">HTML वा सामान्य अनुच्छेद लेख्न सक्नुहुन्छ</span>
            </div>
            <textarea
              required
              rows={12}
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3.5 py-3 border border-slate-300 rounded-lg text-sm font-sans outline-none focus:ring-1 focus:ring-red-600 leading-relaxed"
              placeholder="<p>काठमाडौं । प्रधानमन्त्रीले आज...</p><p>अनुगमनका क्रममा उहाँले समयमै काम सम्पन्न गर्न निर्देशन दिनुभयो।</p>"
            />
          </div>

          {/* Flags: Featured & Breaking */}
          <div className="md:col-span-2 flex flex-wrap gap-6 pt-2">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="h-4 w-4 text-red-600 focus:ring-red-600 border-slate-300 rounded"
              />
              <span className="text-xs font-bold text-slate-800">
                ★ गृहपृष्ठ मुख्य विशेष समाचार (Lead Featured News)
              </span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBreaking}
                onChange={e => setFormData({ ...formData, isBreaking: e.target.checked })}
                className="h-4 w-4 text-red-600 focus:ring-red-600 border-slate-300 rounded"
              />
              <span className="text-xs font-bold text-red-700">
                🔴 ताजा ब्रेकिङ न्युज टिकरमा चलाउनुहोस् (Breaking News Ticker)
              </span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-6 border-t border-slate-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/admin/news")}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            रद्द गर्नुहोस्
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? "सुरक्षित हुँदैछ..." : id ? "अपडेट गर्नुहोस् (Update)" : "समाचार प्रकाशित गर्नुहोस् (Publish)"}
          </button>
        </div>
      </form>
    </div>
  );
}
