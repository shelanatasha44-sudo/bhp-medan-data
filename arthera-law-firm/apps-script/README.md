# Upload berkas klien ke Google Drive

`Code.gs` adalah web app Google Apps Script yang menerima berkas dari portal upload di situs dan menyimpannya ke folder Drive klien.

## Hasil di Drive

Berkas masuk ke subfolder sesuai bagiannya dan diberi nama seragam:

| Bagian | Folder | Nama berkas |
| --- | --- | --- |
| A | A. Identitas | `01 KTP Pemohon`, `02 NPWP` |
| B | B. Data Usaha (NIB) | `NIB` |
| C | C. Merek | `09 Logo Etiket Final`, `12 Foto Produk dan Kemasan` |
| D | D. Produk Kelas 3 | `Katalog Produk` |
| E | E. Tanda Tangan | `15 Surat Pernyataan dan Surat Kuasa`, `16 Bukti Transfer Pembayaran` |

Ringkasan isian teks disimpan sebagai `00 Ringkasan Isian.txt` di folder utama klien.

Kalau klien mengunggah ulang, versi lama dipindah ke subfolder `_Arsip` dengan cap waktu, tidak dihapus.

## Cara pasang

1. Masuk ke https://script.google.com dengan akun pemilik folder Drive klien.
2. Buat proyek baru, lalu tempel isi `Code.gs`.
3. Klik **Deploy → New deployment → Web app**. Pilih *Execute as: Me* dan *Who has access: Anyone*.
4. Setujui izin Drive, lalu salin URL yang berakhiran `/exec`.
5. Isi URL itu ke `DRIVE_UPLOAD_ENDPOINT` di `public/index.html`, lalu deploy ulang situs.

## Menambah klien

Tambahkan entri baru di `CLIENTS` (Nomor PKS, email klien, dan ID kelima subfolder), lalu buat deployment versi baru.

## Batasan

- Skrip menerima ringkasan isian teks (`kind: 'summary'`), tetapi portal di `public/index.html` belum mengirimkannya.
- Maksimal 15 MB per berkas; format JPG, PNG, PDF, DOC, DOCX.
- Login portal di situs berjalan di browser, jadi pemeriksaan Nomor PKS dan email di sini bukan pengaman kuat. Skrip hanya bisa menulis ke folder yang terdaftar di `CLIENTS`.
