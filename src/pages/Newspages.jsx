import React from "react";
import { Helmet } from "react-helmet";

const HomePage = () => {
  return (
    <div>
      <Helmet>
        <title>fnaydk.live</title>
        <meta name="description" content="شبكة أخبار تغطي آخر الأخبار المحلية والدولية بطريقة سريعة وموثوقة." />

        {/* Open Graph */}
        <meta property="og:title" content="fnaydk.live" />
        <meta property="og:description" content="شبكة أخبار تغطي آخر الأخبار المحلية والدولية بطريقة سريعة وموثوقة." />
        <meta property="og:image" content="preview.jpg" />
        <meta property="og:type" content="website" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              "headline": "أحدث الأخبار المحلية والدولية",
              "image": ["https://example.com/main-image.jpg"],
              "datePublished": "2025-08-26",
              "author": {
                "@type": "Organization",
                "name": "fnaydk.live"
              }
            }
          `}
        </script>
      </Helmet>

      <header style={{ background: "#111", color: "#fff", padding: "20px", textAlign: "center" }}>
        <h1>fnaydk.live</h1>
        <p>تابع آخر الأخبار المحلية والدولية</p>
      </header>

      <main style={{ padding: "20px" }}>
        <article style={{ background: "#fff", padding: "15px", marginBottom: "20px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
          <h2>أحدث الأخبار</h2>
          <p></p>
          <img src="preview.jpg" alt="أحدث الأخبار" style={{ maxWidth: "100%", borderRadius: "5px" }} />
        </article>
      </main>

      <footer style={{ background: "#111", color: "#fff", textAlign: "center", padding: "15px" }}>
        <p>جميع الحقوق محفوظة © 2025</p>
      </footer>
    </div>
  );
};

export default HomePage;
