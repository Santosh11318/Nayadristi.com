import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send, CheckCircle2, ChevronRight, MessageSquareText } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    document.title = "सम्पर्क (Contact Us) | नयाँदृष्टि";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-red-700">गृहपृष्ठ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-medium">सम्पर्क</span>
      </div>

      <div>
        <h1 className="text-3xl sm:text-4xl font-black font-serif text-slate-900 mb-2">
          हामीलाई सम्पर्क गर्नुहोस् (Contact Us)
        </h1>
        <p className="text-slate-600 text-sm">
          समाचार सुझाव, प्रतिक्रिया, वा विज्ञापनको लागि हामीलाई सिधै सम्पर्क गर्न सक्नुहुन्छ।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">कार्यालय ठेगाना</h4>
            <p className="text-xs text-slate-500 mt-1">काठमाडौं महानगरपालिका, बानेश्वर, नेपाल</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">फोन सम्पर्क</h4>
            <p className="text-xs text-slate-500 mt-1">+९७७-१-४४५५६६७</p>
            <p className="text-xs text-slate-500">+९७७-९८५१००००००</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">इमेल ठेगाना</h4>
            <p className="text-xs text-slate-500 mt-1">सम्पादकीय: news@nayadristi.com</p>
            <p className="text-xs text-slate-500">विज्ञापन: ads@nayadristi.com</p>
          </div>
        </div>
      </div>

      {/* Form & News Tips Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Form */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageSquareText className="w-5 h-5 text-red-600" />
            सन्देश पठाउनुहोस् (Send a Message)
          </h3>

          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              धन्यवाद! तपाईंको सन्देश नयाँदृष्टि डेस्कमा सफलतापूर्वक प्राप्त भयो। हामी छिट्टै सम्पर्क गर्नेछौं।
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">पूरा नाम (Full Name)</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="उदा. सन्तोष घर्ती मगर"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">इमेल (Email Address)</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@domain.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">विषय (Subject)</label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="समाचार सुझाव / विज्ञापन सोधपुछ"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">सन्देश (Message)</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="तपाईंको विचार वा समाचार विवरण यहाँ लेख्नुहोस्..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>

            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              सन्देश पठाउनुहोस्
            </button>
          </form>
        </div>

        {/* News Tips Box */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-3">
            <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded uppercase">
              गोप्य समाचार सुझाव
            </span>
            <h4 className="text-base font-bold font-serif">तपाईंसँग कुनै विशेष समाचार छ?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              भ्रष्टाचार, अनियमितता वा समाजका लुकेका विषयबारे हामीलाई गोप्य सूचना पठाउन सक्नुहुन्छ। सूचनादाताको पहिचान पूर्ण रूपमा गोप्य राखिनेछ।
            </p>
            <div className="pt-2 text-xs text-amber-400 font-semibold">
              ह्वाट्सएप / भाइबर: +९७७-९८५१००००००
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-800">विज्ञापन शाखा (Advertising Desk):</h4>
            <p>व्यावसायिक ब्यानर तथा विज्ञापन प्रकाशनका लागि दररेट तथा योजना बुझ्न सिधै सम्पर्क गर्नुहोस्।</p>
            <p className="font-semibold text-slate-900">marketing@nayadristi.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
