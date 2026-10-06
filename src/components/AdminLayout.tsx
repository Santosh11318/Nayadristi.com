import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, FolderTree, Users, Image as ImageIcon, Settings, LogOut, ExternalLink, Shield, Megaphone } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function AdminLayout() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const menuItems = [
    { name: "ड्यासबोर्ड (Dashboard)", icon: LayoutDashboard, path: "/admin" },
    { name: "समाचारहरू (News Articles)", icon: FileText, path: "/admin/news" },
    { name: "वर्गहरू (Categories)", icon: FolderTree, path: "/admin/categories" },
    { name: "पत्रकार / लेखकहरू (Authors)", icon: Users, path: "/admin/authors" },
    { name: "विज्ञापनहरू (Advertisements)", icon: Megaphone, path: "/admin/ads" },
    { name: "मिडिया ग्यालरी (Media)", icon: ImageIcon, path: "/admin/media" },
    { name: "सेटिङहरू (Settings)", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-white flex flex-col fixed inset-y-0 z-50 border-r border-slate-800">
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <Link to="/" className="text-xl font-black text-red-500 font-serif flex items-center gap-1.5">
            <span className="text-white">नयाँदृष्टि</span> CMS
          </Link>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`flex items-center px-3.5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  isActive 
                    ? "bg-red-600 text-white shadow-sm font-semibold" 
                    : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
              >
                <item.icon className={`mr-3 w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-amber-500" />
              लाइभ पोर्टल हेर्नुहोस्
            </span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Live</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-400 hover:text-white hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="mr-3 w-4 h-4 text-red-400" />
            लगआउट (Logout)
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-red-50 text-red-700 font-bold px-2.5 py-1 rounded-md border border-red-200 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-red-600" />
              एडमिन प्यानल
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-slate-800">
                {currentUser?.name || "सन्तोष घर्ती मगर"}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                {currentUser?.email || "admin@nayadristi.com"}
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-amber-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {currentUser?.name?.[0] || currentUser?.email?.[0] || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 bg-slate-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
