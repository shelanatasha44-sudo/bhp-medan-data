/**
 * ARTHERA LAW FIRM — Penerima upload berkas klien dari situs.
 *
 * Situs mengirim berkas ke web app ini, lalu berkas disimpan ke subfolder
 * A–E milik klien di Google Drive dengan nama yang seragam.
 * Unggahan ulang tidak menimpa: versi lama dipindah ke subfolder "_Arsip".
 *
 * Cara pasang: lihat apps-script/README.md
 */

// Folder Drive per klien. Kunci = Nomor PKS (huruf besar).
var CLIENTS = {
  '288/PKS-ART-TM/X/2026': {
    nama: 'Merek LYO MORE',
    email: 'arinmcwijayahutapea@gmail.com',
    folders: {
      A: '1xoXbi2Wah5L1FYMYYEltLWnabi8RhuaN', // A. Identitas
      B: '1ersvRK4glVw0FAkI0FNBW9Gi4t-N4KLt', // B. Data Usaha (NIB)
      C: '17jEbMpTfCW8w2zlA_7JLImTbDPdex4Uq', // C. Merek
      D: '1DEk5GhhyZf6wcYLlZze4-yv0eilPsez9', // D. Produk Kelas 3
      E: '10Bxphp6_xL25p1OTZB9iqE9dDODjrDWg'  // E. Tanda Tangan
    }
  }
};

// Berkas yang boleh diunggah: id di situs -> bagian dan nama berkas di Drive.
var DOCS = {
  doc_1:           { section: 'A', name: '01 KTP Pemohon' },
  doc_2:           { section: 'A', name: '02 NPWP' },
  doc_nib_file:    { section: 'B', name: 'NIB' },
  doc_9:           { section: 'C', name: '09 Logo Etiket Final' },
  doc_12:          { section: 'C', name: '12 Foto Produk dan Kemasan' },
  doc_katalog:     { section: 'D', name: 'Katalog Produk' },
  doc_15:          { section: 'E', name: '15 Surat Pernyataan dan Surat Kuasa' },
  doc_bukti_bayar: { section: 'E', name: '16 Bukti Transfer Pembayaran' }
};

var ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'];
var MAX_BYTES = 15 * 1024 * 1024;
var ARCHIVE_FOLDER = '_Arsip';

function doGet() {
  return json_({ ok: true, service: 'Arthera upload berkas klien' });
}

function doPost(e) {
  try {
    var req = JSON.parse(e.postData.contents);
    var check = validate_(req);
    if (check.error) return json_({ ok: false, error: check.error });

    var bytes = Utilities.base64Decode(req.dataBase64);
    if (bytes.length > MAX_BYTES) return json_({ ok: false, error: 'Ukuran berkas melebihi 15 MB.' });

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var folder = DriveApp.getFolderById(check.folderId);
      archiveOld_(folder, check.baseName);
      var fileName = check.baseName + '.' + check.ext;
      var file = folder.createFile(Utilities.newBlob(bytes, req.mimeType || 'application/octet-stream', fileName));
      file.setDescription('Diunggah klien lewat situs Arthera pada ' + new Date().toISOString() +
        ' · Nama asli: ' + String(req.fileName).slice(0, 200));
      return json_({ ok: true, fileName: fileName, section: check.section });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return json_({ ok: false, error: 'Gagal menyimpan berkas: ' + err.message });
  }
}

/** Memeriksa permintaan. Mengembalikan {error} atau {folderId, baseName, ext, section}. */
function validate_(req) {
  if (!req || typeof req !== 'object') return { error: 'Permintaan tidak valid.' };
  var client = CLIENTS[String(req.clientId || '').trim().toUpperCase()];
  if (!client) return { error: 'Folder Drive untuk klien ini belum disiapkan Admin Arthera.' };
  if (String(req.email || '').trim().toLowerCase() !== client.email) return { error: 'Email klien tidak sesuai.' };
  var doc = DOCS[req.docId];
  if (!doc) return { error: 'Jenis berkas tidak dikenal.' };
  var m = /\.([A-Za-z0-9]+)$/.exec(String(req.fileName || ''));
  var ext = m ? m[1].toLowerCase() : '';
  if (ALLOWED_EXT.indexOf(ext) === -1) return { error: 'Format berkas harus JPG, PNG, PDF, DOC, atau DOCX.' };
  if (!req.dataBase64) return { error: 'Isi berkas kosong.' };
  return { folderId: client.folders[doc.section], baseName: doc.name, ext: ext, section: doc.section };
}

/** Memindahkan versi lama berkas yang sama ke subfolder "_Arsip" dengan cap waktu. */
function archiveOld_(folder, baseName) {
  var files = folder.getFiles();
  var old = [];
  while (files.hasNext()) {
    var f = files.next();
    if (f.getName().replace(/\.[A-Za-z0-9]+$/, '') === baseName) old.push(f);
  }
  if (!old.length) return;
  var it = folder.getFoldersByName(ARCHIVE_FOLDER);
  var archive = it.hasNext() ? it.next() : folder.createFolder(ARCHIVE_FOLDER);
  var stamp = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH.mm.ss');
  old.forEach(function (f) {
    var n = f.getName();
    var dot = n.lastIndexOf('.');
    f.setName(n.slice(0, dot) + ' (diganti ' + stamp + ')' + n.slice(dot));
    f.moveTo(archive);
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
