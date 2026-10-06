import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, BookOpen, CheckCircle2, ChevronRight, Scale } from "lucide-react";

export default function EditorialPolicyPage() {
  useEffect(() => {
    document.title = "सम्पादकीय आचारसंहिता (Editorial Policy) | नयाँदृष्टि";
  }, []);
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-red-700">गृहपृष्ठ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-medium">सम्पादकीय आचारसंहिता</span>
      </div>

      <div className="border-b-2 border-slate-200 pb-4">
        <h1 className="text-3xl sm:text-4xl font-black font-serif text-slate-900 mb-2">
          सम्पादकीय नीति तथा आचारसंहिता (Editorial Policy)
        </h1>
        <p className="text-slate-600 text-sm">
          नयाँदृष्टि डिजिटल समाचार पोर्टलद्वारा अवलम्बन गरिएका आधारभूत पत्रकारिता मूल्य तथा मान्यताहरू
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-slate-800 leading-relaxed text-sm">
        <section className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-red-600" />
            १. प्रेस काउन्सिल नेपालको आचारसंहिता पालना
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            नयाँदृष्टि प्रेस काउन्सिल नेपालद्वारा जारी पत्रकार आचारसंहिताप्रति पूर्ण प्रतिबद्ध छ। हामी कुनै पनि प्रकारको राजनीतिक, आर्थिक वा व्यक्तिगत दबाबभन्दा माथि उठेर सत्य र सन्तुलित पत्रकारिता गर्दछौं।
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-red-600" />
            २. तथ्य परीक्षण (Fact-Checking Policy)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            हामी समाचार प्रकाशन गर्नुपूर्व कम्तीमा दुई स्वतन्त्र र विश्वसनीय स्रोतबाट तथ्य पुष्टि गर्छौं। सामाजिक सञ्जालमा आएका अपुष्ट हल्ला वा भ्रामक सूचनालाई स्पष्ट छानबिन नगरी समाचार बनाइँदैन।
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-600" />
            ३. गल्ती स्वीकार र खण्डन नीति (Corrections Policy)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            प्रकाशन भएको समाचारमा कुनै गल्ती वा भूल भएको प्रमाणित भएमा नयाँदृष्टिले त्यसलाई तत्काल सच्याउनेछ र पाठकलाई स्पष्ट जानकारी दिनेछ। पीडित पक्षको सन्तुलित प्रतिक्रियालाई सम्मानजनक स्थान दिइनेछ।
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            ४. गोपनीयता र स्रोतको सुरक्षा (Source Protection)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            संवेदनशील तथा खोजमूलक समाचारहरूमा सूचनादाताको सुरक्षा हाम्रो सर्वोच्च प्राथमिकता हो। सूचनादाताले नाम गोप्य राख्न अनुरोध गरेको खण्डमा प्रचलित कानुन अनुसार पहिचान सधैं सुरक्षित राखिनेछ।
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900">
            ५. सर्वाधिकार तथा पुनःप्रकाशन (Copyright)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            नयाँदृष्टिमा प्रकाशित सामग्री, तस्विर तथा भिडियोहरूको सर्वाधिकार नयाँदृष्टि मिडिया प्रा.लि. मा सुरक्षित छ। सम्पादकको लिखित अनुमति बिना पूर्ण सामग्री व्यावसायिक प्रयोजनका लागि पुनःप्रकाशन गर्न निषेध गरिएको छ। साभार गर्दा अनिवार्य रूपमा स्रोत र लिंक खुलाउनु पर्नेछ।
          </p>
        </section>
      </div>
    </div>
  );
}
