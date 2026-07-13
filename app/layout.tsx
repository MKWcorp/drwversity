import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";

const DEFAULT_META_PIXEL_ID = "1748883439424330";
const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || DEFAULT_META_PIXEL_ID;
const HAS_VALID_META_PIXEL_ID = /^\d+$/.test(META_PIXEL_ID);
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID?.trim() ?? "";
const HAS_VALID_TIKTOK_PIXEL_ID = /^\d+$/.test(TIKTOK_PIXEL_ID);

// Baca GTM ID dari env — kosongkan jika tidak pakai GTM
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? "";
const HAS_VALID_GTM_ID = /^GTM-[A-Z0-9]+$/.test(GTM_ID);

const GTM_CODE = `
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${GTM_ID}');
`;

const GTM_NOSCRIPT = `
  <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
  height="0" width="0" style="display:none;visibility:hidden"></iframe>
`;

const META_PIXEL_CODE = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
`;

const META_PIXEL_NOSCRIPT = `
  <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1" />
`;

const TIKTOK_PIXEL_CODE = `
  !function (w, d, t) {
    w.TiktokAnalyticsObject = t;
    var ttq = (w[t] = w[t] || []);
    ttq.methods = [
      "page","track","identify","instances","debug","on","off","once",
      "ready","alias","group","enableCookie","disableCookie","holdConsent",
      "revokeConsent","grantConsent"
    ];
    ttq.setAndDefer = function (t, e) {
      t[e] = function () {
        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    for (var i = 0; i < ttq.methods.length; i++) {
      ttq.setAndDefer(ttq, ttq.methods[i]);
    }
    ttq.instance = function (t) {
      for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) {
        ttq.setAndDefer(e, ttq.methods[n]);
      }
      return e;
    };
    ttq.load = function (e, n) {
      var r = "https://analytics.tiktok.com/i18n/pixel/events.js",
        o = n && n.partner;
      ttq._i = ttq._i || {};
      ttq._i[e] = [];
      ttq._i[e]._u = r;
      ttq._t = ttq._t || {};
      ttq._t[e] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[e] = n || {};
      n = document.createElement("script");
      n.type = "text/javascript";
      n.async = !0;
      n.src = r + "?sdkid=" + e + "&lib=" + t;
      e = document.getElementsByTagName("script")[0];
      e.parentNode.insertBefore(n, e);
    };
    ttq.load("${TIKTOK_PIXEL_ID}");
    ttq.page();
  }(window, document, "ttq");
`;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://drwversity.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title:
    "DRWversity — Kuliah Tetap Jalan, Penghasilan Tambahan Bisa Didapatkan!",
  description:
    "Program pengembangan pelajar & mahasiswa dari DRW Skincare. Learn · Grow · Earn — GRATIS pendaftaran, tanpa stok barang, tanpa minimal belanja, bisnis anti-rugi. Belajar bisnis & digital marketing sambil kuliah.",
  keywords: [
    "DRWversity",
    "DRW Skincare",
    "bisnis mahasiswa",
    "penghasilan tambahan mahasiswa",
    "reseller skincare tanpa modal",
    "bisnis pelajar",
    "digital marketing mahasiswa",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "DRWversity",
    title:
      "DRWversity — Kuliah Tetap Jalan, Penghasilan Tambahan Bisa Didapatkan!",
    description:
      "Learn · Grow · Earn. Program mahasiswa dari DRW Skincare: GRATIS daftar, tanpa stok, bisnis anti-rugi. Daftar sekarang!",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DRWversity — Program Mahasiswa DRW Skincare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DRWversity — Kuliah Sambil Berpenghasilan",
    description:
      "Program pelajar & mahasiswa dari DRW Skincare. GRATIS daftar, tanpa stok, bisnis anti-rugi.",
    images: ["/images/og-image.jpg"],
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e11d48",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head />
      <body>
        {/* Google Tag Manager (noscript) */}
        {HAS_VALID_GTM_ID && (
          <noscript dangerouslySetInnerHTML={{ __html: GTM_NOSCRIPT }} />
        )}
        {/* End Google Tag Manager (noscript) */}
        {children}
        {/* Google Tag Manager */}
        {HAS_VALID_GTM_ID && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {GTM_CODE}
          </Script>
        )}
        {/* End Google Tag Manager */}
        {/* Meta Pixel Code Start */}
        {HAS_VALID_META_PIXEL_ID && (
          <>
            <noscript
              dangerouslySetInnerHTML={{ __html: META_PIXEL_NOSCRIPT }}
            />
            <Script id="meta-pixel" strategy="afterInteractive">
              {META_PIXEL_CODE}
            </Script>
          </>
        )}
        {/* Meta Pixel Code End */}
        {HAS_VALID_TIKTOK_PIXEL_ID && (
          <>
            {/* TikTok Pixel Code Start */}
            <Script id="tiktok-pixel" strategy="afterInteractive">
              {TIKTOK_PIXEL_CODE}
            </Script>
            {/* TikTok Pixel Code End */}
          </>
        )}
      </body>
    </html>
  );
}
