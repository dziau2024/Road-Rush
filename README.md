# Road Rush — Hindari Mobil

Game browser sederhana menggunakan HTML, CSS, JavaScript, dan Phaser 3.

## Cara menjalankan
1. Ekstrak folder game.
2. Buka folder `Road_Rush_Web_Game` di VS Code.
3. Jalankan `index.html` menggunakan Live Server.

Game juga dapat dijalankan melalui server web statis seperti GitHub Pages atau itch.io.

## Kontrol
- **W**: bergerak ke atas
- **A**: bergerak ke kiri
- **S**: bergerak ke bawah
- **D**: bergerak ke kanan
- **Spasi**: mulai ulang setelah Game Over

## Isi folder
- `index.html`: halaman utama.
- `style.css`: tampilan halaman.
- `game.js`: logika permainan.
- `assets/`: tempat menyimpan aset tambahan jika nanti diperlukan.

## Teknologi
- HTML5
- CSS3
- JavaScript
- Phaser 3.80.1 (dimuat dari jsDelivr CDN)

## Catatan publikasi
Koneksi internet diperlukan saat game dimuat karena Phaser diambil dari CDN.
Untuk itch.io, unggah ZIP yang berisi `index.html`, `style.css`, `game.js`, dan folder `assets`.
Pastikan `index.html` berada langsung di akar ZIP, bukan di dalam folder pembungkus tambahan.
