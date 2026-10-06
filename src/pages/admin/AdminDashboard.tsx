import { FileText, Users, FolderTree, Eye, PlusCircle, FolderPlus, UserPlus, Image as ImageIcon, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import { getPortalStats } from "../../lib/firestoreService";

export default function AdminDashboard() {
  const { currentUser, token } = useAuth();
  const [data, setData] = useState({
    articles: 0,
    users: 0,
    authors: 0,
    categories: 0
  });

  useEffect(() => {
    document.title = "ड्यासबोर्ड (Admin Dashboard) | नयाँदृष्टि CMS";
    const fetchStats = async () => {
      try {
        const fbStats = await getPortalStats();
        if (fbStats && (fbStats.articles > 0 || fbStats.categories > 0)) {
          setData(fbStats);
          return;
        }

        const activeToken = (await currentUser?.getIdToken?.()) || token;
        const res = await fetch("/api/admin/stats", {
          headers: {
            "Authorization": `Bearer ${activeToken}`
          }
        });
        if (res.ok) {
          const stats = await res.json();
          setData(stats);
        } else if (fbStats) {
          setData(fbStats);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    if (currentUser) fetchStats();
  }, [currentUser, token]);

  const stats = [
    { name: "कुल समाचार (Total News)", value: data.articles, icon: FileText, color: "text-blue-600", bg: "bg-blue-100", link: "/admin/news" },
    { name: "वर्गहरू (Categories)", value: data.categories, icon: FolderTree, color: "text-emerald-600", bg: "bg-emerald-100", link: "/admin/categories" },
    { name: "पत्रकार / लेखकहरू (Authors)", value: data.authors, icon: Users, color: "text-purple-600", bg: "bg-purple-100", link: "/admin/authors" },
    { name: "प्रयोगकर्ताहरू (Total Users)", value: data.users || 1, icon: Eye, color: "text-orange-600", bg: "bg-orange-100", link: "/admin/settings" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-red-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-red-600 text-white font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              नयाँदृष्टि CMS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-serif">
            स्वागत छ, {currentUser?.name || "सन्तोष जी"}!
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            नयाँदृष्टि डिजिटल समाचार पोर्टलको सम्पूर्ण व्यवस्थापन यहाँबाट गर्नुहोस्।
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/news/new"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            नयाँ समाचार लेख्नुहोस्
          </Link>
          <Link
            to="/"
            target="_blank"
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg text-sm font-semibold border border-white/20 transition-colors"
          >
            लाइभ पोर्टल हेर्नुहोस्
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link 
            key={stat.name} 
            to={stat.link}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center hover:shadow-md transition-shadow group"
          >
            <div className={`p-3.5 rounded-xl ${stat.bg} ${stat.color} mr-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.name}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-4">द्रुत कार्यहरू (Quick Actions)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/admin/news/new"
            className="p-4 rounded-lg border border-slate-200 hover:border-red-500 hover:bg-red-50/50 flex flex-col items-center text-center group transition-colors"
          >
            <PlusCircle className="w-8 h-8 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">समाचार थप्नुहोस्</span>
            <span className="text-[11px] text-slate-500 mt-0.5">नयाँ लेख प्रकाशन</span>
          </Link>

          <Link
            to="/admin/categories"
            className="p-4 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex flex-col items-center text-center group transition-colors"
          >
            <FolderPlus className="w-8 h-8 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">वर्ग थप्नुहोस्</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Category Management</span>
          </Link>

          <Link
            to="/admin/authors"
            className="p-4 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 flex flex-col items-center text-center group transition-colors"
          >
            <UserPlus className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">लेखक थप्नुहोस्</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Author & Journalists</span>
          </Link>

          <Link
            to="/admin/media"
            className="p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center text-center group transition-colors"
          >
            <ImageIcon className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">मिडिया ग्यालरी</span>
            <span className="text-[11px] text-slate-500 mt-0.5">तस्विर र ब्यानरहरू</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
