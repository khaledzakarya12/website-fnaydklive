const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.shortLink = functions.https.onRequest(async (req, res) => {
  const shortId = req.path.replace("/", "");
  
  // جلب short link
  const querySnap = await db.collection("short_links").where("shortId", "==", shortId).limit(1).get();
  if (querySnap.empty) {
    res.status(404).send("الرابط غير موجود");
    return;
  }

  const shortData = querySnap.docs[0].data();
  const longUrl = shortData.longUrl; // /news/abc123

  // استخراج docId من longUrl (مثلاً /news/abc123 -> abc123)
  const docId = longUrl.split("/").pop();

  // جلب بيانات الخبر
  const newsSnap = await db.collection("all-news").doc(docId).get();
  if (!newsSnap.exists) {
    res.status(404).send("الخبر غير موجود");
    return;
  }

  const news = newsSnap.data();
  const title = news.title || "خبر";
  const description = news.content?.slice(0, 100) || "";
  const image = news.images?.[0] || news.imageUrl || "https://via.placeholder.com/500";

  // توليد صفحة HTML مع OG Tags + redirect
  const html = `
  <!DOCTYPE html>
  <html lang="ar">
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${req.protocol}://${req.get("host")}${req.originalUrl}" />
    <meta property="og:type" content="article" />
    <meta http-equiv="refresh" content="2;url=${longUrl}" />
  </head>
  <body>
    <p>جارٍ التحويل للخبر...</p>
  </body>
  </html>
  `;

  res.set("Content-Type", "text/html");
  res.send(html);
});
