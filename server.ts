import express from "express";
import path from "path";
import cors from "cors";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.ts";
import { articles, categories, authors, users, advertisements, settings, comments } from "./src/db/schema.ts";
import { requireAuth, AuthRequest, generateToken } from "./src/middleware/auth.ts";
import { eq, desc } from "drizzle-orm";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Ensure initial admin user exists in Postgres
  try {
    const adminEmail = "santoshghartimagar918@gmail.com";
    const existing = await db.query.users.findFirst({
      where: eq(users.email, adminEmail),
    });
    if (!existing) {
      await db.insert(users).values({
        email: adminEmail,
        name: "Santosh Gharti Magar",
        role: "superadmin",
      });
      console.log(`Seeded superadmin: ${adminEmail}`);
    } else if (existing.role !== "superadmin") {
      await db.update(users).set({ role: "superadmin" }).where(eq(users.id, existing.id));
    }
  } catch (err) {
    console.warn("User auto-seed note:", err);
  }

  // --- AUTH ROUTES ---
  
  // Admin Login Endpoint
  app.post("/api/auth/admin-login", async (req, res) => {
    try {
      const { email, password, quickAccess } = req.body;
      const targetEmail = email ? email.trim().toLowerCase() : "santoshghartimagar918@gmail.com";

      // Check stored custom password in settings or default 'admin123'
      const pwdSetting = await db.query.settings.findFirst({
        where: eq(settings.key, "admin_credentials"),
      });
      const validPassword = (pwdSetting?.value as any)?.password || "admin123";

      if (!quickAccess) {
        if (!password || password !== validPassword) {
          return res.status(401).json({
            error: "गलत पासवर्ड! डिफल्ट पासवर्ड 'admin123' हो। कृपया पुनः प्रयास गर्नुहोस्।",
          });
        }
      }

      // Find or create admin user in Postgres
      let user = await db.query.users.findFirst({
        where: eq(users.email, targetEmail),
      });

      if (!user) {
        const inserted = await db.insert(users).values({
          email: targetEmail,
          name: targetEmail.includes("santosh") ? "Santosh Gharti Magar" : "Admin User",
          role: "superadmin",
        }).returning();
        user = inserted[0];
      } else if (user.role !== "superadmin" && user.role !== "admin") {
        await db.update(users).set({ role: "superadmin" }).where(eq(users.id, user.id));
        user.role = "superadmin";
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (e: any) {
      console.error("Admin login error:", e);
      return res.status(500).json({ error: "लगइन असफल भयो: " + (e.message || "Unknown error") });
    }
  });

  // Google Sync Endpoint
  app.post("/api/auth/google-sync", async (req, res) => {
    try {
      const { email, name, photoUrl } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const targetEmail = email.trim().toLowerCase();
      const isAdminEmail = targetEmail === "santoshghartimagar918@gmail.com" || targetEmail === "admin@nayadristi.com";

      let user = await db.query.users.findFirst({
        where: eq(users.email, targetEmail),
      });

      if (!user) {
        const inserted = await db.insert(users).values({
          email: targetEmail,
          name: name || "User",
          avatarUrl: photoUrl || null,
          role: isAdminEmail ? "superadmin" : "subscriber",
        }).returning();
        user = inserted[0];
      } else if (isAdminEmail && user.role !== "superadmin") {
        await db.update(users).set({ role: "superadmin" }).where(eq(users.id, user.id));
        user.role = "superadmin";
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (e: any) {
      console.error("Google sync error:", e);
      return res.status(500).json({ error: "Failed to sync user: " + e.message });
    }
  });

  // Get Current Authenticated User Profile
  app.get("/api/auth/me", requireAuth, async (req: AuthRequest, res) => {
    res.json({ user: req.dbUser });
  });

  // Change Admin Password Endpoint
  app.post("/api/auth/change-password", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (req.dbUser.role !== "admin" && req.dbUser.role !== "superadmin") {
        return res.status(403).json({ error: "Forbidden" });
      }
      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 4) {
        return res.status(400).json({ error: "Password must be at least 4 characters long" });
      }

      await db.insert(settings)
        .values({
          key: "admin_credentials",
          value: { password: newPassword },
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: settings.key,
          set: {
            value: { password: newPassword },
            updatedAt: new Date(),
          },
        });

      res.json({ success: true, message: "Password updated successfully" });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to update password" });
    }
  });

  // --- PUBLIC NEWS ROUTES ---
  app.get("/api/articles", async (req, res) => {
    try {
      const allArticles = await db.query.articles.findMany({
        where: eq(articles.status, "published"),
        orderBy: [desc(articles.publishedAt)],
        with: {
          category: true,
          author: true,
        },
        limit: 30,
      });
      res.json(allArticles);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  // Dynamic Breaking News Endpoint
  app.get("/api/breaking-news", async (req, res) => {
    try {
      const breaking = await db.query.articles.findMany({
        where: eq(articles.isBreaking, true),
        orderBy: [desc(articles.publishedAt)],
        limit: 8,
      });
      if (breaking && breaking.length > 0) {
        return res.json(breaking);
      }
      // Fallback to latest published articles
      const latest = await db.query.articles.findMany({
        where: eq(articles.status, "published"),
        orderBy: [desc(articles.publishedAt)],
        limit: 6,
      });
      res.json(latest);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch breaking news" });
    }
  });

  // Live News Search Endpoint
  app.get("/api/search", async (req, res) => {
    try {
      const query = ((req.query.q as string) || "").trim().toLowerCase();
      if (!query) return res.json([]);
      const allArticles = await db.query.articles.findMany({
        where: eq(articles.status, "published"),
        orderBy: [desc(articles.publishedAt)],
        with: {
          category: true,
          author: true,
        },
      });
      const filtered = allArticles.filter(a =>
        a.title.toLowerCase().includes(query) ||
        (a.summary && a.summary.toLowerCase().includes(query)) ||
        (a.content && a.content.toLowerCase().includes(query)) ||
        (a.category?.name && a.category.name.toLowerCase().includes(query))
      );
      res.json(filtered);
    } catch (e) {
      res.status(500).json({ error: "Search failed" });
    }
  });

  // Article Comments Endpoints
  app.get("/api/articles/:id/comments", async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const articleComments = await db.query.comments.findMany({
        where: eq(comments.articleId, articleId),
        orderBy: [desc(comments.createdAt)],
        with: {
          user: true,
        },
      });
      res.json(articleComments);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.post("/api/articles/:id/comments", async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const { name, email, content } = req.body;
      if (!content || !content.trim()) {
        return res.status(400).json({ error: "प्रतिक्रिया (Comment) खाली हुनुहुँदैन।" });
      }

      const commentEmail = (email && email.trim()) || `reader_${Date.now()}@nayadristi.com`;
      const commentName = (name && name.trim()) || "नयाँदृष्टि पाठक";

      let user = await db.query.users.findFirst({
        where: eq(users.email, commentEmail),
      });

      if (!user) {
        const inserted = await db.insert(users).values({
          email: commentEmail,
          name: commentName,
          role: "subscriber",
        }).returning();
        user = inserted[0];
      }

      const newComment = await db.insert(comments).values({
        articleId,
        userId: user.id,
        content: content.trim(),
        status: "approved",
      }).returning();

      res.json({
        ...newComment[0],
        user: { name: user.name, email: user.email },
      });
    } catch (e: any) {
      res.status(500).json({ error: "कमेन्ट पोस्ट गर्न सकिएन: " + e.message });
    }
  });

  // Admin All Articles (includes drafts & published)
  app.get("/api/admin/articles", async (req, res) => {
    try {
      const allArticles = await db.query.articles.findMany({
        orderBy: [desc(articles.createdAt)],
        with: {
          category: true,
          author: true,
        },
      });
      res.json(allArticles);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to fetch admin articles" });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      const allCategories = await db.query.categories.findMany({
        orderBy: [categories.sortOrder],
      });
      res.json(allCategories);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Ensure Default Ads for All Standard Positions
  const ensureDefaultAds = async () => {
    try {
      const existing = await db.query.advertisements.findMany();
      if (existing.length < 5) {
        const defaultAdsList = [
          {
            title: "नेपाल टेलिकम - राष्ट्रको सञ्चार ५जी सेवा",
            position: "header",
            imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&auto=format&fit=crop&q=80",
            adUrl: "https://ntc.net.np",
            isActive: true,
          },
          {
            title: "नेपाल एयरलाइन्स - काठमाडौँ-बैंकक सिधा उडान अफर",
            position: "below_breaking",
            imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&auto=format&fit=crop&q=80",
            adUrl: "https://nepalairlines.com.np",
            isActive: true,
          },
          {
            title: "नबिल बैंक - सुरक्षित डिजिटल बैंकिङ र मुद्दती अफर",
            position: "sidebar",
            imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80",
            adUrl: "https://nabilbank.com",
            isActive: true,
          },
          {
            title: "ग्लोबल आइएमई बैंक - प्रिमियम बचत खाता योजना",
            position: "sidebar_bottom",
            imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80",
            adUrl: "https://globalimebank.com",
            isActive: true,
          },
          {
            title: "बजाज पल्सर - नयाँ गति, नयाँ विश्वास",
            position: "homepage_middle",
            imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80",
            adUrl: "https://bajajnepal.com",
            isActive: true,
          },
          {
            title: "आईएमई पे - सुरक्षित र सहज डिजिटल भुक्तानी",
            position: "article_top",
            imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80",
            adUrl: "https://imepay.com.np",
            isActive: true,
          },
          {
            title: "डिस्कभर नेपाल - एभरेस्ट तथा अन्नपूर्ण हेलि टुर प्याकेज",
            position: "article_middle",
            imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80",
            adUrl: "https://welcomenepal.com",
            isActive: true,
          },
          {
            title: "नेपाल पर्यटन वर्ष - घुमफिर नेपाल अभियान",
            position: "footer",
            imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80",
            adUrl: "https://welcomenepal.com",
            isActive: true,
          },
        ];

        for (const ad of defaultAdsList) {
          const found = existing.find(e => e.position === ad.position);
          if (!found) {
            await db.insert(advertisements).values(ad);
          }
        }
      }
    } catch (e) {
      console.error("Ad seeding error:", e);
    }
  };
  ensureDefaultAds();

  app.get("/api/advertisements", async (req, res) => {
    try {
      const ads = await db.query.advertisements.findMany({
        where: eq(advertisements.isActive, true),
        orderBy: [advertisements.id],
      });
      res.json(ads);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch ads" });
    }
  });

  app.get("/api/admin/advertisements", async (req, res) => {
    try {
      const ads = await db.query.advertisements.findMany({
        orderBy: [advertisements.id],
      });
      res.json(ads);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch all ads" });
    }
  });

  app.post("/api/advertisements", async (req, res) => {
    try {
      const { title, position, imageUrl, adUrl, htmlCode } = req.body;
      const result = await db.insert(advertisements).values({
        title,
        position: position || "homepage_middle",
        imageUrl,
        adUrl,
        htmlCode,
        isActive: true,
      }).returning();
      res.json(result[0]);
    } catch (e: any) {
      res.status(500).json({ error: "Failed to create ad: " + e.message });
    }
  });

  app.patch("/api/advertisements/:id/toggle", async (req, res) => {
    try {
      const adId = parseInt(req.params.id);
      const ad = await db.query.advertisements.findFirst({
        where: eq(advertisements.id, adId),
      });
      if (!ad) return res.status(404).json({ error: "Ad not found" });

      const updated = await db.update(advertisements)
        .set({ isActive: !ad.isActive })
        .where(eq(advertisements.id, adId))
        .returning();
      res.json(updated[0]);
    } catch (e: any) {
      res.status(500).json({ error: "Failed to toggle ad status" });
    }
  });

  app.delete("/api/advertisements/:id", async (req, res) => {
    try {
      await db.delete(advertisements).where(eq(advertisements.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to delete ad" });
    }
  });

  // Category CMS Routes
  app.post("/api/categories", async (req, res) => {
    try {
      const { name, slug, description } = req.body;
      const result = await db.insert(categories).values({ name, slug, description }).returning();
      res.json(result[0]);
    } catch (e) {
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      await db.delete(categories).where(eq(categories.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Article CMS Routes
  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await db.query.articles.findFirst({
        where: eq(articles.id, parseInt(req.params.id)),
      });
      res.json(article);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const { title, slug, summary, content, featuredImageUrl, imageCaption, categoryId, status, isFeatured, isBreaking, authorId } = req.body;
      if (!title || !title.trim()) {
        return res.status(400).json({ error: "समाचारको शीर्षक अनिवार्य छ।" });
      }

      let finalSlug = slug && slug.trim() ? slug.trim().toLowerCase().replace(/[\s/]+/g, "-") : `news-${Date.now()}`;
      // Ensure unique slug
      const existingSlug = await db.query.articles.findFirst({
        where: eq(articles.slug, finalSlug),
      });
      if (existingSlug) {
        finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
      }

      const result = await db.insert(articles).values({
        title: title.trim(),
        slug: finalSlug,
        summary: summary || "",
        content: content || "",
        featuredImageUrl: featuredImageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80",
        imageCaption: imageCaption || null,
        categoryId: categoryId ? parseInt(categoryId) : null,
        authorId: authorId ? parseInt(authorId) : null,
        status: status || "published",
        isFeatured: Boolean(isFeatured),
        isBreaking: Boolean(isBreaking),
        publishedAt: (status === "published" || !status) ? new Date() : null,
      }).returning();
      res.json(result[0]);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: "समाचार सुरक्षित गर्न सकिएन: " + e.message });
    }
  });

  app.put("/api/articles/:id", async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const existing = await db.query.articles.findFirst({
        where: eq(articles.id, articleId),
      });
      if (!existing) return res.status(404).json({ error: "Article not found" });

      const { title, slug, summary, content, featuredImageUrl, imageCaption, categoryId, status, isFeatured, isBreaking, authorId } = req.body;
      const targetStatus = status || existing.status;
      const pubDate = targetStatus === "published" 
        ? (existing.publishedAt || new Date()) 
        : null;

      const result = await db.update(articles).set({
        title: title ? title.trim() : existing.title,
        slug: slug ? slug.trim() : existing.slug,
        summary: summary !== undefined ? summary : existing.summary,
        content: content !== undefined ? content : existing.content,
        featuredImageUrl: featuredImageUrl !== undefined ? featuredImageUrl : existing.featuredImageUrl,
        imageCaption: imageCaption !== undefined ? imageCaption : existing.imageCaption,
        categoryId: categoryId ? parseInt(categoryId) : existing.categoryId,
        authorId: authorId ? parseInt(authorId) : existing.authorId,
        status: targetStatus,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
        isBreaking: isBreaking !== undefined ? Boolean(isBreaking) : existing.isBreaking,
        publishedAt: pubDate,
        updatedAt: new Date(),
      }).where(eq(articles.id, articleId)).returning();
      res.json(result[0]);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: "समाचार अपडेट गर्न सकिएन: " + e.message });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      await db.delete(articles).where(eq(articles.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // Authors Routes
  app.get("/api/authors", async (req, res) => {
    try {
      const allAuthors = await db.query.authors.findMany({
        orderBy: [desc(authors.createdAt)],
      });
      res.json(allAuthors);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch authors" });
    }
  });

  app.post("/api/authors", async (req, res) => {
    try {
      const { name, designation, bio, photoUrl } = req.body;
      const result = await db.insert(authors).values({ name, designation, bio, photoUrl }).returning();
      res.json(result[0]);
    } catch (e) {
      res.status(500).json({ error: "Failed to create author" });
    }
  });

  app.delete("/api/authors/:id", async (req, res) => {
    try {
      await db.delete(authors).where(eq(authors.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to delete author" });
    }
  });

  // Settings Routes
  app.get("/api/settings", async (req, res) => {
    try {
      const allSettings = await db.query.settings.findMany();
      const settingsMap: Record<string, any> = {};
      allSettings.forEach(s => {
        if (s.key !== "admin_credentials") {
          settingsMap[s.key as string] = s.value;
        }
      });
      res.json(settingsMap);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { key, value } = req.body;
      if (!key) return res.status(400).json({ error: "Key is required" });
      await db.insert(settings)
        .values({ key, value, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: settings.key,
          set: { value, updatedAt: new Date() },
        });
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to update setting" });
    }
  });

  // Protected Admin Stats
  app.get("/api/admin/stats", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (req.dbUser.role !== "admin" && req.dbUser.role !== "superadmin") {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const articlesCount = await db.$count(articles);
      const usersCount = await db.$count(users);
      const authorsCount = await db.$count(authors);
      const categoriesCount = await db.$count(categories);
      
      res.json({
        articles: articlesCount,
        users: usersCount,
        authors: authorsCount,
        categories: categoriesCount,
      });
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
