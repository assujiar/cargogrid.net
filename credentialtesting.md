# Kredensial Pengujian Sistem (System Testing Credentials)

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
