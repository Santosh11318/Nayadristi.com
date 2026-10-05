import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Zap, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("santoshghartimagar918@gmail.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const { loginWithCredentials, quickAdminLogin, loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/admin");
    }
  }, [currentUser, navigate]);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      await loginWithCredentials(email, password);
      setSuccessMsg("सफलतापूर्वक लगइन भयो! एडमिन प्यानल खुल्दैछ...");
      setTimeout(() => navigate("/admin"), 400);
    } catch (err: any) {
      setError(err.message || "इमेल वा पासवर्ड गलत भयो");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setError("");
    setSuccessMsg("");
    setQuickLoading(true);
    try {
      await quickAdminLogin();
      setSuccessMsg("एडमिन लगइन सफल भयो! स्वागत छ...");
      setTimeout(() => navigate("/admin"), 400);
    } catch (err: any) {
      setError(err.message || "क्विक लगइन असफल भयो");
    } finally {
      setQuickLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setSuccessMsg("");
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      setSuccessMsg("Google मार्फत लगइन सफल भयो!");
      setTimeout(() => navigate("/admin"), 400);
    } catch (err: any) {
      setError(err.message || "Google मार्फत लगइन गर्न सकिएन");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Return to website */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          नयाँदृष्टि गृहपृष्ठमा फर्कनुहोस् (Home)
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-500 shadow-xl mb-4">
            <ShieldCheck className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight font-serif">
            नयाँदृष्टि <span className="text-red-500">एडमिन प्यानल</span>
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            समाचार पोर्टल व्यवस्थापन प्रणाली (CMS Admin Control)
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/95 backdrop-blur shadow-2xl rounded-2xl p-6 sm:p-8 border border-white/20">
          
          {/* Notifications */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm text-red-700 font-medium leading-relaxed">{error}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-sm text-emerald-800 font-medium leading-relaxed">{successMsg}</div>
            </div>
          )}

          {/* OPTION 1: 1-Click Instant Login */}
          <div className="mb-6 bg-gradient-to-r from-red-50 via-amber-50 to-red-50 p-4 rounded-xl border border-red-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                सिधै प्रवेश (Instant Access)
              </span>
              <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full">
                Superadmin
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              सन्तोष जी, तपाईंको खाता <strong>santoshghartimagar918@gmail.com</strong> मार्फत १-क्लिकमा सिधै लगइन गर्नुहोस्:
            </p>
            <button
              onClick={handleQuickLogin}
              disabled={quickLoading || loading}
              type="button"
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" />
              {quickLoading ? "लगइन हुँदैछ..." : "१-क्लिक सिधै एडमिन लगइन गर्नुहोस्"}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-500 font-medium">वा इमेल र पासवर्डबाट</span>
            </div>
          </div>

          {/* OPTION 2: Email & Password Form */}
          <form className="space-y-4" onSubmit={handleCredentialsLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                इमेल ठेगाना (Email)
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="admin@nayadristi.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  पासवर्ड (Password)
                </label>
                <span className="text-[11px] text-slate-500">डिफल्ट: <code className="bg-slate-100 px-1 py-0.5 rounded text-red-600 font-mono">admin123</code></span>
              </div>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || quickLoading}
              className="w-full py-2.5 px-4 border border-transparent rounded-lg shadow text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              {loading ? "प्रमाणीकरण हुँदैछ..." : "लगइन गर्नुहोस् (Sign In)"}
            </button>
          </form>

          {/* OPTION 3: Google Login */}
          <div className="mt-5 pt-5 border-t border-slate-200">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              {googleLoading ? "Google खोल्दैछ..." : "Google मार्फत लगइन गर्नुहोस्"}
            </button>
          </div>

          {/* Credentials Info Footer */}
          <div className="mt-6 p-3 rounded-lg bg-slate-100 text-[11px] text-slate-600 flex flex-col gap-1 text-center">
            <span className="font-semibold text-slate-800">एडमिन प्रमाण विवरण (Admin Credentials):</span>
            <span>इमेल: <strong className="text-slate-900 font-mono">santoshghartimagar918@gmail.com</strong></span>
            <span>पासवर्ड: <strong className="text-slate-900 font-mono">admin123</strong></span>
          </div>

        </div>
      </div>
    </div>
  );
}
