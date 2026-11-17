// Fungsi server Vercel: satu-satunya jalan aplikasi ke Claude API.
// Kunci API (ANTHROPIC_API_KEY) dan kata sandi admin (ADMIN_PASSWORD) hanya ada
// di Environment Variables proyek Vercel, tidak pernah di browser atau di repo.
import Anthropic from "@anthropic-ai/sdk";
import { createHash, timingSafeEqual } from "node:crypto";

const MODEL = "claude-opus-5-5";
const SISTEM =
  "Anda membantu pegawai Balai Harta Peninggalan (BHP) Medan menyusun laporan kegiatan resmi. " +
  "Gunakan bahasa Indonesia baku bergaya laporan dinas: lugas, kalimat lengkap, tanpa kata berlebihan. " +
  "Jangan mengarang fakta. Gunakan hanya data, catatan pegawai, dan apa yang benar-benar terlihat atau tertulis pada foto. " +
  "Bila sesuatu tidak terbaca atau tidak diketahui, biarkan kosong. " +
  "Balas HANYA dengan satu objek JSON sesuai bentuk yang diminta, tanpa teks pembuka, penutup, atau pagar kode.";

const hash = (s) => createHash("sha256").update(String(s)).digest();
function sandiBenar(masukan) {
  const asli = process.env.ADMIN_PASSWORD;
  if (!asli || typeof masukan !== "string") return false;
  return timingSafeEqual(hash(masukan), hash(asli));
}
const tunda = (ms) => new Promise((r) => setTimeout(r, ms));

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ galat: "Metode tidak diizinkan." });
  const body = req.body || {};
  if (!sandiBenar(body.password)) {
    await tunda(1500); // memperlambat tebakan kata sandi
    return res.status(401).json({ galat: "Kata sandi admin salah." });
  }
  if (body.cek) return res.status(200).json({ ok: true, siap: !!process.env.ANTHROPIC_API_KEY });
  if (!process.env.ANTHROPIC_API_KEY)
    return res.status(503).json({ galat: "Kunci API Claude belum dipasang di Vercel (ANTHROPIC_API_KEY)." });
  if (!Array.isArray(body.content) || !body.content.length)
    return res.status(400).json({ galat: "Isi permintaan kosong." });

  const client = new Anthropic();
  try {
    const r = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SISTEM,
      messages: [{ role: "user", content: body.content }],
    });
    const text = r.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    return res.status(200).json({ stop_reason: r.stop_reason, text });
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError)
      return res.status(502).json({ galat: "Kunci API Claude di Vercel ditolak. Periksa ANTHROPIC_API_KEY." });
    if (e instanceof Anthropic.RateLimitError)
      return res.status(429).json({ galat: "Batas pemakaian tercapai. Coba lagi sebentar lagi." });
    if (e instanceof Anthropic.BadRequestError)
      return res.status(400).json({ galat: "Permintaan ditolak: " + e.message });
    if (e instanceof Anthropic.APIError)
      return res.status(502).json({ galat: "Layanan Claude sedang bermasalah (" + e.status + "). Coba lagi nanti." });
    return res.status(500).json({ galat: "Galat server: " + (e && e.message) });
  }
}
