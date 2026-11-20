// Fungsi server Vercel: arsip laporan (draf dan selesai) milik semua pegawai.
// Isi laporan memuat data pribadi, jadi disimpan di Vercel Blob mode PRIVAT,
// tidak pernah di repo. Daftar, buka, dan hapus hanya untuk admin.
// Penyimpanan aktif setelah Blob store dihubungkan ke proyek Vercel
// (variabel BLOB_READ_WRITE_TOKEN atau BLOB_STORE_ID terisi otomatis).
import { put, get, list, del } from "@vercel/blob";
import { createHash, timingSafeEqual } from "node:crypto";

const ID = /^[a-z0-9]{12,32}$/;
const AKSES = { access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" };
const BATAS = 40 * 1024 * 1024; // 40 MB per laporan, cukup untuk puluhan foto

const hash = (s) => createHash("sha256").update(String(s)).digest();
function sandiBenar(masukan) {
  const asli = process.env.ADMIN_PASSWORD;
  if (!asli || typeof masukan !== "string") return false;
  return timingSafeEqual(hash(masukan), hash(asli));
}
const tunda = (ms) => new Promise((r) => setTimeout(r, ms));
const siap = () => !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
const teks = (v, n) => String(v == null ? "" : v).replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);

async function baca(pathname) {
  const r = await get(pathname, { access: "private", useCache: false }).catch(() => null);
  if (!r || r.statusCode !== 200) return null;
  try { return JSON.parse(await new Response(r.stream).text()); } catch (e) { return null; }
}
function rapikanMeta(m, id, lama) {
  m = m || {};
  return {
    id,
    judul: teks(m.judul, 200) || "Laporan tanpa judul",
    jenis: teks(m.jenis, 60),
    status: m.status === "selesai" ? "selesai" : "draft",
    pembuat: teks(m.pembuat, 120),
    tglKegiatan: teks(m.tglKegiatan, 20),
    ringkas: teks(m.ringkas, 300),
    dibuat: (lama && lama.dibuat) || new Date().toISOString(),
    diubah: new Date().toISOString(),
    kunci: lama && lama.kunci,
  };
}
const tanpaKunci = (m) => { const o = { ...m }; delete o.kunci; return o; };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ galat: "Metode tidak diizinkan." });
  const b = req.body || {};

  // ---- simpan: dipakai semua pegawai, tanpa kata sandi ----
  if (b.aksi === "simpan") {
    if (!siap()) return res.status(503).json({ galat: "Penyimpanan pusat belum diaktifkan.", belumAktif: true });
    const id = String(b.id || "");
    const kunci = String(b.kunci || "");
    if (!ID.test(id) || kunci.length < 16 || kunci.length > 64) return res.status(400).json({ galat: "Identitas laporan tidak sah." });
    if (!b.data || typeof b.data !== "object" || !Array.isArray(b.data.penetapan)) return res.status(400).json({ galat: "Isi laporan tidak sah." });
    const isi = JSON.stringify(b.data);
    if (isi.length > BATAS) return res.status(413).json({ galat: "Laporan terlalu besar untuk disimpan." });
    const lama = await baca("laporan/meta/" + id + ".json");
    // Laporan hanya bisa ditimpa oleh perangkat yang pertama kali menyimpannya (atau admin).
    if (lama && lama.kunci && !timingSafeEqual(hash(kunci), Buffer.from(lama.kunci, "hex")) && !sandiBenar(b.password))
      return res.status(409).json({ galat: "Laporan ini milik perangkat lain." });
    const meta = rapikanMeta(b.meta, id, lama);
    if (!meta.kunci) meta.kunci = hash(kunci).toString("hex");
    await put("laporan/isi/" + id + ".json", isi, AKSES);
    await put("laporan/meta/" + id + ".json", JSON.stringify(meta), AKSES);
    return res.status(200).json({ ok: true, diubah: meta.diubah });
  }

  // ---- aksi admin ----
  if (!sandiBenar(b.password)) {
    await tunda(1500);
    return res.status(401).json({ galat: "Kata sandi admin salah." });
  }
  if (b.aksi === "cek") return res.status(200).json({ ok: true, siap: siap() });
  if (!siap()) return res.status(503).json({ galat: "Penyimpanan pusat belum diaktifkan.", belumAktif: true });

  if (b.aksi === "daftar") {
    const nama = [];
    let cursor;
    do {
      const r = await list({ prefix: "laporan/meta/", cursor, limit: 1000 });
      r.blobs.forEach((x) => nama.push(x.pathname));
      cursor = r.hasMore ? r.cursor : undefined;
    } while (cursor);
    const hasil = [];
    for (let i = 0; i < nama.length; i += 25) {
      const bagian = await Promise.all(nama.slice(i, i + 25).map(baca));
      bagian.forEach((m) => { if (m && m.id) hasil.push(tanpaKunci(m)); });
    }
    hasil.sort((x, y) => String(y.diubah).localeCompare(String(x.diubah)));
    return res.status(200).json({ ok: true, laporan: hasil });
  }

  const id = String(b.id || "");
  if (!ID.test(id)) return res.status(400).json({ galat: "Identitas laporan tidak sah." });

  if (b.aksi === "ambil") {
    const [meta, data] = await Promise.all([baca("laporan/meta/" + id + ".json"), baca("laporan/isi/" + id + ".json")]);
    if (!data) return res.status(404).json({ galat: "Laporan tidak ditemukan." });
    return res.status(200).json({ ok: true, meta: meta ? tanpaKunci(meta) : null, data });
  }
  if (b.aksi === "hapus") {
    await del(["laporan/isi/" + id + ".json", "laporan/meta/" + id + ".json"]);
    return res.status(200).json({ ok: true });
  }
  return res.status(400).json({ galat: "Aksi tidak dikenal." });
}
