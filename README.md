# नयाँदृष्टि (NayaDristi) - Digital News Portal & CMS

नेपालका प्रमुख मूलधारका डिजिटल समाचार पोर्टलहरू (अनलाइनखबर, सेतोपाटी, रातोपाटी) को शैलीमा निर्मित पूर्ण, आधुनिक र व्यावसायिक समाचार पोर्टल तथा शक्तिशाली एडमिन कन्टेन्ट म्यानेजमेन्ट सिस्टम (CMS)।

---

## 🚀 मुख्य विशेषताहरू (Key Features)

### 📰 फ्रन्टइन्ड पोर्टल (Public News Portal):
- **गृहपृष्ठ (Homepage):** प्रमुख विशेष समाचार (Lead Hero Story), ताजा अपडेट ग्रिड, सर्वाधिक पढिएका ट्रेन्डिङ समाचार (Trending), विधागत समाचारहरू (राजनीति, अर्थतन्त्र, खेलकुद आदि)।
- **ताजा ब्रेकिङ न्युज टिकर (Breaking News Marquee):** मुख्य समाचारको प्रत्यक्ष गतिशील टिकर।
- **नेपाली मिति तथा घडी:** बिक्रम संवत् (वि.सं.) क्यालेन्डर मिति तथा प्रत्यक्ष समय।
- **समाचार विवरण पेज (Article Details):**
  - सामाजिक सञ्जाल सेयर बटनहरू (Facebook, WhatsApp, X, Copy Link)
  - अक्षर सानो/ठूलो बनाउने रिसाइजर (A-, A, A+)
  - सम्बन्धित समाचारहरू (Related Stories)
  - पाठक प्रतिक्रिया प्रणाली (Reader Comments & Discussions)
- **लाइभ सर्च तथा विधागत नेभिगेसन:** खोज इन्जिन तथा प्रत्येक विधाका लागि छुट्टै पृष्ठहरू।
- **उत्तरदायी डिजाइन (Responsive):** मोबाइल, ट्याब्लेट र डेस्कटप सबैमा सहज सञ्चालनका लागि मोबाइल ड्रअर मेनु।
- **व्यावसायिक विज्ञापन स्लटहरू (Commercial Ad Slots):** हेडर, गृहपृष्ठ, समाचार भित्र, साइडबार र फुटरमा विज्ञापन ब्यानरहरू।

### 🛠️ एडमिन प्यानल (CMS Admin Panel):
- **सुरक्षित प्रमाणीकरण:** गोप्य एडमिन पोर्टलबाट सुरक्षित लगइन प्रणाली।
- **समाचार व्यवस्थापन:** समाचार लेख्ने, सम्पादन गर्ने, तस्विर र क्याप्सन राख्ने, ड्राफ्ट वा प्रकाशित गर्ने, र लाइभ पोर्टलमा प्रत्यक्ष हेर्ने सुविधा।
- **विधा व्यवस्थापन (Categories):** नयाँ विधा थप्ने र मेटाउने।
- **पत्रकार / लेखक व्यवस्थापन (Authors):** सम्पादक तथा संवाददाताहरूको प्रोफाइल।
- **विज्ञापन व्यवस्थापन (Advertisement CMS):** ब्यानरहरू अपलोड गर्ने, स्थान तोक्ने र अन/अफ गर्ने।
- **पोर्टल सेटिङहरू:** प्रेस काउन्सिल दर्ता नं., कार्यालयको ठेगाना र एडमिन पासवर्ड परिवर्तन।

---

## 🛠️ प्रविधिहरू (Tech Stack)

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Date-fns
- **Backend:** Node.js, Express 5, Vite (SSR/Middleware mode in dev)
- **Database:** PostgreSQL with Drizzle ORM
- **Build Tool:** Vite + ESBuild

---

## 💻 स्थानीय सेटअप (Local Installation)

### १. प्रोजेक्ट डाउनलोड गर्नुहोस् (Clone Repository):
```bash
git clone https://github.com/your-username/nayadristi.git
cd nayadristi
```

### २. डिपेन्डेन्सीहरू इन्स्टल गर्नुहोस् (Install Dependencies):
```bash
npm install
```

### ३. वातावरण चरहरू मिलाउनुहोस् (Environment Variables):
`.env.example` लाई कपी गरेर `.env` बनाउनुहोस्:
```bash
cp .env.example .env
```
र आफ्नो PostgreSQL डाटाबेसको विवरण राख्नुहोस्:
```env
DATABASE_URL="postgres://username:password@localhost:5432/nayadristi"
```

### ४. डेभलपमेन्ट सर्भर सुरु गर्नुहोस् (Run Dev Server):
```bash
npm run dev
```
पोर्टल `http://localhost:3000` मा खुल्नेछ।

---

## 🚀 प्रोडक्सन तथा होस्टिङ (Production Build & Deploy)

### १. प्रोडक्सन बिल्ड तयार गर्नुहोस्:
```bash
npm run build
```

### २. प्रोडक्सन सर्भर सुरु गर्नुहोस्:
```bash
npm start
```

### लोकप्रिय प्लेटफर्महरूमा होस्ट गर्ने तरिका:
- **GitHub Pages / Static Hosting:**
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Database: Google Cloud Firestore (प्रत्यक्ष क्लाउड सिङ्क)
- **Render / Railway / VPS (वैकल्पिक सर्भर):**
  - Build Command: `npm run build`
  - Start Command: `npm start`

