import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3444296762705409";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <ins className="adsbygoogle"
         style={{ display: "block" }}
         data-ad-client="ca-pub-3444296762705409"
         data-ad-slot="1234567890"
         data-ad-format="auto"></ins>
  );
}
