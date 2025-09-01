
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendNewsNotification = onDocumentCreated(
  "all-news/{newsId}",
  async (event) => {
    const news = event.data.data(); // snapshot -> object
    const newsUrl = `${process.env.WEB_URL || "https://fnaydk.live"}/news/${event.params.newsId}`;

    // جلب كل التوكنات
    const tokensSnapshot = await admin.firestore().collection("tokens").get();
    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

    if (!tokens.length) return null;

    const message = {
      notification: {
        title: "📢 خبر جديد!",
        body: news.title,
      },
      data: {
        url: newsUrl,
      },
      tokens,
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log("✅ نجاح:", response.successCount, "❌ فشل:", response.failureCount);

    return null;
  }
);

