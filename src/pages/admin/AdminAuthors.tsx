import React, { useEffect, useState } from "react";
import { Users, Plus, Trash2, UserCheck } from "lucide-react";

export default function AdminAuthors() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const res = await fetch("/api/authors");
      const data = await res.json();
      setAuthors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, designation, bio, photoUrl })
      });
      const newAuthor = await res.json();
      setAuthors([newAuthor, ...authors]);
      setName("");
      setDesignation("");
      setBio("");
      setPhotoUrl("");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this author?")) return;
    try {
      await fetch(`/api/authors/${id}`, { method: "DELETE" });
      setAuthors(authors.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-red-600" />
            पत्रकार तथा लेखकहरू (Authors & Journalists)
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading authors...</div>
          ) : (
            <div className="divide-y divide-slate-200">
              {authors.map((author) => (
                <div key={author.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <img 
                      src={author.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} 
                      alt={author.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200" 
                    />
                    <div>
                      <h4 className="font-semibold text-slate-900">{author.name}</h4>
                      <p className="text-xs text-red-600 font-medium">{author.designation || "संवाददाता"}</p>
                      {author.bio && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{author.bio}</p>}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(author.id)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {authors.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  अहिलेसम्म कुनै लेखक थपिएको छैन। दायाँबाट नयाँ लेखक थप्नुहोस्।
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-red-600" />
            नयाँ लेखक थप्नुहोस् (Add Author)
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">नाम (Full Name)</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="उदा. सन्तोष घर्ती मगर"
                className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:ring-1 focus:ring-red-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">पद / जिम्मेवारी (Designation)</label>
              <input
                type="text"
                value={designation}
                onChange={e => setDesignation(e.target.value)}
                placeholder="उदा. मुख्य संवाददाता / सम्पादक"
                className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:ring-1 focus:ring-red-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">फोटो लिङ्क (Photo URL)</label>
              <input
                type="url"
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:ring-1 focus:ring-red-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">छोटो परिचय (Bio)</label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="पत्रकारिता क्षेत्रमा १० वर्षको अनुभव..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:ring-1 focus:ring-red-500 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-md font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {saving ? "सुरक्षित हुँदैछ..." : "लेखक थप्नुहोस् (Save)"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
