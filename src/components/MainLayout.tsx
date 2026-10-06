import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, Clock, Calendar, Shield, Share2, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { getNepaliDate, formatNepaliTime } from "../lib/nepaliDate";
import AdSlot from "./AdSlot";
import { getBreakingNews, getCategories } from "../lib/firestoreService";

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [breakingNews, setBreakingNews] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(formatNepaliTime());

  const navigate = useNavigate();
  const location = useLocation();

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatNepaliTime());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch breaking news & categories from Firestore / API
  useEffect(() => {
    async function fetchLayoutData() {
      try {
        const [fbBreaking, fbCats] = await Promise.all([
          getBreakingNews(),
          getCategories()
        ]);

        if (fbBreaking && fbBreaking.length > 0) {
          setBreakingNews(fbBreaking);
        } else {
          fetch("/api/breaking-news")
            .then(res => res.json())
            .then(data => { if (Array.isArray(data) && data.length > 0) setBreakingNews(data); })
            .catch(() => {});
        }

        if (fbCats && fbCats.length > 0) {
          setCategories(fbCats);
        } else {
          fetch("/api/categories")
            .then(res => res.json())
            .then(data => { if (Array.isArray(data) && data.length > 0) setCategories(data); })
            .catch(() => {});
        }
      } catch (err) {
        console.error("Layout data fetch error:", err);
      }
    }

    fetchLayoutData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const defaultCategories = [
    { name: "राष्ट्रिय", slug: "national" },
    { name: "राजनीति", slug: "politics" },
    { name: "अर्थतन्त्र", slug: "economy" },
    { name: "समाज", slug: "society" },
    { name: "शिक्षा", slug: "education" },
    { name: "स्वास्थ्य", slug: "health" },
    { name: "खेलकुद", slug: "sports" },
    { name: "मनोरञ्जन", slug: "entertainment" },
    { name: "प्रविधि", slug: "tech" },
    { name: "अन्तर्राष्ट्रिय", slug: "international" },
    { name: "विचार", slug: "opinion" },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] font-sans text-slate-900">
      {/* Top Header Bar */}
      <div className="bg-[#121212] text-slate-300 text-xs py-2 px-4 sm:px-6 border-b border-[#D4AF37]/40">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px] sm:text-xs">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="font-bold text-[#D4AF37] tracking-wider flex items-center gap-1">
              नयाँदृष्टि
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Calendar className="w-3.5 h-3.5 text-red-500" />
              {getNepaliDate()}
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3" />
              {currentTime} ({format(new Date(), "MMM d, yyyy")})
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link to="/about" className="hover:text-white transition-colors">हाम्रोबारे</Link>
            <Link to="/contact" className="hover:text-white transition-colors">सम्पर्क</Link>
            <Link to="/editorial" className="hover:text-white transition-colors">आचारसंहिता</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-4 gap-4">
            
            {/* Left: Mobile Menu Button & Brand */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-700 hover:text-red-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <Link to="/" className="flex flex-col group">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-[#B22222] font-serif leading-none group-hover:text-red-700 transition-colors">
                  नयाँदृष्टि
                </span>
                <span className="text-[11px] font-bold tracking-widest text-slate-600 uppercase leading-tight mt-1">
                  NayaDristi Digital Portal
                </span>
              </Link>

              {/* Slogan */}
              <div className="hidden md:block border-l-2 border-slate-200 pl-4 ml-2">
                <p className="text-xs font-semibold text-slate-700 leading-tight">
                  “सत्य, तथ्य र निष्पक्ष समाचारको संवाहक”
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  नेपालको अग्रणी डिजिटल समाचार पोर्टल
                </p>
              </div>
            </div>

            {/* Right: Search & Admin Link */}
            <div className="flex items-center gap-3">
              <form onSubmit={handleSearch} className="hidden sm:block relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="समाचार खोज्नुहोस्..." 
                  className="w-48 lg:w-64 bg-slate-100 border border-slate-200 rounded-full py-1.5 pl-4 pr-9 text-xs focus:ring-1 focus:ring-red-600 focus:bg-white focus:border-red-600 outline-none transition-all" 
                />
                <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-600 cursor-pointer">
                  <Search className="w-4 h-4" />
                </button>
              </form>

              <Link 
                to="/admin" 
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer shrink-0"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">एडमिन</span> लगइन
              </Link>
            </div>
          </div>

          {/* Desktop Categories Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-1 border-t border-slate-100 h-11 overflow-x-auto no-scrollbar">
            <Link 
              to="/" 
              className={`text-sm font-bold px-3 py-2 border-b-2 transition-all shrink-0 ${
                location.pathname === "/" 
                  ? "text-[#B22222] border-[#B22222]" 
                  : "text-slate-800 border-transparent hover:text-red-700 hover:border-red-600"
              }`}
            >
              गृहपृष्ठ
            </Link>

            {displayCategories.map(cat => {
              const catSlug = cat.slug || cat.name;
              const isActive = location.pathname === `/category/${catSlug}` || location.pathname === `/category/${cat.name}`;
              return (
                <Link 
                  key={cat.id || cat.slug || cat.name} 
                  to={`/category/${catSlug}`} 
                  className={`text-sm font-semibold px-3 py-2 border-b-2 transition-all shrink-0 ${
                    isActive 
                      ? "text-[#B22222] border-[#B22222] font-bold" 
                      : "text-slate-700 border-transparent hover:text-red-700 hover:border-red-600"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}

            <Link 
              to="/special" 
              className="text-sm font-bold text-amber-700 hover:text-amber-800 px-3 py-2 ml-auto shrink-0 flex items-center gap-1 border-b-2 border-transparent hover:border-amber-600"
            >
              ★ विशेष
            </Link>
          </nav>
        </div>
      </header>

      {/* Breaking News Dynamic Ticker */}
      <div className="bg-red-50 border-b border-red-100 relative overflow-hidden flex items-center px-4 sm:px-6 py-2 shadow-xs">
        <div className="bg-[#B22222] text-white font-black text-[10px] sm:text-xs uppercase px-3 py-1 rounded mr-3 z-10 whitespace-nowrap shadow-sm shrink-0 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          ताजा अपडेट
        </div>

        <div className="marquee flex whitespace-nowrap text-xs sm:text-sm font-medium text-slate-800 animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
          {breakingNews.length > 0 ? (
            breakingNews.map((item, index) => (
              <span key={item.id || index} className="inline-flex items-center">
                <Link 
                  to={`/news/${item.slug}`} 
                  className="hover:text-red-700 hover:underline mx-4 transition-colors font-semibold"
                >
                  {item.title}
                </Link>
                <span className="text-red-400 font-bold">•</span>
              </span>
            ))
          ) : (
            <>
              <span className="mx-4 font-semibold">नयाँदृष्टि डिजिटल समाचार पोर्टलमा तपाईंलाई स्वागत छ। ताजा र विश्वसनीय समाचारका लागि हामीसँगै रहनुहोस्।</span>
              <span className="text-red-400">•</span>
              <span className="mx-4 font-semibold">देशभरिका राजनीति, अर्थतन्त्र, समाज र खेलकुदका प्रत्यक्ष समाचारहरू।</span>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h3 className="text-xl font-bold font-serif text-red-500">नयाँदृष्टि</h3>
                <p className="text-[10px] text-slate-400">नेपाली डिजिटल समाचार पोर्टल</p>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <form onSubmit={handleSearch} className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="समाचार खोज्नुहोस्..." 
                  className="w-full bg-white border border-slate-300 rounded-lg py-2 pl-3 pr-9 text-xs outline-none focus:ring-1 focus:ring-red-600"
                />
                <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-600">
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Categories in Drawer */}
            <div className="flex-1 p-4 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">विधाहरू (Categories)</p>
              <Link 
                to="/" 
                className="block px-3 py-2 rounded-lg text-sm font-bold text-red-700 hover:bg-red-50"
              >
                गृहपृष्ठ
              </Link>
              {displayCategories.map(cat => (
                <Link 
                  key={cat.id || cat.slug || cat.name} 
                  to={`/category/${cat.slug || cat.name}`}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-red-700 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
              <Link 
                to="/special"
                className="block px-3 py-2 rounded-lg text-sm font-bold text-amber-700 hover:bg-amber-50 mt-2"
              >
                ★ विशेष समाचार
              </Link>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
              <Link 
                to="/admin" 
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg text-xs font-bold transition-colors"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                एडमिन प्यानल लगइन
              </Link>
              <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
                <Link to="/about" className="hover:text-slate-800">हाम्रोबारे</Link>
                <Link to="/contact" className="hover:text-slate-800">सम्पर्क</Link>
                <Link to="/editorial" className="hover:text-slate-800">नीति</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Below Breaking News Leaderboard Banner (970x90) */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-3">
        <AdSlot position="below_breaking" fallbackSize="970x90" label="शीर्ष मुख्य ब्यानर" />
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6">
        <Outlet />
      </main>

      {/* Pre-Footer Leaderboard Banner (970x90) */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-4">
        <AdSlot position="footer" fallbackSize="970x90" label="फुटर विज्ञापन ब्यानर" />
      </div>

      {/* Portal Footer */}
      <footer className="bg-[#141414] text-white pt-12 pb-8 px-4 sm:px-6 mt-12 border-t-4 border-[#B22222]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: About & Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h2 className="text-3xl font-black text-white font-serif tracking-tight">
                नयाँदृष्टि
              </h2>
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest block">
                NayaDristi News Media
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              “समाचारलाई नयाँ दृष्टिले हेरौं।” तथ्यपरक, निष्पक्ष र जिम्मेवार पत्रकारिताको माध्यमबाट जनतालाई सुसूचित गराउने नयाँदृष्टिको मूल लक्ष्य हो।
            </p>
            <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800">
              <p><strong className="text-slate-300">कार्यालय:</strong> काठमाडौं, नेपाल</p>
              <p><strong className="text-slate-300">इमेल:</strong> info@nayadristi.com</p>
              <p><strong className="text-slate-300">सम्पर्क:</strong> +९७७-१-४४५५६६७</p>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              प्रमुख विधाहरू
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              {displayCategories.slice(0, 8).map(c => (
                <li key={c.name}>
                  <Link to={`/category/${c.slug || c.name}`} className="hover:text-red-400 transition-colors flex items-center gap-1">
                    <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Legal & Editorial */}
          <div>
            <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              संस्थागत जानकारी
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link to="/about" className="hover:text-white transition-colors">हाम्रोबारे (About Us)</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">सम्पर्क फारम (Contact Us)</Link></li>
              <li><Link to="/editorial" className="hover:text-white transition-colors">सम्पादकीय आचारसंहिता (Editorial Policy)</Link></li>
              <li><Link to="/special" className="hover:text-white transition-colors">विशेष रिपोर्ट (Special Reports)</Link></li>
              <li><Link to="/admin" className="text-amber-400 hover:text-amber-300 transition-colors">एडमिन प्यानल लगइन</Link></li>
            </ul>
          </div>

          {/* Col 4: Press Council & Registration */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              दर्ता तथा नियमन
            </h3>
            <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1.5">
              <p><span className="text-slate-300 font-semibold">सूचना विभाग दर्ता नं:</span> १२३४/०८०-८१</p>
              <p><span className="text-slate-300 font-semibold">प्रेस काउन्सिल सूचीकरण नं:</span> ५६७८/०८०</p>
              <p><span className="text-slate-300 font-semibold">प्रकाशक:</span> नयाँदृष्टि मिडिया प्रालि</p>
              <p><span className="text-slate-300 font-semibold">सम्पादक:</span> सन्तोष घर्ती मगर</p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>&copy; {new Date().getFullYear()} नयाँदृष्टि मिडिया प्रा.लि. | सर्वाधिकार सुरक्षित।</p>
          <p className="text-[11px] text-slate-600">Digital News Portal · Kathmandu, Nepal</p>
        </div>
      </footer>
    </div>
  );
}
