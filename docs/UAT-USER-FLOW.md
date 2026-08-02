# Skema User Acceptance Testing (UAT) — UrClass

Dokumen ini adalah panduan pengujian manual dari sudut pandang pengguna/siswa. Fokusnya adalah alur penggunaan nyata dari awal sampai akhir, bukan pengujian API, unit test, atau detail teknis implementasi.

## 1. Tujuan dan ruang lingkup

Tujuan UAT adalah memastikan siswa dapat:

1. membuat akun, masuk, memilih kategori belajar, dan melengkapi profil;
2. memperoleh serta memakai tiket dengan saldo dan riwayat yang konsisten;
3. mendaftar tryout gratis maupun premium;
4. mengerjakan tryout tanpa kehilangan jawaban atau waktu;
5. melihat hasil, pembahasan, leaderboard, dan mengerjakan ulang;
6. membeli paket dan mengikuti kelas;
7. menggunakan aplikasi dengan aman dan nyaman di desktop maupun mobile.

Pengujian fitur admin tidak masuk cakupan utama. Admin hanya digunakan untuk menyiapkan data uji dan memeriksa dampak tindakan siswa bila diperlukan.

## 2. Prioritas dan status

| Prioritas | Arti |
|---|---|
| P0 | Alur utama atau transaksi uang; gagal berarti rilis ditahan. |
| P1 | Fitur penting; ada gangguan besar tetapi mungkin masih ada jalan lain. |
| P2 | Tampilan, kenyamanan, filter, atau kasus tambahan. |

Gunakan status `Belum dites`, `Lulus`, `Gagal`, atau `Terblokir`. Satu kasus hanya boleh diberi status `Lulus` jika hasil aktual sama dengan seluruh hasil yang diharapkan.

## 3. Lingkungan dan perangkat

Minimal lakukan pengujian pada:

| Perangkat | Lingkungan minimum |
|---|---|
| Desktop | Chrome versi stabil, lebar 1366 px atau lebih |
| Mobile | Chrome Android atau Safari iPhone, lebar 360–430 px |
| Pembayaran | Midtrans sandbox dengan metode berhasil, pending, gagal, dan kedaluwarsa |
| Zona waktu | Asia/Jakarta (WIB) |
| Jaringan | Normal dan satu percobaan jaringan terputus/lambat saat ujian |

Sebelum mulai, pastikan frontend, backend, database, penyimpanan gambar, Google OAuth (jika diuji), dan Midtrans sandbox aktif.

## 4. Data uji yang harus disiapkan

Jangan memakai satu akun untuk semua skenario karena status dan saldo dari tes sebelumnya dapat mengubah hasil.

### Akun

| Kode | Kondisi akun |
|---|---|
| U1 | Pengguna baru, email unik, profil dan kategori belum diisi |
| U2 | Pengguna lama dengan profil lengkap dan saldo 0 tiket |
| U3 | Pengguna dengan minimal 3 tiket dan belum pernah mengikuti tryout target |
| U4 | Pengguna yang sudah menyelesaikan tryout gratis |
| U5 | Pengguna yang sudah menyelesaikan tryout premium |
| U6 | Pengguna Google yang tidak mempunyai password lokal |

Data seed lokal menyediakan akun seperti `budi@siswa.test` dengan password `password123`, tetapi buat akun terpisah jika kasus memerlukan keadaan yang benar-benar bersih.

### Data bisnis

| Kode | Data yang diperlukan |
|---|---|
| TO-G | Tryout gratis, published, sedang berlangsung, minimal 2 subtest dan pembahasan tersedia |
| TO-P | Tryout premium, published, sedang berlangsung, minimal 2 subtest |
| TO-IRT | Tryout dengan IRT; tanggal selesai masih di masa depan |
| TO-F | Tryout yang periodenya sudah selesai |
| TO-U | Tryout yang belum mulai |
| PKG | Paket aktif dengan diskon dan jumlah tiket yang diketahui |
| CLS-P | Kelas aktif berbayar, memiliki bonus tiket dan tautan WA/Meet |
| CLS-G | Kelas aktif gratis |
| V-OK | Kode redeem tiket aktif dan masih memiliki kuota |
| V-USED | Kode yang sudah pernah dipakai oleh akun target |
| V-EXP | Kode tidak aktif atau kedaluwarsa |
| V-FULL | Kode dengan kuota habis |

Siapkan juga 2 gambar JPG/PNG/WebP di bawah 2 MB, 1 gambar di atas 2 MB, dan 1 berkas non-gambar untuk menguji bukti follow.

## 5. Urutan eksekusi yang disarankan

Jalankan pengujian dalam urutan berikut agar alurnya menyerupai perjalanan siswa:

```text
Registrasi → Login → Pilih kategori → Lengkapi profil
          → Jelajah dashboard
          → Redeem/beli tiket → cek saldo dan riwayat
          → Daftar tryout → kerjakan → hasil → review → leaderboard
          → Daftar kelas → akses kelas → logout/login ulang
```

Untuk satu putaran smoke test sebelum pengujian lengkap, jalankan kasus P0 berikut: `AUTH-01`, `AUTH-05`, `PRO-01`, `TKT-01`, `TO-05`, `EX-01`, `EX-03`, `EX-07`, `RES-01`, `PAY-04`, dan `CLS-03`.

## 6. Skenario pengujian

### A. Registrasi, login, kategori, dan sesi

| ID | Pri | Skenario dan langkah ringkas | Hasil yang diharapkan |
|---|---:|---|---|
| AUTH-01 | P0 | Buka Register, isi nama, email baru, password minimal 6 karakter, dan konfirmasi yang sama; tekan **Daftar**. | Registrasi berhasil, ada notifikasi sukses, lalu pengguna diarahkan ke Login. Akun dapat digunakan untuk masuk. |
| AUTH-02 | P1 | Coba kirim form kosong, email tidak valid, password kurang dari 6 karakter, dan konfirmasi berbeda. | Tiap kesalahan tampil dekat field terkait; form tidak dikirim dan data lain tidak hilang. |
| AUTH-03 | P1 | Daftar memakai email yang sudah terdaftar. | Registrasi ditolak dengan pesan yang mudah dipahami; tidak ada akun duplikat. |
| AUTH-04 | P1 | Gunakan tombol tampil/sembunyikan password pada Register dan Login. | Isi password berubah antara tersamarkan dan terlihat tanpa mengubah nilainya. |
| AUTH-05 | P0 | Login memakai email dan password yang benar. | Notifikasi sukses muncul; pengguna baru diarahkan ke pemilihan kategori, pengguna yang sudah memiliki kategori tidak terjebak di halaman tersebut. |
| AUTH-06 | P1 | Login dengan password salah atau email tidak terdaftar. | Login ditolak dengan pesan umum yang jelas; pengguna tetap di halaman Login. |
| AUTH-07 | P1 | Login akun Google menggunakan form password, lalu login melalui Google. | Form password menolak akun Google; login Google yang sah kembali ke aplikasi dan membuat sesi pengguna. |
| AUTH-08 | P0 | Sebagai user biasa, buka langsung URL `/dashboard/admin`; lalu tanpa login buka `/dashboard`. | User dialihkan ke dashboard siswa. Pengunjung tanpa sesi dialihkan ke Login dan tidak melihat data privat. |
| AUTH-09 | P1 | Login akun yang sama di perangkat kedua, kemudian gunakan kembali perangkat pertama. | Sesuai aturan single-device, sesi lama tidak lagi dapat memanggil data privat dan diminta login ulang tanpa layar rusak. |
| AUTH-10 | P0 | Logout dari menu akun, lalu gunakan tombol Back dan buka URL privat langsung. | Kembali ke halaman publik/Login; data akun sebelumnya tidak dapat diakses. |
| CAT-01 | P0 | Dengan U1 pilih kategori UTBK; ulangi memakai akun bersih dan pilih CPNS. | Pilihan tersimpan, pengguna masuk Dashboard, dan kategori tidak diminta berulang saat refresh/login ulang. |
| CAT-02 | P1 | Putuskan jaringan saat memilih kategori, lalu coba lagi setelah jaringan pulih. | Muncul pesan gagal, tidak terjadi perpindahan palsu, dan pilihan dapat dikirim ulang. |
| CAT-03 | P0 | Login sebagai akun UTBK, lalu periksa Dashboard, kartu informasi, katalog Tryout, detail tryout, dan daftar subtest. Ulangi sebagai akun CPNS. | Akun UTBK hanya melihat konteks UTBK/UM dan subtest UTBK. Akun CPNS melihat konteks SKD serta TWK/TIU/TKP dan hanya tryout CPNS. |
| CAT-04 | P0 | Sebagai akun UTBK, buka langsung URL tryout CPNS yang ID-nya diketahui dan coba daftar/mulai/redeem kode akses. Ulangi arah sebaliknya. | Seluruh akses silang ditolak oleh server dengan pesan kategori tidak sesuai; saldo, akses, dan sesi tryout tidak berubah. |
| CAT-05 | P1 | Dari Settings ganti kategori UTBK ke CPNS, lalu kembali ke UTBK; refresh dan login ulang setelah tiap perubahan. | Label kategori, Dashboard, katalog, dan subtest langsung mengikuti pilihan aktif. Riwayat kategori sebelumnya tetap tersimpan dan muncul kembali ketika kategori dikembalikan. |
| CAT-06 | P0 | Mulai sebuah tryout, jangan selesaikan, lalu coba ganti ke kategori lain dari Settings. | Perubahan ditolak sampai tryout aktif diselesaikan; kategori dan sesi yang sedang berjalan tetap konsisten. |
| CAT-07 | P1 | Sebagai admin buat/edit tryout UTBK dan CPNS, lalu coba memasangkan subtest dari jenis ujian yang berbeda. | Admin wajib menentukan jenis ujian. Kategori otomatis konsisten (UTBK/UM atau CPNS), dan subtest lintas jenis tidak dapat dipasangkan. |

### B. Profil, dashboard, dan navigasi

| ID | Pri | Skenario dan langkah ringkas | Hasil yang diharapkan |
|---|---:|---|---|
| PRO-01 | P0 | Sebagai pengguna baru, lengkapi nama, HP, jenjang/kelas, sekolah, gender, tanggal lahir, lokasi, target universitas, dan jurusan; simpan. | Profil tersimpan di server, dialog tertutup, dan data yang sama tampil setelah refresh serta login ulang. |
| PRO-02 | P1 | Coba data wajib kosong, HP kurang dari 10 digit, dan tanggal tidak valid. | Form menunjukkan field yang harus diperbaiki dan tidak menampilkan sukses sebelum server menerima data. |
| PRO-03 | P1 | Pilih SMA/SMK lalu Kelas 10/11/12; ganti ke Gap Year dan simpan. | Field kelas mengikuti pilihan, nilai lama tidak ikut tersimpan pada Gap Year, dan tampilan profil benar. |
| PRO-04 | P1 | Cari dan pilih asal sekolah melalui pencarian sekolah. | Hasil relevan dapat dipilih dengan mouse maupun keyboard dan pilihan tersimpan. |
| PRO-05 | P1 | Dari Settings pilih **Edit Profil**, ubah beberapa data, simpan, refresh. | Data baru tampil di Settings dan dashboard; email serta saldo tiket tidak berubah. |
| NAV-01 | P1 | Buka Beranda, Try Out, Kelas, Pembelian, Riwayat Tiket, Settings, dan Pusat Bantuan dari navigasi. | Halaman benar terbuka, menu aktif benar, tombol kembali bekerja, dan tidak ada halaman kosong/error. |
| NAV-02 | P2 | Uji Pusat Bantuan: pilih Batal lalu buka lagi dan pilih WhatsApp. | Batal menutup dialog; konfirmasi membuka nomor bantuan di tab/aplikasi baru dengan aman. |
| NAV-03 | P1 | Ulangi navigasi utama pada lebar mobile. | Menu dapat dibuka/ditutup, tidak ada konten terpotong horizontal, dan aksi utama tetap dapat dijangkau. |

### C. Tiket dan kode redeem

| ID | Pri | Skenario dan langkah ringkas | Hasil yang diharapkan |
|---|---:|---|---|
| TKT-01 | P0 | Catat saldo U2, redeem `V-OK`, lalu buka Riwayat Tiket. | Pesan sukses tampil; saldo bertambah tepat sebesar nilai voucher; ada satu log kredit bersumber Redeem Kode. |
| TKT-02 | P1 | Masukkan kode tidak dikenal, `V-USED`, `V-EXP`, dan `V-FULL`. | Masing-masing ditolak dengan alasan yang sesuai; saldo, kuota, dan riwayat tidak berubah. |
| TKT-03 | P0 | Klik submit dua kali cepat atau kirim redeem yang sama dari dua tab. | Voucher hanya terpakai sekali dan saldo hanya bertambah sekali. |
| TKT-04 | P1 | Gunakan pencarian, filter Masuk/Keluar, pengurutan, jumlah item, dan pagination pada Riwayat Tiket. | Daftar dan ringkasan konsisten; saldo saat ini tidak berubah karena filter. |

### D. Katalog dan pendaftaran tryout

| ID | Pri | Skenario dan langkah ringkas | Hasil yang diharapkan |
|---|---:|---|---|
| TO-01 | P1 | Cari tryout, gunakan filter Gratis/Premium/Terdaftar, kategori, urutan, dan pagination. | Hanya kartu yang sesuai tampil; mengganti filter mengembalikan halaman ke posisi valid; empty state jelas. |
| TO-02 | P1 | Buka detail `TO-G` dan `TO-P`. | Judul, jenis, kategori, total soal, total durasi, daftar subtest, serta jumlah peserta sesuai data admin. |
| TO-03 | P1 | Pada `TO-G`, unggah hanya 1 bukti, lebih dari 5, non-gambar, format tidak didukung, dan gambar lebih dari 2 MB. | Pendaftaran belum bisa dilanjutkan untuk kurang dari 2 bukti; input tidak valid ditolak dengan pesan dan preview tidak rusak. |
| TO-04 | P1 | Unggah 2–5 bukti valid, hapus salah satu preview, tambah kembali, lalu batalkan dialog. | Preview dan jumlah file selalu sesuai; batal tidak mendaftarkan pengguna atau menambah peserta. |
| TO-05 | P0 | Daftar `TO-G` dengan minimal 2 bukti valid. | Akses diberikan tanpa mengurangi tiket, peserta bertambah satu, status menjadi terdaftar, dan pengguna menuju halaman mulai. |
| TO-06 | P0 | Dengan saldo 0, coba daftar `TO-P`; ulangi dengan U3 yang memiliki tiket. | Saldo 0 tidak dapat mendaftar. U3 berhasil, tepat 1 tiket berkurang, muncul satu log debit, dan akses tryout diberikan. |
| TO-07 | P0 | Klik daftar dua kali cepat atau lakukan dari dua tab. | Hanya satu akses dibuat, tiket maksimal berkurang satu, dan jumlah peserta tidak ganda. |
| TO-08 | P1 | Coba mendaftar ulang tryout yang sudah dimiliki. | Sistem menolak atau menampilkan aksi mulai/lanjut; tidak ada tiket atau bukti tambahan yang diproses. |
| TO-09 | P1 | Periksa kartu `TO-U`, tryout aktif, dan `TO-F`; coba akses detail/mulai melalui UI dan URL langsung. | Label waktu mengikuti WIB. Aturan daftar/mulai yang disepakati produk berlaku konsisten pada UI dan URL langsung. |
| TO-10 | P1 | Redeem kode akses khusus tryout yang valid, lalu redeem ulang. | Tryout menjadi terdaftar tanpa perubahan tiket; pemakaian kedua ditolak dan kuota hanya berkurang sekali. |

> Keputusan produk yang harus dikunci sebelum menjalankan `TO-09`: apakah pengguna boleh mendaftar dan/atau mengerjakan di luar rentang `start_date`–`end_date`. UI, backend, dan teks status wajib memakai aturan yang sama.

### E. Memulai dan mengerjakan tryout

| ID | Pri | Skenario dan langkah ringkas | Hasil yang diharapkan |
|---|---:|---|---|
| EX-01 | P0 | Dari halaman mulai, baca ringkasan, coba mulai tanpa mencentang persetujuan, lalu centang dan konfirmasi mulai. | Tombol tidak aktif sebelum persetujuan; sesudah konfirmasi sesi dan subtest pertama dimulai dengan soal serta timer yang benar. |
| EX-02 | P1 | Pilih jawaban, pindah dengan tombol berikut/sebelumnya dan nomor soal, ubah jawaban, lalu kosongkan jawaban jika UI mendukung. | Penanda nomor soal sesuai; jawaban terakhir tersimpan dan pengosongan menghapus jawaban sebelumnya. |
| EX-03 | P0 | Jawab beberapa soal, refresh halaman atau tutup lalu buka lagi sebelum waktu habis. | Sesi dilanjutkan, jawaban tetap ada, subtest tidak dimulai ulang, dan timer mengikuti waktu server—bukan kembali ke durasi awal. |
| EX-04 | P0 | Putuskan jaringan, pilih jawaban, lalu pulihkan jaringan. | Pengguna mendapat informasi jika simpan gagal; aplikasi tidak mengklaim jawaban tersimpan. Jawaban dapat dikirim ulang tanpa duplikasi. |
| EX-05 | P1 | Tekan keluar dari ujian, batalkan dialog, lalu konfirmasi keluar dan kembali lagi. | Batal melanjutkan ujian. Keluar tidak menyelesaikan sesi; saat kembali, jawaban dan sisa waktu masih sesuai server. |
| EX-06 | P1 | Selesaikan subtest ketika masih ada jawaban kosong; batalkan dan lanjutkan, lalu konfirmasi selesai. | Dialog menyebut jumlah soal kosong; batal tidak menutup subtest; konfirmasi mengunci subtest dan menuju ringkasan berikutnya. |
| EX-07 | P0 | Biarkan timer subtest mencapai 00:00. | Auto-finish hanya terjadi sekali, jawaban terakhir yang sudah tersimpan tetap dihitung, dan pengguna menuju subtest berikut/penyelesaian tanpa macet. |
| EX-08 | P0 | Selesaikan subtest pertama, mulai subtest kedua, lalu selesaikan seluruh tryout. | Urutan dan durasi subtest benar; tiap subtest tidak dapat mengulang waktu; tryout berstatus selesai satu kali. |
| EX-09 | P1 | Bila randomisasi opsi aktif, refresh dalam attempt yang sama lalu kerjakan ulang sebagai attempt baru. | Urutan opsi stabil dalam sesi yang sama agar jawaban tidak berpindah; attempt baru boleh memiliki urutan berbeda dan penilaian tetap mengacu opsi yang benar. |
| EX-10 | P1 | Jika tersedia soal essay/rich text, isi teks terformat dan karakter khusus, simpan, refresh, lalu kosongkan. | Isi aman dan tetap terbaca; format penting tidak rusak; pengosongan tidak dihitung sebagai jawaban. |

### F. Hasil, pembahasan, leaderboard, dan pengerjaan ulang

| ID | Pri | Skenario dan langkah ringkas | Hasil yang diharapkan |
|---|---:|---|---|
| RES-01 | P0 | Selesaikan tryout non-IRT dengan kombinasi benar, salah, dan kosong; buka Hasil. | Total soal = benar + salah + kosong; jumlah terjawab benar; skor sederhana sesuai `(jawaban benar / total soal) × 1000`; attempt dan waktu sesuai. |
| RES-02 | P1 | Selesaikan `TO-IRT` sebelum tanggal berakhir, lalu periksa lagi setelah tanggal berakhir dengan peserta selesai tersedia. | Sebelum berakhir tampil status diproses tanpa skor palsu. Setelah berakhir skor IRT tersedia dan tanggal rilis memakai WIB. |
| RES-03 | P0 | Buka Review tryout premium yang selesai. | Tiap soal menampilkan jawaban pengguna, jawaban benar, status benar/salah/kosong, dan pembahasan; filter subtest/navigasi bekerja. |
| RES-04 | P0 | Buka Review `TO-G`; coba buka pembahasan dengan saldo 0 lalu dengan minimal 1 tiket. | Isi terkunci sebelum dibayar. Saldo 0 ditolak. Dengan tiket, tepat 1 tiket terpotong sekali dan seluruh pembahasan tryout terbuka permanen. |
| RES-05 | P1 | Klik buka pembahasan gratis berulang atau dari dua tab. | Tiket tidak terpotong lebih dari sekali dan status terbuka tetap konsisten setelah refresh/login ulang. |
| RES-06 | P1 | Buka Leaderboard setelah beberapa peserta menyelesaikan tryout. | Peringkat dan skor konsisten, data pribadi sensitif/bukti follow tidak terlihat oleh siswa, dan hanya attempt pertama menjadi dasar leaderboard. |
| RES-07 | P0 | Pilih **Kerjakan Ulang**, selesaikan attempt kedua, lalu buka hasil attempt pertama dan kedua dari Riwayat. | Attempt bertambah tepat satu; jawaban/skor tiap attempt terpisah; hasil lama tidak tertimpa; leaderboard tetap memakai attempt pertama. |
| RES-08 | P1 | Gunakan pencarian, filter status/nama, urutan skor/tanggal/attempt, dan pagination di Riwayat Tryout. | Hasil sesuai kontrol dan tautan menuju attempt yang dipilih, bukan selalu attempt terbaru. |

### G. Pembelian paket

| ID | Pri | Skenario dan langkah ringkas | Hasil yang diharapkan |
|---|---:|---|---|
| PAY-01 | P1 | Cari dan filter katalog paket; buka `PKG`. | Nama, thumbnail, harga asli, diskon, total bayar, deskripsi, dan jumlah tiket sama di kartu, detail, popup pembayaran, serta transaksi. |
| PAY-02 | P0 | Buka pembayaran lalu tutup popup sebelum membayar; buka lagi dalam kurang dari 15 menit. | Status tetap pending dan pembayaran lama dapat dilanjutkan; tidak tercipta banyak order aktif untuk paket yang sama. |
| PAY-03 | P1 | Biarkan order lebih dari 15 menit atau gunakan simulasi pembayaran expired/gagal. | Status berubah menjadi kedaluwarsa/gagal, tiket tidak bertambah, dan pengguna dapat membuat pembayaran baru. |
| PAY-04 | P0 | Bayar `PKG` dengan metode sandbox sukses. | Hanya satu order berhasil; saldo bertambah tepat sejumlah tiket paket; ada satu log kredit paket; riwayat dan session menampilkan saldo terbaru. |
| PAY-05 | P0 | Gunakan metode pending, tekan **Cek Status Pembayaran** sebelum dan sesudah settlement. | Sebelum settlement tetap pending tanpa tiket; setelah settlement berubah berhasil dan tiket masuk tepat sekali. |
| PAY-06 | P0 | Refresh/click cek status berulang atau biarkan callback dan verifikasi manual terjadi bersamaan. | Pemberian tiket idempotent: order diproses sekali dan saldo/log tidak ganda. |
| PAY-07 | P1 | Dari Riwayat Pembelian, lanjutkan order pending dan periksa order berhasil/gagal. | Label status, nominal, tanggal, paket, dan tombol **Lanjut Bayar** sesuai; tombol hanya ada saat masih dapat dilanjutkan. |

### H. Kelas

| ID | Pri | Skenario dan langkah ringkas | Hasil yang diharapkan |
|---|---:|---|---|
| CLS-01 | P1 | Buka katalog dan detail `CLS-P`; periksa harga, diskon, bonus tiket, dan deskripsi. | Informasi sama dengan data admin dan total bayar benar. |
| CLS-02 | P1 | Buka popup pembayaran kelas lalu tutup sebelum selesai. | Order dibatalkan dengan jelas, pengguna tidak terdaftar, dan tidak menerima bonus tiket. |
| CLS-03 | P0 | Bayar `CLS-P` sampai settlement. | Pengguna terdaftar tepat sekali, bonus tiket masuk tepat sekali, ada log kredit kelas, dan kelas tampil di **Kelas Saya**. |
| CLS-04 | P0 | Ulangi verifikasi/callback atau coba daftar `CLS-P` yang sudah dimiliki. | Tidak ada enrollment, pembayaran, bonus tiket, atau log yang ganda. |
| CLS-05 | P0 | Daftar `CLS-G`. | Sesuai ekspektasi kelas gratis, pengguna langsung terdaftar tanpa popup/charge Midtrans bernilai nol dan tanpa order berbayar. |
| CLS-06 | P1 | Dari Kelas Saya buka Grup WA, Konsultasi WA, dan Google Meet. | Tautan benar, terbuka di tab/aplikasi baru, dan hanya terlihat bagi peserta kelas. |

### I. Ketahanan, keamanan penggunaan, dan tampilan

| ID | Pri | Skenario dan langkah ringkas | Hasil yang diharapkan |
|---|---:|---|---|
| SAFE-01 | P0 | Ubah ID pada URL detail order, hasil, review, kelas, atau ujian menjadi milik pengguna lain. | Akses ditolak atau dialihkan; tidak ada data pengguna lain yang tampil. |
| SAFE-02 | P1 | Klik tombol transaksi/daftar/selesai berulang dengan cepat. | Tombol menunjukkan proses dan mencegah efek ganda; hasil akhir tetap satu transaksi/aksi. |
| SAFE-03 | P1 | Matikan backend atau buat respons lambat pada katalog, profil, redeem, pembayaran, dan hasil. | Ada loading/error yang jelas, halaman tidak blank, dan pengguna dapat mencoba lagi tanpa state palsu. |
| UI-01 | P1 | Jalankan alur utama pada desktop dan mobile dengan zoom 200% serta teks panjang. | Teks penting terbaca, dialog dapat di-scroll, tombol tidak tertutup, fokus keyboard terlihat, dan tidak ada scroll horizontal yang menghalangi. |
| UI-02 | P2 | Uji Back/Forward browser serta refresh pada katalog dengan filter, detail, riwayat, dan halaman hasil. | Tidak terjadi loop redirect atau halaman rusak; state penting tidak menyebabkan tindakan transaksi terulang otomatis. |
| UI-03 | P2 | Periksa seluruh tanggal, countdown, uang, pesan kosong, toast, serta istilah “Try Out/Tryout” dan “Subtes/Subtest”. | Nilai memakai format Indonesia/WIB dan istilah/pesan konsisten serta mudah dipahami siswa. |

## 7. Pemeriksaan silang data

Setelah kasus transaksi atau ujian, jangan hanya memeriksa toast. Cocokkan perubahan berikut:

| Aksi | Yang harus konsisten |
|---|---|
| Redeem tiket | Saldo header/session, Riwayat Tiket, kuota kode, jumlah redemption |
| Beli paket | Status order, nominal, saldo tiket, satu log kredit, riwayat pembelian |
| Daftar tryout premium | Akses tryout, saldo berkurang 1, satu log debit, jumlah peserta |
| Daftar tryout gratis | Akses tryout, 2–5 bukti tersimpan, saldo tetap, jumlah peserta |
| Selesai ujian | Status session, jawaban tersimpan, ringkasan, skor, riwayat attempt |
| Buka pembahasan gratis | Flag pembahasan, saldo berkurang 1, tidak terpotong lagi saat refresh |
| Beli kelas | Status order, enrollment, bonus tiket, satu log kredit, Kelas Saya |

## 8. Kriteria kelulusan rilis

Rilis dinyatakan lulus UAT jika:

- seluruh kasus P0 berstatus `Lulus`;
- tidak ada defect severity Critical atau High yang masih terbuka;
- minimal 95% kasus P1 lulus dan sisanya memiliki keputusan tertulis;
- saldo tiket, pembayaran, enrollment, jawaban, serta skor tidak pernah ganda atau hilang;
- alur utama lulus di desktop dan minimal satu perangkat mobile nyata.

Severity defect:

| Severity | Contoh |
|---|---|
| Critical | Pembayaran sukses tetapi akses/tiket hilang; saldo atau charge ganda; kebocoran data pengguna lain; jawaban ujian hilang massal. |
| High | Tidak bisa login, mendaftar tryout, menyelesaikan ujian, melihat hasil, atau melanjutkan pembayaran. |
| Medium | Filter salah, riwayat tidak sinkron tetapi data inti aman, tautan kelas tertentu gagal. |
| Low | Teks, alignment, warna, atau inkonsistensi istilah tanpa menghalangi tugas. |

## 9. Format pencatatan hasil

Salin tabel berikut untuk setiap putaran tes:

| Test ID | Tanggal | Tester | Perangkat/Browser | Data uji | Hasil aktual | Status | Defect ID | Bukti |
|---|---|---|---|---|---|---|---|---|
| EX-03 |  |  |  |  |  | Belum dites |  | screenshot/video |

Untuk defect, catat minimal:

```text
Judul       : [Test ID] ringkasan masalah
Environment : URL, build/commit, browser, perangkat
Akun/data   : kode akun dan data uji (jangan tulis password produksi)
Prasyarat   : kondisi sebelum masalah terjadi
Langkah     : langkah bernomor yang paling singkat untuk mereproduksi
Aktual      : apa yang terjadi
Ekspektasi  : apa yang seharusnya terjadi
Frekuensi   : selalu / kadang-kadang / sekali
Severity    : Critical / High / Medium / Low
Bukti       : screenshot, video, console/network bila tersedia
```

## 10. Risiko yang perlu diprioritaskan saat eksekusi

Ini adalah hipotesis berdasarkan alur aplikasi, bukan hasil tes. Validasi lebih awal agar kegagalan tidak baru ditemukan di akhir:

1. Konsistensi validasi profil antara browser dan server, terutama tanggal lahir, gender, serta target universitas/jurusan.
2. Pembatasan waktu tryout: status “akan datang/selesai” harus benar-benar membatasi aksi sesuai keputusan produk, termasuk melalui URL langsung.
3. Kelas harga Rp0 perlu jalur enrollment gratis dan tidak boleh dikirim sebagai transaksi Midtrans bernilai nol.
4. Penyelesaian tryout tidak boleh menampilkan sukses jika request finalisasi gagal; hasil harus berasal dari status server yang benar.
5. Verifikasi pembayaran, callback, double-click, dan dua tab harus idempotent agar tiket/kelas tidak diberikan dua kali.
6. Saat jaringan gagal pada ujian, pengguna perlu tahu apakah jawaban terakhir benar-benar sudah tersimpan.
