"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  GiftIcon,
  ShieldCheckIcon,
  ArchiveBoxXMarkIcon,
  ShoppingBagIcon,
  AcademicCapIcon,
  UsersIcon,
  BriefcaseIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  MegaphoneIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { trackCustomEvent, trackLead, trackViewContent } from "@/lib/meta-pixel";

// TikTok & Meta Pixel Analytics type declarations
declare global {
  interface Window {
    ttq: any;
    fbq: any;
  }
}

/**
 * DRWversity — Landing Page (Program Mahasiswa & Pelajar DRW Skincare)
 * Tech: Next.js + React + TailwindCSS (single-file component)
 * - Copy dikembangkan dari Narasi DRWversity.md (Learn · Grow · Earn).
 * - Target audiens: pelajar SMA/SMK & mahasiswa.
 * - Mobile-first, funnel konversi ke WhatsApp.
 * - Nomor WA dari env NEXT_PUBLIC_WA_NUMBER (default 62811944288 = sama repo reseller).
 * - PLACEHOLDER: angka statistik & testimoni masih dummy — ganti data asli sebelum publish.
 */

const WA_DEFAULT = "62811944288";

export default function LandingDRWversity() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Mahasiswa");
  const [campus, setCampus] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Page tracking (Meta + TikTok)
  useEffect(() => {
    if (typeof window !== "undefined" && window.ttq) {
      window.ttq.track("ViewContent", {
        content_name: "DRWversity Landing",
        content_category: "Landing Page",
        content_id: "drwversity_landing_v1",
      });
    }
    trackViewContent({
      content_name: "DRWversity Landing",
      content_category: "Landing Page",
    });
  }, []);

  // Grab UTM params for tracking
  const utm = useMemo(() => {
    if (typeof window === "undefined") return {} as Record<string, string>;
    const qp = new URLSearchParams(window.location.search);
    const keys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "fbclid",
      "ttclid",
    ];
    const obj: Record<string, string> = {};
    keys.forEach((k) => {
      const v = qp.get(k);
      if (v) obj[k] = v;
    });
    return obj;
  }, []);

  // Basic phone normalizer (IDN WhatsApp)
  function normalizePhone(p: string) {
    const digits = p.replace(/\D/g, "");
    if (digits.startsWith("62")) return digits;
    if (digits.startsWith("0")) return `62${digits.slice(1)}`;
    return `62${digits}`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name || !city || !phone)
      return setError("Lengkapi Nama, Kota, dan WhatsApp.");
    if (!/^\+?\d[\d\s-]{7,}$/.test(phone))
      return setError("Nomor WhatsApp tidak valid.");
    if (!agree) return setError("Setujui kebijakan data terlebih dahulu.");

    // TikTok Event: Lead Generated
    if (typeof window !== "undefined" && window.ttq) {
      window.ttq.track("SubmitForm", {
        content_name: "DRWversity Form",
        content_category: "Lead Generation",
      });
    }

    // Meta Pixel: Lead event
    trackLead({
      content_name: "Form Submit - Daftar DRWversity",
      content_category: "DRWversity",
    });

    const to = normalizePhone(process.env.NEXT_PUBLIC_WA_NUMBER || WA_DEFAULT);

    const payload = {
      name,
      status,
      campus,
      city,
      phone: normalizePhone(phone),
      ...utm,
    };

    const message = [
      `Halo DRW Skincare, saya tertarik gabung program DRWversity.`,
      `Nama: ${payload.name}`,
      `Status: ${payload.status}`,
      campus ? `Kampus/Sekolah: ${payload.campus}` : null,
      `Kota: ${payload.city}`,
      `WhatsApp: ${payload.phone}`,
      utm.utm_source ? `UTM Source: ${utm.utm_source}` : null,
      utm.utm_campaign ? `UTM Campaign: ${utm.utm_campaign}` : null,
      utm.utm_medium ? `UTM Medium: ${utm.utm_medium}` : null,
      utm.fbclid ? `fbclid: ${utm.fbclid}` : null,
      utm.ttclid ? `ttclid: ${utm.ttclid}` : null,
      `Mohon info pendaftaran dan jadwalkan sesi info gratis.`,
    ]
      .filter(Boolean)
      .join("\n");

    // encodeURIComponent agar aman dari karakter khusus (&, #, spasi) di teks/input user
    const wa = `https://wa.me/${to}?text=${encodeURIComponent(message)}`;
    window.location.href = wa;
  }

  function scrollToForm(buttonName: string = "CTA") {
    if (typeof window !== "undefined" && window.ttq) {
      window.ttq.track("ClickButton", {
        content_name: buttonName,
        content_category: "User Engagement",
      });
    }
    trackCustomEvent(buttonName, {
      custom_data: {
        content_name: buttonName,
        content_category: "Button Click",
      },
    });
    document
      .getElementById("lead-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openWhatsAppDirect() {
    if (typeof window !== "undefined" && window.ttq) {
      window.ttq.track("Contact", {
        content_name: "WhatsApp Chat",
        content_category: "Direct Contact",
      });
    }
    trackCustomEvent("Chat via WhatsApp - Buka Chat", {
      custom_data: {
        content_name: "Chat via WhatsApp - Buka Chat",
        content_category: "Contact",
      },
    });
    const waNumber = normalizePhone(
      process.env.NEXT_PUBLIC_WA_NUMBER || WA_DEFAULT
    );
    const message =
      "Halo, saya tertarik gabung program DRWversity dari DRW Skincare";
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(waUrl, "_blank");
  }

  function toggleChat() {
    if (!isChatOpen) {
      trackCustomEvent("Chat Widget - Buka WhatsApp Chat", {
        custom_data: {
          content_name: "Chat Widget - Buka WhatsApp Chat",
          content_category: "Contact",
        },
      });
    }
    setIsChatOpen(!isChatOpen);
  }

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 antialiased">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/85 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/favicon.ico"
              alt="DRWversity"
              className="h-9 w-9 rounded-xl"
            />
            <div className="leading-tight">
              <div className="font-extrabold tracking-tight">DRWversity</div>
              <div className="text-[10px] text-slate-500 -mt-0.5">
                by DRW Skincare
              </div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#benefits" className="hover:text-rose-600">
              Benefit
            </a>
            <a href="#cara-kerja" className="hover:text-rose-600">
              Cara Kerja
            </a>
            <a href="#testimoni" className="hover:text-rose-600">
              Testimoni
            </a>
            <a href="#faq" className="hover:text-rose-600">
              FAQ
            </a>
          </nav>
          <button
            onClick={() => scrollToForm("Daftar Gratis - Navbar")}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-700 active:scale-95 transition"
          >
            Daftar Gratis
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-rose-50 via-pink-50/40 to-white" />
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-14 md:py-24 grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          {/* Copy */}
          <div className="text-center md:text-left order-2 md:order-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 text-rose-700 px-3 py-1 text-xs font-semibold">
              🎓 GRATIS Pendaftaran • Program Mahasiswa & Pelajar
            </span>
            <h1 className="mt-4 text-[28px] leading-[1.15] sm:text-4xl md:text-5xl font-extrabold">
              Kuliah Tetap Jalan,
              <span className="text-rose-600">
                {" "}
                Penghasilan Tambahan Bisa Didapatkan!
              </span>
            </h1>
            <p className="mt-4 text-slate-600 md:text-lg">
              <span className="font-semibold text-slate-800">DRWversity</span>{" "}
              adalah program pengembangan pelajar &amp; mahasiswa dari{" "}
              <span className="font-semibold">DRW Skincare</span>.{" "}
              <span className="font-semibold text-rose-600">
                Learn · Grow · Earn
              </span>{" "}
              — belajar bisnis &amp; digital marketing, bertumbuh dalam
              komunitas, dan menghasilkan sejak di bangku kuliah.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button
                onClick={() => scrollToForm("Daftar Sekarang - Hero")}
                className="rounded-2xl bg-rose-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-rose-600/20 hover:-translate-y-0.5 active:translate-y-0 transition"
              >
                Daftar Sekarang — Gratis
              </button>
              <a
                href="#cara-kerja"
                className="rounded-2xl px-6 py-3.5 font-semibold border border-slate-200 hover:bg-slate-50 text-center"
              >
                Lihat Cara Kerja
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 justify-center md:justify-start text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" /> GRATIS
                daftar
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" /> Tanpa stok
                barang
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" /> Bisnis
                anti-rugi*
              </div>
            </div>
          </div>

          {/* Video hero (9:16 native) */}
          <div className="relative flex justify-center order-1 md:order-2">
            <div className="relative w-[240px] sm:w-[280px] md:w-full md:max-w-[340px]">
              <video
                ref={videoRef}
                src="/hero-video.mp4"
                poster="/hero-poster.jpg"
                autoPlay
                loop
                playsInline
                muted
                preload="metadata"
                className="w-full aspect-[9/16] rounded-3xl object-cover shadow-2xl shadow-rose-200/60 bg-black ring-1 ring-black/5"
              />
              <button
                onClick={toggleMute}
                className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition-all"
                aria-label={isMuted ? "Aktifkan suara" : "Matikan suara"}
              >
                {isMuted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-6.364-2.636a9 9 0 010-12.728"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LEARN · GROW · EARN STRIP */}
      <section className="border-y border-rose-100 bg-rose-50/40">
        <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: AcademicCapIcon,
              t: "Learn",
              d: "Belajar bisnis & digital marketing lewat pelatihan dan mentoring nyata.",
            },
            {
              icon: ArrowTrendingUpIcon,
              t: "Grow",
              d: "Bertumbuh bersama komunitas mahasiswa lintas kampus se-Indonesia.",
            },
            {
              icon: CurrencyDollarIcon,
              t: "Earn",
              d: "Dapatkan penghasilan tambahan tanpa modal stok & tanpa minimal belanja.",
            },
          ].map((p, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl bg-white/70 p-4"
            >
              <div className="h-11 w-11 shrink-0 rounded-xl bg-rose-600 text-white flex items-center justify-center">
                <p.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="font-extrabold text-rose-700">{p.t}</div>
                <p className="text-sm text-slate-600">{p.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM → SOLUTION */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          <div className="rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
            <h2 className="text-lg md:text-xl font-bold">
              Sering dialami mahasiswa & pelajar
            </h2>
            <ul className="mt-4 space-y-3 text-slate-600">
              <li>• Uang saku pas-pasan, pengen punya penghasilan sendiri</li>
              <li>• Mau usaha tapi bingung, gak punya modal besar</li>
              <li>• Takut rugi kalau harus nyetok barang</li>
              <li>• Belum punya pengalaman bisnis & relasi</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-rose-600 p-6 md:p-8 text-white shadow-lg shadow-rose-600/20">
            <h3 className="text-lg md:text-xl font-bold">
              Solusinya: DRWversity
            </h3>
            <p className="mt-3 opacity-95">
              Program mahasiswa dari DRW Skincare yang mudah, aman, dan didampingi
              sampai bisa.
            </p>
            <ul className="mt-5 space-y-3">
              <li>✓ GRATIS daftar — mulai tanpa biaya registrasi</li>
              <li>✓ Tanpa stok barang & tanpa minimal belanja</li>
              <li>✓ Produk tidak terjual? Uang kembali 100%*</li>
              <li>✓ Dilatih bisnis, digital marketing & personal branding</li>
              <li>✓ Komunitas aktif lintas kampus</li>
            </ul>
          </div>
        </div>
      </section>

      {/* BENEFITS (7) */}
      <section id="benefits" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold">
            Kenapa Harus Gabung DRWversity?
          </h2>
          <p className="mt-3 text-slate-600">
            Semua yang kamu butuhkan untuk mulai bisnis sejak kuliah — tanpa
            risiko, tanpa ribet.
          </p>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[
            {
              title: "GRATIS Biaya Pendaftaran",
              desc: "Mulai perjalananmu tanpa biaya registrasi sepeser pun.",
              icon: GiftIcon,
            },
            {
              title: "Bisnis Anti Rugi",
              desc: "Produk tidak terjual? Uang kembali 100%* (S&K berlaku).",
              icon: ShieldCheckIcon,
            },
            {
              title: "Tanpa Harus Stock Barang",
              desc: "Jalankan bisnis lebih mudah tanpa menyimpan stok produk.",
              icon: ArchiveBoxXMarkIcon,
            },
            {
              title: "Tanpa Minimal Pembelanjaan",
              desc: "Tidak ada kewajiban membeli produk dalam jumlah tertentu.",
              icon: ShoppingBagIcon,
            },
            {
              title: "Belajar Bisnis & Digital Marketing",
              desc: "Pelatihan, mentoring, dan pengalaman nyata untuk kembangkan skill.",
              icon: AcademicCapIcon,
            },
            {
              title: "Bertumbuh Bersama Komunitas",
              desc: "Terhubung dengan mahasiswa berbagai kampus yang sukses bersama.",
              icon: UsersIcon,
            },
            {
              title: "Bangun Pengalaman Sejak Kuliah",
              desc: "Asah komunikasi, kepemimpinan, personal branding & entrepreneurship.",
              icon: BriefcaseIcon,
            },
          ].map((b, i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-100 p-5 md:p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <div className="h-11 w-11 rounded-xl bg-rose-100 mb-4 flex items-center justify-center">
                <b.icon className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="font-bold">{b.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{b.desc}</p>
            </div>
          ))}
          {/* CTA card mengisi grid ke-8 */}
          <div className="rounded-3xl bg-gradient-to-br from-rose-600 to-pink-700 p-6 text-white shadow-lg flex flex-col justify-center">
            <h3 className="text-lg font-extrabold">Siap mulai hari ini?</h3>
            <p className="mt-2 text-sm text-white/90">
              Daftar gratis, tim kami bantu kamu dari nol.
            </p>
            <button
              onClick={() => scrollToForm("Daftar Gratis - Benefit Card")}
              className="mt-4 rounded-xl bg-white px-4 py-2.5 font-semibold text-rose-700 hover:bg-rose-50"
            >
              Daftar Gratis Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* CARA KERJA */}
      <section
        id="cara-kerja"
        className="bg-slate-50 border-y border-slate-100"
      >
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Cara Mulainya Gampang
            </h2>
            <p className="mt-3 text-slate-600">
              Empat langkah, semuanya kami dampingi.
            </p>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                n: "1",
                t: "Daftar Gratis",
                d: "Isi form & terhubung dengan tim kami via WhatsApp. Tanpa biaya.",
              },
              {
                n: "2",
                t: "Onboarding & Training",
                d: "Ikuti pelatihan online: produk, bisnis, dan digital marketing.",
              },
              {
                n: "3",
                t: "Mulai Jualan Tanpa Stok",
                d: "Pakai sistem & materi promosi siap pakai — tak perlu simpan barang.",
              },
              {
                n: "4",
                t: "Dapat Penghasilan + Skill",
                d: "Raih penghasilan tambahan sambil bangun pengalaman & relasi.",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="relative rounded-3xl bg-white border border-slate-100 p-6 shadow-sm"
              >
                <div className="h-10 w-10 rounded-full bg-rose-600 text-white font-extrabold flex items-center justify-center">
                  {s.n}
                </div>
                <h3 className="mt-4 font-bold">{s.t}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={() => scrollToForm("Mulai Sekarang - Cara Kerja")}
              className="rounded-2xl bg-rose-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-700"
            >
              Mulai Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* UNTUK SIAPA */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold">
            Cocok Untuk Kamu Yang…
          </h2>
        </div>
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {[
            {
              // PLACEHOLDER (AI-generated): ganti dengan foto asli bila ada
              img: "/images/pelajar.jpg",
              tag: "Pelajar SMA/SMK",
              points: [
                "Pengen punya uang jajan sendiri",
                "Belajar bisnis sejak dini",
                "Aktif di sosial media & suka jualan online",
              ],
            },
            {
              img: "/images/mahasiswa.jpg",
              tag: "Mahasiswa",
              points: [
                "Cari penghasilan tambahan tanpa ganggu kuliah",
                "Mau bangun pengalaman & relasi bisnis",
                "Ingin skill digital marketing & personal branding",
              ],
            },
          ].map((c, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm"
            >
              <img
                src={c.img}
                alt={c.tag}
                loading="lazy"
                className="h-52 w-full object-cover bg-rose-50"
              />
              <div className="p-6">
                <span className="inline-block rounded-full bg-rose-100 text-rose-700 px-3 py-1 text-xs font-semibold">
                  {c.tag}
                </span>
                <ul className="mt-4 space-y-2 text-slate-600 text-sm">
                  {c.points.map((p, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-rose-600">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF: STATS + TESTIMONI */}
      <section id="testimoni" className="bg-slate-50 border-y border-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          {/* Stats strip — PLACEHOLDER angka, ganti data asli */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-3xl mx-auto text-center">
            {[
              { n: "Se-Indonesia", l: "Jaringan bisnis DRW" },
              { n: "Ribuan+", l: "Anggota komunitas*" },
              { n: "Lintas Kampus", l: "Dari berbagai kota*" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="text-lg md:text-2xl font-extrabold text-rose-600">
                  {s.n}
                </div>
                <div className="text-xs md:text-sm text-slate-500 mt-1">
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          <h2 className="mt-12 text-center text-2xl md:text-3xl font-extrabold">
            Kata Mereka yang Sudah Gabung
          </h2>
          {/* PLACEHOLDER: testimoni & foto (AI-generated) — ganti dengan data asli */}
          <div className="mt-8 grid md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                img: "/images/avatar-1.jpg",
                name: "Salsa, Mahasiswi",
                campus: "PLACEHOLDER Kampus",
                quote:
                  "Awalnya cuma pengen tambahan uang jajan, sekarang malah belajar banyak soal jualan online. Gak perlu modal stok, jadi aman banget.",
              },
              {
                img: "/images/avatar-2.jpg",
                name: "Rizky, Mahasiswa",
                campus: "PLACEHOLDER Kampus",
                quote:
                  "Trainingnya jelas dan komunitasnya suportif. Sambil kuliah aku bisa punya penghasilan sendiri tanpa ganggu jadwal.",
              },
              {
                img: "/images/avatar-3.jpg",
                name: "Nadia, Mahasiswi",
                campus: "PLACEHOLDER Kampus",
                quote:
                  "Paling suka karena anti-rugi. Produk yang gak kejual bisa uang kembali. Jadi berani nyoba bisnis pertama kali.",
              },
            ].map((t, i) => (
              <figure
                key={i}
                className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm"
              >
                <blockquote className="text-slate-700 text-sm leading-relaxed">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <img
                    src={t.img}
                    alt={t.name}
                    loading="lazy"
                    className="h-11 w-11 rounded-full object-cover bg-rose-100"
                  />
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.campus}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE STACK / SUPPORT */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="rounded-3xl bg-gradient-to-br from-rose-600 to-pink-700 p-6 md:p-10 text-white">
          <h2 className="text-2xl md:text-3xl font-extrabold">
            Bukan Sekadar Jualan — Kamu Dibimbing Sampai Berkembang
          </h2>
          <p className="mt-3 text-white/90 max-w-2xl">
            Setiap anggota DRWversity mendapatkan pendampingan penuh untuk
            belajar, bertumbuh, dan menghasilkan.
          </p>
          <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[
              { icon: AcademicCapIcon, t: "Mentoring & training rutin" },
              { icon: MegaphoneIcon, t: "Materi promosi siap pakai" },
              { icon: ChatBubbleLeftRightIcon, t: "Grup komunitas aktif" },
              { icon: SparklesIcon, t: "Personal branding & leadership" },
              { icon: ArrowTrendingUpIcon, t: "Update produk & promo rutin" },
              { icon: UsersIcon, t: "Relasi lintas kampus se-Indonesia" },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl bg-white/10 p-4"
              >
                <s.icon className="h-6 w-6 shrink-0" />
                <span className="text-sm font-medium">{s.t}</span>
              </div>
            ))}
          </div>
          <div className="mt-7">
            <button
              onClick={() => scrollToForm("Daftar Sekarang - Value Stack")}
              className="rounded-2xl bg-white px-6 py-3 font-semibold text-rose-700 hover:bg-rose-50"
            >
              Daftar Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold">
          Pertanyaan yang Sering Ditanyakan
        </h2>
        <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-100 overflow-hidden">
          {[
            {
              q: "Apakah pendaftarannya benar-benar gratis?",
              a: "Ya. Pendaftaran DRWversity 100% GRATIS, tanpa biaya registrasi dan tanpa minimal pembelanjaan.",
            },
            {
              q: "Apakah saya harus stok barang?",
              a: "Tidak. Kamu bisa menjalankan bisnis tanpa menyimpan stok produk sama sekali.",
            },
            {
              q: "Bagaimana kalau produk tidak terjual?",
              a: "DRWversity menerapkan konsep bisnis anti-rugi: produk yang tidak terjual, uang kembali 100%* sesuai Syarat & Ketentuan yang berlaku.",
            },
            {
              q: "Saya masih kuliah/sekolah, apakah bisa ikut?",
              a: "Sangat bisa. Program ini memang dirancang untuk pelajar SMA/SMK & mahasiswa agar bisa belajar bisnis sambil tetap fokus pendidikan.",
            },
            {
              q: "Perlu pengalaman jualan sebelumnya?",
              a: "Tidak perlu. Kami menyediakan training, mentoring, materi promosi, dan komunitas untuk membimbingmu dari nol.",
            },
            {
              q: "Bagaimana cara mendaftarnya?",
              a: "Isi form di bawah. Tim kami akan menghubungi via WhatsApp untuk info pendaftaran dan sesi info gratis.",
            },
          ].map((f, i) => (
            <details key={i} className="group open:bg-rose-50/40">
              <summary className="cursor-pointer list-none px-5 md:px-6 py-4 md:py-5 font-semibold hover:bg-slate-50 flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-sm">
                  {i + 1}
                </span>
                <span className="flex-1">{f.q}</span>
                <span className="text-rose-400 transition group-open:rotate-45 text-xl leading-none">
                  +
                </span>
              </summary>
              <div className="px-5 md:px-6 pb-5 pl-14 text-slate-600 text-sm">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* LEAD FORM */}
      <section id="lead-form" className="bg-rose-50/50 border-t border-rose-100">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-600 text-white px-3 py-1 text-xs font-semibold">
              ✨ GRATIS PENDAFTARAN
            </span>
            <h2 className="mt-4 text-2xl md:text-3xl font-extrabold">
              Daftar Sekarang & Mulai Perjalananmu
            </h2>
            <p className="mt-3 text-slate-600">
              Isi data singkat di bawah. Tim kami akan menghubungi via WhatsApp
              untuk info pendaftaran & sesi info gratis.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              <li>✨ GRATIS pendaftaran</li>
              <li>✨ Tanpa minimal pembelanjaan</li>
              <li>✨ Tanpa harus stock barang</li>
              <li>✨ Bisnis anti-rugi* (S&K berlaku)</li>
            </ul>
          </div>
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-100 bg-white p-5 md:p-6 shadow-lg shadow-rose-100/50"
          >
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium">Nama Lengkap</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
                  placeholder="Tulis nama kamu"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200 bg-white"
                >
                  <option>Mahasiswa</option>
                  <option>Pelajar SMA/SMK</option>
                  <option>Fresh Graduate</option>
                  <option>Lainnya</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">
                  Kampus / Sekolah{" "}
                  <span className="text-slate-400">(opsional)</span>
                </label>
                <input
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
                  placeholder="Contoh: Universitas ..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Kota Domisili</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
                  placeholder="Contoh: Yogyakarta"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nomor WhatsApp</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  inputMode="tel"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
                  placeholder="Contoh: 0812xxxxxxx"
                />
              </div>
              <div className="flex items-start gap-3 text-sm">
                <input
                  id="agree"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300"
                />
                <label htmlFor="agree" className="select-none text-slate-600">
                  Saya setuju data saya digunakan untuk keperluan pendaftaran
                  DRWversity sesuai{" "}
                  <a
                    className="underline"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    Kebijakan Privasi
                  </a>
                  .
                </label>
              </div>
              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="rounded-2xl bg-rose-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-700 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
                Daftar via WhatsApp
              </button>
              <p className="text-xs text-slate-500 text-center">
                Dengan menekan tombol ini kamu akan diarahkan ke WhatsApp
                official DRW Skincare.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* CLOSING BANNER */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16 text-center">
        <h2 className="text-2xl md:text-4xl font-extrabold">
          Learn <span className="text-rose-600">·</span> Grow{" "}
          <span className="text-rose-600">·</span> Earn
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-slate-600">
          Jangan hanya jadi mahasiswa yang mengejar nilai. Jadilah yang membangun
          pengalaman, memperluas relasi, mengasah skill, dan punya penghasilan
          tambahan sejak di bangku kuliah.
        </p>
        <button
          onClick={() => scrollToForm("Daftar Gratis - Closing")}
          className="mt-7 rounded-2xl bg-rose-600 px-8 py-4 font-semibold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-700"
        >
          Daftar Gratis Sekarang
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/favicon.ico"
                alt="DRWversity"
                className="h-8 w-8 rounded-lg"
              />
              <div>
                <div className="font-extrabold text-slate-800">DRWversity</div>
                <div className="text-xs">
                  Program Mahasiswa & Pelajar dari DRW Skincare
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <a className="hover:text-rose-600" href="#">
                Kebijakan Privasi
              </a>
              <a className="hover:text-rose-600" href="#">
                Syarat &amp; Ketentuan
              </a>
              <button
                onClick={openWhatsAppDirect}
                className="hover:text-rose-600"
              >
                Kontak
              </button>
            </div>
          </div>
          <div className="mt-6 text-xs text-slate-400">
            *Syarat &amp; Ketentuan berlaku. © {new Date().getFullYear()}{" "}
            DRWversity — DRW Skincare. All rights reserved.
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Chat Button */}
      <div className="fixed bottom-5 right-5 z-50">
        {isChatOpen && (
          <div className="mb-4 bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 w-[19rem] max-w-[calc(100vw-2.5rem)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faWhatsapp}
                    className="w-6 h-6 text-white"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">DRWversity</h3>
                  <p className="text-xs text-green-600">● Online</p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Tutup chat"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-sm text-slate-700">Halo! 👋</p>
                <p className="text-sm text-slate-700 mt-1">
                  Tertarik gabung DRWversity? Yuk daftar gratis sekarang!
                </p>
              </div>
              <button
                onClick={openWhatsAppDirect}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
                Chat via WhatsApp
              </button>
            </div>
          </div>
        )}

        <button
          onClick={toggleChat}
          className="bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Buka WhatsApp chat"
        >
          {isChatOpen ? (
            <XMarkIcon className="w-7 h-7" />
          ) : (
            <FontAwesomeIcon icon={faWhatsapp} className="w-7 h-7" />
          )}
        </button>
      </div>
    </div>
  );
}
