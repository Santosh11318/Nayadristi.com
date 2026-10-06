import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, 
  query, where, orderBy, limit, serverTimestamp, setDoc 
} from "firebase/firestore";
import { db } from "./firebase";

// Collection References
const articlesCol = collection(db, "articles");
const categoriesCol = collection(db, "categories");
const authorsCol = collection(db, "authors");
const adsCol = collection(db, "advertisements");
const commentsCol = collection(db, "comments");
const settingsCol = collection(db, "settings");

export interface FirestoreArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImageUrl: string;
  imageCaption?: string;
  categoryId?: string | number;
  category?: { id?: string | number; name: string; slug: string };
  authorId?: string | number;
  author?: { id?: string | number; name: string; designation?: string; photoUrl?: string };
  status: "published" | "draft" | "archived";
  isFeatured: boolean;
  isBreaking: boolean;
  publishedAt?: string;
  createdAt?: string;
}

export interface FirestoreCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder?: number;
}

export interface FirestoreAd {
  id: string;
  title: string;
  position: string;
  imageUrl: string;
  adUrl?: string;
  isActive: boolean;
}

// -------------------------------------------------------------
// SEED INITIAL DATA IF FIRESTORE IS EMPTY
// -------------------------------------------------------------
export async function seedInitialFirestoreData() {
  try {
    const snap = await getDocs(articlesCol);
    if (!snap.empty) return; // Already has data

    console.log("Seeding initial portal data to Google Firestore...");

    // Default Categories
    const defaultCats = [
      { name: "राष्ट्रिय", slug: "national", sortOrder: 1 },
      { name: "राजनीति", slug: "politics", sortOrder: 2 },
      { name: "अर्थतन्त्र", slug: "economy", sortOrder: 3 },
      { name: "समाज", slug: "society", sortOrder: 4 },
      { name: "शिक्षा", slug: "education", sortOrder: 5 },
      { name: "स्वास्थ्य", slug: "health", sortOrder: 6 },
      { name: "खेलकुद", slug: "sports", sortOrder: 7 },
      { name: "मनोरञ्जन", slug: "entertainment", sortOrder: 8 },
      { name: "प्रविधि", slug: "tech", sortOrder: 9 },
      { name: "अन्तर्राष्ट्रिय", slug: "international", sortOrder: 10 },
      { name: "विचार", slug: "opinion", sortOrder: 11 },
    ];
    for (const cat of defaultCats) {
      await addDoc(categoriesCol, cat);
    }

    // Default Author
    await setDoc(doc(authorsCol, "editor_1"), {
      name: "नयाँदृष्टि सम्पादकीय टोली",
      designation: "सम्पादक",
      bio: "नेपाल तथा विश्वभरिका ताजा र निष्पक्ष समाचार संकलन।",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    });

    // Default Articles
    const defaultArticles = [
      {
        title: "काठमाडौँमा नयाँ विद्युतीय रेलमार्ग निर्माणको विस्तृत परियोजना प्रतिवेदन स्वीकृत",
        slug: "electric-railway-dpr-approved",
        summary: "सरकारले उपत्यकाको ट्राफिक व्यवस्थापनलाई सहज बनाउन आधुनिक विद्युतीय रेलमार्ग निर्माण प्रक्रियालाई तीब्रता दिएको छ।",
        content: "<p>काठमाडौं। सरकारले राजधानी उपत्यकामा आधुनिक विद्युतीय रेलमार्ग सञ्चालनका लागि विस्तृत परियोजना प्रतिवेदन (DPR) स्वीकृत गरेको छ। यस आयोजनाले उपत्यकाको सार्वजनिक यातायात प्रणालीमा ऐतिहासिक परिवर्तन ल्याउने विश्वास लिइएको छ।</p><p>यातायात मन्त्रालयका अनुसार पहिलो चरणको निर्माण कार्य आगामी आर्थिक वर्षको सुरुबाटै प्रारम्भ हुनेछ। पर्यावरणमैत्री र द्रुत गतिको यातायातले राजधानीको वायु प्रदूषण र ट्राफिक जाम दुवै उल्लेख्य रूपमा घटाउनेछ।</p>",
        featuredImageUrl: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1200&auto=format&fit=crop&q=80",
        imageCaption: "प्रस्तावित विद्युतीय रेलमार्गको नमुना प्रारूप / नयाँदृष्टि",
        category: { name: "राष्ट्रिय", slug: "national" },
        author: { name: "नयाँदृष्टि डेस्क", designation: "विशेष संवाददाता" },
        status: "published",
        isFeatured: true,
        isBreaking: true,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        title: "नेपालको अर्थतन्त्रमा सुधारको संकेत, विदेशी मुद्रा सञ्चिति हालसम्मकै उच्च बिन्दुमा",
        slug: "forex-reserve-record-high",
        summary: "नेपाल राष्ट्र बैंकद्वारा जारी पछिल्लो वित्तीय प्रतिवेदन अनुसार रेमिट्यान्स आप्रवाहमा भएको वृद्धिले विदेशी मुद्रा सञ्चिति ऐतिहासिक स्तरमा पुगेको छ।",
        content: "<p>काठमाडौं। पछिल्लो समय देशको बाह्य क्षेत्र बलियो बन्दै गएको नेपाल राष्ट्र बैंकको तथ्याङ्कले देखाएको छ। चालु आर्थिक वर्षको समीक्षा अवधिमा रेमिट्यान्स आप्रवाहमा उल्लेख्य वृद्धि भएसँगै विदेशी मुद्रा सञ्चिति हालसम्मकै उच्च स्तरमा पुगेको हो।</p><p>अर्थविद्हरूका अनुसार यसले आयात धान्न सक्ने क्षमता बढाएको छ भने समग्र अर्थतन्त्रमा लगानीको वातावरण थप सुदृढ बनाउन मद्दत पुग्नेछ।</p>",
        featuredImageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&auto=format&fit=crop&q=80",
        imageCaption: "नेपाल राष्ट्र बैंक केन्द्रीय कार्यालय, बालुवाटार",
        category: { name: "अर्थतन्त्र", slug: "economy" },
        author: { name: "आर्थिक ब्युरो", designation: "अर्थ संवाददाता" },
        status: "published",
        isFeatured: false,
        isBreaking: false,
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        title: "संसदको चालु अधिवेशनमा महत्त्वपूर्ण विधेयकहरू पारित गर्ने सहमति",
        slug: "parliament-session-bills-agreement",
        summary: "सभामुखको अध्यक्षतामा बसेको प्रमुख राजनीतिक दलहरूको बैठकमा जनसरोकारका महत्त्वपूर्ण विधेयकहरूलाई प्राथमिकता दिने निर्णय भएको छ।",
        content: "<p>काठमाडौं। संघीय संसदको चालु अधिवेशनलाई प्रभावकारी बनाउन प्रमुख दलहरूबीच सहमति जुटेको छ। सिंहदरबारमा भएको छलफलपछि दलका प्रमुख सचेतकहरूले नागरिकता, शिक्षा तथा निजामती सेवासम्बन्धी विधेयकहरूलाई छिट्टै टुंग्याउने प्रतिबद्धता जनाएका छन्।</p>",
        featuredImageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80",
        imageCaption: "संघीय संसद भवन, नयाँ बानेश्वर",
        category: { name: "राजनीति", slug: "politics" },
        author: { name: "राजनीतिक ब्युरो", designation: "संसदीय संवाददाता" },
        status: "published",
        isFeatured: false,
        isBreaking: false,
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      }
    ];

    for (const art of defaultArticles) {
      await addDoc(articlesCol, art);
    }

    // Default Ads
    const defaultAds = [
      {
        title: "नेपाल एयरलाइन्स - सिधा उडान अफर",
        position: "below_breaking",
        imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&auto=format&fit=crop&q=80",
        adUrl: "https://nepalairlines.com.np",
        isActive: true,
      },
      {
        title: "नबिल बैंक - सुरक्षित डिजिटल बैंकिङ",
        position: "sidebar",
        imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80",
        adUrl: "https://nabilbank.com",
        isActive: true,
      },
      {
        title: "ग्लोबल आइएमई बैंक - प्रिमियम मुद्दती खाता",
        position: "sidebar_bottom",
        imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80",
        adUrl: "https://globalimebank.com",
        isActive: true,
      },
      {
        title: "बजाज पल्सर - नयाँ वर्ष विशेष अफर",
        position: "homepage_middle",
        imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80",
        adUrl: "https://bajajnepal.com",
        isActive: true,
      },
      {
        title: "आईएमई पे - डिजिटल वालेट अफर",
        position: "article_top",
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80",
        adUrl: "https://imepay.com.np",
        isActive: true,
      },
      {
        title: "नेपाल पर्यटन वर्ष अभियान",
        position: "footer",
        imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80",
        adUrl: "https://welcomenepal.com",
        isActive: true,
      }
    ];

    for (const ad of defaultAds) {
      await addDoc(adsCol, ad);
    }

    console.log("Firestore seeding completed successfully!");
  } catch (err) {
    console.error("Firestore seed error:", err);
  }
}

// -------------------------------------------------------------
// ARTICLES API
// -------------------------------------------------------------
export async function getPublishedArticles(): Promise<FirestoreArticle[]> {
  try {
    const q = query(articlesCol, where("status", "==", "published"), limit(50));
    const snap = await getDocs(q);
    const list: FirestoreArticle[] = [];
    snap.forEach((d) => {
      const data = d.data();
      list.push({ id: d.id, ...(data as any) });
    });
    // Sort descending by publishedAt
    list.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });
    return list;
  } catch (err) {
    console.error("Error fetching published articles from Firestore:", err);
    return [];
  }
}

export async function getAllAdminArticles(): Promise<FirestoreArticle[]> {
  try {
    const snap = await getDocs(articlesCol);
    const list: FirestoreArticle[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...(d.data() as any) });
    });
    list.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    return list;
  } catch (err) {
    console.error("Error fetching admin articles from Firestore:", err);
    return [];
  }
}

export async function getBreakingNews(): Promise<FirestoreArticle[]> {
  try {
    const q = query(articlesCol, where("status", "==", "published"), where("isBreaking", "==", true), limit(8));
    const snap = await getDocs(q);
    const list: FirestoreArticle[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...(d.data() as any) }));
    if (list.length > 0) return list;
    // Fallback to top latest
    return (await getPublishedArticles()).slice(0, 5);
  } catch (err) {
    console.error("Error fetching breaking news:", err);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<FirestoreArticle | null> {
  try {
    const q = query(articlesCol, where("slug", "==", slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      return { id: d.id, ...(d.data() as any) };
    }
    // Also try finding by doc id
    const docRef = doc(articlesCol, slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as any) };
    }
    return null;
  } catch (err) {
    console.error("Error fetching article by slug:", err);
    return null;
  }
}

export async function createArticle(data: Partial<FirestoreArticle>) {
  const slug = data.slug || `news-${Date.now()}`;
  const docData = {
    ...data,
    slug,
    status: data.status || "published",
    isFeatured: Boolean(data.isFeatured),
    isBreaking: Boolean(data.isBreaking),
    publishedAt: data.status === "published" ? new Date().toISOString() : null,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(articlesCol, docData);
  return { id: docRef.id, ...docData };
}

export async function updateArticle(id: string, data: Partial<FirestoreArticle>) {
  const docRef = doc(articlesCol, id);
  const updateData: any = { ...data };
  if (data.status === "published" && !data.publishedAt) {
    updateData.publishedAt = new Date().toISOString();
  }
  updateData.updatedAt = new Date().toISOString();
  await updateDoc(docRef, updateData);
  return { id, ...updateData };
}

export async function deleteArticle(id: string) {
  const docRef = doc(articlesCol, id);
  await deleteDoc(docRef);
  return { success: true };
}

// -------------------------------------------------------------
// CATEGORIES API
// -------------------------------------------------------------
export async function getCategories(): Promise<FirestoreCategory[]> {
  try {
    const snap = await getDocs(categoriesCol);
    const list: FirestoreCategory[] = [];
    const seenNames = new Set<string>();
    snap.forEach((d) => {
      const data = d.data() as any;
      const key = (data.name || data.slug || "").trim().toLowerCase();
      if (key && !seenNames.has(key)) {
        seenNames.add(key);
        list.push({ id: d.id, ...data });
      }
    });
    list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    return list;
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
}

export async function createCategory(data: Partial<FirestoreCategory>) {
  const docRef = await addDoc(categoriesCol, data);
  return { id: docRef.id, ...data };
}

export async function deleteCategory(id: string) {
  await deleteDoc(doc(categoriesCol, id));
  return { success: true };
}

// -------------------------------------------------------------
// ADVERTISEMENTS API
// -------------------------------------------------------------
export async function getAdvertisements(): Promise<FirestoreAd[]> {
  try {
    const q = query(adsCol, where("isActive", "==", true));
    const snap = await getDocs(q);
    const list: FirestoreAd[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...(d.data() as any) }));
    return list;
  } catch (err) {
    console.error("Error fetching ads:", err);
    return [];
  }
}

export async function getAllAdminAdvertisements(): Promise<FirestoreAd[]> {
  try {
    const snap = await getDocs(adsCol);
    const list: FirestoreAd[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...(d.data() as any) }));
    return list;
  } catch (err) {
    console.error("Error fetching all ads:", err);
    return [];
  }
}

export async function createAdvertisement(data: Partial<FirestoreAd>) {
  const docData = { ...data, isActive: true, createdAt: new Date().toISOString() };
  const docRef = await addDoc(adsCol, docData);
  return { id: docRef.id, ...docData };
}

export async function toggleAdvertisement(id: string, currentStatus: boolean) {
  const docRef = doc(adsCol, id);
  await updateDoc(docRef, { isActive: !currentStatus });
  return { id, isActive: !currentStatus };
}

export async function deleteAdvertisement(id: string) {
  await deleteDoc(doc(adsCol, id));
  return { success: true };
}

// -------------------------------------------------------------
// COMMENTS API
// -------------------------------------------------------------
export async function getArticleComments(articleId: string | number) {
  try {
    const q = query(commentsCol, where("articleId", "==", String(articleId)), limit(50));
    const snap = await getDocs(q);
    const list: any[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...(d.data() as any) }));
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return list;
  } catch (err) {
    console.error("Error fetching comments:", err);
    return [];
  }
}

export async function addComment(commentData: {
  articleId: string | number;
  articleSlug?: string;
  name: string;
  email?: string;
  content: string;
}) {
  const docData = {
    ...commentData,
    articleId: String(commentData.articleId),
    status: "approved",
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(commentsCol, docData);
  return { id: docRef.id, ...docData };
}

// -------------------------------------------------------------
// AUTHORS API
// -------------------------------------------------------------
export async function getAuthors() {
  try {
    const snap = await getDocs(authorsCol);
    const list: any[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...(d.data() as any) }));
    return list;
  } catch (err) {
    console.error("Error fetching authors:", err);
    return [];
  }
}

export async function createAuthor(data: any) {
  const docRef = await addDoc(authorsCol, data);
  return { id: docRef.id, ...data };
}

export async function deleteAuthor(id: string) {
  await deleteDoc(doc(authorsCol, id));
  return { success: true };
}

// -------------------------------------------------------------
// SETTINGS API
// -------------------------------------------------------------
export async function getSettings() {
  try {
    const snap = await getDocs(settingsCol);
    const map: Record<string, any> = {};
    snap.forEach((d) => {
      const data = d.data();
      if (data.key) map[data.key] = data.value;
    });
    return map;
  } catch (err) {
    console.error("Error fetching settings:", err);
    return {};
  }
}

export async function saveSetting(key: string, value: any) {
  await setDoc(doc(settingsCol, key), { key, value, updatedAt: new Date().toISOString() });
  return { success: true };
}

// -------------------------------------------------------------
// HELPER LOOKUPS & STATS
// -------------------------------------------------------------
export async function getArticleById(id: string): Promise<FirestoreArticle | null> {
  try {
    const docRef = doc(articlesCol, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as any) };
    }
    return await getArticleBySlug(id);
  } catch (err) {
    console.error("Error fetching article by id:", err);
    return null;
  }
}

export async function searchArticles(queryStr: string): Promise<FirestoreArticle[]> {
  try {
    const all = await getPublishedArticles();
    if (!queryStr.trim()) return all;
    const term = queryStr.toLowerCase().trim();
    return all.filter((a) => {
      const title = (a.title || "").toLowerCase();
      const summary = (a.summary || "").toLowerCase();
      const content = (a.content || "").toLowerCase();
      const catName = (a.category?.name || "").toLowerCase();
      const authName = (a.author?.name || "").toLowerCase();
      return (
        title.includes(term) ||
        summary.includes(term) ||
        content.includes(term) ||
        catName.includes(term) ||
        authName.includes(term)
      );
    });
  } catch (err) {
    console.error("Error searching articles:", err);
    return [];
  }
}

export async function getPortalStats(): Promise<{ articles: number; users: number; authors: number; categories: number }> {
  try {
    const [artsSnap, catsSnap, authorsSnap] = await Promise.all([
      getDocs(articlesCol),
      getDocs(categoriesCol),
      getDocs(authorsCol),
    ]);
    return {
      articles: artsSnap.size,
      categories: catsSnap.size,
      authors: authorsSnap.size,
      users: 1,
    };
  } catch (err) {
    console.error("Error getting portal stats:", err);
    return { articles: 0, categories: 0, authors: 0, users: 1 };
  }
}

