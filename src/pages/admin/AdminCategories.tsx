import React, { useEffect, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { getCategories, createCategory, deleteCategory } from "../../lib/firestoreService";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const fbCats = await getCategories();
      if (fbCats && fbCats.length > 0) {
        setCategories(fbCats);
      } else {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
      }
    } catch (err) {
      console.error(err);
      fetch("/api/categories")
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setCategories(data); })
        .catch(() => {});
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    try {
      // 1. Save directly to Firestore
      const newCat = await createCategory({ name, slug, sortOrder: categories.length + 1 });
      
      // 2. Sync to API if running
      fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug })
      }).catch(() => {});

      setCategories([...categories, newCat]);
      setName("");
      setSlug("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: any) => {
    if (!confirm("के तपाईं यो वर्ग (Category) हटाउन निश्चित हुनुहुन्छ?")) return;
    try {
      await deleteCategory(String(id));
      fetch(`/api/categories/${id}`, { method: "DELETE" }).catch(() => {});
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Categories</h2>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Slug</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-slate-200">
                    <td className="p-4 font-semibold text-slate-800">{cat.name}</td>
                    <td className="p-4 text-slate-500">{cat.slug}</td>
                    <td className="p-4 flex justify-end gap-2">
                      <button onClick={() => handleDelete(cat.id)} className="p-2 text-slate-400 hover:text-red-600">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Add Category</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-md font-medium transition-colors"
            >
              Add Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
