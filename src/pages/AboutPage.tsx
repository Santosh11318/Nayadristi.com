import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Award, ShieldCheck, HeartHandshake, ChevronRight, Globe } from "lucide-react";
import { getAuthors } from "../lib/firestoreService";

export default function AboutPage() {
  const [authors, setAuthors] = useState<any[]>([]);

  useEffect(() => {
    document.title = "हाम्रोबारे (About Us) | नयाँदृष्टि";
    getAuthors()
      .then((data) => {
        if (data && data.length > 0) {
          setAuthors(data);
        } else {
          fetch("/api/authors")
            .then(res => res.json())
            .then(apiData => {
              if (Array.isArray(apiData)) setAuthors(apiData);
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        fetch("/api/authors")
          .then(res => res.json())
          .then(apiData => {
            if (Array.isArray(apiData)) setAuthors(apiData);
          })
          .catch(() => {});
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-red-700">गृहपृष्ठ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-medium">हाम्रोबारे</span>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white p-8 sm:p-12 rounded-2xl shadow-md border border-red-950/40 space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold block">
          नयाँदृष्टि डिजिटल समाचार पोर्टल
        </span>
        <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight">
          हाम्रो परिचय र सम्पादकीय यात्रा
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-serif">
          “समाचारलाई नयाँ दृष्टिले हेरौं।” सत्य, तथ्य, निष्पक्षता र नेपाली जनताको आवाजलाई मुख्य प्राथमिकता दिँदै सञ्चालित एक अग्रणी डिजिटल समाचार माध्यम।
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">तथ्यपरक र निष्पक्ष</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            कुनै पनि दबाब वा प्रभावबाट मुक्त रही घटनाको सत्यतथ्य सूचना प्रमाणसहित जनतासामु पुर्याउनु हाम्रो मुख्य कर्तव्य हो।
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">जिम्मेवार पत्रकारिता</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            प्रेस काउन्सिल नेपालको पत्रकार आचारसंहिताको पूर्ण पालना गर्दै समाजमा सकारात्मक परिवर्तन ल्याउने पत्रकारिता।
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">जनताको आवाज</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            गाउँदेखि सहरसम्म, दुरदराजका नागरिकका समस्या, गुनासो र सफलताका कथाहरूलाई प्रमुख स्थान दिइन्छ।
          </p>
        </div>
      </div>

      {/* Editorial Team */}
      <div className="space-y-6">
        <div className="border-b-2 border-slate-200 pb-3 flex items-center justify-between">
          <h2 className="text-2xl font-black font-serif text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-red-600" />
            हाम्रो सम्पादकीय टोली (Our Team)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Default Leadership */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-200 overflow-hidden border-2 border-red-600">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" 
                alt="सन्तोष घर्ती मगर" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">सन्तोष घर्ती मगर</h4>
              <p className="text-xs text-red-600 font-semibold">प्रधान सम्पादक तथा प्रकाशक</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              डिजिटल मिडिया तथा खोज पत्रकारितामा लामो अनुभव।
            </p>
          </div>

          {/* Database Authors */}
          {authors.map((author: any) => (
            <div key={author.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs text-center space-y-3">
              <div className="w-20 h-20 mx-auto rounded-full bg-slate-200 overflow-hidden border-2 border-slate-300">
                <img 
                  src={author.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"} 
                  alt={author.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">{author.name}</h4>
                <p className="text-xs text-red-600 font-semibold">{author.designation || "संवाददाता"}</p>
              </div>
              {author.bio && (
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {author.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legal & Registration Notice */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
        <h4 className="font-bold text-slate-900 text-sm">कानुनी तथा संस्थागत विवरण:</h4>
        <p>• सूचना तथा प्रसारण विभाग दर्ता नं: <strong>१२३४/०८०-८१</strong></p>
        <p>• प्रेस काउन्सिल नेपाल सूचीकरण नं: <strong>५६७८/०८०</strong></p>
        <p>• कम्पनी रजिस्ट्रार दर्ता नं: <strong>३४५६७/०८०/०८१</strong></p>
        <p>• कार्यालय: काठमाडौं महानगरपालिका, काठमाडौं, नेपाल</p>
      </div>
    </div>
  );
}
