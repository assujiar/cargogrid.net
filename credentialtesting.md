# Kredensial Pengujian Sistem (System Testing Credentials)

Portal Admin CargoGrid tidak lagi memakai kredensial hardcoded di kode front-end.

## Akun Administrator Portal

Buat dan kelola akun admin melalui sistem autentikasi yang terhubung ke aplikasi, lalu login menggunakan email dan password akun tersebut. Jika password lupa, gunakan tombol reset password di halaman login portal admin.

## Konfigurasi Email

Informasi konfigurasi email operasional ditampilkan di tab **Pengaturan Email** pada Portal Admin. Kredensial asli tetap harus disimpan di konfigurasi environment server, bukan di browser.
Portal Admin CargoGrid sekarang memakai **Supabase Auth**. Kredensial tidak lagi disimpan atau divalidasi secara hardcoded di kode front-end.

## Akun Administrator Portal

Buat/kelola akun super admin langsung di Supabase Auth dashboard, lalu login menggunakan email dan password akun tersebut. Jika password lupa, gunakan tombol reset password di halaman login portal admin.

## SMTP / Backend Configuration

Konfigurasi SMTP harus didefinisikan sebagai environment variables server-side, bukan disimpan di browser:

* `SMTP_HOST`
* `SMTP_PORT`
* `SMTP_USER`
* `SMTP_PASS`
* `SMTP_FROM`
