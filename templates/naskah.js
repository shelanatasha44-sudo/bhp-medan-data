/* NASKAH BAKU — Pembuat Laporan Kegiatan BHP Medan
   Berkas ini boleh diedit langsung di GitHub (ikon pensil) dari mana saja.
   Aplikasi laporan.html memuat berkas ini setiap kali dibuka, jadi perubahan langsung berlaku.
   Aturan: jangan menghapus tanda kutip, koma, atau kurung; ubah hanya teks di dalam tanda kutip. */

/* Hasil penyumpahan per penetapan. */
var HASIL = [
  { id: "berhasil_pnbp", grup: "Berhasil disumpah", cls: "ok", sukses: true, pnbp: true,
    label: "Berhasil disumpah — ada harta, PNBP dimintakan", singkat: "Berhasil disumpah, PNBP dimintakan" },
  { id: "berhasil_nihil", grup: "Berhasil disumpah", cls: "ok", sukses: true,
    label: "Berhasil disumpah — tidak ada harta, PNBP tidak dapat dimintakan", singkat: "Berhasil disumpah, tidak ada harta (PNBP nihil)" },
  { id: "gagal_menolak", grup: "Tidak berhasil disumpah", cls: "bad",
    label: "Tidak berhasil — wali/pengampu menolak disumpah", singkat: "Tidak berhasil, menolak disumpah",
    sub: ["Keberatan atas pengenaan PNBP", "Merasa tidak memerlukan penyumpahan", "Tidak menyebutkan alasan"] },
  { id: "gagal_tidak_ditemui", grup: "Tidak berhasil disumpah", cls: "bad",
    label: "Tidak berhasil — wali/pengampu tidak dapat ditemui", singkat: "Tidak berhasil, tidak dapat ditemui",
    sub: ["Tidak berada di tempat", "Telah pindah alamat", "Alamat tidak ditemukan", "Telah meninggal dunia"] },
  { id: "ditunda", grup: "Ditunda", cls: "warn",
    label: "Ditunda / dijadwalkan ulang", singkat: "Ditunda / dijadwalkan ulang" },
  { id: "jadwal_zoom", grup: "Ditunda", cls: "warn",
    label: "Dijadwalkan ulang — penyumpahan virtual (Zoompah)", singkat: "Dijadwalkan ulang secara virtual (Zoompah)" }
];
var AGAMA = ["", "Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"].map(function (a) { return { id: a, label: a || "— tidak dicantumkan —" }; });

/* Paragraf "Umum" baku (diambil dari template Laporan Penyumpahan Wali). */
var UMUM_WALI = [
  "Perwalian (voogdij) merupakan instrumen perlindungan hukum yang sangat penting dalam ruang lingkup hukum perdata di Indonesia. Hal ini merupakan wujud tanggung jawab negara untuk memberikan perlindungan dan pemenuhan hak keperdataan bagi anak di bawah umur yang tidak lagi berada di bawah kekuasaan orang tuanya. Secara hukum, anak yang belum berusia 18 (delapan belas) tahun atau belum menikah dianggap belum cakap bertindak secara mandiri dalam suatu perbuatan hukum (handelingsonbekwaam). Oleh karena itu, seluruh perbuatan hukum yang berkaitan dengan pemeliharaan diri, pendidikan, dan pengurusan harta kekayaannya harus diwakili oleh seorang wali yang ditunjuk sah melalui penetapan pengadilan, demi kepentingan terbaik bagi anak (the best interest of the child).",
  "Di Indonesia, mekanisme perwalian diatur secara jelas dalam Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan, Kompilasi Hukum Islam (KHI), serta Kitab Undang-Undang Hukum Perdata (KUHPerdata). Aturan-aturan tersebut membatasi kewenangan wali agar tidak terjadi penyalahgunaan yang merugikan masa depan anak. Untuk mencegah kelalaian maupun penyusutan nilai aset milik anak di bawah umur, negara hadir melalui Balai Harta Peninggalan (BHP) yang bertindak selaku Wali Pengawas (toeziende voogd).",
  "Sesuai ketentuan Pasal 366, 368, dan 370 KUHPerdata, sebelum seorang wali dapat menjalankan fungsinya, ia wajib mengadakan inventarisasi harta kekayaan anak dan mengelolanya dengan iktikad baik layaknya seorang “bapak yang baik” (als een goed huisvader). Sebagai komitmen mengikat agar wali patuh pada aturan hukum, setiap wali wajib terlebih dahulu mengangkat sumpah di hadapan Pejabat BHP."
];
var UMUM_AMPU = [
  "Pengampuan (curatele) merupakan instrumen perlindungan hukum bagi orang dewasa yang karena keadaan dirinya tidak cakap bertindak sendiri dalam suatu perbuatan hukum. Berdasarkan Pasal 433 KUHPerdata, orang dewasa yang berada dalam keadaan tertentu sehingga tidak mampu mengurus kepentingannya sendiri ditempatkan di bawah pengampuan, dan seluruh perbuatan hukum yang berkaitan dengan diri maupun harta kekayaannya diwakili oleh seorang pengampu yang diangkat melalui penetapan pengadilan.",
  "Untuk mencegah kelalaian maupun penyalahgunaan dalam pengurusan harta kekayaan orang yang berada di bawah pengampuan (terampu), negara hadir melalui Balai Harta Peninggalan (BHP) yang bertindak selaku Pengampu Pengawas sebagaimana diatur dalam Pasal 449 KUHPerdata.",
  "Sesuai Pasal 452 KUHPerdata, ketentuan mengenai perwalian berlaku pula terhadap pengampuan, sehingga pengampu wajib mengadakan inventarisasi harta kekayaan terampu, mengelolanya dengan iktikad baik, serta terlebih dahulu mengangkat sumpah di hadapan Pejabat BHP."
];

/* Jenis kegiatan (tusi). "penyumpahan" memakai formulir per penetapan; lainnya memakai kerangka yang sama dengan isian bebas. */
var JENIS = [
  { id: "penyumpahan", label: "Penyumpahan Wali / Pengampu dan Pencatatan Harta" },
  { id: "kepailitan", label: "Kepailitan — kegiatan lapangan (pencarian debitor, penilaian/pengamanan aset, rapat kreditor)",
    judul: "PELAKSANAAN TUGAS KURATOR DALAM PENGURUSAN DAN PEMBERESAN HARTA PAILIT",
    umum: ["Berdasarkan Pasal 70 ayat (1) Undang-Undang Nomor 37 Tahun 2004 tentang Kepailitan dan Penundaan Kewajiban Pembayaran Utang, Balai Harta Peninggalan merupakan Kurator yang bertugas melakukan pengurusan dan/atau pemberesan harta pailit di bawah pengawasan Hakim Pengawas."],
    maksud: ["Melaksanakan tugas Balai Harta Peninggalan selaku Kurator dalam pengurusan dan/atau pemberesan harta pailit;"],
    dasar: ["Undang-Undang Nomor 37 Tahun 2004 tentang Kepailitan dan Penundaan Kewajiban Pembayaran Utang;"] },
  { id: "takhadir", label: "Ketidakhadiran (Afwezigheid)",
    judul: "PELAKSANAAN PENGURUSAN HARTA KEKAYAAN ORANG YANG DINYATAKAN TIDAK HADIR",
    umum: ["Berdasarkan Pasal 463 KUHPerdata, Balai Harta Peninggalan dapat diperintahkan oleh pengadilan untuk mengurus harta kekayaan dan mewakili kepentingan orang yang dinyatakan tidak hadir (afwezig)."],
    maksud: ["Melaksanakan tugas Balai Harta Peninggalan dalam pengurusan harta kekayaan dan kepentingan orang yang dinyatakan tidak hadir;"],
    dasar: ["Kitab Undang-Undang Hukum Perdata (KUHPerdata), khususnya Pasal 463;"] },
  { id: "takterurus", label: "Harta Peninggalan Tak Terurus (Onbeheerde Nalatenschap)",
    judul: "PELAKSANAAN PENGURUSAN HARTA PENINGGALAN TAK TERURUS",
    umum: ["Berdasarkan Pasal 1126 dan Pasal 1127 KUHPerdata, harta peninggalan yang tidak ada ahli warisnya atau yang ditolak oleh para ahli warisnya dianggap sebagai harta peninggalan tak terurus, dan Balai Harta Peninggalan demi hukum wajib mengurusnya."],
    maksud: ["Melaksanakan tugas Balai Harta Peninggalan dalam pengurusan harta peninggalan tak terurus;"],
    dasar: ["Kitab Undang-Undang Hukum Perdata (KUHPerdata), khususnya Pasal 1126 dan 1127;"] },
  { id: "pendampingan", label: "Pendampingan / Monitoring Perwalian dan Pengampuan",
    judul: "PELAKSANAAN PENDAMPINGAN DAN MONITORING PERWALIAN DAN PENGAMPUAN",
    umum: ["Balai Harta Peninggalan selaku wali pengawas dan pengampu pengawas berkewajiban mengawasi pengurusan diri dan harta kekayaan anak di bawah perwalian serta orang yang berada di bawah pengampuan, termasuk melalui pendampingan dan monitoring terhadap wali dan pengampu."],
    maksud: ["Melaksanakan pendampingan dan monitoring terhadap wali/pengampu dalam pengurusan diri dan harta kekayaan anak di bawah perwalian/orang di bawah pengampuan;"],
    dasar: ["Kitab Undang-Undang Hukum Perdata (KUHPerdata), khususnya Pasal 366, 370, 449, dan 452;"] },
  { id: "rapat", label: "Rapat Koordinasi",
    judul: "PELAKSANAAN RAPAT KOORDINASI PELAKSANAAN TUGAS DAN FUNGSI BALAI HARTA PENINGGALAN",
    umum: ["Pelaksanaan tugas dan fungsi Balai Harta Peninggalan memerlukan dukungan dan kesamaan pemahaman dengan instansi serta pemangku kepentingan terkait, sehingga perlu diselenggarakan rapat koordinasi."],
    maksud: ["Menyamakan pemahaman dan memperkuat kerja sama dengan instansi terkait dalam pelaksanaan tugas dan fungsi Balai Harta Peninggalan;"], dasar: [] },
  { id: "koordinasi", label: "Koordinasi / Konsultasi dengan Instansi",
    judul: "PELAKSANAAN KOORDINASI DAN KONSULTASI",
    umum: ["Dalam rangka pelaksanaan tugas dan fungsi Balai Harta Peninggalan Medan diperlukan koordinasi dan konsultasi dengan instansi terkait."],
    maksud: ["Melaksanakan koordinasi dan konsultasi dengan instansi terkait dalam rangka pelaksanaan tugas dan fungsi Balai Harta Peninggalan;"], dasar: [] },
  { id: "sosialisasi", label: "Sosialisasi Tugas dan Fungsi BHP",
    judul: "PELAKSANAAN SOSIALISASI TUGAS DAN FUNGSI BALAI HARTA PENINGGALAN",
    umum: ["Tugas dan fungsi Balai Harta Peninggalan belum dikenal luas oleh masyarakat, sehingga diperlukan sosialisasi kepada masyarakat dan pemangku kepentingan."],
    maksud: ["Menyebarluaskan informasi mengenai tugas dan fungsi Balai Harta Peninggalan kepada masyarakat dan pemangku kepentingan;"], dasar: [] },
  { id: "lainnya", label: "Kegiatan Lainnya", judul: "PELAKSANAAN KEGIATAN", umum: [], maksud: [], dasar: [] }
];

var KOP = {
  l1: "KEMENTERIAN HUKUM REPUBLIK INDONESIA", l2: "KANTOR WILAYAH SUMATERA UTARA", l3: "BALAI HARTA PENINGGALAN MEDAN",
  alamat: ["Jalan Listrik No. 10 Medan", "Telepon: (061) 451 7830, Faksimile: (061) 451 4328", "Laman: www.bhpmedan.kemenkum.go.id, Pos-el: bhp.medan@kemenkum.go.id"]
};

/* DIPA per tahun anggaran. Satu tahun memakai DIPA yang sama untuk semua surat dan laporan.
   Setiap awal tahun, tambahkan baris tahun baru di sini. Aplikasi memilih DIPA sesuai tahun
   tanggal kegiatan; bila tahunnya belum ada, dipakai DIPA tahun terakhir yang tercatat. */
var DIPA = {
  2026: { nomor: "SP DIPA-135.04.2.692042/2026", tanggal: "2025-12-01" }
};
