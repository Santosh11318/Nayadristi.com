import React, { useState, useEffect } from "react";
import { Settings, Lock, Globe, CheckCircle2, AlertCircle, Save } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

import { getSettings, saveSetting } from "../../lib/firestoreService";

export default function AdminSettings() {
  const { currentUser, token } = useAuth();
  const [siteTitle, setSiteTitle] = useState("नयाँदृष्टि (NayaDristi)");
  const [tagline, setTagline] = useState("समाचारलाई नयाँ दृष्टिले हेरौं");
  const [contactEmail, setContactEmail] = useState("info@nayadristi.com");
  const [contactPhone, setContactPhone] = useState("+977-1-4455667");
  const [pressReg, setPressReg] = useState("१२३४/०८०-८१");
  const [address, setAddress] = useState("काठमाडौं, नेपाल");
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    getSettings().then(data => {
      if (data && data.general) {
        const g = data.general;
        if (g.siteTitle) setSiteTitle(g.siteTitle);
        if (g.tagline) setTagline(g.tagline);
        if (g.contactEmail) setContactEmail(g.contactEmail);
        if (g.contactPhone) setContactPhone(g.contactPhone);
        if (g.pressReg) setPressReg(g.pressReg);
        if (g.address) setAddress(g.address);
      } else {
        fetch("/api/settings")
          .then(res => res.json())
          .then(apiData => {
            if (apiData.general) {
              if (apiData.general.siteTitle) setSiteTitle(apiData.general.siteTitle);
              if (apiData.general.tagline) setTagline(apiData.general.tagline);
              if (apiData.general.contactEmail) setContactEmail(apiData.general.contactEmail);
              if (apiData.general.contactPhone) setContactPhone(apiData.general.contactPhone);
              if (apiData.general.pressReg) setPressReg(apiData.general.pressReg);
              if (apiData.general.address) setAddress(apiData.general.address);
            }
          })
          .catch(() => {});
      }
    }).catch(() => {});
  }, []);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setMsg("");
    setErrMsg("");
    try {
      const generalData = { siteTitle, tagline, contactEmail, contactPhone, pressReg, address };
      
      // 1. Direct save to Firestore
      await saveSetting("general", generalData);

      // 2. Sync to API if running
      const activeToken = (await currentUser?.getIdToken?.()) || token;
      fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ key: "general", value: generalData })
      }).catch(() => {});

      setMsg("पोर्टल सेटिङहरू Google Firestore मा सफलतापूर्वक सुरक्षित गरियो!");
    } catch (err: any) {
      setErrMsg(err.message || "त्रुटि भयो");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      setErrMsg("पासवर्ड कम्तीमा ४ अक्षरको हुनुपर्छ");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrMsg("दुवै पासवर्ड मिलेन, कृपया जाँच गर्नुहोस्");
      return;
    }

    setSavingPassword(true);
    setMsg("");
    setErrMsg("");
    try {
      // 1. Save password to Firestore settings & localStorage
      await saveSetting("admin_auth", {
        password: newPassword,
        updatedAt: new Date().toISOString()
      });
      localStorage.setItem("nd_custom_admin_password", newPassword);

      // 2. Sync with API if running
      const activeToken = (await currentUser?.getIdToken?.()) || token;
      fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ newPassword })
      }).catch(() => {});

      setMsg("नयाँ एडमिन पासवर्ड सफलतापूर्वक अपडेट भयो!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setErrMsg(err.message || "त्रुटि भयो");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="w-6 h-6 text-red-600" />
          पोर्टल सेटिङहरू (System Settings)
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          वेबसाइटको विवरण र एडमिन सुरक्षा सेटिङ व्यवस्थापन गर्नुहोस्
        </p>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm text-emerald-800 font-medium">{msg}</p>
        </div>
      )}

      {errMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-800 font-medium">{errMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-red-600" />
            वेबसाइट विवरण (General Info)
          </h3>
          <form onSubmit={handleSaveGeneral} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                पोर्टलको नाम (Portal Name)
              </label>
              <input
                type="text"
                required
                value={siteTitle}
                onChange={e => setSiteTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                ट्यागलाइन (Tagline / Slogan)
              </label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                सम्पर्क इमेल (Contact Email)
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                फोन नम्बर (Phone)
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                प्रेस काउन्सिल दर्ता नं.
              </label>
              <input
                type="text"
                value={pressReg}
                onChange={e => setPressReg(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                कार्यालय ठेगाना (Office Address)
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {savingSettings ? "सुरक्षित हुँदैछ..." : "सेटिङ सुरक्षित गर्नुहोस् (Save)"}
            </button>
          </form>
        </div>

        {/* Security / Change Password */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600" />
            एडमिन पासवर्ड परिवर्तन (Change Password)
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            हालको लगइन इमेल: <strong className="text-slate-800">{currentUser?.email}</strong>
          </p>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                नयाँ पासवर्ड (New Password)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="नयाँ पासवर्ड राख्नुहोस्..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                नयाँ पासवर्ड पुनः पुष्टि (Confirm Password)
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="पासवर्ड फेरि टाइप गर्नुहोस्..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {savingPassword ? "अपडेट हुँदैछ..." : "पासवर्ड अपडेट गर्नुहोस् (Update Password)"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
