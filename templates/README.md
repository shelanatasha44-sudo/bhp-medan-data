# Template dokumen BHP Medan

Folder ini menyimpan semua naskah baku yang dipakai `laporan.html`. Semuanya bisa diubah langsung di GitHub (buka berkas, klik ikon pensil, simpan) dari komputer atau ponsel mana pun.

| Berkas | Isi | Dipakai aplikasi? |
|---|---|---|
| `naskah.js` | Pilihan jenis kegiatan, pilihan hasil penyumpahan, paragraf "Umum", maksud dan tujuan, dasar hukum, kop surat | Ya, dimuat setiap kali aplikasi dibuka |
| `dokumen/laporan-kegiatan.md` | Kerangka laporan kegiatan (semua tusi) | Acuan |
| `dokumen/laporan-penyumpahan.md` | Kalimat baku laporan penyumpahan wali/pengampu per hasil | Acuan |
| `dokumen/laporan-koordinasi.md` | Variasi laporan koordinasi dan rapat koordinasi | Acuan |
| `dokumen/laporan-kepailitan-lapangan.md` | Variasi laporan kegiatan lapangan kepailitan | Acuan |
| `dokumen/surat-tugas.md` | Kerangka surat tugas dan lampirannya | Acuan |
| `dokumen/surat-pengantar.md` | Kerangka surat pengantar laporan | Acuan |

Isian ditulis dalam kurung kurawal, misalnya `{nama wali}`.

## Aturan

- Repo ini publik. Jangan menyimpan dokumen asli yang memuat nama anak, terampu, alamat, atau kondisi kesehatan. Simpan templatenya saja.
- Di `naskah.js`, ubah hanya teks di dalam tanda kutip. Jangan menghapus koma, kurung, atau tanda kutip.

## Sinkronisasi

- Perubahan di cabang kerja (`ccr-*`, `claude/*`) digabung otomatis ke `main` oleh `.github/workflows/gabung-otomatis.yml`.
- Aplikasi memuat `naskah.js` terbaru setiap kali dibuka, tanpa perlu menghapus cache.

## Laman AI

Langkah "AI" di aplikasi memanggil Claude API langsung dari browser. Kunci API dimasukkan tiap pegawai di aplikasi dan hanya tersimpan di browser perangkat itu. **Jangan pernah menulis kunci API di berkas mana pun di repo ini**: repo ini publik, dan kunci yang bocor bisa dipakai orang lain atas tagihan Anda.
